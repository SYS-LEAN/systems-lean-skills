# Paso 11 · WhatsApp: agente, material, embudo «precio primero» y confirmación

Pide antes `sl_como_trabajar {tarea: "flujo de WhatsApp de venta de un producto nuevo"}`: trae las reglas del módulo de chat. Si el usuario tiene reglas propias de chat: `skills_listar {modulo: "chat_lean"}` → `skills_leer` solo de lo que vayas a usar. Este paso deja cinco cosas: **el vínculo del producto con el agente, el material, el embudo publicado, la confirmación cableada y las simulaciones.**

## 1. Leer antes de tocar
- `chat_proyectos_ver {}`: el proyecto (el número) que va a vender. Anota su `proyecto_id`.
- `chat_salud_ver {proyecto_id}`: que el canal esté activo. Sin canal no hay nada que arreglar: el usuario conecta el número primero.
- `chat_agente_productos_ver {proyecto_id}`: los productos que ya atiende ese número y sus palabras clave (para no chocar).
- `chat_flujos_ver {proyecto_id}`: los flujos que existen. ¿Hay uno viejo de este producto? ¿Hay uno de venta del usuario que convenga duplicar?
- `crm_etiquetas_permitidas_ver {proyecto_id}`: las etiquetas que el agente puede poner.
- `projection_escenarios_ver {producto_id: <id del simulador>}`: el `escenario_id` de la oferta que va a vender este flujo. **El escenario dice si el cobro es contra entrega o anticipado:** léelo, no lo asumas.
- **El trato al cliente** sale del país de la oferta: Colombia, de tú; Honduras, de usted. En otro país, o en Argentina y Uruguay (la plantilla no trae voseo), pregúntale al usuario. Una vez elegido, va igual en TODO el flujo, en los audios y en los contextos de los agentes de IA; para tú, aplica «Trato de tú» de [flujo-plantilla.md](flujo-plantilla.md) antes de guardar.

## 2. El vínculo del producto con el agente
Sin este vínculo, el producto es invisible para el chat.
1. `chat_agente_producto_agregar {proyecto_id, producto_id, activador_keywords: [...]}` → devuelve `link_id` (anótalo).
   - `activador_keywords`: como las escribe el cliente, con y sin tildes y con errores de tipeo: el nombre fácil, la marca, lo que es («faja», «fajas», «faja reductora») y una palabra de cada texto prellenado de los anuncios (la tabla «Creativos por conjunto» del paso 9). **No pueden chocar** con las de otro producto del mismo número.
   - Sin `recordatorio_*`: los seguimientos van en el embudo.
2. `chat_agente_producto_editar {link_id, activo: true, remarketing_activo: false, batching_delay_seconds: 10, max_chars_bloque: 200, display_nombre_override: "<nombre comercial>"}`. La plantilla da por puesto el nombre comercial.
   - `mostrar_escribiendo: true` solo después de avisarle al usuario: también enciende el doble check azul.
   - `meta_ad_ids` se carga al final, cuando la campaña esté publicada (paso 13).
3. **El prompt del agente:** el prompt define CÓMO atiende (tono, reglas, cómo toma el pedido); la ficha del escenario define QUÉ vende y llega por encima del prompt. Por eso el prompt no repite producto, precios ni envío.
   - Lo normal es no tocarlo: con la ficha (paso 6) y los contextos de los agentes del flujo alcanza.
   - Si el usuario quiere un prompt propio para el producto, primero lee el actual y la base del proyecto con `chat_agente_productos_ver`. `prompt_override` en `chat_agente_producto_editar` **reemplaza el texto completo**.

## 3. El material
Los videos se editan en la PC y se suben a la biblioteca del producto (`media_subida_url` → PUT → `media_subida_confirmar`, ver [editor.md](editor.md) › «Subir»). **Las imágenes se hacen en el generador de la app** y quedan en su lote. En los nodos va la URL de la biblioteca o del lote. Pide el material que falte; si el usuario no lo tiene y no se puede producir, díselo en vez de armar el mensaje sin nada que mostrar.

- **Video demo (6 a 15 s), con `VideoDemo` en la PC:**
  - Clips REALES del producto: cómo se usa y el antes y después de la misma persona. Salen de la biblioteca del producto (pasos 3 y 4) y de los anuncios del mismo producto.
  - Voz en off corta (dolor → solución → regalo → «pagas al recibir»), subtítulos y los rótulos «ANTES» y «DESPUÉS».
  - **Nunca una persona generada con IA.**
