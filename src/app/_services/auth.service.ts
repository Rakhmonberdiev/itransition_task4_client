import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../_models/auth.models';
import { Observable, tap } from 'rxjs';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + 'auth/';
  private store = inject(CurrentUserService);
  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.baseUrl + 'login', req, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.store.setUser(user)));
  }
  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.baseUrl + 'register', req, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.store.setUser(user)));
  }
}
