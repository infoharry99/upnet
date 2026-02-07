import React, { useRef } from "react";
import "./CommonListing.css";
import { Container, Row, Col, Button, Card, CardFooter } from "react-bootstrap";
import { useState } from "react";

const CommonListing = ({ imageUrls, handleOpenVideo }) => {
  const listRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <Container>
      <Row>
        <Col xs={12} className="d-flex justify-content-end">
          <Button
            // variant="dark"
            className="iconbtns back-0 rounded-circle"
            onClick={scrollLeft}
          >
            &lt;
          </Button>
          &nbsp;
          <Button
            style={{ backgroundColor: "#EB4328", border: "none" }}
            // variant="dark"
            className="iconbtns back-0 rounded-circle"
            onClick={scrollRight}
          >
            &gt;
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={10} className="movie-list-container">
          <div
            ref={listRef}
            className="movie-list"
            style={{ marginLeft: "-25px" }}
          >
            {imageUrls.map((imageUrl, index) => (
              <>
                <Card
                  key={index}
                  className={`movie-item ${
                    hoveredCard === index ? "zoomed-card" : ""
                  }`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  style={{ backgroundColor: "#14141400", position: "relative" }}
                  onClick={() => handleOpenVideo(imageUrl)}
                >
                  <Card.Img variant="top" src={imageUrl.mobile_image} />
                  <CardFooter className="text-white">
                    {imageUrl.ep_title}
                  </CardFooter>
                  {/* <p
                  className="text-white"
                  style={{ position: "absolute", bottom: "0px", right: "10px" }}
                >
                  {imageUrl.ep_title}
                </p> */}
                </Card>
              </>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CommonListing;
// https://media1.olaple.com/images/videos/1676139537photoshoot%20150kb%20%20without%20logo%20main%20title%20hrz.jpg
