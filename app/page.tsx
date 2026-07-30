'use client';

import { useApp } from '@/lib/store';
import TabBar from '@/components/TabBar';
import Toast from '@/components/Toast';
import LoginScreen from '@/components/screens/LoginScreen';
import MapaScreen from '@/components/screens/MapaScreen';
import DetalleScreen from '@/components/screens/DetalleScreen';
import NuevoScreen from '@/components/screens/NuevoScreen';
import RepasarScreen from '@/components/screens/RepasarScreen';
import PersonasScreen from '@/components/screens/PersonasScreen';
import AjustesScreen from '@/components/screens/AjustesScreen';

export default function Home() {
  const screen = useApp((s) => s.screen);
  const mostrarTabs = screen !== 'login' && screen !== 'nuevo' && screen !== 'detalle';

  return (
    <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden', background: 'var(--bg-1)', color: 'var(--fg-1)' }}>
      {screen === 'login' && <LoginScreen />}
      {screen === 'mapa' && <MapaScreen />}
      {screen === 'personas' && <PersonasScreen />}
      {screen === 'repasar' && <RepasarScreen />}
      {screen === 'ajustes' && <AjustesScreen />}
      {screen === 'detalle' && <DetalleScreen />}
      {screen === 'nuevo' && <NuevoScreen />}
      {mostrarTabs && <TabBar />}
      <Toast />
    </div>
  );
}
