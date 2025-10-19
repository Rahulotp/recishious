
import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  recipes: any[] = [];
  selectedRecipeReviews: any[] = [];
  showReviewsForId: number | null = null;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getAllRecipes().subscribe((data: any) => {
      console.log('Recipes from backend:', data);
      this.recipes = data;
    }, err => {
      console.error(err);
    });
  }

approveRecipe(id: number): void {
  this.recipeService.approveRecipe(id).subscribe({
    next: () => {
      alert('Recipe approved successfully!');
      this.router.navigate(['/main-view', id]);
    },
    error: err => {
      console.error('Error approving recipe:', err);
    }
  });
}

deleteRecipe(id: number): void {
  this.recipeService.adminDeleteRecipe(Number(id)).subscribe({
    next: () => {
      console.log('Recipe deleted successfully');
      this.loadRecipes();
    },
    error: (err) => {
      console.error('Error deleting recipe:', err);
    }
  });
}
  

  editRecipe(id: number) {
    this.router.navigate(['/edit-recipe', id]);
  }

}








