import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FORM_VACIO, type PersonaForm, type Screen } from './types';

interface AppState {
  screen: Screen;
  selId: string | null;
  editId: string | null;
  filtro: string;
  q: string;
  paso: 1 | 2 | 3;
  form: PersonaForm;
  toast: string;
  lastTab: Screen;

  ir: (screen: Screen) => void;
  abrirDetalle: (id: string) => void;
  volverMapa: () => void;
  abrirNuevo: () => void;
  abrirEdicion: (id: string) => void;
  cancelarNuevo: () => void;
  setFiltro: (filtro: string) => void;
  setQ: (q: string) => void;
  setForm: (parcial: Partial<PersonaForm>) => void;
  resetForm: () => void;
  siguientePaso: () => void;
  pasoAnterior: () => void;
  guardadoOk: () => void;
  mostrarToast: (mensaje: string) => void;
  limpiarToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      screen: 'login',
      selId: null,
      editId: null,
      filtro: 'Todos',
      q: '',
      paso: 1,
      form: FORM_VACIO,
      toast: '',
      lastTab: 'mapa',

      ir: (screen) => {
        const esTab = screen === 'mapa' || screen === 'personas' || screen === 'ajustes';
        set({ screen, selId: null, ...(esTab ? { lastTab: screen } : {}) });
      },
      abrirDetalle: (id) => set({ screen: 'detalle', selId: id, editId: null }),
      volverMapa: () => set({ screen: 'mapa', selId: null, editId: null }),
      abrirNuevo: () => set({ screen: 'nuevo', paso: 1, editId: null }),
      abrirEdicion: (id) => set({ screen: 'nuevo', paso: 1, editId: id, selId: id }),
      cancelarNuevo: () => set({ screen: get().selId ? 'detalle' : get().lastTab, paso: 1, editId: null }),
      setFiltro: (filtro) => set({ filtro }),
      setQ: (q) => set({ q }),
      setForm: (parcial) => set((s) => ({ form: { ...s.form, ...parcial } })),
      resetForm: () => set({ form: FORM_VACIO, paso: 1 }),
      siguientePaso: () => set((s) => ({ paso: Math.min(3, s.paso + 1) as 1 | 2 | 3 })),
      pasoAnterior: () => set((s) => ({ paso: Math.max(1, s.paso - 1) as 1 | 2 | 3 })),
      guardadoOk: () => set({ form: FORM_VACIO, paso: 1, editId: null }),
      mostrarToast: (mensaje) => {
        clearTimeout(toastTimer);
        set({ toast: mensaje });
        toastTimer = setTimeout(() => set({ toast: '' }), 2400);
      },
      limpiarToast: () => set({ toast: '' }),
    }),
    {
      name: 'vinculos-draft',
      partialize: (s) => ({ form: s.form, lastTab: s.lastTab }),
    }
  )
);
