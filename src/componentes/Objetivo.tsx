"use client";

import { useState } from "react";
import { CERTEZA, MUSCULOS, type Modelo, type Musculo } from "@/datos/tipos";
import { Diagrama } from "./Diagrama";

/**
 * Qué querés entrenar hoy.
 *
 * Es el bloque que justifica el producto. La misma máquina sirve para cosas
 * distintas según dónde apoyes o cómo agarres, y esa información existe pero
 * está repartida entre el que tuvo un buen profe y el que no.
 *
 * Cada variante dice qué mover, por qué cambia el reparto y qué tan firme es lo
 * que se está afirmando. Ese último dato es el que evita que esto se convierta
 * en el típico contenido de gimnasio que suena técnico y no resiste una
 * medición.
 */
export function Objetivo({ modelo }: { modelo: Modelo }) {
  // Arranca con el primero elegido: una pantalla vacía no muestra nada de lo
  // que la máquina sabe hacer.
  const [musculo, setMusculo] = useState<Musculo>(modelo.musculos[0]);
  const variantes = modelo.variantes.filter((v) => v.objetivo.includes(musculo));

  return (
    <section className="panel">
      <p className="rotulo">¿Qué querés entrenar?</p>

      <div className="zonas">
        {modelo.musculos.map((m) => (
          <button
            key={m}
            type="button"
            className="zona"
            aria-pressed={musculo === m}
            onClick={() => setMusculo(m)}
          >
            {MUSCULOS[m]}
          </button>
        ))}
      </div>

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

      {modelo.variantes.length > 1 && (
        <p className="suave chico">
          Ninguna posición aísla un músculo: cambia el reparto del trabajo, no el
          ejercicio.
        </p>
      )}
    </section>
  );
}
