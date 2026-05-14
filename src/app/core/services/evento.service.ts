import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Evento } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private http = inject(HttpClient);

  getEvento() {
    return this.http.get<Evento>('/data/evento.json');
  }
}
