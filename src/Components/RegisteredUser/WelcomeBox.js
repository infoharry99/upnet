import React, { useState } from "react";
import "./WelcomeBox.css"; // Make sure to create this CSS file
import { FaLock, FaSignOutAlt, FaUser } from "react-icons/fa";

const WelcomeBox = () => {
  //   const { logout, smuser } = useAuth();

  return (
    <div
      className="main-view-popup"
      style={{
        backgroundImage: "url('/admin/images/admin/02-vm/gray-box-bg.svg')",
      }}
    >
      {type === "profile" ? (
        <>
          <div className="profile-image-container">
            <div className="profile-image">
              <img
                src="/uploads/0056fdd8093f97cca7b3b2292df3e0d9.png"
                style={{ width: "90%", height: "90%" }}
              />
            </div>
            <div className="profile-badge">{smuser.email}</div>
          </div>

          <ul>
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
            <h5
              style={{
                textAlign: "center",
                padding: "18px",
                color: "#154e7a",
              }}
            >
              Total Balance ( £ 4406.36)
            </h5>
          </div>
          <ul>
            <li>
              <a href="/change-password" className="profile-menuitem">
                <FaLock
                  style={{ width: "20px", height: "20px", paddingRight: "5px" }}
                />
                My Machine
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WelcomeBox;