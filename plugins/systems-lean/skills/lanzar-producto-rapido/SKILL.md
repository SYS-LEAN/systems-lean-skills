---
name: lanzar-producto-rapido
description: Camino de Systems Lean para lanzar un producto físico de dropshipping contra entrega (Dropi o Soydrop) de punta a punta en un solo chat con un agente de IA (Claude Code, Codex o Antigravity), desde la Lista de Testeo hasta la campaña de Meta lista para encender. Deja lleno todo en la app - Product Lean (alta, vínculo con el proveedor, fotos, keywords, informe, ángulos, ficha, entrega y cobertura), Projection (costos, oferta y los dos CPA), la biblioteca de creativos con los ganadores, el flujo de WhatsApp o la landing, y la campaña con sus anuncios - y lo verifica paso por paso con una ficha del lanzamiento. La edición de video e imagen corre en la PC del usuario con Remotion. Úsala cuando el usuario diga «lanza este producto», «testea X», «quiero vender X contra entrega», «lánzalo hoy», elija un producto de su Lista de Testeo o pegue uno de Dropi o Soydrop. Necesita el conector de Systems Lean.
---

# Lanzar un producto (contra entrega, con Systems Lean)

Del producto elegido a la campaña lista para encender, en un solo chat y en unas 2 a 3 horas. **El lanzamiento solo está terminado cuando cada módulo de la app quedó lleno y verificado con una herramienta de lectura.** Decir «listo» sin esa lectura es el error que este camino evita.

Sirve en cualquier agente de IA que lea skills y tenga terminal: Claude Code, Codex de OpenAI, Antigravity o Gemini CLI de Google. **Si la recibiste por el conector de Systems Lean** (no instalada), cada archivo `references/…` se pide aparte con `sl_como_trabajar {tarea: "lanzar-producto-rapido references/<archivo>.md"}` cuando el paso lo nombra; no lo improvises. El editor de video se descarga del repositorio público (ver [references/editor.md](references/editor.md) › «Instalar»).

## La ficha del lanzamiento (obligatoria)
Al empezar, crea `~/SystemsLean/productos/<producto>-<país>/LANZAMIENTO.md` con la plantilla de [references/ficha-lanzamiento.md](references/ficha-lanzamiento.md). Al cerrar cada paso, marca sus casillas y anota lo que dejó (nombres, números y la lectura que lo comprueba). Si el chat se corta o el contexto se compacta, **lee primero esa ficha** y sigue desde la primera casilla vacía.

## Reglas
- **Un solo chat** para todo el lanzamiento. Lo pesado (investigación, búsqueda y edición de videos) va a subagentes en paralelo si tu agente los tiene; si no, hazlo tú en orden. Los subagentes llevan prompts completos: producto, país, ids, rutas, reglas y qué devolver. Tú revisas en persona cada pieza antes de usarla: la revisión no se delega.
- **Cada paso termina con su verificación** (la tool de lectura que dice el paso). Si la lectura no muestra lo esperado, se corrige antes de seguir.
- **Los cuatro ids no se mezclan:** el del producto (Product Lean), el del simulador (Projection, sale de `projection_ver_productos`), el del ítem de la Biblioteca (Lista de Testeo) y el `link_id` del vínculo con el agente de WhatsApp. Al usuario se le habla por NOMBRES, nunca por ids.
- **La edición de video e imagen es solo en la PC** con el editor. No uses las tools de edición del servidor: `video_limpiar`, `video_clip_fx`, `video_tomar_fragmento`, `video_escena_recortar`, `video_toma_componer`, `video_ensamblar`, `video_remix_render`, `video_clip_subtitulos`, `video_extraer_frame` ni `video_remix_fuentes`.
- **Generar imágenes con IA sí va por la app** (`anuncios_generar`): cobra créditos, así que la primera vez muestra el costo con `anuncios_estimar_costo` y espera el sí.
- **Gastar, publicar en Meta o escribirle a un cliente espera el OK del usuario.** Guardar la ficha, Projection, la biblioteca y publicar el flujo de WhatsApp no lo esperan.
- **Nunca el precio en un creativo:** ni en el video, la imagen, los subtítulos ni el copy.
- **No inventes datos.** Stock, costo y flete salen de la ficha viva del proveedor; precios y CPA, de Projection. Lo que no se sabe se pregunta o se marca como supuesto.
- **Tasas para todo cálculo: 30 % de devolución y 5 % de cancelación**, salvo que el usuario tenga las suyas medidas.
- **Herramientas que no son para ti:** `ganadores_agregar` y `ganadores_ver` (solo administración), `grok_tareas_*`, `relevo_*`, `agentes_*`, `ads_propuestas_*`, `finanzas_*`, `product_extraer_comentarios` (depende de un ejecutor interno) y el script `scripts/mcp-subir-media.mjs` (no lo tienes: sube con `media_subida_url`).
- **Mensajes al usuario cortos y sin jerga:** la decisión y el porqué en una línea. Si algo lo tiene que hacer él fuera de la app, dale el link directo.

