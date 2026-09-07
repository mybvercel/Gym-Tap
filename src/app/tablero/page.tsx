"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MAQUINAS, MODELOS, GIMNASIO } from "@/datos/catalogo";
import { FALLAS, leerLecturas, leerTickets, limpiarDemo, type Ticket } from "@/lib/local";

/**
 * El panel del dueño.
 *
 * Las dos cosas por las que paga: qué está roto y qué se usa. El resto del
 * producto es lo que hace que los socios generen estos dos datos sin que nadie
 * se los pida.
 */
export default function Tablero() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [uso, setUso] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setTickets(leerTickets());
    const cuenta = new Map<string, number>();
    for (const l of leerLecturas()) cuenta.set(l.maquina, (cuenta.get(l.maquina) ?? 0) + 1);
    setUso(cuenta);
  }, []);

  const maximo = Math.max(1, ...uso.values());

  return (
    <main className="marco">
      <header className="cabecera">
        <div className="migas">
          <Link href="/">{GIMNASIO}</Link>
          <span>·</span>
          <span>Panel</span>
        </div>
        <h1>Panel del gimnasio</h1>
      </header>

      <section className="panel">
        <p className="rotulo">Fallas abiertas</p>
        {tickets === null ? (
          <p className="suave chico">Cargando…</p>
        ) : tickets.length === 0 ? (
          <p className="suave chico">
            Nada roto. Cuando alguien reporte una falla desde una máquina, aparece acá.
          </p>
        ) : (
          <div className="lista">
            {tickets.map((t, i) => {
              const falla = FALLAS.find((f) => f.id === t.tipo);
              return (
                <div className="error" data-gravedad={t.fueraDeServicio ? "lesion" : "desgaste"} key={i}>
                  <span className="marca">
                    {t.fueraDeServicio ? "Fuera de servicio" : `${t.reportes} reporte${t.reportes > 1 ? "s" : ""}`}
                  </span>
                  <h3>
                    {falla?.etiqueta} · {t.etiqueta}
                  </h3>
                  <p>
                    {new Date(t.creado).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {t.reportes > 1 && ` · lo reportaron ${t.reportes} personas`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel">
        <p className="rotulo">Uso por máquina</p>
        <p className="chico suave">
          Cada vez que alguien apoya el teléfono queda anotado. Con eso se ve qué
          máquina tiene cola y cuál junta polvo, sin poner un sensor.
        </p>
        <div className="lista">
          {MAQUINAS.map((m) => {
            const n = uso.get(m.id) ?? 0;
            const modelo = MODELOS.find((x) => x.id === m.modelo);
            return (
              <div key={m.id} style={{ display: "grid", gap: "0.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                  <span className="chico">
                    {m.etiqueta} <span className="suave">· {modelo?.nombre}</span>
                  </span>
                  <span className="chico suave" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {n}
                  </span>
                </div>
                {/* Barra proporcional al máximo del día: lo que importa es la
                    comparación entre máquinas, no el número absoluto. */}
                <div style={{ height: 8, borderRadius: 4, background: "var(--panel-alto)" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(n / maximo) * 100}%`,
                      borderRadius: 4,
                      background: n > 0 ? "var(--ambar)" : "transparent",
                      transition: "width 300ms var(--curva)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="aviso">
        <strong>Esto es una demo.</strong>
        <span>
          Los datos viven en este teléfono. En producción son una base y un aviso
          al staff por WhatsApp o Slack en el momento.
        </span>
      </div>

      <div className="lista">
        <button
          type="button"
          className="secundaria"
          onClick={() => {
            limpiarDemo();
            setTickets([]);
            setUso(new Map());
          }}
        >
          Borrar datos de la demo
        </button>
        <Link className="secundaria" href="/">
          Volver
        </Link>
      </div>
    </main>
  );
}
