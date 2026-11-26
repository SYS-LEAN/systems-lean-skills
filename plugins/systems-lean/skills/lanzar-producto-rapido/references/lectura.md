# Paso 14 · Operar el testeo: leer, cortar, encontrar el ganador, escalar y desplegar

Desde el 2026-11-22 este paso cubre todo lo que pasa después de publicar, hasta que el producto escala y se mantiene. **Las cifras no están aquí:** salen de la app, que es la única fuente.
- **La ficha de la estrategia de la campaña** (`ads_ver_estrategias {producto_id}`): cuándo se lee, cuándo se apaga, qué es ganador y cómo se escala (Lean 1, Lean 2 o Lean 3).
- **Las reglas de corte de la marca** (`ads_reglas_corte {marca_id}`): los cortes por anuncio y los tramos del CPA. Las usan los avisos de la app, su corte automático, la copa y el tablero.
- **Los dos CPA reales** (`ads_ver_testeo {producto_id}` › `plan_meta`, o `projection_ver_simulador` › `cpa_real`): por venta confirmada, con la meta del usuario. No se fijan en la campaña.
- **La ruta para decidir:** `skills_leer {modulo: "ads_lean", rama: "cerebro-campanas"}` (una vez por conversación): la tabla «lo que ves → lo que haces», las cinco llaves de la escala y lo que no es escalar.

**Venta = pedido confirmado y no cancelado**, por landing o por WhatsApp, contado del CRM (`pedidos_ver` y `ads_ver_testeo`). El píxel, los pagos iniciados y las conversaciones no son venta. Para apagar o bajar, cada pedido «por confirmar» cuenta como 0,95 de venta; para escalar, solo las confirmadas.

## 1. Cada revisión (dos al día, nunca de noche)
1. `ads_ver_testeo {producto_id}`: estado, gasto y ventas por anuncio, los `avisos` de la app y el `plan_meta`.
2. `ads_ver_metricas {conjunto_id, ventana: "hoy" | "3d" | "7d"}`: CPM, CPC del enlace, CTR del enlace y ventas del CRM. `ads_ver_tendencia` para mirar varios días: **un día no decide**.
3. `ads_ver_ventas_cobradas {campania_id, ventana}`: lo cobrado de verdad.
4. **Se lee de atrás hacia adelante:** pedido, formulario o chat, página y recién al final el anuncio. El anuncio es su propio ecosistema (impresiones, clic, CTR) y la tienda o el chat es otro (visitas, inicio de pago, formulario; o conversación, oferta, datos). No se mezclan: si el anuncio está sano y la página no convierte, **el anuncio no se apaga**: se arregla la página, la oferta o el flujo.
5. **Si no convierte por WhatsApp:** antes de culpar al producto, lee 5 o 6 chats con `chat_conversaciones_ver` y `chat_conversacion_leer`: ¿llegó el material?, ¿el agente contestó bien el precio?, ¿se perdieron en los datos?

## 2. Cortes (por anuncio; con Lean 1, el conjunto es el anuncio)
> Con **Lean 2** esta tabla no aplica: se juzga el conjunto (sección 2b).

| Lo que ves | Qué haces | ¿OK del usuario? |
|---|---|---|
| Gastó la señal temprana de las reglas de corte sin ventas y **el anuncio está caro** (CPC, CPM o CTR fuera de rango) | Apágalo (`ads_cambiar_estado`) | No, solo aviso |
| Gastó sin ventas, **el anuncio está sano** y la página o el chat no convierten (CTR alto sin ventas) | **No lo apagues:** arregla la página, la oferta o el flujo | No |
| Llegó al gasto sin venta que fijan las reglas de corte, aunque todo esté sano | Apágalo | No, solo aviso |
| Meta casi no le da entrega | Apágalo y relánzalo como conjunto nuevo, en pausa | Para encender, sí |
| Vende, pero el CPA quedó en el tramo alto | Si se rompe la página, arréglala; si es el anuncio, apágalo | No, solo aviso |
| Pocas ventas a buen CPA (**prometedor**) | **No subas:** pide variaciones de ese creativo (sección 4) | No |

