// Arma una hoja de cuadros de un video (20 cuadros en orden, con su segundo) para revisarlo de un vistazo.
// Uso: node scripts/hoja.mjs "C:/ruta/video.mp4" ["C:/ruta/hoja.jpg"]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { remotion } from "./remotion.mjs";

const archivo = process.argv[2];
if (!archivo) {
  console.error('Uso: node scripts/hoja.mjs "ruta/video.mp4" ["ruta/hoja.jpg"]');
  process.exit(1);
}
const ruta = path.resolve(archivo);
const destino = path.resolve(process.argv[3] ?? ruta.replace(/\.[^.]+$/, "") + "_hoja.jpg");

const sonda = remotion(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", ruta], { capturar: true });
const duracion = Number((sonda.stdout ?? "").trim());
if (!duracion) {
  console.error(sonda.stderr || "No se pudo leer la duración.");
  process.exit(1);
}

// 1) 20 cuadros sueltos (la copia de ffmpeg de Remotion no trae filtros de mosaico).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sl-hoja-"));
const total = 20;
const cuadros = [];
for (let i = 0; i < total; i++) {
  const segundo = Math.min(duracion - 0.05, (duracion * (i + 0.5)) / total);
  const nombre = `c${String(i).padStart(2, "0")}.jpg`;
  const r = remotion(
    ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", segundo.toFixed(2), "-i", ruta, "-frames:v", "1", "-vf", "scale=270:-2", "-q:v", "3", path.join(tmp, nombre)],
    { capturar: true },
  );
  if (r.status === 0) cuadros.push({ archivo: nombre, segundo });
}
if (!cuadros.length) {
  console.error("No se pudo sacar ningún cuadro del video.");
  process.exit(1);
}

// 2) Se juntan en una sola imagen con la plantilla HojaCuadros.
const props = path.join(tmp, "plan.json");
fs.writeFileSync(props, JSON.stringify({ cuadros, titulo: `${path.basename(ruta)} · ${duracion.toFixed(1)} s` }));
remotion(["still", "src/index.ts", "HojaCuadros", destino, `--props=${props}`, `--public-dir=${tmp}`, "--image-format=jpeg", "--jpeg-quality=85", "--log=error"]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(destino);
