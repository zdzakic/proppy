from django.urls import path
# from .views import  OwnershipListAPIView, PropertyListAPIView, OwnerListAPIView, CompanyRegistrationView
from .views import BlockListAPIView, BlockCreateAPIView

urlpatterns = [
    path('blocks/', BlockListAPIView.as_view(), name='block-list'),
    path('blocks/create/', BlockCreateAPIView.as_view(), name='block-create'),
]

# urlpatterns = [
#     path('', PropertyListAPIView.as_view(), name='property-list'),
#     # path('owners/', OwnerListAPIView.as_view(), name='owner-list'),
#     # path('ownerships/', OwnershipListAPIView.as_view(), name='ownership-list'),
#     # path('register-company/', CompanyRegistrationView.as_view(), name='company-registration'),
# ]
