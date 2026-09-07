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

/**
 * Sentadilla, de perfil, mirando a la izquierda.
 *
 * Las proporciones están puestas a mano hasta que la postura se lee sola: el
 * torso inclinado hacia adelante, la cadera atrás, la rodilla sobre el pie. Un
 * grado de más en el torso y parece alguien agachándose a atarse los cordones.
 *
 * Un solo acento de color por figura. Cuando el amarillo aparece en tres
 * lugares deja de señalar nada.
 */
export function Sentadilla({ color, acento }: Props) {
  return (
    <svg viewBox="0 0 110 130" width="100%" height="100%" role="img" aria-label="Persona haciendo sentadilla">
      <g fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        {/* Torso: del hombro a la cadera, que queda atrás y abajo. */}
        <path d="M54 44 L70 76" />
        {/* Pierna de atrás, un poco corrida para dar profundidad. */}
        <path d="M70 76 L52 96 L56 116" />
        {/* Pierna de adelante y el pie apoyado entero. */}
        <path d="M70 76 L42 94 L46 116" />
        <path d="M34 118 L58 118" />
        {/* Brazos al frente, sosteniendo el equilibrio. */}
        <path d="M54 44 L30 54" />
      </g>
      <circle cx="46" cy="26" r="11" fill={acento} />
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
