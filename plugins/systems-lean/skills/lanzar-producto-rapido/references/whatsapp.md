# Flujo de WhatsApp: precio primero

Pide `sl_como_trabajar` con «flujo de WhatsApp de venta de un producto nuevo» antes de tocar nada: ahí están las tools del módulo y sus reglas.

## Cómo se arma
1. **Si el conector tiene una tool que crea el embudo de venta de fábrica** (`sl_como_trabajar` lo dice), úsala y adapta los textos.
2. **Si la cuenta ya tiene un flujo de venta que vende en la misma categoría y país,** `chat_flujo_duplicar` y se adapta entero: textos, fotos, audios y precios.
3. **Si no hay ninguno de los dos,** se arma con `chat_flujo_guardar` siguiendo la estructura de abajo, se valida con `chat_flujo_validar` y se corrige hasta que pase.

La confirmación del pedido es otro flujo, aparte del embudo: `chat_flujo_pedido_crear` (pregúntale al usuario si vende a crédito; casi siempre no).

## Lo que ve el cliente
**Llega:** video demo, foto real en la mano, imagen de la promoción, audio A1 y un texto con 3 botones con precio, en ese orden.
- Texto: qué es el producto y para qué en una línea; el regalo con 2 o 3, si lo hay; «🚚 Envío gratis · Pagas al recibir»; «¿Cuál promoción te envío? 👇».
- Botones: «1 frasco · $…», «2 frascos · $…», «3 frascos · $…». WhatsApp deja hasta 20 caracteres por botón. Los precios salen de Projection.
- **Toca un botón:** audio A2 y un solo mensaje que pide los datos: nombre, teléfono y dirección con barrio y ciudad. Se aceptan en audio.
- **El de 2 se ofrece una sola vez y antes de que elija.** Si elige 1, se le vende el de 1 sin ofrecerle otro paquete.
- **Pago:** contra entrega. Nunca se promete «no pagas nada antes» si el usuario pide anticipo a algunos clientes.

## La entrada (el primer nodo), en este orden
1. Viene de la landing, responde a una plantilla o ya conversó → directo al agente.
2. Su primer mensaje pregunta el precio («precio», «cuánto», «cuesta», «valor») → precio primero.
3. **Viene de un anuncio:** una rama por ángulo con `anuncio_id` (op `eq`, una regla por anuncio) → precio primero. Quien llega de un anuncio nunca va directo al agente en su primer mensaje: recibe primero el video y la foto.
4. El texto prellenado de cada ángulo → precio primero.
5. Escribió su propia pregunta → la imagen de la promoción y la foto, y después contesta el agente.
6. Lo demás → precio primero.

### Ids de los anuncios
Salen después de publicar la campaña (`ads_ver_testeo`).
- Se cargan en la entrada con `chat_flujo_nodo_editar`.
- Luego `chat_flujo_validar` y `chat_flujo_publicar`.
- Los mismos ids van en el vínculo del producto con el agente: `chat_agente_producto_editar {meta_ad_ids}`, que reemplaza la lista entera.

## El material
- **Video demo (6 a 15 s), hecho en la PC con `VideoDemo`:**
  - Clips REALES del producto: cómo se aplica y el antes y después de la misma persona.
  - Fuentes, en orden: Creativos de Inspiración del producto, TikTok y los anuncios del mismo producto.
  - Lleva una voz en off corta (dolor → solución → regalo → «pagas al recibir») con subtítulos, y los rótulos «ANTES» y «DESPUÉS».
  - **Nunca una persona generada con IA.**
- **Foto real en la mano:**
  - Con `anuncios_generar`: la foto real del producto más una escena de referencia de una casa de clase media del país (un baño o una cocina sencillos, nunca de lujo).
  - El producto, de tamaño real en la mano y fiel a la etiqueta.
- **Imagen de la promoción, hecha en la PC con `PromoOferta`:**
  - Una fila por paquete con el producto real repetido, el precio y «Ahorras …»; el de 2, marcado «LA MÁS PEDIDA».
  - Los regalos van marcados «GRATIS».
  - El producto va recortado: si su foto tiene fondo blanco liso, `store_imagen_quitar_fondo` lo recorta.

## Los audios
- **Una sola voz por chat:** con el acento del país y el género de quien compra.
  - O los graba el usuario con el celular en un cuarto callado.
  - O salen de su cuenta de ElevenLabs con `scripts/voz.mjs`.
- **Trato:** de usted en Honduras y de tú en los demás países.
- **Sin precios dichos:** el precio está en la imagen y en los botones.
- Antes de usarlos, se revisan: que se entienda la marca y que no tengan muletillas.

| Audio | Qué dice |
|---|---|
| A1 · bienvenida | Qué es, para qué sirve y que el de 2 es la promoción que más se llevan; pagas al recibir |
| A2 · pedir datos | Qué datos necesita para mandárselo; puede mandarlos en audio |
| A3 · funciona y uso | Cómo funciona, en cuánto tiempo se ven resultados y cómo se usa |
| A4 · confianza | Qué le llega exactamente (tal cual la foto) y que lo revisa antes de pagar |
| A5 · precio | Por qué vale lo que cuesta, sin decir montos |
| A6 · apartar | Que se lo aparta para el día que diga |
| A7 · entrega | Cuánto tarda en llegar y cómo se paga |
| A8 · solo uno | Que puede llevar solo uno, con envío gratis y pago al recibir |
| A9 · seguimiento | Recordatorio amable a la hora, sin presión |
| A10 · faltan datos | Que solo faltan sus datos (puede ir en texto) |
| A11 · pedido confirmado | Gracias; su pedido va en camino y le avisan |

**Audio o texto:** en la primera duda u objeción real (funciona, confianza, precio, «está caro», duda entre 1 y 2) el agente responde con el audio que toca más una línea de texto. Si el cliente se despide sin comprar y no recibió audio, va uno antes de despedirse. Máximo 2 o 3 audios por chat, nunca el mismo dos veces.

## Seguimientos por silencio
Cada uno sale una sola vez, se cancela si el cliente escribe y no sale fuera de la ventana de 24 h.

| Cuándo | Qué sale |
|---|---|
| 4 min sin tocar un botón | «¿Pudiste ver la promoción? 👆» con los 3 botones |
| 1 h | Audio A9 con los 3 botones |
| Eligió y a los 10 min no mandó los datos | «Ya tengo tu pedido separado 🙌 Solo me faltan tus datos: nombre, teléfono y dirección. Puedes mandarlos en audio o escritos 🎤» |

## La confirmación
Un solo resumen del pedido (producto, total, pagas al recibir, nombre y dirección) con los botones «✅ Sí, envíalo» y «Corregir datos». Al confirmar sale el audio A11.

## Antes de publicar
- `product_guardar_ficha` y `product_guardar_estrategia` (los ángulos).
- El vínculo con el agente: palabras clave que no choquen con otros productos y remarketing apagado.
- **Nombre fácil del producto:** primero qué es y después la marca («la faja moldeadora X»). Es el que usan los recordatorios y las llamadas.
- `chat_flujo_validar`, `chat_flujo_publicar` y `chat_simular` con cada texto prellenado y con «quiero solo uno».
