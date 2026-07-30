'use client';

import { useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { CIRCULOS_BASE, TEMAS, type Nota } from '@/lib/types';
import { cercaniaTexto } from '@/lib/derive';
import { actualizarPersona, crearPersona } from '@/lib/repo';
import { recortarYRedimensionar } from '@/lib/imagen';
import Chip from '../Chip';
import IconButton from '../IconButton';
import { IconPlus, IconX } from '../icons';

const ETIQUETA = { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--fg-3)' };
const CAMPO_INPUT: React.CSSProperties = {
  height: 50,
  padding: '0 15px',
  borderRadius: 14,
  border: '1px solid var(--line)',
  background: 'var(--surface-2)',
  font: '400 16px var(--font-sans)',
};
const CAMPO_TEXTAREA: React.CSSProperties = {
  padding: '14px 15px',
  borderRadius: 14,
  border: '1px solid var(--line)',
  background: 'var(--surface-2)',
  font: '400 15px/1.5 var(--font-sans)',
  resize: 'none',
};

function crearNotaId() {
  return 'nt' + Date.now() + Math.random().toString(36).slice(2, 6);
}

export default function NuevoScreen() {
  const paso = useApp((s) => s.paso);
  const form = useApp((s) => s.form);
  const editId = useApp((s) => s.editId);
  const setForm = useApp((s) => s.setForm);
  const siguientePaso = useApp((s) => s.siguientePaso);
  const pasoAnterior = useApp((s) => s.pasoAnterior);
  const cancelarNuevo = useApp((s) => s.cancelarNuevo);
  const mostrarToast = useApp((s) => s.mostrarToast);
  const guardadoOk = useApp((s) => s.guardadoOk);
  const abrirDetalle = useApp((s) => s.abrirDetalle);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notaDraft, setNotaDraft] = useState('');

  async function onArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await recortarYRedimensionar(file);
      setForm({ fotoDataUrl: dataUrl });
    } catch {
      mostrarToast('No se pudo procesar la foto.');
    }
  }

  function agregarNotaDraft() {
    const texto = notaDraft.trim();
    if (!texto) return;
    const nota: Nota = { id: crearNotaId(), texto, creadoEn: Date.now() };
    setForm({ notas: [nota, ...form.notas] });
    setNotaDraft('');
  }

  function quitarNotaDraft(id: string) {
    setForm({ notas: form.notas.filter((n) => n.id !== id) });
  }

  async function guardar() {
    if (editId) {
      await actualizarPersona(editId, form);
      guardadoOk();
      abrirDetalle(editId);
      mostrarToast(form.nombre.split(' ')[0] + ' se actualizó.');
    } else {
      const p = await crearPersona(form);
      guardadoOk();
      abrirDetalle(p.id);
      mostrarToast(p.nombre.split(' ')[0] + ' ya está en tu mapa.');
    }
  }

  function siguiente() {
    if (paso === 1 && !form.nombre.trim()) {
      mostrarToast('¿Cómo se llama? Sin nombre no puedo guardarlo.');
      return;
    }
    if (paso === 2 && esOtro && !form.circulo.trim()) {
      mostrarToast('Ponle un nombre a tu círculo.');
      return;
    }
    if (paso < 3) siguientePaso();
    else guardar();
  }

  const esOtro = !CIRCULOS_BASE.includes(form.circulo);
  const ctaTxt = paso === 3 ? 'Guardar persona' : 'Continuar';
  const ctaDeshabilitada = paso === 1 && !form.nombre.trim();
  const cerca = Number(form.cercania);

  return (
    <div
      data-screen-label="Nueva persona"
      style={{ position: 'absolute', inset: 0, background: 'var(--bg-1)', zIndex: 40, display: 'flex', flexDirection: 'column', animation: 'vSheet .32s cubic-bezier(.2,.9,.3,1) both' }}
    >
      <div style={{ paddingTop: 'var(--safe-top)', paddingLeft: 20, paddingRight: 20, paddingBottom: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={cancelarNuevo} label="Cancelar">
            <IconX />
          </IconButton>
          <div style={ETIQUETA}>Paso {paso} de 3</div>
          <div style={{ width: 38 }} />
        </div>
        <div style={{ height: 3, borderRadius: 2, background: 'var(--track)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(paso / 3) * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', borderRadius: 2, transition: 'width .35s ease' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        {paso === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'vFadeUp .3s ease both' }}>
            <div style={{ font: "700 26px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>¿A quién acabas de conocer?</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={onArchivo} style={{ display: 'none' }} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 132,
                  height: 132,
                  borderRadius: 999,
                  border: form.fotoDataUrl ? 'none' : '1px dashed var(--accent-line)',
                  backgroundColor: 'var(--surface-1)',
                  backgroundImage: form.fotoDataUrl
                    ? `url(${form.fotoDataUrl})`
                    : 'repeating-linear-gradient(135deg, rgba(var(--stripe-rgb),.09) 0 5px, transparent 5px 10px)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                {!form.fotoDataUrl && (
                  <>
                    <IconPlus color="var(--accent)" />
                    <div className="mono" style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: '.1em', color: 'var(--fg-3)' }}>
                      AÑADIR ROSTRO
                    </div>
                  </>
                )}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={ETIQUETA}>Nombre</div>
              <input value={form.nombre} onChange={(e) => setForm({ nombre: e.target.value })} placeholder="Camila Rojas" style={CAMPO_INPUT} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={ETIQUETA}>Cómo le llaman</div>
              <input value={form.apodo} onChange={(e) => setForm({ apodo: e.target.value })} placeholder="Cami" style={CAMPO_INPUT} />
            </div>
          </div>
        )}

        {paso === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'vFadeUp .3s ease both' }}>
            <div style={{ font: "700 26px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>¿Qué te ayuda a reconocerle?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={ETIQUETA}>Rasgo o detalle</div>
              <textarea
                value={form.rasgo}
                onChange={(e) => setForm({ rasgo: e.target.value })}
                placeholder="Lunar sobre la ceja izquierda, siempre con audífonos rojos y habla muy rápido."
                style={{ ...CAMPO_TEXTAREA, minHeight: 104 }}
              />
              <div style={{ font: '400 12px/1.5 var(--font-sans)', color: 'var(--fg-3)' }}>Mientras más raro el detalle, mejor lo recordarás.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={ETIQUETA}>Dónde se conocieron</div>
              <input
                value={form.donde}
                onChange={(e) => setForm({ donde: e.target.value })}
                placeholder="Curso de cerámica, mesa del fondo"
                style={CAMPO_INPUT}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={ETIQUETA}>Círculo</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CIRCULOS_BASE.map((c) => (
                  <Chip key={c} label={c} active={form.circulo === c} onClick={() => setForm({ circulo: c })} height={38} fontSize={13.5} padding="0 15px" />
                ))}
                <Chip label="Otro" active={esOtro} onClick={() => setForm({ circulo: '' })} height={38} fontSize={13.5} padding="0 15px" />
              </div>
              {esOtro && (
                <input
                  value={form.circulo}
                  onChange={(e) => setForm({ circulo: e.target.value })}
                  placeholder="Nombre de tu círculo"
                  style={{ ...CAMPO_INPUT, marginTop: 2 }}
                />
              )}
            </div>
          </div>
        )}

        {paso === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: 'vFadeUp .3s ease both' }}>
            <div style={{ font: "700 26px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>Lo que no quieres olvidar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={ETIQUETA}>Temas seguros</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TEMAS.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    variant="secundario"
                    active={form.temas.includes(t)}
                    onClick={() => setForm({ temas: form.temas.includes(t) ? form.temas.filter((x) => x !== t) : [...form.temas, t] })}
                    height={36}
                    fontSize={13}
                    padding="0 14px"
                  />
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
                      agregarNotaDraft();
                    }
                  }}
                  placeholder="Tiene una hija, Elena…"
                  style={{ ...CAMPO_INPUT, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={agregarNotaDraft}
                  style={{ flex: 'none', padding: '0 18px', borderRadius: 14, border: 'none', background: 'var(--surface-2)', color: 'var(--fg-1)', font: '600 14px var(--font-sans)', cursor: 'pointer' }}
                >
                  Agregar
                </button>
              </div>
              {form.notas.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.notas.map((n) => (
                    <div
                      key={n.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--line)' }}
                    >
                      <div style={{ flex: 1, font: '400 14px/1.4 var(--font-sans)' }}>{n.texto}</div>
                      <button
                        type="button"
                        onClick={() => quitarNotaDraft(n.id)}
                        aria-label="Quitar nota"
                        style={{ flex: 'none', width: 24, height: 24, borderRadius: 999, border: 'none', background: 'var(--surface-3)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <IconX size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={ETIQUETA}>Cercanía</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>
                  {cercaniaTexto(cerca)}
                </div>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={form.cercania}
                onChange={(e) => setForm({ cercania: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
              <div style={{ font: '400 12px/1.5 var(--font-sans)', color: 'var(--fg-3)' }}>Define qué tan cerca del centro aparece en tu mapa.</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 20px 40px', borderTop: '1px solid var(--line)', background: 'var(--bg-1)', display: 'flex', gap: 10 }}>
        {paso > 1 && (
          <button
            type="button"
            onClick={pasoAnterior}
            style={{ flex: 'none', width: 110, height: 52, border: '1px solid var(--line-strong)', borderRadius: 16, background: 'var(--surface-2)', color: 'var(--fg-1)', font: '600 15px var(--font-sans)', cursor: 'pointer' }}
          >
            Atrás
          </button>
        )}
        <button
          type="button"
          onClick={siguiente}
          style={{
            flex: 1,
            height: 52,
            border: 'none',
            borderRadius: 16,
            background: ctaDeshabilitada ? 'var(--accent-dim)' : 'var(--accent)',
            color: '#fff',
            font: '600 16px var(--font-sans)',
            cursor: 'pointer',
            transition: 'background .2s',
          }}
        >
          {ctaTxt}
        </button>
      </div>
    </div>
  );
}
