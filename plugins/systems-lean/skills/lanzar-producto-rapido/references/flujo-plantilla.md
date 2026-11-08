# Plantilla del embudo «precio primero»

Es el embudo de WhatsApp que mejor vendió, listo para copiar: 33 nodos y 70 conexiones. Úsalo cuando la cuenta no tiene un embudo de fábrica ni otro flujo que duplicar (paso 3 de [whatsapp.md](whatsapp.md)). No lo armes desde cero: copia el JSON de abajo, cambia lo que va entre corchetes dobles y guárdalo.

- **Lo que va así `[[ASÍ]]`** es tuyo: textos del producto, botones y enlaces del material. Cámbialo todo antes de guardar.
- **Lo que va así `{{asi}}`** es una variable de la app: no la toques. Los precios salen de Projection y el nombre de la marca, de la marca.
- **Los ids de los nodos y de los botones** (`n_agente`, `b1`…) no se cambian: las conexiones dependen de ellos.
- **El trato es de usted.** Si el país va de tú, mira «Trato de tú» más abajo.

## Qué hace
1. **Entrada** (`n_entrada`):
   - si ya conversó o responde a una plantilla, ve la imagen de la promoción y le contesta el agente;
   - si pregunta el precio, recibe el precio primero;
   - si escribió su propia pregunta, ve la imagen y le contesta el agente;
   - todo lo demás, precio primero.
2. **Precio primero** (`m_bienvenida`): imagen de la promoción, foto real, audio A1 y un texto con 3 botones (1, 2 o 3 unidades).
3. **Si no toca nada:** a los 4 min, «¿Pudo ver la promoción?» con los botones; a la hora, el audio A9 con los botones.
4. **Si toca un botón:** se guarda la cantidad, se marca contra entrega y se le piden 3 datos con el audio A2. Si en 10 min no los manda, se le recuerda que solo falta la dirección.
5. **Si escribe** (en vez de tocar un botón): el agente de venta (`n_agente`) contesta. Cuando su duda la contesta un audio grabado, sale por esa pieza y vuelve a los botones o a pedir datos.
6. **Con los datos:** el agente de pedido (`n4_pedido`) registra el pedido con `registrar_pedido`. Desde ahí sigue el flujo de confirmación, que es otro flujo.
7. **Si hoy no tiene dinero:** el agente de reserva (`n3_reserva`) se lo aparta para la fecha que diga, agenda el aviso dos días antes y le avisa al dueño.

Todos los mensajes salen dentro de las 24 h: el embudo no necesita plantillas de Meta.

## Qué cambias en cada nodo

| Nodo | Qué es | Qué cambias |
|---|---|---|
| `n_entrada` | Condición de entrada (4 caminos) | Nada. Opcional: ramas por anuncio o por landing (abajo) |
| `m_bienvenida` | Imagen de la promoción, foto real, A1 y texto con 3 botones; espera 4 min | Enlaces, `[[FRASE_PRODUCTO]]`, `[[LINEA_ENVIO]]` y los 3 botones |
| `m_bienvenida_pp` | Imagen y foto sin audio ni botones; después contesta el agente | Enlaces y las 2 líneas |
| `s_4min` | «¿Pudo ver la promoción? 👆» con los botones; espera 56 min más | Los 3 botones |
| `s_1h` | Audio A9 con los botones | Enlace de A9 y los botones |
| `m_vuelta_promo` | Los botones otra vez | Los 3 botones |
| `x_c1`, `x_c2`, `x_c3`, `x_c1b`, `x_compra` | Guardan la cantidad y marcan contra entrega | Nada |
| `m_datos` | Audio A2 y los 3 datos | Enlace de A2 |
| `w_datos` | Espera 10 min; se corta si el cliente escribe | Nada |
| `s_10min` | «Ya tengo su pedido apartado…» | Nada (opcional: el audio A10 antes del texto) |
| `m_vuelta_datos` | Vuelve a pedir los datos después de una pieza | Nada |
| `n_agente` | Agente de venta | Los marcadores del contexto y del objetivo |
| `n4_pedido` | Agente que toma los datos y registra el pedido | Los marcadores |
| `n3_reserva` | Agente que aparta para otra fecha | Los marcadores |
| `p_a3` a `p_a8` | Piezas: un audio cada una (`p_a4` lleva también la foto real) | Enlaces de A3 a A8 |
| `p_a7_dias`, `p_a7_ciudad` | Plazo a su ciudad, o le pregunta la ciudad | `[[PLAZO_ENTREGA]]` |
| `p_foto` | Video demo y foto real | Enlaces |
| `p_regalo` | Imagen y texto del regalo | Enlace y `[[TEXTO_REGALO]]`, o quítalo (abajo) |
| `c_fase`, `c_ag`, `c_a7` | Condiciones internas | Nada |
| `n_avisar` | Aviso al dueño: cliente de audio y ningún audio le sirve | `[[NOMBRE_CORTO]]` |
| `n_aviso_reserva` | Aviso al dueño: reserva nueva | `[[NOMBRE_PRODUCTO]]` |

