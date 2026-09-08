import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SinRed } from "@/componentes/SinRed";

/**
 * Montserrat en toda la app.
 *
 * La clase va en <html> y no en <body>: la variable de la fuente se resuelve
 * en :root, y puesta en el body queda por debajo de donde se la usa.
 */
const fuente = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * La tipografía de la tarjeta impresa, la misma que la de la app.
 *
 * Los títulos de Qivox son Graphik, que es licenciada y no se puede
 * distribuir. Montserrat es la elegida como reemplazo: geométrica, con
 * mayúsculas anchas que aguantan el peso 800 del titular, y muy distinta de
 * las grotescas de sistema que se ven en todos lados.
 */
const tarjeta = Montserrat({
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
      <body>
        <SinRed />
        {children}
      </body>
    </html>
  );
}
