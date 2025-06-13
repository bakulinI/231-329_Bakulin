from django.conf import settings
from django.contrib.auth import authenticate, logout
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import AllowAny
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import CustomUserSerializer, UserListSerializer, GetTokenSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from .get_message import stream_chat_completion
from django.http import StreamingHttpResponse
class RegistrationAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Регистрация пользователя. Устанавливает cookie httpOnly с refresh токеном.",
        responses={200: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'access_token': openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
            400: "Bad request"},
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Имя пользователя. Уникальное поле.'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email пользователя. Уникальное поле.'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Пароль пользователя'),
            },
        ),
    )
    def post(self, request):
        username = request.data['username']
        email = request.data['email']
        password = request.data['password']

        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Пользователь с таким именем пользователя уже существует'},
                            status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Пользователь с таким email уже существует'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.create_user(username=username, email=email, password=password)
            user.save()
            response = Response()
            refresh = RefreshToken.for_user(user)
            refresh.payload.update({
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            })

            response.set_cookie(
                key=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'],
                value=str(refresh),
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                samesite="None",
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            )
            response.data = {
                'access_token': str(refresh.access_token),
            }
            response.status = status.HTTP_200_OK
            return response
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = GetTokenSerializer

    @swagger_auto_schema(
        operation_description="Авторизация пользователя. Устанавливает cookie httpOnly с refresh токеном.",
        responses={200: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'access_token': openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
            400: "Bad request",
        },
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Имя пользователя. Уникальное поле.'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Пароль пользователя'),
            },
        ),
    )
    def post(self, request):

        data = request.data
        response = Response()
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        if username is None or password is None:
            return Response({'error': 'Отсутствует имя пользователя или пароль'},

                            status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'error': 'Неверное имя пользователя или пароль'},

                            status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        response.set_cookie(
            key=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'],
            value=str(refresh),
            expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
            samesite="None",
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        )

        refresh.payload.update({
            'user_id': user.id,
            'username': user.username,
            'email': user.email

        })
        response.data = {
            'access_token': str(refresh.access_token),

        }
        response.status = status.HTTP_200_OK
        return response


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Выход из аккаунта. Для выхода необходимо, чтобы в Cookie был refresh_token",
        responses={200: "Logged out and blacklisted token",
                   400: "Bad request",
                   },

    )
    def post(self, request):
        try:
            try:
                refresh = RefreshToken(request.COOKIES.get(settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME']))
                refresh.blacklist()
                logout(request)
            except KeyError:
                return Response(
                    {"error": "Provide refresh_token in data"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            response = Response({'message': 'Logged out and blacklisted token'}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')

            return response
        except TokenError:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @swagger_auto_schema(

        responses={200: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'access_token': openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
            400: "Bad request",
        },
        operation_description="Для обновления токена доступа, необходимо, чтобы в Cookie был refresh_token. Данный метод новый access_token."
    )
    def get(self, request, format=None):
        response = Response()

        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'])

        if refresh_token is None:
            return Response({'message': 'Refresh token отсутствует.'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken(refresh_token)
        data = {"access_token": str(refresh.access_token)}

        refresh.set_jti()
        refresh.set_exp()
        refresh.set_iat()

        data["refresh"] = str(refresh)

        response.set_cookie(
            key=settings.SIMPLE_JWT['REFRESH_TOKEN_COOKIE_NAME'],
            value=data["refresh"],
            expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
            samesite="None",
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        )
        response.data = {
            'access_token': str(refresh.access_token),

        }
        response.status = status.HTTP_200_OK
        return response


class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserListSerializer

    @action(methods=["GET"], detail=False)
    def me(self, request, **kwargs):

        user = request.user
        return Response(UserListSerializer(user).data)