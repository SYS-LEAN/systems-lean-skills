import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

export const FPS = 30;
export const ANCHO = 1080;
export const ALTO = 1920;

export const { fontFamily: INTER } = loadFont("normal", {
  weights: ["600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

/** Un archivo de la carpeta de entrada (--public-dir) o una URL https. */
export const srcDe = (archivo: string): string =>
  /^https?:\/\//i.test(archivo) ? archivo : staticFile(archivo);

export const aFrames = (segundos: number, fps = FPS): number => Math.max(0, Math.round(segundos * fps));

export const limitar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Sombra que deja el texto legible sobre cualquier video. */
export const SOMBRA_TEXTO =
  "0 0 3px #000, 0 0 3px #000, 0 3px 0 #000, 0 -3px 0 #000, 3px 0 0 #000, -3px 0 0 #000, 0 8px 24px rgba(0,0,0,.6)";

export type Cierre = {
  /** Segundos del cierre. 0 = sin cierre. */
  segundos?: number;
  titulo?: string;
  subtitulo?: string;
  /** Foto real del producto encima del texto («Así te llega»), si el empaque de los videos es distinto al nuestro. */
  imagen?: string;
};

/** Texto grande del cierre: entra con un fundido corto. */
export const TextoCierre: React.FC<{ cierre: Cierre }> = ({ cierre }) => {
  const frame = useCurrentFrame();
  const opacidad = interpolate(frame, [0, 6], [0, 1], limitar);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 70px",
        opacity: opacidad,
        fontFamily: INTER,
        color: "#fff",
        textAlign: "center",
        textShadow: SOMBRA_TEXTO,
      }}
    >
      {cierre.imagen ? (
        <Img
          src={srcDe(cierre.imagen)}
          style={{ maxWidth: 820, maxHeight: 820, objectFit: "contain", marginBottom: 50, filter: "drop-shadow(0 18px 30px rgba(0,0,0,.6))" }}
        />
      ) : null}
      <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 1.12 }}>{cierre.titulo}</div>
      {cierre.subtitulo ? (
        <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.2, marginTop: 60 }}>{cierre.subtitulo}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export const CIERRE_WHATSAPP: Required<Omit<Cierre, "imagen">> = {
  segundos: 3,
  titulo: "Escríbenos por WhatsApp",
  subtitulo: "Envío gratis y pagas al recibir",
};

/** Reparte segmentos en frames enteros sin que se acumule el redondeo. */
export function tramosEnFrames(duraciones: number[], fps = FPS): { desde: number; dur: number }[] {
  let acumulado = 0;
  return duraciones.map((d) => {
    const desde = Math.round(acumulado * fps);
    acumulado += Math.max(0, d);
    return { desde, dur: Math.max(1, Math.round(acumulado * fps) - desde) };
  });
}
