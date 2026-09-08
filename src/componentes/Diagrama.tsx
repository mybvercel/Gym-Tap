import type { Dibujo } from "@/datos/tipos";

/**
 * Los dibujos de referencia de cada variante.
 *
 * Son SVG y no fotos, y la razón no es el peso. Una instrucción como "más
 * arriba que el ancho de los hombros" solo se entiende si hay contra qué
 * compararla: sin una referencia dibujada al lado, la persona mira la foto,
 * mira su máquina, y no sabe si está igual o distinto.
 *
 * Por eso todos los dibujos tienen dos cosas que una foto no puede dar:
 *
 *  - Una **referencia del cuerpo** siempre visible: los hombros marcados
 *    debajo del agarre, o la horquilla de ancho debajo de los pies. La medida
 *    es el cuerpo de quien mira, no un centímetro abstracto.
 *
 *  - **Zonas nombradas**: la plataforma dividida en alto, medio y bajo, con
 *    su etiqueta. Así "apoyá arriba" deja de ser relativo.
 *
 * Una foto además muestra una máquina concreta, y el gimnasio tiene varias
 * marcas. La persona compara con la suya y no coincide.
 */
export function Diagrama({ dibujo }: { dibujo: Dibujo }) {
  switch (dibujo.tipo) {
    case "plataforma":
      return <Plataforma {...dibujo} />;
    case "barra":
      return <Barra {...dibujo} />;
    case "perfil":
      return <Perfil {...dibujo} />;
    case "arco":
      return <Arco {...dibujo} />;
  }
}

function Marco({ children, titulo }: { children: React.ReactNode; titulo: string }) {
  return (
    <svg className="dibujo" viewBox="0 0 260 230" role="img" aria-label={titulo}>
      <title>{titulo}</title>
      {children}
    </svg>
  );
}

/** La plataforma de la prensa, vista desde donde está sentada la persona. */
function Plataforma({ altura, ancho, punta }: Extract<Dibujo, { tipo: "plataforma" }>) {
  const y = { alta: 62, media: 108, baja: 154 }[altura];
  const dx = { junto: 15, normal: 30, ancho: 50 }[ancho];
  const giro = punta ? 17 : 0;
  const HOMBRO = 30; // media distancia real del hombro, a la misma escala

  return (
    <Marco titulo={`Pies ${altura === "media" ? "al medio" : altura} y ${ancho}`}>
      <rect className="pieza" x="58" y="26" width="164" height="164" rx="10" />

      {/* Los tercios con su nombre: sin esto, "arriba" no se puede medir. */}
      <line className="guia" x1="58" y1="80" x2="222" y2="80" />
      <line className="guia" x1="58" y1="136" x2="222" y2="136" />
      <text className="etiqueta" x="50" y="57" textAnchor="end">ALTO</text>
      <text className="etiqueta" x="50" y="112" textAnchor="end">MEDIO</text>
      <text className="etiqueta" x="50" y="168" textAnchor="end">BAJO</text>

      {[-1, 1].map((lado) => (
        <rect
          key={lado}
          className="marca-pie"
          x={140 + lado * dx - 13}
          y={y - 21}
          width="26"
          height="42"
          rx="11"
          transform={giro ? `rotate(${lado * giro} ${140 + lado * dx} ${y})` : undefined}
        />
      ))}

      {/* La horquilla del ancho de hombros: es la unidad de medida real. */}
      <g className="referencia">
        <line x1={140 - HOMBRO} y1="206" x2={140 + HOMBRO} y2="206" />
        <line x1={140 - HOMBRO} y1="200" x2={140 - HOMBRO} y2="212" />
        <line x1={140 + HOMBRO} y1="200" x2={140 + HOMBRO} y2="212" />
      </g>
      <text className="etiqueta" x="140" y="224" textAnchor="middle">
        ancho de hombros
      </text>
    </Marco>
  );
}

