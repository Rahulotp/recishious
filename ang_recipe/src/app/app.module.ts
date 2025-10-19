
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,HttpClient, HTTP_INTERCEPTORS } from  '@angular/common/http';
import { RecipeService } from './recipe.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecipeRegisterComponent } from './recipe-register/recipe-register.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { MainViewComponent } from './main-view/main-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewsHomeComponent } from './reviews-home/reviews-home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './contact/contact.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RecipeRegisterComponent,
    RecipeViewComponent,
    EditRecipeComponent,
    AdminHomeComponent,
    UserHomeComponent,
    MainViewComponent,
    ReviewsHomeComponent,
    ReviewsHomeComponent,
    NavbarComponent,
    FooterComponent,
    ProfileComponent,
    ContactComponent,

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,useClass: RecipeService,multi:true}
  ],  bootstrap: [AppComponent]
})
export class AppModule { }

