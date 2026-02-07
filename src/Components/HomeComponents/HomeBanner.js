import React, { useRef, useState } from "react";
import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import "./HomeBanner.css";
import ComponentFirstSec from "../common/ComponentFirstSec";
const HomeBanner = (props) => {
  const { isMobile } = props;

  const banner = [
    "slider-image-03.png",
    "slider-image-04.png",
    "slider-image-05.png",
  ];

  const contentArr = [
    {
      imageurl: "slider-image-01.png",
      title: "Self Managed",
      subtitle: "Infra on",
      desc: "Users control all areas of infrastructure and software administration. This technique allows for better customization and control over resources and prices.",
    },
    {
      imageurl: "slider-image-02.png",
      title: "Server Security",
      subtitle: "Scanner on",
      desc: "software designed to detect, identify malicious software from Server and networks. It performs regular scans of files, applications, and system memory to detect signs of malware activity. Essential for maintaining Server hygiene by preventing infections and safeguarding sensitive data.",
    },
    {
      imageurl: "slider-image-03.png",
      title: "Customized Pricing",
      subtitle: "Module on",
      desc: "Customized server pricing enables organizations to pay according to their individual resource requirements and consumption patterns. It allows for the flexible scaling of resources such as CPU, storage, and bandwidth based on demand, hence improving cost efficiency. This approach is ideal for successful cost management techniques.",
    },
    {
      imageurl: "slider-image-04.png",
      title: "Tailored server",
      subtitle: "management on",
      desc: "It allows organizations to choose the level of assistance needed, from basic oversight to comprehensive management of servers and infrastructure. This approach ensures efficient resource allocation, minimizes downtime, and aligns IT operations closely with business goals, fostering scalability and performance optimization.",
    },
    // {
    //   imageurl: "slider-image-05.png",
    //   title: "",
    //   desc: "",
    // },
  ];
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div style={{ height: `${isMobile ? "" : "100vh"}` }}>
      {isMobile ? (
        <>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            style={{
              marginTop: "8rem",
              backgroundColor: "transparent", //"#141414",
              // width: "80%",
              // height: "80%",
              // margin: "0 auto",
            }}
          >
            {contentArr.map((item, idx) => (
              <Carousel.Item key={idx} onClick={() => console.log(item)}>
                <Link style={{ textDecoration: "none", color: "#EB4328" }}>
                  <ComponentFirstSec data={item} isMobile={isMobile} />
                  <Carousel.Caption className="d-none d-lg-block"></Carousel.Caption>
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      ) : (
        <div>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            style={{
              zIndex: "1",
              paddingTop: "1rem",
              backgroundColor: "transparent", //"#141414",
              width: "80%",
              height: "80%",
              margin: "0 auto",
            }}
          >
            {contentArr.map((item, idx) => (
              <Carousel.Item key={idx} onClick={() => console.log(item)}>
                <Link style={{ textDecoration: "none", color: "#EB4328" }}>
                  <ComponentFirstSec data={item} isMobile={isMobile} />
                  <Carousel.Caption className="d-none d-lg-block"></Carousel.Caption>
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default HomeBanner;