- La app ya avisa y, en contra entrega, apaga sola por pérdida con pocas ventas. Lo que ella ya hizo no se repite: se lee en los `avisos`.
- Cada decisión que tomes tú queda escrita con `ads_decision_registrar {accion, conjunto_id, valor_antes, valor_despues, regla, aprobado_por, nota}` y se le avisa al usuario con sus números: «Apagué el anuncio del ángulo X: gastó L 140 sin ventas y el clic le costaba L 9».
- Si el `plan_meta` dice que ya se gastó el techo del mes, no se suma nada nuevo sin su OK.

## 2b. Con Lean 2 (equipo de anuncios): se juzga el conjunto
- **Ningún anuncio se apaga por vender poco:** los anuncios que atraen preparan la venta que otro cierra. Lee primero el conjunto (gasto y pedidos confirmados contra el tope, que es el CPA objetivo de la hoja) y después cada anuncio contra el promedio de su equipo.
- **La app actúa sola y avisa:** pausa el conjunto o le baja el presupuesto según su ficha. Se ve en los `avisos` del conjunto (`ads_ver_testeo`) y, si la cuenta tiene webhook de eventos, en `conjunto_equipo`. No lo repitas ni lo reviertas sin el OK del usuario.
- **Cuando avisa «cambia 1 anuncio»:** antes revisa la oferta, la página o el chat y la medición. Después, uno solo y del mismo nivel: `ads_equipo_generar {reemplazar_creativo_id}`; se publica con el OK del usuario y el equipo se deja quieto los días que dice la ficha. Nunca un anuncio y el presupuesto el mismo día.
- **Subir:** solo cuando el tablero lo ofrece (`despliegue_escala_ver`, movimiento `sube`), con `despliegue_escala_aprobar {producto_id, anuncio_id, movimiento: "sube", ok_del_dueno}`.
- **Otro ángulo** es otro concepto: otro conjunto, con su propio presupuesto.
- Las cifras (cuántos topes, cuántos días) están en la ficha (`ads_ver_estrategias`) y el método completo en `skills_leer {modulo: "ads_lean", rama: "lean-2"}`.

## 3. El ganador
- La copa la da la app con la fase `ganador` de la ficha: `ads_ver_ganadores {conjunto_id}` y la tarjeta del anuncio en el tablero (`despliegue_escala_ver`). No declares ganador a mano. Con Lean 2 no hay copa por anuncio: gana el concepto, cuando el conjunto trae cada cliente al tope o menos.
- **Con 10 pedidos o más,** actualiza la mezcla real de paquetes en Projection (`projection_guardar_ofertas` con los `share_pct` de lo vendido) y vuelve a leer `plan_meta`: los dos CPA cambian.

## 4. La escala (cada ganador, en el tablero de Despliegue creativo)
1. `despliegue_escala_ver {producto_id}`: la fase del producto (testeo, ganador encontrado, escala, mantenimiento) y, por cada ganador, sus movimientos con estado y detalle. **Primero «cero cuellos de botella»:** si no cumple, no se escala. En Lean 2 el único movimiento es subir el presupuesto del conjunto, y solo cuando el tablero lo ofrece.
2. La escala sigue los tramos del CPA de las reglas de corte de la marca: en el tramo agresivo salen los movimientos de la ficha (subir ×2, duplicar en la misma campaña, otra cuenta, campaña de escala); en «con cuidado», solo subir 20 %; más arriba, ninguno.
3. **Solo lo que sale con estado `espera_ok`**, con el OK del usuario en esta conversación: `despliegue_escala_aprobar {producto_id, anuncio_id, movimiento, ok_del_dueno: "<sus palabras>"}`. Subir presupuesto pasa en Meta al instante; duplicar, otra cuenta y la campaña de escala dejan copias que se publican con `ads_publicar` y su OK. Si dice «ahora no»: `despliegue_escala_ahora_no`.
4. **Volver atrás o bajar no pide OK:** si una subida rompe el CPA ese mismo día, se vuelve al presupuesto anterior (`ads_cambiar_presupuesto`) y se avisa.
5. Topes: lo encendido no pasa de US$200 al día por campaña ni de US$500 por cuenta sin el OK explícito del usuario.

