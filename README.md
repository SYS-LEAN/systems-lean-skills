# Skills de Systems Lean para Claude Code

Skills para trabajar con la app [Systems Lean](https://app.systemslean.com) desde Claude Code.

| Skill | Qué hace |
|---|---|
| `lanzar-producto-rapido` | Lanza un producto físico de dropshipping contra entrega (Dropi o Soydrop), del producto elegido a la campaña de Meta lista para encender, en unas 2 horas y en un solo chat |

## Qué necesitas

### Obligatorio
- **Claude Code**, incluido en los planes Pro y Max de Claude. Sirve la app de escritorio de Claude (pestaña Code) o la terminal.
- **Una cuenta de Systems Lean con créditos y su conector agregado en Claude.** En claude.ai: Configuración → Conectores → Agregar conector personalizado, con la dirección `https://app.systemslean.com/mcp`, y después «Autorizar». En la app de escritorio aparece solo.
- **Dentro de Systems Lean:**
  - tu cuenta publicitaria de Meta conectada en Ads Lean;
  - tu número de WhatsApp conectado en Chat Lean, si vendes por WhatsApp, o Store Lean, si vendes por landing.
- **Tu proveedor:**
  - Colombia y otros países de Dropi: el conector oficial de Dropi. En claude.ai: Configuración → Conectores → Agregar conector personalizado, con `https://mcp.dropi.co/mcp`.
  - Honduras: tu cuenta de Soydrop, conectada con la extensión de Chrome de Systems Lean.
- **El conector de Meta**, gratis, en el directorio de conectores de Claude. Con él se mide la competencia en la Biblioteca de anuncios.
- **Node.js 20 o más** (la versión LTS de https://nodejs.org) y unos 500 MB libres en el disco para el editor de videos.

### Opcional
- **Dropkiller:** suma datos de ventas y ganadores de otros países.
- **ElevenLabs** (tu propia cuenta): para generar los audios del chat. Sin ella, los grabas con el celular.
- **Una llave de Gemini**, gratis en Google AI Studio: para transcribir el audio de los videos.

### No necesitas
Instalar ffmpeg, Python, un servidor propio ni editores de video: el editor de la skill es un proyecto de Remotion que trae todo y se instala solo la primera vez.

## Dónde se procesa cada cosa
- **En tu PC:** toda la edición de videos (cortes, tapar precios y marcas, cierre, video demo con subtítulos) y la imagen de la promoción. Un video de 10 s tarda unos 2 minutos.
- **En Systems Lean:** guardar el producto, la oferta y los costos, generar imágenes con IA (cobra créditos), el flujo de WhatsApp y la campaña de Meta. Los videos terminados se suben directo al almacenamiento de la app.

## Instalar
**En la app de escritorio de Claude**, pestaña Code: botón **+** → **Add plugins** → agregar el marketplace `SYS-LEAN/systems-lean-skills` → instalar **systems-lean**.

**En la terminal:**
```bash
claude plugin marketplace add SYS-LEAN/systems-lean-skills
claude plugin install systems-lean@systems-lean
```

### Recibir las actualizaciones
Activa la actualización automática una vez: en Claude Code, `/plugin` → pestaña **Marketplaces** → **systems-lean** → **Enable auto-update**. Para actualizar a mano:
```bash
claude plugin marketplace update systems-lean
```

## Usar
1. Abre Claude Code en una carpeta de trabajo, por ejemplo `Documentos/SystemsLean`.
2. Escribe, por ejemplo: «Lanza el producto 2264665 de Dropi en Colombia», o llama la skill con `/systems-lean:lanzar-producto-rapido`.
3. La primera vez, Claude instala el editor de videos en `~/SystemsLean/editor` (1 o 2 minutos).
4. Claude te pide el OK antes de gastar: antes de generar imágenes con créditos y antes de encender la campaña.

## Licencia de Remotion
El editor usa [Remotion](https://www.remotion.dev). Es gratis para personas y para empresas de hasta 3 personas; una empresa más grande necesita su propia licencia: https://www.remotion.dev/license

---

## Para mantenerlo (Systems Lean)
- Cada skill vive en `plugins/systems-lean/skills/<nombre>/`. Una skill nueva se agrega como carpeta con su `SKILL.md`.
- `plugin.json` no lleva `version` a propósito: los usuarios reciben cada commit de `main`.
- Si cambias el editor (`editor/`), sube la `version` de `editor/package.json`: así la skill sabe que tiene que copiar el editor nuevo a la PC del usuario.
- Antes de publicar: `npm install` y `npm run tipos` en una copia del editor, y un render de prueba de cada plantilla.
- Nada de datos de clientes, de cuentas propias ni de productos en curso: el repo es público.
