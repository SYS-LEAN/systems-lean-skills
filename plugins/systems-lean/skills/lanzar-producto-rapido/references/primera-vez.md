# Primera vez · lo que hace falta antes de empezar

Se revisa **una sola vez por PC**. Si existe `~/SystemsLean/requisitos.md`, léelo: lo que ya está marcado no se vuelve a revisar, solo lo que quedó pendiente. Si no existe, es la primera vez: revisa todo, en este orden, y al final crea ese archivo.

## Cómo se revisa
1. **Comprueba tú todo lo que se pueda leer** (columna «Cómo se comprueba») antes de escribirle al usuario. No le preguntes lo que una herramienta ya te dice.
2. **Un solo mensaje al usuario,** corto: qué ya está, y de lo que falta, solo lo que le toca a él, en el orden de la tabla. Por cada cosa: para qué sirve en una línea, el link directo, qué va a ver al abrirlo y qué botón apretar. Cierra con «avísame cuando esté».
3. **Lo que te toca a ti lo haces sin preguntar** (instalar el editor, crear la carpeta, crear la Unidad de Negocio con sus datos).
4. **Mientras el usuario hace lo suyo, avanza** con lo que no depende de eso.
5. **Las llaves las pega el usuario en su archivo, nunca en el chat.** Si pega una en el chat, dile que la cambie por una nueva y la guarde en el archivo.

## Lo obligatorio
| # | Qué | Para qué | Cómo se comprueba | Quién | Si falta |
|---|---|---|---|---|---|
| 1 | Cuenta de Systems Lean con el plan Plus y el conector agregado | Sin el conector no hay nada de lo demás | `sl_como_trabajar` responde; `cuenta_ver {}` dice el plan, si incluye el conector y si está por vencer | Usuario | Plan: https://app.systemslean.com/subscription. Conector: en https://app.systemslean.com/credenciales elegir «Claude» y copiar la dirección (`https://app.systemslean.com/mcp`); en Claude se agrega en https://claude.ai/settings/connectors → «Agregar conector personalizado» → «Autorizar» |
| 2 | Extensión de Chrome de Systems Lean, con la sesión iniciada | Conecta Soydrop, guarda productos de Dropi y de Soydrop con un botón y captura la investigación del usuario (anuncios, Marketplace, AliExpress, comentarios) | `cuenta_ver {}` › `extension_chrome`: si se la vio, hace cuánto y con qué versión. Si no hay registro, pregúntale al usuario si ve el ícono de Systems Lean en Chrome y si está con su sesión | Usuario | https://chromewebstore.google.com/detail/ieigggdfakhdegnggjhdhdlhhfhkojme → «Añadir a Chrome» → abrir la extensión e iniciar sesión con su cuenta de Systems Lean |
| 3 | Una Unidad de Negocio de dropshipping para el país donde va a vender | Todo se guarda dentro de una | `marca_ver {}`; cuántas admite el plan, en `cuenta_ver {}` › `unidades_de_negocio` | Tú | No hay ninguna, o el usuario quiere una marca nueva: [marca.md](marca.md) |
| 4 | Meta: página, cuenta publicitaria activa con forma de pago y píxel, conectados a esa Unidad de Negocio | Sin esto no hay campaña | `ads_ver_conexion {marca_id}` › `falta: null`, y la tabla de «Meta: lo que hay que tener» | Usuario autoriza Meta una vez; conectarlo a la marca y crear el píxel lo haces tú | «Conectar Meta a Systems Lean», más abajo |
| 5 | Su proveedor | De ahí salen el producto, el costo, el stock y el flete | Dropi: la tool `list_products` responde. Soydrop: `soydrop_token_estado {}` dice conectado | Usuario | **Dropi:** agregar su conector (ver «Los conectores»). **Soydrop** (Honduras): con la extensión instalada, abrir https://app.soydrop.com e iniciar sesión; la extensión conecta la cuenta sola |
| 6 | Node.js 20 o más y unos 500 MB libres | El editor de videos corre en su PC | `node --version` | Usuario | https://nodejs.org → botón de la versión LTS → instalar con todo por defecto → abrir un chat nuevo |
| 7 | El editor de videos | Edita los videos de los anuncios | Existe `~/SystemsLean/editor/node_modules` | Tú | [editor.md](editor.md) › «Instalar» |
| 8 | Créditos en Systems Lean | Las imágenes, las tomas con IA y la voz se generan en la app y cobran créditos | `cuenta_ver {}` › `creditos.disponibles`. Antes de generar muestra el costo (`anuncios_estimar_costo`) y espera el sí | Usuario | https://app.systemslean.com/subscription |

