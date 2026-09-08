"use client";

import { useState } from "react";
import { CERTEZA, MUSCULOS, type Modelo, type Musculo } from "@/datos/tipos";
import { MapaMuscular } from "./MapaMuscular";
import { Diagrama } from "./Diagrama";

/**
 * Lo primero que ve alguien que escaneó: qué trabaja esta máquina.
 *
 * El orden responde a la única pregunta que trae a una persona hasta acá. Si
 * ya sabe usar la máquina, viene a saber qué músculo le pega y cómo cambiarlo;
 * si no sabe, viene a que le expliquen. Por eso el mapa está arriba y las
 * instrucciones aparecen abajo mientras no haya elegido nada: el que sabe no
 * tiene que pasar por encima de un instructivo que no necesita, y el que no
 * sabe lo encuentra sin buscar.
 */
export function Entrenar({ modelo, children }: { modelo: Modelo; children: React.ReactNode }) {
  const [foco, setFoco] = useState<Musculo | null>(null);
  const variantes = foco ? modelo.variantes.filter((v) => v.objetivo.includes(foco)) : [];

  return (
    <>
      <section className="panel">
        <p className="rotulo">Qué trabaja esta máquina</p>
        <MapaMuscular trabaja={modelo.musculos} foco={foco} />

        <div className="zonas">
          {modelo.musculos.map((m) => (
            <button
              key={m}
              type="button"
              className="zona"
              aria-pressed={foco === m}
              onClick={() => setFoco(foco === m ? null : m)}
            >
              {MUSCULOS[m]}
            </button>
          ))}
        </div>

        <p className="chico suave">
          {foco
            ? "Tocá de nuevo para volver a las instrucciones de la máquina."
            : "Tocá un músculo y te digo cómo regularla para que se lo lleve él."}
        </p>
      </section>

      {foco ? (
        <section className="panel">
          <p className="rotulo">Para {MUSCULOS[foco].toLowerCase()}</p>

          <div className="variantes">
            {variantes.map((v) => (
              <article className="variante" key={v.id}>
                <div className="variante-dibujo">
                  <Diagrama dibujo={v.dibujo} />
                </div>

                <div className="variante-texto">
                  <div className="variante-titulo">
                    <h3>{v.nombre}</h3>
                    <span className="certeza" data-nivel={v.certeza}>
                      {CERTEZA[v.certeza]}
                    </span>
                  </div>

                  <p className="ajuste">{v.ajuste}</p>
                  <p className="porque">
                    <span className="pico">Por qué</span> {v.porque}
                  </p>
                  {v.rango && (
                    <p className="dato">
                      <span className="pico">Hasta dónde</span> {v.rango}
                    </p>
                  )}
                  {v.ojo && (
                    <p className="dato ojo">
                      <span className="pico">Ojo</span> {v.ojo}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <p className="suave chico">
            Ninguna posición aísla un músculo: cambia el reparto del trabajo, no
            el ejercicio.
          </p>
        </section>
      ) : (
        /* Sin selección, lo que corresponde es enseñar a usarla. Llega ya
           armado desde el servidor, así que no cuesta nada tenerlo listo. */
        children
      )}
    </>
  );
}
