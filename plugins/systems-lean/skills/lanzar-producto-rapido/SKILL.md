---
name: lanzar-producto-rapido
description: Camino rápido de Systems Lean para lanzar un producto físico de dropshipping contra entrega (Dropi o Soydrop) en un solo chat con un agente de IA (Claude Code, Codex o Antigravity), del producto elegido a la campaña de Meta lista para encender en unas 2 horas. Diez pasos con tiempo tope - stock y producto exacto, alta en la app, investigación de la competencia, una sola oferta, un solo canal, creativos ganadores editados en la PC del usuario con Remotion, imágenes, flujo de WhatsApp, campaña ABO de testeo y el OK del usuario. Úsala cuando el usuario diga «lanza este producto», «testea X», «quiero vender X contra entrega», «lánzalo hoy» o pegue un producto de Dropi o Soydrop para probarlo. Necesita el conector de Systems Lean.
---

# Lanzar un producto rápido (contra entrega, con Systems Lean)

Del producto elegido a la campaña lista para encender, en un solo chat. La app Systems Lean, por su conector, guarda el producto, calcula la oferta, arma el flujo de WhatsApp y monta la campaña. **Toda la edición de video e imagen se hace en la PC del usuario** con el editor de esta skill (Remotion). La app solo recibe los archivos terminados.

Sirve en cualquier agente de IA que lea skills y tenga terminal: Claude Code, Codex de OpenAI, Antigravity o Gemini CLI de Google. **Si la recibiste por el conector de Systems Lean** (no instalada), cada archivo `references/…` que nombra viene completo en la misma respuesta, con su título, y el editor se descarga del repositorio público (ver [references/editor.md](references/editor.md) › «Instalar»).

