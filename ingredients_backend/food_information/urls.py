from django.urls import path

from food_information.views import FoodEntryListView, FoodEntryDetailView, CleanDataBase

urlpatterns = [
    path('', FoodEntryListView.as_view()),
    path('<str:ean_parameter>/', FoodEntryDetailView.as_view()),
    path('cleanDB', CleanDataBase.as_view()),
]
