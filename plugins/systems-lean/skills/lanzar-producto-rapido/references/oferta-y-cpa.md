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
7. ¿Estás de acuerdo con **5 % de cancelaciones y 25 % de devoluciones en Honduras, o 30 % en Colombia y los demás países**? (Solo contra entrega.)

Si responde «lo que propongas», sigue con tu propuesta.

## 2. Los valores por defecto
- **Pasarela:** 0 en contra entrega (la app no la cobra). En pago anticipado, 5 %.
- **k** (lo que el proveedor se queda de lo cobrado): no va en `pasarela_pct`. Se descuenta en la cuenta de los CPA (abajo).
- **Mezcla de paquetes sin pedidos todavía:** 45 % una unidad, 40 % dos y 15 % tres (45/55 si no hay paquete de 3). En cuanto el producto tenga pedidos, se cambia por la mezcla real.
- **Publicidad:** en contra entrega no se fija un %. El CPA objetivo sale del margen objetivo (abajo) y el % de publicidad es el resultado.
- **Tasas:** en Honduras, 25 % de devolución y 5 % de cancelación; en Colombia y los demás, 30 % y 5 %; si el usuario tiene las suyas, las suyas.

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
5. **Cobro, tasas, precio y ancla:** `projection_aplicar {producto_id, precio, precio_ancla, mostrar_ancla: true, vender_suelto: true, modelo_cobro: "cod", tasa_cancelacion: 5, tasa_devolucion: 25 en Honduras o 30 en los demás, margen_objetivo, unidades_mes}`.
   - Los porcentajes van como número de por ciento (5, no 0,05).
   - `margen_objetivo`: la utilidad mínima que dijo el usuario.
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
   - `projection_ver_simulador {producto_id}`: costo, flete, cobro, las tasas del país (5 % y 25 % en Honduras, 5 % y 30 % en los demás), precio y ancla; y los KPIs `breakeven_cpa`, `margen_neto_pct`, `ganancia_por_unidad`, `zona_semaforo` y `viabilidad_publicitaria`.
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
Son dos números distintos y no se cambian uno por otro. Los dos son **por venta confirmada** y ya descuentan la devolución.

| | CPA de equilibrio | CPA objetivo |
|---|---|---|
| Qué es | Lo máximo que se puede pagar por venta sin ganar ni perder | Lo que se puede pagar por venta dejando el margen objetivo |
| Para qué | El presupuesto del testeo y el límite de «vende pero no es rentable» | Declarar ganador y escalar |
| Piso | **US$15**: si da menos, el producto no aguanta la prueba. Antes de descartarlo, prueba un precio más alto o un combo | El margen que dijo el usuario (15 % por defecto) |

**El `breakeven_cpa` de Projection NO va tal cual a la campaña:** es por entrega efectiva. Se convierte a venta confirmada con esta cuenta, usando los números guardados en la hoja:

CPA de equilibrio = e × [P × (1 − k) − C − ff] − F − cf
CPA objetivo = e × [P × (1 − k − m) − C − ff] − F − cf

| Letra | Qué es | Valor |
|---|---|---|
| e | Entrega de lo despachado (1 − devolución) | 0,70 |
| P | Ticket promedio con la mezcla de paquetes | de la hoja |
| k | Lo que se va sobre lo cobrado | Dropi Colombia: 2,4 % (retiro 2 % + 4×1000). Soydrop Honduras: 5 % (4 % del cobro + 1 % de servicio). Otro país: pregúntalo |
| m | Margen objetivo | el del usuario; 15 % por defecto |
| C | Costo promedio del producto con la misma mezcla | de la hoja |
| ff | Fulfillment por entrega | 0 |
| F | Flete por despacho (la devolución no cobra otro) | el real |
| cf | Lo que cuesta confirmar cada pedido (llamada o mensaje) | el del usuario; si no lo sabe, 0, y se dice |

- Anota los dos en LANZAMIENTO.md en la moneda del país y en US$ (con la tasa de cambio que muestra la app o la del día, dicha).
- Si el de equilibrio queda bajo US$15, se dice en una línea y decide el usuario.
- **Si cambia el precio, el costo o el flete, se recalculan los dos** y se actualizan en la campaña (paso 12).
- Con escenarios, se calculan para cada uno.

## 8. Presupuesto del testeo
- **1 CPA de equilibrio al día para toda la campaña**, repartido entre los conjuntos.
- **Ningún conjunto con menos de US$5 al día:** conjuntos = CPA de equilibrio ÷ US$5, redondeado hacia abajo, entre 3 y 5.
- Si da menos de 3 (CPA de equilibrio bajo US$15 y el usuario decidió seguir), van 3 conjuntos de US$5: el presupuesto es US$15, y se dice en la misma línea. **Ese número de conjuntos es el de ángulos del paso 7.**
- **En la app, los presupuestos y los CPA van en la moneda de la hoja** (COP en Colombia, lempiras en Honduras), no en dólares: convierte con la tasa que anotaste.
- **Topes:** US$200 al día por campaña y US$500 por cuenta, sumando todo lo encendido. Pasarlos necesita el OK del usuario.

## 9. Cierre del paso
Marca las casillas del paso 5 en LANZAMIENTO.md y dile al usuario en 2 líneas: la oferta (1 / 2 / 3 y el regalo, y los escenarios si hay) y los dos CPA con el presupuesto diario.
