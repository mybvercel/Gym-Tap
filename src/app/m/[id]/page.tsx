import Link from "next/link";
import { notFound } from "next/navigation";
import { MAQUINAS, buscarMaquina, nombreSucursal } from "@/datos/catalogo";
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
 * Cada bloque tiene el tratamiento que le corresponde y no todos son tarjetas.
 * Cuando todo tiene el mismo borde y el mismo fondo, nada pesa más que nada y
 * la pantalla se lee como una planilla. Acá: la portada y los riesgos van
 * sobre el fondo, lo que se consulta va en tarjeta, y lo que advierte va en
 * una tira con filete al costado.
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
      <h2 className="titulo-seccion">Cómo se usa</h2>

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
              <h3>{paso.titulo}</h3>
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

      <div className="marca-app">
        <p className="marca-logo">QIVOX</p>
        <span className="marca-sede">{nombreSucursal(maquina.sucursal)}</span>
      </div>

      <Estado maquina={maquina.id} inicial={maquina.estado} />

      <header className="portada">
        <div className="migas">
          <Link href="/">Máquinas</Link>
          <span>·</span>
          <span>{maquina.sector}</span>
          <span className="tag">{maquina.etiqueta}</span>
        </div>
        <h1>{modelo.nombre}</h1>
        <p className="resumen">{modelo.resumen}</p>
      </header>

      <Entrenar modelo={modelo}>{comoSeUsa}</Entrenar>

      {/* Los riesgos no se esconden nunca detrás de una selección: el video se
          mira una vez, el error se comete todas las series. */}
      <section className="seccion">
        <h2 className="titulo-seccion">No hagas esto</h2>
        {modelo.errores.map((e, i) => (
          <div className="riesgo" data-gravedad={e.gravedad} key={i}>
            <span className="marca">{MARCA[e.gravedad]}</span>
            <h3>{e.error}</h3>
            <p>{e.consecuencia}</p>
            <p className="correccion">{e.correccion}</p>
          </div>
        ))}
      </section>

      <Plan modelo={modelo.id} />

      <Dolor modelo={modelo} />

      {/* Lo que no cambia. Es lo que separa una ficha seria de una copiada de
          internet, donde estos mitos se repiten como si fueran técnica. */}
      <section className="seccion">
        <h2 className="titulo-seccion">Lo que no cambia</h2>
        {modelo.mitos.map((m, i) => (
          <div className="mito-suelto" key={i}>
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
