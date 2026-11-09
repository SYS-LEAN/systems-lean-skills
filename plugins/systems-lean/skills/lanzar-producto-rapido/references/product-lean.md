# Product Lean: ficha, entrega y cobertura (paso 6) · ángulos y perfiles (paso 7)

Todas estas tools son gratis y no corren la IA de la app: investigas tú y la app guarda. Cada `product_guardar_*` **reemplaza** lo anterior de esa sección: lee primero, manda completo.

## Paso 6 · Ficha técnica, ficha del producto, entrega y cobertura
**Va después de Projection (paso 5):** la ficha usa las variables de precio que Projection crea.

### 1. Ficha técnica
1. **Los datos:** materiales, medidas, peso, alimentación (pilas, cable, batería), contenido y el mecanismo que declara el fabricante. Salen de la etiqueta, de la ficha del proveedor (paso 1) y de la ficha de AliExpress que capturó el usuario (`product_ver_extraccion {producto_id, fuente}` con el nodo de AliExpress).
2. **Las fotos de AliExpress** (las del slider de la ficha):
   - La URL buena se saca cortando el sufijo de la miniatura: `…abc.jpg_220x220q75.jpg_.avif` → `…abc.jpg`.
   - Las de 27x27 son muestras de color y las de 960x960 sueltas suelen ser íconos del sitio: no van.
   - **Míralas** antes de guardarlas.
   - Guárdalas juntas en una carpeta del producto (el método lo pide, aunque la tool diga que no se creen carpetas por iniciativa propia): `media_carpeta_crear {nombre: "AliExpress", producto_id}` → `media_subir {url, producto_id, folder_id, fuente: "aliexpress"}`, una por foto. Las usa la galería de la landing (paso 10).
3. `product_guardar_ficha_tecnica {producto_id, ficha_tecnica: {...}}`: un objeto con lo fáctico.
```json
{
  "presentacion": "frasco de 100 ml con atomizador, en caja",
  "contenido": "...",
  "ingredientes_o_materiales": "...",
  "medidas": "...", "peso": "...",
  "alimentacion": "...",
  "modo_de_uso": "...",
  "mecanismo_declarado": "...",
  "advertencias": "...",
  "certificaciones": "...",
  "compatibilidades": "..."
}
```
Lo que no está en la etiqueta ni en una ficha no se escribe.

### 2. Entrega propia del producto
`product_guardar_entrega {producto_id, tiempos, empaque, garantia_texto}`:
- `tiempos`: lo real del proveedor y la transportadora del país («1 a 5 días hábiles»).
- `empaque`: cómo llega («sellado, en caja, con empaque discreto»).
- `garantia_texto`: la garantía real del producto (por ejemplo, cambio por daño en la entrega dentro de 7 días).
- Si mandas un campo vacío, vuelve a heredar el de la marca. Es la fuente de `{{tiempos_entrega}}` y `{{garantia}}`.

### 3. Cobertura
Un pedido a una zona donde la transportadora no entra se cae con el flete de ida ya pagado.
1. Decide las zonas sin cobertura con la ficha del proveedor y el flete (islas, zonas fluviales o sin carretera). Ejemplos: en Honduras con Soydrop, las Islas de la Bahía; en Colombia, Amazonas, Guainía, Guaviare, Vaupés, Vichada y San Andrés. Si dudas, pregúntale al usuario.
2. Resuelve cada zona con `ads_resolver_lugares {nombres: [...], pais, marca_id}`: devuelve su `meta_key`. Nunca la inventes.
3. `product_guardar_cobertura {producto_id, modo: "todo_menos", pais, zonas: [{nombre, tipo: "region" | "city", meta_key, motivo}], mensaje_cliente}`.
   - `mensaje_cliente`: lo que el agente le dice a quien está fuera de cobertura, amable y corto.
4. Esa misma lista se excluye en la campaña (paso 12) y en el checkout de la landing (paso 10).

