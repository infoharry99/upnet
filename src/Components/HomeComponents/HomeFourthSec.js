import React from "react";
import "./HomeFourthSec.css";
import { Col, Row } from "react-bootstrap";

const HomeFourthSec = (props) => {
  const { isMobile } = props;

  const logoArr = [
    "/images/python-logo.svg",
    "/images/react-logo.svg",
    "/images/mongodb-logo.svg",
    "/images/Drupal-logo.svg",
    "/images/angular-logo.svg",
    "/MariaDB.svg",
    "/JAVA.svg",
    "/Apache.svg",
    "/MySqL.svg",
    "/NgineX.svg",
    "/Node Js.svg",
    "/PHP.svg",
    "/PostgresSQL.svg",
    "/Rails.svg",
    "/Laravel.svg",
  ];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "30rem",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundColor: "#141414",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
      }}
    >
      {isMobile ? (
        <>
          <section
            className="see-full home3 section"
            style={{ marginBottom: "5rem" }}
          >
            <div
              className="see-width section-padding"
              style={{ height: "100hv" }}
            >
              <div className="home3-main">
                <Row>
                  {/* <div className="col-md-2"></div> */}
                  <Row>
                    {/* <Col>
                      <div className="list-item">
                        <div className="in-border">
                          <a href="/signUp">
                            <figure>
                              <img
                                style={{
                                  width: "75%",
                                  height: "auto",
                                  marginTop: "0px",
                                  padding: "10px",
                                  marginLeft: "1rem",
                                }}
                                src="/images/python-logo.svg"
                                alt=""
                              />
                            </figure>
                          </a>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="list-item">
                        <div className="in-border">
                          <a href="/signUp">
                            <figure>
                              <img
                                style={{
                                  width: "75%",
                                  height: "auto",
                                  marginTop: "5px",
                                  padding: "10px",
                                  marginLeft: "1rem",
                                }}
                                src="/images/react-logo.svg"
                                alt=""
                              />
                            </figure>
                          </a>
                        </div>
                      </div>
                    </Col> */}
                  </Row>

                  <Row>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly",
                        gap: "2rem",
                        marginBottom: "5rem",
                      }}
                    >
                      {logoArr.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            borderRadius: "10px",
                            border: "2px solid #e67225",
                            padding: "10px",
                          }}
                        >
                          <img
                            src={item}
                            style={{
                              width: "6rem",
                              height: "4rem",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {/* <Col>
                      <div className="list-item">
                        <div className="in-border">
                          <a href="/signUp">
                            <figure>
                              <img
                                style={{
                                  width: "75%",
                                  height: "auto",
                                  marginTop: "0px",
                                  padding: "10px",
                                  marginLeft: "1rem",
                                }}
                                src="/images/mongodb-logo.svg"
                                alt=""
                              />
                            </figure>
                          </a>
                        </div>
                      </div>
                    </Col> */}
                    {/* <Col>
                      <div className="list-item">
                        <div className="in-border">
                          <a href="/signUp">
                            <figure>
                              <img
                                style={{
                                  width: "75%",
                                  height: "auto",
                                  marginTop: "0px",
                                  padding: "10px",
                                  marginLeft: "1rem",
                                }}
                                src="/images/Drupal-logo.svg"
                                alt=""
                              />
                            </figure>
                          </a>
                        </div>
                      </div>
                    </Col> */}
                  </Row>
                </Row>
                <Row>
                  {/* <Col>
                    <div className="list-item" style={{ width: "43%" }}>
                      <div className="in-border">
                        <a href="/signUp">
                          <figure>
                            <img
                              style={{
                                width: "75%",
                                height: "auto",
                                marginTop: "5px",
                                padding: "10px",
                                marginLeft: "1rem",
                              }}
                              src="/images/angular-logo.svg"
                              alt=""
                            />
                          </figure>
                        </a>
                      </div>
                    </div>
                  </Col> */}
                  {/* <div className="col-md-6">
                    <div className="list-item">
                      <div className="in-border">
                        <a href="#">
                          <figure>
                            <img
                              style={{
                                width: "75%",
                                height: "auto",
                                marginTop: "5px",
                                padding: "10px",
                                marginLeft: "1rem",
                              }}
                              src="/images/Drupal-logo.svg"
                              alt=""
                            />
                          </figure>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="list-item">
                      <div className="in-border">
                        <a href="#">
                          <figure>
                            <img
                              style={{
                                width: "75%",
                                height: "auto",
                                marginTop: "5px",
                                padding: "10px",
                                marginLeft: "1rem",
                              }}
                              src="/images/angular-logo.svg"
                              alt=""
                            />
                          </figure>
                        </a>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="col-md-4"></div> */}
                </Row>
                <div className="content see-full see-center">
                  <div className="common-btn">
                    <div className="log-in">
                      <a href="/signUp" className="media-link">
                        <div
                          className="media-banner"
                          style={{ width: "125px" }}
                        >
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
                    <div className="log-in">
                      <a href="/signUp" className="media-link">
                        <div
                          className="media-banner"
                          style={{ width: "100px" }}
                        >
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
                          <span
                            className="login-text-banner"
                            style={{ left: "51%" }}
                          >
                            Login
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#154e7a",
                      fontSize: "18px",
                      fontWeight: "500",
                      paddingTop: "10px",
                      position: "relative",
                    }}
                  >
                    we may already be just one click away from
                  </div>
                  <div
                    style={{
                      color: "#154e7a",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    Working together!
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section
            className="see-full home3 section"
            style={{ padding: "10rem" }}
          >
            <div
              className="see-width section-padding"
              style={{ height: "100hv" }}
            >
              <div className="home3-main">
                <Row>
                  <div className="col-md-1"></div>
                  <div className="col-md-11">
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly",
                        gap: "4rem",
                        marginBottom: "5rem",
                      }}
                    >
                      {logoArr.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            borderRadius: "10px",
                            border: "2px solid #e67225",
                            padding: "10px",
                          }}
                        >
                          <img
                            src={item}
                            style={{
                              width: "10rem",
                              height: "5rem",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Row>

                <div className="content see-full see-center">
                  <div className="common-btn">
                    <div className="log-in">
                      <a href="/signUp" className="media-link">
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
                    <div className="log-in">
                      <a href="/login" className="media-link">
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
                          <span
                            className="login-text-banner"
                            style={{
                              fontSize: "30px",
                              padding: "20px 40px",

                              left: "50%",
                              top: "46%",
                            }}
                          >
                            Login
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#154e7a",
                      fontSize: "50px",
                      fontWeight: "500",
                      paddingTop: "10px",
                      position: "relative",
                    }}
                  >
                    we may already be just one click away from
                  </div>
                  <div
                    style={{
                      color: "#154e7a",
                      fontSize: "50px",
                      fontWeight: "600",
                    }}
                  >
                    Working together!
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomeFourthSec;