## Los pasos
Cada paso dice qué deja hecho, con qué se verifica y cuándo no se avanza. El detalle (tools, argumentos, trampas) está en su referencia.

### Paso 0 · Preparación y conexiones (5 min)
[references/preparacion.md](references/preparacion.md)
- **Deja:** la Unidad de Negocio elegida, las conexiones comprobadas, el editor instalado, la carpeta y la ficha del lanzamiento creadas, y una tabla «qué hay / qué falta» si el producto ya existía.
- **No avances si:** falta el conector de Systems Lean; `ads_ver_conexion` no muestra cuenta publicitaria, página y píxel; el canal probable es WhatsApp y el proyecto de Chat Lean no tiene número conectado.

### Paso 1 · Producto exacto y stock (5 min)
[references/producto-y-alta.md](references/producto-y-alta.md) › «Paso 1»
- **Deja:** la ficha viva del proveedor leída hoy (stock vendible, costo, flete, variantes, fotos) y la ficha del SKU en LANZAMIENTO.md.
- **No avances si:** no hay stock para unas 3 semanas a 10 pedidos al día; no miraste las fotos reales ni anotaste lo que dice la etiqueta.

### Paso 2 · Lista de Testeo y alta en Product Lean (10 min)
[references/producto-y-alta.md](references/producto-y-alta.md) › «Paso 2»
- **Deja:** el producto en la Lista de Testeo enlazado a su producto, vinculado al proveedor, con viabilidad, checklist, hasta 3 fotos limpias, keywords y nombre fácil.
- **Verifica:** `product_favoritos_ver` (la fila con su producto), `product_ver_investigacion` (vínculo, viabilidad, fotos, `nombre_llamadas`).
- **No avances si:** el vínculo con Dropi o Soydrop no quedó; el producto quedó creado dos veces.

### Paso 3 · Investigación: competencia y ganadores (≈20 min, 2 subagentes)
[references/investigacion.md](references/investigacion.md)
- **Deja:** la tabla de anunciantes del país, el rango de precios, de 10 a 15 creativos de referencia guardados en la biblioteca del producto con su origen, los ganadores del mismo producto comparados con nuestro empaque y la rama Competencia del informe.
- **Verifica:** `anuncios_ver_biblioteca_creativos` (las referencias con fuente, anunciante, días y descripción) y `product_ver_informe` (rama Competencia con números).
- **No avances si:** no hay rango de precios con números; ningún video del mismo producto quedó comparado con nuestro empaque.

### Paso 4 · Ángulos y perfiles (5 min)
[references/product-lean.md](references/product-lean.md) › «Ángulos y perfiles»
- **Deja:** de 3 a 5 ángulos con mensaje, gancho, nivel de conciencia, problemas, objeciones y deseos, y 1 o 2 perfiles de comprador.
- **Verifica:** `product_ver_estrategia` o `anuncios_ver_angulos_venta` (ids `av…`).

### Paso 5 · Una sola oferta en Projection y los dos CPA (≈10 min)
[references/oferta-y-cpa.md](references/oferta-y-cpa.md)
- **Deja:** en Projection el costo, el flete real, contra entrega, 30/5 %, el precio y el tachado, los 3 paquetes con su mezcla, el envío gratis y el regalo; y los dos CPA por venta confirmada anotados.
- **Verifica:** `projection_ver_simulador` y `projection_ver_ofertas`.
- **No avances si:** la hoja no tiene moneda; faltan los paquetes con su `share_pct`; el CPA de equilibrio queda bajo US$15 y el usuario no lo decidió.

### Paso 6 · Ficha del producto, entrega y cobertura (≈10 min)
[references/product-lean.md](references/product-lean.md) › «Ficha, entrega y cobertura»
- **Deja:** la ficha técnica, la entrega propia del producto, la cobertura con las zonas excluidas y la ficha del agente con variables (`{{precio_1x}}`, `{{tiempos_entrega}}`…), nunca cifras escritas.
- **Verifica:** `product_ver_ficha` (ficha, `entrega` y `cobertura_envio`).

