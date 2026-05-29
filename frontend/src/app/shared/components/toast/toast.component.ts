import { Component, inject } from '@angular/core';
import { ToastService } from 'app/core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}" (click)="toastService.remove(toast.id)">
          <span class="toast-icon">
            @if (toast.type === 'success') { ✅ }
            @else if (toast.type === 'error') { ❌ }
            @else if (toast.type === 'warn') { ⚠️ }
            @else { ℹ️ }
          </span>
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { padding: 14px 20px; border-radius: 8px; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 10px; max-width: 340px; animation: slideIn 0.25s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
    .toast-success { background: var(--success); color: #fff; }
    .toast-error { background: var(--error); color: #fff; }
    .toast-warn { background: var(--warn); color: var(--black); }
    .toast-info { background: var(--carbon); border: 1px solid var(--border); color: var(--text); }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
