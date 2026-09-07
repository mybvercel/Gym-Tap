import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El indicador de desarrollo se cuela en las exportaciones a PDF y PNG de las
  // tarjetas, que se generan desde este mismo servidor.
  devIndicators: false,
};

export default nextConfig;
