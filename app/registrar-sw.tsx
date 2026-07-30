'use client';

import { useEffect } from 'react';

export default function RegistrarSW() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // offline-first es best-effort; si falla el registro la app sigue funcionando online
      });
    }
  }, []);
  return null;
}
