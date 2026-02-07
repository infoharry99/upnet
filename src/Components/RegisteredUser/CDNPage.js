import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./CDNPage.css";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "../../Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import AppToast from "../../AppToast";
import Loader from "../common/Loader";
import { FaX } from "react-icons/fa6";

const CDNPage = () => {
  const navigate = useNavigate();

  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const [loading, setLoading] = useState(false);
  const [whatIsCDN, setWhatIsCDN] = useState("");
  const [usedCDN, setUsedCDN] = useState("");
  const { smuser, appCurrency, isLoginByParentUser } = useAuth();
  const handleOptionWhatIsCDN = (event) => {
    setWhatIsCDN(event.target.value);
    setCdnInfo(event.target.value);
  };

  const handleOptionUsedCDN = (event) => {
    setUsedCDN(event.target.value);
    setCdnUsed(event.target.value);
  };
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [activeButton, setActiveButton] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [websiteOrigin, setWebsiteOrigin] = useState("");

  const [cdnInfo, setCdnInfo] = useState("");
  const [cdnUsed, setCdnUsed] = useState("");
  const [dataTransferValue, setDataTransferValue] = useState("");
  const [personName, setPersonName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [showCdnForm, setShowCdnForm] = useState(false);
  const [value, setValue] = useState(0);
  const [cdnList, setCdnList] = useState(null);
  const [isCDNUsedView, setIsCDNUsedView] = useState(false);
  const [totalBytesDownloaded, setTotalBytesDownloaded] = useState("");
  const [totalRequests, setTotalRequests] = useState("");
  const [totalBytesUploaded, setTotalBytesUploaded] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [cdnGBPrice, setGBPrice] = useState("");
  const [cdnTBPrice, setTBPrice] = useState("");

  const [searchText, setSearchText] = useState("");
  const [activeStatusButton, setActiveStatusButton] = useState("Active");

  const initialList = cdnList || [];
  const [copiedStatus1, setCopiedStatus1] = useState(
    Array(initialList.length).fill(false)
  );

  const [copiedStatus2, setCopiedStatus2] = useState(
    Array(initialList.length).fill(false)
  );

  const [copiedStatus3, setCopiedStatus3] = useState(
    Array(initialList.length).fill(false)
  );

  const [copiedStatus4, setCopiedStatus4] = useState(
    Array(initialList.length).fill(false)
  );

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const selectedCacheTypes = [
    "js",
    "images",
    "css",
    "gif",
    "webp",
    "jpg",
    "png",
    // "Select All",
  ];
  const [selectedOptions, setSelectedOptions] = useState(selectedCacheTypes);
  const dataTransfers = ["GB", "TB"];
  const [selectedTransfers, setSelectedTransfers] = useState("GB");

  const handleSelection = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSelectionChange = (option) => {
    if (selectedTransfers !== option) {
      setSelectedTransfers(option);
    }
  };
  const handleChange = (event) => {
    setValue(event.target.value);
    setDataTransferValue(event.target.value);
  };

  const UpdateCDN = async () => {
    setLoading(true);
    const amount =
      selectedTransfers === "GB"
        ? value * cdnGBPrice * 1024
        : value * cdnTBPrice * 1024;

    if (
      value !== 0 &&
      smuser.total_credit > amount &&
      companyName !== "" &&
      websiteOrigin !== "" &&
      // cdnInfo !== "" &&
      websiteUrl !== "" &&
      // cdnUsed !== "" &&
      dataTransferValue !== "" &&
      personName !== "" &&
      contactNumber !== ""
    ) {
      const payload = {
        user_id: smuser.id,
        company_name: companyName,
        website_origin: `WWW.${websiteOrigin}`,
        // cdninfo: cdnInfo,
        website_url: `WWW.${websiteUrl}`,
        // cdnused: cdnUsed,
        datatransfer_value:
          selectedTransfers === "GB"
            ? dataTransferValue
            : dataTransferValue * 1024,
        person_name: personName,
        contact_number: contactNumber,
        amount:
          selectedTransfers === "GB"
            ? value * cdnGBPrice * 1024
            : value * cdnTBPrice * 1024,
        cache_items: selectedOptions,
      };
      // console.log(payload, "paylod");
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        // const cdnInfoResponse = await instance.post(
        //   "/updatecdninfo",
        //   encryptedResponse
        // );
        const cdnInfoResponse = await instance.post(
          "/createDistribution",
          encryptedResponse
        );
        const Response = await decryptData(cdnInfoResponse.data);
        // console.log(Response, "Response");
        if (Response.status) {
          toast((t) => <AppToast id={t.id} message={"CDN Info is updated!"} />);
          //window.location.href = "/vm/create";
          setShowCdnForm(false);
          ListCDN();
        }
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    }
    if (smuser.total_credit < amount) {
      // console.log(smuser.total_credit, "A");
      // console.log(value * cdnGBPrice * 1024, "B");

      toast((t) => (
        <AppToast
          id={t.id}
          message={"Not enough balance! Add money to wallet"}
        />
      ));
    } else if (companyName === "") {
      toast((t) => (
        <AppToast id={t.id} message={"CDN name can not be empty!"} />
      ));
    } else if (websiteUrl === "") {
      toast((t) => (
        <AppToast id={t.id} message={"CDN Website url can not be empty!"} />
      ));
    } else if (personName === "") {
      toast((t) => (
        <AppToast id={t.id} message={"Person Name can not be empty!"} />
      ));
    } else if (contactNumber === "") {
      toast((t) => (
        <AppToast id={t.id} message={"Contact Number can not be empty!"} />
      ));
    } else if (value === 0) {
      toast((t) => <AppToast id={t.id} message={"Bandwidth can not be 0!"} />);
    }
    setLoading(false);
  };

  const ListCDN = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/cdnlist",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);

      console.log(Response.cdn_list, "==!==!==cdnlist");
      // setCdnList(Response.cdn_list.reverse());

      //  item.status === 1;
      const cdnList = Object.values(Response.cdn_list);
      const filteredCdnList = cdnList.filter((item) => item.status === 1);
      setCdnList(filteredCdnList.reverse());
      console.log(filteredCdnList, "A");

      if (cdnList && cdnList.length > 0) {
        setCopiedStatus1(Array(cdnList.length).fill(false));
        setCopiedStatus2(Array(cdnList.length).fill(false));
        setCopiedStatus3(Array(cdnList.length).fill(false));
        setCopiedStatus4(Array(cdnList.length).fill(false));
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  // CDN Use
  const UsedCDN = async (pull_zone_id, websiteUrl, Id) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      distribution_id: pull_zone_id,
      id: Id,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/usedcdn",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      // console.log(Response, "==!==!==cdnusedResponse");
      if (Response.status) {
        setIsCDNUsedView(true);
        setTotalBytesDownloaded(bytesToMB(Response.totalBytesDownloaded));
        setTotalRequests(Response.totalRequests);
        setTotalBytesUploaded(bytesToMB(Response.totalBytesUploaded));
        setWebsiteURL(websiteUrl);
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  // Cache Clear APi
  const createInvalidation = async (pull_zone_id) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      distribution_id: pull_zone_id,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/createInvalidation",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      // console.log(Response.cdn_list, "==!==!==cdncreateResponse");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const CdnPrice = async (pull_zone_id, websiteUrl) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/cdn_price",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      // console.log(Response, "==!==!==cdnpriceResponse");
      if (Response.status) {
        setGBPrice(Response.cdn_price.gb_price);
        setTBPrice(Response.cdn_price.price);
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const CDNgetcertificate = async (pull_zone_id, website_url) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      distribution_id: pull_zone_id,
      domain_name: website_url,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/getcertificate",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      // console.log(Response, "==!==!==cdnCertificateResponse");
      ListCDN();
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const getCname = async (pull_zone_id, arnVal) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      distribution_id: pull_zone_id,
      arn: arnVal,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/getcname",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      // console.log(Response, "==!==!==cNameResponse");
      ListCDN();
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const ARNvalidate = async (pull_zone_id, domain_name) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      distribution_id: pull_zone_id,
      domain_name: domain_name,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/arnvalidate",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      // console.log(Response, "==!==!==cdnarnValidateResponse");
      ListCDN();
      if (Response.message) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={`${Response.DomainName}\n ip: ${Response.message}`}
            isMobile={isMobile}
          />
        ));
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  // Domain Validate
  const validateDomain = async (pull_zone_id, domain_name, arnVal) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      distribution_id: pull_zone_id,
      domain_name: domain_name,
      arn: arnVal,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/validate_domain",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      // console.log(Response, "==!==!==cdndomainValidateResponse");
      ListCDN();
      if (Response.message) {
        toast((t) => <AppToast id={t.id} message={Response.message} />);
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  // Disable CDN
  const disableCDN = async (pull_zone_id) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      distribution_id: pull_zone_id,
    };
    //console.log(payload);
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const cdnInfoResponse = await instance.post(
        "/disable",
        encryptedResponse
      );
      const Response = await decryptData(cdnInfoResponse.data);
      // console.log(Response, "==!==!==cdndisableResponse");

      if (Response.message) {
        toast((t) => <AppToast id={t.id} message={Response.message} />);
        // setActiveStatusButton("Disabled");
      }
      ListCDN();
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const handle = () => {};
  const bytesToMB = (bytes) => {
    return bytes / (1024 * 1024);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    ListCDN();
    CdnPrice();
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const showCdnUsed = async (data) => {
    const payload = {
      id: data.id,
      pull_id: data.pull_zone_id,
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/cdnmonitor",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "cdnmonitor");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    // setLoading(false);
  };

  const handleRedirect = () => {
    // Redirect to '/Wallet'
    // window.location.href = "/wallet";

    navigate("/wallet", {
      state: {
        isServerOrCDN: "CDN",
      },
    });
  };

  const handleCopy1 = (text, index) => {
    const newCopiedStatus = [...copiedStatus1];
    newCopiedStatus[index] = true;
    setCopiedStatus1(newCopiedStatus);

    navigator.clipboard.writeText(text).then(() => {
      setTimeout(() => {
        newCopiedStatus[index] = false;
        setCopiedStatus1([...newCopiedStatus]);
      }, 2000); // Reset after 2 seconds
    });
  };

  const handleCopy2 = (text, index) => {
    const newCopiedStatus = [...copiedStatus2];
    newCopiedStatus[index] = true;
    setCopiedStatus2(newCopiedStatus);

    navigator.clipboard.writeText(text).then(() => {
      setTimeout(() => {
        newCopiedStatus[index] = false;
        setCopiedStatus2([...newCopiedStatus]);
      }, 2000); // Reset after 2 seconds
    });
  };

  const handleCopy3 = (text, index) => {
    const newCopiedStatus = [...copiedStatus3];
    newCopiedStatus[index] = true;
    setCopiedStatus3(newCopiedStatus);

    navigator.clipboard.writeText(text).then(() => {
      setTimeout(() => {
        newCopiedStatus[index] = false;
        setCopiedStatus3([...newCopiedStatus]);
      }, 2000); // Reset after 2 seconds
    });
  };

  const handleCopy4 = (text, index) => {
    const newCopiedStatus = [...copiedStatus4];
    newCopiedStatus[index] = true;
    setCopiedStatus4(newCopiedStatus);

    navigator.clipboard.writeText(text).then(() => {
      setTimeout(() => {
        newCopiedStatus[index] = false;
        setCopiedStatus4([...newCopiedStatus]);
      }, 2000); // Reset after 2 seconds
    });
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "65rem",
        position: "relative",
        backgroundImage: `url(/main-bg.jpg)`,
        backgroundSize: "cover",

        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
      }}
    >
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "999999999" }}>
          <Loader isLoading={loading} />
          {/* <Spinner animation="border" /> */}
        </div>
      )}

      {isCDNUsedView && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              // backdropFilter: "blur(25px)",
              backgroundColor: "#035189",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
              borderRadius: "12px", // Assuming you want rounded corners
              border: "2px solid #e97730",
              top: "30%",
              position: "absolute",
              zIndex: "999999",
              width: isMobile ? "100%" : "20%",
              height: isMobile ? "25%" : "15rem",
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
                onClick={() => setIsCDNUsedView(false)}
              >
                <FaX
                  style={{
                    marginTop: "5px",
                    color: "#e97730",
                    display: "inline-block",
                    fontSize: "19px",
                  }}
                />
              </button>
              <h1
                style={{
                  color: "white",
                  width: "25rem",
                  height: "100px",
                  fontSize: "22px",
                  fontWeight: "bold",
                  //backgroundColor: "#035189",
                  //borderRadius: "25px",
                  //border: "2px solid #ffff",
                  //outline: "2px solid #035189",
                  marginTop: "4rem",
                  //marginLeft: "50px",
                  textAlign: "center",
                }}
              >
                Website URL : {websiteURL}
                <br></br>
                <br></br>
                {/* Total MB Uploaded : {totalBytesUploaded} MB
                <br></br>
                <br></br> */}
                Total CDN Used : {totalBytesDownloaded} MB
                {/* <br></br>
                <br></br>
                Total Request : {totalRequests} */}
              </h1>
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-cdn">
            CDN <span></span>
          </div>
          {!showCdnForm && (
            <div
              style={{
                position: "absolute",
                marginLeft: "5px",
                marginTop: "0rem",
              }}
            >
              <Button
                style={{
                  background: "#035189",
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                  // borderRadius: "20px",
                  marginBottom: "10px",
                }}
                onClick={() => setShowCdnForm(true)}
              >
                New CDN
              </Button>
            </div>
          )}
          {showCdnForm && (
            <div
              className="features-section-solution"
              style={{ marginTop: "0px", marginLeft: "5%", width: "90%" }}
            >
              <div
                className="register-main see-full"
                style={{ marginTop: "2rem" }}
              >
                <div className="bg-img">
                  <img
                    src="/images/blue-box-bg.svg"
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
                <form className="see-full">
                  <div className="form-top">
                    <div style={{ display: "flex" }}>
                      <h4 className="text-white">Create CDN</h4>
                      <h6
                        className="text-white"
                        style={{ position: "absolute", right: "1px" }}
                      >
                        Price:{" "}
                        {currencyReturn({
                          price:
                            selectedTransfers === "GB"
                              ? value * cdnGBPrice
                              : value * cdnTBPrice,
                          symbol: smuser.prefer_currency,
                          rates: appCurrency,
                        })}
                      </h6>
                    </div>
                    <div className="input-container">
                      <input
                        type="text"
                        name="CompanyName"
                        className="input-signup"
                        placeholder="Your Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>

                    <div className="input-container">
                      <input
                        type="text"
                        name="CompanyName"
                        className="input-signup"
                        placeholder="Enter Your Website / APP URL Where you Want"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                      />
                    </div>
                    {/* <div style={{ display: "flex", marginTop: "10px" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "white",
                          marginRight: "10px",
                        }}
                      >
                        Have You Used CDN Before?
                      </p>
                      <label className="radio-label">
                        <input
                          type="radio"
                          value="yes"
                          checked={usedCDN === "yes"}
                          onChange={handleOptionUsedCDN}
                          className="radio-input"
                        />
                        Yes
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          value="no"
                          checked={usedCDN === "no"}
                          onChange={handleOptionUsedCDN}
                          className="radio-input"
                        />
                        No
                      </label>
                    </div> */}
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "white",
                        marginRight: "10px",
                      }}
                    >
                      How Much Bandwidth You Have Right Now Monthly?
                    </p>
                    <div
                      style={{
                        marginLeft: "-15px",
                        marginRight: "-10px",
                        marginTop: "-23px",
                        marginBottom: "-10px",
                      }}
                    >
                      <div className="range-slider">
                        <div
                          className="tooltip-horz"
                          style={{ left: `${value}%` }}
                        >
                          {value} TB
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={handleChange}
                          className="custom-rangeInput"
                          style={{
                            background: `linear-gradient(to right, #e97730 ${value}%, #ddd ${value}%)`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="input-container">
                      <input
                        type="text"
                        name="CompanyName"
                        className="input-signup"
                        placeholder="Name of the Contact Person"
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                      />
                    </div>
                    <div className="input-container">
                      <input
                        type="text"
                        name="CompanyName"
                        className="input-signup"
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "15px",
                      marginLeft: "-5px",
                    }}
                  >
                    <div className="log-in" onClick={() => UpdateCDN()}>
                      <a className="media-link">
                        <div
                          className="media-banner"
                          style={{
                            width: "auto",
                            height: "50px",
                            marginTop: "10px",
                            marginLeft: "1.8rem",
                          }}
                        >
                          <img
                            className="normal-banner"
                            src="/images/more-info-btn-bg.svg"
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
                              fontWeight: "600",
                            }}
                          >
                            Submit
                          </span>
                        </div>
                      </a>
                    </div>
                    <div
                      className="log-in"
                      onClick={() => setShowCdnForm(false)}
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
                              fontWeight: "600",
                            }}
                          >
                            Cancel
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div
            className="heading-dotted-support"
            style={{
              position: "absolute",
              marginLeft: showCdnForm ? "" : "-50px",
              marginTop: showCdnForm ? "45rem" : "8rem",
            }}
          >
            CDNs{" "}
          </div>

          {/* <div
            style={{
              position: "absolute",
              marginLeft: "5%",
              marginTop: showCdnForm ? "4rem" : "9rem",
              paddingBottom: "50px",
            }}
          >
            {statusButtons.map((title, idx) => (
              <Button
                key={idx}
                style={{
                  background: `${
                    activeStatusButton === title ? "#f47c20" : "#035189"
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
                  setActiveStatusButton(title);
                }}
              >
                {title}
              </Button>
            ))}
          </div> */}

          {cdnList && cdnList.length > 0 && (
            <div
              className="input-container"
              style={{
                marginLeft: "52%",
                position: "relative",
                border: "2px solid #035189",
                width: "12rem",
                marginTop: showCdnForm ? "0px" : "70px",
                height: "40px",
              }}
            >
              <input
                type="text"
                name="search"
                className="input-signup input-tickets"
                placeholder="Search Website"
                value={searchText}
                style={{
                  fontSize: "24px",
                  color: "black",
                  textAlign: "center",
                  width: "10px",
                }}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                  onClick={() => setSearchText("")}
                >
                  <FaX
                    style={{
                      //marginBottom: "2px",
                      color: "#154e7a",
                      display: "inline-block",
                      fontSize: "19px",
                    }}
                  />
                </button>
              )}
            </div>
          )}

          {/* {activeStatusButton == "Active" && ( */}
          <div
            style={{
              marginTop: "6rem",
              marginLeft: "10px",
              width: "95%",
              maxHeight: "50rem",
              overflowY: "auto",
            }}
          >
            {cdnList &&
              cdnList
                .reverse()
                .filter(
                  (item) =>
                    item.status === 1 &&
                    item.website_url
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                )
                .map((item, idx) => (
                  <div className="table-row-noti">
                    <div className="bar"></div>
                    <div className="message" style={{ margin: "5px 0" }}>
                      <div
                        className="desc"
                        style={{
                          marginTop: "1px",
                          maxHeight: "none",
                          position: "relative",
                          fontSize: "15px",
                        }}
                      >
                        Person Name: {item.person_name}
                        <button
                          style={{
                            width: "7rem",
                            // height: "2rem",
                            zIndex: "9",
                            position: "relative",
                            marginTop: "25px",
                            // marginBottom: "8px",
                            right: "-60px",
                            // top: "50%", // Center it vertically
                            transform: "translateY(-50%)",
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "white",
                            height: "40px",
                            backgroundColor:
                              hoveredIndex === idx ? "#b71b1b" : "#e97730",
                            outline:
                              hoveredIndex === idx
                                ? "4px solid #b71b1b"
                                : "4px solid #e97730",
                            border: "4px solid #b71b1b",
                            borderColor: "white",
                            borderRadius: "30px",
                          }}
                          onClick={() => {
                            hoveredIndex === idx
                              ? disableCDN(item.pull_zone_id)
                              : handle();
                          }}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          {hoveredIndex === idx ? "Delete" : "Active"}
                        </button>
                      </div>
                      <div
                        className="desc"
                        style={{
                          maxHeight: "none",
                          marginTop: "0px",
                          fontSize: "15px",
                        }}
                      >
                        Website URL : {item.website_url}
                      </div>
                      <div
                        className="desc"
                        style={{ maxHeight: "none", fontSize: "15px" }}
                      >
                        Company Name: {item.company_name}
                      </div>
                      <div
                        className="desc"
                        style={{ maxHeight: "none", fontSize: "15px" }}
                      >
                        Bandwidth: {item.datatransfer_value} TB
                      </div>
                      <div
                        className="desc"
                        style={{ maxHeight: "none", fontSize: "15px" }}
                      >
                        Contact Number: {item.contact_number}
                      </div>
                      <div
                        className="datetime"
                        style={{
                          maxHeight: "none",
                          marginTop: "10px",
                          fontSize: "15px",
                        }}
                      >
                        Created: {item.created_at}
                      </div>

                      <div
                        style={{
                          marginTop: "15px",
                          // marginLeft: "10px",
                          color: "#035189",
                          fontWeight: "500",
                          fontSize: "16px",
                        }}
                      >
                        ADD CNAME Record:
                      </div>
                      <Row>
                        {/* www */}
                        <div className="col-md-5">
                          <div
                            style={{
                              // marginLeft: "15px",
                              marginTop: "15px",
                              display: "flex",
                              alignItems: "center",
                              //border: "2px solid white",
                              //Radius: "25px",
                              //padding: "5px",
                              height: "50px",
                              zIndex: "9",
                              position: "relative",
                              color: "white",
                              backgroundColor: "white",
                              outline: "3px solid #e97730",
                              border: "3px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                          >
                            <p
                              style={{
                                color: "#555",
                                textAlign: "left",
                                fontWeight: "500",
                                fontSize: "12px",
                                // overflowY: "hidden",
                                paddingTop: "15px",
                                marginLeft: "20px",
                              }}
                            >
                              {" "}
                              WWW
                            </p>
                            {item.cdn_name && (
                              <div>
                                <img
                                  className="hover-zoom"
                                  src={"/images/copy_ic_cdn.svg"}
                                  style={{
                                    marginLeft: "2rem",
                                    width: "30px",
                                    left: "80%",
                                    height: "30px",
                                    color: "white",
                                  }}
                                  onClick={() => {
                                    handleCopy1("WWW", idx);
                                  }}
                                />

                                {copiedStatus1[idx] ? (
                                  <span className="blinkStyleCdn">Copied!</span>
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            style={{
                              //marginLeft: "20px",
                              marginTop: "15px",
                              display: "flex",
                              alignItems: "center",
                              //border: "2px solid white",
                              //Radius: "25px",
                              padding: "5px",
                              height: "50px",
                              zIndex: "9",
                              position: "relative",
                              color: "white",
                              backgroundColor: "white",
                              outline: "3px solid #e97730",
                              border: "3px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                          >
                            <p
                              style={{
                                color: "#555",
                                textAlign: "center",
                                fontSize: "10px",
                                fontWeight: "500",
                                paddingTop: "15px",
                                marginLeft: "20px",
                              }}
                            >
                              {" "}
                              {item.cdn_name && item.cdn_name}
                            </p>
                            {item.cdn_name && (
                              <div className="img-wrapper">
                                <img
                                  className="hover-zoom"
                                  src={"/images/copy_ic_cdn.svg"}
                                  style={{
                                    marginLeft: "7rem",
                                    width: "30px",
                                    //left: "80%",
                                    height: "30px",
                                    color: "white",
                                  }}
                                  onClick={() => {
                                    handleCopy2(item.cdn_name, idx);
                                  }}
                                />
                                {copiedStatus2[idx] ? (
                                  <span className="blinkStyleCdn">Copied!</span>
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-1">
                          {item.domain_validate !== 1 ? (
                            <button
                              style={{
                                //marginLeft: "60px",
                                marginTop: "20px",
                                width: "11rem",
                                // marginTop: "20px",
                                zIndex: "9",
                                position: "relative",
                                //left: "65%",
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "white",
                                height: "40px",
                                backgroundColor: "#e97730",
                                outline: "4px solid #e97730",
                                border: "4px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                              onClick={() =>
                                validateDomain(
                                  item.pull_zone_id,
                                  item.website_url,
                                  item.arn
                                )
                              }
                            >
                              Domain Validate
                            </button>
                          ) : (
                            <div>
                              <img
                                src="/images/verified_success.png"
                                style={{
                                  height: "34px",
                                  width: "34px",
                                  zIndex: "9",
                                  position: "relative",
                                  marginTop: "-70px",
                                  //left: "1%",
                                }}
                              />
                              <button
                                style={{
                                  marginTop: "50px",
                                  width: "6rem",
                                  zIndex: "9",
                                  position: "relative",
                                  left: "2%",
                                  bottom: "35px",
                                  fontWeight: "700",
                                  color: "white",
                                  height: "40px",
                                  backgroundColor: "#e97730",
                                  outline: "4px solid #e97730",
                                  border: "4px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                                onClick={() =>
                                  validateDomain(
                                    item.pull_zone_id,
                                    item.website_url,
                                    item.arn
                                  )
                                }
                              >
                                Check
                              </button>
                            </div>
                          )}
                        </div>
                      </Row>

                      {item.cname_name && item.cname_value && (
                        <div
                          style={{
                            // marginLeft: "10px",
                            marginTop: "15px",
                            color: "#035189",
                            fontWeight: "500",
                            fontSize: "16px",
                          }}
                        >
                          ADD CNAME Record:
                        </div>
                      )}

                      {/* { Second Record} */}
                      <Row>
                        <div className="col-md-5">
                          {item.cname_name && item.cname_value && (
                            <div
                              style={{
                                // marginLeft: "15px",
                                marginTop: "15px",
                                display: "flex",
                                alignItems: "center",
                                //border: "2px solid white",
                                //Radius: "25px",
                                padding: "5px",
                                height: "50px",
                                zIndex: "9",
                                position: "relative",
                                color: "white",
                                backgroundColor: "white",
                                outline: "3px solid #e97730",
                                border: "3px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#555",
                                  textAlign: "center",
                                  fontSize: "9px",
                                  fontWeight: "500",
                                  paddingTop: "15px",
                                  marginLeft: "10px",
                                }}
                              >
                                {" "}
                                {item.cname_name && item.cname_name}
                              </p>
                              {item.cname_name && (
                                <div className="img-wrapper">
                                  <img
                                    className="hover-zoom"
                                    src={"/images/copy_ic_cdn.svg"}
                                    style={{
                                      // marginLeft: "5px",
                                      width: "30px",
                                      // left: "75%",
                                      height: "30px",
                                      color: "white",
                                    }}
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        item.cname_name
                                      );
                                      handleCopy3(item.cname_name, idx);
                                    }}
                                  />
                                  {copiedStatus3[idx] ? (
                                    <span className="blinkStyleCdn">
                                      Copied!
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {item.cname_name && item.cname_value && (
                          <div className="col-md-5">
                            <div
                              style={{
                                marginTop: "15px",
                                //marginLeft: "20px",
                                display: "flex",
                                alignItems: "center",
                                //border: "2px solid white",
                                //Radius: "25px",
                                padding: "5px",
                                height: "50px",
                                zIndex: "9",
                                position: "relative",
                                color: "white",
                                backgroundColor: "white",
                                outline: "3px solid #e97730",
                                border: "3px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#555",
                                  textAlign: "center",
                                  fontSize: "8px",
                                  fontWeight: "500",
                                  paddingTop: "15px",
                                  marginLeft: "5px",
                                }}
                              >
                                {" "}
                                {item.cname_value && item.cname_value}
                              </p>
                              {item.cname_value && (
                                <div className="img-wrapper">
                                  <img
                                    className="hover-zoom"
                                    src={"/images/copy_ic_cdn.svg"}
                                    style={{
                                      marginLeft: "5px",
                                      width: "30px",
                                      height: "30px",
                                    }}
                                    onClick={() => {
                                      handleCopy4(item.cname_value, idx);
                                    }}
                                  />
                                  {copiedStatus4[idx] ? (
                                    <span className="blinkStyleCdn">
                                      Copied!
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="col-md-1">
                          {item.cname_name && item.cname_value && (
                            <button
                              style={{
                                width: "11rem",
                                marginTop: "20px",
                                zIndex: "9",
                                position: "relative",
                                //left: "30%",
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "white",
                                height: "40px",
                                backgroundColor: "#e97730",
                                outline: "4px solid #e97730",
                                border: "4px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                              onClick={() =>
                                ARNvalidate(item.pull_zone_id, item.website_url)
                              }
                            >
                              Certificate Validate
                            </button>
                          )}
                        </div>
                      </Row>

                      <div>
                        {/* {CDN Used Button} */}
                        <button
                          style={{
                            width: "10rem",
                            // marginLeft: "15px",
                            marginTop: "15px",
                            marginBottom: "10px",
                            zIndex: "9",
                            position: "relative",
                            // marginTop: "15%",
                            // left: "20%",
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "white",
                            height: "40px",
                            width: "6rem",
                            backgroundColor: "#e97730",
                            outline: "4px solid #e97730",
                            border: "4px solid #ffff",
                            borderColor: "white",
                            borderRadius: "30px",
                          }}
                          onClick={() =>
                            UsedCDN(
                              item.pull_zone_id,
                              item.website_url,
                              item.id
                            )
                          }
                        >
                          CDN Used
                        </button>

                        {/* {Clear Cache Button} */}
                        <button
                          style={{
                            width: "10rem",
                            marginLeft: "15px",
                            marginTop: "20px",
                            zIndex: "9",
                            position: "relative",
                            // marginTop: "15%",
                            // left: "20%",
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "white",
                            height: "40px",
                            width: "7rem",
                            // width: "10rem",
                            backgroundColor: "#e97730",
                            outline: "4px solid #e97730",
                            border: "4px solid #ffff",
                            borderColor: "white",
                            borderRadius: "30px",
                          }}
                          onClick={() => createInvalidation(item.pull_zone_id)}
                        >
                          Clear Cache
                        </button>

                        {/* {Recharge Button} */}
                        <button
                          style={{
                            marginLeft: "15px",
                            marginTop: "20px",
                            zIndex: "9",
                            position: "relative",
                            // marginTop: "15%",
                            // left: "20%",
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "white",
                            height: "40px",
                            width: "6rem",
                            // width: "10rem",
                            backgroundColor: "#e97730",
                            outline: "4px solid #e97730",
                            border: "4px solid #ffff",
                            borderColor: "white",
                            borderRadius: "30px",
                          }}
                          onClick={() => handleRedirect()}
                        >
                          Recharge
                        </button>

                        {/* {Get Cname button} */}
                        {!item.cname_name &&
                        !item.cname_value &&
                        item.domain_validate === 1 ? (
                          <button
                            className="loader"
                            style={{
                              marginLeft: "0px",
                              marginTop: "15px",
                              zIndex: "9",
                              position: "relative",
                              // marginTop: "15%",
                              // left: "20%",
                              fontSize: "15px",
                              fontWeight: "700",
                              color: "white",
                              height: "40px",
                              width: "10rem",
                              backgroundColor: "#e97730",
                              outline: "4px solid #e97730",
                              border: "4px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                            onClick={() =>
                              getCname(item.pull_zone_id, item.arn)
                            }
                          >
                            Generate CName
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {/* <div className="datetime">
                        <p style={{ fontWeight: "600" }}>Created</p> <br />
                        <p style={{ position: "relative", marginTop: "-40px" }}>
                          {item.created_at}
                        </p>
                      </div> */}
                  </div>
                ))}
            {cdnList && cdnList.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "2rem",
                  fontSize: "24px",
                  fontWeight: "400",
                }}
              >
                No Records
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {/* )} */}

          {activeStatusButton == "Disabled" && (
            <div
              style={{
                marginTop: "5rem",
                marginLeft: "10px",
                width: "95%",
                maxHeight: "50rem",
                overflowY: "auto",
              }}
            >
              {cdnList &&
                cdnList
                  .reverse()
                  .filter(
                    (item) =>
                      item.status === 0 &&
                      item.website_url
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                  )
                  .map((item, idx) => (
                    <div className="table-row-noti">
                      <div className="bar"></div>
                      <div className="message">
                        <Row>
                          <div
                            className="col-md-3"
                            // style={{ marginLeft: "10px" }}
                          >
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "15px" }}
                            >
                              Person Name: {item.person_name}
                            </div>
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "15px" }}
                            >
                              Website URL : {item.website_url}
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "15px" }}
                            >
                              Contact Number: {item.contact_number}
                            </div>
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "15px" }}
                            >
                              Bandwidth: {item.datatransfer_value} TB
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "15px" }}
                            >
                              Company Name: {item.company_name}
                            </div>
                          </div>
                          <div
                            className="datetime"
                            style={{
                              maxHeight: "none",
                              marginTop: "10px",
                              fontSize: "15px",
                            }}
                          >
                            Created: {item.created_at}
                          </div>
                        </Row>

                        <div
                          style={{
                            marginTop: "15px",
                            // marginLeft: "10px",
                            color: "#035189",
                            fontWeight: "500",
                            fontSize: "16px",
                          }}
                        >
                          ADD CNAME Record:
                        </div>
                        <Row>
                          {/* www */}
                          <div className="col-md-5">
                            <div
                              style={{
                                // marginLeft: "15px",
                                marginTop: "15px",
                                display: "flex",
                                alignItems: "center",
                                //border: "2px solid white",
                                //Radius: "25px",
                                //padding: "5px",
                                height: "50px",
                                zIndex: "9",
                                position: "relative",
                                color: "white",
                                backgroundColor: "white",
                                outline: "3px solid #e97730",
                                border: "3px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#555",
                                  textAlign: "center",
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  overflowY: "hidden",
                                  paddingTop: "15px",
                                  marginLeft: "20px",
                                }}
                              >
                                {" "}
                                WWW
                              </p>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div
                              style={{
                                //marginLeft: "20px",
                                marginTop: "15px",
                                display: "flex",
                                alignItems: "center",
                                //border: "2px solid white",
                                //Radius: "25px",
                                padding: "5px",
                                height: "50px",
                                zIndex: "9",
                                position: "relative",
                                color: "white",
                                backgroundColor: "white",
                                outline: "3px solid #e97730",
                                border: "3px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#555",
                                  textAlign: "center",
                                  fontSize: "10px",
                                  fontWeight: "500",
                                  paddingTop: "15px",
                                  marginLeft: "20px",
                                }}
                              >
                                {" "}
                                {item.cdn_name && item.cdn_name}
                              </p>
                            </div>
                          </div>
                        </Row>

                        {item.cname_name && item.cname_value && (
                          <div
                            style={{
                              // marginLeft: "10px",
                              marginTop: "15px",
                              color: "#035189",
                              fontWeight: "500",
                              fontSize: "16px",
                            }}
                          >
                            ADD CNAME Record:
                          </div>
                        )}

                        {/* { Second Record} */}
                        <Row>
                          <div className="col-md-5">
                            {item.cname_name && item.cname_value && (
                              <div
                                style={{
                                  // marginLeft: "15px",
                                  marginTop: "15px",
                                  //marginBottom: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  //border: "2px solid white",
                                  //Radius: "25px",
                                  padding: "5px",
                                  height: "50px",
                                  zIndex: "9",
                                  position: "relative",
                                  color: "white",
                                  backgroundColor: "white",
                                  outline: "3px solid #e97730",
                                  border: "3px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                              >
                                <p
                                  style={{
                                    color: "#555",
                                    textAlign: "center",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                    paddingTop: "15px",
                                    marginLeft: "20px",
                                  }}
                                >
                                  {" "}
                                  {item.cname_name && item.cname_name}
                                </p>
                              </div>
                            )}
                          </div>

                          {item.cname_name && item.cname_value && (
                            <div className="col-md-6">
                              <div
                                style={{
                                  marginTop: "15px",
                                  //marginLeft: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  //border: "2px solid white",
                                  //Radius: "25px",
                                  padding: "5px",
                                  height: "50px",
                                  zIndex: "9",
                                  position: "relative",
                                  color: "white",
                                  backgroundColor: "white",
                                  outline: "3px solid #e97730",
                                  border: "3px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                              >
                                <p
                                  style={{
                                    color: "#555",
                                    textAlign: "center",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                    paddingTop: "15px",
                                    marginLeft: "20px",
                                  }}
                                >
                                  {" "}
                                  {item.cname_value && item.cname_value}
                                </p>
                              </div>
                            </div>
                          )}
                        </Row>

                        <div></div>
                      </div>
                    </div>
                  ))}

              <div
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                  marginTop: "20px",
                }}
              >
                {cdnList &&
                cdnList.filter((item) => item.status === 0).length === 0 ? (
                  <div>No Records</div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        //web view

        <div className="features-page-solution" style={{ padding: "5rem" }}>
          {isLoginByParentUser == 1 && (
            <div className="heading-dotted-cdn">
              CDN <span></span>
            </div>
          )}
          {isLoginByParentUser == 1 && !showCdnForm && (
            <div
              style={{
                position: "absolute",
                marginLeft: "8rem",
                marginTop: "1rem",
              }}
            >
              <Button
                style={{
                  background: "#035189",
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                  // borderRadius: "20px",
                  marginBottom: "10px",
                }}
                onClick={() => setShowCdnForm(true)}
              >
                New CDN
              </Button>
            </div>
          )}
          {isLoginByParentUser == 1 && showCdnForm && (
            <Row>
              <div className="col-md-2"></div>
              <div className="col-md-9">
                <div
                  className="features-section-solution"
                  style={{ marginTop: "20px" }}
                >
                  <div
                    className="register-main see-full"
                    style={{ marginTop: "2rem" }}
                  >
                    <div className="bg-img">
                      <img src="/images/blue-box-bg.svg" alt="" />
                    </div>
                    <form className="see-full">
                      <div className="form-top">
                        <div style={{ display: "flex" }}>
                          <h4 className="text-white">Create CDN</h4>
                          <h4
                            className="text-white"
                            style={{ position: "absolute", right: "1px" }}
                          >
                            Price:{" "}
                            {currencyReturn({
                              //value * cdnPrice * 1024,
                              price:
                                selectedTransfers === "GB"
                                  ? value * cdnGBPrice * 1024
                                  : value * cdnTBPrice * 1024,
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                            {/* {value * 1024} */}
                          </h4>
                        </div>

                        <div
                          style={{
                            display: "flex", // Flexbox for horizontal layout
                            alignItems: "center",
                            gap: "20px",
                            flexWrap: "wrap",
                            marginLeft: "5px",
                          }}
                        >
                          <button
                            style={{
                              width: "9rem",
                              height: "40px",
                              zIndex: "9",
                              position: "relative",
                              marginTop: "5px",
                              fontSize: "15px",
                              fontWeight: "700",
                              color: "white",
                              backgroundColor: "#e97730",
                              outline: "4px solid #e97730",
                              border: "4px solid #b71b1b",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              selectedOptions.length ===
                              selectedCacheTypes.length
                                ? setSelectedOptions([]) // Deselect all if all options are selected
                                : setSelectedOptions(selectedCacheTypes); // Select all if not already selected
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.fontSize = "17px")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.fontSize = "16px")
                            }
                          >
                            {selectedOptions.length ===
                            selectedCacheTypes.length
                              ? "Unselect All"
                              : "Select All"}
                          </button>
                          <div className="multi-select-container">
                            {selectedCacheTypes.map((option) => (
                              <div key={option} className="custom-radio">
                                <input
                                  type="checkbox"
                                  id={option}
                                  name={option}
                                  checked={selectedOptions.includes(option)}
                                  onChange={() => handleSelection(option)}
                                />
                                <label htmlFor={option} className="radio-label">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="input-container">
                          <input
                            type="text"
                            name="CompanyName"
                            className="input-signup"
                            placeholder="Your Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                        <div className="input-container">
                          <span
                            style={{
                              padding: "0 5px", // Padding between the static text and the input
                              // fontWeight: "bold", // Optional: makes the "www." bold
                              fontSize: "30px",
                              marginTop: "-5px",
                            }}
                          >
                            www.
                          </span>
                          <input
                            type="text"
                            name="CompanyName"
                            className="input-signup"
                            placeholder="Website Origin"
                            value={websiteOrigin}
                            onChange={(e) => setWebsiteOrigin(e.target.value)}
                          />
                        </div>
                        <div className="input-container">
                          <span
                            style={{
                              padding: "0 5px",
                              fontSize: "30px",
                              marginTop: "-5px",
                            }}
                          >
                            www.
                          </span>
                          <input
                            type="text"
                            name="CompanyName"
                            className="input-signup"
                            placeholder="Enter Your Website / APP URL Where you Want"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                          />
                        </div>
                     
                        <div className="multi-select-container">
                          {dataTransfers.map((option) => (
                            <div key={option} className="custom-radio">
                              <input
                                type="checkbox"
                                id={option}
                                name={option}
                                checked={selectedTransfers === option}
                                onChange={() => handleSelectionChange(option)}
                              />
                              <label htmlFor={option} className="radio-label">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>

                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "white",
                            marginTop: "5px",
                            marginRight: "10px",
                          }}
                        >
                          How Much Bandwidth You Have Right Now Monthly?
                        </p>
                        <div
                          style={{
                            marginLeft: "-15px",
                            marginRight: "-10px",
                            marginTop: "-25px",
                            marginBottom: "-10px",
                          }}
                        >
                          <div className="range-slider">
                            <div
                              className="tooltip-horz"
                              style={{ left: `${value}%` }}
                            >
                              {/* <FaChevronDown /> */}
                              {value} {selectedTransfers === "GB" ? "GB" : "TB"}
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={value}
                              onChange={handleChange}
                              className="custom-rangeInput"
                              style={{
                                background: `linear-gradient(to right, #e97730 ${value}%, #ddd ${value}%)`,
                              }}
                            />
                          </div>
                          {/* <RangeSlider /> */}
                        </div>
                        <div className="input-container">
                          <input
                            type="text"
                            name="CompanyName"
                            className="input-signup"
                            placeholder="Name of the Contact Person"
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                          />
                        </div>
                        <div className="input-container">
                          <input
                            type="number"
                            name="CompanyName"
                            className="input-signup"
                            placeholder="Contact Number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", marginTop: "15px" }}>
                        <div className="log-in" onClick={() => UpdateCDN()}>
                          <a className="media-link">
                            <div
                              className="media-banner"
                              style={{
                                width: "auto",
                                height: "50px",
                                marginTop: "10px",
                                marginLeft: "1.8rem",
                              }}
                            >
                              <img
                                className="normal-banner"
                                src="/images/more-info-btn-bg.svg"
                                alt="/images/more-info-btn-bg.svg"
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
                                  color: "white",
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
                                Submit
                              </span>
                            </div>
                          </a>
                        </div>
                        <div
                          className="log-in"
                          onClick={() => setShowCdnForm(false)}
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
                                  fontWeight: "600",
                                }}
                              >
                                Cancel
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-2"></div>
            </Row>
          )}
          <div
            className="heading-dotted-support"
            style={{
              position: "absolute",
              marginLeft: showCdnForm
                ? ""
                : isLoginByParentUser == 1
                ? "-75px"
                : "",
              marginTop: showCdnForm
                ? ""
                : isLoginByParentUser == 1
                ? "8rem"
                : "1rem",
            }}
          >
            CDNs{" "}
          </div>
         
          {cdnList &&
            cdnList.filter((item) => item.status === 1).length > 0 && (
              <div
                className="input-container"
                style={{
                  marginLeft: "82%",
                  position: "relative",
                  border: "2px solid #035189",
                  width: "18rem",
                  marginTop: "60px",
                  height: "55px",
                }}
              >
                <input
                  type="text"
                  name="search"
                  className="input-signup input-tickets"
                  placeholder="Search Website"
                  value={searchText}
                  style={{
                    fontSize: "24px",
                    color: "black",
                    textAlign: "center",
                    width: "10px",
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                {searchText && (
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    onClick={() => setSearchText("")}
                  >
                    <FaX
                      style={{
                        //marginBottom: "2px",
                        color: "#154e7a",
                        display: "inline-block",
                        fontSize: "19px",
                      }}
                    />
                  </button>
                )}
              </div>
            )}
          {/* {activeStatusButton == "Active" && ( */}
          <div
            style={{
              marginTop: isLoginByParentUser == 1 ? "2rem" : "2rem",
              marginLeft: "8rem",
            }}
          >
            {cdnList &&
              cdnList
                .filter(
                  (item) =>
                    item.status === 1 &&
                    item.website_url
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                )
                .map((item, idx) => (
                  <div className="table-row-noti">
                    <div className="bar"></div>
                    <div className="message">
                      <Row>
                        <div
                          className="col-md-3"
                          style={{ marginLeft: "10px" }}
                        >
                          <div
                            className="desc"
                            style={{ fontWeight: "500", fontSize: "20px" }}
                          >
                            Person Name: {item.person_name}
                          </div>
                          <div
                            className="desc"
                            style={{ fontWeight: "500", fontSize: "20px" }}
                          >
                            Website URL : {item.website_url}
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div
                            className="desc"
                            style={{ fontWeight: "500", fontSize: "20px" }}
                          >
                            Contact Number: {item.contact_number}
                          </div>
                          <div
                            className="desc"
                            style={{ fontWeight: "500", fontSize: "20px" }}
                          >
                            Bandwidth: {item.datatransfer_value} TB
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                            className="desc"
                            style={{ fontWeight: "500", fontSize: "20px" }}
                          >
                            Company Name: {item.company_name}
                          </div>
                        </div>
                      </Row>

                      <div
                        style={{
                          marginTop: "15px",
                          marginLeft: "10px",
                          color: "#035189",
                          fontWeight: "500",
                          fontSize: "18px",
                        }}
                      >
                        ADD CNAME Record:
                      </div>
                      <Row>
                        {/* www */}
                        <div className="col-md-5">
                          <div
                            style={{
                              marginLeft: "15px",
                              marginTop: "15px",
                              display: "flex",
                              alignItems: "center",
                              height: "50px",
                              zIndex: "9",
                              position: "relative",
                              color: "white",
                              backgroundColor: "white",
                              outline: "3px solid #e97730",
                              border: "3px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                          >
                            <p
                              style={{
                                color: "#555",
                                textAlign: "center",
                                fontWeight: "500",
                                fontSize: "15px",
                                overflowY: "hidden",
                                paddingTop: "15px",
                                marginLeft: "20px",
                              }}
                            >
                              {" "}
                              WWW
                            </p>
                            {item.cdn_name && (
                              <div>
                                <img
                                  className="hover-zoom"
                                  src={"/images/copy_ic_cdn.svg"}
                                  style={{
                                    marginLeft: "23rem",
                                    width: "30px",
                                    left: "80%",
                                    height: "30px",
                                    color: "white",
                                  }}
                                  onClick={() => {
                                    handleCopy1("WWW", idx);
                                  }}
                                />

                                {copiedStatus1[idx] ? (
                                  <span className="blinkStyleCdn">Copied!</span>
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            style={{
                              marginTop: "15px",
                              display: "flex",
                              alignItems: "center",
                              padding: "5px",
                              height: "50px",
                              zIndex: "9",
                              position: "relative",
                              color: "white",
                              backgroundColor: "white",
                              outline: "3px solid #e97730",
                              border: "3px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                          >
                            <p
                              style={{
                                color: "#555",
                                textAlign: "center",
                                fontSize: "15px",
                                fontWeight: "500",
                                paddingTop: "15px",
                                marginLeft: "20px",
                              }}
                            >
                              {" "}
                              {item.cdn_name && item.cdn_name}
                            </p>
                            {item.cdn_name && (
                              <div className="img-wrapper">
                                <img
                                  className="hover-zoom"
                                  src={"/images/copy_ic_cdn.svg"}
                                  style={{
                                    marginLeft: "10rem",
                                    width: "30px",
                                    //left: "80%",
                                    height: "30px",
                                    color: "white",
                                  }}
                                  onClick={() => {
                                    handleCopy2(item.cdn_name, idx);
                                  }}
                                />
                                {copiedStatus2[idx] ? (
                                  <span className="blinkStyleCdn">Copied!</span>
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-1">
                          {item.domain_validate !== 1 ? (
                            <button
                              style={{
                                //marginLeft: "60px",
                                marginTop: "15px",
                                width: "11rem",
                                // marginTop: "20px",
                                zIndex: "9",
                                position: "relative",
                                //left: "65%",
                                fontWeight: "700",
                                color: "white",
                                height: "50px",
                                backgroundColor: "#e97730",
                                outline: "4px solid #e97730",
                                border: "4px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                              onClick={() =>
                                validateDomain(
                                  item.pull_zone_id,
                                  item.website_url,
                                  item.arn
                                )
                              }
                            >
                              Domain Validate
                            </button>
                          ) : (
                            <div>
                              <img
                                src="/images/verified_success.png"
                                style={{
                                  height: "34px",
                                  width: "34px",
                                  zIndex: "9",
                                  position: "relative",
                                  marginTop: "15px",
                                  //left: "1%",
                                }}
                              />
                              <button
                                style={{
                                  width: "6rem",
                                  zIndex: "9",
                                  position: "relative",
                                  left: "45%",
                                  bottom: "35px",
                                  fontWeight: "700",
                                  color: "white",
                                  height: "40px",
                                  backgroundColor: "#e97730",
                                  outline: "4px solid #e97730",
                                  border: "4px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                                onClick={() =>
                                  validateDomain(
                                    item.pull_zone_id,
                                    item.website_url,
                                    item.arn
                                  )
                                }
                              >
                                Check
                              </button>
                            </div>
                          )}
                        </div>
                      </Row>

                      {item.cname_name && item.cname_value && (
                        <div
                          style={{
                            marginLeft: "10px",
                            marginTop: "15px",
                            color: "#035189",
                            fontWeight: "500",
                            fontSize: "18px",
                          }}
                        >
                          ADD CNAME Record:
                        </div>
                      )}

                      {/* { Second Record} */}
                      <Row>
                        <div className="col-md-5">
                          {item.cname_name && item.cname_value && (
                            <div
                              style={{
                                marginLeft: "15px",
                                marginTop: "15px",
                                display: "flex",
                                alignItems: "center",
                                padding: "5px",
                                height: "50px",
                                zIndex: "9",
                                position: "relative",
                                color: "white",
                                backgroundColor: "white",
                                outline: "3px solid #e97730",
                                border: "3px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#555",
                                  textAlign: "center",
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  paddingTop: "15px",
                                  marginLeft: "10px",
                                }}
                              >
                                {" "}
                                {item.cname_name && item.cname_name}
                              </p>
                              {item.cname_name && (
                                <div className="img-wrapper">
                                  <img
                                    className="hover-zoom"
                                    src={"/images/copy_ic_cdn.svg"}
                                    style={{
                                      marginLeft: "5px",
                                      width: "30px",
                                      // left: "75%",
                                      height: "30px",
                                      color: "white",
                                    }}
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        item.cname_name
                                      );
                                      handleCopy3(item.cname_name, idx);
                                    }}
                                  />
                                  {copiedStatus3[idx] ? (
                                    <span className="blinkStyleCdn">
                                      Copied!
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {item.cname_name && item.cname_value && (
                          <div className="col-md-5">
                            <div
                              style={{
                                marginTop: "15px",
                                display: "flex",
                                alignItems: "center",
                                padding: "5px",
                                height: "50px",
                                zIndex: "9",
                                position: "relative",
                                color: "white",
                                backgroundColor: "white",
                                outline: "3px solid #e97730",
                                border: "3px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#555",
                                  textAlign: "center",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  paddingTop: "15px",
                                  marginLeft: "5px",
                                }}
                              >
                                {" "}
                                {item.cname_value && item.cname_value}
                              </p>
                              {item.cname_value && (
                                <div className="img-wrapper">
                                  <img
                                    className="hover-zoom"
                                    src={"/images/copy_ic_cdn.svg"}
                                    style={{
                                      marginLeft: "5px",
                                      width: "30px",
                                      height: "30px",
                                    }}
                                    onClick={() => {
                                      handleCopy4(item.cname_value, idx);
                                    }}
                                  />
                                  {copiedStatus4[idx] ? (
                                    <span className="blinkStyleCdn">
                                      Copied!
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="col-md-1">
                          {item.cname_name && item.cname_value && (
                            <button
                              style={{
                                width: "11rem",
                                marginTop: "15px",
                                zIndex: "9",
                                position: "relative",
                                //left: "30%",
                                fontWeight: "700",
                                color: "white",
                                height: "50px",
                                backgroundColor: "#e97730",
                                outline: "4px solid #e97730",
                                border: "4px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                              onClick={() =>
                                ARNvalidate(item.pull_zone_id, item.website_url)
                              }
                            >
                              Certificate Validate
                            </button>
                          )}
                        </div>
                      </Row>

                      {/* {Bottom Buttons} */}
                      <div>
                        {/* {CDN Used Button} */}
                        <button
                          style={{
                            width: "10rem",
                            marginLeft: "15px",
                            marginTop: "30px",
                            marginBottom: "10px",
                            zIndex: "9",
                            position: "relative",
                            // marginTop: "15%",
                            // left: "20%",
                            fontWeight: "700",
                            color: "white",
                            height: "50px",
                            // width: "10rem",
                            backgroundColor: "#e97730",
                            outline: "4px solid #e97730",
                            border: "4px solid #ffff",
                            borderColor: "white",
                            borderRadius: "30px",
                          }}
                          onClick={() =>
                            UsedCDN(
                              item.pull_zone_id,
                              item.website_url,
                              item.id
                            )
                          }
                        >
                          CDN Used
                        </button>

                        {/* {Clear Cache Button} */}
                        <button
                          style={{
                            width: "10rem",
                            marginLeft: "20px",
                            marginTop: "20px",
                            zIndex: "9",
                            position: "relative",
                            // marginTop: "15%",
                            // left: "20%",
                            fontWeight: "700",
                            color: "white",
                            height: "50px",
                            // width: "10rem",
                            backgroundColor: "#e97730",
                            outline: "4px solid #e97730",
                            border: "4px solid #ffff",
                            borderColor: "white",
                            borderRadius: "30px",
                          }}
                          onClick={() => createInvalidation(item.pull_zone_id)}
                        >
                          Clear Cache
                        </button>

                        {/* {Get Cname button} */}
                        {!item.cname_name &&
                        !item.cname_value &&
                        item.domain_validate === 1 ? (
                          <button
                            className="loader"
                            style={{
                              width: "11rem",
                              marginLeft: "20px",
                              marginTop: "20px",
                              zIndex: "9",
                              position: "relative",
                              // marginTop: "15%",
                              // left: "20%",
                              fontWeight: "700",
                              color: "white",
                              height: "50px",
                              // width: "10rem",
                              backgroundColor: "#e97730",
                              outline: "4px solid #e97730",
                              border: "4px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                            onClick={() =>
                              getCname(item.pull_zone_id, item.arn)
                            }
                          >
                            Generate CName
                          </button>
                        ) : (
                          ""
                        )}

                        {/* {Recharge Button} */}
                        {isLoginByParentUser == 1 && (
                          <button
                            style={{
                              width: "10rem",
                              marginLeft: "20px",
                              marginTop: "20px",
                              zIndex: "9",
                              position: "relative",
                              // marginTop: "15%",
                              // left: "20%",
                              fontWeight: "700",
                              color: "white",
                              height: "50px",
                              // width: "10rem",
                              backgroundColor: "#e97730",
                              outline: "4px solid #e97730",
                              border: "4px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                            onClick={() => handleRedirect()}
                          >
                            Recharge
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="">
                      {isLoginByParentUser == 1 && (
                        <button
                          style={{
                            width: "10rem",
                            height: "2rem",
                            // marginLeft: "1rem",
                            zIndex: "9",
                            position: "relative",
                            marginTop: "15px",
                            // left: "20%",
                            fontWeight: "700",
                            color: "white",
                            height: "50px",
                            // backgroundColor: "#b71b1b",
                            backgroundColor:
                              hoveredIndex === idx ? "#b71b1b" : "#e97730",
                            outline:
                              hoveredIndex === idx
                                ? "4px solid #b71b1b"
                                : "4px solid #e97730",
                            border: "4px solid #b71b1b",
                            borderColor: "white",
                            borderRadius: "30px",
                          }}
                          onClick={() => {
                            hoveredIndex === idx
                              ? disableCDN(item.pull_zone_id)
                              : handle();
                          }}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          {hoveredIndex === idx ? "Delete" : "Active"}
                        </button>
                      )}
                      <p style={{ fontWeight: "600", marginTop: "100px" }}>
                        Created
                      </p>{" "}
                      <br />
                      <p style={{ position: "relative", marginTop: "-40px" }}>
                        {item.created_at}
                      </p>
                    </div>
                  </div>
                ))}
            {cdnList && cdnList.length === 0 ? (
              <div
                style={{
                  position: "relative",
                  left: "45%",
                  marginTop: "12rem",
                  fontSize: "24px",
                  fontWeight: "400",
                }}
              >
                No Records
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {/* )} */}
          {activeStatusButton == "Disabled" && (
            <div
              style={{
                marginTop: "2rem",
                marginLeft: "8rem",
              }}
            >
              {cdnList &&
                cdnList
                  .filter(
                    (item) =>
                      item.status === 0 &&
                      item.website_url
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                  )
                  .map((item, idx) => (
                    <div className="table-row-noti">
                      <div className="bar"></div>
                      <div className="message">
                        <Row>
                          <div
                            className="col-md-3"
                            style={{ marginLeft: "10px" }}
                          >
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "20px" }}
                            >
                              Person Name: {item.person_name}
                            </div>
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "20px" }}
                            >
                              Website URL : {item.website_url}
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "20px" }}
                            >
                              Contact Number: {item.contact_number}
                            </div>
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "20px" }}
                            >
                              Bandwidth: {item.datatransfer_value} TB
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div
                              className="desc"
                              style={{ fontWeight: "500", fontSize: "20px" }}
                            >
                              Company Name: {item.company_name}
                            </div>
                          </div>
                        </Row>

                        <div
                          style={{
                            marginTop: "15px",
                            marginLeft: "10px",
                            color: "#035189",
                            fontWeight: "500",
                            fontSize: "18px",
                          }}
                        >
                          ADD CNAME Record:
                        </div>
                        <Row>
                          {/* www */}
                          <div className="col-md-5">
                            <div
                              style={{
                                marginLeft: "15px",
                                marginTop: "15px",
                                display: "flex",
                                alignItems: "center",
                                //border: "2px solid white",
                                //Radius: "25px",
                                //padding: "5px",
                                height: "50px",
                                zIndex: "9",
                                position: "relative",
                                color: "white",
                                backgroundColor: "white",
                                outline: "3px solid #e97730",
                                border: "3px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#555",
                                  textAlign: "center",
                                  fontWeight: "500",
                                  fontSize: "18px",
                                  overflowY: "hidden",
                                  paddingTop: "15px",
                                  marginLeft: "20px",
                                }}
                              >
                                {" "}
                                WWW
                              </p>
                              {/* {item.cdn_name && (
                                <div>
                                  <img
                                    className="hover-zoom"
                                    src={"/images/copy_ic_cdn.svg"}
                                    style={{
                                      marginLeft: "30rem",
                                      width: "30px",
                                      left: "80%",
                                      height: "30px",
                                      color: "white",
                                    }}
                                    onClick={() => {
                                      handleCopy1("WWW", idx);
                                    }}
                                  />

                                  {copiedStatus1[idx] ? (
                                    <span className="blinkStyleCdn">
                                      Copied!
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                </div>
                              )} */}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div
                              style={{
                                //marginLeft: "20px",
                                marginTop: "15px",
                                display: "flex",
                                alignItems: "center",
                                //border: "2px solid white",
                                //Radius: "25px",
                                padding: "5px",
                                height: "50px",
                                zIndex: "9",
                                position: "relative",
                                color: "white",
                                backgroundColor: "white",
                                outline: "3px solid #e97730",
                                border: "3px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#555",
                                  textAlign: "center",
                                  fontSize: "18px",
                                  fontWeight: "500",
                                  paddingTop: "15px",
                                  marginLeft: "20px",
                                }}
                              >
                                {" "}
                                {item.cdn_name && item.cdn_name}
                              </p>
                              {/* {item.cdn_name && (
                                <div className="img-wrapper">
                                  <img
                                    className="hover-zoom"
                                    src={"/images/copy_ic_cdn.svg"}
                                    style={{
                                      marginLeft: "28rem",
                                      width: "30px",
                                      //left: "80%",
                                      height: "30px",
                                      color: "white",
                                    }}
                                    onClick={() => {
                                      handleCopy2(item.cdn_name, idx);
                                    }}
                                  />
                                  {copiedStatus2[idx] ? (
                                    <span className="blinkStyleCdn">
                                      Copied!
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                </div>
                              )} */}
                            </div>
                          </div>

                          {/* <div className="col-md-1">
                            {item.domain_validate !== 1 ? (
                              <button
                                style={{
                                  //marginLeft: "60px",
                                  marginTop: "15px",
                                  width: "11rem",
                                  // marginTop: "20px",
                                  zIndex: "9",
                                  position: "relative",
                                  //left: "65%",
                                  fontWeight: "700",
                                  color: "white",
                                  height: "50px",
                                  backgroundColor: "#e97730",
                                  outline: "4px solid #e97730",
                                  border: "4px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                                onClick={() =>
                                  validateDomain(
                                    item.pull_zone_id,
                                    item.website_url,
                                    item.arn
                                  )
                                }
                              >
                                Domain Validate
                              </button>
                            ) : (
                              <div>
                                <img
                                  src="/images/verified_success.png"
                                  style={{
                                    height: "34px",
                                    width: "34px",
                                    zIndex: "9",
                                    position: "relative",
                                    left: "65%",
                                  }}
                                />
                                <button
                                  style={{
                                    width: "6rem",
                                    zIndex: "9",
                                    position: "relative",
                                    left: "70%",
                                    fontWeight: "700",
                                    color: "white",
                                    height: "40px",
                                    backgroundColor: "#e97730",
                                    outline: "4px solid #e97730",
                                    border: "4px solid #ffff",
                                    borderColor: "white",
                                    borderRadius: "30px",
                                  }}
                                  onClick={() =>
                                    validateDomain(
                                      item.pull_zone_id,
                                      item.website_url,
                                      item.arn
                                    )
                                  }
                                >
                                  Check
                                </button>
                              </div>
                            )}
                          </div> */}
                        </Row>

                        {item.cname_name && item.cname_value && (
                          <div
                            style={{
                              marginLeft: "10px",
                              marginTop: "15px",
                              color: "#035189",
                              fontWeight: "500",
                              fontSize: "18px",
                            }}
                          >
                            ADD CNAME Record:
                          </div>
                        )}

                        {/* { Second Record} */}
                        <Row>
                          <div className="col-md-5">
                            {item.cname_name && item.cname_value && (
                              <div
                                style={{
                                  marginLeft: "15px",
                                  marginTop: "15px",
                                  //marginBottom: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  //border: "2px solid white",
                                  //Radius: "25px",
                                  padding: "5px",
                                  height: "50px",
                                  zIndex: "9",
                                  position: "relative",
                                  color: "white",
                                  backgroundColor: "white",
                                  outline: "3px solid #e97730",
                                  border: "3px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                              >
                                <p
                                  style={{
                                    color: "#555",
                                    textAlign: "center",
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    paddingTop: "15px",
                                    marginLeft: "20px",
                                  }}
                                >
                                  {" "}
                                  {item.cname_name && item.cname_name}
                                </p>
                                {/* {item.cname_name && (
                                  <div className="img-wrapper">
                                    <img
                                      className="hover-zoom"
                                      src={"/images/copy_ic_cdn.svg"}
                                      style={{
                                        marginLeft: "80px",
                                        width: "30px",
                                        //left: "80%",
                                        height: "30px",
                                        color: "white",
                                      }}
                                      onClick={() => {
                                        handleCopy3(item.cname_name, idx);
                                      }}
                                    />
                                    {copiedStatus3[idx] ? (
                                      <span className="blinkStyleCdn">
                                        Copied!
                                      </span>
                                    ) : (
                                      <span></span>
                                    )}
                                  </div>
                                )} */}
                              </div>
                            )}
                          </div>

                          {item.cname_name && item.cname_value && (
                            <div className="col-md-6">
                              <div
                                style={{
                                  marginTop: "15px",
                                  //marginLeft: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  //border: "2px solid white",
                                  //Radius: "25px",
                                  padding: "5px",
                                  height: "50px",
                                  zIndex: "9",
                                  position: "relative",
                                  color: "white",
                                  backgroundColor: "white",
                                  outline: "3px solid #e97730",
                                  border: "3px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                              >
                                <p
                                  style={{
                                    color: "#555",
                                    textAlign: "center",
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    paddingTop: "15px",
                                    marginLeft: "20px",
                                  }}
                                >
                                  {" "}
                                  {item.cname_value && item.cname_value}
                                </p>
                                {/* {item.cname_value && (
                                  <div className="img-wrapper">
                                    <img
                                      className="hover-zoom"
                                      src={"/images/copy_ic_cdn.svg"}
                                      style={{
                                        marginLeft: "100px",
                                        width: "30px",
                                        height: "30px",
                                      }}
                                      onClick={() => {
                                        handleCopy4(item.cname_value, idx);
                                      }}
                                    />
                                    {copiedStatus4[idx] ? (
                                      <span className="blinkStyleCdn">
                                        Copied!
                                      </span>
                                    ) : (
                                      <span></span>
                                    )}
                                  </div>
                                )} */}
                              </div>
                            </div>
                          )}

                          {/* <div className="col-md-1">
                            {item.cname_name && item.cname_value && (
                              <button
                                style={{
                                  width: "11rem",
                                  marginTop: "15px",
                                  zIndex: "9",
                                  position: "relative",
                                  //left: "30%",
                                  fontWeight: "700",
                                  color: "white",
                                  height: "50px",
                                  backgroundColor: "#e97730",
                                  outline: "4px solid #e97730",
                                  border: "4px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                                onClick={() =>
                                  ARNvalidate(
                                    item.pull_zone_id,
                                    item.website_url
                                  )
                                }
                              >
                                Certificate Validate
                              </button>
                            )}
                          </div> */}
                        </Row>

                        {/* {Bottom Buttons} */}
                        <div>
                          {/* {CDN Used Button} */}
                          {/* <button
                            style={{
                              width: "10rem",
                              marginLeft: "15px",
                              marginTop: "30px",
                              marginBottom: "10px",
                              zIndex: "9",
                              position: "relative",
                              // marginTop: "15%",
                              // left: "20%",
                              fontWeight: "700",
                              color: "white",
                              height: "50px",
                              // width: "10rem",
                              backgroundColor: "#e97730",
                              outline: "4px solid #e97730",
                              border: "4px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                            onClick={() =>
                              UsedCDN(
                                item.pull_zone_id,
                                item.website_url,
                                item.id
                              )
                            }
                          >
                            CDN Used
                          </button> */}

                          {/* {Clear Cache Button} */}
                          {/* <button
                            style={{
                              width: "10rem",
                              marginLeft: "20px",
                              marginTop: "20px",
                              zIndex: "9",
                              position: "relative",
                              // marginTop: "15%",
                              // left: "20%",
                              fontWeight: "700",
                              color: "white",
                              height: "50px",
                              // width: "10rem",
                              backgroundColor: "#e97730",
                              outline: "4px solid #e97730",
                              border: "4px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                            onClick={() =>
                              createInvalidation(item.pull_zone_id)
                            }
                          >
                            Clear Cache
                          </button> */}

                          {/* {Get Cname button} */}
                          {/* {item.arn &&
                            item.cname_name === null &&
                            item.cname_value === null && (
                              <button
                                style={{
                                  width: "11rem",
                                  marginLeft: "20px",
                                  marginTop: "20px",
                                  zIndex: "9",
                                  position: "relative",
                                  // marginTop: "15%",
                                  // left: "20%",
                                  fontWeight: "700",
                                  color: "white",
                                  height: "50px",
                                  // width: "10rem",
                                  backgroundColor: "#e97730",
                                  outline: "4px solid #e97730",
                                  border: "4px solid #ffff",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                }}
                                onClick={() =>
                                  getCname(item.pull_zone_id, item.arn)
                                }
                              >
                                Get CName & Value
                              </button>
                            )} */}

                          {/* {Recharge Button} */}
                          {/* <button
                            style={{
                              width: "10rem",
                              marginLeft: "20px",
                              marginTop: "20px",
                              zIndex: "9",
                              position: "relative",
                              // marginTop: "15%",
                              // left: "20%",
                              fontWeight: "700",
                              color: "white",
                              height: "50px",
                              // width: "10rem",
                              backgroundColor: "#e97730",
                              outline: "4px solid #e97730",
                              border: "4px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                            }}
                            onClick={() => handleRedirect()}
                          >
                            Recharge
                          </button> */}
                        </div>
                      </div>

                      <div className="datetime">
                        <p style={{ fontWeight: "600" }}>Created</p> <br />
                        <p style={{ position: "relative", marginTop: "-40px" }}>
                          {item.created_at}
                        </p>
                      </div>
                    </div>
                  ))}

              <div
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                  marginTop: "20px",
                }}
              >
                {cdnList &&
                cdnList.filter((item) => item.status === 0).length === 0 ? (
                  <div>No Records</div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="apptoast-align">
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>
    </div>
  );
};

const styles = {
  label: {
    marginRight: "20px",
    fontSize: "18px",
  },
  radio: {
    width: "20px",
    marginRight: "8px",
  },
  radioSelected: {
    color: "red",
    width: "20px",
    marginRight: "8px",
    backgroundColor: "red",
  },
};

export default CDNPage;
