from django.urls import path
from .views import Table1View, Table2View, Table3View

urlpatterns = [
    path('table1/', Table1View.as_view()),
    path('table2/', Table2View.as_view()),
    path('table3/', Table3View.as_view()),
]
