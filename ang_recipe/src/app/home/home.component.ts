import { Component  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    isDarkMode = false;
    toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
  
  userName: string = '';
  email: string='';

    constructor(private http: HttpClient,
      public userService: RecipeService,
      private router: Router){}
    ngOnInit(): void {
      this.http.get<any>('http://127.0.0.1:8000/home/').subscribe(
        response => {
          this.userName = response.username;
          this.email = response.email;
      },
      error => {
        console.error('Error fetching user details;',error)
      }
  );
}
    logout()
    {
      this.userService.logout();
      this.router.navigate(['']);
    }
}
