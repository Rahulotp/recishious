import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {
  recipe: any;
  id: number | null = null;
  isOwner: boolean = false;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = localStorage.getItem('userId'); 

    if (this.id) {
      this.recipeService.getRecipeById(this.id).subscribe({
        next: (res: any) => {
          this.recipe = res;

          if (this.recipe?.user && this.userId) {
            this.isOwner = Number(this.recipe.user) === Number(this.userId);
          }
        },
        error: (err) => {
          console.error('Error loading recipe:', err);

          if (err.status === 403) {
            alert('You are not authorized to view this recipe.');
          } else {
            alert('Failed to load recipe details.');
          }

          this.router.navigate(['/profile']);
        }
      });
    }
  }

  goToEdit(): void {
    if (this.id) {
      this.router.navigate(['/edit-recipe', this.id]);
    }
  }

  deleteRecipe(): void {
    if (this.id && confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.id).subscribe({
        next: () => {
          alert('Recipe deleted successfully!');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error deleting recipe:', err);
          alert('Failed to delete recipe.');
        }
      });
    }
  }
}
