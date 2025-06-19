from django.urls import path
from .views import  OwnershipListAPIView, PropertyListAPIView

urlpatterns = [
    path('', PropertyListAPIView.as_view(), name='property-list'),
    # path('owners/', OwnerListAPIView.as_view(), name='owner-list'),
    path('ownerships/', OwnershipListAPIView.as_view(), name='ownership-list'),
]
