# Paso 12 · La campaña de testeo en Ads Lean

Pide antes `sl_como_trabajar {tarea: "armar una campaña de testeo en Meta para un producto contra entrega"}`. Este paso arma todo **en pausa** y termina con un ensayo de publicación sin errores. Publicar es el paso 13, con el OK del usuario.

La campaña se arma con **la estrategia que recomienda la app** (su ficha trae la estructura, el presupuesto por conjunto, los cortes, el ganador y la escala) y la lee después todo: la barra de la campaña, la copa, el tablero de Despliegue creativo y el paso 14. **Nunca `directa-angulos` ni las otras de antes:** en contra entrega el conector las rechaza.

## La estrategia
1. `ads_ver_estrategias {producto_id, presupuesto_diario}` (con el presupuesto que dijo el usuario o el `plan_meta`): las fichas que aplican, la recomendada y su porqué.
2. **Guía de la recomendación** (la de la app):
   - con video propio y presupuesto para el mínimo de la ficha → **Lean 1** (un creativo por conjunto, cada conjunto con su presupuesto; entran piezas nuevas en cada tanda);
   - con video pero sin ese presupuesto → **Lean 2**, el equipo de anuncios (un conjunto por concepto, con 5 anuncios, uno por nivel de conciencia del cliente; se juzga el conjunto, no cada anuncio);
   - sin video propio → **Lean 3** (estáticos).
3. **Eliges tú, con su motivo** (no le preguntes «¿cuál quieres?»): la recomendada, salvo que el usuario haya dicho otra. En el mensaje del OK va en una línea cuál y por qué.

## La estructura
- **La de la ficha** (su fase `lanzar`): cuántos conjuntos, cuántos creativos por conjunto y el presupuesto de cada uno. Con Lean 1, un conjunto por creativo; los creativos salen de los ángulos del paso 7, **uno por ángulo** (paso 9).
- **Con Lean 2:** un conjunto por **concepto** (persona + situación + oferta + ángulo, guardado en Product Lean en el paso 7), con 5 anuncios y 1 tope al día (el tope es el CPA objetivo de la hoja). Otro ángulo es otro concepto: otro conjunto, con su propio presupuesto.
- **Presupuesto:** el de la ficha, en la moneda de la hoja. Si con el presupuesto del usuario no alcanza, la ficha recomendada ya será otra: no partas el presupuesto a mano.

## 1. Lecturas
- `ads_ver_conexion {marca_id}`: cuenta publicitaria, página, píxel y números de WhatsApp.
- `ads_ver_pixeles {marca_id}`: el píxel, por nombre.
- `projection_ver_simulador` (id del simulador): el bloque `viabilidad_publicitaria`.
- `ads_ver_testeo {producto_id}`: si ya hay una campaña de este producto, se completa esa; no se crea otra.

## 2. Crear la campaña
Dos caminos, el mismo resultado:
- `despliegue_campana_estructura {producto_id, estrategia: "tiburon" | "equipo" | "explorador", motivo}` (Lean 1, 2 o 3): arma el borrador en Ads Lean con los conjuntos de la ficha. La clave `semaforo` (la Lean 2 de antes) quedó retirada el 2026-11-25: el conector la rechaza. Después se ajustan el objetivo y el destino (abajo) con `ads_editar_campania`.
- O `ads_crear_campania {producto_id, plataforma: "meta", objetivo, estrategia, estrategia_motivo, presupuesto_modo: "conjunto", notas}` y los conjuntos a mano (sección 4).

En los dos:
- **`objetivo`:**
  - **WhatsApp: `"mensajes"`** (en Meta, «maximizar el número de conversaciones»). Es el que se usa para vender contra entrega por chat. `leads` también se publica, pero es para servicios o ticket alto: no lo uses aquí. Al llegar a 10 compras confirmadas en 30 días se propone pasar a compras.
  - **Landing: `"ventas"`**, con el píxel midiendo compras.
- No mandes `nombre`: la app le pone el nombre estándar.
- `notas`: la oferta, las tasas del país, los dos CPA del `plan_meta` y los riesgos, en 4 líneas.
- `presupuesto_modo: "conjunto"` no se cambia después de publicar.

## 3. Los dos CPA
**No los fijes en la campaña.** Desde el 2026-11-21 Ads Lean lee solos el CPA de equilibrio y el CPA objetivo **reales** de la hoja de Projection, por venta confirmada, con costos, devolución, cancelación y la meta (`projection_ver_simulador › cpa_real`). Un `ads_editar_campania {breakeven_cpa}` o `{cpa_objetivo}` deja un número fijo que queda viejo y tapa el plan: la barra de la campaña, la copa de ganador y las reglas de corte juzgarían con él. Si una campaña ya tiene uno fijado, devuélvelo con `ads_editar_campania {campania_id, breakeven_auto: true, cpa_objetivo_auto: true}`. Fíjalos a mano solo si el usuario lo pide.

