import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { RecipeRegisterComponent } from './recipe-register/recipe-register.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { MainViewComponent } from './main-view/main-view.component';
import { ReviewsHomeComponent } from './reviews-home/reviews-home.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'log',component:LoginComponent},
  {path:'main-view/recipe-reg',component:RecipeRegisterComponent},
  {path:'recipe-view/:id',component:RecipeViewComponent},
  {path:'edit-recipe/:id',component:EditRecipeComponent},
  {path:'admin-home',component:AdminHomeComponent},
  {path:'user-home/:id',component:UserHomeComponent},
  {path:'main-view',component:MainViewComponent},
  {path:'reviews-home/:id',component:ReviewsHomeComponent},
  {path:'profile',component:ProfileComponent},
  {path:'recipe/:id',component:RecipeViewComponent},
  {path:'contact',component:ContactComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {



 }
