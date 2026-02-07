import React, { useEffect, useRef, useState } from "react";
import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "@fontsource/lexend-deca";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  decryptData,
} from "../../Api";
import Loader from "../common/Loader";
import "./BlogsMore.css";

const BlogsMore = (props) => {
  // const { isMobile } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const blogId = location.state ? location.state.blogId : null;

  const [title, setTitle] = useState(
    location.state ? location.state.title : null
  );
  const [date, setDate] = useState(location.state ? location.state.date : null);
  const [blogData, setBlogData] = useState(
    location.state ? location.state.blogData : null
  );
  const [authImg, setAuthImg] = useState(
    location.state ? location.state.authImg : null
  );
  const [authName, setAuthName] = useState(
    location.state ? location.state.authName : null
  );
  const [categoryName, setCategoryName] = useState(
    location.state ? location.state.categoryName : null
  );

  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(false);
  const htmlContentRef = useRef(null);

  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  useEffect(() => {
    if (location.state && location.state.title !== title) {
      setTitle(location.state.title);
    }
    if (location.state && location.state.date !== date) {
      setDate(location.state.date);
    }
    if (location.state && location.state.blogData !== blogData) {
      setBlogData(location.state.blogData);
    }
    if (location.state && location.state.authImg !== authImg) {
      setAuthImg(location.state.authImg);
    }
    if (location.state && location.state.authName !== authName) {
      setAuthName(location.state.authName);
    }
    if (location.state && location.state.categoryName !== categoryName) {
      setCategoryName(location.state.categoryName);
    }

    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    ListBlogs();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, location.state]);

  const ListBlogs = async () => {
    setLoading(true);
    try {
      const encryptedResponse = await apiEncryptRequest();
      const blogResponse = await instance.get("/user/blog", encryptedResponse);

      const Response = await decryptData(blogResponse.data);
      console.log(Response.blog, "==!==!==bloglist");
      const blog = Response.blog;
      if (blogId != null) {
        const blogs = blog
          .map((item) => ({
            ...item,
            articles: item.articles.filter(
              (article) => article.blog_id === blogId
            ),
          }))
          .filter((item) => item.articles.length > 0); // Only include categories with matching articles

        console.log(blogs[0].articles, "Filtered Blogs");
        const blogData = blogs[0].articles[0];
        setBlogData(blogData.sections);
        setCategoryName(blogs[0].category);
        setAuthName(blogs[0].articles[0].author);
        setAuthImg(blogs[0].articles[0].author_image);
        // console.log(blogs[0].articles[0].author, "author");
        // setTitle()
      }
      setBlogList(blog);
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
            <Row style={{ paddingTop: "5rem", width: "100%" }}>
              <div className="col-md-2"></div>
              <div
                className="col-md-7"
                style={{
                  backgroundColor: "white",
                  marginLeft: "25px",
                  paddingRight: "35px",
                  textAlign: "center",
                }}
              >
                <h1
                  className="titless"
                  style={{
                    fontFamily: "Lexend Deca",
                    fontSize: "22px",
                  }}
                >
                  {title}
                </h1>
                <div className="author-info-container">
                  <div
                    className="divider"
                    style={{
                      border: "none",
                      borderTop: "2px solid #e97730",
                    }}
                  />
                  <div className="author-info-content">
                    <div className="author-section">
                      <img
                        src={authImg != null ? authImg : "./user.png"}
                        alt={authImg != null ? authImg : "./user.png"}
                        className="author-avatar"
                        style={{ backgroundColor: "#035189" }}
                      />
                      <a
                        className="author-name"
                        style={{
                          fontFamily: "Lexend Deca",
                          textAlign: "left",
                          fontSize: "15px",
                        }}
                        onClick={() =>
                          navigate("/blogsearch", {
                            state: {
                              searchText: authName,
                            },
                          })
                        }
                      >
                        {authName}
                      </a>
                    </div>

                    <div
                      className="dates-section"
                      style={{ fontFamily: "Lexend Deca", fontSize: "14px" }}
                    >
                      Category :{" "}
                      <a
                        className="author-name"
                        style={{ fontFamily: "Lexend Deca", fontSize: "14px" }}
                        onClick={() =>
                          navigate("/blogsearch", {
                            state: {
                              searchCategory: categoryName,
                            },
                          })
                        }
                      >
                        {categoryName}
                      </a>
                      <p
                        className="updated-date"
                        style={{ fontFamily: "Lexend Deca" }}
                      >
                        Updated : {date}
                      </p>
                    </div>
                  </div>
                  <div
                    className="divider"
                    style={{
                      border: "none",
                      borderTop: "2px solid #e97730",
                      marginTop: "5px",
                    }}
                  />
                </div>
                <Row>
                  <div className="col-md-8">
                    {blogData &&
                      blogData.map((item, index) => (
                        <div
                          style={{
                            textAlign: "left",
                            // width: "85%
                          }}
                        >
                          {/* <p
                            style={{
                              // marginTop: "15px",
                              color: "#596771",
                              fontFamily: "Lexend Deca",
                              textAlign: "justify",
                              fontSize: "14px",
                              fontWeight: "100",
                              lineHeight: "2",
                              overflowWrap: "normal",
                            }}
                          >
                            {item.description}
                          </p>
                          <img
                            src={item.image}
                            style={{
                              width: "21rem",
                              height: "10rem",
                              marginBottom: "15px",
                            }}
                          /> */}
                          {item.description && (
                            <p
                              ref={htmlContentRef}
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                              style={{
                                color: "#596771",
                                fontFamily: "Lexend Deca",
                                textAlign: "justify",
                                fontSize: "14px",
                                // fontWeight: "100",
                                lineHeight: "2",
                                overflowWrap: "normal",
                              }}
                            />
                          )}
                          {item.image && (
                            <img
                              src={item.image}
                              style={{
                                width: "21rem",
                                height: "10rem",
                                marginBottom: "15px",
                              }}
                            />
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="col-md-4">
                    {blogList &&
                      blogList
                        .slice(0, 5)
                        .filter((item) => item.category === categoryName)
                        .map((category, index) => (
                          <aside
                            className="sidebar"
                            style={{ textAlign: "left", marginBottom: "50px" }}
                          >
                            <h3
                              style={{
                                color: "#035189",
                                fontFamily: "Lexend Deca",
                              }}
                              onClick={() =>
                                navigate("/blogsearch", {
                                  state: {
                                    searchCategory: category.category,
                                  },
                                })
                              }
                            >
                              {category.articles.length > 1 &&
                                category.category}
                            </h3>
                            {category.articles
                              .filter((item) => item.title !== title)
                              .map((article, index) => (
                                <div
                                  className="sidebar-article"
                                  style={{
                                    fontFamily: "Lexend Deca",
                                    fontWeight: "500",
                                    lineHeight: "2",
                                    overflowWrap: "normal",
                                  }}
                                  onClick={() => {
                                    setTitle(article.title);
                                    setDate(article.date);
                                    setBlogData(article.sections);
                                    setAuthImg(article.author_image);
                                    setAuthName(article.author);
                                  }}
                                >
                                  <img
                                    src={article.main_image}
                                    alt={article.title}
                                  />
                                  <div className="feat-article-details">
                                    <h4
                                      className="hover-underline"
                                      style={{ color: "black" }}
                                    >
                                      {article.title}
                                    </h4>
                                    <p>
                                      {article.author} • {article.date}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </aside>
                        ))}
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
                    {title}
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
                      }}
                    />
                    <div className="author-info-content">
                      <div className="author-section">
                        <img
                          src={authImg != null ? authImg : "./user.png"}
                          alt={authImg != null ? authImg : "./user.png"}
                          className="author-avatar"
                          style={{ backgroundColor: "#035189" }}
                        />
                        <a
                          className="author-name"
                          style={{ fontFamily: "Lexend Deca" }}
                          onClick={() =>
                            navigate("/blogsearch", {
                              state: {
                                searchText: authName,
                              },
                            })
                          }
                        >
                          {authName}
                        </a>
                      </div>

                      <div
                        className="dates-section"
                        style={{ fontFamily: "Lexend Deca" }}
                      >
                        Category :{" "}
                        <a
                          className="author-name"
                          style={{ fontFamily: "Lexend Deca" }}
                          onClick={() =>
                            navigate("/blogsearch", {
                              state: {
                                searchCategory: categoryName,
                              },
                            })
                          }
                        >
                          {categoryName}
                        </a>
                        <p
                          className="updated-date"
                          style={{ fontFamily: "Lexend Deca" }}
                        >
                          Updated : {date}
                        </p>
                      </div>
                    </div>
                    <div
                      className="divider"
                      style={{
                        border: "none",
                        borderTop: "2px solid #e97730",
                        marginTop: "5px",
                      }}
                    />
                  </div>
                  <Row>
                    <div className="col-md-8">
                      {blogData &&
                        blogData.map((item, index) => (
                          <div
                            style={{
                              textAlign: "left",
                              // width: "85%",
                            }}
                          >
                            {item.description && (
                              <p
                                ref={htmlContentRef}
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
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
                              />
                            )}
                            {/* <p
                              style={{
                                marginTop: "15px",
                                color: "#596771",
                                fontFamily: "Lexend Deca",
                                textAlign: "justify",
                                fontSize: "1.125rem",
                                fontWeight: "100",
                                lineHeight: "2",
                                overflowWrap: "normal",
                              }}
                            >
                              {/* {item.description} }
                            </p> */}
                            {item.image && (
                              <img
                                src={item.image}
                                style={{
                                  width: "48rem",
                                  height: "20rem",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                          </div>
                        ))}
                    </div>

                    <div className="col-md-4">
                      {blogList &&
                        blogList
                          .slice(0, 5)
                          .filter((item) => item.category === categoryName)
                          .map((item, index) => (
                            <aside className="sidebar">
                              <h3
                                className="hover-underline"
                                style={{
                                  color: "#035189",
                                  fontFamily: "Lexend Deca",
                                }}
                                onClick={() =>
                                  navigate("/blogsearch", {
                                    state: {
                                      searchCategory: item.category,
                                    },
                                  })
                                }
                              >
                                {item.articles.length > 1 && item.category}
                              </h3>
                              {item.articles
                                .filter((item) => item.title !== title)
                                .map((article, index) => (
                                  <div
                                    className="sidebar-article"
                                    style={{
                                      fontFamily: "Lexend Deca",
                                      fontWeight: "500",
                                      lineHeight: "2",
                                      overflowWrap: "normal",
                                    }}
                                    onClick={() => {
                                      setTitle(article.title);
                                      setDate(article.date);
                                      setBlogData(article.sections);
                                      setAuthImg(article.author_image);
                                      setAuthName(article.author);
                                    }}
                                  >
                                    <img
                                      src={article.main_image}
                                      alt={article.title}
                                    />
                                    <div className="feat-article-details">
                                      <h4
                                        className="hover-underline"
                                        style={{ color: "black" }}
                                      >
                                        {article.title}
                                      </h4>
                                      <p>
                                        {article.author} • {article.date}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </aside>
                          ))}
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

export default BlogsMore;