- **Foto real en la mano, en el generador de la app:** `anuncios_generar` (cobra) con la foto real del producto (rol `producto`) y una escena de una casa de clase media del país (un baño o una cocina sencillos, nunca de lujo). El producto de tamaño real y fiel a la etiqueta.
- **Imagen de la promoción, en el generador de la app:**
  1. La base: `anuncios_generar {producto_id, nombre: "<producto> · promoción", formato: "4:5", mostrar_precio: false, referencias: [{url, rol: "producto"}], disenos: [...]}`, con el producto real repetido por paquete y el espacio para cada fila.
  2. Los precios exactos encima, sin IA y gratis: `anuncios_componer_elementos {lote_id, anuncio_id, elementos}` con un `price` o un `text` por paquete, el precio de Projection y «Ahorras …». El de 2 marcado «LA MÁS PEDIDA» y los regalos, «GRATIS».
  3. Otra opción: `mostrar_precio: true` en el punto 1, y el modelo imprime el precio real de Projection. Revisa que salga exacto.
  4. Si la foto del producto tiene fondo blanco liso y hace falta recortarla, `store_imagen_quitar_fondo`.
  - Esta imagen va en el chat. Nunca en un anuncio.
- **Capturas de clientes:** solo si el usuario tiene capturas reales, con la foto y el número borrosos; van como pieza del agente, para cuando el cliente desconfía. La plantilla no las manda en ningún mensaje, así que no se generan.
- **Los audios A1 a A9 y A11** (tabla abajo): una sola voz por chat, con el acento del país y el género de quien compra. Los graba el usuario con el celular en un cuarto callado, o se generan con los créditos de la app (`video_narracion_audio`) o con su cuenta de ElevenLabs (`scripts/voz.mjs`): ver [creativos.md](creativos.md) › «La voz». **Se suben como estén:** la app los convierte a nota de voz. Los del celular: que te los mande o los deje en `<carpeta del producto>/whatsapp/`, y los subes con `media_subida_url` → PUT → `media_subida_confirmar`. Los mp3 de `video_narracion_audio` ya tienen URL: `media_subir {url, producto_id}`.

## 4. El embudo de venta
Tres caminos, en este orden:
1. **Si `sl_como_trabajar` nombra una tool que crea el embudo de venta de fábrica,** úsala y adapta textos, material y precios.
2. **Si el usuario ya tiene un embudo de venta que vende en la misma categoría y país:** `chat_flujo_duplicar {flujo_id, nombre}` y adapta todo con `chat_flujo_texto_reemplazar {flujo_id, reemplazos: [{buscar, poner}]}` y `chat_flujo_nodo_editar {flujo_id, nodo_id, data}` (los dos escriben en el borrador).
3. **Si no hay ninguno: la plantilla** (el modelo que más vendió, validado con el validador de la app). [flujo-plantilla.md](flujo-plantilla.md) explica cada nodo y cada marcador `[[…]]`; [flujo-grafo.md](flujo-grafo.md) trae el grafo. Reemplaza cada marcador con lo de este producto y guárdalo como dice «Cómo guardarlo»:
   - `chat_flujo_guardar {proyecto_id, nombre: "<producto> · precio primero", trigger, grafo, producto_link_id: <link_id>}` (el `trigger` y lo demás, como dice la plantilla): crea el borrador y devuelve `flujo_id`.
   - **Al crear, la app ignora `escenario_id`.** Si el flujo vende un escenario, mándalo en una segunda llamada `chat_flujo_guardar {flujo_id, escenario_id}` y compruébalo en `chat_flujos_ver {proyecto_id}`. Sus `{{precio_1x}}` y `{{precio_2x}}` y la ficha del agente salen de ESE escenario. Sin escenarios no hace falta: vende la oferta principal.
   - Mira el `chequeo` de la respuesta: `dejan_al_cliente_sin_atender` se conecta; `cierran_el_flujo_a_proposito` está bien así.

**Reglas duras:**
- La confirmación del pedido NUNCA va dentro del embudo (ver 5).
- Los precios no se escriben a mano en textos ni en contextos: `{{precio_1x}}`, `{{precio_2x}}` y `{{precio_3x}}` (salen con moneda y puntos). `{{precio_1x_num}}`, `{{precio_2x_num}}` y `{{precio_3x_num}}` son el número pelado: solo sirven para dictarle al agente el `precio_total` de `registrar_pedido`. La excepción son los botones, que llevan el precio escrito (hasta 20 caracteres): si cambia el precio, se cambian («Si cambia un precio»).
- Si el escenario cobra el flete, ningún texto dice «envío gratis».
- Nunca se baja el precio ante una objeción: se mejora la oferta, no el precio.
- Nada de nombres de otras marcas, de proveedores ni de productos ajenos.

