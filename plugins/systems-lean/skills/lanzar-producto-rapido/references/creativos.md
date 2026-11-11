# Paso 9 · Creativos: videos editados en la PC, imágenes hechas en la app

**Lo que deja este paso:** por cada ángulo 1 video y 1 imagen terminados, más 6 videos de reserva, **todos en la biblioteca del producto** con su URL. La campaña (paso 12) solo adjunta lo que está en la biblioteca.
- **Los videos** se editan en la PC del usuario con el editor ([editor.md](editor.md)): así no se carga el servidor de la app.
- **Las imágenes** se hacen en el generador de anuncios estáticos de la app (`anuncios_*`): usa la foto real del producto y, cuando hace falta, los precios de Projection.

## Cuántos
- **Ángulos:** de 3 a 5 según el presupuesto (paso 5); en la práctica, 3.
- **Por conjunto (ángulo):** 1 video + 1 imagen del mismo ángulo.
- **Reserva:** 6 videos más con la misma edición, para la primera renovación.
- Anota la tabla «Creativos por conjunto» en LANZAMIENTO.md a medida que cierras cada pieza.

## Los videos

### De dónde salen
De las referencias de los pasos 3 y 4, ya guardadas y descritas en la biblioteca:
1. `anuncios_ver_biblioteca_creativos {producto_id, limit: 100}` (sin `limit` trae 40): vienen ordenados de mejor a peor desempeño y con su descripción (origen, días, «LISTO PARA PAUTAR», «NO CORRE EN…»). Lee la descripción antes de volver a analizar un video.
2. Cuando el usuario nombra uno («el creativo 5»), es el `numero` de su tarjeta: tráelo con `anuncios_ver_biblioteca_creativos {producto_id, numeros: [5]}`.
3. Por cada candidato, baja el archivo a la PC con su URL de la biblioteca: `curl -L -o "<carpeta del producto>/entrada/<nombre>.mp4" "<url>"`. La carpeta del producto es `~/SystemsLean/productos/<producto>-<país>`.
4. Si un video bueno no estaba en la biblioteca, guárdalo primero (`captura_creativo_guardar`, abajo) y después bájalo.
5. Lo que falte se consigue con la tabla que sigue.

### De dónde sale cada toma
Por cada toma del plan, prueba las fuentes en orden y quédate con la primera que la tenga. La IA va al final, con su costo.

| Material | 1.º | 2.º | 3.º | Después |
|---|---|---|---|---|
| **El video ganador de la competencia** | La biblioteca del producto | Su TikTok o su Reel: `captura_creativo_guardar` con la URL del post | Su anuncio en la Biblioteca de Meta: el usuario lo guarda con «Descargar creativo» de la extensión | Pedirle el archivo al usuario |
| **Las tomas de uso del producto** | Los videos del mismo producto en la biblioteca: competencia, proveedor y los del usuario | Las que grabe el usuario con el celular | El mismo producto en TikTok o Instagram: `captura_creativo_guardar` con la URL, y se usa el tramo que sirve | Tomas con IA de la app; al final, pedirle el archivo |
| **El relleno** (manos, cocina, gente, lugares, el problema) | Stock gratis: `scripts/stock.mjs` | La misma acción en TikTok o Instagram: `captura_creativo_guardar` con la URL | Mixkit o Coverr, en el navegador del usuario | Tomas con IA de la app; al final, pedirle el archivo |
| **El material del proveedor** | Las fotos de su ficha, ya en la biblioteca (paso 2) | El video y las fotos de la ficha de AliExpress: el usuario los guarda con «Descargar» de la extensión | Pedirle al proveedor sus videos por WhatsApp | — |

**Un video de TikTok o de Instagram, con su URL.** No instala nada: lo baja el servidor de la app.
```
captura_creativo_guardar {
  producto_id,
  media_url: "<URL del post>",
  media_type: "video",
  provider: "tiktok" | "instagram",
  advertiser_name, texto_anuncio, metrics: { likes }
}
```
- La URL es la de la página del video: `https://www.tiktok.com/@<usuario>/video/<id>` o `https://www.instagram.com/reel/<código>/`. No sirve la de un perfil ni la de una búsqueda.
- Responde en menos de un minuto. Sigue solo si dice `persistido: true`: el archivo está en `url_guardada`.
- **Qué llega** (medido el 2026-11-10): mp4 en H.264, sin el logo flotante de TikTok. De TikTok, 576×1024; de Instagram, 720×1280. Lo que el autor escribió encima del video sí queda.
  - Alcanza para tomas de 2 a 4 s dentro de un video.
  - Para un video «tal cual» (modo 1) prefiere una copia de 720p o más: la de Instagram, la de la Biblioteca de Meta o el archivo del usuario.