## 4. Los conjuntos
- Si usaste `despliegue_campana_estructura`, ya están: míralos con `despliegue_campana_ver {producto_id}` (cada conjunto con su cupo y su presupuesto).
- Si no, uno por cada creativo (Lean 1), uno por concepto (Lean 2) o por grupo (Lean 3): `ads_crear_conjunto {campania_id, descriptor: "<ángulo> · <creativo>", presupuesto_diario}`. **`presupuesto_diario` va en la moneda de la hoja** (COP en Colombia), con lo que pide la ficha. Mándalo siempre: sin él, cada conjunto toma 1 CPA entero.
- Anota cada `conjunto_id` en LANZAMIENTO.md.

## 5. El targeting
1. Zonas sin cobertura: las mismas del paso 6. Si no las tienes con su key, `ads_resolver_lugares {nombres: [...], pais, marca_id}`. Nunca inventes una key.
2. `ads_configurar_targeting {campania_id, paises: ["<país>"], edad_min: 18, regiones_excluidas: [{key, tipo: "region" | "city"}], ...}`:
   - **WhatsApp:** `destino_mensajes: "whatsapp"`, `optimization_goal: "CONVERSATIONS"` y **`chat_proyecto_id`** (obligatorio: sin él la subida frena con «Falta vincular el chat»).
   - **Landing:** `url_destino` con la URL publicada de la landing.
   - Sin intereses ni públicos en el testeo: Meta encuentra al comprador con el creativo.

## 6. Los anuncios (los que pide la ficha en cada conjunto)
1. `ads_ver_fuentes {producto_id}`: el inventario de lo que se puede adjuntar (la biblioteca del producto y las imágenes generadas).
2. Por cada pieza de la tabla «Creativos por conjunto» (con Lean 1, una por conjunto; si la pieza ya está en Finalizado del tablero, `despliegue_campana_ubicar {producto_id, pieza_id, conjunto_id}`):
   - Si aparece en `ads_ver_fuentes`: `ads_agregar_creativo {conjunto_id, fuente, fuente_ref, url_original, mime_kind, thumbnail_url, angulo, ad_texto_principal, ad_titulo, ad_descripcion, ad_cta}`, con los datos tal cual vienen de `ads_ver_fuentes`.
   - Si no aparece: `ads_subir_creativo {conjunto_id, nombre: "<nombre>.mp4", url: <URL de la biblioteca>, angulo, ad_texto_principal, ad_titulo, ad_descripcion}`.
   - **Nunca un archivo que no esté en la biblioteca del producto:** súbelo primero (paso 9).
3. **El copy de cada anuncio** (sin precio, nunca):
   - `ad_texto_principal`: unos 125 caracteres. El gancho del ángulo, el beneficio, «🚚 Envío gratis · 💵 Pagas al recibir» y el regalo con 2, si hay.
   - `ad_titulo`: hasta 40 caracteres.
   - `ad_descripcion`: hasta 30.
   - Sin promesas médicas ni atributos personales («¿Sufres de…?»).
4. **El texto prellenado (WhatsApp):** `ads_editar_creativo {creativo_id, chat_autofill: "Hola, quiero el <producto> del video 😊"}`. Lleva una palabra clave del vínculo del agente (paso 11) y es distinto por ángulo. Anótalo en LANZAMIENTO.md: `ads_ver_testeo` no lo muestra y el embudo lo usa.
5. **Los nombres:** `angulo` pisa el nombre del anuncio. Revisa con `ads_ver_creativo {creativo_ids: [...]}` y corrige con `ads_editar_creativo {creativo_id, ad_name}`. Si un anuncio queda sin texto principal, queda bloqueado.

