import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import "../RegisteredUser/WalletPage.css";
import toast, { Toaster } from "react-hot-toast";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  currencyReturn,
  decryptData,
  getCurrencySymbol,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import AppToast from "../../AppToast";
// import RangeSlider from "./common/RangeSlider";

const VMAssignPage = () => {
  const location = useLocation();
  const { smuser, appCurrency } = useAuth();
  const selectedUser = location.state ? location.state.userDetail : null;
  const isServerOrCDN = location.state ? location.state.isServerOrCDN : null;

  const navigate = useNavigate();
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  const middleListSmall = [" CPU", " RAM", " SSD Disk", " Bandwidth"];

  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [walletData, setWalletData] = useState([]);
  const [vmID, setVmID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childVMData, setChildVMData] = useState(null);
  const [cdnData, setCDNData] = useState([]);

  useEffect(() => {
    // window.scrollTo(0, 0);
    getVMList();
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const getVMList = async () => {
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
      const loginResponse = await decryptData(loginUserResponse.data);
      const userDetails = loginResponse;
      const user = loginResponse.user;
      const vm = loginResponse.vm;
      //   console.log(loginResponse, "==!==!==loginResponse");
      //   console.log(user, "==!==!==user");
      // console.log(vm, "==!==!==vm");
      const vmArray = Object.keys(vm).map((key) => vm[key]);
      // console.log(vmArray, "==!==!==vvmArray");
      setWalletData(vmArray);

      const cdn = loginResponse.cdn;
      const cdnArray = Object.keys(cdn).map((key) => cdn[key]);
      // console.log(cdnArray, "==!==!==cdnArray");
      setCDNData(cdnArray);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
    // childUserList();
  };

  //   const childUserList = async () => {
  //     setLoading(true);
  //     const payload = {
  //       user_id: selectedUser.id,
  //     };
  //     try {
  //       const encryptedResponse = await apiEncryptRequest(payload);
  //       //console.log(encryptedResponse, "=encryptedResponse");

  //       const loginUserResponse = await instance.post(
  //         "/childuserlist",
  //         encryptedResponse
  //       );
  //       //console.log(loginUserResponse.data, "====loginUserResponse");

  //       const loginResponse = await decryptData(loginUserResponse.data);
  //       //   console.log(loginResponse, "GetMachines");
  //       //   const userDetails = loginResponse;
  //       //   const user = loginResponse.user;
  //       const vm = loginResponse.vm;
  //       //   console.log(user, "user_GetMachines");

  //       const vmArray = Object.keys(vm).map((key) => vm[key]);
  //       setChildVMData(vmArray);
  //     } catch (error) {
  //       console.error("Error during the login process:", error);
  //     }
  //     setLoading(false);
  //   };

  const assignVM = async (vmid) => {
    setLoading(true);
    const payload = {
      user_id: selectedUser.id,
      parent_id: smuser.id,
      vm_id: vmid,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/assignvm",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      const vm = loginResponse.vm;
      console.log(vm, "==!==!==VM Assign Respone");
      if (loginResponse.status) {
        // window.location.href = "assigned-vm";
        navigate("/assigned-vm", {
          state: {
            userDetail: selectedUser,
          },
        });
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
    }
    setLoading(false);
  };

  const assignCDN = async (cdnid) => {
    setLoading(true);
    const payload = {
      user_id: selectedUser.id,
      parent_id: smuser.id,
      cdn_id: cdnid,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/assigncdn",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      const vm = loginResponse.vm;
      console.log(vm, "==!==!==CDN Assign Respone");
      if (loginResponse.status) {
        // window.location.href = "settings";
        //   navigate("/assigned-vm", {
        //     state: {
        //       userDetail: selectedUser,
        //     },
        //   });
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

      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-support">
            {isServerOrCDN === "SERVER" && "VM LIST"}
            {isServerOrCDN === "CDN" && "CDN LIST"} <span></span>
          </div>

          <div
            className="features-section-solution"
            style={{ marginTop: "0px" }}
          >
            {isServerOrCDN === "SERVER" && (
              <div
                style={{
                  position: "relative",
                  marginTop: "1rem",
                }}
              >
                <div className="wallet-container" style={{ width: "90%" }}>
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
                          {/* Assign */}
                          <div
                            style={{
                              // width: "15%",
                              marginTop: "130px",
                              padding: "0rem 1rem",
                            }}
                            onClick={() => {
                              assignVM(item.vm_id);
                            }}
                          >
                            <div className="log-in" style={{}}>
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
                                    Assign
                                  </span>
                                </div>
                              </a>
                            </div>
                          </div>
                          {/* Button */}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {isServerOrCDN === "CDN" && (
              <div
                style={{
                  position: "relative",
                  marginTop: "1rem",
                }}
              >
                <div className="wallet-container" style={{ width: "90%" }}>
                  <div className="wallet-box">
                    {cdnData &&
                      cdnData.map((item, idx) => (
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
                              style={
                                {
                                  // width: "14rem",
                                }
                              }
                            />
                            {/* Website Url */}
                            <div
                              style={{
                                // width: "14rem",
                                fontSize: "14px",
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
                              width: "100%",
                              padding: "0rem 1rem",
                              marginTop: "90px",
                            }}
                          >
                            {/* <img
                              src="/admin/images/admin/wallet/details-bg.png"
                              alt="/admin/images/admin/wallet/details-bg.png"
                              style={{width: "5rem"}}
                            /> */}

                            <div
                              style={{
                                marginTop: "-4.5rem",
                                position: "relative",
                                zIndex: "9",
                                height: "4rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-evenly",
                                flexDirection: "column",
                                textAlign: "center",
                              }}
                            >
                              <div
                                className="details-label"
                                style={{ fontSize: "16px" }}
                              >
                                Total Data: {item.datatransfer_value} TB
                              </div>
                              <div
                                className="details-label"
                                style={{ fontSize: "16px" }}
                              >
                                Remaining Data: {item.remaining_data} TB
                              </div>
                            </div>
                          </div>

                          {/* Button Assign*/}
                          <div
                            className="log-in"
                            style={{
                              // marginBottom: "6px",
                              marginTop: "20px",
                            }}
                            onClick={() => {
                              assignCDN(item.cdn_id);
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
                                  Assign
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "75rem", padding: "5rem" }}
        >
          <div className="heading-dotted-support">
            {isServerOrCDN === "SERVER" && "VM LIST"}
            {isServerOrCDN === "CDN" && "CDN LIST"}
            <span></span>
          </div>

          <div className="features-section-solution">
            <Row>
              <div className="col-md-1"></div>
              <div
                className={
                  isServerOrCDN === "SERVER" ? "col-md-11" : "col-md-10"
                }
              >
                {isServerOrCDN === "SERVER" && (
                  <div className="features-section-solution">
                    <Row>
                      <div className="col-md-1"></div>
                      <div className="col-md-10">
                        <div
                          style={{
                            position: "relative",
                            marginTop: "1rem",
                          }}
                        >
                          <div
                            className="wallet-container"
                            // style={{ marginTop: "80px" }}
                          >
                            <div className="wallet-box-main">
                              {walletData &&
                                walletData.map((item, idx) => (
                                  <div
                                    className="wallet-col"
                                    style={{
                                      justifyContent: "normal",
                                      gap: "50px",
                                      //   marginLeft: "30px",
                                    }}
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
                                        style={
                                          {
                                            // width: "14rem",
                                          }
                                        }
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
                                          {item.ram / 1024} GB GB
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
                                    {/* <div
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
                                  price: item.machine_o_rate, // - 38,
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}

                                {/* <FaRupeeSign
                                  style={{
                                    color: "black",
                                    marginBottom: "-3px",
                                  }}
                                />{" "}
                                0.00 }
                              </div>
                            </div>
                            {/* Remaining Days to Recharge }
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
                                <span>&nbsp;&nbsp;</span> Days to Expire
                              </div>
                            </div> */}
                                    <div
                                      className="log-in"
                                      style={{
                                        marginBottom: "6px",
                                      }}
                                      onClick={() => {
                                        assignVM(item.vm_id);
                                      }}
                                    >
                                      <a className="media-link">
                                        <div
                                          className="media-banner"
                                          style={{
                                            minWidth: "12rem",
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
                                            {/* Already Assigned */}
                                            Assign
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </div>
                )}

                {isServerOrCDN === "CDN" && (
                  <div
                    className="wallet-container"
                    style={{ marginTop: "30px", marginLeft: "100px" }}
                  >
                    <div className="wallet-box-main">
                      {cdnData &&
                        cdnData.map((item, idx) => (
                          <div
                            className="wallet-col"
                            style={{
                              marginLeft: "50px",
                              justifyContent: "normal",
                              gap: "50px",
                            }}
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
                                style={
                                  {
                                    // width: "14rem",
                                  }
                                }
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
                                <div
                                  className="details-label"
                                  style={{ fontSize: "18px" }}
                                >
                                  Total Data: {item.datatransfer_value} TB
                                </div>
                                <div
                                  className="details-label"
                                  style={{ fontSize: "18px" }}
                                >
                                  Remaining Data: {item.remaining_data} TB
                                </div>
                              </div>
                            </div>

                            {/* PRICE */}
                            {/* <div
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
                            </div> */}
                            {/* Remaining Data */}
                            {/* <div
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
                            </div> */}
                            {/* Button Recharge*/}
                            <div
                              className="log-in"
                              style={{
                                marginBottom: "6px",
                              }}
                              onClick={() => {
                                assignCDN(item.cdn_id);
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
                                    Assign
                                  </span>
                                </div>
                              </a>
                            </div>

                            {/* { Button Disable} */}
                            {/* {item.cdn_status !== 0 && (
                              <div
                                className="log-in"
                                style={{
                                  marginTop: "10px",
                                  //marginBottom: "6px",
                                  backgroundColor: "#b71b1b",
                                  outline: "4px solid #b71b1b",
                                  border: "4px solid #b71b1b",
                                  borderColor: "white",
                                  borderRadius: "30px",
                                  height: "50px",
                                }}
                                onClick={() => {
                                  // disableCDN(item.pull_zone_id);
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
                            )} */}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
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

export default VMAssignPage;
