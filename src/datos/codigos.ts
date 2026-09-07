/**
 * Los códigos impresos.
 *
 * Un QR no se puede editar después de imprimirlo: lo que dice, lo dice para
 * siempre. Por eso no apunta a `/m/prensa-45` sino a un código opaco sin
 * significado. El código no dice qué máquina es; lo dice esta tabla, que sí se
 * puede cambiar.
 *
 * Consecuencia práctica: se pueden imprimir cuatrocientas tarjetas antes de
 * saber a qué máquina va cada una, y asignarlas mientras se instalan. Si mañana
 * mueven la prensa a otra sede o la reemplazan por otra marca, se cambia una
 * línea acá y el sticker pegado sigue sirviendo.
 *
 * El alfabeto de los códigos evita los caracteres que se confunden al leerlos
 * o dictarlos por teléfono: no hay 0 ni O, no hay 1 ni l ni I.
 */

export interface Codigo {
  /** Lo que va impreso en el QR. No cambia nunca. */
  codigo: string;
  /** A qué unidad física apunta hoy. `null` = todavía sin asignar. */
  maquina: string | null;
  /** Para saber de qué tirada salió cuando aparezca una tarjeta huérfana. */
  tirada: string;
}

export const CODIGOS: Codigo[] = [
  { codigo: "vktgd5", maquina: null, tirada: "2026-09 prueba" },
  { codigo: "jbzpnw", maquina: null, tirada: "2026-09 prueba" },
];

/** El dominio propio es lo que hace que el código dure: no vence con un proveedor. */
export const BASE_QR = "https://www.mybdigitals.com/q";

export const urlDeCodigo = (codigo: string) => `${BASE_QR}/${codigo}`;

export function buscarCodigo(codigo: string): Codigo | undefined {
  return CODIGOS.find((c) => c.codigo === codigo.toLowerCase());
}
