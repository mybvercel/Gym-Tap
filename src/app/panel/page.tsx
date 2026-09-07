"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { MAQUINAS, SUCURSALES, buscarModelo, proximoServicio } from "@/datos/catalogo";
import { ESTADOS, type EstadoMaquina, type Maquina, type Servicio } from "@/datos/tipos";
import {
  FALLAS,
  VACIO,
  cambiarEstado,
  cerrarTicket,
  crudoEstados,
  crudoLecturas,
  crudoServicios,
  crudoTickets,
  limpiarDemo,
  registrarServicio,
  suscribir,
  type LecturaRegistrada,
  type Ticket,
} from "@/lib/local";

/**
 * El panel.
 *
 * Ordenado por lo que hay que hacer, no por lo que se puede mirar: primero lo
 * que está roto, después lo que hay que revisar, y al final el uso, que es
 * información para decidir compras y horarios pero no pide una acción hoy.
 *
 * Todo filtra por sucursal porque es la unidad real del negocio: se instala
 * por sucursal, se cobra por sucursal y el encargado de una no tiene por qué
 * mirar los problemas de la otra.
 */
export default function Panel() {
  const [sucursal, setSucursal] = useState(SUCURSALES[0].id);
  const [editando, setEditando] = useState<Maquina | null>(null);

  const tickets = useDato<Ticket[]>(crudoTickets, VACIO);
  const lecturas = useDato<LecturaRegistrada[]>(crudoLecturas, VACIO);
  const estados = useDato<Record<string, EstadoMaquina>>(crudoEstados, "{}");
  const servicios = useDato<Record<string, Servicio[]>>(crudoServicios, "{}");

  const maquinas = MAQUINAS.filter((m) => m.sucursal === sucursal);
  const ids = new Set(maquinas.map((m) => m.id));

  /** El estado guardado en el panel pisa al del catálogo. */
  const estadoDe = (m: Maquina): EstadoMaquina => estados[m.id] ?? m.estado;
  /** Lo mismo con el service: el último registrado gana. */
  const servicioDe = (m: Maquina) => servicios[m.id]?.[0] ?? m.ultimoServicio;

  const abiertos = tickets.filter((t) => ids.has(t.maquina));
  // Sin memorizar a mano: son 500 lecturas como mucho y el compilador de React
  // ya se encarga. Un useMemo con un Set recreado en cada render no memoriza
  // nada, solo agrega ruido.
  const uso = new Map<string, number>();
  for (const l of lecturas) {
    if (ids.has(l.maquina)) uso.set(l.maquina, (uso.get(l.maquina) ?? 0) + 1);
  }

  const escaneos = [...uso.values()].reduce((a, b) => a + b, 0);
  const maximo = Math.max(1, ...uso.values());
  const fueraDeServicio = maquinas.filter((m) => estadoDe(m) === "fuera-de-servicio").length;
  const vencidas = maquinas.filter((m) => {
    const s = servicioDe(m);
    if (!s) return true;
    return proximoServicio({ ...m, ultimoServicio: s })!.diasRestantes < 0;
  }).length;

  return (
    <main className="marco ancho">
      <header className="cabecera">
        <div className="migas">
          <Link href="/">Máquinas</Link>
          <span>·</span>
          <span>Panel</span>
        </div>
        <h1>Panel de operaciones</h1>
      </header>

      <div className="zonas">
        {SUCURSALES.map((s) => (
          <button
            key={s.id}
            type="button"
            className="zona"
            aria-pressed={sucursal === s.id}
            onClick={() => setSucursal(s.id)}
          >
            {s.nombre}
          </button>
        ))}
      </div>

      {/* Los números que se miran de reojo antes de decidir qué hacer. */}
      <div className="tarjetas">
        <Tarjeta valor={escaneos} etiqueta="escaneos" />
        <Tarjeta valor={abiertos.length} etiqueta="reportes abiertos" alerta={abiertos.length > 0} />
        <Tarjeta valor={fueraDeServicio} etiqueta="fuera de servicio" alerta={fueraDeServicio > 0} />
        <Tarjeta valor={vencidas} etiqueta="service vencido" alerta={vencidas > 0} />
      </div>

      <section className="panel">
        <p className="rotulo">Lo que reportaron los socios</p>
        {abiertos.length === 0 ? (
          <p className="suave chico">
            Nada abierto. Cuando alguien reporte una falla desde una máquina, aparece acá.
          </p>
        ) : (
          <div className="errores">
            {abiertos
              .sort((a, b) => b.reportes - a.reportes)
              .map((t) => {
                const falla = FALLAS.find((f) => f.id === t.tipo);
                return (
                  <div
                    className="error"
                    data-gravedad={falla?.sacaDeServicio ? "lesion" : "desgaste"}
                    key={`${t.maquina}-${t.tipo}`}
                  >
                    <span className="marca">
                      {t.reportes} {t.reportes === 1 ? "reporte" : "reportes"}
                    </span>
                    <h3>
                      {falla?.etiqueta} · {t.etiqueta}
                    </h3>
                    <p>
                      Último:{" "}
                      {new Date(t.ultimo).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {t.nota && ` · ${t.nota}`}
                    </p>
                    <button
                      type="button"
                      className="secundaria"
                      onClick={() => cerrarTicket(t.maquina, t.tipo)}
                    >
                      Marcar resuelto
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      <section className="panel">
        <p className="rotulo">Máquinas de la sucursal</p>
        <div className="lista">
          {maquinas.map((m) => {
            const estado = estadoDe(m);
            const servicio = servicioDe(m);
            const proximo = servicio ? proximoServicio({ ...m, ultimoServicio: servicio }) : null;
            return (
              <div className="maquina" key={m.id}>
                <div className="maquina-cab">
                  <span>
                    <span className="fila-titulo">{m.etiqueta}</span>
                    <br />
                    <span className="suave chico">{buscarModelo(m.modelo)?.nombre}</span>
                  </span>
                  <span className="codigo">{m.codigo}</span>
                </div>

                <div className="maquina-datos">
                  <span className="estado" data-estado={estado}>
                    {ESTADOS[estado]}
                  </span>
                  <span className="chico suave">
                    {proximo
                      ? proximo.diasRestantes < 0
                        ? `Service vencido hace ${-proximo.diasRestantes} días`
                        : `Próximo service en ${proximo.diasRestantes} días`
                      : "Sin service registrado"}
                  </span>
                  <span className="chico suave">{uso.get(m.id) ?? 0} escaneos</span>
                </div>

                <div className="maquina-acciones">
                  <select
                    className="selector"
                    value={estado}
                    aria-label={`Estado de ${m.etiqueta}`}
                    onChange={(e) => cambiarEstado(m.id, e.target.value as EstadoMaquina)}
                  >
                    {Object.entries(ESTADOS).map(([id, etiqueta]) => (
                      <option key={id} value={id}>
                        {etiqueta}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="secundaria" onClick={() => setEditando(m)}>
                    Registrar service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <p className="rotulo">Uso por máquina</p>
        <p className="chico suave">
          Cada vez que alguien apoya el teléfono queda anotado. Con eso se ve qué
          máquina tiene cola y cuál junta polvo, sin poner un sensor.
        </p>
        <div className="lista">
          {maquinas
            .map((m) => ({ m, n: uso.get(m.id) ?? 0 }))
            .sort((a, b) => b.n - a.n)
            .map(({ m, n }) => (
              <div key={m.id} className="barra-fila">
                <span className="chico">{m.etiqueta}</span>
                <div className="barra">
                  <div className="barra-relleno" style={{ width: `${(n / maximo) * 100}%` }} />
                </div>
                <span className="chico suave cifra-chica">{n}</span>
              </div>
            ))}
        </div>
      </section>

      <div className="aviso">
        <strong>Esto es una demo.</strong>
        <span>
          Los datos viven en este navegador. En producción son una base por
          cliente y un aviso al staff en el momento del reporte.
        </span>
      </div>

      <div className="lista">
        <button type="button" className="secundaria" onClick={limpiarDemo}>
          Borrar datos de la demo
        </button>
        <Link className="secundaria" href="/">
          Volver
        </Link>
      </div>

      {editando && <FormularioService maquina={editando} onCerrar={() => setEditando(null)} />}
    </main>
  );
}

/** El servidor no tiene nada de esto: devuelve vacío y el navegador completa. */
function useDato<T>(leer: () => string, porDefecto: string): T {
  const crudo = useSyncExternalStore(suscribir, leer, () => porDefecto);
  return useMemo(() => JSON.parse(crudo) as T, [crudo]);
}

function Tarjeta({ valor, etiqueta, alerta }: { valor: number; etiqueta: string; alerta?: boolean }) {
  return (
    <div className="tarjeta" data-alerta={alerta}>
      <span className="tarjeta-valor">{valor}</span>
      <span className="tarjeta-etq">{etiqueta}</span>
    </div>
  );
}

/**
 * Registrar el service cierra el círculo: deja la máquina operativa y borra sus
 * reportes. Si el técnico arregló y el reporte sigue abierto, el panel miente.
 */
function FormularioService({ maquina, onCerrar }: { maquina: Maquina; onCerrar: () => void }) {
  const [tecnico, setTecnico] = useState("");
  const [problema, setProblema] = useState("");
  const [repuesto, setRepuesto] = useState("");

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    registrarServicio(maquina.id, {
      fecha: new Date().toISOString().slice(0, 10),
      tecnico: tecnico.trim() || "Sin registrar",
      problema: problema.trim() || "Revisión general",
      repuesto: repuesto.trim() || undefined,
    });
    onCerrar();
  }

  return (
    <div className="fondo-modal" onClick={onCerrar} role="presentation">
      <form className="modal" onSubmit={guardar} onClick={(e) => e.stopPropagation()}>
        <p className="rotulo">{maquina.codigo}</p>
        <h2>Registrar service · {maquina.etiqueta}</h2>

        <label className="campo">
          <span className="pico">Técnico</span>
          <input value={tecnico} onChange={(e) => setTecnico(e.target.value)} autoFocus />
        </label>
        <label className="campo">
          <span className="pico">Qué se encontró</span>
          <input value={problema} onChange={(e) => setProblema(e.target.value)} />
        </label>
        <label className="campo">
          <span className="pico">Repuesto</span>
          <input value={repuesto} onChange={(e) => setRepuesto(e.target.value)} />
        </label>

        <p className="chico suave">
          Al guardar, la máquina queda operativa y se cierran sus reportes.
        </p>

        <button type="submit" className="accion">
          Guardar
        </button>
        <button type="button" className="secundaria" onClick={onCerrar}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
