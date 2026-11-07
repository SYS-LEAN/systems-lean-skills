# Paso 3 · Investigación: competencia, ganadores y la biblioteca de referencias

Dos subagentes en paralelo (o tú en orden): **A** mide la competencia del país y **B** busca los ganadores del mismo producto afuera. Lo que encuentren **se guarda en la app**: la tabla de anunciantes en el informe y los videos de referencia en la biblioteca del producto. Una investigación que solo queda en el chat no sirve para los pasos siguientes.

**Antes de buscar:** `product_ver_extraccion {producto_id}`. Si el usuario ya capturó anuncios, productos o comentarios con la extensión, eso manda y no se busca de nuevo. **El brief puede estar viejo:** la competencia se mide siempre en vivo.

## Herramientas de búsqueda (usa las que tenga el usuario)
| Fuente | Tool | Para qué |
|---|---|---|
| Biblioteca de anuncios de Meta (conector) | `ads_library_search` | Anunciantes del país, anuncios activos, días. Máximo 50 por búsqueda: haz varias (el nombre del producto, la búsqueda genérica de lo que hace, el problema que resuelve) y luego por `page_ids` para contar los activos de cada página |
| Dropkiller (conector, si lo tiene) | `search_ads {q, countryCodes: ["<país>"], mediaType: "video", sort: "duration", maxStaleDays: 7, mode: "full"}` | Anuncios con `videoUrl` (la URL del archivo) y `landingUrl` |
| | `get_ad_creatives` | Mirar los creativos como imágenes sin bajarlos (hasta 10 anuncios por llamada) |
| | `get_ad_transcripts` | Lo que se DICE: gancho de 3 s y guion. Reemplaza transcribir |
| | `search_ad_publishers`, `list_store_ads` | Anunciantes y todos los anuncios de una tienda |
| Navegador del agente | La Biblioteca de Meta en la web | Si no hay conectores: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=<PAÍS>&q=<búsqueda>&search_type=keyword_unordered&media_type=all` |
| El usuario | — | Si nada de lo anterior está, pídele los enlaces de los anunciantes que conoce |

## A · Competencia del país (subagente 1)
1. **Anunciantes.** Por cada página que vende el mismo producto (o el mismo problema) en el país, una fila de la tabla de LANZAMIENTO.md:

| Anunciante | Link a sus anuncios | Activos hoy | Días del más viejo | Destino | Ángulo más usado | Oferta y precios |
|---|---|---|---|---|---|---|

   - Link a todos sus anuncios: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=<PAÍS>&view_all_page_id=<page_id>&search_type=page&media_type=all`.
   - Destino: WhatsApp o landing (la URL sin parámetros).
2. **Las ofertas de cada landing** (paquetes, regalo por paquete, envío, garantía, precio tachado):
   - Lee la página sin enviar nada: el HTML de la landing, `/<producto>.js` en tiendas Shopify, o las variables de los formularios contra entrega (`_RSI_COD_FORM_QUANTIY_OFFERS` de Releasit, `EASYSELL_QUANTITY_OFFERS` de EasySell).
   - **Nunca envíes un formulario ni hagas un pedido de prueba.**
3. **El rango de precios por paquete** (1, 2 y 3 unidades), con números. Es la base del paso 5.
4. **Los 3 ángulos** que más duran y el que nadie toca.

## B · Ganadores del mismo producto afuera (subagente 2)
1. **Dónde:** primero los países que venden en el mismo idioma; después los demás. Meta, Dropkiller y TikTok.
2. **Por cada video:** días activo o vistas, ángulo, gancho, idioma, si su **empaque es igual al nuestro** (tamaño, color, tapa, caja) y si ya lo pauta alguien en el país.
3. **¿Ya corre en el país?** Compáralo con los anuncios de los anunciantes del país (A): la misma duración (± 3 s) y el mismo primer cuadro. Si ya corre, va a reserva o fuera.
4. **Cantidades:** de 5 a 10 ganadores analizados, y al menos 3 «listos para pautar» (mismo producto, mismo empaque, audio en el idioma de venta, no corre en el país).

## Guardar las referencias en la biblioteca del producto (los dos subagentes)
Cada video o imagen que sirva de modelo o de material **se guarda en Creativos de Inspiración del producto**, con sus datos de origen. De 10 a 15 en total.

