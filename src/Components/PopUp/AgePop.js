import React, { useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";

const AgePop = ({ show, handleClose, handleFilter }) => {
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
        <Modal.Title style={{ color: "white" }}>
          This is A rated Movie Press Yes to continue
        </Modal.Title>
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
              onClick={() => handleButtonClick("yes")}
              style={{
                fontSize: "14px",
                width: "30%",
                backgroundColor: "#58b7aa",
                borderWidth: "0px",
              }}
            >
              Yes
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
              onClick={() => handleButtonClick("no")}
              style={{
                fontSize: "14px",
                width: "30%",
                backgroundColor: "#58b7aa",
                borderWidth: "0px",
              }}
            >
              No
            </Button>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default AgePop;
