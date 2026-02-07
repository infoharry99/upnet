import React, { useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import "./Terms&Conditions.css";
import instance, { decryptData } from "../Api";

const TermsConditions = (props) => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [htmlContent, setHtmlContent] = useState("");
  const [title, setTitle] = useState("");
  const htmlContentRef = useRef(null);

  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        const response = await instance.post("/pages");
        const dataRes = await decryptData(response.data);
        // console.log(dataRes.pages, "......PAGESSSS");
        // console.log(dataRes.pages[2].policy, "......PAGESSSS");
        setTitle(dataRes.pages[2].heading);
        setHtmlContent(dataRes.pages[2].policy);
      } catch (error) {
        console.error("Error fetching HTML content:", error);
      }
    };
    fetchHtmlContent();
  }, []);

  return (
    <div>
      {isMobile ? (
        <>
          <div
            class="term-posts"
            style={{
              marginTop: "5rem",
              marginLeft: "10px",
              textAlign: "justify",
              marginRight: "10px",
            }}
          >
            <h3>Terms of Services</h3>

            {htmlContent && (
              <div
                ref={htmlContentRef}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                  maxWidth: "100%", // Ensure it doesn't exceed the screen width
                  width: "120mm", // Set the desired width
                  padding: "10px", // Optional padding
                  boxSizing: "border-box", // Include padding and border in the element's total width and height
                  overflowWrap: "break-word", // Handle long words or URLs
                }}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <Row>
            <div className="col-md-1"></div>
            <div
              className="col-md-10"
              style={{ marginTop: "4rem", marginLeft: "18rem" }}
            >
              {/* {title && <h2>{title}</h2>} */}
              <div
                className="heading-dotted-bill"
                style={{
                  marginLeft: "-3rem",
                  marginBottom: "20px",
                  textTransform: "none",
                }}
              >
                Terms of Services
              </div>
              {htmlContent && (
                <div
                  ref={htmlContentRef}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  style={{ width: isMobile ? "120mm" : "95%", padding: "" }}
                />
              )}
            </div>
          </Row>
        </>
      )}
    </div>
  );
};

export default TermsConditions;