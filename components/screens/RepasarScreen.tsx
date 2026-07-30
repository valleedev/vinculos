'use client';

import { useApp } from '@/lib/store';
import { usePersonas, useFotoUrl } from '@/lib/hooks';
import { apodoTexto, iniciales, mazoRepaso } from '@/lib/derive';
import { responderRepaso } from '@/lib/repo';
import Avatar from '../Avatar';
import { IconCheck } from '../icons';

export default function RepasarScreen() {
  const personas = usePersonas();
  const deckIds = useApp((s) => s.deckIds);
  const rIdx = useApp((s) => s.rIdx);
  const rRev = useApp((s) => s.rRev);
  const aciertos = useApp((s) => s.aciertos);
  const revelar = useApp((s) => s.revelar);
  const avanzarCarta = useApp((s) => s.avanzarCarta);
  const iniciarDeck = useApp((s) => s.iniciarDeck);
  const ir = useApp((s) => s.ir);

  const deck = (deckIds ?? []).map((id) => personas.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const listo = deck.length > 0 && rIdx >= deck.length;
  const activo = deck.length > 0 && !listo;
  const cartaP = deck[rIdx];
  const fotoUrl = useFotoUrl(cartaP?.foto);

  async function responder(ok: boolean) {
    if (!cartaP) return;
    await responderRepaso(cartaP.id, ok);
    avanzarCarta(ok);
  }

  const mensaje =
    aciertos === deck.length ? 'Perfecto. Todos suben de nivel y vuelven más adelante.' : 'Los que fallaste vuelven mañana, más seguido que el resto.';

  return (
    <div
      data-screen-label="Repaso"
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 'var(--safe-top)', paddingLeft: 20, paddingRight: 20, paddingBottom: 110, animation: 'vFade .3s ease both' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
          Repaso de hoy
        </div>
        <div style={{ font: "700 28px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>¿Quién es?</div>
      </div>

      {deck.length === 0 && (
        <div style={{ padding: '40px 0', textAlign: 'center', font: '400 14px var(--font-sans)', color: 'var(--fg-3)' }}>
          Aún no tienes a nadie que repasar. Agrega tu primera persona desde el mapa.
        </div>
      )}

      {activo && cartaP && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {deck.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: i < rIdx ? '#7C5CFF' : i === rIdx ? 'rgba(124,92,255,.5)' : 'var(--track)',
                  transition: 'background .3s',
                }}
              />
            ))}
          </div>
          <div
            style={{
              padding: 22,
              borderRadius: 22,
              background: 'var(--surface-1)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--sombra-tarjeta)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
              animation: 'vFlip .4s ease both',
            }}
            key={cartaP.id}
          >
            <Avatar size={150} padding={3} anillo="var(--gradient-marca)" iniciales={iniciales(cartaP.nombre)} iniSize={28} microLabel="FOTO DEL ROSTRO" fotoUrl={fotoUrl} />
            {!rRev && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  textAlign: 'center',
                  font: '400 13.5px/1.5 var(--font-sans)',
                  color: 'var(--fg-2)',
                  maxWidth: 290,
                }}
              >
                Pista: {cartaP.rasgo}
              </div>
            )}
            {rRev && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'vFadeUp .3s ease both' }}>
                <div style={{ font: "700 26px var(--font-sans)", letterSpacing: '-.02em' }}>{cartaP.nombre}</div>
                <div style={{ font: '400 14px var(--font-sans)', color: 'var(--fg-2)' }}>{apodoTexto(cartaP.apodo)}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div
                    className="mono"
                    style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(124,92,255,.16)', border: '1px solid rgba(124,92,255,.4)', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9579ff' }}
                  >
                    {cartaP.circulo}
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--surface-2)', border: '1px solid var(--line)', font: '500 11px var(--font-sans)', color: 'var(--fg-2)' }}>
                    {cartaP.donde}
                  </div>
                </div>
              </div>
            )}
          </div>
          {!rRev && (
            <button
              type="button"
              onClick={revelar}
              style={{ height: 52, border: '1px solid var(--accent-line)', borderRadius: 16, background: 'var(--accent-ghost)', color: 'var(--fg-1)', font: '600 16px var(--font-sans)', cursor: 'pointer' }}
            >
              Ver la respuesta
            </button>
          )}
          {rRev && (
            <div style={{ display: 'flex', gap: 10, animation: 'vFadeUp .3s ease both' }}>
              <button
                type="button"
                onClick={() => responder(false)}
                style={{ flex: 1, height: 52, border: '1px solid rgba(239,68,68,.42)', borderRadius: 16, background: 'rgba(239,68,68,.15)', color: 'var(--fg-1)', font: '600 15px var(--font-sans)', cursor: 'pointer' }}
              >
                No lo recordé
              </button>
              <button
                type="button"
                onClick={() => responder(true)}
                style={{ flex: 1, height: 52, border: '1px solid rgba(34,197,94,.42)', borderRadius: 16, background: 'rgba(34,197,94,.15)', color: 'var(--fg-1)', font: '600 15px var(--font-sans)', cursor: 'pointer' }}
              >
                Lo recordé
              </button>
            </div>
          )}
          <div className="mono" style={{ textAlign: 'center', fontSize: 11, fontWeight: 500, letterSpacing: '.08em', color: 'var(--fg-4)' }}>
            TARJETA {Math.min(rIdx + 1, deck.length)} DE {deck.length}
          </div>
        </div>
      )}

      {listo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', paddingTop: 30, animation: 'vFadeUp .4s ease both' }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, background: 'rgba(34,197,94,.15)', border: '1px solid rgba(34,197,94,.42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCheck size={40} color="#22C55E" strokeWidth={1.9} />
          </div>
          <div style={{ font: "700 24px var(--font-sans)", letterSpacing: '-.02em' }}>Repaso terminado</div>
          <div className="mono" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1 }}>
            {aciertos}/{deck.length}
          </div>
          <div style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--fg-2)', textAlign: 'center', maxWidth: 270 }}>{mensaje}</div>
          <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 8 }}>
            <button
              type="button"
              onClick={() => iniciarDeck(mazoRepaso(personas))}
              style={{ flex: 1, height: 50, border: '1px solid var(--line-strong)', borderRadius: 16, background: 'var(--surface-2)', color: 'var(--fg-1)', font: '600 15px var(--font-sans)', cursor: 'pointer' }}
            >
              Otra vuelta
            </button>
            <button
              type="button"
              onClick={() => ir('mapa')}
              style={{ flex: 1, height: 50, border: 'none', borderRadius: 16, background: 'var(--accent)', color: '#fff', font: '600 15px var(--font-sans)', cursor: 'pointer' }}
            >
              Ver mapa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
