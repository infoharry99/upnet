import React, { useRef, useState } from "react";

import FeaturesList from "./FeaturesList";
import SolutionsList from "./SolutionsList";
import ThirdSection from "../common/ThirdSection";
import { Row } from "react-bootstrap";
import "./HomeSecondSec.css";
import ListItem from "./ListItem";

const HomeSecondSec = (props) => {
  const { isMobile } = props;

  const banner = [
    "inner-slider-01.jpg",
    "inner-slider-02.jpg",
    "inner-slider-03.jpg",
    "inner-slider-04.png",
  ];

  const InnovativeSolutionsArr = [
    {
      title: "Deploy Virtual Machine",
      desc: "Our Cloud VMs with dedicated server capabilities provide unrivaled power and control. Enjoy superior performance, scalability, and customization choices that are tailored to your specific company requirements.",
      img: "/images/windows-cloud.svg",
    },
    {
      title: "Raw Infra Machine",
      desc: "Raw machines provide unrivaled power and control. Experience great performance, smooth scalability, and customizable customization choices to properly meet your company's needs.",
      img: "/images/clock-secure-white.svg",
    },
    {
      title: "Private Server Networking",
      desc: "Private server networking improves performance, dependability, and security by providing exclusive resources and extensive connectivity options. Experience greater control over data flow and seamless connection with your corporate infrastructure, resulting in reliable operations.",
      img: "/images/secure-01-white.svg",
    },
    {
      title: "Transparent detailed Billing",
      desc: "Transparent, diligent billing for your servers enables clarity and accuracy in cost management. Our clear invoicing approach includes itemized breakdowns, allowing you to conveniently track spending and optimize resource allocation.",
      img: "/images/bulb-white.svg",
    },
  ];

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const featureListStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: "20px",
  };
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
        <div style={{ marginTop: "3rem" }}>
          <h2
            style={{ 
              color: "#154e7a",
              fontSize: "20px",
              fontWeight: "500",
              paddingTop: "10px",
              position: "relative",
              textAlign: "center",
            }}
          >
            Exclusive sneak peak of our features.
          </h2>
          <div style={featureListStyle}>
            <ListItem
              imgSrc="/images/self-control.svg"
              altText="Self Control"
              title="self-controlled"
            />
            <ListItem
              imgSrc="/images/communication.svg"
              altText="Communication"
              title="ready to serve"
            />
            <ListItem
              imgSrc="/images/self-managed.svg"
              altText="Self Managed"
              title="self-managed"
            />
            <ListItem
              imgSrc="/images/customized-pricing.svg"
              altText="Customized Pricing"
              title="customized pricing"
            />
          </div>
          <div style={featureListStyle}>
            <ListItem
              imgSrc="/images/transformation-white.svg"
              altText="Digital Transformation"
              title="digital transformation"
            />
          </div>
          <h2
            style={{
              textAlign: "center",
              color: "#154e7a",
              fontSize: "20px",
              fontWeight: "500",
              paddingTop: "10px",
              position: "relative",
            }}
          >
            Transforming businesses through our
          </h2>
          <h2
            style={{
              textAlign: "center",
              fontSize: "28px",
              color: "#154e7a",
              fontWeight: "600",
              position: "relative",
            }}
          >
            innovative solutions
          </h2>
          {InnovativeSolutionsArr.map((item, index) => (
            <div className="solution-card" key={index}>
              <div className="content" style={{ marginTop: "0rem" }}>
                <h3 className="title" style={{ marginTop: "-30px" }}>
                  {item.title}
                </h3>
                <p className="description" style={{ textAlign: "justify" }}>
                  {item.desc}
                </p>
              </div>
              <div
                className="in-border"
                style={{
                  position: "relative",
                  alignContent: "center",
                  height: "70px",
                  width: "70px",
                  border: "2px solid rgb(233, 119, 48)",
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  padding: "0px",
                  bottom:
                    index == 0
                      ? "120px"
                      : index == 1
                      ? "100px"
                      : index == 2
                      ? "135px"
                      : index == 3
                      ? "115px"
                      : "",
                  left: "-85px",
                }}
              >
                <div
                  className="in-border"
                  style={{
                    height: "55px",
                    width: "55px",
                    padding: "12px",
                    border: "2px solid #E97730",
                    borderRadius: "50%",
                    margin: "auto",
                    backgroundColor: "#E97730",
                  }}
                >
                  <figure>
                    <img src={item.img} alt={item.img} />
                  </figure>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div
            className="features-page"
            style={{ height: "50rem", padding: "10rem", marginBottom: "15rem" }}
          >
            <div className="features-section">
              <Row>
                {/* <div className="col-md-1"></div> */}
                <div className="col-md-5">
                  <h2
                    style={{
                      fontSize: "40px",
                      paddingTop: "0px",
                      color: "#154e7a",
                      marginLeft: "4rem",
                      fontWeight: "500",
                      paddingTop: "10px",
                      position: "relative",
                    }}
                  >
                    Exclusive sneak peak of our features.
                  </h2>
                  <div style={featureListStyle}>
                    <ListItem
                      imgSrc="/images/self-control.svg"
                      altText="Self Control"
                      title="self-controlled"
                    />
                    <ListItem
                      imgSrc="/images/communication.svg"
                      altText="Communication"
                      title="ready to serve"
                    />
                  </div>
                  <div style={featureListStyle}>
                    <ListItem
                      imgSrc="/images/self-managed.svg"
                      altText="Self Managed"
                      title="self-managed"
                    />
                    <ListItem
                      imgSrc="/images/customized-pricing.svg"
                      altText="Customized Pricing"
                      title="customized pricing"
                    />
                  </div>
                  <div style={featureListStyle}>
                    <ListItem
                      imgSrc="/images/transformation-white.svg"
                      altText="Digital Transformation"
                      title="digital transformation"
                    />
                  </div>
                </div>

                <div className="solutions-section col-md-7">
                  <h2
                    style={{
                      textAlign: "center",
                      fontSize: "40px",
                      paddingTop: "0px",
                      color: "#154e7a",
                      marginLeft: "8rem",
                      fontWeight: "500",
                      paddingTop: "10px",
                      position: "relative",
                    }}
                  >
                    Transforming businesses through our
                  </h2>
                  <h2
                    style={{
                      textAlign: "center",
                      fontSize: "40px",
                      paddingTop: "0px",
                      color: "#154e7a",
                      marginLeft: "8rem",
                      fontWeight: "700",
                      paddingTop: "10px",
                      position: "relative",
                    }}
                  >
                    innovative solutions
                  </h2>
                  <Row>
                    <div className="col-md-6">
                      <div className="solution-card" key={index}>
                        <div
                          className="in-border"
                          style={{
                            alignContent: "center",
                            height: "90px",
                            width: "90px",
                            // padding: "5px",
                            // borderColor: "yellow",
                            border: "2px solid #E97730",
                            borderRadius: "50%",
                            // display: "table",
                            margin: "auto",
                            backgroundColor: "transparent",
                            marginTop: "-32%",
                            padding: "0",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              height: "80px",
                              width: "80px",
                              padding: "10px",
                              // borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              margin: "auto",
                              backgroundColor: "#E97730",
                            }}
                          >
                            <figure>
                              <img
                                src={"/images/windows-cloud.svg"}
                                alt={"/images/windows-cloud.svg"}
                              />
                            </figure>
                          </div>
                        </div>
                        <div className="content">
                          <h3 className="title">Deploy Virtual Machine</h3>
                          <p className="description">
                            Our Cloud VMs with dedicated server capabilities
                            provide unrivaled power and control. Enjoy superior
                            performance, scalability, and customization choices
                            that are tailored to your specific company
                            requirements.
                          </p>
                        </div>
                      </div>
                      <div className="solution-card" key={index}>
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
                              <img
                                src={"/images/clock-secure-white.svg"}
                                alt={"/images/clock-secure-white.svg"}
                                style={{ width: "38px", marginLeft: "9px" }}
                              />
                            </figure>
                          </div>
                        </div>
                        <div className="content">
                          <h3 className="title">Raw Infra Machine</h3>
                          <p className="description">
                            Raw machines provide unrivaled power and control.
                            Experience great performance, smooth scalability,
                            and customizable customization choices to properly
                            meet your company's needs.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="solution-card" key={index}>
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
                              <img
                                src={"/images/secure-01-white.svg"}
                                alt={"/images/secure-01-white.svg"}
                              />
                            </figure>
                          </div>
                        </div>
                        <div className="content">
                          <h3 className="title">Private Server Networking</h3>
                          <p className="description">
                            Private server networking improves performance,
                            dependability, and security by providing exclusive
                            resources and extensive connectivity options.
                            Experience greater control over data flow and
                            seamless connection with your corporate
                            infrastructure, resulting in reliable operations.
                          </p>
                        </div>
                      </div>
                      <div className="solution-card" key={index}>
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
                              <img
                                src={"/images/bulb-white.svg"}
                                alt={"/images/bulb-white.svg"}
                              />
                            </figure>
                          </div>
                        </div>
                        <div className="content">
                          <h3 className="title">
                            Transparent detailed Billing
                          </h3>
                          <p className="description">
                            Transparent, diligent billing for your servers
                            enables clarity and accuracy in cost management. Our
                            clear invoicing approach includes itemized
                            breakdowns, allowing you to conveniently track
                            spending and optimize resource allocation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>
              </Row>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSecondSec;
