---
name: lanzar-producto-rapido
description: Camino de Systems Lean para lanzar un producto físico de dropshipping contra entrega (Dropi o Soydrop) de punta a punta en un solo chat con un agente de IA (Claude Code, Codex o Antigravity), todo por el conector de Systems Lean. El producto entra por la Biblioteca y se investiga desde ahí, con sus datos y sus fotos en Creativos de Inspiración; después la investigación del usuario y el informe, Projection con sus preguntas y escenarios, la ficha, los ángulos, los creativos (videos editados en la PC del usuario, imágenes en el generador de la app), la landing o el flujo de WhatsApp y la campaña de Meta lista para encender. Cada paso se verifica con una herramienta de lectura y queda anotado en una ficha del lanzamiento. Úsala cuando el usuario diga «lanza este producto», «testea X», «quiero vender X contra entrega», «lánzalo hoy», elija un producto de su Lista de Testeo o de su Biblioteca, o pegue uno de Dropi o Soydrop.
---

# Lanzar un producto (contra entrega, con Systems Lean)

> Versión del 2026-11-10 · 15 pasos (del 0 al 14). Si una referencia que pediste trae otros números de paso, es de otra versión: avísale al usuario y no las mezcles.

Del producto elegido a la campaña lista para encender, en un solo chat: unas 3 horas de trabajo tuyo, **de corrido**: no te detienes a esperar al usuario salvo para gastar, publicar, encender o escribirle a un cliente. **El lanzamiento solo está terminado cuando cada módulo de la app quedó lleno y verificado con una herramienta de lectura.** Decir «listo» sin esa lectura es el error que este camino evita.

Sirve en cualquier agente de IA que lea skills y tenga terminal: Claude Code, Codex de OpenAI, Antigravity o Gemini CLI de Google. **Si la recibiste por el conector de Systems Lean** (no instalada), cada archivo `references/…` se pide aparte con `sl_como_trabajar {tarea: "lanzar-producto-rapido references/<archivo>.md"}` cuando el paso lo nombra; no lo improvises. El editor de video se descarga del repositorio público (ver [references/editor.md](references/editor.md) › «Instalar»).

## La ficha del lanzamiento (obligatoria)
Al empezar, crea `~/SystemsLean/productos/<producto>-<país>/LANZAMIENTO.md` con la plantilla de [references/ficha-lanzamiento.md](references/ficha-lanzamiento.md). Al cerrar cada paso, marca sus casillas y anota lo que dejó (nombres, números y la lectura que lo comprueba). Si el chat se corta o el contexto se compacta, **lee primero esa ficha** y sigue desde la primera casilla vacía.

## Lo que queda lleno en la app (sin esperar al usuario)
Es lo que se revisa en la auditoría del paso 13. Se llena todo aunque el usuario no conteste ninguna pregunta: con tu propuesta, anotada como «supuesto» en LANZAMIENTO.md, que se corrige si él dice otra cosa.
- **Biblioteca y Lista de Testeo:** el producto guardado con sus fotos y dado de alta desde ahí, nunca con `product_crear` si es de Dropi o Soydrop (`product_biblioteca_ver`, `product_favoritos_ver`).
- **Investigación de productos, todos los campos:** viabilidad (nombre comercial, nicho, descripción, país destino y países de referencia), el checklist de 15 criterios, hasta 3 fotos limpias, las palabras de búsqueda (Biblioteca de anuncios por país, Marketplace, Amazon, AliExpress, Alibaba), **los 4 pilares del cerebro** en el informe (competencia, conciencia, dolores y creencias, con evidencia) y la estrategia: perfiles de comprador y ángulos (`product_ver_investigacion`, `product_ver_informe`, `product_ver_estrategia`).
- **Ficha técnica, ficha del agente, entrega y cobertura:** la ficha del agente con precios y tiempos como `{{variables}}` (`product_ver_ficha`).
- **Projection, campo por campo:** precio, costo, flete real, preparación en 0, contra entrega, margen objetivo (15 % si el usuario no dice otro), las tasas del país, el tachado con «mostrar» encendido, la venta suelta, los paquetes 1, 2 y 3 con su total y su % (45/40/15), el envío gratis y cada regalo como `bonus` con su archivo (`projection_ver_simulador`, `projection_ver_ofertas`).
- **Ángulos de venta** en el generador (`anuncios_ver_angulos_venta`).
- **El Cerebro del Agente de WhatsApp:** el producto vinculado y activo en el agente (`chat_agente_productos_ver`), aunque el canal sea landing: el agente también atiende a quien escribe desde la landing.
- **Creativos de Inspiración:** solo lo que se va a usar o modelar del mismo producto; nada repetido ni de otros productos (`media_listar`).

