import Link from "next/link";
import { MAQUINAS, MODELOS, unidadesPorModelo } from "@/datos/catalogo";

/**
 * El índice.
 *
 * En el gimnasio nadie entra por acá: se entra apoyando el teléfono en una
 * máquina. Esta pantalla existe para la demo, para el que llegó sin chip y para
 * el staff.
 */
export default function Inicio() {
  const sectores = [...new Set(MAQUINAS.map((m) => m.sector))];

  return (
    <main className="marco">
      <header className="cabecera">
        <p className="rotulo">Guía de sala</p>
        <h1>Ficha de Máquina</h1>
        <p className="suave">
          Apoyá el teléfono en el chip de la máquina y te dice cómo regularla,
          qué error te lesiona y qué hacer si algo te molesta.
        </p>
      </header>

      {sectores.map((sector) => (
        <section className="panel" key={sector}>
          <p className="rotulo">{sector}</p>
          <div className="lista">
            {MAQUINAS.filter((m) => m.sector === sector).map((m) => {
              const modelo = MODELOS.find((x) => x.id === m.modelo);
              return (
                <Link className="fila" href={`/m/${m.id}`} key={m.id}>
                  <span>
                    <span className="fila-titulo">{modelo?.nombre}</span>
                    <br />
                    <span className="suave chico">{m.etiqueta}</span>
                  </span>
                  <span className="tag">{m.id}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="panel">
        <p className="rotulo">Cómo está armado</p>
        <p className="chico suave">
          El contenido no está atado a este gimnasio. Hay{" "}
          <strong style={{ color: "var(--texto)" }}>{MODELOS.length} modelos</strong> de
          máquina en el catálogo y{" "}
          <strong style={{ color: "var(--texto)" }}>{MAQUINAS.length} unidades</strong>{" "}
          acá adentro: las dos prensas comparten la misma ficha, escrita una sola
          vez. Dar de alta un gimnasio nuevo es tildar qué máquinas tiene y pegar
          los stickers.
        </p>
        <div className="lista">
          {MODELOS.map((modelo) => (
            <div className="fila" key={modelo.id}>
              <span>
                <span className="fila-titulo">{modelo.nombre}</span>
                <br />
                <span className="suave chico">{modelo.familia}</span>
              </span>
              <span className="suave chico">
                {unidadesPorModelo(modelo.id)} unidad
                {unidadesPorModelo(modelo.id) > 1 ? "es" : ""}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="lista">
        <Link className="secundaria" href="/tags">
          Qué grabar en cada chip
        </Link>
        <Link className="secundaria" href="/panel">
          Panel de operaciones
        </Link>
      </div>
    </main>
  );
}
