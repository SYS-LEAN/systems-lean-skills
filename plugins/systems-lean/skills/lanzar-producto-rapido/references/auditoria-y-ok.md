# Paso 13 · Auditoría, OK del usuario y publicación

## 1. La auditoría (antes de pedir el OK)
Lee cada módulo **con su tool de lectura**, no de memoria ni de LANZAMIENTO.md. Cada fila queda en verde, o en rojo con el porqué dicho al usuario.

| Módulo | Lectura | Verde si… |
|---|---|---|
| Lista de Testeo | `product_favoritos_ver {marca_id}` | La fila del producto tiene `producto_investigado_id` |
| Alta y vínculo | `product_ver_investigacion {producto_id}`, `dropi_productos_vinculados {}` y `anuncios_ver_productos {}` | `fila_de_origen` y viabilidad; vínculo con Dropi o Soydrop; hasta 3 fotos limpias |
| Investigación del usuario | `product_ver_extraccion {producto_id}` | Lo que capturó, por nodo (o el límite dicho en el informe) |
| Informe | `product_ver_informe {producto_id}` | `evidencia_origen` y números; 5 ángulos, 3 ofertas, competidores con precio y días, destino, formato, nivel de conciencia, creencias con fuente y dolores |
| Ficha, entrega, cobertura | `product_ver_ficha {producto_id}` | Ficha con variables `{{…}}` y sin cifras; sección 4 corta; preguntas que no cierran todas pidiendo datos; entrega propia; cobertura con las zonas excluidas |
| Projection | `projection_ver_simulador`, `projection_ver_ofertas` y `projection_escenarios_ver` (id del simulador) | Moneda del país; costo, flete, cobro, 5/30 %; paquetes con `share_pct`; las ofertas elegidas; los escenarios pedidos |
| Ángulos | `anuncios_ver_angulos_venta {producto_id}` | 3 a 5 ángulos con problemas, objeciones y deseos |
| Biblioteca | `anuncios_ver_biblioteca_creativos {producto_id}`, `media_listar {producto_id}` y `anuncios_ver_generados {producto_id}` | Fotos del proveedor y referencias con su descripción; por ángulo 1 video y 1 imagen terminados; 6 de reserva |
| Landing (si hay) | `landing_ver {lote_id}` | Atada a su escenario, checkout del país, tracking de la marca, publicada |
| WhatsApp | `chat_agente_productos_ver {proyecto_id}`, `chat_flujos_ver {proyecto_id}` y `chat_simular` | Producto activo con keywords; embudo con su escenario y confirmación `publicado`; el viejo `pausado`; la simulación con la moneda del país y sin variables vacías |
| Campaña | `ads_ver_testeo {producto_id}` | Un conjunto por ángulo, 2 anuncios cada uno, ≥ US$5, los dos CPA, chat del proyecto, conversiones probadas, ensayo sin errores |

## 2. El mensaje del OK
Un solo mensaje, corto. Primero la tabla:

| Conjunto | Ángulo | Video (origen y días) | Imagen | Texto prellenado | Presupuesto al día |
|---|---|---|---|---|---|

Debajo, una línea por cada cosa:
- **Oferta:** 1 / 2 / 3 unidades con sus precios, y el regalo.
- **CPA:** de equilibrio y objetivo, en la moneda y en US$.
- **Presupuesto diario total** de la campaña.
- **Riesgos reales**, uno por línea (empaque distinto, modismos del audio de otro país, marca o réplica, stock justo, conversiones sin atribución).
- **Qué quedó listo y probado:** flujo publicado, agente, conversiones, ensayo de publicación.
- **Créditos gastados** contra lo estimado.
- La pregunta: «¿La enciendo?».

## 3. Con el «sí» del usuario
- **Nunca de noche:** de 22:00 a 7:00 en la hora de la cuenta (la que dice `sl_como_trabajar` al principio; se cambia con `cuenta_zona_horaria`), no la de la PC. Si es de noche, se deja lista y se enciende en la mañana con su OK.
- `ads_publicar {campania_id, activar: true, confirmado: true}`.
  - Si responde `en_curso: true`, no la relances: mira `publicacion` en `ads_ver_testeo`.
  - Revisa `activacion` en la respuesta y después `ads_ver_campanias_activas`: una campaña activa con sus anuncios en pausa no entrega y Meta no avisa.
  - Mira en el plan del ensayo a qué hora arrancan los conjuntos (pueden arrancar a la medianoche de la cuenta) y dilo en la tabla del OK.
- `ads_ver_campanias_activas {}`: lo que Meta tiene encendido en vivo. Los conjuntos activos y los anuncios en revisión o activos.
- Anota en LANZAMIENTO.md el «sí» literal del usuario con fecha y hora.

## 4. En seguida: los ids de los anuncios
Los ids de Meta de los anuncios salen de `ads_ver_testeo {producto_id}` después de publicar.
1. **Siempre, en el vínculo con el agente:** `chat_agente_producto_editar {link_id, meta_ad_ids: [todos los ids]}`. Reemplaza la lista entera. Con esto, quien llega de esos anuncios cae en este producto.
2. **Solo si el embudo tiene ramas por anuncio** (opcional en [flujo-plantilla.md](flujo-plantilla.md)): `chat_flujo_nodo_editar {flujo_id, nodo_id: "n_entrada", data: {ramas: {"<índice de la rama>": {reglas: [{campo: "anuncio_id", op: "eq", valor: "<id>"}]}}}}`, una regla por anuncio (no existe el operador `in`). Después `chat_flujo_validar {flujo_id}` y `chat_flujo_publicar {flujo_id}`.

## 5. El primer chat real
Cuando llegue la primera conversación (minutos u horas después):
- `chat_conversaciones_ver {proyecto_id}` y `chat_conversacion_leer` de la primera.
- Confirma que llegaron la imagen de la promoción, la foto en la mano, el audio A1 y el texto con los 3 botones, en ese orden (el video demo sale solo si el cliente pide ver el producto), y que el agente respondió con la moneda correcta.
- Si algo falló, se corrige el flujo y se republica.

## 6. Cierre del lanzamiento
- `product_editar {producto_id, status: "aprobado"}`.
- LANZAMIENTO.md: estado «publicado», todas las casillas, «Próximo paso: lectura a las 24 h (<fecha y hora>)».
- Al usuario, en 2 líneas: qué quedó encendido y cuándo se lee ([lectura.md](lectura.md)). Si su agente puede programar tareas, ofrécele dejar programada la lectura de las 24 h; si no, que vuelva a este chat a esa hora.
