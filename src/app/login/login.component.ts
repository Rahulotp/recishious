import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  
  constructor(
    private http: HttpClient,
    public recipeService: RecipeService,
    private router: Router
  ) {}

login(data: any) {
  this.http.post<LoginResponse>('http://127.0.0.1:8000/login/', data).subscribe(
    (response) => {
      console.log('Login successful', response);

      const token = response.token;
      const userId = response.user_id;
      const username = response.username; 
      const isAdmin = response.is_superuser;

      if (token) {
        this.recipeService.login(token, userId, username);   
        localStorage.setItem('is_admin', isAdmin.toString()); 

        alert('Login Success!');

        if (isAdmin) {
          this.router.navigate(['/admin-home']);
        } else {
          this.router.navigate(['/main-view']);
        }
      } else {
        console.error('Token not received', response);
      }
    },
    (error) => {
      alert("Login failed! Try signing up if you don't have an account.");
      console.error('Login failed', error);
    }
  );
}
}

export interface LoginResponse {
  token: string;
  user_id: number;
  username: string;  
  is_superuser: boolean;
}
