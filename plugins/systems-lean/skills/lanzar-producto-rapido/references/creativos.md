# Paso 8 · Creativos: elegir, bajar, editar en la PC, revisar y subir

**Lo que deja este paso:** por cada ángulo 1 video y 1 imagen terminados, más 6 videos de reserva, **todos en la biblioteca del producto** con su URL. La campaña (paso 10) solo adjunta lo que está en la biblioteca.

## Cuántos
- **Ángulos:** de 3 a 5 según el presupuesto (paso 5); en la práctica, 3.
- **Por conjunto (ángulo):** 1 video + 1 imagen del mismo ángulo.
- **Reserva:** 6 videos más con la misma edición, para la primera renovación.
- Anota la tabla «Creativos por conjunto» en LANZAMIENTO.md a medida que cierras cada pieza.

## De dónde salen los videos
De las referencias del paso 3, ya guardadas en la biblioteca:
1. `anuncios_ver_biblioteca_creativos {producto_id}`: vienen ordenados y con su descripción (origen, días, «LISTO PARA PAUTAR», «NO CORRE EN…»). Mira la descripción antes de volver a analizar un video.
2. Por cada candidato, baja el archivo a la PC con su URL de la biblioteca: `curl -L -o "entrada/<nombre>.mp4" "<url>"`.
3. Si un video bueno no estaba en la biblioteca, guárdalo primero como en el paso 3 (`captura_creativo_guardar`) y después bájalo.
4. Solo TikTok sin archivo: `yt-dlp "<url>"` si el usuario lo tiene instalado; si no, pídele el archivo.

## Elegir los videos
Puntúa cada candidato en una tabla. La regla: **ángulo primero, días activo después.** Al usuario se le explica en una línea por video: días activo, ángulo y por qué.

| Criterio | Bueno | Se descarta |
|---|---|---|
| Días activo | 30 o más; 90 o más es ganador probado | menos de 7 |
| Variantes | 2 o más del mismo contenido (el dueño lo escaló) | — |
| Ángulo | Coincide con un ángulo del plan | No calza con ninguno |
| Producto | El mismo | Otro producto presentado como el nuestro |
| Empaque | Igual al nuestro (tamaño, color, tapa, caja) | Distinto y muy visible |
| Secuencia | Completa: gancho, cuerpo y cierre | Un fragmento que corta a mitad de frase |
| Calidad | Vertical, 720p o más (`scripts/medir.mjs` lo dice) | Muy borroso o horizontal con barras: sirve de modelo, no de material |
| Limpieza | Textos que se pueden tapar | Una marca de agua que cruza todo el video |
| País | Nadie lo pauta en el país destino | Ya lo pauta otra página del país: va a reserva o fuera |

## El procedimiento fijo: el mismo producto va tal cual
1. **Si es el mismo producto y el audio está en el idioma de venta, va tal cual, siempre primero.**
   - Se dejan su audio, su voz y su música.
   - Solo se corta o se tapa lo que estorba: precio, TikTok Shop, «carrito naranja», otras tiendas, marca de agua o @.
   - Se le agrega un cierre corto con el canal: «Escríbenos por WhatsApp · Envío gratis y pagas al recibir» (o «Pide el tuyo en la web» si es landing).
   - Sin voz nueva, música nueva, gancho nuevo ni tomas de stock.
   - Duración: la del original más el cierre (unos 3 s).
2. **El audio también se limpia.** Los videos de otros países suelen cerrar con «TikTok», «el botón o carrito naranja» o un precio.
   - Transcripción: `get_ad_transcripts` de Dropkiller si el video viene de ahí; si no, con la llave de Gemini del usuario (File API, una sola llamada, con segundos); si no, el usuario escucha el final y te dice en qué segundo empieza.
   - Se corta en la palabra con los `tramos`.
3. **Empaque distinto en los videos:** usa los que menos muestran la caja y cierra con 3 s de nuestro producto real (`cierre.imagen` con la foto, título «Así te llega»). Avísalo como riesgo en el paso 11.
4. **Si alguien habla a cámara, nunca se le pone otra voz encima.** Con esas tomas solo se corta o se conserva su audio.
5. **Solo si no hay videos del mismo producto** (o el audio no sirve: otro idioma, nombra otra tienda todo el tiempo) se usan videos parecidos con una voz nueva sobre tomas sin nadie hablando, con la plantilla `VideoDemo`: clips, voz y subtítulos.

