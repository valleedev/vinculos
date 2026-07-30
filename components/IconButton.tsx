import type { ReactNode } from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: ReactNode;
  label: string;
  size?: number;
}

export default function IconButton({ onClick, children, label, size = 38 }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        border: '1px solid var(--line)',
        background: 'var(--surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--fg-1)',
      }}
    >
      {children}
    </button>
  );
}