## Reglas
- **Todo lo que pasa en la app va por el conector de Systems Lean.** Fuera de la app se usan los conectores del usuario (el oficial de Dropi, Dropkiller, TrendTrack, la Biblioteca de anuncios de Meta) o sus llaves (Gemini, Pixabay, ElevenLabs), y la web pública solo para leer. No uses el navegador para hacer en la app lo que hace una herramienta.
- **Si una guía de `sl_como_trabajar` dice algo distinto de esta skill, para lanzar un producto manda la skill.**
- **Antes de decir «no se puede», verifica:** `sl_como_trabajar` con esa tarea en palabras del usuario. Si una herramienta no está bien documentada, deduce su uso por su descripción y sus parámetros antes de descartarla. Si de verdad falta una, díselo al usuario en una línea: qué querías hacer, qué herramienta falta, qué debería recibir y qué devolver.
- **Un solo chat** para todo el lanzamiento. Lo pesado (búsquedas, análisis de videos y edición) va a subagentes en paralelo si tu agente los tiene; si no, hazlo tú en orden. Los subagentes llevan prompts completos: producto, país, ids, rutas, reglas y qué devolver. Tú revisas en persona cada pieza antes de usarla: la revisión no se delega.
- **Cada paso termina con su verificación** (la tool de lectura que dice el paso). Si la lectura no muestra lo esperado, se corrige antes de seguir.
- **Los ids no se mezclan, y todos se anotan en LANZAMIENTO.md:** el del producto (Product Lean), el del simulador (Projection, sale de `projection_ver_productos`), el de cada escenario (`escenario_id` para flujos, landings y fichas; su `producto_escenario_id` para editar su hoja), el del ítem de la Biblioteca (el de la Lista de Testeo), el `link_id` del vínculo con el agente de WhatsApp, el `creativo_id` de la biblioteca de medios (no es el del anuncio en Ads Lean) y el `lote_id` de las imágenes (`AE-…`) o de la landing (`LP-…`). Al usuario se le habla por NOMBRES, nunca por ids.
- **Los videos se editan en la PC** con el editor. No uses las tools de edición y armado del servidor: `video_limpiar`, `video_clip_fx`, `video_tomar_fragmento`, `video_escena_recortar`, `video_toma_componer`, `video_ensamblar`, `video_remix_render`, `video_clip_subtitulos`, `video_extraer_frame` ni `video_remix_fuentes`.
- **Lo que se genera con IA va por la app, con los créditos del usuario:**
  - las imágenes, en el generador de anuncios estáticos (`anuncios_*`): las de los anuncios, la de la promoción del chat, las de la landing y las capturas de prueba social. Nunca en la PC;
  - las tomas de video con IA y la voz en off, en el módulo de video (ver [references/creativos.md](references/creativos.md) › «Las tomas nuevas» y «La voz»). Lo generado se baja a la PC y se edita ahí.
  - Si el usuario tiene su propia cuenta de una API (ElevenLabs, Gemini), también sirve.
  - Generar cobra: la primera vez muestra el costo (`anuncios_estimar_costo` en imágenes) y espera el sí. `cuenta_ver` dice el saldo de créditos y lo usado en el período.
