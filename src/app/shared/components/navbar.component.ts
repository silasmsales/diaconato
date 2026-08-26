import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_LABELS, ROLE_BADGE_STYLES, UserRole } from '../../core/models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authService = inject(AuthService);
  private elementRef = inject(ElementRef);

  isProfileMenuOpen = signal<boolean>(false);

  toggleProfileMenu(event?: Event) {
    if (event) event.stopPropagation();
    this.isProfileMenuOpen.update(v => !v);
  }

  closeProfileMenu() {
    this.isProfileMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeProfileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeProfileMenu();
  }

  getUserInitial(): string {
    const name = this.authService.currentProfile()?.nome_completo || this.authService.currentUser()?.email || 'U';
    return name.charAt(0).toUpperCase();
  }

  getFirstName(): string {
    const fullName = this.authService.currentProfile()?.nome_completo;
    if (fullName) {
      return fullName.split(' ')[0];
    }
    const email = this.authService.currentUser()?.email;
    return email ? email.split('@')[0] : 'Usuário';
  }

  getRoleLabel(role: UserRole): string {
    return ROLE_LABELS[role] || 'Operador';
  }

  getRoleBadgeStyle(role: UserRole) {
    return ROLE_BADGE_STYLES[role] || ROLE_BADGE_STYLES['operator'];
  }
}