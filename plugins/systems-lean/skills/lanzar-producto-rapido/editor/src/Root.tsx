import React from "react";
import { Composition, Still } from "remotion";
import { EdicionMinima, calcularEdicion, type PlanEdicion } from "./EdicionMinima";
import { VideoDemo, calcularDemo, type PlanDemo } from "./VideoDemo";
import { PromoOferta, type PlanPromo } from "./PromoOferta";
import { HOJA_ALTO, HOJA_ANCHO, HojaCuadros, type PlanHoja } from "./HojaCuadros";
import { ALTO, ANCHO, FPS } from "./comun";

// Los valores de ejemplo solo sirven para abrir el Studio: cada render pasa su plan con --props.
const edicionEjemplo: PlanEdicion = {
  video: "ganador.mp4",
  fuente: { ancho: 720, alto: 1280 },
  tramos: [[0, 10]],
  tapas: [],
};

const demoEjemplo: PlanDemo = {
  clips: [{ video: "clip1.mp4", desde: 0, hasta: 4, rotulo: "ANTES" }],
  subtitulos: [],
};

const promoEjemplo: PlanPromo = {
  titulo: "Elige tu promoción",
  unidad: "frasco",
  unidades: "frascos",
  precio_unidad: 100,
  moneda: { simbolo: "$", miles: "." },
  filas: [
    { cantidad: 1, precio: 100 },
    { cantidad: 2, precio: 150, regalo: true },
    { cantidad: 3, precio: 200, regalo: true },
  ],
  producto: "producto.png",
};

const hojaEjemplo: PlanHoja = { cuadros: [] };

export const Root: React.FC = () => (
  <>
    <Composition
      id="EdicionMinima"
      component={EdicionMinima}
      defaultProps={edicionEjemplo}
      calculateMetadata={calcularEdicion}
      durationInFrames={FPS * 10}
      fps={FPS}
      width={ANCHO}
      height={ALTO}
    />
    <Composition
      id="VideoDemo"
      component={VideoDemo}
      defaultProps={demoEjemplo}
      calculateMetadata={calcularDemo}
      durationInFrames={FPS * 4}
      fps={FPS}
      width={ANCHO}
      height={ALTO}
    />
    <Still id="PromoOferta" component={PromoOferta} defaultProps={promoEjemplo} width={1080} height={1350} />
    <Still id="HojaCuadros" component={HojaCuadros} defaultProps={hojaEjemplo} width={HOJA_ANCHO} height={HOJA_ALTO} />
  </>
);