- **Las preguntas de decisión van en tres mensajes,** cada uno con tu propuesta YA aplicada: su investigación (paso 3), Projection (paso 5) y la landing (paso 10). **No esperes la respuesta para seguir:** guarda tu propuesta, anótala como «supuesto» en LANZAMIENTO.md y sigue con los pasos que no gastan ni publican; si el usuario contesta otra cosa, corriges. Fuera de esos tres mensajes, solo se pregunta lo que frena el paso, en una línea: qué Unidad de Negocio o qué producto si no está claro (paso 0), la variante y el precio declarado antes de cotizar el flete (paso 1), el gasto la primera vez que algo cobra, el trato si el país no lo define y las plantillas de Meta (paso 11), y el «sí» del paso 13. Si responde «lo que propongas», sigue con tu propuesta.
- **Gastar, publicar en Meta o escribirle a un cliente espera el OK del usuario.** Guardar en Product Lean, Projection, la biblioteca y publicar el flujo de WhatsApp no lo esperan.
- **Nunca el precio en un creativo de anuncio:** ni en el video, la imagen, los subtítulos ni el copy. La imagen de la promoción del chat sí lleva los precios, siempre los de Projection.
- **No inventes datos.** Stock, costo y flete salen de la ficha viva del proveedor; precios y CPA, de Projection; creencias y dolores, de fuentes que puedas citar. Lo que no se sabe se pregunta o se marca como supuesto.
- **Tasas para todo cálculo:** en Honduras, **25 % de devolución y 5 % de cancelación**; en Colombia y los demás países, **30 % y 5 %**. Si el usuario tiene las suyas medidas, mandan las suyas.
- **Los gastos del negocio se anotan en Finanzas Lean** cuando el usuario los menciona (internet, empaques, sueldos, una herramienta): `finanzas_registrar {monto, concepto, clase}`, con clase fijo, variable u ocasional; si se paga cada mes, `se_repite: true`. Se leen con `finanzas_ver` y el Dashboard del CRM los resta de la ganancia. La publicidad, el costo del producto y los envíos no se anotan ahí: la app ya los cuenta.
- **Herramientas que no son para ti:** `ganadores_agregar` y `ganadores_ver` (solo administración), `grok_tareas_*`, `relevo_*`, `agentes_*`, `ads_propuestas_*`, `product_extraer_comentarios` (depende de un ejecutor interno) y el script `scripts/mcp-subir-media.mjs` (no lo tienes: sube con `media_subida_url`).
- **Mensajes al usuario cortos y sin jerga:** la decisión y el porqué en una línea, sin nombres de herramientas ni ids.
- **Lo que tiene que hacer el usuario se le da resuelto:** el link directo a la pantalla exacta, qué va a ver al abrirlo y qué botón apretar. Una cosa por línea, en el orden en que las hace, y al final «avísame cuando esté». Nunca una ruta de menús ni «búscalo en la app».
- **Las llaves del usuario (Gemini, Pixabay, ElevenLabs) van en `~/SystemsLean/.env`,** las pega él y nunca pasan por el chat. El conector de Systems Lean no pide llaves ni tokens.

## Los pasos
Cada paso dice qué deja hecho, con qué se verifica y cuándo no se avanza. El detalle (tools, argumentos, trampas) está en su referencia.

