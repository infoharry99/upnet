import React, { useRef, useState } from "react";

import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

import "./HomeBanner.css";
import ThirdSection from "../common/ThirdSection";
const HomeThirdSec = (props) => {
  const { isMobile } = props;

  const banner = [
    "inner-slider-01.svg",
    "inner-slider-02.svg",
    "inner-slider-03.svg",
    "inner-slider-01.svg",
  ];

  const thirdArr = [
    {
      title: "Designed for Developers",
      desc: "Experience seamless integration and deployment capabilities that are meant to improve your development process.",
      imageUrl: "inner-slider-01.svg",
    },
    {
      title: "Developed by Network Managers",
      desc: "Benefit from optimal performance, strong security measures, and smooth scalability that is adapted to demanding network situations.",
      imageUrl: "inner-slider-02.svg",
    },
    {
      title: "Graphical User Interface",
      desc: "Explore our user-friendly graphical interface, which is designed for easy server management. Simplify complex tasks with visual representations and reduced interfaces to improve usability.",
      imageUrl: "inner-slider-03.svg",
    },
    {
      title: "Automated usage Report",
      desc: "Your billing team will benefit with streamlined processes designed specifically for server administration. Our user-friendly software includes full reporting and automated invoicing, ensuring precise and efficient financial management.",
      imageUrl: "inner-slider-01.svg",
    },
  ];
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: isMobile ? "35rem" : "55rem",
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
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            style={{
              // marginTop: "6rem",
              backgroundColor: "transparent", //"#141414",
              // width: "80%",
              // height: "80%",
              // margin: "0 auto",
            }}
          >
            {thirdArr.map((item, idx) => (
              <Carousel.Item key={idx} onClick={() => console.log(item)}>
                <Link style={{ textDecoration: "none", color: "#EB4328" }}>
                  <ThirdSection data={item} isMobile={isMobile} />
                  <Carousel.Caption className="d-none d-lg-block"></Carousel.Caption>
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      ) : (
        <>
          <div style={{ paddingTop: "15rem", marginBottom: "10rem" }}>
            <Carousel
              activeIndex={index}
              onSelect={handleSelect}
              style={{
                paddingTop: "1rem",
                backgroundColor: "transparent", //"#141414",
                width: "80%",
                height: "80%",
                margin: "0 auto",
              }}
            >
              {thirdArr.map((item, idx) => (
                <Carousel.Item key={idx} onClick={() => console.log(item)}>
                  <Link style={{ textDecoration: "none", color: "#EB4328" }}>
                    <ThirdSection data={item} isMobile={isMobile} />
                    <Carousel.Caption className="d-none d-lg-block"></Carousel.Caption>
                  </Link>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeThirdSec;
