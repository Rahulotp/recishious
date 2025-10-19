from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser,IsAuthenticatedOrReadOnly,AllowAny
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.http import Http404,HttpResponse,FileResponse
from django.shortcuts import get_object_or_404
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

from .models import Recipe, Reviews,ProfileUser
from .serializers import (Regserializer,
                          RecipeSerializer,
                          ReviewSerializer,
                          RecipeWithReviewsSerializer,
                          ReviewWithUserSerializer,
                          UserProfileSerializer,
                          ChangePasswordSerializer,
                          RecipeListSerializer,
                          )

# -------------------- User Registration --------------------
class Register(APIView):
    def post(self, request):
        serializer = Regserializer(data=request.data)
        if serializer.is_valid():
            account = serializer.save()
            token, _ = Token.objects.get_or_create(user=account)
            return Response({
                'response': 'registered',
                'username': account.username,
                'email': account.email,
                'token': token.key
            })
        return Response(serializer.errors)

# -------------------- Login --------------------
class LoginView(APIView):
    def post(self, request):
        user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'is_superuser': user.is_superuser
            })
        return Response({'error': 'Invalid Credentials'}, status=401)

# -------------------- Welcome Home --------------------
class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Welcome to RECISHIOUS!!!!!!!!!",
            "username": request.user.username,
            "email": request.user.email
        })

# -------------------- Recipe Registration --------------------
class RecipeRegister(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RecipeSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid():
            recipe = serializer.save()
            return Response(RecipeSerializer(recipe).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----- View Recipe -----
class RecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        recipe = get_object_or_404(Recipe, id=id)
        if recipe.is_approved or recipe.user == request.user:
            serializer = RecipeSerializer(recipe)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

# ----- Update Recipe -----
class UpdateRecipe(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({'detail': 'No Recipe matches the given query.'}, status=404)

        # Check if user is owner or superuser
        if recipe.user != request.user and not request.user.is_superuser:
            return Response({'detail': 'Not authorized'}, status=403)

        serializer = RecipeSerializer(recipe, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# ----- Delete Recipe -----
class DeleteRecipe(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        recipe = get_object_or_404(Recipe, pk=pk, user=request.user)
        recipe.delete()
        return Response({'status': 'recipe_deleted'}, status=status.HTTP_204_NO_CONTENT)

# -------------------- All Recipes (Admin or Debugging) --------------------
class AllRecipesView(APIView):
    def get(self, request):
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

# -------------------- Approve Recipe (Admin only) --------------------

from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

class ApproveRecipeView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, id):
        recipe = get_object_or_404(Recipe, id=id)
        recipe.is_approved = True
        recipe.save()

        user = recipe.user  # make sure this exists
        if not user or not user.email:
            return Response({"error": "User or email not found"}, status=400)

        subject = "🎉 Your Recipe Has Been Approved!"
        message = (
            f"Hi {user.username},\n\n"
            f"Your recipe '{recipe.title}' has been approved and is now live on Recishious!\n"
            # f"You can view it here: http://127.0.0.1:4200/recipe-view/{recipe.id}\n\n"
            f"Thank you for sharing your recipe!\n\n"
            f"— Recishious Team"
        )

        try:
            send_mail(subject,message,settings.DEFAULT_FROM_EMAIL,[user.email],fail_silently=False,)  # show real error in console if something breaks            
            print(f"✅ Email sent successfully to {user.email}")
        except Exception as e:
            print(f"❌ Email sending failed: {e}")
            return Response({"error": str(e)}, status=500)

        return Response({"message": "Recipe approved and email sent successfully!"})
    
#-----approved recipes----------

class ApprovedRecipesAPIView(APIView):
    def get(self, request):
        recipes = Recipe.objects.filter(is_approved=True)
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

class UserApprovedRecipesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recipes = Recipe.objects.filter(user=request.user, is_approved=True)
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

#-------recipedetails and views ----------

class RecipeDetailWithReviews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(id=pk, is_approved=True)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=404)

        serializer = RecipeWithReviewsSerializer(recipe)
        return Response(serializer.data)

#------review submit-----------

class SubmitReview(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # now safe, user comes from context
            return Response({'message': 'Review submitted successfully'})
        return Response(serializer.errors, status=400)

class ReviewsForRecipeAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(id=pk, is_approved=True)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=404)

        reviews = Reviews.objects.filter(recipe=recipe)
        serializer = ReviewWithUserSerializer(reviews, many=True)
        return Response(serializer.data)
    
#-----------delete option for admin------

@method_decorator(csrf_exempt, name='dispatch')
class AdminDeleteRecipe(APIView):
    def delete(self, request, pk):
        if not request.user.is_authenticated or not request.user.is_superuser:
            return Response({'error': 'Only superusers can perform this action'}, status=status.HTTP_403_FORBIDDEN)

        recipe = get_object_or_404(Recipe, pk=pk)
        recipe.delete()
        return Response({'status': 'deleted_by_superuser'}, status=status.HTTP_204_NO_CONTENT)

#--------------- downloads------------------

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from io import BytesIO
import requests
import textwrap

class RecipeDownloadView(View):
    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            raise Http404("Recipe not found")

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        y = height - 50  

        def draw_wrapped(text, start_x, y, font_size=10, max_width=90):
            """Wrap text and draw line by line."""
            p.setFont("Helvetica", font_size)
            lines = textwrap.wrap(text, width=max_width)
            for line in lines:
                p.drawString(start_x, y, line)
                y -= 15
                if y < 50:
                    p.showPage()
                    y = height - 50
            return y

        # Title
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, y, f"{recipe.title}")
        y -= 25

        p.setFont("Helvetica", 12)
        y = draw_wrapped(f"Creator: {recipe.user.username}", 50, y)
        y = draw_wrapped(f"Time: {recipe.total_time} mins", 50, y)
        y = draw_wrapped(f"Cuisine: {recipe.cuisine}", 50, y)
        y = draw_wrapped(f"Category: {recipe.category}", 50, y)

        # Image 
        if recipe.image:
            try:
                image_url = request.build_absolute_uri(recipe.image.url)
                img_response = requests.get(image_url)
                img_response.raise_for_status()
                img_data = BytesIO(img_response.content)
                p.drawImage(ImageReader(img_data), 50, y - 170, width=200, height=150)
                y -= 180
            except Exception as e:
                y = draw_wrapped("Image failed to load.", 50, y)

        # Ingredients
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, "Ingredients:")
        y -= 20
        for line in recipe.ingredients.splitlines():
            y = draw_wrapped(line, 60, y)

        # Instructions
        y -= 10
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, "Instructions:")
        y -= 20
        for line in recipe.instructions.splitlines():
            y = draw_wrapped(line, 60, y)

        p.showPage()
        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf', headers={
            'Content-Disposition': f'attachment; filename="{recipe.title}.pdf"'
        })

