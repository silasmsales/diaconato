import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authService = inject(AuthService);

  getUserInitial(): string {
    const name = this.authService.currentProfile()?.nome_completo || this.authService.currentUser()?.email || 'U';
    return name.charAt(0).toUpperCase();
  }
}