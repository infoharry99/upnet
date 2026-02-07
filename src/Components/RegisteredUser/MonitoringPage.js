import React, { useEffect, useState } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import "./SupportPage.css";
import "./MonitoringPage.css";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  decryptData,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import { useNavigate } from "react-router-dom";

const MonitoringPage = () => {
  const navigate = useNavigate();

  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const { smuser } = useAuth();
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [machineData, setMachineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monitorData, setMonitorData] = useState([]);
  const innerButtons = [
    "Performance Issue",
    "Network Issue",
    "Installation Issue",
    "Sales",
    "Billing Query",
    "Other",
  ];
  const GetMyMachines = async () => {
    const payload = {
      user_id: smuser.id,
    };
    try {
      // const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post("/vm/monitor", payload);
      //console.log(loginUserResponse.data, "====/vm/monitor");

      // const loginResponse = await apiDecrypteRequest(loginUserResponse.data);
      const vm = loginUserResponse.data.vms;
      const moniters_machine = loginUserResponse.data.moniters_machine;
      //console.log(moniters_machine, "==!==!==moniters_machine");
      setMonitorData(moniters_machine);
      // //console.log(user, "==!==!==user");
      // //console.log(vm, "==!==!==vm");
      const vmArray = Object.keys(vm).map((key) => vm[key]);
      //console.log(vmArray, "==!==!==vvmArraym");
      setMachineData(vmArray);
      // const vmArray = Object.keys(vm).map((key) => vm[key]);
      // localStorage.setItem("NEW_USER", JSON.stringify(userDetails));
      // window.location.href = "/";
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const ReloadMoniter = async (vm_id) => {
    setLoading(true);
    if (vm_id !== null) {
      const payload = {
        user_id: smuser.id,
        vm_id: vm_id,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        //console.log(encryptedResponse, "=encryptedResponse");
        const loginUserResponse = await instance.post(
          "/reloadmoniter",
          encryptedResponse
        );
        //console.log(loginUserResponse.data, "====loginUserResponse");
        const loginResponse = await decryptData(loginUserResponse.data);
        const vm = loginResponse.data.vms;
        //console.log(moniters_machine, "==!==!==vms");
        //console.log(vm, "==!==!==vm");
        const vmArray = Object.keys(vm).map((key) => vm[key]);
        //console.log(vmArray, "==!==!==vvmArraym");
        setMachineData(vmArray);
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    GetMyMachines();
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

  return (
    <div
      style={{
        width: "100%",
        minHeight: "75rem",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundColor: "#141414",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
      }}
    >
      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-support">
            Monitoring <span></span>
          </div>
          <div
            className="features-section-solution"
            style={{ marginTop: "0px" }}
          >
            <div className="wallet-container" style={{ marginBottom: "50px" }}>
              <div className="wallet-box-main">
                {machineData &&
                  machineData.map((item, idx) => (
                    <div
                      className="wallet-col"
                      style={{
                        borderBottom:
                          item.public_ip !== null
                            ? "0.15rem solid #ccc"
                            : "none",
                        padding: "3.5rem 0px",
                        marginTop: "-30px",
                      }}
                    >
                      {item.public_ip && (
                        <>
                          <div
                            style={{
                              // width: "15%",
                              padding: "0rem 1rem",
                            }}
                          >
                            <img
                              src="/images/admin/12-Monitoring-01/server-img.png"
                              alt="/images/admin/12-Monitoring-01/server-img.png"
                              style={
                                {
                                  // width: "14rem",
                                }
                              }
                            />
                            {/* MACHINE NAME */}
                            <div
                              // className="configs-monitor"
                              style={{
                                textAlign: "center",
                                marginLeft: "3rem",
                                marginTop: "-9rem",
                                position: "absolute",
                                zIndex: "9",
                                height: "4rem",
                                // display: "flex",
                                // alignItems: "center",
                                // justifyContent: "center",
                                fontWeight: "500",
                                fontSize: "24px",
                              }}
                            >
                              {item.vm_name}
                              <div
                                className="machine-config-badge"
                                style={{
                                  color: "white",
                                }}
                              >
                                {/* 1 GB / 40 GB / 2 CPU(s) */}
                                {item.ram / 1024} GB /{" "}
                                {item.disk_type === "hdd"
                                  ? item.hard_disk
                                  : item.disk_type === "ssd"
                                  ? item.ssd
                                  : item.nvme}{" "}
                                GB / {item.cpu} CPU(s)
                              </div>
                              <div
                                className="machine-ip"
                                style={{ marginTop: "8px" }}
                              >
                                Public IP: {item.public_ip}
                              </div>
                              <div
                                className="machine-ip"
                                style={{ marginTop: "8px" }}
                              >
                                Private IP: {item.ip_address}
                              </div>
                            </div>
                          </div>
                          {/* CPU */}
                          <div
                            className="stat"
                            style={{ maxWidth: "15rem", padding: "10px" }}
                          >
                            <div
                              className="machine-icon-edit-profile"
                              style={{
                                backgroundColor: `${
                                  item.used_cpu !== "0"
                                    ? (item.used_cpu * 100) / item.cores < 75
                                      ? "green"
                                      : (item.used_cpu * 100) / item.cores < 90
                                      ? "#c9c900"
                                      : "red"
                                    : "green"
                                }`,
                              }}
                            >
                              <span
                                className="see-white-text"
                                style={{
                                  fontSize: "25px",
                                  fontWeight: "600",
                                  color: "white",
                                }}
                              >
                                {((item.used_cpu * 100) / item.cores).toFixed(
                                  0
                                )}
                                %
                              </span>
                            </div>
                            <div className="machine-title theme-bg-orange">
                              CPU Utilisation
                            </div>
                          </div>

                          {/* RAM */}
                          <div
                            className="stat"
                            style={{ maxWidth: "15rem", padding: "10px" }}
                          >
                            <div
                              className="machine-icon-edit-profile"
                              style={{
                                backgroundColor: `${
                                  item.used_ram !== "0"
                                    ? (item.used_ram * 100) / item.ram < 75
                                      ? "green"
                                      : (item.used_ram * 100) / item.ram < 90
                                      ? "#c9c900"
                                      : "red"
                                    : "green"
                                }`,
                              }}
                            >
                              <span
                                className="see-white-text"
                                style={{
                                  fontSize: "25px",
                                  fontWeight: "600",
                                  color: "white",
                                }}
                              >
                                {item.used_ram !== "0"
                                  ? ((item.used_ram * 100) / item.ram).toFixed(
                                      0
                                    ) + "%"
                                  : "0%"}
                              </span>
                            </div>
                            <div className="machine-title theme-bg-orange">
                              RAM Utilisation
                            </div>
                          </div>
                          {/* Storage */}
                          <div
                            className="stat"
                            style={{ maxWidth: "15rem", padding: "10px" }}
                          >
                            <div
                              className="machine-icon-edit-profile"
                              style={{
                                backgroundColor: `${
                                  item.used_disk !== "0"
                                    ? (item.used_disk * 100) / item.disk < 75
                                      ? "green"
                                      : (item.used_disk * 100) / item.disk < 90
                                      ? "#c9c900"
                                      : "red"
                                    : "green"
                                }`,
                              }}
                            >
                              <span
                                className="see-white-text"
                                style={{
                                  fontSize: "25px",
                                  fontWeight: "600",
                                  color: "white",
                                }}
                              >
                                {" "}
                                {item.used_disk !== "0"
                                  ? (
                                      (item.used_disk * 100) /
                                      item.disk
                                    ).toFixed(0)
                                  : "0"}
                                %
                              </span>
                            </div>
                            <div className="machine-title theme-bg-orange">
                              Storage Utilisation
                            </div>
                          </div>
                          <div
                            className="stat"
                            style={
                              {
                                //maxWidth: "15rem",
                                //marginTop: "20px",
                              }
                            }
                          >
                            <button
                              style={{
                                position: "absolute",
                                //top: "9%",
                                // left: "10%",
                                fontWeight: "700",
                                color: "white",
                                height: "55px",
                                width: "7rem",
                                backgroundColor: "#e97730",
                                outline: "4px solid #e97730",
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
                              // onClick={() => ReloadMoniter(item.vm_id)}
                              onClick={() =>
                                navigate("/monitor-graph", {
                                  state: {
                                    vm_data: item.vm_id,
                                  },
                                })
                              }
                            >
                              View More
                            </button>
                          </div>
                          {/* Data transfer */}
                          {/* <div
                        className="stat"
                        style={{ maxWidth: "15rem", padding: "10px" }}
                      >
                        <div
                          className="machine-icon-edit-profile"
                          style={{
                            backgroundColor: `${
                              item.used_bandwidth !== "0"
                                ? (item.used_bandwidth * 100) / 0.1 < 75
                                  ? "green"
                                  : (item.used_bandwidth * 100) / 0.1 < 90
                                  ? "#c9c900"
                                  : "red"
                                : "green"
                            }`,
                          }}
                        >
                          <span
                            className="see-white-text"
                            style={{
                              fontSize: "25px",
                              fontWeight: "600",
                              color: "white",
                            }}
                          >
                            {item.used_bandwidth !== "0"
                              ? ((item.used_bandwidth * 100) / 0.1).toFixed(0)
                              : "0"}
                            %
                          </span>
                        </div>
                        <div className="machine-title theme-bg-orange">
                          Data Transfer
                        </div>
                      </div> */}
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "100%", padding: "5rem" }}
        >
          <div className="heading-dotted-support">
            Monitoring <span></span>
          </div>
          <div className="features-section-solution">
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-11">
                <div
                  style={{
                    position: "relative",
                    marginTop: "1rem",
                  }}
                >
                  {/*  */}
                  <div className="wallet-container">
                    <div className="wallet-box-main">
                      {machineData &&
                        machineData.map((item, idx) => (
                          <div
                            className="wallet-col"
                            style={{
                              borderBottom:
                                item.public_ip !== null
                                  ? "0.15rem solid #ccc"
                                  : "none",
                            }}
                          >
                            {item.public_ip && (
                              <>
                                <div
                                  style={{
                                    // width: "15%",
                                    padding: "0rem 0rem",
                                  }}
                                >
                                  <img
                                    src="/images/admin/12-Monitoring-01/server-img.png"
                                    alt="/images/admin/12-Monitoring-01/server-img.png"
                                    style={
                                      {
                                        // width: "14rem",
                                      }
                                    }
                                  />
                                  {/* MACHINE NAME */}
                                  <div
                                    // className="configs-monitor"
                                    style={{
                                      textAlign: "center",
                                      // width: "13rem",
                                      // marginLeft: "1rem",
                                      marginTop: "-9rem",
                                      position: "absolute",
                                      zIndex: "9",
                                      height: "4rem",
                                      // display: "flex",
                                      // alignItems: "center",
                                      // justifyContent: "center",
                                      fontWeight: "500",
                                      fontSize: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        maxWidth: "15.5rem",
                                        textAlign: "center",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      {item.vm_name}
                                    </div>
                                    <div
                                      className="machine-config-badge"
                                      style={{
                                        color: "white",
                                        marginLeft: "32px",
                                        width: "12rem",
                                        textAlign: "center",
                                      }}
                                    >
                                      {/* 1 GB / 40 GB / 2 CPU(s) */}
                                      {item.ram / 1024} GB /{" "}
                                      {item.disk_type === "hdd"
                                        ? item.hard_disk
                                        : item.disk_type === "ssd"
                                        ? item.ssd
                                        : item.nvme}{" "}
                                      GB / {item.cpu} CPU(s)
                                    </div>
                                    <div
                                      className="machine-ip"
                                      style={{
                                        marginTop: "8px",
                                        width: "16rem",
                                        textAlign: "center",
                                      }}
                                    >
                                      Public IP: {item.public_ip}
                                    </div>
                                    <div
                                      className="machine-ip"
                                      style={{
                                        marginTop: "8px",
                                        width: "16rem",
                                        textAlign: "center",
                                      }}
                                    >
                                      Private IP: {item.ip_address}
                                    </div>
                                  </div>
                                </div>
                                {/* CPU */}
                                <div
                                  className="stat"
                                  style={{
                                    maxWidth: "15rem",
                                    marginTop: "20px",
                                  }}
                                >
                                  <div
                                    className="machine-icon-edit-profile"
                                    style={{
                                      backgroundColor: `${
                                        item.used_cpu !== "0"
                                          ? (item.used_cpu * 100) / item.cores <
                                            75
                                            ? "green"
                                            : (item.used_cpu * 100) /
                                                item.cores <
                                              90
                                            ? "#c9c900"
                                            : "red"
                                          : "green"
                                      }`,
                                    }}
                                  >
                                    <span
                                      className="see-white-text"
                                      style={{
                                        fontSize: "25px",
                                        fontWeight: "600",
                                        color: "white",
                                      }}
                                    >
                                      {(
                                        (item.used_cpu * 100) /
                                        item.cores
                                      ).toFixed(0)}
                                      %
                                    </span>
                                  </div>
                                  <div className="machine-title theme-bg-orange">
                                    CPU Utilisation
                                  </div>
                                  {/* <div className="mid-portion" /> */}
                                  {/* <div className="machine-subtitle theme-bg-blue">
                              {item.value}
                              </div> */}
                                </div>

                                {/* RAM */}
                                <div
                                  className="stat"
                                  style={{
                                    maxWidth: "15rem",
                                    marginTop: "20px",
                                  }}
                                >
                                  <div
                                    className="machine-icon-edit-profile"
                                    style={{
                                      backgroundColor: `${
                                        item.used_ram !== "0"
                                          ? (item.used_ram * 100) / item.ram <
                                            75
                                            ? "green"
                                            : (item.used_ram * 100) / item.ram <
                                              90
                                            ? "#c9c900"
                                            : "red"
                                          : "green"
                                      }`,
                                    }}
                                  >
                                    <span
                                      className="see-white-text"
                                      style={{
                                        fontSize: "25px",
                                        fontWeight: "600",
                                        color: "white",
                                      }}
                                    >
                                      {item.used_ram !== "0"
                                        ? (
                                            (item.used_ram * 100) /
                                            item.ram
                                          ).toFixed(0) + "%"
                                        : "0%"}
                                    </span>
                                  </div>
                                  <div className="machine-title theme-bg-orange">
                                    RAM Utilisation
                                  </div>
                                </div>
                                {/* Storage */}
                                <div
                                  className="stat"
                                  style={{
                                    maxWidth: "15rem",
                                    marginTop: "20px",
                                  }}
                                >
                                  <div
                                    className="machine-icon-edit-profile"
                                    style={{
                                      backgroundColor: `${
                                        item.used_disk !== "0"
                                          ? (item.used_disk * 100) / item.disk <
                                            75
                                            ? "green"
                                            : (item.used_disk * 100) /
                                                item.disk <
                                              90
                                            ? "#c9c900"
                                            : "red"
                                          : "green"
                                      }`,
                                    }}
                                  >
                                    <span
                                      className="see-white-text"
                                      style={{
                                        fontSize: "25px",
                                        fontWeight: "600",
                                        color: "white",
                                      }}
                                    >
                                      {" "}
                                      {item.used_disk !== "0"
                                        ? (
                                            (item.used_disk * 100) /
                                            item.disk
                                          ).toFixed(0)
                                        : "0"}
                                      %
                                    </span>
                                  </div>
                                  <div className="machine-title theme-bg-orange">
                                    Storage Utilisation
                                  </div>
                                </div>

                                {/* Reload Button */}
                                <div
                                  className="stat"
                                  style={
                                    {
                                      //maxWidth: "15rem",
                                      //marginTop: "20px",
                                    }
                                  }
                                >
                                  <button
                                    style={{
                                      position: "absolute",
                                      top: "40%",
                                      left: "90%",
                                      fontWeight: "700",
                                      color: "white",
                                      height: "55px",
                                      width: "7rem",
                                      backgroundColor: "#e97730",
                                      outline: "4px solid #e97730",
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
                                    // onClick={() => ReloadMoniter(item.vm_id)}
                                    onClick={() =>
                                      navigate("/monitor-graph", {
                                        state: {
                                          vm_data: item.vm_id,
                                        },
                                      })
                                    }
                                  >
                                    View More
                                  </button>
                                </div>
                              </>
                            )}

                            {/* Data transfer */}
                            {/* <div
                              className="stat"
                              style={{ maxWidth: "15rem", marginTop: "20px" }}
                            >
                              <div
                                className="machine-icon-edit-profile"
                                style={{
                                  backgroundColor: `${
                                    item.used_bandwidth !== "0"
                                      ? item.used_bandwidth < 75
                                        ? "green"
                                        : item.used_bandwidth < 90
                                        ? "#c9c900"
                                        : "red"
                                      : "green"
                                  }`,
                                }}
                              >
                                <span
                                  className="see-white-text"
                                  style={{
                                    fontSize: "25px",
                                    fontWeight: "600",
                                    color: "white",
                                  }}
                                >
                                  {" "}
                                  
                                  {item.used_bandwidth} %
                                </span>
                              </div>
                              <div className="machine-title theme-bg-orange">
                                Data Transfer
                              </div>
                            </div> */}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          </div>
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

export default MonitoringPage;
