from django.db import models

# Create your models here.

class Coins(models.Model):
    symbol = models.CharField(max_length=30)
    uuid = models.CharField(max_length=30)
    name = models.CharField(max_length=30)
    marketCap = models.FloatField()
    price = models.FloatField()
    listedAt = models.BigIntegerField()
    tier = models.IntegerField()
    rank = models.IntegerField(primary_key=True)
    change = models.FloatField()
    iconUrl = models.URLField()

    class Meta:
        db_table = 'Coin'
        verbose_name_plural = 'Coins'

class User(models.Model):

    id = models.PositiveBigIntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=60)

class Tweet(models.Model):

    id = models.PositiveBigIntegerField(primary_key=True)
    author_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField()