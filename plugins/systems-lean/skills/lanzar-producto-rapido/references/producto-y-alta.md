# Pasos 1 y 2 · Producto exacto, stock, Lista de Testeo y alta en Product Lean

## Paso 1 · Producto exacto y stock (5 min, tú)

`product_crear` **no trae nada del proveedor** (ni fotos, ni costo, ni stock, ni variantes). Todo eso se lee aquí, de la ficha viva, y se carga después con su tool.

### Dropi (Colombia y los demás países de Dropi)
1. `list_products {search: "<id de Dropi>", get_stock: true}` (conector oficial de Dropi).
   - **Stock:** en un producto con variantes, el `stock` de arriba viene en 0: el real es la **suma de `variations[].stock`**.
   - **Precio del proveedor:** `sale_price` (por variante en `variations[]`). **Sugerido:** `suggested_price`.
   - **Foto principal:** `gallery[0].urlS3` (URL completa).
   - **Si el id no aparece:** el producto está agotado, inactivo o no existe. No se lanza.
   - La búsqueda por texto depende del orden de las palabras: para comparar proveedores, busca al menos 2 órdenes y el nombre en español y en inglés.
   - **El conector no descuenta lo que otros apartaron.** Si el stock queda justo, pídele al usuario que lo mire en la ficha: `https://app.dropi.<país>/dashboard/product-details/<id>/x` («stock vendible»).
   - El conector **no trae** proveedor, bodega, ciudad de origen ni descripción completa. No los inventes: pregúntalos o míralos con el usuario.
2. **Flete real:** `search_cities {name}` para el id de la ciudad, y `quote_shipping {destination_city, products: [{id, type, quantity, price}], cash_on_delivery: true}`.
   - Solo cotiza, no reserva nada. Dropi pide confirmar la variante y el precio declarado.
   - Cotiza 1 unidad a la ciudad principal y 1, 2 y 3 unidades a una segunda ciudad. Pondera 45/40/15 para el flete de la hoja.
   - **Nunca `create_order`** en el lanzamiento: crea un pedido real.
3. **k (lo que se va sobre lo cobrado):** en Dropi Colombia, 2,4 % (retiro 2 % + 4×1000). Otro país: pregúntalo.

### Soydrop (Honduras)
1. `soydrop_producto_ver {id, ciudad?}` (id de 24 caracteres o «ID-XXXXX»): costo, sugerido, stock, si se puede vender hoy, variantes, fotos, descripción, proveedor y **flete real por ciudad**.
   - **`en_stock` es lo que Soydrop deja vender.** Hay productos con miles de unidades marcados sin stock: esos no se lanzan.
   - **Flete:** usa el de la lista de paqueteras, el promedio de las 2 ciudades principales.
   - **k:** 5 % (4 % de comisión contra entrega + 1 % de servicio).
   - Si aparece `sin_cuenta_soydrop` o `sesion_vencida`: el usuario reconecta en https://app.soydrop.com con la extensión.
2. Para buscar alternativas o el regalo del mismo proveedor: `soydrop_catalogo_buscar {texto, solo_en_stock: true, orden}`. Una coincidencia «parcial» no es el mismo producto.

### Siempre
- **Stock mínimo:** el de una prueba y una escala corta, unas 3 semanas a 10 pedidos al día (≈210 unidades). Si no alcanza, **detente y avisa**.
- **Mira las fotos reales del proveedor** y anota en la ficha del SKU (LANZAMIENTO.md) el tamaño (ml, cápsulas), el color, la tapa o el gatillo, la caja y **lo que dice la etiqueta, tal cual**. La descripción del proveedor puede estar mal: la etiqueta manda.
- **Si hay varios proveedores del mismo producto,** elige el que coincide con el empaque de los videos ganadores (paso 3). Dilo si no coincide ninguno.

## Paso 2 · Lista de Testeo y alta en Product Lean (10 min, tú)

### 2.1 La Lista de Testeo
La Lista de Testeo se arma con **ítems de la Biblioteca** (no con productos). Cuando el producto de Product Lean tiene el **mismo id de Dropi o de Soydrop** que el ítem, la app los enlaza sola al leer la lista, y el producto recibe su termómetro.

1. `product_favoritos_ver {marca_id}`. Si el producto ya está en la lista, sigue a 2.2.
2. Si no está, búscalo en la Biblioteca: `product_biblioteca_ver {marca_id}`.
   - **Si está en la Biblioteca:** `product_favorito_toggle {tipo: "producto", id: <id del ítem>, es_favorito: true, marca_id}`. Cae al final de la cola.
   - **Si no está:** pídele al usuario que lo guarde con la extensión de Systems Lean: en la ficha del producto en Dropi (`https://app.dropi.<país>/dashboard/product-details/<id>/x`) o en Soydrop, el botón **«Guardar en Systems Lean»**. Para que salga el botón, la Unidad de Negocio activa en la extensión tiene que ser de dropshipping; si en vez del botón sale un recuadro naranja, que la cambie en la extensión. Después vuelve a 2.
   - Si el usuario no puede ahora, sigue y anota «FALTA: Lista de Testeo» en la ficha. Se enlaza solo cuando lo guarde.
