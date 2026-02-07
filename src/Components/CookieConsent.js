import React, { useState, useEffect } from "react";
import "./CookieConsent.css"; // Assuming you will style it in a separate CSS file
import { Row } from "react-bootstrap";

function isMobileDevice() {
  return window.matchMedia("(max-width: 1000px)").matches;
}

const CookieConsent = () => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  const [isVisible, setIsVisible] = useState(true);
  //const [isVisibleSetting, setVisibleSetting] = useState(false);

  const [preferences, setPreferences] = useState({
    performance: false,
    functional: false,
    targeting: false,
    social: false,
  });

  //   const handleAcceptAll = () => {
  //     // Add logic to handle cookie acceptance here
  //     setIsVisible(false);
  //   };

  const hideCookiesView = () => {
    setIsVisible(false);
    localStorage.setItem("hideCookies", JSON.stringify(isVisible));
  };

  useEffect(() => {
    if (localStorage.getItem("hideCookies") !== null) {
      if (!localStorage.setItem("hideCookies", JSON.stringify(isVisible))) {
        setIsVisible(false);
      }
    }

    function handleResize() {
      setIsMobile(isMobileDevice());
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.location.pathname]);

  // const handleToggle = (category) => {
  //   setPreferences({
  //     ...preferences,
  //     [category]: !preferences[category],
  //   });
  // };

  // const handleSettings = () => {
  //   setVisibleSetting(true);
  //   console.log("Settings clicked");
  // };

  // const handleAcceptAll = () => {
  //   setPreferences({
  //     performance: true,
  //     functional: true,
  //     targeting: true,
  //     social: true,
  //   });
  //   setIsVisible(false);
  // };

  // const handleRejectAll = () => {
  //   setPreferences({
  //     performance: false,
  //     functional: false,
  //     targeting: false,
  //     social: false,
  //   });
  //   setIsVisible(false);
  // };

  // const handleConfirmChoices = () => {
  //   // Save preferences
  //   setIsVisible(false);
  // };

  if (!isVisible) {
    return null;
  }

  return (
    // <div className="cookie-consent">
    //   <button
    //     className="cookie-consent__close"
    //     onClick={() => setIsVisible(false)}
    //   >
    //     &times;
    //   </button>
    //   <div className="cookie-consent__message">
    //     <p>
    //       We use cookies to enhance site navigation, analyze site usage and
    //       improve our marketing efforts.
    //     </p>
    //   </div>
    //   <div className="cookie-consent__actions">
    //     <button className="cookie-consent__button" onClick={handleSettings}>
    //       Settings
    //     </button>
    //     <button
    //       className="cookie-consent__button accept"
    //       onClick={handleAcceptAll}
    //     >
    //       Accept All
    //     </button>
    //   </div>
    // </div>

    <div>
      {/* {isVisibleSetting && (
        <div className="cookie-consent-modal">
          <div className="cookie-consent-header">
            <h2>Cookie Preferences</h2>
            <button
              className="close-button"
              onClick={() => setIsVisible(false)}
            >
              &times;
            </button>
          </div>
          <div className="cookie-consent-content">
            <p>
              When you visit any website, it may store or retrieve information
              on your browser, mostly in the form of cookies...
            </p>
            <button className="allow-all-button" onClick={handleAcceptAll}>
              Allow All
            </button>
            <h3>Manage Consent Preferences</h3>
            <div className="cookie-consent-category">
              <label>
                <input type="checkbox" disabled checked />
                Strictly Necessary Cookies (Always Active)
              </label>
            </div>
            <div className="cookie-consent-category">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.performance}
                  onChange={() => handleToggle("performance")}
                />
                Performance Cookies
              </label>
            </div>
            <div className="cookie-consent-category">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={() => handleToggle("functional")}
                />
                Functional Cookies
              </label>
            </div>
            <div className="cookie-consent-category">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.targeting}
                  onChange={() => handleToggle("targeting")}
                />
                Targeting Cookies
              </label>
            </div>
            <div className="cookie-consent-category">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.social}
                  onChange={() => handleToggle("social")}
                />
                Social Media Cookies
              </label>
            </div>
          </div>
          <div className="cookie-consent-footer">
            <button className="reject-all-button" onClick={handleRejectAll}>
              Reject All
            </button>
            <button
              className="confirm-choices-button"
              onClick={handleConfirmChoices}
            >
              Confirm My Choices
            </button>
          </div>
        </div>
      )} */}

      {isVisible && (
        <div
          className="cookie-footer"
          style={{
            //position: "fixed",
            // minHeight: "20rem",
            //marginLeft: "20px",
            alignContent: isMobile ? "center" : "",
            //left: isMobile ? "0" : "",
            width: isMobile ? "25rem" : "30rem",
            // height: "5px",
            // left: isMobile ? "5px" : "",
            // top: isMobile ? "70%" : "78%",
            // right: isMobile ? "" : "-44%",
            bottom: isMobile ? "2%" : "",
          }}
        >
          <div className="register-main see-full" style={{ marginTop: "0rem" }}>
            <div className="bg-img">
              <img src="/images/blue-box-bg.svg" alt="" />
            </div>
            <form
              className="see-full"
              style={{
                marginTop: "-20px",
                // marginLeft: isMobile ? "" : "15px",
              }}
            >
              <button
                //className="cookie-consent__close"
                style={{
                  position: "fixed",
                  color: "white",
                  backgroundColor: "#e97730",
                  width: "28px",
                  right: isMobile ? "15px" : "65px",
                  height: "27px",
                  borderRadius: "5px",
                  //padding: "0px",
                  //   marginLeft: "auto",
                  //marginRight: "10px",
                  //marginBottom: "-40px",
                }}
                onClick={() => hideCookiesView()}
              >
                &times;
              </button>
              <span style={{ fontSize: "20px", marginRight: "15px" }}>
                This Site uses cookies
              </span>
              <span style={{ fontSize: "15px", marginRight: "15px" }}>
                We use cookies to enhance site navigation, analyze site usage
                and improve our marketing efforts.
              </span>

              <button
                className="cookie-consent__button"
                style={{ color: "black", marginTop: isMobile ? "20px" : "" }}
                onClick={() => hideCookiesView()}
              >
                Accept
              </button>
              <button
                className="cookie-consent__button1 opacity-75"
                style={{
                  right: "10%",
                  marginTop: isMobile ? "" : "35px",
                  color: "black",
                  height: isMobile ? "40px" : "",
                  marginLeft: isMobile ? "80px" : "",
                  marginBottom: isMobile ? "0px" : "",
                }}
                onClick={() => hideCookiesView()}
              >
                Only Necessary
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
