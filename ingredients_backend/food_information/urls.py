from django.urls import path

from food_information.views import FoodEntryListView, FoodEntryDetailView

urlpatterns = [
    path('', FoodEntryListView.as_view()),
    path('<str:ean_parameter>/', FoodEntryDetailView.as_view()),
]
