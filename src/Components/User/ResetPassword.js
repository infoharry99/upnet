import React, { useState } from "react";
import { Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import "./reset.css";
import toast, { Toaster } from "react-hot-toast";
import instance from "../../Api";
import AppToast from "../../AppToast";

const ResetPassword = (props) => {
  const { isMobile } = props;
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [pass, setPass] = useState(null);
  const [confPass, setConfPass] = useState(null);
  //   const location = useLocation();
  //   const queryParams = new URLSearchParams(location.search);
  //   const directUID = queryParams.get("token");
  const pathname = window.location.pathname;
  const urlParts = pathname.split("/");
  const lastElement = urlParts[urlParts.length - 1];

  const ForgotPassCall = async () => {
    if (pass != "" && confPass != "") {
      const payload = {
        token: lastElement,
        password: pass,
        password_confirmation: confPass,
      };
      try {
        const loginUserResponse = await instance.post(
          "/forgetpasswordchange",
          payload
        );
        //console.log(loginUserResponse.data, "====forgetpasswordchange");
        if (loginUserResponse.data.status) {
          //toast.success(loginUserResponse.data.message);
          toast((t) => (
            <AppToast
              id={t.id}
              message={loginUserResponse.data.message}
              isMobile={isMobile}
            />
          ));
          window.location.href = "/login";
        }
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
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Please enter password and confirm password."}
          isMobile={isMobile}
        />
      ));
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "75rem",
        position: "relative",
        backgroundImage: isMobile
          ? `url(https://upnetcloud.com/main-bg.jpg)`
          : `url(https://upnetcloud.com/main-bg.jpg)`,
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
            Reset New Password <span></span>
          </div>
          <div
            style={{
              backgroundImage: `url("/images/blue-box-bg.svg")`,
              backgroundSize: "cover",
              top: "6rem",
              height: "40vh",
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
                <div
                  style={{
                    display: "grid",
                    justifyItems: "stretch",
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
                      value={pass}
                      type={showPass ? "text" : "password"}
                      id="New Password"
                      className="form-control"
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
                      onChange={(e) => setPass(e.target.value)}
                    />
                    {showPass ? (
                      <FaEyeSlash
                        onClick={() => setShowPass(false)}
                        style={{ color: "white", width: "20px" }}
                      />
                    ) : (
                      <FaEye
                        onClick={() => setShowPass(true)}
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
                      value={confPass}
                      type={showCPass ? "text" : "password"}
                      id="Confirm Password"
                      className="form-control"
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
                      onChange={(e) => setConfPass(e.target.value)}
                    />
                    {showCPass ? (
                      <FaEyeSlash
                        onClick={() => setShowCPass(false)}
                        style={{ color: "white", width: "20px" }}
                      />
                    ) : (
                      <FaEye
                        onClick={() => setShowCPass(true)}
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
                    onClick={() => ForgotPassCall()}
                  >
                    <a className="media-link">
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
        </>
      ) : (
        <>
          <div className="heading-dotted-changepass">
            Reset New Password <span></span>
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
                  <div
                    style={{
                      display: "grid",
                      justifyItems: "stretch",
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
                        value={pass}
                        type={showPass ? "text" : "password"}
                        id="New Password"
                        className="input-signup"
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
                        onChange={(e) => setPass(e.target.value)}
                      />
                      {showPass ? (
                        <FaEyeSlash
                          onClick={() => setShowPass(false)}
                          style={{ color: "white", width: "20px" }}
                        />
                      ) : (
                        <FaEye
                          onClick={() => setShowPass(true)}
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
                        value={confPass}
                        type={showCPass ? "text" : "password"}
                        id="Confirm Password"
                        className="input-signup"
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
                        onChange={(e) => setConfPass(e.target.value)}
                      />
                      {showCPass ? (
                        <FaEyeSlash
                          onClick={() => setShowCPass(false)}
                          style={{ color: "white", width: "20px" }}
                        />
                      ) : (
                        <FaEye
                          onClick={() => setShowCPass(true)}
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
                      onClick={() => ForgotPassCall()}
                    >
                      <a className="media-link">
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
    </div>
  );
};

export default ResetPassword;
