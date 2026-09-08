import type { Musculo } from "@/datos/tipos";

/**
 * El mapa muscular: cuerpo de frente y de espalda, con los músculos que
 * trabaja la máquina pintados en rojo.
 *
 * Está dibujado y no es una imagen por una razón que decide todo: hay que
 * poder encender un músculo distinto según la máquina y según lo que la
 * persona elija. Con imágenes harían falta diez versiones por máquina, todas
 * distintas entre sí y ninguna actualizable. Acá cada músculo es una figura
 * con nombre y se pinta sola a partir de los datos.
 *
 * La técnica: el contorno del cuerpo se define una vez como recorte, y los
 * músculos se dibujan como formas simples por encima. El recorte los ajusta al
 * borde del cuerpo, así que las formas pueden ser redondeadas y sencillas y aun
 * así quedan prolijas. Sin eso habría que dibujar a mano el contorno exacto de
 * cada músculo, que es donde este tipo de gráfico se vuelve imposible de
 * mantener.
 *
 * Un detalle que cuesta una tarde si no se sabe: dentro de un `clipPath` solo
 * valen figuras sueltas. Un `<g>` ahí adentro el navegador lo ignora, el
 * recorte queda vacío y desaparece todo el dibujo sin ningún error. Por eso las
 * figuras del contorno van directas y el desplazamiento de cada cuerpo se hace
 * afuera: el recorte se resuelve en el espacio ya desplazado.
 */

interface Props {
  /** Los músculos que trabaja la máquina. Se dibujan apagados si no hay foco. */
  trabaja: Musculo[];
  /** El que la persona eligió. Se enciende en rojo pleno. */
  foco?: Musculo | null;
}

export function MapaMuscular({ trabaja, foco }: Props) {
  /**
   * Tres estados y no dos: el músculo elegido va en rojo pleno, los otros que
   * la máquina también trabaja quedan en un rojo apagado, y el resto es cuerpo.
   * Sin el estado del medio se pierde la respuesta a "qué más hace esta
   * máquina", que es justo lo que vino a ver la persona.
   */
  const estado = (m: Musculo) =>
    foco === m ? "foco" : trabaja.includes(m) ? "trabaja" : "neutro";

  return (
    <svg
      className="mapa"
      viewBox="0 0 264 316"
      role="img"
      aria-label={
        foco
          ? `Cuerpo humano con ${foco} marcado en rojo`
          : "Cuerpo humano con los músculos que trabaja esta máquina marcados en rojo"
      }
    >
      <defs>
        {/* De frente y de espalda la silueta es la misma: se define una vez. */}
        <clipPath id="contorno-cuerpo">
          <ellipse cx="60" cy="27" rx="15" ry="18" />
          <rect x="52" y="38" width="16" height="18" rx="6" />
          <path d="M36 60 Q60 45 84 60 L82 112 Q80 140 78 158 L42 158 Q40 140 38 112 Z" />
          <rect x="17" y="58" width="20" height="122" rx="10" transform="rotate(5 27 119)" />
          <rect x="83" y="58" width="20" height="122" rx="10" transform="rotate(-5 93 119)" />
          <rect x="41" y="150" width="19" height="140" rx="9.5" transform="rotate(2 50 220)" />
          <rect x="60" y="150" width="19" height="140" rx="9.5" transform="rotate(-2 70 220)" />
        </clipPath>
      </defs>

      <g transform="translate(6 0)">
        <Cuerpo>
          <Frente estado={estado} />
        </Cuerpo>
      </g>

      <g transform="translate(138 0)">
        <Cuerpo>
          <Espalda estado={estado} />
        </Cuerpo>
      </g>

      <text className="mapa-pie" x="66" y="310" textAnchor="middle">
        FRENTE
      </text>
      <text className="mapa-pie" x="198" y="310" textAnchor="middle">
        ESPALDA
      </text>
    </svg>
  );
}

/** La silueta plana, y encima los músculos, los dos recortados al contorno. */
function Cuerpo({ children }: { children: React.ReactNode }) {
  return (
    <g clipPath="url(#contorno-cuerpo)">
      <rect className="mapa-cuerpo" x="0" y="0" width="120" height="300" />
      {children}
    </g>
  );
}

type Estado = (m: Musculo) => string;

function Frente({ estado }: { estado: Estado }) {
  return (
    <>
      <ellipse className="m" data-e={estado("hombro")} cx="36" cy="67" rx="13" ry="12" />
      <ellipse className="m" data-e={estado("hombro")} cx="84" cy="67" rx="13" ry="12" />

      <ellipse className="m" data-e={estado("pectoral")} cx="49" cy="81" rx="14" ry="13" />
      <ellipse className="m" data-e={estado("pectoral")} cx="71" cy="81" rx="14" ry="13" />

      <ellipse className="m" data-e={estado("biceps")} cx="26" cy="98" rx="10" ry="21" />
      <ellipse className="m" data-e={estado("biceps")} cx="94" cy="98" rx="10" ry="21" />

      {/* Aductores: la cara interna del muslo, entre las dos piernas. */}
      <ellipse className="m" data-e={estado("aductores")} cx="56" cy="198" rx="6" ry="28" />
      <ellipse className="m" data-e={estado("aductores")} cx="64" cy="198" rx="6" ry="28" />

      <ellipse className="m" data-e={estado("cuadriceps")} cx="47" cy="206" rx="11" ry="38" />
      <ellipse className="m" data-e={estado("cuadriceps")} cx="73" cy="206" rx="11" ry="38" />
    </>
  );
}

function Espalda({ estado }: { estado: Estado }) {
  return (
    <>
      {/* Espalda alta: trapecio y romboides, lo que da el grosor. */}
      <ellipse className="m" data-e={estado("espalda-alta")} cx="60" cy="68" rx="25" ry="16" />

      <ellipse className="m" data-e={estado("hombro")} cx="36" cy="67" rx="13" ry="12" />
      <ellipse className="m" data-e={estado("hombro")} cx="84" cy="67" rx="13" ry="12" />

      {/* Dorsal: las alas que dan el ancho. */}
      <ellipse className="m" data-e={estado("dorsal")} cx="47" cy="104" rx="15" ry="25" />
      <ellipse className="m" data-e={estado("dorsal")} cx="73" cy="104" rx="15" ry="25" />

      <ellipse className="m" data-e={estado("triceps")} cx="26" cy="98" rx="10" ry="21" />
      <ellipse className="m" data-e={estado("triceps")} cx="94" cy="98" rx="10" ry="21" />

      <ellipse className="m" data-e={estado("gluteo")} cx="50" cy="168" rx="13" ry="15" />
      <ellipse className="m" data-e={estado("gluteo")} cx="70" cy="168" rx="13" ry="15" />

      <ellipse className="m" data-e={estado("isquios")} cx="48" cy="212" rx="12" ry="34" />
      <ellipse className="m" data-e={estado("isquios")} cx="72" cy="212" rx="12" ry="34" />
    </>
  );
}
