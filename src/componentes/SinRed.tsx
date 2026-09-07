"use client";

import { useEffect } from "react";

/**
 * Registra el trabajador de servicio.
 *
 * Solo en producción: en desarrollo, un caché agresivo hace que los cambios no
 * aparezcan y se pierde media hora buscando un bug que no existe.
 *
 * No dibuja nada. El aviso de que no hay red lo da la propia ficha cuando no
 * puede cargarse; poner un cartel de "estás sin conexión" arriba de una página
 * que se abrió perfecto desde el caché sería mentirle a la persona.
 */
export function SinRed() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    // Después del primer pintado: registrar compite por la misma red que está
    // usando la ficha para mostrarse.
    const registrar = () => void navigator.serviceWorker.register("/sw.js");
    if (document.readyState === "complete") registrar();
    else window.addEventListener("load", registrar, { once: true });
  }, []);

  return null;
}
