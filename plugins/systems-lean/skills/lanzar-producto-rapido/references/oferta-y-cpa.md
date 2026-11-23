# Paso 5 · Projection: preguntas, oferta, escenarios y los dos CPA

**Lo que importa de este paso:** la oferta queda GUARDADA en Projection. `projection_simular` solo calcula y no guarda nada. Un lanzamiento con Projection vacío deja sin precios al flujo de WhatsApp, a la landing, a la ficha y a la campaña. **Los escenarios sirven para el chat y para la landing:** cada flujo y cada landing vende el escenario que se le ata.

Si el usuario tiene reglas propias: `skills_listar {modulo: "projection_lean"}` → `skills_leer` de la rama que aplique.

## 1. Las preguntas (un solo mensaje, con tu propuesta)
Con la investigación ya hecha, propón el precio, la oferta y los escenarios. **Guarda primero tu propuesta** (la secuencia de la sección 4) y, en UN mensaje, pídele que la confirme, cada pregunta con lo que pusiste. No esperes la respuesta para seguir con los pasos 6 a 10: si contesta otra cosa, corriges Projection y lo que salió de ella (la ficha, la imagen de la promoción, los CPA).
1. ¿Armo escenarios de **contra entrega y de pago anticipado**, o solo uno? (Propuesta por defecto: solo contra entrega.)
2. ¿Armo **escenarios para validar precio u oferta** (A/B)? Si sí, cuáles: por ejemplo, otro precio o otra oferta.
3. El **precio del proveedor** es <x>: ¿es ese o tienes otro? Si no lo tienes porque no salió de Dropi o de Soydrop, pídeselo.
4. ¿Qué **utilidad mínima** aceptas en este producto: 10 %, 15 %, 20 % u otra? (Propuesta: 15 %.)
5. ¿Cuántas **ventas al mes** crees que puedes hacer, o las estimo yo con la investigación?
6. ¿Qué **costo de envío promedio** pongo? Dale las opciones que cotizaste en el paso 1 (por ciudad y ponderado).
7. ¿Estás de acuerdo con **10 % de cancelaciones y 45 % de devoluciones en Honduras, o 5 % y 30 % en Colombia y los demás países**? (Solo contra entrega.)
8. **En Honduras:** ¿la meta es **L 10,000 de ganancia neta al mes** con este producto? ¿Tus gastos fijos son los de Finanzas (o L 4,000 al mes si no los tienes cargados) y usas el agente de IA del chat? Con eso sale el precio, los paquetes y la publicidad al día ([meta-neta-y-precio.md](meta-neta-y-precio.md)).

Si responde «lo que propongas», sigue con tu propuesta.

## 2. Los valores por defecto
- **Pasarela:** 0 en contra entrega (la app no la cobra). En pago anticipado, 5 %.
- **k** (lo que el proveedor se queda de lo cobrado): no va en `pasarela_pct`. Se descuenta en la cuenta de los CPA (abajo).
- **Mezcla de paquetes sin pedidos todavía:** 45 % una unidad, 40 % dos y 15 % tres (45/55 si no hay paquete de 3). En cuanto el producto tenga pedidos, se cambia por la mezcla real.
- **Publicidad:** en contra entrega no se fija un %. El CPA objetivo sale del margen objetivo (abajo) y el % de publicidad es el resultado.
- **Tasas:** en Honduras, 45 % de devolución y 10 % de cancelación; en Colombia y los demás, 30 % y 5 %; si el usuario tiene las suyas, las suyas.
- **Meta y precio en Honduras:** la G por entrega que pide la meta de L 10,000 netos (≈ L 700 con 4 pedidos al día) manda sobre la «utilidad mínima» del punto 4: si el 15 % de margen deja menos, el precio sube hasta llegar a la G necesaria o el producto no da la meta. La cuenta está en [meta-neta-y-precio.md](meta-neta-y-precio.md).

## 3. La oferta
- **Precio psicológico** siempre (169.900, no 170.000).
- **Precio tachado** (el ancla) cuando ayude, un 25-35 % arriba del de 1.
- **Se vende la unidad suelta,** con un precio que hace ver el paquete de 2 como la gran oferta.
  - Se busca que el de 1 deje casi lo mismo por pedido que el de 2.
  - Si para eso el de 1 queda desproporcionado frente al mercado, va al techo del rango del mercado (paso 4) y que deje algo.
  - **Solo si los números de la unidad suelta no salen,** se deja de vender suelta (`vender_suelto: false` en `projection_aplicar`). Díselo al usuario con el número.
