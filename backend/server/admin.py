from django.contrib import admin

from server.models import Coins

# Register your models here.

class CoinsAdmin(admin.ModelAdmin):
    list_display = ('rank', 'name', 'price',)
    

admin.site.register(Coins, CoinsAdmin)