import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import instance from "../../Api";
import { useAuth } from "../../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const InvoicePage = () => {
  const { smuser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const billData = location.state ? location.state.billData : null;
  const [htmlContent, setHtmlContent] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const htmlContentRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // console.log(billData);
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileDevice());
    }
    window.addEventListener("resize", handleResize);

    const fetchHtmlContent = async () => {
      setLoading(true);
      try {
        const payload = {
          user_id: smuser.id,
          id: billData.id,
        };
        const response = await instance.post("/invoiceview", payload);
        console.log(response.data, "response.data");
        setHtmlContent(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching HTML content:", error);
      }
    };
    if (billData === null) {
      navigate(-1);
    } else {
      fetchHtmlContent();
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const generatePdf = async () => {
    if (htmlContentRef.current) {
      const canvas = await html2canvas(htmlContentRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      downloadPdf(pdfUrl);
    }
  };

  // const generatePdf = async () => {
  //   if (htmlContentRef.current) {
  //     try {
  //       // Ensure all images are loaded before capturing the canvas
  //       const images = htmlContentRef.current.getElementsByTagName("img");
  //       await Promise.all(
  //         Array.from(images).map((img) => {
  //           if (img.complete) return Promise.resolve();
  //           return new Promise((resolve, reject) => {
  //             img.onload = resolve;
  //             img.onerror = reject;
  //           });
  //         })
  //       );

  //       const canvas = await html2canvas(htmlContentRef.current);
  //       const imgData = canvas.toDataURL("image/png");

  //       const pdf = new jsPDF("p", "mm", "a4");
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //       const pdfBlob = pdf.output("blob");
  //       const pdfUrl = URL.createObjectURL(pdfBlob);
  //       setPdfUrl(pdfUrl);
  //       downloadPdf(pdfUrl);
  //     } catch (error) {
  //       console.error("Error generating PDF:", error);
  //     }
  //   }
  // };

  const downloadPdf = (pdfUrl) => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download =
        billData.orderid !== null
          ? `${billData.orderid}_invoice.pdf`
          : "file.pdf";
      link.click();
    }
  };

  const printPdf = async () => {
    if (htmlContentRef.current) {
      const canvas = await html2canvas(htmlContentRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    // console.log(pdfUrl, "pdfUrl");
  };

  return (
    <>
      <div
        className="heading-dotted-support"
        style={{
          marginTop: isMobile ? "" : "3rem",
          marginLeft: isMobile ? "5%" : "15%",
        }}
      >
        PDF Preview <span></span>
      </div>

      {/* Buttons for Download and Print */}
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "flex-start" : "flex-end",
          margin: isMobile ? "15px" : "0 15% 0px 0",
        }}
      >
        <button
          className="top-buttons-creact-machine"
          onClick={generatePdf}
          style={{ marginRight: "15px" }}
        >
          Download
        </button>
        <button className="top-buttons-creact-machine" onClick={printPdf}>
          Print
        </button>
      </div>

      {/* PDF Preview Content */}
      <div
        style={{
          marginLeft: isMobile ? "5%" : "15%",
          marginRight: isMobile ? "5%" : "15%",
          // padding: "10px",
          paddingLeft: isMobile ? "0.5rem" : "20rem",
          border: "1px solid #ddd", // Optional border for clarity
          borderRadius: "8px", // Rounded corners for a cleaner look
          backgroundColor: "#fff", // White background
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          overflow: "auto", // Handle overflow
          maxHeight: "90vh", // Set a maximum height for better UX
          backgroundColor: "#f3f3f3",
        }}
      >
        {htmlContent && (
          <div
            ref={htmlContentRef}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>

      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
    </>
  );
};

export default InvoicePage;
