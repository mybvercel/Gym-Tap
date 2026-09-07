"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode/lib/browser";
import { MAQUINAS, SUCURSALES, buscarModelo } from "@/datos/catalogo";
import type { Maquina } from "@/datos/tipos";
import { IconoNFC, PressBarra, Sentadilla } from "@/componentes/Figuras";
import "./tarjeta.css";

/**
 * Las tarjetas para el atril de acrílico, listas para imprimir.
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
            aria-label="Sucursal"
          >
            <option value="todas">Todas las sucursales</option>
            {SUCURSALES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <button type="button" className="accion" onClick={() => window.print()}>
            Imprimir {maquinas.length} tarjetas
          </button>
        </div>
        <p className="chico suave">
          En el diálogo de impresión: márgenes en ninguno, escala 100 %, y
          activá gráficos de fondo. Cada tarjeta sale en su propia hoja de
          13 × 18 cm.
        </p>
      </div>

      <div className="hojas">
        {maquinas.map((m) => (
          <Tarjeta key={m.id} maquina={m} url={`${origen}/m/${m.id}`} />
        ))}
      </div>
    </>
  );
}

function Tarjeta({ maquina, url }: { maquina: Maquina; url: string }) {
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
      color: { dark: "#1B1B1B", light: "#FFFFFF" },
    }).then(setQr);
  }, [url]);

  return (
    <article className="tarjeta">
      <header className="t-cabecera">
        <div className="t-figura">
          <Sentadilla color="#1B1B1B" acento="#F0A020" />
        </div>
        <div className="t-titulo">
          <h1>{modelo?.nombre}</h1>
          <p>{maquina.etiqueta}</p>
        </div>
        <div className="t-figura">
          <PressBarra color="#1B1B1B" acento="#1F7A8C" />
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
            <IconoNFC color="#1B1B1B" />
          </div>
          <p className="t-como">Apoyá tu móvil</p>
        </div>

        <div className="t-o">o</div>

        <div className="t-acceso">
          <div className="t-marco t-marco-qr">
            {qr && <img src={qr} alt={`Código QR de ${maquina.etiqueta}`} />}
          </div>
          <p className="t-como">Escaneá el código</p>
        </div>
      </div>

      <footer className="t-pie">
        <span className="t-codigo">{maquina.codigo}</span>
        <span className="t-sector">{maquina.sector}</span>
      </footer>
    </article>
  );
}
