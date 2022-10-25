# from django.shortcuts import render
from server.models import Coins
from server.serializers import CoinSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveAPIView

from django.conf import settings
import requests

# Create your views here.



@api_view(['GET'])
def getCoinData(request):
    url = "https://coinranking1.p.rapidapi.com/coins"

    querystring = {"referenceCurrencyUuid":"yhjMzLPhuIDl","timePeriod":"24h","tiers[0]":"1","orderBy":"marketCap","orderDirection":"desc","limit":"50","offset":"0"}
    
    headers = {
        "X-RapidAPI-Key": settings.RAPID_API_KEY,
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    print(response.json()['data'])
    res = CoinSerializer(data=response.json()['data']['coins'], many=True)
    print(res.is_valid(), res.errors)
    if res.is_valid():
        res.save()

    return Response({'message': 'Coin Data added'}, status.HTTP_201_CREATED)
    

@api_view(['GET'])
def retrieveCoinData(req):
    data = list(Coins.objects.values('rank', 'price', 'change', 'name', 'iconUrl'))
    data = [{'key':item['rank'], 'name_list': [item['name'], item['iconUrl'], item['rank']], **item} for item in data]
    filters = []

    for item in data:
        filters.append({'value': item['name'], 'text': item['name']})

    return Response({'dict':data, 'filters':filters})

class GetCoinData(RetrieveAPIView):

    serializer_class = CoinSerializer
    queryset = Coins.objects.all()
    
@api_view(['GET'])
def getOHLCData(request, uuid=None):

    url = f"https://coinranking1.p.rapidapi.com/coin/{uuid}/ohlc"

    querystring = {"referenceCurrencyUuid":"yhjMzLPhuIDl","interval":"month"}

    headers = {
        "X-RapidAPI-Key": "ff52a77810msh0b34ce67fb2de25p16ed19jsnfd5ac105f5ec",
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    # print(response.json())
    data = response.json()['data']['ohlc']

    res = []

    for point in data:
        res.append({'x': point['startingAt'], 'y': [float(point['open']), float(point['high']), float(point['low']), float(point['close'])]})


    return Response(res)
    