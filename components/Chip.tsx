import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'primario' | 'secundario';
  height?: number;
  fontSize?: number;
  padding?: string;
}

const ESTILOS = {
  primario: { bg: 'rgba(var(--accent-rgb),.16)', bd: 'rgba(var(--accent-rgb),.40)', fg: 'var(--accent-strong)' },
  secundario: { bg: 'rgba(var(--accent-2-rgb),.16)', bd: 'rgba(var(--accent-2-rgb),.42)', fg: 'var(--accent-2)' },
};

export default function Chip({ label, active, onClick, variant = 'primario', height = 32, fontSize = 12.5, padding = '0 14px' }: ChipProps) {
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
