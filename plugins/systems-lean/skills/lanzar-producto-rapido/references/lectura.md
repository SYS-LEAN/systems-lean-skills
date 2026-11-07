# Leer el testeo

**Venta = pedido confirmado y no cancelado**, por landing o por WhatsApp, contado del CRM (`pedidos_ver` y `ads_ver_testeo`). El píxel, los pagos iniciados y las conversaciones no son venta. Para apagar o bajar, cada pedido «por confirmar» cuenta como 0,95 de venta; para escalar, solo las confirmadas.

| Cuándo | Condición | Qué se hace | ¿OK del usuario? |
|---|---|---|---|
| **A las 24 h** | Conjunto con 0 ventas | Se apaga el conjunto con sus anuncios y se avisa. Si tenía 3 pagos iniciados o más (o 3 conversaciones que llegaron a dar su ciudad o elegir la oferta), el aviso pide revisar la landing o el flujo | No, solo aviso |
| A las 24 h | Conjunto con 1 venta o más | Sigue | — |
| Cualquier día | 3 ventas o más y CPA por encima del CPA de equilibrio | Se apaga el conjunto: vende, pero pierde plata | No, solo aviso |
| Cualquier día | 3 o 4 ventas con CPA igual o menor al objetivo | Prometedor: se piden variantes de sus anuncios; no se le sube el presupuesto | No |
| Con 48 h al aire | **5 ventas con CPA igual o menor al CPA objetivo** | **Ganador:** se propone copiarlo a una campaña CBO de escala con 2 CPA objetivo al día. El original sigue en la ABO | **Sí** |
| A las 72 h | Gastó menos de 0,3 CPA objetivo | Meta no le dio entrega: se apaga y se relanza como conjunto nuevo, en pausa | Para encender, sí |
| Siempre | Lo encendido pasaría de US$200 al día en una campaña o de US$500 en la cuenta | Se propone con la suma | **Sí** |

- **Nunca se enciende ni se sube de noche** (22:00 a 7:00). Apagar sí, en cuanto se detecta.
- **Apagar y bajar no piden OK;** encender, subir y copiar a CBO, sí.
- Cada aviso cita sus números: «Apagué el conjunto del ángulo X: a las 24 h, 0 ventas y 1 pago iniciado».
- La campaña de testeo no se duplica ni se resetea: ahí mismo entran las tandas de renovación con la reserva.