- **Si el canal va a ser WhatsApp** (se decide en el paso 8), además: un número de WhatsApp de la marca conectado a su agente. Qué número sirve, cómo se conecta y cómo se comprueba: «El número de WhatsApp», más abajo.
- **Una Unidad de Negocio nueva nace sin Meta y sin número:** aunque la cuenta ya tenga otra marca conectada, la nueva se conecta aparte.

## Meta: lo que hay que tener
Son cosas que el usuario tiene, o crea, **en Meta**: Systems Lean solo se conecta a ellas. Conectarlas a la marca lo haces tú (ver «Conectar Meta a Systems Lean»); al usuario solo le pides lo que hay que crear o arreglar en Meta.
- `ads_ver_conexion {marca_id}` dice lo que ya está, y en `falta`, lo primero que falta.
- Lo que ninguna herramienta lee, se lo preguntas en una línea y con su link.

| # | Qué | Para qué | Cómo se comprueba | Si falta |
|---|---|---|---|---|
| 4.1 | Una página de Facebook de la marca, que él administre | Los anuncios salen a nombre de la página | `ads_ver_conexion` › `page_id` y `videos_a_la_pagina: true` | La crea en https://www.facebook.com/pages/create |
| 4.2 | Una cuenta publicitaria propia y **activa** | Con ella se pagan y se publican los anuncios | `ads_ver_conexion` › `ad_account_id`, `ad_account_currency` y `cuenta_publicitaria_estado.puede_publicar: true`. Con `false`, `problema`, `pasos` y `url` dicen qué arreglar en Meta (deuda, revisión, cuenta inhabilitada) | La crea en https://business.facebook.com/latest/settings/ad_accounts. La moneda no se cambia después: que sea la de la tarjeta con la que va a pagar. Si está frenada, se arregla en el `url` que da la herramienta |
| 4.3 | Una forma de pago cargada en esa cuenta | Sin ella Meta no muestra los anuncios | `ads_ver_conexion` › `cuenta_publicitaria_estado.tiene_forma_de_pago: true`. Si dice `null`, no se pudo leer: pregúntaselo | La carga en https://business.facebook.com/billing_hub/payment_settings |
| 4.4 | Un píxel propio de la marca | Mide las compras de la landing y arma los públicos | `ads_ver_conexion` › `pixel_id`; `ads_ver_pixeles {marca_id}` los lista por nombre | Lo creas tú: avísale en una línea («te creo el píxel «<Marca> · Pixel» en tu cuenta de Meta») y llama `ads_conectar_meta {marca_id, crear_pixel: true}`. Queda creado, compartido con la cuenta publicitaria y elegido en la marca |
| 4.5 | El Instagram de la marca vinculado a la página (recomendado) | Los anuncios salen con su Instagram y se pueden armar públicos de Instagram | `ads_ver_conexion` › `instagram_actor_id` | Sin él se sigue: los anuncios salen a nombre de la página. Lo vincula en la configuración de su página de Facebook |
| 4.6 | Si va a vender por WhatsApp: un número para la marca | Ahí escriben los clientes que tocan el anuncio | Ver «El número de WhatsApp» | Ver «El número de WhatsApp» |

