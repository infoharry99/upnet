import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Turnstile, { useTurnstile } from "react-turnstile";
import ReCAPTCHA from "react-google-recaptcha";
import "./SignUp.css";
import instance, {
  AllCountryList,
  apiDecrypteRequest,
  apiEncryptRequest,
  decryptData,
  CAPTCHKEY,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import { GoogleLogin } from "@react-oauth/google";
//import ReCAPTCHA from "react-google-recaptcha";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";

const SignUp = (props) => {
  const { isMobile } = props;
  console.warn(props.ip);
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [profileGoogle, setProfileGoogle] = useState([]);
  const { login } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const loginGoooooogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      //console.log(codeResponse, "......codeResponse");
      setGoogleUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  const [regNme, setRegName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [userSocial, setUserSocial] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRecaptchaChange = (value) => {
    // console.log("CAPTCHA value:", value);
    setIsVerified(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (googleUser) {
      //console.log(googleUser);
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
          //console.log("google reg call!!!!!!!", res.data);
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

  const LoginCall = async (loginPayload) => {
    setLoading(true);
    try {
      const encryptedResponse = await apiEncryptRequest(loginPayload);
      const loginUserResponse = await instance.post(
        "/login",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      const userDetails = loginResponse[0].user;
      //console.log(loginResponse[0].user, "==!==!==loginResponse");

      login(userDetails);
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
    setLoading(false);
  };

  const RegisterCall = async () => {
    console.log("selectedCountry", selectedCountry);
    setLoading(true);
    // const storedUserFcmToken = localStorage
    //   .getItem("NewfcmUPNET")
    //   .replace(/"/g, "");

    // var login_With = "Web";
    // if (localStorage.getItem("login_with") !== null) {
    //   login_With = localStorage.getItem("login_with");
    // }
    const login_With = isPWA() ? "pwa" : "web";

    if (isVerified) {
      if (
        regNme !== "" &&
        // phone !== "" &&
        email !== "" &&
        pass !== "" &&
        confPass !== "" &&
        pass === confPass &&
        selectedCountry !== null
      ) {
        const regPayload = {
          name: regNme,
          phone: phone,
          ip: props.ip,
          email: email,
          password: pass,
          password_confirmation: confPass,
          login_by: "manual",
          is_main: "1",
          parent_id: null,
          country: selectedCountry,
        };
        const loginPayload = {
          email: email,
          password: pass,
          device_token: "", //storedUserFcmToken,
          login_with: login_With,
        };
        if (isMobile) {
          const loginPayload = {
            email: email,
            password: pass,
            login_with: login_With,
            device_token: "", //storedUserFcmToken,
          };
        }
        try {
          const encryptedResponse = await apiEncryptRequest(regPayload);
          const loginUserResponse = await instance.post(
            "/register",
            encryptedResponse
          );
          const loginResponse = await decryptData(loginUserResponse.data);
          // const userDetails = loginResponse[0].user;
          //console.log(loginResponse[0].success, "==!==!==loginResponse");
          if (loginResponse[0].success) {
            //console.log("==!==!==");
            LoginCall(loginPayload);
          }
          if (loginResponse.success) {
            // toast((t) => (
            //   <AppToast
            //     id={t.id}
            //     message={`${loginResponse.message}\n${loginResponse.ip}`}
            //     isMobile={isMobile}
            //   />
            // ));
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
          //console.error("Error during the login process:", error);
          toast((t) => (
            <AppToast id={t.id} message={error} isMobile={isMobile} />
          ));
        }
      } else {
        if (regNme == "") {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Please enter your Name"}
              isMobile={isMobile}
            />
          ));
        } else if (email == "") {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Please enter your Email"}
              isMobile={isMobile}
            />
          ));
        } else if (pass == "") {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Please enter Pssword"}
              isMobile={isMobile}
            />
          ));
        } else if (confPass == "") {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Please enter Confirm Pssword"}
              isMobile={isMobile}
            />
          ));
        } else if (pass !== confPass) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Created Password and Confirm Password not matching!"}
              isMobile={isMobile}
            />
          ));
        } else if (selectedCountry !== null || selectedCountry !== "") {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Please Select your country"}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Please enter valid details"}
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

  const SocialRegisterCall = async (data) => {
    setLoading(true);
    // const storedUserFcmToken = localStorage
    //   .getItem("NewfcmUPNET")
    //   .replace(/"/g, "");

    // var login_With = "Web";
    // if (localStorage.getItem("login_with") !== null) {
    //   login_With = localStorage.getItem("login_with");
    // }
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
        device_token: "", //storedUserFcmToken,
        login_with: login_With,
        is_main: "1",
        parent_id: null,
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
          device_token: "", //storedUserFcmToken,
          is_main: "1",
          parent_id: null,
        };
      }
      //console.log(regPayload, "..........");
      try {
        const encryptedResponse = await apiEncryptRequest(regPayload);
        const loginUserResponse = await instance.post(
          "/register",
          encryptedResponse
        );
        const loginResponse = await decryptData(loginUserResponse.data);
        //console.log(loginResponse, "GOOGLE LOGIN");
        if (loginResponse[0].success) {
          const user = loginResponse[0].user;
          // const email = loginResponse[0].email;
          // const pass = loginResponse[0].password;
          login(user);
          // const email = loginResponse[0].email;
          // const pass = loginResponse[0].password;
          // const loginPayload = {
          //   email: email,
          //   password: pass,
          // };
          // //console.log("==!==!==");
          // LoginCall(loginPayload);
        }
        //console.log(loginResponse[0]);

        // const userDetails = loginResponse[0].user;
        // //console.log(loginResponse[0].success, "==!==!==loginResponse");
        // if (loginResponse[0].success) {
        //   //console.log("==!==!==");
        //   LoginCall(loginPayload);
        // }
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
    }
    setLoading(false);
  };

  // Function to detect if the app is running as a PWA
  const isPWA = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches || // Check for standalone mode
      window.navigator.standalone // iOS-specific standalone check
    );
  };

  const handleSuccess = (credentialResponse) => {
    // Handle the successful login here
    setUserSocial(credentialResponse);
    //console.log("Google login successful", credentialResponse);
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
              height: "8v 0vh",
              width: "90%",
              marginLeft: "20px",
              //   display: "flex",
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
              {/* <button
                onClick={() => loginGoooooogle()}
                style={{
                  position: "absolute",
                  width: "90%",
                  marginTop: "4px",
                  marginLeft: "-13px",
                  height: "45px",
                  border: "none",
                  backgroundColor: "transparent",
                }}
              ></button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 15px",
                  background: "#fff",
                  borderRadius: "28px",
                  marginBottom: "25px",
                }}
              >
                <a>
                  <img src="/images/google_logo_icon.svg" alt="" />
                  <span style={{ marginLeft: "30px", fontWeight: "600" }}>
                    Sign Up with Google
                  </span>
                </a>
              </div> */}
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
              <div className="or" style={{ marginBottom: "15px" }}>
                or
              </div>
              <div>
                {/* NAME */}
                <div className="input-container">
                  <img
                    src="/images/user-white.svg"
                    alt=""
                    className="imgIcon-signup"
                  />
                  <input
                    type="text"
                    name="name"
                    className="input-signup"
                    placeholder="Name"
                    value={regNme}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                {/* Phone */}
                {/* <div className="input-container">
                  <img
                    src="/images/phone.svg"
                    alt=""
                    className="imgIcon-signup"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="number"
                    name="phone"
                    className="input-signup"
                    placeholder="Phone"
                  />
                </div> */}
                {/* Email */}
                <div className="input-container">
                  <img
                    src="/images/email.svg"
                    alt=""
                    className="imgIcon-signup"
                  />
                  <input
                    type="text"
                    name="email"
                    className="input-signup"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Pass */}
                <div className="input-container" style={{ marginTop: "15px" }}>
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
                    value={pass}
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

                  {/* </Button> */}
                </div>
                {/* Conf Pass */}
                <div className="input-container" style={{ marginTop: "15px" }}>
                  <img
                    src="/images/lock.svg"
                    alt=""
                    className="imgIcon-signup"
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    id="password-field"
                    className="input-signup"
                    name="confrim password"
                    placeholder="Confirm Password"
                    value={confPass}
                    onChange={(e) => setConfPass(e.target.value)}
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

                <div className="input-container" style={{ marginTop: "15px" }}>
                  <img
                    src="/images/location.png"
                    alt=""
                    className="imgIcon-signup"
                  />
                  <select
                    style={{
                      width: "100%",
                      padding: "10px 15px",
                      border: "0px solid white",
                      borderRadius: "30px",
                      fontSize: "18px",
                      color: "white",
                      backgroundColor: "transparent",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;utf8,
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'>
                          <path fill='%23ffffff' d='M7 10l5 5 5-5z'/>
                        </svg>")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 15px center",
                      backgroundSize: "16px",
                      outline: "none",
                    }}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select Country
                    </option>

                    {AllCountryList?.map((item, index) => (
                      <option
                        key={index}
                        value={item.name}
                        style={{ color: "black" }} // ensures dropdown items are readable
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>

                </div>
                
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "block",
                    padding: "0 10px",
                    marginTop: "10px",
                    color: "white",
                  }}
                >
                  Note: All fields are mandatory
                </span>
                {/* <div style={{ marginTop: "15px", marginLeft: "8%" }}>
                  <ReCAPTCHA
                    sitekey="b9a02264-adf6-43f6-a149-0489dbe204c9" // Replace with your reCAPTCHA site key
                    onChange={handleRecaptchaChange}
                  />
                </div> */}
                {/* <Turnstile
                  theme="light"
                  retry="auto"
                  //sitekey="0x4AAAAAAAgB7aivTPOuPMOd" // LIVE
                  sitekey={CAPTCHKEY.siteKey}
                  onVerify={(token) => handleRecaptchaChange(token)}
                /> */}
                 <ReCAPTCHA
                    sitekey="6Ld0OugrAAAAANg5wUSXM5GiOzVips3QSeR_Jcf4"
                    onChange={handleRecaptchaChange}
                  />
                <div
                  className="log-in"
                  style={{ marginLeft: "5rem" }}
                  onClick={RegisterCall}
                >
                  <a href="#" className="media-link">
                    <div
                      className="media-banner"
                      style={{
                        width: "auto",
                        height: "50px",
                        marginTop: "10px",
                        marginLeft: "30px",
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
                        style={{ fontSize: "20px", color: "#07528B" }}
                      >
                        Sign Up
                      </span>
                    </div>
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "15px",
                    marginLeft: "-25px",
                  }}
                >
                  <a
                    style={{
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "600",
                      paddingLeft: "6rem",
                    }}
                  >
                    Already registered?
                  </a>
                  <a
                    href="/login"
                    style={{
                      color: "white",
                      textDecoration: "underline",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            height: "55rem",
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
                      <a href="/auth/google">
                        <img src="/images/google_logo_icon.svg" alt="" />
                        <span>Sign Up with Google</span>
                      </a>
                    </div>
                    <div className="or">or</div>
                  </div>
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
                        name="name"
                        className="input-signup"
                        placeholder="Name"
                        value={regNme}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </div>
                    {/* Phone */}
                    {/* <div className="input-container">
                      <img
                        src="/images/phone.svg"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <input
                        type="number"
                        name="phone"
                        className="input-signup"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div> */}
                    {/* Email */}
                    <div className="input-container">
                      <img
                        src="/images/email.svg"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <input
                        type="text"
                        name="email"
                        className="input-signup"
                        placeholder="Email Address"
                        value={email}
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
                        value={pass}
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

                      {/* </Button> */}
                    </div>
                    {/* Conf Pass */}
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
                        id="password-field"
                        className="input-signup"
                        name="confrim password"
                        placeholder="Confirm Password"
                        value={confPass}
                        onChange={(e) => setConfPass(e.target.value)}
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
                    {/* Country */}
                    <div
                      className="input-container"
                      style={{ marginTop: "15px" }}
                    >
                      <img
                        src="/images/location.png"
                        alt=""
                        className="imgIcon-signup"
                      />
                      <select
                          style={{
                            width: "100%",
                                padding: "10px 15px",
                                border: "0px solid white",
                                borderRadius: "30px",
                                fontSize: "18px",
                                color: "white",
                                backgroundColor: "transparent",
                                appearance: "none",
                                backgroundImage: `url("data:image/svg+xml;utf8,
                                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'>
                                    <path fill='%23ffffff' d='M7 10l5 5 5-5z'/>
                                  </svg>")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 15px center",
                                backgroundSize: "16px",
                                outline: "none",
                              }}
                              onChange={(e) => setSelectedCountry(e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled hidden>
                                Select Country
                              </option>

                              {AllCountryList?.map((item, index) => (
                                <option
                                  key={index}
                                  value={item.name}
                                  style={{ color: "black" }} // ensures dropdown items are readable
                                >
                                  {item.name}
                                </option>
                              ))}
                            </select>

                    </div>

                    <span style={{ fontSize: "24px" }}>
                      Note: All fields are mandatory
                    </span>
                  </div>
                  <div
                    style={{
                      display: "block",
                      marginTop: "15px",
                      marginBottom: "40px",
                    }}
                  >
                    {/*  <ReCAPTCHA
                      sitekey="b9a02264-adf6-43f6-a149-0489dbe204c9" // Replace with your reCAPTCHA site key
                      onChange={handleRecaptchaChange}
                    />
                  </div> */}
                    {/* <Turnstile
                      className="dave"
                      theme="light"
                      retry="auto"
                      size="normal"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        height: "40px",
                      }}
                      // sitekey="0x4AAAAAAAgB7aivTPOuPMOd" // LIVE
                      sitekey={CAPTCHKEY.siteKey}
                      onVerify={(token) => handleRecaptchaChange(token)}
                    /> */}
                    <ReCAPTCHA
                      sitekey="6Ld0OugrAAAAANg5wUSXM5GiOzVips3QSeR_Jcf4"
                      onChange={handleRecaptchaChange}
                    />
                    
                  </div>

                  <div style={{ display: "grid", justifyItems: "center" }}>
                    <div
                      className="log-in"
                      style={{ marginRight: "0px" }}
                      onClick={RegisterCall}
                    >
                      <a href="#" className="media-link">
                        <div
                          className="media-banner"
                          style={{
                            width: "auto",
                            height: "50px",
                            marginTop: "10px",
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
                              fontSize: "24px",
                              color: "#07528B",
                              marginTop: "0px",
                            }}
                          >
                            Sign Up
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </form>
                <div className="btm desk">
                  <div className="or" style={{ fontSize: "24px" }}>
                    or
                  </div>
                  {/* <button
                    onClick={() => loginGoooooogle()}
                    style={{
                      position: "absolute",
                      width: "100%",
                      marginTop: "5px",
                      marginLeft: "-160px",
                      height: "45px",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                  ></button>
                  <div className="google-act">
                    <a
                    // style={{ marginLeft: "40px" }}
                    >
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          loginGoooooogle();
                        }}
                      >
                        <img src="/images/google_logo_icon.svg" alt="" />
                        <span style={{ fontSize: "24px" }}>
                          Sign Up with Google
                        </span>
                      </button>
                    </a>
                  </div> */}
                  <button
                    // className="google-sign-up-button"
                    style={{
                      marginLeft: "15px",
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
                  {/* <div style={{ marginLeft: "60px" }}> */}

                  {/* </div> */}

                  <span className="rgst mob" style={{ fontSize: "24px" }}>
                    Already Registered?
                  </span>
                  <a href="/login" style={{ fontSize: "24px" }}>
                    Login
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

export default SignUp;
