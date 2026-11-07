# Paso 7b · La landing (solo si el canal da landing)

Pide antes `sl_como_trabajar {tarea: "crear y publicar la landing de un producto contra entrega"}`: trae las reglas del módulo de landings. Lo de abajo es el camino mínimo para que quede vendiendo.

## 1. Lecturas
- `ver_tienda {}`: la marca, su subdominio y las landings que ya tiene.
- `estructura_conversion {}`: el orden de bloques que convierte y por qué.
- `listar_secciones {tipo}`: los campos de cada bloque **antes** de configurarlo (hay campos que solo aplican si otro tiene cierto valor).
- `store_tracking_ver {marca_id}`: el píxel. Si no hay, `store_tracking_configurar {marca_id, meta_pixel_id}` con el píxel de `ads_ver_pixeles` (por nombre). Si la marca no tiene ninguno, `store_pixel_crear {marca_id, nombre}` **con el OK del usuario** (crea algo real en Meta). El tracking solo aplica al republicar.
- `store_dominios_ver {marca_id}`: la dirección donde va a quedar.

## 2. Crear
- `landing_crear {producto_id, angulo_venta_id, nombre, modalidad_checkout: "cod", etapas_orden: []}`.
  - `angulo_venta_id`: el ángulo principal (`av1`).
  - `etapas_orden: []` = landing de bloques, sin etapas-imagen (esas cobran créditos).
  - Devuelve `lote_id` (forma `LP-…`).
- `landing_escenario {lote_id, escenario_id: null}`: la landing vende la oferta principal de Projection.

## 3. Los bloques
`landing_ver {lote_id}` (trae la `revision`) → `landing_guardar_bloques {lote_id, elementos: [...], revision}`. Reemplaza la lista entera. En `config` va solo lo que cambia del default. **Los precios y paquetes no se escriben en los bloques:** salen de Projection.

| Bloque | Qué configurar |
|---|---|
| Barra de anuncios | Envío gratis y pago al recibir; el único reloj de la página, si hay |
| Galería | 5 a 7 imágenes 4:5 del producto (fotos reales o `anuncios_generar` con la foto real de referencia; cobra) |
| Producto (buy-box) | Título, marca, reseñas con promedio 4,7-4,9, 3 o 4 beneficios que salen de los dolores, sin botón propio |
| Bundle de ofertas | Los paquetes de Projection, estilo miniaturas, «la más pedida» en el de 2, fila de medios de pago |
| Videos | 1 o 2 videos verticales del producto (la versión web del creativo, subida a la biblioteca) |
| Garantía | La garantía real del producto (`html_custom` sencillo) |
| Reseñas | 4 a 6 reseñas; el mismo número y promedio que el buy-box |
| Prueba social | Pedidos recientes, solo con números reales |
| Preguntas frecuentes | Las de la ficha: envío, pago, uso, cambios |
| Envío | De 1 a 5 días hábiles (los reales), sin fecha dinámica |
| Botón de WhatsApp | El número de `chat_proyectos_ver` (nunca tipeado) y un mensaje con el nombre del producto |

**Reseñas con la cara de la persona:** cada reseña lleva la foto de quien la escribe en `avatar_url` (`store_resena_foto_generar {estilo: "persona", nombre}`) y la del producto en `images[0]` (`estilo: "producto"`). Cobra: muestra el costo y espera el sí. Para editar un bloque después: `landing_editar_bloque {lote_id, bloque, config}`.

## 4. El checkout del país
1. `store_checkout_ver {lote_id}` siempre antes de tocarlo.
2. `store_checkout_configurar {lote_id, form_design: {...}}`, solo lo que cambia:
   - **Los campos mínimos del país.** En Colombia, 6 visibles: celular con WhatsApp, nombre, apellido, departamento, ciudad y dirección; el resto con `visible: false`. En los demás países, nombre, teléfono y dirección con su ciudad. Cada campo extra baja la conversión.
   - **Fuera las zonas sin cobertura:** `cobertura_excluidos` con los nombres exactos del catálogo (en Colombia: AMAZONAS, GUAINÍA, GUAVIARE, VAUPÉS, VICHADA, SAN ANDRÉS) y `excluir_ciudades_dificiles: true`.
   - `cta_text` y `cta_subtext` («Pagas al recibir»).
3. Si el país principal no es el de la marca: `store_checkout_pais_principal {lote_id, pais}`.
4. Políticas del país (si la tienda no las tiene): `store_branding_ver {marca_id}` y `store_branding_guardar {pais_codigo, datos, generar_politicas: true}`.

## 5. Antes de publicar
- [ ] Precios y paquetes iguales a Projection.
- [ ] Sin promesas médicas ni testimonios inventados.
- [ ] El mismo número de reseñas y promedio en el buy-box y en Reseñas.
- [ ] Checkout con los campos mínimos y sin las zonas sin cobertura.
- [ ] Píxel configurado.
- [ ] Botón de WhatsApp con el número del proyecto.
- [ ] Se ve bien en el celular.
- [ ] Ninguna imagen con otra marca o con precio viejo.

## 6. Publicar y revisar
- `landing_publicar {lote_id}`: devuelve la URL pública. **Todo cambio de bloques, checkout o tracking necesita republicar.**
- Ábrela con `?sl_test=1` (no ensucia las métricas) y revísala completa en el celular.
- **Nunca hagas un pedido de prueba contra entrega:** sale real al proveedor.
- Anota la URL en LANZAMIENTO.md.
