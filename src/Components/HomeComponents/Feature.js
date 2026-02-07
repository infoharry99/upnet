import React from "react";

const Feature = ({ icon, title }) => {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
    </div>
  );
};

export default Feature;