- **Si dice `estado_descarga: "failed"`,** lee `_nota`: un video privado, con restricción de edad o de más de 100 MB no baja. Usa otro o pídele el archivo al usuario.
- **YouTube no baja por la app:** YouTube le pide iniciar sesión al servidor. Busca el mismo video en TikTok o Instagram, o pídele el archivo al usuario.

**El botón «Descargar creativo» de la extensión.** Lo toca el usuario, con el producto elegido en la extensión:
- **TikTok:** `https://www.tiktok.com/search?q=<producto>`. Sobre cada video aparece un botón con una flecha hacia abajo («Descargar creativo»).
- **Instagram:** el perfil de la cuenta, `https://www.instagram.com/<usuario>/`. El mismo botón aparece sobre cada publicación.
- **Biblioteca de anuncios de Meta:** el enlace del paso 3. El botón aparece sobre cada anuncio.
- **AliExpress:** en la ficha del producto, al abrir una foto o el video en grande aparece el botón «Descargar» (una flecha hacia abajo) sobre la imagen.
- Todo queda en Creativos de Inspiración del producto: lo ves con `anuncios_ver_biblioteca_creativos`.

**Stock gratis, con `scripts/stock.mjs` del editor** ([editor.md](editor.md)). Para el relleno, nunca para mostrar el producto.
1. Busca en Pixabay, con la llave gratis del usuario ([primera-vez.md](primera-vez.md) › «Las llaves»), en inglés y de a una necesidad:
   `node scripts/stock.mjs --buscar "hands washing dishes" --vertical --hoja "<carpeta del producto>/entrada/stock_hoja.jpg"`
   - Lista cada clip con su id, duración, tamaño, autor y enlace. La hoja trae la miniatura de cada uno: mírala antes de bajar.
2. Pexels no pide llave. El comando anterior termina con el enlace de la misma búsqueda en Pexels:
   - ábrelo con tu navegador y elige, o pásaselo al usuario y que te pegue el enlace del video que le guste;
   - el enlace de un video es `https://www.pexels.com/video/<nombre>-<id>/`.
3. Baja solo el elegido, uno o dos por toma:
   `node scripts/stock.mjs --bajar <pixabay:id | enlace del video de Pexels> --salida "<carpeta del producto>/entrada/<nombre>.mp4"`
   - Baja la copia de 1080 (con `--calidad 720`, la de 720) y anota la fuente, el enlace y la licencia en `entrada/fuentes.json`.
4. Mídelo con `scripts/medir.mjs`. Un clip horizontal se recorta por el centro al llenar el cuadro: sirve solo si lo importante está al medio.

**Mixkit y Coverr** no tienen comando: los abre el usuario en su navegador y te pasa el archivo.
- Mixkit: `https://mixkit.co/free-stock-video/<palabra>/`. Solo los clips con «Free License»; los de «Restricted License» no sirven para anuncios.
- Coverr: `https://coverr.co/stock-video-footage/<palabra>`. Los marcados «Premium» bajan con marca de agua: no se usan.

**Bajar a la PC un video que ya está en la biblioteca:**
- La URL es `url_guardada` (la que devuelve `captura_creativo_guardar`), o la `url` del creativo en `anuncios_ver_biblioteca_creativos {producto_id}` o en `media_listar {producto_id, tipo: "video", desde: "hoy"}`.
- `curl -L -o "<carpeta del producto>/entrada/<nombre>.mp4" "<url>"` y después `node scripts/medir.mjs "<archivo>"`.

