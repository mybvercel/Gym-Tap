"use client";

import { useCallback, useEffect, useState } from "react";
import { FALLAS, reportarFalla, type TipoFalla } from "@/lib/local";

/**
 * Reporte de falla en un toque.
 *
 * La máquina ya se sabe (la dijo el chip) y la hora también. Lo único que hay
 * que preguntar es qué se rompió, y eso son seis botones. Pedir un formulario
 * acá es garantizar que nadie reporte nada.
 */
export function Reportar({ maquina, etiqueta }: { maquina: string; etiqueta: string }) {
  const [abierto, setAbierto] = useState(false);
  const [enviado, setEnviado] = useState<{ tipo: TipoFalla; reportes: number } | null>(null);

  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    if (!abierto) return;
    const alEscape = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", alEscape);
    return () => document.removeEventListener("keydown", alEscape);
  }, [abierto, cerrar]);

  function enviar(tipo: TipoFalla) {
    const t = reportarFalla(maquina, etiqueta, tipo);
    setEnviado({ tipo, reportes: t.reportes });
    setAbierto(false);
  }

  if (enviado) {
    const falla = FALLAS.find((f) => f.id === enviado.tipo);
    return (
      <div className="aviso exito" role="status">
        <span>Listo, el staff ya lo tiene.</span>
        <span style={{ color: "var(--texto-suave)", fontWeight: 400 }}>
          {falla?.etiqueta} en {etiqueta}
          {enviado.reportes > 1 && ` · ${enviado.reportes} personas lo reportaron`}
        </span>
      </div>
    );
  }

  return (
    <>
      <button type="button" className="secundaria" onClick={() => setAbierto(true)}>
        Reportar una falla
      </button>

      {abierto && (
        <div className="fondo-modal" onClick={cerrar} role="presentation">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Reportar falla en ${etiqueta}`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="rotulo">{etiqueta}</p>
            <h2>¿Qué se rompió?</h2>
            <div className="opciones">
              {FALLAS.map((f) => (
                <button key={f.id} type="button" className="zona" onClick={() => enviar(f.id)}>
                  {f.etiqueta}
                </button>
              ))}
            </div>
            <button type="button" className="secundaria" onClick={cerrar}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
