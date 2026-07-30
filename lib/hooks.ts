import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo } from 'react';
import { db } from './db';
import { AJUSTES_DEFAULT } from './types';
import type { Persona } from './types';

const SIN_PERSONAS: Persona[] = [];

export function usePersonas() {
  return useLiveQuery(() => db.personas.toArray(), [], SIN_PERSONAS);
}

export function usePersona(id: string | null) {
  return useLiveQuery(() => (id ? db.personas.get(id) : undefined), [id]);
}

export function useAjustes() {
  return useLiveQuery(() => db.ajustes.get('default'), [], AJUSTES_DEFAULT) ?? AJUSTES_DEFAULT;
}

export function useFotoUrl(foto: Blob | undefined): string | null {
  const url = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto]);
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
}
