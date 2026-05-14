import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { EventoService } from '../../../core/services/evento.service';
import type { Evento } from '../../../core/models/evento.model';

const LS_KEY      = 'ls_evento_visto';
const DURACION_MS = 10_000;

@Component({
  selector: 'app-evento-modal',
  templateUrl: './evento-modal.component.html',
  styleUrl: './evento-modal.component.scss',
})
export class EventoModalComponent implements OnInit {
  private eventoService = inject(EventoService);
  private destroyRef    = inject(DestroyRef);

  visible  = signal(false);
  evento   = signal<Evento | null>(null);
  progreso = signal(100);

  private intervalo: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.eventoService.getEvento().subscribe({
      next: (ev) => {
        if (!ev.activo) return;
        const hoy = new Date().toDateString();
        if (localStorage.getItem(LS_KEY) === hoy) return;
        localStorage.setItem(LS_KEY, hoy);
        this.evento.set(ev);
        this.visible.set(true);
        this.iniciarCuenta();
      },
    });

    this.destroyRef.onDestroy(() => this.limpiarIntervalo());
  }

  cerrar() {
    this.visible.set(false);
    this.limpiarIntervalo();
  }

  private iniciarCuenta() {
    const pasos = DURACION_MS / 100;
    let paso = 0;
    this.intervalo = setInterval(() => {
      paso++;
      this.progreso.set(100 - (paso / pasos) * 100);
      if (paso >= pasos) this.cerrar();
    }, 100);
  }

  private limpiarIntervalo() {
    if (this.intervalo) { clearInterval(this.intervalo); this.intervalo = null; }
  }
}
