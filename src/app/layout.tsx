import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/**
 * La clase va en <html> y no en <body>: la variable de la fuente se resuelve
 * en :root, y puesta en el body queda por debajo de donde se la usa.
 */
const fuente = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * La tarjeta usa la tipografía de Qivox.
 *
 * Sus títulos son Graphik, que es licenciada y no se puede distribuir. Inter es
 * lo que su propio sitio sirve para todo lo demás y lo que usa cuando Graphik
 * no carga, así que es la sustituta correcta: misma familia neo-grotesca, mismo
 * aire. Si consiguen la licencia de Graphik, se cambia una línea.
 */
const tarjeta = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-tarjeta",
  display: "swap",
});

/**
 * La voz del instrumento.
 *
 * Los códigos de inventario, las referencias y los índices van en
 * monoespaciada: numeran y clasifican, no hablan. Es el segundo registro
 * tipográfico de la tarjeta y no se mezcla nunca con el primero.
 */
const mono = localFont({
  src: "./fuentes/GeistMono-Regular.ttf",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ficha de Máquina",
  description: "Cómo se regula, qué error lesiona y qué hacer si algo duele.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  // Se bloquea el zoom por gesto pero el usuario puede agrandar la letra del
  // sistema: lo que molesta es el zoom accidental con la mano transpirada.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${fuente.variable} ${tarjeta.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