### 4. La ficha del agente
Es lo que el agente de WhatsApp (y la landing) saben del producto.
1. `product_ver_ficha {producto_id}`: trae la ficha actual, las `variables_disponibles` y los bloques `entrega` y `cobertura_envio`.
2. Si el usuario tiene una regla para la ficha, léela: `skills_leer {modulo: "product_lean", rama: "ficha-producto"}` (si existe).
3. `product_guardar_ficha {producto_id, ficha}`: texto plano con las secciones de `estructura_obligatoria` que trae `product_ver_ficha` (1, 2, 3, 4, 4b y 5, y la 6 si guardaste zonas sin cobertura). Mínimo 200 caracteres.
   - **Precios, tiempos, garantía y ofertas SIEMPRE como variable:** `{{precio_1x}}`, `{{precio_2x}}`, `{{precio_3x}}`, `{{tiempos_entrega}}`, `{{garantia}}`… Solo existen las que aparecen en `variables_disponibles`. Nunca una cifra escrita.
   - **La sección 4 (precio y compra) va corta:** el precio de una unidad (con su variable), cómo se paga y cuánto tarda. **Nada de paquetes, envío gratis, regalos ni garantía:** eso lo dice la oferta activa del escenario, y si la ficha lo repite se contradice cuando la oferta cambia.
   - **Preguntas del producto** (de 15 a 20): qué es, cómo se usa, cuánto dura, en cuánto se ven resultados, si sirve para X (con lo que promete el anuncio), contraindicaciones. **Responden por su caso y terminan ahí:** no piden el pedido, y solo pregunta algo la que necesita un dato para seguir (la ciudad, para el plazo).
   - **Preguntas de la compra** (de 10 a 13): pago contra entrega, envío, tiempos, cambios, cómo se confirma. Estas sí pueden ofrecer tomar los datos.
   - **Objeciones** (unas 10): «está caro», «¿es original?», «¿y si no funciona?», «lo pienso»… **Cierran resolviendo**, no pidiendo la dirección.
   - Si todas las respuestas terminan en «¿le tomo los datos?», el agente le pide la dirección a quien solo preguntó si duele. Revísalo antes de guardar.
   - Usa las objeciones y preguntas reales de los comentarios (paso 4).
   - Sin aclaraciones defensivas («no somos médicos…») salvo que el producto lo exija.
4. **Una ficha por escenario** si la variante vende algo distinto (un complementario que las demás no traen, otro uso): `product_guardar_ficha {producto_id, ficha, escenario_id}`. Si solo cambia el precio, no hace falta: las variables toman el de cada escenario.
5. **Verifica:** `product_ver_ficha {producto_id}` con la ficha guardada, `entrega` propia y `cobertura_envio` con las zonas.

### 5. Cierre del paso 6
Marca las casillas del paso 6 en LANZAMIENTO.md.

## Paso 7 · Ángulos y perfiles
Salen de toda la investigación: los 5 ángulos dominantes del informe (paso 4), lo que gana afuera y lo que nadie toca. **El mejor suele ser el que muy pocos están explotando y los datos respaldan.**

1. `product_ver_estrategia {producto_id}`: lo que ya existe.
2. `product_guardar_estrategia {producto_id, buyer_personas: [...], angulos_venta: [...]}`:
   - **`angulos_venta`**: tantos como conjuntos salieron en el paso 5 (de 3 a 5), en orden de prioridad. Unos salen de lo que más funciona en la competencia; otros, de las oportunidades que viste. Cada uno:
     - `titulo` y `mensaje_principal` (obligatorios);
     - `nivel_consciencia` (obligatorio): `unaware`, `problem_aware`, `solution_aware`, `product_aware` o `most_aware`;
     - `tipo`: aspiracional, emocional, cientifico, urgente, provocador, curiosidad, prueba_social o economico;
     - `hook_semilla`: la primera frase del video, tal como la dice el ganador;
     - `perfil_comprador {nombre_arquetipo, demograficos: {edad_rango, genero, pais, ciudad_tipo}}` (`demograficos` es un OBJETO, nunca un texto);
     - **`problemas[]`, `objeciones[]`, `confianza_seguridad[]` y `deseos_emocionales[]` llenos:** el copy, la imagen, la landing y el agente salen de aquí. Un ángulo con solo título deja al resto sin material.
   - **`buyer_personas`**, 1 o 2: `nombre_arquetipo`, `demograficos` (objeto), `problemas[{texto, gravedad, como_podria_resolverlo}]`, `objeciones[{texto, categoria, como_resolverla}]`, `confianza_seguridad[{factor, como_resolverlo}]`, `deseos_emocionales[]`, `alternativas_fallidas[]`.
   - **Nunca un ángulo que dependa del empaque** («el original», «así llega») si el empaque de los videos no es idéntico al nuestro.
3. **Verifica:** `anuncios_ver_angulos_venta {producto_id}` devuelve los ángulos con sus ids (`av1`, `av2`…). Anótalos en LANZAMIENTO.md: los usan la landing, las imágenes y la campaña.
4. Marca las casillas del paso 7 en LANZAMIENTO.md.
