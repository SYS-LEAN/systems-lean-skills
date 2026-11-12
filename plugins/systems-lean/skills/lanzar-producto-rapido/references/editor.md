# El editor: los videos en la PC del usuario

Es un proyecto de Remotion que viene en la carpeta `editor/` de la skill, junto a `SKILL.md`, y también en el repositorio público https://github.com/SYS-LEAN/systems-lean-skills. Los videos se procesan en la PC: el servidor de Systems Lean solo recibe los archivos terminados. Remotion trae su propia copia de ffmpeg, así que no hace falta instalar nada más.

**Las imágenes no se hacen aquí:** van en el generador de anuncios estáticos de la app (ver [creativos.md](creativos.md) › «Las imágenes»).

## Instalar (una vez por PC)
1. `node --version` debe dar 20 o más. Si no hay Node.js, pídele al usuario que instale la versión LTS de https://nodejs.org y que abra un chat nuevo. Solo `scripts/bajar.mjs` (YouTube) pide 22 o más.
2. Carpeta de trabajo: `~/SystemsLean` (en Windows, `%USERPROFILE%\SystemsLean`).
3. Si no existe `~/SystemsLean/editor/node_modules`, pon el editor en `~/SystemsLean/editor` de una de estas dos formas:
   - **Tienes la carpeta de la skill** (instalada como plugin o copiada a la carpeta de skills de tu agente): copia su `editor/` entera a `~/SystemsLean/editor`.
   - **La skill te llegó por el conector de Systems Lean** (no tienes la carpeta): descárgalo del repositorio, sin git. Deja la carpeta en `~/SystemsLean/editor`.
     - macOS, Linux o Git Bash:
       ```bash
       mkdir -p ~/SystemsLean && curl -sSL https://codeload.github.com/SYS-LEAN/systems-lean-skills/tar.gz/refs/heads/main | tar -xz -C ~/SystemsLean --strip-components=5 systems-lean-skills-main/plugins/systems-lean/skills/lanzar-producto-rapido/editor
       ```
     - Windows (PowerShell):
       ```powershell
       New-Item -ItemType Directory -Force "$HOME\SystemsLean" | Out-Null; curl.exe -sSL -o "$env:TEMP\sl-skills.tar.gz" https://codeload.github.com/SYS-LEAN/systems-lean-skills/tar.gz/refs/heads/main; tar -xzf "$env:TEMP\sl-skills.tar.gz" -C "$HOME\SystemsLean" --strip-components=5 systems-lean-skills-main/plugins/systems-lean/skills/lanzar-producto-rapido/editor
       ```
   - Después corre `npm install` dentro (1 o 2 minutos, unos 400 MB) y verifica con `npm run tipos`.
4. **Actualizar:** compara la `version` de `~/SystemsLean/editor/package.json` con la del editor de la skill, o con la del repositorio si la skill llegó por el conector: https://raw.githubusercontent.com/SYS-LEAN/systems-lean-skills/main/plugins/systems-lean/skills/lanzar-producto-rapido/editor/package.json. Si la otra es más nueva, copia o descarga el editor encima con el mismo paso 3: reemplaza `src/`, `scripts/` y la configuración sin tocar `node_modules`. Después corre `npm install` otra vez. No borres `node_modules`.
5. El primer render baja un Chrome de Remotion (unos 100 MB). Después ya no.

Todos los comandos se corren **dentro de `~/SystemsLean/editor`**, con rutas completas entre comillas.

## Herramientas
| Comando | Qué hace |
|---|---|
| `node scripts/medir.mjs "<archivo>"` | Tamaño, duración, fps, calidad y avisos (menos de 720p, horizontal, calidad baja) |
| `node scripts/medir.mjs "<audio>" --silencios` | Además, los tramos con voz: sirven para poner los subtítulos por frase |
| `node scripts/hoja.mjs "<video>"` | Hoja con 20 cuadros en orden y su segundo, al lado del video (`<video>_hoja.jpg`). Se mira con la herramienta de leer imágenes |
| `node scripts/render.mjs <Plantilla> "<plan.json>" "<salida>" --carpeta "<entrada>"` | Renderiza. Los archivos del plan se nombran relativos a `--carpeta` |
| `node scripts/analizar.mjs "<video, audio, imagen o url>" ["<qué quieres saber>"] [--salida "<ruta.txt>"]` | Lo que se dice y lo que se ve en un video, en una sola llamada a Gemini con la llave del usuario (`GEMINI_API_KEY` en `~/SystemsLean/.env`). Sin pedido, da el análisis completo de un anuncio: transcripción con segundos, texto en pantalla, gancho, escenas, ángulo, oferta y precio, y lo ajeno que hay que tapar. `--probar` comprueba la llave |
| `node scripts/bajar.mjs "<url de YouTube>" --salida "<ruta.mp4>" [--calidad 1080]` / `--info` / `--actualizar` | Baja a la PC un video de YouTube o un Short, con su audio (YouTube no deja bajarlo al servidor de la app). La primera vez instala solo el programa `yt-dlp` en `~/SystemsLean/bin`. `--info` dice título, canal, duración y vistas sin bajar. `--actualizar` pone al día `yt-dlp`: es lo primero si deja de bajar. Pide Node.js 22 o más |
| `node scripts/voz.mjs --lista` / `--voz <id> --texto "..." --salida "<mp3>"` | Voz con la cuenta de ElevenLabs del usuario (`ELEVENLABS_API_KEY` en `~/SystemsLean/.env`). Opcional |
| `node scripts/stock.mjs --buscar "<palabras en inglés>" [--vertical] [--n 8] [--hoja "<ruta.jpg>"]` | Videos de stock gratis para el relleno. Sin llave, da el enlace de la búsqueda en Pexels. Con la llave de Pixabay del usuario (`PIXABAY_API_KEY` en `~/SystemsLean/.env`, opcional) lista además sus clips con id, duración, tamaño, autor y enlace, y con `--hoja` arma una imagen con sus miniaturas. `--probar` comprueba la llave |
| `node scripts/stock.mjs --bajar <pixabay:id \| pexels:id \| enlace del video> --salida "<ruta.mp4>" [--calidad 1080]` | Baja el clip elegido en la copia de 1080 y anota fuente, enlace y licencia en `fuentes.json`, al lado del archivo. Con el enlace de un video de Pexels no pide llave |

