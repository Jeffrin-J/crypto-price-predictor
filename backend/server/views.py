# from django.shortcuts import render
from server.models import Coins
from server.serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView, CreateAPIView
from pytwitter import Api

from django.conf import settings
from django.core import serializers
from django.contrib.auth import authenticate, login
import requests

from datetime import datetime
import pandas as pd
import csv
import json
from textblob import TextBlob

# Create your views here.



@api_view(['GET'])
def getCoinData(request):
    url = "https://coinranking1.p.rapidapi.com/coins"

    querystring = {"referenceCurrencyUuid":"yhjMzLPhuIDl","timePeriod":"5y","tiers[0]":"1","orderBy":"marketCap","orderDirection":"desc","limit":"50","offset":"0"}
    
    headers = {
        "X-RapidAPI-Key": settings.RAPID_API_KEY,
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    
    res = CoinSerializer(data=response.json()['data']['coins'], many=True)
    
    if res.is_valid():
        res.save()

        return Response({'message': 'Coin Data added'}, status.HTTP_201_CREATED)
    else:
        print(res.errors)
    
    return Response({'message': 'Coin Data invalid'}, status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getHistoricalData(request):
    

    coins = list(Coins.objects.values('symbol', 'uuid'))

    for coin in coins:
        url = f"https://coinranking1.p.rapidapi.com/coin/{coin['uuid']}/history"

        querystring = {"referenceCurrencyUuid":"yhjMzLPhuIDl","timePeriod":"5y"}

        headers = {
            "X-RapidAPI-Key": settings.RAPID_API_KEY,
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com"
        }

        response = requests.request("GET", url, headers=headers, params=querystring)

        data = response.json()
        data = data["data"]["history"]

        for i in range(len(data)):
            data[i]["coin"] = coin['symbol']
            data[i]["timestamp"] = datetime.fromtimestamp(data[i]["timestamp"])

        data = pd.DataFrame(data).to_dict(orient="list")
        

        with open("data.csv", "a") as outfile:
            writer = csv.writer(outfile)
            writer.writerows(zip(*data.values()))

    return Response(coins)

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

class GetTweets(ListCreateAPIView):

    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer

    def get(self, request, *args, **kwargs):
        data = Tweet.objects.all()
        ser = TweetSerializer(data, many=True)
        data = ser.data

        for i in range(len(data)):
            user = list(User.objects.filter(id=data[i]["author_id"]))[0]
            data[i]['name'] = user.name
            data[i]['id'] = str(data[i]['id'])

        return Response(data, status.HTTP_200_OK)

    def post(self, request):
        try:
            tweet = Tweet.objects.latest('id')
            id = tweet.id
        except:
            id = ''

        influencers = list(User.objects.values_list('username', flat=True))
        n = len(influencers)
        influencers = ['from:'+i for i in influencers]
        c = 0

        for influencer in influencers:
            query = f'https://api.twitter.com/2/tweets/search/recent?query=({influencer})&tweet.fields=author_id'
            if id != '':
                query += f'&since_id={id}'
        
            headers = {"Authorization": f"Bearer {settings.TWITTER_BEARER_TOKEN}"}
            btc = ['bitcoin', 'btc']
            eth = ['ethereum', 'eth']

            res = requests.get(query, headers=headers)
            # res2 = requests.get(query2, headers=headers)
            print(res.json())
            # print(res2.json())
            # return Response({'message': 'Coin Data invalid'}, status.HTTP_400_BAD_REQUEST)
            try:
                for tweet in res.json()['data']:
                    if any(sub.casefold() in tweet['text'].casefold() for sub in btc):
                        tweet['coin'] = 'BTC'
                    elif any(sub.casefold() in tweet['text'].casefold() for sub in eth):
                        tweet['coin'] = 'ETH'
                    else:
                        continue
                
                    serializer = TweetSerializer(data=tweet)
                    # serializer2 = TweetSerializer(data=res2.json()['data'], many=True)

                    if serializer.is_valid():
                        serializer.save()
                        # serializer2.save()
                        c += 1
            except:
                continue

        if c == n:    
            return Response({'message': 'Coin Data added'}, status.HTTP_201_CREATED)

        return Response({'message': 'Coin Data invalid'}, status.HTTP_400_BAD_REQUEST)

class RegisterUser(CreateAPIView):

    serializer_class = CreateUserSerializer


@api_view(['POST'])
def login(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(request, username=username, password=password)

    if user is not None:
        return Response({'message': 'Logged in', 'user': username}, status.HTTP_202_ACCEPTED)
    else:
        return Response({'message': 'Invalid credentials'}, status.HTTP_401_UNAUTHORIZED)

class AddComment(CreateAPIView):
    serializer_class = CommentSerializer

@api_view(['GET'])
def analyze_tweets(request):

    data = json.loads(serializers.serialize('json', Tweet.objects.all()))
    print(data[0])
    res = {}
    for tweet in data:
        blob = TextBlob(tweet['fields']['text'])
        for sentence in blob.sentences:
            if tweet['fields']['coin'] in res.keys():
                res[tweet['fields']['coin']]['sum'] += sentence.sentiment.polarity
                res[tweet['fields']['coin']]['cnt'] += 1
            else:
                res[tweet['fields']['coin']] = {'sum': sentence.sentiment.polarity, 'cnt': 1}

    return Response({'data': res}, status=status.HTTP_200_OK)
