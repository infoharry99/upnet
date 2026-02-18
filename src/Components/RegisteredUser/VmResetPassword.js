import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Row } from "react-bootstrap";
import instance from "../../Api";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";

const VmResetPassword = ({ isMobile }) => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || password.length < 8) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Password must be at least 8 characters"}
          isMobile={isMobile}
        />
      ));
      return;
    }

    if (password !== confirmPassword) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Passwords do not match"}
          isMobile={isMobile}
        />
      ));
      return;
    }

    try {
      setLoading(true);

      const res = await instance.post("/reset-vm-password", {
        token,
        password,
      });

      if (res.data.success) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Password updated successfully"}
            isMobile={isMobile}
          />
        ));

        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={res.data.message}
            isMobile={isMobile}
          />
        ));
      }
    } catch (err) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Invalid or expired link"}
          isMobile={isMobile}
        />
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `url("/images/main-bg.jpg")`,
        backgroundSize: "cover",
        backgroundRepeat: "round",
      }}
    >
      <div className="apptoast-align">
        <Toaster position="bottom-right" />
      </div>

      <div
        className="heading-dotted-changepass"
        style={{ marginLeft: "16rem" }}
      >
        Reset VM Password <span></span>
      </div>

      <Row>
        <div className="col-md-4"></div>

        <div className="col-md-4">
          <div
            style={{
              backgroundImage: `url("/images/blue-box-bg.svg")`,
              backgroundSize: "cover",
              padding: "30px 25px",
              backgroundColor: "#07528b",
              borderRadius: "12px",
              marginTop: "8rem",
            }}
          >
            {/* New Password */}
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                border: "2px solid white",
                borderRadius: "25px",
                padding: "5px",
              }}
            >
              <input
                type={showPass ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  color: "white",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  flex: "1",
                  padding: "5px",
                }}
              />

              {showPass ? (
                <FaEyeSlash
                  onClick={() => setShowPass(false)}
                  style={{ color: "white", cursor: "pointer" }}
                />
              ) : (
                <FaEye
                  onClick={() => setShowPass(true)}
                  style={{ color: "white", cursor: "pointer" }}
                />
              )}
            </div>

            {/* Confirm Password */}
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                border: "2px solid white",
                borderRadius: "25px",
                padding: "5px",
              }}
            >
              <input
                type={showConfPass ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  color: "white",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  flex: "1",
                  padding: "5px",
                }}
              />

              {showConfPass ? (
                <FaEyeSlash
                  onClick={() => setShowConfPass(false)}
                  style={{ color: "white", cursor: "pointer" }}
                />
              ) : (
                <FaEye
                  onClick={() => setShowConfPass(true)}
                  style={{ color: "white", cursor: "pointer" }}
                />
              )}
            </div>

            {/* Submit Button */}
            <div
              className="log-in"
              style={{ marginTop: "20px", textAlign: "center" }}
              onClick={handleSubmit}
            >
              <div className="media-banner">
                <img
                  className="normal-banner"
                  src="/images/signup-btn-bg.png"
                  alt=""
                  style={{
                    width: "12rem",
                    height: "4rem",
                  }}
                />
                <span
                  className="login-text"
                  style={{
                    fontSize: "20px",
                    color: "#07528B",
                  }}
                >
                  Update Password
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4"></div>
      </Row>

      {loading && (
        <div className="loading-overlay">
          <Loader isLoading={loading} />
        </div>
      )}
    </div>
  );
};

export default VmResetPassword;