from django.contrib.auth.views import LoginView
from django.urls import path, include
from rest_framework import routers
from .views import *
from assistify.views import UserViewSet
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
# router.register(r'dialog', DialogViewSet)
urlpatterns = [
path('api/signin/', LoginAPIView.as_view(), name='signin'),
path('api/signup/', RegistrationAPIView.as_view(), name='signup'),
path('api/logout/', LogoutAPIView.as_view(), name='logout'),
# path('api/chat/', chat, name='chat'),
    path('api/token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),

]