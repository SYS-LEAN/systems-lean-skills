# Paso 12 · La campaña de testeo en Ads Lean

Pide antes `sl_como_trabajar {tarea: "armar una campaña de testeo en Meta para un producto contra entrega"}`. Este paso arma todo **en pausa** y termina con un ensayo de publicación sin errores. Publicar es el paso 13, con el OK del usuario.

Este camino ya trae la estrategia (directa por ángulos, ABO) y su regla de presupuesto (paso 5 › «Presupuesto del testeo»). No le presentes otras estrategias aunque la guía del conector lo pida: díselo en una línea en el mensaje del OK. El `presupuesto_testeo` de `ads_ver_testeo` va solo como referencia, al lado del tuyo.

## La estructura
- **Campaña ABO** (presupuesto por conjunto), de testeo.
- **Un conjunto por ángulo** (los del paso 7), de 3 a 5.
- **Cada conjunto con 2 anuncios del mismo ángulo:** su video y su imagen (paso 9).
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
**No los fijes en la campaña.** Desde el 2026-11-21 Ads Lean lee solos el CPA de equilibrio y el CPA objetivo **reales** de la hoja de Projection, por venta confirmada, con costos, devolución, cancelación y la meta (`projection_ver_simulador › cpa_real`). Un `ads_editar_campania {breakeven_cpa}` o `{cpa_objetivo}` deja un número fijo que queda viejo y tapa el plan: la barra de la campaña, la copa de ganador y las reglas de corte juzgarían con él. Si una campaña ya tiene uno fijado, devuélvelo con `ads_editar_campania {campania_id, breakeven_auto: true, cpa_objetivo_auto: true}`. Fíjalos a mano solo si el usuario lo pide.

## 4. Los conjuntos
Por cada ángulo: `ads_crear_conjunto {campania_id, descriptor: "Ángulo · <ángulo>", presupuesto_diario}`. **`presupuesto_diario` va en la moneda de la hoja** (COP en Colombia), no en dólares: es el CPA de equilibrio dividido entre los conjuntos, y nunca menos del equivalente a US$5 con la tasa que anotaste en el paso 5. Mándalo siempre: sin él, cada conjunto toma 1 CPA entero y la campaña gasta de 3 a 5 veces lo previsto. Anota cada `conjunto_id` en LANZAMIENTO.md.

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
   - **Nunca un archivo que no esté en la biblioteca del producto:** súbelo primero (paso 9).
3. **El copy de cada anuncio** (sin precio, nunca):
   - `ad_texto_principal`: unos 125 caracteres. El gancho del ángulo, el beneficio, «🚚 Envío gratis · 💵 Pagas al recibir» y el regalo con 2, si hay.
   - `ad_titulo`: hasta 40 caracteres.
   - `ad_descripcion`: hasta 30.
   - Sin promesas médicas ni atributos personales («¿Sufres de…?»).
4. **El texto prellenado (WhatsApp):** `ads_editar_creativo {creativo_id, chat_autofill: "Hola, quiero el <producto> del video 😊"}`. Lleva una palabra clave del vínculo del agente (paso 11) y es distinto por ángulo. Anótalo en LANZAMIENTO.md: `ads_ver_testeo` no lo muestra y el embudo lo usa.
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
3. Marca las casillas del paso 12 en LANZAMIENTO.md.

**Publicar con `confirmado: true` es del paso 13, con el «sí» del usuario.**

## 9. Cuándo apagar y cuándo escalar cada anuncio
Reglas por defecto sacadas del historial de anuncios de producto físico en Systems Lean (277 anuncios, septiembre a noviembre de 2026). En la app son las **reglas de corte de la marca**: las usan los avisos y las pausas de la campaña, la copa de ganador, Despliegue creativo (columna Ganadores y la escala) y el CPA objetivo de Projection. El usuario las cambia en la campanita de la campaña; tú las lees y cambias con `ads_reglas_corte {marca_id}`. Las ventas son los pedidos del CRM, no las compras del pixel. «Ticket» es el pedido promedio del producto; «equilibrio» y «objetivo» son los dos CPA reales del paso 5 (sección 7 de `oferta-y-cpa.md`).

1. **Con ½ CPA de equilibrio gastado, señal mala → se apaga el anuncio** (mensajes y web por igual):
   - CPC del enlace > **0,75 % del ticket** (con ticket de L 800, L 6; de L 1,100, L 8; lo ideal es 0,5 % o menos);
   - CPM > **L 170**;
   - CTR del enlace < **2 %**;
   - en mensajes, además, costo por conversación > **L 25**.
2. **CTR de más de 3 % sin ventas → no se apaga:** el clic llega y no compra. Se revisa la landing y la oferta.
3. **1 CPA de equilibrio sin venta → se apaga**, salvo métricas sanas (CPC ≤ 0,5 % del ticket y, en mensajes, conversación ≤ L 15), que siguen hasta 1,5 equilibrios. **1,5 sin venta → se apaga siempre.**
4. **Con ventas, los tramos del CPA** (por anuncio; por campaña con 3 ventas o más). Se dicen en % del ticket para un producto cuyo CPA de equilibrio real es ~24,5 % del ticket, y **se atan al equilibrio real de cada producto**: 12 / 18 / 23 % del ticket = 49 / 73 / 94 % del CPA de equilibrio.
   - **debajo de 49 % del equilibrio** (12 % del ticket) → escalar agresivo: surfing ×2 cada 24 h si se sostiene, duplicar el conjunto, otra cuenta, CBO de escala;
   - **49–73 %** (12–18 %) → escalar con cuidado: subidas de 20 a 50 % y vigilar; sin duplicar. El tope de este tramo es el **CPA objetivo**;
   - **73–94 %** (18–23 %) → no escalar y revisar (cuello de botella, oferta, creativo);
   - **arriba de 94 %** → evaluar apagar; con 2 ventas o más se apaga.
   - Ejemplo: un producto de L 849 con equilibrio real de L 278 (33 % del ticket) corta en L 136 / L 204 / L 261, no en L 102 / L 153 / L 195. Sin CPA real calculado, se usan los % del ticket tal cual.

Apagar y bajar se hace y se avisa al usuario; subir presupuesto o encender siempre espera su OK.
