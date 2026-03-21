from rest_framework import serializers

def validate_password_match(password, password_confirm):
    """
    Validate that the password and password_confirm fields match.
    """
    if password != password_confirm:
        raise serializers.ValidationError({
            "password": "Passwords do not match."
        })

