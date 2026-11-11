// Anota de dónde salió cada clip ajeno (stock o redes) en fuentes.json, al lado del archivo,
// para poder cambiarlo si alguien lo reclama. Lo usan stock.mjs y bajar.mjs.
import fs from "node:fs";
import path from "node:path";

/** Agrega o reemplaza la entrada de `archivo` en el fuentes.json de su carpeta. Devuelve la ruta del registro. */
export function anotarFuente(archivo, datos) {
  const registro = path.join(path.dirname(archivo), "fuentes.json");
  let fuentes = [];
  try {
    fuentes = JSON.parse(fs.readFileSync(registro, "utf8"));
    if (!Array.isArray(fuentes)) fuentes = [];
  } catch {
    fuentes = [];
  }
  fuentes = fuentes.filter((x) => x.archivo !== path.basename(archivo));
  fuentes.push({ archivo: path.basename(archivo), ...datos, bajado: new Date().toISOString().slice(0, 10) });
  fs.writeFileSync(registro, JSON.stringify(fuentes, null, 2) + "\n", "utf8");
  return registro;
}