#------main page --------

from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Q
from .models import Recipe, Like
from rest_framework.permissions import AllowAny

class MainViewApprovedRecipeList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        search = request.GET.get('search', '')
        sort_by = request.GET.get('sortBy', '')
        page = request.GET.get('page', 1)

        queryset = Recipe.objects.filter(is_approved=True)

        # Search
        if search:
            queryset = queryset.filter(title__icontains=search)

        # Sorting
        if sort_by == 'title':
            queryset = queryset.order_by('title')
        elif sort_by == 'time':
            queryset = queryset.order_by('time')
        elif sort_by == 'views':
            queryset = queryset.order_by('-views')

        # Annotate likes count
        queryset = queryset.annotate(likes=Count('like'))

        # Paginate
        paginator = PageNumberPagination()
        paginator.page_size = 6
        result_page = paginator.paginate_queryset(queryset, request)

        # Serialize
        serialized = RecipeSerializer(result_page, many=True, context={'request': request})

        # Add likes manually
        data = serialized.data
        for recipe_obj, recipe_data in zip(result_page, data):
            recipe_data['likes'] = recipe_obj.likes

        return paginator.get_paginated_response(data)



class LikeRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({'error': 'Recipe not found'}, status=404)

        like, created = Like.objects.get_or_create(user=user, recipe=recipe)

        if not created:
            like.delete()
            message = 'Unliked'
        else:
            message = 'Liked'

        like_count = Like.objects.filter(recipe=recipe).count()
        return Response({'likes': like_count, 'message': message})

#--------profile-------

from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView, UpdateAPIView

from django.contrib.auth import update_session_auth_hash

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserProfileSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully"}, status=200)
        return Response(serializer.errors, status=400)

#-----------change password-------

from rest_framework.parsers import JSONParser

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def put(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect.'}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({'success': 'Password changed successfully.'}, status=200)
    
            
class UserRecipesView(ListAPIView):
    serializer_class = RecipeListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)
    

class UploadProfileImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        user = request.user
        image = request.FILES.get("profile_image")

        if not image:
            return Response({"error": "No image provided"}, status=400)
        profile, _ = ProfileUser.objects.get_or_create(user=user)
        profile.profile_image = image
        profile.save()

        return Response({"message": "Profile image updated successfully"}, status=200)

class ProfileRecipesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recipes = Recipe.objects.filter(user=request.user)
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

#----------contact-------

class ContactEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')

        if not (name and email and subject and message):
            return Response({"error": "All fields are required"}, status=400)
        try:
            full_message = f"From: {name} <{email}>\n\n{message}"
            send_mail(subject=f"[Contact] {subject}",message=full_message,from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],fail_silently=False,)
            return Response({"message": "Your message has been sent successfully!"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)