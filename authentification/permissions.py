from rest_framework import permissions


class IsStaff(permissions.BasePermission):
    message = 'Vous ne faites pas parti du staff.'

    def has_permission(self, request, view):
        return request.user.is_staff


class IsAdmin(permissions.BasePermission):
    message = 'Vous n\'avez pas les droit d\'admin.'

    def has_permission(self, request, view):
        return request.user.is_admin
