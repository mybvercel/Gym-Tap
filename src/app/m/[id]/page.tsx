import Link from "next/link";
import { notFound } from "next/navigation";
import { MAQUINAS, buscarMaquina, GIMNASIO } from "@/datos/catalogo";
import { Dolor } from "@/componentes/Dolor";
import { Reportar } from "@/componentes/Reportar";
import { Lectura } from "@/componentes/Lectura";

/**
 * La ficha: el destino del chip de esta máquina.
 *
 * Se genera estática, una por unidad física. El contenido llega ya escrito
 * dentro del HTML: sin consultas, sin esqueletos de carga y sin esperar a que
 * el JavaScript se hidrate para poder leer a qué altura va el asiento.
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

  return (
    <main className="marco">
      <Lectura maquina={maquina.id} />

      <header className="cabecera">
        <div className="migas">
          <Link href="/">{GIMNASIO}</Link>
          <span>·</span>
          <span>{maquina.sector}</span>
          <span className="tag">{maquina.etiqueta}</span>
        </div>
        <h1>{modelo.nombre}</h1>
      </header>

      {/* Primero lo que vino a buscar: cómo se regula. */}
      <section className="panel">
        <p className="rotulo">Regulá la máquina</p>
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

      {/* Los errores van antes que el video: el video se mira una vez, el
          error se comete todas las series. */}
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

      <section className="panel">
        <p className="rotulo">Técnica</p>
        {/* El video no se precarga nunca: son 280 KB que arruinan la carga de
            alguien que solo quería saber la altura del asiento. */}
        <div className="video">
          <p className="suave chico">Video de 10 segundos, sin audio</p>
          <p className="chico" style={{ color: "var(--texto-tenue)" }}>
            Se graba en el gimnasio. Carga recién al tocarlo.
          </p>
        </div>
      </section>

      <Dolor modelo={modelo} />

      <div className="lista">
        {/* Contrato por URL, no API compartida: la app de carga usa lo que
            entiende y puede ignorar el resto sin romperse. */}
        <a
          className="accion"
          href={`https://gym-tap.vercel.app/?m=${maquina.id}&e=${modelo.ejercicio}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cargar en mi rutina
        </a>
        <Reportar maquina={maquina.id} etiqueta={maquina.etiqueta} />
        <Link className="secundaria" href="/">
          Ver todas las máquinas
        </Link>
      </div>
    </main>
  );
}
