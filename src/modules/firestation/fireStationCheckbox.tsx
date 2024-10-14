import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import { fireStationLayer } from "./fireStationLayer";

export function FireStationLayerCheckBox() {
  const { setLayers } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, fireStationLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== fireStationLayer));
    };
  }, [checked]);

  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      {checked ? "Hide" : "Show"} Fire Stations
    </div>
  );
}
