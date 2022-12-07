from rest_framework import serializers, status
from rest_framework.response import Response
from django.contrib.auth.models import User as DefaultUser
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

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = ['email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = DefaultUser(email=validated_data['email'], username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['comment']

    def create(self, validated_data):
        data = self.context['request'].data
        tweet = Tweet.objects.get(id=data['tweet_id'])
        author = DefaultUser.objects.get(username=data['author_id'])

        newComment = Comment.objects.create(**validated_data)
        newComment.tweet_id = tweet
        newComment.author_id = author

        newComment.save()

        if newComment:
            return newComment

        return Response({'message': 'Server error'}, status.HTTP_503_SERVICE_UNAVAILABLE)


