# Paso 0 · Preparación y conexiones

Antes de investigar nada se confirma que la cuenta del usuario puede llegar hasta el final: conector, Unidad de Negocio, cuenta publicitaria, número de WhatsApp y editor. Un lanzamiento que se arma entero y al final no puede publicarse es tiempo perdido.

## 0. ¿Es la primera vez?
- Si no existe `~/SystemsLean/requisitos.md`, es la primera vez en esta PC: revisa los requisitos con [primera-vez.md](primera-vez.md) antes de seguir. Ahí están los links directos de todo lo que el usuario tiene que instalar o conectar.
- Si existe, léelo y revisa solo lo que quedó pendiente.

## 1. El conector y el plan
1. Si esta skill te llegó por el conector, ya tienes la guía y las reglas: no las pidas otra vez. Si la tienes instalada, llama una vez `sl_como_trabajar {tarea: "lanzar un producto contra entrega de punta a punta"}`. Es gratis.
2. Si la tool no existe, el usuario no agregó el conector: dale el README de https://github.com/SYS-LEAN/systems-lean-skills y detente.
3. Si responde que el conector necesita otro plan, díselo en una línea y detente: sin el conector no se puede hacer el resto.

## 2. La Unidad de Negocio
- `ver_tienda {}` o `marca_ver {}`: las Unidades de Negocio del usuario (marcas), con su país.
- Si hay más de una de dropshipping, **pregunta cuál** y no adivines. Desde ahí, manda `marca_id` en toda tool que lo acepte.
- Si no hay ninguna de dropshipping, o el usuario quiere una marca nueva para este producto, créala con [marca.md](marca.md) y vuelve aquí.
- Si el usuario guardó reglas propias en la app, se respetan: `skills_listar {}` muestra los módulos con conocimiento (los de este camino son Product Lean, Projection, anuncios estáticos, Store Lean, Chat Lean y Ads Lean) y `skills_listar {modulo}` sus ramas. Lee con `skills_leer` solo la rama que el paso necesite, una vez por chat. Lo que el usuario decide en el chat manda sobre lo guardado.

## 3. ¿De dónde viene el producto?
**a) De su Lista de Testeo o de su Biblioteca** (lo normal):
- `product_favoritos_ver {marca_id}`: las filas en orden, con `posicion`, `tipo`, `id` (ítem de la Biblioteca) y `producto_investigado_id` (el producto, si ya existe).
- `product_biblioteca_ver {marca_id}`: todo lo que tiene guardado, por categoría.
- Si el usuario no dijo cuál, muéstrale los 3 primeros de la lista por nombre y pregunta.

**b) Lo pegó en el chat** (enlace o id de Dropi, id de Soydrop, nombre):
- En el paso 1 se guarda en la Biblioteca y entra a la Lista de Testeo.

**c) ¿Ya existe en la app?** Antes de crear nada, búscalo:
- `product_favoritos_ver`: si su fila ya tiene `producto_investigado_id`, el producto existe.
- `projection_ver_productos {}`: lista los productos con su `producto_pl_id`.
- Si existe, **no se crea otra vez.** Lee lo que tiene y arma la tabla «qué hay / qué falta»:

| Módulo | Lectura | Qué hay | Qué falta |
|---|---|---|---|
| Alta, vínculo, viabilidad, fotos | `product_ver_investigacion {producto_id}` | | |
| Lo que capturó el usuario | `product_ver_extraccion {producto_id}` | | |
| Informe | `product_ver_informe {producto_id}` | | |
| Ángulos | `product_ver_estrategia {producto_id}` | | |
| Ficha, entrega, cobertura | `product_ver_ficha {producto_id}` | | |
| Projection | `projection_ver_simulador`, `projection_ver_ofertas` y `projection_escenarios_ver` (id del simulador) | | |
| Biblioteca de creativos | `anuncios_ver_biblioteca_creativos {producto_id}` | | |
| WhatsApp | `chat_agente_productos_ver`, `chat_flujos_ver` | | |
| Campaña | `ads_ver_testeo {producto_id}` | | |

