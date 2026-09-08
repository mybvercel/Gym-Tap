"use client";

import { useState } from "react";
import { CERTEZA, MUSCULOS, type Modelo, type Musculo } from "@/datos/tipos";
import { MapaMuscular } from "./MapaMuscular";
import { Diagrama } from "./Diagrama";

/**
 * Lo primero que ve alguien que escaneó: qué trabaja esta máquina.
 *
 * El mapa va sin caja, apoyado en el fondo. Es la portada de la pantalla y
 * meterlo adentro de una tarjeta lo pone al mismo nivel que el resto, que es
 * justo lo que no queremos: acá se decide todo lo que sigue.
 *
 * Los músculos son una fila que se desliza y no una grilla de botones. Una
 * grilla de dos por dos se lee como formulario; esto es un filtro, y un filtro
 * se ve como una fila de píldoras.
 */
export function Entrenar({ modelo, children }: { modelo: Modelo; children: React.ReactNode }) {
  const [foco, setFoco] = useState<Musculo | null>(null);
  const variantes = foco ? modelo.variantes.filter((v) => v.objetivo.includes(foco)) : [];

  return (
    <>
      <MapaMuscular trabaja={modelo.musculos} foco={foco} />

      <div className="chips">
        {modelo.musculos.map((m) => (
          <button
            key={m}
            type="button"
            className="chip-musculo"
            aria-pressed={foco === m}
            onClick={() => setFoco(foco === m ? null : m)}
          >
            {MUSCULOS[m]}
          </button>
        ))}
      </div>

      {foco ? (
        <section className="seccion">
          <h2 className="titulo-seccion">Para {MUSCULOS[foco].toLowerCase()}</h2>

          {/* La verdad que evita que alguien crea que cambió de ejercicio. */}
          <p className="aclaracion">
            Con esta máquina siempre trabajás todo. Mover los apoyos no aísla
            nada: corre el reparto para que se lo lleve más{" "}
            {MUSCULOS[foco].toLowerCase()}.
          </p>

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
        </section>
      ) : (
        /* Sin selección, lo que corresponde es enseñar a usarla. Llega ya
           armado desde el servidor, así que no cuesta nada tenerlo listo. */
        children
      )}
    </>
  );
}
