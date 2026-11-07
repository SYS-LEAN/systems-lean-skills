/**
 * Configuración del render local. Todo corre en la PC del usuario.
 * Concurrencia 2: la PC sigue usable mientras renderiza. En una PC potente
 * se puede subir con --concurrency=4 en el comando; en una lenta, bajar a 1.
 */
import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");
Config.setCodec("h264");
Config.setCrf(18);
Config.setVideoImageFormat("jpeg");
Config.setConcurrency(2);
Config.setOverwriteOutput(true);
Config.setShouldOpenBrowser(false);
