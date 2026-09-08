"use client";

import { useState } from "react";
import { ZONAS, type Modelo, type Zona } from "@/datos/catalogo";

/**
 * Adaptador por molestia.
 *
 * Solo se ofrecen las zonas que esta máquina realmente carga. Inventar un
 * ajuste de muñeca para una prensa sería relleno, y el relleno en un módulo de
 * dolor es peor que no tener el módulo.
 */
export function Dolor({ modelo }: { modelo: Modelo }) {
  const [zona, setZona] = useState<Zona | null>(null);
  const adaptacion = zona ? modelo.dolor[zona] : undefined;
  const cargadas = ZONAS.filter((z) => modelo.dolor[z.id]);

  return (
    <section className="panel">
      <h2 className="titulo-seccion">¿Te molesta algo?</h2>
      <div className="chips">
        {cargadas.map((z) => (
          <button
            key={z.id}
            type="button"
            className="chip-musculo"
            aria-pressed={zona === z.id}
            onClick={() => setZona(zona === z.id ? null : z.id)}
          >
            {z.etiqueta}
          </button>
        ))}
      </div>

      {adaptacion && (
        <div className="respuesta">
          <p>{adaptacion.ajuste}</p>
          {adaptacion.evitar && <p className="evitar">Evitá: {adaptacion.evitar}</p>}
          {adaptacion.derivar && (
            <p className="derivar">
              Si con esto sigue doliendo, no insistas hoy: habláte con el profe.
            </p>
          )}
        </div>
      )}

      {!zona && (
        <p className="suave chico">
          {cargadas.length < ZONAS.length
            ? "Esta máquina no carga las zonas que no aparecen. Si igual te duele, avisale al profe."
            : "Tocá dónde te molesta y te digo qué cambiar en esta misma máquina."}
        </p>
      )}
    </section>
  );
}
