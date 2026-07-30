export type Circulo = string;

export const CIRCULOS_BASE = ['Trabajo', 'Familia', 'Barrio', 'Gimnasio', 'Cursos'];

export const TEMAS = [
  'Café', 'Perros', 'Gatos', 'Cine', 'Correr', 'Cerámica',
  'Viajes', 'Música', 'Plantas', 'Cocina', 'Fútbol', 'Videojuegos',
] as const;

export interface Nota {
  id: string;
  texto: string;
  creadoEn: number;
}

export interface Persona {
  id: string;
  nombre: string;
  apodo: string;
  foto?: Blob;
  circulo: Circulo;
  cercania: number;
  rasgo: string;
  donde: string;
  trabajo: string;
  temas: string[];
  notas: Nota[];
  ultimoAt: number; // epoch ms de creación; "ultimo" (relativo) se deriva
}

export type Screen = 'login' | 'mapa' | 'personas' | 'ajustes' | 'detalle' | 'nuevo';

export interface PersonaForm {
  nombre: string;
  apodo: string;
  circulo: Circulo;
  rasgo: string;
  donde: string;
  temas: string[];
  notas: Nota[];
  cercania: number;
  fotoDataUrl: string | null;
}

export const FORM_VACIO: PersonaForm = {
  nombre: '', apodo: '', circulo: 'Trabajo', rasgo: '', donde: '',
  temas: [], notas: [], cercania: 70, fotoDataUrl: null,
};
