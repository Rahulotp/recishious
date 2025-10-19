import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private tokenKey = 'authToken';
  private userIdKey = 'userId';
  public id = 0;
  private loggedin = false;

  constructor(private http: HttpClient, private router: Router) {}

//------auth--------
  signup(data: any) {
    return this.http.post('http://127.0.0.1:8000/register/', data);
  }

  login(token: string, userId: number, username: string): void {
    this.loggedin = true;
    this.id = userId;
    localStorage.setItem('user', 'true');
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userIdKey, userId.toString());
    localStorage.setItem('username', username); 
    console.log("Saved token:", localStorage.getItem(this.tokenKey));
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.loggedin = false;
    localStorage.removeItem('user');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  authHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem(this.tokenKey);
    if (token && !req.url.includes('/register') && !req.url.includes('/log')) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Token ${token}`)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }

//-----------recipes------
  registerRecipe(data: any) {
    return this.http.post('http://127.0.0.1:8000/add/', data, {
      headers: this.authHeaders()
    });
  }

  getRecipeById(id: number) {
    return this.http.get(`http://127.0.0.1:8000/recipe/${id}/`, {
      headers: this.authHeaders()
    });
  }

  updateRecipe(id: number, data: any) {
    return this.http.put(`http://127.0.0.1:8000/update/${id}/`, data, {
      headers: this.authHeaders()
    });
  }

  deleteRecipe(id: number) {
    return this.http.delete<any>(`http://127.0.0.1:8000/delete/${id}/`, {
      headers: this.authHeaders()
    });
  }

  getAllRecipes(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/all-recipes/', {
      headers: this.authHeaders()
    });
  }

  getUserApprovedRecipes(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/recipes/user/approved/', {
      headers: this.authHeaders()
    });
  }

  getPublishedRecipes(): Observable<any[]> {
    return this.http.get<any[]>(`http://127.0.0.1:8000/api/recipes/approved/`, {
      headers: this.authHeaders()
    });
  }

  getRecipes(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/recipes/', {
      headers: this.authHeaders()
    });
  }

  approveRecipe(id: number) {
    return this.http.put(`http://127.0.0.1:8000/approve/${id}/`, {}, {
      headers: this.authHeaders()
    });
  }

//------------admin----------

  adminDeleteRecipe(id: number): Observable<any> {
    return this.http.delete(`http://127.0.0.1:8000/admin-home/delete/${id}/`, {
      headers: this.authHeaders()
    });
  }

  getApprovedRecipes(params: any = {}): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:8000/approved-recipes/', {
      headers: this.authHeaders(),
      params: params
    });
  }

  getRecipeDetailWithReviews(id: number) {
    return this.http.get(`http://127.0.0.1:8000/recipe-detail/${id}/`, {
      headers: this.authHeaders()
    });
  }

//----------reviews-------

  submitReview(data: any) {
    return this.http.post(`http://127.0.0.1:8000/submit-review/`, data, {
      headers: this.authHeaders()
    });
  }

  getReviewsOnly(recipeId: number) {
    return this.http.get(`http://127.0.0.1:8000/reviews-only/${recipeId}/`);
  }

//---------likes-------

  likeRecipe(id: number) {
    return this.http.post<any>(`http://127.0.0.1:8000/recipes/${id}/like/`, {}, {
      headers: this.authHeaders()
    });
  }

//--------download--------

  downloadRecipe(id: number): Observable<Blob> {
    return this.http.get(`http://127.0.0.1:8000/recipes/${id}/download/`, {
      responseType: 'blob',
      headers: this.authHeaders()
    });
  }

//-----profile-------

getProfile() {
  return this.http.get('http://127.0.0.1:8000/profile/', { headers: this.authHeaders() });
}

uploadProfileImage(formData: FormData) {
  const headers = this.authHeaders().delete('Content-Type');
  return this.http.put('http://127.0.0.1:8000/profile/', formData, { headers });
}

changePassword(data: any) {
  return this.http.put('http://127.0.0.1:8000/change-password/', data, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  });
}

getUserRecipes() {
  return this.http.get<any>('http://127.0.0.1:8000/user/recipes/');
}


}