### Paso 7 · Canal: WhatsApp o landing (2 min, y la landing si toca)
[references/canal.md](references/canal.md) y, si da landing, [references/landing.md](references/landing.md)
- **Deja:** la tabla de puntajes con su fuente y la decisión en una línea. Si es landing: la landing publicada con su checkout y su píxel.

### Paso 8 · Creativos (tope 15 min por video, subagentes en paralelo)
[references/creativos.md](references/creativos.md) y [references/editor.md](references/editor.md)
- **Deja:** por cada ángulo 1 video y 1 imagen terminados, más 6 videos de reserva; todo revisado en la hoja de cuadros y subido a la biblioteca del producto con su línea de origen y uso.
- **Verifica:** `media_listar` y `anuncios_ver_biblioteca_creativos` (cada pieza con su URL de la biblioteca).
- **No avances si:** queda texto o audio ajeno; una imagen lleva precio; algún ángulo no tiene su par.

### Paso 9 · WhatsApp: agente, embudo y confirmación (≈25 min)
[references/whatsapp.md](references/whatsapp.md), [references/flujo-plantilla.md](references/flujo-plantilla.md) y [references/flujo-grafo.md](references/flujo-grafo.md)
- **Deja:** el producto vinculado al agente, el material (video demo, foto en la mano, imagen de la promoción y los audios), el embudo «precio primero» publicado, la confirmación creada y cableada, y las simulaciones hechas.
- **Verifica:** `chat_agente_productos_ver`, `chat_flujo_validar` (`publicable: true`) y `chat_flujos_ver` (embudo y confirmación publicados).
- **No avances si:** el producto no está activo en el agente; las palabras clave chocan con otro producto; la simulación sale con moneda equivocada o una variable vacía.

### Paso 10 · Campaña (≈15 min)
[references/campana.md](references/campana.md)
- **Deja:** la campaña ABO de testeo con un conjunto por ángulo, cada conjunto con su video y su imagen con copy y texto prellenado, el targeting, los dos CPA, las conversiones conectadas y el ensayo de publicación sin errores.
- **Verifica:** `ads_ver_testeo` y el plan de `ads_publicar` sin `confirmado`.
- **No avances si:** algún conjunto no tiene sus anuncios o tiene menos de US$5; falta `chat_proyecto_id`; el ensayo trae errores.

### Paso 11 · Auditoría, OK del usuario y publicación (1 mensaje)
[references/auditoria-y-ok.md](references/auditoria-y-ok.md)
- **Deja:** la auditoría módulo por módulo en verde, la tabla del OK, la campaña publicada con el «sí» del usuario, los ids de los anuncios en el flujo y en el agente, y el primer chat real leído.
- **No publiques si:** algo de la auditoría está en rojo sin decírselo al usuario; no hay un «sí» explícito; es de noche (22:00 a 7:00 en la zona del usuario).

### Paso 12 · Lectura a las 24 h
[references/lectura.md](references/lectura.md)

## Errores que este camino evita
- **Decir «listo» con módulos vacíos:** Projection sin paquetes, la biblioteca sin los ganadores, la campaña sin anuncios. Cada paso se cierra con su lectura.
- **Simular en Projection y no guardar:** `projection_simular` no escribe nada. Lo que vale queda con `projection_aplicar`, `projection_costos_producto` y `projection_guardar_ofertas`.
- **Crear el producto fuera de la Lista de Testeo:** queda sin termómetro. Se entra por la lista o se lo enlaza con el mismo id del proveedor.
- **Subir un creativo directo a la campaña:** primero va a la biblioteca del producto, y a la campaña se adjunta con la URL de la biblioteca.
- **Cambiar lo que ya funcionaba:** a un video ganador del mismo producto no se le cambia la voz, la música ni el gancho.
- **Descubrir tarde que el empaque es distinto** (otro color de tapa, otro tamaño). Se revisa en el paso 1 y en cada video.
- **Usar un video que ya pauta otra página del país.** Se compara antes de elegirlo.
- **Dejar en el audio «TikTok», «el carrito naranja» o un precio:** pasa al final de los videos de otros países. Se escucha o se transcribe; mirar los cuadros no basta.
- **Vender solo paquetes:** siempre va la unidad suelta, con el de 2 como la gran oferta.
- **Un regalo físico creado como producto:** un regalo es un `bonus` de Projection.
- **El flujo viejo sigue publicado:** al publicar el nuevo, el anterior del mismo producto se pausa.
- **Mensajes largos y técnicos al usuario.** Quiere la decisión y el porqué.
