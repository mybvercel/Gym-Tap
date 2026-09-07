/**
 * Los tipos del catálogo, aparte de los datos para que el archivo de contenido
 * se lea como lo que es: contenido.
 *
 * Las reglas de qué se puede afirmar y qué no están en la skill
 * `biomecanica-maquinas`. Lo importante que baja hasta acá: ninguna posición
 * aísla un músculo, así que toda variante habla de reparto de trabajo, y cada
 * una lleva su nivel de certeza.
 */

export type Zona = "hombro" | "muneca" | "lumbar" | "rodilla";

export const ZONAS: { id: Zona; etiqueta: string }[] = [
  { id: "hombro", etiqueta: "Hombro" },
  { id: "muneca", etiqueta: "Muñeca" },
  { id: "lumbar", etiqueta: "Lumbar" },
  { id: "rodilla", etiqueta: "Rodilla" },
];

export type Musculo =
  | "cuadriceps"
  | "gluteo"
  | "isquios"
  | "aductores"
  | "dorsal"
  | "espalda-alta"
  | "pectoral"
  | "hombro"
  | "triceps"
  | "biceps";

export const MUSCULOS: Record<Musculo, string> = {
  cuadriceps: "Cuádriceps",
  gluteo: "Glúteo",
  isquios: "Isquiotibiales",
  aductores: "Aductores",
  dorsal: "Dorsal · ancho",
  "espalda-alta": "Espalda alta · grosor",
  pectoral: "Pectoral",
  hombro: "Hombro",
  triceps: "Tríceps",
  biceps: "Bíceps",
};

/**
 * Qué tan firme es lo que se afirma.
 *
 * Es el campo que evita que esto se convierta en el típico contenido de
 * gimnasio que suena técnico y no resiste una medición.
 */
export type Certeza = "solida" | "razonable" | "preferencia";

export const CERTEZA: Record<Certeza, string> = {
  solida: "Medido con EMG",
  razonable: "Por mecánica",
  preferencia: "Preferencia",
};

/** Dibujos esquemáticos. Se generan en el momento, no son fotos que pesan. */
export type Dibujo =
  | { tipo: "plataforma"; altura: "baja" | "media" | "alta"; ancho: "junto" | "normal" | "ancho"; punta?: boolean }
  | { tipo: "barra"; ancho: "angosto" | "medio" | "ancho"; agarre: "prono" | "supino" | "neutro" }
  | { tipo: "perfil"; manija: "alta" | "media" | "baja" }
  | { tipo: "arco"; desde: number; hasta: number };

export interface Variante {
  id: string;
  nombre: string;
  objetivo: Musculo[];
  /** Qué mover, concreto. */
  ajuste: string;
  /** Por qué cambia el reparto. Sin esto es una orden suelta que nadie recuerda. */
  porque: string;
  rango?: string;
  ojo?: string;
  certeza: Certeza;
  dibujo: Dibujo;
}

export interface Paso {
  titulo: string;
  detalle: string;
  /** El punto de control del cuerpo, no de la máquina. */
  referencia?: string;
}

export type Gravedad = "lesion" | "desgaste" | "sin-estimulo";

export interface ErrorCritico {
  error: string;
  consecuencia: string;
  correccion: string;
  gravedad: Gravedad;
}

export interface Adaptacion {
  ajuste: string;
  evitar?: string;
  /** true = esto no se adapta solo. Mejor derivar que improvisar. */
  derivar?: boolean;
}

export interface Mito {
  creencia: string;
  realidad: string;
}

export interface Modelo {
  id: string;
  nombre: string;
  familia: string;
  ejercicio: string;
  /** Para qué sirve la máquina, en una línea. */
  resumen: string;
  musculos: Musculo[];
  pasos: [Paso, Paso, Paso];
  errores: ErrorCritico[];
  variantes: Variante[];
  /** Lo que no cambia. Es lo que separa una ficha seria de una copiada. */
  mitos: Mito[];
  dolor: Partial<Record<Zona, Adaptacion>>;
}


/* ------------------------------------------------------------------ SaaS */

export interface Sucursal {
  id: string;
  nombre: string;
  /** Prefijo del código de máquina: QVX-CERRO-PR-023 */
  prefijo: string;
}

export type EstadoMaquina = "operativa" | "observacion" | "fuera-de-servicio";

export const ESTADOS: Record<EstadoMaquina, string> = {
  operativa: "Operativa",
  observacion: "En observación",
  "fuera-de-servicio": "Fuera de servicio",
};

export interface Servicio {
  fecha: string;
  tecnico: string;
  problema: string;
  repuesto?: string;
}

/* ------------------------------------------------------------- Objetivos */

/**
 * El objetivo de entrenamiento define series y repeticiones, no la máquina.
 *
 * Falta uno a propósito: "perder grasa". No existe un rango de repeticiones
 * que queme grasa; eso se decide con el balance de calorías y el cardio, no
 * con el press de pecho. Ofrecerlo como si fuera una opción de la máquina
 * sería publicar un mito. Se dice en `AVISO_GRASA`.
 */
export type Objetivo = "masa" | "fuerza" | "resistencia";

export interface Pauta {
  id: Objetivo;
  etiqueta: string;
  series: string;
  reps: [number, number];
  descanso: string;
  esfuerzo: string;
  /** Cuándo subir el peso. Progresión doble: primero reps, después carga. */
  progresion: string;
}

export const PAUTAS: Pauta[] = [
  {
    id: "masa",
    etiqueta: "Ganar músculo",
    series: "3 a 4 series",
    reps: [8, 12],
    descanso: "60 a 90 s",
    esfuerzo: "Terminá cada serie con 1 o 2 repeticiones en el bolsillo.",
    progresion:
      "Cuando llegues a 12 con buena técnica en todas las series, subí el peso y volvé a 8.",
  },
  {
    id: "fuerza",
    etiqueta: "Ganar fuerza",
    series: "4 a 5 series",
    reps: [3, 6],
    descanso: "2 a 3 min",
    esfuerzo: "Peso alto y técnica intacta. Si se rompe la técnica, la serie terminó.",
    progresion: "Cuando completes 6 en todas las series, subí el peso y volvé a 3.",
  },
  {
    id: "resistencia",
    etiqueta: "Resistencia",
    series: "2 a 3 series",
    reps: [15, 20],
    descanso: "30 a 45 s",
    esfuerzo: "Ritmo sostenido, sin llegar al fallo.",
    progresion: "Cuando pases de 20, subí el peso y volvé a 15.",
  },
];

export const AVISO_GRASA =
  "Para bajar grasa no hay que cambiar las series: se entrena igual. Lo que decide es cuánto comés y cuánto te movés fuera de la sala. Elegí el objetivo de fuerza o músculo igual, así mantenés lo que tenés mientras bajás.";

export interface Maquina {
  /** Corto a propósito: entra en el chip y en un QR chico. */
  id: string;
  /** El código de inventario, largo y legible: QVX-CERRO-PR-023. */
  codigo: string;
  sucursal: string;
  modelo: string;
  /** Como la llaman adentro del gimnasio, no como la llama el fabricante. */
  etiqueta: string;
  sector: string;
  estado: EstadoMaquina;
  ultimoServicio?: Servicio;
  /** Cada cuántos días toca revisarla. */
  cadaDias: number;
}
