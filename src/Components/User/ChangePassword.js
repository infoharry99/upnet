import React, { useState } from "react";
import { Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import instance from "../../Api";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";

const ChangePassword = (props) => {
  const { isMobile } = props;
  const { smuser } = useAuth();

  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currPass, setCurrPass] = useState(null);
  const [newPass, setNewPass] = useState(null);
  const [newConfPass, setNewConfpass] = useState(null);

  const ChangePassCall = async () => {
    setLoading(true);
    if (
      currPass !== "" &&
      newPass !== "" &&
      newConfPass !== "" &&
      newPass === newConfPass
    ) {
      const payload = {
        user_id: smuser.id,
        current_password: currPass,
        new_password: newPass,
        new_confirm_password: newConfPass,
      };
      try {
        //   const encryptedResponse = await apiEncryptRequest(payload);
        //   ////console.log(encryptedResponse, "=encryptedResponse");

        const loginUserResponse = await instance.post(
          "/changepassword",
          payload
        );
        //console.log(loginUserResponse.data, "====loginUserResponse");
        if (loginUserResponse.data.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={loginUserResponse.data.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={loginUserResponse.data.message}
              isMobile={isMobile}
            />
          ));
        }
        //   const loginResponse = await apiDecrypteRequest(loginUserResponse.data);
        //   //console.log(loginResponse, "forgot passssss 1");

        // localStorage.setItem("NEW_USER", JSON.stringify(userDetails));
        // window.location.href = "/";
      } catch (error) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={
              "Oops! Something went wrong while fetching the data. Please try again later or contact support if the issue persists."
            }
            isMobile={isMobile}
          />
        ));
      }
    } else if (newPass !== newConfPass) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Password and Confirm Password are not matched!"}
          isMobile={isMobile}
        />
      ));
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"All fields are required!"}
          isMobile={isMobile}
        />
      ));
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "55rem",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundColor: "#141414",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="apptoast-align">
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>
      {isMobile ? (
        <>
          <div className="heading-dotted-changepass">
            Change Password <span></span>
          </div>
          <div
            style={{
              backgroundImage: `url("/images/blue-box-bg.svg")`,
              backgroundSize: "cover",
              top: "6rem",
              // height: "40vh",
              width: "90%",
              marginLeft: "25px",
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              padding: "30px 25px",
              position: "relative",
              backgroundColor: "#07528b", // Use backgroundColor instead of background
              borderRadius: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div>
                {/* Current Password */}
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
                  <img
                    src="/images/lock.svg"
                    alt=""
                    style={{
                      width: "15px",
                      height: "15px",
                      marginRight: "5px",
                    }}
                  />
                  <input
                    value={currPass}
                    type={showCurrPass ? "text" : "password"}
                    id="password-field"
                    className="form-control white-placeholder"
                    name="password"
                    placeholder="Password"
                    style={{
                      color: "white",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      flex: "1",
                      padding: "5px",
                    }}
                    onChange={(e) => setCurrPass(e.target.value)}
                  />
                  {showCurrPass ? (
                    <FaEyeSlash
                      onClick={() => setShowCurrPass(false)}
                      style={{ color: "white", width: "20px" }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => setShowCurrPass(true)}
                      style={{ color: "white", width: "20px" }}
                    />
                  )}
                  {/* </Button> */}
                </div>
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
                  <img
                    src="/images/lock.svg"
                    alt=""
                    style={{
                      width: "15px",
                      height: "15px",
                      marginRight: "5px",
                    }}
                  />
                  <input
                    value={newPass}
                    type={showNewPass ? "text" : "password"}
                    id="New Password"
                    className="form-control white-placeholder"
                    name="New Password"
                    placeholder="New Password"
                    style={{
                      color: "white",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      flex: "1",
                      padding: "5px",
                    }}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                  {showNewPass ? (
                    <FaEyeSlash
                      onClick={() => setShowNewPass(false)}
                      style={{ color: "white", width: "20px" }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => setShowNewPass(true)}
                      style={{ color: "white", width: "20px" }}
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
                  <img
                    src="/images/lock.svg"
                    alt=""
                    style={{
                      width: "15px",
                      height: "15px",
                      marginRight: "5px",
                    }}
                  />
                  <input
                    value={newConfPass}
                    type={showConfPass ? "text" : "password"}
                    id="Confirm Password"
                    className="form-control white-placeholder"
                    name="Confirm Password"
                    placeholder="Confirm Password"
                    style={{
                      color: "white",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      flex: "1",
                      padding: "5px",
                    }}
                    onChange={(e) => setNewConfpass(e.target.value)}
                  />
                  {showConfPass ? (
                    <FaEyeSlash
                      onClick={() => setShowConfPass(false)}
                      style={{ color: "white", width: "20px" }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => setShowConfPass(true)}
                      style={{ color: "white", width: "20px" }}
                    />
                  )}

                  {/* </Button> */}
                </div>

                <div
                  className="log-in"
                  style={{ marginTop: "15px", marginLeft: "5%" }}
                  onClick={() => ChangePassCall()}
                >
                  <a className="media-link">
                    <div
                      className="media-banner"
                      style={{
                        width: "auto",
                        height: "50px",
                        marginTop: "10px",
                        marginLeft: "5rem",
                      }}
                    >
                      <img
                        className="normal-banner"
                        src="/images/signup-btn-bg.png"
                        alt=""
                        style={{
                          marginTop: "-6px",
                          width: "11rem",
                          height: "4rem",
                        }}
                      />
                      <img
                        className="hover-img-banner"
                        src="/images/search-btn-hover.png"
                        alt="/images/search-btn-hover.png"
                        style={{
                          marginTop: "-6px",
                          width: "11rem",
                          height: "4rem",
                        }}
                      />
                      <span
                        className="login-text"
                        style={{
                          fontSize: "20px",
                          color: "#07528B",
                          marginTop: "0px",
                        }}
                      >
                        Update Password
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="heading-dotted-changepass"
            style={{ marginLeft: "16rem" }}
          >
            Change Password <span></span>
          </div>
          <Row>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div
                style={{
                  backgroundImage: `url("/images/blue-box-bg.svg")`,
                  backgroundSize: "cover",
                  top: "10rem",
                  // height: "40vh",
                  width: "90%",
                  marginLeft: "25px",
                  padding: "30px 25px",
                  position: "relative",
                  backgroundColor: "#07528b", // Use backgroundColor instead of background
                  borderRadius: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "grid",
                      justifyItems: "stretch",
                    }}
                  >
                    {/* Current Password */}
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
                      <img
                        src="/images/lock.svg"
                        alt=""
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <input
                        value={currPass}
                        type={showCurrPass ? "text" : "password"}
                        id="password-field"
                        className="form-control white-placeholder"
                        name="password"
                        placeholder="Password"
                        style={{
                          color: "white",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          flex: "1",
                          padding: "5px",
                        }}
                        onChange={(e) => setCurrPass(e.target.value)}
                      />
                      {showCurrPass ? (
                        <FaEyeSlash
                          onClick={() => setShowCurrPass(false)}
                          style={{ color: "white", width: "20px" }}
                        />
                      ) : (
                        <FaEye
                          onClick={() => setShowCurrPass(true)}
                          style={{ color: "white", width: "20px" }}
                        />
                      )}
                      {/* </Button> */}
                    </div>
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
                      <img
                        src="/images/lock.svg"
                        alt=""
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <input
                        value={newPass}
                        type={showNewPass ? "text" : "password"}
                        id="New Password"
                        className="form-control white-placeholder"
                        name="New Password"
                        placeholder="New Password"
                        style={{
                          color: "white",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          flex: "1",
                          padding: "5px",
                        }}
                        onChange={(e) => setNewPass(e.target.value)}
                      />
                      {showNewPass ? (
                        <FaEyeSlash
                          onClick={() => setShowNewPass(false)}
                          style={{ color: "white", width: "20px" }}
                        />
                      ) : (
                        <FaEye
                          onClick={() => setShowNewPass(true)}
                          style={{ color: "white", width: "20px" }}
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
                      <img
                        src="/images/lock.svg"
                        alt=""
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <input
                        value={newConfPass}
                        type={showConfPass ? "text" : "password"}
                        id="Confirm Password"
                        className="form-control white-placeholder"
                        name="Confirm Password"
                        placeholder="Confirm Password"
                        style={{
                          color: "white",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          flex: "1",
                          padding: "5px",
                        }}
                        onChange={(e) => setNewConfpass(e.target.value)}
                      />
                      {showConfPass ? (
                        <FaEyeSlash
                          onClick={() => setShowConfPass(false)}
                          style={{ color: "white", width: "20px" }}
                        />
                      ) : (
                        <FaEye
                          onClick={() => setShowConfPass(true)}
                          style={{ color: "white", width: "20px" }}
                        />
                      )}
                      {/* </Button> */}
                    </div>

                    <div
                      className="log-in"
                      style={{
                        marginTop: "15px",
                        marginLeft: "-8rem",
                        justifyContent: "center",
                      }}
                      onClick={() => ChangePassCall()}
                    >
                      <a href="#" className="media-link">
                        <div
                          className="media-banner"
                          style={{
                            width: "auto",
                            height: "50px",
                            marginTop: "10px",
                            marginLeft: "10rem",
                          }}
                        >
                          <img
                            className="normal-banner"
                            src="/images/signup-btn-bg.png"
                            alt=""
                            style={{
                              marginTop: "-6px",
                              width: "12rem",
                              height: "4rem",
                            }}
                          />
                          <img
                            className="hover-img-banner"
                            src="/images/search-btn-hover.png"
                            alt="/images/search-btn-hover.png"
                            style={{
                              marginTop: "-6px",
                              width: "12rem",
                              height: "4rem",
                            }}
                          />
                          <span
                            className="login-text"
                            style={{
                              fontSize: "20px",
                              color: "#07528B",
                              marginTop: "0px",
                            }}
                          >
                            Update Password
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4"></div>
          </Row>
        </>
      )}
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
          {/* <Spinner animation="border" /> */}
        </div>
      )}
    </div>
  );
};

export default ChangePassword;