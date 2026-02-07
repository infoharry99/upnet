import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import "./Login.css";
import instance, {
  apiEncryptRequest,
  decryptData,
  encryptData,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";
import { useLocation } from "react-router-dom";

const OTPVerify2FA = (props) => {
  const { login } = useAuth();
  const { smuser } = useAuth();
  const location = useLocation();
  const { updateUserDetails, updateCurrencyRate, updateAppCurrency } =
    useAuth();
  const { isMobile } = props;
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // const [inputType, setInputType] = useState("");
  const email = location.state ? location.state.email : null;
  const userId = location.state ? location.state.userId : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const LoginEmailOTP = async () => {
    setLoading(true);
    if (inputValue !== "") {
      const payload = {
        user_id: userId,
        email: email,
        otp: inputValue,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/loginwithOtp",
          encryptedResponse
        );
        const loginResponse = await decryptData(loginUserResponse.data);
        console.log(loginResponse, "emailRes");

        if (loginResponse.success) {
          const userDetails = loginResponse.user;
          login(userDetails);

          window.location.href = "/vm/create";
          ChangeCurrency(userDetails.currency);

          toast((t) => (
            <AppToast
              id={t.id}
              message={loginResponse.message}
              isMobile={isMobile}
            />
          ));
          window.location.href = "/vm/create";
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={loginResponse.message}
              isMobile={isMobile}
            />
          ));
        }
      } catch (error) {
        console.error("Error during the login process:", error);
        toast((t) => (
          <AppToast id={t.id} message={error} isMobile={isMobile} />
        ));
      }
    } else {
      toast((t) => (
        <AppToast id={t.id} message={"Please enter OTP"} isMobile={isMobile} />
      ));
    }
    setLoading(false);
  };

  const GetOTP = async () => {
    setLoading(true);

    const payload = {
      user_id: userId,
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

      if (loginResponse.success) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={loginResponse.message}
            isMobile={isMobile}
          />
        ));
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={loginResponse.message}
            isMobile={isMobile}
          />
        ));
      }
    } catch (error) {
      console.error("Error during the login process:", error);
      toast((t) => <AppToast id={t.id} message={error} isMobile={isMobile} />);
    }
    setLoading(false);
  };

  const ChangeCurrency = async (currency) => {
    const payload = {
      country: currency,
      user_id: userId,
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
      const key = currency === "EUR" ? `cu_${"EURO"}` : `cu_${currency}`;
      const finalRate = currencyList[key];

      updateAppCurrency(finalRate);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    // Regex for email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // // Check if input is email
    // if (emailRegex.test(value)) {
    //   setInputType("email");
    // }
    // // Check if input is a phone number (numeric and 10-15 digits long)
    // else if (/^\d{10,15}$/.test(value)) {
    //   setInputType("phone");
    // }
    // // If neither, clear the type
    // else {
    //   setInputType("");
    // }
  };

  // const handleOTP = () => {
  //   if (inputType === "email") {
  //     console.log("Logging in with email:", inputValue);
  //     LoginEmailOTP();
  //   } else if (inputType === "phone") {
  //     console.log("Logging in with phone:", inputValue);
  //   } else {
  //     toast((t) => (
  //       <AppToast
  //         id={t.id}
  //         // message={"Invalid input. Please enter a valid email or phone number."}
  //         message={"Invalid input. Please enter a valid email."}
  //         isMobile={isMobile}
  //       />
  //     ));
  //   }
  // };

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
          <div className="heading-dotted-support" style={{ left: "3%" }}>
            Login With 2FA <span></span>
          </div>
          <div
            style={{
              backgroundImage: `url("/images/blue-box-bg.svg")`,
              backgroundSize: "cover",
              top: "2rem",
              // height: "75vh",
              width: "90%",
              marginLeft: "20px",
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
            <form className="see-full">
              <input
                type="hidden"
                name="_token"
                value="IHks1cEdGGmsvouWsdVeWVHE29KFoaLV0iN8cPkE"
              />
              <div className="form-top">
                <div className="input-container">
                  <input
                    value={inputValue}
                    type="number"
                    className="input-signup"
                    placeholder="Enter OTP"
                    onChange={handleInputChange}
                    style={{
                      appearance: "none", // General override for modern browsers
                    }}
                  />
                </div>
              </div>
            </form>
            <div
              className="log-in"
              style={{
                display: "grid",
                justifyItems: "center",
                marginTop: "2rem",
              }}
              onClick={() => {
                LoginEmailOTP();
              }}
            >
              <button
                style={{
                  width: "15rem",
                  marginLeft: "10px",
                  marginTop: "30px",
                  marginBottom: "10px",
                  zIndex: "9",
                  position: "relative",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#e97730",
                  outline: "4px solid #e97730",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
              >
                Verify With OTP
              </button>
            </div>

            <div
              className="btm desk"
              style={{ paddingRight: "10px", marginTop: "10px" }}
            >
              <span className="rgst mob" style={{ color: "white" }}>
                Not Received OTP?{" "}
              </span>
              <a
                className="underline-text"
                onClick={() => {
                  GetOTP();
                }}
              >
                Click Here
              </a>
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
            <div className="col-md-4">
              {" "}
              <div
                className="heading-dotted-support"
                style={{ left: "15%", paddingTop: "5rem" }}
              >
                Login With 2FA <span></span>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="register-main see-full"
                style={{ marginTop: "13rem" }}
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
                  <div className="form-top">
                    <div className="input-container">
                      {/* <img
                        src="/images/email.svg"
                        alt=""
                        className="imgIcon-signup"
                      /> */}
                      <input
                        value={inputValue}
                        type="number"
                        className="input-signup"
                        placeholder="Enter OTP"
                        onChange={handleInputChange}
                        style={{
                          appearance: "none", // General override for modern browsers
                        }}
                      />
                    </div>
                  </div>
                </form>
                <div
                  className="log-in"
                  style={{
                    display: "grid",
                    justifyItems: "center",
                    marginTop: "2rem",
                  }}
                  onClick={() => {
                    LoginEmailOTP();
                  }}
                >
                  <button
                    style={{
                      width: "15rem",
                      marginLeft: "10px",
                      marginTop: "30px",
                      marginBottom: "10px",
                      zIndex: "9",
                      position: "relative",
                      fontWeight: "700",
                      color: "white",
                      height: "55px",
                      backgroundColor: "#e97730",
                      outline: "4px solid #e97730",
                      border: "4px solid #ffff",
                      borderColor: "white",
                      borderRadius: "30px",
                    }}
                  >
                    Verify With OTP
                  </button>
                </div>

                <div
                  className="btm desk"
                  style={{ paddingRight: "10px", marginTop: "10px" }}
                >
                  <span className="rgst mob">Not Received OTP? </span>
                  <a
                    onClick={() => {
                      GetOTP();
                    }}
                  >
                    Click Here
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
        </div>
      )}
    </div>
  );
};

export default OTPVerify2FA;
