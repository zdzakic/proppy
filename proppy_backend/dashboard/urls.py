from django.urls import path
from .views import OwnerSummaryAPIView

urlpatterns = [
    path('owner/summary/', OwnerSummaryAPIView.as_view(), name='owner-summary'),
]