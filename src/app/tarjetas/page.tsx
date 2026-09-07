"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode/lib/browser";
import { MAQUINAS, SUCURSALES, buscarModelo, nombreSucursal } from "@/datos/catalogo";
import type { Maquina } from "@/datos/tipos";
import { IconoNFC, PressBarra, Sentadilla } from "@/componentes/Figuras";
import "./tarjeta.css";

/**
 * El logo oficial.
 *
 * Por defecto se dibuja la palabra con el peso y el color correctos, que es
 * suficiente para una maqueta y no obliga a distribuir un archivo de marca
 * ajeno. Cuando Qivox pase el logo, se deja en `public/` y se pone la ruta acá:
 * es la única línea que hay que tocar.
 */
const LOGO: string | null = null;

/**
 * Las tarjetas para el atril de acrílico, en la marca de Qivox.
 *
 * 13 × 18 cm, que es la medida del portadocumentos estándar. Se imprimen desde
 * el navegador con Ctrl+P y salen a tamaño real: la hoja está definida en
 * milímetros, no en píxeles, así que no depende de la pantalla.
 *
 * El QR se genera acá y no con una imagen suelta, porque la dirección de cada
 * máquina tiene que coincidir exactamente con la que se graba en el chip. Dos
 * fuentes para el mismo dato es garantía de que alguna vez no coincidan.
 */
export default function Tarjetas() {
  // El origen es un valor del navegador, no estado de la pantalla: copiarlo
  // dentro de un efecto cuesta un render extra y el compilador lo marca.
  const origen = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  const [sucursal, setSucursal] = useState("todas");
  const [tema, setTema] = useState<"negro" | "claro">("negro");

  const maquinas = MAQUINAS.filter((m) => sucursal === "todas" || m.sucursal === sucursal);

  return (
    <>
      <div className="controles">
        <div className="controles-fila">
          <Link className="secundaria" href="/">
            Volver
          </Link>
          <select
            className="selector"
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
            aria-label="Sede"
          >
            <option value="todas">Todas las sedes</option>
            {SUCURSALES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <select
            className="selector"
            value={tema}
            onChange={(e) => setTema(e.target.value as "negro" | "claro")}
            aria-label="Fondo"
          >
            <option value="negro">Fondo negro (marca)</option>
            <option value="claro">Fondo blanco (ahorra tinta)</option>
          </select>
          <button type="button" className="accion" onClick={() => window.print()}>
            Imprimir {maquinas.length} tarjetas
          </button>
        </div>
        <p className="chico suave">
          En el diálogo de impresión: márgenes en ninguno, escala 100 % y
          gráficos de fondo activados. Cada tarjeta sale en su propia hoja de
          13 × 18 cm. El logo oficial se coloca dejando el archivo en{" "}
          <code>public/logo-qivox.png</code>.
        </p>
      </div>

      <div className="hojas">
        {maquinas.map((m) => (
          <Tarjeta key={m.id} maquina={m} url={`${origen}/m/${m.id}`} tema={tema} />
        ))}
      </div>
    </>
  );
}

function Tarjeta({
  maquina,
  url,
  tema,
}: {
  maquina: Maquina;
  url: string;
  tema: "negro" | "claro";
}) {
  const modelo = buscarModelo(maquina.modelo);
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!url) return;
    // Corrección de errores M: aguanta una esquina rayada, que es lo que le
    // pasa a cualquier cosa pegada en un gimnasio.
    QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      margin: 0,
      width: 600,
      color: { dark: "#111111", light: "#FFFFFF" },
    }).then(setQr);
  }, [url]);

  return (
    <article className="tarjeta" data-tema={tema}>
      <div className="t-marca">
        {LOGO ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="t-logo-img" src={LOGO} alt="Qivox" />
        ) : (
          <p className="t-logo">QIVOX</p>
        )}
        <span className="t-sede">{nombreSucursal(maquina.sucursal)}</span>
      </div>

      <header className="t-cabecera">
        <div className="t-figura">
          <Sentadilla color="var(--figura)" acento="#FFBD00" />
        </div>
        <div className="t-titulo">
          <h1>{modelo?.nombre}</h1>
          <span className="t-pildora">{maquina.etiqueta}</span>
        </div>
        <div className="t-figura">
          <PressBarra color="var(--figura)" acento="#FFBD00" />
        </div>
      </header>

      <div className="t-preguntas">
        <p>
          ¿Querés mejorar <strong>tu técnica</strong>?
        </p>
        <p>
          ¿Le pasó algo <strong>a la máquina</strong>?
        </p>
      </div>

      {/* Las dos entradas llevan al mismo lugar. Prometer dos destinos
          obligaría a explicar cuál es cuál, y la tarjeta se llena de texto. */}
      <div className="t-accesos">
        <div className="t-acceso">
          <div className="t-marco">
            <IconoNFC color="#111111" />
          </div>
          <p className="t-como">Apoyá tu móvil</p>
        </div>

        <div className="t-o">o</div>

        <div className="t-acceso">
          <div className="t-marco t-marco-qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {qr && <img src={qr} alt={`Código QR de ${maquina.etiqueta}`} />}
          </div>
          <p className="t-como">Escaneá el código</p>
        </div>
      </div>

      <footer className="t-pie">
        <span className="t-codigo">{maquina.codigo}</span>
        <span className="t-sector">{maquina.sector}</span>
        <span className="t-pie-der">Smart Gym</span>
      </footer>
    </article>
  );
}
