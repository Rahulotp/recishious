from django.db import models
from django.conf import settings


# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone=models.BigIntegerField(null=True,blank=True)

class Recipe(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # <--- this line
    title = models.CharField(max_length=300)
    cuisine = models.CharField(max_length=300)
    category = models.CharField(max_length=300)
    ingredients = models.TextField()
    instructions = models.TextField()
    total_time = models.IntegerField(help_text="total time in minutes")
    image = models.ImageField(upload_to = 'recipe_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    is_approved = models.BooleanField(default=False)

     
class Reviews(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    recipe= models.ForeignKey(Recipe,on_delete=models.CASCADE)
    ratings = models.IntegerField()
    comments = models.TextField(max_length=455)



class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='like')  
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')  


class ProfileUser(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.BigIntegerField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        return self.user.username