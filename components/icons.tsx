type IconProps = { size?: number; strokeWidth?: number; className?: string; color?: string };

const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function IconPlus({ size = 24, strokeWidth = 2, className, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? 'currentColor'} strokeWidth={strokeWidth} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconPencil({ size = 15, strokeWidth = 1.9, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={strokeWidth} className={className}>
      <path d="M4 20h4.2L19.5 8.7l-4.2-4.2L4 15.8V20Z" />
      <path d="M13.8 6l4.2 4.2" />
    </svg>
  );
}

export function IconChevronLeft({ size = 18, strokeWidth = 2, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={strokeWidth} className={className}>
      <path d="M15 4.5L7.8 12 15 19.5" />
    </svg>
  );
}

export function IconX({ size = 16, strokeWidth = 2, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={strokeWidth} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconCheck({ size = 40, strokeWidth = 1.9, className, color }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? 'currentColor'} strokeWidth={strokeWidth} className={className}>
      <path d="M5 12.6l4.6 4.6L19 7.2" />
    </svg>
  );
}

export function IconLupa({ size = 17, strokeWidth = 1.9, className, color }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? 'currentColor'} strokeWidth={strokeWidth} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

export function IconChevronRight({ size = 18, strokeWidth = 1.9, className, color }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color ?? 'currentColor'} strokeWidth={strokeWidth} className={className}>
      <path d="M9 4.5l7.2 7.5L9 19.5" />
    </svg>
  );
}

const TAB_PATHS: Record<string, string> = {
  mapa: '<circle cx="7" cy="6" r="2.2"></circle><circle cx="7" cy="18" r="2.2"></circle><circle cx="17" cy="7.5" r="2.2"></circle><path d="M7 8.2v7.6M17 9.7c0 4.3-4.2 3.2-4.2 7.3"></path>',
  repasar:
    '<path d="M12 6.2A3 3 0 0 0 6.5 8a3 3 0 0 0-1.3 5.4A3 3 0 0 0 9 18a3 3 0 0 0 3-1.4 3 3 0 0 0 3 1.4 3 3 0 0 0 3.8-4.6A3 3 0 0 0 17.5 8 3 3 0 0 0 12 6.2Z"></path><path d="M12 6.2v11.4"></path>',
  personas:
    '<rect x="3.4" y="3.4" width="7.2" height="7.2" rx="1.3"></rect><rect x="13.4" y="3.4" width="7.2" height="7.2" rx="1.3"></rect><rect x="3.4" y="13.4" width="7.2" height="7.2" rx="1.3"></rect><rect x="13.4" y="13.4" width="7.2" height="7.2" rx="1.3"></rect>',
  ajustes:
    '<circle cx="12" cy="12" r="3.2"></circle><path d="M12 2.6v2.4M12 19v2.4M21.4 12H19M5 12H2.6M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7M18.6 18.6l-1.7-1.7M7.1 7.1L5.4 5.4"></path>',
};

export function IconTab({ tab, size = 23 }: { tab: keyof typeof TAB_PATHS; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: TAB_PATHS[tab] }}
    />
  );
}
