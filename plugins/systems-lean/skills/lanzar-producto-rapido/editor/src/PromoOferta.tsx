/**
 * Imagen de la promoción por cantidad para el chat (1080x1350): una fila por
 * paquete con el número grande, el producto real repetido, el precio y el
 * ahorro; el paquete destacado lleva la cinta. Si hay regalos, en sus filas van
 * «+» y el regalo marcado «GRATIS». El texto lo pone el código, nunca la IA.
 * Se exporta con `remotion still`.
 */
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { INTER, srcDe } from "./comun";

export type FilaPromo = { cantidad: number; precio: number; regalo?: boolean };

export type PlanPromo = {
  marca?: string;
  titulo?: string;
  /** «frasco» y «frascos», «par» y «pares»... */
  unidad: string;
  unidades: string;
  /** Precio de 1 unidad sola: con él se calcula «Ahorras ...». */
  precio_unidad: number;
  moneda: { simbolo: string; miles: "." | "," };
  filas: FilaPromo[];
  /** Cantidad que lleva la cinta (por defecto 2). */
  destacada?: number;
  cinta?: string;
  /** PNG del producto real, de preferencia sin fondo. */
  producto: string;
  /** Regalos que van en las filas con regalo: tipo «celular» muestra la imagen dentro de un teléfono. */
  regalos?: { imagen: string; tipo?: "objeto" | "celular" }[];
  regalo_texto?: string;
  pie?: string;
  pie_2?: string;
  colores?: { fondo?: string; tarjeta?: string; borde?: string; acento?: string; oro?: string };
};

const formato = (n: number, m: PlanPromo["moneda"]) =>
  m.simbolo + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, m.miles);

export const PromoOferta: React.FC<PlanPromo> = (p) => {
  const c = { fondo: "#0d1617", tarjeta: "#162426", borde: "#24393b", acento: "#40e8c8", oro: "#ffd166", ...(p.colores ?? {}) };
  const destacada = p.destacada ?? 2;
  const n = p.filas.length;
  const altoFila = n <= 3 ? 304 : Math.floor(912 / n);
  const altoImg = altoFila - 66;
  return (
    <AbsoluteFill style={{ backgroundColor: c.fondo, fontFamily: INTER, color: "#fff" }}>
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        {p.marca ? <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 3, color: c.acento }}>{p.marca}</div> : null}
        <div style={{ fontSize: 64, fontWeight: 900, marginTop: 6 }}>{p.titulo ?? "Elige tu promoción"}</div>
      </div>
      {p.filas.map((f) => {
        const ahorro = p.precio_unidad * f.cantidad - f.precio;
        const esDestacada = f.cantidad === destacada;
        return (
          <div
            key={f.cantidad}
            style={{
              position: "relative",
              margin: "26px 40px 0",
              height: altoFila,
              borderRadius: 28,
              backgroundColor: esDestacada ? "#103b33" : c.tarjeta,
              border: esDestacada ? `5px solid ${c.acento}` : `3px solid ${c.borde}`,
              display: "flex",
              alignItems: "center",
              padding: "0 34px 0 24px",
            }}
          >
            {esDestacada ? (
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  right: 40,
                  backgroundColor: c.acento,
                  color: "#062b25",
                  fontSize: 28,
                  fontWeight: 900,
                  padding: "8px 26px",
                  borderRadius: 40,
                  whiteSpace: "nowrap",
                }}
              >
                {p.cinta ?? "LA MÁS PEDIDA"}
              </div>
            ) : null}
            <div style={{ fontSize: 132, fontWeight: 900, width: 84, textAlign: "center", color: c.acento, lineHeight: 1, flex: "none" }}>
              {f.cantidad}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", marginLeft: 14, flex: "none", height: altoImg + 12 }}>
              {Array.from({ length: f.cantidad }).map((_, i) => (
                <Img
                  key={i}
                  src={srcDe(p.producto)}
                  style={{ height: altoImg, marginLeft: i ? -26 : 0, filter: "drop-shadow(0 10px 12px rgba(0,0,0,.55))" }}
                />
              ))}
              {f.regalo && p.regalos?.length ? (
                <>
                  <div style={{ fontSize: 58, fontWeight: 900, color: c.acento, alignSelf: "center", margin: "0 6px" }}>+</div>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 8,
                      border: `3px dashed ${c.acento}`,
                      borderRadius: 20,
                      padding: "30px 10px 10px",
                      height: altoImg + 12,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: -20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: c.oro,
                        color: "#2b1d00",
                        fontSize: 24,
                        fontWeight: 900,
                        padding: "4px 16px",
                        borderRadius: 30,
                        letterSpacing: 1,
                      }}
                    >
                      GRATIS
                    </div>
                    {p.regalos.map((r, i) =>
                      r.tipo === "celular" ? (
                        <div
                          key={i}
                          style={{
                            width: altoImg * 0.36,
                            height: altoImg * 0.7,
                            borderRadius: 16,
                            backgroundColor: "#111",
                            padding: 5,
                            border: "2px solid #3a4a4b",
                            boxShadow: "0 8px 14px rgba(0,0,0,.55)",
                          }}
                        >
                          <Img src={srcDe(r.imagen)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", borderRadius: 11 }} />
                        </div>
                      ) : (
                        <Img key={i} src={srcDe(r.imagen)} style={{ height: altoImg * 0.82, filter: "drop-shadow(0 8px 10px rgba(0,0,0,.5))" }} />
                      ),
                    )}
                  </div>
                </>
              ) : null}
            </div>
            <div style={{ flex: 1, textAlign: "right", minWidth: 0 }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#d9e6e5" }}>
                {f.cantidad} {f.cantidad === 1 ? p.unidad : p.unidades}
              </div>
              <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.04, letterSpacing: -1 }}>{formato(f.precio, p.moneda)}</div>
              {ahorro > 0 ? <div style={{ fontSize: 30, fontWeight: 800, color: c.acento }}>Ahorras {formato(ahorro, p.moneda)}</div> : null}
              {f.regalo && p.regalo_texto ? <div style={{ fontSize: 28, fontWeight: 800, color: c.oro, marginTop: 2 }}>{p.regalo_texto}</div> : null}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 36, textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 900 }}>{p.pie ?? "🚚 Envío gratis · 💵 Pagas al recibir"}</div>
        {p.pie_2 ? <div style={{ fontSize: 30, fontWeight: 700, color: "#cfdedd", marginTop: 10 }}>{p.pie_2}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
