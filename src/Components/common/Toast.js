import React, { useEffect, useState } from "react";
import "./Toast.css"; // Assuming you have a separate CSS file for styling

const Toast = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000); // Toast disappears after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div className={`toast ${type} ${visible ? "show" : ""}`}>
      <div className="toast-message">{message}</div>
      <button className="close-button" onClick={handleClose}>
        &#10005;
      </button>
    </div>
  );
};

export default Toast;
