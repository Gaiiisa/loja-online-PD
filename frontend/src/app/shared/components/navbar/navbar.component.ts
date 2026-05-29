import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { CartService } from 'app/core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-inner">
        <a routerLink="/" class="nav-logo">ZERO<span>GRAU</span></a>

        <div class="nav-links">
          <a routerLink="/catalog" routerLinkActive="active">Catálogo</a>
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active">Admin</a>
          }
          @if (auth.isAuthenticated()) {
            <a routerLink="/orders" routerLinkActive="active">Pedidos</a>
          }
        </div>

        <div class="nav-actions">
          <a routerLink="/cart" class="cart-btn">
            🛒
            @if (cart.count() > 0) {
              <span class="cart-badge">{{ cart.count() }}</span>
            }
          </a>
          @if (auth.isAuthenticated()) {
            <span class="nav-user">{{ auth.currentUser()?.name?.split(' ')[0] }}</span>
            <button class="btn btn-ghost btn-sm" (click)="auth.logout()">Sair</button>
          } @else {
            <a routerLink="/auth/login" class="btn btn-outline btn-sm">Entrar</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: var(--void); border-bottom: 1px solid var(--border); height: 64px; position: sticky; top: 0; z-index: 100; }
    .nav-inner { height: 100%; display: flex; align-items: center; gap: 32px; }
    .nav-logo { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.1em; color: var(--text); }
    .nav-logo span { color: var(--ice); }
    .nav-links { display: flex; gap: 24px; flex: 1; }
    .nav-links a { color: var(--muted); font-size: 0.9rem; transition: color 0.2s; }
    .nav-links a:hover, .nav-links a.active { color: var(--text); }
    .nav-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
    .cart-btn { position: relative; font-size: 1.2rem; padding: 4px; }
    .cart-badge { position: absolute; top: -6px; right: -8px; background: var(--ice); color: var(--black); border-radius: 50%; width: 18px; height: 18px; font-size: 0.65rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .nav-user { font-size: 0.85rem; color: var(--muted); }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
}
