import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./SolutionPage.css";
import instance, {
  currencyReturn,
  apiEncryptRequest,
  decryptData,
} from "./../Api";
import Loader from "./common/Loader";
import { useNavigate } from "react-router-dom";

const SolutionsPage = () => {
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [solutionList, setSolutionList] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    ListSolution();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const ListSolution = async () => {
    setLoading(true);
    try {
      const encryptedResponse = await apiEncryptRequest();
      const cdnInfoResponse = await instance.get(
        "/solution",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);

      console.log(Response, "==!==!==solutionlist");
      setSolutionList(Response.solution);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "65rem",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundColor: "#141414",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
      }}
    >
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "999999999" }}>
          <Loader isLoading={loading} />
          {/* <Spinner animation="border" /> */}
        </div>
      )}
      {isMobile ? (
        <div className="features-page-solution">
          <div className="heading-dotted">
            Solutions <span></span>
          </div>
          <div
            className="features-section-solution"
            style={{ marginTop: "50px" }}
          >
            <Row>
              {/* <div className="col-lg-2 col-md-1"></div> */}
              <div className="col-lg-8 col-md-12">
                <div className="solution-posts-inner" style={{ gap: "40px" }}>
                  {solutionList &&
                    solutionList.map((item, index) => (
                      <div
                        className="solution-post"
                        key={index}
                        style={{
                          backgroundImage: "linear-gradient(#FFFFFF, #EFEFEF)",
                          borderRadius: "15px",
                          gap: "0px",
                        }}
                      >
                        <div
                          className="solution-card-solution"
                          style={{
                            padding: "20px",
                            // marginBottom: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            height: "15rem",
                          }}
                        >
                          {/* <div
                            className="in-border"
                            style={{
                              alignContent: "center",
                              height: "90px",
                              width: "90px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              margin: "auto",
                              backgroundColor: "transparent",
                              marginTop: "-32%",
                              padding: "0",
                              position: "relative",
                              top: "0.5rem",
                            }}
                          >
                            <div
                              className="in-border"
                              style={{
                                height: "80px",
                                width: "80px",
                                padding: "10px",
                                borderColor: "yellow",
                                border: "2px solid #E97730",
                                borderRadius: "50%",
                                margin: "auto",
                                backgroundColor: "#E97730",
                              }}
                            >
                              <figure>
                                <img src={item.image} alt={item.image} />
                              </figure>
                            </div>
                          </div> */}
                          <div className="content-solution">
                            <h3
                              style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#2D394B",
                                textAlign: "center",
                                margin: "20px 10px",
                              }}
                            >
                              {item.title}
                            </h3>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                              className="description-solution"
                              style={{
                                fontSize: "12px",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            />
                            {/* {item.description} */}
                          </div>
                          <div
                            className="log-in"
                            style={{ marginLeft: "3rem" }}
                          >
                            <a
                              onClick={() =>
                                navigate("/solutiondetail", {
                                  state: {
                                    solutionId: item.id,
                                  },
                                })
                              }
                              className="media-link"
                            >
                              <div
                                className="media-banner"
                                style={{ width: "auto" }}
                              >
                                <img
                                  className="normal-banner"
                                  src="/images/read-more-btn.png"
                                  alt=""
                                />
                                <img
                                  className="hover-img-banner"
                                  src={null}
                                  alt=""
                                />
                                <span
                                  className="login-text"
                                  style={{ fontSize: "20px", color: "white" }}
                                >
                                  Read More
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* <div className="col-lg-2 col-md-1"></div> */}
            </Row>
          </div>
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "50rem", padding: "6rem" }}
        >
          <div className="heading-dotted">
            Solutions <span></span>
          </div>
          <div className="features-section-solution">
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-11">
                <div className="solution-posts-inner">
                  {solutionList &&
                    solutionList.map((item, index) => (
                      <div className="solution-post">
                        <div
                          style={{
                            backgroundImage:
                              "linear-gradient(#FFFFFF, #EFEFEF)",
                            borderRadius: "15px",
                            height: "80%",
                          }}
                        >
                          <div className="solution-card-solution" key={index}>
                            {/* <div
                              className="in-border"
                              style={{
                                alignContent: "center",
                                height: "90px",
                                width: "90px",
                                // padding: "5px",
                                borderColor: "yellow",
                                border: "2px solid #E97730",
                                borderRadius: "50%",
                                // display: "table",
                                margin: "auto",
                                backgroundColor: "transparent",
                                marginTop: "-25%",
                                padding: "0",
                                position: "relative",
                                // top: "1rem",
                              }}
                            >
                              <div
                                className="in-border"
                                style={{
                                  height: "80px",
                                  width: "80px",
                                  padding: "10px",
                                  borderColor: "yellow",
                                  border: "2px solid #E97730",
                                  borderRadius: "50%",
                                  // display: "table",
                                  margin: "auto",
                                  backgroundColor: "#E97730",
                                }}
                              >
                                <figure>
                                  <img src={item.image} alt={item.image} />
                                </figure>
                              </div>
                            </div> */}
                            <div className="content-solution">
                              <h3
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "500",
                                  color: "#2D394B",
                                  textAlign: "center",
                                  margin: "35px 0 30px",
                                }}
                              >
                                {item.title}
                              </h3>
                              <p
                                // className="description-solution"
                                // style={{ fontSize: "16px", fontWeight: "500" }}
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                                className="blog-content"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {/* {item.description} */}
                              </p>
                            </div>
                            <div
                              className="log-in"
                              style={{
                                display: "grid",
                                position: "relative",
                                justifyContent: "center",
                                marginTop: "10%",
                              }}
                            >
                              <a
                                onClick={() =>
                                  navigate("/solutiondetail", {
                                    state: {
                                      solutionId: item.id,
                                    },
                                  })
                                }
                                className="media-link"
                              >
                                <div
                                  className="media-banner"
                                  style={{ width: "auto" }}
                                >
                                  <img
                                    className="normal-banner"
                                    src="/images/read-more-btn.png"
                                    alt=""
                                  />
                                  <img
                                    className="hover-img-banner"
                                    src="/images/read-more-btn.png"
                                    alt=""
                                  />
                                  <span
                                    className="login-text"
                                    style={{
                                      fontSize: "20px",
                                      color: "white", //"#07528B"
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.color = "#07528B")
                                    } // Change color on hover
                                    onMouseOut={(e) =>
                                      (e.target.style.color = "white")
                                    }
                                  >
                                    Read More
                                  </span>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionsPage;