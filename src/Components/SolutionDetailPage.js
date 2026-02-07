import React, { useEffect, useRef, useState } from "react";
import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "@fontsource/lexend-deca";
import instance, {
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "./../Api";
import "../Components/Details/BlogsMore.css";
import Loader from "./common/Loader";

const SolutionDetailPage = (props) => {
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  //   const { isMobile } = props;
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  const location = useLocation();
  const solutionId = location.state ? location.state.solutionId : null;
  const [solutionList, setSolutionList] = useState(null);
  const [solutionData, setSolutionData] = useState(null);
  const [articleList, setArticleList] = useState(null);
  const [loading, setLoading] = useState(false);

  const articles = [
    {
      title: "Social Media Calendar Template: The 10 Best for Marketers",
      description: "Basha Coleman",
      date: "7/24/24",
      image: "images/img4.png",
    },
    {
      title:
        "25 Professional Bio Examples I Keep in My Back Pocket for Inspiration",
      description: "Alana Chinn",
      date: "10/17/24",
      image: "images/img2.png",
    },
    {
      title:
        "I Found the Secret to Creating a Social Media Calendar to Plan All Your Posts",
      description: "Flori Needle",
      date: "4/11/24",
      image: "images/img3.png",
    },
    {
      title: "Social Media Calendar Template: The 10 Best for Marketers",
      description: "Basha Coleman",
      date: "7/24/24",
      image: "images/img4.png",
    },
    {
      title:
        "25 Professional Bio Examples I Keep in My Back Pocket for Inspiration",
      description: "Alana Chinn",
      date: "10/17/24",
      image: "images/img2.png",
    },
  ];

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    ListSolution(solutionId);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const ListSolution = async (solId) => {
    setLoading(true);
    try {
      const encryptedResponse = await apiEncryptRequest();
      const cdnInfoResponse = await instance.get(
        "/solution",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      console.log(Response.solution, "==!==!==solutionlist");

      const filteredList = Response.solution.filter(
        (item) => item.id !== solId
      );
      setSolutionList(filteredList);

      const filterList = Response.solution.filter((item) => item.id === solId);
      const singleItem = filterList.length > 0 ? filterList[0] : null;
      setSolutionData(singleItem);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    ListArticles(solId);
  };

  const ListArticles = async (solutionId) => {
    // setLoading(true);
    try {
      const encryptedResponse = await apiEncryptRequest();
      const articleResponse = await instance.get(
        "/user/article",
        encryptedResponse
      );
      const Response = await decryptData(articleResponse.data);
      console.log(Response.articles, "==!==!==articlelist");

      const filteredList = Response.articles.filter(
        (item) => item.solution_id === solutionId
      );
      setArticleList(filteredList);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        // minHeight: "100%",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        // backgroundSize: "cover",
        backgroundPosition: "center",
        // backgroundColor: "#141414",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
        // backgroundColor: "white",
      }}
    >
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
      {isMobile ? (
        <>
          <div>
            <Row style={{ paddingTop: "1rem", width: "100%" }}>
              <div className="container">
                <h1
                  className="titless"
                  style={{
                    fontFamily: "Lexend Deca",
                    fontSize: "22px",
                    textAlign: "left",
                    paddingLeft: "15px",
                  }}
                >
                  {solutionData && solutionData.title}
                </h1>

                <div className="author-info-container">
                  <div
                    className="divider"
                    style={{
                      border: "none",
                      borderTop: "2px solid #e97730",
                      marginLeft: "18px",
                      marginTop: "-20px",
                    }}
                  />
                </div>
                <Row>
                  <div className="col-md-10">
                    <div
                      style={{
                        textAlign: "left",
                        marginLeft: "15px",
                        marginTop: "-30px",
                        // width: "85%",
                      }}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html: solutionData && solutionData.description,
                        }}
                        style={{
                          marginTop: "15px",
                          color: "#596771",
                          fontFamily: "Lexend Deca",
                          textAlign: "justify",
                          fontSize: "1rem",
                          // fontWeight: "100",
                          lineHeight: "2",
                          overflowWrap: "normal",
                        }}
                      />
                      {solutionData && solutionData.image && (
                        <img
                          src={solutionData.image}
                          style={{ width: "21rem", height: "12rem" }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    {solutionList && solutionList.length > 1 && (
                      <aside
                        className="sidebar"
                        style={{ fontFamily: "Lexend Deca" }}
                      >
                        {solutionList && (
                          <h3 style={{ color: "#035189" }}>
                            Suggested Solutions
                          </h3>
                        )}
                        {solutionList &&
                          solutionList.slice(0, 5).map((item, index) => (
                            <div
                              className="sidebar-article"
                              style={{ fontFamily: "Lexend Deca" }}
                              onClick={() => {
                                ListSolution(item.id);
                                // solutionData = item;
                              }}
                            >
                              {/* <figure>
                              <img src={item.image} alt={item.image} />
                            </figure> */}
                              <div className="feat-article-details">
                                <h4>{item.title}</h4>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: item.description,
                                  }}
                                  style={{
                                    paddingTop: "5px",
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
                            </div>
                          ))}
                      </aside>
                    )}

                    {articleList && articleList.length > 0 && (
                      <aside
                        className="sidebar"
                        style={{
                          fontFamily: "Lexend Deca",
                          marginTop: "-20px",
                        }}
                      >
                        <h3 style={{ color: "#035189" }}>Suggested Articles</h3>
                        {articleList &&
                          articleList.map((item, index) => (
                            <div
                              // className="sidebar-article"
                              style={{ fontFamily: "Lexend Deca" }}
                              onClick={() => {
                                setSolutionData(item);
                              }}
                            >
                              <div className="feat-article-details">
                                <h4>{item.title}</h4>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: item.description,
                                  }}
                                  style={
                                    {
                                      // display: "-webkit-box",
                                      // WebkitLineClamp: 3,
                                      // WebkitBoxOrient: "vertical",
                                      // overflow: "hidden",
                                      // textOverflow: "ellipsis",
                                    }
                                  }
                                >
                                  {/* {item.description} */}
                                </p>
                              </div>
                            </div>
                          ))}
                      </aside>
                    )}

                    {/* {solutionList &&
                        solutionList.map((item, index) => (
                          <div
                            className="sidebar-article"
                            style={{
                              fontFamily: "Lexend Deca",
                              fontWeight: "500",
                              lineHeight: "2",
                              overflowWrap: "normal",
                            }}
                            // onClick={() =>
                            //   navigate("/blogmore", {
                            //     // state: {
                            //     //   blogData: item,
                            //     // },
                            //   })
                            // }
                          >
                            {/* <img src={article.main_image} alt={article.title} />
                            <div className="feat-article-details">
                              <h4>{article.title}</h4>
                              <p>
                                {article.author} • {article.date}
                              </p>
                            </div>}
                          </div>
                        ))} */}
                  </div>
                </Row>
              </div>
            </Row>
          </div>
        </>
      ) : (
        <>
          <div style={{ height: "100vh" }}>
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-12">
                <div className="container">
                  <h1 className="titless" style={{ fontFamily: "Lexend Deca" }}>
                    {solutionData && solutionData.title}
                  </h1>
                  {/* <button
                    className="cta-button"
                    style={{ marginLeft: "-41rem", fontFamily: "Lexend Deca" }}
                  >
                    Download Now: Free Social Media Calendar Template
                  </button> */}

                  <div className="author-info-container">
                    <div
                      className="divider"
                      style={{
                        border: "none",
                        borderTop: "2px solid #e97730",
                        // marginTop: "10px",
                      }}
                    />
                  </div>
                  <Row>
                    <div
                      className={
                        solutionList && solutionList.length > 1
                          ? "col-md-8"
                          : "col-md-12"
                      }
                    >
                      {/* {solutionData &&
                        solutionData.map((item, index) => ( */}
                      <div
                        style={{
                          textAlign: "left",
                          // width: "85%",
                        }}
                      >
                        <p
                          dangerouslySetInnerHTML={{
                            __html: solutionData && solutionData.description,
                          }}
                          style={{
                            marginTop: "15px",
                            color: "#596771",
                            fontFamily: "Lexend Deca",
                            textAlign: "justify",
                            fontSize: "1.125rem",
                            // fontWeight: "100",
                            lineHeight: "2",
                            overflowWrap: "normal",
                          }}
                        ></p>
                        {solutionData && solutionData.image && (
                          <img
                            src={solutionData && solutionData.image}
                            style={{
                              width: "40rem",
                              height: "20rem",
                              marginTop: "20px",
                            }}
                          />
                        )}
                      </div>
                      {/* ))} */}
                    </div>

                    <div className="col-md-4">
                      {solutionList && solutionList.length > 1 && (
                        <aside
                          className="sidebar"
                          style={{ fontFamily: "Lexend Deca" }}
                        >
                          <h3 style={{ color: "#035189" }}>
                            Suggested Solutions
                          </h3>
                          {solutionList &&
                            solutionList.slice(0, 5).map((item, index) => (
                              <div
                                className="sidebar-article"
                                style={{ fontFamily: "Lexend Deca" }}
                                onClick={() => {
                                  ListSolution(item.id);
                                  // solutionData = item;
                                }}
                              >
                                {/* <figure>
                                <img src={item.image} alt={item.image} />
                              </figure> */}
                                <div className="feat-article-details">
                                  <h4
                                    className="hover-underline"
                                    style={{ color: "black" }}
                                  >
                                    {item.title}
                                  </h4>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: item.description,
                                    }}
                                    style={{
                                      paddingTop: "5px",
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
                              </div>
                            ))}
                        </aside>
                      )}

                      {/* {solutionList &&
                        solutionList.map((item, index) => (
                          <div
                            className="sidebar-article"
                            style={{
                              fontFamily: "Lexend Deca",
                              fontWeight: "500",
                              lineHeight: "2",
                              overflowWrap: "normal",
                            }}
                            // onClick={() =>
                            //   navigate("/blogmore", {
                            //     // state: {
                            //     //   blogData: item,
                            //     // },
                            //   })
                            // }
                          >
                            {/* <img src={article.main_image} alt={article.title} />
                            <div className="feat-article-details">
                              <h4>{article.title}</h4>
                              <p>
                                {article.author} • {article.date}
                              </p>
                            </div>}
                          </div>
                        ))} */}

                      {articleList && articleList.length > 0 && (
                        <aside
                          className="sidebar"
                          style={{
                            fontFamily: "Lexend Deca",
                            marginTop: "-20px",
                          }}
                        >
                          <h3 style={{ color: "#035189" }}>
                            Suggested Articles
                          </h3>
                          {articleList &&
                            articleList.map((item, index) => (
                              <div
                                // className="sidebar-article"
                                style={{ fontFamily: "Lexend Deca" }}
                                onClick={() => {
                                  setSolutionData(item);
                                }}
                              >
                                <div className="feat-article-details">
                                  <h4
                                    className="hover-underline"
                                    style={{ color: "black" }}
                                  >
                                    {item.title}
                                  </h4>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: item.description,
                                    }}
                                    style={
                                      {
                                        // display: "-webkit-box",
                                        // WebkitLineClamp: 3,
                                        // WebkitBoxOrient: "vertical",
                                        // overflow: "hidden",
                                        // textOverflow: "ellipsis",
                                      }
                                    }
                                  ></p>
                                </div>
                              </div>
                            ))}
                        </aside>
                      )}
                    </div>
                  </Row>
                </div>
              </div>
              <div className="col-md-1"></div>
            </Row>
          </div>
        </>
      )}
    </div>
  );
};

export default SolutionDetailPage;