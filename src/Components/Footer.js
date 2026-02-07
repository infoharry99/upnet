import React, { useEffect, useState } from "react";
import "./Footer.css"; // Import custom CSS for footer styling
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FaX } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import CookieConsent from "../Components/CookieConsent";

function isMobileDevice() {
  return window.matchMedia("(max-width: 1000px)").matches;
}

const Footer = () => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [activeKey, setActiveKey] = useState("/");
  const [isLogged, setIsLogged] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [showMachinePopUp, setShowMachinePopUp] = useState(false);
  const [showBar, setShowBar] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { smuser } = useAuth();

  useEffect(() => {
    smuser ? setIsLogged(true) : setIsLogged(false);
    function handleResize() {
      setIsMobile(isMobileDevice());
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.location.pathname, activeKey]);

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveKey("/");
    } else if (location.pathname === "/browse") {
      setActiveKey("/browse");
    } else if (location.pathname === "/upcoming") {
      setActiveKey("/upcoming");
    } else if (location.pathname === "/subscribe") {
      setActiveKey("/subscribe");
    }
  }, [location.pathname, activeKey]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isLogged && isMobile ? (
        <>
          {showBar ? (
            <>
              <div className="header-bottom-bar">
                <div onClick={() => setShowBar(!showBar)}>
                  <img
                    src="/images/footer-icon.svg"
                    alt=""
                    style={{
                      width: "25px",
                      height: "25px",
                      marginRight: "10px",
                      // transform: rotateX(180deg);
                    }}
                  />
                </div>
                <div onClick={() => setShowMachinePopUp(!showMachinePopUp)}>
                  <img
                    src="/admin/images/admin/menu/vm-white.svg"
                    alt=""
                    style={{
                      width: "35px",
                      height: "35px",
                      marginRight: "10px",
                    }}
                  />
                </div>
                <div onClick={() => navigate("/bill")}>
                  <img
                    src="/admin/images/admin/menu/price-tag.svg"
                    alt=""
                    style={{
                      width: "35px",
                      height: "35px",
                      marginRight: "10px",
                    }}
                  />
                </div>
                <div onClick={() => navigate("/create-ticket")}>
                  <img
                    src="/admin/images/admin/menu/online_support.svg"
                    alt=""
                    style={{
                      width: "35px",
                      height: "35px",
                      marginRight: "10px",
                    }}
                  />
                </div>
                <div onClick={() => navigate("/vm/monitor")}>
                  <img
                    src="/admin/images/admin/menu/monitoring.svg"
                    alt=""
                    style={{
                      width: "35px",
                      height: "35px",
                      marginRight: "10px",
                    }}
                  />
                </div>

                <div className="scroll-to-top" onClick={scrollToTop}></div>
              </div>
              {showMachinePopUp && (
                <div
                  style={{
                    top: "18%",
                    left: "5%",
                    position: "absolute",
                    zIndex: "99999999999",
                    width: "90%",
                    backdropFilter: "blur(25px)",
                    height: "45%",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
                    borderRadius: "12px", // Assuming you want rounded corners
                    border: "2px solid #e97730",
                  }}
                >
                  <button
                    style={{
                      zIndex: "9",
                      position: "absolute",
                      backgroundColor: "transparent",
                      border: "none",
                      right: "5px",
                      top: "2%",
                    }}
                    onClick={() => setShowMachinePopUp(!showMachinePopUp)}
                  >
                    <FaX
                      style={{
                        marginBottom: "2px",
                        color: "#e97730",
                        display: "inline-block",
                        fontSize: "19px",
                      }}
                    />
                  </button>{" "}
                  <div
                    style={{
                      position: "relative",
                      /* margin-left: 5%; */
                      marginTop: "23%",
                      display: "flex",
                      flexFlow: "row",
                      /* gap: 3%, */
                      flexDirection: "column",
                      alignItems: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    <div>
                      <figure
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "rgb(233, 119, 48)",
                          borderRadius: "50%",
                          objectFit: "cover",
                          margin: "auto",
                          padding: "20px",
                          outline: "3px solid rgb(233, 119, 48)",
                          border: "5px solid white",
                        }}
                      >
                        <img
                          src={"/images/admin/01-home/cpu.svg"}
                          alt={""}
                          style={{
                            marginLeft: "-5px",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      </figure>

                      <button
                        style={{
                          width: "10rem",
                          marginTop: "2px",
                          zIndex: "9",
                          position: "relative",
                          // marginTop: "15%",
                          // left: "20%",
                          fontWeight: "700",
                          color: "white",
                          height: "55px",
                          // width: "10rem",
                          backgroundColor: "#154e7a",
                          outline: "4px solid #e97730",
                          border: "4px solid #ffff",
                          borderColor: "white",
                          borderRadius: "30px",
                        }}
                        onClick={() => {
                          setShowMachinePopUp(false);
                          navigate("/vm-machine");
                        }}
                      >
                        {" "}
                        My Machine
                        <div
                          style={{
                            zIndex: "10",
                            top: "-7px",
                            left: "70px",
                            position: "absolute",
                            width: "20px",
                            height: "7px",
                            backgroundColor: "#fff",
                          }}
                        ></div>
                      </button>
                    </div>
                    <div style={{ marginTop: "50px" }}>
                      {" "}
                      <figure
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "rgb(233, 119, 48)",
                          borderRadius: "50%",
                          objectFit: "cover",
                          margin: "auto",
                          padding: "20px",
                          outline: "3px solid rgb(233, 119, 48)",
                          border: "5px solid white",
                        }}
                      >
                        <img
                          src={"/admin/images/admin/menu/vm-white.png"}
                          alt={""}
                          style={{
                            marginLeft: "-5px",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      </figure>{" "}
                      <button
                        style={{
                          width: "10rem",
                          marginTop: "2px",
                          zIndex: "9",
                          position: "relative",
                          fontWeight: "700",
                          color: "white",
                          height: "55px",
                          backgroundColor: "#154e7a",
                          outline: "4px solid #e97730",
                          border: "4px solid #ffff",
                          borderColor: "white",
                          borderRadius: "30px",
                        }}
                        onClick={() => {
                          setShowMachinePopUp(false);
                          navigate("/vm/create");
                        }}
                      >
                        Create Machine
                        <div
                          style={{
                            zIndex: "10",
                            top: "-7px",
                            left: "70px",
                            position: "absolute",
                            width: "20px",
                            height: "7px",
                            backgroundColor: "#fff",
                          }}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div onClick={() => setShowBar(!showBar)}>
                <img
                  className="footer-hidden-button"
                  src="/images/footer-icon.svg"
                  alt=""
                />
              </div>
            </>
          )}
        </>
      ) : null}
      <>
        {!isLogged && !isMobile ? (
          <>
            <div className="foot-main">
              <div></div>
              <div className="foot-icon" onClick={() => setShowFooter(true)}>
                <figure>
                  <a>
                    <img
                      src="/images/footer-icon.png"
                      alt=""
                      style={{
                        transform: "rotateY(180deg)",
                        marginTop: "7px",
                        marginLeft: "5px",
                      }}
                    />
                  </a>
                </figure>
              </div>
              {showFooter && (
                <div className="foot-click" style={{ display: "block" }}>
                  <div className="foot-body">
                    <div className="foot-items see-7 see-ltb-7 see-tb-7 see-sm-12 see-xsm-12">
                      {/* <div style={{ display: "flex", marginLeft: "30px" }}>
                        {[
                          "Standard Servers",
                          "CPU Intensive Servers",
                          "RAM Intensive Servers",
                          "Pricing",
                          // "About us",
                          //"Why us",
                          "Privacy Policy",
                          "Terms and Condition",
                          // "Support",
                        ].map((item, idx) => (
                          <a
                            href={
                              idx === 0
                                ? "/product-details-ubantu"
                                : idx === 1
                                ? "/product-details-ubantu"
                                : idx === 2
                                ? "/product-details-ubantu"
                                : idx === 3
                                ? "/pricing"
                                : idx === 4
                                ? "/privacy-policy"
                                : "/termsConditions"
                            }
                            style={{ marginLeft: "8px", color: "white" }}
                          >
                            {idx === 0 ? item : `| ${item}`}
                          </a>
                        ))}
                      </div> */}
                      <div style={{ display: "flex", marginLeft: "30px" }}>
                        {[
                          {
                            label: "Standard Servers",
                            path: "/product-details-ubantu",
                            state: { tab: 1 },
                          },
                          {
                            label: "CPU Intensive Servers",
                            path: "/product-details-ubantu",
                            state: { tab: 2 },
                          },
                          {
                            label: "RAM Intensive Servers",
                            path: "/product-details-ubantu",
                            state: { tab: 3 },
                          },
                          { label: "Pricing", path: "/pricing" },
                          { label: "Privacy Policy", path: "/privacy-policy" },
                          {
                            label: "Terms and Condition",
                            path: "/termsConditions",
                          },
                        ].map((item, idx) => (
                          <Link
                            key={idx}
                            to={{
                              pathname: item.path,
                              state: item.state,
                            }}
                            style={{ marginLeft: "8px", color: "white" }}
                          >
                            {idx === 0 ? item.label : `| ${item.label}`}
                          </Link>
                        ))}
                      </div>

                      {/* Second Line */}
                      {/* <div
                        style={{
                          display: "flex",
                          marginLeft: "30px",
                          marginTop: "10px",
                        }}
                      >
                        {[
                          "Pricing",
                          // "About us",
                          //"Why us",
                          "Privacy Policy",
                          "Terms and Condition",
                          "Support",
                        ].map((item, idx) => (
                          <a
                            href={
                              idx === 0
                                ? "/pricing"
                                : idx === 1
                                ? "/privacy-policy"
                                : idx === 2
                                ? "/termsConditions"
                                : "/login"
                            }
                            style={{ marginLeft: "8px", color: "white" }}
                          >
                            {idx === 0 ? item : `| ${item}`}
                          </a>
                        ))}
                      </div> */}
                    </div>
                    <div className="close" onClick={() => setShowFooter(false)}>
                      <a href="#">
                        <img src="/images/close-button.png" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="foot-btm">
                    <span> Copyright 2024 UpNetCloud ( version: 0.1.0 ) </span>
                    <div className="social-media">
                      <ul className="see-full-footer">
                        <li>
                          <a href="#">
                            <img src="/images/Instagram_icon.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="/images/Facebook-icon.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="/images/Youtube-icon.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <img src="/images/Twitter-icon.png" alt="" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {
              <CookieConsent
              // location="bottom"
              // buttonText="OK!"
              // cookieName="myCookieConsent"
              // style={{
              //   background: "#e97730",
              //   zIndex: "1999",
              //   bottom: "0px",
              //   paddingRight: "500px",
              // }}
              // buttonStyle={{
              //   background: "white",
              //   color: "#00497D",
              //   fontSize: "18px",
              //   fontWeight: "500",
              //   borderRadius: "8px",
              //   width: "120px",
              // }}
              // expires={150}
              >
                {/* This website uses cookies to ensure you get the best experience
                on our website. */}
                {/* <a
                href="/CookiePolicy"
                style={{ color: "black", textDecoration: "underline" }}
              >
                Learn More
              </a> */}
              </CookieConsent>
            }
            {/* <div className="quick-connect">
              <div className="call">
                <a href="https://t.me/upnetclouddesk">
                  <FontAwesomeIcon icon={faTelegram} />
                </a>
              </div>
              {/* <div className="whatsapp">
                <a
                  href="https://wa.link/1rfd12"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </div> }
            </div> */}
          </>
        ) : (
          <>
            {isLogged && !isMobile ? (
              <>
                <div className="foot-main">
                  <div></div>
                  <div
                    className="foot-icon"
                    onClick={() => setShowFooter(true)}
                  >
                    <figure>
                      <a>
                        <img
                          src="/images/footer-icon.png"
                          alt=""
                          style={{
                            transform: "rotateY(180deg)",
                            marginTop: "7px",
                            marginLeft: "5px",
                          }}
                        />
                      </a>
                    </figure>
                  </div>
                  {showFooter && (
                    <div className="foot-click" style={{ display: "block" }}>
                      <div className="foot-body">
                        <div className="foot-items see-7 see-ltb-7 see-tb-7 see-sm-12 see-xsm-12">
                          {/* <span style={{ marginLeft: "-20px" }}>
                            Products:{" "}
                          </span> */}

                          {/* First Line */}
                          <div style={{ display: "flex", marginLeft: "30px" }}>
                            {[
                              "Standard Servers",
                              "CPU Intensive Servers",
                              "RAM Intensive Servers",
                              "Privacy Policy",
                              "Terms of Services",
                              "Support",
                            ].map((item, idx) => (
                              <a
                                href={
                                  idx === 0
                                    ? "/vm/create"
                                    : idx === 1
                                    ? "/vm/create"
                                    : idx === 2
                                    ? "/vm/create"
                                    : idx === 3
                                    ? "/privacy-policy"
                                    : idx === 4
                                    ? "/termsConditions"
                                    : "/create-ticket"
                                }
                                style={{ marginLeft: "8px", color: "white" }}
                              >
                                {idx === 0 ? item : `| ${item}`}
                              </a>
                            ))}
                          </div>

                          {/* Second Line */}

                          {/* <div
                            style={{
                              display: "flex",
                              marginLeft: "30px",
                              marginTop: "10px",
                            }}
                          >
                            {[
                              // "Pricing",
                              // "About us",
                              "Privacy Policy",
                              "Terms of Services",
                              "Support",
                            ].map((item, idx) => (
                              <a
                                href={
                                  idx === 0
                                    ? "/privacy-policy"
                                    : idx === 1
                                    ? "/termsConditions"
                                    : idx === 2
                                    ? "/create-ticket"
                                    : "/vm-machine"
                                }
                                style={{ marginLeft: "8px", color: "white" }}
                              >
                                {idx === 0 ? item : `| ${item}`}
                              </a>
                            ))}
                          </div> */}
                        </div>

                        <div
                          className="close"
                          onClick={() => setShowFooter(false)}
                        >
                          <a href="#">
                            <img src="/images/close-button.png" alt="" />
                          </a>
                        </div>
                      </div>
                      <div className="foot-btm">
                        <span>
                          {" "}
                          Copyright 2024 UpNetCloud ( version: 0.1.0 ){" "}
                        </span>
                        <div className="social-media">
                          <ul className="see-full-footer">
                            <li>
                              <a>
                                <img src="/images/Instagram_icon.png" alt="" />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img src="/images/Facebook-icon.png" alt="" />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img src="/images/Youtube-icon.png" alt="" />
                              </a>
                            </li>
                            <li>
                              <a>
                                <img src="/images/Twitter-icon.png" alt="" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </>
      <>
        {!isLogged && isMobile ? (
          <>
            <div
              style={{
                bottom: "0px",
                zIndex: "99",
                position: "fixed",
                backgroundColor: "#f8f8f800",
                width: "100%",
                height: "4rem",
                display: "flex",
              }}
            >
              <div
                className="log-in"
                onClick={() => navigate("/signUp")}
                style={{ marginLeft: "70px" }}
              >
                <a className="media-link">
                  <div className="media" style={{ marginBottom: "10px" }}>
                    <img
                      className="normal"
                      src="/images/more-info-btn-bg.svg"
                      alt=""
                      style={{ width: "7rem" }}
                    />
                    <img
                      className="hover-img"
                      src="/images/more-info-btn-bg.svg"
                      alt=""
                      style={{ width: "7rem" }}
                    />
                    <span className="login-text">Sign Up</span>
                  </div>
                </a>
              </div>
              <div className="log-in" onClick={() => navigate("/login")}>
                <a className="media-link">
                  <div className="media" style={{ marginBottom: "10px" }}>
                    <img
                      className="normal"
                      src="/images/more-info-btn-bg.svg"
                      alt=""
                      style={{ width: "7rem" }}
                    />
                    <img
                      className="hover-img"
                      src="/images/more-info-btn-bg.svg"
                      alt=""
                      style={{ width: "7rem" }}
                    />
                    <span className="login-text">Log in</span>
                  </div>
                </a>
              </div>
            </div>
            <div className="foot-main">
              <div
                className="foot-icon-mobile-view"
                onClick={() => setShowFooter(true)}
              >
                <figure>
                  <a>
                    <img
                      src="/images/footer-icon.png"
                      alt=""
                      style={{
                        marginTop: "8px",
                        marginLeft: "8px",
                        width: "19px",
                      }}
                    />
                  </a>
                </figure>
              </div>
              {showFooter && (
                <div className="foot-click" style={{ display: "block" }}>
                  <div className="foot-body">
                    <div className="foot-items see-7 see-ltb-7 see-tb-7 see-sm-12 see-xsm-12">
                      {<span style={{ marginLeft: "-50px" }}>Products: </span>}
                      <div style={{ display: "flex-wrap", marginLeft: "0px" }}>
                        {[
                          "standard servers",
                          "CPU intensive VMs",
                          "RAM intensive VMs",
                        ].map((item, idx) => (
                          <a
                            href="/product-details-ubantu"
                            style={{
                              color: "white",
                              // width: "120px",
                            }}
                          >
                            {idx === 0 ? item : ` | ${item}`}
                          </a>
                        ))}
                      </div>

                      {/* Second Line */}
                      <div
                        style={{
                          display: "flex-wrap",
                          marginLeft: "0px",
                          marginTop: "10px",
                        }}
                      >
                        {[
                          "Pricing",
                          // "About us",
                          //"Why us",
                          "Privacy Policy",
                          "Terms and Condition",
                          "Support",
                        ].map((item, idx) => (
                          <a
                            href={
                              idx === 0
                                ? "/pricing"
                                : idx === 1
                                ? "/privacy-policy"
                                : idx === 2
                                ? "/termsConditions"
                                : "/login"
                            }
                            style={{ marginLeft: "0px", color: "white" }}
                          >
                            {idx === 0 ? item : ` | ${item}`}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="close" onClick={() => setShowFooter(false)}>
                      <a href="#">
                        <img src="/images/close-button.png" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="foot-btm">
                    <span> Copyright 2024 UpNetCloud ( version: 0.1.0 ) </span>
                    <div className="social-media">
                      <ul className="see-full-footer">
                        <li>
                          <a href="">
                            <img src="/images/Instagram_icon.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="">
                            <img src="/images/Facebook-icon.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="">
                            <img src="/images/Youtube-icon.png" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href="">
                            <img src="/images/Twitter-icon.png" alt="" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* <CookieConsent
              location="bottom"
              buttonText="OK!"
              cookieName="myCookieConsent"
              style={{
                background: "#e97730",
                zIndex: "1999",
                marginBottom: "50px",
                flexWrap: "none",
              }}
              buttonStyle={{
                background: "white",
                color: "#00497D",
                fontSize: "18px",
                fontWeight: "500",
                borderRadius: "8px",
              }}
              expires={150}
            >
              This website uses cookies.
              {/* <a
                href="/CookiePolicy"
                style={{ color: "black", textDecoration: "underline" }}
              >
                Learn More
              </a> }
            </CookieConsent> */}

            <CookieConsent />
            {/* <div className="quick-connect">
              <div className="call">
                <a href="https://t.me/upnetclouddesk">
                  <FontAwesomeIcon icon={faTelegram} />
                </a>
              </div>
              {/* <div className="whatsapp">
                <a
                  href="https://wa.link/1rfd12"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </div>}
            </div> */}
          </>
        ) : (
          <></>
        )}
      </>
    </>
  );
};

export default Footer;
