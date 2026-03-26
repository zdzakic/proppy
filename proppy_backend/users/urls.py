# users/urls.py
from django.urls import path
from .views import CurrentUserView,RegisterCompanyView

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current_user"),
    path("register-company/", RegisterCompanyView.as_view(), name="register-company"),
]