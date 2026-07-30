'use client';

import { useApp } from '@/lib/store';

export default function Toast() {
  const toast = useApp((s) => s.toast);
  if (!toast) return null;
  return (
    <div
      role="status"
      style={{
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 104,
        zIndex: 60,
        padding: '14px 16px',
        borderRadius: 16,
        background: 'var(--surface-3)',
        border: '1px solid var(--line-strong)',
        boxShadow: '0 12px 32px rgba(0,0,0,.6)',
        font: '500 14px var(--font-sans)',
        animation: 'vFadeUp .25s ease both',
      }}
    >
      {toast}
    </div>
  );
}