- **El paquete de 2 queda dentro del rango del mercado** del país. El de 3, un escalón más barato por unidad.
- **Las seis ofertas de Projection** (paquetes, complementarios, regalos, 2x1, envío gratis y garantía): decide cuáles convienen con lo que encontraste (las 3 ofertas que más usa la competencia, en el informe) y confírmalo con el usuario. Si no conviene ninguna oferta, también es una decisión.
- **Envío gratis y pago al recibir** en contra entrega, salvo que el usuario decida cobrar el flete.
- **Regalo (opcional), para justificar el precio y empujar el de 2:**
  - Va con los paquetes de 2 y 3, nunca con el de 1 (`cantidad_minima: 2`).
  - Digital (una guía en PDF) o físico (un producto barato del **mismo proveedor y la misma bodega**, para que vaya en la misma caja).
  - En Projection es un `bonus`. **Nunca** se crea como producto ni como complementario de precio 0.
- **Las opciones de precio que le das al usuario salen de `projection_simular`,** nunca de otra calculadora.

## 4. La secuencia en Projection (en este orden)
1. **El id del simulador:** `projection_ver_productos {}` antes de crear escenarios: la fila cuyo `producto_pl_id` es tu producto (al principio hay una). Su `producto_id` es el **id del simulador**: todas las tools `projection_*` (salvo `projection_paises_*`) usan ese, no el de Product Lean. Anótalo en LANZAMIENTO.md: cada escenario agrega otra fila con el mismo nombre y el mismo `producto_pl_id`, y la principal es la que anotaste.
2. **País y moneda:** la fila trae la `moneda`. Si está vacía o no es la del país, vuelve a `product_completar_viabilidad` con `pais_destino_code` (paso 2). Sin moneda, el agente de WhatsApp dice «$» en cualquier país.
3. **Lo que ya hay:** `projection_ver_simulador {producto_id}` y `projection_ver_ofertas {producto_id}`.
4. **Costos:** `projection_costos_producto {producto_id, costo_producto, costo_envio, costo_fulfillment: 0}`.
   - `costo_producto`: el precio del proveedor que confirmó el usuario.
   - `costo_envio`: el flete que eligió el usuario (Dropi: ponderado 45/40/15 de `quote_shipping`; Soydrop: promedio de las 2 ciudades principales).
   - `costo_fulfillment`: 0, salvo que el usuario pague preparación.
5. **Cobro, tasas, precio y ancla:** `projection_aplicar {producto_id, precio, precio_ancla, mostrar_ancla: true, vender_suelto: true, modelo_cobro: "cod", tasa_cancelacion: 10 en Honduras o 5 en los demás, tasa_devolucion: 45 en Honduras o 30 en los demás, meta_ganancia_mes, margen_objetivo, unidades_mes}`.
   - Los porcentajes van como número de por ciento (5, no 0,05).
   - `meta_ganancia_mes`: la ganancia NETA al mes que quiere con este producto (pregunta 1 de este paso; en Honduras, L 10,000 si no dice otra). De ella salen los dos CPA y el presupuesto inicial.
   - `margen_objetivo`: la utilidad mínima que dijo el usuario (queda como segundo control).
   - En contra entrega deja `pasarela_pct` en 0.
   - `unidades_mes`: la del usuario o una estimación honesta (por ejemplo, 10 pedidos al día = 300).
6. **Simula antes de guardar la oferta:** `projection_simular {producto_id, precio, ofertas}` con 2 o 3 combinaciones de precios. Muéstrale al usuario las opciones en una tabla corta (paquete, precio, margen, CPA de equilibrio) si la decisión no es obvia.
7. **Guarda la oferta:** `projection_guardar_ofertas {producto_id, ofertas: {...}}`:
```json
{
  "tiers": [
    { "qty": 1, "precio": 99900,  "share_pct": 45 },
    { "qty": 2, "precio": 169900, "share_pct": 40 },
    { "qty": 3, "precio": 229900, "share_pct": 15 }
  ],
  "envio_gratis": { "threshold": 0, "cross_rate_pct": 100, "shipping_cost": 0 },
  "bonus": [
    {
      "nombre": "Guía <nombre> (PDF)",
      "is_digital": true, "costo_unit": 0, "attach_rate": 55, "valor_percibido": 39900,
      "archivo_url": "<URL pública del PDF>", "imagenes_urls": ["<mockup>"],
      "cantidad_minima": 2
    }
  ]
}
```
   - `precio` de cada tier es el **total del paquete**. `share_pct` 45/40/15 hasta que haya pedidos reales.
   - **Regalo físico:** `is_digital: false`, `costo_unit` (lo que cuesta), `id_proveedor` (su id en el proveedor), `attach_rate`, `valor_percibido`, `cantidad_minima: 2`.
   - **Regalo digital:** sin `archivo_url` no se entrega, y la biblioteca de la app no acepta PDF. Propónlo solo si el usuario ya tiene la guía con un enlace público que abra sin pedir permiso (Drive o Dropbox, «cualquiera con el enlace»): ese enlace va en `archivo_url`. El mockup (`imagenes_urls`) sí se hace en el generador de la app. Sin guía, regalo físico del mismo proveedor o ninguno.
   - **El nombre del bonus es su llave:** si lo renombras, manda en la misma llamada `archivo_url` e `imagenes_urls`, o se pierden.
   - Cada tipo que mandas se reemplaza completo; la clave que no mandas no se toca.
