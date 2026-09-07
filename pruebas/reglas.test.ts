import assert from "node:assert/strict";

/**
 * Las reglas que no pueden romperse sin que alguien se entere.
 *
 * Corren sin navegador. `localStorage` se reemplaza por un Map antes de
 * importar el almacén, que es lo único que ese módulo necesita del entorno.
 */
const memoria = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => memoria.get(k) ?? null,
  setItem: (k: string, v: string) => void memoria.set(k, v),
  removeItem: (k: string) => void memoria.delete(k),
  clear: () => memoria.clear(),
  key: () => null,
  length: 0,
} as Storage;

/* El destino es CommonJS: no admite await de nivel superior. */
async function principal() {
  const { FALLAS, leerEstados, leerTickets, limpiarDemo, reportarFalla } = await import("../src/lib/local.ts");
  const { siguienteSerie, SALTO_KG } = await import("../src/lib/progresion.ts");
  const { PAUTAS } = await import("../src/datos/tipos.ts");
  const { proximoServicio, MAQUINAS } = await import("../src/datos/catalogo.ts");

  let ok = 0;
  const prueba = (nombre: string, fn: () => void) => {
    limpiarDemo();
    fn();
    ok++;
    console.log("  ok  " + nombre);
  };

  const masa = PAUTAS.find((p) => p.id === "masa")!;

  prueba("veinte personas reportando lo mismo generan un solo ticket", () => {
    for (let i = 0; i < 20; i++) reportarFalla("p1", "Prensa 1", "cable");
    const tickets = leerTickets();
    assert.equal(tickets.length, 1);
    assert.equal(tickets[0].reportes, 20);
  });

  prueba("dos fallas distintas en la misma máquina son dos tickets", () => {
    reportarFalla("p1", "Prensa 1", "cable");
    reportarFalla("p1", "Prensa 1", "sucia");
    assert.equal(leerTickets().length, 2);
  });

  prueba("una falla que puede lastimar saca la máquina de servicio sola", () => {
    reportarFalla("p1", "Prensa 1", "rota");
    assert.equal(leerEstados()["p1"], "fuera-de-servicio");
  });

  prueba("una falla menor no saca la máquina de servicio", () => {
    reportarFalla("p1", "Prensa 1", "sucia");
    assert.equal(leerEstados()["p1"], undefined);
  });

  prueba("solo las fallas peligrosas están marcadas para sacar de servicio", () => {
    const peligrosas = FALLAS.filter((f) => f.sacaDeServicio).map((f) => f.id);
    assert.deepEqual(peligrosas.sort(), ["cable", "rota"]);
  });

  prueba("dentro del rango se suben repeticiones, no peso", () => {
    const s = siguienteSerie({ peso: 40, reps: 9, objetivo: "masa", fecha: 0 }, masa);
    assert.deepEqual(s, { peso: 40, reps: 10, subio: false });
  });

  prueba("llegando al techo del rango se sube el peso y se vuelve al piso", () => {
    const s = siguienteSerie({ peso: 40, reps: 12, objetivo: "masa", fecha: 0 }, masa);
    assert.deepEqual(s, { peso: 40 + SALTO_KG, reps: masa.reps[0], subio: true });
  });

  prueba("pasarse del techo también sube el peso", () => {
    const s = siguienteSerie({ peso: 40, reps: 15, objetivo: "masa", fecha: 0 }, masa);
    assert.equal(s!.subio, true);
  });

  prueba("sin historial no se sugiere nada", () => {
    assert.equal(siguienteSerie(undefined, masa), null);
  });

  prueba("el próximo service se calcula sobre el último, no se guarda", () => {
    const maquina = { ...MAQUINAS[0], cadaDias: 30, ultimoServicio: { fecha: "2026-01-01", tecnico: "x", problema: "y" } };
    const p = proximoServicio(maquina)!;
    assert.equal(p.fecha.toISOString().slice(0, 10), "2026-01-31");
  });

  prueba("una máquina sin service registrado no tiene próxima fecha", () => {
    assert.equal(proximoServicio({ ...MAQUINAS[0], ultimoServicio: undefined }), null);
  });

  console.log(`\n${ok} pruebas pasaron`);
}

void principal();
