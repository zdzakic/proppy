from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsOwnerOrAdmin

class OwnerSummaryAPIView(APIView):
    """
    Returns summary metrics for owner's dashboard.
    This includes total properties, rent collected, and pending maintenance.
    """

    permission_classes = [IsOwnerOrAdmin]

    def get(self, request):
        # 🔧 In real case, you'd filter by user: request.user
        return Response({
            "total_properties": 12,
            "total_rent": 8410,
            "pending_maintenance": 3
        })


