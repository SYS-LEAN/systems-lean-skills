# Paso 10 · La landing en Store Lean (solo si el canal da landing)

A esta altura Product Lean y Projection ya están listos: ficha, fotos, escenarios de oferta y creativos en la biblioteca. **La landing consume eso, no lo reinventa.** Tú la construyes y la dejas lista; publicarla es del usuario, salvo que te pida que lo hagas tú.

Pide antes `sl_como_trabajar {tarea: "crear una landing de venta contra entrega en Store Lean"}`: trae las reglas del módulo.

## Fase 0 · Leer el terreno antes de preguntar nada
- `skills_listar {modulo: "store_lean"}` y `skills_leer` de la maestra y de las ramas que apliquen (si el usuario las tiene).
- `estructura_conversion {}`: la metodología del orden de bloques. Se lee siempre.
- `ver_tienda {}`: la marca, su modelo de negocio, su subdominio y las landings que ya tiene.
- `product_ver_ficha {producto_id}` y `projection_escenarios_ver {producto_id: <id del simulador>}`: qué se vende y a qué precio.
- `anuncios_ver_biblioteca_creativos {producto_id}`: el material (creativos de inspiración, fotos del proveedor y de AliExpress, la landing de la competencia capturada en el paso 3) y `anuncios_ver_generados {producto_id}` (las imágenes ya hechas).
- `ads_ver_conexion {marca_id}`: Meta conectado.
- `marca_ver {marca_id}`: el tracking de la marca (píxel, Clarity, GA4).
- `listar_secciones {}`: el catálogo de bloques con sus campos. Con `html_custom` puedes escribir secciones propias y mezclarlas con las del catálogo.
- `store_dominios_ver {marca_id}`: la dirección donde va a quedar.

## Fase 1 · Preguntar solo lo que no se puede averiguar (un mensaje)
- ¿**Estructura probada o a medida** según el ángulo? Da tu recomendación.
- ¿Tiene **material propio** que quiera usar (fotos reales, videos, capturas de clientes)?
- Si a la marca le falta píxel o Clarity: muéstrale los píxeles disponibles (`marca_ver {marca_id, con_pixels_disponibles: true}`) y pregunta **cuál va**. Es el del flujo web de la marca, no el conjunto de datos de la cuenta de WhatsApp.
- Si hay varios escenarios: ¿quiere **una prueba A/B**, y con cuáles?
- ¿La **publica él** desde la app o la publicas tú cuando esté lista?

Lo demás lo decides tú y lo muestras para su visto bueno.

## Fase 2 · Crear la landing
- `landing_crear {producto_id, angulo_venta_id, nombre, modalidad_checkout, etapas_orden: []}`.
  - `producto_id` siempre: conecta el checkout con la oferta real de Projection.
  - `angulo_venta_id`: el ángulo principal (`av1`).
  - **`modalidad_checkout` sale del cobro de la oferta:** `cod` (contra entrega) o `anticipado`. Anticipado exige PayPal conectado.
  - **El nombre ES la ruta pública** (`Faja Sculpt` → `/faja-sculpt`).
  - `etapas_orden: []` = landing de bloques, sin etapas-imagen (esas cobran créditos).
  - Devuelve `lote_id` (forma `LP-…`).
- `landing_escenario {lote_id, escenario_id}`: ata la landing a su escenario. El checkout, el precio y los paquetes salen de ahí, y el pedido queda grabado con el escenario que lo generó. `escenario_id: null` = la oferta principal.
- **Prohibido escribir a mano el checkout, el header, las políticas o el tracking:** los pone la app al publicar.

## Fase 3 · La estructura (producto físico contra entrega)
Orden por defecto. Se adapta al producto, al ángulo y al modelo: una estructura a medida vale si el ángulo la justifica (razónala con `estructura_conversion`). Los nombres exactos y los campos de cada bloque salen de `listar_secciones`.

