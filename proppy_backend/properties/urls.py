from django.urls import path
# from .views import  OwnershipListAPIView, PropertyListAPIView, OwnerListAPIView, CompanyRegistrationView
from .views import (
    BlockListAPIView,
    BlockCreateAPIView,
    BlockDeleteAPIView,
    PropertyListAPIView,
    PropertyCreateAPIView,
    PropertyUpdateAPIView,
    PropertyDestroyAPIView,
)

urlpatterns = [
    path('blocks/', BlockListAPIView.as_view(), name='block-list'),
    path('blocks/create/', BlockCreateAPIView.as_view(), name='block-create'),
    path('blocks/<int:pk>/delete/', BlockDeleteAPIView.as_view(), name='block-delete'),
    path(
        'blocks/<int:block_id>/properties/create/',
        PropertyCreateAPIView.as_view(),
        name='property-create',
    ),
    path(
        'blocks/<int:block_id>/properties/<int:pk>/delete/',
        PropertyDestroyAPIView.as_view(),
        name='property-delete',
    ),
    path(
        'blocks/<int:block_id>/properties/<int:pk>/',
        PropertyUpdateAPIView.as_view(),
        name='property-update',
    ),
    path(
        'blocks/<int:block_id>/properties/',
        PropertyListAPIView.as_view(),
        name='property-list',
    ),
]

# urlpatterns = [
#     path('', PropertyListAPIView.as_view(), name='property-list'),
#     # path('owners/', OwnerListAPIView.as_view(), name='owner-list'),
#     # path('ownerships/', OwnershipListAPIView.as_view(), name='ownership-list'),
#     # path('register-company/', CompanyRegistrationView.as_view(), name='company-registration'),
# ]
