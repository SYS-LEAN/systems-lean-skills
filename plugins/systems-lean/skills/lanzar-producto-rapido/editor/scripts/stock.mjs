// Busca y baja videos de stock gratis para el relleno de un anuncio: Pexels y Pixabay.
// - Pexels no pide llave: el video se elige en su página y se baja acá con su enlace.
// - Pixabay (opcional) se busca desde acá, con la llave gratis del propio usuario. Va en el archivo .env
//   de la carpeta de trabajo: PIXABAY_API_KEY=...  (se saca en https://pixabay.com/api/docs/)
// Sin la llave de Pixabay, todo lo de Pexels funciona igual.
// Uso:
//   node scripts/stock.mjs --probar                                    (comprueba la llave de Pixabay)
//   node scripts/stock.mjs --buscar "<palabras, mejor en inglés>" [--vertical] [--fuente pixabay] [--n 8] [--idioma es] [--hoja "<ruta.jpg>"]
//   node scripts/stock.mjs --bajar <pixabay:id | pexels:id | enlace del video> --salida "<ruta.mp4>" [--calidad 1080]
// Se busca de a una necesidad y se baja solo lo elegido: las dos fuentes prohíben las descargas masivas.
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { EDITOR, remotion } from "./remotion.mjs";

const ENV = path.join(EDITOR, "..", ".env");
const CACHE = path.join(os.tmpdir(), "systems-lean-stock");
const UN_DIA = 24 * 60 * 60 * 1000;

const FUENTES = {
  pixabay: {
    nombre: "Pixabay",
    sitio: "https://pixabay.com",
    licencia: "Licencia de contenido de Pixabay: gratis y sin crédito obligatorio; no usar clips con marcas o logos a la vista",
    licencia_url: "https://pixabay.com/service/license-summary/",
  },
  pexels: {
    nombre: "Pexels",
    sitio: "https://www.pexels.com",
    licencia: "Licencia de Pexels: gratis, sirve para anuncios y sin crédito obligatorio; no sugerir que la persona del clip recomienda el producto",
    licencia_url: "https://www.pexels.com/license/",
  },
};
const VARIABLE = "PIXABAY_API_KEY";
const SACAR = "https://pixabay.com/api/docs/ (botón «Login», o «Sign up» si no tienes cuenta; al volver a esa página, la llave aparece en la sección «Search Images», en la fila «key»)";
const FALTA = `Falta la llave de Pixabay. Es gratis: se saca en ${SACAR} y va en ${ENV}, en una línea: ${VARIABLE}=tu_llave`;
const OPCIONAL = `Para buscar también en Pixabay desde acá, con la hoja de miniaturas, hace falta su llave gratis: se saca en ${SACAR} y va en ${ENV}, en una línea: ${VARIABLE}=tu_llave`;
const buscarEnPexels = (palabras, vertical) =>
  `https://www.pexels.com/search/videos/${encodeURIComponent(palabras)}/${vertical ? "?orientation=portrait" : ""}`;

function salir(mensaje) {
  console.error(mensaje);
  process.exit(1);
}

