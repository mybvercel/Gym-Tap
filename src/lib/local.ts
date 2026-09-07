/**
 * Almacenamiento de la demo.
 *
 * En producción esto es Postgres y un webhook al staff. Acá vive en el
 * teléfono, para que la demo funcione sin servidor y se pueda mostrar en un
 * gimnasio sin depender del wifi. Las reglas de negocio son las mismas que las
 * del esquema real, sobre todo la de no duplicar tickets.
 */

const K_TICKETS = "ficha:tickets";
const K_LECTURAS = "ficha:lecturas";

export type TipoFalla = "cable" | "traba-pin" | "tapizado" | "ruido" | "polea" | "estructura";

export const FALLAS: { id: TipoFalla; etiqueta: string }[] = [
  { id: "cable", etiqueta: "Cable o correa" },
  { id: "polea", etiqueta: "Polea o roldana" },
  { id: "traba-pin", etiqueta: "Traba o pin" },
  { id: "tapizado", etiqueta: "Tapizado" },
  { id: "ruido", etiqueta: "Ruido raro" },
  { id: "estructura", etiqueta: "Estructura" },
];

export interface Ticket {
  maquina: string;
  etiqueta: string;
  tipo: TipoFalla;
  nota?: string;
  reportes: number;
  creado: number;
  /** La estructura rajada saca la máquina de servicio sin esperar a nadie. */
  fueraDeServicio: boolean;
}

export interface LecturaRegistrada {
  maquina: string;
  ts: number;
}

function leer<T>(clave: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(clave) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function escribir(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* Modo privado o disco lleno: la demo sigue funcionando sin historial. */
  }
  avisar();
}


/* -------------------------------------------------------------------------
   Suscripción.

   Las pantallas leen esto con `useSyncExternalStore` en vez de copiarlo a
   estado dentro de un efecto: guardar en el estado lo que ya vive afuera de
   React obliga a un render extra y desincroniza las dos copias apenas alguien
   escribe. Los lectores devuelven la cadena cruda porque tiene que ser estable
   entre llamadas; el parseo va en la pantalla, memorizado.
   ------------------------------------------------------------------------- */

const oyentes = new Set<() => void>();

export function suscribir(fn: () => void): () => void {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

function avisar(): void {
  for (const fn of oyentes) fn();
}

export function crudoTickets(): string {
  try {
    return localStorage.getItem(K_TICKETS) ?? "[]";
  } catch {
    return "[]";
  }
}

export function crudoLecturas(): string {
  try {
    return localStorage.getItem(K_LECTURAS) ?? "[]";
  } catch {
    return "[]";
  }
}

export const VACIO = "[]";

export function leerTickets(): Ticket[] {
  return leer<Ticket>(K_TICKETS);
}

/**
 * Alta de falla con la regla que hace usable el panel: un cable roto lo ven
 * veinte personas el mismo día. Si eso genera veinte tickets, el dueño abre el
 * panel una vez y no vuelve. Sumar reportes al mismo ticket convierte esa
 * repetición en lo que realmente es: una señal de urgencia.
 */
export function reportarFalla(maquina: string, etiqueta: string, tipo: TipoFalla, nota?: string): Ticket {
  const tickets = leerTickets();
  const abierto = tickets.find((t) => t.maquina === maquina && t.tipo === tipo);

  if (abierto) {
    abierto.reportes += 1;
    if (nota) abierto.nota = nota;
    escribir(K_TICKETS, tickets);
    return abierto;
  }

  const nuevo: Ticket = {
    maquina,
    etiqueta,
    tipo,
    nota,
    reportes: 1,
    creado: Date.now(),
    fueraDeServicio: tipo === "estructura",
  };
  escribir(K_TICKETS, [nuevo, ...tickets]);
  return nuevo;
}

export function registrarLectura(maquina: string): void {
  const lecturas = leer<LecturaRegistrada>(K_LECTURAS);
  escribir(K_LECTURAS, [{ maquina, ts: Date.now() }, ...lecturas].slice(0, 500));
}

export function leerLecturas(): LecturaRegistrada[] {
  return leer<LecturaRegistrada>(K_LECTURAS);
}

export function limpiarDemo(): void {
  escribir(K_TICKETS, []);
  escribir(K_LECTURAS, []);
}
