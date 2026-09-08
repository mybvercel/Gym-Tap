import Link from "next/link";
import { notFound } from "next/navigation";
import { MAQUINAS, buscarMaquina } from "@/datos/catalogo";
import { Entrenar } from "@/componentes/Entrenar";
import { Plan } from "@/componentes/Plan";
import { Estado } from "@/componentes/Estado";
import { Dolor } from "@/componentes/Dolor";
import { Reportar } from "@/componentes/Reportar";
import { Lectura } from "@/componentes/Lectura";

/**
 * La ficha: el destino del código de esta máquina.
 *
 * Se genera estática, una por unidad física. El contenido llega ya escrito
 * dentro del HTML: sin consultas, sin esqueletos de carga y sin esperar a que
 * el JavaScript se hidrate para poder leer a qué altura va el asiento.
 *
 * El orden sale de la única pregunta que trae a alguien hasta acá. A una
 * máquina se llega por dos motivos que compiten: entrenar mejor, o avisar que
 * se rompió. El segundo tiene su propio botón flotante para no obligar a
 * scrollear; el primero manda en la página.
 */
export function generateStaticParams() {
  return MAQUINAS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ficha = buscarMaquina(id);
  return { title: ficha ? `${ficha.modelo.nombre} · ${ficha.maquina.etiqueta}` : "Ficha" };
}

const MARCA: Record<string, string> = {
  lesion: "Te lesiona",
  desgaste: "Te desgasta",
  "sin-estimulo": "No sirve",
};

export default async function Ficha({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ficha = buscarMaquina(id);
  if (!ficha) notFound();

  const { maquina, modelo } = ficha;

  /* Se arma en el servidor y se le pasa a `Entrenar`, que decide cuándo
     mostrarlo. Así el instructivo sigue siendo HTML estático. */
  const comoSeUsa = (
    <section className="panel">
      <p className="rotulo">Cómo se usa</p>

      {/* El video no se precarga nunca: son 280 KB que arruinan la carga de
          alguien que solo quería saber la altura del asiento. */}
      <div className="video">
        <p className="suave chico">10 segundos, sin audio, en bucle</p>
        <p className="chico" style={{ color: "var(--texto-tenue)" }}>
          Se graba en el gimnasio, con esta misma máquina.
        </p>
      </div>

      <div className="pasos">
        {modelo.pasos.map((paso, i) => (
          <div className="paso" key={i}>
            <span className="paso-num" aria-hidden="true">{i + 1}</span>
            <div>
              <h2>{paso.titulo}</h2>
              <p className="paso-detalle">{paso.detalle}</p>
              {paso.referencia && <span className="referencia">{paso.referencia}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="marco con-flotante">
      <Lectura maquina={maquina.id} />
      <Estado maquina={maquina.id} inicial={maquina.estado} />

      <header className="cabecera">
        <div className="migas">
          <Link href="/">Máquinas</Link>
          <span>·</span>
          <span>{maquina.sector}</span>
          <span className="tag">{maquina.etiqueta}</span>
        </div>
        <h1>{modelo.nombre}</h1>
        <p className="suave">{modelo.resumen}</p>
      </header>

      <Entrenar modelo={modelo}>{comoSeUsa}</Entrenar>

      {/* Los errores no se esconden nunca detrás de una selección: el video se
          mira una vez, el error se comete todas las series. */}
      <section className="panel">
        <p className="rotulo">No hagas esto</p>
        <div className="errores">
          {modelo.errores.map((e, i) => (
            <div className="error" data-gravedad={e.gravedad} key={i}>
              <span className="marca">{MARCA[e.gravedad]}</span>
              <h3>{e.error}</h3>
              <p>{e.consecuencia}</p>
              <p className="correccion">{e.correccion}</p>
            </div>
          ))}
        </div>
      </section>

      <Plan modelo={modelo.id} />

      <Dolor modelo={modelo} />

      {/* Lo que no cambia. Es lo que separa una ficha seria de una copiada de
          internet, donde estos mitos se repiten como si fueran técnica. */}
      <section className="panel">
        <p className="rotulo">Lo que no cambia</p>
        {modelo.mitos.map((m, i) => (
          <div className="mito" key={i}>
            <p className="creencia">“{m.creencia}”</p>
            <p className="realidad">{m.realidad}</p>
          </div>
        ))}
      </section>

      <Link className="secundaria enlace" href="/">
        Ver todas las máquinas
      </Link>

      <Reportar maquina={maquina.id} etiqueta={maquina.etiqueta} />
    </main>
  );
}