## Editar en la PC
Con el editor (cómo se usa: [editor.md](editor.md)):
1. `node scripts/medir.mjs "<video>"`: tamaño, duración y calidad.
2. `node scripts/hoja.mjs "<video>"` y mira la hoja de cuadros del original para ubicar en qué segundos y en qué píxeles está lo que hay que tapar.
3. Escribe el plan en `planes/<nombre>.json` (`EdicionMinima`): tramos, tapas, parches y cierre.
4. `node scripts/render.mjs EdicionMinima "planes/<nombre>.json" "salida/<nombre>.mp4" --carpeta "entrada"`.
5. **Revisa la hoja de cuadros del resultado tú mismo:** que no quede nada ajeno a la vista, que las tapas caigan exactas y que el cierre se lea. Si algo falla, corrige el plan y vuelve a renderizar.

Tope: 15 minutos por video. Si un video se complica, pasa al siguiente candidato.

## Imágenes (una por conjunto)
1. **Referencias:** estáticos ganadores del MISMO producto (Dropkiller `search_ads {mediaType: "image", sort: "duration", countryCodes}`, o la Biblioteca de Meta ordenada por días). 30 días o más es señal; 60 o más con 2 activos, ganador. Solo si no hay, se modela sobre la categoría. También sirven `anuncios_ver_banners_referencia {}`.
2. **Ángulo:** `anuncios_ver_angulos_venta {producto_id}`. **La imagen prueba el mismo ángulo que el video de su conjunto:** su gancho va de titular; si el video vende con algo crudo, la imagen también, nunca «más elegante».
3. **Esqueleto:** gancho → promesa → 3 beneficios → prueba → cierre («Pagas al recibir · Envío gratis»).
4. **Costo:** `anuncios_estimar_costo {cantidad, resolucion}` la primera vez: muéstrale el costo al usuario y espera el sí.
5. **Generar:** `anuncios_generar {producto_id, nombre, formato: "4:5", angulo_venta_id, mostrar_precio: false, referencias: [{url | numero, rol: "producto"}, {url, rol: "locacion" | "persona" | "objeto"}], disenos: [{prompt_visual_en, hook, copy_corto, cta_texto}]}`.
   - `prompt_visual_en`: la escena en inglés (hasta ~1.500 caracteres) **sin describir el producto**: el producto sale de la referencia con rol `producto` (la foto real).
   - Si mandas `referencias`, es la lista completa: incluye siempre la del producto.
   - `nombre` siempre: `<producto> · <país> · <ángulo> · imagen · v1`.
   - Cada llamada crea un lote nuevo. Lo generado se ve con `anuncios_ver_generados {producto_id}`.
6. **Revisa cada imagen tú mismo:** el producto fiel a la foto real (etiqueta, color, tapa), sin precio, sin promesas médicas, sin «¿Sufres de…?» (atributos personales) y sin testimonios inventados. Si falla, se corrige el diseño y se genera de nuevo.

## Nombres
`<producto> · <país> · <ángulo> · <video | imagen> · <origen> · v<n>`. Ejemplo: «Faja Sculpt · CO · cintura · video · ganador MX 95d · v1».

## Subir lo terminado a la biblioteca
Por cada video terminado (y por cada imagen hecha fuera de la app):
1. `media_subida_url {producto_id, nombre: "<nombre>.mp4", mime: "video/mp4"}`.
2. PUT del archivo a `upload_url` con el `Content-Type` exacto (ver [editor.md](editor.md) › «Subir»).
3. `media_subida_confirmar {subida_id, fuente}`: `fuente` es la plataforma de origen (`tiktok`, `meta`) o `manual_upload` para lo propio. Devuelve la URL definitiva y el `creativo_id`.
4. `media_describir_creativo {creativo_id, descripcion}`: empieza con la línea de origen y uso, por ejemplo «Ganador de México, 95 días · ángulo cintura · conjunto 1 · EDICIÓN MÍNIMA». La reserva empieza con «RESERVA».
5. `media_editar_creativo {creativo_id, anunciante, dias_activo, variantes}` si es un ganador ajeno.

Las imágenes generadas con `anuncios_generar` quedan en su lote y se adjuntan desde ahí en el paso 10.

## Cierre del paso
- `media_listar {producto_id, desde: "hoy"}`: cada pieza terminada con su URL.
- La tabla «Creativos por conjunto» completa en LANZAMIENTO.md: conjunto, ángulo, video (origen, días, URL), imagen (lote o URL) y el texto prellenado que va a llevar.
