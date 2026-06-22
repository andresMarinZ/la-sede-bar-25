import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, map, of, startWith } from 'rxjs';
import { MundialService } from '../../core/services/mundial.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import type { Partido, GrupoFiltro, JornadaFiltro } from '../../core/models/match.model';

interface MundialState {
  partidos: Partido[];
  grupos: string[];
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: MundialState = { partidos: [], grupos: [], loading: true, error: null };

@Component({
  selector: 'app-mundial',
  imports: [FormsModule],
  templateUrl: './mundial.component.html',
  styleUrl: './mundial.component.scss',
})
export class MundialComponent implements OnInit {
  private mundialService = inject(MundialService);
  private analytics      = inject(AnalyticsService);

  readonly JORNADAS: JornadaFiltro[] = [1, 2, 3];

  private state = toSignal(
    this.mundialService.getData().pipe(
      map((data): MundialState => ({
        partidos: data.partidos,
        grupos:   data.grupos,
        loading:  false,
        error:    null,
      })),
      startWith(INITIAL_STATE),
      catchError(() =>
        of({ partidos: [], grupos: [], loading: false, error: 'No se pudieron cargar los partidos.' } as MundialState)
      )
    ),
    { initialValue: INITIAL_STATE }
  );

  isLoading  = computed(() => this.state().loading);
  hasError   = computed(() => this.state().error);
  grupos     = computed(() => this.state().grupos);

  busqueda        = signal('');
  grupoActivo     = signal<GrupoFiltro>('TODOS');
  jornadaActiva   = signal<JornadaFiltro>(0);
  soloColombiaOn  = signal(false);

  partidosFiltrados = computed(() => {
    const partidos    = this.state().partidos;
    const busq        = this.busqueda().toLowerCase().trim();
    const grupo       = this.grupoActivo();
    const jornada     = this.jornadaActiva();
    const soloColombia = this.soloColombiaOn();

    return partidos.filter((p) => {
      if (soloColombia && !p.esColombiaPartido) return false;
      if (grupo !== 'TODOS' && p.grupo !== grupo)   return false;
      if (jornada !== 0    && p.jornada !== jornada) return false;
      if (busq && !p.local.nombre.toLowerCase().includes(busq) &&
                  !p.visitante.nombre.toLowerCase().includes(busq)) return false;
      return true;
    });
  });

  totalFiltrados    = computed(() => this.partidosFiltrados().length);
  hayResultados     = computed(() => this.totalFiltrados() > 0);

  ngOnInit(): void {
    this.analytics.trackPageView('/mundial', 'Mundial 2026 — La Sede Bar 25');
  }

  onGrupoChange(grupo: GrupoFiltro): void {
    this.grupoActivo.set(grupo);
    this.analytics.trackEvent('mundial_filtro_grupo', { grupo });
  }

  onJornadaChange(jornada: JornadaFiltro): void {
    this.jornadaActiva.set(jornada);
    this.analytics.trackEvent('mundial_filtro_jornada', { jornada });
  }

  onSoloColombiaToggle(): void {
    this.soloColombiaOn.update((v) => !v);
    this.analytics.trackEvent('mundial_filtro_colombia', { activo: this.soloColombiaOn() });
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.grupoActivo.set('TODOS');
    this.jornadaActiva.set(0);
    this.soloColombiaOn.set(false);
  }

  formatearFecha(fechaISO: string): string {
    const [year, month, day] = fechaISO.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString('es-CO', {
      weekday: 'short',
      day:     'numeric',
      month:   'short',
    });
  }

  formatearHora(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const suffix = h >= 12 ? 'p. m.' : 'a. m.';
    const hora12 = h % 12 === 0 ? 12 : h % 12;
    return `${hora12}${m > 0 ? `:${String(m).padStart(2, '0')}` : ''} ${suffix}`;
  }

  trackById(_index: number, partido: Partido): number {
    return partido.id;
  }

  ganador(partido: Partido): 'local' | 'visitante' | 'empate' | null {
    const r = partido.resultado;
    if (r.estado !== 'FINALIZADO' || r.golesLocal === null || r.golesVisitante === null) return null;
    if (r.golesLocal > r.golesVisitante) return 'local';
    if (r.golesLocal < r.golesVisitante) return 'visitante';
    return 'empate';
  }
}
