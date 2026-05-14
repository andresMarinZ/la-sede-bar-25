import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { MenuItem } from '../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);

  getMenu() {
    return this.http.get<MenuItem[]>('/data/menu.json');
  }
}
