import type { Metadata, Viewport } from 'next';
import './globals.css';
import RegistrarSW from './registrar-sw';
import { SCRIPT_INICIO_TEMA } from '@/lib/tema';

export const metadata: Metadata = {
  title: 'Vínculos',
  description: 'Un mapa privado de quién es quién en tu vida.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vínculos',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
  themeColor: '#1f1f1f',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_INICIO_TEMA }} />
        <RegistrarSW />
        {children}
      </body>
    </html>
  );
}
