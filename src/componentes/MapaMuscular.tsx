import { ESPALDA, FRENTE, type GrupoMuscular } from "@/datos/anatomia";
import type { Musculo } from "@/datos/tipos";

/**
 * El mapa muscular: cuerpo de frente y de espalda, con lo que trabaja la
 * máquina pintado en amarillo.
 *
 * El cuerpo no es una imagen, y esa es la decisión que ordena todo: hay que
 * poder encender un músculo distinto según la máquina y según lo que la
 * persona elija. Con imágenes harían falta diez versiones por máquina, todas
 * distintas entre sí y ninguna actualizable.
 *
 * Los polígonos vienen de una biblioteca de anatomía con licencia MIT
 * (`src/datos/anatomia.ts`) en vez de estar dibujados a mano. Es la diferencia
 * entre un cuerpo con veintidós grupos musculares bien ubicados y uno hecho de
 * elipses: nadie sabe decir por qué, pero se nota al instante.
 *
 * El cuerpo entero está hecho de esos polígonos, así que no hace falta una
 * silueta aparte: la unión de todos los músculos ES la silueta.
 */

interface Props {
  /** Los músculos que trabaja la máquina. Se dibujan apagados si no hay foco. */
  trabaja: Musculo[];
  /** El que la persona eligió. Se enciende en amarillo pleno. */
  foco?: Musculo | null;
}

/**
 * Qué polígonos corresponden a cada músculo de nuestro catálogo.
 *
 * Los nombres del origen están en inglés y algunos agrupan distinto: el hombro
 * son dos piezas según de qué lado se mire, y el dorsal allá se llama
 * `upper-back`.
 */
const PIEZAS: Record<Musculo, string[]> = {
  cuadriceps: ["quadriceps"],
  gluteo: ["gluteal"],
  isquios: ["hamstring"],
  aductores: ["abductors", "adductor"],
  dorsal: ["upper-back"],
  "espalda-alta": ["trapezius"],
  pectoral: ["chest"],
  hombro: ["front-deltoids", "back-deltoids"],
  triceps: ["triceps"],
  biceps: ["biceps"],
};

/** El músculo de nuestro catálogo al que pertenece un grupo del dibujo. */
function nuestro(grupo: string): Musculo | null {
  for (const [musculo, piezas] of Object.entries(PIEZAS)) {
    if (piezas.includes(grupo)) return musculo as Musculo;
  }
  return null;
}

export function MapaMuscular({ trabaja, foco }: Props) {
  /**
   * Tres estados y no dos: el elegido en amarillo pleno, los otros que la
   * máquina también trabaja en amarillo apagado, y el resto del cuerpo en gris.
   * Sin el estado del medio se pierde la respuesta a "qué más hace esta
   * máquina", que es justo lo que la persona vino a ver.
   */
  const estado = (grupo: string) => {
    const m = nuestro(grupo);
    if (!m) return "neutro";
    if (foco === m) return "foco";
    return trabaja.includes(m) ? "trabaja" : "neutro";
  };

  return (
    <svg
      className="mapa"
      viewBox="0 0 212 232"
      role="img"
      aria-label={
        foco
          ? `Cuerpo humano con ${foco} marcado`
          : "Cuerpo humano con los músculos que trabaja esta máquina marcados"
      }
    >
      <Cuerpo grupos={FRENTE} estado={estado} x={2} />
      <Cuerpo grupos={ESPALDA} estado={estado} x={112} />

      <text className="mapa-pie" x="52" y="228" textAnchor="middle">
        FRENTE
      </text>
      <text className="mapa-pie" x="162" y="228" textAnchor="middle">
        ESPALDA
      </text>
    </svg>
  );
}

function Cuerpo({
  grupos,
  estado,
  x,
}: {
  grupos: GrupoMuscular[];
  estado: (grupo: string) => string;
  x: number;
}) {
  return (
    /* El origen viene en 100 de ancho y llega hasta 220 de alto: el sóleo se
       pasa de los 200 nominales. Se dibuja al 96 % para que los dos cuerpos
       entren al lado del otro con aire entre ellos. */
    <g transform={`translate(${x} 2) scale(0.96)`}>
      {grupos.map((grupo) =>
        grupo.poligonos.map((puntos, i) => (
          <polygon
            key={`${grupo.musculo}-${i}`}
            className="m"
            data-e={estado(grupo.musculo)}
            points={puntos}
          />
        )),
      )}
    </g>
  );
}
