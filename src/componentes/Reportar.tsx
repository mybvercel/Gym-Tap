"use client";

import { useCallback, useEffect, useState } from "react";
import { FALLAS, reportarFalla, type TipoFalla } from "@/lib/local";

/**
 * Reportar una falla, en un toque.
 *
 * Es un botón flotante y no una fila más de la pantalla porque las dos razones
 * para escanear son distintas y compiten: una persona viene a entrenar, otra
 * viene a avisar que algo se rompió. La segunda no tiene que scrollear una
 * ficha de técnica para encontrar dónde avisar.
 *
 * Rojo y redondo abajo a la derecha: es el lugar donde llega el pulgar sin
 * mover la mano, y el color lo separa del resto, que es amarillo de marca.
 *
 * La máquina ya se sabe (la dijo el código) y la hora también. Lo único que
 * hay que preguntar es qué se rompió, y eso son seis botones. Un formulario
 * acá garantiza que nadie reporte nunca nada.
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

  const falla = enviado && FALLAS.find((f) => f.id === enviado.tipo);

  return (
    <>
      <button
        type="button"
        className="flotante"
        data-enviado={!!enviado}
        onClick={() => setAbierto(true)}
        aria-label={enviado ? "Falla reportada" : "Reportar una falla en esta máquina"}
      >
        {enviado ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 7v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1.4" fill="currentColor" />
            <path
              d="M12 3 22 20H2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {enviado && (
        <div className="aviso exito" role="status">
          <span>Listo, el staff ya lo tiene.</span>
          <span style={{ color: "var(--texto-suave)", fontWeight: 400 }}>
            {falla?.etiqueta} en {etiqueta}
            {enviado.reportes > 1 && ` · ${enviado.reportes} personas lo reportaron`}
          </span>
        </div>
      )}

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
