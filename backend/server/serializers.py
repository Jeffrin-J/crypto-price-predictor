from rest_framework.response import Response
from rest_framework import serializers, status
from django.conf import settings
import requests

from server.models import Coins

class CoinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coins
        fields='__all__'

