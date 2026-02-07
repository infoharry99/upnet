// import React, { useState } from "react";

// const RangeSlider = () => {
//   const [value, setValue] = useState(50);

//   const handleChange = (event) => {
//     setValue(event.target.value);
//   };

//   const trackColor = value > 50 ? "#4CAF50" : "#ddd";
//   const thumbColor = value > 50 ? "#FF5722" : "#4CAF50";

//   return (
//     <div style={{ width: "300px", margin: "20px" }}>
//       <input
//         type="range"
//         min="0"
//         max="100"
//         value={value}
//         onChange={handleChange}
//         style={{
//           WebkitAppearance: "none",
//           width: "100%",
//           height: "8px",
//           background: trackColor,
//           outline: "none",
//           opacity: "1",
//           transition: "opacity .15s ease-in-out",
//           cursor: "pointer",
//         }}
//       />
//       <style jsx="true">
//         {`
//           input[type="range"]::-webkit-slider-thumb {
//             -webkit-appearance: none;
//             appearance: none;
//             width: 30px;
//             height: 30px;
//             background-color: #e97730;
//             background: url("./shape.png") no-repeat center;
//             border: 2px solid #e97730;
//             background-size: cover;
//             cursor: pointer;
//             border-radius: 50%;
//             box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
//           }
//           input[type="range"]::-moz-range-thumb {
//             width: 30px;
//             height: 30px;
//             background-color: #e97730;
//             background: url("./shape.png") no-repeat center;
//             border: 2px solid #e97730;
//             background-size: cover;
//             cursor: pointer;
//             border-radius: 50%;
//             box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
//           }
//           input[type="range"]::-ms-thumb {
//             width: 30px;
//             height: 30px;
//             background-color: #e97730;
//             background: url("./shape.png") no-repeat center;
//             border: 2px solid #e97730;
//             background-size: cover;
//             cursor: pointer;
//             border-radius: 50%;
//             box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
//           }
//         `}
//       </style>
//       <div>Value: {value}</div>
//     </div>
//   );
// };

// export default RangeSlider;

import React, { useState } from "react";
import "./RangeSlider.css"; // Make sure to create this CSS file
import { FaChevronDown } from "react-icons/fa";

const RangeSlider = ({ unit }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="range-slider">
      <div className="tooltip-horz" style={{ left: `${value}%` }}>
        {/* <FaChevronDown /> */}
        {value} {unit}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="custom-rangeInput"
        style={{
          background: `linear-gradient(to right, #e97730 ${value}%, #ddd ${value}%)`,
        }}
      />
    </div>
  );
};

export default RangeSlider;
