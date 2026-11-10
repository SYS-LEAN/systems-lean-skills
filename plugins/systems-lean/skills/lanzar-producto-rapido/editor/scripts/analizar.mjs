// Analiza un video, un audio o una imagen con Gemini, con la llave del propio usuario.
// Sirve para saber qué se dice y qué se ve en un anuncio sin mirarlo cuadro por cuadro.
// La llave va en el archivo .env de la carpeta de trabajo: GEMINI_API_KEY=...
// Se saca gratis en https://aistudio.google.com/apikey
// Uso:
//   node scripts/analizar.mjs --probar                                   (comprueba la llave, no gasta)
//   node scripts/analizar.mjs "<archivo o url>"                          (análisis de anuncio con transcripción)
//   node scripts/analizar.mjs "<archivo o url>" "<qué quieres saber>" [--salida "<ruta.txt>"] [--modelo <id>]
//   node scripts/analizar.mjs "<archivo o url>" --pedido "<archivo.txt>"  (el pedido, en un archivo)
import fs from "node:fs";
import path from "node:path";
import { EDITOR } from "./remotion.mjs";

const ENV = path.join(EDITOR, "..", ".env");
const API = "https://generativelanguage.googleapis.com";
const MODELO = "gemini-3-flash-preview";
const PEDIDO = `Analiza este anuncio para alguien que va a vender el mismo producto. Responde en español, en este orden:
1. TRANSCRIPCIÓN: todo lo que se dice, palabra por palabra, con el segundo en que empieza cada frase ([0.0], [3.2]…). Si no hay voz, dilo.
2. TEXTO EN PANTALLA: cada texto que aparece, con sus segundos y en qué parte del cuadro está.
3. GANCHO: qué se ve y qué se dice en los primeros 3 segundos.
4. ESCENAS: una línea por escena, con sus segundos y lo que muestra.
5. ÁNGULO: el problema o el deseo al que le habla y a quién.
6. OFERTA Y PRECIO: lo que ofrece (cantidad, regalo, envío, forma de pago) y cada precio que se ve o se oye, con su segundo. Si no hay, dilo.
7. LLAMADO A LA ACCIÓN: qué pide hacer y en qué segundo.
8. LO AJENO: logos, nombres de marca, usuarios de redes, marcas de agua, «TikTok», «carrito naranja» o precios, con sus segundos y su lugar en el cuadro.
9. EMPAQUE: cómo se ve el producto y su caja (colores, tapa, tamaño, lo que dice la etiqueta).`;

const TIPOS = {
  ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm", ".m4v": "video/x-m4v",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".m4a": "audio/mp4", ".ogg": "audio/ogg",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
};

function salir(mensaje) {
  console.error(mensaje);
  process.exit(1);
}

