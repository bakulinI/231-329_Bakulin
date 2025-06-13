from rest_framework import serializers
from assistify.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password']


class GetTokenSerializer(serializers.Serializer):
    username = serializers.CharField(label='Username', required=True)
    password = serializers.CharField(label='Password', required=True)


class UserListSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "role",
            "email",
            "password",
        ]


# class DialogSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Dialog
#         fields = [
#             "user",
#             "settings"
#         ]