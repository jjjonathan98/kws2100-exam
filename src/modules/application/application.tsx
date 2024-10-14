import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { EmergencyDistrictLayerCheckbox } from "../110-sentraldistrikter/emergencyDistrictCheckbox";
import { FireStationLayerCheckBox } from "../firestation/fireStationCheckbox";
import { EmergancyCallCentersLayerBox } from "../emergencycallcenters/emergencyCallCentersCheckbox";

// This is the main application component that renders the map and the checkboxes for the different layers.
export function Application() {
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);

  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return (
    <MapContext.Provider value={{ map, layers, setLayers }}>
      <nav>
        <h1>KWS2100 Exam 2024</h1>
        <EmergencyDistrictLayerCheckbox />
        <FireStationLayerCheckBox />
        <EmergancyCallCentersLayerBox />
      </nav>
      <main>
        <div ref={mapRef}></div>
      </main>
    </MapContext.Provider>
  );
}

export default Application;
