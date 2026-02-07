import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "../../Api";
import "./BlogsMore.css";
import Loader from "../common/Loader";

const BlogSearchPage = (props) => {
  // const { isMobile } = props;
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [blogList, setBlogList] = useState(null);
  const searchTexts = location.state ? location.state.searchText : null;
  const searchCategory = location.state ? location.state.searchCategory : null;

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    setSearchText(searchTexts);
    setSelectedCategory(searchCategory);
    ListBlogs();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

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
    setLoading(false);
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      width: "300px",
      height: "40px",
      padding: "0 12px",
      borderRadius: "20px",
      backgroundColor: "#f8f9fa",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
      border: "2px solid #7890a1",
    },
    searchIcon: {
      fontSize: "18px",
      color: "#9aa0a6",
      marginRight: "8px",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      //   backgroundColor: "transparent",
      fontSize: "16px",
      color: "black",
    },
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
            <Row
              style={{
                paddingTop: "1rem",
                width: "100%",
                paddingBottom: "5rem",
              }}
            >
              <div className="col-md-2"></div>
              <div className="col-md-8">
                <div
                  className="header-container"
                  style={{
                    marginLeft: "0.8rem",
                  }}
                >
                  <div style={styles.container}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search..."
                      style={styles.input}
                      value={searchText}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="ai-category" style={{ marginRight: "40px" }}>
                  {Array.isArray(blogList) &&
                    blogList
                      .filter((category) => {
                        // If a category is selected, only show that category and ignore searchText
                        if (selectedCategory) {
                          return category.category === selectedCategory;
                        }

                        // Otherwise, filter based on searchText
                        return (
                          category.category
                            .toLowerCase()
                            .includes(searchText && searchText.toLowerCase()) ||
                          category.articles.some(
                            (article) =>
                              article.title
                                .toLowerCase()
                                .includes(
                                  searchText && searchText.toLowerCase()
                                ) ||
                              article.author
                                .toLowerCase()
                                .includes(
                                  searchText && searchText.toLowerCase()
                                )
                          )
                        );
                      })
                      .map((category, index) => {
                        // If a category is selected, show all its articles; otherwise, filter by searchText
                        const matchingArticles = selectedCategory
                          ? category.articles
                          : category.articles.filter((article) =>
                              article.title
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                            );

                        // Render only if there are matching articles or if the selectedCategory is active
                        return matchingArticles.length > 0 ? (
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
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                                color: "#035189",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                // Set selected category and clear search text for exclusive category view
                                setSelectedCategory(category.category);
                                setSearchText("");
                              }}
                            >
                              {category.category}
                            </h2>

                            {/* Add a reset button to clear the selected category filter */}
                            {selectedCategory && (
                              <button
                                onClick={() => {
                                  setSelectedCategory(null);
                                  setSearchText("");
                                }}
                                style={{
                                  marginLeft: "10px",
                                  backgroundColor: "#e97730", // Orange color for button
                                  color: "#ffffff",
                                  border: "1px solid #e97730", // Match border to button background
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  borderRadius: "6px",
                                }}
                              >
                                Clear Filter
                              </button>
                            )}

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
                              {matchingArticles.map((article, idx) => (
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
                                    <h3 className="card-title">
                                      {article.title}
                                    </h3>
                                    <p className="card-author">
                                      {article.author}
                                    </p>
                                    <p className="card-date">{article.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })}
                </div>
              </div>
            </Row>
          </div>
        </>
      ) : (
        <>
          <div style={{ height: "100vh" }}>
            <Row>
              <div className="col-md-2"></div>
              <div className="col-md-8">
                <div
                  className="header-container"
                  style={{ marginLeft: "0.8rem", paddingTop: "25px" }}
                >
                  <div style={styles.container}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search..."
                      style={styles.input}
                      value={searchText}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="ai-category">
                  {/* {Array.isArray(blogList) &&
                    blogList
                      .filter(
                        (category) =>
                          category.category
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                          category.articles.some((article) =>
                            article.title
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                          )
                      )
                      .map((category, index) => {
                        // Filter articles in the current category by searchText
                        const matchingArticles = category.articles.filter(
                          (article) =>
                            article.title
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                        );

                        // Only render the category if there are matching articles
                        return matchingArticles.length > 0 ? (
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
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                                color: "#035189",
                              }}
                              onClick={() => setSearchText(category.category)}
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
                              {matchingArticles.map((article, idx) => (
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
                                    <h3 className="card-title">
                                      {article.title}
                                    </h3>
                                    <p className="card-author">
                                      {article.author}
                                    </p>
                                    <p className="card-date">{article.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })} */}
                  {Array.isArray(blogList) &&
                    blogList
                      .filter((category) => {
                        // If a category is selected, only show that category and ignore searchText
                        if (selectedCategory) {
                          return category.category === selectedCategory;
                        }

                        // Otherwise, filter based on searchText
                        return (
                          category.category
                            .toLowerCase()
                            .includes(searchText && searchText.toLowerCase()) ||
                          category.articles.some(
                            (article) =>
                              article.title
                                .toLowerCase()
                                .includes(
                                  searchText && searchText.toLowerCase()
                                ) ||
                              article.author
                                .toLowerCase()
                                .includes(
                                  searchText && searchText.toLowerCase()
                                )
                          )
                        );
                      })
                      .map((category, index) => {
                        // If a category is selected, show all its articles; otherwise, filter by searchText
                        const matchingArticles = selectedCategory
                          ? category.articles
                          : category.articles.filter((article) =>
                              article.title
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                            );

                        // Render only if there are matching articles or if the selectedCategory is active
                        return matchingArticles.length > 0 ? (
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
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                // Set selected category and clear search text for exclusive category view
                                setSelectedCategory(category.category);
                                setSearchText("");
                              }}
                            >
                              {category.category}
                            </h2>

                            {/* Add a reset button to clear the selected category filter */}
                            {selectedCategory && (
                              <button
                                onClick={() => {
                                  setSelectedCategory(null);
                                  setSearchText("");
                                }}
                                style={{
                                  marginLeft: "10px",
                                  backgroundColor: "#e97730", // Orange color for button
                                  color: "#ffffff",
                                  border: "1px solid #e97730", // Match border to button background
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  borderRadius: "6px",
                                }}
                              >
                                Clear Filter
                              </button>
                            )}

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
                              {matchingArticles.map((article, idx) => (
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
                                    <h3 className="card-title">
                                      {article.title}
                                    </h3>
                                    <p className="card-author">
                                      {article.author}
                                    </p>
                                    <p className="card-date">{article.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })}
                </div>
              </div>
              <div className="col-md-2"></div>
            </Row>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogSearchPage;
