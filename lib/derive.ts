import { CIRCULOS_BASE, type Persona } from './types';

export function iniciales(nombre: string): string {
  return nombre.trim().split(/\s+/).slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
}

export function nombreCorto(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] ?? '';
}

export function apodoTexto(apodo: string): string {
  return apodo.trim() ? `Le dicen ${apodo.trim()}` : 'Sin apodo registrado';
}

export function cercaniaTexto(cercania: number): string {
  if (cercania >= 80) return 'Muy cercano';
  if (cercania >= 55) return 'Cercano';
  if (cercania >= 35) return 'Conocido';
  return 'Apenas lo conozco';
}

const DIA_MS = 24 * 60 * 60 * 1000;

export function relativo(ts: number): string {
  const dias = Math.floor((Date.now() - ts) / DIA_MS);
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'ayer';
  if (dias < 7) return `hace ${dias} días`;
  if (dias < 14) return 'hace 1 semana';
  if (dias < 30) return `hace ${Math.floor(dias / 7)} semanas`;
  if (dias < 60) return 'hace 1 mes';
  return `hace ${Math.floor(dias / 30)} meses`;
}

/** Antepone los círculos sugeridos (en su orden canónico) y deja los personalizados alfabéticos al final. */
export function ordenarCirculos(circulos: string[]): string[] {
  const set = new Set(circulos);
  const base = CIRCULOS_BASE.filter((c) => set.has(c));
  const extra = circulos.filter((c) => !CIRCULOS_BASE.includes(c)).sort((a, b) => a.localeCompare(b));
  return [...base, ...extra];
}

export interface NodoMapa {
  persona: Persona;
  px: number;
  py: number;
  r: number;
  ang: number;
}

const CX = 201;
const CY = 300;
const MIN_SEP = 74;
const MIN_RADIO = 84;

/** Layout polar por círculo + relajación global — evita solapes, igual que el prototipo. */
export function layoutMapa(personas: Persona[]): NodoMapa[] {
  const grupos: Record<string, Persona[]> = {};
  personas.forEach((p) => {
    (grupos[p.circulo] = grupos[p.circulo] || []).push(p);
  });

  const gruposUsados = ordenarCirculos(Object.keys(grupos));
  const sector = 360 / gruposUsados.length;
  const pts: { p: Persona; x: number; y: number }[] = [];

  gruposUsados.forEach((c, gi) => {
    const lista = grupos[c] || [];
    lista.forEach((p, i) => {
      const spread = sector * 0.9;
      const off = lista.length > 1 ? (i / (lista.length - 1) - 0.5) * spread : 0;
      const ang = gi * sector - 90 + off;
      const r = 78 + (1 - p.cercania / 100) * 68 + (i % 2) * 28;
      const rad = (ang * Math.PI) / 180;
      pts.push({ p, x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) });
    });
  });

  for (let it = 0; it < 120; it++) {
    for (let a = 0; a < pts.length; a++) {
      for (let b = a + 1; b < pts.length; b++) {
        const dx = pts[b].x - pts[a].x;
        const dy = pts[b].y - pts[a].y;
        const d = Math.hypot(dx, dy) || 0.01;
        if (d < MIN_SEP) {
          const k = ((MIN_SEP - d) / d) * 0.5;
          pts[a].x -= dx * k;
          pts[a].y -= dy * k;
          pts[b].x += dx * k;
          pts[b].y += dy * k;
        }
      }
    }
    pts.forEach((q) => {
      const dx = q.x - CX;
      const dy = q.y - CY;
      const d = Math.hypot(dx, dy) || 0.01;
      if (d < MIN_RADIO) {
        q.x = CX + (dx / d) * MIN_RADIO;
        q.y = CY + (dy / d) * MIN_RADIO;
      }
      q.x = Math.max(40, Math.min(362, q.x));
      q.y = Math.max(56, Math.min(536, q.y));
    });
  }

  return pts.map(({ p, x, y }) => {
    const dx = x - CX;
    const dy = y - CY;
    return {
      persona: p,
      px: Math.round(x),
      py: Math.round(y),
      r: Math.round(Math.hypot(dx, dy)),
      ang: Math.round(Math.atan2(dy, dx) * (180 / Math.PI) * 10) / 10,
    };
  });
}

export function buscar(personas: Persona[], q: string): Persona[] {
  const term = q.trim().toLowerCase();
  return personas
    .filter(
      (p) =>
        !term ||
        `${p.nombre} ${p.apodo} ${p.rasgo} ${p.temas.join(' ')} ${p.circulo}`
          .toLowerCase()
          .includes(term)
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