Después, sea cual sea el camino:
- `chat_flujo_validar {flujo_id}` hasta `publicable: true`.
- Si un nodo pone etiquetas que no están en `crm_etiquetas_permitidas_ver`, el agente las descarta: quítalas del nodo o pregúntale al usuario si las agrega.
- **Revisa el embudo antes y después de publicar:**
  - `chat_flujos_ver {proyecto_id, flujo_id}`: busca `[[` en el grafo (tiene que dar 0) y cifras escritas a mano fuera de los botones;
  - `chat_flujo_publicar {flujo_id}`: si devuelve `avisos_oferta`, el agente dice otro precio que la oferta: corrígelo y vuelve a publicar;
  - `chat_simular` con los casos del punto 6: la moneda del país, ninguna variable vacía y nada de «envío gratis» si la oferta cobra el flete;
  - `chat_ab_verificar {proyecto_id}` solo sirve si armaste una prueba A/B (`ab_grupo`): con un embudo solo devuelve `pruebas: []` y no revisa nada.
- **Si había un embudo viejo de este producto publicado,** `chat_flujo_estado {flujo_id: <el viejo>, estado: "pausado"}`.

**Otra estructura, para un producto que se vende con asesoría personal** (talla, medida, dosis, compatibilidad; el factor 2 del canal da +2): un mensaje de bienvenida con una persona con nombre propio del país (foto de un cliente real, capturas, un video corto y la pregunta por el dolor, sin botones) y un solo agente de IA que lleva la conversación completa: el dolor, una recomendación según el dato del cliente, la promoción del escenario y el pedido con todos los datos en un solo mensaje. Solo con material real. Antes de publicarlo, muéstrale al usuario el mensaje de bienvenida y el contexto del agente completos y espera su visto bueno.

## 5. La confirmación del pedido
Es otro flujo, aparte. **No se arma nodo por nodo:**
1. `chat_flujo_pedido_crear {proyecto_id, producto_link_id, con_credito: false}`: arma la confirmación completa en borrador. Sin crédito es lo de fábrica; solo si el usuario vende a crédito propio, `con_credito: true`.
2. `chat_flujo_texto_reemplazar` para el trato (tú o usted) y el nombre de la tienda.
3. Que después de una cancelación automática haya un aviso al dueño por WhatsApp con el producto, el total, el cliente y el teléfono (ver [flujo-plantilla.md](flujo-plantilla.md) › «La confirmación»).
4. `chat_flujo_validar` y `chat_flujo_publicar` de la confirmación.
5. `chat_flujo_confirmacion_asignar {flujo_venta_id: <embudo>, confirmacion_flujo_id: <confirmación>}`, con la confirmación ya publicada: tienen que ser del mismo producto.

**Las plantillas de Meta** (para escribirle al cliente fuera de las 24 h):
- `chat_plantillas_ver {}`: las que tiene el número. Si alguna figura PENDING, `chat_plantillas_sincronizar {}`.
- Si falta una que la confirmación usa: primero el catálogo de la casa, `chat_plantillas_catalogo {accion: "ver"}`, y después `{accion: "crear", claves: [...], confirmar: true}` **con el OK del usuario** (cada rechazo de Meta baja la calidad del número). Solo si no sirve ninguna, `chat_plantilla_crear` (sin `confirmar` muestra la previa).

**Los recordatorios que el cliente entiende:** `crm_voz_cliente {accion: "guardar", plantilla: "*", producto_id, imagen_url: <imagen de la promoción>}`. Si el usuario grabó voces para los recordatorios: `crm_voz_cliente {accion: "guardar", plantilla, producto_id, audio_url, texto}`.

## 6. Simular y verificar
- `chat_simular {proyecto_id, flujo_id, producto_link_id, mensajes_cliente: [...]}` cobra un turno de IA por mensaje: díselo al usuario la primera vez. Prueba:
  - cada texto prellenado de los anuncios;
  - «¿cuánto cuesta?», «¿es original?», «quiero solo uno», «mándame los 2» con datos.
- Revisa: la moneda del país (nunca «$» donde no va), que ninguna variable salga vacía (`{{tiempos_entrega}}`), la nota del regalo y la cantidad registrada.
- **Verifica:** `chat_agente_productos_ver` (activo, keywords), `chat_flujos_ver {proyecto_id}` (embudo y confirmación `publicado`, viejo `pausado`).

