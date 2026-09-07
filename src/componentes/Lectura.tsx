"use client";

import { useEffect, useRef } from "react";
import { registrarLectura } from "@/lib/local";

/**
 * Registra que alguien apoyó el teléfono en esta máquina.
 *
 * No dibuja nada. Es el dato que después arma el mapa de calor de uso, y sale
 * gratis: la lectura del chip ya ocurrió, solo hay que anotarla. En producción
 * esto es un `sendBeacon`, que sobrevive a que la persona cierre la pestaña.
 */
export function Lectura({ maquina }: { maquina: string }) {
  const anotado = useRef(false);

  useEffect(() => {
    if (anotado.current) return;
    anotado.current = true;
    registrarLectura(maquina);
  }, [maquina]);

  return null;
}
