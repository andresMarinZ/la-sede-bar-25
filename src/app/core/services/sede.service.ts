import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import type { SedeInfo } from '../models/sede.model';

@Injectable({ providedIn: 'root' })
export class SedeService {
  private http = inject(HttpClient);

  // shareReplay(1): la petición se hace una sola vez y se comparte entre
  // todos los componentes que consuman este servicio
  private sede$ = this.http
    .get<SedeInfo>('/data/sede.json')
    .pipe(shareReplay(1));

  getSede() {
    return this.sede$;
  }
}
