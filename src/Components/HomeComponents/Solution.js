import React from "react";

const Solution = ({ icon, title, description }) => {
  return (
    <div className="solution">
      <div className="solution-icon">{icon}</div>
      <h3 className="solution-title">{title}</h3>
      <p className="solution-description">{description}</p>
    </div>
  );
};

export default Solution;
