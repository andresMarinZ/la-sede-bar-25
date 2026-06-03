import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { MundialData, Partido } from '../models/match.model';

@Injectable({ providedIn: 'root' })
export class MundialService {
  private http = inject(HttpClient);

  getData(): Observable<MundialData> {
    return this.http.get<MundialData>('data/mundial-2026.json');
  }

  getPartidos(): Observable<Partido[]> {
    return this.getData().pipe(map((data) => data.partidos));
  }

  getGrupos(): Observable<string[]> {
    return this.getData().pipe(map((data) => data.grupos));
  }
}
