# Paso 11 · Auditoría, OK del usuario y publicación

## 1. La auditoría (antes de pedir el OK)
Lee cada módulo **con su tool de lectura**, no de memoria ni de LANZAMIENTO.md. Cada fila queda en verde, o en rojo con el porqué dicho al usuario.

| Módulo | Lectura | Verde si… |
|---|---|---|
| Lista de Testeo | `product_favoritos_ver {marca_id}` | La fila del producto tiene `producto_investigado_id` |
| Alta y vínculo | `product_ver_investigacion {producto_id}` | Vínculo con Dropi o Soydrop, viabilidad, hasta 3 fotos, `nombre_llamadas` |
| Informe | `product_ver_informe {producto_id}` | Rama Competencia con `evidencia_origen` y números |
| Ángulos | `anuncios_ver_angulos_venta {producto_id}` | 3 a 5 ángulos con problemas, objeciones y deseos |
| Ficha, entrega, cobertura | `product_ver_ficha {producto_id}` | Ficha con variables `{{…}}` y sin cifras; entrega propia; cobertura con las zonas excluidas |
| Projection | `projection_ver_simulador` y `projection_ver_ofertas` (id del simulador) | Moneda del país; costo, flete, contra entrega, 5/30 %; 3 paquetes con `share_pct`; envío gratis; regalo con `cantidad_minima` |
| Biblioteca | `anuncios_ver_biblioteca_creativos {producto_id}` y `media_listar {producto_id}` | Referencias con origen; por ángulo 1 video y 1 imagen terminados; 6 de reserva |
| WhatsApp | `chat_agente_productos_ver {proyecto_id}` y `chat_flujos_ver {proyecto_id}` | Producto activo con keywords; embudo y confirmación `publicado`; el viejo `pausado` |
| Landing (si hay) | `landing_ver {lote_id}` | Publicada, checkout del país, píxel |
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
- **Nunca de noche** (22:00 a 7:00, hora de la PC del usuario). Si es de noche, se deja lista y se enciende en la mañana con su OK.
- `ads_publicar {campania_id, activar: true, confirmado: true}`.
  - Si responde `en_curso: true`, no la relances: mira `publicacion` en `ads_ver_testeo`.
  - Revisa `verificacion_en_meta`: una campaña activa con sus anuncios en pausa no entrega y Meta no avisa.
- `ads_ver_campanias_activas {}`: lo que Meta tiene encendido en vivo. Los conjuntos activos y los anuncios en revisión o activos.
- Anota en LANZAMIENTO.md el «sí» literal del usuario con fecha y hora.

## 4. En seguida: los ids de los anuncios
Los ids de Meta de los anuncios salen de `ads_ver_testeo {producto_id}` después de publicar.
1. **Siempre, en el vínculo con el agente:** `chat_agente_producto_editar {link_id, meta_ad_ids: [todos los ids]}`. Reemplaza la lista entera. Con esto, quien llega de esos anuncios cae en este producto.
2. **Solo si el embudo tiene ramas por anuncio** (opcional en [flujo-plantilla.md](flujo-plantilla.md)): `chat_flujo_nodo_editar {flujo_id, nodo_id: "n_entrada", data: {ramas: {"<índice de la rama>": {reglas: [{campo: "anuncio_id", op: "eq", valor: "<id>"}]}}}}`, una regla por anuncio (no existe el operador `in`). Después `chat_flujo_validar {flujo_id}` y `chat_flujo_publicar {flujo_id}`.

## 5. El primer chat real
Cuando llegue la primera conversación (minutos u horas después):
- `chat_conversaciones_ver {proyecto_id}` y `chat_conversacion_leer` de la primera.
- Confirma que llegaron el video, la foto, la imagen de la promoción y el A1, en ese orden, y que el agente respondió con la moneda correcta.
- Si algo falló, se corrige el flujo y se republica.

## 6. Cierre del lanzamiento
- `product_editar {producto_id, status: "aprobado"}`.
- LANZAMIENTO.md: estado «publicado», todas las casillas, «Próximo paso: lectura a las 24 h (<fecha y hora>)».
- Al usuario, en 2 líneas: qué quedó encendido y cuándo se lee ([lectura.md](lectura.md)). Si su agente puede programar tareas, ofrécele dejar programada la lectura de las 24 h; si no, que vuelva a este chat a esa hora.
