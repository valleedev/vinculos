'use client';

import { useApp } from '@/lib/store';
import { usePersona, useFotoUrl } from '@/lib/hooks';
import { apodoTexto, fz, iniciales, mazoRepaso, relativo } from '@/lib/derive';
import { registrarEncuentro } from '@/lib/repo';
import Avatar from '../Avatar';
import IconButton from '../IconButton';
import { IconChevronLeft, IconPencil } from '../icons';

const ETIQUETA = { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--fg-3)' };

export default function DetalleScreen() {
  const selId = useApp((s) => s.selId);
  const volverMapa = useApp((s) => s.volverMapa);
  const setForm = useApp((s) => s.setForm);
  const abrirEdicion = useApp((s) => s.abrirEdicion);
  const ir = useApp((s) => s.ir);
  const iniciarDeck = useApp((s) => s.iniciarDeck);
  const mostrarToast = useApp((s) => s.mostrarToast);

  const p = usePersona(selId);
  const fotoUrl = useFotoUrl(p?.foto);

  if (!p) return null;
  const f = fz(p.fuerza);

  async function onRegistrarEncuentro() {
    if (!p) return;
    await registrarEncuentro(p.id);
    mostrarToast(`Encuentro con ${p.nombre.split(' ')[0]} registrado.`);
  }

  function onRepasar() {
    if (!p) return;
    iniciarDeck(mazoRepaso([], p.id));
    ir('repasar');
  }

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

  const datos = [
    { k: 'Dónde', v: p.donde },
    { k: 'Trabajo', v: p.trabajo },
    { k: 'Círculo', v: p.circulo },
    { k: 'Notas', v: p.notas },
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
          <Avatar size={88} padding={3} anillo={f.color} iniciales={iniciales(p.nombre)} iniSize={22} microLabel="FOTO" fotoUrl={fotoUrl} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ font: "700 25px/1.15 var(--font-sans)", letterSpacing: '-.02em' }}>{p.nombre}</div>
            <div style={{ font: '400 14px var(--font-sans)', color: 'var(--fg-2)' }}>{apodoTexto(p.apodo)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div
                className="mono"
                style={{ padding: '3px 9px', borderRadius: 999, background: 'rgba(124,92,255,.16)', border: '1px solid rgba(124,92,255,.4)', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9579ff' }}
              >
                {p.circulo}
              </div>
              <div className="mono" style={{ fontSize: 11, fontWeight: 500, color: 'var(--fg-3)' }}>
                visto {relativo(p.ultimoAt)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 16px', borderRadius: 16, background: 'var(--surface-1)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={ETIQUETA}>Memoria</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: f.color }}>
                {f.palabra}
              </span>
              <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>
                {p.fuerza}%
              </span>
            </div>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--track)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${p.fuerza}%`, borderRadius: 3, background: f.color, transition: 'width .4s ease' }} />
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: 'linear-gradient(160deg, rgba(124,92,255,.14) 0%, #101522 55%)',
            border: '1px solid var(--accent-line)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ ...ETIQUETA, color: '#9579ff' }}>Cómo lo reconozco</div>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={ETIQUETA}>Encuentros</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {p.encuentros.map((e, i) => (
              <div key={e.id} style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 'none', width: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--accent)', marginTop: 6 }} />
                  {i < p.encuentros.length - 1 && <div style={{ flex: 1, width: 1, background: 'var(--line)' }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div className="mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.06em', color: 'var(--fg-2)' }}>
                    {e.fecha}
                  </div>
                  <div style={{ font: '400 14px/1.45 var(--font-sans)' }}>{e.nota}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onRegistrarEncuentro}
            style={{ flex: 1, height: 52, border: '1px solid var(--line-strong)', borderRadius: 16, background: 'var(--surface-2)', color: 'var(--fg-1)', font: '600 15px var(--font-sans)', cursor: 'pointer' }}
          >
            Registrar encuentro
          </button>
          <button
            type="button"
            onClick={onRepasar}
            style={{ flex: 1, height: 52, border: 'none', borderRadius: 16, background: 'var(--accent)', color: '#fff', font: '600 15px var(--font-sans)', cursor: 'pointer' }}
          >
            Repasar
          </button>
        </div>
      </div>
    </div>
  );
}
