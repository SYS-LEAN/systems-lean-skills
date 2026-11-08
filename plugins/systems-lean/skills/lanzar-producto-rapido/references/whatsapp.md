# Paso 9 · WhatsApp: agente, material, embudo «precio primero» y confirmación

Pide antes `sl_como_trabajar {tarea: "flujo de WhatsApp de venta de un producto nuevo"}`: trae las reglas del módulo de chat. Este paso deja cinco cosas: **el vínculo del producto con el agente, el material, el embudo publicado, la confirmación cableada y las simulaciones.**

## 1. Leer antes de tocar
- `chat_proyectos_ver {}`: el proyecto (el número) que va a vender. Anota su `proyecto_id`.
- `chat_salud_ver {proyecto_id}`: que el canal esté activo. Sin canal no hay nada que arreglar: el usuario conecta el número primero.
- `chat_agente_productos_ver {proyecto_id}`: los productos que ya atiende ese número y sus palabras clave (para no chocar).
- `chat_flujos_ver {proyecto_id}`: los flujos que existen. ¿Hay uno viejo de este producto? ¿Hay uno de venta del usuario que convenga duplicar?
- `crm_etiquetas_permitidas_ver {proyecto_id}`: las etiquetas que el agente puede poner.

## 2. El vínculo del producto con el agente
Sin este vínculo, el producto es invisible para el chat.
1. `chat_agente_producto_agregar {proyecto_id, producto_id, activador_keywords: [...]}` → devuelve `link_id` (anótalo).
   - `activador_keywords`: como las escribe el cliente, con y sin tildes y con errores de tipeo: el nombre fácil, la marca, lo que es («faja», «fajas», «faja reductora») y una palabra de cada texto prellenado de los anuncios (paso 10). **No pueden chocar** con las de otro producto del mismo número.
   - Sin `recordatorio_*`: los seguimientos van en el embudo.
2. `chat_agente_producto_editar {link_id, activo: true, remarketing_activo: false, batching_delay_seconds: 10, max_chars_bloque: 200}`.
   - `mostrar_escribiendo: true` solo después de avisarle al usuario: también enciende el doble check azul.
   - `meta_ad_ids` se carga al final, cuando la campaña esté publicada (paso 11).

## 3. El material
Todo se hace en la PC o con la app y se sube a la biblioteca del producto (`media_subida_url` → PUT → `media_subida_confirmar`, ver [editor.md](editor.md) › «Subir»). En los nodos va la URL de la biblioteca.

- **Video demo (6 a 15 s), con `VideoDemo` en la PC:**
  - Clips REALES del producto: cómo se usa y el antes y después de la misma persona. Salen de la biblioteca del producto (paso 3) y de los anuncios del mismo producto.
  - Voz en off corta (dolor → solución → regalo → «pagas al recibir»), subtítulos y los rótulos «ANTES» y «DESPUÉS».
  - **Nunca una persona generada con IA.**
- **Foto real en la mano:** con `anuncios_generar` (cobra): la foto real del producto (rol `producto`) más una escena de una casa de clase media del país (un baño o una cocina sencillos, nunca de lujo). El producto de tamaño real y fiel a la etiqueta.
- **Imagen de la promoción, con `PromoOferta` en la PC:** una fila por paquete con el producto real repetido, el precio de Projection y «Ahorras …»; el de 2 marcado «LA MÁS PEDIDA»; los regalos marcados «GRATIS». El producto recortado: si su foto tiene fondo blanco liso, `store_imagen_quitar_fondo` lo recorta.
- **Los audios A1 a A9 y A11** (tabla abajo): una sola voz por chat, con el acento del país y el género de quien compra. Los graba el usuario con el celular en un cuarto callado, o salen de su cuenta de ElevenLabs con `scripts/voz.mjs`. **Se suben como estén:** la app los convierte a nota de voz.

## 4. El embudo de venta
Tres caminos, en este orden:
1. **Si `sl_como_trabajar` nombra una tool que crea el embudo de venta de fábrica,** úsala y adapta textos, material y precios.
2. **Si el usuario ya tiene un embudo de venta que vende en la misma categoría y país:** `chat_flujo_duplicar {flujo_id, nombre}` y adapta todo con `chat_flujo_texto_reemplazar {flujo_id, reemplazos: [{buscar, poner}]}` y `chat_flujo_nodo_editar {flujo_id, nodo_id, data}` (los dos escriben en el borrador).
3. **Si no hay ninguno: la plantilla** (el modelo que más vendió, validado con el validador de la app). [flujo-plantilla.md](flujo-plantilla.md) explica cada nodo y cada marcador `[[…]]`; [flujo-grafo.md](flujo-grafo.md) trae el grafo. Reemplaza cada marcador con lo de este producto y guárdalo como dice «Cómo guardarlo»:
   - `chat_flujo_guardar {proyecto_id, nombre: "<producto> · precio primero", trigger, grafo, producto_link_id: <link_id>}` (el `trigger` y lo demás, como dice la plantilla).
   - Mira el `chequeo` de la respuesta: `dejan_al_cliente_sin_atender` se conecta; `cierran_el_flujo_a_proposito` está bien así.

**Regla dura:** la confirmación del pedido NUNCA va dentro del embudo (ver 5).

Después, sea cual sea el camino:
- `chat_flujo_validar {flujo_id}` hasta `publicable: true`.
- Si un nodo pone etiquetas que no están en `crm_etiquetas_permitidas_ver`, el agente las descarta: quítalas del nodo o pregúntale al usuario si las agrega.
- `chat_flujo_publicar {flujo_id}`.
- **Si había un embudo viejo de este producto publicado,** `chat_flujo_estado {flujo_id: <el viejo>, estado: "pausado"}`.

## 5. La confirmación del pedido
Es otro flujo, aparte. **No se arma nodo por nodo:**
1. `chat_flujo_pedido_crear {proyecto_id, producto_link_id, con_credito: false}`: arma la confirmación completa en borrador. Sin crédito es lo de fábrica; solo si el usuario vende a crédito propio, `con_credito: true`.
2. `chat_flujo_texto_reemplazar` para el trato (tú o usted) y el nombre de la tienda.
3. Que después de una cancelación automática haya un aviso al dueño por WhatsApp con el producto, el total, el cliente y el teléfono (ver [flujo-plantilla.md](flujo-plantilla.md) › «La confirmación»).
4. `chat_flujo_confirmacion_asignar {flujo_venta_id: <embudo>, confirmacion_flujo_id: <confirmación>}`: tienen que ser del mismo producto.
5. `chat_flujo_validar` y `chat_flujo_publicar` de la confirmación.

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
1. La imagen de la promoción nueva (`PromoOferta`), subida a la biblioteca.
2. `chat_flujo_nodo_editar` del nodo de bienvenida con la imagen nueva.
3. `chat_flujo_texto_reemplazar` de los botones.
4. Regrabar A5 (dice los precios) y A1 si mencionaba la oferta. Validar y publicar.

## Cierre del paso
Marca las casillas del paso 9 en LANZAMIENTO.md con los nombres del embudo y de la confirmación, el `link_id` y el resultado de las simulaciones.
