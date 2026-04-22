from django.urls import path
from .views import (
    BlockListCreateAPIView,
    BlockRetrieveUpdateDestroyAPIView,
    PropertyListAPIView,
    PropertyCreateAPIView,
    PropertyUpdateAPIView,
    PropertyDestroyAPIView,
    PropertyOwnerListAPIView,
    PropertyOwnerCreateAPIView,
    PropertyOwnerRetrieveAPIView,
    PropertyOwnerUpdateAPIView,
    PropertyOwnerDestroyAPIView, 
    AddCompanyView,
    PropertyGlobalListAPIView,
)


urlpatterns = [
    path('blocks/', BlockListCreateAPIView.as_view(), name='block-list'),
    path('blocks/<int:pk>/', BlockRetrieveUpdateDestroyAPIView.as_view(), name='block-detail'),
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
    path(
        "properties/all/",
        PropertyGlobalListAPIView.as_view(),
        name="property-global-list",
    ),
    path(
        'companies/create/',
        AddCompanyView.as_view(),
        name='add-company',
    ),
]
