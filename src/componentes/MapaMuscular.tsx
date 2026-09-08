import type { Musculo } from "@/datos/tipos";

/**
 * El mapa muscular: cuerpo de frente y de espalda, con los músculos que
 * trabaja la máquina pintados en rojo.
 *
 * Está dibujado y no es una imagen por una razón que decide todo: hay que
 * poder encender un músculo distinto según la máquina y según lo que la
 * persona elija. Con imágenes harían falta diez versiones por máquina, todas
 * distintas entre sí y ninguna actualizable.
 *
 * Dos decisiones de dibujo que hacen que se vea anatómico y no como burbujas:
 *
 * 1. Cada músculo lleva un borde del color del fondo. Eso abre una costura
 *    entre grupos vecinos, que es exactamente lo que separa un dibujo
 *    anatómico de un montón de manchas pegadas.
 *
 * 2. Se dibuja media persona y se refleja. Un cuerpo asimétrico se nota al
 *    instante aunque nadie sepa decir por qué, y ajustar dos lados a mano
 *    garantiza que en algún momento dejen de coincidir. Acá la simetría es
 *    imposible de romper.
 *
 * La silueta va aparte, como recorte, así los músculos pueden pasarse de
 * los bordes sin que se vea: quedan cortados justo en el contorno.
 */

interface Props {
  /** Los músculos que trabaja la máquina. Se dibujan apagados si no hay foco. */
  trabaja: Musculo[];
  /** El que la persona eligió. Se enciende en rojo pleno. */
  foco?: Musculo | null;
}

/** El eje de simetría de cada figura. Todo se refleja contra esta línea. */
const EJE = 200;

export function MapaMuscular({ trabaja, foco }: Props) {
  /**
   * Tres estados y no dos: el elegido en rojo pleno, los otros que la máquina
   * también trabaja en rojo apagado, y el resto en gris. Sin el estado del
   * medio se pierde la respuesta a "qué más hace esta máquina".
   */
  const e = (m: Musculo) => (foco === m ? "foco" : trabaja.includes(m) ? "trabaja" : "neutro");

  return (
    <svg
      className="mapa"
      viewBox="0 0 420 500"
      role="img"
      aria-label={
        foco
          ? `Cuerpo humano con ${foco} marcado en rojo`
          : "Cuerpo humano con los músculos que trabaja esta máquina marcados en rojo"
      }
    >
      <defs>
        <Silueta />
      </defs>

      <g clipPath="url(#silueta)">
        <rect className="mapa-cuerpo" x="0" y="0" width="200" height="480" />
        <Frente e={e} />
      </g>

      <g transform="translate(220 0)">
        <g clipPath="url(#silueta)">
          <rect className="mapa-cuerpo" x="0" y="0" width="200" height="480" />
          <Espalda e={e} />
        </g>
      </g>

      <text className="mapa-pie" x="100" y="496" textAnchor="middle">
        FRENTE
      </text>
      <text className="mapa-pie" x="320" y="496" textAnchor="middle">
        ESPALDA
      </text>
    </svg>
  );
}

/**
 * El contorno del cuerpo.
 *
 * De frente y de espalda la silueta es la misma, así que se define una vez.
 * Adentro de un `clipPath` solo valen figuras sueltas: un `<g>` ahí el
 * navegador lo ignora, el recorte queda vacío y desaparece todo el dibujo sin
 * tirar ningún error. Por eso el brazo y la pierna se repiten con un
 * `transform` propio en vez de agruparse.
 */
const BRAZO =
  "M137 82 C152 85 161 99 161 118 C161 136 157 156 154 178 C153 188 152 196 153 206 C155 224 158 246 156 264 C160 278 161 294 155 301 C147 307 140 304 137 295 C134 283 135 271 136 261 C134 243 132 224 132 206 C131 196 131 188 132 178 C130 156 130 134 132 118 C132 102 135 88 137 82 Z";

const PIERNA =
  "M100 248 C118 246 133 252 139 264 C144 288 143 318 139 348 C137 362 134 372 133 382 C137 402 139 422 135 442 C133 454 131 460 129 466 C134 472 134 478 127 478 L109 478 C106 470 106 460 108 450 C111 426 113 406 111 382 C109 368 107 358 107 348 C104 316 100 280 100 248 Z";

function Silueta() {
  const espejo = `translate(${EJE} 0) scale(-1 1)`;
  return (
    <clipPath id="silueta">
      <ellipse cx="100" cy="36" rx="21" ry="26" />
      <path d="M89 52 L111 52 L114 76 L86 76 Z" />
      {/* Tronco: hombros, cintura y cadera en una sola figura simétrica. */}
      <path d="M88 68 L112 68 L141 85 C147 99 146 117 137 129 C132 148 129 160 127 174 C125 188 124 194 124 202 C124 218 130 236 136 252 L100 262 L64 252 C70 236 76 218 76 202 C76 194 75 188 73 174 C71 160 68 148 64 128 C53 117 54 99 59 85 Z" />
      <path d={BRAZO} />
      <path d={BRAZO} transform={espejo} />
      <path d={PIERNA} />
      <path d={PIERNA} transform={espejo} />
    </clipPath>
  );
}

