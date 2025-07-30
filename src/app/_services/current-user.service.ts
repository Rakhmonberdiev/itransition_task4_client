import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '../_models/auth.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + 'auth/';
  currentUser = signal<AuthResponse | null>(null);

  loadUser(): Observable<AuthResponse | null> {
    return this.http
      .get<AuthResponse>(this.baseUrl + 'me', { withCredentials: true })
      .pipe(
        tap((user) => this.currentUser.set(user)),
        catchError(() => {
          this.currentUser.set(null);
          return of(null);
        })
      );
  }
  logout(): Observable<void> {
    return this.http
      .post<void>(this.baseUrl + 'logout', {}, { withCredentials: true })
      .pipe(tap(() => this.setUser(null)));
  }
  setUser(user: AuthResponse | null) {
    this.currentUser.set(user);
  }
  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
