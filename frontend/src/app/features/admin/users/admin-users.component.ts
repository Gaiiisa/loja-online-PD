import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from 'app/core/services/api.service';
import { User } from 'app/core/models/user.model';
import { PageResponse } from 'app/core/models/product.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div>
      <h2 style="font-family:var(--font-display);font-size:2rem;margin-bottom:24px">USUÁRIOS</h2>

      @if (loading()) {
        <div class="flex-center" style="height:200px"><div class="spinner"></div></div>
      } @else {
        <div class="table-wrap card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Desde</th>
              </tr>
            </thead>
            <tbody>
              @for (u of users(); track u.id) {
                <tr>
                  <td class="text-muted mono text-sm">{{ u.id }}</td>
                  <td>{{ u.name }}</td>
                  <td class="text-muted">{{ u.email }}</td>
                  <td>
                    <span [style.color]="u.role === 'ADMIN' ? 'var(--ice)' : 'var(--muted)'">
                      {{ u.role }}
                    </span>
                  </td>
                  <td class="text-muted text-sm">{{ u.createdAt | date:'dd/MM/yyyy' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .table-wrap { overflow-x: auto; }
    .admin-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .admin-table th { padding: 12px 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); border-bottom: 1px solid var(--border); }
    .admin-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
    .admin-table tr:last-child td { border-bottom: none; }
  `]
})
export class AdminUsersComponent implements OnInit {
  private api = inject(ApiService);
  users = signal<User[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.api.get<PageResponse<User>>('/api/admin/users', { page: 0, size: 100 }).subscribe({
      next: r => { this.users.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
