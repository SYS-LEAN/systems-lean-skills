/**
 * Hoja de cuadros: 20 cuadros de un video en una sola imagen, con su segundo,
 * para revisarlo de un vistazo antes de subirlo. La arma scripts/hoja.mjs.
 */
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { INTER, srcDe } from "./comun";

export type PlanHoja = { cuadros: { archivo: string; segundo: number }[]; titulo?: string };

export const HOJA = { columnas: 5, celdaAncho: 270, celdaAlto: 480, espacio: 6, cabecera: 56 };
const filas = 4;
export const HOJA_ANCHO = HOJA.columnas * HOJA.celdaAncho + (HOJA.columnas + 1) * HOJA.espacio;
export const HOJA_ALTO = HOJA.cabecera + filas * HOJA.celdaAlto + (filas + 1) * HOJA.espacio;

export const HojaCuadros: React.FC<PlanHoja> = ({ cuadros, titulo }) => (
  <AbsoluteFill style={{ backgroundColor: "#fff", fontFamily: INTER }}>
    <div style={{ height: HOJA.cabecera, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 26, fontWeight: 800, color: "#111" }}>
      {titulo ?? ""}
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: HOJA.espacio, padding: `0 ${HOJA.espacio}px` }}>
      {cuadros.map((c, i) => (
        <div key={i} style={{ position: "relative", width: HOJA.celdaAncho, height: HOJA.celdaAlto, backgroundColor: "#000" }}>
          <Img src={srcDe(c.archivo)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              backgroundColor: "rgba(0,0,0,.7)",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 6,
            }}
          >
            {c.segundo.toFixed(1)} s
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