| # | Bloque | Qué lleva |
|---|---|---|
| 1 | `barra_anuncios` | El mensaje de valor (envío gratis, pago al recibir) con el contador integrado (`show_countdown`). Es el único reloj de la página |
| 2 | `product_gallery` | De 4 a 6 imágenes que INFORMAN: el producto limpio, infografía de ingredientes o mecanismo, modo de uso y resultado |
| 3 | `producto` (buy-box) | Título que dice QUÉ ES y QUÉ HACE, estrellas junto al título y 3 o 4 beneficios cortos que salen de los dolores. Sin precio ni botón si hay bundle |
| 4 | `bundle` | Los paquetes desde Projection (`source: projection`): los que traiga el escenario, con sus regalos y su garantía; «la más pedida» en el de 2 |
| 5 | `urgencia` | Debajo del bundle |
| 6 | `shipping_info` + `contraentrega` | Cuánto tarda (lo real), quién lo trae y que paga al recibir. En pago anticipado, `metodos_pago` en su lugar |
| 7 | `resenas` | Layout de personas, con ciudades del país destino. De 4 a 6, el mismo número y promedio que el buy-box |
| 8 | `faq` | Después de las reseñas. De 5 a 6 preguntas: cómo se usa, pago, garantía y tiempos, sacadas de la ficha |
| 9 | `imagen` + `texto` + `video_slider` | La transformación: se le habla AL cliente («imagina…»), no del producto. 1 o 2 videos verticales del producto (la versión web del creativo, en la biblioteca). Sin slides vacíos |
| 10 | `social_proof` | Capturas de seguimiento por WhatsApp, para el indeciso del final |
| 11 | `whatsapp` | En línea, con el número del proyecto de Chat Lean (`chat_proyectos_ver`, nunca tipeado) y un mensaje con el nombre del producto |
| 12 | `boton_flotante` | El cierre. **No uses `sticky_cta`** |

- **Coherencia de pago:** el texto de TODOS los botones y sellos coincide con la modalidad del checkout. Contra entrega: «compra contra entrega · paga al recibir» en el bundle, el flotante y los sellos. Anticipado: «paga seguro en línea» en todos. Nunca mezclados en la misma página.
- **Precios:** nunca escritos en las configuraciones ni pintados en las imágenes de la galería. Los pone el bundle desde Projection. Con una prueba de precio, una imagen con cifra miente en la otra variante.
- Una garantía real del producto puede ir en un `html_custom` sencillo, si `listar_secciones` no trae un bloque de garantía.

## Fase 4 · Las imágenes de cada bloque: las produces todas en la app
Cada bloque con imagen se alimenta en este orden:
- **Galería:**
  1. las fotos de AliExpress que están en Creativos de Inspiración (la carpeta «AliExpress» del paso 6, o las de fuente `aliexpress` que capturó el usuario). Las de 27x27 son muestras de color y las de 960x960 sueltas, íconos del sitio: no van;
  2. si alguna no convence, recréala en el generador de anuncios estáticos (`anuncios_generar` con la foto como referencia);
  3. si ya hay piezas generadas en anuncios estáticos que calcen, úsalas;
  4. si no hay nada, genéralas (estimar → confirmar el gasto → generar).
- **Reseñas (`resenas`):** cada reseña lleva la foto de quien la escribe en `avatar_url` (`store_resena_foto_generar {estilo: "persona", nombre}`, un retrato tipo foto real del comprador del país) y la del producto en `images[0]` (`estilo: "producto"`). Cobra: muestra el costo y espera el sí. Antes, mira si el usuario tiene fotos reales de compradores (`media_carpetas_ver`).
- **Prueba social (`social_proof`):** `store_prueba_social_generar {lote_id, cantidad}` genera capturas de WhatsApp con la foto y el número del cliente borrosos, coherentes con el producto. Cobra por captura. Antes, pregunta si tiene capturas reales: una real le gana a cualquier generada.
- **Transformación:** imágenes de uso y de resultado con el generador de anuncios estáticos; el mismo estilo y la misma persona si ya se creó una para este producto.
- **Todo archivo final va a la biblioteca del producto** y a la configuración va la URL de la biblioteca, nunca una URL externa.
- **Para modelar la landing de la competencia** que capturaste en el paso 3: `landing_captura_ver {captura_id, lote_id}` muestra sus secciones, el bloque nativo que hace cada papel y nuestra oferta real; `landing_captura_aplicar` la arma. Las imágenes con la marca de ellos se recrean con la nuestra.

