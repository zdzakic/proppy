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
    owner_id = serializers.IntegerField()
    owner_email = serializers.EmailField()
    property_id = serializers.IntegerField()
    property_name = serializers.CharField()
    block_id = serializers.IntegerField()
    comment = serializers.CharField()


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

