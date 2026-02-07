import React, { useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";

const NotifyPopup = ({ show, handleClose, handleFilter }) => {
  const handleButtonClick = (value) => {
    handleFilter(value);
    handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "rgb(66, 66, 66)", borderWidth: "0" }}
      >
        {/* <Modal.Title>Apply Filter</Modal.Title> */}
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "rgb(66, 66, 66)" }}>
        <Card
          className="bg-default"
          style={{ borderWidth: "0px", backgroundColor: "transparent" }}
        >
          <Card.Body className="text-center">
            <Button
              variant="primary"
              className="catname_mobile"
              onClick={() => handleButtonClick("Albhabetic")}
              style={{
                fontSize: "14px",
                width: "30%",
                backgroundColor: "#58b7aa",
                borderWidth: "0px",
              }}
            >
              Albhabetic
            </Button>
          </Card.Body>
        </Card>
        <Card
          className="bg-default"
          style={{ borderWidth: "0px", backgroundColor: "transparent" }}
        >
          <Card.Body className="text-center">
            <Button
              variant="primary"
              className=" catname_mobile"
              onClick={() => handleButtonClick("Latest")}
              style={{
                fontSize: "14px",
                width: "30%",
                backgroundColor: "#58b7aa",
                borderWidth: "0px",
              }}
            >
              Latest
            </Button>
          </Card.Body>
        </Card>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default NotifyPopup;
