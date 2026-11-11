// Baja a la PC un video de YouTube (o un Short), con el programa libre yt-dlp.
// Es solo para YouTube, que no deja bajar sus videos al servidor de Systems Lean. Un video de TikTok o de
// Instagram se guarda con el conector (captura_creativo_guardar con la URL del post), sin instalar nada.
// La primera vez descarga yt-dlp de su página oficial a la carpeta de trabajo (~/SystemsLean/bin) y
// comprueba que el archivo sea el publicado. Pide Node.js 22 o más.
// Uso:
//   node scripts/bajar.mjs "<url de YouTube>" --salida "<ruta.mp4>" [--calidad 1080] [--largo]
//   node scripts/bajar.mjs "<url de YouTube>" --info       (título, canal, duración y vistas, sin bajar)
//   node scripts/bajar.mjs --actualizar                     (pone al día yt-dlp: lo primero si deja de bajar)
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { anotarFuente } from "./fuentes.mjs";
import { EDITOR } from "./remotion.mjs";

const BIN = path.join(EDITOR, "..", "bin");
const ORIGEN = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/";
const MINUTOS_MAX = 10;

function salir(mensaje) {
  console.error(mensaje);
  process.exit(1);
}

/** El archivo oficial de yt-dlp para este sistema. */
function programa() {
  if (process.platform === "win32") return process.arch === "arm64" ? "yt-dlp_arm64.exe" : "yt-dlp.exe";
  if (process.platform === "darwin") return "yt-dlp_macos";
  if (process.platform === "linux") return process.arch === "arm64" ? "yt-dlp_linux_aarch64" : "yt-dlp_linux";
  salir(`No hay un yt-dlp listo para este sistema (${process.platform}). Pídele el archivo del video al usuario.`);
}

/** Descarga yt-dlp la primera vez y comprueba su suma contra la que publica el proyecto. */
async function instalar(destino) {
  const nombre = path.basename(destino);
  console.error(`Descargando yt-dlp (una sola vez) desde ${ORIGEN}${nombre} …`);
  const parcial = destino + ".parcial";
  fs.mkdirSync(BIN, { recursive: true });
  try {
    const [archivo, sumas] = await Promise.all([fetch(ORIGEN + nombre, { redirect: "follow" }), fetch(ORIGEN + "SHA2-256SUMS", { redirect: "follow" })]);
    if (!archivo.ok || !archivo.body) throw new Error(`la descarga respondió ${archivo.status}`);
    if (!sumas.ok) throw new Error(`la lista de sumas respondió ${sumas.status}`);
    await pipeline(Readable.fromWeb(archivo.body), fs.createWriteStream(parcial));
    const esperada = (await sumas.text()).split(/\r?\n/).map((l) => l.trim().split(/\s+/)).find((p) => p[1]?.replace(/^\*/, "") === nombre)?.[0];
    const real = crypto.createHash("sha256").update(fs.readFileSync(parcial)).digest("hex");
    if (!esperada || esperada.toLowerCase() !== real) throw new Error("el archivo no coincide con la suma que publica yt-dlp");
    fs.renameSync(parcial, destino);
    if (process.platform !== "win32") fs.chmodSync(destino, 0o755);
  } catch (e) {
    fs.rmSync(parcial, { force: true });
    salir(`No pude instalar yt-dlp: ${e instanceof Error && !/fetch failed|terminated/i.test(e.message) ? e.message : "se cortó la conexión"}. Vuelve a intentar; si sigue igual, pídele el archivo del video al usuario.`);
  }
  console.error(`yt-dlp quedó en ${destino}`);
}

/** La carpeta del ffmpeg que trae Remotion: yt-dlp lo usa para unir el video con su audio. */
function carpetaFfmpeg() {
  const remotion = path.join(EDITOR, "node_modules", "@remotion");
  const ejecutable = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  const carpeta = fs.existsSync(remotion)
    ? fs.readdirSync(remotion).filter((n) => n.startsWith("compositor-")).map((n) => path.join(remotion, n)).find((c) => fs.existsSync(path.join(c, ejecutable)))
    : null;
  if (!carpeta) salir("Falta instalar el editor: corre «npm install» en " + EDITOR);
  return carpeta;
}

