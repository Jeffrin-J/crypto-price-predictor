"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from server.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/getCoins/', getCoinData),
    path('api/retrieveCoinsData/', retrieveCoinData),
    path('api/getHistData/', getHistoricalData),
    path('api/getCoinData/<pk>/', GetCoinData.as_view()),
    path('api/getOHLCData/<str:uuid>/', getOHLCData),
    path('api/getTwitterUsers/', get_twitter_users),
    path('api/getTweets/', GetTweets.as_view()),
    path('api/registerUser/', RegisterUser.as_view()),
    path('api/login/', login),
    path('api/addComment/', AddComment.as_view()),
    path('api/analyzeTweets/', analyze_tweets)
]
