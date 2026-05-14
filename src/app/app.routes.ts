import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'carta',
    loadComponent: () =>
      import('./pages/carta/carta.component').then((m) => m.CartaComponent),
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import('./pages/reservas/reservas.component').then((m) => m.ReservasComponent),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  {
    path: 'mundial',
    loadComponent: () =>
      import('./pages/mundial/mundial.component').then((m) => m.MundialComponent),
  },
  { path: '**', redirectTo: 'inicio' },
];
