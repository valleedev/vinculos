import styles from './Avatar.module.css';

interface AvatarProps {
  size: number;
  padding?: number;
  anillo: string;
  iniciales: string;
  iniSize?: number;
  microLabel?: string;
  fotoUrl?: string | null;
}

export default function Avatar({ size, padding = 2, anillo, iniciales, iniSize = 15, microLabel, fotoUrl }: AvatarProps) {
  return (
    <div className={styles.ring} style={{ width: size, height: size, padding, background: anillo }}>
      <div className={styles.inner}>
        {fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fotoUrl} alt="" className={styles.foto} />
        ) : (
          <>
            <span className={styles.ini} style={{ fontSize: iniSize }}>
              {iniciales}
            </span>
            {microLabel && <span className={styles.micro} style={{ fontSize: Math.max(8, iniSize * 0.32) }}>{microLabel}</span>}
          </>
        )}
      </div>
    </div>
  );
}
