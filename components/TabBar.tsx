'use client';

import { useApp } from '@/lib/store';
import { mazoRepaso } from '@/lib/derive';
import { usePersonas } from '@/lib/hooks';
import { IconTab } from './icons';
import type { Screen } from '@/lib/types';

const TABS: { key: Screen; label: string; icon: 'mapa' | 'repasar' | 'personas' | 'ajustes' }[] = [
  { key: 'mapa', label: 'Mapa', icon: 'mapa' },
  { key: 'repasar', label: 'Repasar', icon: 'repasar' },
  { key: 'personas', label: 'Todas', icon: 'personas' },
  { key: 'ajustes', label: 'Ajustes', icon: 'ajustes' },
];

export default function TabBar() {
  const screen = useApp((s) => s.screen);
  const ir = useApp((s) => s.ir);
  const iniciarDeck = useApp((s) => s.iniciarDeck);
  const personas = usePersonas();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 88,
        zIndex: 25,
        padding: '8px 12px 0',
        paddingBottom: 'var(--safe-bottom)',
        background: 'linear-gradient(180deg, rgba(var(--bg-1-rgb),0) 0%, rgba(var(--bg-1-rgb),.92) 42%, var(--bg-1) 100%)',
        borderTop: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 4,
      }}
    >
      {TABS.map((t) => {
        const activo = screen === t.key;
        return (
          <button
            key={t.key}
            type="button"
            aria-label={t.label}
            aria-current={activo ? 'page' : undefined}
            onClick={() => {
              if (t.key === 'repasar') iniciarDeck(mazoRepaso(personas ?? []));
              ir(t.key);
            }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              padding: '8px 0',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              color: activo ? 'var(--accent)' : 'var(--fg-3)',
              transition: 'color .2s',
            }}
          >
            <IconTab tab={t.icon} />
            <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
