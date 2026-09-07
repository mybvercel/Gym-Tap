import type { EstadoMaquina, Objetivo, Servicio } from "@/datos/tipos";

/**
 * Almacenamiento de la demo.
 *
 * En producción esto es Postgres y un aviso al staff. Acá vive en el teléfono,
 * para que la demo funcione sin servidor y se pueda mostrar en un gimnasio sin
 * depender del wifi. Las reglas de negocio son las mismas que tendría el
 * backend, sobre todo la de no duplicar tickets.
 *
 * Las pantallas leen esto con `useSyncExternalStore`: copiar en estado lo que
 * ya vive afuera de React cuesta un render extra y desincroniza las dos copias
 * apenas alguien escribe. Los lectores devuelven la cadena cruda porque tiene
 * que ser estable entre llamadas; el parseo va en la pantalla, memorizado.
 */

const K_TICKETS = "ficha:tickets";
const K_LECTURAS = "ficha:lecturas";
const K_ESTADOS = "ficha:estados";
const K_SERVICIOS = "ficha:servicios";
const K_CARGAS = "ficha:cargas";

export const VACIO = "[]";
const VACIO_OBJ = "{}";

/* ------------------------------------------------------------ Suscripción */

const oyentes = new Set<() => void>();

export function suscribir(fn: () => void): () => void {
  oyentes.add(fn);
  return () => {
    oyentes.delete(fn);
  };
}

function leerCrudo(clave: string, porDefecto: string): string {
  try {
    return localStorage.getItem(clave) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

function leer<T>(clave: string, porDefecto: string): T {
  try {
    return JSON.parse(leerCrudo(clave, porDefecto)) as T;
  } catch {
    return JSON.parse(porDefecto) as T;
  }
}

function escribir(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* Modo privado o disco lleno: la demo sigue funcionando sin historial. */
  }
  for (const fn of oyentes) fn();
}

export const crudoTickets = () => leerCrudo(K_TICKETS, VACIO);
export const crudoLecturas = () => leerCrudo(K_LECTURAS, VACIO);
export const crudoEstados = () => leerCrudo(K_ESTADOS, VACIO_OBJ);
export const crudoServicios = () => leerCrudo(K_SERVICIOS, VACIO_OBJ);
export const crudoCargas = () => leerCrudo(K_CARGAS, VACIO_OBJ);

/* ---------------------------------------------------------------- Fallas */

export type TipoFalla = "rota" | "ruido" | "cable" | "sucia" | "falta-peso" | "tapizado" | "otro";

/**
 * Las opciones están escritas como las diría un socio, no un técnico. Nadie
 * reporta "falla en el sistema de poleas": reporta que hace un ruido raro.
 */
export const FALLAS: { id: TipoFalla; etiqueta: string; sacaDeServicio?: boolean }[] = [
  { id: "rota", etiqueta: "No funciona", sacaDeServicio: true },
  { id: "cable", etiqueta: "Cable o correa", sacaDeServicio: true },
  { id: "ruido", etiqueta: "Hace ruido" },
  { id: "falta-peso", etiqueta: "Faltan discos" },
  { id: "tapizado", etiqueta: "Tapizado roto" },
  { id: "sucia", etiqueta: "Está sucia" },
  { id: "otro", etiqueta: "Otra cosa" },
];

export interface Ticket {
  maquina: string;
  etiqueta: string;
  tipo: TipoFalla;
  nota?: string;
  reportes: number;
  creado: number;
  ultimo: number;
}

export const leerTickets = (): Ticket[] => leer<Ticket[]>(K_TICKETS, VACIO);

/**
 * Alta de falla con la regla que hace usable el panel: un cable roto lo ven
 * veinte personas el mismo día. Si eso genera veinte tickets, el dueño abre el
 * panel una vez y no vuelve. Sumar reportes al mismo ticket convierte esa
 * repetición en lo que realmente es: una señal de urgencia.
 */
export function reportarFalla(
  maquina: string,
  etiqueta: string,
  tipo: TipoFalla,
  nota?: string,
): Ticket {
  const tickets = leerTickets();
  const abierto = tickets.find((t) => t.maquina === maquina && t.tipo === tipo);

  if (abierto) {
    abierto.reportes += 1;
    abierto.ultimo = Date.now();
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
    ultimo: Date.now(),
  };
  escribir(K_TICKETS, [nuevo, ...tickets]);

  // Una falla que puede lastimar a alguien no espera a que abran el panel.
  if (FALLAS.find((f) => f.id === tipo)?.sacaDeServicio) {
    cambiarEstado(maquina, "fuera-de-servicio");
  }
  return nuevo;
}

export function cerrarTicket(maquina: string, tipo: TipoFalla): void {
  escribir(
    K_TICKETS,
    leerTickets().filter((t) => !(t.maquina === maquina && t.tipo === tipo)),
  );
}

/* ---------------------------------------------------------------- Estado */

/**
 * El estado que fija el panel pisa al del catálogo. Se guarda solo lo que
 * cambió: así el catálogo sigue siendo la fuente y el panel, la excepción.
 */
export const leerEstados = (): Record<string, EstadoMaquina> =>
  leer<Record<string, EstadoMaquina>>(K_ESTADOS, VACIO_OBJ);

export function cambiarEstado(maquina: string, estado: EstadoMaquina): void {
  escribir(K_ESTADOS, { ...leerEstados(), [maquina]: estado });
}

/* ---------------------------------------------------------- Mantenimiento */

export const leerServicios = (): Record<string, Servicio[]> =>
  leer<Record<string, Servicio[]>>(K_SERVICIOS, VACIO_OBJ);

/** Registrar el service deja la máquina operativa y cierra sus reportes. */
export function registrarServicio(maquina: string, servicio: Servicio): void {
  const todos = leerServicios();
  escribir(K_SERVICIOS, { ...todos, [maquina]: [servicio, ...(todos[maquina] ?? [])] });
  escribir(
    K_TICKETS,
    leerTickets().filter((t) => t.maquina !== maquina),
  );
  cambiarEstado(maquina, "operativa");
}

/* -------------------------------------------------------------- Lecturas */

export interface LecturaRegistrada {
  maquina: string;
  ts: number;
}

export const leerLecturas = (): LecturaRegistrada[] => leer<LecturaRegistrada[]>(K_LECTURAS, VACIO);

export function registrarLectura(maquina: string): void {
  escribir(K_LECTURAS, [{ maquina, ts: Date.now() }, ...leerLecturas()].slice(0, 500));
}

/* ----------------------------------------------------- Carga del socio */

export interface Carga {
  peso: number;
  reps: number;
  objetivo: Objetivo;
  fecha: number;
}

export const leerCargas = (): Record<string, Carga> =>
  leer<Record<string, Carga>>(K_CARGAS, VACIO_OBJ);

/** Se guarda por modelo, no por unidad: la prensa es la prensa. */
export function guardarCarga(modelo: string, carga: Carga): void {
  escribir(K_CARGAS, { ...leerCargas(), [modelo]: carga });
}

export function limpiarDemo(): void {
  for (const k of [K_TICKETS, K_LECTURAS, K_ESTADOS, K_SERVICIOS, K_CARGAS]) {
    try {
      localStorage.removeItem(k);
    } catch {
      /* Nada que borrar. */
    }
  }
  for (const fn of oyentes) fn();
}
