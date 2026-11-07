# Una sola oferta y los dos CPA

## La oferta
- **Siempre se vende 1 unidad**, pero con un precio que hace ver el paquete de 2 como la gran oferta.
  - Se busca que el de 1 deje casi lo mismo por pedido que el de 2.
  - Si para eso el precio del de 1 queda desproporcionado frente al mercado, va al techo del rango del mercado (paso 3) y que deje algo.
- **El paquete de 2 queda dentro del rango del mercado** del país. El de 3, un escalón más barato por unidad.
- **Regalo (opcional), para justificar el precio y empujar el de 2:**
  - Va con los paquetes de 2 y 3, nunca con el de 1.
  - Digital (una guía en PDF) o físico (un producto barato del mismo proveedor).
  - En Projection es un `bonus`: digital con `archivo_url` y `is_digital: true`; físico con `is_digital: false`, su costo, `id_proveedor` (su id en Dropi) y `cantidad_minima`.
  - Nunca se crea como producto ni como complementario de precio 0.
- **Las opciones de precio que le das al usuario salen de `projection_simular`,** nunca de otra calculadora.

## Projection
Pide `sl_como_trabajar` con «costos y ofertas del producto» y carga:
- Costo del proveedor y flete real: `quote_shipping` en Dropi, o el flete por ciudad de `soydrop_producto_ver`.
- Fulfillment 0, salvo que el usuario lo pague.
- Contra entrega.
- **30 % de devolución y 5 % de cancelación.**
- Paquetes con `share_pct` 45 / 40 / 15 (1, 2 y 3 unidades) hasta que haya pedidos reales.
- Envío gratis.
- Margen objetivo: 15 % como piso.

## Los dos CPA
Son dos números distintos y no se cambian uno por otro. Los dos son **por venta confirmada** y ya descuentan la devolución.

| | CPA de equilibrio | CPA objetivo |
|---|---|---|
| Qué es | Lo máximo que se puede pagar por venta sin ganar ni perder | Lo que se puede pagar por venta dejando el margen objetivo |
| Para qué | El presupuesto del testeo y el límite de «vende pero no es rentable» | Declarar ganador y escalar |
| Piso | **US$15**: si da menos, el producto no aguanta la prueba. Antes de descartarlo, prueba un precio más alto o un combo | Margen de 15 % |

**Cómo salen:** del motor (`projection_simular`).
- `breakeven_cpa` de Projection es por entrega. Para pasarlo a venta confirmada: × (0,95 × 0,70), menos k sobre lo cobrado por pedido, menos la confirmación (cf × 0,95). Eso da el CPA por pedido; ÷ 0,95 da el CPA por venta confirmada.
- El CPA objetivo, igual, con el margen objetivo.
- Se reportan en la moneda del país y en US$ frente al piso de US$15. Si queda debajo, se dice en una línea y decide el usuario.

**La cuenta, para revisar:**

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

## Presupuesto del testeo
- **1 CPA de equilibrio al día para toda la campaña**, repartido entre los conjuntos.
- **Ningún conjunto con menos de US$5 al día:** conjuntos = CPA de equilibrio ÷ US$5, redondeado hacia abajo, entre 3 y 5.
- **Topes:** US$200 al día por campaña y US$500 por cuenta, sumando todo lo encendido. Pasarlos necesita el OK del usuario.
