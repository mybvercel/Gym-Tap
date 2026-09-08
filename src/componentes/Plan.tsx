"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AVISO_GRASA, PAUTAS, type Objetivo } from "@/datos/tipos";
import { crudoCargas, guardarCarga, suscribir, type Carga } from "@/lib/local";
import { SALTO_KG, siguienteSerie } from "@/lib/progresion";

/**
 * El plan de hoy.
 *
 * Es lo que convierte el sticker de "cómo se usa esta máquina" en "qué te toca
 * hacer acá". Las series y repeticiones dependen del objetivo, no de la
 * máquina, así que la pauta es la misma en todas y lo que cambia es el peso.
 *
 * La regla de progresión vive en `lib/progresion` y está probada sin navegador:
 * acá solo se muestra.
 */

export function Plan({ modelo, unidad = "kg" }: { modelo: string; unidad?: string }) {
  const [objetivo, setObjetivo] = useState<Objetivo>("masa");
  const [verGrasa, setVerGrasa] = useState(false);

  const crudo = useSyncExternalStore(suscribir, crudoCargas, () => "{}");
  const anterior = useMemo(
    () => (JSON.parse(crudo) as Record<string, Carga>)[modelo],
    [crudo, modelo],
  );

  const pauta = PAUTAS.find((p) => p.id === objetivo)!;
  const [min, max] = pauta.reps;

  // Lo que hay que hacer hoy sale de lo que se hizo la vez pasada.
  const sugerido = siguienteSerie(anterior, pauta);

  const [peso, setPeso] = useState<number | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [guardado, setGuardado] = useState(false);

  const pesoActual = peso ?? sugerido?.peso ?? 0;
  const repsActual = reps ?? sugerido?.reps ?? min;

  function guardar() {
    guardarCarga(modelo, { peso: pesoActual, reps: repsActual, objetivo, fecha: Date.now() });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <section className="panel">
      <h2 className="titulo-seccion">¿Qué buscás hoy?</h2>

      <div className="chips">
        {PAUTAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="chip-musculo"
            aria-pressed={objetivo === p.id}
            onClick={() => {
              setObjetivo(p.id);
              setReps(null);
            }}
          >
            {p.etiqueta}
          </button>
        ))}
      </div>

      <div className="pauta">
        <div className="pauta-numeros">
          <span className="cifra corta">{pauta.series.replace(" series", "")}</span>
          <span className="cifra-etq">series</span>
          <span className="cifra">
            {min}–{max}
          </span>
          <span className="cifra-etq">repeticiones</span>
          <span className="cifra corta">{pauta.descanso}</span>
          <span className="cifra-etq">de pausa</span>
        </div>
        <p className="chico suave">{pauta.esfuerzo}</p>
      </div>

      {anterior ? (
        <div className="progresion">
          <p className="chico">
            <span className="pico">La vez pasada</span>
            {anterior.peso} {unidad} × {anterior.reps} reps
          </p>
          {sugerido?.subio ? (
            <p className="chico fuerte" style={{ color: "var(--ok)" }}>
              Llegaste arriba del rango: probá {sugerido.peso} {unidad} y volvé a {min}.
            </p>
          ) : (
            <p className="chico suave">
              Mismo peso, apuntá a {sugerido?.reps} repeticiones. {pauta.progresion}
            </p>
          )}
        </div>
      ) : (
        <p className="chico suave">
          Anotá la primera serie y la próxima vez te digo con cuánto seguir.
        </p>
      )}

      <div className="dos-cargas">
        <Paso etiqueta={unidad} valor={pesoActual} paso={SALTO_KG} min={0} onCambio={setPeso} />
        <Paso etiqueta="reps" valor={repsActual} paso={1} min={1} onCambio={setReps} />
      </div>

      <button type="button" className="accion" onClick={guardar}>
        {guardado ? "Guardado" : "Anotar la serie"}
      </button>

      <button type="button" className="enlace-tenue" onClick={() => setVerGrasa(!verGrasa)}>
        ¿Y si quiero bajar grasa?
      </button>
      {verGrasa && <p className="chico suave">{AVISO_GRASA}</p>}
    </section>
  );
}

/** Nadie escribe números con las manos transpiradas. */
function Paso({
  etiqueta,
  valor,
  paso,
  min,
  onCambio,
}: {
  etiqueta: string;
  valor: number;
  paso: number;
  min: number;
  onCambio: (v: number) => void;
}) {
  return (
    <div className="carga">
      <button
        type="button"
        className="zona"
        aria-label={`Bajar ${etiqueta}`}
        onClick={() => onCambio(Math.max(min, Math.round((valor - paso) * 10) / 10))}
      >
        −
      </button>
      <p className="valor">
        {valor}
        <span>{etiqueta}</span>
      </p>
      <button
        type="button"
        className="zona"
        aria-label={`Subir ${etiqueta}`}
        onClick={() => onCambio(Math.round((valor + paso) * 10) / 10)}
      >
        +
      </button>
    </div>
  );
}
