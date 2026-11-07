# Product Lean: ángulos y perfiles (paso 4) · ficha, entrega y cobertura (paso 6)

Todas estas tools son gratis y no corren la IA de la app: investigas tú y la app guarda. Cada `product_guardar_*` **reemplaza** lo anterior de esa sección: lee primero, manda completo.

## Ángulos y perfiles (paso 4)
Salen de la investigación del paso 3: lo que más dura en el país, lo que gana afuera y lo que nadie toca.

1. `product_ver_estrategia {producto_id}`: lo que ya existe.
2. `product_guardar_estrategia {producto_id, buyer_personas: [...], angulos_venta: [...]}`:
   - **`angulos_venta`**, de 3 a 5, en orden de prioridad. Cada uno:
     - `titulo` y `mensaje_principal` (obligatorios);
     - `nivel_consciencia` (obligatorio): `unaware`, `problem_aware`, `solution_aware`, `product_aware` o `most_aware`;
     - `tipo`: aspiracional, emocional, cientifico, urgente, provocador, curiosidad, prueba_social o economico;
     - `hook_semilla`: la primera frase del video, tal como la dice el ganador;
     - `perfil_comprador {nombre_arquetipo, demograficos: {edad_rango, genero, pais, ciudad_tipo}}` (`demograficos` es un OBJETO, nunca un texto);
     - **`problemas[]`, `objeciones[]`, `confianza_seguridad[]` y `deseos_emocionales[]` llenos:** el copy, la imagen, la landing y el agente salen de aquí. Un ángulo con solo título deja al resto sin material.
   - **`buyer_personas`**, 1 o 2: `nombre_arquetipo`, `demograficos` (objeto), `problemas[{texto, gravedad, como_podria_resolverlo}]`, `objeciones[{texto, categoria, como_resolverla}]`, `confianza_seguridad[{factor, como_resolverlo}]`, `deseos_emocionales[]`, `alternativas_fallidas[]`.
   - **Nunca un ángulo que dependa del empaque** («el original», «así llega») si el empaque de los videos no es idéntico al nuestro.
3. **Verifica:** `anuncios_ver_angulos_venta {producto_id}` devuelve los ángulos con sus ids (`av1`, `av2`…). Anótalos en LANZAMIENTO.md: los usan la landing, las imágenes y la campaña.

## Ficha, entrega y cobertura (paso 6)
**Va después de Projection (paso 5):** la ficha usa las variables de precio que Projection crea.

### 1. Ficha técnica
`product_guardar_ficha_tecnica {producto_id, ficha_tecnica: {...}}`: un objeto con lo fáctico, sacado de la etiqueta y de la ficha del proveedor (paso 1).
```json
{
  "presentacion": "frasco de 100 ml con atomizador, en caja",
  "contenido": "...",
  "ingredientes_o_materiales": "...",
  "medidas": "...", "peso": "...",
  "modo_de_uso": "...",
  "advertencias": "...",
  "certificaciones": "...",
  "compatibilidades": "..."
}
```
Lo que no está en la etiqueta ni en la ficha del proveedor no se escribe.

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
4. Esa misma lista se excluye en la campaña (paso 10).

### 4. La ficha del agente
Es lo que el agente de WhatsApp (y la landing) saben del producto.
1. `product_ver_ficha {producto_id}`: trae la ficha actual, las `variables_disponibles` y los bloques `entrega` y `cobertura_envio`.
2. Si el usuario tiene una regla para la ficha, léela: `skills_leer {modulo: "product_lean", rama: "ficha-producto"}` (si existe).
3. `product_guardar_ficha {producto_id, ficha}`: texto plano con las **5 secciones numeradas** que pide la app.
   - **Precios, tiempos y garantía SIEMPRE como variable:** `{{precio_1x}}`, `{{precio_2x}}`, `{{precio_3x}}`, `{{tiempos_entrega}}`, `{{garantia}}`… Solo existen las que aparecen en `variables_disponibles`. Nunca una cifra escrita.
   - Preguntas del producto (de 15 a 20): qué es, cómo se usa, cuánto dura, en cuánto se ven resultados, si sirve para X (con lo que promete el anuncio), contraindicaciones.
   - Preguntas de la compra (de 10 a 13): pago contra entrega, envío, tiempos, cambios, cómo se confirma.
   - Objeciones (unas 10): «está caro», «¿es original?», «¿y si no funciona?», «lo pienso»… con la respuesta corta.
   - Sin aclaraciones defensivas («no somos médicos…») salvo que el producto lo exija.
4. **Verifica:** `product_ver_ficha {producto_id}` con la ficha guardada, `entrega` propia y `cobertura_envio` con las zonas.

## Cierre
Marca las casillas de los pasos 4 y 6 en LANZAMIENTO.md.
