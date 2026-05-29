import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from 'app/core/services/api.service';
import { AuthResponse, LoginRequest, RegisterRequest } from 'app/core/models/auth.model';
import { User } from 'app/core/models/user.model';

const TOKEN_KEY = 'zg_access';
const REFRESH_KEY = 'zg_refresh';
const USER_KEY = 'zg_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private _user = signal<User | null>(this.loadUser());
  readonly currentUser = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');

  login(req: LoginRequest) {
    return this.api.post<AuthResponse>('/api/auth/login', req).pipe(
      tap(res => this.persist(res))
    );
  }

  register(req: RegisterRequest) {
    return this.api.post<AuthResponse>('/api/auth/register', req).pipe(
      tap(res => this.persist(res))
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private persist(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._user.set(res.user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
