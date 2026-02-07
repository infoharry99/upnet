import React, { useState, useEffect } from "react";
import "./Loader.css"; // Import your CSS file for styling
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
const Loader = ({ isLoading }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const classNames = [
    "loader-1",
    "loader-2",
    "loader-3",
    "loader-4",
    "loader-5",
    "loader-6",
    "loader-7",
    "loader-8",
    "loader-9",
    "loader-10",
    "loader-31",
    "loader-32",
    "loader-33",
    "loader-34",
    "loader-35",
    "loader-36",
    "loader-37",
    "loader-38",
    "loader-39",
    "loader-40",
  ];
  const [className, setClassName] = useState("");
  // const [randomString, setRandomString] = useState("");
  // useEffect(() => {
  //   const randomIndex = Math.floor(Math.random() * classNames.length);
  //   setClassName(classNames[randomIndex]);
  // }, []);

  useEffect(() => {
    if (isLoading) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * classNames.length);
      } while (classNames[randomIndex] === className); // Ensure the new class is different
      setClassName(classNames[randomIndex]);
    }
  }, [isLoading]);

  return (
    <div className="loader-container">
      {isLoading && (
        <>
          {/* <Button variant="dark" disabled> */}
          <div
            className={className}
            style={{ width: "90px", height: "90px" }}
          ></div>
          {/* <Spinner
              as="span"
              animation="border"
              size="lx"
              role="status"
              aria-hidden="true"
            /> */}
          {/* <span className="visually-hidden">Loading...</span> */}
          {/* </Button>{" "} */}
          {/* <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button> */}
        </>
        // <div style={{ width: "200px", height: "200px", overflow: "hidden" }}>
        //   <img
        //     src={"/images/loader.png"}
        //     alt="Loading..."
        //     className="loader-image"
        //   />
        // </div>
      )}
    </div>
  );
};

export default Loader;
