import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ObreiroAuthService } from '../../core/services/obreiro-auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './bottom-nav.component.html'
})
export class BottomNavComponent {
  authService = inject(AuthService);
  obreiroAuth = inject(ObreiroAuthService);
  private router = inject(Router);

  isPortalRoute = computed(() => {
    const url = this.router.url;
    return url.startsWith('/portal') || (this.obreiroAuth.isAuthenticated() && !this.authService.isAuthenticated());
  });
}