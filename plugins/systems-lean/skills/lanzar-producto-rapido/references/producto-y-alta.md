# Pasos 1 y 2 · El producto en la Biblioteca y el alta desde ahí

**El producto de un proveedor entra a la app por la Biblioteca y se investiga desde ahí,** como con el botón «Investigar» de la app. Así nace bien:
- con los datos del proveedor (stock, precios, código, categorías);
- con todas sus fotos en Creativos de Inspiración del producto, agrupadas con la etiqueta del proveedor;
- y en la Lista de Testeo, con su termómetro.

`product_crear` queda solo para un producto que no viene de Dropi ni de Soydrop (un enlace de AliExpress o de otra tienda que da el usuario).

Antes del paso 1, lee la regla del usuario si existe: `skills_listar {modulo: "product_lean"}` → `skills_leer` de la rama que aplique.

## Paso 1 · La ficha viva y el producto en la Biblioteca (10 min, tú)

### 1.1 La ficha viva del proveedor
De la ficha se sacan: descripción, precio del proveedor, precio sugerido, stock, bodegas, tipo de proveedor, variantes y fotos.

**Dropi (Colombia y los demás países de Dropi):**
1. `list_products {search: "<id de Dropi>", get_stock: true}` (conector oficial de Dropi).
   - **Stock:** en un producto con variantes, el `stock` de arriba viene en 0. El real es la **suma de `variations[].stock`**.
   - **Precio del proveedor:** `sale_price` (por variante, en `variations[]`). **Sugerido:** `suggested_price`.
   - **Fotos:** `gallery[].urlS3` (URLs completas). La de `main` es la portada.
   - **Si el id no aparece:** el producto está agotado, inactivo o no existe. No se lanza.
   - La búsqueda por texto depende del orden de las palabras: para comparar proveedores, busca al menos 2 órdenes y el nombre en español y en inglés.
   - **El conector no descuenta lo que otros apartaron.** Si el stock queda justo, pídele al usuario que lo mire en la ficha: `https://app.dropi.<dominio del país: co, mx, gt…>/dashboard/product-details/<id>/x` («stock vendible»).
   - El conector **no trae** el nombre ni el tipo del proveedor, la bodega, la ciudad de origen ni la descripción completa. No los inventes: pregúntalos o míralos con el usuario.
2. **Flete real:** `search_cities {name}` para el id de la ciudad, y `quote_shipping {destination_city, products: [{id, type, quantity, price}], cash_on_delivery: true}`.
   - Solo cotiza, no reserva nada. Antes de llamarla, pregúntale al usuario en un mensaje la variante (si tiene variantes) y el precio declarado (propón el sugerido): la tool lo exige.
   - Cotiza 1, 2 y 3 unidades a dos ciudades grandes: la de la bodega (o la más cercana) y otra lejos de ella. El flete de cada cantidad es el promedio de las dos, y el de la hoja es la mezcla 45/40/15 de esos tres (45/55 sin paquete de 3). Anota los seis valores en la ficha del SKU.
   - **Nunca `create_order`** en el lanzamiento: crea un pedido real.
3. **k (lo que se va sobre lo cobrado):** en Dropi Colombia, 2,4 % (retiro 2 % + 4×1000). En otro país, pregúntalo.

**Soydrop (Honduras):**
1. `soydrop_producto_ver {id, ciudad?}` (id de 24 caracteres o «ID-XXXXX»): costo, sugerido, stock, si se puede vender hoy, variantes, fotos, descripción, proveedor y **flete real por ciudad**.
   - **`en_stock` es lo que Soydrop deja vender.** Hay productos con miles de unidades marcados sin stock: esos no se lanzan.
   - **Flete:** usa el de la lista de paqueteras, el promedio de las 2 ciudades principales.
   - **k:** 5 % (4 % de comisión contra entrega + 1 % de servicio).
   - Si aparece `sin_cuenta_soydrop` o `sesion_vencida`: el usuario reconecta en https://app.soydrop.com con la extensión.
2. Para buscar alternativas o el regalo del mismo proveedor: `soydrop_catalogo_buscar {texto, solo_en_stock: true, orden}`. Una coincidencia «parcial» no es el mismo producto.

**Siempre:**
- **Stock mínimo:** el de una prueba y una escala corta: unas 3 semanas al ritmo de pedidos del usuario (a 10 pedidos al día, ≈210 unidades). Si no alcanza, **detente y avisa**: se puede probar como «stock corto», pero no escalar sin confirmar reposición. Caso de una operación real en Honduras (Soydrop): con 300 unidades o más se escaló; de 50 a 299, solo prueba; con menos de 50, no entró.
- **Mira las fotos reales del proveedor** y anota en la ficha del SKU (LANZAMIENTO.md) el tamaño (ml, cápsulas), el color, la tapa o el gatillo, la caja y **lo que dice la etiqueta, tal cual**. La descripción del proveedor puede estar mal: la etiqueta manda.
- **Si hay varios proveedores del mismo producto,** elige el que coincide con el empaque de los videos ganadores. Dilo si no coincide ninguno.