## Fase 5 · Guardar, escenarios y A/B
- `landing_ver {lote_id}` ANTES de guardar si la landing ya existía (trae la `revision`): `landing_guardar_bloques {lote_id, elementos: [...], revision}` REEMPLAZA la lista completa. En `config` va solo lo que cambia del default.
- Para tocar un bloque después: `landing_editar_bloque {lote_id, bloque, config}`.
- **A/B:** `landing_duplicar {lote_id, como_variante: true}` → a la copia SOLO se le cambia lo que se prueba (otro escenario con `landing_escenario`, o un bloque) → quedan las dos listas. El reparto arranca con `landing_ab {accion: "iniciar", experimento_id}`, con las dos publicadas y el OK del usuario (cambia lo que ven clientes reales).

## Fase 6 · El checkout del país, el tracking y la entrega
### El checkout
1. `store_checkout_ver {lote_id}` siempre antes de tocarlo.
2. `store_checkout_configurar {lote_id, form_design: {...}}`, solo lo que cambia:
   - **Los campos mínimos del país.** En Colombia, 6 visibles: celular con WhatsApp, nombre, apellido, departamento, ciudad y dirección; el resto con `visible: false`. En los demás países, nombre, teléfono y dirección con su ciudad. Cada campo extra baja la conversión.
   - **Fuera las zonas sin cobertura** (las del paso 6): `cobertura_excluidos` con los nombres exactos del catálogo (en Colombia: AMAZONAS, GUAINÍA, GUAVIARE, VAUPÉS, VICHADA, SAN ANDRÉS Y PROVIDENCIA) y `excluir_ciudades_dificiles: true`.
   - `cta_text` y `cta_subtext` («Pagas al recibir»).
3. Si el país principal no es el de la marca: `store_checkout_pais_principal {lote_id, pais}`.
4. Políticas del país (si la tienda no las tiene): `store_branding_ver {marca_id}` y `store_branding_guardar {marca_id, pais_codigo, datos, generar_politicas: true}`.

### El tracking (es por marca)
- Si falta el píxel o Clarity, el que eligió el usuario en la Fase 1: `marca_editar {marca_id, meta_pixel_id, clarity_project_id}`. Si la marca no tiene ningún píxel, `store_pixel_crear {marca_id, nombre}` **con el OK del usuario** (crea algo real en Meta).
- Todas las landings de la marca lo heredan al publicar. Si se cambió, hay que republicar las demás landings de la marca: díselo.

### Antes de publicar
- [ ] Precios y paquetes iguales a Projection (los del escenario atado).
- [ ] Botones y sellos con la misma modalidad de pago que el checkout.
- [ ] Sin promesas médicas ni testimonios inventados.
- [ ] El mismo número de reseñas y promedio en el buy-box y en Reseñas.
- [ ] Checkout con los campos mínimos y sin las zonas sin cobertura.
- [ ] Píxel de la marca configurado.
- [ ] Botón de WhatsApp con el número del proyecto.
- [ ] Ninguna imagen con otra marca o con precio.
- [ ] Se ve bien en el celular.

### Publicar y entregar
- **Publica el usuario desde la app,** o tú con `landing_publicar {lote_id}` si te lo pidió. Devuelve la URL pública. **Todo cambio de bloques, checkout o tracking necesita republicar:** recuérdaselo.
- Ábrela con `?sl_test=1` (no ensucia las métricas) y revísala completa en el celular.
- **Nunca hagas un pedido de prueba contra entrega:** sale real al proveedor.
- Al usuario: la estructura en una tabla corta, los textos clave y el estado de cada variante.
- Anota la URL en LANZAMIENTO.md y marca las casillas del paso 10. La campaña (paso 12) necesita la landing publicada.