/** La barra y las manos, con los hombros abajo para que el ancho signifique algo. */
function Barra({ ancho, agarre }: Extract<Dibujo, { tipo: "barra" }>) {
  const dx = { angosto: 28, medio: 54, ancho: 88 }[ancho];
  const HOMBRO = 34;

  return (
    <Marco titulo={`Agarre ${ancho}, ${agarre}`}>
      {agarre === "neutro" ? (
        // El agarre neutro no es una barra: son dos manijas paralelas.
        [-1, 1].map((lado) => (
          <rect
            key={lado}
            className="pieza"
            x={130 + lado * dx - 5}
            y="34"
            width="10"
            height="44"
            rx="5"
          />
        ))
      ) : (
        <rect className="pieza" x={130 - dx - 22} y="50" width={dx * 2 + 44} height="10" rx="5" />
      )}

      {[-1, 1].map((lado) => (
        <rect
          key={lado}
          className="marca-mano"
          x={130 + lado * dx - 12}
          y={agarre === "supino" ? 58 : agarre === "prono" ? 32 : 40}
          width="24"
          height="30"
          rx="9"
        />
      ))}

      {/* Cabeza y hombros: sin esto, ancho y angosto no se distinguen. */}
      <circle className="cuerpo" cx="130" cy="122" r="17" />
      <line className="cuerpo-linea" x1={130 - HOMBRO} y1="152" x2={130 + HOMBRO} y2="152" />
      <g className="referencia">
        <line x1={130 - HOMBRO} y1="176" x2={130 + HOMBRO} y2="176" />
        <line x1={130 - HOMBRO} y1="170" x2={130 - HOMBRO} y2="182" />
        <line x1={130 + HOMBRO} y1="170" x2={130 + HOMBRO} y2="182" />
      </g>
      <text className="etiqueta" x="130" y="196" textAnchor="middle">
        ancho de hombros
      </text>
      <text className="etiqueta" x="130" y="216" textAnchor="middle">
        {agarre === "prono"
          ? "palmas hacia adelante"
          : agarre === "supino"
            ? "palmas hacia vos"
            : "palmas enfrentadas"}
      </text>
    </Marco>
  );
}

/** Vista de costado: respaldo, pecho y a qué altura queda la manija. */
function Perfil({ manija }: Extract<Dibujo, { tipo: "perfil" }>) {
  const y = { alta: 66, media: 100, baja: 134 }[manija];

  return (
    <Marco titulo={`Manija ${manija}`}>
      <rect className="pieza" x="46" y="40" width="14" height="122" rx="5" />
      <rect className="pieza" x="46" y="156" width="86" height="12" rx="5" />
      <circle className="cuerpo" cx="78" cy="54" r="15" />

      {/* La línea del esternón es la referencia contra la que se regula todo. */}
      <line className="guia" x1="60" y1="100" x2="232" y2="100" />
      <text className="etiqueta" x="232" y="92" textAnchor="end">
        altura del esternón
      </text>

      <line className="trayecto" x1="88" y1={y} x2="200" y2={y} />
      <circle className="marca-mano-c" cx="200" cy={y} r="14" />
      <text className="etiqueta" x="130" y="214" textAnchor="middle">
        visto de costado
      </text>
    </Marco>
  );
}

/** El arco que recorre la rodilla, en grados reales de flexión. */
function Arco({ desde, hasta }: Extract<Dibujo, { tipo: "arco" }>) {
  const cx = 84;
  const cy = 62;
  const r = 96;
  const punto = (grados: number) => {
    const rad = (grados * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x1, y1] = punto(desde);
  const [x2, y2] = punto(hasta);

  return (
    <Marco titulo={`Recorrido de ${desde}° a ${hasta}°`}>
      {/* El rango completo de la articulación, en gris. */}
      <path
        className="arco-total"
        d={`M ${punto(90)[0]} ${punto(90)[1]} A ${r} ${r} 0 0 0 ${punto(0)[0]} ${punto(0)[1]}`}
      />
      <path className="arco-activo" d={`M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`} />

      <line className="pieza-linea" x1={cx} y1={cy} x2={x1} y2={y1} />
      <line className="pieza-linea" x1={cx} y1={cy} x2={x2} y2={y2} />
      <line className="cuerpo-linea" x1="16" y1={cy} x2={cx} y2={cy} />
      <circle className="eje" cx={cx} cy={cy} r="6" />

      <text className="etiqueta" x={x1 + 12} y={y1 + 4}>{desde}°</text>
      <text className="etiqueta" x={x2 - 6} y={y2 - 12} textAnchor="end">{hasta}°</text>
      <text className="etiqueta" x="30" y={cy - 14}>muslo</text>
      <text className="etiqueta" x="130" y="214" textAnchor="middle">
        recorrido de la rodilla
      </text>
    </Marco>
  );
}
