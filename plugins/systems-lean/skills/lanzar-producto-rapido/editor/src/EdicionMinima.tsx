/**
 * Edición mínima de un video ganador del MISMO producto, tal cual:
 * se quedan los tramos que sirven, se tapa lo ajeno (precio, tienda, marca de
 * agua) con un recuadro exacto y se agrega un cierre corto con el canal.
 * Sin voz nueva, sin música nueva: el audio original se conserva.
 * Salida: 1080x1920 a 30 fps, el video llena el cuadro (recorta lo que sobra).
 */
import React from "react";
import { AbsoluteFill, Freeze, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { Video } from "@remotion/media";
import { ALTO, ANCHO, CIERRE_WHATSAPP, Cierre, FPS, INTER, TextoCierre, aFrames, limitar, srcDe, tramosEnFrames } from "./comun";

/** Recuadro en píxeles y segundos del video ORIGINAL. Sin desde/hasta, todo el tramo. */
export type Tapa = { x: number; y: number; w: number; h: number; desde?: number; hasta?: number; color?: string };

/** Sello propio encima de algo ajeno: recuadro amarillo con texto (la primera línea en rojo). */
export type Parche = { x: number; y: number; w: number; h: number; lineas: string[]; desde?: number; hasta?: number };

export type PlanEdicion = {
  /** Archivo de la carpeta de entrada (o URL https). */
  video: string;
  /** Tamaño real del original, medido con scripts/medir.mjs. */
  fuente: { ancho: number; alto: number };
  /** Segundos del original que se quedan, en orden: [[desde, hasta], ...]. */
  tramos: [number, number][];
  tapas?: Tapa[];
  parches?: Parche[];
  /** Por defecto: «Escríbenos por WhatsApp», 3 s, sin país, envío ni forma de pago. */
  cierre?: Cierre;
  /** Volumen del audio original (0 a 1). */
  volumen?: number;
};

const cierreDe = (p: PlanEdicion): Required<Omit<Cierre, "imagen">> & Cierre => ({ ...CIERRE_WHATSAPP, ...(p.cierre ?? {}) });

export const calcularEdicion: CalculateMetadataFunction<PlanEdicion> = ({ props }) => {
  const cuerpo = props.tramos.reduce((s, [a, b]) => s + Math.max(0, b - a), 0);
  const total = cuerpo + Math.max(0, cierreDe(props).segundos);
  return { durationInFrames: Math.max(1, Math.round(total * FPS)), fps: FPS, width: ANCHO, height: ALTO };
};

/** Pasa un recuadro del original al cuadro de salida (el video llena 1080x1920). */
function aSalida(fuente: PlanEdicion["fuente"], x: number, y: number, w: number, h: number): React.CSSProperties {
  const escala = Math.max(ANCHO / fuente.ancho, ALTO / fuente.alto);
  const ox = (ANCHO - fuente.ancho * escala) / 2;
  const oy = (ALTO - fuente.alto * escala) / 2;
  return { position: "absolute", left: ox + x * escala, top: oy + y * escala, width: w * escala, height: h * escala };
}

const activo = (t: number, desde?: number, hasta?: number) => (desde === undefined || t >= desde) && (hasta === undefined || t <= hasta);

const Tramo: React.FC<{ plan: PlanEdicion; a: number; b: number; dur: number }> = ({ plan, a, b, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = a + frame / fps; // segundo del original que se ve ahora
  const base = Math.max(0, Math.min(1, plan.volumen ?? 1));
  // Fundido de 1 cuadro en cada corte para que no suene un clic.
  const volumen = (f: number) =>
    base * Math.min(interpolate(f, [0, 1], [0, 1], limitar), interpolate(f, [dur - 2, dur - 1], [1, 0], limitar));
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video
        src={srcDe(plan.video)}
        trimBefore={a > 0 ? aFrames(a, fps) : undefined}
        trimAfter={aFrames(b, fps)}
        objectFit="cover"
        volume={volumen}
        style={{ width: "100%", height: "100%" }}
      />
      {(plan.tapas ?? []).filter((tp) => activo(t, tp.desde, tp.hasta)).map((tp, i) => (
        <div key={`t${i}`} style={{ ...aSalida(plan.fuente, tp.x, tp.y, tp.w, tp.h), backgroundColor: tp.color ?? "#000" }} />
      ))}
      {(plan.parches ?? []).filter((pc) => activo(t, pc.desde, pc.hasta)).map((pc, i) => {
        const caja = aSalida(plan.fuente, pc.x, pc.y, pc.w, pc.h);
        const alto = Number(caja.height);
        const tam = alto / (pc.lineas.length + 1.2);
        return (
          <div
            key={`p${i}`}
            style={{
              ...caja,
              backgroundColor: "#ffd21f",
              border: "3px solid #000",
              borderRadius: Math.min(24, alto / 6),
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: INTER,
              fontWeight: 900,
              lineHeight: 1.05,
              textAlign: "center",
            }}
          >
            {pc.lineas.map((l, j) => (
              <div key={j} style={{ fontSize: tam, color: j === 0 ? "#c80000" : "#000" }}>{l}</div>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Último cuadro del video, desenfocado y oscuro, con el texto del canal encima. */
const CierreFinal: React.FC<{ plan: PlanEdicion; ultimo: number }> = ({ plan, ultimo }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(28px) brightness(0.55)", transform: "scale(1.1)" }}>
        <Freeze frame={0}>
          <Video
            src={srcDe(plan.video)}
            trimBefore={aFrames(Math.max(0, ultimo - 0.1), fps)}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </Freeze>
      </AbsoluteFill>
      <TextoCierre cierre={cierreDe(plan)} />
    </AbsoluteFill>
  );
};

export const EdicionMinima: React.FC<PlanEdicion> = (plan) => {
  const { fps, durationInFrames } = useVideoConfig();
  const partes = tramosEnFrames(plan.tramos.map(([a, b]) => b - a), fps);
  const cuerpo = partes.length ? partes[partes.length - 1].desde + partes[partes.length - 1].dur : 0;
  const cierre = cierreDe(plan);
  const ultimo = plan.tramos.length ? plan.tramos[plan.tramos.length - 1][1] : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {plan.tramos.map(([a, b], i) => (
        <Sequence key={i} from={partes[i].desde} durationInFrames={partes[i].dur}>
          <Tramo plan={plan} a={a} b={b} dur={partes[i].dur} />
        </Sequence>
      ))}
      {cierre.segundos > 0 && durationInFrames > cuerpo ? (
        <Sequence from={cuerpo} durationInFrames={durationInFrames - cuerpo}>
          <CierreFinal plan={plan} ultimo={ultimo} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
