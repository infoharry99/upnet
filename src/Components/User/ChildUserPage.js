import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Row, Button } from "react-bootstrap";
import instance, { apiEncryptRequest, decryptData } from "../../Api";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { FaX } from "react-icons/fa6";
import AppToast from "../../AppToast";
import toast, { Toaster } from "react-hot-toast";

const ChildUserPage = (props) => {
  const { smuser } = useAuth();
  const navigate = useNavigate();
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [usersData, setUsersData] = useState([]);
  const [signupPopUp, setSignupPopUp] = useState(false);

  const [userName, setUserName] = useState(null);
  const [roleName, setRoleName] = useState(null);
  const [usrEmail, setUsrEmail] = useState(null);
  const [usrPass, setUsrPass] = useState(null);
  const [usrConfPass, setUserConfPass] = useState(null);
  const [showConfPass, setShowConfPass] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    getUsers();

    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const getUsers = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/userlist",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      const userDetails = loginResponse;

      // console.log(userDetails[0].users, "==!==!==users");
      setUsersData(userDetails[0].users);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const sendInvitationMail = async () => {
    if (
      userName !== null &&
      userName !== "" &&
      roleName !== null &&
      roleName !== "" &&
      usrEmail !== null &&
      usrEmail !== "" &&
      usrPass !== null &&
      usrPass !== "" &&
      usrConfPass !== null &&
      usrConfPass !== "" &&
      usrPass === usrConfPass
    ) {
      setLoading(true);
      const regPayload = {
        name: userName,
        role_name: roleName,
        ip: props.ip,
        phone: "",
        email: usrEmail,
        password: usrPass,
        password_confirmation: usrConfPass,
        login_by: "manual",
        is_main: "0",
        parent_id: smuser.id,
      };
      // console.log(regPayload, "PAYLOAD");
      try {
        const encryptedResponse = await apiEncryptRequest(regPayload);
        const loginUserResponse = await instance.post(
          "/register",
          encryptedResponse
        );
        const loginResponse = await decryptData(loginUserResponse.data);

        if (loginResponse[0].success) {
          setSignupPopUp(false);
          getUsers();
          toast((t) => (
            <AppToast
              id={t.id}
              message={loginResponse[0].message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={loginResponse[0].message}
              isMobile={isMobile}
            />
          ));
        }
      } catch (error) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"An error occurred. Please try again."}
            isMobile={isMobile}
          />
        ));
        console.error("Error during the login process:", error);
      }
    } else {
      if (userName === null || userName == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Please enter your name"}
            isMobile={isMobile}
          />
        ));
      } else if (roleName == null || roleName == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Please enter your role"}
            isMobile={isMobile}
          />
        ));
      } else if (usrEmail == null || usrEmail == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Please enter your Email"}
            isMobile={isMobile}
          />
        ));
      } else if (usrPass == null || usrPass == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Please enter Password"}
            isMobile={isMobile}
          />
        ));
      } else if (usrConfPass == null || usrConfPass == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Please enter Confirm Password"}
            isMobile={isMobile}
          />
        ));
      } else if (usrPass !== usrConfPass) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Created Password and Confirm Password not matching!"}
            isMobile={isMobile}
          />
        ));
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "65rem",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        backgroundSize: "cover",
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
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "999999999" }}>
          <Loader isLoading={loading} />
          {/* <Spinner animation="border" /> */}
        </div>
      )}

      {signupPopUp && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backdropFilter: "blur(25px)",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
              borderRadius: "12px", // Assuming you want rounded corners
              border: "2px solid #e97730",
              top: "15%",
              position: "absolute",
              zIndex: "9999999",
              width: isMobile ? "80%" : "35%",
              height: "32rem",
            }}
          >
            <div style={{ display: "grid", justifyItems: "center" }}>
              <button
                style={{
                  zIndex: "9",
                  position: "absolute",
                  backgroundColor: "transparent",
                  border: "none",
                  right: "0",
                }}
                onClick={() => setSignupPopUp(false)}
              >
                <FaX
                  style={{
                    marginTop: "5px",
                    color: "#e97730",
                    display: "inline-block",
                    fontSize: "19px",
                  }}
                />
              </button>{" "}
              <div
                className="register-main see-full"
                style={{ marginTop: "-1px" }}
              >
                <div className="bg-img">
                  <img src="/images/blue-box-bg.svg" alt="" />
                </div>
                <form className="see-full">
                  <div className="form-top">
                    {/* NAME */}
                    <div className="input-container">
                      <img
                        src="/images/user-white.svg"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <input
                        type="text"
                        className="input-signup"
                        placeholder="Name"
                        // value={regName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    {/* Role Name */}
                    <div className="input-container">
                      <img
                        src="/images/user-white.svg"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <input
                        type="text"
                        className="input-signup"
                        placeholder="Role Name"
                        // value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                      />
                    </div>
                    {/* EMAIL */}
                    <div className="input-container">
                      <img
                        src="/images/email.svg"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <input
                        type="text"
                        className="input-signup"
                        placeholder="Email Address"
                        // value={email}
                        onChange={(e) => setUsrEmail(e.target.value)}
                      />
                    </div>
                    {/* PASS */}
                    <div
                      className="input-container"
                      style={{ marginTop: "15px" }}
                    >
                      <img
                        src="/images/lock.svg"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <input
                        type={showPass ? "text" : "password"}
                        className="input-signup"
                        placeholder="Password"
                        // value={pass}
                        onChange={(e) => setUsrPass(e.target.value)}
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
                    {/* Conf PASS */}
                    <div
                      className="input-container"
                      style={{ marginTop: "15px" }}
                    >
                      <img
                        src="/images/lock.svg"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <input
                        type={showConfPass ? "text" : "password"}
                        className="input-signup"
                        placeholder="Confirm Password"
                        // value={confPass}
                        onChange={(e) => setUserConfPass(e.target.value)}
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
                    </div>
                  </div>
                </form>
                <div
                  className="log-in"
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{
                      width: "12rem",
                      height: "50px",
                      zIndex: "9",
                      position: "relative",
                      marginTop: "35px",
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "white",
                      backgroundColor: "#e97730",
                      outline: "4px solid #e97730",
                      border: "4px solid #b71b1b",
                      borderColor: "white",
                      borderRadius: "30px",
                    }}
                    onClick={() => {
                      sendInvitationMail();
                    }}
                    onMouseOver={(e) => (e.target.style.fontSize = "17px")}
                    onMouseOut={(e) => (e.target.style.fontSize = "16px")}
                  >
                    Send Invitation Mail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-bill">
            Users List <span></span>
          </div>

          {usersData.length !== 0 && (
            <div
              style={{
                position: "relative",
                marginLeft: "5px",
                fontSize: "24px",
                fontWeight: "400",
              }}
            >
              <Button
                style={{
                  marginTop: "15px",
                  background: "#035189",
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                  // borderRadius: "20px",
                  // marginBottom: "10px",
                }}
                onClick={() => setSignupPopUp(true)}
              >
                Create Child User
              </Button>
            </div>
          )}

          {usersData.length == 0 && !signupPopUp && (
            <div
              style={{
                position: "relative",
                marginTop: "10rem",
                fontSize: "24px",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              <Button
                style={{
                  marginTop: "40px",
                  background: "#035189",
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                }}
                onClick={() => setSignupPopUp(true)}
              >
                Create Child User
              </Button>
            </div>
          )}

          <div
            className="features-section-solution"
            style={{
              backgroundImage: isMobile
                ? `url(./main-bg.jpg)`
                : `url(./main-bg.jpg)`,
            }}
          >
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-10" style={{ marginBottom: "5rem" }}>
                <div className="billing-list">
                  <div className="table-row no-hover">
                    <div className="table-head">
                      <div className="table-content">Name</div>
                      <img
                        src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                        className="bg-image"
                        alt="Background"
                      />
                    </div>
                    <div className="table-head">
                      <div className="table-content">Email</div>
                      <img
                        src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                        className="bg-image"
                        alt="Background"
                      />
                    </div>
                    <div className="table-head">
                      <div className="table-content">Role Type</div>
                      <img
                        src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                        className="bg-image"
                        alt="Background"
                      />
                    </div>
                    <div className="table-head">
                      <div className="table-content">Server</div>
                      <img
                        src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                        className="bg-image"
                        alt="Background"
                      />
                    </div>
                    <div className="table-head">
                      <div className="table-content">CDN</div>
                      <img
                        src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                        className="bg-image"
                        alt="Background"
                      />
                    </div>
                    <div className="table-head">
                      <div className="table-content">Support</div>
                      <img
                        src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                        className="bg-image"
                        alt="Background"
                      />
                    </div>
                  </div>
                  {usersData &&
                    usersData.map((item, idx) => (
                      <div className="table-row">
                        <div className="table-data">
                          <div className="table-content">
                            <div>{item.name}</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-data">
                          <div className="table-content">
                            <div>{item.email}</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-data">
                          <div className="table-content">
                            <div>{item.role_name}</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-data">
                          <div className="table-content">
                            <div className="row" style={{ marginLeft: "20px" }}>
                              <div
                                className="log-in col-md-6"
                                style={{
                                  // marginTop: "-10px",
                                  // marginBottom: "-15px",
                                  marginRight: "10px",
                                  marginLeft: "125px",
                                }}
                                onClick={() =>
                                  navigate("/vm-assign", {
                                    state: {
                                      userDetail: item,
                                      isServerOrCDN: "SERVER",
                                    },
                                  })
                                }
                              >
                                <button
                                  style={{
                                    width: "7rem",
                                    height: "40px",
                                    zIndex: "9",
                                    // position: "relative",
                                    // marginTop: "10px",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    color: "white",
                                    backgroundColor: "#e97730",
                                    outline: "4px solid #e97730",
                                    border: "4px solid #b71b1b",
                                    borderColor: "white",
                                    borderRadius: "30px",
                                  }}
                                  onClick={() => {
                                    // sendInvitationMail();
                                  }}
                                  onMouseOver={(e) =>
                                    (e.target.style.fontSize = "17px")
                                  }
                                  onMouseOut={(e) =>
                                    (e.target.style.fontSize = "16px")
                                  }
                                >
                                  Assign
                                </button>
                              </div>
                              <div
                                className="log-in col-md-6"
                                style={{
                                  marginTop: "-55px",
                                  // marginBottom: "-15px",
                                  // marginRight: "10px",
                                  // marginLeft: "70px",
                                }}
                                onClick={() =>
                                  navigate("/assigned-vm", {
                                    state: {
                                      userDetail: item,
                                    },
                                  })
                                }
                              >
                                <button
                                  style={{
                                    width: "7rem",
                                    height: "40px",
                                    zIndex: "9",
                                    // position: "relative",
                                    marginTop: "15px",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    color: "white",
                                    backgroundColor: "#e97730",
                                    outline: "4px solid #e97730",
                                    border: "4px solid #b71b1b",
                                    borderColor: "white",
                                    borderRadius: "30px",
                                  }}
                                  onClick={() => {
                                    // sendInvitationMail();
                                  }}
                                  onMouseOver={(e) =>
                                    (e.target.style.fontSize = "17px")
                                  }
                                  onMouseOut={(e) =>
                                    (e.target.style.fontSize = "16px")
                                  }
                                >
                                  VM List
                                </button>
                              </div>
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-data">
                          <div className="table-content">
                            <div
                              className="button-field"
                              // style={{
                              //   display: "flex",
                              //   flexDirection: "column",
                              //   flexWrap: "nowrap",
                              //   justifyContent: "center",
                              //   alignItems: "center",
                              // }}
                            >
                              <div
                                className="row"
                                style={{ marginLeft: "20px" }}
                              >
                                <div
                                  className="log-in col-md-6"
                                  style={{
                                    // marginTop: "-10px",
                                    // marginBottom: "-15px",
                                    marginRight: "10px",
                                    marginLeft: "125px",
                                  }}
                                  onClick={() =>
                                    navigate("/vm-assign", {
                                      state: {
                                        userDetail: item,
                                        isServerOrCDN: "CDN",
                                      },
                                    })
                                  }
                                >
                                  <button
                                    style={{
                                      width: "7rem",
                                      height: "40px",
                                      zIndex: "9",
                                      // position: "relative",
                                      // marginTop: "10px",
                                      fontSize: "15px",
                                      fontWeight: "700",
                                      color: "white",
                                      backgroundColor: "#e97730",
                                      outline: "4px solid #e97730",
                                      border: "4px solid #b71b1b",
                                      borderColor: "white",
                                      borderRadius: "30px",
                                    }}
                                    onClick={() => {
                                      // sendInvitationMail();
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.fontSize = "17px")
                                    }
                                    onMouseOut={(e) =>
                                      (e.target.style.fontSize = "16px")
                                    }
                                  >
                                    Assign
                                  </button>
                                </div>
                                <div
                                  className="log-in col-md-6"
                                  style={{
                                    marginTop: "-55px",
                                    // marginBottom: "-15px",
                                    // marginRight: "10px",
                                    // marginLeft: "70px",
                                  }}
                                  onClick={() =>
                                    navigate("/assigned-cdn", {
                                      state: {
                                        userDetail: item,
                                      },
                                    })
                                  }
                                >
                                  <button
                                    style={{
                                      width: "7rem",
                                      height: "40px",
                                      zIndex: "9",
                                      // position: "relative",
                                      marginTop: "15px",
                                      fontSize: "15px",
                                      fontWeight: "700",
                                      color: "white",
                                      backgroundColor: "#e97730",
                                      outline: "4px solid #e97730",
                                      border: "4px solid #b71b1b",
                                      borderColor: "white",
                                      borderRadius: "30px",
                                    }}
                                    onClick={() => {
                                      // sendInvitationMail();
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.fontSize = "17px")
                                    }
                                    onMouseOut={(e) =>
                                      (e.target.style.fontSize = "16px")
                                    }
                                  >
                                    CDN List
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-data">
                          <div className="table-content">
                            <div
                              className="button-field"
                              // style={{
                              //   display: "flex",
                              //   flexDirection: "column",
                              //   flexWrap: "nowrap",
                              //   justifyContent: "center",
                              //   alignItems: "center",
                              // }}
                            >
                              <button
                                style={{
                                  width: "7rem",
                                  height: "40px",
                                  zIndex: "9",
                                  // position: "relative",
                                  // marginTop: "10px",
                                  fontSize: "15px",
                                  fontWeight: "700",
                                  color: "white",
                                  backgroundColor: "#e97730",
                                  outline: "4px solid #e97730",
                                  border: "4px solid #b71b1b",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                                onClick={() => {
                                  navigate("/user-create-ticket", {
                                    state: {
                                      userDetail: item,
                                      isSetting: true,
                                    },
                                  });
                                }}
                                onMouseOver={(e) =>
                                  (e.target.style.fontSize = "17px")
                                }
                                onMouseOut={(e) =>
                                  (e.target.style.fontSize = "16px")
                                }
                              >
                                Assign
                              </button>
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                      </div>
                    ))}

                  <div className="table-row no-hover">
                    <div className="table-foot">
                      <img
                        src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                        className="table-footer-image-size"
                        alt="Background"
                      />
                    </div>
                    <div className="table-foot">
                      <img
                        src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                        className="table-footer-image-size"
                        alt="Background"
                      />
                    </div>
                    <div className="table-foot">
                      <img
                        src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                        className="table-footer-image-size"
                        alt="Background"
                      />
                    </div>
                    <div className="table-foot">
                      <img
                        src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                        className="table-footer-image-size"
                        alt="Background"
                      />
                    </div>
                    <div className="table-foot">
                      <img
                        src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                        className="table-footer-image-size"
                        alt="Background"
                      />
                    </div>
                    <div className="table-foot">
                      <img
                        src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                        className="table-footer-image-size"
                        alt="Background"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-1"></div>
            </Row>
          </div>
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "50rem", paddingLeft: "15rem", paddingTop: "4rem" }}
        >
          <div className="heading-dotted-bill" style={{ marginLeft: "10px" }}>
            Users List <span></span>
          </div>

          {usersData.length !== 0 && (
            <div
              style={{
                position: "relative",
                marginLeft: "5px",
                fontSize: "24px",
                fontWeight: "400",
              }}
            >
              <Button
                style={{
                  marginTop: "40px",
                  background: "#035189",
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                  // borderRadius: "20px",
                  // marginBottom: "10px",
                }}
                onClick={() => setSignupPopUp(true)}
              >
                Create Child User
              </Button>
            </div>
          )}

          {usersData.length == 0 && !signupPopUp && (
            <div
              style={{
                position: "relative",
                left: "40%",
                marginTop: "10rem",
                fontSize: "24px",
                fontWeight: "400",
              }}
            >
              <Button
                style={{
                  marginTop: "40px",
                  background: "#035189",
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                  // borderRadius: "20px",
                  // marginBottom: "10px",
                }}
                onClick={() => setSignupPopUp(true)}
              >
                Create Child User
              </Button>
            </div>
          )}
          {usersData.length > 0 && (
            <div className="features-section-solution">
              <Row>
                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      marginTop: "1rem",
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="billing-list">
                      <div className="table-row no-hover">
                        <div className="table-head">
                          <div className="table-content">Name</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Email</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Role Type</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Server</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">CDN</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Support</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                      </div>
                      {usersData &&
                        usersData.map((item, idx) => (
                          <div className="table-row">
                            <div className="table-data">
                              <div className="table-content">
                                <div>{item.name}</div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div
                                className="table-content"
                                style={{
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2, // Limits text to 2 lines
                                  WebkitBoxOrient: "vertical",
                                  maxWidth: "250px",
                                  lineHeight: "1.2em",
                                }}
                              >
                                <div>{item.email}</div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>{item.role_name}</div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div
                                  className="button-field"
                                  // style={{
                                  //   display: "flex",
                                  //   flexDirection: "column",
                                  //   flexWrap: "nowrap",
                                  //   justifyContent: "center",
                                  //   alignItems: "center",
                                  // }}
                                >
                                  <div
                                    className="row"
                                    style={{ marginLeft: "20px" }}
                                  >
                                    <div
                                      className="log-in col-md-6"
                                      style={{
                                        // marginTop: "-10px",
                                        // marginBottom: "-15px",
                                        marginRight: "10px",
                                        marginLeft: "125px",
                                      }}
                                      onClick={() =>
                                        navigate("/vm-assign", {
                                          state: {
                                            userDetail: item,
                                            isServerOrCDN: "SERVER",
                                          },
                                        })
                                      }
                                    >
                                      <button
                                        style={{
                                          width: "7rem",
                                          height: "40px",
                                          zIndex: "9",
                                          // position: "relative",
                                          // marginTop: "10px",
                                          fontSize: "15px",
                                          fontWeight: "700",
                                          color: "white",
                                          backgroundColor: "#e97730",
                                          outline: "4px solid #e97730",
                                          border: "4px solid #b71b1b",
                                          borderColor: "white",
                                          borderRadius: "30px",
                                        }}
                                        onClick={() => {
                                          // sendInvitationMail();
                                        }}
                                        onMouseOver={(e) =>
                                          (e.target.style.fontSize = "17px")
                                        }
                                        onMouseOut={(e) =>
                                          (e.target.style.fontSize = "16px")
                                        }
                                      >
                                        Assign
                                      </button>
                                    </div>
                                    <div
                                      className="log-in col-md-6"
                                      style={{
                                        marginTop: "-55px",
                                        // marginBottom: "-15px",
                                        // marginRight: "10px",
                                        // marginLeft: "70px",
                                      }}
                                      onClick={() =>
                                        navigate("/assigned-vm", {
                                          state: {
                                            userDetail: item,
                                          },
                                        })
                                      }
                                    >
                                      <button
                                        style={{
                                          width: "7rem",
                                          height: "40px",
                                          zIndex: "9",
                                          // position: "relative",
                                          marginTop: "15px",
                                          fontSize: "15px",
                                          fontWeight: "700",
                                          color: "white",
                                          backgroundColor: "#e97730",
                                          outline: "4px solid #e97730",
                                          border: "4px solid #b71b1b",
                                          borderColor: "white",
                                          borderRadius: "30px",
                                        }}
                                        onClick={() => {
                                          // sendInvitationMail();
                                        }}
                                        onMouseOver={(e) =>
                                          (e.target.style.fontSize = "17px")
                                        }
                                        onMouseOut={(e) =>
                                          (e.target.style.fontSize = "16px")
                                        }
                                      >
                                        VM List
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div
                                  className="button-field"
                                  // style={{
                                  //   display: "flex",
                                  //   flexDirection: "column",
                                  //   flexWrap: "nowrap",
                                  //   justifyContent: "center",
                                  //   alignItems: "center",
                                  // }}
                                >
                                  <div
                                    className="row"
                                    style={{ marginLeft: "20px" }}
                                  >
                                    <div
                                      className="log-in col-md-6"
                                      style={{
                                        // marginTop: "-10px",
                                        // marginBottom: "-15px",
                                        marginRight: "10px",
                                        marginLeft: "125px",
                                      }}
                                      onClick={() =>
                                        navigate("/vm-assign", {
                                          state: {
                                            userDetail: item,
                                            isServerOrCDN: "CDN",
                                          },
                                        })
                                      }
                                    >
                                      <button
                                        style={{
                                          width: "7rem",
                                          height: "40px",
                                          zIndex: "9",
                                          // position: "relative",
                                          // marginTop: "10px",
                                          fontSize: "15px",
                                          fontWeight: "700",
                                          color: "white",
                                          backgroundColor: "#e97730",
                                          outline: "4px solid #e97730",
                                          border: "4px solid #b71b1b",
                                          borderColor: "white",
                                          borderRadius: "30px",
                                        }}
                                        onClick={() => {
                                          // sendInvitationMail();
                                        }}
                                        onMouseOver={(e) =>
                                          (e.target.style.fontSize = "17px")
                                        }
                                        onMouseOut={(e) =>
                                          (e.target.style.fontSize = "16px")
                                        }
                                      >
                                        Assign
                                      </button>
                                    </div>
                                    <div
                                      className="log-in col-md-6"
                                      style={{
                                        marginTop: "-55px",
                                        // marginBottom: "-15px",
                                        // marginRight: "10px",
                                        // marginLeft: "70px",
                                      }}
                                      onClick={() =>
                                        navigate("/assigned-cdn", {
                                          state: {
                                            userDetail: item,
                                          },
                                        })
                                      }
                                    >
                                      <button
                                        style={{
                                          width: "7rem",
                                          height: "40px",
                                          zIndex: "9",
                                          // position: "relative",
                                          marginTop: "15px",
                                          fontSize: "15px",
                                          fontWeight: "700",
                                          color: "white",
                                          backgroundColor: "#e97730",
                                          outline: "4px solid #e97730",
                                          border: "4px solid #b71b1b",
                                          borderColor: "white",
                                          borderRadius: "30px",
                                        }}
                                        onClick={() => {
                                          // sendInvitationMail();
                                        }}
                                        onMouseOver={(e) =>
                                          (e.target.style.fontSize = "17px")
                                        }
                                        onMouseOut={(e) =>
                                          (e.target.style.fontSize = "16px")
                                        }
                                      >
                                        CDN List
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div
                                  className="button-field"
                                  // style={{
                                  //   display: "flex",
                                  //   flexDirection: "column",
                                  //   flexWrap: "nowrap",
                                  //   justifyContent: "center",
                                  //   alignItems: "center",
                                  // }}
                                >
                                  {/* <div
                                    className="log-in"
                                    style={{
                                      marginTop: "-7px",
                                      marginBottom: "-15px",
                                      marginRight: "10px",
                                      marginLeft: "70px",
                                    }}
                                    onClick={() => ""}
                                  >
                                    <a className="media-link">
                                      <div
                                        className="media-banner"
                                        style={{
                                          width: "auto",
                                          height: "50px",
                                          marginTop: "10px",
                                          marginLeft: "0.5rem",
                                        }}
                                      >
                                        <img
                                          className="normal-banner"
                                          src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                          alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                          style={{ height: "40px" }}
                                        />
                                        <img
                                          className="hover-img-banner"
                                          src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                          alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                          style={{ height: "40px" }}
                                        />
                                        <span
                                          className="login-text"
                                          style={{
                                            color: "white",
                                            fontSize: "16px",
                                            marginTop: "-5px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          Assign
                                        </span>
                                      </div>
                                    </a>
                                  </div> */}
                                  <button
                                    style={{
                                      width: "7rem",
                                      height: "40px",
                                      zIndex: "9",
                                      // position: "relative",
                                      // marginTop: "10px",
                                      fontSize: "15px",
                                      fontWeight: "700",
                                      color: "white",
                                      backgroundColor: "#e97730",
                                      outline: "4px solid #e97730",
                                      border: "4px solid #b71b1b",
                                      borderColor: "white",
                                      borderRadius: "30px",
                                    }}
                                    onClick={() => {
                                      navigate("/user-create-ticket", {
                                        state: {
                                          userDetail: item,
                                          isSetting: true,
                                        },
                                      });
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.fontSize = "17px")
                                    }
                                    onMouseOut={(e) =>
                                      (e.target.style.fontSize = "16px")
                                    }
                                  >
                                    Assign
                                  </button>
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                          </div>
                        ))}

                      <div className="table-row no-hover">
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChildUserPage;