3. Para ponerlo primero en la cola (solo si el usuario lo pide): `product_favoritos_reorder {items: [{tipo, id}, …]}` con la lista **completa** en el orden final.

### 2.2 El alta
1. **`product_crear`**, una sola vez:
   - `nombre`: el nombre comercial con el que se va a vender (no el del proveedor, nunca una URL).
   - `marca_id`, `descripcion` (qué es y para qué, 1-2 líneas), `categoria`, `thumbnail_url` (la foto principal).
   - `source_urls`: el enlace del proveedor. Dropi: `https://app.dropi.<país>/dashboard/product-details/<id>`. Soydrop: `https://app.soydrop.com/dropshipping/product/<id>`.
   - Soydrop: además `soydrop_id` y `soydrop_pack: 1`.
   - **Revisa la respuesta:** `producto_id`, `codigo`, que `projection_lean` diga «ok» y, en Soydrop, `soydrop.vinculado: true`.
   - **Un regalo, un bono, un order bump o un upsell no son productos:** van como oferta en Projection (paso 5).
2. **El vínculo con el proveedor** (sin él los pedidos confirmados no suben solos):
   - **Soydrop:** si `vinculado` salió `false`, `product_vincular_soydrop {producto_id, soydrop_id}`. Si el proveedor vende el pack de 2: `{…, unidades_por_producto: 2, agregar: true}`. Todas las marcas y el bump tienen que ser del mismo proveedor de Soydrop.
   - **Dropi:** `dropi_producto_vincular {producto_id, dropi_id}` (o `enlace`). Sin `dropi_id`, muestra el vínculo actual. Comprueba con `dropi_productos_vinculados {}`.
   - **Dropi, el inventario:** vuelve a leer `list_products {search: "<id>", get_stock: true}` y pásale los ítems tal cual a `dropi_inventario_registrar {productos: [...]}`. Así la app guarda stock, precio del proveedor y variantes (los usan la landing y el checkout). Revisa `sin_vincular` en la respuesta.
3. **Comprueba el enlace con la lista:** `product_favoritos_ver {marca_id}` otra vez: la fila del producto debe tener `producto_investigado_id`. Si sigue vacía, el id del proveedor del ítem y el del producto no coinciden: revísalos.

### 2.3 Lo básico del producto
1. **`product_evaluar_checklist {producto_id, criterios_true: [...]}`**: los 15 criterios que trae la tool, marcados con honestidad. Verde desde 75 %. Si sale rojo, díselo al usuario antes de seguir.
2. **`product_completar_viabilidad {producto_id, nombre_comercial, nicho, descripcion_producto, pais_destino_code, paises_referencia: [...]}`**. Hazlo **antes de Projection:** la moneda de la hoja sale del país destino. `paises_referencia`: 2 o más países donde el producto ya se vende en el mismo idioma.
3. **Fotos:** `product_guardar_fotos {producto_id, fotos: [hasta 3 URLs], thumbnail_url}`.
   - Limpias y sin texto: la principal tiene que servir para buscar por imagen. Sin fotos, los anuncios y los videos inventan el producto.
   - Solo acepta URLs ya alojadas. La del CDN del proveedor sirve si es pública. Si no, súbela antes con `media_subir {url}` **sin `producto_id`** (con `producto_id` cae en Creativos de Inspiración) y usa la URL que devuelve.
   - Si las fotos del proveedor son infografías, se arma una foto base limpia con `anuncios_generar` (referencia con rol `producto`) y `store_imagen_quitar_fondo`. Cobra: muestra el costo y espera el sí.
4. **Keywords:** `product_guardar_keywords {producto_id, biblioteca: [{pais_code, keywords: [hasta 6]}]}` (también `marketplace`, `amazon`, `aliexpress` si sirven). Lo que escribe un comprador en 2 o 3 palabras («faja reductora», «quitar manchas»), nunca la marca. Reemplaza la lista anterior.
5. **Nombre fácil y estado:** `product_editar {producto_id, nombre_llamadas, status: "investigando"}`.
   - `nombre_llamadas`: cómo lo dice una persona, primero qué es y después la marca («la faja moldeadora Sculpt»). Lo usan los recordatorios, las llamadas y el resumen del pedido.
   - `status` acepta: nuevo, investigando, analizado, aprobado, descartado, en_tienda. Al terminar el lanzamiento pasa a `aprobado`.

### 2.4 Cierre del paso
- `product_ver_investigacion {producto_id}`: vínculo con el proveedor, viabilidad, fotos y `nombre_llamadas` a la vista.
- Marca las casillas del paso 2 en LANZAMIENTO.md.
