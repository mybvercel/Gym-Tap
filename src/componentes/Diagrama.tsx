import type { Dibujo } from "@/datos/tipos";

/**
 * Dibujos de referencia.
 *
 * Son SVG generados en el momento, no fotos. Tres razones: pesan cero y la
 * ficha tiene un presupuesto de carga ajustado; se ven igual en cualquier
 * gimnasio, sin que la foto muestre una máquina de otra marca; y sobre todo,
 * un esquema muestra la posición exacta que hay que copiar, mientras que una
 * foto de banco de imágenes muestra a alguien haciendo un gesto parecido.
 *
 * Cada dibujo está a escala: el ancho de agarre se ve contra los hombros, y el
 * arco de recorrido está en grados reales.
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

const LIENZO = "0 0 240 150";

function Marco({ children, titulo }: { children: React.ReactNode; titulo: string }) {
  return (
    <svg className="dibujo" viewBox={LIENZO} role="img" aria-label={titulo}>
      <title>{titulo}</title>
      {children}
    </svg>
  );
}

/** La plataforma de la prensa, vista desde donde está sentada la persona. */
function Plataforma({
  altura,
  ancho,
  punta,
}: Extract<Dibujo, { tipo: "plataforma" }>) {
  const y = { alta: 44, media: 72, baja: 100 }[altura];
  const dx = { junto: 13, normal: 27, ancho: 46 }[ancho];
  const giro = punta ? 16 : 0;

  return (
    <Marco titulo={`Pies ${altura === "media" ? "al medio" : altura} y ${ancho}`}>
      <rect className="pieza" x="46" y="18" width="148" height="114" rx="6" />
      {/* Las guías dividen la plataforma en tercios: es la referencia real que
          usa la gente para saber si está apoyando alto o bajo. */}
      <line className="guia" x1="46" y1="56" x2="194" y2="56" />
      <line className="guia" x1="46" y1="94" x2="194" y2="94" />
      {[-1, 1].map((lado) => (
        <rect
          key={lado}
          className="marca-pie"
          x={120 + lado * dx - 11}
          y={y - 17}
          width="22"
          height="34"
          rx="9"
          transform={giro ? `rotate(${lado * giro} ${120 + lado * dx} ${y})` : undefined}
        />
      ))}
      <text className="etiqueta" x="120" y="146" textAnchor="middle">
        plataforma
      </text>
    </Marco>
  );
}

/** La barra y las manos, con los hombros abajo para que el ancho signifique algo. */
function Barra({ ancho, agarre }: Extract<Dibujo, { tipo: "barra" }>) {
  const dx = { angosto: 24, medio: 46, ancho: 76 }[ancho];
  const HOMBRO = 30; // media distancia real del hombro, a la misma escala

  return (
    <Marco titulo={`Agarre ${ancho}, ${agarre}`}>
      {agarre === "neutro" ? (
        // El agarre neutro no es una barra: son dos manijas paralelas.
        [-1, 1].map((lado) => (
          <rect
            key={lado}
            className="pieza"
            x={120 + lado * dx - 4}
            y="26"
            width="8"
            height="34"
            rx="4"
          />
        ))
      ) : (
        <rect className="pieza" x={120 - dx - 18} y="38" width={dx * 2 + 36} height="8" rx="4" />
      )}

      {[-1, 1].map((lado) => (
        <rect
          key={lado}
          className="marca-mano"
          x={120 + lado * dx - 9}
          y={agarre === "supino" ? 44 : agarre === "prono" ? 24 : 30}
          width="18"
          height="24"
          rx="7"
        />
      ))}

      {/* Cabeza y hombros: sin esto, "ancho" y "angosto" no se distinguen. */}
      <circle className="cuerpo" cx="120" cy="92" r="13" />
      <line className="cuerpo-linea" x1={120 - HOMBRO} y1="116" x2={120 + HOMBRO} y2="116" />
      <text className="etiqueta" x="120" y="140" textAnchor="middle">
        {agarre === "prono" ? "palmas al frente" : agarre === "supino" ? "palmas hacia vos" : "palmas enfrentadas"}
      </text>
    </Marco>
  );
}

/** Vista de costado: respaldo, pecho y a qué altura queda la manija. */
function Perfil({ manija }: Extract<Dibujo, { tipo: "perfil" }>) {
  const y = { alta: 44, media: 66, baja: 88 }[manija];

  return (
    <Marco titulo={`Manija ${manija}`}>
      <rect className="pieza" x="48" y="26" width="12" height="84" rx="4" />
      <rect className="pieza" x="48" y="106" width="76" height="10" rx="4" />
      <circle className="cuerpo" cx="76" cy="38" r="12" />
      {/* La línea del esternón es la referencia contra la que se regula todo. */}
      <line className="guia" x1="60" y1="66" x2="200" y2="66" />
      <text className="etiqueta" x="200" y="60" textAnchor="end">
        esternón
      </text>
      <line className="trayecto" x1="82" y1={y} x2="176" y2={y} />
      <circle className="marca-mano-c" cx="176" cy={y} r="11" />
    </Marco>
  );
}

/** El arco que recorre la rodilla, en grados reales de flexión. */
function Arco({ desde, hasta }: Extract<Dibujo, { tipo: "arco" }>) {
  const cx = 74;
  const cy = 42;
  const r = 74;
  const punto = (grados: number) => {
    const rad = (grados * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x1, y1] = punto(desde);
  const [x2, y2] = punto(hasta);

  return (
    <Marco titulo={`Recorrido de ${desde}° a ${hasta}°`}>
      {/* El rango completo de la articulación, en gris. */}
      <path className="arco-total" d={`M ${punto(90)[0]} ${punto(90)[1]} A ${r} ${r} 0 0 0 ${punto(0)[0]} ${punto(0)[1]}`} />
      {/* El tramo que propone la variante. */}
      <path className="arco-activo" d={`M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`} />
      <line className="pieza-linea" x1={cx} y1={cy} x2={x1} y2={y1} />
      <line className="pieza-linea" x1={cx} y1={cy} x2={x2} y2={y2} />
      <line className="cuerpo-linea" x1="14" y1={cy} x2={cx} y2={cy} />
      <circle className="eje" cx={cx} cy={cy} r="5" />
      <text className="etiqueta" x={x1 + 8} y={y1} dominantBaseline="middle">
        {desde}°
      </text>
      <text className="etiqueta" x={x2 - 4} y={y2 - 10} textAnchor="end">
        {hasta}°
      </text>
    </Marco>
  );
}
