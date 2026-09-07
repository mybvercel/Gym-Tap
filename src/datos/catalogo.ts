/**
 * El catálogo.
 *
 * Dos capas separadas a propósito, igual que el esquema de la base:
 *
 *  - `MODELOS` es contenido compartido. La prensa 45° es una sola en todo el
 *    sistema; su contenido se escribe una vez y lo usan todos los gimnasios que
 *    tengan una. Es lo que hace que dar de alta un gimnasio nuevo sea una tarde
 *    de pegar stickers y no un proyecto de producción de contenido.
 *
 *  - `MAQUINAS` son las unidades físicas de un gimnasio. Es lo único que cambia
 *    de cliente a cliente, y es lo que apunta cada chip NFC: el ticket de
 *    mantenimiento tiene que saber CUÁL de las dos prensas está rota.
 */

export type Zona = "hombro" | "muneca" | "lumbar" | "rodilla";

export const ZONAS: { id: Zona; etiqueta: string }[] = [
  { id: "hombro", etiqueta: "Hombro" },
  { id: "muneca", etiqueta: "Muñeca" },
  { id: "lumbar", etiqueta: "Lumbar" },
  { id: "rodilla", etiqueta: "Rodilla" },
];

export type Gravedad = "lesion" | "desgaste" | "sin-estimulo";

export interface Paso {
  titulo: string;
  detalle: string;
  /** El punto de control del cuerpo, no de la máquina. Se lee de un vistazo. */
  referencia?: string;
}

export interface ErrorCritico {
  error: string;
  consecuencia: string;
  correccion: string;
  gravedad: Gravedad;
}

export interface Adaptacion {
  ajuste: string;
  evitar?: string;
  /** true = esto no se adapta solo. Mejor mandar al profe que improvisar. */
  derivar?: boolean;
}

export interface Modelo {
  id: string;
  nombre: string;
  familia: string;
  pasos: [Paso, Paso, Paso];
  errores: ErrorCritico[];
  /** Solo las zonas que esta máquina realmente carga. */
  dolor: Partial<Record<Zona, Adaptacion>>;
  /** Ejercicio que se manda a la app de carga por el deep link. */
  ejercicio: string;
}

export interface Maquina {
  /** Corto a propósito: entra en el chip y en un QR chico. */
  id: string;
  modelo: string;
  /** Como la llaman adentro del gimnasio, no como la llama el fabricante. */
  etiqueta: string;
  sector: string;
}