function llave() {
  for (const nombre of ["GEMINI_API_KEY", "GOOGLE_AI_API_KEY"]) {
    if (process.env[nombre]) return process.env[nombre];
  }
  for (const env of [ENV, path.join(EDITOR, ".env")]) {
    if (!fs.existsSync(env)) continue;
    const linea = fs.readFileSync(env, "utf8").split(/\r?\n/).find((l) => l.startsWith("GEMINI_API_KEY="));
    const valor = linea?.slice("GEMINI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
    if (valor) return valor;
  }
  salir(`Falta la llave de Gemini. Se saca gratis en https://aistudio.google.com/apikey y va en ${ENV}, en una línea: GEMINI_API_KEY=tu_llave`);
}

/** Una respuesta de Google que no salió bien, en una línea y sin la llave. */
async function fallo(paso, r) {
  const cuerpo = (await r.text()).slice(0, 300);
  if (r.status === 400 && /API key not valid/i.test(cuerpo)) return `La llave de Gemini no es válida. Revisa la línea GEMINI_API_KEY de ${ENV}.`;
  if (r.status === 429) return "Gemini dice que se acabó el cupo gratis por ahora. Espera un minuto y vuelve a intentar.";
  return `${paso}: Gemini respondió ${r.status}. ${cuerpo}`;
}

const args = process.argv.slice(2);
const opcion = (nombre) => {
  const i = args.indexOf(nombre);
  return i >= 0 ? args[i + 1] : undefined;
};
const CON_VALOR = ["--salida", "--modelo", "--pedido"];
const sueltos = args.filter((a, i) => !a.startsWith("--") && !CON_VALOR.includes(args[i - 1]));

const clave = llave();
const cabeceras = { "x-goog-api-key": clave };

if (args.includes("--probar")) {
  const r = await fetch(`${API}/v1beta/models?pageSize=1`, { headers: cabeceras });
  if (!r.ok) salir(await fallo("Probar la llave", r));
  console.log("La llave de Gemini funciona.");
  process.exit(0);
}

const [entrada, pedidoSuelto] = sueltos;
if (!entrada) salir('Uso: node scripts/analizar.mjs "<archivo o url>" ["<qué quieres saber>"] [--salida "<ruta.txt>"]');
const archivoPedido = opcion("--pedido");
const pedido = archivoPedido ? fs.readFileSync(archivoPedido, "utf8").trim() : pedidoSuelto || PEDIDO;
const modelo = opcion("--modelo") ?? process.env.GEMINI_MODELO ?? MODELO;
const salida = opcion("--salida");

const esUrl = /^https?:\/\//i.test(entrada);
let tipo = TIPOS[path.extname(esUrl ? new URL(entrada).pathname : entrada).toLowerCase()];
let bytes;
if (esUrl) {
  const r = await fetch(entrada, { redirect: "follow" });
  if (!r.ok) salir(`No pude bajar ${entrada}: respondió ${r.status}.`);
  tipo ??= (r.headers.get("content-type") ?? "").split(";")[0].trim();
  bytes = Buffer.from(await r.arrayBuffer());
} else {
  if (!fs.existsSync(entrada)) salir(`No existe el archivo ${entrada}`);
  bytes = fs.readFileSync(entrada);
}
if (!/^(video|audio|image)\//.test(tipo ?? "")) salir(`No reconozco el tipo de ${entrada}. Sirven: ${Object.keys(TIPOS).join(" ")}`);

// 1. Se sube el archivo a Gemini.
const inicio = await fetch(`${API}/upload/v1beta/files`, {
  method: "POST",
  headers: {
    ...cabeceras,
    "X-Goog-Upload-Protocol": "resumable",
    "X-Goog-Upload-Command": "start",
    "X-Goog-Upload-Header-Content-Length": String(bytes.length),
    "X-Goog-Upload-Header-Content-Type": tipo,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ file: { display_name: "systems-lean" } }),
});
if (!inicio.ok) salir(await fallo("Subir el archivo", inicio));
const destino = inicio.headers.get("x-goog-upload-url");
if (!destino) salir("Gemini no devolvió dónde subir el archivo. Vuelve a intentar.");
const subida = await fetch(destino, {
  method: "POST",
  headers: { "X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize" },
  body: bytes,
});
if (!subida.ok) salir(await fallo("Subir el archivo", subida));
let { file: archivo } = await subida.json();

try {
  // 2. Gemini lo procesa: un video tarda unos segundos en quedar listo.
  const limite = Date.now() + 180_000;
  while (archivo.state !== "ACTIVE") {
    if (archivo.state === "FAILED") salir("Gemini no pudo procesar el archivo. Revisa que se abra en tu PC (una descarga fallida deja un archivo que no es video) o prueba con mp4.");
    if (Date.now() > limite) salir("Gemini tardó más de 3 minutos en procesar el archivo. Vuelve a intentar.");
    await new Promise((r) => setTimeout(r, 3000));
    const r = await fetch(`${API}/v1beta/${archivo.name}`, { headers: cabeceras });
    if (!r.ok) salir(await fallo("Esperar el archivo", r));
    archivo = await r.json();
  }

  // 3. Una sola llamada con el archivo y el pedido.
  const r = await fetch(`${API}/v1beta/models/${modelo}:generateContent`, {
    method: "POST",
    headers: { ...cabeceras, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ file_data: { mime_type: tipo, file_uri: archivo.uri } }, { text: pedido }] }],
      generationConfig: { temperature: 0.2 },
    }),
  });
  if (!r.ok) salir(await fallo(`Analizar con ${modelo}`, r));
  const respuesta = await r.json();
  const texto = (respuesta.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("\n").trim();
  if (!texto) salir("Gemini no devolvió texto: " + JSON.stringify(respuesta).slice(0, 300));
  if (salida) {
    fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
    fs.writeFileSync(salida, texto + "\n", "utf8");
    console.log("Análisis guardado en " + salida);
  } else {
    console.log(texto);
  }
} finally {
  // El archivo del usuario no se queda en su cuenta de Google.
  await fetch(`${API}/v1beta/${archivo.name}`, { method: "DELETE", headers: cabeceras }).catch(() => {});
}
