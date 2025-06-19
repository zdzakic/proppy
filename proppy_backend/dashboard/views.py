from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsOwnerOrAdmin
from properties.models import Property, Ownership, Company, Block
from django.contrib.auth import get_user_model
from django.db.models import Count

User = get_user_model()

class OwnerSummaryAPIView(APIView):
    """
    Returns summary metrics for owner's dashboard.
    Admins see all properties, owners see only their own.
    
    Structure is modular and follows best practices:
    - Admin and owner logic is separated into methods
    - Clear and testable
    - Extendable with new roles if needed
    """

    permission_classes = [IsOwnerOrAdmin]

    def get(self, request):
        user = request.user

        if user.is_superuser or getattr(user, 'role', '') == 'admin':
            data = self.get_admin_summary()
        else:
            data = self.get_owner_summary(user)

        return Response(data)

    def get_admin_summary(self):
        return {
            "owner_name": "Admin",
            "total_properties": Property.objects.count(),
            "companies_count": Company.objects.count(),
            "blocks_count": Block.objects.count(),
            "owners_count": User.objects.filter(role='owner').count()
        }

    def get_owner_summary(self, user):
        # All ownership records for this user
        ownerships = Ownership.objects.select_related('property__company', 'property__block').filter(user=user)

        # Unique company and block IDs the user is associated with
        owned_company_ids = ownerships.values_list('property__company', flat=True).distinct()
        owned_block_ids = ownerships.values_list('property__block', flat=True).distinct()

        return {
            "owner_name": user.first_name or user.email,
            "total_properties": ownerships.values('property').distinct().count(),
            "companies_count": Company.objects.filter(id__in=owned_company_ids).count(),
            "blocks_count": Block.objects.filter(id__in=owned_block_ids).count(),
        }
