'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { usePersonas } from '@/lib/hooks';
import { CIRCULOS } from '@/lib/types';
import { fz, iniciales, layoutMapa, nombreCorto, porRepasar } from '@/lib/derive';
import Chip from '../Chip';
import { IconPlus } from '../icons';
import MapaNodo from '../MapaNodo';

const ANILLOS = [
  { d: 116, opacidad: 0.07 },
  { d: 208, opacidad: 0.06 },
  { d: 300, opacidad: 0.05 },
];

export default function MapaScreen() {
  const personas = usePersonas();
  const filtro = useApp((s) => s.filtro);
  const setFiltro = useApp((s) => s.setFiltro);
  const abrirNuevo = useApp((s) => s.abrirNuevo);
  const abrirDetalle = useApp((s) => s.abrirDetalle);

  const nodos = useMemo(() => layoutMapa(personas), [personas]);
  const total = personas.length;
  const repasar = porRepasar(personas);

  return (
    <>
      <div data-screen-label="Mapa" style={{ position: 'absolute', inset: 0, overflowY: 'auto', animation: 'vFade .3s ease both' }}>
        <div style={{ paddingTop: 'var(--safe-top)', paddingLeft: 20, paddingRight: 20, paddingBottom: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                Mi mapa
              </div>
              <div style={{ font: "700 28px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>Personas</div>
            </div>
            <div className="mono" style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>
              {total} guardadas
              <br />
              <span style={{ color: 'var(--medio)' }}>{repasar} por repasar</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
            <Chip label="Todos" active={filtro === 'Todos'} onClick={() => setFiltro('Todos')} />
            {CIRCULOS.map((c) => (
              <Chip key={c} label={c} active={filtro === c} onClick={() => setFiltro(c)} />
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', height: 582, marginTop: 4 }}>
          {ANILLOS.map(({ d, opacidad }) => (
            <div
              key={d}
              style={{
                position: 'absolute',
                left: '50%',
                top: 300,
                transform: 'translate(-50%,-50%)',
                width: d,
                height: d,
                borderRadius: 999,
                border: `1px dashed rgba(var(--stripe-rgb),${opacidad})`,
              }}
            />
          ))}

          {nodos.map((n) => {
            const activo = filtro === 'Todos' || filtro === n.persona.circulo;
            return (
              <div
                key={n.persona.id + '-linea'}
                style={{
                  position: 'absolute',
                  left: 201,
                  top: 300,
                  width: n.r,
                  height: 1,
                  transformOrigin: '0 50%',
                  transform: `rotate(${n.ang}deg)`,
                  background: 'linear-gradient(90deg, rgba(var(--accent-rgb),.45), rgba(var(--accent-rgb),.05))',
                  opacity: activo ? 1 : 0.16,
                  transition: 'opacity .3s',
                }}
              />
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 201,
              top: 300,
              transform: 'translate(-50%,-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              zIndex: 3,
            }}
          >
            <div style={{ position: 'relative', width: 72, height: 72 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: 999,
                  background: 'radial-gradient(circle, rgba(var(--accent-rgb),.45) 0%, rgba(var(--accent-rgb),0) 70%)',
                  animation: 'vBreathe 3.4s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  background: 'var(--gradient-marca)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: '700 18px var(--font-mono)',
                  color: '#fff',
                }}
              >
                TÚ
              </div>
            </div>
          </div>

          {nodos.map((n) => {
            const activo = filtro === 'Todos' || filtro === n.persona.circulo;
            const f = fz(n.persona.fuerza);
            return (
              <div
                key={n.persona.id}
                style={{
                  position: 'absolute',
                  left: n.px,
                  top: n.py,
                  transform: 'translate(-50%,-50%)',
                  zIndex: 4,
                  opacity: activo ? 1 : 0.16,
                  pointerEvents: activo ? 'auto' : 'none',
                  transition: 'opacity .3s',
                }}
              >
                <MapaNodo
                  persona={n.persona}
                  anillo={f.color}
                  ini={iniciales(n.persona.nombre)}
                  corto={nombreCorto(n.persona.nombre)}
                  onClick={() => abrirDetalle(n.persona.id)}
                />
              </div>
            );
          })}
        </div>

        <div
          className="mono"
          style={{ padding: '0 20px 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 500, letterSpacing: '.06em', color: 'var(--fg-4)' }}
        >
          CERCA DEL CENTRO = MÁS CERCANO A TI
        </div>
      </div>
      <button
        type="button"
        onClick={abrirNuevo}
        aria-label="Agregar persona"
        style={{
          position: 'absolute',
          right: 20,
          bottom: 108,
          width: 58,
          height: 58,
          borderRadius: 999,
          border: 'none',
          background: 'var(--accent)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          boxShadow: '0 10px 30px rgba(var(--accent-rgb),.45)',
        }}
      >
        <IconPlus size={26} />
      </button>
    </>
  );
}
