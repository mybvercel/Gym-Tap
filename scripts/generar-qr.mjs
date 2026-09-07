/**
 * Genera los archivos de QR de cada código impreso.
 *
 * SVG primero: es vectorial, escala a cualquier tamaño sin perder definición y
 * Canva lo acepta. El PNG queda de respaldo.
 *
 * Sobre el color: un lector de QR no distingue colores, distingue claro de
 * oscuro. El amarillo de Qivox tiene casi la misma luminosidad que el blanco,
 * así que módulos amarillos sobre fondo blanco no se leen. Por eso el amarillo
 * va en el FONDO, con los módulos negros: mismo aspecto amarillo, contraste de
 * sobra. El naranja sí es lo bastante oscuro como para ir en los módulos.
 *
 * La comprobación de contraste está abajo y corta la generación si algún día
 * alguien cambia un color por uno que no se lee.
 */
import { mkdir, writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const BASE = "https://www.mybdigitals.com/q";
const salida = new URL("../impresion/qr/", import.meta.url);

const PIEZAS = [
  {
    codigo: "vktgd5",
    nombre: "naranja",
    // Naranja oscuro en los módulos, papel blanco.
    oscuro: "#C2410C",
    claro: "#FFFFFF",
  },
  {
    codigo: "jbzpnw",
    nombre: "amarillo",
    // Módulos negros sobre el amarillo de la marca.
    oscuro: "#111111",
    claro: "#FFBD00",
  },
];

/** Luminancia relativa según WCAG: es lo que ve un lector, no el tono. */
function luminancia(hex) {
  const canal = (v) => {
    const c = parseInt(v, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(canal);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/* Por debajo de 4 a 1 los lectores empiezan a fallar con poca luz o de lejos,
   que es exactamente la situación de un gimnasio. */
const MINIMO = 4;

await mkdir(salida, { recursive: true });

for (const pieza of PIEZAS) {
  const ratio = contraste(pieza.oscuro, pieza.claro);
  if (ratio < MINIMO) {
    throw new Error(
      `El ${pieza.nombre} tiene contraste ${ratio.toFixed(1)}:1 y no se va a leer. Mínimo ${MINIMO}:1.`,
    );
  }

  const url = `${BASE}/${pieza.codigo}`;
  // Corrección de errores M: aguanta que se raye o se ensucie una parte.
  const opciones = {
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: pieza.oscuro, light: pieza.claro },
  };

  const svg = await QRCode.toString(url, { ...opciones, type: "svg", width: 1024 });
  await writeFile(new URL(`qr-${pieza.nombre}-${pieza.codigo}.svg`, salida), svg);

  const png = await QRCode.toBuffer(url, { ...opciones, width: 2048 });
  await writeFile(new URL(`qr-${pieza.nombre}-${pieza.codigo}.png`, salida), png);

  console.log(`${pieza.nombre.padEnd(9)} ${pieza.codigo}  contraste ${ratio.toFixed(1)}:1  →  ${url}`);
}
