from django.db import models
import json


class FoodEntry(models.Model):
    ean = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    ingredients = models.CharField(max_length=500)
    allergens = models.CharField(max_length=200)

    def __str__(self):
        return self.ean