Lo hecho se salta; lo que falta se hace con su paso.

## 4. Las conexiones
| Qué | Tool | Qué tiene que mostrar | Si falta |
|---|---|---|---|
| Meta | `ads_ver_conexion {marca_id}` | Cuenta publicitaria, página, píxel y `whatsapp_numeros`, con `falta: null` | [primera-vez.md](primera-vez.md) › «Meta: lo que hay que tener»: qué debe tener en Meta (página, cuenta publicitaria activa, forma de pago, píxel) y cómo lo conecta. Sin esto no hay campaña: díselo ya y avanza solo hasta los creativos |
| Píxel | `ads_ver_pixeles {marca_id}` | El píxel de la marca, por nombre | Se crea en el paso de landing o de campaña, con su OK |
| WhatsApp | `chat_proyectos_ver {}` y `chat_salud_ver {proyecto_id}` | El proyecto de Chat Lean con su número activo | Si el canal termina siendo WhatsApp, el usuario conecta el número en el agente: [primera-vez.md](primera-vez.md) › «El número de WhatsApp». Pídele que se mande un mensaje de prueba y que lo vea llegar en Chat en Vivo (https://app.systemslean.com/conversations) |
| Proveedor Dropi | La tool `list_products` (conector oficial de Dropi) | Responde | Que lo agregue como conector de su agente con `https://mcp.dropi.co/mcp` (en Claude: claude.ai → Configuración → Conectores) |
| Proveedor Soydrop | `soydrop_token_estado {}` | Conectado | Con la extensión de Chrome de Systems Lean instalada, el usuario abre https://app.soydrop.com e inicia sesión: la extensión conecta la cuenta sola. Vuelve a leer `soydrop_token_estado` |
| Competencia | `ads_library_search` (conector oficial de Meta Ads; solo responde con una cuenta publicitaria activa), Dropkiller o TrendTrack | Responde | Se sigue con lo que capture el usuario y la Biblioteca en el navegador (paso 3) |
| Extensión de Chrome de Systems Lean (obligatoria) | Pregúntale al usuario si la tiene instalada y con su sesión iniciada | Conecta Soydrop, guarda productos de Dropi y Soydrop con un botón y la usa para su investigación (paso 3) | Que la instale desde la Chrome Web Store: https://chromewebstore.google.com/detail/ieigggdfakhdegnggjhdhdlhhfhkojme |

## 5. El cerebro, el editor y la carpeta
- **El cerebro de Systems Lean** (la carpeta de trabajo con el método, las lecciones y los casos): si no existe `~/SystemsLean/cerebro/base/VERSION`, o dice una fecha anterior a la que avisa `sl_como_trabajar`, instálalo o actualízalo con `cerebro_descargar`: te da el comando y no pisa nada del usuario. Después lee `~/SystemsLean/CLAUDE.md` (o `AGENTS.md`) y `cerebro/mio/HOT.md`, y abre la lección cuya señal coincida con cada paso.
- Instala o actualiza el editor: [editor.md](editor.md) › «Instalar». Necesita Node.js 20 o más.
- La llave de Gemini para analizar videos: `node scripts/analizar.mjs --probar`. Si falta, [primera-vez.md](primera-vez.md) › «Las llaves».
- Crea la carpeta del producto: `~/SystemsLean/productos/<producto>-<país>/` con `entrada/` (lo bajado), `planes/` (los JSON del editor), `salida/` (lo terminado), `investigacion/` y `whatsapp/`.
- Crea `LANZAMIENTO.md` con [ficha-lanzamiento.md](ficha-lanzamiento.md) y llena «Datos» con lo que ya sabes.
- Si tu agente deja nombrar el chat, ponle «<producto> · <país> · lanzamiento».

## 6. Cierre del paso
Marca las casillas del paso 0 en la ficha. Dile al usuario en una línea qué Unidad de Negocio, qué producto y qué falta conectar, si falta algo.
