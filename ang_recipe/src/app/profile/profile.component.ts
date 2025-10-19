import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any = {};
  userRecipes: any[] = [];
  updateData: any = {};
  passwordData = { old_password: '', new_password: '', confirm_password: '' };
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  showUpdateForm = false;
  showPasswordForm = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadUserRecipes();
  }

  loadProfile(): void {
    this.recipeService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.previewUrl = null;
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  loadUserRecipes(): void {
    this.recipeService.getUserRecipes().subscribe({
      next: (data) => {
        console.log('User recipes loaded:', data);
        this.userRecipes = Array.isArray(data) ? data : data.recipes || [];
      },
      error: (err) => console.error('Error loading user recipes:', err)
    });
  }

  toggleSection(section: string): void {
    this.showUpdateForm = section === 'update' ? !this.showUpdateForm : false;
    this.showPasswordForm = section === 'password' ? !this.showPasswordForm : false;
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.previewUrl = e.target.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getProfileImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/img/default-profile.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/${imagePath}`;
  }

  updateProfile(): void {
    const formData = new FormData();

    if (this.updateData.username) formData.append('username', this.updateData.username);
    if (this.updateData.email) formData.append('email', this.updateData.email);
    if (this.updateData.phone) formData.append('phone', this.updateData.phone);
    if (this.selectedFile) formData.append('profile_image', this.selectedFile);

    this.recipeService.uploadProfileImage(formData).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.loadProfile();
        this.loadUserRecipes();
        this.updateData = {};
        this.selectedFile = null;
        this.previewUrl = null;
        this.showUpdateForm = false;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile.');
      }
    });
  }

  changePassword(): void {
    if (this.passwordData.new_password !== this.passwordData.confirm_password) {
      alert('Passwords do not match!');
      return;
    }

    const data = {
      old_password: this.passwordData.old_password,
      new_password: this.passwordData.new_password
    };

    this.recipeService.changePassword(data).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.passwordData = { old_password: '', new_password: '', confirm_password: '' };
        this.showPasswordForm = false;
      },
      error: (err) => {
        const msg = err.error?.error || 'Unable to change password.';
        alert(`Error changing password: ${msg}`);
      }
    });
  }

  viewRecipe(recipeId: number): void {
    this.router.navigate(['/recipe', recipeId]);
  }

  getRecipeImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/img/default-food.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/${imagePath}`;
  }
}
