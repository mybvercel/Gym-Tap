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

export interface Maquina {
  /** Corto a propósito: entra en el chip y en un QR chico. */
  id: string;
  modelo: string;
  /** Como la llaman adentro del gimnasio, no como la llama el fabricante. */
  etiqueta: string;
  sector: string;
}
