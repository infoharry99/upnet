import React, { useRef, useState, useEffect } from "react";
import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";
import instance, { apiEncryptRequest, decryptData } from "./../Api";
import "./Blog.css";
import Loader from "./common/Loader";
import { useLocation, useNavigate } from "react-router-dom";

const Blog = (props) => {
  const { isMobile } = props;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [blogList, setBlogList] = useState(null);
  const [sliderList, setSliderList] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = sliderList[currentIndex];

  useEffect(() => {
    ListBlogs();
  }, []);

  useEffect(() => {
    if (!loading && sliderList.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderList.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(intervalId); // Clear interval on unmount
    }
  }, [loading, sliderList]);

  const ListBlogs = async () => {
    setLoading(true);
    try {
      const encryptedResponse = await apiEncryptRequest();
      const cdnInfoResponse = await instance.get(
        "/user/blog",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      console.log(Response.blog, "==!==!==bloglist");
      const blog = Response.blog;
      setBlogList(blog);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    sliderApi();
    // setLoading(false);
  };

  const sliderApi = async () => {
    // setLoading(true);
    try {
      const encryptedResponse = await apiEncryptRequest();
      const sliderResponse = await instance.get(
        "/user/slider",
        encryptedResponse
      );
      const Response = await decryptData(sliderResponse.data);
      console.log(Response.slider, "==!==!==sliderlist");
      setSliderList(Response.slider || []);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const articles = [
    {
      title: "Social Media Calendar Template: The 10 Best for Marketers",
      author: "Basha Coleman",
      date: "7/24/24",
      image: "images/img4.png",
    },
    {
      title:
        "25 Professional Bio Examples I Keep in My Back Pocket for Inspiration",
      author: "Alana Chinn",
      date: "10/17/24",
      image: "images/img2.png",
    },
    {
      title:
        "I Found the Secret to Creating a Social Media Calendar to Plan All Your Posts",
      author: "Flori Needle",
      date: "4/11/24",
      image: "images/img3.png",
    },
    {
      title: "Social Media Calendar Template: The 10 Best for Marketers",
      author: "Basha Coleman",
      date: "7/24/24",
      image: "images/img4.png",
    },
    {
      title:
        "25 Professional Bio Examples I Keep in My Back Pocket for Inspiration",
      author: "Alana Chinn",
      date: "10/17/24",
      image: "images/img2.png",
    },
  ];

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      width: "605px",
    },
    input: {
      // flex: 1,
      width: isMobile ? "200px" : "300px",
      padding: isMobile ? "7px 15px" : "10px 15px",
      border: "1px solid #7890a1", // Border for input field
      borderTopLeftRadius: "8px", // Rounded left corners
      borderBottomLeftRadius: "8px",
      outline: "none",
      fontSize: "16px",
      backgroundColor: "#f5f8fa", // Light background similar to your image
    },
    button: {
      padding: isMobile ? "8px 20px" : "10px 20px",
      backgroundColor: "#e97730", // Orange color for button
      color: "#ffffff",
      border: "1px solid #e97730", // Match border to button background
      borderLeft: "none", // Remove left border to blend with input
      cursor: "pointer",
      fontSize: "16px",
      borderTopRightRadius: "8px", // Rounded right corners
      borderBottomRightRadius: "8px",
    },
  };

  return (
    <div>
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
      {isMobile ? (
        <>
          <div
            style={{
              width: "100% !important",
              paddingBottom: "10px",
              justifyContent: "center",
            }}
          >
            <Row>
              <div className="container">
                <h1
                  className="titless"
                  style={{
                    fontFamily: "Lexend Deca",
                    fontSize: "18px",
                    textAlign: "left",
                    marginLeft: "10px",
                  }}
                >
                  Unlock the Power of Cloud Computing - Strategies, Expert Tips,
                  Latest Trends{" "}
                </h1>
                <p
                  style={{
                    fontSize: "13px",
                    fontFamily: "Lexend Deca",
                    fontWeight: "500",
                    marginLeft: "10px",
                  }}
                >
                  Empowering Business Growth and Transformation Through Cloud
                  Innovation, Strategic Insights and Future-Ready Solutions in
                  the Digital Cloudscape
                </p>
                <div className="subscription-container">
                  <input
                    // type="email"
                    placeholder=""
                    className="subscription-input"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    style={styles.input}
                  />
                  <button
                    style={styles.button}
                    onClick={() =>
                      navigate("/blogsearch", {
                        state: {
                          searchText: inputVal,
                        },
                      })
                    }
                  >
                    Search
                  </button>
                </div>

                <div className="author-info-container">
                  <div
                    className="divider"
                    style={{
                      border: "none",
                      borderTop: "2px solid #e97730",
                      // marginLeft: "10px",
                      // marginTop: "-20px",
                    }}
                  />
                </div>
                <Row>
                  <div className="col-md-10">
                    <div
                      className="main-article"
                      style={{ marginLeft: "-5px" }}
                    >
                      {/* <img
                        src={blogList && blogList[0].articles[0].main_image}
                        onClick={() =>
                          navigate("/blogmore", {
                            state: {
                              title: blogList[0].articles[0].title,
                              date: blogList[0].articles[0].date,
                              authImg: blogList[0].articles[0].author_image,
                              authName: blogList[0].articles[0].author,
                              categoryName: blogList[0].category,
                              blogData: blogList[0].articles[0].sections,
                            },
                          })
                        }
                      /> */}
                      <div className="slider-container">
                        {currentSlide && (
                          <img
                            className="slide-animation"
                            key={currentIndex}
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            style={{
                              width: "100%",
                              height: "auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate("/blogmore", {
                                state: {
                                  title: currentSlide.title,
                                  date: currentSlide.created_at,
                                  authImg: currentSlide.author_image,
                                  authName: currentSlide.author,
                                  // categoryName: currentSlide.cat_id,
                                  blogId: currentSlide.blog_id,
                                },
                              })
                            }
                          />
                        )}
                      </div>

                      <h2
                        style={{
                          fontFamily: "Lexend Deca",
                          fontWeight: "500",
                          lineHeight: "2",
                          overflowWrap: "normal",
                          fontSize: "16px",
                        }}
                      >
                        {currentSlide && currentSlide.title}
                      </h2>

                      <div>
                        <span
                          style={{
                            fontFamily: "Lexend Deca",
                            fontWeight: "500",
                            lineHeight: "2",
                            overflowWrap: "normal",
                            fontSize: "14px",
                          }}
                        >
                          {/* {blogList && blogList[0].articles[0].author} */}
                          {currentSlide && currentSlide.author}
                          {"   "}
                          {/* {blogList && blogList[0].articles[0].date} */}
                          {currentSlide && currentSlide.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="ai-category"
                    style={{ marginBottom: "-50px", marginTop: "15px" }}
                  >
                    {Array.isArray(blogList) &&
                      blogList
                        .filter((category) => category.category === "Lifestyle")
                        .map((category, index) => (
                          <div
                            key={index}
                            className="category-section"
                            style={{
                              marginLeft: "1rem",
                              // width: "101%",
                              marginTop: "-20px",
                            }}
                          >
                            <h2
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                                color: "#035189",
                                fontSize: "16px",
                              }}
                              onClick={() =>
                                navigate("/blogsearch", {
                                  state: {
                                    searchCategory: category.category,
                                  },
                                })
                              }
                            >
                              {category.category}
                            </h2>
                            <div
                              style={{
                                display: "inline-block",
                                width: "100%",
                                verticalAlign: "middle",
                                border: "3px solid #e97730",
                              }}
                            />
                            <div className="card-grid">
                              {category.articles.map((article, idx) => (
                                <div
                                  key={idx}
                                  className="card"
                                  style={{ width: "150px", marginTop: "-1px" }}
                                  onClick={() =>
                                    navigate("/blogmore", {
                                      state: {
                                        title: article.title,
                                        date: article.date,
                                        authImg: article.author_image,
                                        authName: article.author,
                                        categoryName: category.category,
                                        blogData: article.sections,
                                      },
                                    })
                                  }
                                >
                                  <img
                                    src={article.main_image}
                                    alt={article.title}
                                    className="card-image"
                                  />
                                  <div className="card-content">
                                    <h3
                                      className="card-title"
                                      style={{ fontSize: "15px" }}
                                    >
                                      {article.title}
                                    </h3>
                                    <p className="card-author">
                                      {article.author}
                                    </p>
                                    {article.date_status !== 0 && (
                                      <p
                                        className="card-date"
                                        style={{ fontSize: "13px" }}
                                      >
                                        {article.date}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                  </div>

                  <div className="ai-category" style={{ marginTop: "60px" }}>
                    {Array.isArray(blogList) &&
                      blogList
                        .filter(
                          (category) =>
                            category.category !== "Lifestyle" &&
                            category.category !== "Featured"
                        )
                        .map((category, index) => (
                          <div
                            key={index}
                            className="category-section"
                            style={{
                              marginLeft: "1rem",
                              // width: "101%",
                              // marginTop: "20px",
                            }}
                          >
                            <h2
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                                color: "#035189",
                                fontSize: "16px",
                              }}
                              onClick={() =>
                                navigate("/blogsearch", {
                                  state: {
                                    searchCategory: category.category,
                                  },
                                })
                              }
                            >
                              {category.category}
                            </h2>
                            <div
                              style={{
                                display: "inline-block",
                                width: "100%",
                                verticalAlign: "middle",
                                border: "3px solid #e97730",
                              }}
                            />
                            <div className="card-grid">
                              {category.articles.map((article, idx) => (
                                <div
                                  key={idx}
                                  className="card"
                                  style={{ width: "150px", marginTop: "-1px" }}
                                  onClick={() =>
                                    navigate("/blogmore", {
                                      state: {
                                        title: article.title,
                                        date: article.date,
                                        authImg: article.author_image,
                                        authName: article.author,
                                        categoryName: category.category,
                                        blogData: article.sections,
                                      },
                                    })
                                  }
                                >
                                  <img
                                    src={article.main_image}
                                    alt={article.title}
                                    className="card-image"
                                  />
                                  <div className="card-content">
                                    <h3
                                      className="card-title"
                                      style={{ fontSize: "15px" }}
                                    >
                                      {article.title}
                                    </h3>
                                    <p className="card-author">
                                      {article.author}
                                    </p>
                                    {article.date_status !== 0 && (
                                      <p
                                        className="card-date"
                                        style={{ fontSize: "13px" }}
                                      >
                                        {article.date}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                  </div>

                  <div className="ai-category" style={{ marginTop: "20px" }}>
                    {Array.isArray(blogList) &&
                      blogList
                        .slice(0, 5)
                        .filter((category) => category.category === "Featured")
                        .map((category, index) => (
                          <div
                            key={index}
                            className="category-section"
                            style={{
                              marginLeft: "20px",
                              // width: "101%",
                              // marginTop: "20px",
                            }}
                          >
                            <h3
                              style={{
                                color: "#035189",
                                fontFamily: "Lexend Deca",
                                fontSize: "16px",
                              }}
                              onClick={() =>
                                navigate("/blogsearch", {
                                  state: {
                                    searchCategory: category.category,
                                  },
                                })
                              }
                            >
                              {category.category}
                            </h3>
                            <div
                              style={{
                                display: "inline-block",
                                width: "100%",
                                verticalAlign: "middle",
                                border: "3px solid #e97730",
                              }}
                            />
                            {category.articles.map((article, index) => (
                              <div
                                className="sidebar-article"
                                style={{
                                  fontFamily: "Lexend Deca",
                                  fontWeight: "500",
                                  lineHeight: "2",
                                  overflowWrap: "normal",
                                }}
                                onClick={() =>
                                  navigate("/blogmore", {
                                    state: {
                                      title: article.title,
                                      date: article.date,
                                      authImg: article.author_image,
                                      authName: article.author,
                                      categoryName: category.category,
                                      blogData: article.sections,
                                    },
                                  })
                                }
                              >
                                <img
                                  src={article.main_image}
                                  alt={article.title}
                                />
                                <div className="feat-article-details">
                                  <h4 style={{ fontSize: "14px" }}>
                                    {article.title}
                                  </h4>
                                  <p style={{ fontSize: "14px" }}>
                                    {article.author} •{" "}
                                    {article.date_status !== 0 &&
                                      `• ${article.date}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                  </div>
                </Row>
              </div>
            </Row>
          </div>
        </>
      ) : (
        <div style={{ height: "100vh" }}>
          <Row>
            <div className="col-md-2"></div>
            <div className="col-md-8">
              <header className="header">
                <div className="header-container">
                  {" "}
                  .
                  <div className="header-content">
                    <h1
                      style={{
                        fontFamily: "Lexend Deca",
                        fontWeight: "bold",
                        color: "#035189",
                        lineHeight: "1.5",
                        overflowWrap: "normal",
                      }}
                    >
                      Unlock the Power of Cloud Computing - Strategies, Expert
                      Tips, Latest Trends{" "}
                    </h1>
                    <div className="subscription-line">
                      <p
                        style={{
                          fontSize: "20px",
                          fontFamily: "Lexend Deca",
                          fontWeight: "500",
                        }}
                      >
                        Empowering Business Growth and Transformation Through
                        Cloud Innovation, Strategic Insights and Future-Ready
                        Solutions in the Digital Cloudscape
                      </p>
                      <div style={styles.container}>
                        <input
                          // type="email"
                          placeholder=""
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          style={styles.input}
                        />
                        <button
                          style={styles.button}
                          onClick={() =>
                            navigate("/blogsearch", {
                              state: {
                                searchText: inputVal,
                              },
                            })
                          }
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="divider"
                    style={{
                      border: "none",
                      borderTop: "5px solid #e97730",
                      marginTop: "10px",
                      width: "101%",
                    }}
                  />
                </div>
              </header>
              <div className="contents">
                <div
                  className="main-article"
                  style={{ marginTop: "-50px", marginLeft: "1.2rem" }}
                >
                  {/* <img
                    src={blogList && blogList[0].articles[0].main_image}
                    style={{ width: "50rem" }}
                    onClick={() =>
                      navigate("/blogmore", {
                        state: {
                          title: blogList[0].articles[0].title,
                          date: blogList[0].articles[0].date,
                          authImg: blogList[0].articles[0].author_image,
                          authName: blogList[0].articles[0].author,
                          categoryName: blogList[0].category,
                          blogData: blogList[0].articles[0].sections,
                        },
                      })
                    }
                  /> */}
                  <div className="slider-container">
                    {currentSlide && (
                      <img
                        className="slide-animation"
                        key={currentIndex}
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        style={{
                          width: "100%",
                          height: "auto",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate("/blogmore", {
                            state: {
                              title: currentSlide.title,
                              date: currentSlide.created_at,
                              // authImg: currentSlide.author_image,
                              // authName: currentSlide.author,
                              // categoryName: currentSlide.cat_id,
                              blogId: currentSlide.blog_id,
                            },
                          })
                        }
                      />
                    )}
                  </div>

                  <h2
                    style={{
                      fontFamily: "Lexend Deca",
                      fontWeight: "500",
                      lineHeight: "2",
                      overflowWrap: "normal",
                    }}
                  >
                    {/* {blogList && blogList[0].articles[0].title} */}
                    {currentSlide && currentSlide.title}
                  </h2>

                  <div>
                    <span
                      style={{
                        fontFamily: "Lexend Deca",
                        fontWeight: "500",
                        lineHeight: "2",
                        overflowWrap: "normal",
                      }}
                    >
                      {/* {blogList && blogList[0].articles[0].author} */}
                      {currentSlide && currentSlide.author}
                      {"   "}
                      {/* {blogList && blogList[0].articles[0].date} */}
                      {currentSlide && currentSlide.date}
                    </span>
                  </div>
                </div>

                {Array.isArray(blogList) &&
                  blogList
                    .slice(0, 5)
                    .filter((category) => category.category === "Featured")
                    .map((category, index) => (
                      <aside
                        className="sidebar"
                        style={{
                          marginTop: "-30px",
                        }}
                      >
                        <h3
                          className="hover-underline"
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
                          {category.category}
                        </h3>
                        {category.articles.map((article, index) => (
                          <div
                            className="sidebar-article"
                            style={{
                              fontFamily: "Lexend Deca",
                              fontWeight: "500",
                              lineHeight: "2",
                              overflowWrap: "normal",
                            }}
                            onClick={() =>
                              navigate("/blogmore", {
                                state: {
                                  title: article.title,
                                  date: article.date,
                                  authImg: article.author_image,
                                  authName: article.author,
                                  categoryName: category.category,
                                  blogData: article.sections,
                                },
                              })
                            }
                          >
                            <img src={article.main_image} alt={article.title} />
                            <div className="feat-article-details">
                              <h4
                                className="hover-underline"
                                style={{ color: "black" }}
                              >
                                {article.title}
                              </h4>
                              <p>
                                {article.author}{" "}
                                {article.date_status !== 0 &&
                                  `• ${article.date}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </aside>
                    ))}
              </div>

              <div className="ai-category">
                {Array.isArray(blogList) &&
                  blogList
                    .filter((category) => category.category === "Lifestyle") // Filter the list
                    .map((category, index) => (
                      <div
                        className="category-section"
                        style={{
                          marginLeft: "2.2rem",
                          width: "101%",
                        }}
                      >
                        <h2
                          className="hover-underline"
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                            color: "#035189",
                          }}
                          onClick={() =>
                            navigate("/blogsearch", {
                              state: {
                                searchCategory: category.category,
                              },
                            })
                          }
                        >
                          {category.category}
                        </h2>
                        <div
                          style={{
                            marginTop: "-11px",
                            display: "inline-block",
                            width: "100%",
                            verticalAlign: "middle",
                            border: "3px solid #e97730",
                          }}
                        />
                        <div
                          className="articles-list"
                          style={{ marginTop: "-5px" }}
                        >
                          {category.articles.map((article, index) => (
                            <div
                              className="article-card"
                              key={index}
                              onClick={() =>
                                navigate("/blogmore", {
                                  state: {
                                    title: article.title,
                                    date: article.date,
                                    authImg: article.author_image,
                                    authName: article.author,
                                    categoryName: category.category,
                                    blogData: article.sections,
                                  },
                                })
                              }
                            >
                              <img
                                src={article.main_image}
                                alt={article.title}
                                className="latimage"
                              />
                              <div
                                className="article-details"
                                style={{ fontFamily: "Lexend Deca" }}
                              >
                                <a href="#" className="article-title">
                                  {article.title}
                                </a>
                                <div className="article-meta">
                                  <span className="article-author">
                                    {/* {article.author} */}
                                  </span>
                                  {/* <span className="article-date">{article.date}</span> */}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>

              <div className="ai-category">
                {Array.isArray(blogList) &&
                  blogList
                    .filter(
                      (category) =>
                        category.category !== "Lifestyle" &&
                        category.category !== "Featured"
                    )
                    .map((category, index) => (
                      <div
                        key={index}
                        className="category-section"
                        style={{
                          marginLeft: "2rem",
                          width: "101%",
                          marginTop: "20px",
                        }}
                      >
                        <h2
                          className="hover-underline"
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                            color: "#035189",
                          }}
                          onClick={() =>
                            navigate("/blogsearch", {
                              state: {
                                searchCategory: category.category,
                              },
                            })
                          }
                        >
                          {category.category}
                        </h2>
                        <div
                          style={{
                            display: "inline-block",
                            width: "100%",
                            verticalAlign: "middle",
                            border: "3px solid #e97730",
                            marginTop: "-12px",
                          }}
                        />
                        <div
                          className="card-grid"
                          style={{ marginTop: "-5px" }}
                        >
                          {category.articles.map((article, idx) => (
                            <div
                              key={idx}
                              className="card"
                              onClick={() =>
                                navigate("/blogmore", {
                                  state: {
                                    title: article.title,
                                    date: article.date,
                                    authImg: article.author_image,
                                    authName: article.author,
                                    categoryName: category.category,
                                    blogData: article.sections,
                                  },
                                })
                              }
                            >
                              <img
                                src={article.main_image}
                                alt={article.title}
                                className="card-image"
                              />
                              <div
                                className="card-content"
                                style={{ fontFamily: "Lexend Deca" }}
                              >
                                {/* <h3 className="card-title">{article.title}</h3> */}
                                <a href="#" className="article-title">
                                  {article.title}
                                </a>
                                <p className="card-author">{article.author}</p>
                                {article.date_status !== 0 && (
                                  <p className="card-date">{article.date}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
            <div className="col-md-2"></div>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Blog;
