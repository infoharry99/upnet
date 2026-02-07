import React, { createContext, useContext, useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaRupeeSign } from "react-icons/fa";
import ProfilePopUp from "./common/ProfilePopUp";
import { useAuth } from "../AuthContext";
import axios from "axios";
import instance, {
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "../Api";

const DropdownContext = createContext();
export const DropdownProvider = ({ children }) => {
  const [dropdownValue, setDropdownValue] = useState("Global");

  return (
    <DropdownContext.Provider value={{ dropdownValue, setDropdownValue }}>
      {children}
    </DropdownContext.Provider>
  );
};
export const useDropdown = () => {
  return useContext(DropdownContext);
};

const Header = (props) => {
  const navigate = useNavigate();

  const { updateUserDetails, updateCurrencyRate, updateAppCurrency } =
    useAuth();
  const { smuser, isLoginByParentUser } = useAuth();
  const { currencyRates, appCurrency } = useAuth();
  function isMobileDevice() {
    return window.matchMedia("(max-width: 1000px)").matches;
  }

  const [currentUser, setCurrentUser] = useState(props.user);
  const [showProfile, setShowProfile] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [activeKey, setActiveKey] = useState("/");
  const [platform, setPlatform] = useState("");
  const [userCountry2, setUserCountry2] = useState("");
  const [test, setTest] = useState("");
  const [popUpType, setPopUpType] = useState("");
  const [serverLocation, setServerLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const { dropdownValue, setDropdownValue } = useDropdown();
  // const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [preferCurrency, setPreferCurrency] = useState("");
  const [isClick, setIsClick] = useState(false);

  const [countryCodes, setCountryCodes] = useState("");
  const staticCodes = ["INR", "USD", "GBP"];
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };
  // const { userData, logout } = useUser();

  const FetchUser = async () => {
    const storedUserData = localStorage.getItem("NEW_USER");

    return storedUserData ? JSON.parse(storedUserData) : null;
  };

  const handleChange = (event) => {
    // setSelectedLocation(event.target.value);
    setDropdownValue(event.target.value);
  };

  useEffect(() => {
    smuser ? setIsLogged(true) : setIsLogged(false);

    if (smuser) {
      if (smuser.emailverify !== 1) {
        navigate("/email/verification");
      }
    }

    if (smuser) {
      // console.log(smuser);
      GetLocation();
      changeCurrency(smuser.prefer_currency);
      setPreferCurrency(smuser.prefer_currency);
      if (smuser.platform_status == 1) {
        setPlatform("1");
      } else {
        setPlatform("0");
      }
      setUserCountry2(smuser.country);
      ////console.log(smuser.country, "smuser.country_2");
    } else {
      if (!isClick) {
        // setPreferCurrency("USD");
        // ChangeCurrencys("USD");
        getCurrencyByIP();
      } else {
        //setPreferCurrency(localStorage.setItem(preferCurrency, "cur"));
        //setPreferCurrency(preferCurrency1);
      }
    }

    const interval = setInterval(() => {
      vmexpires();
    }, 300000);

    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    // if (window.location.pathname === "/") {
    //   //////console.log("window.location.pathname", window.location.pathname);
    //   setActiveKey("/");
    // } else if (window.location.pathname === "/browse") {
    //   setActiveKey("/browse");
    // } else if (window.location.pathname === "/upcoming") {
    //   setActiveKey("/upcoming");
    // } else if (window.location.pathname === "/subscribe") {
    //   setActiveKey("/subscribe");
    // }

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [window.location.pathname, currencyRates, preferCurrency]);

  const getCurrencyByIP = async () => {
    // console.log(props.ip, "IPPP");
    try {
      // const response = await axios.get("http://ip-api.com/json");

      const response = await axios.get("https://ipapi.co/json/")
      const countryCode = response.data.country_code;
      let currency = "INR";
      
      localStorage.removeItem("PrefCurrency");
      if (countryCode === "IN") {
        currency = "INR";
      } else if (countryCode === "GB") {
        currency = "GBP";
      } else if (countryCode === "US") {
        currency = "USD";
      }else{
        currency = "INR";
      }

      setCountryCodes(currency);
      localStorage.setItem("PrefCurrency", currency);

      ChangeCurrencys(currency);
    } catch (error) {
      console.error("Error fetching location data");
    }
  };

  const changeCurrency = (value) => {
    if (isLogged) {
      ChangeCurrency(value);
    } else {
    }
  };

  const changeCountry = (value) => {
    setUserCountry2(value);
    if (isLogged) {
      UpdateCountry(value);
    } else {
    }
  };

  const changePlatform = (value) => {
    setPlatform(value);
    if (isLogged) {
      UpdatePlatform(value);
    } else {
    }
  };

  const CurrencyComparison = ({ currencyRates, variable }) => {
    //console.log(currencyRates, variable);
    if (!variable) return "Invalid variable";
    const key = `cu_${variable}`;
    if (!(key in currencyRates)) return null;
    return currencyRates[key];
  };

  const ChangeCurrency = async (value) => {
    const payload = {
      country: value,
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

      setTest(userNative_credit);
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

      const temp = {
        price: "100",
        symbol: "USD",
        rates: "25",
      };
    } catch (error) {
      console.error("Error during the login process:", error);
    }
  };

  const ChangeCurrencys = async (value) => {
    // console.log(value, "value");
    const payload = {
      country: value,
      // user_id: smuser.id,
    };
    // console.log(value, "val");
    try {
      const loginUserResponse = await instance.post(
        "/changescurrencys",
        payload
      );

      // console.log(loginUserResponse, "CURR");
      updateCurrencyRate(loginUserResponse.data.currency1);
      // setStaticCurr(loginUserResponse.data.currencyname);
      if (loginUserResponse.data.status) {
        setPreferCurrency(value);
        setIsClick(true);
      }

      const currencyList = loginUserResponse.data.currency1;
            console.log(currencyList, "currencyList");
      const key = value === "EUR" ? `cu_${"EURO"}` : `cu_${value}`;

      const finalRate = currencyList[key];
      updateAppCurrency(finalRate);

      setCountryCodes(value);
      localStorage.setItem("PrefCurrency", value);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
  };

  const UpdateCountry = async (value) => {
    const payload = {
      country: value,
      user_id: smuser.id,
      ip: "103.240.168.48",
      platform_status: smuser.platform_status,
    };

    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const changesPlatformsRes = await instance.post(
        "/changecountry",
        encryptedResponse
      );

      const finalResponse = await decryptData(changesPlatformsRes.data);
      const Details = finalResponse.user;
      updateUserDetails(Details);
      window.location.href = "/vm/create";
    } catch (error) {
      console.error("Error during the login process:", error);
    }
  };

  const GetLocation = async () => {
    const payload = {
      user_id: smuser.id,
      // ip: "103.240.168.48",
    };

    try {
      // console.log(payload, "payload");
      const changesPlatformsRes = await instance.post("/location", payload);
      // console.log(changesPlatformsRes, "response location");
      const locationData = changesPlatformsRes.data.location;
      setServerLocation(locationData);
      //server_location
      // console.log(locationData, "locationData");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
  };

  const UpdatePlatform = async (value) => {
    const payload = {
      user_id: smuser.id,
      status: value,
      ip: "103:12:1:52",
    };

    if (isLogged) {
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const changesPlatformsRes = await instance.post(
          "/changesplatforms",
          encryptedResponse
        );

        const finalResponse = await decryptData(changesPlatformsRes.data);
        const Details = finalResponse.user;
        updateUserDetails(Details);
        changeCurrency(smuser.prefer_currency);
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    }
  };

  const vmexpires = async () => {
    // const payload = {
    //   user_id: smuser.id,
    // };
    try {
      const encryptedResponse = await apiEncryptRequest();
      const loginUserResponse = await instance.post(
        "/vmexpires",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "updatevmstatus");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
  };

  return (
    <>
      {isMobile ? (
        <>
          {/* {showProfile && (
            <div onClick={() => setShowProfile(false)}>
              <ProfilePopUp type={popUpType} wallet={currencyRates} />
            </div>
          )} */}
          {isPopupOpen && (
            <>
              {/* <div onClick={() => setIsPopupOpen(false)}> */}
              <div>
                <ProfilePopUp
                  type={popUpType}
                  isVisible={isPopupOpen}
                  wallet={currencyRates}
                  upnetcredits={smuser.reward_points}
                  onClose={() => setIsPopupOpen(false)}
                />
              </div>
            </>
          )}
          {isLogged ? (
            <>
              <div className="header-top see-full">
                <div className="parent-see-width">
                  <div className="logo">
                    <a href="/vm/create">
                      <img src="/logo.png" alt="Logo" />
                    </a>
                  </div>
                  <div style={{ display: "flex" }}>
                    <select
                      name="plan_time"
                      style={{
                        width: "60px",
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "2px",
                        border: "2px solid #e97730",
                        fontSize: "11px",
                      }}
                      value={preferCurrency}
                      onChange={(e) => changeCurrency(e.target.value)}
                    >
                      {platform === 1 ? (
                        <>
                          <option value="USD">USD</option>
                          <option value="INR">INR</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="AED">AED</option>
                        </>
                      ) : (
                        <>
                          <option value="USD">USD</option>
                          <option value="INR">INR</option>
                          {/* <option value="EUR">EUR</option> */}
                          <option value="GBP">GBP</option>
                          {/* <option value="AED">AED</option> */}
                        </>
                      )}
                    </select>
                    {/* {serverLocation && ( */}
                    <select
                      name="plan_time"
                      style={{
                        width: "60px",
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "2px",
                        border: "2px solid #e97730",
                        fontSize: "11px",
                      }}
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="Select" selected>
                        GLOBAL
                      </option>
                      {serverLocation &&
                        serverLocation.map((item, index) => (
                          <option key={index} value={item.server_location}>
                            {item.server_location}
                          </option>
                        ))}
                    </select>
                    {/* )} */}

                    <select
                      name="plan_time"
                      style={{
                        width: "60px",
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "2px",
                        border: "2px solid #e97730",
                        fontSize: "11px",
                      }}
                      value={platform}
                      onChange={(e) => changePlatform(e.target.value)}
                    >
                      {/* <option value={platform}>
                        {platform == 0 ? "Native VPS" : "Cloud VM"}
                      </option> */}

                      {/* <option value="1">Cloud VM</option> */}
                      <option value="0">Native VM</option>
                    </select>

                    <div
                      className="in-border"
                      style={{
                        alignContent: "center",
                        height: "30px",
                        width: "30px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        backgroundColor: "#E97730",
                      }}
                      onClick={() => {
                        setPopUpType("profile");
                        // setShowProfile(!showProfile);
                        setIsPopupOpen(!isPopupOpen);
                      }}
                    >
                      <img
                        src={"/images/menu-icon.png"}
                        alt={"/images/menu-icon.png"}
                        style={{
                          marginBottom: "4px",
                          marginLeft: "6px",
                          width: "15px",
                          height: "13px",
                        }}
                      />
                    </div>
                    <div
                      className="in-border"
                      style={{
                        alignContent: "center",
                        height: "30px",
                        width: "30px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        backgroundColor: "#E97730",
                        marginLeft: "5px",
                      }}
                      onClick={() => {
                        setPopUpType("wallet");
                        // setShowProfile(!showProfile);
                        setIsPopupOpen(!isPopupOpen);
                      }}
                    >
                      <img
                        src={"/user-wallet.png"}
                        alt={"/user-wallet.png"}
                        style={{
                          marginLeft: "5px",
                          marginBottom: "5px",
                          width: "15px",
                          height: "15px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="header-top see-full">
                <div className="parent-see-width">
                  <div className="logo">
                    <a href="/">
                      <img
                        src="/logo.png"
                        alt="Logo"
                        style={{
                          marginTop: "25px",
                          maxWidth: "none",
                          width: "12rem",
                          marginLeft: "-2rem",
                        }}
                      />
                    </a>
                  </div>
                  <div className="login-main">
                    <select
                      name="plan_time"
                      style={{
                        marginTop: "25px",
                        width: "auto",
                        borderRadius: "30px",
                        marginRight: "8rem",
                        padding: "10px 15px",
                        border: "2px solid rgb(233, 119, 48)",
                      }}
                      onChange={(e) => changeCurrency(e.target.value)}
                    >
                      <option value="INR">INR</option>
                      <option value="USD" selected>
                        USD
                      </option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AED">AED</option>
                    </select>
                    {/* <div className="log-in" onClick={() => navigate("/signUp")}>
                      <a className="media-link">
                        <div className="media" style={{ marginBottom: "10px" }}>
                          <img
                            className="normal"
                            src="/images/more-info-btn-bg.svg"
                            alt=""
                            style={{ width: "5rem" }}
                          />
                          <img
                            className="hover-img"
                            src="/images/more-info-btn-bg.svg"
                            alt=""
                            style={{ width: "5rem" }}
                          />
                          <span className="login-text">Sign Up</span>
                        </div>
                      </a>
                    </div>
                    <div className="log-in" onClick={() => navigate("/login")}>
                      <a className="media-link">
                        <div className="media" style={{ marginBottom: "10px" }}>
                          <img
                            className="normal"
                            src="/images/more-info-btn-bg.svg"
                            alt=""
                            style={{ width: "5rem" }}
                          />
                          <img
                            className="hover-img"
                            src="/images/more-info-btn-bg.svg"
                            alt=""
                            style={{ width: "5rem" }}
                          />
                          <span className="login-text">Log in</span>
                        </div>
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {isLogged ? (
            <>
              {isPopupOpen && (
                <>
                  {/* <div onClick={() => setIsPopupOpen(false)}> */}
                  <div>
                    <ProfilePopUp
                      type={popUpType}
                      isVisible={isPopupOpen}
                      onClose={() => setIsPopupOpen(false)}
                    />
                  </div>
                </>
              )}
              {smuser && (
                <div className="header-top see-full">
                  <div className="parent-see-width">
                    <div className="logo">
                      <a href="/vm/create">
                        <img
                          src="/logo.png"
                          alt="Logo"
                          style={{
                            marginLeft: "3rem",
                            width: "240px",
                            // marginTop: "1rem",
                          }}
                        />
                      </a>
                    </div>
                    <div className="login-main">
                      {isLoginByParentUser == 1 && (
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                          }}
                          value={preferCurrency}
                          onChange={(e) => changeCurrency(e.target.value)}
                        >
                          {/* <option value={preferCurrency} selected>
                          {preferCurrency}
                        </option> */}
                          {platform === 1 ? (
                            <>
                              <option value="USD">USD</option>
                              <option value="INR">INR</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                              <option value="AED">AED</option>
                            </>
                          ) : (
                            <>
                              <option value="USD">USD</option>
                              <option value="INR">INR</option>
                              {/* <option value="EUR">EUR</option> */}
                              <option value="GBP">GBP</option>
                              {/* <option value="AED">AED</option> */}
                            </>
                          )}
                        </select>
                      )}
                      {/* {serverLocation && ( */}
                      {isLoginByParentUser == 1 && (
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                          }}
                          // value={userCountry2}
                          value={dropdownValue}
                          onChange={handleChange}
                          //   handleChange;
                          //   //setHeaderState(e.target.value);
                          //   //changeServerLocation(e.target.value);
                          // }}
                        >
                          <option value="Global" selected>
                            GLOBAL
                          </option>
                          {/* {[serverLocation].map((item) => (
                          <option
                            key={item.server_location}
                            value={item.server_location}
                          >
                            {item.server_location}
                          </option>
                        ))} */}
                          {serverLocation &&
                            serverLocation.map((item, index) => (
                              <option key={index} value={item.server_location}>
                                {item.server_location}
                              </option>
                            ))}
                        </select>
                      )}
                      {isLoginByParentUser == 1 && (
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "20px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                          }}
                          value={platform}
                          onChange={(e) => changePlatform(e.target.value)}
                        >
                          {/* <option value={platform}>
                          {platform == 0 ? "Native VPS" : "Cloud VM"}
                        </option> */}
                          {/* <option value="1">Cloud VM</option> */}
                          <option value="0">Native VM</option>
                        </select>
                      )}
                      <div style={{ display: "flex" }}>
                        <>
                          {isLoginByParentUser == 1 && currencyRates && (
                            <a
                              href="/wallet"
                              className="underline-text"
                              style={{
                                fontSize: "21px",
                                color: "#035189",
                                marginRight:
                                  smuser.reward_points > 0 ? "20px" : "0px",
                              }}
                            >
                              BAL. ({currencyRates})
                            </a>
                          )}
                        </>
                        <>
                          {smuser && isLoginByParentUser == 1 && (
                            <a
                              className="underline-text"
                              style={{
                                fontSize: "21px",
                                color: "#035189",
                                marginRight: "20px",
                              }}
                            >
                              {
                                smuser.reward_points !== null &&
                                  smuser.reward_points > 0 &&
                                  `UPNETCredits ( ${currencyReturn({
                                    price: smuser.reward_points,
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  })} )`
                                // : `UPNETCredits ( 0 )`
                              }
                            </a>
                          )}
                        </>

                        <a
                          href="/vm-machine"
                          className="underline-text"
                          style={{
                            marginRight: "10px",
                            fontSize: "21px",
                            color: "#035189",
                            fontWeight: "600",
                          }}
                        >
                          My Machine
                        </a>
                        <div className="icons notifications hiddenclass">
                          <a href="/notification">
                            <span className="count-bell"></span>
                            <div
                              className="bell"
                              style={{
                                marginRight: "10px",
                                marginTop: "-20px",
                              }}
                            >
                              <img
                                src="/admin/images/admin/common/notification.svg"
                                alt="Notification"
                              />
                            </div>
                          </a>
                        </div>
                        <div
                          style={{ marginRight: "15px" }}
                          onClick={() => {
                            setPopUpType("profile");
                            // setShowProfile(!showProfile);
                            setIsPopupOpen(!isPopupOpen);
                          }}
                        >
                          {/* <img
                            src="/admin/images/admin/common/help.svg"
                            alt=""
                            style={{
                              width: "35px",
                              height: "35px",
                              marginRight: "10px",
                            }}
                          /> */}

                          <img
                            src="/admin/images/admin/common/admin-icon.png"
                            // {`/uploads/public/uploads/${smuser && smuser.image}`}
                            alt="/admin/images/admin/common/help.svg"
                            style={{
                              borderRadius: "50%",
                              backgroundColor: "#e97730",
                              width: "35px",
                              height: "35px",
                              marginRight: "10px",
                              marginBottom: "20px",
                              border: "2px solid white",
                              padding: "5px",
                              outline: "2px solid #e97730",
                            }}
                          />

                          <span
                            style={{
                              fontSize: "24px",
                              fontWeight: "500",
                              color: "#666",
                              marginLeft: "5px",
                              position: "relative",
                              marginRight: "10px",
                              maxWidth: "130px",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              display: "inline-block",
                            }}
                          >
                            {smuser && smuser.name}
                          </span>
                          <FaChevronDown
                            style={{
                              color: "black",
                              marginRight: "10px",
                              marginLeft: "-5px",
                              color: "black",
                              marginBottom: "20px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="header-top see-full">
              <div className="parent-see-width">
                <div className="logo">
                  <a href="/">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      style={{
                        marginLeft: "3rem",
                        width: "260px",
                        marginTop: "1rem",
                      }}
                    />
                  </a>
                </div>
                <div className="login-main">
                  <select
                    value={countryCodes}
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "10px 15px",
                      border: "2px solid #e97730",
                    }}
                    //onChange={(e) => setPreferCurrency(e.target.value)}
                    onChange={(e) => ChangeCurrencys(e.target.value)}
                  >
                    {staticCodes.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                    {/* <option value="INR">INR</option>
                    <option value="USD">USD</option> */}
                    {/* <option value="EUR">EUR</option> */}
                    {/* <option value="GBP">GBP</option> */}
                    {/* <option value="AED">AED</option>.
                        
                         {/* {[staticCurr].map((item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          ))} */}
                  </select>
                  <div className="log-in" onClick={() => navigate("/signUp")}>
                    <a className="media-link">
                      <div className="media">
                        <img
                          className="normal"
                          src="/images/more-info-btn-bg.svg"
                          alt=""
                        />
                        <img
                          className="hover-img"
                          src="/images/more-info-btn-bg.svg"
                          alt=""
                        />
                        <span
                          className="login-text"
                          onMouseOver={(e) =>
                            (e.target.style.color = "#07528B")
                          } // Change color on hover
                          onMouseOut={(e) => (e.target.style.color = "white")}
                        >
                          Sign Up
                        </span>
                      </div>
                    </a>
                  </div>
                  <div className="log-in" onClick={() => navigate("/login")}>
                    <a className="media-link">
                      <div className="media">
                        <img
                          className="normal"
                          src="/images/more-info-btn-bg.svg"
                          alt=""
                        />
                        <img
                          className="hover-img"
                          src="/images/more-info-btn-bg.svg"
                          alt=""
                        />
                        <span
                          className="login-text"
                          onMouseOver={(e) =>
                            (e.target.style.color = "#07528B")
                          } // Change color on hover
                          onMouseOut={(e) => (e.target.style.color = "white")}
                        >
                          Log in
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Header;
