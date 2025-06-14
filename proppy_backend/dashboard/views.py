from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class Table1View(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = [
            {"id": 1, "name": "Item A", "value": 100},
            {"id": 2, "name": "Item B", "value": 200},
        ]
        return Response(data)

class Table2View(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = [
            {"id": 1, "product": "X", "amount": 300},
            {"id": 2, "product": "Y", "amount": 400},
        ]
        return Response(data)

class Table3View(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = [
            {"id": 1, "tenant": "John", "paid": True},
            {"id": 2, "tenant": "Anna", "paid": False},
        ]
        return Response(data)
