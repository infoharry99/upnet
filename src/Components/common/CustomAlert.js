import React, { useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomAlert = ({ variant, message }) => {
  const [showAlert, setShowAlert] = useState(false);

  const showAlertFunction = () => {
    setShowAlert(true);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Button onClick={showAlertFunction}>Show Alert</Button>
          <Alert show={showAlert} variant={variant}>
            {message}
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomAlert;
