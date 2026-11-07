# Paso 5 · Una sola oferta en Projection y los dos CPA

**Lo que importa de este paso:** la oferta queda GUARDADA en Projection. `projection_simular` solo calcula y no guarda nada; un lanzamiento con Projection vacío deja sin precios al flujo de WhatsApp, a la landing, a la ficha y a la campaña.

## La oferta
- **Siempre se vende 1 unidad**, con un precio que hace ver el paquete de 2 como la gran oferta.
  - Se busca que el de 1 deje casi lo mismo por pedido que el de 2.
  - Si para eso el de 1 queda desproporcionado frente al mercado, va al techo del rango del mercado (paso 3) y que deje algo.
- **El paquete de 2 queda dentro del rango del mercado** del país. El de 3, un escalón más barato por unidad.
- **Precio psicológico** (169.900, no 170.000) y **precio tachado** (el ancla) un 25-35 % arriba del de 1.
- **Envío gratis** y **pago al recibir**, siempre.
- **Regalo (opcional), para justificar el precio y empujar el de 2:**
  - Va con los paquetes de 2 y 3, nunca con el de 1 (`cantidad_minima: 2`).
  - Digital (una guía en PDF) o físico (un producto barato del **mismo proveedor y la misma bodega**, para que vaya en la misma caja).
  - En Projection es un `bonus`. **Nunca** se crea como producto ni como complementario de precio 0.
- **Las opciones de precio que le das al usuario salen de `projection_simular`,** nunca de otra calculadora.

## La secuencia en Projection (en este orden)
1. **El id del simulador:** `projection_ver_productos {}`. Busca la fila cuyo `producto_pl_id` es tu producto. Su `producto_id` es el **id del simulador**: todas las tools `projection_*` (salvo `projection_paises_*`) usan ese, no el de Product Lean.
2. **País y moneda:** la fila trae la `moneda`. Si está vacía o no es la del país, vuelve a `product_completar_viabilidad` con `pais_destino_code` (paso 2). Sin moneda, el agente de WhatsApp dice «$» en cualquier país.
3. **Lo que ya hay:** `projection_ver_simulador {producto_id}` y `projection_ver_ofertas {producto_id}`.
4. **Costos:** `projection_costos_producto {producto_id, costo_producto, costo_envio, costo_fulfillment: 0}`.
   - `costo_producto`: el precio del proveedor del paso 1.
   - `costo_envio`: el flete real (Dropi: ponderado 45/40/15 de `quote_shipping`; Soydrop: promedio de las 2 ciudades principales).
   - `costo_fulfillment`: 0, salvo que el usuario pague preparación.
5. **Cobro, tasas, precio y ancla:** `projection_aplicar {producto_id, precio, precio_ancla, mostrar_ancla: true, vender_suelto: true, modelo_cobro: "cod", tasa_cancelacion: 5, tasa_devolucion: 30, margen_objetivo: 15, unidades_mes}`.
   - Los porcentajes van como número de por ciento (5, no 0,05).
   - En contra entrega no se cobra pasarela: deja `pasarela_pct` en 0. La comisión del proveedor sobre lo cobrado (k) **no va en `pasarela_pct`:** se descuenta en la cuenta de los CPA (abajo).
   - `unidades_mes`: una estimación honesta (por ejemplo 10 pedidos al día = 300).
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
   - **Regalo digital:** sin `archivo_url` no se entrega. Sube el PDF con `media_subida_url {nombre: "guia.pdf", mime: "application/pdf"}` → PUT → `media_subida_confirmar` y usa la URL que devuelve. Si la app no acepta el PDF, díselo al usuario y deja el regalo como pendiente.
   - **El nombre del bonus es su llave:** si lo renombras, manda en la misma llamada `archivo_url` e `imagenes_urls`, o se pierden.
   - Cada tipo que mandas se reemplaza completo; la clave que no mandas no se toca.
8. **Verifica (obligatorio):**
   - `projection_ver_ofertas {producto_id}`: los 3 tiers con su `share_pct`, el envío gratis y el bonus con `cantidad_minima`.
   - `projection_ver_simulador {producto_id}`: costo, flete, contra entrega, 5 % y 30 %, precio y ancla; y los KPIs `breakeven_cpa`, `margen_neto_pct`, `ganancia_por_unidad`, `zona_semaforo` y `viabilidad_publicitaria`.
   - Si `viabilidad_publicitaria` dice que no es viable, díselo al usuario con lo que propone (ticket mínimo, combo o no pautar) antes de seguir.

## Control de precio contra el mercado
Antes de dar los precios por buenos, llena en LANZAMIENTO.md:

| Paquete | Nuestro precio | Rango del mercado | Diferencia | Qué la justifica |
|---|---|---|---|---|

Si el de 2 queda fuera del rango sin una razón (regalo, marca, calidad), se ajusta.

## Los dos CPA
Son dos números distintos y no se cambian uno por otro. Los dos son **por venta confirmada** y ya descuentan la devolución.

| | CPA de equilibrio | CPA objetivo |
|---|---|---|
| Qué es | Lo máximo que se puede pagar por venta sin ganar ni perder | Lo que se puede pagar por venta dejando el margen objetivo |
| Para qué | El presupuesto del testeo y el límite de «vende pero no es rentable» | Declarar ganador y escalar |
| Piso | **US$15**: si da menos, el producto no aguanta la prueba. Antes de descartarlo, prueba un precio más alto o un combo | Margen de 15 % |

**El `breakeven_cpa` de Projection NO va tal cual a la campaña:** es por entrega efectiva. Se convierte a venta confirmada con esta cuenta, usando los números guardados en la hoja:

CPA de equilibrio = e × [P × (1 − k) − C − ff] − F − cf
CPA objetivo = e × [P × (1 − k − m) − C − ff] − F − cf

| Letra | Qué es | Valor |
|---|---|---|
| e | Entrega de lo despachado (1 − devolución) | 0,70 |
| P | Ticket promedio con la mezcla de paquetes | de la hoja |
| k | Lo que se va sobre lo cobrado | Dropi Colombia: 2,4 % (retiro 2 % + 4×1000). Soydrop Honduras: 5 % (4 % del cobro + 1 % de servicio). Otro país: pregúntalo |
| m | Margen objetivo | 15 % como piso |
| C | Costo promedio del producto con la misma mezcla | de la hoja |
| ff | Fulfillment por entrega | 0 |
| F | Flete por despacho (la devolución no cobra otro) | el real |
| cf | Lo que cuesta confirmar cada pedido (llamada o mensaje) | el del usuario; si no lo sabe, 0, y se dice |

- Anota los dos en LANZAMIENTO.md en la moneda del país y en US$ (con la tasa de cambio que muestra la app o la del día, dicha).
- Si el de equilibrio queda bajo US$15, se dice en una línea y decide el usuario.
- **Si cambia el precio, el costo o el flete, se recalculan los dos** y se actualizan en la campaña (paso 10).

## Presupuesto del testeo
- **1 CPA de equilibrio al día para toda la campaña**, repartido entre los conjuntos.
- **Ningún conjunto con menos de US$5 al día:** conjuntos = CPA de equilibrio ÷ US$5, redondeado hacia abajo, entre 3 y 5.
- **Topes:** US$200 al día por campaña y US$500 por cuenta, sumando todo lo encendido. Pasarlos necesita el OK del usuario.

## Cierre del paso
Marca las casillas del paso 5 en LANZAMIENTO.md y dile al usuario en 2 líneas: la oferta (1 / 2 / 3 y el regalo) y los dos CPA con el presupuesto diario.
