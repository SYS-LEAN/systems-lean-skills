/**
 * Video demo para el chat de WhatsApp: clips REALES del producto (aplicación,
 * antes y después de la misma persona), una voz en off corta y subtítulos por
 * frase. Nunca una persona generada con IA.
 * Salida: 1080x1920 a 30 fps.
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { Audio, Video } from "@remotion/media";
import { ALTO, ANCHO, Cierre, FPS, INTER, SOMBRA_TEXTO, TextoCierre, aFrames, srcDe, tramosEnFrames } from "./comun";

export type ClipDemo = {
  /** Archivo de la carpeta de entrada (o URL https). */
  video: string;
  /** Segundos del clip original que se usan. */
  desde: number;
  hasta: number;
  /** Rótulo grande arriba, por ejemplo «ANTES» o «DESPUÉS». */
  rotulo?: string;
  /** Deja el sonido del clip (por defecto va en silencio y suena la voz en off). */
  con_audio?: boolean;
};

export type Subtitulo = { texto: string; desde: number; hasta: number };

export type PlanDemo = {
  clips: ClipDemo[];
  /** Voz en off (mp3 o wav) desde el segundo 0. */
  voz?: string;
  voz_volumen?: number;
  musica?: string;
  musica_volumen?: number;
  /** Frases con sus segundos en el video final (salen de scripts/medir.mjs --silencios). */
  subtitulos?: Subtitulo[];
  /** Cierre opcional (por defecto, sin cierre). */
  cierre?: Cierre;
};

const segundosCierre = (p: PlanDemo) => Math.max(0, p.cierre?.segundos ?? 0);

export const calcularDemo: CalculateMetadataFunction<PlanDemo> = ({ props }) => {
  const cuerpo = props.clips.reduce((s, c) => s + Math.max(0, c.hasta - c.desde), 0);
  const total = cuerpo + segundosCierre(props);
  return { durationInFrames: Math.max(1, Math.round(total * FPS)), fps: FPS, width: ANCHO, height: ALTO };
};

const Rotulo: React.FC<{ texto: string }> = ({ texto }) => (
  <div
    style={{
      position: "absolute",
      top: 200,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontFamily: INTER,
        fontWeight: 900,
        fontSize: 84,
        letterSpacing: 2,
        color: "#111",
        backgroundColor: "#fff",
        padding: "14px 48px",
        borderRadius: 999,
        boxShadow: "0 10px 30px rgba(0,0,0,.45)",
      }}
    >
      {texto}
    </div>
  </div>
);

const Subtitulos: React.FC<{ lista: Subtitulo[] }> = ({ lista }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const actual = lista.find((s) => t >= s.desde && t < s.hasta);
  if (!actual) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 560 }}>
      <div
        style={{
          maxWidth: 940,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.15,
          color: "#fff",
          textShadow: SOMBRA_TEXTO,
        }}
      >
        {actual.texto}
      </div>
    </AbsoluteFill>
  );
};

export const VideoDemo: React.FC<PlanDemo> = (plan) => {
  const { fps, durationInFrames } = useVideoConfig();
  const partes = tramosEnFrames(plan.clips.map((c) => c.hasta - c.desde), fps);
  const cuerpo = partes.length ? partes[partes.length - 1].desde + partes[partes.length - 1].dur : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {plan.clips.map((c, i) => (
        <Sequence key={i} from={partes[i].desde} durationInFrames={partes[i].dur}>
          <AbsoluteFill>
            <Video
              src={srcDe(c.video)}
              trimBefore={c.desde > 0 ? aFrames(c.desde, fps) : undefined}
              trimAfter={aFrames(c.hasta, fps)}
              objectFit="cover"
              muted={!c.con_audio}
              style={{ width: "100%", height: "100%" }}
            />
            {c.rotulo ? <Rotulo texto={c.rotulo} /> : null}
          </AbsoluteFill>
        </Sequence>
      ))}
      {segundosCierre(plan) > 0 && durationInFrames > cuerpo ? (
        <Sequence from={cuerpo} durationInFrames={durationInFrames - cuerpo}>
          <AbsoluteFill style={{ backgroundColor: "#0d1617" }}>
            <TextoCierre cierre={plan.cierre ?? {}} />
          </AbsoluteFill>
        </Sequence>
      ) : null}
      {plan.voz ? <Audio src={srcDe(plan.voz)} volume={plan.voz_volumen ?? 1} /> : null}
      {plan.musica ? <Audio src={srcDe(plan.musica)} volume={plan.musica_volumen ?? 0.12} loop /> : null}
      {plan.subtitulos?.length ? <Subtitulos lista={plan.subtitulos} /> : null}
    </AbsoluteFill>
  );
};
