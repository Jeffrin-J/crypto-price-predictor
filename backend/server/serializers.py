from rest_framework import serializers

from server.models import *

class CoinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coins
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = '__all__'
