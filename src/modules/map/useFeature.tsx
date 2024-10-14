import { Feature, MapBrowserEvent } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";
import { useViewExtent } from "./useViewExtent";
import VectorLayer from "ol/layer/Vector";

// This function is used to get the features from a layer that is visible on the map.
interface UseFeaturesReturnType<T extends Feature> {
  visibleFeatures: T[];
  features: T[];
  activeFeature?: T;
  setActiveFeature(feature?: T): void;
}

// This function will return the features that are visible on the map.
export function useFeatures<T extends Feature>(
  layerPredicate: (layer: Layer) => boolean,
): UseFeaturesReturnType<T> {
  const { layers, map } = useContext(MapContext);
  const viewExtent = useViewExtent();
  const layer = useMemo(
    () => layers.find(layerPredicate) as VectorLayer<any>,
    [layers],
  );
  const [features, setFeatures] = useState<T[]>([]);
  const visibleFeatures = useMemo(
    () => features.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );
  const [activeFeature, setActiveFeature] = useState<T>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const features = layer?.getSource().getFeaturesAtCoordinate(e.coordinate);
    setActiveFeature(features?.length === 1 ? features[0] : undefined);
  }

  // The useEffect hook is used to add an event listener to the map that listens for pointermove events.
  useEffect(() => {
    if (layer) {
      map.on("pointermove", handlePointerMove);
    }
    return () => map.un("pointermove", handlePointerMove);
  }, [map, layer]);

  function loadFeatures() {
    setFeatures(layer?.getSource()?.getFeatures() || []);
  }

  useEffect(() => {
    layer?.on("change", loadFeatures);
    loadFeatures();
    return () => {
      layer?.un("change", loadFeatures);
      setFeatures([]);
    };
  }, [layer]);

  return {
    features,
    visibleFeatures,
    activeFeature,
    setActiveFeature,
  };
}