### Conectar Meta a Systems Lean
**Lo hace el usuario una sola vez, para toda la cuenta:** autorizar Meta. Después, conectar cada Unidad de Negocio lo haces tú. No lo mandes a Ads Lean ni a ninguna pantalla a elegir cuenta, página o píxel.
1. Llama `ads_conectar_meta {marca_id}`. Usa la autorización que el usuario ya dio en Credenciales: lee sus cuentas publicitarias, páginas, Instagram, píxeles y números de WhatsApp, y conecta la marca sola cuando la elección es clara (la página que la marca ya usa para Messenger o Instagram, la única o la que se llama como la marca; la única cuenta publicitaria activa en la que puede anunciar, o la que se llama como la marca). Las cuentas de solo lectura no cuentan.
2. Según lo que responda:
   - `falta: "autorizar Meta"`: la cuenta todavía no autorizó. Es el único paso del usuario: https://app.systemslean.com/credenciales → «Meta» → «Conectar con Facebook», con la cuenta de Facebook que administra la página y la cuenta publicitaria, y en la ventana de Meta que deje marcado **todo lo de esta marca** (página, cuenta publicitaria, Instagram y WhatsApp). Cuando diga que terminó, repite el paso 1.
   - `elige_cuenta` o `elige_pagina`: hay varias igual de buenas. Pregúntale en una línea cuál es la de esta marca, por nombre, y vuelve a llamar con `ad_account_id` o `page_id`.
   - `falta` con una página o una cuenta que no aparece: si la tiene, no la dejó marcada al autorizar (que repita la autorización); si no la tiene, se crea en Meta (4.1 y 4.2).
   - `pixel.falta`: la cuenta no tiene píxel. Avísale en una línea que se lo creas y llama `ads_conectar_meta {marca_id, crear_pixel: true}`. Si tiene varios, te los da por nombre: pregúntale cuál.
   - `conectado: true` con `pixel`: listo. Díselo por nombre (cuenta, página, Instagram y píxel), sin ids.
3. Lee `ads_ver_conexion {marca_id}`:
   - `falta` pide arreglar la cuenta publicitaria o cargar una forma de pago: es en Meta, con el `url` de `cuenta_publicitaria_estado`. Sin eso no se publica: díselo ya.
   - `videos_a_la_pagina: false`: al autorizar no dio acceso a la página. Que repita la autorización y la marque.
   - `falta: null`: está listo.

### El número de WhatsApp (si va a vender por WhatsApp)
El canal se decide en el paso 8, pero el número se pregunta ahora: conseguir uno lleva tiempo.

**Qué número sirve:**
- El que ya usa con la app **WhatsApp Business** en su celular, con la app actualizada (versión 2.24.17 o más nueva). Sigue atendiendo desde el celular y, además, entra a Systems Lean.
- O un número que se va a atender solo desde Systems Lean: deja de funcionar en la app del teléfono.
- Si hoy lo tiene en el WhatsApp normal, primero lo pasa a la app WhatsApp Business, que es gratis.
- Un número por marca: si ya está conectado en otra cuenta de Systems Lean, los mensajes entran allá.

**Cómo se conecta: lo haces tú** con `chat_canal_conectar`, en el paso 11, cuando el agente ya tiene su producto y su embudo (desde que tiene canal, contesta):
1. `chat_canal_conectar {marca_id}`: dice el agente de la marca y lo que se puede conectar. `numeros_de_whatsapp_en_meta` son los números que ve la autorización de Meta (con `se_puede_conectar_aca`); `canales_conectados`, los que ya son canal.
2. Si la marca no tiene agente, `chat_canal_conectar {marca_id, crear_agente: true, phone_number_id}` lo crea con el nombre de la marca y le ata el número. Si ya tiene, `chat_canal_conectar {marca_id, phone_number_id}` (o `credencial_id`, si el número ya es canal).
3. Si responde que el número vive en la app del celular o que nunca se dio de alta, el alta la hace el usuario con su teléfono a mano: https://app.systemslean.com/prompts → el agente → «Cerebro del Agente» → «Agregar canal» → «WhatsApp» → «Sigue en mi celular» (la app WhatsApp Business le pide aceptar) o «Solo aquí». Es el único caso en que va a esa pantalla.