## Antes de empezar
1. **Conector de Systems Lean:** llama `sl_como_trabajar` con la tarea. Si no existe la tool, el usuario no agregó el conector: dile cómo (README de https://github.com/SYS-LEAN/systems-lean-skills) y detente.
2. **Proveedor del país:**
   - Países de Dropi (Colombia y otros): el conector oficial de Dropi (`list_products`). Si no está, pídele que lo agregue como conector de su agente con la dirección `https://mcp.dropi.co/mcp` (en Claude: claude.ai → Configuración → Conectores).
   - Honduras (Soydrop): `soydrop_token_estado` debe decir conectado. Si no, el usuario lo conecta con la extensión de Chrome de Systems Lean.
3. **Competencia:** un conector de la Biblioteca de anuncios de Meta (`ads_library_search`; en Claude viene gratis en el directorio de conectores). Dropkiller, si lo tiene, suma datos de ventas y ganadores de afuera. Sin ninguno de los dos, mira la Biblioteca (https://www.facebook.com/ads/library/) con el navegador de tu agente si lo tiene, o pídele al usuario los enlaces de los anunciantes del país.
4. **Editor (una vez por PC):** sigue [references/editor.md](references/editor.md) › «Instalar». Necesita Node.js 20 o más.
5. **Carpeta del producto:** `~/SystemsLean/productos/<producto>-<país>/` con `entrada/` (lo bajado), `planes/` (los JSON del editor) y `salida/` (lo terminado).

## Reglas
- **Un solo chat** para todo el lanzamiento.
- **Lo pesado va a subagentes en paralelo** si tu agente los tiene; si no, hazlo tú en orden (investigación, búsqueda de videos). Los subagentes llevan prompts completos: producto, país, ids, rutas, reglas y qué devolver. Tú coordinas, decides y **revisas en persona cada pieza** antes de usarla: la hoja de cuadros de cada video y cada imagen. La revisión no se delega.
- **La edición es solo en la PC.** No uses las herramientas de edición del servidor de la app: `video_limpiar`, `video_clip_fx`, `video_tomar_fragmento`, `video_escena_recortar`, `video_toma_componer`, `video_ensamblar`, `video_remix_render`, `video_clip_subtitulos` ni `video_extraer_frame`, y tampoco `video_remix_fuentes` para bajar videos. Se baja con `curl` a la PC, se edita con el editor y se sube terminado con `media_subida_url` (ver [references/editor.md](references/editor.md) › «Subir»).
- **Generar imágenes con IA sí va por la app** (`anuncios_generar`), porque el modelo corre afuera. Cobra créditos: la primera vez muestra el costo con `anuncios_estimar_costo` y espera el sí.
- **Gastar, publicar en Meta o escribirle a un cliente espera el OK del usuario.** Guardar la ficha y publicar el flujo de WhatsApp no lo esperan.
- **Nunca el precio en un creativo:** ni en el video, la imagen, los subtítulos ni el copy.
- **No inventes datos.** Stock, costo y flete salen de la ficha viva del proveedor; los precios y los CPA, de Projection. Si falta algo, se pregunta.
- **Tasas para todo cálculo: 30 % de devolución y 5 % de cancelación**, salvo que el usuario tenga las suyas medidas. La devolución cuesta un solo flete.
- **Mensajes al usuario cortos y sin jerga:** la decisión y el porqué en una línea.

## Paso 1 · Stock y producto exacto (5 min, tú)
1. **Ficha viva:**
   - Dropi: `list_products {search: <id de Dropi>, get_stock: true}`. En un producto con variantes, el stock es la suma de `variations[].stock`. Si el id no aparece, el producto está agotado o inactivo y no se lanza. El conector no descuenta lo que otros apartaron: si el stock queda justo, pídele al usuario que lo mire en la ficha de Dropi.
   - Soydrop: `soydrop_producto_ver`.
   - Si el stock no alcanza para la prueba y una escala corta (unas 2-3 semanas a 10 pedidos al día), **detente y avisa**.
2. **Mira las fotos reales del proveedor** y anota lo que dice la etiqueta y cómo es el empaque: tamaño (ml, cápsulas), color, tapa o gatillo, caja. La descripción del proveedor puede estar mal: lo de la etiqueta manda en todo.

## Paso 2 · Alta (2 min, tú)
`product_crear` vinculado al proveedor (id de Soydrop o enlace de Dropi) y verifica `vinculado: true`. Después `product_completar_viabilidad` (nicho, país y países de referencia) y `product_guardar_keywords`.

## Paso 3 · Investigación (≈15 min, 2 subagentes en paralelo)
- **Competencia del país:**
  - Busca en la Biblioteca de Meta del país (`ads_library_search`, varias búsquedas: el nombre, la búsqueda genérica de lo que hace y el problema que resuelve) y en Dropkiller si lo hay.
  - Por anunciante anota: anuncios activos, días, si el dueño hace variantes, canal (% a WhatsApp o a landing), ángulo, gancho, oferta y precio por cantidad.
  - Devuelve el rango de precios del mercado y los ángulos: el que más dura, el más usado y el que nadie toca.
  - **El brief puede estar viejo:** la competencia se mide siempre en vivo.
- **Ganadores del MISMO producto afuera:**
  - Busca en los países que venden en el mismo idioma (Meta, Dropkiller, TikTok).
  - Por video anota: días o vistas, ángulo, gancho, idioma, **si su empaque es igual al nuestro** y si ya lo pauta alguien en el país.
  - Se bajan a `entrada/` con `curl -L -o "<archivo>.mp4" "<url del video>"`. Si solo hay un enlace de TikTok, con `yt-dlp` si está instalado; si no, se le pide el archivo al usuario.
- Guarda la competencia con `product_guardar_informe` (precios como número, no como texto).

## Paso 4 · Una sola oferta (≈5 min, tú)
Siempre se vende 1 unidad, con un precio que hace ver el paquete de 2 como la gran oferta. Reglas, Projection y los dos CPA: [references/oferta-y-cpa.md](references/oferta-y-cpa.md).

## Paso 5 · Canal (2 min, tú)
**Un solo canal:** WhatsApp o landing, con la tabla de [references/canal.md](references/canal.md). Se le dice al usuario en una línea con el porqué. Si da landing, pide `sl_como_trabajar` con «landing del producto» y sigue ese módulo.

## Paso 6 · Creativos (tope 15 min por video, subagentes en paralelo)
- **De 3 a 5 ángulos** según el presupuesto (paso 8); en la práctica, 3.
- **Cada conjunto lleva 1 video y 1 imagen del mismo ángulo.**
- **Más 6 videos de reserva** con la misma edición, para renovar.
- Cómo elegirlos, editarlos en la PC, revisarlos y subirlos: [references/creativos.md](references/creativos.md).

## Paso 7 · Flujo de WhatsApp (≈20 min, 1 subagente)
Precio primero, con el video demo con antes y después, la foto real en la mano, la imagen de la promoción, el audio de bienvenida y 3 botones con precio. Estructura, audios, seguimientos y cómo se arma: [references/whatsapp.md](references/whatsapp.md). Se publica sin esperar al usuario.

## Paso 8 · Campaña (≈10 min, tú)
- `ads_crear_campania`: nombre «ABO · Testeo · <producto> · WhatsApp» (o «· Landing»), objetivo `mensajes` (o ventas para landing), presupuesto por conjunto y el `chat_proyecto_id` del país.
- **Presupuesto diario = 1 CPA de equilibrio**, repartido en conjuntos de al menos US$5: cantidad de conjuntos = CPA de equilibrio ÷ US$5, entre 3 y 5. Si queda apenas bajo US$5 por conjunto, se dice y decide el usuario.
- `ads_editar_campania`: `breakeven_cpa` y `cpa_objetivo` del paso 4. Los conjuntos se llaman «Ángulo · <ángulo>».
- `ads_configurar_targeting`: país, 18 años o más, sin las zonas que el proveedor no cubre (confírmalas con el usuario o con `quote_shipping`), `optimization_goal: CONVERSATIONS` en WhatsApp.
- `ads_subir_creativo {url}` con la URL de la biblioteca (paso 6), con copy sin precio (texto y título), y `ads_editar_creativo {chat_autofill}` con el texto prellenado de su ángulo.
- `ads_conectar_conversiones` y `ads_probar_conversiones` hasta que `llegan` y `con_atribucion` den true.

## Paso 9 · OK del usuario (1 mensaje)
1. Mándale una tabla corta: los conjuntos con su video y su imagen, la oferta, los dos CPA, el presupuesto diario y los riesgos reales, uno por línea (empaque distinto, audio con modismos de otro país).
2. Con su sí: `ads_publicar {activar: true, confirmado: true}` y verifica con `ads_ver_testeo` que los conjuntos estén activos y los anuncios en revisión o activos. **Nunca de 22:00 a 7:00.**
3. **En seguida**, los ids de Meta de los anuncios van a la entrada del flujo ([references/whatsapp.md](references/whatsapp.md) › «Ids de los anuncios») y se republica.
4. Luego lee el primer chat real para confirmar que llegaron el video y la foto.

## Paso 10 · Después
- A las 24 h, la lectura de [references/lectura.md](references/lectura.md).
- La reserva queda lista para la primera renovación.

## Errores que este camino evita
- **Cambiar lo que ya funcionaba:** a videos del mismo producto que servían tal cual se les cambió la voz, la música y el gancho. Se pierde más de una hora y se arriesga el video.
- **Voz nueva sobre alguien que habla a cámara:** los labios no coinciden. Si alguien habla, se conserva su audio.
- **Descubrir tarde que el empaque es distinto** (otro color de tapa, otro tamaño). Se revisa en el paso 1 y en cada video ganador.
- **Usar un video que ya pauta otra página del país.** Se compara con los anuncios del país antes de elegirlo: si ya corre, va a reserva o se descarta.
- **Dejar en el audio «TikTok», «el carrito naranja» o un precio:** pasa casi siempre al final de los videos de otros países. Escucha o transcribe el audio y corta en la palabra; mirar los cuadros no basta.
- **Tapar una marca de agua que cruza todo el video:** quedaría tapado el centro. Ese video se descarta.
- **Imágenes más «elegantes» que los videos:** el mensaje y el tono de la imagen salen del video de su conjunto.
- **Precio repetido:** el flujo no repite el precio en la bienvenida si ya va en la imagen de la promoción y en los botones.
- **Vender solo paquetes:** siempre va la unidad suelta, con el de 2 como la gran oferta.
- **Precios elegidos con otra calculadora:** las opciones salen de `projection_simular`.
- **Un regalo físico creado como producto:** un regalo es un `bonus` de Projection, nunca `product_crear` ni un complementario.
- **Mensajes largos y técnicos al usuario.** Quiere la decisión y el porqué.
