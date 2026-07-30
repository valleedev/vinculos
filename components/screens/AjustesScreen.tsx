'use client';

import { useState } from 'react';
import { useAjustes, usePersonas } from '@/lib/hooks';
import { borrarTodo, exportarJSON, guardarAjustes } from '@/lib/repo';
import { useApp } from '@/lib/store';
import Switch from '../Switch';
import { IconChevronRight } from '../icons';

const ETIQUETA = { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--fg-3)' };

export default function AjustesScreen() {
  const ajustes = useAjustes();
  const personas = usePersonas();
  const mostrarToast = useApp((s) => s.mostrarToast);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

  const switches = [
    { key: 'recordar' as const, label: 'Repaso diario', sub: 'Cinco caras cada mañana' },
    { key: 'mezclar' as const, label: 'Mezclar círculos', sub: 'No agrupa por trabajo o familia' },
    { key: 'notif' as const, label: 'Avisarme antes de vernos', sub: 'Usa el calendario del teléfono' },
  ];

  async function onExportar() {
    const json = await exportarJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vinculos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    mostrarToast('Copia exportada.');
  }

  async function onBorrarTodo() {
    if (!confirmandoBorrado) {
      setConfirmandoBorrado(true);
      return;
    }
    await borrarTodo();
    setConfirmandoBorrado(false);
    mostrarToast('Se borró todo.');
  }

  return (
    <div
      data-screen-label="Ajustes"
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 'var(--safe-top)', paddingLeft: 20, paddingRight: 20, paddingBottom: 110, animation: 'vFade .3s ease both' }}
    >
      <div style={{ font: "700 28px/1.2 var(--font-sans)", letterSpacing: '-.02em', marginBottom: 18 }}>Ajustes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={ETIQUETA}>Repaso</div>
          <div style={{ borderRadius: 16, background: 'var(--surface-1)', border: '1px solid var(--line)', overflow: 'hidden' }}>
            {switches.map((s, i) => (
              <div
                key={s.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '14px 16px',
                  borderBottom: i < switches.length - 1 ? '1px solid var(--line)' : 'none',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ font: '400 15px var(--font-sans)' }}>{s.label}</div>
                  <div style={{ font: '400 12px var(--font-sans)', color: 'var(--fg-3)' }}>{s.sub}</div>
                </div>
                <Switch on={ajustes[s.key]} onToggle={() => guardarAjustes({ [s.key]: !ajustes[s.key] })} label={s.label} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={ETIQUETA}>Datos</div>
          <div style={{ borderRadius: 16, background: 'var(--surface-1)', border: '1px solid var(--line)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ font: '400 15px var(--font-sans)' }}>Personas guardadas</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)' }}>
                {personas.length}
              </div>
            </div>
            <button
              type="button"
              onClick={onExportar}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--line)', background: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              <div style={{ font: '400 15px var(--font-sans)' }}>Exportar copia</div>
              <IconChevronRight color="var(--fg-3)" />
            </button>
            <button
              type="button"
              onClick={onBorrarTodo}
              onBlur={() => setConfirmandoBorrado(false)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ font: '400 15px var(--font-sans)', color: '#EF4444' }}>{confirmandoBorrado ? '¿Seguro? Toca de nuevo' : 'Borrar todo'}</div>
              <IconChevronRight color="var(--fg-3)" />
            </button>
          </div>
        </div>

        <div style={{ font: '400 12px/1.6 var(--font-sans)', color: 'var(--fg-4)' }}>
          Vínculos 1.0 · Nada sale de tu teléfono: ni fotos, ni notas, ni nombres. El repaso se calcula localmente.
        </div>
      </div>
    </div>
  );
}
