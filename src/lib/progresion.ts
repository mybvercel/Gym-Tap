import type { Carga } from "./local";
import type { Pauta } from "@/datos/tipos";

/**
 * Qué toca hacer hoy, a partir de lo que se hizo la vez pasada.
 *
 * Progresión doble: primero se suben las repeticiones dentro del rango y recién
 * cuando se llega arriba se sube el peso y se vuelve al piso del rango. Es la
 * única forma de progresar que no obliga a nadie a calcular porcentajes parado
 * al lado de una máquina.
 *
 * Vive acá y no adentro de la pantalla porque es una regla, no un dibujo: así
 * se prueba sin navegador y no cambia sin que alguien lo note.
 */
export const SALTO_KG = 2.5;

export interface Sugerencia {
  peso: number;
  reps: number;
  /** true = tocó subir la carga. La pantalla lo festeja distinto. */
  subio: boolean;
}

export function siguienteSerie(anterior: Carga | undefined, pauta: Pauta): Sugerencia | null {
  if (!anterior) return null;
  const [min, max] = pauta.reps;

  if (anterior.reps >= max) {
    return { peso: anterior.peso + SALTO_KG, reps: min, subio: true };
  }

  // Todavía hay rango por delante: mismo peso, una repetición más.
  return { peso: anterior.peso, reps: Math.min(anterior.reps + 1, max), subio: false };
}
