# Creativos: elegir, editar en la PC, revisar y subir

## Ángulos
- De 3 a 5 según el presupuesto; en la práctica, 3.
- Salen de la investigación: lo que más dura en el país, lo que gana afuera y lo que nadie toca.
- **Nunca un ángulo que dependa del empaque** («el original», «así llega») si el empaque del video no es idéntico al nuestro.

## Elegir los videos
Puntúa cada candidato en una tabla. La regla: **ángulo primero, días activo después.** Al usuario se le explica en una línea por video: días activo, ángulo y por qué.

| Criterio | Bueno | Se descarta |
|---|---|---|
| Días activo | 30 o más; 90 o más es ganador probado | menos de 7 |
| Variantes | 2 o más del mismo contenido (el dueño lo escaló) | — |
| Ángulo | Coincide con un ángulo del plan | No calza con ninguno |
| Producto | El mismo | Otro producto presentado como el nuestro |
| Secuencia | Completa: gancho, cuerpo y cierre | Un fragmento que corta a mitad de frase |
| Calidad | Vertical, 720p o más (`scripts/medir.mjs` lo dice) | Muy borroso o horizontal con barras: sirve de modelo, no de material |
| Limpieza | Textos que se pueden tapar | Una marca de agua que cruza todo el video |
| País | Nadie lo pauta en el país destino | Ya lo pauta otra página del país: va a reserva o fuera |

## El procedimiento fijo: el mismo producto va tal cual
1. **Si es el mismo producto y el audio está en el idioma de venta, va tal cual, siempre primero.**
   - Se dejan su audio, su voz y su música.
   - Solo se corta o se tapa lo que estorba: precio, TikTok Shop, «carrito naranja», otras tiendas, marca de agua o @.
   - Se le agrega un cierre corto con el canal: «Escríbenos por WhatsApp · Envío gratis y pagas al recibir».
   - Sin voz nueva, música nueva, gancho nuevo ni tomas de stock.
2. **El audio también se limpia.** Los videos de otros países suelen cerrar con «TikTok», «el botón o carrito naranja» o un precio.
   - Si el usuario tiene una llave de Gemini, sube el video a su File API y pide la transcripción con segundos.
   - Si no, pídele que escuche el final de cada video y te diga en qué segundo empieza.
   - Se corta en la palabra con los `tramos`.
3. **Empaque distinto en los videos:** usa los que menos muestran la caja y cierra con 3 s de nuestro producto real (`cierre.imagen` con la foto, título «Así te llega»). Avísalo como riesgo en el paso 9.
4. **Si alguien habla a cámara, nunca se le pone otra voz encima.** Con esas tomas solo se corta o se conserva su audio.
5. **Solo si no hay videos del mismo producto** (o el audio no sirve: otro idioma, nombra otra tienda todo el tiempo) se usan videos parecidos con una voz nueva sobre tomas sin nadie hablando. Para eso, `VideoDemo` del editor sirve igual: clips, voz y subtítulos.

## Editar en la PC
Con el editor (cómo se usa: [editor.md](editor.md)):
1. `node scripts/medir.mjs` en cada video: tamaño, duración y calidad.
2. Mira la hoja de cuadros del original (`node scripts/hoja.mjs`) para ubicar en qué segundos y en qué píxeles está lo que hay que tapar.
3. Escribe el plan en `planes/` (`EdicionMinima`): tramos, tapas, parches y cierre.
4. `node scripts/render.mjs EdicionMinima ...`
5. **Revisa la hoja de cuadros del resultado tú mismo:** que no quede nada ajeno a la vista, que las tapas caigan exactas y que el cierre se lea. Si algo falla, corrige el plan y vuelve a renderizar.

Tope: 15 minutos por video. Si un video se complica, pasa al siguiente candidato.

## Imágenes (una por conjunto)
- Se generan con la app: `anuncios_generar` (pide `sl_como_trabajar` con «anuncios estáticos» la primera vez).
- **El mensaje y el tono salen del video de su conjunto:** su gancho como titular; si el video vende con algo crudo, la imagen también.
- El formato se modela sobre estáticos ganadores del MISMO producto (Dropkiller con imágenes, o la Biblioteca de Meta ordenada por días). Solo si no hay, se modela sobre la categoría.
- Primero el material real del producto. Si hace falta una escena, va como referencia junto con la foto real del producto.
- El producto se ve fiel a la foto real: etiqueta, color y tapa. **Sin precio.**
- Revisa cada imagen tú mismo antes de usarla.

## Reserva
6 videos más con la misma edición mínima, comprobando que no corren en el país, para la primera renovación. Se suben a la biblioteca con «RESERVA» al inicio de su descripción.

## Subir
Todo lo terminado va a la biblioteca del producto (ver [editor.md](editor.md) › «Subir»). Su descripción (`media_describir_creativo`) empieza con una línea de origen y uso, por ejemplo: «Ganador de Colombia, 95 días · ángulo dolor de espalda · conjunto 1». A la campaña se adjunta después con `ads_subir_creativo {url}` (paso 8).
