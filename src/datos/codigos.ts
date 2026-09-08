/**
 * Los códigos impresos.
 *
 * Un QR no se puede editar después de imprimirlo: lo que dice, lo dice para
 * siempre. Por eso no apunta a `/m/prensa-45`, que queda casado con el nombre
 * de hoy, sino a un código opaco sin significado. Qué máquina es lo dice esta
 * tabla, que sí se puede cambiar.
 *
 * Consecuencia práctica: se pueden imprimir cuatrocientas tarjetas antes de
 * saber a qué máquina va cada una, y asignarlas mientras se instalan. Si mañana
 * mueven la prensa a otra sede o la reemplazan por otra marca, se cambia una
 * línea acá y el sticker pegado sigue sirviendo.
 *
 * El alfabeto evita los caracteres que se confunden al leerlos o dictarlos por
 * teléfono: no hay 0 ni O, no hay 1 ni l ni I.
 */

/** Cómo se imprime ese QR. Solo aplica a los que se generan sueltos. */
export type ColorQR = "naranja" | "amarillo";

export interface Codigo {
  /** Lo que va impreso. No cambia nunca. */
  codigo: string;
  /** A qué unidad física apunta hoy. `null` = todavía sin asignar. */
  maquina: string | null;
  /** Para saber de qué tirada salió cuando aparezca una tarjeta huérfana. */
  tirada: string;
  color?: ColorQR;
}

export const CODIGOS: Codigo[] = [
  // Las dos sueltas, para armar a mano en Canva. Se asignan cuando se peguen.
  { codigo: "vktgd5", maquina: "p1", tirada: "2026-09 prueba", color: "naranja" },
  { codigo: "jbzpnw", maquina: null, tirada: "2026-09 prueba", color: "amarillo" },

  // Una por máquina del piloto. Las tarjetas ya se imprimen con estas.
  { codigo: "pz9jdj", maquina: "p1", tirada: "2026-09 piloto" },
  { codigo: "46wbq3", maquina: "p2", tirada: "2026-09 piloto" },
  { codigo: "rpmz3c", maquina: "e1", tirada: "2026-09 piloto" },
  { codigo: "vhdhdd", maquina: "j1", tirada: "2026-09 piloto" },
  { codigo: "xhxx9d", maquina: "r1", tirada: "2026-09 piloto" },
  { codigo: "5k787z", maquina: "b1", tirada: "2026-09 piloto" },
  { codigo: "wfkxht", maquina: "h1", tirada: "2026-09 piloto" },
  { codigo: "vhzpwh", maquina: "n1", tirada: "2026-09 piloto" },
  { codigo: "64f586", maquina: "n2", tirada: "2026-09 piloto" },
  { codigo: "dfpvxg", maquina: "n3", tirada: "2026-09 piloto" },
];

/**
 * El dominio de los códigos.
 *
 * Hoy es el de Vercel. Cuando esté el dominio propio se cambia esta línea y se
 * vuelven a generar los QR que todavía no se imprimieron; los ya pegados siguen
 * andando si el proyecto de Vercel queda vivo redirigiendo al nuevo.
 *
 * Es la única fuente de la dirección: la usan las tarjetas y el generador de
 * QR. Tener dos lugares donde escribir el dominio es garantía de que alguna vez
 * no coincidan, y ahí quedan tarjetas impresas apuntando a ningún lado.
 */
export const BASE_QR = "https://gym-tap-ahwd.vercel.app/q";

export const urlDeCodigo = (codigo: string) => `${BASE_QR}/${codigo}`;

export function buscarCodigo(codigo: string): Codigo | undefined {
  return CODIGOS.find((c) => c.codigo === codigo.toLowerCase());
}

/** El código permanente de una máquina, que es lo que va impreso en su tarjeta. */
export function codigoDeMaquina(maquina: string): Codigo | undefined {
  return CODIGOS.find((c) => c.maquina === maquina);
}
