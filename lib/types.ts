export type Circulo = 'Trabajo' | 'Familia' | 'Barrio' | 'Gimnasio' | 'Cursos';

export const CIRCULOS: Circulo[] = ['Trabajo', 'Familia', 'Barrio', 'Gimnasio', 'Cursos'];

export const TEMAS = [
  'Café', 'Perros', 'Gatos', 'Cine', 'Correr', 'Cerámica',
  'Viajes', 'Música', 'Plantas', 'Cocina', 'Fútbol', 'Videojuegos',
] as const;

export interface Encuentro {
  id: string;
  fecha: string;
  nota: string;
}

export interface Persona {
  id: string;
  nombre: string;
  apodo: string;
  foto?: Blob;
  circulo: Circulo;
  cercania: number;
  fuerza: number;
  rasgo: string;
  donde: string;
  trabajo: string;
  temas: string[];
  notas: string;
  ultimoAt: number; // epoch ms del último encuentro; "ultimo" (relativo) se deriva
  encuentros: Encuentro[];
}

export interface Ajustes {
  id: 'default';
  recordar: boolean;
  mezclar: boolean;
  notif: boolean;
}

export const AJUSTES_DEFAULT: Ajustes = {
  id: 'default',
  recordar: true,
  mezclar: true,
  notif: false,
};

export type Screen = 'login' | 'mapa' | 'personas' | 'repasar' | 'ajustes' | 'detalle' | 'nuevo';

export interface PersonaForm {
  nombre: string;
  apodo: string;
  circulo: Circulo;
  rasgo: string;
  donde: string;
  temas: string[];
  notas: string;
  cercania: number;
  fotoDataUrl: string | null;
}

export const FORM_VACIO: PersonaForm = {
  nombre: '', apodo: '', circulo: 'Trabajo', rasgo: '', donde: '',
  temas: [], notas: '', cercania: 70, fotoDataUrl: null,
};
