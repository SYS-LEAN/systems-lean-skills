# Meta neta, precio y presupuesto · Honduras

Con esto sale el **precio** del producto, los **paquetes** que hay que vender y la **publicidad** al mes y al día para que el producto deje una ganancia **neta**: después de publicidad, devoluciones, cancelaciones, gastos variables y la parte de gastos fijos que le toca. Se usa en el paso 5 (Projection), antes de guardar la oferta.

Los valores por defecto salen de las tiendas que venden con Systems Lean en Honduras, con datos reales de octubre y noviembre de 2026. **Si el usuario tiene los suyos medidos (tasas, CPA, gastos en Finanzas), mandan los suyos.**

## Valores por defecto (contra entrega, Honduras)
| Dato | Valor | Qué es |
|---|---|---|
| Devolución | **45 %** | De los pedidos que salen. Incluye lo que lleva más de 6 días sin entregarse y lo que el chat ya da por perdido |
| Cancelación | **10 %** | Cancelaciones del cliente: no confirmó, no pagó el anticipo o ya no quiso |
| Costo por pedido en publicidad (CPA) | **L 160** | Por pedido creado. Por producto anda entre L 110 y L 285. Por entrega sale en ≈ L 325 |
| Flete de una devolución | **L 120** | El flete de ida que se pierde |
| Gastos variables por pedido | **L 45** | Créditos del agente de IA del chat de WhatsApp (≈ L 40) y plantillas de WhatsApp (≈ L 5). Sin agente de IA ni WhatsApp, unos L 5–10 |
| Gastos fijos de la tienda | **Los de Finanzas** (`finanzas_resumen › fijos_mensuales`); sin dato, **L 4,000 al mes** | Suscripción de la app, número de WhatsApp y herramientas. Se reparten entre los productos activos (con 2 productos, L 2,000 cada uno) |
| **Meta** | **L 10,000 de ganancia neta por producto al mes** | Con ella se fija el precio. Los L 15,000 se alcanzan subiendo el volumen con el mismo precio |

## La cuenta
- **G** = lo que deja una entrega = precio cobrado − costo del producto − flete − comisión de contra entrega y servicio (lo que descuenta Soydrop o Dropi).
- **N** = pedidos creados al mes. Entregas = 0,495 × N; devoluciones = 0,405 × N.
- **Ganancia neta = 0,495·N·G − N·(CPA + variables + 48,6) − fijos del producto**
- **G necesaria = (meta + fijos del producto + N·(CPA + variables + 48,6)) ÷ (0,495·N)**

Con los valores por defecto (fijos L 2,000, variables L 45, CPA L 160):

| Pedidos al día | Pedidos al mes | G necesaria para L 10,000 netos | Publicidad al mes | Publicidad al día |
|---|---|---|---|---|
| 3 | 90 | **L 782** | L 14,400 | L 480 (≈ US$ 18) |
| 4 | 120 | **L 714** | L 19,200 | L 640 (≈ US$ 24) |
| 6 | 180 | **L 647** | L 28,800 | L 960 (≈ US$ 36) |

Con G ≈ L 715: 4 pedidos al día dejan unos **L 10,000** netos y 6 al día unos **L 16,000**.

## Cómo llegar a G ≈ L 700: precio, paquetes y ofertas
- Una entrega de una sola unidad suele dejar unos **L 400–450** con un precio cercano a L 1,000. **Con la unidad suelta la meta no sale.**
- **La oferta principal es el paquete de 2**, o el producto más un complemento del mismo proveedor y la misma bodega, para que vaya en la misma caja y no duplique el flete. Sube lo que deja cada entrega sin subir el CPA.
- **El precio de 1** va a donde deje al menos **L 550** y haga ver el de 2 como la gran oferta. El de 3, un escalón más barato por unidad.
- **G promedio con la mezcla** 45 % (1 unidad) / 40 % (2) / 15 % (3), o la real cuando haya pedidos: tiene que dar **≥ L 700**. Se calcula con `projection_simular` y se guarda con `projection_aplicar`.
- Si con los precios del mercado no se llega a **G L 700 ni con paquetes**, dile al usuario con el número que el producto no da la meta: se descarta o se vende como complemento de otro.
- **Para pasar de L 10,000 a L 15,000** se sube el volumen (de 4 a 6 pedidos al día), no el precio.

## Qué decirle al usuario (en la propuesta del paso 5)
Una línea con: el precio de 1, 2 y 3; la G promedio; los pedidos al día que hacen falta para L 10,000 netos; y la publicidad al día y al mes para sostenerlos. Ejemplo: «Para ganar L 10,000 netos al mes con este producto: 1 a L 1,099, 2 a L 1,699 y 3 a L 2,299 (deja L 720 por entrega en promedio); hacen falta 4 pedidos al día, con unos L 640 diarios de publicidad (L 19,200 al mes)».

## Presupuesto de escala
- Publicidad al mes = pedidos al mes × CPA; al día = ÷ 30.
- Es el presupuesto para **sostener** el volumen que da la meta. El de la **prueba** sigue el paso de la campaña (`campana.md`).
- Si el CPA real del producto sale distinto de L 160, recalcula con el suyo: con 4 pedidos al día, la G necesaria cambia unos L 2 por cada L 1 de CPA.
