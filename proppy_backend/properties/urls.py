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
    PropertyOwnerListAPIView,
    PropertyOwnerCreateAPIView,
    PropertyOwnerRetrieveAPIView,
    PropertyOwnerUpdateAPIView,
    PropertyOwnerDestroyAPIView, )


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
    path(
        'blocks/<int:block_id>/properties/<int:property_id>/owners/',
        PropertyOwnerListAPIView.as_view(),
        name='property-owner-list',
    ),
    path(
        'blocks/<int:block_id>/properties/<int:property_id>/owners/create/',
        PropertyOwnerCreateAPIView.as_view(),
        name='property-owner-create',
    ),
    path(
        'blocks/<int:block_id>/properties/<int:property_id>/owners/<int:pk>/',
        PropertyOwnerRetrieveAPIView.as_view(),
        name='property-owner-detail',
    ),
    path(
        'blocks/<int:block_id>/properties/<int:property_id>/owners/<int:pk>/update/',
        PropertyOwnerUpdateAPIView.as_view(),
        name='property-owner-update',
    ),
    path(
        'blocks/<int:block_id>/properties/<int:property_id>/owners/<int:pk>/delete/',
        PropertyOwnerDestroyAPIView.as_view(),
        name='property-owner-delete',
    ),
]
