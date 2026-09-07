import type { Maquina, Modelo, Musculo, Sucursal } from "./tipos";

export * from "./tipos";

/**
 * El catálogo.
 *
 * Dos capas separadas a propósito, igual que el esquema de la base:
 *
 *  - `MODELOS` es contenido compartido. La prensa 45° es una sola en todo el
 *    sistema: su contenido se escribe una vez y lo usan todos los gimnasios que
 *    tengan una. Es lo que hace que dar de alta un gimnasio nuevo sea una tarde
 *    de pegar stickers y no un proyecto de producción de contenido.
 *
 *  - `MAQUINAS` son las unidades físicas de un gimnasio. Es lo único que cambia
 *    de cliente a cliente, y es lo que apunta cada chip: el ticket de
 *    mantenimiento tiene que saber CUÁL de las dos prensas está rota.
 *
 * Las reglas para escribir esto están en la skill `biomecanica-maquinas`.
 */

export const MODELOS: Modelo[] = [
  {
    id: "prensa-45",
    nombre: "Prensa 45°",
    familia: "Pierna",
    ejercicio: "prensa",
    resumen:
      "Empuje de pierna con la espalda apoyada. Es la máquina que más cambia según dónde pongas los pies.",
    musculos: ["cuadriceps", "gluteo", "isquios", "aductores"],
    pasos: [
      {
        titulo: "Sentate al fondo",
        detalle:
          "La cadera bien contra el respaldo. La zona baja de la espalda tiene que apoyar entera, sin que quede un hueco.",
        referencia: "Sin hueco lumbar",
      },
      {
        titulo: "Elegí dónde van los pies",
        detalle:
          "Es la decisión que define qué trabajás. Abajo en el apartado de objetivo está cada posición.",
        referencia: "Mirá el objetivo",
      },
      {
        titulo: "Probá el recorrido antes de soltar",
        detalle:
          "Bajá una vez con las trabas puestas y fijate hasta dónde llegás sin que se te despegue la cola del respaldo. Ese es tu tope.",
        referencia: "La cadera no se despega",
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
    variantes: [
      {
        id: "bajos-normal",
        nombre: "Pies bajos, al ancho de los hombros",
        objetivo: ["cuadriceps"],
        ajuste:
          "Apoyá en la mitad de abajo de la plataforma, con los pies separados al ancho de los hombros.",
        porque:
          "Cuanto más abajo apoyás, más se dobla la rodilla en cada repetición. La actividad del cuádriceps sube junto con ese ángulo de flexión.",
        rango: "Hasta 90° de rodilla, o hasta donde la cadera siga apoyada.",
        ojo: "Es también la posición que más carga la rodilla, justamente porque es la que más la dobla. Si molesta, subí los pies.",
        certeza: "solida",
        dibujo: { tipo: "plataforma", altura: "baja", ancho: "normal" },
      },
      {
        id: "altos-normal",
        nombre: "Pies altos",
        objetivo: ["gluteo", "isquios"],
        ajuste: "Subí los pies a la mitad de arriba de la plataforma, mismo ancho.",
        porque:
          "Con los pies arriba, la cadera se dobla más que la rodilla. El glúteo y el isquio se llevan una parte más grande del trabajo.",
        rango: "Bajá hasta sentir que la cadera está por despegarse, y ahí volvé.",
        certeza: "solida",
        dibujo: { tipo: "plataforma", altura: "alta", ancho: "normal" },
      },
      {
        id: "altos-anchos",
        nombre: "Pies altos y separados",
        objetivo: ["gluteo", "aductores"],
        ajuste:
          "Arriba y bien abiertos, más que el ancho de los hombros, con la punta hacia afuera.",
        porque:
          "El glúteo aumenta su actividad a medida que se separa la base, y la cara interna del muslo entra a trabajar para sostener la apertura. Es la combinación con más participación de glúteo.",
        ojo: "Abrir de más incomoda la rodilla. La rodilla siempre viaja en la misma línea que la punta del pie.",
        certeza: "solida",
        dibujo: { tipo: "plataforma", altura: "alta", ancho: "ancho", punta: true },
      },
      {
        id: "bajos-juntos",
        nombre: "Pies juntos y bajos",
        objetivo: ["cuadriceps"],
        ajuste: "Abajo, con los pies casi tocándose.",
        porque:
          "Cerrar la base saca a la cadera de la ecuación y deja casi todo el trabajo en el cuádriceps, con algo más de énfasis en la parte de afuera del muslo.",
        ojo: "Bajá el peso respecto de tu serie normal: es la posición con menos ayuda de la cadera.",
        certeza: "razonable",
        dibujo: { tipo: "plataforma", altura: "baja", ancho: "junto" },
      },
    ],
    mitos: [
      {
        creencia: "Con una posición de pies entrenás solo el glúteo o solo el cuádriceps.",
        realidad:
          "Ninguna posición aísla nada. Cambia el reparto del trabajo, no el ejercicio. La prensa siempre es cuádriceps y glúteo juntos.",
      },
      {
        creencia: "Bajar más siempre es mejor.",
        realidad:
          "Bajás más de lo que tu cadera aguanta y la espalda se redondea. El rango útil termina donde la cadera se despega, no donde llega la máquina.",
      },
    ],
    dolor: {
      rodilla: {
        ajuste:
          "Subí los pies unos centímetros en la plataforma y separalos un poco más. Eso pasa carga del cuádriceps a la cadera.",
        evitar: "Bajar más allá de los 90°.",
      },
      lumbar: {
        ajuste: "Subí el respaldo un punto y acortá el recorrido: bajá solo hasta la mitad.",
        evitar: "Cualquier rango donde la cadera se despegue del asiento.",
      },
    },
  },

  {
    id: "jalon-pecho",
    nombre: "Jalón al pecho",
    familia: "Espalda",
    ejercicio: "jalon",
    resumen:
      "Tirón vertical. Cambiar el agarre cambia menos de lo que se cree; lo que sí cambia es hacia dónde llevás la barra.",
    musculos: ["dorsal", "espalda-alta", "biceps"],
    pasos: [
      {
        titulo: "Trabá los muslos",
        detalle:
          "Bajá el rodillo hasta que apriete la pierna. Si al tirar te levantás del asiento, está muy alto.",
        referencia: "Que no te levante",
      },
      {
        titulo: "Agarre",
        detalle:
          "Para empezar, un puño más ancho que los hombros. En el apartado de objetivo está por qué cambiarlo y por qué muchas veces no hace falta.",
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
    variantes: [
      {
        id: "barra-adelante",
        nombre: "Barra hacia adelante del cuerpo",
        objetivo: ["dorsal"],
        ajuste:
          "En vez de tirar en vertical pegado a la cara, inclinate un poco atrás y llevá la barra hacia el pecho, adelante de la línea del cuerpo.",
        porque:
          "De todas las cosas que se probaron en esta máquina, el trayecto de la barra hacia adelante es la que más consistentemente apareció asociada a mayor actividad del dorsal. Más que el ancho del agarre.",
        rango: "La barra llega a las clavículas y ahí frena.",
        certeza: "razonable",
        dibujo: { tipo: "barra", ancho: "medio", agarre: "prono" },
      },
      {
        id: "neutro-cerrado",
        nombre: "Agarre neutro cerrado",
        objetivo: ["dorsal"],
        ajuste: "El triángulo, o el agarre con las palmas enfrentadas, manos cerca.",
        porque:
          "Con las manos cerca el codo viaja pegado al cuerpo y el hombro se extiende más, que es la función principal del dorsal.",
        ojo: "Es también el agarre que menos molesta el hombro.",
        certeza: "razonable",
        dibujo: { tipo: "barra", ancho: "angosto", agarre: "neutro" },
      },
      {
        id: "supino",
        nombre: "Agarre supino, al ancho de los hombros",
        objetivo: ["biceps", "dorsal"],
        ajuste: "Palmas hacia vos, manos al ancho de los hombros.",
        porque:
          "El bíceps queda en su mejor posición para tirar, así que participa bastante más. Suele ser también el agarre con el que más peso se mueve.",
        certeza: "razonable",
        dibujo: { tipo: "barra", ancho: "medio", agarre: "supino" },
      },
      {
        id: "ancho",
        nombre: "Agarre ancho",
        objetivo: ["espalda-alta"],
        ajuste: "Manos bien separadas, palmas hacia adelante.",
        porque:
          "Con el brazo más abierto entra más participación de la espalda alta. Sirve como variedad, no porque active más el dorsal: eso no aparece cuando se lo mide.",
        ojo: "Con este agarre vas a mover menos peso que con el medio o el angosto.",
        certeza: "preferencia",
        dibujo: { tipo: "barra", ancho: "ancho", agarre: "prono" },
      },
    ],
    mitos: [
      {
        creencia: "El agarre ancho activa más el dorsal y te hace la espalda más ancha.",
        realidad:
          "Es la creencia más repetida del gimnasio y no tiene respaldo claro. Comparando agarre angosto, medio y ancho, la activación del dorsal resultó parecida. Con angosto y medio, además, se mueve más peso.",
      },
      {
        creencia: "Tirar atrás de la nuca trabaja mejor la espalda.",
        realidad:
          "No trabaja mejor nada y pone el hombro en su peor posición. No hay ningún motivo para hacerlo.",
      },
    ],
    dolor: {
      hombro: {
        ajuste: "Pasá al agarre neutro (el triángulo) o cerrá las manos al ancho de los hombros.",
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
    resumen:
      "Tirón horizontal. Acá se decide entre espalda ancha y espalda gruesa, y se decide con el codo.",
    musculos: ["dorsal", "espalda-alta", "biceps"],
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
        titulo: "Elegí por dónde va el codo",
        detalle:
          "Pegado al cuerpo o abierto: es lo que define qué parte de la espalda se lleva el trabajo. Está abajo.",
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
    variantes: [
      {
        id: "codo-pegado",
        nombre: "Codo pegado al cuerpo",
        objetivo: ["dorsal"],
        ajuste:
          "Agarre neutro cerrado (el triángulo). Tirá hacia el ombligo, rozando las costillas con el codo.",
        porque:
          "Con el brazo cerca del cuerpo el hombro se extiende en línea recta hacia atrás, que es lo que hace el dorsal. El agarre más angosto y el brazo menos separado se asociaron a más actividad del dorsal.",
        rango: "Las manos llegan al abdomen, no más atrás.",
        certeza: "razonable",
        dibujo: { tipo: "barra", ancho: "angosto", agarre: "neutro" },
      },
      {
        id: "codo-abierto",
        nombre: "Codo abierto, tirón al pecho",
        objetivo: ["espalda-alta"],
        ajuste:
          "Barra ancha, palmas hacia abajo. Tirá hacia la parte de arriba del abdomen con los codos separados del cuerpo.",
        porque:
          "Con el brazo separado 45 a 60°, sube la participación del deltoides posterior, el trapecio y los romboides. Es la variante de grosor de espalda.",
        ojo: "Los hombros no suben. Si se encogen, bajá el peso.",
        certeza: "razonable",
        dibujo: { tipo: "barra", ancho: "ancho", agarre: "prono" },
      },
      {
        id: "supino-remo",
        nombre: "Agarre supino",
        objetivo: ["biceps", "dorsal"],
        ajuste: "Palmas hacia arriba, manos al ancho de los hombros, codos pegados.",
        porque: "El bíceps entra mucho más, y el codo pegado sigue dejando trabajo al dorsal.",
        certeza: "preferencia",
        dibujo: { tipo: "barra", ancho: "medio", agarre: "supino" },
      },
    ],
    mitos: [
      {
        creencia: "El remo y el jalón trabajan lo mismo, hacé uno u otro.",
        realidad:
          "El tirón horizontal y el vertical reparten distinto entre dorsal y espalda alta. Por eso conviene tener los dos, no elegir.",
      },
      {
        creencia: "Cuanto más atrás lleves la barra, mejor.",
        realidad:
          "Pasado el abdomen no hay más recorrido útil: lo que se mueve es el hombro hacia adelante y el torso hacia atrás. Ahí empieza el riesgo, no el estímulo.",
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
        ajuste: "Agarre neutro con la muñeca recta. Si igual molesta, usá muñequeras.",
      },
    },
  },

  {
    id: "press-pecho",
    nombre: "Press de pecho sentado",
    familia: "Pecho",
    ejercicio: "press-pecho",
    resumen:
      "Empuje horizontal con la espalda apoyada. La altura del asiento cambia qué parte del pecho empuja.",
    musculos: ["pectoral", "triceps", "hombro"],
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
    variantes: [
      {
        id: "manija-media",
        nombre: "Manija a la altura del esternón",
        objetivo: ["pectoral"],
        ajuste: "Asiento regulado para que la manija quede en el medio del pecho.",
        porque:
          "Es la altura donde el empuje va más horizontal, que es la dirección en la que el pectoral es más fuerte.",
        certeza: "razonable",
        dibujo: { tipo: "perfil", manija: "media" },
      },
      {
        id: "manija-alta",
        nombre: "Manija más alta que el pecho",
        objetivo: ["pectoral", "hombro"],
        ajuste: "Bajá el asiento un punto, de modo que la manija quede sobre la clavícula.",
        porque:
          "El empuje pasa a ser más hacia arriba, y ahí entra más la parte de arriba del pecho y el hombro de adelante.",
        ojo: "Si tenés molestia de hombro, esta no es la variante: probá la del esternón.",
        certeza: "razonable",
        dibujo: { tipo: "perfil", manija: "alta" },
      },
      {
        id: "codos-cerrados",
        nombre: "Codos cerca del cuerpo",
        objetivo: ["triceps"],
        ajuste: "Mismo asiento, pero empujá con los codos pegados a las costillas.",
        porque:
          "Cerrar el codo acorta el recorrido del hombro y alarga el del codo: el tríceps pasa a hacer más parte del trabajo.",
        certeza: "razonable",
        dibujo: { tipo: "perfil", manija: "baja" },
      },
    ],
    mitos: [
      {
        creencia: "Bajando bien abajo se trabaja el pecho de abajo.",
        realidad:
          "Lo que cambia el énfasis es el ángulo del empuje, no cuánto bajás. Bajar de más solo estira el hombro donde no conviene.",
      },
    ],
    dolor: {
      hombro: {
        ajuste:
          "Subí el asiento un punto para que las manijas queden más abajo y acortá el recorrido. Agarre neutro si la máquina lo tiene.",
        evitar: "Bajar hasta el pecho. Frená antes.",
      },
      muneca: {
        ajuste: "La manija apoyada en la base de la palma, no en los dedos, y la muñeca recta.",
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
    resumen:
      "La única máquina que carga el cuádriceps sin ayuda de la cadera. Lo que se elige acá es el tramo del recorrido.",
    musculos: ["cuadriceps"],
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
    variantes: [
      {
        id: "completo",
        nombre: "Recorrido completo",
        objetivo: ["cuadriceps"],
        ajuste: "Desde 90° de rodilla hasta casi estirado, sin trabar arriba.",
        porque:
          "Es el recorrido que cubre todo el rango de la articulación, y donde el músculo recibe estímulo tanto estirado como contraído.",
        rango: "De 90° a casi 0°.",
        certeza: "razonable",
        dibujo: { tipo: "arco", desde: 90, hasta: 5 },
      },
      {
        id: "tramo-estirado",
        nombre: "Solo la mitad de abajo",
        objetivo: ["cuadriceps"],
        ajuste: "Trabajá de 90° a la mitad del recorrido, sin llegar a estirar.",
        porque:
          "Trabajar el músculo en posiciones estiradas es una forma eficiente de acumular estímulo, y evita el tramo final, que es el que más comprime la rótula.",
        ojo: "Con menos recorrido, menos peso: no compenses subiendo la carga.",
        certeza: "razonable",
        dibujo: { tipo: "arco", desde: 90, hasta: 45 },
      },
      {
        id: "tramo-final",
        nombre: "Solo la mitad de arriba",
        objetivo: ["cuadriceps"],
        ajuste: "De la mitad del recorrido hasta casi estirado, con una pausa arriba.",
        porque: "Es donde el cuádriceps termina de contraerse y donde se sostiene la rodilla.",
        ojo: "Es el tramo que más comprime la rótula. Si tenés molestia adelante de la rodilla, usá el otro.",
        certeza: "razonable",
        dibujo: { tipo: "arco", desde: 45, hasta: 5 },
      },
    ],
    mitos: [
      {
        creencia: "Girando la punta del pie trabajás el vasto interno, la gota del muslo.",
        realidad:
          "Se midió y no aparece: no hay activación selectiva de esa porción por girar el pie. Lo poco que mostró algún efecto fue apretar algo entre las rodillas, no el ángulo del pie.",
      },
      {
        creencia: "La extensión de rodilla es mala para las rodillas.",
        realidad:
          "Lo que hace daño es trabar arriba con mucho peso o arrancar de golpe. Bien hecha es de las formas más controladas de cargar el cuádriceps.",
      },
    ],
    dolor: {
      rodilla: {
        ajuste: "Acortá el recorrido a la mitad de abajo y bajá bastante el peso.",
        evitar: "El tramo final, con la rodilla casi estirada.",
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
    resumen: "Empuje vertical sentado. La orientación de la mano es lo que más cambia acá.",
    musculos: ["hombro", "triceps"],
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
        titulo: "Elegí el agarre",
        detalle: "Neutro o prono cambian bastante la comodidad del hombro. Está abajo.",
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
    variantes: [
      {
        id: "neutro-hombro",
        nombre: "Agarre neutro",
        objetivo: ["hombro"],
        ajuste: "Palmas enfrentadas, si la máquina tiene las manijas paralelas.",
        porque:
          "Con la palma hacia adentro el hombro rota menos hacia afuera, que es la posición donde más gente tiene molestias.",
        ojo: "Es el agarre por defecto si alguna vez te molestó el hombro.",
        certeza: "razonable",
        dibujo: { tipo: "barra", ancho: "medio", agarre: "neutro" },
      },
      {
        id: "prono-hombro",
        nombre: "Agarre prono",
        objetivo: ["hombro"],
        ajuste: "Palmas hacia adelante, manos apenas más abiertas que los hombros.",
        porque:
          "Es el agarre clásico y con el que la mayoría mueve más peso. Reparte algo más hacia la parte de adelante y del costado del hombro.",
        certeza: "preferencia",
        dibujo: { tipo: "barra", ancho: "medio", agarre: "prono" },
      },
      {
        id: "recorrido-corto",
        nombre: "Frenar a la altura de la frente",
        objetivo: ["hombro", "triceps"],
        ajuste: "Empujá hasta que las manos pasen la frente, sin estirar del todo arriba.",
        porque:
          "Mantiene tensión constante en el hombro y saca el tramo final, que es el que más suele molestar.",
        certeza: "razonable",
        dibujo: { tipo: "arco", desde: 90, hasta: 30 },
      },
    ],
    mitos: [
      {
        creencia: "El press por detrás de la nuca desarrolla mejor el hombro.",
        realidad:
          "No desarrolla mejor nada y pone la articulación en su posición más vulnerable. No hay razón para hacerlo.",
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

export const SUCURSALES: Sucursal[] = [
  { id: "guemes", nombre: "Güemes", prefijo: "QVX-GUEM" },
  { id: "nueva-cba", nombre: "Nueva Córdoba", prefijo: "QVX-NCBA" },
];

/**
 * Las unidades físicas. Cada una tiene su chip.
 *
 * Dos sucursales con las mismas máquinas: es el argumento del catálogo puesto
 * a prueba. Las cuatro prensas del sistema comparten una sola ficha, escrita
 * una vez, y lo único propio de cada unidad es dónde está, qué código tiene y
 * si funciona.
 */
export const MAQUINAS: Maquina[] = [
  {
    id: "p1", codigo: "QVX-GUEM-PR-023", sucursal: "guemes", modelo: "prensa-45",
    etiqueta: "Prensa 1", sector: "Sala pierna", estado: "operativa", cadaDias: 30,
    ultimoServicio: { fecha: "2026-08-14", tecnico: "M. Ávila", problema: "Engrase de guías" },
  },
  {
    id: "p2", codigo: "QVX-GUEM-PR-024", sucursal: "guemes", modelo: "prensa-45",
    etiqueta: "Prensa 2", sector: "Sala pierna", estado: "observacion", cadaDias: 30,
    ultimoServicio: { fecha: "2026-07-02", tecnico: "M. Ávila", problema: "Cambio de traba lateral", repuesto: "Traba 12 mm" },
  },
  {
    id: "e1", codigo: "QVX-GUEM-EX-011", sucursal: "guemes", modelo: "extension-rodilla",
    etiqueta: "Camilla cuádriceps", sector: "Sala pierna", estado: "operativa", cadaDias: 45,
    ultimoServicio: { fecha: "2026-08-28", tecnico: "R. Paz", problema: "Ajuste de rodillo" },
  },
  {
    id: "j1", codigo: "QVX-GUEM-JA-006", sucursal: "guemes", modelo: "jalon-pecho",
    etiqueta: "Jalón", sector: "Sala espalda", estado: "operativa", cadaDias: 30,
    ultimoServicio: { fecha: "2026-06-19", tecnico: "R. Paz", problema: "Cambio de cable", repuesto: "Cable 5 mm · 3,2 m" },
  },
  {
    id: "r1", codigo: "QVX-GUEM-RE-004", sucursal: "guemes", modelo: "remo-sentado",
    etiqueta: "Remo bajo", sector: "Sala espalda", estado: "operativa", cadaDias: 30,
  },
  {
    id: "b1", codigo: "QVX-GUEM-PP-009", sucursal: "guemes", modelo: "press-pecho",
    etiqueta: "Press pecho", sector: "Sala empuje", estado: "operativa", cadaDias: 30,
    ultimoServicio: { fecha: "2026-08-30", tecnico: "M. Ávila", problema: "Tapizado del respaldo", repuesto: "Tapizado" },
  },
  {
    id: "h1", codigo: "QVX-GUEM-PH-002", sucursal: "guemes", modelo: "press-hombro",
    etiqueta: "Press hombro", sector: "Sala empuje", estado: "fuera-de-servicio", cadaDias: 30,
    ultimoServicio: { fecha: "2026-05-11", tecnico: "R. Paz", problema: "Revisión general" },
  },
  {
    id: "n1", codigo: "QVX-NCBA-PR-001", sucursal: "nueva-cba", modelo: "prensa-45",
    etiqueta: "Prensa", sector: "Planta baja", estado: "operativa", cadaDias: 30,
    ultimoServicio: { fecha: "2026-09-01", tecnico: "L. Sosa", problema: "Engrase de guías" },
  },
  {
    id: "n2", codigo: "QVX-NCBA-JA-002", sucursal: "nueva-cba", modelo: "jalon-pecho",
    etiqueta: "Jalón", sector: "Planta alta", estado: "operativa", cadaDias: 30,
  },
  {
    id: "n3", codigo: "QVX-NCBA-PP-003", sucursal: "nueva-cba", modelo: "press-pecho",
    etiqueta: "Press pecho", sector: "Planta alta", estado: "operativa", cadaDias: 30,
    ultimoServicio: { fecha: "2026-04-20", tecnico: "L. Sosa", problema: "Cambio de polea", repuesto: "Polea 90 mm" },
  },
];

export function buscarMaquina(id: string): { maquina: Maquina; modelo: Modelo } | null {
  const maquina = MAQUINAS.find((m) => m.id === id);
  if (!maquina) return null;
  const modelo = MODELOS.find((m) => m.id === maquina.modelo);
  return modelo ? { maquina, modelo } : null;
}

export function buscarModelo(id: string): Modelo | undefined {
  return MODELOS.find((m) => m.id === id);
}

export function nombreSucursal(id: string): string {
  return SUCURSALES.find((s) => s.id === id)?.nombre ?? id;
}

/** Cuántas unidades comparten cada modelo. Es el argumento del catálogo. */
export function unidadesPorModelo(modeloId: string): number {
  return MAQUINAS.filter((m) => m.modelo === modeloId).length;
}

/** Qué músculos se pueden entrenar y en qué máquinas. */
export function maquinasPorMusculo(musculo: Musculo): Maquina[] {
  const modelos = MODELOS.filter((m) => m.musculos.includes(musculo)).map((m) => m.id);
  return MAQUINAS.filter((m) => modelos.includes(m.modelo));
}

/**
 * Cuándo toca la próxima revisión.
 *
 * Se calcula, no se guarda: una fecha guardada queda vieja el día que alguien
 * cambia la frecuencia y nadie recalcula la tabla.
 */
export function proximoServicio(maquina: Maquina): { fecha: Date; diasRestantes: number } | null {
  if (!maquina.ultimoServicio) return null;
  const fecha = new Date(maquina.ultimoServicio.fecha);
  fecha.setDate(fecha.getDate() + maquina.cadaDias);
  const diasRestantes = Math.round((fecha.getTime() - Date.now()) / 86400000);
  return { fecha, diasRestantes };
}
