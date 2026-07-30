'use client';

import { useFotoUrl } from '@/lib/hooks';
import type { Persona } from '@/lib/types';
import Avatar from './Avatar';

interface MapaNodoProps {
  persona: Persona;
  anillo: string;
  ini: string;
  corto: string;
  onClick: () => void;
}

export default function MapaNodo({ persona, anillo, ini, corto, onClick }: MapaNodoProps) {
  const fotoUrl = useFotoUrl(persona.foto);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${persona.nombre} — ${persona.circulo}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        animation: 'vPop .45s cubic-bezier(.2,.9,.3,1.2) both',
        background: 'none',
        border: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ boxShadow: 'var(--sombra-avatar)', borderRadius: 999 }}>
        <Avatar size={50} padding={2} anillo={anillo} iniciales={ini} iniSize={15} fotoUrl={fotoUrl} />
      </div>
      <div
        style={{
          padding: '2px 7px',
          borderRadius: 6,
          background: 'rgba(0,0,0,.65)',
          color: '#fff',
          fontFamily: 'var(--font-sans)',
          fontSize: 10.5,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {corto}
      </div>
    </button>
  );
}
