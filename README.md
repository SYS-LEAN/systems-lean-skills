# Skills de Systems Lean

Skills para trabajar con la app [Systems Lean](https://app.systemslean.com) desde tu agente de IA: **Claude Code**, **Codex** de OpenAI o **Antigravity** (antes Gemini CLI) de Google. Usan el formato abierto de skills (una carpeta con `SKILL.md`), que leen los tres.

| Skill | Qué hace |
|---|---|
| `lanzar-producto-rapido` | Lanza un producto físico de dropshipping contra entrega (Dropi o Soydrop) de punta a punta, desde tu Biblioteca y tu Lista de Testeo hasta la campaña de Meta lista para encender, en un solo chat y todo por el conector de Systems Lean |

### Qué deja hecho en tu cuenta de Systems Lean
- **Product Lean:** el producto guardado en tu Biblioteca y en tu Lista de Testeo, investigado desde ahí (con los datos del proveedor y sus fotos en Creativos de Inspiración), vinculado al proveedor, con checklist, viabilidad, fotos, keywords, el informe de investigación (ángulos, ofertas y precios de la competencia, destino, formatos, nivel de conciencia, creencias y dolores), los ángulos de venta, la ficha técnica, la entrega, la cobertura y la ficha que usa el agente.
- **Projection:** costos, flete real, tasas de cancelación y devolución, los paquetes, las ofertas que convienen, los escenarios que pidas y los dos CPA.
- **Creativos:** los anuncios ganadores de referencia guardados y descritos, y por cada ángulo un video y una imagen listos, más 6 videos de reserva.
- **WhatsApp o landing:** el agente con tu producto, el embudo «precio primero» y la confirmación publicados (o la landing con su checkout).
- **Ads Lean:** la campaña de testeo con un conjunto por ángulo y sus anuncios, en pausa hasta que tú digas «enciéndela».

Tu agente va llenando una ficha del lanzamiento (`LANZAMIENTO.md`) y no da nada por hecho sin leerlo en la app. Si el chat se corta, retoma desde ahí.

## Qué necesitas

### Obligatorio
- **Un agente de IA con terminal:** Claude Code (planes Pro y Max de Claude; sirve la app de escritorio, pestaña Code, o la terminal), Codex de OpenAI (con tu cuenta de ChatGPT) o Antigravity CLI de Google.
- **Una cuenta de Systems Lean con el plan Plus (el que incluye el conector), con créditos, y el conector agregado en tu agente.** Es un conector MCP remoto con la dirección `https://app.systemslean.com/mcp`, y se inicia sesión con tu cuenta de Systems Lean.
  - En Claude: https://claude.ai/settings/connectors → «Agregar conector personalizado», y después «Autorizar». En la app de escritorio aparece solo.
  - En Codex o Antigravity: agrégalo en su configuración de servidores MCP con esa dirección.
- **La extensión de Chrome de Systems Lean** ([Chrome Web Store](https://chromewebstore.google.com/detail/ieigggdfakhdegnggjhdhdlhhfhkojme)), con tu sesión iniciada: conecta tu cuenta de Soydrop, guarda productos de Dropi y de Soydrop con el botón «Guardar en Systems Lean» y con ella haces tu parte de la investigación (guardar anuncios, extraer la Biblioteca de Meta, Marketplace, AliExpress y comentarios).
- **Dentro de Systems Lean,** en https://app.systemslean.com/credenciales → «Meta»:
  - tu cuenta publicitaria, tu página y tu píxel conectados;
  - tu número de WhatsApp conectado, si vendes por WhatsApp.
- **Una Unidad de Negocio (tu marca).** Si no tienes, tu agente la crea contigo en el primer paso.
- **Tu proveedor:**
  - Colombia y otros países de Dropi: el conector oficial de Dropi, `https://mcp.dropi.co/mcp`, agregado igual que el de Systems Lean.
  - Honduras: tu cuenta de Soydrop, conectada con la extensión de Chrome de Systems Lean.
- **Node.js 20 o más** (la versión LTS de https://nodejs.org) y unos 500 MB libres en el disco para el editor de videos.

### Recomendado
- **Una llave de Gemini,** gratis en https://aistudio.google.com/apikey: con ella tu agente sabe qué se dice y qué se ve en los videos de la competencia. Va en el archivo `~/SystemsLean/.env` de tu PC, que tu agente te abre; no se pega en el chat.
- **Un navegador para tu agente,** para leer la Biblioteca de anuncios de Meta. En Claude: la extensión [Claude in Chrome](https://claude.com/chrome).
- **Un conector de la Biblioteca de anuncios de Meta**, para medir la competencia. En Claude viene gratis en el directorio de conectores. Sin él, la competencia se mira en la Biblioteca a mano.
- **Dropkiller o TrendTrack:** suman datos de ventas y ganadores de otros países.
- **La voz de los audios** sale de la app, con tus créditos: voces de ElevenLabs por país y acento, sin abrir ninguna cuenta. Si ya tienes tu cuenta de ElevenLabs, también sirve; y sin gastar, los grabas con el celular.

### No necesitas
Instalar ffmpeg, Python, git, un servidor propio ni editores de video: el editor de la skill es un proyecto de Remotion que trae todo y se instala solo la primera vez.

## Dónde se procesa cada cosa
- **En tu PC:** toda la edición de videos (cortes, tapar precios y marcas, cierre, video demo con subtítulos). Un video de 10 s tarda unos 2 minutos.
- **En Systems Lean, por el conector:** todo lo demás. Guardar el producto, la investigación, la oferta y los costos; generar con IA (cobra créditos) las imágenes de los anuncios, la de la promoción del chat y las de la landing, y también tomas de video y voces; la landing, el flujo de WhatsApp y la campaña de Meta. Los videos terminados se suben directo al almacenamiento de la app.

## Instalar

### Opción 1 · Sin instalar nada (cualquier agente)
Con el conector de Systems Lean agregado, pídele a tu agente «lanza el producto …». El conector le entrega la skill completa en ese momento, siempre en su versión más nueva. El editor de videos se descarga solo la primera vez.

### Opción 2 · Instalar la skill
Así tu agente la reconoce sola en cada chat.

**Claude Code** (app de escritorio, pestaña Code): botón **+** → **Add plugins** → agregar el marketplace `SYS-LEAN/systems-lean-skills` → instalar **systems-lean**. O en la terminal:
```bash
claude plugin marketplace add SYS-LEAN/systems-lean-skills
claude plugin install systems-lean@systems-lean
```
Para recibir las actualizaciones, actívalas una vez: `/plugin` → pestaña **Marketplaces** → **systems-lean** → **Enable auto-update**. A mano: `claude plugin marketplace update systems-lean`.

**Codex, Antigravity o Gemini CLI:** copia la carpeta de la skill a la carpeta de skills de tu agente. El comando la baja del repositorio sin git:
- `~/.agents/skills`: la leen Codex (terminal, extensión del editor y app de escritorio de ChatGPT) y Gemini CLI, en todos tus proyectos.
- `.agents/skills` dentro de la carpeta de tu proyecto: la leen Antigravity, Codex y Gemini CLI, solo en ese proyecto.

macOS, Linux o Git Bash (cambia `~/.agents/skills` por `.agents/skills` para un solo proyecto):
```bash
mkdir -p ~/.agents/skills && curl -sSL https://codeload.github.com/SYS-LEAN/systems-lean-skills/tar.gz/refs/heads/main | tar -xz -C ~/.agents/skills --strip-components=4 systems-lean-skills-main/plugins/systems-lean/skills/lanzar-producto-rapido
```
Windows (PowerShell):
```powershell
New-Item -ItemType Directory -Force "$HOME\.agents\skills" | Out-Null; curl.exe -sSL -o "$env:TEMP\sl-skills.tar.gz" https://codeload.github.com/SYS-LEAN/systems-lean-skills/tar.gz/refs/heads/main; tar -xzf "$env:TEMP\sl-skills.tar.gz" -C "$HOME\.agents\skills" --strip-components=4 systems-lean-skills-main/plugins/systems-lean/skills/lanzar-producto-rapido
```
Reinicia tu agente. Para actualizar, vuelve a correr el mismo comando.

## Usar
1. Abre tu agente en una carpeta de trabajo, por ejemplo `Documentos/SystemsLean`.
2. Escribe, por ejemplo: «Lanza el producto 2264665 de Dropi en Colombia». También puedes llamar la skill por su nombre: `/systems-lean:lanzar-producto-rapido` en Claude Code o `$lanzar-producto-rapido` en Codex.
3. La primera vez, tu agente instala el editor de videos en `~/SystemsLean/editor` (1 o 2 minutos).
4. Te pregunta en tres momentos, cada vez en un solo mensaje y con su propuesta: tu parte de la investigación, la oferta en Projection y la landing.
5. Te pide el OK antes de gastar: antes de generar con créditos y antes de encender la campaña.

## Licencia de Remotion
El editor usa [Remotion](https://www.remotion.dev). Es gratis para personas y para empresas de hasta 3 personas; una empresa más grande necesita su propia licencia: https://www.remotion.dev/license

---

## Para mantenerlo (Systems Lean)
- Cada skill vive en `plugins/systems-lean/skills/<nombre>/`. Una skill nueva se agrega como carpeta con su `SKILL.md`. El frontmatter lleva solo `name` y `description`, cada uno en una línea, y la descripción con menos de 1.024 caracteres: así la leen todos los agentes.
- Nada propio de un solo agente dentro de la skill (variables como `${CLAUDE_SKILL_DIR}`, nombres de herramientas de un solo cliente). Si hace falta un ejemplo de uno, va entre paréntesis.
- **El conector de Systems Lean lee `lanzar-producto-rapido` de este repo** (rama `main`): el `SKILL.md` y cada `references/*.md` que enlaza con la forma `[references/x.md](references/x.md)`. Lo entrega por partes, como una skill instalada: primero el `SKILL.md` con la lista de sus referencias, y el agente pide cada una cuando la skill la nombra (`sl_como_trabajar {tarea: "lanzar-producto-rapido references/x.md"}`), que llega sola. Tiene 10 minutos de caché: un push a `main` llega a todos los agentes conectados en 10 minutos, sin desplegar la app. Una referencia que no se enlace así no llega por el conector. Que el `SKILL.md` quede corto: es lo que viaja en la primera respuesta.
- `plugin.json` no lleva `version` a propósito: los usuarios de Claude Code reciben cada commit de `main`.
- Si cambias el editor (`editor/`), sube la `version` de `editor/package.json`: así la skill sabe que tiene que copiar el editor nuevo a la PC del usuario.
- Antes de publicar: `npm install` y `npm run tipos` en una copia del editor, y un render de prueba de cada plantilla.
- **Cada herramienta que nombre una skill tiene que existir.** Con el repo de la app al lado, corre `python -I scripts/verificar-skill.py plugins/systems-lean/skills/<skill> ../systems-lean-sl/src/worker`: lista las tools que no existen y los argumentos que su esquema no declara.
- **Cada paso de una skill termina con su lectura** (la tool que comprueba que quedó guardado) y un «no avances si…». Una skill que solo nombra pasos hace que el agente diga «listo» con módulos vacíos.
- Nada de datos de clientes, de cuentas propias ni de productos en curso: el repo es público.
