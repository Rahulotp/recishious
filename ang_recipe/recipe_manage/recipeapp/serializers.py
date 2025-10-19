from rest_framework import serializers
from .models import User, Recipe, Reviews,ProfileUser

class Regserializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def save(self, **kwargs):
        user = User(email=self.validated_data['email'],username=self.validated_data['username'],
                    first_name=self.validated_data['first_name'],last_name=self.validated_data['last_name'],
                    phone=self.validated_data['phone'])
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    recipe_id = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.all(), source='recipe'
    )

    class Meta:
        model = Reviews
        fields = ['id', 'ratings', 'comments', 'recipe_id', 'username']
    def create(self, validated_data):
        user = self.context['request'].user
        return Reviews.objects.create(user=user, **validated_data)


class RecipeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)  

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ['is_approved', 'user', 'created_at']

    def create(self, validated_data):
        user = self.context['user']
        return Recipe.objects.create(user=user, **validated_data)

from django.contrib.auth import get_user_model
User = get_user_model()

class ReviewWithUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Reviews
        fields = ['id', 'ratings', 'comments', 'username']

from django.db.models import Avg
class RecipeWithReviewsSerializer(serializers.ModelSerializer):
    reviews = ReviewWithUserSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = '__all__'

    def get_average_rating(self, obj):
            obj.reviews_set.aggregate(avg=Avg('ratings'))

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, ProfileUser, Recipe

class UserProfileSerializer(serializers.ModelSerializer):
    total_recipes = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(source='profileuser.profile_image', allow_null=True, required=False)

    class Meta:
        model = User
        fields = ["username", "email", "phone", "total_recipes", "profile_image"]

    def get_total_recipes(self, obj):
        return Recipe.objects.filter(user=obj).count()

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profileuser', {})
        profile_image = profile_data.get('profile_image') or validated_data.get('profile_image')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        profile, _ = ProfileUser.objects.get_or_create(user=instance)
        if profile_image:
            profile.profile_image = profile_image
            profile.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "Passwords do not match"})
        validate_password(data['new_password'])
        return data
    
class RecipeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ["id", "title", "image"]
