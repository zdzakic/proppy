from rest_framework import serializers
from .models import Owner, Property

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['id', 'name', 'block_id', 'comment']


class OwnerSerializer(serializers.ModelSerializer):
    properties = PropertySerializer(many=True, read_only=True)

    class Meta:
        model = Owner
        fields = ['id', 'name', 'email', 'phone', 'date_left', 'comments', 'properties']


class OwnershipSerializer(serializers.Serializer):
    owner_id = serializers.IntegerField()
    owner_name = serializers.CharField()
    owner_email = serializers.EmailField()
    property_id = serializers.IntegerField()
    property_name = serializers.CharField()
    block_id = serializers.IntegerField()
    comment = serializers.CharField()
