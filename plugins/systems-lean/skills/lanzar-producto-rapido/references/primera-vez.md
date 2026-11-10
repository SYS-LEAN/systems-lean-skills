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
| 1 | Cuenta de Systems Lean con el plan Plus y el conector agregado | Sin el conector no hay nada de lo demás | `sl_como_trabajar` responde | Usuario | Plan: https://app.systemslean.com/subscription. Conector: en https://app.systemslean.com/credenciales elegir «Claude» y copiar la dirección (`https://app.systemslean.com/mcp`); en Claude se agrega en https://claude.ai/settings/connectors → «Agregar conector personalizado» → «Autorizar» |
| 2 | Extensión de Chrome de Systems Lean, con la sesión iniciada | Conecta Soydrop, guarda productos de Dropi y de Soydrop con un botón y captura la investigación del usuario (anuncios, Marketplace, AliExpress, comentarios) | Pregúntale al usuario si ve el ícono de Systems Lean en Chrome y si está con su sesión | Usuario | https://chromewebstore.google.com/detail/ieigggdfakhdegnggjhdhdlhhfhkojme → «Añadir a Chrome» → abrir la extensión e iniciar sesión con su cuenta de Systems Lean |
| 3 | Una Unidad de Negocio de dropshipping para el país donde va a vender | Todo se guarda dentro de una | `marca_ver {}` | Tú | No hay ninguna, o el usuario quiere una marca nueva: [marca.md](marca.md) |
| 4 | Meta conectado en esa Unidad de Negocio: cuenta publicitaria, página y píxel | Sin esto no hay campaña | `ads_ver_conexion {marca_id}` | Usuario | https://app.systemslean.com/credenciales → elegir «Meta» → botón «Conectar con Meta». Antes necesita una página de Facebook (https://www.facebook.com/pages/create) y una cuenta publicitaria con forma de pago (https://business.facebook.com/billing_hub/payment_settings) |
| 5 | Su proveedor | De ahí salen el producto, el costo, el stock y el flete | Dropi: la tool `list_products` responde. Soydrop: `soydrop_token_estado {}` dice conectado | Usuario | **Dropi:** agregar el conector `https://mcp.dropi.co/mcp` igual que el de Systems Lean. **Soydrop** (Honduras): con la extensión instalada, abrir https://app.soydrop.com e iniciar sesión; la extensión conecta la cuenta sola |
| 6 | Node.js 20 o más y unos 500 MB libres | El editor de videos corre en su PC | `node --version` | Usuario | https://nodejs.org → botón de la versión LTS → instalar con todo por defecto → abrir un chat nuevo |
| 7 | El editor de videos | Edita los videos de los anuncios | Existe `~/SystemsLean/editor/node_modules` | Tú | [editor.md](editor.md) › «Instalar» |
| 8 | Créditos en Systems Lean | Las imágenes, las tomas con IA y la voz se generan en la app y cobran créditos | No hay lectura del saldo: antes de generar muestra el costo (`anuncios_estimar_costo`) y espera el sí | Usuario | https://app.systemslean.com/subscription |

- **Si el canal va a ser WhatsApp** (se decide en el paso 8), además: un número de WhatsApp conectado en la Unidad de Negocio. Se comprueba con `chat_proyectos_ver {}` y `chat_salud_ver {proyecto_id}`. Lo conecta el usuario en https://app.systemslean.com/credenciales, dentro de «Meta».
- **Una Unidad de Negocio nueva nace sin Meta y sin número:** aunque la cuenta ya tenga otra marca conectada, la nueva se conecta aparte.

## Lo recomendado
| Qué | Para qué | Cómo se comprueba | Si falta |
|---|---|---|---|
| Llave de Gemini (gratis) | Saber qué se dice y qué se ve en los videos de la competencia, en una llamada. Sin ella, el usuario tiene que escuchar cada video y contártelo | `node scripts/analizar.mjs --probar`, dentro de `~/SystemsLean/editor` | Ver «Las llaves» |
| La app de Systems Lean en su celular | Le avisa de cada pedido y de cada mensaje de cliente, y le deja aprobar con un botón | Pregúntale al usuario si ya la tiene | Dile que se mande este link a su propio WhatsApp y lo abra en el celular: https://app.systemslean.com/conversations?fuente=app → iniciar sesión → «Instalar app». En iPhone: abrirlo en Safari → botón de compartir → «Agregar a inicio» |
| Un navegador para ti | Leer la Biblioteca de anuncios de Meta y las páginas de la competencia. Solo para leer la web pública | Tienes herramientas de navegador | En Claude: la extensión Claude in Chrome, https://claude.com/chrome |
| Conector de la Biblioteca de anuncios de Meta | Medir la competencia sin navegador | La tool `ads_library_search` responde | En Claude está en el directorio de conectores: https://claude.ai/settings/connectors |
| Dropkiller o TrendTrack | Ventas y ganadores de otros países, y la transcripción de sus videos | Sus tools responden | Es de pago: solo si el usuario ya lo tiene |

## La voz de los audios
- **El camino normal es la app, con los créditos del usuario:** voces de ElevenLabs por país y acento, sin que el usuario abra ninguna cuenta. `video_voces_ver {proveedor: "elevenlabs"}` para elegir y `video_narracion_audio` para generar ([creativos.md](creativos.md) › «La voz»). También hay voces de Google y de Fish, más baratas.
- **Si el usuario ya tiene su cuenta de ElevenLabs,** puede usarla con `scripts/voz.mjs` del editor (ver «Las llaves»). No hace falta para empezar.
- **Sin gastar:** el usuario graba los audios con el celular en un cuarto callado.

## Las llaves
Son del usuario y viven en un solo archivo de su PC: `~/SystemsLean/.env`. **No es el conector:** el conector de Systems Lean nunca pide llaves ni tokens.
1. Crea el archivo si no existe, con las líneas vacías: `GEMINI_API_KEY=` y `ELEVENLABS_API_KEY=`.
2. Ábreselo al usuario en su editor de texto: en Windows `notepad "$HOME\SystemsLean\.env"`; en macOS `open -e ~/SystemsLean/.env`.
3. Dale el link de la llave que falta y dile que la pegue después del `=`, sin espacios ni comillas, y que guarde:
   - **Gemini:** https://aistudio.google.com/apikey → entrar con su cuenta de Google → «Crear clave de API» → copiar.
   - **ElevenLabs** (opcional): https://elevenlabs.io/app/settings/api-keys → «Create API Key» → copiar.
4. Comprueba: `node scripts/analizar.mjs --probar` para Gemini; `node scripts/voz.mjs --lista` para ElevenLabs.

## Qué frena y qué no
- **Sin el 1, el 2, el 3 o el 5: no se empieza.** El 3 lo resuelves tú con [marca.md](marca.md).
- **Sin el 4 (Meta):** se puede avanzar hasta los creativos (paso 9), pero dile desde ya que sin eso no hay campaña.
- **Sin el 6 y el 7:** se avanza hasta el paso 8; los videos esperan.
- **Sin lo recomendado: se sigue.** Di en una línea qué se pierde.
- **El producto es digital** (curso, ebook, plantilla, app): este camino no aplica, es solo para producto físico contra entrega. Díselo y sigue las guías de `sl_como_trabajar` para digital.

## Al terminar
Crea o actualiza `~/SystemsLean/requisitos.md`: la fecha, una línea por requisito con ✅ o «pendiente» y con qué lo comprobaste, y la Unidad de Negocio con la que trabaja el usuario. Sin llaves ni datos de clientes.
