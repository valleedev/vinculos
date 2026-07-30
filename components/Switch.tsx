import styles from './Switch.module.css';

interface SwitchProps {
  on: boolean;
  onToggle: () => void;
  label: string;
}

export default function Switch({ on, onToggle, label }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={styles.track}
      style={{ background: on ? 'var(--accent)' : 'var(--line-strong)' }}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <div className={styles.knob} style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }} />
    </button>
  );
}