## 5. El despliegue creativo (lo que sostiene la escala)
1. Apenas hay ganador, sus variaciones: `despliegue_escala_aprobar {movimiento: "variar"}` (estado `para_encargar`) crea los encargos que pide la ficha. Variación de verdad = otra persona, otro lugar, otro gancho u otro formato con la estructura que ganó; cambiar solo el fondo, la letra o la música no es un anuncio nuevo.
2. **La próxima tanda:** `despliegue_tablero_ver {producto_id}` dice cuántas piezas están listas frente a las que pide la marca. Si faltan, encarga desde las referencias con mejor veredicto: `despliegue_encargo_crear {producto_id, referencia_pieza_id, accion}` o «Nuevo creativo» sin referencia `{formato, angulo, cantidad}`.
3. **Producir un encargo:** `despliegue_encargos_ver` (trae el método) → `despliegue_aprendizajes_ver` → `despliegue_encargo_tomar {pieza_id, paso}` → `despliegue_encargo_bitacora` en cada etapa → editas en tu PC con el editor ([creativos.md](creativos.md)) → `media_subir {producto_id}` → `despliegue_encargo_entregar {pieza_id, media_url}`.
4. **A la campaña:** `despliegue_campana_ubicar {producto_id, pieza_id, conjunto_id}` (las variaciones de un ganador, juntas en su conjunto), su copy con `ads_editar_creativo` y publicar con el OK del usuario.
5. **Fatiga:** no se apaga por la frecuencia; se reemplaza con su despliegue y se baja solo si el CPA también se fue.

## Las herramientas
| Para qué | Tool |
|---|---|
| Estado de la campaña, ventas del CRM y el plan de la meta | `ads_ver_testeo {producto_id}` |
| Métricas de un conjunto | `ads_ver_metricas {conjunto_id, ventana}` · `ads_ver_tendencia` |
| Lo cobrado de verdad | `ads_ver_ventas_cobradas {campania_id, ventana}` |
| Las reglas de corte de la marca | `ads_reglas_corte {marca_id}` |
| La ficha de la estrategia | `ads_ver_estrategias {producto_id}` |
| Quién ganó | `ads_ver_ganadores {conjunto_id}` |
| El equipo de 5 anuncios (Lean 2) | `ads_equipo_generar` · `ads_equipo_ver` |
| Apagar o encender | `ads_cambiar_estado {tipo, id, activo, confirmado}` (encender, con OK) |
| Cambiar un presupuesto publicado | `ads_cambiar_presupuesto {conjunto_id, presupuesto_diario, aplicar}` (subir, con OK). `ads_editar_conjunto` NO cambia Meta |
| La escala de cada ganador | `despliegue_escala_ver` · `despliegue_escala_aprobar` · `despliegue_escala_ahora_no` |
| El tablero y los encargos | `despliegue_tablero_ver` · `despliegue_encargo_crear` · `despliegue_encargos_ver` |
| Dejar escrita una decisión | `ads_decision_registrar` |
| El agente de la campaña: «El agente decide», sus propuestas y su historial | `ads_agente_campania {campania_id, accion}` (aprobar una propuesta, solo con el OK del usuario) |
| Pedir cambios, descartar, cancelar o relanzar una pieza del tablero | `despliegue_pieza_accion {producto_id, pieza_id, accion}` |

Anota cada lectura y cada decisión en LANZAMIENTO.md › «Próximo paso».
