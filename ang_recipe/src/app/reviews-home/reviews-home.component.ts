import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-reviews-home',
  templateUrl: './reviews-home.component.html',
  styleUrls: ['./reviews-home.component.css']
})
export class ReviewsHomeComponent implements OnInit {
  reviews: any[] = [];
  recipeId!: number;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.recipeId = +this.route.snapshot.paramMap.get('id')!;
    this.loadReviews();
  }

  loadReviews() {
    this.recipeService.getReviewsOnly(this.recipeId).subscribe({
      next: (res: any) => {
        this.reviews = res;
      },
      error: (err) => {
        console.error("Error loading reviews:", err);
      }
    });
  }
}
