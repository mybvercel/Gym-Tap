/**
 * Los dos pictogramas de la tarjeta.
 *
 * Trazo grueso con puntas redondeadas, como la señalética deportiva: se
 * reconocen a dos metros y sobreviven a una impresión barata. Nada de degradés
 * ni sombras, que en papel mate se convierten en manchas grises.
 *
 * Cada figura lleva un color propio para que se distingan de lejos, y el color
 * no dice nada del género: son los dos acentos de la marca, repartidos.
 */

interface Props {
  color: string;
  acento: string;
}

/** Sentadilla con los brazos al frente. */
export function Sentadilla({ color, acento }: Props) {
  return (
    <svg viewBox="0 0 110 130" width="100%" height="100%" role="img" aria-label="Persona haciendo sentadilla">
      <g fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        {/* Torso inclinado: es lo que hace que se lea como sentadilla y no como alguien parado. */}
        <path d="M56 34 L48 68" />
        <path d="M48 68 L74 78 L71 112" />
        <path d="M48 68 L62 82 L60 112" />
        <path d="M53 42 L72 46 L88 38" />
      </g>
      <circle cx="58" cy="20" r="12" fill={acento} />
      <g stroke={acento} strokeWidth="9" strokeLinecap="round">
        <path d="M71 112 L84 112" />
        <path d="M60 112 L73 112" />
      </g>
    </svg>
  );
}

/** Press de hombros con barra. */
export function PressBarra({ color, acento }: Props) {
  return (
    <svg viewBox="0 0 110 130" width="100%" height="100%" role="img" aria-label="Persona haciendo press con barra">
      <g fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M55 40 L55 78" />
        <path d="M55 78 L40 100 L38 118" />
        <path d="M55 78 L70 100 L72 118" />
        <path d="M55 46 L36 40 L33 24" />
        <path d="M55 46 L74 40 L77 24" />
      </g>
      <circle cx="55" cy="26" r="12" fill={acento} />
      {/* La barra y los discos: sin esto es una persona con los brazos arriba. */}
      <rect x="20" y="18" width="70" height="8" rx="4" fill={color} />
      <rect x="14" y="8" width="10" height="28" rx="3" fill={acento} />
      <rect x="86" y="8" width="10" height="28" rx="3" fill={acento} />
    </svg>
  );
}

/** Ondas de contacto: el gesto de apoyar el teléfono. */
export function IconoNFC({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="Apoyá el teléfono">
      <rect x="14" y="18" width="34" height="64" rx="6" fill="none" stroke={color} strokeWidth="6" />
      <rect x="24" y="28" width="14" height="3" rx="1.5" fill={color} />
      <g fill="none" stroke={color} strokeWidth="6" strokeLinecap="round">
        <path d="M60 38 a 16 16 0 0 1 0 24" />
        <path d="M71 30 a 28 28 0 0 1 0 40" />
        <path d="M82 22 a 40 40 0 0 1 0 56" />
      </g>
    </svg>
  );
}
