// Voz con ElevenLabs, con la cuenta del propio usuario (opcional: también puede grabar los audios con el celular).
// La llave va en el archivo .env de la carpeta de trabajo: ELEVENLABS_API_KEY=...
// Uso:
//   node scripts/voz.mjs --lista                                  (voces de tu cuenta)
//   node scripts/voz.mjs --voz <voice_id> --texto "Hola..." --salida "C:/ruta/a1.mp3" [--modelo eleven_multilingual_v2]
import fs from "node:fs";
import path from "node:path";
import { EDITOR } from "./remotion.mjs";

function llave() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  for (const env of [path.join(EDITOR, "..", ".env"), path.join(EDITOR, ".env")]) {
    if (!fs.existsSync(env)) continue;
    const linea = fs.readFileSync(env, "utf8").split(/\r?\n/).find((l) => l.startsWith("ELEVENLABS_API_KEY="));
    if (linea) return linea.slice("ELEVENLABS_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
  }
  console.error("Falta ELEVENLABS_API_KEY en " + path.join(EDITOR, "..", ".env") + ". Sin ella, graba los audios con el celular.");
  process.exit(1);
}

const arg = (nombre) => {
  const i = process.argv.indexOf(nombre);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

const clave = llave();

if (process.argv.includes("--lista")) {
  const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": clave } });
  if (!r.ok) {
    console.error("ElevenLabs respondió " + r.status + ": " + (await r.text()).slice(0, 300));
    process.exit(1);
  }
  const { voices } = await r.json();
  for (const v of voices) console.log(`${v.voice_id}  ${v.name}  ${Object.values(v.labels ?? {}).join(", ")}`);
  process.exit(0);
}

const voz = arg("--voz");
const texto = arg("--texto");
const salida = arg("--salida");
const modelo = arg("--modelo") ?? "eleven_multilingual_v2";
if (!voz || !texto || !salida) {
  console.error('Uso: node scripts/voz.mjs --voz <voice_id> --texto "..." --salida "ruta.mp3" [--modelo ...]');
  process.exit(1);
}
const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voz)}?output_format=mp3_44100_128`, {
  method: "POST",
  headers: { "xi-api-key": clave, "Content-Type": "application/json", Accept: "audio/mpeg" },
  body: JSON.stringify({ text: texto, model_id: modelo }),
});
if (!r.ok) {
  console.error("ElevenLabs respondió " + r.status + ": " + (await r.text()).slice(0, 300));
  process.exit(1);
}
fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
fs.writeFileSync(path.resolve(salida), Buffer.from(await r.arrayBuffer()));
console.log(path.resolve(salida));