**Opción 1 (recomendada): `captura_creativo_guardar`.** El servidor descarga el archivo al momento, antes de que venza la URL firmada:
```
captura_creativo_guardar {
  destino: "creativos", producto_id,
  media_url: "<URL directa del archivo (videoUrl de Dropkiller o la del video en la Biblioteca)>",
  media_type: "video" | "image",
  provider: "meta" | "tiktok" | "instagram",
  ad_id, advertiser_name, url_anunciante, texto_anuncio, cta_text, cta_link,
  metrics: { dias_activo, likes }
}
```
Revisa `persistido` y `estado_descarga`: si sale `failed`, vuelve a leer la URL y repite.

**Opción 2:** `media_subir {url, producto_id, fuente, anunciante, dias_activo, variantes, texto_anuncio, url_anunciante, cta_link}`, con los datos de origen en la misma llamada (se corrigen después con `media_editar_creativo`). `fuente` lleva solo la plataforma (`meta`, `tiktok`, `instagram`), nunca el nombre de la herramienta de espionaje.

**Opción 3 (si el archivo ya está en la PC):** `media_subida_url` → PUT → `media_subida_confirmar` (ver [editor.md](editor.md) › «Subir»).

**Después, la descripción de cada uno:** `media_describir_creativo {creativo_id, descripcion}` (el id sale de la respuesta o de `anuncios_ver_biblioteca_creativos {producto_id}`). Reemplaza la anterior. Empieza siempre con la **línea de origen y uso**, y debajo el análisis:
- Línea de origen y uso, por ejemplo:
  - «OTRO MERCADO · Colombia · MISMO PRODUCTO · NO CORRE EN <PAÍS> (verificado <fecha>) · LISTO PARA PAUTAR»
  - «LOCAL · <país> · competencia · MODELO, NO PARA PAUTAR TAL CUAL»
  - «RESERVA» (los que quedan para renovar)
- Análisis: copy del anuncio (texto, título, CTA) · guion o transcripción · textos en pantalla · formato y duración · escenas · gancho / cuerpo / cierre · ángulo · anunciante · días.
- Para corregir anunciante, días o variantes: `media_editar_creativo {creativo_id, …}`.

**Transcribir sin pagar:** `get_ad_transcripts` de Dropkiller. Si no, con la llave de Gemini del usuario: sube el video a la File API de Gemini y pide en UNA llamada la transcripción con segundos y el análisis (nunca cuadro por cuadro). Si no hay ninguna, el usuario escucha el final de cada video y te dice qué se oye.

## El informe en Product Lean
1. `product_ver_informe {producto_id}` sin rama: muestra el índice y lo que ya existe.
2. `product_guardar_informe {producto_id, ramas: {...}, fuentes_consultadas, limitaciones, nota_alcance}`. La descripción de la tool trae todos los campos. Lo mínimo:
   - **`competencia`** (obligatoria):
     - `evidencia_origen {tipo: "producto" | "referencia" | "categoria", query_usada, pais_code}`: **siempre y primero**. `producto` si viste anuncios del mismo producto; `categoria` si solo del rubro.
     - `anuncios_mercado {muestra, total_estimado_texto}`, `saturacion` (saturado | competido | espacio_libre), `competidores_detectados`.
     - `competidores[]`: `{nombre, page_id, anuncios_en_muestra, anuncios_activos_total, dias_corriendo_max, angulos[], landing_url, landing_tipo}` y los precios que viste.
     - `ofertas_ranking[]` (las 3 estrategias de oferta más usadas), `distribucion_destino[]` (WhatsApp / landing, suma 100), `distribucion_formato`.
   - **`dolores`, `awareness` y `creencias`:** solo si hubo con qué llenarlas (anuncios, comentarios de los anuncios, reseñas). Lo que no tenga evidencia se omite: no se inventa.
   - **Números como número** (45, no «45 anuncios»). Lo que no sepas se omite entero. Revisa `avisos_formato` en la respuesta.
   - Cada rama que mandas **reemplaza** la anterior.
3. Opcional: datos de marketplaces o tiendas que leíste, con `captura_productos_registrar {producto_id, source, items}`, sin inventar campos.

**Comentarios de redes:** `product_extraer_comentarios` depende de un ejecutor interno y no está disponible para usuarios. Usa los comentarios visibles de los anuncios que encuentres.

## Cierre del paso
- `anuncios_ver_biblioteca_creativos {producto_id}`: las referencias con fuente, anunciante, días y descripción.
- `product_ver_informe {producto_id, rama: "competencia"}`: la rama con números.
- Marca las casillas del paso 3 en LANZAMIENTO.md y llena la tabla de anunciantes.
- Al usuario, en 2 líneas: el rango de precios del mercado y los 3 ángulos que vas a probar.
