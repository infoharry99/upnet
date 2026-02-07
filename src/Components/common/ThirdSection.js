import React from "react";
import { Image, Row } from "react-bootstrap";

const ThirdSection = ({ data, isMobile }) => {
  return (
    <Row className="col-md-12" style={{ marginLeft: isMobile ? "" : "5rem" }}>
      {/* <div className="col-md-1"></div> */}
      <div className="col-md-6">
        <div
          className=""
          style={{
            marginTop: "15%",
            fontSize: "50px",
            color: "#154e7a",
            textTransform: "capitalize",
            fontWeight: "500",
            padding: "5px 0",
            textAlign: "center",
            marginBottom: "-2rem",
          }}
        >
          {data.title}
        </div>
        {/* <img
          src="./sm-logo.svg"
          alt=""
          style={{ width: "65%", objectFit: "cover" }}
        /> */}
        <p
          style={{
            textAlign: "center",
            color: "#4d4c4c",
            fontSize: "16px",
            padding: "20px 0",
            fontWeight: "500",
            borderBottom: "1px solid",
          }}
        >
          {/* Get to know that how your multi-cloud operational enterprise can be
          transformed through us. */}
        </p>
        <p
          style={{
            textAlign: "center",
            color: "#4d4c4c",
            fontSize: "19px",
            padding: "20px 0",
            fontWeight: "600",
            marginTop: "-2rem",
          }}
        >
          {data.desc}
        </p>
      </div>
      <div className="col-md-6">
        <div className="sub-heading">
          <a href="" tabIndex="-1">
            <img
              src={data.imageUrl}
              alt=""
              style={{
                paddingRight: "60px",
                float: "unset",
                display: "block",
                margin: "auto",
                width: "90%", // Set a fixed width
                // height: "30rem", // Set a fixed height
              }}
            />
          </a>
        </div>
      </div>
    </Row>
  );
};

export default ThirdSection;
