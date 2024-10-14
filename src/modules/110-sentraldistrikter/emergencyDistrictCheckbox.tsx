import React, { useState } from "react";
import { useLayer } from "../map/useLayer";
import { useEmergencyDistrictStyle } from "./emergencyDistrict";

export function EmergencyDistrictLayerCheckbox() {
  const [checked, setChecked] = useState(false);

  const { layer } = useEmergencyDistrictStyle();
  useLayer(layer, checked);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} Emergency District
      </label>
    </div>
  );
}

export default EmergencyDistrictLayerCheckbox;
