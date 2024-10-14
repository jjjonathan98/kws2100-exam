import { Layer } from "ol/layer";
import { useContext, useEffect } from "react";
import { MapContext } from "./mapContext";

// The function useLayer is used to add a layer to the map when the layer is checked.
export function useLayer(layer: Layer, checked: boolean) {
  const { setLayers } = useContext(MapContext);

  // Here we add the layer to the map when the layer is checked.
  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, layer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== layer));
    };
  }, [checked]);
}
