# Ficha de Máquina

Apoyás el teléfono en el chip de una máquina y en un segundo tenés cómo se
regula, qué error te lesiona y qué hacer si algo te molesta.

Sin descargar nada y sin cuenta.

## Por qué hay dos capas de datos

El código de esto es una tarde. Lo que hunde el proyecto es el contenido: por
máquina hacen falta tres pasos de regulación, un video, tres errores críticos y
las adaptaciones por dolor. Son diez piezas curadas por máquina, y un gimnasio
con cuarenta máquinas son cuatrocientas.

Por eso `src/datos/catalogo.ts` está partido en dos:

- **`MODELOS`** es el catálogo compartido. La prensa 45° es una sola en todo el
  sistema: su contenido se escribe una vez y lo usan todos los gimnasios que
  tengan una.
- **`MAQUINAS`** son las unidades físicas de este gimnasio. Es lo único que
  cambia de cliente a cliente, y es lo que apunta cada chip: el ticket de
  mantenimiento tiene que saber *cuál* de las dos prensas está rota.

Con esa separación, dar de alta un gimnasio nuevo deja de ser un proyecto de
contenido y pasa a ser una tarde de pegar stickers.

## Los chips

Un chip por máquina, cada uno con su dirección fija:

```
https://<dominio>/m/p1     Prensa 1
https://<dominio>/m/p2     Prensa 2
https://<dominio>/m/j1     Jalón
```

La lista completa con botón de copiar está en `/tags`, junto con los tres pasos
para grabarlos.

El chip guarda una dirección, no contenido: la ficha se actualiza del lado del
servidor y el sticker pegado en la prensa no se toca nunca más.

**Bloqueá cada chip como solo lectura después de escribirlo.** Son cinco
segundos y no se puede deshacer. Sin eso, cualquiera con un teléfono reescribe
el chip de la prensa y lo apunta a donde quiera.

## Decisiones que no son obvias

**La ficha se genera estática.** El contenido llega dentro del HTML: sin
consultas, sin esqueletos de carga y sin esperar la hidratación para leer a qué
altura va el asiento. Es la única forma de sostener el presupuesto de 1,5 s.

**El video no se precarga.** Son 280 KB que arruinan la carga de alguien que
solo quería saber la altura del asiento. Poster primero, video al tocarlo.

**Los errores van antes que el video.** El video se mira una vez; el error se
comete todas las series.

**Solo se ofrecen las zonas de dolor que la máquina realmente carga.** Inventar
un ajuste de muñeca para una prensa sería relleno, y el relleno en un módulo de
dolor es peor que no tener el módulo. Cuando la adaptación no alcanza, el campo
`derivar` manda al profe en vez de improvisar.

**Un ticket por falla, con contador de reportes.** Un cable roto lo ven veinte
personas el mismo día. Si eso genera veinte tickets, el dueño abre el panel una
vez y no vuelve. Sumar reportes al mismo ticket convierte la repetición en lo
que realmente es: una señal de urgencia.

**El deep link a la app de carga es una URL, no una API.** Un contrato por query
string sobrevive a que cualquiera de las dos apps se reescriba entera.

## Rutas

| Ruta | Para quién |
|---|---|
| `/m/<id>` | El socio. Destino del chip |
| `/` | Índice de máquinas |
| `/tags` | Instalación: qué grabar en cada chip |
| `/tablero` | El dueño: fallas abiertas y uso por máquina |

## Correr

```bash
npm install
npm run dev     # http://localhost:3011
```

## Qué falta para producción

- Base de datos. Hoy los tickets y las lecturas viven en el teléfono para que la
  demo ande sin servidor.
- Aviso al staff por WhatsApp o Slack en el momento del reporte.
- Los videos, que se graban en el gimnasio.
- Service worker: hoy registrar funciona sin red, pero la primera visita del día
  la necesita.
