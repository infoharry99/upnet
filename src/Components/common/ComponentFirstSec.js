import React from "react";
import { Image, Row } from "react-bootstrap";

const ComponentFirstSec = (props) => {
  const { data, isMobile } = props;
  console.log(data);
  return (
    <>
      {isMobile ? (
        <div>
          <div
            style={{
              fontSize: "30px",
              color: "#154e7a",
              textTransform: "capitalize",
              fontWeight: "500",
              textAlign: "center",
              // padding: "5px 0",
            }}
          >
            {data.title}
            {data.subtitle}
          </div>
          <div style={{ display: "grid", justifyItems: "center" }}>
            <img
              src="/sm-logo.svg"
              alt=""
              style={{ width: "50%", objectFit: "cover" }}
            />
          </div>

          <p
            style={{
              color: "#4d4c4c",
              fontSize: "14px",
              padding: "20px 0",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {data.desc}
          </p>
          <div>
            <img
              src={data.imageurl}
              alt={data.imageurl}
              style={{
                float: "unset",
                display: "block",
                margin: "auto",
                width: "200px", // Set a fixed width
                height: "200px", // Set a fixed height
              }}
            />
          </div>

          <div
            className="common-btn mob-btn"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "50%",
              marginLeft: "27%",
              marginTop: "2rem",
            }}
          >
            <div
              className="log-in"
              onClick={() => {
                window.location.href = "/signUp";
              }}
            >
              <a href="/signUp" className="media-link">
                <div className="media-banner" style={{ width: "125px" }}>
                  <img
                    className="normal-banner"
                    src="/images/tryitout-btn-bg.svg"
                    alt=""
                  />
                  <img
                    className="hover-img-banner"
                    src="/images/search-btn-hover.png"
                    alt=""
                  />
                  <span className="login-text">Tryit Out</span>
                </div>
              </a>
            </div>
            {/* <div
              className="log-in"
              onClick={() => {
                window.location.href = "/signUp";
              }}
            >
              <a href="/signUp" className="media-link">
                <div className="media-banner" style={{ width: "100px" }}>
                  <img
                    className="normal-banner"
                    src="/images/more-info-btn-bg.svg"
                    alt=""
                  />
                  <img
                    className="hover-img-banner"
                    src="/images/search-btn-hover.png"
                    alt=""
                  />
                  <span className="login-text-banner" style={{ left: "51%" }}>
                    More Info
                  </span>
                </div>
              </a>
            </div> */}
          </div>
        </div>
      ) : (
        <Row className="col-md-12" style={{ marginTop: "10rem" }}>
          <div className="col-md-1"></div>
          <div className="col-md-6">
            <div
              className=""
              style={{
                fontSize: "80px",
                color: "#154e7a",
                textTransform: "capitalize",
                fontWeight: "500",
                // padding: "5px 0",
              }}
            >
              {data.title}
              {/* unleash virtual */}
            </div>
            <div
              className=""
              style={{
                fontSize: "80px",
                color: "#154e7a",
                textTransform: "capitalize",
                fontWeight: "500",
                marginTop: "-30px",
                // padding: "5px 0",
              }}
            >
              {data.subtitle}
            </div>
            <img
              src="/sm-logo.svg"
              alt=""
              style={{ width: "65%", objectFit: "cover" }}
            />
            <p
              style={{
                color: "#4d4c4c",
                fontSize: "23px",
                padding: "20px 0",
                fontWeight: "500",
                textAlign: "left",
              }}
            >
              {data.desc}
            </p>
            <div style={{ display: "flex" }}>
              <div
                className="log-in"
                onClick={() => {
                  window.location.href = "/signUp";
                }}
              >
                <a className="media-link">
                  <div className="media-banner">
                    <img
                      className="normal-banner"
                      src="/images/tryitout-btn-bg.svg"
                      alt=""
                    />
                    <img
                      className="hover-img-banner"
                      src="/images/search-btn-hover.png"
                      alt=""
                    />
                    <span className="login-text">Tryit Out</span>
                  </div>
                </a>
              </div>

              {/* <div
                className="log-in"
                onClick={() => {
                  window.location.href = "/signUp";
                }}
              >
                <a href="/signUp" className="media-link">
                  <div className="media-banner">
                    <img
                      className="normal-banner"
                      src="/images/more-info-btn-bg.svg"
                      alt=""
                    />
                    <img
                      className="hover-img-banner"
                      src="/images/search-btn-hover.png"
                      alt=""
                    />
                    <span className="login-text-banner">More Info</span>
                  </div>
                </a>
              </div> */}
            </div>
          </div>
          <div className="col-md-5">
            <div className="sub-heading">
              <a href="" tabIndex="-1">
                <img
                  src={data.imageurl}
                  alt={data.imageurl}
                  style={{
                    width: "80%",
                    height: "80%",
                  }}
                />
              </a>
            </div>
          </div>
        </Row>
      )}
    </>
  );
};

export default ComponentFirstSec;