8. **Verifica (obligatorio):**
   - `projection_ver_ofertas {producto_id}`: los paquetes con su `share_pct`, el envío gratis y el bonus con `cantidad_minima`.
   - `projection_ver_simulador {producto_id}`: costo, flete, cobro, las tasas del país (Honduras 10 % de cancelación y 45 % de devolución; los demás 5 % y 30 %), precio y ancla; y los KPIs `breakeven_cpa`, `margen_neto_pct`, `ganancia_por_unidad`, `zona_semaforo` y `viabilidad_publicitaria`.
   - Si `viabilidad_publicitaria` dice que no es viable, díselo al usuario con lo que propone (ticket mínimo, combo o no pautar) antes de seguir.

## 5. Los escenarios (si el usuario los pidió)
El producto en sí es el primer escenario. Cada escenario más es una proyección completa del mismo producto: otro precio, otra oferta, otro cobro u otro proveedor.
1. **Crear:** `projection_escenario_guardar {producto_id, nombre, precio, precio_ancla, ofertas}`. Nace como copia de la hoja del producto y solo cambia lo que mandas. `nombre`: cómo se reconoce («B · 64.900 envío gratis»). Devuelve su `producto_escenario_id`.
2. **Todo lo demás del escenario se edita con su `producto_escenario_id`** como `producto_id` (no con el id del escenario):
   - costos y otro proveedor: `projection_costos_producto`;
   - el cobro y sus tasas: `projection_cobro_producto {producto_id: <producto_escenario_id>, modelo_cobro: "anticipado"}`;
   - la pasarela del pago anticipado: `projection_aplicar {producto_id: <producto_escenario_id>, pasarela_pct: 5}`.
   - Si `producto_escenario_id` viene en null, corre antes `projection_escenario_completar {escenario_id}`.
3. **Lo que solo esa oferta le dice al agente** (por ejemplo, «el envío se paga aparte»): `notas_oferta` en `projection_escenario_guardar`. Si la variante vende algo distinto, lleva su propia ficha (paso 6).
4. **Pago anticipado** exige PayPal conectado para la landing.
5. **Verifica:** `projection_escenarios_ver {producto_id}`: cada escenario con su oferta, sus KPIs y sin `snapshot_desactualizado`.
6. Anota en LANZAMIENTO.md el `escenario_id` de cada uno: el flujo (`chat_flujo_guardar {escenario_id}`) y la landing (`landing_escenario`) lo usan.

## 6. Control de precio contra el mercado
Antes de dar los precios por buenos, llena en LANZAMIENTO.md:

| Paquete | Nuestro precio | Rango del mercado | Diferencia | Qué la justifica |
|---|---|---|---|---|

Si el de 2 queda fuera del rango sin una razón (regalo, marca, calidad), se ajusta.

## 7. Los dos CPA
**La app los calcula sola y son los que valen:** `projection_ver_simulador {producto_id}` › `cpa_real` (y el `plan_meta` de `ads_ver_testeo`), para mensajes y para web. La meta del usuario se guarda con `projection_aplicar {producto_id, meta_ganancia_mes}` en la hoja del país (la principal, no un escenario de prueba) y mueve todo: las ventas que hacen falta, los dos CPA, los tramos, el techo y el plan del mes, el precio sugerido y el **presupuesto inicial**. Ads Lean los lee sin fijarlos en la campaña. La cuenta de abajo sirve para entenderlos y verificarlos; si no cuadra con la app, manda la app y se le dice al usuario.

Son dos números distintos y no se cambian uno por otro. Los dos son **por venta confirmada** y salen de la realidad, no de lo que muestra la campaña: ya dan por perdidas la devolución y la cancelación, y descuentan los gastos variables y la parte de gastos fijos del producto.

| | CPA de equilibrio | CPA objetivo |
|---|---|---|
| Qué es | Lo máximo que se puede pagar por venta sin ganar ni perder de verdad | Lo que se puede pagar por venta dejando la **meta neta** del producto (en Honduras, L 10,000 al mes) |
| Para qué | El presupuesto del testeo, el límite de «vende pero no es rentable» y el **techo de gasto al mes** de la campaña | Declarar ganador y escalar |
| Piso | **US$15**: si da menos, el producto no aguanta la prueba. Antes de descartarlo, prueba un precio más alto o un combo | Si queda en 0 o menos, el producto no da la meta a ese precio. El margen del usuario (15 % por defecto) queda como segundo control |