`p_a3`, `p_a5` y `p_a7` son solo un audio. Sin su enlace, el mensaje queda vacío y el validador da error.

## Los marcadores

| Marcador | Qué va | De dónde sale |
|---|---|---|
| `[[NOMBRE_PRODUCTO]]` | Nombre fácil: qué es y la marca, ej. «la faja moldeadora (Marca X)» | Ficha del producto; el mismo de `display_nombre_override` del vínculo con el agente |
| `[[NOMBRE_CORTO]]` | Cómo se le dice después, ej. «la faja» | Ficha del producto |
| `[[UNIDAD]]`, `[[UNIDADES]]` | Singular y plural, ej. «frasco» y «frascos», «par» y «pares» | El producto |
| `[[FRASE_PRODUCTO]]` | Primera línea de la bienvenida: qué es y para qué, en una línea | Estrategia y ángulos (`product_ver_estrategia`) |
| `[[LINEA_ENVIO]]` | Segunda línea, ej. «🚚 Envío gratis · Paga al recibir». Urgencia («quedan pocas») solo si es verdad | Oferta de Projection |
| `[[BOTON_1]]`, `[[BOTON_2]]`, `[[BOTON_3]]` | El paquete y su precio, ej. «1 unidad · $99.900», «2 por $149.900». Máximo 20 caracteres, contando espacios | Precios de Projection (los mismos de `{{precio_1x}}`, `{{precio_2x}}` y `{{precio_3x}}`) |
| `[[PAIS]]`, `[[MONEDA]]` | País de venta y moneda, ej. «Colombia», «pesos colombianos» | La marca |
| `[[ENVIO]]` | «Envío gratis» o lo que cobre la oferta | Escenario de Projection. Si cobra flete, no prometas envío gratis |
| `[[OTRAS_FORMAS_PAGO]]` | Ej. «Tarjeta, por ahora no» | Pagos y Entrega de la marca |
| `[[REGALO]]` | Regla para el agente, ej. «Con 2 o 3 va de regalo la guía digital X; con 1, no.». Sin regalo: «Sin regalo.» | Oferta de Projection |
| `[[TEXTO_REGALO]]` | Lo que lee el cliente, ej. «Con 2 o 3 le regalamos la guía X. Le llega en PDF a su WhatsApp.» | Oferta de Projection |
| `[[RESULTADO_QUE_BUSCA]]` | Para qué lo compra, ej. «afinar la cintura» | Ficha y ángulos |
| `[[COMO_SE_NOTA_EL_RESULTADO]]` | Una o dos frases de cómo se nota, dichas con seguridad | Ficha y ángulos |
| `[[LO_QUE_NO_SE_PROMETE]]` | Lo único que no se promete, ej. «bajar de talla en una semana» | Ficha del producto |
| `[[RESPUESTA_ORIGINAL]]` | Por qué es original: marca, tamaño, cómo llega | Ficha del producto |
| `[[MODO_DE_USO]]` | Cómo se usa, en una línea | Ficha del producto |
| `[[PLAZO_ENTREGA]]` | Plazo general, ej. «de 1 a 5 días hábiles» | Tiempos de entrega del producto |
| `[[ZONAS_SIN_ENTREGA]]` | Zonas a las que no llega, o «ninguna» | Cobertura de la transportadora |
| `[[URL_IMAGEN_PROMO]]` | Imagen de las 3 promociones | Biblioteca de medios (ver «El material» en [whatsapp.md](whatsapp.md)) |
| `[[URL_FOTO_EN_MANO]]` | Foto real del producto (en la mano o en su caja) | Biblioteca de medios |
| `[[URL_VIDEO_DEMO]]` | Video demo de 6 a 15 s | Biblioteca de medios |
| `[[URL_IMAGEN_REGALO]]` | Imagen del regalo | Biblioteca de medios |
| `[[URL_AUDIO_A1]]` a `[[URL_AUDIO_A9]]` | Los audios (tabla de abajo) | Biblioteca de medios |

