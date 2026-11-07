# Paso 0 · Preparación y conexiones

Antes de investigar nada se confirma que la cuenta del usuario puede llegar hasta el final: conector, Unidad de Negocio, cuenta publicitaria, número de WhatsApp y editor. Un lanzamiento que se arma entero y al final no puede publicarse es tiempo perdido.

## 1. El conector y el plan
1. `sl_como_trabajar {tarea: "lanzar un producto contra entrega de punta a punta"}`. Es gratis. Devuelve la guía, las reglas y lo que sí se puede.
2. Si la tool no existe, el usuario no agregó el conector: dale el README de https://github.com/SYS-LEAN/systems-lean-skills y detente.
3. Si responde que el conector necesita otro plan, díselo en una línea y detente: sin el conector no se puede hacer el resto.

## 2. La Unidad de Negocio
- `ver_tienda {}` o `marca_ver {}`: las Unidades de Negocio del usuario (marcas), con su país.
- Si hay más de una de dropshipping, **pregunta cuál** y no adivines. Desde ahí, manda `marca_id` en toda tool que lo acepte.
- Si el usuario guardó reglas propias en la app, se respetan: `skills_listar {modulo}` para `product_lean`, `projection_lean`, `anuncios`, `chat_lean` y `ads_lean`. Lee con `skills_leer` solo la rama que el paso necesite, una vez por chat. Lo que el usuario decide en el chat manda sobre lo guardado.

## 3. ¿De dónde viene el producto?
**a) De su Lista de Testeo** (lo normal):
- `product_favoritos_ver {marca_id}`: las filas en orden, con `posicion`, `tipo`, `id` (ítem de la Biblioteca) y `producto_investigado_id` (el producto, si ya existe).
- Si el usuario no dijo cuál, muéstrale los 3 primeros por nombre y pregunta.

**b) Lo pegó en el chat** (enlace o id de Dropi, id de Soydrop, nombre):
- Se sigue igual, y en el paso 2 se mete en la Lista de Testeo.

**c) ¿Ya existe en la app?** Antes de crear nada, búscalo:
- `product_favoritos_ver`: si su fila ya tiene `producto_investigado_id`, el producto existe.
- `projection_ver_productos {}`: lista los productos con su `producto_pl_id`.
- Si existe, **no se crea otra vez.** Lee lo que tiene y arma la tabla «qué hay / qué falta»:

| Módulo | Lectura | Qué hay | Qué falta |
|---|---|---|---|
| Alta, vínculo, viabilidad, fotos | `product_ver_investigacion {producto_id}` | | |
| Informe | `product_ver_informe {producto_id}` | | |
| Ángulos | `product_ver_estrategia {producto_id}` | | |
| Ficha, entrega, cobertura | `product_ver_ficha {producto_id}` | | |
| Projection | `projection_ver_simulador` y `projection_ver_ofertas` (id del simulador) | | |
| Biblioteca de creativos | `anuncios_ver_biblioteca_creativos {producto_id}` | | |
| WhatsApp | `chat_agente_productos_ver`, `chat_flujos_ver` | | |
| Campaña | `ads_ver_testeo {producto_id}` | | |

Lo hecho se salta; lo que falta se hace con su paso.

## 4. Las conexiones
| Qué | Tool | Qué tiene que mostrar | Si falta |
|---|---|---|---|
| Meta | `ads_ver_conexion {marca_id}` | Cuenta publicitaria, página, píxel y `whatsapp_numeros` | El usuario la conecta en Ads Lean. Sin esto no hay campaña: detente |
| Píxel | `ads_ver_pixeles {marca_id}` | El píxel de la marca, por nombre | Se crea en el paso de landing o de campaña, con su OK |
| WhatsApp | `chat_proyectos_ver {}` y `chat_salud_ver {proyecto_id}` | El proyecto de Chat Lean con su número activo | Si el canal termina siendo WhatsApp, el usuario conecta el número en Chat Lean. Pídele que se mande un mensaje de prueba y que lo vea llegar en Chat en Vivo |
| Proveedor Dropi | La tool `list_products` (conector oficial de Dropi) | Responde | Que lo agregue como conector de su agente con `https://mcp.dropi.co/mcp` (en Claude: claude.ai → Configuración → Conectores) |
| Proveedor Soydrop | `soydrop_token_estado {}` | Conectado | Lo conecta con la extensión de Chrome de Systems Lean. Link: https://app.soydrop.com |
| Competencia | `ads_library_search` (conector de la Biblioteca de Meta) o Dropkiller | Responde | Se sigue con la Biblioteca en el navegador o con los enlaces que dé el usuario (paso 3) |

## 5. El editor y la carpeta
- Instala o actualiza el editor: [editor.md](editor.md) › «Instalar». Necesita Node.js 20 o más.
- Crea la carpeta del producto: `~/SystemsLean/productos/<producto>-<país>/` con `entrada/` (lo bajado), `planes/` (los JSON del editor), `salida/` (lo terminado), `investigacion/` y `whatsapp/`.
- Crea `LANZAMIENTO.md` con [ficha-lanzamiento.md](ficha-lanzamiento.md) y llena «Datos» con lo que ya sabes.
- Si tu agente deja nombrar el chat, ponle «<producto> · <país> · lanzamiento».

## 6. Cierre del paso
Marca las casillas del paso 0 en la ficha. Dile al usuario en una línea qué Unidad de Negocio, qué producto y qué falta conectar, si falta algo.