### Paso 0 · Preparación y conexiones (5 min)
[references/preparacion.md](references/preparacion.md)
- **Primera vez en esta PC** (no existe `~/SystemsLean/requisitos.md`): antes que nada, los requisitos de [references/primera-vez.md](references/primera-vez.md). Se revisan una vez y quedan anotados en ese archivo.
- **No hay Unidad de Negocio de dropshipping, o el usuario quiere una marca nueva:** se crea con [references/marca.md](references/marca.md).
- **Deja:** los requisitos revisados, la Unidad de Negocio elegida o creada, el conocimiento propio del usuario leído, las conexiones comprobadas, el editor instalado, la carpeta y la ficha del lanzamiento creadas, y una tabla «qué hay / qué falta» si el producto ya existía.
- **No avances si:** falta el conector de Systems Lean (sin él no hay nada que hacer).
- **Lo demás no frena todo el lanzamiento.** Si falta la extensión de Chrome, la cuenta publicitaria con página y píxel (`ads_ver_conexion`) o el número de WhatsApp en Chat Lean, dale al usuario el paso para conectarlo (link y botón), anótalo como pendiente en LANZAMIENTO.md y **sigue con los pasos 1 a 10**. Cada falta frena solo el paso que la necesita: la extensión, el paso 1 si el proveedor es Soydrop y no está conectado; Meta y WhatsApp, los pasos 11 a 13.

### Paso 1 · El producto en la Biblioteca y la ficha viva (10 min)
[references/producto-y-alta.md](references/producto-y-alta.md) › «Paso 1»
- **Deja:** la ficha viva del proveedor leída hoy (stock vendible, costo, sugerido, flete, variantes, fotos) y el producto guardado en la Biblioteca y en la Lista de Testeo, con todas las fotos del proveedor importadas.
- **Verifica:** `product_favoritos_ver` (la fila del producto) y `product_biblioteca_ver`.
- **No avances si:** no hay stock para unas 3 semanas a 10 pedidos al día; no miraste las fotos reales ni anotaste lo que dice la etiqueta; el producto no quedó en la Biblioteca.

### Paso 2 · Investigar: el alta desde la Biblioteca (10 min)
[references/producto-y-alta.md](references/producto-y-alta.md) › «Paso 2»
- **Deja:** el producto creado desde su ítem de la Biblioteca (el botón «Investigar» de la app), con los datos del proveedor, sus fotos en Creativos de Inspiración, vinculado al proveedor, con checklist, viabilidad, hasta 3 fotos limpias, keywords y nombre fácil.
- **Verifica:** `product_ver_investigacion` (`fila_de_origen` y viabilidad), el vínculo (`dropi_productos_vinculados` en Dropi; `proveedor.vinculado` de `product_biblioteca_investigar` en Soydrop), `anuncios_ver_productos` (las fotos) y `anuncios_ver_biblioteca_creativos` (las fotos del proveedor).
- **No avances si:** el producto quedó creado dos veces o sin enlazar a su fila; el vínculo con Dropi o Soydrop no quedó.

### Paso 3 · Lo que buscas tú y lo que capture el usuario (≈20 min, sin esperarlo)
[references/investigacion.md](references/investigacion.md) › «Paso 3»
- **Deja:** tu búsqueda completa (la competencia del país y los tres ofrecimientos: anunciantes para seguir, los mejores anuncios y landings de otros mercados, formatos en tendencia) guardada en Creativos de Inspiración, más lo que el usuario ya haya capturado con la extensión. El mensaje con lo que él puede capturar va en una línea y **no se espera**: lo que capture después se suma al informe.
- **Verifica:** `product_ver_extraccion` (lo capturado por nodo) y `anuncios_ver_biblioteca_creativos` (las referencias con fuente, anunciante y días).
- **No avances si:** no hay anuncios del país destino ni de los países de referencia en la extracción ni en la biblioteca.

### Paso 4 · El informe de investigación (≈20 min)
[references/investigacion.md](references/investigacion.md) › «Paso 4»
- **Deja:** cada creativo analizado y descrito en la biblioteca, y el informe guardado: los 5 ángulos dominantes, las 3 ofertas más usadas, precios y ofertas por anunciante, destino, formato por nivel de conciencia, creencias con fuente, nivel de conciencia y el mapa de dolores.
- **Verifica:** `product_ver_informe` (las cuatro ramas con números) y `anuncios_ver_biblioteca_creativos` (cada creativo con su `descripcion`).
- **No avances si:** no hay rango de precios con números; una creencia o un dolor no tiene de dónde salió.

