'use client';

const TEMA_KEY = 'vinculos-tema';
const COLOR_POR_TEMA = { dark: '#1f1f1f', light: '#ffffff' } as const;

export type Tema = 'dark' | 'light';

export function leerTema(): Tema {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem(TEMA_KEY) === 'light' ? 'light' : 'dark';
}

export function aplicarTema(tema: Tema) {
  document.documentElement.setAttribute('data-theme', tema);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR_POR_TEMA[tema]);
}

export function guardarTema(tema: Tema) {
  localStorage.setItem(TEMA_KEY, tema);
  aplicarTema(tema);
}

/** Script inline para setear data-theme antes del primer paint y evitar flash del tema equivocado. */
export const SCRIPT_INICIO_TEMA = `
try {
  var t = localStorage.getItem('${TEMA_KEY}') === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;