**Reglas del material ajeno:**
- **Stock:** que la persona del clip nunca parezca clienta ni que recomienda el producto. Nada con marcas o logos a la vista. Una vista previa con marca de agua de una agencia no se usa ni se limpia.
- **Redes:** un video de TikTok o de Instagram no trae licencia. Anota su autor y su URL en la tabla «Creativos por conjunto» de LANZAMIENTO.md, para cambiarlo si su autor lo reclama.

### Elegir
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

### Los cuatro modos, del más fiel al más libre
Siempre se intenta primero el modo 1. **En los modos 2, 3 y 4 va primero el plan** (una tabla corta: escenas, de dónde sale cada una, guion de voz, música, subtítulos y cierre) y se le muestra al usuario antes de editar.

**1. Tal cual (el mismo producto, con audio en el idioma de venta).**
- Se dejan su audio, su voz y su música.
- Solo se corta o se tapa lo que estorba: precio, TikTok Shop, «carrito naranja», otras tiendas, marca de agua o @.
- Se le agrega un cierre corto con el canal: «Escríbenos por WhatsApp · Envío gratis y pagas al recibir» (o «Pide el tuyo en la web» si es landing).
- Sin voz nueva, música nueva, gancho nuevo ni tomas de stock. Duración: la del original más el cierre (unos 3 s).

**2. Replicar al 90 % (el mismo montaje, otra voz).** Cuando el audio no sirve: otro idioma, o nombra otra tienda todo el tiempo.
- Sus clips tal cual: mismo orden, mismos cortes, incluido el gancho con la persona. No se reemplaza material ni se generan planos nuevos.
- Guion de voz parecido al original: el mismo gancho con una variación mínima del copy.
- Voz, música, subtítulos y transiciones: los propones tú con el estilo que mejor calce.

**3. Replicar al 50 % (mismo formato y ángulo ganador).**
- Evalúa qué clips se reusan y cuáles se reemplazan.
- El mismo gancho y el mismo ángulo con variaciones ligeras, sin perder la secuencia del formato.
- Si el video muestra otro producto, esas tomas se reemplazan por tomas del nuestro.

**4. Modelar (el mismo gancho y la misma estructura, otro ángulo).** Para un ganador de otro mercado o de otro nicho: se copia la estructura y el formato, no el ángulo.

### Las tomas nuevas (modos 3 y 4)
En este orden (la tabla «De dónde sale cada toma» dice con qué se consigue cada una):
1. Los clips que ya hay en la biblioteca del producto: los del proveedor, los de la competencia que sirven de material y los del usuario.
2. Las que grabe el usuario, si tiene el producto.
3. El mismo producto en TikTok o Instagram, y stock gratis para el relleno.
4. **Tomas con IA en el módulo de video de la app,** con sus créditos:
   - Pide antes `sl_como_trabajar {tarea: "generar tomas de video con IA del producto para editarlas en mi PC"}`: trae el orden de las tools y lo que cobra cada una. Dile al usuario el costo y espera el sí.
   - El camino corto, en este orden:
     1. `video_crear {producto_id, marca_id}` (gratis): un video del producto que sirve de taller. Uno solo por producto.
     2. `video_guardar_guion {run_uid, guion}` (gratis): el guion completo, con una escena por toma; cada toma con `visual_description_es` (el primer fotograma) y `motion_description_es` (lo que se mueve desde ahí). La forma del guion la trae la guía del módulo de video y la muestra `video_ver_run {run_uid}`.
     3. `video_generar_referencias {run_uid, hojas: ["item"], foto_base_producto: <la foto principal del paso 2>}` (cobra): la hoja del producto.
     4. `video_generar_imagen {run_uid, escena, toma}` (cobra). **Mírala antes de seguir:** si la etiqueta salió inventada, no sirve.
     5. Para animarla:
        - solo cámara y luz: `video_animar_toma {run_uid, escena, toma, motor: "omni"}`. Sin `motor` usa otro proveedor que hoy responde 403 sin generar;
        - una acción real (una mano que entra, algo que cae): primero `video_generar_imagen {run_uid, escena, toma, keyframe: "final"}` y después `video_generar_toma {run_uid, escena, toma, motor: "kling"}`. Sin la imagen final, también falla con 403.
   - **Detente cuando el clip esté generado:** no armes el video en el servidor. La URL del clip sale de `video_ver_run {run_uid}`. Bájalo a `<carpeta del producto>/entrada/` y edítalo en la PC.
   - El antes y después y los testimonios nunca se generan con IA.

