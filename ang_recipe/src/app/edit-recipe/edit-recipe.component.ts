import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html'
})
export class EditRecipeComponent implements OnInit {
  recipe: any = {};
  id: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const idNumber = parseInt(this.id, 10);
      this.recipeService.getRecipeById(idNumber).subscribe({
        next: (data) => {
          this.recipe = data;
        },
        error: (err) => {
          console.error('Error fetching recipe:', err);
        }
      });
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  updateRecipe(): void {
    if (!this.id) return;

    const formData = new FormData();
    formData.append('title', this.recipe.title);
    formData.append('cuisine', this.recipe.cuisine);
    formData.append('category', this.recipe.category);
    formData.append('ingredients', this.recipe.ingredients);
    formData.append('instructions', this.recipe.instructions);
    formData.append('total_time', this.recipe.total_time);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const idNumber = parseInt(this.id, 10);
    this.recipeService.updateRecipe(idNumber, formData).subscribe({
      next: (res) => {
        console.log('Recipe updated successfully:', res);
        alert('Recipe updated successfully!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error updating recipe:', err);
        alert('Failed to update recipe.');
      }
    });
  }
}
