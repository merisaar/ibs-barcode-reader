import os
from django.http import HttpResponse
from django.http.response import HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound
import requests
from django.views.generic.edit import View
from food_information.models import FoodEntry
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core import serializers
import json
from django.forms.models import model_to_dict


def getTextFromWordToWord(firstWord, lastWord, textToFindIn, includeWords=True):
    textToFindIn = textToFindIn.replace("<b>", "").replace("</b>", "")
    firstIndex = textToFindIn.find(firstWord)
    if(firstIndex == -1):
        print(firstWord + " not found.")
        return ""
    if(includeWords):
        textFromFirstWord = textToFindIn[firstIndex:]
    else:
        textFromFirstWord = textToFindIn[(firstIndex + len(firstWord)):]
    lastIndex = textFromFirstWord.find(lastWord)
    if(includeWords):
        return textFromFirstWord[:(lastIndex+len(lastWord))]
    return textFromFirstWord[:lastIndex].strip()


def save_foodentry(ean, name, ingredients, allergens):
    food_entry = FoodEntry.objects.create(ean=ean)
    food_entry.name = name
    food_entry.ingredients = ingredients
    food_entry.allergens = allergens
    food_entry.save()
    return food_entry


class CleanDataBase(View):
    def get(self, request):
        try:
            FoodEntry.objects.filter(
                ingredients="").delete()
            return HttpResponse()
        except:
            return HttpResponseBadRequest("Bad request.")

    # def post(self, request):
    #     try:
    #         FoodEntry.objects.all().delete()
    #         return HttpResponse()
    #     except:
    #         return HttpResponseBadRequest("Bad request.")


class FoodEntryListView(View):
    def get(self, request):
        try:
            all_food_details = list(FoodEntry.objects.all().values())
            print(all_food_details)
            return HttpResponse(JsonResponse(all_food_details, safe=False), content_type='application/json')
        except:
            return HttpResponseBadRequest("Bad request.")

    # @csrf_exempt
    def post(self, request):
        request_body = json.loads(request.body)
        ean = request_body["ean"]
        print(ean)
        try:
            FoodEntry.objects.get(pk=str(ean))
            return HttpResponseForbidden("Entry with " + str(ean) + " already exists.")
        except FoodEntry.DoesNotExist:
            food_details = save_foodentry(
                ean,
                request_body["name"],
                request_body["ingredients"],
                request_body["allergens"])
            return HttpResponse(food_details)


class FoodEntryDetailView(View):
    def get(self, request, ean_parameter):
        try:
            food_detail = model_to_dict(
                FoodEntry.objects.get(pk=str(ean_parameter)))
            print(food_detail)
            return HttpResponse(json.dumps(food_detail), content_type='application/json')
        except FoodEntry.DoesNotExist:
            try:
                response = requests.get(
                    "https://www.foodie.fi/entry/"+ean_parameter)
                html_response = response.text
            except Exception as e:
                return HttpResponseBadRequest("Bad request. Failed to connect to" + "https://www.foodie.fi/entry/"+ean_parameter)
            ingredients_html = getTextFromWordToWord(
                "Tuotekuvaus", "Valmistusmaa", html_response)
            ingredients = getTextFromWordToWord(
                "<p id=\"product-ingredients\">", "</p>", ingredients_html, False)
            includes_allergens = getTextFromWordToWord("<td>", "</td>", getTextFromWordToWord(
                "Sisältää</td>", "</tr>", ingredients_html, False), False)
            name = getTextFromWordToWord(
                "id=\"product-name\">", "</h1>", html_response, False)
            if(ingredients == ""):
                return HttpResponseNotFound("Ingredients not found.")
            food_detail = model_to_dict(save_foodentry(
                ean_parameter, name, ingredients, includes_allergens))
            return HttpResponse(json.dumps(food_detail), content_type='application/json')