function llave() {
  if (process.env[VARIABLE]) return process.env[VARIABLE];
  for (const env of [ENV, path.join(EDITOR, ".env")]) {
    if (!fs.existsSync(env)) continue;
    const linea = fs.readFileSync(env, "utf8").split(/\r?\n/).find((l) => l.startsWith(VARIABLE + "="));
    const valor = linea?.slice(VARIABLE.length + 1).trim().replace(/^["']|["']$/g, "");
    if (valor) return valor;
  }
  return null;
}

/** Una consulta a Pixabay. Los errores salen en una línea y sin la llave. */
async function pixabay(parametros) {
  const clave = llave();
  if (!clave) salir(FALTA);
  // Pixabay solo recibe la llave en la dirección: por eso la dirección nunca se imprime.
  const consulta = new URLSearchParams({ ...parametros, key: clave });
  let r;
  try {
    r = await fetch(`https://pixabay.com/api/videos/?${consulta}`);
  } catch {
    salir("No pude conectar con Pixabay. Revisa tu internet y vuelve a intentar.");
  }
  if (!r.ok) {
    const cuerpo = (await r.text().catch(() => "")).replaceAll(clave, "•••").replace(/\s+/g, " ").slice(0, 200);
    if (r.status === 401 || r.status === 403 || (r.status === 400 && /api key/i.test(cuerpo))) {
      salir(`La llave de Pixabay no es válida. Revisa la línea ${VARIABLE} de ${ENV} (sin espacios ni comillas). Se saca en ${SACAR}`);
    }
    if (r.status === 429) salir("Pixabay dice que se acabó el cupo por ahora (100 consultas por minuto). Espera un minuto y vuelve a intentar.");
    salir(`Pixabay respondió ${r.status}. ${cuerpo}`);
  }
  const quedan = r.headers.get("x-ratelimit-remaining");
  return { datos: await r.json(), quedan: quedan === null ? null : Number(quedan) };
}

function dePixabay(h) {
  const tamanos = ["large", "medium", "small", "tiny"].map((t) => h.videos?.[t]).filter((a) => a?.url && a.width && a.height);
  const mayor = tamanos[0] ?? {};
  return {
    fuente: "pixabay", id: String(h.id), duracion: Number(h.duration) || 0, ancho: mayor.width ?? 0, alto: mayor.height ?? 0,
    autor: h.user ?? "", autor_url: h.user && h.user_id ? `https://pixabay.com/users/${h.user}-${h.user_id}/` : "", pagina: h.pageURL ?? "",
    etiquetas: h.tags ?? "", miniatura: tamanos.at(-1)?.thumbnail ?? "",
    archivos: tamanos.map((a) => ({ ancho: a.width, alto: a.height, url: a.url })),
  };
}

// Las búsquedas se guardan un día: Pixabay lo pide y así no se gasta el cupo repitiendo.
const archivoCache = (nombre) => path.join(CACHE, nombre + ".json");
function leerCache(nombre) {
  try {
    const guardado = JSON.parse(fs.readFileSync(archivoCache(nombre), "utf8"));
    return Date.now() - guardado.cuando < UN_DIA ? guardado.datos : null;
  } catch {
    return null;
  }
}
function guardarCache(nombre, datos) {
  try {
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(archivoCache(nombre), JSON.stringify({ cuando: Date.now(), datos }));
  } catch {
    // Sin caché se sigue igual.
  }
}

async function buscar(palabras, { vertical, n, idioma }) {
  const firma = crypto.createHash("sha1").update(JSON.stringify(["pixabay", palabras, vertical, n, idioma])).digest("hex").slice(0, 16);
  const guardado = leerCache(`busqueda-${firma}`);
  if (guardado) return { ...guardado, deCache: true };
  // Pixabay no filtra por orientación: se piden más y se dejan los que son más altos que anchos.
  const { datos, quedan } = await pixabay({
    q: palabras.slice(0, 100), per_page: String(vertical ? 200 : Math.max(3, Math.min(200, n * 2))), video_type: "film", safesearch: "true", lang: idioma,
  });
  const videos = (datos.hits ?? []).map(dePixabay).filter((v) => v.archivos.length && (!vertical || v.alto > v.ancho)).slice(0, n);
  for (const v of videos) guardarCache(`video-pixabay-${v.id}`, v);
  const resultado = { videos, quedan };
  guardarCache(`busqueda-${firma}`, resultado);
  return resultado;
}

const lado = (a) => Math.min(a.ancho, a.alto);
/** El archivo más chico que llega a la calidad pedida (lado corto, en píxeles); si ninguno llega, el más grande. */
function elegirArchivo(archivos, calidad) {
  const alcanzan = archivos.filter((a) => lado(a) >= calidad).sort((a, b) => lado(a) - lado(b));
  return alcanzan[0] ?? [...archivos].sort((a, b) => lado(b) - lado(a))[0];
}

/**
 * El archivo de un video de Pexels, sin llave: su enlace de descarga lleva a la copia más grande
 * (puede ser 4K) y con ?w=&h= entrega otra medida si existe. Se pide la que llega a la calidad.
 */
async function archivoDePexels(id, calidad) {
  const base = `https://www.pexels.com/download/video/${id}/`;
  const medidas = (url) => {
    const m = /_(\d{3,4})_(\d{3,4})_\d+fps/.exec(url ?? "");
    return m ? { ancho: Number(m[1]), alto: Number(m[2]) } : null;
  };
  let primero;
  try {
    primero = await fetch(base, { redirect: "manual" });
  } catch {
    salir("No pude conectar con Pexels. Revisa tu internet y vuelve a intentar.");
  }
  if (primero.status === 404) salir(`Pexels no tiene el video ${id}. Revisa el enlace: el id es el número con el que termina.`);
  const mayor = medidas(primero.headers.get("location"));
  if (mayor && lado(mayor) > calidad) {
    const escala = calidad / lado(mayor);
    const chico = { ancho: Math.round((mayor.ancho * escala) / 2) * 2, alto: Math.round((mayor.alto * escala) / 2) * 2 };
    const url = `${base}?w=${chico.ancho}&h=${chico.alto}`;
    const r = await fetch(url, { redirect: "manual" }).catch(() => null);
    if (r && r.status >= 300 && r.status < 400) return { ...chico, url };
  }
  return { ancho: mayor?.ancho ?? 0, alto: mayor?.alto ?? 0, url: base };
}

/** Lo que se pidió bajar: «pixabay:123», «pexels:123» o el enlace de la página del video. */
function queBajar(texto) {
  const t = (texto ?? "").trim();
  const corto = /^(pixabay|pexels):(\d+)$/i.exec(t);
  if (corto) return { fuente: corto[1].toLowerCase(), id: corto[2], pagina: "" };
  const enlace = /^https?:\/\/(?:www\.)?(pixabay)\.com\/(?:[a-z]{2}\/)?videos\/(?:[^/?#]*-)?(\d+)\/?(?:[?#].*)?$/i.exec(t)
    ?? /^https?:\/\/(?:www\.)?(pexels)\.com\/(?:[a-z]{2}-[a-z]{2}\/)?video\/(?:[^/?#]*-)?(\d+)\/?(?:[?#].*)?$/i.exec(t);
  return enlace ? { fuente: enlace[1].toLowerCase(), id: enlace[2], pagina: t.split(/[?#]/)[0] } : null;
}

/** Una hoja con la miniatura de cada resultado y su id, para elegir sin bajar nada. */
async function armarHoja(videos, destino, titulo) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sl-stock-"));
  const cuadros = [];
  for (const [i, v] of videos.slice(0, 20).entries()) {
    if (!v.miniatura) continue;
    try {
      const r = await fetch(v.miniatura);
      if (!r.ok) continue;
      const nombre = `m${String(i).padStart(2, "0")}.jpg`;
      fs.writeFileSync(path.join(tmp, nombre), Buffer.from(await r.arrayBuffer()));
      cuadros.push({ archivo: nombre, segundo: v.duracion, rotulo: `${v.fuente}:${v.id} · ${Math.round(v.duracion)} s` });
    } catch {
      // Una miniatura que no baja no frena la hoja.
    }
  }
  if (!cuadros.length) {
    fs.rmSync(tmp, { recursive: true, force: true });
    return false;
  }
  const props = path.join(tmp, "plan.json");
  fs.writeFileSync(props, JSON.stringify({ cuadros, titulo }));
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  remotion(["still", "src/index.ts", "HojaCuadros", destino, `--props=${props}`, `--public-dir=${tmp}`, "--image-format=jpeg", "--jpeg-quality=85", "--log=error"]);
  fs.rmSync(tmp, { recursive: true, force: true });
  return true;
}

const args = process.argv.slice(2);
const opcion = (nombre) => {
  const i = args.indexOf(nombre);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : undefined;
};
const USO = `Uso:
  node scripts/stock.mjs --probar
  node scripts/stock.mjs --buscar "<palabras, mejor en inglés>" [--vertical] [--fuente pixabay] [--n 8] [--idioma es] [--hoja "<ruta.jpg>"]
  node scripts/stock.mjs --bajar <pixabay:id | pexels:id | enlace del video> --salida "<ruta.mp4>" [--calidad 1080]`;

if (args.includes("--probar")) {
  if (!llave()) salir(`${FALTA}\nSin ella, lo de Pexels funciona igual: el video se elige en su página y se baja con --bajar y su enlace.`);
  const { quedan } = await pixabay({ q: "hands", per_page: "3" });
  console.log(`La llave de Pixabay funciona.${quedan === null ? "" : ` Te quedan ${quedan} consultas de este minuto.`}`);
  console.log("Pexels no pide llave: el video se elige en su página y se baja con --bajar y su enlace.");
  process.exit(0);
}

if (args.includes("--buscar")) {
  const palabras = opcion("--buscar")?.trim();
  if (!palabras) salir(USO);
  const n = Math.max(1, Math.min(20, Number(opcion("--n")) || 8));
  const vertical = args.includes("--vertical");
  const idioma = opcion("--idioma")?.toLowerCase() === "es" ? "es" : "en";
  const enPexels = `Pexels se busca en su página, sin llave: ${buscarEnPexels(palabras, vertical)}\n  El enlace de un video es https://www.pexels.com/video/<nombre>-<id>/ y se baja con: node scripts/stock.mjs --bajar "<enlace del video>" --salida "<ruta.mp4>"`;
  const pedida = opcion("--fuente")?.toLowerCase();
  if (pedida === "pexels") {
    console.log(enPexels);
    process.exit(0);
  }
  if (pedida && pedida !== "pixabay") salir(`No conozco la fuente «${pedida}». Desde acá se busca en pixabay; Pexels se busca en su página.`);
  if (!llave()) {
    // Sin llave no es un error: el stock sale de Pexels.
    if (pedida === "pixabay") salir(FALTA);
    console.log(enPexels);
    console.log("\n" + OPCIONAL);
    process.exit(0);
  }

  const f = FUENTES.pixabay;
  const { videos, quedan, deCache } = await buscar(palabras, { vertical, n, idioma });
  const cupo = deCache ? "búsqueda de las últimas 24 horas, no gastó cupo" : quedan === null ? "" : `te quedan ${quedan} consultas de este minuto`;
  console.log(`${f.nombre} (${f.sitio}) · «${palabras}»${vertical ? " · vertical" : ""} · ${videos.length} resultado${videos.length === 1 ? "" : "s"}${cupo ? " · " + cupo : ""}`);
  if (!videos.length) console.log(`  Nada con esas palabras${vertical ? " en vertical" : ""}. Prueba con otras, en inglés y más cortas${vertical ? ", o sin --vertical" : ""}.`);
  for (const v of videos) {
    console.log(`  pixabay:${v.id} · ${Math.round(v.duracion)} s · ${v.ancho}x${v.alto} · de ${v.autor || "autor sin nombre"} · ${v.pagina}${v.etiquetas ? " · " + v.etiquetas : ""}`);
  }
  console.log(`  ${f.licencia} (${f.licencia_url}).`);

  const hoja = opcion("--hoja");
  if (hoja && videos.length) {
    const destino = path.resolve(hoja);
    if (await armarHoja(videos, destino, `Pixabay · ${palabras}`)) console.log(`\nHoja con las miniaturas: ${destino}`);
    else console.log("\nNo pude bajar las miniaturas para la hoja: abre el enlace de cada video.");
  }
  if (videos.length) console.log('\nPara bajar uno: node scripts/stock.mjs --bajar pixabay:<id> --salida "<carpeta del producto>/entrada/<nombre>.mp4"');
  console.log("\n" + enPexels);
  process.exit(0);
}

if (args.includes("--bajar")) {
  const pedido = queBajar(opcion("--bajar"));
  const salida = opcion("--salida");
  if (!salida || !opcion("--bajar")) salir(USO);
  if (!pedido) salir("Eso no es un video de Pixabay ni de Pexels. Sirven «pixabay:<id>», «pexels:<id>» o el enlace de la página del video en pixabay.com o pexels.com. Un video de TikTok o de Instagram se guarda con el conector de Systems Lean (captura_creativo_guardar con la URL del post).");
  const { fuente, id } = pedido;
  const f = FUENTES[fuente];
  const calidad = Math.max(360, Number(opcion("--calidad")) || 1080);

  let video;
  let archivo;
  if (fuente === "pixabay") {
    video = leerCache(`video-pixabay-${id}`);
    if (!video) {
      const hit = (await pixabay({ id })).datos.hits?.[0];
      if (!hit) salir(`Pixabay no tiene el video ${id}. Revisa el id: sale de --buscar.`);
      video = dePixabay(hit);
      guardarCache(`video-pixabay-${id}`, video);
    }
    archivo = elegirArchivo(video.archivos, calidad);
    if (!archivo) salir("Pixabay no ofrece un archivo mp4 de ese video. Elige otro.");
  } else {
    archivo = await archivoDePexels(id, calidad);
    video = { duracion: 0, autor: "", autor_url: "", pagina: pedido.pagina || `https://www.pexels.com/video/${id}/` };
  }

  const destino = path.resolve(salida);
  const parcial = destino + ".parcial";
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  try {
    const r = await fetch(archivo.url, { redirect: "follow" });
    if (!r.ok || !r.body) throw new Error(`${f.nombre} respondió ${r.status}`);
    await pipeline(Readable.fromWeb(r.body), fs.createWriteStream(parcial));
    // Un mp4 de verdad lleva «ftyp» al principio: una página de error no.
    const cabeza = Buffer.alloc(12);
    const fd = fs.openSync(parcial, "r");
    fs.readSync(fd, cabeza, 0, 12, 0);
    fs.closeSync(fd);
    if (cabeza.toString("latin1", 4, 8) !== "ftyp") throw new Error("lo que bajó no es un video mp4");
    fs.renameSync(parcial, destino);
  } catch (e) {
    fs.rmSync(parcial, { force: true });
    salir(`No pude bajar ${fuente}:${id}: ${e instanceof Error && !/fetch failed|terminated/i.test(e.message) ? e.message : "se cortó la conexión"}. Vuelve a intentar o elige otro.`);
  }

  // Se anota de dónde salió cada clip, para poder cambiarlo si alguien lo reclama.
  const registro = path.join(path.dirname(destino), "fuentes.json");
  let fuentes = [];
  try {
    fuentes = JSON.parse(fs.readFileSync(registro, "utf8"));
    if (!Array.isArray(fuentes)) fuentes = [];
  } catch {
    fuentes = [];
  }
  fuentes = fuentes.filter((x) => x.archivo !== path.basename(destino));
  fuentes.push({
    archivo: path.basename(destino), fuente: f.nombre, id, pagina: video.pagina, autor: video.autor, autor_url: video.autor_url,
    licencia: f.licencia, licencia_url: f.licencia_url, bajado: new Date().toISOString().slice(0, 10),
  });
  fs.writeFileSync(registro, JSON.stringify(fuentes, null, 2) + "\n", "utf8");

  const megas = (fs.statSync(destino).size / 1024 / 1024).toFixed(1);
  const medida = archivo.ancho && archivo.alto ? ` · ${archivo.ancho}x${archivo.alto}` : "";
  console.log(`${destino}${medida}${video.duracion ? ` · ${Math.round(video.duracion)} s` : ""} · ${megas} MB`);
  console.log(`De ${f.nombre}${video.autor ? ", por " + video.autor : ""}: ${video.pagina}`);
  console.log(`Anotado en ${registro}. Mídelo con: node scripts/medir.mjs "${destino}"`);
  process.exit(0);
}

salir(USO);