Todos los enlaces son de la biblioteca de la cuenta: se sube con `media_subir` (con `producto_id`) y se copia la URL que devuelve. Nunca un enlace externo.

### Los audios del embudo

| Audio | Nodo | Qué dice |
|---|---|---|
| A1 | `m_bienvenida` | Qué es, para qué sirve, que el de 2 es el que más se llevan y que paga al recibir |
| A2 | `m_datos` | Qué datos necesita para mandárselo; puede mandarlos en audio |
| A3 | `p_a3` | Cómo funciona y cómo se usa; termina preguntando cuál le prepara |
| A4 | `p_a4` | Que es original y qué le llega, tal cual la foto |
| A5 | `p_a5` | Los precios de las 3 promociones; pregunta si se lo prepara |
| A6 | `p_a6` | Que se lo aparta para el día que diga |
| A7 | `p_a7` | Cómo y cuándo le llega, y que paga al recibir |
| A8 | `p_a8` | Que puede llevar solo uno, y le pide los datos |
| A9 | `s_1h` | Recordatorio amable a la hora, sin presión |

A10 no se usa en el modelo (el recordatorio de los 10 min es texto). A11 va en la confirmación, no aquí.

### Las variables de la app
- **Precios:** `{{precio_1x}}`, `{{precio_2x}}` y `{{precio_3x}}` salen del escenario del flujo o de la oferta principal de Projection. Sin el paquete de 3 en la oferta, `{{precio_3x}}` queda vacío.
- **Transferencia:** `{{descuento_transferencia_pct}}` y `{{precio_transferencia_1x}}` a `3x` salen del % de Pagos y Entrega. Si no das descuento por transferencia, borra esa frase en `n_agente` y en `n4_pedido`.
- **Las demás** (`{{ciudad_cliente}}`, `{{dias_ciudad}}`, `{{fecha_reserva}}`, `{{paquete}}`, `{{nombre}}`, `{{ciudad}}`, `{{direccion}}`) las llena el agente durante la conversación.

## Lo que no se toca en los agentes
Son las reglas que hacen que venda. Cambia solo los marcadores.
- **Compra hoy o reserva:** sin dinero hoy, se aparta; nunca se manda igual. A 4 días o menos es compra con la nota «Entregar el <día y fecha>»; a 5 o más, reserva.
- **Las fechas las calcula el agente.** No propone fechas que el cliente no insinuó ni le hace elegir entre dos.
- **Datos suficientes:** con nombre y dirección registra el pedido en ese mismo turno. No pide la referencia si ya se entiende dónde queda.
- **No pasa a una persona por una duda.** Solo si el cliente está muy enojado. Pedir audio, fotos o preguntar si es original no es motivo.
- **Solo los precios de este producto.** De otros productos, sin precios.
- **Sale por intención:** cada salida tiene su descripción con ejemplos. Cuando sale por una pieza, su texto es solo «Mire 👇».
- **No confirma:** nunca «¿confirma que todo está correcto?». La confirmación la manda el otro flujo.

