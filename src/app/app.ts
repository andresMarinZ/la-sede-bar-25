import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { EventoModalComponent } from './shared/components/evento-modal/evento-modal.component';
import { AnalyticsService } from './core/services/analytics.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, EventoModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    const router    = inject(Router);
    const analytics = inject(AnalyticsService);

    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        analytics.trackPageView(
          (e as NavigationEnd).urlAfterRedirects,
          document.title
        );
      });
  }
}
