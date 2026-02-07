import React from "react";
import "../NotServed/NotServedPage.css";
import { useNavigate } from "react-router-dom";

const NotServed = () => {
  const navigate = useNavigate();

  return (
    <div className="not-served-container">
      <div className="not-served-content">
        <h1>We're Sorry</h1>
        <p>
          Unfortunately, our services are currently not available in this
          Location.
        </p>
        <p>We apologize for the inconvenience.</p>
        {/* <button onClick={() => navigate("/")}>Go to Homepage</button> */}
      </div>
    </div>
  );
};

export default NotServed;
