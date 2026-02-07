import { Col, Overlay, Row } from "react-bootstrap";
import { useRef, useState } from "react";

function ZoomImage({ src, alt }) {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <Overlay
      show={show}
      target={target.current}
      placement="top"
      onEnter={() => setShow(true)}
      onExited={() => setShow(false)}
    >
      <Overlay.Content>
        <img
          src={src}
          alt={alt}
          style={{ transform: show ? "scale(1.2)" : "scale(1)" }}
        />
      </Overlay.Content>
    </Overlay>
  );
}

export default ZoomImage;
