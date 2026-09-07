"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { EstadoMaquina } from "@/datos/tipos";
import { crudoEstados, suscribir } from "@/lib/local";

/**
 * El aviso de que la máquina no está para usarse.
 *
 * Cierra el círculo del panel: si el encargado la marca fuera de servicio, el
 * próximo que apoye el teléfono se entera antes de sentarse. Sin esto, el
 * estado del panel es una anotación interna que no le sirve a nadie.
 *
 * Se lee en el navegador y no en el servidor a propósito: la ficha es estática
 * y tiene que llegar en un viaje de red. El estado es lo único que cambia
 * seguido, así que es lo único que se busca aparte.
 */
export function Estado({ maquina, inicial }: { maquina: string; inicial: EstadoMaquina }) {
  const crudo = useSyncExternalStore(suscribir, crudoEstados, () => "{}");
  const estado = useMemo(
    () => (JSON.parse(crudo) as Record<string, EstadoMaquina>)[maquina] ?? inicial,
    [crudo, maquina, inicial],
  );

  if (estado === "operativa") return null;

  return (
    <div className="banner" data-estado={estado}>
      <strong>
        {estado === "fuera-de-servicio" ? "Máquina fuera de servicio" : "Máquina en observación"}
      </strong>
      <span>
        {estado === "fuera-de-servicio"
          ? "No la uses. El staff ya está avisado."
          : "Se puede usar, pero está reportada. Si notás algo raro, avisá."}
      </span>
    </div>
  );
}
