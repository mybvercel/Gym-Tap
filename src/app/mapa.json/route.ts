import { MAQUINAS } from "@/datos/catalogo";

/**
 * El mapa de la sala.
 *
 * Lo consume el trabajador de servicio para precargar todas las fichas del
 * gimnasio en la primera lectura del día. Se genera en el build: es una lista
 * de identificadores que solo cambia cuando cambia el parque de máquinas.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json({ maquinas: MAQUINAS.map((m) => m.id) });
}
