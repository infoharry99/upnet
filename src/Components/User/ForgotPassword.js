import React, { useState } from "react";
import { Row } from "react-bootstrap";
import "./Login.css";
import instance, { apiDecrypteRequest, apiEncryptRequest } from "../../Api";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";

const ForgotPassword = (props) => {
  const { isMobile } = props;
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const ForgotPassCall = async () => {
    setLoading(true);
    if (email !== null) {
      const payload = {
        email: email,
      };
      try {
        const loginUserResponse = await instance.post(
          "/forget-password",
          payload
        );
        // console.log(loginUserResponse.data, "====loginUserResponse");
        if (loginUserResponse.data.status) {
          // toast.success(loginUserResponse.data.message);
          // console.log(loginUserResponse, "loginUserResponse.data.message");
          toast((t) => (
            <AppToast
              id={t.id}
              message={loginUserResponse.data.message}
              isMobile={isMobile}
            />
          ));
          window.location.href = "/";
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
        console.error("Error during the login process:", error);
      }
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"please enter your email address."}
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
            Forgot Password <span></span>
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
                <div
                  style={{
                    display: "grid",
                    justifyItems: "stretch",
                  }}
                >
                  {/* <div style={{ color: "white", textAlign: "center" }}>
                    We have send link on email Plz check !
                  </div> */}
                  <div
                    style={{
                      padding: "15px",
                      textAlign: "center",
                      color: "#fff",
                      fontSize: "24px",
                    }}
                  >
                    Reset Password
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
                      src="/images/email.png"
                      alt=""
                      style={{
                        width: "20px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <input
                      value={email}
                      type="text"
                      id="Email"
                      className="form-control white-placeholder"
                      name="Email"
                      placeholder="Enter Email"
                      style={{
                        color: "white",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        flex: "1",
                        padding: "5px",
                      }}
                      onChange={(e) => setEmail(e.target.value)}
                    />

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
                          Submit
                        </span>
                      </div>
                    </a>
                  </div>
                  <div style={{ display: "flex", marginTop: "30px" }}>
                    <span
                      className="rgst mob"
                      style={{
                        color: "#fff",
                        display: "inline-block",
                        fontSize: "17px",
                        padding: "3px 0 0",
                      }}
                    >
                      Don't you have an account?
                    </span>
                    <a
                      href="/signUp"
                      style={{
                        fontSize: "20px",
                        display: "unset",
                        background: "unset",
                        padding: "0 0 0 3px",
                        color: "#fff",
                        textDecoration: "underline",
                        textTransform: "capitalize",
                        fontWeight: "500",
                      }}
                    >
                      Sign Up
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
            Reset Password <span></span>
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
                    <div style={{ color: "white", textAlign: "center" }}></div>
                    <div
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        color: "#fff",
                        fontSize: "24px",
                      }}
                    >
                      Reset Password
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
                        src="/images/email.png"
                        alt=""
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <input
                        value={email}
                        type="text"
                        id="Email"
                        className="form-control white-placeholder"
                        name="Email"
                        placeholder="Enter Email"
                        style={{
                          color: "white",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          flex: "1",
                          padding: "5px",
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                      />

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
                            Submit
                          </span>
                        </div>
                      </a>
                    </div>
                    <div style={{ display: "flex", marginTop: "30px" }}>
                      <span
                        className="rgst mob"
                        style={{
                          color: "#fff",
                          display: "inline-block",
                          fontSize: "17px",
                          padding: "3px 0 0",
                        }}
                      >
                        Don't you have an account?
                      </span>
                      <a
                        href="/signUp"
                        style={{
                          fontSize: "20px",
                          display: "unset",
                          background: "unset",
                          padding: "0 0 0 3px",
                          color: "#fff",
                          textDecoration: "underline",
                          textTransform: "capitalize",
                          fontWeight: "500",
                        }}
                      >
                        Sign Up
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

export default ForgotPassword;