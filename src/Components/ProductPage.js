import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Row } from "react-bootstrap";
import "./ProductPage.css";

const ProductPage = (props) => {
  const { isMobile } = props;
  const [index, setIndex] = useState(0);

  const InnovativeSolutionsArr = [
    {
      title: "Linux Servers",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit nulla elementum sit amet metus",
      img: "/images/linux_logo_icon.png",
      url: "#",
      line1: "linux Services",
      line2: "Standard",
      line3: "CPU Proactive",
      line4: "Ram Proactive",
    },
    // {
    //   title: "Windows Services",
    //   desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit nulla elementum sit amet metus",
    //   img: "/images/windows_icon.png",
    //   url: "#",
    //   line1: "window cloud",
    //   line2: "standard window services",
    //   line3: "window CPU Proactive VMs",
    //   line4: "window memory Proactive VMs",
    // },
    // {
    //   title: "Storage Services",
    //   desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit nulla elementum sit amet metus",
    //   img: "/images/storage-icon.png",
    //   url: "#",
    //   line1: "linux cloud",
    //   line2: "standard linux services",
    //   line3: "linux CPU Proactive VMs",
    //   line4: "linux memory Proactive VMs",
    // },
  ];
  const [title, setTitle] = useState(
    InnovativeSolutionsArr && InnovativeSolutionsArr[0].title
  );
  const [photo, setPhoto] = useState(
    InnovativeSolutionsArr && InnovativeSolutionsArr[0].img
  );

  const [activeTab, setActiveTab] = useState("#linux-services");

  const handleTabClick = (target) => {
    setActiveTab(target);
  };

  return (
    <div style={{ height: "100vh" }}>
      {isMobile ? (
        <>
          <div className="heading-dotted">
            Products <span></span>
          </div>
          <div
            className="solution-post"
            key={index}
            style={{
              backgroundImage: "linear-gradient(#FFFFFF, #EFEFEF)",
              height: "35rem",
              borderRadius: "15px",
            }}
          >
            <div
              className="product-card-mobile"
              style={{
                marginTop: "70px",
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
                    width: "150px",
                    height: "150px",
                    position: "relative",
                    alignItems: "center",
                    justify: "center",
                  }}
                >
                  <img className="iconimg" src={photo} alt="" />
                  <div className="bg-white"></div>
                </figure>

                <Button
                  style={{
                    marginTop: "-2px",
                    width: "130px",
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
                      marginTop: "-3px",
                      fontSize: "14px",
                      fontWeight: "700",
                      marginLeft: "-12px",
                      width: "118px",
                    }}
                  >
                    {title}
                  </h4>
                </Button>
                <div
                  style={{
                    zIndex: "999",
                    left: "68px",
                    top: "-37px",
                    position: "relative",
                    height: "5px",
                    width: "15px",
                    backgroundColor: "#ffffff",
                  }}
                ></div>
              </div>
              <div className="">
                <div className="cont" style={{ marginLeft: "-15px" }}>
                  <Link to="/product-details-ubantu" state={{ tab: 1 }}>
                    Standard
                  </Link>
                  <Link to="/product-details-ubantu" state={{ tab: 2 }}>
                    CPU Proactive
                  </Link>
                  <Link to="/product-details-ubantu" state={{ tab: 3 }}>
                    RAM Proactive
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Row>
            <div className="col-md-1"></div>
            <div
              className="see-width col-md-10"
              style={{ marginTop: "4.5rem" }}
            >
              <div className="heading-dotted">
                Products <span></span>
              </div>
              <div className="" style={{ marginLeft: "40%" }}>
                <div className="list-item-product">
                  <div className="front">
                    <figure
                      style={{
                        marginLeft: "-4rem",
                        border: "7px solid #e97730",
                        display: "flex",
                        margin: "auto",
                        textAlign: "center",
                        borderRadius: "52%",
                        width: "17rem",
                        height: "17rem",
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
                        marginTop: "-5px",
                        width: "300px",
                        height: "80px",
                        marginLeft: "25px",
                        backgroundColor: "transparent",
                        border: "6px solid #e97730",
                        borderRadius: "40px",
                      }}
                    >
                      <h4
                        style={{
                          width: "270px",
                          marginLeft: "-5px",
                          color: "white",
                          backgroundColor: "#e97730",
                          paddingTop: "13px",
                          borderRadius: "25px",
                          height: "55px",
                          marginTop: "2px",
                        }}
                      >
                        Linux Services
                      </h4>
                    </Button>
                    <div
                      style={{
                        zIndex: "999",
                        left: "165px",
                        top: "-82px",
                        position: "relative",
                        height: "12px",
                        width: "10px",
                        backgroundColor: "#ffffff",
                      }}
                    ></div>
                  </div>

                  <div className="back">
                    <div className="bg-img">
                      <div
                        className="solution-post"
                        key={index}
                        style={{
                          backgroundImage: "linear-gradient(#FFFFFF, #EFEFEF)",
                          width: "22rem",
                          height: "20rem",
                          borderRadius: "15px",
                          marginTop: "-25px",
                        }}
                      ></div>
                      <img src="/images/box-bg-white.png" alt="" />
                    </div>
                    <figure>
                      <img
                        src="/images/linux_logo_icon-small.png"
                        alt=""
                        style={{
                          width: "100px",
                          height: "100px",
                          marginLeft: "123px",
                        }}
                      />
                    </figure>
                    <div className="productheading">linux Services</div>
                    <div
                      className="cont"
                      style={{ marginTop: "5px", marginLeft: "5px" }}
                    >
                      <Link to="/product-details-ubantu" state={{ tab: 1 }}>
                        Standard
                      </Link>
                      <Link to="/product-details-ubantu" state={{ tab: 2 }}>
                        CPU Proactive
                      </Link>
                      <Link to="/product-details-ubantu" state={{ tab: 3 }}>
                        RAM Proactive
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductPage;