/** El id de un video de YouTube, o null si la dirección no es de un video de YouTube. */
function idDeYouTube(texto) {
  let u;
  try {
    u = new URL((texto ?? "").trim());
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  const valido = (id) => (/^[\w-]{6,20}$/.test(id ?? "") ? id : null);
  if (host === "youtu.be") return valido(u.pathname.split("/")[1]);
  if (host !== "youtube.com") return null;
  if (u.pathname === "/watch") return valido(u.searchParams.get("v"));
  const m = /^\/(?:shorts|live|embed)\/([^/?#]+)/.exec(u.pathname);
  return m ? valido(m[1]) : null;
}

/** El error de yt-dlp, dicho en una línea y con lo que conviene hacer. */
function explicar(stderr) {
  const error = (stderr ?? "").split(/\r?\n/).map((l) => l.trim()).filter((l) => /^ERROR:/i.test(l)).pop() ?? "";
  if (/confirm you.{0,3}re not a bot/i.test(error)) return "YouTube pidió iniciar sesión para comprobar que no eres un robot. Pasa con una VPN o una red compartida: apaga la VPN, espera unos minutos y vuelve a intentar. Si sigue igual, pídele el archivo al usuario.";
  if (/confirm your age|age.restricted/i.test(error)) return "El video tiene restricción de edad y YouTube no lo entrega sin iniciar sesión. Usa otro video o pídele el archivo al usuario.";
  if (/private video|members.only|join this channel/i.test(error)) return "El video es privado o solo para miembros del canal: no se puede bajar. Usa otro.";
  if (/unavailable|not available|has been removed|account.{0,20}terminated/i.test(error)) return "El video no está disponible (borrado, o bloqueado en tu país). Usa otro.";
  if (/ffmpeg|postprocess|merg/i.test(error)) return `No se pudo unir el video con su audio. ${error.slice(0, 200)}`;
  return `${error.slice(0, 300) || "yt-dlp terminó con un error que no explicó."} Prueba «node scripts/bajar.mjs --actualizar» y vuelve a intentar.`;
}

const args = process.argv.slice(2);
const opcion = (nombre) => {
  const i = args.indexOf(nombre);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : undefined;
};
const USO = `Uso:
  node scripts/bajar.mjs "<url de YouTube>" --salida "<ruta.mp4>" [--calidad 1080] [--largo]
  node scripts/bajar.mjs "<url de YouTube>" --info
  node scripts/bajar.mjs --actualizar`;

const ytdlp = path.join(BIN, programa());
const correr = (extra, { segundos = 300 } = {}) => {
  const ffmpeg = carpetaFfmpeg();
  // En macOS y Linux el ffmpeg de Remotion carga sus bibliotecas desde su propia carpeta.
  const env = { ...process.env };
  for (const variable of ["LD_LIBRARY_PATH", "DYLD_LIBRARY_PATH"]) env[variable] = [ffmpeg, process.env[variable]].filter(Boolean).join(path.delimiter);
  return spawnSync(ytdlp, ["--no-playlist", "--no-warnings", "--js-runtimes", `node:${process.execPath}`, "--ffmpeg-location", ffmpeg, "--socket-timeout", "20", "--retries", "3", ...extra], {
    encoding: "utf8", env, timeout: segundos * 1000, maxBuffer: 64 * 1024 * 1024, windowsHide: true,
  });
};

if (args.includes("--actualizar")) {
  if (!fs.existsSync(ytdlp)) await instalar(ytdlp);
  else {
    const r = spawnSync(ytdlp, ["-U"], { encoding: "utf8", timeout: 180_000, windowsHide: true });
    if (r.status !== 0) salir("No se pudo actualizar yt-dlp. " + (r.stderr || r.stdout || "").trim().split(/\r?\n/).pop());
  }
  console.log("yt-dlp al día: versión " + spawnSync(ytdlp, ["--version"], { encoding: "utf8", windowsHide: true }).stdout.trim());
  process.exit(0);
}

const url = args.find((a, i) => !a.startsWith("--") && !["--salida", "--calidad"].includes(args[i - 1]));
if (!url) salir(USO);
const id = idDeYouTube(url);
if (!id) {
  if (/tiktok\.com|instagram\.com/i.test(url)) salir("Este comando es solo para YouTube. Un video de TikTok o de Instagram se guarda con el conector de Systems Lean: captura_creativo_guardar {producto_id, media_url: \"<URL del post>\", media_type: \"video\"}.");
  salir("Eso no es un video de YouTube. Sirven enlaces como https://www.youtube.com/watch?v=<id>, https://www.youtube.com/shorts/<id> o https://youtu.be/<id>.");
}
const pagina = `https://www.youtube.com/watch?v=${id}`;
const soloInfo = args.includes("--info");
const salida = opcion("--salida");
if (!soloInfo && !salida) salir(USO);

if (Number(process.versions.node.split(".")[0]) < 22) {
  salir(`Para bajar de YouTube hace falta Node.js 22 o más (tienes ${process.versions.node}). Instala la versión LTS de https://nodejs.org, abre un chat nuevo y vuelve a intentar.`);
}
if (!fs.existsSync(ytdlp)) await instalar(ytdlp);

const minutos = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

if (soloInfo) {
  const r = correr(["--skip-download", "--dump-json", "--", pagina], { segundos: 90 });
  if (r.status !== 0 || !r.stdout.trim()) salir(r.error?.code === "ETIMEDOUT" ? "YouTube tardó demasiado en responder. Vuelve a intentar." : explicar(r.stderr));
  const v = JSON.parse(r.stdout.trim().split(/\r?\n/).pop());
  console.log(`${v.title}`);
  console.log(`Canal: ${v.channel ?? v.uploader ?? "sin nombre"} · ${minutos(v.duration ?? 0)} min · ${v.view_count ?? "?"} vistas · subido el ${String(v.upload_date ?? "").replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3") || "?"}`);
  console.log(`Tamaño original: ${v.width ?? "?"}x${v.height ?? "?"} (${(v.height ?? 0) > (v.width ?? 0) ? "vertical" : "horizontal"})`);
  process.exit(0);
}

const calidad = Math.max(360, Number(opcion("--calidad")) || 1080);
const destino = path.resolve(salida);
fs.mkdirSync(path.dirname(destino), { recursive: true });
const r = correr([
  "-f", "bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[ext=mp4][vcodec^=avc]/best[ext=mp4]/best",
  "-S", `vcodec:h264,res:${calidad}`,
  "--merge-output-format", "mp4",
  ...(args.includes("--largo") ? [] : ["--match-filters", `duration<=?${MINUTOS_MAX * 60}`]),
  "--force-overwrites", "--no-progress", "--no-simulate", "--dump-json",
  "-o", destino.replaceAll("%", "%%"),
  "--", pagina,
]);
if (r.error?.code === "ETIMEDOUT") salir("La descarga tardó más de 5 minutos y se cortó. Vuelve a intentar con una conexión más estable.");
if (r.status !== 0) salir(explicar(r.stderr));
if (!r.stdout.trim()) salir(`El video dura más de ${MINUTOS_MAX} minutos y no se bajó. Para un anuncio alcanza con un tramo corto: busca un Short o un video más corto, o repite con --largo si de verdad lo necesitas entero.`);
if (!fs.existsSync(destino)) salir("yt-dlp terminó sin dejar el archivo. Prueba «node scripts/bajar.mjs --actualizar» y vuelve a intentar.");

const v = JSON.parse(r.stdout.trim().split(/\r?\n/).pop());
const registro = anotarFuente(destino, {
  fuente: "YouTube", id, pagina, autor: v.channel ?? v.uploader ?? "", autor_url: v.channel_url ?? v.uploader_url ?? "",
  licencia: "Sin licencia: el video es de su autor. Se cambia si lo reclama", licencia_url: "",
});
const megas = (fs.statSync(destino).size / 1024 / 1024).toFixed(1);
console.log(`${destino} · ${v.width ?? "?"}x${v.height ?? "?"} · ${minutos(v.duration ?? 0)} min · ${megas} MB`);
console.log(`De YouTube, por ${v.channel ?? v.uploader ?? "autor sin nombre"}: ${pagina}`);
console.log(`Anotado en ${registro}. Mídelo con: node scripts/medir.mjs "${destino}"`);
