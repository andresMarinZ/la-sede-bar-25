export interface Equipo {
  nombre: string;
  iso: string;
}

export type EstadoPartido = 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO';

export interface Resultado {
  golesLocal: number | null;
  golesVisitante: number | null;
  estado: EstadoPartido;
}

export interface Estadio {
  nombre: string;
  ciudad: string;
}

export interface Partido {
  id: number;
  fecha: string;
  hora: string;
  jornada: 1 | 2 | 3;
  grupo: string;
  local: Equipo;
  visitante: Equipo;
  esColombiaPartido: boolean;
  resultado: Resultado;
  estadio: Estadio;
}

export interface MundialData {
  grupos: string[];
  partidos: Partido[];
}

export type GrupoFiltro = string | 'TODOS';
export type JornadaFiltro = 1 | 2 | 3 | 0;
