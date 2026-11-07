// Mide un video o un audio en la PC: tamaño, duración, cuadros por segundo y calidad.
// Con --silencios lista los tramos con voz (para poner los subtítulos por frase).
// Uso: node scripts/medir.mjs "C:/ruta/video.mp4" [--silencios]
import path from "node:path";
import { remotion } from "./remotion.mjs";

const archivo = process.argv[2];
if (!archivo) {
  console.error('Uso: node scripts/medir.mjs "ruta/archivo" [--silencios]');
  process.exit(1);
}
const ruta = path.resolve(archivo);

const sonda = remotion(
  ["ffprobe", "-v", "error", "-show_entries", "format=duration,bit_rate:stream=codec_type,width,height,r_frame_rate", "-of", "json", ruta],
  { capturar: true },
);
if (sonda.status !== 0) {
  console.error(sonda.stderr || "No se pudo leer el archivo.");
  process.exit(1);
}
const info = JSON.parse(sonda.stdout);
const video = (info.streams ?? []).find((s) => s.codec_type === "video");
const audio = (info.streams ?? []).find((s) => s.codec_type === "audio");
const [num, den] = (video?.r_frame_rate ?? "0/1").split("/").map(Number);
const salida = {
  archivo: ruta,
  duracion_s: Number(Number(info.format?.duration ?? 0).toFixed(2)),
  ancho: video?.width ?? null,
  alto: video?.height ?? null,
  fps: video && den ? Number((num / den).toFixed(2)) : null,
  mbps: info.format?.bit_rate ? Number((Number(info.format.bit_rate) / 1e6).toFixed(2)) : null,
  tiene_audio: Boolean(audio),
};
if (video) {
  const avisos = [];
  if (Math.min(video.width, video.height) < 720) avisos.push("menos de 720p: sirve, pero revisa que no se vea borroso");
  if (video.width > video.height) avisos.push("horizontal: al llenar 1080x1920 se recortan los lados");
  if (salida.mbps !== null && salida.mbps < 1) avisos.push("calidad baja (menos de 1 Mbps)");
  if (avisos.length) salida.avisos = avisos;
}

if (process.argv.includes("--silencios") && audio) {
  const r = remotion(["ffmpeg", "-hide_banner", "-nostats", "-i", ruta, "-af", "silencedetect=noise=-32dB:d=0.25", "-f", "null", "-"], {
    capturar: true,
  });
  const texto = r.stderr ?? "";
  const inicios = [...texto.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const finales = [...texto.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const voz = [];
  let desde = 0;
  for (let i = 0; i < inicios.length; i++) {
    if (inicios[i] - desde > 0.15) voz.push({ desde: Number(desde.toFixed(2)), hasta: Number(inicios[i].toFixed(2)) });
    desde = finales[i] ?? salida.duracion_s;
  }
  if (salida.duracion_s - desde > 0.15) voz.push({ desde: Number(desde.toFixed(2)), hasta: salida.duracion_s });
  salida.tramos_con_voz = voz;
}

console.log(JSON.stringify(salida, null, 2));
