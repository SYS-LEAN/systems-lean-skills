// Corre el CLI de Remotion del editor sin pasar por la consola (sin problemas de comillas en Windows).
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

export const EDITOR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(EDITOR, "node_modules", "@remotion", "cli", "remotion-cli.js");

export function remotion(args, { capturar = false } = {}) {
  if (!fs.existsSync(CLI)) {
    console.error("Falta instalar el editor: corre «npm install» en " + EDITOR);
    process.exit(1);
  }
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd: EDITOR,
    encoding: "utf8",
    stdio: capturar ? ["ignore", "pipe", "pipe"] : "inherit",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0 && !capturar) process.exit(r.status ?? 1);
  return r;
}