### Paso 5 · Projection: preguntas, oferta, escenarios y los dos CPA (≈15 min)
[references/oferta-y-cpa.md](references/oferta-y-cpa.md)
- **Deja:** las 7 preguntas respondidas; en Projection el costo, el flete real, el cobro, 30/5 %, el precio y el tachado, los paquetes con su mezcla y las ofertas que convienen; los escenarios que pidió el usuario; y los dos CPA por venta confirmada anotados.
- **Verifica:** `projection_ver_simulador`, `projection_ver_ofertas` y `projection_escenarios_ver`.
- **No avances si:** la hoja no tiene moneda; faltan los paquetes con su `share_pct`; el CPA de equilibrio queda bajo US$15 y el usuario no lo decidió.

### Paso 6 · Ficha técnica, ficha del producto, entrega y cobertura (≈10 min)
[references/product-lean.md](references/product-lean.md) › «Paso 6»
- **Deja:** la ficha técnica con sus fotos, la entrega propia del producto, la cobertura con las zonas excluidas y la ficha del agente con variables (`{{precio_1x}}`, `{{tiempos_entrega}}`…), nunca cifras escritas; una ficha por escenario si la oferta cambia.
- **Verifica:** `product_ver_ficha` (ficha, `entrega` y `cobertura_envio`).

### Paso 7 · Ángulos y perfiles (5 min)
[references/product-lean.md](references/product-lean.md) › «Paso 7»
- **Deja:** de 3 a 5 ángulos con mensaje, gancho, nivel de conciencia, problemas, objeciones y deseos, y 1 o 2 perfiles de comprador.
- **Verifica:** `anuncios_ver_angulos_venta` (ids `av…`).

### Paso 8 · Canal: WhatsApp o landing (2 min)
[references/canal.md](references/canal.md)
- **Deja:** la tabla de puntajes con su fuente y la decisión en una línea.

### Paso 9 · Creativos (tope 15 min por video, subagentes en paralelo)
[references/creativos.md](references/creativos.md) y [references/editor.md](references/editor.md)
- **Deja:** por cada ángulo 1 video editado en la PC y 1 imagen hecha en el generador de la app, más 6 videos de reserva; todo revisado y en la biblioteca del producto con su línea de origen y uso.
- **Verifica:** `media_listar`, `anuncios_ver_biblioteca_creativos` y `anuncios_ver_generados`.
- **No avances si:** queda texto o audio ajeno; una imagen de anuncio lleva precio; algún ángulo no tiene su par.

### Paso 10 · La landing (solo si el canal da landing)
[references/landing.md](references/landing.md)
- **Deja:** la landing armada con la estructura del método, sus imágenes hechas en la app, atada a su escenario, con el checkout del país y el tracking de la marca; publicada por el usuario (o por ti si te lo pidió).
- **Verifica:** `landing_ver` y la URL pública abierta con `?sl_test=1`.

### Paso 11 · WhatsApp: agente, embudo y confirmación (≈25 min)
[references/whatsapp.md](references/whatsapp.md), [references/flujo-plantilla.md](references/flujo-plantilla.md) y [references/flujo-grafo.md](references/flujo-grafo.md)
- **Deja:** el producto vinculado al agente, el material (video demo, foto en la mano, imagen de la promoción y los audios), el embudo «precio primero» publicado y atado a su escenario, la confirmación creada y cableada, y las simulaciones hechas.
- **Verifica:** `chat_agente_productos_ver`, `chat_flujo_validar` (`publicable: true`), `chat_flujo_publicar` (sin `avisos_oferta`), `chat_simular` (moneda del país y sin variables vacías) y `chat_flujos_ver` (embudo y confirmación publicados).
- **No avances si:** el producto no está activo en el agente; las palabras clave chocan con otro producto; la simulación sale con moneda equivocada o una variable vacía.