**Cómo se comprueba:**
- `chat_proyectos_ver {}`: el proyecto con su número en `whatsapp[]`.
- `chat_salud_ver {proyecto_id}`: `canal: "conectado"` y `whatsapp` dentro de `canales`.
- `ads_ver_conexion {marca_id}` › `whatsapp_numeros`: el número con `credencial_id` y `mismo_negocio_que_la_pagina: true`. Si dice `false`, el número y la página están en negocios distintos de Meta y el anuncio puede no aceptarlo como destino: díselo ya, y en el paso 12 confírmalo con `ads_ver_whatsapp_pagina {marca_id}`.
- Que se mande un mensaje desde otro teléfono y lo vea llegar en https://app.systemslean.com/conversations.

**Lo que cobra Meta:** los mensajes que manda el negocio (la confirmación del pedido, los seguimientos) se los cobra Meta a la forma de pago de su cuenta de WhatsApp Business, que se carga en https://business.facebook.com/billing_hub/payment_settings. Systems Lean no cobra mensualidad por el número. Cuánto lleva gastado se ve en `chat_salud_ver` › `costo_whatsapp_mes`.

## Lo recomendado
| Qué | Para qué | Cómo se comprueba | Si falta |
|---|---|---|---|
| Llave de Gemini (gratis) | Saber qué se dice y qué se ve en los videos de la competencia, en una llamada. Sin ella, el usuario tiene que escuchar cada video y contártelo | `node scripts/analizar.mjs --probar`, dentro de `~/SystemsLean/editor` | Ver «Las llaves» |
| Llave de Pixabay (gratis) | Un segundo banco de videos de stock para el relleno de los anuncios, que se busca desde la terminal y con miniaturas. Sin ella no se frena nada: el stock sale de Pexels, que no pide llave | `node scripts/stock.mjs --probar`, dentro de `~/SystemsLean/editor` | Ver «Las llaves» |
| La app de Systems Lean en su celular | Le avisa de cada pedido y de cada mensaje de cliente, y le deja aprobar con un botón | Pregúntale al usuario si ya la tiene | Dile que se mande este link a su propio WhatsApp y lo abra en el celular: https://app.systemslean.com/conversations?fuente=app → iniciar sesión → «Instalar app». En iPhone: abrirlo en Safari → botón de compartir → «Agregar a inicio» |
| Un navegador para ti | Leer la Biblioteca de anuncios de Meta y las páginas de la competencia. Solo para leer la web pública | Tienes herramientas de navegador | En Claude: la extensión Claude in Chrome, https://claude.com/chrome |

## Los conectores
Todos en un solo lugar. Se agregan igual: en Claude, https://claude.ai/settings/connectors → «Agregar conector personalizado» → pegar la dirección → «Conectar», e iniciar sesión con la cuenta de ese servicio. Quedan disponibles en los chats nuevos. Compruébalos tú antes de pedirle nada al usuario.

| Conector | ¿Hace falta? | Para qué | Dirección | Cómo se comprueba |
|---|---|---|---|---|
| Systems Lean | Sí | Opera toda la app | `https://app.systemslean.com/mcp` | `sl_como_trabajar` responde |
| Dropi (oficial) | Sí, si vende con Dropi | El producto, el stock, el flete y los pedidos | `https://mcp.dropi.co/mcp` | La tool `list_products` responde |
| Meta Ads (oficial de Meta) | Recomendado | La Biblioteca de anuncios: quién pauta el producto, cuántos anuncios y hace cuántos días | `https://mcp.facebook.com/ads` (en Claude también está en el directorio de conectores) | La tool `ads_library_search` responde. Solo responde con una cuenta publicitaria activa |
| Dropkiller | Opcional, es de pago | Ventas y ganadores de otros países, y la transcripción de sus videos | Los pasos están en https://www.dropkiller.com/conectar/claude | La tool `search_ads` responde |
| TrendTrack | Opcional, es de pago | Los anuncios que más escalan y las tiendas con más visitas | Se conecta desde su cuenta de TrendTrack | Sus tools responden |

