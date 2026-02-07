import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Turnstile, { useTurnstile } from "react-turnstile";
import ReCAPTCHA from "react-google-recaptcha";

import "./Login.css";
import instance, {
  apiEncryptRequest,
  decryptData,
  encryptData,
  CAPTCHKEY,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const { login } = useAuth();
  const { isMobile } = props;
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userSocial, setUserSocial] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [profileGoogle, setProfileGoogle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const loginGoooooogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      ////console.log(codeResponse, "......codeResponse");
      setGoogleUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleRecaptchaChange = (value) => {
    setIsVerified(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isVerified) {
    } else {
      alert("Please complete the reCAPTCHA challenge.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (googleUser) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${googleUser.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfileGoogle(res.data);
          const data = {
            name: res.data.name,
            email: res.data.email,
            id: res.id,
          };
          SocialRegisterCall(data);
        })
        .catch((err) => console.log(err));
    }
  }, [googleUser]);

  const SocialLoginCall = async (loginPayload) => {
    try {
      const encryptedResponse = await apiEncryptRequest(loginPayload);
      const loginUserResponse = await instance.post(
        "/login",
        encryptedResponse
      );

      // Third API call to decrypt the login response
      const loginResponse = await decryptData(loginUserResponse.data);
      const userDetails = loginResponse[0].user;
      //console.log(loginResponse[0].user, "==!==!==loginResponse");

      login(userDetails);
      // localStorage.setItem("NEW_USER", JSON.stringify(userDetails));
      // window.location.href = "/";
    } catch (error) {
      console.error("Error during the login process:", error);
    }
  };

  const SocialRegisterCall = async (data) => {
    setLoading(true);
    const login_With = isPWA() ? "pwa" : "web";

    if (data !== null) {
      const regPayload = {
        name: data.name,
        phone: "",
        ip: props.ip,
        email: data.email,
        password: "",
        password_confirmation: "",
        login_by: "google",
        id: data.id,
        device_token: " ", 
        login_with: login_With,
      };
      if (isMobile) {
        const regPayload = {
          name: data.name,
          phone: "",
          ip: props.ip,
          email: data.email,
          password: "",
          password_confirmation: "",
          login_by: "google",
          id: data.id,
          login_with: login_With,
          device_token: "", 
        };
      }

      try {
        const encryptedResponse = await apiEncryptRequest(regPayload);
        const loginUserResponse = await instance.post(
          "/register",
          encryptedResponse
        );
        const loginResponse = await decryptData(loginUserResponse.data);

        if (loginResponse[0].success) {
          const user = loginResponse[0].user;
          login(user);
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Oops! Something went wrong, Please try again"}
              isMobile={isMobile}
            />
          ));
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
        // console.error("Error during the login process:", error);
      }
    }
    setLoading(false);
  };

  const LoginCall = async () => {
    setLoading(true);
    const login_With = isPWA() ? "pwa" : "web";
    if (isVerified) {
      if (email !== "" && password !== "") {
        const payload = {
          ip: props.ip,
          email: email,
          password: password,
          login_by: "manual",
          login_with: login_With,
          device_token: "", //storedUserFcmToken,
        };
        if (isMobile) {
          const payload = {
            ip: props.ip,
            email: email,
            password: password,
            login_by: "manual",
            login_with: login_With,
            device_token: "", //storedUserFcmToken,
          };
        }
        try {
          const encryptedResponse = await apiEncryptRequest(payload);
          const loginUserResponse = await instance.post(
            "/login",
            encryptedResponse
          );
          const loginResponse = await decryptData(loginUserResponse.data);
          console.log(loginResponse, "Res");

          if (loginResponse.success == false) {
            // if (userDetails["2fa_status"] == 0) {
              toast((t) => (
                <AppToast
                  id={t.id}
                  message={loginResponse.message}
                  isMobile={isMobile}
                />
              ));
            // }
          }

          const userDetails = loginResponse[0].user;

          if (loginResponse[0].success) {
            if (userDetails["2fa_status"] == 1) {
              GetOTP(userDetails.id);
            } else {
              login(userDetails);

              toast((t) => (
                <AppToast
                  id={t.id}
                  message={`${loginResponse[0].message}\n ip: ${loginResponse[0].ip}`}
                  isMobile={isMobile}
                />
              ));
            }
          } else {
            if (userDetails["2fa_status"] == 0) {
              toast((t) => (
                <AppToast
                  id={t.id}
                  message={loginResponse[0].message}
                  isMobile={isMobile}
                />
              ));
            }
          }

        } catch (error) {
        }
      } else {
        if (email === "") {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Please Enter Email"}
              isMobile={isMobile}
            />
          ));
        } else if (password === "") {
          toast((t) => (
            <AppToast
              id={t.id}
              message="Please Enter Password"
              isMobile={isMobile}
            />
          ));
        }
      }
    } else {
      toast((t) => (
        <AppToast id={t.id} message={"Validate Captcha"} isMobile={isMobile} />
      ));
    }
    setLoading(false);
  };

  const GetOTP = async (userID) => {
    setLoading(true);

    const payload = {
      user_id: userID,
      email: email,
      otp: null,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/getotp",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "emailRes");

      if (loginResponse.status) {
        toast((t) => <AppToast id={t.id} message={loginResponse.message} />);

        setTimeout(() => {
          navigate("/otpverify-2fa", {
            state: { email: email, userId: userID },
          });
        }, 500);
      } else {
        toast((t) => <AppToast id={t.id} message={loginResponse.message} />);
      }
    } catch (error) {
      console.error("Error during the login process:", error);
      toast((t) => <AppToast id={t.id} message={error} />);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userSocial) {
      //console.log(userSocial);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userSocial.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${userSocial.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
         
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // Function to detect if the app is running as a PWA
  const isPWA = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches || // Check for standalone mode
      window.navigator.standalone // iOS-specific standalone check
    );
  };

  return (
    <div>
      <div className="apptoast-align">
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>

      {isMobile ? (
        <>
          <div
            style={{
              backgroundImage: `url("/images/blue-box-bg.svg")`,
              backgroundSize: "cover",
              top: "10rem",
              // height: "75vh",
              width: "90%",
              marginLeft: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 0px",
                  background: "transparent",
                  borderRadius: "28px",
                  marginBottom: "25px",
                  height: "50px",
                }}
              >
               
                <button
                  className="google-sign-up-button"
                  onClick={() => loginGoooooogle()}
                >
                  <img
                    src="/images/google_logo_icon.svg"
                    alt="Google logo"
                    className="google-logo"
                  />
                  Sign Up with Google
                </button>
              </div>
              <div className="or" style={{ marginBottom: "15px" }}>
                or
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid white",
                    borderRadius: "25px",
                    padding: "5px",
                  }}
                >
                  <img
                    src="/images/email.svg"
                    alt=""
                    style={{
                      width: "15px",
                      height: "15px",
                      marginRight: "5px",
                    }}
                  />
                  <input
                    type="text"
                    name="email"
                    className="input-signup"
                    placeholder="Email Address"
                    style={{
                      fontSize: "18px",
                      color: "white",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      flex: "1",
                      padding: "5px",
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
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
                    type={showPass ? "text" : "password"}
                    id="password-field"
                    className="input-signup"
                    name="password"
                    placeholder="Password"
                    style={{
                      fontSize: "18px",
                      color: "white",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      flex: "1",
                      padding: "5px",
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                  {/* </Button> */}
                </div>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    display: "block",
                    padding: "0 10px",
                    marginTop: "10px",
                    color: "white",
                  }}
                >
                  Note: All fields are mandatory
                </span>
                {/* <div style={{ marginTop: "15px" }}>
                  <ReCAPTCHA
                    sitekey="b9a02264-adf6-43f6-a149-0489dbe204c9" // Replace with your reCAPTCHA site key
                    onChange={handleRecaptchaChange}
                  />
                </div> */}
                 {/* <Turnstile
                  className="dave"
                  theme="light"
                  retry="auto"
                  //sitekey="0x4AAAAAAAgB7aivTPOuPMOd" // LIVE
                  sitekey={CAPTCHKEY.siteKey}
                  onVerify={(token) => handleRecaptchaChange(token)}
                />  */}

                  <ReCAPTCHA
                    sitekey="6Ld0OugrAAAAANg5wUSXM5GiOzVips3QSeR_Jcf4"
                    onChange={handleRecaptchaChange}
                  />
                  <div className="log-in" onClick={LoginCall}>
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
                      />
                      <img
                        className="hover-img-banner"
                        src="/images/search-btn-hover.png"
                        alt="/images/search-btn-hover.png"
                      />
                      <span
                        className="login-text"
                        style={{
                          fontSize: "20px",
                          color: "#07528B",
                          marginTop: "0px",
                        }}
                      >
                        Login
                      </span>
                    </div>
                  </a>
                </div>
                <div style={{ display: "flex", marginTop: "15px" }}>
                  <div className="">
                    <input type="checkbox" style={{ marginRight: "5px" }} />
                    <label
                      style={{
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Remember me
                    </label>
                  </div>

                  <a
                    href="/forgotpassword"
                    style={{
                      color: "white",
                      textDecoration: "underline",
                      fontSize: "16px",
                      fontWeight: "600",
                      paddingLeft: "40px",
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            minHeight: "55rem",
          }}
        >
          <Row>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div
                className="register-main see-full"
                style={{ marginTop: "8rem" }}
              >
                <div className="bg-img">
                  <img src="/images/blue-box-bg.svg" alt="" />
                </div>
                <form className="see-full">
                  <input
                    type="hidden"
                    name="_token"
                    value="IHks1cEdGGmsvouWsdVeWVHE29KFoaLV0iN8cPkE"
                  />
                  <div className="btm mob">
                    <div className="google-act">
                      <a>
                        <img src="/images/google_logo_icon.svg" alt="" />
                        <span>Sign Up with Google</span>
                      </a>
                    </div>
                    <div className="or">or</div>
                  </div>
                  <div className="form-top">
                    <div className="input-container">
                      <img
                        src="/images/email.svg"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <input
                        value={email}
                        type="text"
                        name="email"
                        className="input-signup"
                        placeholder="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {/* Pass */}
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
                        id="password-field"
                        className="input-signup"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
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

                      {/* </Button> */}
                    </div>

                    <span style={{ fontSize: "24px" }}>
                      Note: All fields are mandatory
                    </span>
                    <div
                      style={{
                        marginTop: "20px",
                        display: "block",
                        marginBottom: "40px",
                      }}
                    >
                      {/* { <ReCAPTCHA
                        sitekey="6Le1rxoqAAAAAECG8OCvimdyu4D-FbNOihrU0mUH" // Replace with your reCAPTCHA site key
                        onChange={handleRecaptchaChange}
                      /> } */}
                      {/* { <div
                        class="h-captcha"
                        data-sitekey="a8b4ffb2-cd42-4d46-b742-e60276a27bf6"
                        data-size="compact"
                      ></div>}  */}

                      {/* <Turnstile
                        theme="light"
                        retry="auto"
                        size="normal"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          height: "30px",
                        }}
                        //sitekey="0x4AAAAAAAgB7aivTPOuPMOd" // LIVE
                        sitekey={CAPTCHKEY.siteKey}
                        onVerify={(token) => handleRecaptchaChange(token)}
                      /> */}
                        <ReCAPTCHA
                          sitekey="6Ld0OugrAAAAANg5wUSXM5GiOzVips3QSeR_Jcf4"
                          onChange={handleRecaptchaChange}
                        />
                    </div>

                    <div className="check-btm">
                      <div className="click">
                        <div className="checkbox-container">
                          <input type="checkbox" style={{ fontSize: "24px" }} />
                          <label
                            htmlFor="rememberMe"
                            style={{ fontSize: "24px" }}
                          >
                            Remember me
                          </label>
                        </div>
                        <div className="check">
                          {/* <div
                            className="h-captcha"
                            data-sitekey="b9a02264-adf6-43f6-a149-0489dbe204c9"
                            data-size="compact"
                          ></div> */}
                        </div>
                        {/* <div class="cf-turnstile" data-sitekey="0x4AAAAAAAgCoGKKTiB0EtI5" data-theme="light" data-callback="onloadTurnstileCallback"></div> */}

                        <a href="/forgotpassword" style={{ fontSize: "24px" }}>
                          Forgot password?
                        </a>
                      </div>
                    </div>
                  </div>

                  <div
                    className="log-in"
                    style={{ display: "grid", justifyItems: "center" }}
                    onClick={LoginCall}
                  >
                    <a className="media-link">
                      <div
                        className="media-banner"
                        style={{
                          width: "auto",
                          height: "50px",
                          marginTop: "10px",
                          // marginLeft: "14.5rem",
                        }}
                      >
                        <img
                          className="normal-banner"
                          src="/images/signup-btn-bg.png"
                          alt=""
                        />
                        <img
                          className="hover-img-banner"
                          src="/images/search-btn-hover.png"
                          alt="/images/search-btn-hover.png"
                        />
                        <span
                          className="login-text"
                          style={{
                            fontSize: "23px",
                            color: "#07528B",
                            marginTop: "0px",
                          }}
                        >
                          Login
                        </span>
                      </div>
                    </a>
                  </div>
                </form>
                <div className="btm desk" style={{ alignItems: "center" }}>
                  <div
                    className="or"
                    style={{ fontSize: "24px", paddingRight: "20px" }}
                  >
                    or
                  </div>
                  {/* <div className="google-act">
                    <button
                      onClick={() => loginGoooooogle()}
                      style={{
                        position: "absolute",
                        width: "100%",
                        marginTop: "-2px",
                        marginLeft: "-14px",
                        height: "45px",
                        border: "none",
                        backgroundColor: "transparent",
                      }}
                    ></button>
                    <a>
                      <img
                        src="/images/google_logo_icon.svg"
                        alt=""
                        style={{ marginBottom: "5px" }}
                      />
                      <span style={{ fontSize: "24px" }}>
                        Sign Up with Google
                      </span>
                    </a>
                  </div> */}
                  <button
                    // className="google-sign-up-button"
                    style={{
                      marginLeft: "65px",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "white",
                      color: "black",
                      border: "none",
                      borderRadius: "4px",
                      padding: "10px 20px",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                    onClick={() => loginGoooooogle()}
                  >
                    <img
                      src="/images/google_logo_icon.svg"
                      alt="Google logo"
                      className="google-logo"
                    />
                    Sign Up with Google
                  </button>
                  <span className="rgst mob" style={{ fontSize: "24px" }}>
                    Don't you have an account?
                  </span>
                  <a href="/signUp" style={{ fontSize: "24px" }}>
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4"></div>
          </Row>
        </div>
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

export default Login;
