from django.contrib import admin
from .models import *

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username',)

# @admin.register(Dialog)
# class DialogAdmin(admin.ModelAdmin):
#     list_display = ('user',)