# La Unidad de Negocio (la marca)

Todo lo de un producto vive dentro de una Unidad de Negocio. Aquí se elige la que ya existe o se crea una nueva. Crear y guardar es gratis; lo único que cobra créditos es la identidad hecha con IA, que se lanza desde la app.

## 1. ¿Cuál se usa?
`marca_ver {}`: las Unidades de Negocio de la cuenta, con su modelo y su país.
- **Hay una sola de dropshipping:** se usa esa. Díselo al usuario por su nombre y sigue.
- **Hay varias de dropshipping:** pregunta cuál, por nombre.
- **No hay ninguna de dropshipping,** aunque haya de otro modelo (ecommerce o digital): se crea una. Guardar un producto de Dropi o de Soydrop en la Biblioteca solo funciona en dropshipping.
- **El usuario quiere una marca nueva para este producto:** se crea.

Desde aquí, manda `marca_id` en toda tool que lo acepte.

## 2. Lo que le preguntas al usuario (un solo mensaje, con tu propuesta)
1. **Nombre de la marca.** Si no tiene, propón 3 cortos según lo que va a vender.
2. **Qué va a vender,** en una frase.
3. **Desde qué país opera** y en qué moneda quiere leer sus números.
4. **Si ya tiene logo y colores.** Si no, se sigue sin ellos.

## 3. Crearla
1. `marca_crear {modelo_negocio: "dropshipping"}` devuelve los nichos del catálogo. Elige el que calza con lo que vende; si dudas entre dos, pregunta. El nicho no se inventa.
2. `marca_crear {nombre, modelo_negocio: "dropshipping", nicho_id, rubro, descripcion, productos, pais, moneda_reporte}`:
   - `rubro` y `descripcion` con lo que de verdad vende: los leen todos los agentes de la app. Si faltan, nacen genéricos.
   - `pais` es el país desde el que opera el usuario (ISO-2: `HN`, `CO`), no el país al que le vende.
   - Si ya existe una con ese nombre, la devuelve en vez de duplicarla: reintentar es seguro.
3. **Sin cupo:** si responde que el plan no deja crear otra, no es una falla. Dile al usuario en una línea que su plan llegó al tope y dale https://app.systemslean.com/subscription, o propón usar una que ya tiene.

## 4. Completarla
| Qué | Tool | Notas |
|---|---|---|
| Redes y contacto | `marca_editar {marca_id, instagram, facebook, tiktok, correo, telefono}` | Solo lo que el usuario tenga |
| Logo, colores y tipografía que ya tiene | `marca_guardar_identidad {marca_id, logos, campos}` | Los logos se suben antes con `media_subir` y se pasa su URL. Colores en hex; tipografía con el nombre exacto de Google Fonts |
| No tiene logo ni colores | Nada por ahora | Se puede lanzar sin identidad. Si la quiere hecha con IA, se genera en la app (cobra créditos): https://app.systemslean.com/business-lean |
| Pagos y entrega | `marca_ver {marca_id}` y después `marca_guardar_pagos {marca_id, pagos_config}` | Reemplaza todo: lee primero, cambia lo necesario y guarda. Contra entrega, los tiempos de entrega y la garantía en general, sin detalles de un producto. Va antes de escribir cualquier ficha |

## 5. Conectarla (lo haces tú)
Una Unidad de Negocio nueva nace sin conexiones, aunque la cuenta tenga otra marca conectada. Conectarla lo haces tú con la autorización de Meta que el usuario ya dio en Credenciales; no lo mandes a Ads Lean.
- **Meta** (cuenta publicitaria, página y píxel): `ads_conectar_meta {marca_id}`. Los casos (falta autorizar, elegir entre varias, crear el píxel) están en [primera-vez.md](primera-vez.md) › «Conectar Meta a Systems Lean». Compruébalo con `ads_ver_conexion {marca_id}`.
- **El píxel es propio de cada marca:** nunca el de otra, porque mezcla audiencias. Si la cuenta no tiene ninguno, avísale al usuario en una línea y créalo con `ads_conectar_meta {marca_id, crear_pixel: true}`.
- **WhatsApp,** si va a vender por chat: `chat_canal_conectar {marca_id}` ata el número al agente, en el paso 11 ([primera-vez.md](primera-vez.md) › «El número de WhatsApp»).

## 6. Verificación
`marca_ver {marca_id}`: nombre, modelo `dropshipping`, país, rubro y descripción propios, y `pagos_config` lleno. Anota la marca en `~/SystemsLean/requisitos.md` y en la ficha del lanzamiento.

**No avances si:** la marca quedó con el rubro genérico del nicho; `pagos_config` está vacío; el usuario no confirmó el nombre.
