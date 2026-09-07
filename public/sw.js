/* -------------------------------------------------------------------
   El trabajador de servicio.

   Un gimnasio es un sótano con paredes de hormigón. La ficha tiene que
   abrirse igual, y ahí aparece la trampa: un caché normal guarda lo que
   ya se visitó, pero nadie visitó todavía la máquina que está por usar.

   La solución es aprovechar la primera lectura del día. Al abrir
   CUALQUIER ficha se traen en segundo plano todas las demás de la sala:
   son unos pocos KB por máquina, menos de lo que acaba de bajar sin
   quejarse para ver esa misma ficha.
   ------------------------------------------------------------------- */

const CACHE = "ficha-v1";
const SIN_RED = "/sin-red.html";
const MARCA_SALA = "/__sala-precargada";

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(["/", SIN_RED]))
      // Sin esperar a que se cierren las pestañas viejas: en un teléfono
      // que se usa entre series, esa espera es para siempre.
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const esFicha = (url) => url.pathname === "/" || url.pathname.startsWith("/m/");
/* Los archivos de Next llevan un hash en el nombre: si cambia el contenido,
   cambia la dirección. Se pueden guardar para siempre sin revisar nada. */
const esInmutable = (url) => url.pathname.startsWith("/_next/static/");

self.addEventListener("fetch", (evento) => {
  const pedido = evento.request;
  if (pedido.method !== "GET") return;

  const url = new URL(pedido.url);
  if (url.origin !== self.location.origin) return;

  if (esInmutable(url)) {
    evento.respondWith(primeroCache(pedido));
    return;
  }

  if (esFicha(url)) {
    evento.respondWith(cacheYActualiza(pedido));
    evento.waitUntil(precargarSala());
  }
});

async function primeroCache(pedido) {
  const guardado = await caches.match(pedido);
  if (guardado) return guardado;
  const respuesta = await fetch(pedido);
  if (respuesta.ok) (await caches.open(CACHE)).put(pedido, respuesta.clone());
  return respuesta;
}

/**
 * Se responde con lo guardado y se actualiza por detrás.
 *
 * Adentro del gimnasio el disco es más rápido y más confiable que la red, así
 * que la ficha aparece al instante. Si el contenido cambió, la versión nueva
 * queda lista para la próxima lectura, que es dentro de un minuto.
 */
async function cacheYActualiza(pedido) {
  const cache = await caches.open(CACHE);
  const guardado = await cache.match(pedido);

  const enRed = fetch(pedido)
    .then((respuesta) => {
      if (respuesta.ok) cache.put(pedido, respuesta.clone());
      return respuesta;
    })
    .catch(() => null);

  if (guardado) return guardado;
  return (await enRed) ?? (await cache.match(SIN_RED)) ?? Response.error();
}

/**
 * La primera ficha del día paga el costo de todas.
 *
 * Se hace una sola vez por instalación: la marca vive en el mismo caché, así
 * que no hace falta ningún otro almacenamiento para recordarlo.
 */
async function precargarSala() {
  const cache = await caches.open(CACHE);
  if (await cache.match(MARCA_SALA)) return;

  try {
    const mapa = await fetch("/mapa.json", { cache: "no-store" }).then((r) => r.json());
    await cache.addAll(mapa.maquinas.map((id) => `/m/${id}`));
    await cache.put(MARCA_SALA, new Response(String(Date.now())));
  } catch {
    /* Sin red todavía: se vuelve a intentar en la próxima lectura. */
  }
}