## Lo que ve el cliente (así funciona la plantilla)
**Llega:** la imagen de la promoción, la foto real en la mano, el audio A1 y un texto con 3 botones con precio, en ese orden.
- Texto: qué es el producto y para qué en una línea; el regalo con 2 o 3, si lo hay; «🚚 Envío gratis · Pagas al recibir»; «¿Cuál promoción le envío? 👇».
- Botones: «1 frasco · $…», «2 frascos · $…», «3 frascos · $…». **Hasta 20 caracteres por botón** (el validador rechaza más; si no cabe, «2 por $149.900»). Los precios salen de Projection.
- **El video demo** sale cuando el cliente pide ver el producto (la pieza «ver producto» del agente).
- **Toca un botón:** se guarda la cantidad, se marca contra entrega, sale el audio A2 y un solo mensaje que pide los datos (nombre, teléfono y dirección con barrio y ciudad). Se aceptan en audio.
- **El de 2 se ofrece una sola vez y antes de que elija.** Si elige 1, se le vende el de 1 sin ofrecerle otro paquete.
- **Con los datos,** el agente de pedido lo registra y sigue la confirmación (otro flujo). **Si hoy no tiene dinero,** el agente de reserva se lo aparta para la fecha que diga y le avisa al dueño.

## La entrada (el primer nodo)
1. Ya conversó o responde a una plantilla → la imagen de la promoción y contesta el agente.
2. Su primer mensaje pregunta el precio («precio», «cuánto», «cuesta», «valor») → precio primero.
3. Escribió su propia pregunta → la imagen de la promoción y contesta el agente.
4. Todo lo demás (casi todo el que llega de un anuncio) → precio primero.

Opcionales, en [flujo-plantilla.md](flujo-plantilla.md) › «Opcional»: que quien viene de la landing no reciba los precios otra vez, y una rama por anuncio o por texto prellenado.

## Los audios
- **Trato:** la plantilla está de usted (Honduras). Para los países de tú, [flujo-plantilla.md](flujo-plantilla.md) › «Trato de tú» dice qué cambiar. Los audios, en el mismo trato.
- Antes de usarlos, se revisan: que se entienda la marca y que no tengan muletillas.

| Audio | Qué dice |
|---|---|
| A1 · bienvenida | Qué es, para qué sirve, que el de 2 es el que más se llevan y que paga al recibir |
| A2 · pedir datos | Qué datos necesita para mandárselo; puede mandarlos en audio |
| A3 · funciona y uso | Cómo funciona y cómo se usa; termina preguntando cuál le prepara |
| A4 · original | Que es original y qué le llega, tal cual la foto. **No se promete que lo revisa antes de pagar** |
| A5 · precio | Los precios de las 3 promociones; pregunta si se lo prepara |
| A6 · apartar | Que se lo aparta para el día que diga |
| A7 · entrega | Cómo y cuándo le llega, y que paga al recibir |
| A8 · solo uno | Que puede llevar solo uno, y le pide los datos |
| A9 · seguimiento | Recordatorio amable a la hora, sin presión |
| A11 · pedido confirmado | Gracias; su pedido va en camino (va en la confirmación) |

**Audio o texto:** en la primera duda u objeción real el agente responde con el audio que toca más una línea de texto. Máximo 2 o 3 audios por chat, nunca el mismo dos veces.

## Seguimientos por silencio
Cada uno sale una sola vez, se cancela si el cliente escribe y no sale fuera de la ventana de 24 h.

| Cuándo | Qué sale |
|---|---|
| 4 min sin tocar un botón | «¿Pudo ver la promoción?» con los 3 botones |
| 1 h | Audio A9 con los 3 botones |
| Eligió y a los 10 min no mandó los datos | Un texto que le recuerda que solo falta la dirección |

## Si cambia un precio
1. La imagen de la promoción nueva, en el generador de la app: `anuncios_componer_elementos` con los precios nuevos sobre la misma base.
2. `chat_flujo_nodo_editar` del nodo de bienvenida con la imagen nueva.
3. `chat_flujo_texto_reemplazar` de los botones.
4. Regrabar A5 (dice los precios) y A1 si mencionaba la oferta. Validar, publicar y simular.

## Cierre del paso
Marca las casillas del paso 11 en LANZAMIENTO.md con los nombres del embudo y de la confirmación, el `link_id`, el escenario y el resultado de las simulaciones.
