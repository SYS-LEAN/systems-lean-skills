# Pasos 3 y 4 · La investigación del usuario, lo que buscas tú y el informe

**Lo que el usuario captura a mano con la extensión de Chrome es la materia prima del informe:** anuncios reales de su mercado, sus landings, Marketplace, AliExpress y los comentarios. Tú no lo reemplazas: lo pides bien, lo complementas y lo analizas. **Todo lo que encuentres se guarda en la app.** Una investigación que solo queda en el chat no le sirve a ningún paso siguiente.

## Paso 3 · La investigación del usuario y lo que buscas tú

### 3.1 Antes del mensaje
- `product_ver_extraccion {producto_id}` sin `fuente`: qué capturó ya el usuario y de qué nodos (Meta Ads, AliExpress, Amazon, FB Marketplace, comentarios, TikTok…).
- `anuncios_ver_biblioteca_creativos {producto_id}`: lo que ya está en Creativos de Inspiración (además de las fotos del proveedor).
- Si ya hay suficiente (anuncios del país destino y de los países de referencia), no lo vuelvas a pedir: díselo y pasa a 3.3 con lo que él quiera que busques.

### 3.2 El mensaje al usuario (uno solo)
**Lo que le toca a él**, con los enlaces armados con las keywords del paso 2:
- **Biblioteca de anuncios de Meta** del país destino y de los países de referencia: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=<PAÍS>&q=<keyword>&search_type=keyword_unordered&media_type=all`.
  - Que guarde en Creativos de Inspiración los videos y las imágenes que le parezcan, con el botón de la extensión.
  - Que extraiga los resultados de la búsqueda: quedan en la extracción con anunciante, días activo, texto y landing.
- **AliExpress:** la ficha del producto, con las fotos del slider.
- **Marketplace de Facebook** del país (no es obligatorio): da la demanda y el precio informal.
- **Comentarios** de los videos con más alcance en TikTok, YouTube o Instagram (botón «Extraer»).
- Dile por qué importa: con eso salen los ángulos, las ofertas y las objeciones reales de su mercado.
- **A qué producto lo guarda:** que en la extensión elija «<nombre comercial>» (el del paso 2) antes de capturar. Lo que quede en otro producto o sin producto no aparece en `product_ver_extraccion` de este.

**Y tres ofrecimientos, para que elija** (puede decir que sí a los tres):
1. **Anunciantes para seguir:** una lista de 5 o más marcas o páginas que venden lo mismo o algo parecido y que conviene estudiar (embudo, ofertas, creativos), con el enlace a sus anuncios, su landing y por qué cada una.
2. **Los mejores anuncios y landings de otros mercados:** buscas y guardas en Creativos de Inspiración los mejores anuncios de video e imagen del mismo producto o de similares, y la landing que más vende. Siempre de mercados distintos al país destino que tengan autoridad para tomar ideas (ángulos, formatos, embudos).
3. **Formatos en tendencia:** de 3 a 5 formatos o estilos de video o imagen que están dando tracción estos meses, en orgánico o en pauta, aunque sean de otro rubro, si ves cómo adaptarlos a este producto o a sus ángulos.

Espera su respuesta. Si dice que no puede hacer su parte, haces tú también la búsqueda del país (3.4) y lo anotas como límite del informe.

### 3.3 Lo que buscas tú (según lo que eligió)
**Herramientas de búsqueda** (usa las que tenga conectadas, en este orden):

| Fuente | Tool | Para qué |
|---|---|---|
| TrendTrack (si lo tiene) | sus tools de anuncios y tiendas | Los anuncios que más escalan y las tiendas con más visitas y ventas en otros mercados |
| Dropkiller (si lo tiene) | `search_ads {q, countryCodes: ["<país>"], mediaType: "video" \| "image", sort: "duration", maxStaleDays: 7, mode: "full"}` | Anuncios con `videoUrl` (el archivo) y `landingUrl` |
| | `get_ad_creatives` | Mirar los creativos como imágenes sin bajarlos (hasta 10 anuncios por llamada) |
| | `get_ad_transcripts` | Lo que se DICE: el gancho de 3 s y el guion |
| | `search_ad_publishers`, `list_store_ads` | Los anunciantes y todos los anuncios de una tienda |
| Biblioteca de Meta (conector) | `ads_library_search` | Anunciantes, anuncios activos y días. Máximo 50 por búsqueda: haz varias (el nombre del producto, lo que hace, el problema que resuelve) y luego por `page_ids` |
| Navegador del agente | La Biblioteca de Meta en la web | Si no hay conectores (el enlace de 3.2) |

**Ofrecimiento 2, los mejores de otros mercados:**
1. **Dónde:** primero los países de referencia del mismo idioma, después los demás.
2. **Por cada anuncio:** días activo o vistas, réplicas, ángulo, gancho, idioma, si su **empaque es igual al nuestro** (tamaño, color, tapa, caja) y si ya lo pauta alguien en el país destino (la misma duración ± 3 s y el mismo primer cuadro: si ya corre, va a reserva o fuera).
3. **Cantidad:** de 10 a 15 creativos guardados. Entre los videos, al menos 3 «listos para pautar»: mismo producto, mismo empaque, audio en el idioma de venta y que no corran en el país.
4. **La landing que más vende** (la de más visitas y ventas en TrendTrack, o la del anunciante con más días y réplicas): `landing_captura_crear {url, producto_id}`. El servidor la captura y sus imágenes quedan en Creativos de Inspiración. Responde con `captura_id` y tarda uno o dos minutos: `landing_captura_ver {captura_id}` hasta que diga `lista`. Sirve después para modelar la landing (paso 10).

**Ofrecimiento 1, anunciantes para seguir:** la tabla «Anunciantes para seguir» de LANZAMIENTO.md: nombre, país, enlace a todos sus anuncios (`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=<PAÍS>&view_all_page_id=<page_id>&search_type=page&media_type=all`), landing, activos, días del más viejo y qué mirar de él.

**Ofrecimiento 3, formatos en tendencia:** una lista con el formato, un ejemplo con enlace, por qué funciona y cómo se adapta a este producto. Los que se puedan, guárdalos en Creativos de Inspiración como los demás.

### 3.4 La competencia del país destino
Si la extracción del usuario no la trae completa, la mides tú con las mismas herramientas. Una fila por cada página que vende el mismo producto (o resuelve el mismo problema) en el país, en la tabla de LANZAMIENTO.md:

| Anunciante | Link a sus anuncios | Activos hoy | Días del más viejo | Destino | Ángulo más usado | Oferta y precios |
|---|---|---|---|---|---|---|

Mide **el producto Y el nicho**: son dos filtros distintos. Solo cuentan los anunciantes de ecommerce del producto; lo demás se ignora.

### 3.5 Guardar cada referencia en Creativos de Inspiración
Con sus datos de origen. Usa una de estas opciones:

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

### 3.6 Cierre del paso
- `product_ver_extraccion {producto_id}` y `anuncios_ver_biblioteca_creativos {producto_id}`: lo capturado y lo guardado.
- Marca las casillas del paso 3 en LANZAMIENTO.md y llena sus tablas.

## Paso 4 · El informe de investigación

### 4.1 Analizar cada creativo y guardar su descripción
Cada video e imagen de Creativos de Inspiración (los del usuario y los tuyos) se analiza una vez y su descripción queda guardada en la app. **Así no se repite el análisis** en los creativos, la landing ni el chat.
1. Mira la `descripcion` que trae `anuncios_ver_biblioteca_creativos`: si ya tiene un análisis suficiente, no lo repitas.
2. **Imágenes:** míralas tú.
3. **Videos:** `get_ad_transcripts` de Dropkiller si viene de ahí. Si no, con la llave de Gemini del usuario: `node scripts/analizar.mjs "<video o url>" --salida "<carpeta>/investigacion/<nombre>.txt"` ([editor.md](editor.md)) da en UNA llamada la transcripción con segundos y el análisis (nunca cuadro por cuadro). Si no hay ninguna de las dos, el usuario escucha el video y te dice qué se oye.
4. **Busca la oferta y el precio** en el video, en el audio y en el texto del anuncio, con precisión: son los datos más fieles de lo que ofrece la competencia.
5. **Cruza las fuentes:** las descripciones del anuncio que trae la extracción de Meta con los videos guardados del mismo anunciante, y los comentarios con su video. Si no cuadran, dilo.
6. **Guarda la descripción:** `media_describir_creativo {creativo_id, descripcion}`. Reemplaza la anterior. Detallada, porque la usan otros pasos:
   - **Primero la línea de origen y uso**, por ejemplo:
     - «OTRO MERCADO · México · MISMO PRODUCTO · NO CORRE EN <PAÍS> (verificado <fecha>) · LISTO PARA PAUTAR»;
     - «LOCAL · <país> · competencia · MODELO, NO PARA PAUTAR TAL CUAL»;
     - «RESERVA» (los que quedan para renovar).
   - **Debajo, el análisis:** copy del anuncio (texto, título, CTA) · guion o transcripción · textos en pantalla · formato y duración · escenas · gancho, cuerpo y cierre · ángulo · nivel de conciencia · oferta y precio que se ven o se dicen · anunciante · días.
   - Para corregir el anunciante, los días o las variantes: `media_editar_creativo {creativo_id, …}`.

### 4.2 Las landings, Marketplace y los comentarios
- **Las landings de la competencia:** las URLs vienen en la extracción de Meta (`product_ver_extraccion {producto_id, fuente: "meta_ads"}`). Ábrelas y saca precios, ofertas y ángulos.
  - Se lee la página sin enviar nada: el HTML, `/<producto>.js` en tiendas Shopify, o las variables de los formularios contra entrega (`_RSI_COD_FORM_QUANTIY_OFFERS` de Releasit, `EASYSELL_QUANTITY_OFFERS` de EasySell).
  - **Nunca envíes un formulario ni hagas un pedido de prueba.**
  - Si casi todos mandan a WhatsApp y hay pocas webs, complementa con una búsqueda web de tiendas que venden el producto en el país.
- **Marketplace:** `product_ver_extraccion` con la `fuente` de ese nodo, tal como la nombra el resumen. Da la demanda y el precio informal.
- **Los comentarios:** `product_ver_extraccion {producto_id, fuente: "video_comments", limit: 1, offset, comentarios_por_video, respuestas_por_comentario}`. Un video con cientos de comentarios pesa: léelos de a uno. Busca:
  - las objeciones dichas tal cual;
  - lo que ya probaron y les falló;
  - las preguntas que más se repiten y las que más reacciones tienen.
  - Sirven para la ficha (paso 6) y para los ángulos (paso 7).

### 4.3 Lo que tiene que dejar el informe
| # | Qué | Dónde va en `product_guardar_informe` |
|---|---|---|
| 1 | **5 ángulos dominantes**, del 1 al 5, el 1 el mejor, con su evidencia | `competencia.angulos_ranking` |
| 2 | **Las 3 estrategias de oferta más usadas**, del 1 al 3, con el tipo claro (por cantidad, complementos, regalos, garantía, envío gratis, 2x1…) y el detalle | `competencia.ofertas_ranking` |
| 3 | **Precios y ofertas por anunciante**, de mayor a menor, marcando a quién le va mejor (días activo y cantidad de anuncios; visitas y ventas de su tienda si tienes TrendTrack) | `competencia.competidores[]` con `precio`, `oferta`, `dias_corriendo_max` y `anuncios_activos_total` |
| 4 | **Destino:** % que vende por WhatsApp, landing o fanpage. Muestra qué destino está saturado y cuál desatendido | `competencia.distribucion_destino` |
| 5 | **Formato:** % de imagen y de video, y qué formato usan en cada nivel de conciencia | `competencia.distribucion_formato` y `competencia.formato_por_nivel_conciencia` |
| 6 | **Nivel de conciencia que ataca la competencia**, en % sobre el 100 % de lo analizado | `competencia.distribucion_nivel_conciencia` |
| 7 | **Nivel de conciencia del mercado real** | `awareness` |
| 8 | **Creencias más comunes** del producto o del nicho, **solo con fuente comprobada** (comentarios, foros, reseñas, artículos), nunca de memoria | `creencias` |
| 9 | **Mapa de dolores:** al menos 5, del 1 al 5 (el 1 el más intenso), el dominante y el que nadie atiende, solo si hay evidencia | `dolores` (`ranking`, `dolor_dominante`, `oportunidad_no_atendida`) |

- El **mecanismo** no va.
- Si falta evidencia para una fila, se omite y se dice. Nada se inventa para llenar.

### 4.4 Guardar el informe
1. `product_ver_informe {producto_id}` sin rama: el índice y lo que ya existe.
2. `product_guardar_informe {producto_id, ramas: {competencia, awareness, dolores, creencias}, fuentes_consultadas, limitaciones, nota_alcance}`. La descripción de la tool trae todos los campos.
   - **`competencia.evidencia_origen {tipo: "producto" | "referencia" | "categoria" | "capturas", query_usada, pais_code}`: siempre y primero.** `producto` si viste anuncios del mismo producto; `categoria` si solo del rubro.
   - `anuncios_mercado {muestra, total_estimado_texto}`, `saturacion` (saturado | competido | espacio_libre) y `competidores_detectados`.
   - **Números como número** (45, no «45 anuncios»). Lo que no sepas se omite entero. Revisa `avisos_formato` en la respuesta.
   - Cada rama que mandas **reemplaza** la anterior.
3. Opcional: los datos de marketplaces o tiendas que leíste, con `captura_productos_registrar {producto_id, source, items}`, sin inventar campos.
4. **Comentarios de redes:** `product_extraer_comentarios` depende de un ejecutor interno y no está disponible para usuarios. Usa los que el usuario extrajo y los visibles de los anuncios.

### 4.5 Cierre del paso
- `product_ver_informe {producto_id, rama: "competencia"}` (y las otras ramas): con números y sus listas.
- `anuncios_ver_biblioteca_creativos {producto_id}`: cada creativo con su `descripcion`.
- Marca las casillas del paso 4 en LANZAMIENTO.md.
- Al usuario, en 3 líneas: el rango de precios del mercado, la oferta que más se usa y los ángulos que se ven más fuertes.
