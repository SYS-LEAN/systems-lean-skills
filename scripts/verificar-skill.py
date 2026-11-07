"""Verifica que una skill solo nombre herramientas y argumentos que existen en el conector.

Uso (desde la raíz de este repo, con el repo de la app al lado):
    python -I scripts/verificar-skill.py plugins/systems-lean/skills/lanzar-producto-rapido ../systems-lean-sl/src/worker

Revisa:
1. Que cada `tool` nombrada (con prefijo de módulo) exista en el servidor o sea de un conector externo conocido.
2. Que cada argumento de primer nivel de `tool {arg, arg: …}` exista en el inputSchema de esa tool
   (incluye las propiedades que entran con `...CONSTANTE`).
"""
import re
import sys
import pathlib

sys.stdout.reconfigure(encoding="utf-8")
skill = pathlib.Path(sys.argv[1])
server = pathlib.Path(sys.argv[2])

EXTERNAS = {
    # Dropi (conector oficial)
    "list_products", "quote_shipping", "search_cities", "create_order", "list_orders", "get_order",
    "list_categories", "list_departments", "list_carriers", "list_statuses",
    # Dropkiller
    "search_ads", "get_ad_creatives", "get_ad_transcripts", "search_ad_publishers", "list_store_ads",
    "search_products", "get_product", "semantic_search_ads", "list_creative_formats",
    # Biblioteca de anuncios de Meta
    "ads_library_search",
}
PREFIJOS = ("product_", "projection_", "ads_", "anuncios_", "media_", "chat_", "crm_", "landing_", "store_",
            "soydrop_", "dropi_", "ver_", "listar_", "estructura_", "skills_", "captura_", "video_", "pedidos_",
            "combo_", "marca_", "cuenta_", "sl_", "list_", "search_", "get_", "quote_", "create_")
PROP = r'"?([a-z_][a-z0-9_]*)"?\s*:\s*\{\s*(?:type|enum|description|anyOf|oneOf|items|properties)'

textos = {}
for f in server.rglob("*.ts"):
    try:
        textos[f] = f.read_text(encoding="utf-8")
    except Exception:
        pass
constantes = {}
for t in textos.values():
    for m in re.finditer(r'const\s+([A-Z_][A-Z0-9_]*)\s*=\s*\{', t):
        constantes.setdefault(m.group(1), set()).update(re.findall(PROP, t[m.end(): m.end() + 4000]))
props = {}
for t in textos.values():
    for m in re.finditer(r'name:\s*"([a-z][a-z0-9_]+)"', t):
        bloque = t[m.end(): m.end() + 9000]
        corte = re.search(r'\n\s*\{\s*\n\s*name:\s*"', bloque)
        if corte:
            bloque = bloque[: corte.start()]
        ip = bloque.find("inputSchema")
        claves = set()
        if ip >= 0:
            claves.update(re.findall(PROP, bloque[ip:]))
            for c in re.findall(r'\.\.\.([A-Z_][A-Z0-9_]*)', bloque[ip:]):
                claves.update(constantes.get(c, set()))
        props.setdefault(m.group(1), set()).update(claves)

faltan, malos = {}, []
for f in sorted(skill.rglob("*.md")):
    txt = f.read_text(encoding="utf-8")
    for tok in re.findall(r'`([a-z][a-z0-9_]+)(?:[ `{])', txt):
        if tok.startswith(PREFIJOS) and tok not in props and tok not in EXTERNAS:
            faltan.setdefault(tok, set()).add(f.name)
    for m in re.finditer(r'`([a-z][a-z0-9_]+)\s*\{([^`]*)\}`', txt):
        tool, plano = m.group(1), m.group(2)
        if tool not in props:
            continue
        for _ in range(5):
            plano = re.sub(r'\{[^{}]*\}', '', plano)
            plano = re.sub(r'\[[^\[\]]*\]', '', plano)
        for c in set(re.findall(r'(?:^|,)\s*([a-z_][a-z0-9_]*)\s*(?::|,|$)', plano)):
            if c not in props[tool]:
                malos.append((f.name, tool, c))

print("Nombres con prefijo de módulo que no son tools (si son campos o módulos, está bien):")
for k in sorted(faltan):
    print(f"  {k}  <- {', '.join(sorted(faltan[k]))}")
print("Argumentos que la tool no declara:")
for a in malos:
    print(f"  {a[0]}: {a[1]} -> {a[2]}")
print("Listo:", "sin argumentos dudosos" if not malos else f"{len(malos)} argumentos para revisar")