export const MODELOS: Modelo[] = [
  {
    id: "prensa-45",
    nombre: "Prensa 45°",
    familia: "Pierna",
    ejercicio: "prensa",
    pasos: [
      {
        titulo: "Sentate al fondo",
        detalle:
          "La cadera bien contra el respaldo. La zona baja de la espalda tiene que apoyar entera, sin que quede un hueco.",
        referencia: "Sin hueco lumbar",
      },
      {
        titulo: "Pies al centro",
        detalle:
          "En el medio de la plataforma, separados al ancho de los hombros y con la punta apenas hacia afuera.",
        referencia: "Ancho de hombros",
      },
      {
        titulo: "Probá el recorrido",
        detalle:
          "Antes de soltar las trabas, bajá y fijate que la rodilla llegue a 90° sin que se te despegue la cola.",
        referencia: "Rodilla a 90°",
      },
    ],
    errores: [
      {
        error: "Trabar las rodillas arriba",
        consecuencia:
          "El peso deja de estar en el músculo y pasa directo a la articulación. Es la lesión más común de esta máquina.",
        correccion: "Frená un poco antes de estirar del todo. La rodilla nunca se traba.",
        gravedad: "lesion",
      },
      {
        error: "Despegar la cola del respaldo al bajar",
        consecuencia:
          "La columna se redondea con todo el peso encima. Así es como se lastima un disco.",
        correccion:
          "Bajá solo hasta donde la cadera siga apoyada, aunque te quede medio recorrido.",
        gravedad: "lesion",
      },
      {
        error: "Empujar con la punta del pie",
        consecuencia: "La fuerza se va al gemelo y la rodilla se adelanta de más.",
        correccion: "Apoyá el pie entero. El talón no se levanta en ningún momento.",
        gravedad: "desgaste",
      },
    ],
    dolor: {
      rodilla: {
        ajuste:
          "Subí los pies unos centímetros en la plataforma y separalos un poco más. Eso pasa carga del cuádriceps a la cadera.",
        evitar: "Bajar más allá de los 90°.",
      },
      lumbar: {
        ajuste:
          "Subí el respaldo un punto y acortá el recorrido: bajá solo hasta la mitad.",
        evitar: "Cualquier rango donde la cadera se despegue del asiento.",
      },
    },
  },
  {
    id: "jalon-pecho",
    nombre: "Jalón al pecho",
    familia: "Espalda",
    ejercicio: "jalon",
    pasos: [
      {
        titulo: "Trabá los muslos",
        detalle:
          "Bajá el rodillo hasta que apriete la pierna. Si al tirar te levantás del asiento, está muy alto.",
        referencia: "Que no te levante",
      },
      {
        titulo: "Agarre",
        detalle: "Agarrá la barra un puño más ancho que los hombros, no más.",
        referencia: "Hombros + un puño",
      },
      {
        titulo: "Fijá la postura",
        detalle:
          "Pecho arriba, mirada al frente y el torso apenas inclinado hacia atrás. Esa inclinación se queda quieta toda la serie.",
        referencia: "Pecho arriba",
      },
    ],
    errores: [
      {
        error: "Llevar la barra atrás de la nuca",
        consecuencia:
          "Fuerza al hombro en su posición más débil y comprime el cuello. No tiene ninguna ventaja.",
        correccion: "Siempre adelante, a la altura de las clavículas.",
        gravedad: "lesion",
      },
      {
        error: "Hamacarte con todo el cuerpo",
        consecuencia:
          "La espalda deja de trabajar y el envión se lo termina comiendo la zona lumbar.",
        correccion: "Si necesitás hamacarte para bajar la barra, sacale 10 kg.",
        gravedad: "sin-estimulo",
      },
      {
        error: "Soltar la barra de golpe arriba",
        consecuencia: "El hombro absorbe todo el tirón al final de cada repetición.",
        correccion: "Acompañá la subida contando dos tiempos.",
        gravedad: "desgaste",
      },
    ],
    dolor: {
      hombro: {
        ajuste:
          "Pasá al agarre neutro (el triángulo) o cerrá las manos al ancho de los hombros.",
        evitar: "El agarre ancho con las palmas hacia adelante.",
      },
      muneca: {
        ajuste:
          "Agarre neutro y la muñeca firme, alineada con el antebrazo. No la dejes caer hacia atrás.",
      },
      lumbar: {
        ajuste: "Sentate erguido, sin inclinar el torso hacia atrás, y bajá el peso.",
        evitar: "Terminar la repetición arqueando la espalda.",
      },
    },
  },
  {
    id: "remo-sentado",
    nombre: "Remo sentado",
    familia: "Espalda",
    ejercicio: "remo",
    pasos: [
      {
        titulo: "Pies y rodillas",
        detalle:
          "Apoyá los pies en la plataforma con las rodillas apenas dobladas. Nunca estiradas del todo.",
        referencia: "Rodilla blanda",
      },
      {
        titulo: "Pecho al apoyo",
        detalle:
          "Si la máquina tiene respaldo, pegá el pecho. Si es polea libre, sentate con la espalda recta y el pecho arriba.",
        referencia: "Espalda recta",
      },
      {
        titulo: "Elegí el agarre",
        detalle: "Neutro (palmas enfrentadas) para empezar: es el que menos molesta.",
      },
    ],
    errores: [
      {
        error: "Remar balanceando el torso",
        consecuencia:
          "Cada repetición es una flexión de columna con carga. La espalda baja paga la cuenta.",
        correccion: "El torso queda quieto. Solo se mueven los brazos.",
        gravedad: "lesion",
      },
      {
        error: "Encoger los hombros al tirar",
        consecuencia: "El trabajo se va al trapecio y al cuello en vez de la espalda.",
        correccion: "Antes de tirar, bajá los hombros y llevá los codos hacia atrás.",
        gravedad: "desgaste",
      },
      {
        error: "Dejar que la espalda se redondee al volver",
        consecuencia: "Es el momento de más carga y el de menos control.",
        correccion: "Frená antes de que los hombros se vayan adelante.",
        gravedad: "lesion",
      },
    ],
    dolor: {
      lumbar: {
        ajuste:
          "Pegá el pecho al apoyo y no muevas el torso. Si la máquina no tiene apoyo, bajá el peso y sentate más erguido.",
        evitar: "Estirarte hacia adelante al final de cada repetición.",
      },
      hombro: {
        ajuste: "Agarre neutro y los codos pegados al cuerpo, no abiertos.",
      },
      muneca: {
        ajuste:
          "Agarre neutro con la muñeca recta. Si igual molesta, usá muñequeras.",
      },
    },
  },
  {
    id: "press-pecho",
    nombre: "Press de pecho sentado",
    familia: "Pecho",
    ejercicio: "press-pecho",
    pasos: [
      {
        titulo: "Altura del asiento",
        detalle:
          "Las manijas tienen que quedar a la altura del medio del pecho. Si te quedan a la altura del cuello, subí el asiento.",
        referencia: "Manija = medio del pecho",
      },
      {
        titulo: "Apoyate entero",
        detalle: "Espalda completa contra el respaldo y los pies firmes en el piso.",
      },
      {
        titulo: "Limitá el recorrido",
        detalle:
          "Si la máquina tiene tope de arranque, ponelo para que el codo no pase la línea del torso.",
        referencia: "Codo no pasa el torso",
      },
    ],
    errores: [
      {
        error: "Bajar el codo más atrás que el cuerpo",
        consecuencia:
          "Estira la cápsula del hombro en su punto más frágil. Es la vía rápida al pinzamiento.",
        correccion: "Frená cuando la manija llegue a la línea del pecho.",
        gravedad: "lesion",
      },
      {
        error: "Estirar los codos de golpe y trabarlos",
        consecuencia: "El impacto se lo lleva la articulación, no el músculo.",
        correccion: "Terminá el empuje sin llegar a trabar el codo.",
        gravedad: "desgaste",
      },
      {
        error: "Despegar la espalda para empujar más",
        consecuencia: "Arquear la zona lumbar bajo carga para ganar dos centímetros.",
        correccion: "Si el respaldo se despega, el peso está de más.",
        gravedad: "lesion",
      },
    ],
    dolor: {
      hombro: {
        ajuste:
          "Subí el asiento un punto para que las manijas queden más abajo y acortá el recorrido. Agarre neutro si la máquina lo tiene.",
        evitar: "Bajar hasta el pecho. Frená antes.",
      },
      muneca: {
        ajuste:
          "La manija apoyada en la base de la palma, no en los dedos, y la muñeca recta.",
      },
      lumbar: {
        ajuste: "Pies bien apoyados y espalda pegada. Si arqueás para empujar, bajá el peso.",
      },
    },
  },
  {
    id: "extension-rodilla",
    nombre: "Extensión de rodilla",
    familia: "Pierna",
    ejercicio: "extension",
    pasos: [
      {
        titulo: "Alineá la rodilla",
        detalle:
          "Sentate de manera que la rodilla quede justo en el eje donde gira el brazo de la máquina.",
        referencia: "Rodilla en el eje",
      },
      {
        titulo: "Rodillo al empeine",
        detalle: "Apoyado sobre el empeine, no sobre la canilla.",
        referencia: "Empeine, no canilla",
      },
      {
        titulo: "Ajustá el arranque",
        detalle:
          "Que la serie no empiece con la rodilla más doblada que 90°: ahí la rótula recibe de más.",
      },
    ],
    errores: [
      {
        error: "Arrancar con un tirón",
        consecuencia: "El envión pasa por la rodilla antes de que el músculo llegue a tensarse.",
        correccion: "Empezá lento. Si no podés, el peso está de más.",
        gravedad: "desgaste",
      },
      {
        error: "Trabar la rodilla arriba con el peso",
        consecuencia: "La rótula se lleva toda la compresión en el punto de menos protección.",
        correccion: "Llegá a estirar sin trabar, mantené un segundo y bajá.",
        gravedad: "lesion",
      },
      {
        error: "Soltar el peso de golpe al bajar",
        consecuencia: "La bajada es donde el músculo más trabaja y donde más se protege la rodilla.",
        correccion: "Bajá contando dos tiempos.",
        gravedad: "desgaste",
      },
    ],
    dolor: {
      rodilla: {
        ajuste:
          "Acortá el recorrido a la mitad final del movimiento y bajá bastante el peso.",
        evitar: "El tramo con la rodilla muy doblada.",
        derivar: true,
      },
      lumbar: {
        ajuste: "Cadera al fondo del asiento y agarrate de las manijas laterales.",
      },
    },
  },
  {
    id: "press-hombro",
    nombre: "Press de hombros",
    familia: "Hombro",
    ejercicio: "press-hombro",
    pasos: [
      {
        titulo: "Altura del asiento",
        detalle:
          "Las manijas tienen que arrancar a la altura de la oreja, no por encima de la cabeza.",
        referencia: "Manija = altura de la oreja",
      },
      {
        titulo: "Espalda apoyada",
        detalle: "Toda la espalda contra el respaldo, sin arquear la zona baja.",
      },
      {
        titulo: "Agarre neutro",
        detalle: "Si la máquina lo permite, palmas enfrentadas: es el que menos molesta el hombro.",
      },
    ],
    errores: [
      {
        error: "Bajar las manijas atrás de la cabeza",
        consecuencia: "Lleva el hombro a su posición más expuesta con carga encima.",
        correccion: "El recorrido va por delante de la cara, siempre.",
        gravedad: "lesion",
      },
      {
        error: "Arquear la espalda para empujar",
        consecuencia: "Convierte un ejercicio de hombro en una carga sobre la lumbar.",
        correccion: "Apretá el abdomen. Si igual arqueás, bajá el peso.",
        gravedad: "lesion",
      },
      {
        error: "Encoger los hombros arriba",
        consecuencia: "El trapecio se come el trabajo y el cuello se carga.",
        correccion: "Hombros abajo durante todo el recorrido.",
        gravedad: "desgaste",
      },
    ],
    dolor: {
      hombro: {
        ajuste: "Agarre neutro y frená a la altura de la frente, sin estirar del todo.",
        evitar: "El recorrido completo por encima de la cabeza.",
        derivar: true,
      },
      muneca: {
        ajuste: "Muñeca recta, alineada con el antebrazo. No la dejes caer hacia atrás.",
      },
      lumbar: {
        ajuste: "Acercá el asiento al respaldo y apretá el abdomen antes de empujar.",
      },
    },
  },
];