### Paso 12 · Campaña (≈15 min)
[references/campana.md](references/campana.md)
- **Deja:** la campaña ABO de testeo con un conjunto por ángulo, cada conjunto con su video y su imagen con copy y texto prellenado, el targeting, los dos CPA, las conversiones conectadas y el ensayo de publicación sin errores.
- **Verifica:** `ads_ver_testeo` y el plan de `ads_publicar` sin `confirmado`.
- **No avances si:** algún conjunto no tiene sus anuncios o tiene menos de US$5; falta `chat_proyecto_id`; el ensayo trae errores.

### Paso 13 · Auditoría, OK del usuario y publicación (1 mensaje)
[references/auditoria-y-ok.md](references/auditoria-y-ok.md)
- **Deja:** la auditoría módulo por módulo en verde, la tabla del OK, la campaña publicada con el «sí» del usuario, los ids de los anuncios en el flujo y en el agente, y el primer chat real leído.
- **No publiques si:** algo de la auditoría está en rojo sin decírselo al usuario; no hay un «sí» explícito; es de noche (22:00 a 7:00 en la zona del usuario).

### Paso 14 · Lectura a las 24 h
[references/lectura.md](references/lectura.md)

## Errores que este camino evita
- **Decir «listo» con módulos vacíos:** Projection sin paquetes, la biblioteca sin los ganadores, la campaña sin anuncios. Cada paso se cierra con su lectura.
- **Crear con `product_crear` un producto de Dropi o Soydrop:** nace sin los datos del proveedor, sin sus fotos en Creativos de Inspiración y fuera de la Lista de Testeo. Se guarda en la Biblioteca y se investiga desde ahí.
- **Esperar al usuario para seguir:** un usuario nuevo no sabe capturar con la extensión ni contestar las preguntas de Projection, y el lanzamiento se queda en el paso 2 con casi todo vacío (caso real del 2026-11-10: el producto quedó con la viabilidad automática y nada más). Tú haces la búsqueda completa y llenas todo con tu propuesta; lo que él capture o conteste después se suma o se corrige.
- **Un informe sin sus listas:** sin los 5 ángulos, las 3 ofertas, los precios por anunciante y los dolores ordenados, los pasos siguientes no tienen de dónde salir.
- **Simular en Projection y no guardar:** `projection_simular` no escribe nada. Lo que vale queda con `projection_aplicar`, `projection_costos_producto` y `projection_guardar_ofertas`.
- **Hacer las imágenes en la PC:** van en el generador de anuncios estáticos de la app, que usa la foto real del producto y los precios de Projection.
- **Subir un creativo directo a la campaña:** primero va a la biblioteca del producto, y a la campaña se adjunta con la URL de la biblioteca.
- **Cambiar lo que ya funcionaba:** a un video ganador del mismo producto no se le cambia la voz, la música ni el gancho.
- **Descubrir tarde que el empaque es distinto** (otro color de tapa, otro tamaño). Se revisa en el paso 1 y en cada video.
- **Usar un video que ya pauta otra página del país.** Se compara antes de elegirlo.
- **Dejar en el audio «TikTok», «el carrito naranja» o un precio:** pasa al final de los videos de otros países. Se escucha o se transcribe; mirar los cuadros no basta.
- **Quitar la unidad suelta sin necesidad:** se vende de a una, con el de 2 como la gran oferta; solo se quita si los números de la unidad no salen.
- **Un regalo físico creado como producto:** un regalo es un `bonus` de Projection.
- **Que todas las preguntas frecuentes terminen pidiendo los datos:** el agente le pide la dirección a quien solo preguntó si duele.
- **El flujo viejo sigue publicado:** al publicar el nuevo, el anterior del mismo producto se pausa.
- **Mensajes largos y técnicos al usuario.** Quiere la decisión y el porqué.
