"""
URL configuration for recipe_manage project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from recipeapp import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', views.Register.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='log'),
    path('home/', views.HomeView.as_view(), name='home'),
    path('add/', views.RecipeRegister.as_view(), name='add'),
    path('recipe/<int:id>/', views.RecipeView.as_view(),name='view'),
    path('update/<int:pk>/', views.UpdateRecipe.as_view()),
    path('delete/<int:pk>/', views.DeleteRecipe.as_view()),
    path('all-recipes/', views.AllRecipesView.as_view(), name='all_recipes'),
    path('approve/<int:id>/', views.ApproveRecipeView.as_view(), name='approve_recipe'),
    path('api/approved-recipes/', views.ApprovedRecipesAPIView.as_view(), name='approved-recipes'),
    path('recipes/user/approved/', views.UserApprovedRecipesAPIView.as_view(), name='user-approved-recipes'),
    path('recipe-detail/<int:pk>/', views.RecipeDetailWithReviews.as_view(), name='recipe-detail'),
    path('submit-review/', views.SubmitReview.as_view(), name='submit-review'),
    path('reviews-only/<int:pk>/', views.ReviewsForRecipeAPIView.as_view(), name='reviews-only'),
    path('recipes/<int:pk>/download/', views.RecipeDownloadView.as_view(), name='recipe-download'),
    path('approved-recipes/', views.MainViewApprovedRecipeList.as_view(), name='main-approved-recipes'),
    path('recipes/<int:pk>/like/', views.LikeRecipeView.as_view(), name='toggle-like'),
    path('admin-home/delete/<int:pk>/', views.AdminDeleteRecipe.as_view(), name='admin-delete-recipe'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('upload-profile-image/', views.UploadProfileImageView.as_view(), name='upload-profile-image'),
    path('user/recipes/', views.ProfileRecipesView.as_view(),name='ProfileRecipesView'),
    path('contact/', views.ContactEmailView.as_view(), name='contact-email'),
    
    ]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
