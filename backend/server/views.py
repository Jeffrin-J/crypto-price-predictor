# from django.shortcuts import render
from server.models import Coins
from server.serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from pytwitter import Api

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
    
    res = CoinSerializer(data=response.json()['data']['coins'], many=True)
    
    if res.is_valid():
        res.save()

        return Response({'message': 'Coin Data added'}, status.HTTP_201_CREATED)
    
    return Response({'message': 'Coin Data invalid'}, status.HTTP_400_BAD_REQUEST)
    

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
        "X-RapidAPI-Key": settings.RAPID_API_KEY,
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    
    data = response.json()['data']['ohlc']

    res = []

    for point in data:
        res.append({'x': point['startingAt'], 'y': [float(point['open']), float(point['high']), float(point['low']), float(point['close'])]})


    return Response(res)

api = Api(bearer_token=settings.TWITTER_BEARER_TOKEN)

@api_view(['GET'])
def get_twitter_users(request):
    influencers = ['elonmusk', 'VitalikButerin', 'adam3us', 'aantonop',
    'WhalePanda', 'CamiRusso', 'AltCoinSara', 'cz_binance', 'TimDraper',
    'girlgone_crypto', 'SBF_FTX', 'SatoshiLite', 'rogerkver', 'saylor',
    'Natbrunell', 'BitBoy_Crypto', 'thebrianjung', 'Excellion', 'ethereumJoseph',
    'RAFAELA_RIGO_', 'brockpierce', 'SheldonEvans', 'LayahHeilpern', 'Nicholas_Merten',
    'bgarlinghouse', 'CryptoWendyO', 'Matt_Hougan', 'justinsuntron', 'CryptoCred', 'ErikVoorhees']

    res = api.get_users(usernames=','.join(influencers))
    
    serializer = UserSerializer(res.data, many=True)

    serializer = UserSerializer(data=serializer.data, many=True)
    
    if serializer.is_valid():
        serializer.save()

        return Response({'message': 'Twitter users added'}, status.HTTP_201_CREATED)

    return Response({'message': 'Invalid data for Twitter users'}, status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_tweets(request):
    print(api.get_tweets(["1261326399320715264","1278347468690915330"],expansions="author_id",tweet_fields=["created_at"], user_fields=["username","verified"]))
    return Response()

class GetTweets(CreateAPIView):


    def post(self, request):
        try:
            tweet = Tweet.objects.latest('id')
            id = tweet.id
        except:
            id = ''

        influencers = list(User.objects.values_list('username', flat=True))
        influencers = ['from:'+i for i in influencers]
        inf1, inf2 = influencers[:len(influencers)//2], influencers[len(influencers)//2:]
        q1 = '('+' OR '.join(inf1)+')'
        q2 = '('+' OR '.join(inf2)+')'
        
        query1 = f'https://api.twitter.com/2/tweets/search/recent?query={q1}&tweet.fields=author_id'
        query2 = f'https://api.twitter.com/2/tweets/search/recent?query={q2}&tweet.fields=author_id'
        if id is not '':
            query1 += f'&since_id={id}'
            query2 += f'&since_id={id}'
        headers = {"Authorization": f"Bearer {settings.TWITTER_BEARER_TOKEN}"}

        res1 = requests.get(query1, headers=headers)
        res2 = requests.get(query2, headers=headers)

        print(res1.json(), res2.json())

        serializer1 = TweetSerializer(data=res1.json()['data'], many=True)
        serializer2 = TweetSerializer(data=res2.json()['data'], many=True)

        if serializer1.is_valid() and serializer2.is_valid():
            serializer1.save()
            serializer2.save()

            return Response({'message': 'Coin Data added'}, status.HTTP_201_CREATED)

        return Response({'message': 'Coin Data invalid'}, status.HTTP_400_BAD_REQUEST)
    