### La voz (modo 2 en adelante y el video demo del chat)
Una sola voz por producto, con el acento del país y el género de quien compra. De una de estas tres formas:
- **La graba el usuario** con el celular, en un cuarto callado.
- **Con los créditos de la app:** en el mismo video que sirve de taller, `video_voces_ver {proveedor: "elevenlabs", genero, buscar: "<país o acento>"}` para elegirla y `video_narracion_audio {run_uid, texto, voz_id}` para generarla. Devuelve la URL del mp3: bájalo a `<carpeta del producto>/entrada/`. Un texto por llamada.
  - **El modelo de ElevenLabs** se elige con `modelo`, y los tres cuestan lo mismo: `eleven_v4` (el que sale si no dices nada: el más nuevo y el más expresivo), `eleven_v3` (también expresivo) o `eleven_multilingual_v2` (el que más se parece a la voz elegida). Con v4 y v3 puedes dirigir la voz con etiquetas en inglés dentro del texto, como `[whispers]`, `[laughs]` o `[pause]`; con v2 no las pongas. Si la voz no se parece a la que elegiste, prueba el mismo texto con `eleven_multilingual_v2` antes de cambiar de voz.
- **Con la cuenta de ElevenLabs del usuario:** `scripts/voz.mjs` del editor ([editor.md](editor.md)).

### Reglas del audio y del empaque
- **El audio también se limpia.** Los videos de otros países suelen cerrar con «TikTok», «el botón o carrito naranja» o un precio.
  - Transcripción: la que ya quedó en la descripción del creativo (paso 4); si no, `get_ad_transcripts` de Dropkiller o `node scripts/analizar.mjs` con la llave de Gemini del usuario ([editor.md](editor.md)); si no, el usuario escucha el final y te dice en qué segundo empieza.
  - Se corta en la palabra, con los `tramos`.
- **Empaque distinto en los videos:** usa los que menos muestran la caja y cierra con 3 s de nuestro producto real (`cierre.imagen` con la foto, título «Así te llega»). Avísalo como riesgo en el paso 13.
- **Si alguien habla a cámara, nunca se le pone otra voz encima.** Con esas tomas solo se corta o se conserva su audio.

### Editar en la PC
Con el editor (cómo se usa: [editor.md](editor.md)):
1. `node scripts/medir.mjs "<video>"`: tamaño, duración y calidad.
2. `node scripts/hoja.mjs "<video>"` y mira la hoja de cuadros del original para ubicar en qué segundos y en qué píxeles está lo que hay que tapar.
3. Escribe el plan en `<carpeta del producto>/planes/<nombre>.json`: `EdicionMinima` (modo 1) o `VideoDemo` (clips, voz y subtítulos, para los modos 2 a 4).
4. Desde `~/SystemsLean/editor`, con rutas completas: `node scripts/render.mjs <Plantilla> "<carpeta del producto>/planes/<nombre>.json" "<carpeta del producto>/salida/<nombre>.mp4" --carpeta "<carpeta del producto>/entrada"`.
5. **Revisa la hoja de cuadros del resultado tú mismo:** que no quede nada ajeno a la vista, que las tapas caigan exactas y que el cierre se lea. Si algo falla, corrige el plan y vuelve a renderizar.

Tope: 15 minutos por video. Si un video se complica, pasa al siguiente candidato.

