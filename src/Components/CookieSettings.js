import React, { useState } from "react";
import "./CookieSettings.css";

const CookieSettings = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [preferences, setPreferences] = useState({
    performance: false,
    functional: false,
    targeting: false,
    social: false,
  });

  const handleToggle = (category) => {
    setPreferences({
      ...preferences,
      [category]: !preferences[category],
    });
  };

  const handleAcceptAll = () => {
    setPreferences({
      performance: true,
      functional: true,
      targeting: true,
      social: true,
    });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    setPreferences({
      performance: false,
      functional: false,
      targeting: false,
      social: false,
    });
    setIsVisible(false);
  };

  const handleConfirmChoices = () => {
    // Save preferences
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="cookie-consent-modal">
        <div className="cookie-consent-header">
          <h2>Cookie Preferences</h2>
          <button className="close-button" onClick={() => setIsVisible(false)}>
            &times;
          </button>
        </div>
        <div className="cookie-consent-content">
          <p>
            When you visit any website, it may store or retrieve information on
            your browser, mostly in the form of cookies...
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
    </>
  );
};

export default CookieSettings;
