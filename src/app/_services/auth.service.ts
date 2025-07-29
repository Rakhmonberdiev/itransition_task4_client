import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../_models/auth.models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + 'auth/';
  currentUser = signal<AuthResponse | null>(null);

  loadUser(): Observable<AuthResponse> {
    return this.http
      .get<AuthResponse>(this.baseUrl + 'me', { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }
  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.baseUrl + 'login', req, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.currentUser.set(user)));
  }
  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.baseUrl + 'register', req, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.currentUser.set(user)));
  }
  logout(): Observable<void> {
    return this.http
      .post<void>(this.baseUrl + 'logout', {}, { withCredentials: true })
      .pipe(tap(() => this.currentUser.set(null)));
  }
  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
