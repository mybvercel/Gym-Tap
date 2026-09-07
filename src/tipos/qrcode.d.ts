/**
 * El paquete `qrcode` trae tipos para su entrada de Node, que arrastra
 * dependencias que no existen en el navegador. Se importa la entrada de
 * navegador, que no viene tipada, y se declara acá lo único que se usa.
 */
declare module "qrcode/lib/browser" {
  interface Opciones {
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    margin?: number;
    width?: number;
    color?: { dark?: string; light?: string };
  }
  const QRCode: { toDataURL(texto: string, opciones?: Opciones): Promise<string> };
  export default QRCode;
}
