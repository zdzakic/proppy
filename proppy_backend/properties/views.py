from rest_framework import generics
from .models import Property, Owner
from .serializers import PropertySerializer, OwnerSerializer, OwnershipSerializer
from rest_framework.response import Response


class PropertyListAPIView(generics.ListAPIView):
    queryset = Property.objects.all().prefetch_related('owners')
    serializer_class = PropertySerializer


class OwnerListAPIView(generics.ListAPIView):
    queryset = Owner.objects.all().prefetch_related('properties')
    serializer_class = OwnerSerializer

class OwnershipListAPIView(generics.ListAPIView):
    def get(self, request):
        data = []

        for owner in Owner.objects.prefetch_related('properties'):
            for property in owner.properties.all():
                data.append({
                    "owner_id": owner.id,
                    "owner_name": owner.name,
                    "owner_email": owner.email,
                    "property_id": property.id,
                    "property_name": property.name,
                    "block_id": property.block_id,
                    "comment": property.comment
                })

        serializer = OwnershipSerializer(data, many=True)
        return Response(serializer.data)