## Trato de tú
Si el país va de tú, cámbialo en el JSON antes de guardar:
1. **El bloque de trato de los 3 agentes:** reemplaza el que empieza por «*TRATO» por este: «*TRATO — MANDA SOBRE TODO:* siempre de tú («te», «tu»), aunque el cliente trate de usted; nunca vos. No le pongas ningún apodo ni tratamiento («amigo», «amiga», «linda», «jefe»): háblale directo.»
2. **Los objetivos y las descripciones:** «De usted» pasa a «De tú».
3. **Los ejemplos entre comillas:** «Mire 👇» → «Mira 👇», «¿Cuál le preparo?» → «¿Cuál te preparo?», «Quedó anotada su petición» → «Quedó anotada tu petición», «Solo me falta su dirección» → «Solo me falta tu dirección», «Listo, se lo dejo apartado…» → «Listo, te lo dejo apartado…».
4. **Los textos de los mensajes**, ej. «¿Cuál promoción le envío? 👇» → «¿Cuál promoción te envío? 👇» y «¿Pudo ver la promoción? 👆» → «¿Pudiste ver la promoción? 👆».

Graba los audios con el mismo trato.

## Opcional
- **Sin regalo:**
  - borra el nodo `p_regalo`, la salida `regalo` de `n_agente` y las conexiones `e42` y `e58`;
  - pon «Sin regalo.» en `[[REGALO]]`.
- **También vendes por landing:**
  - agrega a la rama `r_sin_bienvenida` de `n_entrada` la regla `{"campo": "viene_de_landing", "op": "eq", "valor": "si"}`;
  - así quien ya vio los precios en la landing no los recibe otra vez.
- **Una rama por anuncio o por texto prellenado:** el modelo no las tiene, porque todo el que llega de un anuncio cae en precio primero por la rama «si no». Agrégalas solo si quieres que alguien que llega de un anuncio reciba la bienvenida completa aunque escriba su propia pregunta:
  - ponla en `n_entrada` antes de `r_pregunta`, conectada a `m_bienvenida`;
  - por anuncio: `{"id": "r_anuncio_1", "nombre": "Viene del anuncio del ángulo 1", "combinar": "or", "reglas": [{"campo": "anuncio_id", "op": "eq", "valor": "[[ID_ANUNCIO_1]]"}]}`;
  - por texto prellenado: `{"campo": "primer_mensaje", "op": "contains", "valor": "[[TEXTO_PRELLENADO_ANGULO_1]]"}`.
  - Los ids de los anuncios salen al publicar la campaña (`ads_ver_testeo`) y se cargan con `chat_flujo_nodo_editar`. Una condición admite hasta 9 ramas.

## El grafo del embudo
Está en [flujo-grafo.md](flujo-grafo.md) (pídelo aparte si la skill te llegó por el conector: `sl_como_trabajar {tarea: "lanzar-producto-rapido references/flujo-grafo.md"}`). Arma el grafo con los marcadores reemplazados y sigue con «Cómo guardarlo».

## Cómo guardarlo
1. **Antes:**
   - el producto ya está vinculado al agente: `chat_agente_productos_ver` da su `producto_link_id`;
   - Projection tiene los 3 paquetes;
   - el material ya está en la biblioteca.
2. **`chat_flujos_ver {proyecto_id}`:** mira los flujos del proyecto para no pisar nada. Si el producto ya tiene un embudo publicado, decide con el usuario cuál queda: gana el de mayor `prioridad`, y para probar los dos se usa `ab_grupo`.
3. **Reemplaza los marcadores** y busca `[[` en el JSON: tiene que dar 0. El validador no avisa de un marcador olvidado en un enlace, y el cliente recibiría un archivo roto.
4. **`chat_flujo_guardar`**, con `proyecto_id`, `nombre` (ej. «<producto> · precio primero»), `trigger` `{"tipo": "entrante", "producto_link_id": <id>}`, el mismo `producto_link_id` y el `grafo`:
   - devuelve el `flujo_id`;
   - mira el `chequeo` de la respuesta;
   - si el producto tiene otros embudos, manda también `prioridad`: el modelo usa 20.
