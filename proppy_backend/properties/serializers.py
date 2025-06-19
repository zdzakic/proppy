# serializers.py
from rest_framework import serializers
from .models import Property, Ownership, Block, Company
from users.models import User

class OwnershipSerializer(serializers.Serializer):
    """
    Serializer for representing ownership relationships in a flat structure.

    This is a manual serializer (not ModelSerializer) because it pulls fields 
    from multiple related models: `User` (owner) and `Property`. It is used for
    aggregated read-only API views (e.g. list of ownerships).
    """
    owner_id = serializers.IntegerField(source='user.id')
    owner_email = serializers.EmailField(source='user.email')
    owner_name = serializers.SerializerMethodField()

    property_id = serializers.IntegerField(source='property.id')
    property_name = serializers.CharField(source='property.name')
    block_id = serializers.IntegerField(source='property.block.id', default=None)
    block_name = serializers.CharField(source='property.block.name', default=None)
    company_name = serializers.CharField(source='property.company.name', default=None)
    comment = serializers.CharField(source='property.comment')

    def get_owner_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()    


class PropertySerializer(serializers.ModelSerializer):
    """
    Serializer for the Property model including extra read-only fields.

    Adds `block_name` and `company_name` for convenience in frontend displays,
    avoiding extra queries on the client side. Uses `source` to access related
    fields through foreign keys.
    """
    block_name = serializers.CharField(source='block.name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'name', 'comment', 'block', 'block_name', 'company', 'company_name']


class OwnerListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SerializerMethodField()
    email = serializers.EmailField()
    properties = serializers.SerializerMethodField()

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_properties(self, obj):
        return [
            {
                "id": ownership.property.id,
                "name": ownership.property.name
            }
            for ownership in obj.ownerships.all()
        ]