- **Soydrop no es un conector:** se conecta con la extensión de Chrome de Systems Lean (requisito 5).
- **Ningún otro conector hace falta** para este camino. Sin los opcionales, la competencia se mira con lo que capture el usuario con la extensión y con la Biblioteca de anuncios en el navegador.

## La voz de los audios
- **El camino normal es la app, con los créditos del usuario:** voces de ElevenLabs por país y acento, sin que el usuario abra ninguna cuenta. `video_voces_ver {proveedor: "elevenlabs"}` para elegir y `video_narracion_audio` para generar ([creativos.md](creativos.md) › «La voz»). También hay voces de Google y de Fish, más baratas.
- **Si el usuario ya tiene su cuenta de ElevenLabs,** puede usarla con `scripts/voz.mjs` del editor (ver «Las llaves»). No hace falta para empezar.
- **Sin gastar:** el usuario graba los audios con el celular en un cuarto callado.

## Las llaves
Son del usuario y viven en un solo archivo de su PC: `~/SystemsLean/.env`. **No es el conector:** el conector de Systems Lean nunca pide llaves ni tokens.
1. Crea el archivo si no existe, con las líneas vacías: `GEMINI_API_KEY=`, `PIXABAY_API_KEY=` y `ELEVENLABS_API_KEY=`. Si ya existe, agrega solo las líneas que falten.
2. Ábreselo al usuario en su editor de texto: en Windows `notepad "$HOME\SystemsLean\.env"`; en macOS `open -e ~/SystemsLean/.env`.
3. Dale el link de la llave que falta y dile que la pegue después del `=`, sin espacios ni comillas, y que guarde:
   - **Gemini:** https://aistudio.google.com/apikey → entrar con su cuenta de Google → «Crear clave de API» → copiar.
   - **Pixabay:** https://pixabay.com/api/docs/ → «Login» (o «Sign up» si no tiene cuenta; es gratis) → al volver a esa página, la llave aparece en la sección «Search Images», en la fila «key» → copiar.
   - **ElevenLabs** (opcional): https://elevenlabs.io/app/settings/api-keys → «Create API Key» → copiar.
4. Comprueba: `node scripts/analizar.mjs --probar` para Gemini; `node scripts/stock.mjs --probar` para Pixabay; `node scripts/voz.mjs --lista` para ElevenLabs.

**Pexels no lleva llave.** Su página dejó de entregar llaves nuevas (https://www.pexels.com/api/ lo dice), y no hace falta: el video se elige en https://www.pexels.com/videos/ y `scripts/stock.mjs` lo baja con su enlace ([creativos.md](creativos.md) › «De dónde sale cada toma»).

## Qué frena y qué no
- **Sin el 1, el 2, el 3 o el 5: no se empieza.** El 3 lo resuelves tú con [marca.md](marca.md).
- **Sin el 4 (Meta):** se puede avanzar hasta los creativos (paso 9), pero dile desde ya que sin eso no hay campaña. Una cuenta publicitaria restringida o sin forma de pago cuenta como «sin Meta»: se arregla en Meta antes de publicar.
- **Sin número de WhatsApp:** se sigue; el canal del paso 8 será la landing, o se espera el número.
- **Sin el 6 y el 7:** se avanza hasta el paso 8; los videos esperan.
- **Sin lo recomendado: se sigue.** Di en una línea qué se pierde.
- **El producto es digital** (curso, ebook, plantilla, app): este camino no aplica, es solo para producto físico contra entrega. Díselo y sigue las guías de `sl_como_trabajar` para digital.

## Al terminar
Si el cerebro de Systems Lean no está instalado, instálalo ahora con `cerebro_descargar` (un minuto; deja la carpeta `~/SystemsLean` ordenada) y dile al usuario que abra sus chats en esa carpeta, con la ruta completa.

Crea o actualiza `~/SystemsLean/requisitos.md`: la fecha, una línea por requisito con ✅ o «pendiente» y con qué lo comprobaste, y la Unidad de Negocio con la que trabaja el usuario. Sin llaves ni datos de clientes.
