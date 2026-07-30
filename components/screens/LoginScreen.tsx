'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { hayCredencialGuardada, registrarCredencial, verificarCredencial, webauthnSoportado } from '@/lib/webauthn';

export default function LoginScreen() {
  const ir = useApp((s) => s.ir);
  const mostrarToast = useApp((s) => s.mostrarToast);
  const [entrando, setEntrando] = useState(false);

  async function entrar() {
    if (entrando) return;
    setEntrando(true);
    if (!webauthnSoportado()) {
      ir('mapa');
      return;
    }
    const ok = hayCredencialGuardada() ? await verificarCredencial() : await registrarCredencial();
    if (!ok) {
      mostrarToast('No se pudo usar Face ID. Entrando de todos modos.');
    }
    ir('mapa');
  }

  return (
    <div
      data-screen-label="Bienvenida"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '120px 28px 56px',
        background:
          'radial-gradient(120% 70% at 50% 8%, rgba(var(--accent-rgb),.16) 0%, rgba(var(--bg-1-rgb),0) 62%), var(--bg-1)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: 'vFadeUp .5s ease both' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: 'var(--gradient-marca)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '700 26px var(--font-mono)',
            color: '#fff',
            boxShadow: '0 0 30px rgba(var(--accent-rgb),.35)',
          }}
        >
          V
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ font: "700 40px/1.05 var(--font-sans)", letterSpacing: '-.03em' }}>Vínculos</div>
          <div style={{ font: '400 17px/1.45 var(--font-sans)', color: 'var(--fg-2)', maxWidth: 290 }}>
            Recuerda a las personas, no sólo sus nombres. Un mapa privado de quién es quién en tu vida.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'vFadeUp .6s ease .1s both' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 16,
            border: '1px solid var(--line)',
            borderRadius: 18,
            background: 'var(--surface-1)',
          }}
        >
          <div className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
            Cómo funciona
          </div>
          <div style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--fg-2)' }}>
            Guardas un rostro, un rasgo que lo distingue y los datos que quieres recordar. La app te los repasa antes de que se te olviden.
          </div>
        </div>
        <button
          type="button"
          onClick={entrar}
          disabled={entrando}
          style={{
            height: 54,
            border: 'none',
            borderRadius: 16,
            background: 'var(--accent)',
            color: '#fff',
            font: '600 17px var(--font-sans)',
            cursor: 'pointer',
            boxShadow: 'var(--glow-primario)',
          }}
        >
          Entrar con Face ID
        </button>
        <div className="mono" style={{ textAlign: 'center', fontSize: 11, fontWeight: 500, letterSpacing: '.06em', color: 'var(--fg-4)' }}>
          TODO SE QUEDA EN ESTE IPHONE
        </div>
      </div>
    </div>
  );
}
