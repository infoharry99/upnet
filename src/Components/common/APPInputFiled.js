import React from "react";
import PropTypes from "prop-types";

const APPInputFiled = ({ iconSrc, placeholder }) => {
  const inputStyle = {
    display: "flex",
    alignItems: "center",
    border: "2px solid white",
    borderRadius: "25px",
    padding: "5px",
  };

  const placeholderStyle = {
    color: "white",
  };

  return (
    <div style={inputStyle} className="input-container">
      <img
        src={iconSrc}
        alt=""
        style={{ width: "15px", height: "15px", marginRight: "5px" }}
      />
      <input
        type="text"
        name="email"
        className="form-control"
        placeholder={placeholder}
        style={{
          color: "white",
          border: "none",
          outline: "none",
          background: "transparent",
          flex: "1 1 0%",
          padding: "5px",
        }}
        placeholderStyle={placeholderStyle}
      />
    </div>
  );
};

APPInputFiled.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  borderRadius: PropTypes.string,
};

APPInputFiled.defaultProps = {
  borderColor: "white",
  borderRadius: "10px",
};

export default APPInputFiled;
