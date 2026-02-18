import React, { useEffect, useState } from "react";
import "./Home.css";
import PageControl from "./PageControl";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import HomeBanner from "./HomeComponents/HomeBanner";
import HomeThirdSec from "./HomeComponents/HomeThirdSec";
import HomeSecondSec from "./HomeComponents/HomeSecondSec";
import HomeFourthSec from "./HomeComponents/HomeFourthSec";
import PWAInstallerPrompt from "react-pwa-installer-prompt";
import { RiArrowRightSLine, RiDownload2Fill } from "react-icons/ri";
import { Button, Modal, ModalHeader } from "react-bootstrap";

const Home = (props) => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [currentPage, setCurrentPage] = useState(1);
  const [showModelForInstall, setshowModelForInstall] = useState(true);
  const totalPages = 4;
  const scrollThreshold = 0.5; // Adjust as needed

  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const handleClose = () => {
    setshowModelForInstall(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const calculateScrollPosition = (page) => {
    return (page - 1) * window.innerHeight;
  };

  // Scroll to the calculated position
  const scrollToPage = (page) => {
    window.scrollTo({
      top: calculateScrollPosition(page),
      behavior: "smooth",
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToPage(page);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, totalPages]);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const pageHeight = window.innerHeight;
    const nextPage = Math.ceil(
      (scrollPosition + pageHeight * scrollThreshold) / pageHeight
    );
    if (nextPage >= 1 && nextPage <= totalPages && nextPage !== currentPage) {
      setCurrentPage(nextPage);
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          minHeight: "100%",
          position: "relative",
          backgroundImage: isMobile
            ? `url(./main-bg.jpg)`
            : `url(./main-bg.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "round",
          backgroundBlendMode: "overlay",
        }}
      >
        <PWAInstallerPrompt
          render={({ onClick }) => (
            <Modal
              show={showModelForInstall}
              onHide={handleClose}
              style={{ zIndex: "99999999999999", marginTop: "5rem" }}
            >
              <ModalHeader
                style={{
                  padding: "0",
                  backgroundColor: "white",
                  borderBottom: "none",
                }}
              >
                <Button
                  variant="secondary"
                  style={{
                    color: "white",
                    backgroundColor: "#e97730",
                    width: "30px",
                    height: "30px",
                    padding: "0px",
                    marginLeft: "auto",
                    marginRight: "10px",
                    marginBottom: "-40px",
                    zIndex: "9999",
                  }}
                  onClick={handleClose}
                >
                  x
                </Button>
              </ModalHeader>
              <Modal.Body
                style={{
                  backgroundImage: `url(./main-bg.jpg)`,
                  backgroundSize: "cover",
                  color: "white",
                  textAlign: "center",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  borderRadius: "10px",

                  backgroundColor: "black",
                }}
              >
                <RiDownload2Fill
                  className="moving"
                  style={{ height: "50px", fontSize: "28px", color: "#e97730" }}
                />
                <h6 style={{ color: "#EB4328" }}>
                  Install Upnet Cloud on your device!
                </h6>

                <Button
                  variant="secondary"
                  style={{
                    borderRadius: "20px",
                    color: "white",
                    background: "#3F7EFF",
                    outline: "2px solid #3F7EFF",
                    border: "2px solid #ffffff",
                  }}
                  onClick={onClick}
                >
                  INSTALL
                </Button>
              </Modal.Body>
            </Modal>
          )}
          callback={(data) => {

          }}
        />

        <div className="home-container">
          <div className="full-screen-section">
            <HomeBanner isMobile={isMobile} />
          </div>
          <div className="full-screen-section">
            <HomeSecondSec isMobile={isMobile} />
          </div>
          <div className="full-screen-section">
            <HomeThirdSec isMobile={isMobile} />
          </div>
          <div className="full-screen-section">
            <HomeFourthSec isMobile={isMobile} />
          </div>
        </div>

        {!isMobile && (
          <PageControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Home;