- **Tiempos medidos en una PC normal:** un video de 10 s tarda cerca de 2 minutos. Se renderiza con 2 núcleos para que la PC siga usable.
  - Si la PC se pone lenta, `--concurrency 1`.
  - Si es potente, `--concurrency 4`.
- Para mirar un video antes de renderizarlo: `npm run studio` abre el editor visual en `http://localhost:3000`.

## Plantillas y sus planes

### `EdicionMinima` (video ganador tal cual)
```json
{
  "video": "ganador1.mp4",
  "fuente": { "ancho": 720, "alto": 1280 },
  "tramos": [[0, 21.5], [23.1, 30.4]],
  "tapas": [{ "x": 40, "y": 1010, "w": 300, "h": 90, "desde": 18, "hasta": 30.4, "color": "#000" }],
  "parches": [{ "x": 480, "y": 900, "w": 200, "h": 110, "lineas": ["ENVÍO", "GRATIS"], "desde": 0, "hasta": 10 }],
  "cierre": { "segundos": 3, "titulo": "Escríbenos por WhatsApp" },
  "volumen": 1
}
```
- `fuente`: el tamaño real que da `medir.mjs`. Las tapas y los parches van en **píxeles y segundos del video original**: se leen en la hoja de cuadros del original.
- `tramos`: los segundos que se quedan, en orden. Para quitar un pedazo (el final con «TikTok» o un precio dicho) se parte en dos tramos.
- `tapas`: recuadros del color que mejor se pierda en el fondo; exactos, nunca cajas grandes.
- `parches`: un sello propio encima de algo ajeno (la primera línea sale en rojo).
- `cierre`: por defecto, 3 s con el último cuadro desenfocado y «Escríbenos por WhatsApp». Para landing: «Pide el tuyo en la web». Sin país, sin envío y sin forma de pago: el anuncio tiene que poder correr en otros países. Con `"imagen": "producto.png"` muestra el producto real («Así te llega»). `"segundos": 0` lo quita.
- Salida: 1080x1920. Si el original es de otro tamaño, llena el cuadro y recorta lo que sobra.

### `VideoDemo` (video del chat y videos con voz nueva)
```json
{
  "clips": [
    { "video": "uso.mp4", "desde": 2, "hasta": 5.5 },
    { "video": "antes.mp4", "desde": 0, "hasta": 3, "rotulo": "ANTES" },
    { "video": "despues.mp4", "desde": 4, "hasta": 7, "rotulo": "DESPUÉS" }
  ],
  "voz": "voz_demo.mp3",
  "subtitulos": [
    { "texto": "¿Cansada de las manchas?", "desde": 0.1, "hasta": 1.9 },
    { "texto": "Se aplica en un minuto", "desde": 2.2, "hasta": 4.6 }
  ],
  "musica": "musica.mp3",
  "musica_volumen": 0.12,
  "cierre": { "segundos": 2, "titulo": "Pagas al recibir", "imagen": "producto.png" }
}
```
- Los clips van sin su sonido (`"con_audio": true` lo deja) y suena la voz.
- Si el VideoDemo es un anuncio, el cierre va sin país, envío ni forma de pago («Escríbenos por WhatsApp»). «Pagas al recibir» queda solo para el video del chat.
- Los subtítulos se ubican con `medir.mjs --silencios` sobre la voz: cada tramo con voz es una frase.
- La duración es la suma de los clips más el cierre: que alcance para toda la voz.

## Revisar (siempre, antes de subir)
1. `node scripts/hoja.mjs "<salida.mp4>"` y mira la hoja.
2. Que no se vea nada ajeno: precio, tienda o @.
3. Que las tapas caigan exactas, que los subtítulos y el cierre se lean, y que el producto sea el nuestro.
4. Si algo falla, corrige el plan y vuelve a renderizar.

## Subir a Systems Lean (lo único que usa el servidor)
1. `media_subida_url {producto_id, nombre: "c1-angulo.mp4", mime: "video/mp4"}`: devuelve una URL firmada y un `subida_id`.
2. `curl -X PUT -H "Content-Type: <el mime exacto>" --upload-file "<archivo>" "<upload_url>"`: el archivo va directo al almacenamiento.
3. `media_subida_confirmar {subida_id, fuente}`: queda en la biblioteca del producto con su `url`. La `fuente` es la plataforma de origen (`tiktok`, `meta`) o `manual_upload` para lo propio.
4. La línea de origen y uso va con `media_describir_creativo`; el anunciante, los días activo y las variantes de un ganador ajeno, con `media_editar_creativo`.
5. A la campaña se adjunta con `ads_subir_creativo {conjunto_id, nombre, url, angulo, ...}`. Al flujo, con la `url` de la biblioteca.
