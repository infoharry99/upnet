import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import "../User/SignUp.css";
import instance, { apiEncryptRequest, decryptData } from "../../Api";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";

const EmailVerification = (props) => {
  const { isMobile } = props;
  const { updateUserDetails, updateCurrencyRate, updateAppCurrency } =
    useAuth();
  const { smuser } = useAuth();
  const [emailOTP, setemailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(true);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  useEffect(() => {
    if (smuser) {
      setEmail(smuser.email);
      if (smuser.emailverify !== 1) {
        setShowEmail(true);
      } else {
        // ChangeCurrency();
        window.location.href = "/vm/create";
      }
      // if (smuser.phoneverify !== 1) {
      //   setShowPhone(true);
      // }
    }
  }, [smuser]);

  const EmailVerifyCall = async () => {
    setLoading(true);
    if (emailOTP !== "") {
      const payload = {
        user_id: smuser.id,
        email: email,
        otp: emailOTP,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/getemailotp",
          encryptedResponse
        );
        const loginResponse = await decryptData(loginUserResponse.data);

        if (emailOtpSent) {
          // console.log(loginResponse, "/getemailotp after sending");
          if (loginResponse.status) {
            window.location.href = "/vm/create";
            ChangeCurrency();

            toast((t) => (
              <AppToast id={t.id} message={loginResponse.message} />
            ));
            window.location.href = "/vm/create";
          } else {
            toast((t) => (
              <AppToast id={t.id} message={loginResponse.message} />
            ));
          }
        } else {
          // console.log(loginResponse, "/getemailotp before sending");
          if (loginResponse.status) {
            setEmailOtpSent(true);

            toast((t) => (
              <AppToast id={t.id} message={loginResponse.message} />
            ));
          } else {
          }
        }
        //console.log(loginResponse.status);
      } catch (error) {
        console.error("Error during the login process:", error);
        toast((t) => <AppToast id={t.id} message={error} />);
      }
    } else {
      //toast.error("Please enter OTP");
      //console.log("enter OTP:::::");
      toast((t) => (
        <AppToast id={t.id} message={"Please enter OTP"} isMobile={isMobile} />
      ));
    }
    setLoading(false);
  };

  const resendEmailVerifyCall = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      email: email,
      otp: emailOTP,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/getemailotp",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);

      if (emailOtpSent) {
        // console.log(loginResponse, "/getemailotp after sending");
        if (loginResponse.status) {
          window.location.href = "/vm/create";
          ChangeCurrency();

          toast((t) => <AppToast id={t.id} message={loginResponse.message} />);
          window.location.href = "/vm/create";
        } else {
        }
      } else {
        // console.log(loginResponse, "/getemailotp before sending");
        if (loginResponse.status) {
          setEmailOtpSent(true);

          toast((t) => <AppToast id={t.id} message={loginResponse.message} />);
        } else {
        }
      }
      //console.log(loginResponse.status);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const PhoneVerifyCall = async () => {
    setLoading(true);
    if (phone !== "") {
      const payload = {
        user_id: smuser.id,
        phone: phone,
        otp: phoneOTP,
        name: smuser.name,
      };
      // console.log("PhoneVerifyCall", payload);
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/getmobileotp",
          encryptedResponse
        );
        const loginResponse = await decryptData(loginUserResponse.data);
        if (phoneOtpSent) {
          // console.log(loginResponse);
          if (loginResponse.status) {
            // console.log(loginResponse, "after status");
            // toast.success(loginResponse.message);
            toast((t) => (
              <AppToast
                id={t.id}
                message={loginUserResponse.data.message}
                isMobile={isMobile}
              />
            ));
            window.location.href = "/vm/create";
          } else {
            // console.log(loginResponse, "else status");
          }
        } else {
          console.log(loginResponse);
          if (loginResponse.status) {
            // console.log(loginResponse, "after status");
            setPhoneOtpSent(true);
            // alert(loginResponse.message);
          } else {
            // console.log(loginResponse, "else status");
          }
        }
        // console.log(loginResponse.data, "<<<<<<getmobileotp");
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      //toast.error("All fields are required!");
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

  const ChangeCurrency = async () => {
    const payload = {
      country: smuser.prefer_currency,
      user_id: smuser.id,
    };
    //console.log(payload);
    try {
      const loginUserResponse = await instance.post(
        "/changescurrency",
        payload
      );

      updateCurrencyRate(loginUserResponse.data.currency1);
      const updatedUser = loginUserResponse.data.response;
      const userNative_credit = loginUserResponse.data.native_credit;

      // setTest(userNative_credit);
      updateCurrencyRate(userNative_credit);
      updateUserDetails(updatedUser);

      const currencyList = loginUserResponse.data.currency1;
            console.log(currencyList, "currencyList");
      const key =
        smuser.prefer_currency === "EUR"
          ? `cu_${"EURO"}`
          : `cu_${smuser.prefer_currency}`;
      const finalRate = currencyList[key];

      updateAppCurrency(finalRate);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
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
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <div
              className="register-main see-full"
              style={{ marginTop: "8rem" }}
            >
              <div className="bg-img">
                <img
                  src="/images/blue-box-bg.svg"
                  alt=""
                  style={{
                    width: "auto",
                    height: "300px",
                  }}
                />
              </div>
              {/* Email */}
              {showEmail && (
                <>
                  <h5
                    style={{
                      fontSize: "24px",
                      color: "white",
                      fontWeight: "500",
                      textAlign: "center",
                      marginBottom: "20px",
                    }}
                  >
                    Enter OTP to verify your account. OTP sent to registred
                    email.
                  </h5>
                  <form className="see-full">
                    <input
                      type="hidden"
                      name="_token"
                      value="IHks1cEdGGmsvouWsdVeWVHE29KFoaLV0iN8cPkE"
                    />

                    <div className="form-top">
                      {/* Pass */}
                      <div
                        className="input-container"
                        style={{ marginTop: "15px" }}
                      >
                        <img
                          src="/images/email.svg"
                          alt=""
                          className="imgIcon-signup"
                        />
                        <input
                          type="text"
                          id="password-field"
                          className="input-signup"
                          name="email"
                          placeholder="Enter email"
                          value={email}
                          disabled="true"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    {emailOtpSent && (
                      <div style={{ display: "grid", justifyItems: "center" }}>
                        <div
                          className="input-container"
                          style={{ marginTop: "15px" }}
                        >
                          {" "}
                          <input
                            maxLength={6}
                            type="number"
                            id="otp-field"
                            className="input-signup"
                            name="otp"
                            placeholder="OTP"
                            value={emailOTP}
                            onChange={(e) => setemailOTP(e.target.value)}
                            style={{
                              textAlign: "center",
                              border: "none",
                              // borderBottom: "2px solid white",
                              borderRadius: "0",
                              padding: "0 0 0 7px",
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div style={{ display: "grid", justifyItems: "center" }}>
                      <div
                        className="log-in"
                        // style={{ marginLeft: "-7rem" }}
                        onClick={EmailVerifyCall}
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
                                fontSize: "20px",
                                color: "#07528B",
                                marginTop: "0px",
                              }}
                            >
                              {/* {emailOtpSent ? "Verify OTP" : "Send OTP"} */}
                              {"Verify OTP"}
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </form>
                  <div className="btm desk">
                    <span className="rgst mob">Not Received OTP? </span>
                    <a onClick={resendEmailVerifyCall}>Click Here</a>
                  </div>
                </>
              )}

              {/* PHONEE */}
              {/* {showPhone && (
                <>
                  <h5
                    style={{
                      fontSize: "24px",
                      color: "white",
                      fontWeight: "500",
                      textAlign: "center",
                      marginTop: "50px",
                    }}
                  >
                    Enter your phone number to verify your account
                  </h5>
                  <form className="see-full">
                    <div className="form-top">
                      <div
                        className="input-container"
                        style={{ marginTop: "15px" }}
                      >
                        <img
                          src="/images/phone.svg"
                          alt=""
                          className="imgIcon-signup"
                        />
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid rgb(255 255 255)",
                          }}
                          // onChange={(e) => changeCurrency(e.target.value)}
                        >
                          <option value="+91" selected>
                            IND
                          </option>
                        </select>
                        <input
                          type="number"
                          id="password-field"
                          className="input-signup"
                          name="phone"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    {phoneOtpSent && (
                      <div
                        style={{
                          marginTop: "20px",
                          marginLeft: "90px",
                        }}
                      >
                        <input
                          maxLength={6}
                          type="number"
                          id="otp-field"
                          className="input-signup"
                          name="otp"
                          placeholder="OTP"
                          value={phoneOTP}
                          onChange={(e) => setPhoneOTP(e.target.value)}
                          style={{
                            textAlign: "center",
                            border: "none",
                            borderBottom: "2px solid white",
                            borderRadius: "0",
                            padding: "0 0 0 7px",
                          }}
                        />
                      </div>
                    )}

                    <div
                      className="log-in"
                      style={{ marginLeft: "-7rem" }}
                      onClick={PhoneVerifyCall}
                    >
                      <a className="media-link">
                        <div
                          className="media-banner"
                          style={{
                            width: "auto",
                            height: "50px",
                            marginTop: "10px",
                            marginLeft: "14.5rem",
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
                            {phoneOtpSent ? "Verify OTP" : "Send OTP"}
                          </span>
                        </div>
                      </a>
                    </div>
                  </form>
                  <div className="btm desk">
                    <span className="rgst mob">Not Received OTP? </span>
                    <a onClick={PhoneVerifyCall}>Click Here</a>
                  </div>
                </>
              )} */}
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            width: "100%",
            minHeight: "65rem",
            position: "relative",
            backgroundImage: isMobile
              ? `url(/main-bg.jpg)`
              : `url(/main-bg.jpg)`,
            backgroundSize: "cover",
            backgroundRepeat: "round",
            backgroundBlendMode: "overlay",
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
                  <img
                    src="/images/blue-box-bg.svg"
                    alt=""
                    style={{ marginLeft: "15%", width: "65%", padding: "4%" }}
                  />
                </div>
                {/* EMAIL */}
                {showEmail && (
                  <>
                    <h5
                      style={{
                        fontSize: "24px",
                        color: "white",
                        fontWeight: "500",
                        textAlign: "center",
                        marginBottom: "20px",
                      }}
                    >
                      Enter OTP to verify your account. OTP sent to registred
                      email.
                    </h5>
                    <form className="see-full">
                      <input
                        type="hidden"
                        name="_token"
                        value="IHks1cEdGGmsvouWsdVeWVHE29KFoaLV0iN8cPkE"
                      />

                      <div className="form-top">
                        {/* Pass */}
                        <div
                          className="input-container"
                          style={{ marginTop: "15px" }}
                        >
                          <img
                            src="/images/email.svg"
                            alt=""
                            className="imgIcon-signup"
                          />
                          <input
                            type="text"
                            id="password-field"
                            className="input-signup"
                            name="email"
                            placeholder="Enter email"
                            value={email}
                            disabled="true"
                            onChange={(e) => setEmail(e.target.value)}
                          />

                          {/* </Button> */}
                        </div>
                      </div>
                      {emailOtpSent && (
                        <div
                          style={{ display: "grid", justifyItems: "center" }}
                        >
                          <div
                            className="input-container"
                            style={{ marginTop: "15px" }}
                          >
                            <input
                              maxLength={6}
                              type="number"
                              id="otp-field"
                              className="input-signup"
                              name="otp"
                              placeholder="OTP"
                              value={emailOTP}
                              onChange={(e) => setemailOTP(e.target.value)}
                              style={{
                                textAlign: "center",
                                border: "none",
                                // borderBottom: "2px solid white",
                                borderRadius: "0",
                                padding: "0 0 0 7px",
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div style={{ display: "grid", justifyItems: "center" }}>
                        <div
                          className="log-in"
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                          onClick={() => {
                            EmailVerifyCall();
                          }}
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
                                  fontSize: "20px",
                                  color: "#07528B",
                                  marginTop: "0px",
                                }}
                              >
                                {/* {emailOtpSent ? "Verify OTP" : "Send OTP"} */}
                                {"Verify OTP"}
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </form>
                    <div className="btm desk">
                      <span className="rgst mob">Not Received OTP? </span>
                      <a onClick={resendEmailVerifyCall}>Click Here</a>
                    </div>
                  </>
                )}

                {/* PHONE */}
                {/* <>
                  {showPhone && (
                    <>
                      <h5
                        style={{
                          fontSize: "24px",
                          color: "white",
                          fontWeight: "500",
                          textAlign: "center",
                          marginBottom: "20px",
                          marginTop: "40px",
                        }}
                      >
                        Enter your phone number to verify your account
                      </h5>
                      <form className="see-full">
                        <input
                          type="hidden"
                          name="_token"
                          value="IHks1cEdGGmsvouWsdVeWVHE29KFoaLV0iN8cPkE"
                        />

                        <div className="form-top">
                          
                          <div
                            className="input-container"
                            style={{ marginTop: "15px" }}
                          >
                            <img
                              src="/images/phone.svg"
                              alt=""
                              className="imgIcon-signup"
                            />
                            <select
                              name="plan_time"
                              style={{
                                borderRadius: "30px",
                                marginRight: "10px",
                                padding: "10px 15px",
                                border: "2px solid rgb(255 255 255)",
                              }}
                              // onChange={(e) => changeCurrency(e.target.value)}
                            >
                              <option value="+91" selected>
                                IND
                              </option>
                            </select>
                            <input
                              type="number"
                              id="password-field"
                              className="input-signup"
                              name="phone"
                              placeholder="Enter phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />

                            
                          </div>
                        </div>
                        {phoneOtpSent && (
                          <div
                            style={{
                              marginTop: "20px",
                              marginLeft: "190px",
                            }}
                          >
                            <input
                              maxLength={6}
                              type="number"
                              id="otp-field"
                              className="input-signup"
                              name="otp"
                              placeholder="OTP"
                              value={phoneOTP}
                              onChange={(e) => setPhoneOTP(e.target.value)}
                              style={{
                                textAlign: "center",
                                color: "white",
                                border: "none",
                                borderBottom: "2px solid white",
                                borderRadius: "0",
                                padding: "0 0 0 7px",
                              }}
                            />
                          </div>
                        )}

                        <div
                          className="log-in"
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                          onClick={PhoneVerifyCall}
                        >
                          <a className="media-link">
                            <div
                              className="media-banner"
                              style={{
                                width: "auto",
                                height: "50px",
                                marginTop: "10px",
                                marginLeft: "14.5rem",
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
                                {phoneOtpSent ? "Verify OTP" : "Send OTP"}
                              </span>
                            </div>
                          </a>
                        </div>
                      </form>
                      <div className="btm desk">
                        <span className="rgst mob">Not Received OTP? </span>
                        <a onClick={PhoneVerifyCall}>Click Here</a>
                      </div>
                    </>
                  )}
                </> */}
              </div>
            </div>
            <div className="col-md-4"></div>
          </Row>
        </div>
      )}
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
    </div>
  );
};

export default EmailVerification;