/** Las unidades físicas de este gimnasio. Cada una tiene su chip. */
export const MAQUINAS: Maquina[] = [
  { id: "p1", modelo: "prensa-45", etiqueta: "Prensa 1", sector: "Sala pierna" },
  { id: "p2", modelo: "prensa-45", etiqueta: "Prensa 2", sector: "Sala pierna" },
  { id: "e1", modelo: "extension-rodilla", etiqueta: "Camilla cuádriceps", sector: "Sala pierna" },
  { id: "j1", modelo: "jalon-pecho", etiqueta: "Jalón", sector: "Sala espalda" },
  { id: "r1", modelo: "remo-sentado", etiqueta: "Remo bajo", sector: "Sala espalda" },
  { id: "b1", modelo: "press-pecho", etiqueta: "Press pecho", sector: "Sala empuje" },
  { id: "h1", modelo: "press-hombro", etiqueta: "Press hombro", sector: "Sala empuje" },
];

export const GIMNASIO = "Las Delicias";

export function buscarMaquina(id: string): { maquina: Maquina; modelo: Modelo } | null {
  const maquina = MAQUINAS.find((m) => m.id === id);
  if (!maquina) return null;
  const modelo = MODELOS.find((m) => m.id === maquina.modelo);
  return modelo ? { maquina, modelo } : null;
}

/** Cuántas unidades comparten cada modelo. Es el argumento del catálogo. */
export function unidadesPorModelo(modeloId: string): number {
  return MAQUINAS.filter((m) => m.modelo === modeloId).length;
}
