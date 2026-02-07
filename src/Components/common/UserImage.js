import React from "react";
import { Button } from "react-bootstrap";

const UserImage = ({ src, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.files[0]);
  };

  return (
    <div className="centeredImage">
      <img src={src} alt="Centered Image" className="circularImage" />
      <label htmlFor="fileInput">
        <Button
          style={{
            marginTop: "10px",
            backgroundColor: "#3F7EFF",
            borderWidth: "0",
          }}
        >
          Change
        </Button>
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UserImage;