5. **Guárdalo otra vez con `flujo_id` si hace falta.** Al crear, la app ignora `escenario_id`, `ficha_producto`, `ab_grupo` y `ab_peso`: solo los toma al editar. Si el flujo vende un escenario de oferta, o necesita su propia ficha o una prueba A/B, manda esos campos en una segunda llamada `chat_flujo_guardar {flujo_id, …}`.
6. **`chat_flujo_validar {flujo_id}`:** tiene que dar `publicable: true`.
   - **Notas normales**, que no hay que arreglar: «El flujo termina acá» en `n_aviso_reserva`, y «Cierran el flujo a propósito» en los 3 agentes.
   - **Si sale algo en `advertencias`** (en el chequeo del guardado se llama `dejan_al_cliente_sin_atender`): conéctalo. Casi siempre es una salida que quedó suelta al borrar un nodo, ej. el regalo.
   - **El error más común:** un botón de más de 20 caracteres. Con precios de 6 cifras, usa «2 por $149.900» en vez de «2 unidades · $149.900».
7. **Arma y publica la confirmación** (siguiente sección).
8. **`chat_flujo_publicar {flujo_id}`:** si devuelve `avisos_oferta`, el agente dice otro precio que la oferta. Corrígelo y vuelve a publicar.
9. **`chat_flujo_confirmacion_asignar`** con el embudo y su confirmación (siguiente sección).
10. **`chat_flujos_ver {proyecto_id, flujo_id}`:** el embudo en `publicado` y su `confirmacion_flow_id` lleno. Después, `chat_ab_verificar {proyecto_id}` (variables vacías, cifras a mano, envío gratis que la oferta no da) y `chat_simular` con «cuánto vale», «quiero solo uno» y «no tengo plata hasta la quincena».

## La confirmación
No se arma a mano. La crea la app ya conectada, y después se ajusta a este modelo.

1. **`chat_flujo_pedido_crear {proyecto_id, producto_link_id, con_credito: false}`:**
   - `con_credito: false` es lo de fábrica (contra entrega); `true` solo si el usuario vende a crédito propio;
   - nace en borrador, con 9 nodos;
   - si el producto ya tiene su confirmación, te la devuelve con `ya_existia: true` y no crea otra.
2. **`chat_flujos_ver {proyecto_id, flujo_id}`:** copia los ids de los nodos. Los pone la app y cambian en cada cuenta.
3. **Trato y marca:** `chat_flujo_texto_reemplazar` en el resumen, el recordatorio, el «Pedido confirmado», el aviso de cancelación y el agente. Copia el texto exacto de `chat_flujos_ver`. Los textos de los pasos 4 a 7 son de usted: en un país de tú, pásalos a tú.
4. **El resumen con el chat abierto** (el mensaje de sesión con 3 botones): `chat_flujo_nodo_editar` con este `data` y `conexiones_quitar: [{"salida": "cancelar"}]` en la misma llamada. Sin quitar esa conexión, el validador da error por una rama que ya no existe.
   ```json
   {"bloques": [{"tipo": "texto", "texto": "Su pedido 📋\n📦 {{pedido_producto}}\n💵 Total: {{pedido_total}}, paga al recibir\n👤 {{pedido_cliente}}\n📍 {{pedido_direccion}}\n{{pedido_linea_entrega}}\n\n¿Se lo enviamos?"}],
    "cierre": {"tipo": "botones", "botones": [{"id": "confirmar", "titulo": "✅ Sí, envíelo"}, {"id": "corregir", "titulo": "Corregir datos"}], "timeout_min": 720}}
   ```
5. **El recordatorio** (el nodo de `confirmaciones_recordatorio_1`): su texto de sesión, de usted, y el botón «✅ Sí, envíelo»:
   ```json
   {"bloques": [{"tipo": "texto", "texto": "Hola {{pedido_cliente}} 👋\nTodavía no recibimos su confirmación del pedido de {{pedido_producto}} por {{pedido_total}}. Si no lo confirma en las próximas 12 horas, lo cancelamos y no sale a despacho. ¿Se lo enviamos?"}],
    "cierre": {"tipo": "botones", "botones": [{"id": "confirmar", "titulo": "✅ Sí, envíelo"}, {"id": "cancelar", "titulo": "Cancelar"}], "timeout_min": 720}}
   ```
