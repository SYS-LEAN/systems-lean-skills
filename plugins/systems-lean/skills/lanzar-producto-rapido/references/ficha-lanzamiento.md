# Plantilla: la ficha del lanzamiento

Cópiala al empezar en `~/SystemsLean/productos/<producto>-<país>/LANZAMIENTO.md` (carpeta en minúsculas y con guiones, por ejemplo `faja-moldeadora-co`). Reemplaza lo que va entre `< >`.

**Cómo se usa:**
- Al cerrar cada paso, marca sus casillas `[x]` y escribe al lado el dato y la lectura que lo comprueba (por ejemplo: «3 paquetes 45/40/15 · `projection_ver_ofertas` 14:20»).
- Una casilla solo se marca después de leer lo guardado con la tool de lectura, nunca porque «la tool de guardar respondió ok».
- Si algo no se puede hacer, se deja `[ ]` con «FALTA: <por qué>» y se le dice al usuario en la auditoría (paso 13).
- Es el primer archivo que se lee si el chat se corta o el contexto se compacta.

---

```markdown
# <Nombre comercial> · <País> · lanzamiento

> Estado: <en curso | esperando al usuario | esperando OK | publicado | apagado>. Inicio: <AAAA-MM-DD HH:MM>. Agente: <Claude Code | Codex | Antigravity>.

## Datos
| Campo | Valor |
|---|---|
| Unidad de Negocio | <nombre> |
| Proveedor | <Dropi país | Soydrop> · id <…> · <link a la ficha> |
| Ítem de la Biblioteca y de la Lista de Testeo | <nombre> · turno <…> |
| Producto en Product Lean | <nombre> (código <…>) |
| Hoja de Projection | id del simulador <…> · moneda <…> · escenarios: <nombre (escenario_id / producto_escenario_id)…> |
| Canal | <WhatsApp | landing> |
| Proyecto de Chat Lean | <nombre> · número <país> |
| Landing | <URL publicada, si hay> |
| Campaña | <nombre visible en Ads Lean> |
| Carpeta en la PC | ~/SystemsLean/productos/<producto>-<país>/ |

## Ficha del SKU (paso 1)
- Proveedor, tipo y código:
- Presentación (tamaño, color, tapa o gatillo, caja, contenido):
- Lo que dice la etiqueta, tal cual:
- Stock vendible hoy: <n> · Costo proveedor: <…> · Precio sugerido: <…> · Bodega: <…>
- Flete real: <ciudad 1: …, ciudad 2: …> · Comisión del proveedor sobre lo cobrado (k): <…%>
- Variantes:

## Checklist del lanzamiento

### Paso 0 · Preparación
- [ ] Requisitos de la primera vez revisados (`~/SystemsLean/requisitos.md`)
- [ ] `sl_como_trabajar` leído con la tarea
- [ ] Unidad de Negocio elegida o creada (`marca_ver`)
- [ ] Ramas de conocimiento propias del usuario leídas si existen (`skills_listar`)
- [ ] Cuenta publicitaria, página y píxel (`ads_ver_conexion`)
- [ ] Número de WhatsApp del proyecto (`chat_proyectos_ver`, `chat_salud_ver`)
- [ ] Extensión de Chrome de Systems Lean instalada
- [ ] Editor instalado (`npm run tipos` sin errores)
- [ ] Llave de Gemini probada (`node scripts/analizar.mjs --probar`), o el usuario decidió seguir sin ella
- [ ] Tabla «qué hay / qué falta», si el producto ya existía

### Paso 1 · La ficha viva y la Biblioteca
- [ ] Ficha viva leída hoy (`list_products` o `soydrop_producto_ver`)
- [ ] Fotos reales miradas y ficha del SKU escrita arriba
- [ ] Stock alcanza (≥ ~210 unidades) o el usuario decidió seguir
- [ ] En la Biblioteca con sus fotos importadas (`product_biblioteca_guardar` o el botón de la extensión): <n> creativos
- [ ] En la Lista de Testeo (`product_favoritos_ver`)

### Paso 2 · Investigar
- [ ] Producto creado desde su ítem, una sola vez (`product_biblioteca_investigar`)
- [ ] Fotos del proveedor en Creativos de Inspiración (`anuncios_ver_biblioteca_creativos`)
- [ ] Vínculo con el proveedor (`dropi_producto_vincular` o `product_vincular_soydrop`)
- [ ] Inventario de Dropi registrado (`dropi_inventario_registrar`), si es Dropi
- [ ] Fila de la lista enlazada (`fila_de_origen` en `product_ver_investigacion`)
- [ ] Checklist de 15 criterios (`product_evaluar_checklist`): <score> <color>
- [ ] Viabilidad: nombre comercial, nicho, país, 2+ referencias (`product_completar_viabilidad`)
- [ ] Hasta 3 fotos limpias, sin infografías (`product_guardar_fotos`)
- [ ] Keywords del comprador por país (`product_guardar_keywords`)
- [ ] Nombre fácil y estado (`product_editar {nombre_llamadas, status}`)

### Paso 3 · La investigación del usuario y lo tuyo
- [ ] Mensaje al usuario con qué capturar y los tres ofrecimientos
- [ ] Lo que capturó, por nodo (`product_ver_extraccion`)
- [ ] Ofrecimiento 1 · anunciantes para seguir (tabla abajo), si lo pidió
- [ ] Ofrecimiento 2 · 10-15 referencias de otros mercados en la biblioteca, con fuente, anunciante y días; la landing que más vende capturada (`landing_captura_crear`), si lo pidió
- [ ] Ofrecimiento 3 · formatos en tendencia, si lo pidió
- [ ] Competencia del país destino (tabla abajo)
- [ ] Marcados los que «NO CORREN EN <PAÍS>»

### Paso 4 · El informe
- [ ] Cada creativo analizado y descrito (`media_describir_creativo`)
- [ ] Landings, Marketplace y comentarios leídos
- [ ] 5 ángulos dominantes, 3 ofertas, precios por anunciante, destino, formato y nivel de conciencia (`product_ver_informe`, rama competencia)
- [ ] Nivel de conciencia del mercado (`awareness`)
- [ ] Creencias con su fuente (`creencias`)
- [ ] Mapa de dolores 1-5, dominante y desatendido si hay evidencia (`dolores`)

### Paso 5 · Projection
- [ ] Las 7 preguntas respondidas: <resumen>
- [ ] País y moneda de la hoja
- [ ] Costo, flete, fulfillment, cobro, 5 % cancelación y 30 % devolución (`projection_ver_simulador`)
- [ ] Precio psicológico, tachado y unidad suelta (o por qué no)
- [ ] Paquetes con `share_pct` (`projection_ver_ofertas`)
- [ ] Ofertas elegidas (envío gratis, regalo como `bonus` con `cantidad_minima: 2`, garantía…)
- [ ] Escenarios pedidos (`projection_escenarios_ver`): <nombres>
- [ ] Control de precio contra el mercado (abajo)
- [ ] CPA de equilibrio por venta confirmada: <moneda> · <US$>
- [ ] CPA objetivo: <moneda> · <US$>
- [ ] Presupuesto diario y número de conjuntos

### Paso 6 · Ficha, entrega y cobertura
- [ ] Ficha técnica con sus fotos de AliExpress en su carpeta (`product_guardar_ficha_tecnica`)
- [ ] Entrega propia: tiempos, empaque, garantía (`product_guardar_entrega`)
- [ ] Cobertura con zonas excluidas resueltas (`product_guardar_cobertura`)
- [ ] Ficha del agente con variables, sección 4 corta y preguntas bien cerradas (`product_ver_ficha`)
- [ ] Ficha propia de cada escenario que vende algo distinto

### Paso 7 · Ángulos y perfiles
- [ ] 3-5 ángulos completos (`anuncios_ver_angulos_venta`): <av1 …, av2 …, av3 …>
- [ ] 1-2 perfiles de comprador

### Paso 8 · Canal
- [ ] Tabla de puntajes y decisión: <WhatsApp | landing> porque <…>

### Paso 9 · Creativos
- [ ] Por ángulo: 1 video (editado en la PC) + 1 imagen (del generador de la app) (tabla abajo)
- [ ] Plan mostrado al usuario en los modos 2, 3 y 4
- [ ] 6 videos de reserva marcados «RESERVA»
- [ ] Hoja de cuadros revisada en cada video
- [ ] Todo en la biblioteca con línea de origen y uso (`media_listar`, `anuncios_ver_generados`)

### Paso 10 · Landing (si hay)
- [ ] Preguntas de la landing respondidas
- [ ] Creada con su producto y atada a su escenario (`landing_escenario`)
- [ ] Bloques en el orden del método, imágenes hechas en la app (`landing_ver`)
- [ ] Checkout del país y zonas sin cobertura (`store_checkout_ver`)
- [ ] Tracking de la marca (`marca_ver`)
- [ ] Publicada y revisada con `?sl_test=1`

### Paso 11 · WhatsApp
- [ ] Producto vinculado al agente, activo, con keywords (`chat_agente_productos_ver`)
- [ ] Video demo, foto en la mano, imagen de la promoción, capturas y audios listos
- [ ] Voces de recordatorios guardadas (`crm_voz_cliente`)
- [ ] Embudo guardado con su escenario, validado y publicado (`chat_flujos_ver`)
- [ ] Revisión del embudo: 0 `[[` en el grafo, `chat_flujo_publicar` sin `avisos_oferta`, `chat_simular` sin variables vacías
- [ ] Confirmación creada, cableada y publicada
- [ ] Plantillas de Meta aprobadas (`chat_plantillas_ver`)
- [ ] Flujos viejos del mismo producto en pausa
- [ ] Simulaciones: cada prellenado, precio, original, «solo uno», «los 2 con datos»

### Paso 12 · Campaña
- [ ] Campaña ABO creada, objetivo mensajes o ventas (`ads_ver_testeo`)
- [ ] Los dos CPA cargados
- [ ] Un conjunto por ángulo, ≥ US$5 cada uno
- [ ] Cada conjunto con su video y su imagen, copy sin precio y texto prellenado
- [ ] Targeting: país, 18+, zonas sin cobertura excluidas, chat del proyecto
- [ ] Conversiones conectadas y probadas (`ads_probar_conversiones`)
- [ ] Ensayo de `ads_publicar` sin errores

### Paso 13 · Auditoría y publicación
- [ ] Auditoría en verde (o lo rojo dicho al usuario)
- [ ] OK del usuario: «<texto literal>» <fecha y hora>
- [ ] Publicada y verificada en Meta
- [ ] Ids de los anuncios en el flujo y en el agente
- [ ] Primer chat real leído

## Anunciantes para seguir (paso 3)
| Anunciante | País | Link a sus anuncios | Landing | Activos | Días del más viejo | Qué mirar |
|---|---|---|---|---|---|---|

## Competencia del país (paso 3)
| Anunciante | Link a sus anuncios | Activos | Días del más viejo | Destino (WhatsApp / landing) | Ángulo más usado | Oferta y precios |
|---|---|---|---|---|---|---|

## Control de precio contra el mercado (paso 5)
| Paquete | Nuestro precio | Rango del mercado | Diferencia | Qué la justifica |
|---|---|---|---|---|

## Creativos por conjunto (paso 9)
| Conjunto | Ángulo | Video (origen, días, URL de la biblioteca) | Imagen (lote) | Texto prellenado |
|---|---|---|---|---|

## Lo que sabemos
- <hallazgos que cambian el plan>

## Riesgos
- <empaque distinto, modismos del audio, marca o réplica, stock justo…>

## Créditos gastados
- Estimado: <…> · Real: <…> (`cuenta_ver`: créditos usados antes y después)

## Próximo paso
- <qué sigue, quién y cuándo>
```
