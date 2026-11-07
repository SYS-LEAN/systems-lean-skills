// Renderiza en la PC una plantilla del editor con su plan.
// Uso: node scripts/render.mjs <EdicionMinima|VideoDemo|PromoOferta> "plan.json" "salida.mp4|.png" --carpeta "carpeta con los archivos de entrada" [--concurrency 1]
// Los archivos del plan (video, voz, producto...) se nombran relativos a --carpeta.
import fs from "node:fs";
import path from "node:path";
import { remotion } from "./remotion.mjs";

const [comp, plan, salida] = process.argv.slice(2);
const arg = (n) => {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const COMPOS = ["EdicionMinima", "VideoDemo", "PromoOferta"];
if (!COMPOS.includes(comp) || !plan || !salida) {
  console.error('Uso: node scripts/render.mjs <' + COMPOS.join("|") + '> "plan.json" "salida" --carpeta "entrada"');
  process.exit(1);
}
const rutaPlan = path.resolve(plan);
JSON.parse(fs.readFileSync(rutaPlan, "utf8")); // falla aquí, con un mensaje claro, si el plan no es JSON válido
const carpeta = path.resolve(arg("--carpeta") ?? path.dirname(rutaPlan));
const rutaSalida = path.resolve(salida);
fs.mkdirSync(path.dirname(rutaSalida), { recursive: true });

const comunes = ["src/index.ts", comp, rutaSalida, `--props=${rutaPlan}`, `--public-dir=${carpeta}`, "--log=error"];
const inicio = Date.now();
if (comp === "PromoOferta") {
  remotion(["still", ...comunes, "--image-format=jpeg", "--jpeg-quality=92"]);
} else {
  remotion(["render", ...comunes, `--concurrency=${arg("--concurrency") ?? 2}`]);
}
console.log(`${rutaSalida} (${((Date.now() - inicio) / 1000).toFixed(0)} s)`);