type Est = (m: Musculo) => string;

/** Un músculo. El borde del color del fondo es lo que abre la costura. */
function M({ m, d, e }: { m: Musculo; d: string; e: Est }) {
  return <path className="m" data-e={e(m)} d={d} />;
}

/** Los pares se dibujan una vez y se reflejan: la simetría no se puede romper. */
function Par({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <g transform={`translate(${EJE} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}

function Frente({ e }: { e: Est }) {
  return (
    <>
      {/* Trapecio visible desde el frente: el puente entre cuello y hombro. */}
      <path className="m" data-e={e("espalda-alta")} d="M100 66 L126 78 L118 92 L100 88 L82 92 L74 78 Z" />

      <Par>
        <M m="hombro" e={e} d="M135 82 C151 85 162 99 163 118 C156 124 145 121 139 112 C135 101 134 89 135 82 Z" />
        <M m="pectoral" e={e} d="M100 90 C114 86 129 89 135 100 C139 113 134 126 121 129 C109 131 102 124 100 115 Z" />
        <M m="biceps" e={e} d="M137 124 C149 127 156 141 155 160 C154 174 149 182 143 181 C137 174 134 152 137 124 Z" />
        <M m="triceps" e={e} d="M133 128 C129 146 130 166 134 180 C138 182 141 178 141 168 C140 150 138 136 133 128 Z" />
      </Par>

      {/* Abdomen: la columna central con sus cortes, dibujada simétrica. */}
      <path className="m abdomen" data-e="neutro" d="M87 132 L113 132 L115 176 L100 190 L85 176 Z" />
      <path className="costura" d="M100 132 L100 188 M87 148 L113 148 M88 164 L112 164" />

      <Par>
        {/* Oblicuo: el costado que baja hacia la cadera. */}
        <path className="m" data-e="neutro" d="M116 138 C126 142 130 158 128 178 C126 190 120 194 116 190 Z" />
        <M m="aductores" e={e} d="M102 264 C109 272 112 294 110 318 C108 336 104 344 101 340 Z" />
        <M m="cuadriceps" e={e} d="M107 258 C124 258 135 272 136 296 C137 320 132 344 125 356 C116 362 110 354 109 340 C105 314 105 282 107 258 Z" />
        {/* Antebrazo y pantorrilla: no son objetivo, pero sin ellos el cuerpo
            se ve incompleto y el dibujo pierde credibilidad. */}
        <path className="m" data-e="neutro" d="M136 190 C148 194 156 210 157 230 C156 248 150 256 144 254 C137 244 134 214 136 190 Z" />
        <path className="m" data-e="neutro" d="M112 388 C126 390 133 406 133 426 C132 442 127 450 121 448 C113 442 111 410 112 388 Z" />
      </Par>
    </>
  );
}

function Espalda({ e }: { e: Est }) {
  return (
    <>
      {/* Trapecio: el diamante que domina la espalda alta. */}
      <path
        className="m"
        data-e={e("espalda-alta")}
        d="M100 64 L128 80 C134 100 128 124 112 136 L100 142 L88 136 C72 124 66 100 72 80 Z"
      />

      <Par>
        <M m="hombro" e={e} d="M135 82 C151 85 162 99 163 118 C156 124 145 121 139 112 C135 101 134 89 135 82 Z" />
        <M m="dorsal" e={e} d="M118 118 C131 124 137 142 133 164 C129 182 116 192 105 188 L103 142 Z" />
        <M m="triceps" e={e} d="M137 124 C150 128 157 144 155 163 C153 176 147 183 142 179 C136 164 134 140 137 124 Z" />
        <M m="gluteo" e={e} d="M102 224 C121 221 136 233 136 253 C136 270 124 279 111 276 C102 271 100 250 102 224 Z" />
        <M m="isquios" e={e} d="M107 282 C124 282 134 296 135 318 C135 342 130 360 124 366 C115 370 110 360 109 342 C105 320 105 300 107 282 Z" />
        <path className="m" data-e="neutro" d="M136 190 C148 194 156 210 157 230 C156 248 150 256 144 254 C137 244 134 214 136 190 Z" />
        <path className="m" data-e="neutro" d="M110 386 C126 388 134 406 134 428 C133 444 127 452 121 450 C112 444 109 410 110 386 Z" />
      </Par>

      {/* Zona lumbar. */}
      <path className="m" data-e="neutro" d="M90 150 L110 150 C114 170 116 190 112 208 L100 220 L88 208 C84 190 86 170 90 150 Z" />
      <path className="costura" d="M100 156 L100 214" />
    </>
  );
}
