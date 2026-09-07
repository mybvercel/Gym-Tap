import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { CODIGOS, buscarCodigo } from "@/datos/codigos";
import { buscarMaquina } from "@/datos/catalogo";

/**
 * El destino permanente de un QR impreso.
 *
 * Si el código ya está asignado, manda a la ficha de esa máquina. Si todavía
 * no, no muestra un error: muestra el código bien grande para que quien esté
 * instalando lo pueda leer y asignarlo. Una tarjeta recién pegada que dice
 * "404" hace que la persona no vuelva a escanear nunca más.
 */
export function generateStaticParams() {
  return CODIGOS.map((c) => ({ codigo: c.codigo }));
}

export default async function Codigo({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const entrada = buscarCodigo(codigo);
  if (!entrada) notFound();

  if (entrada.maquina && buscarMaquina(entrada.maquina)) {
    redirect(`/m/${entrada.maquina}`);
  }

  return (
    <main className="marco centrado">
      <p className="rotulo">Tarjeta sin asignar</p>
      <h1>Esta tarjeta todavía no tiene máquina</h1>
      <p className="suave">
        Pasale este código a quien esté cargando el sistema y queda funcionando
        en un minuto. El QR no hay que volver a imprimirlo.
      </p>
      <p className="codigo-grande">{entrada.codigo}</p>
      <p className="chico suave">Tirada {entrada.tirada}</p>
      <Link className="secundaria" href="/">
        Ver las máquinas
      </Link>
    </main>
  );
}
