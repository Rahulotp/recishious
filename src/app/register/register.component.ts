import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private recipeService: RecipeService,private router:Router){}
  register(data:any){
    console.log(data);
    this.recipeService.signup(data).subscribe(
      (res:any) => {
        console.log(res,"@@@@@@")
        if (res['response'] == "registered"){ 
          alert('succesfully')
          this.router.navigate(['log'])
        }
        else{
          alert('alredy exists')
        }
      }
    )
  }
}

