import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  recipeId: number = 0;
  recipe: any;
  reviews: any[] = [];
  reviewForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private router: Router 
  ) {
    this.reviewForm = this.fb.group({
      rating: [''],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.recipeId = +this.route.snapshot.paramMap.get('id')!;
    this.getRecipeDetailsWithReviews();
  }

getRecipeDetailsWithReviews() {
  this.recipeService.getRecipeDetailWithReviews(this.recipeId).subscribe({
    next: (res: any) => {
      this.recipe = res; 
    },
    error: (err) => {
      console.error("Error loading recipe details:", err);
    }
  });
}

submitReview() {
  const payload = {
    recipe_id: this.recipeId,
    ratings: this.reviewForm.value.rating,
    comments: this.reviewForm.value.comment
  };

  console.log("Submitting review payload:", payload);

  this.recipeService.submitReview(payload).subscribe({
    next: () => {
      alert("Review submitted!");
      this.reviewForm.reset();
      this.router.navigate(['/reviews-home', this.recipeId]);
    },
    error: (err) => {
      console.error("Review submit failed", err);
      alert("Failed to submit review.");
    }
  });
}
}
