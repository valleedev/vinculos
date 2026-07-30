'use client';

import { useApp } from '@/lib/store';
import { usePersonas, useFotoUrl } from '@/lib/hooks';
import { buscar, iniciales } from '@/lib/derive';
import type { Persona } from '@/lib/types';
import Avatar from '../Avatar';
import { IconLupa } from '../icons';

function Fila({ p, onClick }: { p: Persona; onClick: () => void }) {
  const fotoUrl = useFotoUrl(p.foto);
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: 12,
        borderRadius: 16,
        background: 'var(--surface-1)',
        border: '1px solid var(--line)',
        cursor: 'pointer',
      }}
    >
      <Avatar size={46} padding={2} anillo="var(--line-strong)" iniciales={iniciales(p.nombre)} iniSize={13} fotoUrl={fotoUrl} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ font: '600 15.5px var(--font-sans)' }}>{p.nombre}</div>
        <div style={{ font: '400 12.5px/1.35 var(--font-sans)', color: 'var(--fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.rasgo}</div>
      </div>
      <div className="mono" style={{ flex: 'none', fontSize: 10, fontWeight: 500, color: 'var(--fg-4)' }}>
        {p.circulo}
      </div>
    </div>
  );
}

export default function PersonasScreen() {
  const personas = usePersonas();
  const q = useApp((s) => s.q);
  const setQ = useApp((s) => s.setQ);
  const abrirDetalle = useApp((s) => s.abrirDetalle);
  const lista = buscar(personas, q);

  return (
    <div
      data-screen-label="Lista"
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 'var(--safe-top)', paddingLeft: 20, paddingRight: 20, paddingBottom: 110, animation: 'vFade .3s ease both' }}
    >
      <div style={{ font: "700 28px/1.2 var(--font-sans)", letterSpacing: '-.02em', marginBottom: 14 }}>Todas</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 14px', borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--line)', marginBottom: 18 }}>
        <IconLupa color="var(--fg-3)" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, rasgo o tema…" style={{ flex: 1, border: 'none', background: 'transparent', font: '400 15px var(--font-sans)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lista.map((p) => (
          <Fila key={p.id} p={p} onClick={() => abrirDetalle(p.id)} />
        ))}
      </div>
      {lista.length === 0 && (
        <div style={{ padding: '40px 0', textAlign: 'center', font: '400 14px var(--font-sans)', color: 'var(--fg-3)' }}>
          {q.trim() ? `Nadie coincide con "${q}".` : 'Todavía no guardas a nadie.'}
        </div>
      )}
    </div>
  );
}
