# Paso 10 · La campaña de testeo en Ads Lean

Pide antes `sl_como_trabajar {tarea: "armar una campaña de testeo en Meta para un producto contra entrega"}`. Este paso arma todo **en pausa** y termina con un ensayo de publicación sin errores. Publicar es el paso 11, con el OK del usuario.

## La estructura
- **Campaña ABO** (presupuesto por conjunto), de testeo.
- **Un conjunto por ángulo** (los del paso 4), de 3 a 5.
- **Cada conjunto con 2 anuncios del mismo ángulo:** su video y su imagen (paso 8).
- **Presupuesto:** 1 CPA de equilibrio al día para toda la campaña, repartido; ningún conjunto con menos de US$5 (paso 5).

## 1. Lecturas
- `ads_ver_conexion {marca_id}`: cuenta publicitaria, página, píxel y números de WhatsApp.
- `ads_ver_pixeles {marca_id}`: el píxel, por nombre.
- `projection_ver_simulador` (id del simulador): el bloque `viabilidad_publicitaria`.
- `ads_ver_testeo {producto_id}`: si ya hay una campaña de este producto, se completa esa; no se crea otra.

## 2. Crear la campaña
`ads_crear_campania {producto_id, plataforma: "meta", objetivo, estrategia: "directa-angulos", presupuesto_modo: "conjunto", notas}`:
- **`objetivo`:**
  - **WhatsApp: `"mensajes"`** (en Meta, «maximizar el número de conversaciones»). Es el que se usa para vender contra entrega por chat. `leads` también se publica, pero es para servicios o ticket alto: no lo uses aquí. Al llegar a 10 compras confirmadas en 30 días se propone pasar a compras.
  - **Landing: `"ventas"`**, con el píxel midiendo compras.
- No mandes `nombre`: la app le pone el nombre estándar.
- `notas`: la oferta, las tasas (30/5), los dos CPA y los riesgos, en 4 líneas.
- `presupuesto_modo: "conjunto"` no se cambia después de publicar.

## 3. Los dos CPA
`ads_editar_campania {campania_id, breakeven_cpa, cpa_objetivo}` con los números **por venta confirmada** del paso 5, en la moneda de la app. No los dejes en el valor que trae Projection por entrega.

## 4. Los conjuntos
Por cada ángulo: `ads_crear_conjunto {campania_id, descriptor: "Ángulo · <ángulo>", presupuesto_diario}`. Anota cada `conjunto_id` en LANZAMIENTO.md.

## 5. El targeting
1. Zonas sin cobertura: las mismas del paso 6. Si no las tienes con su key, `ads_resolver_lugares {nombres: [...], pais, marca_id}`. Nunca inventes una key.
2. `ads_configurar_targeting {campania_id, paises: ["<país>"], edad_min: 18, regiones_excluidas: [{key, tipo: "region" | "city"}], ...}`:
   - **WhatsApp:** `destino_mensajes: "whatsapp"`, `optimization_goal: "CONVERSATIONS"` y **`chat_proyecto_id`** (obligatorio: sin él la subida frena con «Falta vincular el chat»).
   - **Landing:** `url_destino` con la URL publicada de la landing.
   - Sin intereses ni públicos en el testeo: Meta encuentra al comprador con el creativo.

## 6. Los anuncios (2 por conjunto)
1. `ads_ver_fuentes {producto_id}`: el inventario de lo que se puede adjuntar (la biblioteca del producto y las imágenes generadas).
2. Por cada pieza de la tabla «Creativos por conjunto»:
   - Si aparece en `ads_ver_fuentes`: `ads_agregar_creativo {conjunto_id, fuente, fuente_ref, url_original, mime_kind, thumbnail_url, angulo, ad_texto_principal, ad_titulo, ad_descripcion, ad_cta}`, con los datos tal cual vienen de `ads_ver_fuentes`.
   - Si no aparece: `ads_subir_creativo {conjunto_id, nombre: "<nombre>.mp4", url: <URL de la biblioteca>, angulo, ad_texto_principal, ad_titulo, ad_descripcion}`.
   - **Nunca un archivo que no esté en la biblioteca del producto:** súbelo primero (paso 8).
3. **El copy de cada anuncio** (sin precio, nunca):
   - `ad_texto_principal`: unos 125 caracteres. El gancho del ángulo, el beneficio, «🚚 Envío gratis · 💵 Pagas al recibir» y el regalo con 2, si hay.
   - `ad_titulo`: hasta 40 caracteres.
   - `ad_descripcion`: hasta 30.
   - Sin promesas médicas ni atributos personales («¿Sufres de…?»).
4. **El texto prellenado (WhatsApp):** `ads_editar_creativo {creativo_id, chat_autofill: "Hola, quiero el <producto> del video 😊"}`. Lleva una palabra clave del vínculo del agente (paso 9) y es distinto por ángulo. Anótalo en LANZAMIENTO.md: `ads_ver_testeo` no lo muestra y el embudo lo usa.
5. **Los nombres:** `angulo` pisa el nombre del anuncio. Revisa con `ads_ver_creativo {creativo_ids: [...]}` y corrige con `ads_editar_creativo {creativo_id, ad_name}`. Si un anuncio queda sin texto principal, queda bloqueado.

## 7. Las conversiones
Sin esto, Meta optimiza por gente que escribe y no por compradores.
1. `ads_conectar_conversiones {campania_id, pixel_id, chat_proyecto_id}`.
2. `ads_probar_conversiones {campania_id}`: `llegan` y `con_atribucion` en `true`.
3. Si falla por falta de acceso avanzado a la API de Meta, no se arregla reintentando: díselo al usuario y anótalo como riesgo.

## 8. Verificar y ensayar
1. `ads_ver_testeo {producto_id}`: `presupuesto_modo: "conjunto"`, un conjunto por ángulo, **cada conjunto con sus 2 anuncios**, cada uno con presupuesto de US$5 o más, los dos CPA y los `avisos` (resuélvelos).
2. **El ensayo:** `ads_publicar {campania_id, activar: true}` **sin `confirmado`**. Devuelve el plan (qué se publica, presupuesto diario y moneda) sin publicar nada. Si trae errores o `bloqueado_por`, corrígelos y repite.
   - Si dice `bloqueado_por: "whatsapp_destino"`, se repite con `whatsapp_numero` (el del proyecto).
   - El aviso de «la página no aparece vinculada» no frena la publicación.
3. Marca las casillas del paso 10 en LANZAMIENTO.md.

**Publicar con `confirmado: true` es del paso 11, con el «sí» del usuario.**
