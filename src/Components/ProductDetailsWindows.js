import React, { useRef, useEffect, useState } from "react";
import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";
import "./ProductDetails.css";
import PageControl from "./PageControl";

const ProductDetailsWindows = (props) => {
  const { isMobile } = props;
  const totalPages = 2;
  const scrollThreshold = 0.4; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(0);
  const [selectedBtn, setSelectedBtn] = useState(0);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: (page - 1) * window.innerHeight,
      behavior: "smooth",
    });
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, totalPages]);
  const InnovativeSolutionsArr = [
    {
      title: "Latest CPU based compute",
      desc: "Overall best CPU based virtual machines, deploy in less than 30 seconds",
      img: "/images/cpu-white.png",
    },
    {
      title: "Well-founded Performance",
      desc: "Scale up your cloud server to add or reduce compute resources to meet changes in demand",
      img: "/images/performance-white.png",
    },
    {
      title: "Scalable",
      desc: "Scale up your cloud server to add or reduce compute resources to meet changes in demand.",
      img: "/images/scalable-white.png",
    },
    {
      title: "Bandwidth",
      desc: "SCVM enables you to do Huge amount of Bandwidth on 10Gig FC port within the each...",
      img: "/images/bandwidth-white.png",
    },
    {
      title: "Security",
      desc: "We offer verity of services to establish a secure access using WAF or gateway...",
      img: "/images/secure-01-white.png",
    },
  ];
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const pageHeight = window.innerHeight;
    const nextPage = Math.ceil(
      (scrollPosition + pageHeight * scrollThreshold) / pageHeight
    );

    // console.log("Scroll Position:", scrollPosition);
    // console.log("Page Height:", pageHeight);
    // console.log("Next Page:", nextPage);

    if (nextPage >= 1 && nextPage <= totalPages && nextPage !== currentPage) {
      setCurrentPage(nextPage);
    }
  };
  const standardArr = [
    {
      title: "Standard Window Server",
      topPrice: "$ 10.81 / Month",
      price: "$ 0.48 /day",
      cpu: "1 CPU",
      RAM: "40 GB RAM",
      hdd: "40 GB SSD Disk",
      data: "1 TB Bandwidth",
    },
    {
      title: "Standard Window Server",
      topPrice: "$ 14.71 / Month",
      price: "$ 0.48 /day",
      cpu: "1 CPU",
      RAM: "60 GB RAM",
      hdd: "60 GB SSD Disk",
      data: "2 TB Bandwidth",
    },
    {
      title: "Standard Window Server",
      topPrice: "$ 21.62 / Month",
      price: "$ 0.72 /day",
      cpu: "2 CPU",
      RAM: "80 GB RAM",
      hdd: "80 GB SSD Disk",
      data: "2 TB Bandwidth",
    },
    {
      title: "Standard Window Server",
      topPrice: " $ 28.22 / Month",
      price: "$ 0.96 /day",
      cpu: "2 CPU",
      RAM: "100 GB RAM",
      hdd: "100 GB SSD Disk",
      data: "3 TB Bandwidth",
    },
  ];
  const cpuArr = [
    {
      title: "Window CPU Proactive VMs",
      topPrice: "$ 50.44 / Month",
      price: "$ 0.07 /day",
      cpu: "4 CPU",
      RAM: "100 GB RAM",
      hdd: "100 GB SSD Disk",
      data: "4 TB Bandwidth",
    },
    {
      title: "Window CPU Proactive VMs",
      topPrice: "$ 95.47 / Month",
      price: "$ 0.13 /day",
      cpu: "8 CPU",
      RAM: "200 GB RAM",
      hdd: "200 GB SSD Disk",
      data: "8 TB Bandwidth",
    },
    {
      title: "Window CPU Proactive VMs",
      topPrice: "$ 140.51 / Month",
      price: "$ 0.2 /day",
      cpu: "12 CPU",
      RAM: "300 GB RAM",
      hdd: "300 GB SSD Disk",
      data: "10 TB Bandwidth",
    },
    {
      title: "Window CPU Proactive VMs",
      topPrice: " $ 206.56 / Month",
      price: "$ 0.29 /day",
      cpu: "16 CPU",
      RAM: "480 GB RAM",
      hdd: "480 GB SSD Disk",
      data: "15 TB Bandwidth",
    },
  ];
  const RAMArr = [
    {
      title: "RAM Proactive Server",
      topPrice: "$ 80.46 / Month",
      price: "$ 2.64 /day",
      cpu: "4 CPU",
      RAM: "240 GB RAM",
      hdd: "240 GB SSD Disk",
      data: "4 TB Bandwidth",
    },
    {
      title: "RAM Proactive Server",
      topPrice: "$ 150.11 / Month",
      price: "$ 5.4 /day",
      cpu: "8 CPU",
      RAM: "300 GB RAM",
      hdd: "300 GB SSD Disk",
      data: "8 TB Bandwidth",
    },
    {
      title: "RAM Proactive Server",
      topPrice: "$ 270.21 / Month",
      price: "$ 9.12 /day",
      cpu: "12 CPU",
      RAM: "480 GB RAM",
      hdd: "480 GB SSD Disk",
      data: "10 TB Bandwidth",
    },
    {
      title: "RAM Proactive Server",
      topPrice: " $ 389.7 / Month",
      price: "$ 12.96 /day",
      cpu: "16 CPU",
      RAM: "650 GB RAM",
      hdd: "650 GB SSD Disk",
      data: "15 TB Bandwidth",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
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
          <div className="heading-dotted">
            Products <span></span>
          </div>
          <div className="scrollable-container">
            {InnovativeSolutionsArr.map((item, index) => (
              <div className="front-mobile" key={index}>
                <figure
                  style={{
                    marginLeft: "-4rem",
                    border: "3px solid #e97730",
                    display: "flex",
                    margin: "auto",
                    textAlign: "center",
                    borderRadius: "52%",
                    width: "80px",
                    height: "80px",
                    position: "relative",
                    alignItems: "center",
                    justify: "center",
                  }}
                >
                  <img className="iconimg" src={item.img} alt="" />
                  <div className="bg-white"></div>
                </figure>

                <Button
                  style={{
                    marginTop: "-2px",
                    width: "110px",
                    height: "35px",
                    marginLeft: "10px",
                    backgroundColor: "transparent",
                    border: "3px solid rgb(233, 119, 48)",
                    borderRadius: "25px",
                  }}
                >
                  <h4
                    style={{
                      color: "white",
                      backgroundColor: "rgb(233, 119, 48)",
                      paddingTop: "4px",
                      borderRadius: "15px",
                      height: "25px",
                      marginTop: "-4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      marginLeft: "-10px",
                      width: "100px",
                    }}
                  >
                    {item.title}
                  </h4>
                </Button>
                <div
                  style={{
                    zIndex: "999",
                    left: "56px",
                    top: "-37px",
                    position: "relative",
                    height: "5px",
                    width: "15px",
                    backgroundColor: "#ffffff",
                  }}
                ></div>
              </div>
            ))}
          </div>
          <div
            className="solution-post"
            key={index}
            style={{
              backgroundImage: "linear-gradient(#FFFFFF, #EFEFEF)",
              height: "14rem",
              borderRadius: "15px",
            }}
          >
            <div
              className="product-card-mobile"
              style={{
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="front-mobile-single">
                <figure
                  style={{
                    marginLeft: "-4rem",
                    border: "3px solid #e97730",
                    display: "flex",
                    margin: "auto",
                    textAlign: "center",
                    borderRadius: "52%",
                    width: "80px",
                    height: "80px",
                    position: "relative",
                    alignItems: "center",
                    justify: "center",
                  }}
                >
                  <img
                    className="iconimg"
                    src="/images/linux_logo_icon.png"
                    alt=""
                  />
                  <div className="bg-white"></div>
                </figure>

                <Button
                  style={{
                    marginTop: "-2px",
                    width: "110px",
                    height: "35px",
                    marginLeft: "10px",
                    backgroundColor: "transparent",
                    border: "3px solid rgb(233, 119, 48)",
                    borderRadius: "25px",
                  }}
                >
                  <h4
                    style={{
                      color: "white",
                      backgroundColor: "rgb(233, 119, 48)",
                      paddingTop: "4px",
                      borderRadius: "15px",
                      height: "25px",
                      marginTop: "-4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      marginLeft: "-10px",
                      width: "100px",
                    }}
                  >
                    Linux Services
                  </h4>
                </Button>
                <div
                  style={{
                    zIndex: "999",
                    left: "56px",
                    top: "-37px",
                    position: "relative",
                    height: "5px",
                    width: "15px",
                    backgroundColor: "#ffffff",
                  }}
                ></div>
              </div>
              <div className="">
                <div className="cont">
                  <a href="https://smartcloudvm.com/windowdetail">
                    window cloud
                  </a>
                  <a href="https://smartcloudvm.com/windowdetail">
                    standard window services
                  </a>
                  <a href="https://smartcloudvm.com/windowstandard">
                    window CPU Proactive VMs
                  </a>
                  <a href="https://smartcloudvm.com/windowRAM">
                    window RAM Proactive VMs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Row>
            <div className="col-md-2"></div>

            <div
              className="product1-top see-full-pd col-md-10"
              style={{ marginTop: "5rem", marginLeft: "10rem" }}
            >
              <div className="product1-left see-pd-6">
                {" "}
                <div className="mob-center">
                  <div className="media-pd">
                    <img src="/images/windows_icon.png" alt="" />
                  </div>
                  <div className="heading-pd">
                    {selectedBtn == 0
                      ? "Standard"
                      : selectedBtn == 1
                      ? "CPU Proactive"
                      : "RAM Proactive"}
                    <span> Windows Servers</span>
                  </div>
                </div>
                {/* <div className="tabs-pd mobile-pd">
                  <Button className="tablinks">Standard</Button>
                  <Button className="tablinks">Standard</Button>
                  <Button className="tablinks">Standard</Button>
                </div> */}
              </div>
              <div className="product1-left see-pd-6">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Laboriosam est ab ut ratione, similique dolores. Dignissimos
                  blanditiis placeat at ad!
                </p>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Laudantium tempora quia dolor ipsa accusantium nisi, optio non
                  animi aliquid quod maxime ipsum earum! Laudantium explicabo
                  dolor ipsum voluptatum, similique est vel vero hic eius sequi?
                  Blanditiis quas veniam numquam at!
                </p>
              </div>
            </div>
            <div className="product1-bottom see-full-pd">
              <div className="tabs-pd">
                {/* #ffd8bb #154e7a */}
                <Button
                  className="tablinks"
                  style={{
                    color: selectedBtn === 0 ? "#ffd8bb" : "#154e7a",
                    backgroundColor: selectedBtn === 0 ? "#154e7a" : "#ffd8bb",
                  }}
                  onClick={() => setSelectedBtn(0)}
                >
                  Standard
                </Button>
                <Button
                  className="tablinks"
                  style={{
                    color: selectedBtn === 1 ? "#ffd8bb" : "#154e7a",
                    backgroundColor: selectedBtn === 1 ? "#154e7a" : "#ffd8bb",
                  }}
                  onClick={() => setSelectedBtn(1)}
                >
                  CPU Proactive
                </Button>
                <Button
                  className="tablinks"
                  style={{
                    color: selectedBtn === 2 ? "#ffd8bb" : "#154e7a",
                    backgroundColor: selectedBtn === 2 ? "#154e7a" : "#ffd8bb",
                  }}
                  onClick={() => setSelectedBtn(2)}
                >
                  RAM Proactive
                </Button>
              </div>
            </div>
            <div className="package-container">
              <div
                style={{
                  position: "relative",
                  color: "#154e7a",
                  fontSize: "40px",
                  textTransform: "capitalize",
                  fontWeight: "600",
                }}
              >
                Choose your
              </div>
              <div class="sub-heading">
                high performance{" "}
                {selectedBtn == 0
                  ? "Standard Servers"
                  : selectedBtn == 1
                  ? "CPU Proactive"
                  : "RAM Proactive"}
              </div>
            </div>
            {/* <div className="wallet-container"> */}
            <div
              className="wallet-box"
              style={{
                marginTop: "80px",
                height: "20rem",
                width: "80%",
                marginLeft: "20rem",
              }}
            >
              {selectedBtn == 0 ? (
                <>
                  {standardArr.map((item, idx) => (
                    <div
                      className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12"
                      style={{ paddingTop: "15px" }}
                    >
                      <div className="package-top bg-gradient-white">
                        <div className="top-head-pd see-white-text">
                          <img
                            src="/images/title-bg-orange.png"
                            alt="Title Background Orange"
                          />
                          <img
                            className="hover-img"
                            src="/images/title-bg-white.png"
                            alt="Title Background White"
                          />
                          <span className="plan-typ">{item.title}</span>
                        </div>
                        <div className="top-body theme-color-blue">
                          <div className="mob-bg">
                            <div className="price-pd">{item.topPrice}</div>
                            <div className="or-bg">or</div>
                            <div className="time">{item.price}</div>
                          </div>
                        </div>
                      </div>
                      <div className="package-bottom">
                        <figure>
                          <img
                            src="/images/box-bg-white.png"
                            alt="Box Background White"
                          />
                          <img
                            className="hover-img"
                            src="/images/orange-box-bg.png"
                            alt="Orange Box Background"
                          />
                        </figure>
                        <div className="package-cont">
                          {/* <div className="title">RAM Proactive VMs Servers</div> */}
                          <div className="price-pd">{item.cpu}</div>
                          <div className="price-pd">{item.RAM}</div>
                          <div className="price-pd">{item.hdd}</div>
                          <div className="price-pd">{item.data}</div>
                          <div className="price-pd">
                            <div
                              className="log-in"
                              style={{
                                marginTop: "15px",
                                marginLeft: "-8rem",
                                justifyContent: "center",
                              }}
                              // onClick={() => UpdateInfo()}
                            >
                              <a className="media-link" href="/signUp">
                                <div
                                  className="media-banner"
                                  style={{
                                    width: "auto",
                                    height: "50px",

                                    marginLeft: "10rem",
                                  }}
                                >
                                  <img
                                    className="normal-banner"
                                    src="/images/blue-btn-big.png"
                                    alt=""
                                    style={{
                                      marginTop: "-6px",
                                      width: "10rem",
                                      height: "50px",
                                    }}
                                  />
                                  <img
                                    className="hover-img-banner"
                                    src="/images/orange-btn-big.png"
                                    alt="/images/orange-btn-big.png"
                                    style={{
                                      marginTop: "-6px",
                                      width: "10rem",
                                      height: "50px",
                                    }}
                                  />
                                  <span
                                    className="login-text"
                                    style={{
                                      fontSize: "20px",
                                      color: "white",
                                      marginTop: "-8px",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.color = "#07528B")
                                    } // Change color on hover
                                    onMouseOut={(e) =>
                                      (e.target.style.color = "white")
                                    }
                                  >
                                    Buy Now
                                  </span>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : selectedBtn == 1 ? (
                <>
                  {cpuArr.map((item, idx) => (
                    <div
                      className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12"
                      style={{ paddingTop: "15px" }}
                    >
                      <div className="package-top bg-gradient-white">
                        <div className="top-head-pd see-white-text">
                          <img
                            src="/images/title-bg-orange.png"
                            alt="Title Background Orange"
                          />
                          <img
                            className="hover-img"
                            src="/images/title-bg-white.png"
                            alt="Title Background White"
                          />
                          <span className="plan-typ">{item.title}</span>
                        </div>
                        <div className="top-body theme-color-blue">
                          <div className="mob-bg">
                            <div className="price-pd">{item.topPrice}</div>
                            <div className="or-bg">or</div>
                            <div className="time">{item.price}</div>
                          </div>
                        </div>
                      </div>
                      <div className="package-bottom">
                        <figure>
                          <img
                            src="/images/box-bg-white.png"
                            alt="Box Background White"
                          />
                          <img
                            className="hover-img"
                            src="/images/orange-box-bg.png"
                            alt="Orange Box Background"
                          />
                        </figure>
                        <div className="package-cont">
                          {/* <div className="title">RAM Proactive VMs Servers</div> */}
                          <div className="price-pd">{item.cpu}</div>
                          <div className="price-pd">{item.RAM}</div>
                          <div className="price-pd">{item.hdd}</div>
                          <div className="price-pd">{item.data}</div>
                          <div className="price-pd">
                            <div
                              className="log-in"
                              style={{
                                marginTop: "15px",
                                marginLeft: "-8rem",
                                justifyContent: "center",
                              }}
                              // onClick={() => UpdateInfo()}
                            >
                              <a className="media-link" href="/signUp">
                                <div
                                  className="media-banner"
                                  style={{
                                    width: "auto",
                                    height: "50px",

                                    marginLeft: "10rem",
                                  }}
                                >
                                  <img
                                    className="normal-banner"
                                    src="/images/blue-btn-big.png"
                                    alt=""
                                    style={{
                                      marginTop: "-6px",
                                      width: "10rem",
                                      height: "50px",
                                    }}
                                  />
                                  <img
                                    className="hover-img-banner"
                                    src="/images/orange-btn-big.png"
                                    alt="/images/orange-btn-big.png"
                                    style={{
                                      marginTop: "-6px",
                                      width: "10rem",
                                      height: "50px",
                                    }}
                                  />
                                  <span
                                    className="login-text"
                                    style={{
                                      fontSize: "20px",
                                      color: "white",
                                      marginTop: "-8px",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.color = "#07528B")
                                    } // Change color on hover
                                    onMouseOut={(e) =>
                                      (e.target.style.color = "white")
                                    }
                                  >
                                    Buy Now
                                  </span>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {RAMArr.map((item, idx) => (
                    <div
                      className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12"
                      style={{ paddingTop: "15px" }}
                    >
                      <div className="package-top bg-gradient-white">
                        <div className="top-head-pd see-white-text">
                          <img
                            src="/images/title-bg-orange.png"
                            alt="Title Background Orange"
                          />
                          <img
                            className="hover-img"
                            src="/images/title-bg-white.png"
                            alt="Title Background White"
                          />
                          <span className="plan-typ">{item.title}</span>
                        </div>
                        <div className="top-body theme-color-blue">
                          <div className="mob-bg">
                            <div className="price-pd">{item.topPrice}</div>
                            <div className="or-bg">or</div>
                            <div className="time">{item.price}</div>
                          </div>
                        </div>
                      </div>
                      <div className="package-bottom">
                        <figure>
                          <img
                            src="/images/box-bg-white.png"
                            alt="Box Background White"
                          />
                          <img
                            className="hover-img"
                            src="/images/orange-box-bg.png"
                            alt="Orange Box Background"
                          />
                        </figure>
                        <div className="package-cont">
                          {/* <div className="title">RAM Proactive VMs Servers</div> */}
                          <div className="price-pd">{item.cpu}</div>
                          <div className="price-pd">{item.RAM}</div>
                          <div className="price-pd">{item.hdd}</div>
                          <div className="price-pd">{item.data}</div>
                          <div className="price-pd">
                            <div
                              className="log-in"
                              style={{
                                marginTop: "15px",
                                marginLeft: "-8rem",
                                justifyContent: "center",
                              }}
                              // onClick={() => UpdateInfo()}
                            >
                              <a className="media-link" href="/signUp">
                                <div
                                  className="media-banner"
                                  style={{
                                    width: "auto",
                                    height: "50px",

                                    marginLeft: "10rem",
                                  }}
                                >
                                  <img
                                    className="normal-banner"
                                    src="/images/blue-btn-big.png"
                                    alt=""
                                    style={{
                                      marginTop: "-6px",
                                      width: "10rem",
                                      height: "50px",
                                    }}
                                  />
                                  <img
                                    className="hover-img-banner"
                                    src="/images/orange-btn-big.png"
                                    alt="/images/orange-btn-big.png"
                                    style={{
                                      marginTop: "-6px",
                                      width: "10rem",
                                      height: "50px",
                                    }}
                                  />
                                  <span
                                    className="login-text"
                                    style={{
                                      fontSize: "20px",
                                      color: "white",
                                      marginTop: "-8px",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.color = "#07528B")
                                    } // Change color on hover
                                    onMouseOut={(e) =>
                                      (e.target.style.color = "white")
                                    }
                                  >
                                    Buy Now
                                  </span>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            {/* </div> */}
            <div
              style={{
                marginTop: "10rem",
              }}
            >
              <div
                className="heading-dotted-product"
                style={{ marginLeft: "15rem", fontSize: "50px" }}
              >
                Benefits Of Cloud <span></span>
              </div>

              <div
                className="solution-posts-inner"
                style={{
                  marginLeft: "25rem",
                  marginTop: "1rem",
                  width: "75%",
                  marginBottom: "5rem",
                }}
              >
                {InnovativeSolutionsArr.map((item, index) => (
                  <div className="solution-post">
                    <div
                      style={{
                        backgroundImage: "linear-gradient(#FFFFFF, #EFEFEF)",
                        borderRadius: "15px",
                      }}
                    >
                      <div className="solution-card-solution" key={index}>
                        <div
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
                            marginTop: "-32%",
                            padding: "0",
                            position: "relative",
                            top: "1rem",
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
                              <img src={item.img} alt={item.img} />
                            </figure>
                          </div>
                        </div>
                        <div className="content-solution">
                          <h3
                            style={{
                              fontSize: "20px",
                              fontWeight: "500",
                              color: "#2D394B",
                              textAlign: "center",
                              margin: "35px 0 10px",
                            }}
                          >
                            {item.title}
                          </h3>
                          <p className="description-solution-product">
                            Lorem ipsum dolor sit amet consectetur adipiscing
                            elit nulla elementum sit amet metus
                          </p>
                        </div>
                        <div className="log-in" style={{ marginLeft: "30%" }}>
                          <a href="/blogmore" className="media-link">
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
                                src={"/images/orange-btn.png"}
                                alt=""
                              />
                              <span
                                className="login-text"
                                style={{
                                  fontSize: "20px",
                                  color: "white",
                                  top: "46%",
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
          <PageControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductDetailsWindows;
