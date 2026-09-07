import type { Metadata, Viewport } from "next";
import { Inter_Tight, Montserrat } from "next/font/google";
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

/** Solo para la tarjeta impresa: es la tipografía que pidió el cliente. */
const tarjeta = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-tarjeta",
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
    <html lang="es-AR" className={`${fuente.variable} ${tarjeta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
