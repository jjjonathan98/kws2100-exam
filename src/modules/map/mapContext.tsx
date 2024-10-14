import React, { Dispatch, SetStateAction } from "react";
import { Layer } from "ol/layer";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

// This entire file makes sure that the map is created and that the map is centered at the correct location.

useGeographic();

export const map = new Map({
  view: new View({ center: [10, 59], zoom: 8 }),
});

export const MapContext = React.createContext<{
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  layers: Layer[];
}>({
  map,
  setLayers: () => {},
  layers: [],
});
