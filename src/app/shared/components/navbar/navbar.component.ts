import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMenuOpen = signal(false);

  navItems = [
    { path: '/inicio',   label: 'Inicio' },
    { path: '/carta',    label: 'Carta' },
    { path: '/mundial',  label: '🏆 Mundial 2026' },
    { path: '/reservas', label: 'Reservas' },
    { path: '/contacto', label: 'Contáctanos' },
  ];

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.isMenuOpen.set(false);
  }
}
