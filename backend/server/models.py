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
