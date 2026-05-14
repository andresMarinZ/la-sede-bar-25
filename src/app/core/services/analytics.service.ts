import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare function gtag(...args: unknown[]): void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  trackPageView(path: string, title: string): void {
    if (!environment.enableAnalytics || typeof gtag === 'undefined') return;
    gtag('event', 'page_view', { page_path: path, page_title: title });
  }

  trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (!environment.enableAnalytics || typeof gtag === 'undefined') return;
    gtag('event', eventName, params ?? {});
  }
}
