# Plantilla: la ficha del lanzamiento

Cópiala al empezar en `~/SystemsLean/productos/<producto>-<país>/LANZAMIENTO.md` (carpeta en minúsculas y con guiones, por ejemplo `faja-moldeadora-co`). Reemplaza lo que va entre `< >`.

**Cómo se usa:**
- Al cerrar cada paso, marca sus casillas `[x]` y escribe al lado el dato y la lectura que lo comprueba (por ejemplo: «3 paquetes 45/40/15 · `projection_ver_ofertas` 14:20»).
- Una casilla solo se marca después de leer lo guardado con la tool de lectura, nunca porque «la tool de guardar respondió ok».
- Si algo no se puede hacer, se deja `[ ]` con «FALTA: <por qué>» y se le dice al usuario en la auditoría (paso 11).
- Es el primer archivo que se lee si el chat se corta o el contexto se compacta.

---

```markdown
# <Nombre comercial> · <País> · lanzamiento

> Estado: <en curso | esperando OK | publicado | apagado>. Inicio: <AAAA-MM-DD HH:MM>. Agente: <Claude Code | Codex | Antigravity>.

## Datos
| Campo | Valor |
|---|---|
| Unidad de Negocio | <nombre> |
| Proveedor | <Dropi país | Soydrop> · id <…> · <link a la ficha> |
| Producto en Product Lean | <nombre> (código <…>) |
| Ítem en la Lista de Testeo | <posición> |
| Hoja de Projection | moneda <…> |
| Canal | <WhatsApp | landing> |
| Proyecto de Chat Lean | <nombre> · número <país> |
| Landing | <URL publicada, si hay> |
| Campaña | <nombre visible en Ads Lean> |
| Carpeta en la PC | ~/SystemsLean/productos/<producto>-<país>/ |

## Ficha del SKU (paso 1)
- Proveedor y código:
- Presentación (tamaño, color, tapa o gatillo, caja, contenido):
- Lo que dice la etiqueta, tal cual:
- Stock vendible hoy: <n> · Costo proveedor: <…> · Precio sugerido: <…>
- Flete real: <ciudad 1: …, ciudad 2: …> · Comisión del proveedor sobre lo cobrado (k): <…%>
- Variantes:

## Checklist del lanzamiento

### Paso 0 · Preparación
- [ ] `sl_como_trabajar` leído con la tarea
- [ ] Unidad de Negocio elegida (`ver_tienda` / `marca_ver`)
- [ ] Ramas de conocimiento propias del usuario leídas si existen (`skills_listar`)
- [ ] Cuenta publicitaria, página y píxel (`ads_ver_conexion`)
- [ ] Número de WhatsApp del proyecto (`chat_proyectos_ver`, `chat_salud_ver`)
- [ ] Editor instalado (`npm run tipos` sin errores)
- [ ] Tabla «qué hay / qué falta», si el producto ya existía

### Paso 1 · Producto y stock
- [ ] Ficha viva leída hoy (`list_products` o `soydrop_producto_ver`)
- [ ] Fotos reales miradas y ficha del SKU escrita arriba
- [ ] Stock alcanza (≥ ~210 unidades) o el usuario decidió seguir

### Paso 2 · Lista de Testeo y alta
- [ ] Ítem en la Biblioteca y en la Lista de Testeo (`product_favoritos_ver`)
- [ ] Producto creado una sola vez (`product_crear`)
- [ ] Vínculo con el proveedor (`soydrop.vinculado: true` o `dropi_producto_vincular`)
- [ ] Inventario de Dropi registrado (`dropi_inventario_registrar`), si es Dropi
- [ ] Ítem de la lista enlazado a su producto (`producto_investigado_id` en `product_favoritos_ver`)
- [ ] Checklist de 15 criterios (`product_evaluar_checklist`): <score> <color>
- [ ] Viabilidad: nicho, país, referencias (`product_completar_viabilidad`)
- [ ] Hasta 3 fotos limpias (`product_guardar_fotos`)
- [ ] Keywords del comprador (`product_guardar_keywords`)
- [ ] Nombre fácil y estado (`product_editar {nombre_llamadas, status}`)

### Paso 3 · Investigación
- [ ] Tabla de anunciantes del país (abajo)
- [ ] Rango de precios por paquete con números
- [ ] Ofertas de la competencia leídas (paquetes, regalos, envío)
- [ ] 10-15 referencias en la biblioteca con fuente, anunciante, días y descripción (`anuncios_ver_biblioteca_creativos`)
- [ ] Ganadores del mismo producto afuera, comparados con nuestro empaque
- [ ] Marcados los que «NO CORREN EN <PAÍS>»
- [ ] Rama Competencia del informe (`product_ver_informe`)
- [ ] Ramas de conciencia, dolores y creencias, si hubo con qué llenarlas

### Paso 4 · Ángulos y perfiles
- [ ] 3-5 ángulos completos (`product_ver_estrategia`): <av1 …, av2 …, av3 …>
- [ ] 1-2 perfiles de comprador

### Paso 5 · Oferta y Projection
- [ ] País y moneda de la hoja
- [ ] Costo, flete, fulfillment, contra entrega, 5 % cancelación y 30 % devolución (`projection_ver_simulador`)
- [ ] Precio, tachado y unidad suelta
- [ ] 3 paquetes con `share_pct` 45/40/15 (`projection_ver_ofertas`)
- [ ] Envío gratis
- [ ] Regalo como `bonus` con `cantidad_minima: 2` (si hay)
- [ ] Control de precio contra el mercado (abajo)
- [ ] CPA de equilibrio por venta confirmada: <moneda> · <US$>
- [ ] CPA objetivo: <moneda> · <US$>
- [ ] Presupuesto diario y número de conjuntos

### Paso 6 · Ficha, entrega y cobertura
- [ ] Ficha técnica (`product_guardar_ficha_tecnica`)
- [ ] Entrega propia: tiempos, empaque, garantía (`product_guardar_entrega`)
- [ ] Cobertura con zonas excluidas resueltas (`product_guardar_cobertura`)
- [ ] Ficha del agente con variables, sin cifras escritas (`product_ver_ficha`)

### Paso 7 · Canal
- [ ] Tabla de puntajes y decisión: <WhatsApp | landing> porque <…>
- [ ] Si es landing: publicada, checkout del país, píxel, revisada con `?sl_test=1`

### Paso 8 · Creativos
- [ ] Por ángulo: 1 video + 1 imagen terminados (tabla abajo)
- [ ] 6 videos de reserva marcados «RESERVA»
- [ ] Hoja de cuadros revisada en cada video
- [ ] Todo en la biblioteca con línea de origen y uso (`media_listar`)

### Paso 9 · WhatsApp
- [ ] Producto vinculado al agente, activo, con keywords (`chat_agente_productos_ver`)
- [ ] Video demo, foto en la mano, imagen de la promoción y audios en la biblioteca
- [ ] Voces de recordatorios guardadas (`crm_voz_cliente`)
- [ ] Embudo guardado, validado y publicado (`chat_flujos_ver`)
- [ ] Confirmación creada, cableada y publicada
- [ ] Plantillas de Meta aprobadas (`chat_plantillas_ver`)
- [ ] Flujos viejos del mismo producto en pausa
- [ ] Simulaciones: cada prellenado, precio, original, «solo uno», «los 2 con datos»

### Paso 10 · Campaña
- [ ] Campaña ABO creada, objetivo mensajes (`ads_ver_testeo`)
- [ ] Los dos CPA cargados
- [ ] Un conjunto por ángulo, ≥ US$5 cada uno
- [ ] Cada conjunto con su video y su imagen, copy sin precio y texto prellenado
- [ ] Targeting: país, 18+, zonas sin cobertura excluidas, chat del proyecto
- [ ] Conversiones conectadas y probadas (`ads_probar_conversiones`)
- [ ] Ensayo de `ads_publicar` sin errores

### Paso 11 · Auditoría y publicación
- [ ] Auditoría en verde (o lo rojo dicho al usuario)
- [ ] OK del usuario: «<texto literal>» <fecha y hora>
- [ ] Publicada y verificada en Meta
- [ ] Ids de los anuncios en el flujo y en el agente
- [ ] Primer chat real leído

## Anunciantes del país (paso 3)
| Anunciante | Link a sus anuncios | Activos | Días del más viejo | Destino (WhatsApp / landing) | Ángulo más usado | Oferta y precios |
|---|---|---|---|---|---|---|

## Control de precio contra el mercado (paso 5)
| Paquete | Nuestro precio | Rango del mercado | Diferencia | Qué la justifica |
|---|---|---|---|---|

## Creativos por conjunto (paso 8)
| Conjunto | Ángulo | Video (origen, días, URL de la biblioteca) | Imagen (URL de la biblioteca) | Texto prellenado |
|---|---|---|---|---|

## Lo que sabemos
- <hallazgos que cambian el plan>

## Riesgos
- <empaque distinto, modismos del audio, marca o réplica, stock justo…>

## Créditos gastados
- Estimado: <…> · Real: <…>

## Próximo paso
- <qué sigue, quién y cuándo>
```
