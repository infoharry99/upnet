import React, { useEffect, useState } from "react";
import "./ToggleSwitch.css";
import { Button, Row } from "react-bootstrap";
import "./MyMachinePage.css";
import { useAuth } from "../../AuthContext";
import instance, { apiEncryptRequest, decryptData } from "../../Api";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { FaX } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";
import { useDropdown } from "../Header";

const MyMachinePage = () => {
  const navigate = useNavigate();
  const { dropdownValue } = useDropdown();
  const { smuser, isLoginByParentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [vNCinfo, setVNCinfo] = useState(null);
  const [machineData, setMachineData] = useState(null);
  const [vncPopup, SetVncPopup] = useState(false);
  const [editPopup, SetEditPopup] = useState(false);
  const [deletePopup, SetDeletePopup] = useState(false);
  const [showPlaceholder, SetShowPlaceholder] = useState(false);

  const [progressingVM, setProgressingVM] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editMachineId, setEditMachineId] = useState("");

  const [machineTime, setMachineTime] = useState("");
  const [machineActiveTime, setMachineActiveTime] = useState("");
  const [seconds, setSeconds] = useState(51);
  const [machineUser, setMachineUser] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [deletingMachine, setDeletingMachine] = useState("");

  const [showTermsCondition, setShowTermsCondition] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);
  const [slaDesc, setSLADesc] = useState(null);
  const [slaId, setSLAid] = useState(null);
  const [myMachineId, setMyMachineId] = useState(null);
  const [isProfileVerified, setProfileVerified] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileDevice());


  
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const toggleSwitch = (data) => {
    //console.log(data);
    if (data.status === "on") {
      OnMachine(data.id);
    } else {
      OffMachine(data.id);
    }
  };

  useEffect(() => {
    let countdown;
    if (isActive && seconds > 0) {
      countdown = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setShownOnce(true);
      clearInterval(countdown);
      GetMachines();
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(countdown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isActive, seconds]);

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  useEffect(() => {
    const storedMachineTime = localStorage.getItem("machineTime");
    // console.log(storedMachineTime, "TIME<<<<");
    setMachineTime(storedMachineTime);
    // Calculate active time by adding 15 minutes to stored time
    if (storedMachineTime) {
      const timeObj = new Date(storedMachineTime);
      timeObj.setMinutes(timeObj.getMinutes() + 30);
      const activeTime = timeObj.toISOString();
      setMachineActiveTime(activeTime);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      UpdateVmStatus();
      UpdateStatus();
      updatenetworkstatus();
      GetMachines();
    }, 30000); 
    const intervalDate = setInterval(() => {
      const currentTime = new Date().getTime();
      if (machineActiveTime && currentTime >= machineActiveTime) {
        handleTimeMatch();
        clearInterval(interval); 
      }
    }, 1000); 

    return () => {
      clearInterval(interval);
      clearInterval(intervalDate);
    };
  }, [machineActiveTime]);

  useEffect(() => {
    let intervalId;

    if (countdown === 0) {
      window.location.href = "/vm-machine";
    }

    if (timerStarted) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(intervalId);
            return 0;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timerStarted, countdown]);

  const RebuildMachine = async (machineData) => {
    
    if (machineData == null) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={
            "Oops! Your wallet balance is low, Please Add Money to create machine"
          }
          isMobile={isMobile}
        />
      ));
    } else {
      setLoading(true);
      const reBuildPaylod = {
        user_id: smuser.id,
        request_id: machineData.request_id,
        machine_price: machineData.machine_o_rate,
        plan_time: machineData.plan_time,
        vm_template: machineData.vm_template,
        osiddata: machineData.osiddata,
        name: machineData.vm_name,
        cpu: machineData.cpu,
        ram: machineData.ram,
        hard_disk: machineData.hard_disk,
        data_transfer: machineData.data_transfer,
      };
      if (smuser.platform_status == "1") {
        try {
          const encryptedResponse = await apiEncryptRequest(reBuildPaylod);
          const createMachineRes = await instance.post(
            "/vm/rebuild_new",
            encryptedResponse
          );
          const finalResponse = await decryptData(createMachineRes.data);
          const Details = finalResponse;
          // //console.log(Details.status, "==!==!==Details");
          if (Details.status) {
            window.location.href = "/vm-machine";
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
        }
      } else {
        try {
          setTimeout(() => {
            window.location.href = "/vm-machine";
            setLoading(false);
          }, 3000);
          const encryptedResponse = await apiEncryptRequest(reBuildPaylod);
          const createMachineRes = await instance.post(
            "/vm/rebuild_new",
            encryptedResponse
          );
          // handleRedirect();
          const finalResponse = await decryptData(createMachineRes.data);
          const Details = finalResponse;
          // console.log(Details, "==!==!==/vm/rebuild_new");
          // if (Details.status) {
          //   alert("New machine created successfully ");
          //   window.location.href = "/vm-machine";
          // }
          // if (Details.code == 999) {
          //   alert("Please try again later, Unable to create Machine!");
          // }
          // window.location.href = "/vm-machine";
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
    }
  };

  const handleTimeMatch = () => {
    GetMachines();
  };

  const GetMachines = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/machines",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "GetMachines");
      const userDetails = loginResponse;
      const user = loginResponse.user;
      const vm = loginResponse.vm;
      setMachineUser(user);
      console.log(vm, "==!==!==vm");
      const vmArray = Object.keys(vm).map((key) => vm[key]);
      if (vmArray.find((item) => item.current_action_status === "PROCESSING")) {
        const progressVM = vmArray.find(
          (item) => item.current_action_status === "PROCESSING"
        );
        setIsActive(true);
        setProgressingVM(progressVM.vm_id);
      }

      vmArray.length > 0 ? SetShowPlaceholder(false) : SetShowPlaceholder(true);
      setMachineData(vmArray);
      GetMyDetails();
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const UpdateVmStatus = async () => {
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/updatevmstatus",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const UpdateStatus = async () => {
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/updatestatus",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "updatevmstatus");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    // setLoading(false);
  };

  const updatenetworkstatus = async () => {
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/updatenetworkstatus",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "updatevmstatus");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    // setLoading(false);
  };

  const deleteMachine = async (machineId) => {
    setDeletingMachine(machineId.vm_id);
    toast((t) => (
      <AppToast
        id={t.id}
        message={"Your machine deletion process has been started!"}
        isMobile={isMobile}
      />
    ));
    // setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: machineId.vm_id,
      id: machineId.id,
    };
    // console.log(payload, "------- deleteMachine");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const distroyResponse = await instance.post(
        "/vm/distroy",
        encryptedResponse
      );
      const Response = await decryptData(distroyResponse.data);
      // console.log(Response.data, "====distroyResponse");
      const userDetails = Response;
      if (userDetails.status) {
        GetMachines();
      } else {
        // toast();
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Unable To Delete Machine Please Try Again Later!"}
            isMobile={isMobile}
          />
        ));
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const VMC = async (machineId) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: machineId,
    };
    //console.log(payload, "------- VMC");
    const res = {
      status: true,
      info: {
        port: "5909",
        ip: "175.111.97.101",
        password: "test123",
      },
      code: "200",
    };
    try {
      const vncResponse = await instance.post("vm/vnc", payload);
      if (vncResponse.data.status) {
        setLoading(false);
        const pushUrl = `${vncResponse.data.url}`;
        window.location.href = pushUrl;
      } else {
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const OnMachine = async (machineId) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: machineId,
    };
    //console.log(payload, "ONNNN");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const distroyResponse = await instance.post("/vm/on", encryptedResponse);
      const Response = await decryptData(distroyResponse.data);
      const userDetails = Response;
      // console.log(userDetails, "ONMACHINE");
      if (userDetails.status) {
        GetMachines();
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const OffMachine = async (machineId) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: machineId,
    };
    //console.log(payload, "ONNNN");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const distroyResponse = await instance.post("/vm/off", encryptedResponse);
      const Response = await decryptData(distroyResponse.data);
      const userDetails = Response;
      // console.log(userDetails, "OFFMACHINE");
      if (userDetails.status) {
        GetMachines();
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const slaManagement = async (machineId) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      //vm_id: machineId,
    };
    // console.log(payload, "slaManagement Payload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const distroyResponse = await instance.post(
        "/slamgnt",
        encryptedResponse
      );
      const Response = await decryptData(distroyResponse.data);
      // console.log(Response, "SlaManagment Response");
      if (Response.status) {
        setShowTermsCondition(true);
        setSLADesc(Response.sla);
        setSLAid(Response.sla_id);
        setMyMachineId(machineId);
        // generatePdf();
      }
    } catch (error) {
      console.error("Error during the process:", error);
    }
    setLoading(false);
  };

  const agreeSLAPdf = async (machineid) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: machineid,
      sla_id: slaId,
      finger_print: window.navigator.userAgent,
      //file: slaPdf
    };
    // console.log(payload, "agreeSLAPdf Payload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const termsacceptResponse = await instance.post(
        "/termsaccept",
        encryptedResponse
      );
      const decTermsacceptResponseResponse = await decryptData(
        termsacceptResponse.data
      );
      // console.log(decTermsacceptResponseResponse, "TermsacceptResponse");
      if (decTermsacceptResponseResponse.success) {
        GetMachines();
        toast((t) => (
          <AppToast id={t.id} message={"SLA terms accepted successfully."} />
        ));
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={decTermsacceptResponseResponse.message}
          />
        ));
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    GetMachines();

    function handleResize() {
      setIsMobile(isMobileDevice());
    }
    setTimeout(() => {
      GetMachines();
    }, 5000);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const [index, setIndex] = useState(0);

  const GetMyDetails = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const loginUserResponse = await instance.post("/editprofile", payload);
      //console.log(loginUserResponse.data, "====/vm/monitor");
      const User = loginUserResponse.data.user;
      console.log(User, "====User");
      const country = User.country;

      if (country === "India") {
        if (
          User.gst_verify === 1 ||
          User.aadhar_verify === 1 ||
          User.pan_verify === 1 ||
          User.driving_verify === 1 ||
          User.ciib_verify === 1
        ) {
          setProfileVerified(true);
        }
      } else {
        if (User.identity_verify === 1) {
          setProfileVerified(true);
        }
      }
      // console.log(User, "====/VMMMMMM");
    } catch (error) {}
    setLoading(false);
  };

  const filterByLocation = (dataArray, dropValue) => {
    // console.log(dropValue, "drop");
    if (dropValue === "Global") {
      return dataArray;
    } else {
      return dataArray.filter((item) => item.location === dropValue);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "65rem",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
      }}
    >
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "99999999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
      {showTermsCondition && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backgroundSize: "cover",
              backgroundImage: isMobile
                ? `url(/main-bg.jpg)`
                : `url(/main-bg.jpg)`,
              top: "10%",
              // left: "30%",
              position: "absolute",
              zIndex: "99",
              width: isMobile ? "90%" : "35%",
              backdropFilter: "blur(5px)",
              height: "35rem",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px", 
              border: "2px solid #e97730",
            }}
          >
            <div style={{ display: "grid", justifyItems: "center" }}>
              <button
                style={{
                  color: "#035189",
                  position: "absolute",
                  right: "0px",
                  border: "none",
                  backgroundColor: "transparent",
                  width: "20px",
                  height: "20px",
                }}
                onClick={() => setShowTermsCondition(!showTermsCondition)}
              >
                X
              </button>
              <h4 style={{ marginTop: "10px" }}>SLA Agreement</h4>
              <div
                style={{
                  height: "25rem",
                  overflowY: "scroll",
                  padding: "30px",
                  borderRadius: "8px",
                  border: "1px solid #e97730",
                }}
                id="pdfContent"
              >
                <p>{slaDesc}</p>
              </div>
              <div style={{ display: "grid" }}>
                {/* <p>
                  IP:103.240.168.48 <br />
                  Email: {smuser.email}
                  <br />
                  Mobile: {smuser.phone}
                </p> */}
                <p></p>
              </div>

              <button
                style={{
                  color: "white",
                  width: "8rem",
                  height: "40px",
                  backgroundColor: "#035189",
                  borderRadius: "25px",
                  border: "2px solid #ffff",
                  outline: "2px solid #035189",
                  marginTop: "25px",
                }}
                onClick={() => {
                  setShowTermsCondition(!showTermsCondition);
                  agreeSLAPdf(myMachineId);
                }}
              >
                I AGREE
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          {vncPopup && (
            <div
              style={{
                content: "",
                top: "0",
                left: "0",
                right: "0",
                position: "fixed",
                width: "100%",
                height: "120vh",
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
                  <img
                    src="/admin/images/admin/transaction-failed/transaction-failed-bg.png"
                    style={{
                      width: "25rem",
                      height: "15rem",
                      position: "absolute",
                      marginTop: "45%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  {/* inner box */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: "1",
                      padding: "2.5rem 1.5rem",
                    }}
                  >
                    {/* Close Button */}
                    <div onClick={() => SetVncPopup(false)}>
                      {" "}
                      <FaX
                        style={{
                          position: "absolute",
                          top: "15%",
                          right: "5%",
                          color: "#fff",
                          display: "inline-block",
                          fontSize: "1.5rem",
                        }}
                      />
                    </div>
                    {/* header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {vNCinfo && (
                        <div
                          style={{
                            position: "relative",
                            marginLeft: "20%",
                            marginTop: "23%",
                          }}
                        >
                          <span
                            style={{
                              color: "#154e7a",
                              fontSize: "24px",
                              fontWeight: "600",
                            }}
                          >
                            PORT : {vNCinfo.port} <br />
                            IP : {vNCinfo.ip}
                            <br />
                            PASSWORD : {vNCinfo.password}
                            <br />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="heading-dotted-machine">
            VM List <span></span>
          </div>
          {machineData && machineData.length > 0 ? (
            <>
              {editPopup && (
                <div
                  style={{
                    top: "10%",
                    left: "3%",
                    position: "absolute",
                    zIndex: "9",
                    width: "27rem",
                    backdropFilter: "blur(5px)",
                    height: "20rem",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
                    borderRadius: "12px", // Assuming you want rounded corners
                    border: "2px solid #e97730",
                  }}
                >
                  <button
                    style={{
                      zIndex: "9",
                      position: "absolute",
                      backgroundColor: "transparent",
                      border: "none",
                      right: "0",
                    }}
                    onClick={() => SetEditPopup(!editPopup)}
                  >
                    <FaX
                      style={{
                        marginBottom: "2px",
                        color: "#e97730",
                        display: "inline-block",
                        fontSize: "19px",
                      }}
                    />
                  </button>{" "}
                  <div
                    style={{
                      position: "relative",
                      marginLeft: "10%",
                      marginTop: "20%",
                      display: "flex",
                      flexWrap: "nowrap",
                      flexDirection: "row",
                      gap: "3%",
                    }}
                  >
                    <div>
                      <figure
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "rgb(233, 119, 48)",
                          borderRadius: "50%",
                          objectFit: "cover",
                          margin: "auto",
                          padding: "20px",
                          outline: "3px solid rgb(233, 119, 48)",
                          border: "5px solid white",
                        }}
                      >
                        <img
                          src={"/images/admin/01-home/cpu.svg"}
                          alt={""}
                          style={{
                            marginLeft: "-5px",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      </figure>
                      <div
                        style={{
                          zIndex: "10",
                          top: "95px",
                          left: "70px",
                          position: "absolute",
                          width: "20px",
                          height: "7px",
                          backgroundColor: "#fff",
                        }}
                      ></div>
                      <button
                        style={{
                          width: "10rem",
                          marginTop: "2px",
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
                        onClick={() =>
                          machineData.sla_status == 1
                            ? navigate("/edit-vm", {
                                state: {
                                  machineData: editMachineId,
                                  editType: "os",
                                },
                              })
                            : !isProfileVerified
                            ? navigate("/edit-profile")
                            : slaManagement(editMachineId)
                        }
                      >
                        {" "}
                        Edit OS
                      </button>
                    </div>
                    <div>
                      {" "}
                      <figure
                        style={{
                          width: "100px",
                          height: "100px",
                          background: "rgb(233, 119, 48)",
                          borderRadius: "50%",
                          objectFit: "cover",
                          margin: "auto",
                          padding: "20px",
                          outline: "3px solid rgb(233, 119, 48)",
                          border: "5px solid white",
                        }}
                      >
                        <img
                          src={"/admin/images/admin/menu/vm-white.png"}
                          alt={""}
                          style={{
                            marginLeft: "-5px",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      </figure>{" "}
                      <div
                        style={{
                          zIndex: "10",
                          top: "96px",
                          right: "123px",
                          position: "absolute",
                          width: "20px",
                          height: "7px",
                          backgroundColor: "#ffff",
                        }}
                      ></div>
                      <button
                        style={{
                          width: "10rem",
                          marginTop: "2px",
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
                        onClick={() =>
                          navigate("/edit-vm", {
                            state: {
                              machineData: editMachineId,
                              editType: "config",
                            },
                          })
                        }
                      >
                        Edit Config
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {deletePopup && (
                <div className="delete-popup-div-1">
                  <button
                    style={{
                      zIndex: "9",
                      position: "absolute",
                      backgroundColor: "transparent",
                      border: "none",
                      right: "0",
                    }}
                    onClick={() => SetDeletePopup(!deletePopup)}
                  >
                    <FaX
                      style={{
                        marginBottom: "2px",
                        color: "#e97730",
                        display: "inline-block",
                        fontSize: "19px",
                      }}
                    />
                  </button>{" "}
                  <h5
                    style={{
                      color: "#09528a",
                      textAlign: "center",
                      position: "absolute",
                      marginTop: "5rem",
                    }}
                  >
                    Do you Really Want to DELETE the Machine ?
                  </h5>
                  <div
                    style={{
                      position: "relative",
                      marginLeft: "10%",
                      marginTop: "45%",
                      display: "flex",
                      flexWrap: "nowrap",
                      flexDirection: "row",
                      gap: "3%",
                    }}
                  >
                    <div>
                      <button
                        className="delete-popup-yes-btn-1"
                        onClick={() => {
                          SetDeletePopup(false);
                          deleteMachine(machineToDelete);
                        }}
                      >
                        YES
                      </button>
                    </div>
                    <div>
                      {" "}
                      <button
                        className="delete-popup-no-btn-1"
                        onClick={() => SetDeletePopup(!deletePopup)}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="input-container input-container-1">
                <input
                  type="text"
                  name="search"
                  className="input-signup input-tickets"
                  placeholder="Search Machine"
                  value={searchText}
                  style={{
                    fontSize: "18px",
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
                        marginBottom: "2px",
                        color: "#154e7a",
                        display: "inline-block",
                        fontSize: "19px",
                      }}
                    />
                  </button>
                )}
              </div>
              <div
                className="wallet-container"
                style={{
                  border: "none",
                }}
              >
                <div className="wallet-box">
                  {machineData &&
                    machineData
                      .filter((item) =>
                        item.vm_name
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      )
                      .map((item, idx) => (

                        <div
                          key={idx}
                          className="box"
                          style={{
                            marginTop: "40px",
                            marginTop: "4rem",
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
                              src="/images/admin/01-home/server.svg"
                              className="bg-image"
                              style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                left: "0",
                                right: "0",
                                top: "0",
                                zIndex: "-1",
                              }}
                            />
                            {machineData &&
                              machineData[idx].nw_suspended !== 0 && (
                                <div style={{ position: "relative" }}>
                                  <img
                                    src={"./i-icon.png"}
                                    alt={"./i-icon.png"}
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                      position: "absolute",
                                      top: "35px",
                                      left: "-110px",
                                      cursor: "pointer", // Add a pointer cursor for hover effect
                                    }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                  />
                                  {/* Hover Text */}
                                  {isHovered && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "-15px", // Position below the icon
                                        left: "-110px",
                                        backgroundColor: "#035189",
                                        color: "white",
                                        padding: "5px",
                                        border: "1px solid #035189",
                                        borderRadius: "3px",
                                        boxShadow:
                                          "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        zIndex: "10",
                                      }}
                                    >
                                      {machineData[idx].nw_suspended_msg}
                                    </div>
                                  )}
                                </div>
                              )}

                            {item.vm_id == deletingMachine ? (
                              <div>
                                <div
                                  class="loader-delete"
                                  style={{
                                    position: "relative",
                                    left: "95px",
                                    top: "12px",
                                    border: "none",
                                  }}
                                ></div>
                              </div>
                            ) : item.vm_id == null ? (
                              <>
                                <img
                                  src={"./i-icon.png"}
                                  alt={"./i-icon.png"}
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                {item.current_action_status == "PROCESSING" ? (
                                  <div
                                    class="loader-vnc"
                                    style={{
                                      position: "relative",
                                      height: "10px",
                                      width: "20px",
                                      left: "90px",
                                      // top: "20px",
                                      border: "none",
                                      backgroundColor: "transparent",
                                    }}
                                  ></div>
                                ) : item.current_action_status == "Failed" ? (
                                  <>
                                    {machineUser &&
                                    machineUser.force_status == 1 ? (
                                      <>
                                        <button
                                          style={{
                                            position: "relative",
                                            left: "100px",
                                            // top: "20px",
                                            border: "none",
                                            backgroundColor: "transparent",
                                          }}
                                          onClick={() => RebuildMachine(item)}
                                        >
                                          <img
                                            src={"./refresh.png"}
                                            alt={"./refresh.png"}
                                            style={{
                                              width: "25px",
                                              height: "25px",
                                            }}
                                          />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <img
                                          src={"./i-icon.png"}
                                          alt={"./i-icon.png"}
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                          }}
                                        />
                                      </>
                                    )}
                                  </>
                                ) : (
                                  item.vnc_status !== 0 && (
                                    <button
                                      style={{
                                        position: "relative",
                                        left: "100px",
                                        top: "30px",
                                        border: "none",
                                        backgroundColor: "transparent",
                                      }}
                                      onClick={() => {
                                        if (item.vm_id !== null) {
                                          if (item.sla_status == 1) {
                                            VMC(item.vm_id);
                                          } else {
                                            !isProfileVerified ? (
                                              navigate("/edit-profile")
                                            ) : item.public_ip !== null ? (
                                              slaManagement(item.vm_id)
                                            ) : (
                                              <></>
                                            );
                                            //setShowTermsCondition(true);
                                          }
                                        }
                                      }}
                                    >
                                      <img
                                        src={"./vmc-monitor.png"}
                                        alt={"./vmc-monitor.png"}
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                        }}
                                      />
                                    </button>
                                  )
                                )}
                              </>
                            )}

                         
                            <div
                              className="machine-icon cpu-icon"
                              style={{
                                marginTop: "-60px",
                                marginLeft: "40px",
                              }}
                            >
                              {/* Outer circular border */}
                              <div
                                className="in-border"
                                style={{
                                  marginLeft: item.vm_type === 1 ? "34px" : "34px", // Cloud vs PortGate
                                  alignContent: "center",
                                  height: "100px",
                                  width: "100px",
                                  border: "2px solid #E97730",
                                  borderRadius: "50%",
                                  backgroundColor: "transparent",
                                  padding: "0",
                                }}
                              >
                                {/* Inner circle */}
                                <div
                                  className="in-border" 
                                  style={{
                                    height: "80px",
                                    width: "80px",
                                    padding: "1px 1px 1px 12px",
                                    border: "2px solid #E97730",
                                    borderRadius: "50%",
                                    margin: "auto",
                                    backgroundColor: "#E97730",
                                  }}
                                >
                                  <figure
                                    style={{
                                      background: "#e9773000",
                                      borderRadius: "50%",
                                      padding: "20px 8px 0px 0px",
                                      objectFit: "cover",
                                      display: "table",
                                      margin: "auto",
                                    }}
                                  >
                                    {item.vm_status === 0 && !shownOnce ? (
                                      <div
                                        className="loader-machine-make"
                                        style={{
                                          width: "77px",
                                          marginTop: "-22px",
                                          marginLeft: "-12px",
                                        }}
                                      ></div>
                                    ) : (
                                      <img
                                        src="/images/admin/01-home/cpu.svg"
                                        alt=""
                                        style={{ width: "40px", height: "40px" }}
                                      />
                                    )}
                                  </figure>
                                </div>
                              </div>

                              {/* Dynamic Button */}
                              <Button
                                style={{
                                  marginTop: "-2px",
                                  width: item.vm_type === 1 ? "125px" : "142px", // Cloud vs PortGate
                                  height: "35px",
                                  marginLeft: "10px",
                                  backgroundColor: "transparent",
                                  border: "3px solid rgb(233, 119, 48)",
                                  borderRadius: "25px",
                                }}
                              >
                                <h4
                                  style={{
                                    color: "white",
                                    backgroundColor: "rgb(233, 119, 48)",
                                    paddingTop: "4px",
                                    borderRadius: "15px",
                                    height: "25px",
                                    marginTop: "-3px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    marginLeft: "-12px",
                                    width: item.vm_type === 1 ? "115px" : "130px", // Cloud vs PortGate
                                  }}
                                >
                                  {item.vm_status === 0 &&
                                  item.current_action_status !== "Failed" &&
                                  !shownOnce ? (
                                    "Standard"
                                  ) : (
                                    <>
                                      {item.vm_config_category === 1 ||
                                      item.vm_config_category === 5 ||
                                      item.vm_config_category === 6
                                        ? `${item.vm_type === 1 ? "Cloud " : "PortGate "}Standard`
                                        : item.vm_config_category === 3 ||
                                          item.vm_config_category === 7 ||
                                          item.vm_config_category === 8
                                        ? `${item.vm_type === 1 ? "Cloud " : "PortGate "}CPU Pro`
                                        : item.vm_config_category === 4 ||
                                          item.vm_config_category === 9 ||
                                          item.vm_config_category === 10
                                        ? `${item.vm_type === 1 ? "Cloud " : "PortGate "}RAM Pro`
                                        : ""}
                                    </>
                                  )}
                                </h4>
                              </Button>

                              {/* Small connector line */}
                              <div className="front-mobile" key={index}>
                                <div
                                  style={{
                                    zIndex: "999",
                                    left: item.vm_type === 1 ? "-95px" : "-104px",
                                    top: "-18px",
                                    position: "relative",
                                    height: "4px",
                                    width: "15px",
                                    backgroundColor: "rgb(255 255 255)",
                                  }}
                                ></div>
                              </div>
                            </div>


                            <div
                              className="machine-name theme-color-blue"
                              style={{
                                marginTop: "-15px",
                              }}
                            >
                              {" "}
                              {item.vm_name}
                            </div>
                            <div
                              className="machine-config-badge"
                              style={{
                                color: "white",
                              }}
                            >
                              {item.ram / 1024} GB / {item.hard_disk} GB /{" "}
                              {item.cpu} vCPU(s)
                            </div>
                            <div
                              className="line-shape"
                              style={{
                                width: "95%",
                                height: "2px",
                                borderRadius: "50%",
                                marginTop: "10px",
                                background:
                                  "linear-gradient(90deg, rgba(190, 190, 190, 0), rgba(190, 190, 190, 1), rgba(190, 190, 190, 0))",
                              }}
                            ></div>
                            {item.location !== null ? (
                              <div
                                className="machine-ip"
                                style={{ marginTop: "8px" }}
                              >
                                Location: {item.location}
                              </div>
                            ) : (
                              <div
                                className="machine-ip"
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  marginBottom: "-10px",
                                }}
                              >
                                <a style={{ marginLeft: "-30%" }}>Location:</a>
                                <p
                                  className="loader-ip"
                                  style={{
                                    height: "12px",
                                    marginTop: "1px",
                                    marginLeft: "5px",
                                  }}
                                ></p>
                              </div>
                            )}
                            {item.public_ip !== null ? (
                              <div
                                className="machine-ip"
                                style={{ marginTop: "8px" }}
                              >
                                Public IP: {item.public_ip}
                              </div>
                            ) : (
                              <div
                                className="machine-ip"
                                style={{
                                  marginTop: "8px",
                                  display: "flex",
                                  marginBottom: "-15px",
                                }}
                              >
                                <a style={{ marginLeft: "-30%" }}>Public IP:</a>
                                <p
                                  className="loader-ip"
                                  style={{
                                    marginTop: "1px",
                                    marginLeft: "5px",
                                  }}
                                ></p>
                              </div>
                            )}
                            {item.ip_address !== null ? (
                              <div
                                className="machine-ip"
                                style={{ marginTop: "8px" }}
                              >
                                Private IP: {item.ip_address}
                              </div>
                            ) : (
                              <div
                                className="machine-ip"
                                style={{
                                  marginTop: "8px",
                                  display: "flex",
                                  marginBottom: "-20px",
                                }}
                              >
                                <a style={{ marginLeft: "-30%" }}>
                                  Private IP:
                                </a>
                                <p
                                  className="loader-ip"
                                  style={{
                                    marginTop: "1px",
                                    marginLeft: "5px",
                                  }}
                                ></p>
                              </div>
                            )}
                            <div
                              className="machine-date"
                              style={{ marginTop: "8px" }}
                            >
                              Created:{item.created_at}
                            </div>
                            <div
                              className="actions"
                              style={{
                                paddingLeft: "20px",
                                marginTop: "-4px",
                                marginBottom: "10px",
                                display: "flex",
                                justifyContent: "space-around",
                              }}
                            >
                              <div
                                className="log-in"
                                style={{
                                  marginBottom: "6px",
                                }}
                                onClick={() => {
                                  if (item.vm_id !== null) {
                                    if (item.sla_status == 1) {
                                      if (
                                        item.current_action_status !==
                                        "PROCESSING"
                                      ) {
                                        navigate("/vm/status", {
                                          state: { vmDetails: item.vm_id },
                                        });
                                      } else {
                                        toast((t) => (
                                          <AppToast
                                            id={t.id}
                                            message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                            isMobile={isMobile}
                                          />
                                        ));
                                      }
                                    } else {
                                      //setShowTermsCondition(true);
                                      !isProfileVerified
                                        ? navigate("/edit-profile")
                                        : item.public_ip !== null
                                        ? slaManagement(item.vm_id)
                                        : toast((t) => (
                                            <AppToast
                                              id={t.id}
                                              message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                              isMobile={isMobile}
                                            />
                                          ));
                                    }
                                  }
                                }}
                              >
                                <a className="media-link">
                                  <div
                                    className="media-banner"
                                    style={{
                                      minWidth: "6rem",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <img
                                      className="normal-banner"
                                      src="/admin/images/admin/wallet/add-money-btn.png"
                                      alt=""
                                      style={{
                                        width: "6rem",
                                      }}
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
                                        fontSize: "15px",
                                        marginTop: "0px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      View Status
                                    </span>
                                  </div>
                                </a>
                              </div>

                              <div
                                className="log-in"
                                style={{
                                  marginBottom: "6px",
                                }}
                                onClick={() => {
                                  if (item.vm_id !== null) {
                                    if (item.sla_status == 1) {
                                      if (
                                        item.current_action_status !==
                                          "PROCESSING" &&
                                        item.current_action_status !== "Failed"
                                      ) {
                                        navigate(
                                          //"/vm/moniter/utilize"
                                          "/monitor-graph",
                                          {
                                            state: { vm_data: item.vm_id },
                                          }
                                        );
                                      } else {
                                        toast((t) => (
                                          <AppToast
                                            id={t.id}
                                            message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                            isMobile={isMobile}
                                          />
                                        ));
                                      }
                                    } else {
                                      //setShowTermsCondition(true);
                                      !isProfileVerified
                                        ? navigate("/edit-profile")
                                        : item.public_ip !== null
                                        ? slaManagement(item.vm_id)
                                        : toast((t) => (
                                            <AppToast
                                              id={t.id}
                                              message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                              isMobile={isMobile}
                                            />
                                          ));
                                    }
                                  }
                                }}
                              >
                                <a className="media-link">
                                  <div
                                    className="media-banner"
                                    style={{
                                      minWidth: "6rem",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <img
                                      className="normal-banner"
                                      src="/admin/images/admin/wallet/add-money-btn.png"
                                      alt=""
                                      style={{
                                        width: "6rem",
                                      }}
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
                                        fontSize: "15px",
                                        marginTop: "0px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Monitor
                                    </span>
                                  </div>
                                </a>
                              </div>
                            </div>

                            <div
                              className="actions"
                              style={{ marginTop: "-1px" }}
                            ></div>
                            <div className="icons log-in">
                              <div
                                onClick={() => {
                                  if (item.vm_id !== null) {
                                    if (item.sla_status == 1) {
                                      if (
                                        item.current_action_status !==
                                        "PROCESSING"
                                      ) {
                                        setEditMachineId(item.vm_id);
                                        SetEditPopup(true);
                                      } else {
                                        toast((t) => (
                                          <AppToast
                                            id={t.id}
                                            message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                            isMobile={isMobile}
                                          />
                                        ));
                                      }
                                    } else {
                                      //setShowTermsCondition(true);
                                      !isProfileVerified
                                        ? navigate("/edit-profile")
                                        : item.public_ip !== null
                                        ? slaManagement(item.vm_id)
                                        : toast((t) => (
                                            <AppToast
                                              id={t.id}
                                              message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                              isMobile={isMobile}
                                            />
                                          ));
                                    }
                                  }
                                }}
                              >
                                <a
                                  // href="https://smartcloudvm.com/vm/edit?id=59"
                                  className=""
                                  style={{
                                    marginLeft: "55px",
                                    marginBottom: "-15px",
                                    marginRight: "15px",
                                  }}
                                >
                                  <img src="/images/admin/01-home/edit.svg" />
                                </a>
                              </div>
                              <div
                                onClick={() => {
                                  if (item.vm_id !== null) {
                                    if (item.sla_status == 1) {
                                      if (
                                        item.current_action_status !==
                                        "PROCESSING"
                                      ) {
                                        SetDeletePopup(true);
                                        setMachineToDelete({
                                          vm_id: item.vm_id,
                                          id: item.id,
                                        });
                                        // setDeleteById(item.id);
                                        // deleteMachine(item.vm_id);
                                      } else {
                                        toast((t) => (
                                          <AppToast
                                            id={t.id}
                                            message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                            isMobile={isMobile}
                                          />
                                        ));
                                      }
                                    } else {
                                      //setShowTermsCondition(true);
                                      !isProfileVerified
                                        ? navigate("/edit-profile")
                                        : item.public_ip !== null
                                        ? slaManagement(item.vm_id)
                                        : toast((t) => (
                                            <AppToast
                                              id={t.id}
                                              message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                              isMobile={isMobile}
                                            />
                                          ));
                                    }
                                  }
                                }}
                              >
                                <a
                                  // href="#"
                                  className="delete"
                                  id="59"
                                  onclick="getDistroy(this.id);"
                                  style={{
                                    marginBottom: "-5px",
                                    marginRight: "-30px",
                                  }}
                                >
                                  <img src="/images/admin/01-home/delete.svg" />
                                </a>
                              </div>
                            </div>
                            <div
                              className={`switch ${item.status == 1 ? "on" : "off"}`}
                              onClick={() => {
                                if (item.vm_id !== null) {
                                  if (item.current_action_status == "PROCESSING") {
                                    toast((t) => (
                                      <AppToast
                                        id={t.id}
                                        message="Server configuration in Progress.Please Return after 15 Minutes from the Creation Time"
                                        isMobile={isMobile}
                                      />
                                    ));
                                    return; 
                                  }

                                  // ✅ Continue if SLA is active
                                  if (item.sla_status == 1) {
                                    if (item.current_action_status !== "Failed") {
                                      item.status == 1
                                        ? toggleSwitch({
                                            id: item.vm_id,
                                            status: "off",
                                          })
                                        : toggleSwitch({
                                            id: item.vm_id,
                                            status: "on",
                                          });
                                    } else {
                                      toast((t) => (
                                        <AppToast
                                          id={t.id}
                                          message="⚠️ Server configuration failed. Please check the server status."
                                          isMobile={isMobile}
                                        />
                                      ));
                                    }
                                  } else {
                                    // 🚦 If SLA is not active
                                    !isProfileVerified
                                      ? navigate("/edit-profile")
                                      : item.public_ip !== null
                                      ? slaManagement(item.vm_id)
                                      : toast((t) => (
                                          <AppToast
                                            id={t.id}
                                            message="Server configuration in progress. Please return after 15 minutes."
                                            isMobile={isMobile}
                                          />
                                        ));
                                  }
                                }
                              }}
                              style={{
                                top: "-30px",
                                marginLeft: "-110px",
                                cursor:
                                  item.current_action_status === "PROCESSING" ? "not-allowed" : "pointer", // 👈 Visually show disabled state
                                opacity: item.current_action_status === "PROCESSING" ? 0.6 : 1, // 👈 Slight fade effect
                              }}
                            >
                              <div className="toggle"></div>
                              <div className="labels">
                                <span>ON</span>
                                <span>OFF</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {showPlaceholder && (
                <div style={{ position: "absolute", top: "30%", left: "30%" }}>
                  <figure
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "rgb(233, 119, 48)",
                      borderRadius: "50%",

                      objectFit: "cover",

                      margin: "auto",
                      padding: "20px",
                      outline: "3px solid rgb(233, 119, 48)",
                      border: "5px solid white",
                    }}
                  >
                    <img
                      src={"/admin/images/admin/menu/vm-white.png"}
                      alt={""}
                      style={{
                        marginLeft: "-5px",
                        width: "60px",
                        height: "60px",
                      }}
                    />
                  </figure>
                  <div
                    style={{
                      zIndex: "10",
                      top: "95px",
                      left: "70px",
                      position: "absolute",
                      width: "20px",
                      height: "7px",
                      backgroundColor: "#fff",
                    }}
                  ></div>
                  <button
                    className="create-new-machine"
                    onClick={() => navigate("/vm/create")}
                  >
                    Create Machine
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // WEBVIEW
        <div
          className="features-page-solution"
          style={{ height: "100%", padding: "5rem" }}
        >
          {vncPopup && (
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
                zIndex: "9999999",
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <div>
                  <img
                    src="/admin/images/admin/transaction-failed/transaction-failed-bg.png"
                    style={{
                      width: "25rem",
                      height: "15rem",
                      position: "absolute",
                      marginTop: "20%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  {/* inner box */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: "1",
                      padding: "2.5rem 1.5rem",
                    }}
                  >
                    {/* Close Button */}
                    <div onClick={() => SetVncPopup(false)}>
                      {" "}
                      <FaX
                        style={{
                          position: "absolute",
                          top: "54%",
                          right: "39%",
                          color: "#fff",
                          display: "inline-block",
                          fontSize: "1.5rem",
                        }}
                      />
                    </div>
                    {/* header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {vNCinfo && (
                        <div
                          style={{
                            position: "relative",
                            marginLeft: "45%",
                            marginTop: "15%",
                          }}
                        >
                          <span
                            style={{
                              color: "#154e7a",
                              fontSize: "24px",
                              fontWeight: "600",
                            }}
                          >
                            PORT : {vNCinfo.port} <br />
                            IP : {vNCinfo.ip}
                            <br />
                            PASSWORD : {vNCinfo.password}
                            <br />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="heading-dotted-machine">
            VM List <span></span>
          </div>

          {machineData && machineData.length > 0 && (
            <div
              className="input-container"
              style={{
                marginLeft: "85%",
                position: "relative",
                border: "2px solid #035189",
                width: "15rem",
                marginTop: "-72px",
                height: "55px",
              }}
            >
              <input
                type="text"
                name="search"
                className="input-signup input-tickets"
                placeholder="Search Machine"
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
                      marginBottom: "2px",
                      color: "#154e7a",
                      display: "inline-block",
                      fontSize: "19px",
                    }}
                  />
                </button>
              )}
            </div>
          )}

          <div className="features-section-solution">
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-10">
                {machineData && machineData.length > 0 ? (
                  <>
                    {editPopup && (
                      <div
                        style={{
                          top: "10%",
                          left: "25%",
                          position: "absolute",
                          zIndex: "9",
                          width: "70rem",
                          backdropFilter: "blur(5px)",
                          height: "40rem",
                          // backgroundColor: "orange",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
                          borderRadius: "12px", // Assuming you want rounded corners
                          border: "2px solid #e97730",
                        }}
                      >
                        <button
                          style={{
                            zIndex: "9",
                            position: "absolute",
                            backgroundColor: "transparent",
                            border: "none",
                            right: "0",
                          }}
                          onClick={() => SetEditPopup(!editPopup)}
                        >
                          <FaX
                            style={{
                              marginBottom: "2px",
                              color: "#e97730",
                              display: "inline-block",
                              fontSize: "19px",
                            }}
                          />
                        </button>{" "}
                        <div
                          style={{
                            position: "relative",
                            marginLeft: "25%",
                            marginTop: "23%",
                            display: "flex",
                            flexWrap: "nowrap",
                            flexDirection: "row",
                            gap: "20%",
                          }}
                        >
                          <div>
                            <figure
                              style={{
                                width: "100px",
                                height: "100px",
                                background: "rgb(233, 119, 48)",
                                borderRadius: "50%",
                                objectFit: "cover",
                                margin: "auto",
                                padding: "20px",
                                outline: "3px solid rgb(233, 119, 48)",
                                border: "5px solid white",
                              }}
                            >
                              <img
                                src={"/images/admin/01-home/cpu.svg"}
                                alt={""}
                                style={{
                                  marginLeft: "-5px",
                                  width: "60px",
                                  height: "60px",
                                }}
                              />
                            </figure>
                            <div
                              style={{
                                zIndex: "10",
                                top: "95px",
                                left: "85px",
                                position: "absolute",
                                width: "20px",
                                height: "7px",
                                backgroundColor: "#fff",
                              }}
                            ></div>
                            <button
                              style={{
                                width: "12rem",
                                marginTop: "2px",
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
                              onClick={() =>
                                navigate("/edit-vm", {
                                  state: {
                                    machineData: editMachineId,
                                    editType: "os",
                                  },
                                })
                              }
                            >
                              Edit OS
                            </button>
                          </div>
                          <div>
                            {" "}
                            <figure
                              style={{
                                width: "100px",
                                height: "100px",
                                background: "rgb(233, 119, 48)",
                                borderRadius: "50%",
                                objectFit: "cover",
                                margin: "auto",
                                padding: "20px",
                                outline: "3px solid rgb(233, 119, 48)",
                                border: "5px solid white",
                              }}
                            >
                              <img
                                src={"/admin/images/admin/menu/vm-white.png"}
                                alt={""}
                                style={{
                                  marginLeft: "-5px",
                                  width: "60px",
                                  height: "60px",
                                }}
                              />
                            </figure>{" "}
                            <div
                              style={{
                                zIndex: "10",
                                top: "96px",
                                right: "23.3rem",
                                position: "absolute",
                                width: "20px",
                                height: "7px",
                                backgroundColor: "#ffff",
                              }}
                            ></div>
                            <button
                              style={{
                                width: "12rem",
                                marginTop: "2px",
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
                              onClick={() =>
                                navigate("/edit-vm", {
                                  state: {
                                    machineData: editMachineId,
                                    editType: "config",
                                  },
                                })
                              }
                            >
                              Edit Config
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {deletePopup && (
                      <div
                        style={{
                          top: "7%",
                          left: "40%",
                          position: "absolute",
                          zIndex: "9",
                          width: "27rem",
                          backdropFilter: "blur(5px)",
                          height: "20rem",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
                          borderRadius: "12px", // Assuming you want rounded corners
                          border: "2px solid #e97730",
                        }}
                      >
                        <button
                          style={{
                            zIndex: "9",
                            position: "absolute",
                            backgroundColor: "transparent",
                            border: "none",
                            right: "0",
                          }}
                          onClick={() => SetDeletePopup(!deletePopup)}
                        >
                          <FaX
                            style={{
                              marginBottom: "2px",
                              color: "#e97730",
                              display: "inline-block",
                              fontSize: "19px",
                            }}
                          />
                        </button>{" "}
                        <h4
                          style={{
                            color: "#09528a",
                            textAlign: "center",
                            position: "absolute",
                            marginTop: "5rem",
                          }}
                        >
                          Do you Really Want to DELETE the Machine ?
                        </h4>
                        <div
                          style={{
                            position: "relative",
                            marginLeft: "10%",
                            marginTop: "45%",
                            display: "flex",
                            flexWrap: "nowrap",
                            flexDirection: "row",
                            gap: "3%",
                          }}
                        >
                          <div>
                            <button
                              style={{
                                width: "10rem",
                                marginTop: "2px",
                                zIndex: "9",
                                position: "relative",
                                fontWeight: "700",
                                color: "white",
                                height: "55px",
                                backgroundColor: "#aaa",
                                outline: "4px solid #aaa",
                                border: "4px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                              onClick={() => {
                                SetDeletePopup(false);
                                deleteMachine(machineToDelete);
                              }}
                            >
                              YES
                            </button>
                          </div>
                          <div>
                            {" "}
                            <button
                              style={{
                                width: "10rem",
                                marginTop: "2px",
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
                              onClick={() => SetDeletePopup(!deletePopup)}
                            >
                              NO
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      className="wallet-container"
                      style={{
                        border: "none",
                        marginLeft: "30px",
                      }}
                    >
                      <div
                        className="wallet-box"
                        style={{
                          justifyContent: "unset",
                          alignContent: "flex-start",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          display: "flex",
                          gap: "20px",
                        }}
                      >
                        {machineData &&
                          filterByLocation(machineData, dropdownValue)
                            .filter((item) =>
                              item.vm_name
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                            )
                            .map((item, idx) => (
                              <div
                                className="box"
                                key={idx}
                                style={{
                                  marginRight: "15px",
                                  marginTop: "15px",
                                  position: "relative",
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
                                    src="/images/admin/01-home/server.svg"
                                    className="bg-image"
                                    style={{
                                      position: "absolute",
                                      width: "100%",
                                      height: "105%",
                                      left: "0",
                                      right: "0",
                                      top: "0",
                                      zIndex: "-1",
                                    }}
                                  />
                                  {machineData &&
                                    machineData[idx].nw_suspended !== 0 && (
                                      <div style={{ position: "relative" }}>
                                        <img
                                          src={"./no-wifi.png"}
                                          alt={"./no-wifi.png"}
                                          style={{
                                            width: "24px",
                                            height: "24px",
                                            position: "absolute",
                                            top: "25px",
                                            left: "-110px",
                                            cursor: "pointer", // Add a pointer cursor for hover effect
                                          }}
                                          onMouseEnter={() =>
                                            setIsHovered(true)
                                          }
                                          onMouseLeave={() =>
                                            setIsHovered(false)
                                          }
                                        />
                                        {/* Hover Text */}
                                        {isHovered && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "-15px", // Position below the icon
                                              left: "-110px",
                                              backgroundColor: "#035189",
                                              color: "white",
                                              padding: "5px",
                                              border: "1px solid #035189",
                                              borderRadius: "3px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                              zIndex: "10",
                                            }}
                                          >
                                            {machineData[idx].nw_suspended_msg}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  {/* VMC- Button */}
                                  {/* item.current_action_status !== "Failed" */}
                                  {item.vm_id == deletingMachine ? (
                                    <div>
                                      <div
                                        class="loader-delete"
                                        style={{
                                          position: "relative",
                                          top: "25px",
                                          left: "90px",
                                          border: "none",
                                          // backgroundColor: "grey",
                                        }}
                                      ></div>
                                    </div>
                                  ) : item.vm_id === null ? (
                                    <>
                                      <img
                                        src={"./i-icon.png"}
                                        alt={"./i-icon.png"}
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                        }}
                                      />
                                    </>
                                  ) : item.current_action_status ===
                                    "Failed" ? (
                                    <>
                                      <img
                                        src={"./i-icon.png"}
                                        alt={"./i-icon.png"}
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      {item.current_action_status ==
                                      "PROCESSING" ? (
                                        <div
                                          class="loader-vnc"
                                          style={{
                                            position: "relative",
                                            top: "40px",
                                            height: "15px",
                                            width: "30px",
                                            left: "90px",
                                            border: "none",
                                            backgroundColor: "grey",
                                          }}
                                        ></div>
                                      ) : item.current_action_status ==
                                        "Failed" ? (
                                        <>
                                          {machineUser &&
                                          machineUser.force_status == 1 ? (
                                            <>
                                              <button
                                                style={{
                                                  position: "relative",
                                                  left: "100px",
                                                  // top: "20px",
                                                  border: "none",
                                                  backgroundColor:
                                                    "transparent",
                                                }}
                                                onClick={() =>
                                                  RebuildMachine(item)
                                                }
                                              >
                                                <img
                                                  src={"./refresh.png"}
                                                  alt={"./refresh.png"}
                                                  style={{
                                                    width: "25px",
                                                    height: "25px",
                                                  }}
                                                />
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <img
                                                src={"./i-icon.png"}
                                                alt={"./i-icon.png"}
                                                style={{
                                                  width: "25px",
                                                  height: "25px",
                                                }}
                                              />
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {item.vnc_status !== 0 && (
                                            <button
                                              style={{
                                                position: "relative",
                                                left: "100px",
                                                top: "35px",
                                                border: "none",
                                                backgroundColor: "transparent",
                                              }}
                                              onClick={() => {
                                                if (item.vm_id !== null) {
                                                  if (item.sla_status == 1) {
                                                    VMC(item.vm_id);
                                                  } else {
                                                    !isProfileVerified ? (
                                                      navigate("/edit-profile")
                                                    ) : item.public_ip !==
                                                      null ? (
                                                      slaManagement(item.vm_id)
                                                    ) : (
                                                      <></>
                                                    );
                                                    //setShowTermsCondition(true);
                                                  }
                                                }
                                              }}
                                            >
                                              <img
                                                src={"./vmc-monitor.png"}
                                                alt={"./vmc-monitor.png"}
                                                style={{
                                                  width: "25px",
                                                  height: "25px",
                                                }}
                                              />
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}

                                  <div>
                                    <div
                                      className="machine-icon cpu-icon"
                                      style={{ marginTop: "-25px" }}
                                    >
                                      <div
                                        className="machine-icon-edit-profile"
                                       style={{
                                          marginLeft:
                                            item.vm_config_category === 1 ||
                                            item.vm_config_category === 5 ||
                                            item.vm_config_category === 6
                                              ?
                                                item.vm_type === 1
                                                ? "34px" // PortGate Standard
                                                : "34px" // Cloud Standard
                                              : "34px", // default
                                          width: "94px",
                                          height: "94px",
                                        }}
                                      >
                                        {item.vm_status === 0 &&
                                        item.current_action_status !==
                                          "Failed" &&
                                        !shownOnce ? (
                                          <div
                                            class="loader-machine-make"
                                            style={{
                                              width: "94px",
                                              // marginTop: "-10px",
                                              // marginLeft: "-14px",
                                            }}
                                          ></div>
                                        ) : (
                                          <>
                                            <img
                                              src={
                                                "/images/admin/01-home/cpu.svg"
                                              }
                                              alt={""}
                                              style={{
                                                width: "40px",
                                                height: "40px",
                                              }}
                                            />
                                          </>
                                        )}
                                      </div>
                                      <div
                                        className="machine-titles theme-bg-orange"
                                        style={{
                                          // width: "140px",
                                          // height: "40px",
                                        }}
                                      >
                                        <>
                                          {item.vm_status === 0 &&
                                          item.current_action_status !==
                                            "Failed" &&
                                          !shownOnce ? (
                                            <>Standard</>
                                          ) : (
                                            <>
                                              {item.vm_config_category === 1 ||
                                              item.vm_config_category === 5 ||
                                              item.vm_config_category === 6
                                                ? `${
                                                    item.vm_type === 1
                                                      ? "PortGate "
                                                      : "Cloud "
                                                  } Standard`
                                                : item.vm_config_category ===
                                                    3 ||
                                                  item.vm_config_category ===
                                                    7 ||
                                                  item.vm_config_category === 8
                                                ? `${
                                                    item.vm_type === 1
                                                      ? "PortGate "
                                                      : " Cloud   "
                                                  } CPU Pro`
                                                : item.vm_config_category ===
                                                    4 ||
                                                  item.vm_config_category ===
                                                    9 ||
                                                  item.vm_config_category === 10
                                                ? `${
                                                    item.vm_type === 1
                                                      ? "PortGate "
                                                      : " Cloud   "
                                                  } RAM Pro`
                                                : ""}
                                            </>
                                          )}
                                        </>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="machine-name theme-color-blue"
                                    style={{ marginTop: "10px" }}
                                  >
                                    {item.vm_name}
                                  </div>

                                  <div
                                    className="machine-config-badge"
                                    style={{
                                      color: "white",
                                    }}
                                  >
                                    {item.ram / 1024} GB /{" "}
                                    {item.disk_type == "hdd"
                                      ? item.hard_disk
                                      : item.disk_type == "ssd"
                                      ? item.ssd
                                      : item.nvme}{" "}
                                    GB / {item.cpu} vCPU(s)
                                  </div>
                                  <div
                                    className="line-shape"
                                    style={{
                                      width: "95%",
                                      height: "2px",
                                      borderRadius: "50%",
                                      marginTop: "10px",
                                      background:
                                        "linear-gradient(90deg, rgba(190, 190, 190, 0), rgba(190, 190, 190, 1), rgba(190, 190, 190, 0))",
                                    }}
                                  ></div>

                                  {item.location !== null ? (
                                    <div
                                      className="machine-ip"
                                      style={{ marginTop: "8px" }}
                                    >
                                      Location: {item.location}
                                    </div>
                                  ) : (
                                    <div
                                      className="machine-ip"
                                      style={{
                                        marginTop: "10px",
                                        display: "flex",
                                        marginBottom: "-10px",
                                      }}
                                    >
                                      <a style={{ marginLeft: "-30%" }}>
                                        Location:
                                      </a>
                                      <p
                                        className="loader-ip"
                                        style={{
                                          height: "12px",
                                          marginTop: "1px",
                                          marginLeft: "5px",
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                  {item.public_ip !== null ? (
                                    <div
                                      className="machine-ip"
                                      style={{ marginTop: "8px" }}
                                    >
                                      Public IP: {item.public_ip}
                                    </div>
                                  ) : (
                                    <div
                                      className="machine-ip"
                                      style={{
                                        marginTop: "10px",
                                        display: "flex",
                                        marginBottom: "-10px",
                                      }}
                                    >
                                      <a style={{ marginLeft: "-30%" }}>
                                        Public IP:
                                      </a>
                                      <p
                                        className="loader-ip"
                                        style={{
                                          height: "12px",
                                          marginTop: "1px",
                                          marginLeft: "5px",
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                  {item.ip_address !== null ? (
                                    <div
                                      className="machine-ip"
                                      style={{ marginTop: "8px" }}
                                    >
                                      Private IP: {item.ip_address}
                                    </div>
                                  ) : (
                                    <div
                                      className="machine-ip"
                                      style={{
                                        marginTop: "10px",
                                        display: "flex",
                                        marginBottom: "-10px",
                                      }}
                                    >
                                      <a style={{ marginLeft: "-30%" }}>
                                        Private IP:
                                      </a>
                                      <p
                                        className="loader-ip"
                                        style={{
                                          height: "12px",
                                          marginTop: "1px",
                                          marginLeft: "5px",
                                        }}
                                      ></p>
                                    </div>
                                  )}

                                  <div
                                    className="machine-date"
                                    style={{ marginTop: "8px" }}
                                  >
                                    Created:{item.created_at}
                                  </div>
                                  <div
                                    className="actions"
                                    style={{
                                      paddingLeft: "20px",
                                      marginTop: "-4px",
                                      display: "flex",
                                      justifyContent: "space-around",
                                    }}
                                  >
                                    <div
                                      className="log-in"
                                      style={{
                                        marginBottom: "6px",
                                        marginTop: "8px",
                                      }}
                                      onClick={() => {
                                        if (item.vm_id !== null) {
                                          if (item.sla_status == 1) {
                                            if (
                                              item.current_action_status !==
                                                "PROCESSING" &&
                                              item.current_action_status !==
                                                "Failed"
                                            ) {
                                              navigate("/vm/status", {
                                                state: {
                                                  vmDetails: item.vm_id,
                                                },
                                              });
                                            } else {
                                              toast((t) => (
                                                <AppToast
                                                  id={t.id}
                                                  message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                  isMobile={isMobile}
                                                />
                                              ));
                                            }
                                          } else {
                                            //setShowTermsCondition(true);
                                            !isProfileVerified
                                              ? navigate("/edit-profile")
                                              : item.public_ip !== null
                                              ? slaManagement(item.vm_id)
                                              : toast((t) => (
                                                  <AppToast
                                                    id={t.id}
                                                    message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                    isMobile={isMobile}
                                                  />
                                                ));
                                          }
                                        } else {
                                        }
                                      }}
                                    >
                                      <a className="media-link">
                                        <div
                                          className="media-banner"
                                          style={{
                                            minWidth: "6rem",
                                            marginTop: "5px",
                                          }}
                                        >
                                          <img
                                            className="normal-banner"
                                            src="/admin/images/admin/wallet/add-money-btn.png"
                                            alt=""
                                            style={{
                                              width: "6rem",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src={
                                              item.current_action_status !==
                                              "PROCESSING"
                                                ? "/admin/images/admin/wallet/recharge-btn.png"
                                                : "/admin/images/admin/wallet/add-money-btn.png"
                                            }
                                            alt={
                                              item.current_action_status !==
                                              "PROCESSING"
                                                ? "/admin/images/admin/wallet/recharge-btn.png"
                                                : "/admin/images/admin/wallet/add-money-btn.png"
                                            }
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              color: "white",
                                              fontSize: "14px",
                                              marginTop: "0px",
                                              fontWeight: "600",
                                            }}
                                            onMouseOver={(e) =>
                                              item.current_action_status !==
                                                "PROCESSING" &&
                                              (e.target.style.color = "#07528B")
                                            } // Change color on hover if not disabled
                                            onMouseOut={(e) =>
                                              item.current_action_status !==
                                                "PROCESSING" &&
                                              (e.target.style.color = "white")
                                            }
                                          >
                                            View Status
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                    <div
                                      className="log-in"
                                      style={{
                                        marginBottom: "6px",
                                      }}
                                    >
                                      <a className="media-link">
                                        <div
                                          className="media-banner"
                                          style={{
                                            minWidth: "6rem",
                                            marginTop: "10px",
                                          }}
                                          // monitor-graph
                                          onClick={() => {
                                            if (item.vm_id !== null) {
                                              if (item.sla_status == 1) {
                                                if (
                                                  item.current_action_status !==
                                                    "PROCESSING" &&
                                                  item.current_action_status !==
                                                    "Failed"
                                                ) {
                                                  navigate("/monitor-graph", {
                                                    state: {
                                                      vm_data: item.vm_id,
                                                    },
                                                  });
                                                } else {
                                                  toast((t) => (
                                                    <AppToast
                                                      id={t.id}
                                                      message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                      isMobile={isMobile}
                                                    />
                                                  ));
                                                }
                                              } else {
                                                //setShowTermsCondition(true);
                                                !isProfileVerified
                                                  ? navigate("/edit-profile")
                                                  : item.public_ip !== null
                                                  ? slaManagement(item.vm_id)
                                                  : toast((t) => (
                                                      <AppToast
                                                        id={t.id}
                                                        message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                        isMobile={isMobile}
                                                      />
                                                    ));
                                              }
                                            }
                                          }}
                                        >
                                          <img
                                            className="normal-banner"
                                            src="/admin/images/admin/wallet/add-money-btn.png"
                                            alt=""
                                            style={{
                                              width: "6rem",
                                            }}
                                          />

                                          <img
                                            className="hover-img-banner"
                                            src={
                                              item.public_ip != null
                                                ? "/admin/images/admin/wallet/recharge-btn.png"
                                                : "/admin/images/admin/wallet/add-money-btn.png"
                                            }
                                            alt={
                                              item.public_ip != null
                                                ? "/admin/images/admin/wallet/recharge-btn.png"
                                                : "/admin/images/admin/wallet/add-money-btn.png"
                                            }
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              color: "white",
                                              fontSize: "14px",
                                              marginTop: "0px",
                                              fontWeight: "600",
                                            }}
                                            onMouseOver={(e) =>
                                              item.public_ip != null &&
                                              (e.target.style.color = "#07528B")
                                            } // Change color on hover if not disabled
                                            onMouseOut={(e) =>
                                              item.public_ip != null &&
                                              (e.target.style.color = "white")
                                            }
                                          >
                                            Monitor
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                  </div>

                                  <div
                                    className="actions"
                                    style={{ marginTop: "-1px" }}
                                  >
                                    {/* </div> */}
                                    <div
                                      className="icons log-in"
                                      style={{ gap: "15px" }}
                                    >
                                      <div
                                        className={`switch ${item.status == 1 ? "on" : "off"}`}
                                        onClick={() => {
                                          if (item.vm_id !== null) {
                                            // 🚫 Block clicks when in processing
                                            if (item.current_action_status === "PROCESSING") {
                                              toast((t) => (
                                                <AppToast
                                                  id={t.id}
                                                  message="Server configuration in Progress. Please Return after 15 Minutes from the Creation Time"
                                                  isMobile={isMobile}
                                                />
                                              ));
                                              return; // stop function execution
                                            }

                                            if (item.sla_status == 1) {
                                              if (item.current_action_status !== "Failed") {
                                                // ✅ Allow toggle only when not failed or processing
                                                item.status == 1
                                                  ? toggleSwitch({
                                                      id: item.vm_id,
                                                      status: "off",
                                                    })
                                                  : toggleSwitch({
                                                      id: item.vm_id,
                                                      status: "on",
                                                    });
                                              } else {
                                                // ⚠️ Show error if failed
                                                toast((t) => (
                                                  <AppToast
                                                    id={t.id}
                                                    message="⚠️ Server configuration failed. Please check again later."
                                                    isMobile={isMobile}
                                                  />
                                                ));
                                              }
                                            } else {
                                              // 🚦 If SLA not active
                                              !isProfileVerified
                                                ? navigate("/edit-profile")
                                                : item.public_ip !== null
                                                ? slaManagement(item.vm_id)
                                                : toast((t) => (
                                                    <AppToast
                                                      id={t.id}
                                                      message="Server configuration in progress. Please return after 15 minutes."
                                                      isMobile={isMobile}
                                                    />
                                                  ));
                                            }
                                          }
                                        }}
                                        style={{
                                          cursor:
                                            item.current_action_status === "PROCESSING" ? "not-allowed" : "pointer",
                                          opacity: item.current_action_status === "PROCESSING" ? 0.6 : 1, // fade when disabled
                                          transition: "opacity 0.2s ease-in-out",
                                        }}
                                      >
                                        <div className="toggle"></div>
                                        <div className="labels">
                                          <span>ON</span>
                                          <span>OFF</span>
                                        </div>
                                      </div>

                                      {isLoginByParentUser == 1 && (
                                        <button
                                          onClick={() => {
                                            if (item.vm_id !== null) {
                                              if (item.sla_status == 1) {
                                                if (
                                                  item.current_action_status !==
                                                  "PROCESSING"
                                                  //   &&
                                                  // item.current_action_status !==
                                                  //   "Failed"
                                                ) {
                                                  setEditMachineId(item.vm_id);
                                                  SetEditPopup(true);
                                                } else {
                                                  toast((t) => (
                                                    <AppToast
                                                      id={t.id}
                                                      message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                      isMobile={isMobile}
                                                    />
                                                  ));
                                                }
                                              } else {
                                                //setShowTermsCondition(true);
                                                !isProfileVerified
                                                  ? navigate("/edit-profile")
                                                  : item.public_ip !== null
                                                  ? slaManagement(item.vm_id)
                                                  : toast((t) => (
                                                      <AppToast
                                                        id={t.id}
                                                        message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                        isMobile={isMobile}
                                                      />
                                                    ));
                                              }
                                            }
                                          }}
                                          disabled={item.public_ip == null}
                                          style={{
                                            border: "none",
                                            backgroundColor: "transparent",
                                          }}
                                        >
                                          <a
                                            // href="https://smartcloudvm.com/vm/edit?id=59"
                                            className=""
                                          >
                                            <img src="/images/admin/01-home/edit.svg" />
                                          </a>
                                        </button>
                                      )}

                                      {isLoginByParentUser == 1 && (
                                        <button
                                          onClick={() => {
                                            if (item.vm_id !== null) {
                                              if (item.sla_status == 1) {
                                                if (
                                                  item.current_action_status !==
                                                  "PROCESSING"
                                                ) {
                                                  SetDeletePopup(true);
                                                  setMachineToDelete({
                                                    vm_id: item.vm_id,
                                                    id: item.id,
                                                  });
                                                } else {
                                                  toast((t) => (
                                                    <AppToast
                                                      id={t.id}
                                                      message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                      isMobile={isMobile}
                                                    />
                                                  ));
                                                }
                                              } else {
                                                //setShowTermsCondition(true);
                                                !isProfileVerified
                                                  ? navigate("/edit-profile")
                                                  : item.public_ip !== null
                                                  ? slaManagement(item.vm_id)
                                                  : toast((t) => (
                                                      <AppToast
                                                        id={t.id}
                                                        message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                        isMobile={isMobile}
                                                      />
                                                    ));
                                              }
                                            } else {
                                              if (
                                                item.current_action_status !==
                                                "PROCESSING"
                                                //    &&
                                                // item.current_action_status !==
                                                //   "Failed"
                                              ) {
                                                // setDeleteById(item.id);
                                                // deleteMachine({
                                                //   vm_id: item.vm_id,
                                                //   id: item.id,
                                                // });
                                                SetDeletePopup(true);
                                                setMachineToDelete({
                                                  vm_id: item.vm_id,
                                                  id: item.id,
                                                });
                                              } else {
                                                toast((t) => (
                                                  <AppToast
                                                    id={t.id}
                                                    message={`${"Server configuration in Progress."}\n${"Please Return after 15 Minutes from the Creation Time..."}`}
                                                    isMobile={isMobile}
                                                  />
                                                ));
                                              }
                                            }
                                          }}
                                          // disabled={item.public_ip == null}
                                          style={{
                                            border: "none",
                                            backgroundColor: "transparent",
                                          }}
                                        >
                                          <a
                                            className="delete"
                                            // onclick="getDistroy(this.id);"
                                          >
                                            <img src="/images/admin/01-home/delete.svg" />
                                          </a>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {isLoginByParentUser == 1 ? (
                      showPlaceholder && (
                        <div
                          style={{
                            position: "absolute",
                            top: "30%",
                            left: "48%",
                          }}
                        >
                          <figure
                            style={{
                              width: "100px",
                              height: "100px",
                              background: "rgb(233, 119, 48)",
                              borderRadius: "50%",
                              objectFit: "cover",
                              margin: "auto",
                              padding: "20px",
                              outline: "3px solid rgb(233, 119, 48)",
                              border: "5px solid white",
                            }}
                          >
                            <img
                              src={"/admin/images/admin/menu/vm-white.png"}
                              alt={""}
                              style={{
                                marginLeft: "-5px",
                                width: "60px",
                                height: "60px",
                              }}
                            />
                          </figure>
                          <div
                            style={{
                              zIndex: "10",
                              top: "95px",
                              left: "70px",
                              position: "absolute",
                              width: "20px",
                              height: "7px",
                              backgroundColor: "#fff",
                            }}
                          ></div>
                          <button
                            style={{
                              width: "10rem",
                              marginTop: "2px",
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
                            onClick={() => navigate("/vm/create")}
                          >
                            Create Machine
                          </button>
                        </div>
                      )
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          top: "30%",
                          left: "47%",
                        }}
                      >
                        <figure
                          style={{
                            width: "100px",
                            height: "100px",
                            background: "rgb(233, 119, 48)",
                            borderRadius: "50%",
                            objectFit: "cover",
                            margin: "auto",
                            padding: "20px",
                            outline: "3px solid rgb(233, 119, 48)",
                            border: "5px solid white",
                          }}
                        >
                          <img
                            src={"/admin/images/admin/menu/vm-white.png"}
                            alt={""}
                            style={{
                              marginLeft: "-5px",
                              width: "60px",
                              height: "60px",
                            }}
                          />
                        </figure>
                        <div
                          style={{
                            zIndex: "10",
                            top: "95px",
                            left: "78px",
                            position: "absolute",
                            width: "20px",
                            height: "7px",
                            backgroundColor: "#fff",
                          }}
                        ></div>
                        <p
                          style={{
                            width: "11rem",
                            marginTop: "2px",
                            zIndex: "9",
                            position: "relative",
                            alignContent: "center",
                            textAlign: "center",
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
                          No Machines Found
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="col-md-1"></div>
            </Row>
          </div>
        </div>
      )}
      <div className="apptoast-align" style={{ zIndex: "9999999999" }}>
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>
    </div>
  );
};

export default MyMachinePage;
