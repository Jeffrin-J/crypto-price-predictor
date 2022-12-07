from django.contrib import admin

from server.models import *


# Register your models here.

class CoinsAdmin(admin.ModelAdmin):
    list_display = ('rank', 'name', 'price',)

class TwitterUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'name',)

class TweetAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'author_id')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'comment', 'author_id', 'tweet_id', 'timestamp')

admin.site.register(Coins, CoinsAdmin)
admin.site.register(User, TwitterUserAdmin)
admin.site.register(Tweet, TweetAdmin)
admin.site.register(Comment, CommentAdmin)