6. **«Pedido confirmado»:** el audio A11 y un resumen corto.
   ```json
   {"bloques": [{"tipo": "media", "media": "audio", "url": "[[URL_AUDIO_A11]]", "caption": ""}, {"tipo": "pausa", "segundos": 1},
     {"tipo": "texto", "texto": "✅ Pedido confirmado\n📦 {{pedido_producto}}\n💵 {{pedido_total}}, paga al recibir\n📍 {{pedido_direccion}}\nLe avisamos por aquí cuando salga en camino 🙌"}]}
   ```
7. **La cancelación por silencio** (la acción que solo cancela): agrégale el aviso al dueño.
   ```json
   {"acciones": [{"tipo": "pedido", "accion": "cancelar"},
     {"tipo": "notificar", "canal": "whatsapp", "mensaje": "Pedido cancelado automáticamente porque el cliente no confirmó ([[NOMBRE_PRODUCTO]]). Revisa en el CRM si se puede recuperar.\nProducto: {{pedido_producto}}\nTotal: {{pedido_total}}\nCliente: {{pedido_cliente}}\nTeléfono: {{pedido_telefono}}"}]}
   ```
   El aviso llega al canal de avisos de la marca (Telegram o la app), no a un teléfono escrito en el flujo. Si la marca tiene apagado el aviso de traspaso a una persona, no llega.
8. **El agente de la confirmación** (`chat_flujo_nodo_editar` con su `objetivo` y su `contexto`): que no vuelva a vender ni a pedir datos que ya están, que corrija con `registrar_pedido` y muestre cómo quedó, y que nunca ofrezca cancelar («si él lo pide, pregúntele una vez qué pasó»). El objetivo es que quede confirmado.
9. **`chat_flujo_validar`** (`publicable: true`) y **`chat_flujo_publicar`**.
10. **`chat_flujo_confirmacion_asignar {flujo_venta_id, confirmacion_flujo_id}`:** el embudo y esta confirmación. La confirmación tiene que estar publicada para que el cable funcione.

### Lo que hace la confirmación del modelo

| Cuándo | Qué recibe el cliente | Qué sigue |
|---|---|---|
| Nace el pedido, con el chat abierto (24 h) | Resumen: producto, total «paga al recibir», nombre, dirección y plazo; botones «✅ Sí, envíelo» y «Corregir datos» | Sin respuesta en 12 h, el recordatorio |
| Nace el pedido, con el chat cerrado | Plantilla `confirmacion_con_entrega`, con Confirmar y Cancelar | Sin respuesta en 12 h, el recordatorio |
| Recordatorio, a las 12 h | Avisa que si no confirma en 12 h se cancela. Con el chat abierto sale como mensaje normal; con el chat cerrado, como plantilla | Sin respuesta en 12 h más, se cancela y se avisa al dueño con producto, total, cliente y teléfono |
| Confirma | Audio A11 y «✅ Pedido confirmado» con el resumen corto | Fin |
| Cancela con el botón | Nada; se cancela el pedido | Se avisa al dueño |
| Escribe otra cosa o toca «Corregir datos» | Le contesta el agente con los datos del pedido; si corrige, le vuelve a mostrar el resumen | Si confirma o cancela con palabras, igual que con los botones. Si deja de contestar, el flujo termina ahí y no sale el recordatorio |

### Plantillas de Meta que necesita
- **`confirmacion_con_entrega`**, y `confirmacion_con_entrega_usted` en los países de usted (si la de usted no está aprobada en ese número, sale la de tú).
- **`confirmaciones_recordatorio_1`**: solo existe de tú. Con el chat cerrado sale de tú; con el chat abierto sale el texto de usted del paso 5.
- **Cómo se crean:** con `chat_plantillas_catalogo` (crear), con el OK del usuario, en cada número de WhatsApp. Su estado se mira con `chat_plantillas_ver` y, si siguen en revisión, con `chat_plantillas_sincronizar`.