**El `breakeven_cpa` de Projection NO va tal cual a la campaña:** es por entrega efectiva y no trae los gastos fijos ni los variables. Se calcula con esta cuenta, usando los números guardados en la hoja:

m = e × [P × (1 − k) − C − ff] − F − cf − v   (lo que deja una venta confirmada antes de publicidad y fijos)
f = 0,735   (CPA objetivo = tope de «escalar con cuidado»: 18 % ÷ 24,5 % del equilibrio)
VC = (meta + fijos del producto × (1 − f)) ÷ (m × (1 − f))   (las ventas confirmadas que pide la meta)
CPA de equilibrio = m − fijos del producto ÷ VC
CPA objetivo = f × CPA de equilibrio
Techo de gasto al mes de la campaña = CPA de equilibrio × VC; lo que se invierte = CPA objetivo × VC

| Letra | Qué es | Valor |
|---|---|---|
| e | Entrega de lo despachado (1 − devolución) | Honduras 0,55 (45 % de devolución); Colombia y los demás 0,70 |
| P | Ticket promedio con la mezcla de paquetes | de la hoja |
| k | Lo que se va sobre lo cobrado | Dropi Colombia: 2,4 % (retiro 2 % + 4×1000). Soydrop Honduras: 5 % (4 % del cobro + 1 % de servicio). Otro país: pregúntalo |
| C | Costo promedio del producto con la misma mezcla | de la hoja |
| ff | Fulfillment por entrega | 0 |
| F | Flete por despacho (la devolución no cobra otro) | el real |
| cf | Lo que cuesta confirmar cada pedido (llamada o mensaje) | el del usuario; si no lo sabe, 0, y se dice |
| v | Gastos variables por venta confirmada: créditos del agente de chat, plantillas de WhatsApp | los del usuario; sin dato en Honduras, **L 50** (L 45 por pedido) |
| Fijos del producto | Gastos fijos del mes (Finanzas, `fijos_mensuales`) ÷ productos activos | sin dato, L 4,000 ÷ 2 = **L 2,000** |
| VC | Ventas confirmadas al mes que pide la meta | sale de la cuenta de arriba (desde el 2026-11-21 la meta decide el volumen; antes se fijaba en 108) |
| Meta | Ganancia neta del producto al mes | Honduras **L 10,000**; otro país, la que diga el usuario |

Ejemplo en Honduras (ticket promedio L 1,300, costo promedio L 450, flete L 120, confirmación 0 y gastos por defecto, meta L 10,000): m ≈ L 262; hacen falta ≈ 152 ventas confirmadas al mes (≈ 168 pedidos, 5,6 al día); equilibrio ≈ L 249, objetivo ≈ L 183, se invierten ≈ L 27,700 al mes (≈ L 920 al día) y el techo es ≈ L 37,700. La app hace esta cuenta sola en Projection (`projection_ver_simulador › cpa_real`), con el precio para la meta con 4 pedidos al día. La cuenta de precio y paquetes que pide la meta está en [meta-neta-y-precio.md](meta-neta-y-precio.md).

- Anota los dos en LANZAMIENTO.md en la moneda del país y en US$ (con la tasa de cambio que muestra la app o la del día, dicha).
- Si el de equilibrio queda bajo US$15, se dice en una línea y decide el usuario.
- **Si cambia el precio, el costo o el flete, se recalculan los dos** y se actualizan en la campaña (paso 12).
- Con escenarios, se calculan para cada uno.

## 8. Presupuesto del testeo y presupuesto inicial
- **El presupuesto por conjunto lo pone la ficha de la estrategia** (paso 12): `ads_ver_estrategias {producto_id, presupuesto_diario}` dice cuál conviene con lo que el usuario puede invertir al día y cuánto lleva cada conjunto. No se reparte a mano.
- **El presupuesto inicial** (`cpa_real.presupuesto_inicial`): la plata que el usuario tiene que tener para sostener la campaña hasta que se pague sola, porque en contra entrega el cobro llega días después y Meta cobra a diario. Trae `dia_autofinancia` (desde qué día lo que entra cubre lo que sale). Va en el mensaje de Projection y en el del OK (paso 13), en una línea: «Para arrancar necesitas tener L 4,834; desde el día 6 se paga sola».
- **En la app, los presupuestos y los CPA van en la moneda de la hoja** (COP en Colombia, lempiras en Honduras), no en dólares.
- **Topes:** US$200 al día por campaña y US$500 por cuenta, sumando todo lo encendido. Pasarlos necesita el OK del usuario.

## 9. Cierre del paso
Marca las casillas del paso 5 en LANZAMIENTO.md y dile al usuario en 2 líneas: la oferta (1 / 2 / 3 y el regalo, y los escenarios si hay), los dos CPA y el presupuesto inicial con el día en que se paga sola.
