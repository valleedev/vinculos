'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { usePersona, useFotoUrl } from '@/lib/hooks';
import { apodoTexto, iniciales, relativo } from '@/lib/derive';
import { agregarNota, borrarNota } from '@/lib/repo';
import Avatar from '../Avatar';
import IconButton from '../IconButton';
import { IconChevronLeft, IconPencil, IconX } from '../icons';

const ETIQUETA = { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--fg-3)' };
const CAMPO_INPUT: React.CSSProperties = {
  height: 44,
  padding: '0 14px',
  borderRadius: 12,
  border: '1px solid var(--line)',
  background: 'var(--surface-2)',
  font: '400 14px var(--font-sans)',
};

export default function DetalleScreen() {
  const selId = useApp((s) => s.selId);
  const volverMapa = useApp((s) => s.volverMapa);
  const setForm = useApp((s) => s.setForm);
  const abrirEdicion = useApp((s) => s.abrirEdicion);
  const [notaDraft, setNotaDraft] = useState('');

  const p = usePersona(selId);
  const fotoUrl = useFotoUrl(p?.foto);

  if (!p) return null;

  function onEditar() {
    if (!p) return;
    setForm({
      nombre: p.nombre,
      apodo: p.apodo,
      circulo: p.circulo,
      rasgo: p.rasgo,
      donde: p.donde,
      temas: p.temas,
      notas: p.notas,
      cercania: p.cercania,
      fotoDataUrl: null,
    });
    abrirEdicion(p.id);
  }

  function onAgregarNota() {
    if (!p || !notaDraft.trim()) return;
    agregarNota(p.id, notaDraft);
    setNotaDraft('');
  }

  const datos = [
    { k: 'Dónde', v: p.donde },
    { k: 'Trabajo', v: p.trabajo },
    { k: 'Círculo', v: p.circulo },
  ];
  const temas = p.temas.length ? p.temas : ['Sin temas anotados'];

  return (
    <div
      data-screen-label="Detalle"
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: 'var(--bg-1)', zIndex: 30, animation: 'vSheet .32s cubic-bezier(.2,.9,.3,1) both' }}
    >
      <div style={{ paddingTop: 'var(--safe-top)', paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={volverMapa} label="Volver al mapa">
          <IconChevronLeft />
        </IconButton>
        <button
          type="button"
          onClick={onEditar}
          style={{
            height: 38,
            padding: '0 14px',
            borderRadius: 999,
            border: '1px solid var(--line)',
            background: 'var(--surface-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            cursor: 'pointer',
            font: '600 13px var(--font-sans)',
            color: 'var(--fg-1)',
          }}
        >
          <IconPencil />
          Editar
        </button>
      </div>

      <div style={{ padding: '22px 20px 110px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Avatar size={88} padding={3} anillo="var(--line-strong)" iniciales={iniciales(p.nombre)} iniSize={22} microLabel="FOTO" fotoUrl={fotoUrl} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ font: "700 25px/1.15 var(--font-sans)", letterSpacing: '-.02em' }}>{p.nombre}</div>
            <div style={{ font: '400 14px var(--font-sans)', color: 'var(--fg-2)' }}>{apodoTexto(p.apodo)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div
                className="mono"
                style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--accent-ghost)', border: '1px solid var(--accent-line)', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent-strong)' }}
              >
                {p.circulo}
              </div>
              <div className="mono" style={{ fontSize: 11, fontWeight: 500, color: 'var(--fg-3)' }}>
                visto {relativo(p.ultimoAt)}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: 'linear-gradient(160deg, rgba(var(--accent-rgb),.14) 0%, var(--surface-1) 55%)',
            border: '1px solid var(--accent-line)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ ...ETIQUETA, color: 'var(--accent-strong)' }}>Cómo lo reconozco</div>
          <div style={{ font: '400 16px/1.5 var(--font-sans)' }}>{p.rasgo}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={ETIQUETA}>Datos que quiero recordar</div>
          <div style={{ borderRadius: 16, background: 'var(--surface-1)', border: '1px solid var(--line)', overflow: 'hidden' }}>
            {datos.map((d, i) => (
              <div key={d.k} style={{ display: 'flex', gap: 12, padding: '13px 16px', borderBottom: i < datos.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div className="mono" style={{ flex: 'none', width: 104, fontSize: 12, fontWeight: 500, letterSpacing: '.04em', color: 'var(--fg-3)' }}>
                  {d.k}
                </div>
                <div style={{ flex: 1, font: '400 14px/1.45 var(--font-sans)' }}>{d.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={ETIQUETA}>Temas seguros</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {temas.map((t) => (
              <div key={t} style={{ padding: '7px 13px', borderRadius: 999, background: 'var(--surface-2)', border: '1px solid var(--line)', font: '500 13px var(--font-sans)' }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={ETIQUETA}>Notas</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={notaDraft}
              onChange={(e) => setNotaDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAgregarNota();
                }
              }}
              placeholder="Agregar una nota…"
              style={{ ...CAMPO_INPUT, flex: 1 }}
            />
            <button
              type="button"
              onClick={onAgregarNota}
              style={{ flex: 'none', padding: '0 16px', borderRadius: 12, border: 'none', background: 'var(--surface-2)', color: 'var(--fg-1)', font: '600 13px var(--font-sans)', cursor: 'pointer' }}
            >
              Agregar
            </button>
          </div>
          {p.notas.length === 0 ? (
            <div style={{ font: '400 13px var(--font-sans)', color: 'var(--fg-3)' }}>Sin notas todavía.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.notas.map((n) => (
                <div
                  key={n.id}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 14, background: 'var(--surface-1)', border: '1px solid var(--line)' }}
                >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ font: '400 14px/1.45 var(--font-sans)' }}>{n.texto}</div>
                    <div className="mono" style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--fg-4)' }}>
                      {relativo(n.creadoEn)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => borrarNota(p.id, n.id)}
                    aria-label="Borrar nota"
                    style={{ flex: 'none', width: 24, height: 24, borderRadius: 999, border: 'none', background: 'var(--surface-3)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <IconX size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
