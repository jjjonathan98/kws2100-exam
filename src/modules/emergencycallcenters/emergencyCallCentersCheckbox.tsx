import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import { EmergencyCallCentersLayer } from "./emergencyCallCentersFeature";

export function EmergancyCallCentersLayerBox() {
  const { setLayers } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, EmergencyCallCentersLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== EmergencyCallCentersLayer));
    };
  }, [checked]);

  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      {checked ? "Hide" : "Show"} Emergency Call Centers
    </div>
  );
}
