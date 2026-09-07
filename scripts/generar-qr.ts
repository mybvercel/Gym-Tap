/**
 * Genera los archivos de QR sueltos, para armar tarjetas a mano.
 *
 * Lee los códigos y el dominio del mismo módulo que usa la app: si el dominio
 * cambia, cambia en los dos lados o en ninguno.
 *
 * SVG primero, que es vectorial y escala a cualquier tamaño sin perder
 * definición; Canva lo acepta. El PNG queda de respaldo.
 *
 * Sobre el color: un lector no distingue tonos, distingue claro de oscuro. El
 * amarillo de la marca tiene casi la luminosidad del blanco, así que módulos
 * amarillos sobre fondo blanco no se leen. Por eso el amarillo va en el FONDO,
 * con los módulos negros: mismo aspecto, contraste de sobra. El naranja sí es
 * lo bastante oscuro como para ir en los módulos.
 */
import { mkdir, writeFile } from "node:fs/promises";
import QRCode from "qrcode";
import { CODIGOS, urlDeCodigo, type ColorQR } from "../src/datos/codigos.ts";

const PALETA: Record<ColorQR, { oscuro: string; claro: string }> = {
  naranja: { oscuro: "#C2410C", claro: "#FFFFFF" },
  amarillo: { oscuro: "#111111", claro: "#FFBD00" },
};

/** Luminancia relativa según WCAG: es lo que ve un lector, no el tono. */
function luminancia(hex: string): number {
  const canal = (v: string) => {
    const c = parseInt(v, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(canal);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/* Por debajo de 4 a 1 los lectores fallan con poca luz o de lejos, que es
   exactamente la situación de un gimnasio. */
const MINIMO = 4;

async function principal() {
  const salida = new URL("../impresion/qr/", import.meta.url);
  await mkdir(salida, { recursive: true });

  for (const entrada of CODIGOS.filter((c) => c.color)) {
    const paleta = PALETA[entrada.color!];
    const ratio = contraste(paleta.oscuro, paleta.claro);
    if (ratio < MINIMO) {
      throw new Error(
        `El ${entrada.color} tiene contraste ${ratio.toFixed(1)}:1 y no se va a leer. Mínimo ${MINIMO}:1.`,
      );
    }

    const url = urlDeCodigo(entrada.codigo);
    // Corrección de errores M: aguanta que se raye o se ensucie una parte.
    const opciones = {
      errorCorrectionLevel: "M" as const,
      margin: 2,
      color: { dark: paleta.oscuro, light: paleta.claro },
    };

    const nombre = `qr-${entrada.color}-${entrada.codigo}`;
    await writeFile(
      new URL(`${nombre}.svg`, salida),
      await QRCode.toString(url, { ...opciones, type: "svg", width: 1024 }),
    );
    await writeFile(new URL(`${nombre}.png`, salida), await QRCode.toBuffer(url, { ...opciones, width: 2048 }));

    console.log(`${entrada.color!.padEnd(9)} ${entrada.codigo}  contraste ${ratio.toFixed(1)}:1  →  ${url}`);
  }
}

void principal();
