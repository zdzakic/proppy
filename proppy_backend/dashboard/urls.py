from django.urls import path
from .views import OwnerSummaryAPIView, TenantSummaryAPIView

urlpatterns = [
    path('owner/summary/', OwnerSummaryAPIView.as_view(), name='owner-summary'),
    path('tenant/summary/', TenantSummaryAPIView.as_view(), name='tenant-summary'),
]