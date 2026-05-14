export interface Equipo {
  nombre: string;
  iso: string;
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
}

export interface MundialData {
  grupos: string[];
  partidos: Partido[];
}

export type GrupoFiltro = string | 'TODOS';
export type JornadaFiltro = 1 | 2 | 3 | 0;
