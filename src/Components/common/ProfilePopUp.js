import React, { useEffect, useRef, useState } from "react";
import "./ProfilePopUp.css"; // Make sure to create this CSS file
import { FaLock, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import { currencyReturn } from "../../Api";

const ProfilePopUp = (props) => {
  const { logout, smuser, isLoginByParentUser } = useAuth();
  const { type, wallet, upnetcredits, isVisible, onClose } = props;
  const { appCurrency } = useAuth();

  const modalRef = useRef();

  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  const [isMobile, setIsMobile] = useState(isMobileDevice());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Call the close function
      }
    };

    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener on component unmount or if isVisible changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose, isMobile]);

  if (!isVisible) return null; // Hide the modal if not visible

  const logoutFunc = () => {
    try {
      logout();
      // window.location.href = "/";
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  };

  return (
    <div
      className="main-view-popup"
      ref={modalRef}
      style={{
        backgroundImage: "url('/admin/images/admin/02-vm/gray-box-bg.png')",
        height:
          type !== "profile"
            ? "15rem"
            : isLoginByParentUser == 1
            ? "22.5rem"
            : "20rem",
      }}
    >
      {type === "profile" ? (
        <>
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              marginTop: "10px",
            }}
          >
            <div
              className=""
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                // padding: "10px",
                outline: "2px solid #035189",
                border: "5px solid white",
              }}
            >
              <div className="">
                {smuser && smuser != null && (
                  <img
                    // src={`https://console.upnetcloud.com/${
                    //   smuser && smuser.image
                    // }`}
                    src={`${smuser && smuser.image}`}
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      outline: "2px solid #035189",
                      border: "5px solid white",
                    }}
                  />
                )}
              </div>
              <div className="profile-badge">{smuser && smuser.email}</div>
            </div>
          </div>

          <ul style={{ marginLeft: "25px" }}>
            <li>
              <a href="/edit-profile" className="profile-menuitem">
                <FaUser
                  style={{ width: "20px", height: "20px", paddingRight: "5px" }}
                />
                Profile
              </a>
            </li>
            <li>
              <a href="/change-password" className="profile-menuitem">
                <FaLock
                  style={{ width: "20px", height: "20px", paddingRight: "5px" }}
                />
                Change Password
              </a>
            </li>
            {isLoginByParentUser == 1 && (
              <li>
                <a href="/settings" className="profile-menuitem">
                  <FaUser
                    style={{
                      width: "20px",
                      height: "20px",
                      paddingRight: "5px",
                    }}
                  />
                  Settings
                </a>
              </li>
            )}
            <li onClick={logoutFunc}>
              <a className="profile-menuitem">
                <FaSignOutAlt
                  style={{ width: "30px", height: "30px", paddingRight: "5px" }}
                />{" "}
                Logout
              </a>
            </li>
          </ul>
        </>
      ) : (
        <div>
          <div>
            <a href="/wallet">
              <h5
                style={{
                  textAlign: "center",
                  padding: "18px",
                  color: "#154e7a",
                }}
              >
                Total Balance <br />({wallet})
              </h5>
            </a>
            {upnetcredits && upnetcredits > 0 && (
              <a href="/wallet">
                <h5
                  style={{
                    textAlign: "center",
                    padding: "18px",
                    color: "#154e7a",
                  }}
                >
                  UPNETCredits <br />(
                  {currencyReturn({
                    price: upnetcredits,
                    symbol: smuser.prefer_currency,
                    rates: appCurrency,
                  })}
                  )
                </h5>
              </a>
            )}
          </div>
          <ul>
            <li style={{ marginTop: "10px", marginLeft: "25px" }}>
              <a
                href="/wallet"
                className="profile-menuitem"
                style={{ fontSize: "21px" }}
              >
                <FaLock
                  style={{ width: "20px", height: "20px", paddingRight: "5px" }}
                />
                My Wallet
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePopUp;
