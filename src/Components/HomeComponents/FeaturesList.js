import React from "react";
import Feature from "./Feature";

const FeaturesList = () => {
  const features = [
    { icon: "🎓", title: "Self-Controlled" },
    { icon: "💬", title: "Ready To Serve" },
    { icon: "⚙️", title: "Self - Managed" },
    { icon: "💰", title: "Customized Pricing" },
    { icon: "🚀", title: "Digital Transformation" },
  ];

  return (
    <div className="features-list">
      {features.map((feature, index) => (
        <Feature key={index} icon={feature.icon} title={feature.title} />
      ))}
    </div>
  );
};

export default FeaturesList;
