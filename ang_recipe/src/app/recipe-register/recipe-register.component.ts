import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-register',
  templateUrl: './recipe-register.component.html'
})
export class RecipeRegisterComponent {
  selectedFile: File | null = null;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  registerRecipe(form: any): void {
    const formData = new FormData();

    Object.keys(form.value).forEach(key => {
      formData.append(key, form.value[key]);
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.recipeService.registerRecipe(formData).subscribe({
      next: (res: any) => {
        const recipeId = res.id;
        if (recipeId) {
          this.router.navigate(['/recipe-view', recipeId]);
        } else {
          alert('Recipe created, but no ID returned.');
        }
      },
      error: err => {
        alert('Error creating recipe');
        console.error(err);
      }
    });
  }


}
