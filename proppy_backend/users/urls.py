# users/urls.py
from django.urls import path
from .views import CurrentUserView,RegisterCompanyView, \
    PasswordResetConfirmView,DeleteCompanyView, CompanyListView, UpdateCompanyView, \
    PasswordResetRequestView

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current_user"),
    path("register-company/", RegisterCompanyView.as_view(), name="register-company"),
    path(
        "password-reset/",
        PasswordResetRequestView.as_view(),
        name="password-reset",
    ),
    path(
        "password-reset-confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    path(
        "companies/<int:company_id>/delete/",
        DeleteCompanyView.as_view(),
        name="company-delete",
    ),  
    path(
        "companies/",
        CompanyListView.as_view(),
        name="company-list",
    ),
    path(
        "companies/<int:company_id>/update/",
        UpdateCompanyView.as_view(),
        name="company-update",
    ),
]   