### 1.2 El producto en la Biblioteca y en la Lista de Testeo
1. `product_favoritos_ver {marca_id}`: si el producto ya está en la lista, anota el `id` de su fila (el ítem de la Biblioteca) y sigue a 1.4.
2. Si no está en la lista, búscalo en la Biblioteca: `product_biblioteca_ver {marca_id}`. Si está, mételo a la lista: `product_favorito_toggle {tipo: "producto", id: <id del ítem>, es_favorito: true, marca_id}`. Cae al final de la cola.
3. **Si no está en la Biblioteca, guárdalo tú:**
   - **Dropi:** `product_biblioteca_guardar {marca_id, proveedor: "dropi", dropi_id, pais, titulo, descripcion, fotos: [<todas las de gallery, la portada primero>], stock, categorias, precio_proveedor, precio_sugerido, moneda, sku, tipo_producto, nombre_proveedor, ciudad, a_lista_testeo: true}`, con los datos tal cual los dio `list_products` (`categorias` acepta sus objetos `{name}`). `titulo` es obligatorio; `nombre_proveedor` y `ciudad`, solo si los sabes.
   - **Soydrop:** `product_biblioteca_guardar {marca_id, proveedor: "soydrop", soydrop_id, a_lista_testeo: true}`.
   - Es lo mismo que hace el botón **«Guardar en Systems Lean»** de la extensión de Chrome en la ficha del proveedor. Si el usuario prefiere hacerlo así, que lo haga y vuelves a 1.
   - Revisa la respuesta: `item_id`, `categoria` y `creativos_importados`, que tiene que ser mayor que 0. Si responde `ya_estaba: true`, usa ese ítem.
4. **La categoría:** si el ítem cayó en «otros» y por su nombre es de otra (mascotas, belleza, hogar…), `product_recategorizar {marca_id, ids: [<id>], categoria}`.
5. **El orden de la cola**, solo si el usuario lo pide: `product_favoritos_reorder {items: [{tipo, id}, …]}` con la lista **completa** en el orden final.

### 1.3 Si el usuario quiere vender un combo desde el inicio
- Pregúntale cuál es el complemento. Tiene que estar en su Biblioteca; si no está, guárdalo como en 1.2.
- Cada miembro se investiga por separado (paso 2) y después se arma el combo: `combo_crear {nombre, marca_id, miembros: [{producto_id, rol: "principal"}, {producto_id, rol: "complemento"}]}`. Lleva un solo `principal`.
- Un regalo, un bono, un order bump o un upsell **no** son un combo: van como oferta en Projection (paso 5).

### 1.4 Cierre del paso
- `product_favoritos_ver {marca_id}`: la fila del producto, con su turno.
- Marca las casillas del paso 1 en LANZAMIENTO.md.

## Paso 2 · Investigar: el alta desde la Biblioteca (10 min, tú)

### 2.1 Investigar
1. **`product_biblioteca_investigar {marca_id, item_id, nombre: "<nombre comercial>"}`**, una sola vez. Es el botón «Investigar» de la app:
   - crea el producto con los datos del proveedor y lo espeja en Projection;
   - deja su fila de la Lista de Testeo enlazada (en la app deja de decir «Investigar»);
   - pasa todas las fotos del proveedor a Creativos de Inspiración del producto, con su etiqueta de origen (`dropi`).
   - `nombre` es el nombre comercial con el que se va a vender: claro, sin el código del proveedor y nunca una URL.
   - Si responde `resultado: "ya_estaba_investigado"`, usa el producto que devuelve: no se crea otro.
   - Revisa `creativos_de_inspiracion` (cuántos quedaron en el producto) y `proveedor.vinculado`.
   - Anota `producto_id` y `codigo` en LANZAMIENTO.md.
   - **Si el producto ya existía en Product Lean** (lo viste en la tabla del paso 0) y su ítem de la Biblioteca no está enlazado, no lo investigues todavía: crearía otro. Primero vincúlalo al proveedor (`dropi_producto_vincular {producto_id, dropi_id}` o `product_vincular_soydrop {producto_id, soydrop_id}`). Con eso la app enlaza sola el ítem con ese producto y le pasa sus fotos. Después, `product_biblioteca_investigar` responde `ya_estaba_investigado` con ese mismo producto.
2. **Si el ítem de la Biblioteca es un video** (un ganador guardado desde TikTok o Meta), se investiga igual: el video queda como creativo del producto. Las fotos limpias salen después del proveedor (1.1) o de AliExpress (paso 6).
3. **Un producto que no viene de Dropi ni de Soydrop** (un enlace de AliExpress u otra tienda):
   - `product_crear {nombre, marca_id, descripcion, categoria, source_urls: ["<enlace>"], thumbnail_url}`.
   - Sus fotos a Creativos de Inspiración: `media_subir {url, producto_id, fuente: "aliexpress"}` (o la plataforma de origen), una por foto.
   - Y a la Lista de Testeo: `product_favorito_toggle {tipo: "producto", producto_pl_id: <producto_id>, es_favorito: true, marca_id}`.

