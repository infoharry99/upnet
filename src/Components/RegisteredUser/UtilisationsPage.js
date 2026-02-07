import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./UtilisationsPage.css";
import { useAuth } from "../../AuthContext";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  decryptData,
} from "../../Api";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const UtilisationsPage = () => {
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const navigate = useNavigate();
  const location = useLocation();
  const { smuser } = useAuth();
  const [machineData, setMachineData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [vmData, setVmData] = useState(null);
  const vm_data = location.state ? location.state.vm_data : null;
  //console.log(vm_data, "=vm_data");

  const utilizeCall = async () => {
    setLoading(true);
    if (vm_data !== null) {
      const payload = {
        user_id: smuser.id,
        vm_id: vm_data,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/vm/moniter",
          encryptedResponse
        );
        const loginResponse = await decryptData(loginUserResponse.data);
        const userDetails = loginResponse;
        // console.log(userDetails.moniters_machine, "==!==!==moniter");
        setMachineData(userDetails.moniters_machine);
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    }
    setLoading(false);
  };

  const ReloadMoniter = async () => {
    setLoading(true);
    if (vm_data !== null) {
      const payload = {
        user_id: smuser.id,
        vm_id: vm_data,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/reloadmoniter",
          encryptedResponse
        );
        const loginResponse = await decryptData(loginUserResponse.data);
        const userDetails = loginResponse;
        // console.log(userDetails.moniters_machine, "==!==!==reloadmoniter");
        setMachineData(userDetails.moniters_machine);
        utilizeCall();
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    }
    //setLoading(false);
  };
  
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const innerButtons = [
    "Performance Issue",
    "Network Issue",
    "Installation Issue",
    "Sales",
    "Billing Query",
    "Other",
  ];

  useEffect(() => {
    if (vm_data === null) {
      navigate(-1);
    } else {
      utilizeCall();
    }

    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const [index, setIndex] = useState(0);

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
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
          {/* <Spinner animation="border" /> */}
        </div>
      )}
      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-machine">
            Cloud VM List <span></span>
          </div>
          <div>
            <button
              style={{
                position: "absolute",
                top: "5%",
                left: "70%",
                fontWeight: "700",
                color: "white",
                height: "55px",
                fontSize: "14px",
                width: "7rem",
                backgroundColor: "#e97730",
                outline: "4px solid #e97730",
                border: "4px solid #ffff",
                borderColor: "white",
                borderRadius: "30px",
              }}
              onClick={() => ReloadMoniter()}
            >
              Refresh
            </button>
          </div>
          {machineData && (
            <div className="util-cont" style={{ height: "111rem" }}>
              {/* CPU */}
              <div
                className="box"
                style={{
                  marginRight: "15px",
                  marginTop: "40px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px 0px",
                    zIndex: "1",
                  }}
                >
                  <img
                    style={{
                      left: "78px",
                      position: "absolute",
                      width: "294px",
                      height: `${
                        (
                          (machineData.used_cpu * 100) /
                          machineData.cores
                        ).toFixed(0) * 2
                      }%`,
                      display: "inline",
                      bottom: "-12.2rem",
                      transition: "height 0.5s ease-in-out",
                    }}
                    src={`${
                      machineData.used_cpu !== "0"
                        ? machineData.used_cpu < 75
                          ? "/admin/images/admin/04-Utilisation/4.png"
                          : machineData.used_cpu < 90
                          ? "/admin/images/admin/04-Utilisation/1.png"
                          : "/admin/images/admin/04-Utilisation/4.png"
                        : "/admin/images/admin/04-Utilisation/4.png"
                    }`}
                  />
                  <img
                    src="/admin/images/admin/04-Utilisation/server.png"
                    className="bg-image"
                    style={{
                      position: "absolute",
                      // width: "10rem",
                      // height: "100%",
                      left: "75px",
                      right: "0",
                      top: "0",
                      zIndex: "-1",
                    }}
                  />

                  <div
                    className="machine-icon cpu-icon"
                    style={{
                      position: "relative",

                      left: "85px",
                      bottom: "200px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        marginLeft: "-5px",
                        alignContent: "center",
                        height: "130px",
                        width: "130px",
                        // padding: "5px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        // margin: "auto",
                        backgroundColor: "transparent",
                        padding: "0",
                      }}
                    >
                      <div
                        className="in-border"
                        style={{
                          height: "110px",
                          width: "110px",
                          padding: "1px 1px 1px 12px",
                          borderColor: "yellow",
                          border: "2px solid #E97730",
                          borderRadius: "50%",
                          // display: "table",
                          margin: "auto",
                          backgroundColor: `${
                            machineData.used_ram !== "0"
                              ? machineData.used_cpu < 75
                                ? "green"
                                : machineData.used_cpu < 90
                                ? "#c9c900"
                                : "red"
                              : "green"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            marginRight: "10px",
                            textAlign: "center",
                            marginTop: "37px",
                          }}
                        >
                          <h6
                            style={{
                              color: "white",
                              fontSize: "24px",
                              fontWeight: "600",
                            }}
                          >
                            {machineData.used_ram !== "0"
                              ? machineData.used_cpu
                              : "0"}{" "}
                            %
                          </h6>
                        </div>
                      </div>
                    </div>
                    <Button
                      style={{
                        marginTop: "-2px",
                        width: "210px",
                        height: "35px",
                        marginLeft: "-40px",
                        backgroundColor: "transparent",
                        border: "3px solid rgb(233, 119, 48)",
                        borderRadius: "25px",
                      }}
                    >
                      <h4
                        style={{
                          color: "white",
                          backgroundColor: "rgb(233, 119, 48)",
                          // paddingTop: "4px",
                          borderRadius: "15px",
                          height: "26px",
                          marginTop: "-4px",
                          fontSize: "22px",
                          fontWeight: "700",
                          marginLeft: "-13px",
                          width: "200px",
                        }}
                      >
                        CPU Utilisation
                      </h4>
                    </Button>
                    <div className="front-mobile" key={index}>
                      <div
                        style={{
                          zIndex: "999",
                          left: "50px",
                          top: "-37px",
                          position: "relative",
                          height: "5px",
                          width: "15px",
                          backgroundColor: "#ffffff",
                        }}
                      ></div>
                    </div>
                    {/* <img
                              src="/images/admin/01-home/cpu.svg"
                              className="cpu"
                            /> */}
                  </div>

                  {/* <div className="machine-title">CPU Intensive</div> */}
                  <div className="actions" style={{ marginTop: "-1px" }}></div>
                </div>
              </div>

              {/* RAM */}
              <div
                className="box"
                style={{
                  marginRight: "15px",
                  // marginTop: "30px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px 0px",
                    zIndex: "1",
                  }}
                >
                  <img
                    style={{
                      left: "78px",
                      position: "absolute",
                      width: "294px",
                      height: `${
                        machineData.used_ram !== "0"
                          ? ((machineData.used_ram * 100) / machineData.ram) * 2
                          : 0
                      }%`,
                      display: "inline",
                      bottom: "-12.2rem",
                      transition: "height 0.5s ease-in-out",
                    }}
                    src={`${
                      machineData.used_ram !== "0"
                        ? (machineData.used_ram * 100) / machineData.ram < 75
                          ? "/admin/images/admin/04-Utilisation/4.png"
                          : (machineData.used_ram * 100) / machineData.ram < 90
                          ? "/admin/images/admin/04-Utilisation/1.png"
                          : "/admin/images/admin/04-Utilisation/4.png"
                        : "/admin/images/admin/04-Utilisation/4.png"
                    }`}
                  />
                  <img
                    src="/admin/images/admin/04-Utilisation/server.png"
                    className="bg-image"
                    style={{
                      position: "absolute",
                      // width: "10rem",
                      // height: "100%",
                      left: "75px",
                      right: "0",
                      top: "0",
                      zIndex: "-1",
                    }}
                  />
                  <div
                    className="machine-icon cpu-icon"
                    style={{
                      position: "relative",
                      left: "85px",
                      bottom: "200px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        marginLeft: "-5px",
                        alignContent: "center",
                        height: "130px",
                        width: "130px",
                        // padding: "5px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        // margin: "auto",
                        backgroundColor: "transparent",
                        padding: "0",
                      }}
                    >
                      <div
                        className="in-border"
                        style={{
                          height: "110px",
                          width: "110px",
                          padding: "1px 1px 1px 12px",
                          borderColor: "yellow",
                          border: "2px solid #E97730",
                          borderRadius: "50%",
                          // display: "table",
                          margin: "auto",
                          backgroundColor: `${
                            machineData.used_ram !== "0"
                              ? machineData.used_ram < 75
                                ? "green"
                                : machineData.used_ram < 90
                                ? "#c9c900"
                                : "red"
                              : "green"
                          }`,
                          // backgroundColor: "#E97730",
                        }}
                      >
                        <div
                          style={{
                            marginRight: "10px",
                            textAlign: "center",
                            marginTop: "37px",
                          }}
                        >
                          <h6
                            style={{
                              color: "white",
                              fontSize: "24px",
                              fontWeight: "600",
                            }}
                          >
                            {machineData.used_ram !== "0"
                              ? (
                                  (machineData.used_ram * 100) /
                                  machineData.ram
                                ).toFixed(0)
                              : "0"}{" "}
                            %
                          </h6>
                        </div>
                      </div>
                    </div>
                    <Button
                      style={{
                        marginTop: "-2px",
                        width: "210px",
                        height: "35px",
                        marginLeft: "-40px",
                        backgroundColor: "transparent",
                        border: "3px solid rgb(233, 119, 48)",
                        borderRadius: "25px",
                      }}
                    >
                      <h4
                        style={{
                          color: "white",
                          backgroundColor: "rgb(233, 119, 48)",
                          // paddingTop: "4px",
                          borderRadius: "15px",
                          height: "25px",
                          marginTop: "-3px",
                          fontSize: "22px",
                          fontWeight: "700",
                          marginLeft: "-13px",
                          width: "200px",
                        }}
                      >
                        RAM Utilisation
                      </h4>
                    </Button>
                    <div className="front-mobile" key={index}>
                      <div
                        style={{
                          zIndex: "999",
                          left: "50px",
                          top: "-37px",
                          position: "relative",
                          height: "5px",
                          width: "15px",
                          backgroundColor: "#ffffff",
                        }}
                      ></div>
                    </div>
                    {/* <img
                              src="/images/admin/01-home/cpu.svg"
                              className="cpu"
                            /> */}
                  </div>

                  {/* <div className="machine-title">CPU Intensive</div> */}

                  <div className="actions" style={{ marginTop: "-1px" }}></div>
                </div>
              </div>

              {/* Storage */}
              <div
                className="box"
                style={{
                  marginRight: "15px",
                  // marginTop: "30px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px 0px",
                    zIndex: "1",
                  }}
                >
                  <img
                    style={{
                      left: "78px",
                      position: "absolute",
                      width: "294px",
                      height: `${
                        ((machineData.used_bandwidth * 100) / 100) * 2
                      }%`,
                      display: "inline",
                      bottom: "-12.2rem",
                      transition: "height 0.5s ease-in-out",
                    }}
                    src={`${
                      machineData.used_bandwidth !== "0"
                        ? machineData.used_bandwidth < 75
                          ? "/admin/images/admin/04-Utilisation/4.png"
                          : machineData.used_bandwidth < 90
                          ? "/admin/images/admin/04-Utilisation/1.png"
                          : "/admin/images/admin/04-Utilisation/4.png"
                        : "/admin/images/admin/04-Utilisation/4.png"
                    }`}
                  />
                  <img
                    src="/admin/images/admin/04-Utilisation/server.png"
                    className="bg-image"
                    style={{
                      position: "absolute",
                      // width: "10rem",
                      // height: "100%",
                      left: "75px",
                      right: "0",
                      top: "0",
                      zIndex: "-1",
                    }}
                  />
                  <div
                    className="machine-icon cpu-icon"
                    style={{
                      position: "relative",
                      left: "85px",
                      bottom: "200px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        marginLeft: "8px",
                        alignContent: "center",
                        height: "130px",
                        width: "130px",
                        // padding: "5px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        // margin: "auto",
                        backgroundColor: "transparent",
                        padding: "0",
                      }}
                    >
                      <div
                        className="in-border"
                        style={{
                          height: "110px",
                          width: "110px",
                          padding: "1px 1px 1px 12px",
                          borderColor: "yellow",
                          border: "2px solid #E97730",
                          borderRadius: "50%",
                          // display: "table",
                          margin: "auto",
                          backgroundColor: `${
                            machineData.used_bandwidth !== "0"
                              ? machineData.used_bandwidth < 75
                                ? "green"
                                : machineData.used_bandwidth < 90
                                ? "#c9c900"
                                : "red"
                              : "green"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            marginRight: "10px",
                            textAlign: "center",
                            marginTop: "37px",
                          }}
                        >
                          <h6
                            style={{
                              color: "white",
                              fontSize: "24px",
                              fontWeight: "600",
                            }}
                          >
                            {machineData &&
                              (machineData.used_bandwidth * 100) / 100}{" "}
                            %{/* 70% */}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <Button
                      style={{
                        marginTop: "-2px",
                        width: "230px",
                        height: "35px",
                        marginLeft: "-40px",
                        backgroundColor: "transparent",
                        border: "3px solid rgb(233, 119, 48)",
                        borderRadius: "25px",
                      }}
                    >
                      <h4
                        style={{
                          color: "white",
                          backgroundColor: "rgb(233, 119, 48)",
                          // paddingTop: "4px",
                          borderRadius: "15px",
                          height: "27px",
                          marginTop: "-4px",
                          fontSize: "22px",
                          fontWeight: "700",
                          marginLeft: "-13px",
                          width: "220px",
                        }}
                      >
                        Storage Utilisation
                      </h4>
                    </Button>
                    <div className="front-mobile" key={index}>
                      <div
                        style={{
                          zIndex: "999",
                          left: "50px",
                          top: "-37px",
                          position: "relative",
                          height: "5px",
                          width: "15px",
                          backgroundColor: "#ffffff",
                        }}
                      ></div>
                    </div>
                    {/* <img
                              src="/images/admin/01-home/cpu.svg"
                              className="cpu"
                            /> */}
                  </div>

                  {/* <div className="machine-title">CPU Intensive</div> */}
                  <div className="actions" style={{ marginTop: "-1px" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "100%", padding: "5rem" }}
        >
          <div className="heading-dotted-machine">
            Cloud VM List <span></span>
          </div>
          <div>
            {" "}
            <button
              style={{
                position: "absolute",
                top: "7%",
                left: "80%",
                fontWeight: "700",
                color: "white",
                height: "55px",

                width: "10rem",
                backgroundColor: "#e97730",
                outline: "4px solid #e97730",
                border: "4px solid #ffff",
                borderColor: "white",
                borderRadius: "30px",
              }}
              onMouseOver={(e) => (e.target.style.color = "#07528B")} // Change color on hover
              onMouseOut={(e) => (e.target.style.color = "white")}
              onClick={() => ReloadMoniter()}
            >
              Reload
            </button>
          </div>
          <div className="features-section-solution">
            <Row>
              {/* <div className="col-md-1"></div> */}
              <div className="col-md-12">
                {/* {machineData && ( */}
                {machineData && (
                  <div className="util-cont" style={{ height: "1rem" }}>
                    {/* CPU Utilisation */}
                    <div
                      className="box"
                      style={{
                        marginRight: "15px",
                        marginTop: "40px",
                      }}
                    >
                      <div
                        style={{
                          padding: "20px",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px 0px",
                          zIndex: "1",
                        }}
                      >
                        <img
                          style={{
                            left: "2px",
                            position: "absolute",
                            width: "295px",
                            height: `${
                              (
                                (machineData.used_cpu * 100) /
                                machineData.cores
                              ).toFixed(0) * 2
                            }%`,
                            display: "inline",
                            bottom: "-13.2rem",
                            transition: "height 0.5s ease-in-out",
                          }}
                          src={`${
                            machineData.used_cpu !== "0"
                              ? machineData.used_cpu < 75
                                ? "/admin/images/admin/04-Utilisation/4.png"
                                : machineData.used_cpu < 90
                                ? "/admin/images/admin/04-Utilisation/1.png"
                                : "/admin/images/admin/04-Utilisation/4.png"
                              : "/admin/images/admin/04-Utilisation/4.png"
                          }`}
                          // ""
                        />
                        <img
                          src="/admin/images/admin/04-Utilisation/server.png"
                          className="bg-image"
                          style={{
                            position: "absolute",
                            // width: "10rem",
                            // height: "100%",
                            left: "0",
                            top: "0",
                            zIndex: "-1",
                          }}
                        />
                        <div
                          className="machine-icon cpu-icon"
                          style={{
                            position: "relative",
                            left: "85px",
                            bottom: "200px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              marginLeft: "-5px",
                              alignContent: "center",
                              height: "130px",
                              width: "130px",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              backgroundColor: "transparent",
                              padding: "0",
                            }}
                          >
                            <div
                              className="in-border"
                              style={{
                                height: "110px",
                                width: "110px",
                                padding: "1px 1px 1px 12px",
                                borderRadius: "50%",
                                // display: "table",
                                margin: "auto",
                                backgroundColor: `${
                                  (machineData.used_cpu * 100) /
                                    machineData.cores !==
                                  "0"
                                    ? (machineData.used_cpu * 100) /
                                        machineData.cores <
                                      75
                                      ? "green"
                                      : (machineData.used_cpu * 100) /
                                          machineData.cores <
                                        90
                                      ? "#c9c900"
                                      : "red"
                                    : "green"
                                }`,
                              }}
                            >
                              <div
                                style={{
                                  marginRight: "10px",
                                  textAlign: "center",
                                  marginTop: "37px",
                                }}
                              >
                                <h6
                                  style={{
                                    color: "white",
                                    fontSize: "24px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {/* {machineData.used_cpu} % */}
                                  {(
                                    (machineData.used_cpu * 100) /
                                    machineData.cores
                                  ).toFixed(0)}
                                  %
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="title-cont">
                            <h4 className="title-style">CPU Utilisation</h4>
                          </div>
                          <div className="front-mobile" key={index}>
                            <div className="white-div-uti"></div>
                          </div>
                        </div>

                        <div
                          className="actions"
                          style={{ marginTop: "-1px" }}
                        ></div>
                      </div>
                    </div>

                    {/*  */}
                    <div
                      className="box"
                      style={{
                        marginRight: "15px",
                        marginTop: "40px",
                      }}
                    >
                      <div
                        style={{
                          padding: "20px",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px 0px",
                          zIndex: "1",
                        }}
                      >
                        <img
                          style={{
                            left: "2px",
                            position: "absolute",
                            width: "295px",
                            height: `${
                              machineData.used_ram !== "0"
                                ? ((machineData.used_ram * 100) /
                                    machineData.ram) *
                                  2
                                : 0
                            }%`,
                            display: "inline",
                            bottom: "-13.2rem",
                            transition: "height 1s ease-in-out",
                          }}
                          src={`${
                            machineData.used_ram !== "0"
                              ? (machineData.used_ram * 100) / machineData.ram <
                                75
                                ? "/admin/images/admin/04-Utilisation/4.png"
                                : (machineData.used_ram * 100) /
                                    machineData.ram <
                                  90
                                ? "/admin/images/admin/04-Utilisation/1.png"
                                : "/admin/images/admin/04-Utilisation/4.png"
                              : "/admin/images/admin/04-Utilisation/4.png"
                          }`}
                          // class="wave red-wave"
                        />

                        <img
                          src="/admin/images/admin/04-Utilisation/server.png"
                          className="bg-image"
                          style={{
                            position: "absolute",
                            // width: "10rem",
                            // height: "100%",
                            left: "0",
                            right: "0",
                            top: "0",
                            zIndex: "-1",
                          }}
                        />

                        <div
                          className="machine-icon cpu-icon"
                          style={{
                            position: "relative",
                            left: "85px",
                            bottom: "200px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              marginLeft: "-5px",
                              alignContent: "center",
                              height: "130px",
                              width: "130px",
                              // padding: "5px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              // margin: "auto",
                              backgroundColor: "transparent",
                              padding: "0",
                            }}
                          >
                            <div
                              className="in-border"
                              style={{
                                height: "110px",
                                width: "110px",
                                padding: "1px 1px 1px 12px",
                                // borderColor: "yellow",
                                // border: "2px solid #E97730",
                                borderRadius: "50%",
                                // display: "table",
                                margin: "auto",
                                backgroundColor: `${
                                  machineData.used_ram !== "0"
                                    ? (machineData.used_ram * 100) /
                                        machineData.ram <
                                      75
                                      ? "green"
                                      : (machineData.used_ram * 100) /
                                          machineData.ram <
                                        90
                                      ? "#c9c900"
                                      : "red"
                                    : "green"
                                }`,
                              }}
                            >
                              <div
                                style={{
                                  marginRight: "10px",
                                  textAlign: "center",
                                  marginTop: "37px",
                                }}
                              >
                                <h6
                                  style={{
                                    color: "white",
                                    fontSize: "24px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {machineData.used_ram !== "0"
                                    ? (
                                        (machineData.used_ram * 100) /
                                        machineData.ram
                                      ).toFixed(0)
                                    : "0"}{" "}
                                  %
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="title-cont">
                            <h4 className="title-style">RAM Utilisation</h4>
                          </div>
                          <div className="front-mobile" key={index}>
                            <div className="white-div-uti"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/*  */}
                    <div
                      className="box"
                      style={{
                        marginRight: "15px",
                        marginTop: "40px",
                      }}
                    >
                      <div
                        style={{
                          padding: "20px",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px 0px",
                          zIndex: "1",
                        }}
                      >
                        <img
                          style={{
                            left: "2px",
                            position: "absolute",
                            width: "295px",
                            height: `${
                              ((machineData.used_disk * 100) /
                                machineData.disk) *
                              2
                            }%`,
                            display: "inline",
                            bottom: "-13.2rem",
                            transition: "height 1s ease-in-out",
                          }}
                          src={`${
                            machineData.used_disk !== "0"
                              ? machineData.used_disk < 75
                                ? "/admin/images/admin/04-Utilisation/4.png"
                                : machineData.used_disk < 90
                                ? "/admin/images/admin/04-Utilisation/1.png"
                                : "/admin/images/admin/04-Utilisation/4.png"
                              : "/admin/images/admin/04-Utilisation/4.png"
                          }`}
                        />
                        <img
                          src="/admin/images/admin/04-Utilisation/server.png"
                          className="bg-image"
                          style={{
                            position: "absolute",
                            // width: "10rem",
                            // height: "100%",
                            left: "0",
                            right: "0",
                            top: "0",
                            zIndex: "-1",
                          }}
                        />
                        <div
                          className="machine-icon cpu-icon"
                          style={{
                            position: "relative",
                            left: "85px",
                            bottom: "200px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              marginLeft: "-5px",
                              alignContent: "center",
                              height: "130px",
                              width: "130px",
                              // padding: "5px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              // margin: "auto",
                              backgroundColor: "transparent",
                              padding: "0",
                            }}
                          >
                            <div
                              className="in-border"
                              style={{
                                height: "110px",
                                width: "110px",
                                padding: "1px 1px 1px 12px",
                                // borderColor: "yellow",
                                border: "2px solid #E9773000",
                                borderRadius: "50%",
                                // display: "table",
                                margin: "auto",
                                backgroundColor: `${
                                  machineData.used_disk !== "0"
                                    ? machineData.used_disk < 75
                                      ? "green"
                                      : machineData.used_disk < 90
                                      ? "#c9c900"
                                      : "red"
                                    : "green"
                                }`,
                              }}
                            >
                              <div
                                style={{
                                  marginRight: "10px",
                                  textAlign: "center",
                                  marginTop: "37px",
                                }}
                              >
                                <h6
                                  style={{
                                    color: "white",
                                    fontSize: "24px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {(
                                    (machineData.used_disk * 100) /
                                    machineData.disk
                                  ).toFixed(0)}{" "}
                                  %
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div
                            className="title-cont"
                            style={{
                              marginLeft: "-55px",
                            }}
                          >
                            <h4 className="title-style">Storage Utilisation</h4>
                          </div>
                          <div className="front-mobile" key={index}>
                            <div className="white-div-uti"></div>
                          </div>
                        </div>

                        {/* <div className="machine-title">CPU Intensive</div> */}
                        <div
                          className="actions"
                          style={{ marginTop: "-1px" }}
                        ></div>
                      </div>
                    </div>

                    {/* <div
                      className="box"
                      style={{
                        marginRight: "15px",
                        marginTop: "40px",
                      }}
                    >
                      <div
                        style={{
                          padding: "20px",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px 0px",
                          zIndex: "1",
                        }}
                      >
                        <img
                          style={{
                            left: "2px",
                            position: "absolute",
                            width: "295px",
                            height: `${
                              ((machineData.used_bandwidth * 100) / 100) * 2
                            }%`,
                            display: "inline",
                            bottom: "-13.2rem",
                            transition: "height 0.5s ease-in-out",
                          }}
                          src={`${
                            machineData.used_bandwidth !== "0"
                              ? machineData.used_bandwidth < 75
                                ? "/admin/images/admin/04-Utilisation/4.png"
                                : machineData.used_bandwidth < 90
                                ? "/admin/images/admin/04-Utilisation/1.png"
                                : "/admin/images/admin/04-Utilisation/4.png"
                              : "/admin/images/admin/04-Utilisation/4.png"
                          }`}
                          // ""
                          // class="wave red-wave"
                        />
                        <img
                          src="/admin/images/admin/04-Utilisation/server.png"
                          className="bg-image"
                          style={{
                            position: "absolute",
                            // width: "10rem",
                            // height: "100%",
                            left: "0",
                            right: "0",
                            top: "0",
                            zIndex: "-1",
                          }}
                        />
                        <div
                          className="machine-icon cpu-icon"
                          style={{
                            position: "relative",

                            left: "85px",
                            bottom: "200px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              marginLeft: "-5px",
                              alignContent: "center",
                              height: "130px",
                              width: "130px",
                              // padding: "5px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              // margin: "auto",
                              backgroundColor: "transparent",
                              padding: "0",
                            }}
                          >
                            <div
                              className="in-border"
                              style={{
                                height: "110px",
                                width: "110px",
                                padding: "1px 1px 1px 12px",
                                borderColor: "yellow",
                                border: "2px solid #E9773000",
                                borderRadius: "50%",
                                // display: "table",
                                margin: "auto",
                                backgroundColor: `${
                                  machineData.used_bandwidth !== "0"
                                    ? machineData.used_bandwidth < 75
                                      ? "green"
                                      : machineData.used_bandwidth < 90
                                      ? "#c9c900"
                                      : "red"
                                    : "green"
                                }`,
                              }}
                            >
                              <div
                                style={{
                                  marginRight: "10px",
                                  textAlign: "center",
                                  marginTop: "37px",
                                }}
                              >
                                <h6
                                  style={{
                                    color: "white",
                                    fontSize: "24px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {machineData &&
                                    (machineData.used_bandwidth * 100) / 100}
                                  %
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="title-cont">
                            <h4 className="title-style"> Data Utilisation</h4>
                          </div>
                          <div className="front-mobile" key={index}>
                            <div className="white-div-uti"
                              
                            ></div>
                          </div>
                        </div>

                        <div
                          className="actions"
                          style={{ marginTop: "-1px" }}
                        ></div>
                      </div>
                    </div> */}
                  </div>
                )}

              </div>
              {/* <div className="col-md-1"></div> */}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilisationsPage;