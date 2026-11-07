# systems-lean-skills — skills públicas para los usuarios de la app

Marketplace de plugins de Claude Code con las skills que usan los clientes de Systems Lean. Es **público**: nada de datos de clientes, de cuentas propias ni de productos en curso. Son versiones genéricas para cualquier cuenta de la app.

- **Estructura:** `.claude-plugin/marketplace.json` → plugin `plugins/systems-lean/` → skills en `plugins/systems-lean/skills/<nombre>/SKILL.md`.
- **Frontmatter de las skills:** solo `name` y `description`, para que también carguen en claude.ai.
- **Edición de video: siempre en la PC del usuario.** Nada de procesamiento de video en el servidor de la app. El editor es un proyecto de Remotion 4.0.456 en `lanzar-producto-rapido/editor/`; la app solo recibe los archivos terminados por `media_subida_url`.
- **La copia de ffmpeg de Remotion es mínima:** no trae `fps`, `tile` ni `drawtext`. Por eso la hoja de cuadros saca cuadros sueltos y los junta con la plantilla `HojaCuadros`.
- **Versiones:** `plugin.json` sin `version` (los usuarios siguen los commits). Si cambia el editor, se sube la `version` de `editor/package.json`.
- **Probar antes de publicar:** copiar `editor/` a una carpeta temporal, `npm install`, `npm run tipos` y un render de cada plantilla con `scripts/render.mjs`; revisar la hoja de cuadros. `claude plugin validate .` en la raíz.