### Con Lean 2: el equipo de 5 anuncios
En vez de una pieza por conjunto, el conjunto lleva **5 anuncios, uno por nivel de conciencia del cliente** (1 no sabe que tiene el problema, 2 ya lo siente, 3 compara soluciones, 4 conoce el producto y duda, 5 quiere comprar). Cada anuncio sale **3-2-2**: 3 imágenes o 3 videos (sin mezclar), 2 textos y 2 títulos, que Meta combina dentro del mismo anuncio.
1. **El concepto:** `product_ver_estrategia {producto_id}` › `conceptos`. Si no hay ninguno, guárdalo primero (paso 7).
2. **Cuánto cuesta:** `ads_equipo_generar {conjunto_id, concepto_id, solo_estimar: true}` y díselo al usuario: consume créditos (el texto una vez y cada imagen).
3. **Armarlo:** `ads_equipo_generar {conjunto_id, concepto_id}` devuelve un `run_id`; el avance y el resultado se leen con `ads_equipo_ver {run_id}`. Cada anuncio pasa una revisión (precio y condiciones iguales a la oferta de Projection, nada inventado, una sola idea) y el que no la pasa vuelve con el motivo: repítelo con `niveles: [n]` y una `indicacion`.
4. **A mano,** con piezas que ya están en la biblioteca: `ads_agregar_creativo` con la pieza principal y su `nivel_conciencia`, más `piezas_extra`, `textos_extra` y `titulos_extra`. Se completa o se corrige con `ads_editar_creativo {creativo_id, piezas_extra, textos_extra, titulos_extra, nivel_conciencia}` (y `pieza_reemplazar` o `pieza_quitar`).
5. **El precio:** la imagen va sin precio, como siempre. En Lean 2 los **textos** sí dicen para quién es y desde cuánto: es el filtro del método y sale de la oferta de Projection.
6. **Clientes que ya compraron:** la app los deja afuera sola al publicar. Si el ensayo o la publicación avisan que no pudo (faltan las condiciones de públicos personalizados de Meta), pásale al usuario el enlace del aviso: aceptarlas es un clic suyo.

## 7. Las conversiones
Sin esto, Meta optimiza por gente que escribe y no por compradores.
1. `ads_conectar_conversiones {campania_id, pixel_id, chat_proyecto_id}`.
2. `ads_probar_conversiones {campania_id}`: `llegan` y `con_atribucion` en `true`.
3. Si falla por falta de acceso avanzado a la API de Meta, no se arregla reintentando: díselo al usuario y anótalo como riesgo.

## 8. Verificar y ensayar
1. `despliegue_campana_ver {producto_id}` y `ads_ver_testeo {producto_id}`: la estrategia elegida, cada conjunto con los creativos y el presupuesto que pide su ficha, el `plan_meta` (los dos CPA reales) y los `avisos` (resuélvelos).
2. **El ensayo:** `ads_publicar {campania_id, activar: true}` **sin `confirmado`**. Devuelve el plan (qué se publica, presupuesto diario y moneda) sin publicar nada. Si trae errores o `bloqueado_por`, corrígelos y repite.
   - Si dice `bloqueado_por: "whatsapp_destino"`, se repite con `whatsapp_numero` (el del proyecto).
   - El aviso de «la página no aparece vinculada» no frena la publicación.
3. Marca las casillas del paso 12 en LANZAMIENTO.md.

**Publicar con `confirmado: true` es del paso 13, con el «sí» del usuario.**

## 9. Cuándo apagar y cuándo escalar cada anuncio
Lo deciden **las reglas de corte de la marca** y la ficha de la estrategia, no un número de esta skill. Léelas antes de publicar (`ads_reglas_corte {marca_id}`) y dile al usuario en una línea qué va a pasar: con cuánto gasto sin venta se apaga un anuncio, cuándo se revisa la página en vez del anuncio y en qué tramo del CPA se escala. Vienen con valores por defecto sacados del historial de anuncios de producto físico en Systems Lean (277 anuncios, septiembre a noviembre de 2026):
1. **Señal temprana:** con ½ CPA de equilibrio gastado y el anuncio caro (CPC del enlace alto contra el ticket, CPM alto, CTR del enlace bajo o, en mensajes, la conversación cara) → se apaga.
2. **CTR alto sin ventas → no se apaga:** el clic llega y no compra. Se revisa la landing, el chat y la oferta.
3. **Sin venta:** a 1 CPA de equilibrio se apaga, salvo métricas sanas, que siguen hasta 1,5; a 1,5 se apaga siempre.
4. **Con ventas, los tramos del CPA,** atados al equilibrio real de cada producto: debajo del tramo agresivo se escala fuerte; en «con cuidado», subidas chicas; en «revisar», no se escala y se busca el cuello de botella; arriba, se evalúa apagar.

**Con Lean 2 estas reglas no corren por anuncio:** la app juzga el **conjunto** con topes (tope = CPA objetivo de la hoja), nunca apaga un anuncio suelto, pausa el conjunto o le baja el presupuesto sola y pide el OK para subirlo. Cuándo pasa cada cosa está en su ficha (`ads_ver_estrategias`) y en `skills_leer {modulo: "ads_lean", rama: "lean-2"}`.

El usuario las cambia en la campanita de la campaña; tú, con `ads_reglas_corte {marca_id, accion: "guardar", reglas}` solo si él lo pide. Las ventas son los pedidos del CRM, no las compras del píxel. Apagar y bajar se hace y se avisa; subir o encender siempre espera su OK. Lo que sigue después de publicar está en el paso 14 ([lectura.md](lectura.md)).
