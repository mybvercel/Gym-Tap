"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { MAQUINAS, MODELOS } from "@/datos/catalogo";

/** El origen no existe en el servidor, así que se lee del navegador sin
 *  copiarlo a estado: es un valor externo, no estado de la pantalla. */
const sinCambios = () => () => {};

/**
 * El mapa de chips.
 *
 * Cada máquina tiene una URL propia y fija: eso es lo que la hace única. El
 * chip no guarda contenido, guarda una dirección; el contenido se actualiza
 * del lado del servidor y el chip pegado en la prensa no se toca nunca más.
 *
 * El origen se lee del navegador para que la lista sirva igual en la demo local
 * y en el dominio real, sin tener que editar nada.
 */
export default function Tags() {
  const origen = useSyncExternalStore(
    sinCambios,
    () => window.location.origin,
    () => "",
  );
  const [copiado, setCopiado] = useState<string | null>(null);

  async function copiar(id: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(id);
      setTimeout(() => setCopiado(null), 1600);
    } catch {
      /* Sin permiso de portapapeles: la URL está a la vista para copiarla a mano. */
    }
  }

  return (
    <main className="marco">
      <header className="cabecera">
        <div className="migas">
          <Link href="/">Máquinas</Link>
          <span>·</span>
          <span>Instalación</span>
        </div>
        <h1>Qué grabar en cada chip</h1>
        <p className="suave">
          Un chip por máquina, con su dirección propia. Es lo único que hace
          falta escribir: el contenido vive en el servidor y se actualiza sin
          volver a tocar el chip.
        </p>
      </header>

      <section className="panel">
        <p className="rotulo">Los 3 pasos con NFC Tools</p>
        <div className="pasos">
          <div className="paso">
            <span className="paso-num" aria-hidden="true">1</span>
            <div>
              <h2>Escribir → Agregar registro → URL</h2>
              <p className="paso-detalle">Pegá la dirección de la máquina, tal cual está abajo.</p>
            </div>
          </div>
          <div className="paso">
            <span className="paso-num" aria-hidden="true">2</span>
            <div>
              <h2>Escribir y apoyar el chip</h2>
              <p className="paso-detalle">Un chip NTAG213 alcanza y sobra: la dirección ocupa 22 bytes de los 144.</p>
            </div>
          </div>
          <div className="paso">
            <span className="paso-num" aria-hidden="true">3</span>
            <div>
              <h2>Bloquear como solo lectura</h2>
              <p className="paso-detalle">
                Cinco segundos por chip y no se puede deshacer. Sin esto, cualquiera
                con un teléfono reescribe el chip de la prensa y lo apunta a donde
                quiera.
              </p>
              <span className="referencia">No te saltees este paso</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="rotulo">Direcciones</p>
        <div className="lista">
          {MAQUINAS.map((m) => {
            const modelo = MODELOS.find((x) => x.id === m.modelo);
            const url = `${origen}/m/${m.id}`;
            return (
              <div className="fila" key={m.id} style={{ alignItems: "flex-start" }}>
                <span style={{ minWidth: 0 }}>
                  <span className="fila-titulo">{m.etiqueta}</span>
                  <br />
                  <span className="suave chico">{modelo?.nombre}</span>
                  <br />
                  <span className="url-tag">{url || `/m/${m.id}`}</span>
                </span>
                <button
                  type="button"
                  className="zona"
                  style={{ minWidth: "5.5rem", flexShrink: 0 }}
                  onClick={() => copiar(m.id, url)}
                >
                  {copiado === m.id ? "Copiado" : "Copiar"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <p className="rotulo">Dónde va pegado</p>
        <p className="chico suave">
          En el bastidor fijo, a la altura de los ojos de alguien sentado en la
          máquina. Nunca en una parte que se mueve ni donde apoya la espalda. El
          sticker lleva el chip adentro y el QR impreso encima: en iPhone la
          lectura automática funciona de XS en adelante y con la pantalla
          desbloqueada, y para todo lo demás está el QR.
        </p>
      </section>

      <Link className="secundaria" href="/">
        Volver
      </Link>
    </main>
  );
}
