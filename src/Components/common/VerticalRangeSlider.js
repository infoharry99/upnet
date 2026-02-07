import React, { useState } from "react";
import "./VerticalRangeSlider.css"; // Make sure to create this CSS file

const VerticalRangeSlider = () => {
  const [value, setValue] = useState(50);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="vertical-range-slider">
      <div className="tooltip" style={{ bottom: `${value}%` }}>
        {value} Core
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="custom-rangeInput-verticle"
        orient="vertical"
        style={{
          background: `linear-gradient(to top, #e97730 ${value}%, #ddd ${value}%)`,
        }}
      />
    </div>
  );
};

export default VerticalRangeSlider;