## Las imágenes (una por conjunto), en el generador de la app
1. **Reglas del usuario:** si las tiene, lee una vez la rama que toca con `skills_leer {modulo: "anuncios_estaticos", rama}` (`skills_listar` dice cuáles hay).
2. **Referencias:** primero los estáticos ganadores del MISMO producto que ya están en Creativos de Inspiración (pasos 3 y 4). Si faltan: Dropkiller `search_ads {mediaType: "image", sort: "duration", countryCodes}` o la Biblioteca de Meta ordenada por días. 30 días o más es señal; 60 o más con 2 activos, ganador. Solo si no hay, se modela sobre la categoría. También sirven las plantillas de `anuncios_ver_banners_referencia {}`.
3. **Ángulo:** `anuncios_ver_angulos_venta {producto_id}`. **La imagen prueba el mismo ángulo que el video de su conjunto:** su gancho va de titular. Si el video vende con algo crudo, la imagen también, nunca «más elegante».
4. **Esqueleto:** gancho → promesa → 3 beneficios → prueba → cierre («Pagas al recibir · Envío gratis»).
5. **Costo:** la primera vez, `anuncios_estimar_costo {cantidad, resolucion}`. Muéstrale el costo al usuario y espera el sí.
6. **Generar:** `anuncios_generar {producto_id, nombre, formato: "4:5", angulo_venta_id, mostrar_precio: false, referencias: [{url | numero, rol: "producto"}, {url | numero, rol: "locacion" | "persona" | "objeto"}], disenos: [{prompt_visual_en, hook, copy_corto, cta_texto}]}`.
   - **Para modelar un estático de la competencia:** `referencia_numero` con su número en Creativos de Inspiración (o `referencia_url`), y en la escena la variación.
   - `prompt_visual_en`: la escena en inglés (hasta ~1.500 caracteres) **sin describir el producto**: el producto sale de la referencia con rol `producto` (la foto real).
   - Si mandas `referencias`, es la lista completa: incluye siempre la del producto.
   - `nombre` siempre: `<producto> · <país> · <ángulo> · imagen · v1`.
   - Cada llamada crea un lote nuevo. Lo generado se ve con `anuncios_ver_generados {producto_id}`.
   - **Si el usuario quiere revisar antes de gastar,** `anuncios_preparar` deja el formulario armado en la app sin cobrar, y él aprieta Generar.
7. **Texto, sellos y logo exactos, sin IA y gratis:** `anuncios_componer_elementos {lote_id, anuncio_id, elementos}`. Úsala en vez de pedirle al modelo que escriba el texto. `anuncios_editar` (con IA) queda solo para cambiar la foto misma; `anuncios_cambiar_formato` para otro tamaño.
8. **Revisa cada imagen tú mismo:** el producto fiel a la foto real (etiqueta, color, tapa), sin precio, sin promesas médicas, sin «¿Sufres de…?» (atributos personales) y sin testimonios inventados. Si falla, se corrige el diseño y se genera de nuevo.

**Las imágenes del chat y de la landing también salen de aquí:** la de la promoción con sus precios (paso 11), la foto en la mano, la galería y las imágenes de transformación (paso 10). Las capturas de WhatsApp de la landing tienen su propia tool (`store_prueba_social_generar`, paso 10).

## Nombres
`<producto> · <país> · <ángulo> · <video | imagen> · <origen> · v<n>`. Ejemplo: «Faja Sculpt · CO · cintura · video · ganador MX 95d · v1».

## Subir los videos terminados a la biblioteca
Por cada video terminado:
1. `media_subida_url {producto_id, nombre: "<nombre>.mp4", mime: "video/mp4"}`.
2. PUT del archivo a `upload_url` con el `Content-Type` exacto (ver [editor.md](editor.md) › «Subir»).
3. `media_subida_confirmar {subida_id, fuente}`: `fuente` es la plataforma de origen (`tiktok`, `meta`) o `manual_upload` para lo propio. Devuelve la URL definitiva y el `creativo_id`.
4. `media_describir_creativo {creativo_id, descripcion}`: empieza con la línea de origen y uso, por ejemplo «Ganador de México, 95 días · ángulo cintura · conjunto 1 · TAL CUAL». La reserva empieza con «RESERVA».
5. `media_editar_creativo {creativo_id, anunciante, dias_activo, variantes}` si es un ganador ajeno.

Las imágenes generadas quedan en su lote y se adjuntan desde ahí en el paso 12.

## Cierre del paso
- `media_listar {producto_id, desde: "<fecha de inicio de LANZAMIENTO.md>"}`: cada video terminado con su URL («hoy» cuenta desde la medianoche UTC).
- `anuncios_ver_generados {producto_id}`: cada imagen con su lote.
- Relee la ficha del producto (paso 6) contra los videos elegidos: no puede contradecir lo que prometen los anuncios.
- La tabla «Creativos por conjunto» completa en LANZAMIENTO.md: conjunto, ángulo, video (origen, días, URL), imagen (lote) y el texto prellenado que va a llevar.