### 2.2 El vínculo con el proveedor
Sin él, los pedidos confirmados no suben solos al proveedor.
- **Dropi:** `dropi_producto_vincular {producto_id, dropi_id}` (o `enlace`). Sin `dropi_id`, muestra el vínculo actual. Comprueba con `dropi_productos_vinculados {}`.
  - **El inventario:** vuelve a leer `list_products {search: "<id>", get_stock: true}` y pásale los ítems tal cual a `dropi_inventario_registrar {productos: [...]}`. Así la app guarda stock, precio del proveedor y variantes, que usan la landing y el checkout. Revisa `sin_vincular` en la respuesta.
- **Soydrop:** si `product_ver_investigacion` no muestra el vínculo, `product_vincular_soydrop {producto_id, soydrop_id}`. Si el proveedor vende el pack de 2: `{…, unidades_por_producto: 2, agregar: true}`. Todas las marcas y el order bump tienen que ser del mismo proveedor de Soydrop.
- Si la respuesta de `product_biblioteca_investigar` trae `siguiente_paso`, hazlo.

### 2.3 Lo básico del producto
1. **`product_evaluar_checklist {producto_id, criterios_true: [...]}`**: los 15 criterios que trae la tool, marcados con honestidad. Dicen si el producto es viable. Verde desde 75 %. Si sale rojo, díselo al usuario antes de seguir.
2. **`product_completar_viabilidad {producto_id, nombre_comercial, nicho, descripcion_producto, pais_destino_code, paises_referencia: [...]}`**. Hazlo **antes de Projection:** la moneda de la hoja sale del país destino.
   - `nombre_comercial`: claro, el de la venta, no el del proveedor.
   - `nicho`: específico («cuidado de uñas con hongos», no «salud»).
   - `paises_referencia`: 2 o más, los más idóneos para encontrar creativos y estrategias de este producto: mercados con autoridad donde ya se vende (primero los de tu mismo idioma; después Estados Unidos o Brasil si ahí está lo mejor).
3. **Las fotos del producto:** `product_guardar_fotos {producto_id, fotos: [hasta 3 URLs], thumbnail_url}`.
   - Elígelas entre las fotos del proveedor que quedaron en Creativos de Inspiración (`anuncios_ver_biblioteca_creativos {producto_id}`, las de fuente `dropi`): **limpias, de fondo neutro y sin texto encima.**
   - **Descarta las infografías del proveedor:** con ellas los creativos salen con letras basura.
   - **La principal es la que mejor dice qué es el producto:** tiene que servir para buscarlo por imagen (AliExpress, Amazon, Google Lens).
   - Solo acepta URLs ya alojadas (las de la biblioteca sirven).
   - Si todas son infografías, se arma una foto base limpia en el generador de la app: `anuncios_generar` con la foto del proveedor como referencia de rol `producto`, y `store_imagen_quitar_fondo`. Cobra: muestra el costo y espera el sí.
4. **Keywords:** `product_guardar_keywords {producto_id, biblioteca: [{pais_code, keywords: [hasta 6]}]}`.
   - Una entrada por país: el destino y los de referencia.
   - Aparte de `biblioteca`, las claves `marketplace`, `amazon` y `aliexpress` (listas de texto), si sirven.
   - Son lo que escribiría un **comprador**: genéricas del producto o del dolor, de 2 o 3 palabras, que sirvan para encontrar en la Biblioteca de anuncios los anuncios del producto o de similares («faja reductora», «hongos uñas»).
   - **Nunca** el nombre comercial con marca.
   - Reemplaza la lista anterior.
5. **Nombre fácil y estado:** `product_editar {producto_id, nombre_llamadas, status: "investigando"}`.
   - `nombre_llamadas`: cómo lo dice una persona, primero qué es y después la marca («la faja moldeadora Sculpt»). Lo usan los recordatorios, las llamadas y el resumen del pedido.
   - `status` acepta: nuevo, investigando, analizado, aprobado, descartado, en_tienda. Al terminar el lanzamiento pasa a `aprobado`.

### 2.4 Cierre del paso
- `product_ver_investigacion {producto_id}`: `fila_de_origen` (la fila de la Lista de Testeo) y la viabilidad.
- El vínculo: `dropi_productos_vinculados {}` en Dropi; en Soydrop, `proveedor.vinculado` de la respuesta de `product_biblioteca_investigar`.
- `anuncios_ver_productos {}`: las fotos del producto. `nombre_llamadas` no sale en ninguna lectura: anota en LANZAMIENTO.md lo que respondió `product_editar`.
- `anuncios_ver_biblioteca_creativos {producto_id}`: las fotos del proveedor en Creativos de Inspiración.
- Marca las casillas del paso 2 en LANZAMIENTO.md.
