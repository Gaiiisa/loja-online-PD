import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-brand">ADMIN</div>
        <nav class="admin-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active">📊 Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="active">📦 Produtos</a>
          <a routerLink="/admin/orders" routerLinkActive="active">🛒 Pedidos</a>
          <a routerLink="/admin/users" routerLinkActive="active">👥 Usuários</a>
          <a routerLink="/" class="nav-back">← Voltar à Loja</a>
        </nav>
      </aside>
      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 64px); }
    .admin-sidebar { background: var(--void); border-right: 1px solid var(--border); padding: 24px 0; }
    .admin-brand { font-family: var(--font-display); font-size: 1.2rem; color: var(--ice); padding: 0 20px 24px; letter-spacing: 0.1em; border-bottom: 1px solid var(--border); }
    .admin-nav { display: flex; flex-direction: column; padding-top: 16px; }
    .admin-nav a { padding: 12px 20px; color: var(--muted); font-size: 0.9rem; transition: all 0.2s; }
    .admin-nav a:hover, .admin-nav a.active { background: rgba(255,255,255,0.05); color: var(--text); }
    .nav-back { margin-top: auto; border-top: 1px solid var(--border); }
    .admin-main { padding: 32px; overflow-y: auto; }
    @media(max-width:768px) { .admin-layout { grid-template-columns: 1fr; } .admin-sidebar { display: none; } }
  `]
})
export class AdminComponent {}
