import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'violeta' | 'cian';
  height?: number;
  fontSize?: number;
  padding?: string;
}

const ESTILOS = {
  violeta: { bg: 'rgba(124,92,255,.16)', bd: 'rgba(124,92,255,.40)', fg: '#9579ff' },
  cian: { bg: 'rgba(0,212,255,.14)', bd: 'rgba(0,212,255,.42)', fg: '#00D4FF' },
};

export default function Chip({ label, active, onClick, variant = 'violeta', height = 32, fontSize = 12.5, padding = '0 14px' }: ChipProps) {
  const on = ESTILOS[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.chip}
      style={{
        height,
        padding,
        fontSize,
        background: active ? on.bg : undefined,
        borderColor: active ? on.bd : undefined,
        color: active ? on.fg : undefined,
      }}
    >
      {label}
    </button>
  );
}
