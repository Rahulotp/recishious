import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html'
})
export class MainViewComponent implements OnInit {
  paginatedRecipes: any[] = [];
  searchText: string = '';
  sortBy: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    const params = {
      search: this.searchText,
      sortBy: this.sortBy,
      page: this.currentPage
    };

    this.recipeService.getApprovedRecipes(params).subscribe((res: any) => {
      this.paginatedRecipes = res.results;
      this.totalPages = Math.ceil(res.count / this.itemsPerPage);
    });
  }

  updateFilters(): void {
    this.currentPage = 1;
    this.fetchRecipes();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchRecipes();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRecipes();
    }
  }

  goToRecipe(id: number): void {
    this.router.navigate(['/user-home', id]);
  }

  goToComments(recipeId: number): void {
    this.router.navigate(['/reviews-home', recipeId]);
  }

  shareRecipe(recipe: any): void {
    const url = `${window.location.origin}/user-home/${recipe.id}`;
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: 'Check out this recipe!',
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch(console.error);
    }
  }

downloadRecipe(id: number) {
  this.recipeService.downloadRecipe(id).subscribe({
    next: (response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recipe_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download failed', err);
    }
  });
}

likeRecipe(id: number) {
  this.recipeService.likeRecipe(id).subscribe(
    (res: any) => {
      const recipe = this.paginatedRecipes.find(r => r.id === id);
      if (recipe) {
        recipe.likes = res.likes;
      }
    },
    (error) => {
      console.error('Like failed', error);
    }
  );
}

}
