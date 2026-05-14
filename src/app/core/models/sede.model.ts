export interface HorarioItem {
  dias: string;
  apertura: string;
  cierre: string;
}

export interface SedeInfo {
  nombre: string;
  slogan: string;
  telefono: string;
  whatsapp: string;
  redes: {
    instagram: {
      usuario: string;
      url: string;
    };
  };
  ubicacion: {
    direccion: string;
    ciudad: string;
    departamento: string;
    mapsEmbed: string;
  };
  horarios: HorarioItem[];
  notaHorario: string;
}
