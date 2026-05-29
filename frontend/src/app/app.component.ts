import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from 'app/shared/components/navbar/navbar.component';
import { ToastComponent } from 'app/shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <app-navbar />
    <main style="min-height: calc(100vh - 64px)">
      <router-outlet />
    </main>
    <app-toast />
  `
})
export class AppComponent {}
