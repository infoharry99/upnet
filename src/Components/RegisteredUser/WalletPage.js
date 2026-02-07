import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { Button, Row } from "react-bootstrap";
import "./WalletPage.css";
import toast, { Toaster } from "react-hot-toast";
import { FaX } from "react-icons/fa6";
import instance, {
  apiEncryptRequest,
  currencyReturn,
  decryptData,
  getCurrencySymbol,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import AppToast from "../../AppToast";
import PayPalButton from "../../PayPalButton";

const WalletPage = () => {
  const location = useLocation();
  const { smuser, appCurrency } = useAuth();
  const { updateUserDetails, updateCurrencyRate, updateAppCurrency } =
    useAuth();
  const navigate = useNavigate();
  const [hash, setHash] = useState("");
  const [htmlContent, setHtmlContent] = useState(null);
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const middleListBig = ["1", "1 GB", "40 GB", "1 TB"];
  const middleListSmall = [" CPU", " RAM", " SSD Disk", " Bandwidth"];

  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [activeButton, setActiveButton] = useState("SERVER");

  const [addMoneyPopup, setAddMoneyPopup] = useState(false);
  const [rechargeMachine, setRechargeMachine] = useState(false);

  const [amount, setAmount] = useState(null);
  const [recAmount, setRecAmount] = useState(null);
  const [vmID, setVmID] = useState(null);
  const [walletData, setWalletData] = useState([]);
  const [cdnData, setCDNData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentOption, setPaymentOption] = useState(null);

  const [cdnID, setCDNID] = useState(null);
  const isServerOrCDN = location.state ? location.state.isServerOrCDN : null;
  const isFromUpnetCredit = location.state
    ? location.state.isFromCredits
    : null;
  const upnetCreditAmount = location.state
    ? location.state.upnetCreditAmount
    : null;
  const [currentCountry, setCountry] = useState(null);
  const [surcharge, setSurcharge] = useState(null);

  const innerButtons = [
    "Performance Issue",
    "Network Issue",
    "Installation Issue",
    "Sales",
    "Billing Query",
    "Other",
  ];

  const tabs = ["SERVER", "CDN"];

  function generateUniqueIdWithInitials() {
    const randomId = uuidv4(); // Generate a random UUID
    const initials = "SCVM";
    const timestamp = new Date().getTime(); // Get current timestamp in milliseconds
    return initials + timestamp + randomId.replace(/-/g, ""); // Append initials, timestamp, and remove hyphens
  }
  const generateHash = () => {
    const salt = "36e92ad5f650dfaf170c921162d665eb1fadde6d";
    const request = {
      api_key: "7ece9dfb-18ac-41f0-8c03-0d7541d9dff1",
      // other fields as necessary
    };

    const calculatedHash = hashCalculate(salt, request);
    setHash(calculatedHash);
  };

  const hashCalculate = (salt, input) => {
    const hashColumns = [
      "address_line_1",
      "address_line_2",
      "amount",
      "api_key",
      "city",
      "country",
      "currency",
      "description",
      "email",
      "mode",
      "name",
      "order_id",
      "phone",
      "return_url",
      "state",
      "udf1",
      "udf2",
      "udf3",
      "udf4",
      "udf5",
      "zip_code",
    ];

    hashColumns.sort();
    let hashData = salt;

    hashColumns.forEach((column) => {
      if (input[column] && input[column].length > 0) {
        hashData += "|" + input[column].trim();
      }
    });

    const hash = CryptoJS.SHA512(hashData)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();
    return hash;
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

  const GetPaymentGateways = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/payments",
        encryptedResponse
      );

      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "====payments");
      const payment = loginResponse.payment;
      const payArray = Object.keys(payment).map((key) => payment[key]);
      setPaymentOption(payArray);
      // console.log(payment);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const WalletCall = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/wallet",
        encryptedResponse
      );
      //console.log(loginUserResponse.data, "====loginUserResponse");
      const loginResponse = await decryptData(loginUserResponse.data);
      const userDetails = loginResponse;
      const user = loginResponse.user;
      const vm = loginResponse.vm;
      // console.log(loginResponse, "==!==!==loginResponse");
      // console.log(user, "==!==!==user");
      // console.log(vm, "==!==!==vm");
      const vmArray = Object.keys(vm).map((key) => vm[key]);
      // console.log(vmArray, "==!==!==vvmArraym");
      setWalletData(vmArray);

      const cdn = loginResponse.cdn;
      const cdnArray = Object.keys(cdn).map((key) => cdn[key]);
      // console.log(cdnArray, "==!==!==cdnArray");
      setCDNData(cdnArray);
      // const vmArray = Object.keys(vm).map((key) => vm[key]);
      // localStorage.setItem("NEW_USER", JSON.stringify(userDetails));
      // window.location.href = "/";
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const RechargeMachine = async () => {
    setLoading(true);
    if (activeButton === "SERVER") {
      if (vmID === null) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Something went wrong."}
            isMobile={isMobile}
          />
        ));
        return true;
      }
    }
    if (activeButton === "CDN") {
      if (cdnID === null) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Something went wrong."}
            isMobile={isMobile}
          />
        ));
        return true;
      }
    }

    if (recAmount !== "" && recAmount != null) {
      const payload = {
        user_id: smuser.id,
        amount:
          currentCountry === "India"
            ? recAmount
            : recAmount * (1 + surcharge / 100).toFixed(2),
        vm_id: vmID,
        cdn_id: cdnID,
      };
      console.log(payload);
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        //console.log(encryptedResponse, "=encryptedResponse");
        const loginUserResponse = await instance.post("/payby-wallet", payload);
        // console.log(loginUserResponse.data, "====RechargeMachine");
        if (loginUserResponse.data.success) {
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
        ChangeCurrency();
        WalletCall();
        setRechargeMachine(false);
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"please enter amount"}
          isMobile={isMobile}
        />
      ));
    }
    setLoading(false);
  };

  const Pay = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      amount:
        currentCountry == "India"
          ? (amount * 1.18).toFixed(3)
          : amount * (1 + surcharge / 100).toFixed(3),
    };
    console.log(payload, "payl");
    try {
      const loginUserResponse = await instance.post("/paymentrequest", payload);
      // console.log(loginUserResponse.data.response.url, "====loginUserResponse");
      const pushUrl = `${loginUserResponse.data.response.url}`;
      //console.log(pushUrl, "====pushUrl");
      window.location.href = pushUrl;
      setLoading(false);
      setAddMoneyPopup(false);
    } catch (error) {
      setLoading(false);
      console.error("Error during the login process:", error);
    }
  };

  const PhonePe = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      amount:
        currentCountry == "India"
          ? (amount * 1.18).toFixed(3)
          : amount * (1 + surcharge / 100).toFixed(3),
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/phone_pe",
        encryptedResponse
      );
      // const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse.response.url, "====phonepeResponse");
      // const loginUserResponse = await instance.post("/phone_pe", payload);
      const pushUrl = `${loginUserResponse.data.data.instrumentResponse.redirectInfo.url}`;
      // console.log(pushUrl, "====pushUrl");
      window.location.href = pushUrl;

      setLoading(false);
      setAddMoneyPopup(false);
    } catch (error) {
      setLoading(false);
      console.error("Error during the login process:", error);
    }
  };

  const disableCDN = async (pull_zone_id) => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      distribution_id: pull_zone_id,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/disable",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);

      // console.log(loginResponse, "====disableRes");
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
      ChangeCurrency();
      WalletCall();
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFromUpnetCredit) {
      setAddMoneyPopup(true);
      setAmount(upnetCreditAmount);
    }
    // console.log(prevLocRef.current.pathname, "lastPP");
    setActiveButton(isServerOrCDN ? isServerOrCDN : "SERVER");
    GetPaymentGateways();
    WalletCall();
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    if (localStorage.getItem("current_country") !== null) {
      const Country = localStorage.getItem("current_country");
      setCountry(Country);
    }
    if (localStorage.getItem("surcharge") !== null) {
      const surcharge = localStorage.getItem("surcharge");
      setSurcharge(surcharge);
    }
    // console.log(localStorage.getItem("surcharge"), "asd");

    // if (window.paypal) {
    //   console.log("PayPal SDK loaded successfully");
    // } else {
    //   console.log("PayPal SDK not loaded");
    // }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const calculateDaysDifference = (extendsdate) => {
    // console.log(extendsdate, "date");
    if (extendsdate) {
      const today = new Date();
      const target = new Date(extendsdate);
      const differenceInTime = target.getTime() - today.getTime();
      const differenceInDays = Math.floor(
        differenceInTime / (1000 * 3600 * 24)
      );

      return (
        <div>
          {" "}
          {differenceInDays > 0
            ? `${differenceInDays} Days to Expire`
            : differenceInDays === 0
            ? "Expires Today"
            : "Expired"}
        </div>
      );
    }
  };

  const PayPalhandleSuccess = (details) => {
    // console.log("Payment successful:", details);
    if (details.status === "COMPLETED") {
      const purchaseUnits = details.purchase_units[0];
      toast((t) => (
        <AppToast
          id={t.id}
          message={`Payment of Amount ${purchaseUnits.amount.value} Paid Successfully.`}
          isMobile={isMobile}
        />
      ));
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={`${details.status}\nAmount Paid UnSuccessfully.`}
          isMobile={isMobile}
        />
      ));
    }
    sendPaypalAPiResponse(details);
  };

  const sendPaypalAPiResponse = async (details) => {
    console.log(details, "RES");
    setLoading(true);
    const purchaseUnits = details.purchase_units[0];

    const payload = {
      user_id: smuser.id,
      amount: purchaseUnits.amount.value,
      currency_code: purchaseUnits.amount.currency_code,
      transaction_id: details.id,
      response: details,
      status: details.status,
    };
    try {
      // const encryptedResponse = await apiEncryptRequest(payload);
      // const loginUserResponse = await instance.post(
      //   "/paypalresponse",
      //   encryptedResponse
      // );
      // const loginResponse = await decryptData(loginUserResponse.data);
      const paypalresponse = await instance.post("/paypalresponse", payload);
      console.log(paypalresponse, "====paypalresponse");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "65rem",
        position: "relative",
        backgroundImage: isMobile ? `url(/main-bg.jpg)` : `url(/main-bg.jpg)`,
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
      {addMoneyPopup && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backdropFilter: "blur(50px)",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              border: "2px solid #e97730",
              top: isMobile
                ? currentCountry !== "India"
                  ? "20%"
                  : "15%"
                : currentCountry == "India"
                ? "15%"
                : "8%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile
                ? "80%"
                : currentCountry == "India"
                ? "40%"
                : "50%",
              height: isMobile
                ? currentCountry !== "India"
                  ? "47%"
                  : "50%"
                : currentCountry == "India"
                ? "25rem"
                : "45rem",
              overflow: "auto",
            }}
          >
            <div style={{ display: "grid", justifyItems: "center" }}>
              <button
                style={{
                  color: "#035189",
                  position: "absolute",
                  marginTop: "5px",
                  right: "5px",
                  border: "none",
                  backgroundColor: "transparent",
                  width: "30px",
                  height: "26px",
                }}
                onClick={() => {
                  setAmount(null);
                  setAddMoneyPopup(false);
                }}
              >
                <FaX
                  style={{
                    color: "red",
                    fontSize: "1.5rem",
                  }}
                />
              </button>
              <h4 style={{ marginTop: "20px" }}>Add Money</h4>

              <div
                className="popup-input-container"
                style={{
                  top: "0px",
                  right: "0px",
                  marginTop: isMobile ? "60px" : "20px",
                  width: isMobile ? "80%" : "",
                }}
              >
                {getCurrencySymbol(smuser.prefer_currency)}
                <input
                  value={amount}
                  type="number"
                  name="amount"
                  // className="input-signup"
                  placeholder="Email Address"
                  style={{
                    borderRadius: "10px",
                    width: isMobile ? "13rem" : "25rem",
                    marginTop: "-2px",
                  }}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {amount !== null && amount !== "" ? (
                <h6
                  style={{
                    // minWidth: "30rem",
                    textAlign: "center",
                    marginTop: "2.3rem",
                    // position: "absolute",
                    // color: "black",
                  }}
                >
                  {isMobile ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center", // Center-align items horizontally
                          gap: "15px", // Adds space between each item
                          marginTop: "35px",
                        }}
                      >
                        <span
                          style={{
                            zIndex: "9",
                            position: "relative",
                            fontSize: "15px",
                            color: "white",
                            padding: "15px",
                            height: "55px",
                            backgroundColor: "#e97730",
                            outline: "3px solid #e97730",
                            border: "3px solid #ffff",
                            borderRadius: "30px",
                          }}
                        >
                          INVOICE Amount: <strong>{amount}</strong>
                        </span>
                        {currentCountry == "India" ? (
                          <span
                            style={{
                              zIndex: "9",
                              position: "relative",
                              fontSize: "15px",
                              color: "white",
                              padding: "15px",
                              height: "55px",
                              backgroundColor: "#e97730",
                              outline: "3px solid #e97730",
                              border: "3px solid #ffff",
                              borderRadius: "30px",
                            }}
                          >
                            <strong>18%</strong>{" "}
                            {smuser.prefer_currency === "INR" ? "GST" : "VAT"}
                          </span>
                        ) : (
                          <span
                            style={{
                              zIndex: "9",
                              position: "relative",
                              fontSize: "15px",
                              color: "white",
                              padding: "15px",
                              height: "55px",
                              backgroundColor: "#e97730",
                              outline: "3px solid #e97730",
                              border: "3px solid #ffff",
                              borderRadius: "30px",
                            }}
                          >
                            <strong>{surcharge} %</strong> surcharge{" "}
                          </span>
                        )}
                        <span
                          style={{
                            zIndex: "9",
                            position: "relative",
                            fontSize: "15px",
                            color: "white",
                            padding: "15px",
                            height: "55px",
                            backgroundColor: "#e97730",
                            outline: "3px solid #e97730",
                            border: "3px solid #ffff",
                            borderRadius: "30px",
                          }}
                        >
                          FINAL Amount:{" "}
                          {currentCountry == "India" ? (
                            <strong>{(amount * 1.18).toFixed(2)}</strong>
                          ) : (
                            <strong>{amount * (1 + surcharge / 100)}</strong>
                          )}
                        </span>

                        {currentCountry == "India" && (
                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "20px",
                            }}
                          >
                            {paymentOption &&
                              paymentOption.map((item, idx) => (
                                <button
                                  style={{
                                    color: "white",
                                    width: "18rem",
                                    height: "45px",
                                    backgroundColor: "#e97730",
                                    borderRadius: "25px",
                                    border: "2px solid #ffff",
                                    outline: "2px solid #035189",
                                    fontWeight: "600",
                                    fontSize: "20px",
                                  }}
                                  onClick={() => {
                                    if (amount != null && amount !== "") {
                                      if (amount < 2) {
                                        toast((t) => (
                                          <AppToast
                                            id={t.id}
                                            message={
                                              "Please enter amount more than 1"
                                            }
                                            isMobile={isMobile}
                                          />
                                        ));
                                      } else {
                                        item.payment_type_key.toLowerCase() ==
                                        "agreepay"
                                          ? Pay()
                                          : PhonePe();
                                      }
                                    } else {
                                      toast((t) => (
                                        <AppToast
                                          id={t.id}
                                          message={"Please enter amount"}
                                          isMobile={isMobile}
                                        />
                                      ));
                                    }
                                  }}
                                >
                                  {item.payment_type_key.toLowerCase() ==
                                  "agreepay"
                                    ? "Pay Now"
                                    : item.payment_type}
                                  {/* Pay Now */}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          // width: isMobile ? "8rem" : "25rem",
                          //  marginTop: "20px",
                          zIndex: "9",
                          position: "relative",
                          fontSize: "20px",
                          fontSize: "15px",
                          color: "white",
                          padding: "10px",
                          height: "55px",
                          backgroundColor: "#e97730",
                          outline: "3px solid #e97730",
                          border: "3px solid #ffff",
                          borderColor: "white",
                          borderRadius: "30px",
                        }}
                      >
                        INVOICE Amount: <strong>{amount}</strong>
                      </span>
                      {currentCountry == "India" ? (
                        <span
                          style={{
                            // width: isMobile ? "8rem" : "25rem",
                            //  marginTop: "20px",
                            marginLeft: "10px",
                            zIndex: "9",
                            position: "relative",
                            fontSize: "20px",
                            fontSize: "15px",
                            color: "white",
                            padding: "10px",
                            height: "55px",
                            backgroundColor: "#e97730",
                            outline: "3px solid #e97730",
                            border: "3px solid #ffff",
                            borderColor: "white",
                            borderRadius: "30px",
                          }}
                        >
                          <strong>18%</strong>{" "}
                          {smuser.prefer_currency === "INR" ? "GST" : "VAT"}{" "}
                        </span>
                      ) : (
                        <>
                          <span
                            style={{
                              // width: isMobile ? "8rem" : "25rem",
                              //  marginTop: "20px",
                              marginLeft: "10px",
                              zIndex: "9",
                              position: "relative",
                              fontSize: "20px",
                              fontSize: "15px",
                              color: "white",
                              padding: "10px",
                              height: "55px",
                              backgroundColor: "#e97730",
                              outline: "3px solid #e97730",
                              border: "3px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                          >
                            <strong>{surcharge} %</strong> surcharge{" "}
                          </span>
                        </>
                      )}
                      <span
                        style={{
                          // width: isMobile ? "8rem" : "25rem",
                          //  marginTop: "20px",
                          marginLeft: "10px",
                          zIndex: "9",
                          position: "relative",
                          fontSize: "20px",
                          fontSize: "15px",
                          color: "white",
                          padding: "10px",
                          height: "55px",
                          backgroundColor: "#e97730",
                          outline: "3px solid #e97730",
                          border: "3px solid #ffff",
                          borderColor: "white",
                          borderRadius: "30px",
                        }}
                      >
                        FINAL Amount:{" "}
                        {currentCountry == "India" ? (
                          <strong>{(amount * 1.18).toFixed(2)}</strong>
                        ) : (
                          <strong>{amount * (1 + surcharge / 100)}</strong>
                        )}
                      </span>
                    </>
                  )}
                </h6>
              ) : null}

              {isMobile ? (
                <></>
              ) : (
                currentCountry == "India" && (
                  <div
                    style={{
                      marginTop: isMobile ? "150px" : "30px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {paymentOption &&
                      paymentOption.map((item, idx) => (
                        <button
                          key={idx}
                          style={{
                            color: "white",
                            width: "18rem",
                            height: "45px",
                            backgroundColor: "#e97730",
                            borderRadius: "25px",
                            border: "2px solid #ffff",
                            outline: "2px solid #035189",
                            fontWeight: "600",
                            fontSize: "20px",
                          }}
                          onClick={() => {
                            if (amount != null && amount !== "") {
                              if (amount < 2) {
                                toast((t) => (
                                  <AppToast
                                    id={t.id}
                                    message={"Please enter amount more than 1"}
                                    isMobile={isMobile}
                                  />
                                ));
                              } else {
                                item.payment_type_key.toLowerCase() ==
                                "agreepay"
                                  ? Pay()
                                  : PhonePe();
                              }
                            } else {
                              toast((t) => (
                                <AppToast
                                  id={t.id}
                                  message={"Please enter amount"}
                                  isMobile={isMobile}
                                />
                              ));
                            }
                          }}
                        >
                          {item.payment_type_key.toLowerCase() == "agreepay"
                            ? "Pay Now"
                            : item.payment_type}
                          {/* Pay Now */}
                        </button>
                      ))}
                  </div>
                )
              )}
              {amount && currentCountry !== "India" && (
                <div
                  style={{
                    marginTop: "40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Stripe */}
                  <img
                    src="/images/stripe.jpg"
                    style={{
                      width: "15rem",
                      height: "45px",
                      borderRadius: "5px",
                    }}
                    onClick={() => {
                      if (amount != null && amount !== "") {
                        if (amount < 2) {
                          toast((t) => (
                            <AppToast
                              id={t.id}
                              message={"Please enter amount more than 1"}
                              isMobile={isMobile}
                            />
                          ));
                        } else {
                          navigate("/stripe-paymentpage", {
                            state: { amount: amount },
                          });
                        }
                      } else {
                        toast((t) => (
                          <AppToast
                            id={t.id}
                            message={"Please enter amount"}
                            isMobile={isMobile}
                          />
                        ));
                      }
                    }}
                  />
                  {/* Paypal */}
                  <div style={{ width: "100%", marginTop: "11px" }}>
                    <PayPalButton
                      amount={amount}
                      onSuccess={PayPalhandleSuccess}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-support">
            Wallet <span></span>
          </div>

          {rechargeMachine && (
            <div
              style={{
                content: "",
                top: "0",
                left: "0",
                right: "0",
                position: "fixed",
                width: "100%",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: "999999999999",
              }}
            >
              <div>
                <img
                  src="/admin/images/admin/transaction-failed/transaction-failed-bg.png"
                  style={{
                    width: "23.8rem",
                    height: "15rem",
                    position: "absolute",
                    marginTop: "90%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* Close Button */}
                <div onClick={() => setRechargeMachine(false)}>
                  {" "}
                  <FaX
                    style={{
                      position: "absolute",
                      top: "16.5rem",
                      right: "2rem",
                      color: "#b71b1b",
                      display: "inline-block",
                      fontSize: "1.5rem",
                      zIndex: "9999999999999",
                    }}
                  />
                </div>
                <div
                  className="popup-input-container"
                  style={{ marginLeft: "20px", marginTop: "-25px" }}
                >
                  {getCurrencySymbol(smuser.prefer_currency)}
                  <input
                    value={recAmount}
                    type="text"
                    name="amount"
                    placeholder="Enter Amount"
                    style={{
                      borderRadius: "10px",
                      // width: "20rem",
                      marginTop: "-2px",
                    }}
                    onChange={(e) => setRecAmount(e.target.value)}
                  />
                  <div
                    className="buttons-addmoney"
                    style={{
                      textAlign: "left",
                      paddingLeft: "15px",
                      marginLeft: "-30px",
                      width: "21rem",
                    }}
                    onClick={() => RechargeMachine()}
                  >
                    {" "}
                    <span style={{ fontWeight: "700", fontSize: "16px" }}>
                      Click Here & Pay by Wallet
                    </span>
                    <span
                      style={{
                        marginLeft: "5px",
                        fontSize: "18px",
                        color: "#e97730",
                        backgroundColor: "white",
                        borderRadius: "20px",
                      }}
                    >
                      {" "}
                      {smuser && smuser.platform_status == 0
                        ? currencyReturn({
                            price: smuser.total_credit,
                            symbol: smuser.prefer_currency,
                            rates: appCurrency,
                          })
                        : currencyReturn({
                            price: smuser.total_credit_cloud,
                            symbol: smuser.prefer_currency,
                            rates: appCurrency,
                          })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className="features-section-solution"
            style={{ marginTop: "0px" }}
          >
            <div
              style={{
                position: "relative",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  boxShadow: "0 0.2rem 0.3rem rgba(0, 0, 0, 0.2)",
                  borderRadius: "3rem",
                  // display: "flex",
                }}
              >
                <div
                  style={{
                    padding: "0.3rem 1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span>Wallet Balance: </span>
                  <span
                    style={{
                      color: "#035189",
                      fontSize: "1.7rem",
                      fontWeight: "500",
                      marginLeft: "1rem",
                    }}
                  >
                    {" "}
                    <sub
                      style={{
                        lineHeight: "100%",
                        verticalAlign: "baseline",
                        fontSize: "1.2rem",
                        marginRight: "0.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {/* {getCurrencySymbol(smuser.prefer_currency)} */}
                    </sub>
                    {smuser && smuser.platform_status == 0
                      ? currencyReturn({
                          price: smuser.total_credit,
                          symbol: smuser.prefer_currency,
                          rates: appCurrency,
                        })
                      : currencyReturn({
                          price: smuser.total_credit_cloud,
                          symbol: smuser.prefer_currency,
                          rates: appCurrency,
                        })}
                    {/* {smuser && smuser.platform_status == 0
                      ? smuser.total_credit
                      : smuser.total_credit_cloud} */}
                  </span>
                </div>
                <div
                  className="log-in"
                  style={{
                    display: "grid",
                    justifyItems: "center",
                    // marginBottom: "6px",
                    // marginRight: "10px",
                    // marginLeft: "30%",
                  }}
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
                      onClick={() => {
                        setAmount(null);
                        setAddMoneyPopup(true);
                      }}
                    >
                      <img
                        className="normal-banner"
                        src="/admin/images/admin/wallet/add-money-btn.png"
                        alt=""
                        style={{ width: "110px", height: "40px" }}
                      />
                      <img
                        className="hover-img-banner"
                        src="/admin/images/admin/wallet/recharge-btn.png"
                        alt="/admin/images/admin/wallet/recharge-btn.png"
                        style={{ width: "110px", height: "40px" }}
                      />
                      <span
                        className="login-text"
                        style={{
                          color: "white",
                          fontSize: "17px",
                          marginTop: "-5px",
                          fontWeight: "600",
                        }}
                      >
                        Add Money
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  // marginLeft: "7rem",
                  marginTop: "1rem",
                }}
              >
                {tabs.map((title, idx) => (
                  <Button
                    key={idx}
                    style={{
                      background: `${
                        activeButton === title ? "#f47c20" : "#035189"
                      }`,
                      border: "none",
                      fontSize: "20px",
                      padding: "5px 15px",
                      color: "#fff",
                      fontWeight: "600",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                    onClick={() => {
                      setActiveButton(title);
                      if (activeButton === "SERVER") {
                        setCDNID(null);
                      }
                      if (activeButton === "CDN") {
                        setVmID(null);
                      }
                    }}
                  >
                    {title}
                  </Button>
                ))}
              </div>

              {/* Server */}
              {activeButton === "SERVER" && (
                <div
                  className="wallet-container"
                  style={{ marginTop: "5rem", width: "95%" }}
                >
                  <div className="wallet-box">
                    {walletData &&
                      walletData.map((item, idx) => (
                        <div className="wallet-col">
                          <div
                            style={{
                              // width: "15%",
                              padding: "0rem 1rem",
                            }}
                          >
                            <img
                              src="/admin/images/admin/wallet/name-bg.png"
                              alt="/admin/images/admin/wallet/name-bg.png"
                            />
                            {/* MACHINE NAME */}
                            <div
                              style={{
                                marginTop: "-50px",
                                position: "relative",
                                zIndex: "9",
                                height: "60px",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "center",
                                  fontSize: "18px",
                                  color: "black",
                                  fontWeight: "500",
                                }}
                              >
                                {item.vm_name}
                              </p>
                            </div>
                          </div>
                          {/* MIDDLE */}
                          <div
                            style={{
                              // width: "15%",
                              padding: "0rem 1rem",
                            }}
                          >
                            <img
                              src="/admin/images/admin_old/new-mobile-icons/wallet/machine-config-bg.png"
                              alt="/admin/images/admin_old/new-mobile-icons/wallet/machine-config-bg.png"
                              style={{
                                height: "12rem",
                              }}
                            />

                            <div
                              style={{
                                marginTop: "-11.5rem",
                                position: "relative",
                                zIndex: "9",
                                height: "4rem",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                              }}
                            >
                              <div className="details-label">
                                {item.cpu}
                                <span>{middleListSmall[0]}</span>
                              </div>
                              <div className="details-label">
                                {item.ram / 1024} GB
                                <span>{middleListSmall[1]}</span>
                              </div>
                              <div className="details-label">
                                {item.disk_type == "hdd"
                                  ? item.hard_disk
                                  : item.disk_type == "nvme"
                                  ? item.nvme
                                  : item.ssd}{" "}
                                GB
                                <span>{middleListSmall[2]}</span>
                              </div>
                              <div className="details-label">
                                {item.data_transfer} TB
                                <span>{middleListSmall[3]}</span>
                              </div>
                            </div>
                          </div>
                          {/* PRICE */}
                          <div
                            style={{
                              // width: "15%",
                              marginTop: "130px",
                              padding: "0rem 1rem",
                            }}
                          >
                            <img
                              src="/admin/images/admin/wallet/name-bg.png"
                              alt="/admin/images/admin/wallet/name-bg.png"
                              // style={ width: "14rem",
                              // }
                            />

                            <div
                              style={{
                                fontSize: "2rem",
                                fontWeight: "500",
                                // marginRight: "0.3rem",
                                width: "14rem",
                                marginTop: "-4.5rem",
                                position: "relative",
                                zIndex: "9",
                                height: "4rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {currencyReturn({
                                price: item.machine_o_rate,
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}
                              {/* <FaRupeeSign
                              style={{
                                color: "black",
                                marginBottom: "-3px",
                              }}
                            />{" "}
                            0.00 */}
                            </div>
                          </div>
                          {/* Button */}
                          <div
                            className="log-in"
                            style={{
                              marginTop: "10px",
                            }}
                            onClick={() => {
                              setVmID(item.vm_id);
                              setRechargeMachine(true);
                            }}
                          >
                            <a className="media-link">
                              <div
                                className="media-banner"
                                style={{
                                  minWidth: "9rem",
                                  // height: "50px",
                                  marginTop: "10px",
                                  // marginLeft: "0.5rem",
                                }}
                              >
                                <img
                                  className="normal-banner"
                                  src="/admin/images/admin/wallet/add-money-btn.png"
                                  alt=""
                                />
                                <img
                                  className="hover-img-banner"
                                  src="/admin/images/admin/wallet/recharge-btn.png"
                                  alt="/admin/images/admin/wallet/recharge-btn.png"
                                />
                                <span
                                  className="login-text"
                                  style={{
                                    color: "white",
                                    fontSize: "20px",
                                    marginTop: "0px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Recharge
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* CDN */}
              {activeButton === "CDN" && (
                <div
                  className="wallet-container"
                  style={{ marginTop: "5rem", width: "95%" }}
                >
                  <div className="wallet-box">
                    {cdnData &&
                      cdnData.map((item, idx) => (
                        <div
                          className="wallet-col"
                          style={{ justifyContent: "normal", gap: "20px" }}
                        >
                          <div
                            style={{
                              // width: "15%",
                              padding: "0rem 1rem",
                            }}
                          >
                            <img
                              src="/admin/images/admin/wallet/name-bg.png"
                              alt="/admin/images/admin/wallet/name-bg.png"
                              // style={{
                              //   width: "14rem",
                              // }}
                            />
                            {/* Website Url */}
                            <div
                              style={{
                                // width: "14rem",
                                fontSize: "18px",
                                marginTop: "-4.5rem",
                                position: "relative",
                                zIndex: "9",
                                height: "4rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {item.website_url}
                            </div>
                          </div>
                          {/* MIDDLE */}
                          <div
                            style={{
                              // width: "15%",
                              // padding: "0rem 1rem",
                              marginLeft: "-25px",
                            }}
                          >
                            <img
                              src="/admin/images/admin_old/new-mobile-icons/wallet/machine-config-bg.png"
                              alt="/admin/images/admin_old/new-mobile-icons/wallet/machine-config-bg.png"
                              style={{
                                height: "7rem",
                                width: "110%",
                              }}
                            />

                            <div
                              style={{
                                marginTop: "-6rem",
                                position: "relative",
                                zIndex: "9",
                                height: "4rem",
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                                width: "15rem",
                              }}
                            >
                              <div className="details-label">
                                Total Data: {item.datatransfer_value}{" "}
                                <span>TB</span>
                              </div>
                              <div className="details-label">
                                Remain Data:{" "}
                                {item.remaining_data
                                  ? Number(item.remaining_data).toFixed(2)
                                  : "0.0"}{" "}
                                <span>TB</span>
                              </div>
                            </div>
                          </div>

                          {/* PRICE */}
                          <div
                            style={{
                              // width: "15%",
                              padding: "0rem 1rem",
                              marginTop: "30px",
                            }}
                          >
                            <img
                              src="/admin/images/admin/wallet/name-bg.png"
                              alt="/admin/images/admin/wallet/name-bg.png"
                              style={{
                                width: "14rem",
                              }}
                            />

                            <div
                              style={{
                                fontSize: "20px",
                                fontWeight: "500",
                                // marginRight: "0.3rem",
                                width: "14rem",
                                marginTop: "-4.5rem",
                                position: "relative",
                                zIndex: "9",
                                height: "4rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              Paid:
                              {currencyReturn({
                                price: item.amount,
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}
                            </div>
                          </div>
                          {/* Remaining Data */}
                          <div
                            style={{
                              // width: "15%",
                              padding: "0rem 0rem",
                            }}
                          >
                            <img
                              src="/admin/images/admin/wallet/name-bg.png"
                              alt="/admin/images/admin/wallet/name-bg.png"
                              style={{
                                width: "14rem",
                              }}
                            />

                            <div
                              style={{
                                fontSize: "20px",
                                fontWeight: "500",
                                // marginRight: "0.3rem",
                                width: "14rem",
                                marginTop: "-4.5rem",
                                position: "relative",
                                zIndex: "9",
                                height: "4rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              Remaining:
                              {currencyReturn({
                                price: item.remaining_amount,
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}
                            </div>
                          </div>
                          {/* Button Recharge*/}
                          <div
                            className="log-in"
                            style={
                              {
                                // marginBottom: "6px",
                              }
                            }
                            onClick={() => {
                              setCDNID(item.id);
                              setRechargeMachine(true);
                            }}
                          >
                            <a className="media-link">
                              <div
                                className="media-banner"
                                style={{
                                  minWidth: "9rem",
                                  // height: "50px",
                                  marginTop: "10px",
                                  // marginLeft: "0.5rem",
                                }}
                              >
                                <img
                                  className="normal-banner"
                                  src="/admin/images/admin/wallet/add-money-btn.png"
                                  alt=""
                                />
                                <img
                                  className="hover-img-banner"
                                  src="/admin/images/admin/wallet/recharge-btn.png"
                                  alt="/admin/images/admin/wallet/recharge-btn.png"
                                />
                                <span
                                  className="login-text"
                                  style={{
                                    color: "white",
                                    fontSize: "20px",
                                    marginTop: "0px",
                                    fontWeight: "600",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.target.style.color = "#07528B")
                                  } // Change color on hover
                                  onMouseOut={(e) =>
                                    (e.target.style.color = "white")
                                  }
                                >
                                  Recharge
                                </span>
                              </div>
                            </a>
                          </div>

                          {/* { Button Disable} */}
                          {item.cdn_status !== 0 && (
                            <div
                              className="log-in"
                              style={{
                                // marginTop: "10px",
                                //marginBottom: "6px",
                                backgroundColor: "#b71b1b",
                                outline: "4px solid #b71b1b",
                                border: "4px solid #b71b1b",
                                borderColor: "white",
                                borderRadius: "30px",
                                height: "50px",
                              }}
                              onClick={() => {
                                disableCDN(item.pull_zone_id);
                              }}
                            >
                              <a className="media-link">
                                <div
                                  className="media-banner"
                                  style={{
                                    minWidth: "8rem",
                                    //height: "10px",
                                    marginBottom: "5px",
                                    // marginLeft: "0.5rem",
                                  }}
                                >
                                  <span
                                    className="login-text"
                                    style={{
                                      color: "white",
                                      fontSize: "20px",
                                      marginTop: "0px",
                                      fontWeight: "600",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.color = "#07528B")
                                    } // Change color on hover
                                    onMouseOut={(e) =>
                                      (e.target.style.color = "white")
                                    }
                                  >
                                    Disable
                                  </span>
                                </div>
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "75rem", padding: "5rem" }}
        >
          {rechargeMachine && (
            <div
              style={{
                content: "",
                top: "0",
                left: "0",
                right: "0",
                position: "fixed",
                width: "100%",
                height: "75rem",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: "999999999999",
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <div>
                  {/* inner box */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: "1",
                      padding: "2.5rem 1.5rem",
                    }}
                  >
                    {/* Close Button */}
                    <div onClick={() => setRechargeMachine(false)}>
                      {" "}
                      <FaX
                        style={{
                          position: "absolute",
                          top: "14.2rem",
                          right: "36%",
                          color: "#b71b1b",
                          display: "inline-block",
                          fontSize: "1.5rem",
                          zIndex: "9999999999999",
                        }}
                      />
                    </div>
                    {/* header */}
                    <div
                      style={{
                        backgroundImage:
                          'url("/admin/images/admin/transaction-failed/transaction-failed-bg.png")',
                        backgroundRepeat: "no-repeat",
                        position: "fixed",
                        top: "30%",
                        left: "40%",
                        width: "37%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "25rem",
                      }}
                    >
                      <div
                        className="popup-input-container"
                        style={{ right: "-20px", top: "-5rem" }}
                      >
                        {getCurrencySymbol(smuser.prefer_currency)}
                        <input
                          value={recAmount}
                          type="number"
                          name="amount"
                          placeholder="Enter Amount"
                          style={{
                            borderRadius: "10px",
                            width: "26rem",
                            marginTop: "-2px",
                          }}
                          onChange={(e) => setRecAmount(e.target.value)}
                        />
                        <button
                          className="buttons-addmoney"
                          style={{
                            // marginLeft: "-22px",
                            width: "27rem",
                            textAlign: "left",
                            paddingLeft: "25px",
                            height: "50px",
                            // paddingBottom: "5px",
                            color: "white",
                          }}
                          onClick={() => RechargeMachine()}
                        >
                          {" "}
                          <span style={{ fontWeight: "700", fontSize: "16px" }}>
                            Click Here & Pay by Wallet
                          </span>
                          <span
                            style={{
                              padding: "5px",
                              marginLeft: "20%",
                              fontSize: "18px",
                              color: "rgb(233, 119, 48)",
                              backgroundColor: "white",
                              borderRadius: "20px",
                            }}
                          >
                            {" "}
                            {smuser && smuser.platform_status == 0
                              ? currencyReturn({
                                  price: smuser.total_credit,
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })
                              : currencyReturn({
                                  price: smuser.total_credit_cloud,
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="heading-dotted-support">
            Wallet <span></span>
          </div>
          <div className="features-section-solution">
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-11">
                {htmlContent && (
                  <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    style={{
                      zIndex: "999999999999999",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "100rem",
                      height: "100rem",
                    }}
                  />
                )}
                <div
                  style={{
                    position: "relative",
                    marginTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      boxShadow: "0 0.2rem 0.3rem rgba(0, 0, 0, 0.2)",
                      borderRadius: "3rem",
                      display: "flex",
                    }}  
                  >
                    <div
                      style={{
                        padding: "0.3rem 1rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span>Wallet Balance: </span>
                      <span
                        style={{
                          color: "#035189",
                          fontSize: "1.7rem",
                          fontWeight: "500",
                          marginLeft: "1rem",
                        }}
                      >
                        {" "}
                        <sub
                          style={{
                            lineHeight: "100%",
                            verticalAlign: "baseline",
                            fontSize: "1.2rem",
                            marginRight: "0.2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {/* {getCurrencySymbol(smuser.prefer_currency)} */}
                        </sub>
                        {smuser && smuser.platform_status == 0
                          ? currencyReturn({
                              price: smuser.total_credit,
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })
                          : currencyReturn({
                              price: smuser.total_credit_cloud,
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                      </span>
                    </div>
                    <div
                      className="log-in"
                      style={{
                        marginBottom: "6px",
                        marginRight: "0px",
                        marginLeft: "auto",
                      }}
                      onClick={() => {
                        setAmount(null);
                        setAddMoneyPopup(true);
                      }}
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
                            src="/admin/images/admin/wallet/add-money-btn.png"
                            alt=""
                          />
                          <img
                            className="hover-img-banner"
                            src="/admin/images/admin/wallet/recharge-btn.png"
                            alt="/admin/images/admin/wallet/recharge-btn.png"
                          />
                          <span
                            className="login-text"
                            style={{
                              color: "white",
                              fontSize: "20px",
                              marginTop: "0px",
                              fontWeight: "600",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.color = "#07528B")
                            }
                            onMouseOut={(e) => (e.target.style.color = "white")}
                          >
                            Add Money
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                  {/*  */}

                  <div
                    style={{
                      position: "absolute",
                      // marginLeft: "7rem",
                      marginTop: "1rem",
                    }}
                  >
                    {tabs.map((title, idx) => (
                      <Button
                        key={idx}
                        style={{
                          background: `${
                            activeButton === title ? "#f47c20" : "#035189"
                          }`,
                          border: "none",
                          fontSize: "20px",
                          padding: "5px 15px",
                          color: "#fff",
                          fontWeight: "600",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                        onClick={() => {
                          setActiveButton(title);
                          if (activeButton === "SERVER") {
                            setCDNID(null);
                          }
                          if (activeButton === "CDN") {
                            setVmID(null);
                          }
                        }}
                      >
                        {title}
                      </Button>
                    ))}
                  </div>

                  {activeButton === "SERVER" && (
                    <div
                      className="wallet-container"
                      style={{ marginTop: "80px" }}
                    >
                      <div className="wallet-box-main">
                        {walletData &&
                          walletData.map((item, idx) => (
                            <div
                              className="wallet-col"
                              style={{ justifyContent: "normal", gap: "20px" }}
                            >
                              <div
                                style={{
                                  // width: "15%",
                                  padding: "0rem 1rem",
                                }}
                              >
                                <img
                                  src="/admin/images/admin/wallet/name-bg.png"
                                  alt="/admin/images/admin/wallet/name-bg.png"
                                  // style={{
                                  //   width: "14rem",
                                  // }}
                                />
                                {/* MACHINE NAME */}
                                <div
                                  style={{
                                    // width: "14rem",
                                    marginTop: "-4.5rem",
                                    position: "relative",
                                    zIndex: "9",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {item.vm_name}
                                </div>
                              </div>
                              {/* MIDDLE */}
                              <div
                                style={{
                                  // width: "15%",
                                  padding: "0rem 1rem",
                                }}
                              >
                                <img
                                  src="/admin/images/admin/wallet/details-bg.png"
                                  alt="/admin/images/admin/wallet/details-bg.png"
                                />

                                <div
                                  style={{
                                    marginTop: "-4.5rem",
                                    position: "relative",
                                    zIndex: "9",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-evenly",
                                  }}
                                >
                                  {/* {middleListBig.map((title, idx) => ( */}
                                  <div className="details-label">
                                    {item.cpu}
                                    <span>{middleListSmall[0]}</span>
                                  </div>
                                  <div className="details-label">
                                    {item.ram / 1024} GB
                                    <span>{middleListSmall[1]}</span>
                                  </div>
                                  <div className="details-label">
                                    {item.disk_type == "hdd"
                                      ? item.hard_disk
                                      : item.disk_type == "nvme"
                                      ? item.nvme
                                      : item.ssd}
                                    GB
                                    <span>{middleListSmall[2]}</span>
                                  </div>
                                  <div className="details-label">
                                    {item.data_transfer} TB
                                    <span>{middleListSmall[3]}</span>
                                  </div>
                                  {/* ))} SSD Disk", " Data Transfer"*/}
                                </div>
                              </div>
                              {/* PRICE */}
                              <div
                                style={{
                                  // width: "15%",
                                  padding: "0rem 1rem",
                                }}
                              >
                                <img
                                  src="/admin/images/admin/wallet/name-bg.png"
                                  alt="/admin/images/admin/wallet/name-bg.png"
                                  style={{
                                    width: "14rem",
                                  }}
                                />

                                <div
                                  style={{
                                    fontSize: "2rem",
                                    fontWeight: "500",
                                    // marginRight: "0.3rem",
                                    width: "14rem",
                                    marginTop: "-4.5rem",
                                    position: "relative",
                                    zIndex: "9",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {currencyReturn({
                                    price: item.machine_o_rate,
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  })}
                                </div>
                              </div>
                              {/* Remaining Days to Recharge */}
                              <div
                                style={{
                                  // width: "15%",
                                  padding: "0rem 0rem",
                                }}
                              >
                                <img
                                  src="/admin/images/admin/wallet/name-bg.png"
                                  alt="/admin/images/admin/wallet/name-bg.png"
                                  style={{
                                    width: "14rem",
                                  }}
                                />

                                <div
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    // marginRight: "0.3rem",
                                    width: "14rem",
                                    marginTop: "-4.5rem",
                                    position: "relative",
                                    zIndex: "9",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {calculateDaysDifference(item.extendsdate_at)}
                                  {/* <span>&nbsp;&nbsp;</span> Days to Expire */}
                                </div>
                              </div>
                              {/* Button Recharge*/}
                              <div
                                className="log-in"
                                style={{
                                  marginBottom: "6px",
                                }}
                                onClick={() => {
                                  setVmID(item.vm_id);
                                  setRechargeMachine(true);
                                }}
                              >
                                <a className="media-link">
                                  <div
                                    className="media-banner"
                                    style={{
                                      minWidth: "9rem",
                                      // height: "50px",
                                      marginTop: "10px",
                                      // marginLeft: "0.5rem",
                                    }}
                                  >
                                    <img
                                      className="normal-banner"
                                      src="/admin/images/admin/wallet/add-money-btn.png"
                                      alt=""
                                    />
                                    <img
                                      className="hover-img-banner"
                                      src="/admin/images/admin/wallet/recharge-btn.png"
                                      alt="/admin/images/admin/wallet/recharge-btn.png"
                                    />
                                    <span
                                      className="login-text"
                                      style={{
                                        color: "white",
                                        fontSize: "20px",
                                        marginTop: "0px",
                                        fontWeight: "600",
                                      }}
                                      onMouseOver={(e) =>
                                        (e.target.style.color = "#07528B")
                                      } // Change color on hover
                                      onMouseOut={(e) =>
                                        (e.target.style.color = "white")
                                      }
                                    >
                                      Recharge
                                    </span>
                                  </div>
                                </a>
                              </div>
                            </div>
                          ))}
                      </div>
                      {walletData.length == 0 ? (
                        <div
                          style={{
                            position: "relative",
                            left: "40%",
                            fontSize: "24px",
                            fontWeight: "400",
                          }}
                        >
                          No Records
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}

                  {activeButton === "CDN" && (
                    <div
                      className="wallet-container"
                      style={{ marginTop: "80px" }}
                    >
                      <div className="wallet-box-main">
                        {cdnData &&
                          cdnData.map((item, idx) => (
                            <div
                              className="wallet-col"
                              style={{
                                justifyContent: "normal",
                                gap: "20px",
                              }}
                            >
                              {/* Website Url */}
                              <div
                                style={{
                                  // width: "15%",
                                  padding: "0rem 1rem",
                                }}
                              >
                                <img
                                  src="/admin/images/admin/wallet/name-bg.png"
                                  alt="/admin/images/admin/wallet/name-bg.png"
                                  // style={{
                                  //   width: "14rem",
                                  // }}
                                />
                                <div
                                  style={{
                                    // width: "14rem",
                                    fontSize: "16px",
                                    marginTop: "-4.5rem",
                                    position: "relative",
                                    zIndex: "9",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {item.website_url}
                                </div>
                              </div>
                              {/* MIDDLE */}
                              <div>
                                <img
                                  src="/admin/images/admin/wallet/details-bg.png"
                                  alt="/admin/images/admin/wallet/details-bg.png"
                                />

                                <div
                                  style={{
                                    marginTop: "-4.5rem",
                                    position: "relative",
                                    zIndex: "9",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-evenly",
                                  }}
                                >
                                  <div
                                    className="details-label"
                                    style={{ fontSize: "26px" }}
                                  >
                                    Total Data: {item.datatransfer_value} TB
                                  </div>
                                  <div
                                    className="details-label"
                                    style={{ fontSize: "26px" }}
                                  >
                                    Remaining Data:{" "}
                                    {Number(item.remaining_data).toFixed(2)} TB
                                  </div>
                                </div>
                              </div>
                              {/* PRICE */}
                              <div
                                style={{
                                  // width: "15%",
                                  padding: "0.3rem 1rem",
                                }}
                              >
                                <img
                                  src="/admin/images/admin/wallet/name-bg.png"
                                  alt="/admin/images/admin/wallet/name-bg.png"
                                  style={{
                                    width: "14rem",
                                  }}
                                />

                                <div
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    // marginRight: "0.3rem",
                                    width: "14rem",
                                    marginTop: "-4.2rem",
                                    position: "relative",
                                    zIndex: "9",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Paid:
                                  {currencyReturn({
                                    price: item.amount,
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  })}
                                </div>
                              </div>
                              {/* Remaining Data */}
                              <div
                                style={{
                                  // width: "15%",
                                  padding: "0.3rem 0rem",
                                }}
                              >
                                <img
                                  src="/admin/images/admin/wallet/name-bg.png"
                                  alt="/admin/images/admin/wallet/name-bg.png"
                                  style={{
                                    width: "14rem",
                                  }}
                                />

                                <div
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    // marginRight: "0.3rem",
                                    width: "14rem",
                                    marginTop: "-4.2rem",
                                    position: "relative",
                                    zIndex: "9",
                                    height: "4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Remaining:
                                  {currencyReturn({
                                    price: item.remaining_amount,
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  })}
                                </div>
                              </div>
                              {/* Recharge */}
                              <div
                                className="log-in"
                                style={{
                                  // marginBottom: "6px",
                                  marginTop: "5px",
                                }}
                                onClick={() => {
                                  setCDNID(item.id);
                                  setRechargeMachine(true);
                                }}
                              >
                                <a className="media-link">
                                  <div
                                    className="media-banner"
                                    style={{
                                      minWidth: "9rem",
                                      // height: "50px",
                                      // marginTop: "10px",
                                      // marginLeft: "0.5rem",
                                    }}
                                  >
                                    <img
                                      className="normal-banner"
                                      src="/admin/images/admin/wallet/add-money-btn.png"
                                      alt=""
                                    />
                                    <img
                                      className="hover-img-banner"
                                      src="/admin/images/admin/wallet/recharge-btn.png"
                                      alt="/admin/images/admin/wallet/recharge-btn.png"
                                    />
                                    <span
                                      className="login-text"
                                      style={{
                                        color: "white",
                                        fontSize: "20px",
                                        marginTop: "0px",
                                        fontWeight: "600",
                                      }}
                                      onMouseOver={(e) =>
                                        (e.target.style.color = "#07528B")
                                      } // Change color on hover
                                      onMouseOut={(e) =>
                                        (e.target.style.color = "white")
                                      }
                                    >
                                      Recharge
                                    </span>
                                  </div>
                                </a>
                              </div>

                              {/* Disable */}
                              {item.cdn_status !== 0 && (
                                <div
                                  onClick={() => {
                                    disableCDN(item.pull_zone_id);
                                  }}
                                >
                                  <button
                                    style={{
                                      width: "8rem",
                                      height: "50px",
                                      marginTop: "15px",
                                      marginLeft: "-20px",
                                      zIndex: "9",
                                      position: "relative",
                                      fontWeight: "700",
                                      color: "white",
                                      backgroundColor: "#b71b1b",
                                      outline: "4px solid #b71b1b",
                                      border: "4px solid #ffff",
                                      borderColor: "white",
                                      borderRadius: "30px",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.color = "#07528B")
                                    } // Change color on hover
                                    onMouseOut={(e) =>
                                      (e.target.style.color = "white")
                                    }
                                  >
                                    Disable
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        {cdnData.length == 0 ? (
                          <div
                            style={{
                              position: "relative",
                              left: "45%",
                              fontSize: "24px",
                              fontWeight: "400",
                            }}
                          >
                            No Records
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Row>
          </div>
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

export default WalletPage;
