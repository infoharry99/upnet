import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./SupportPage.css";
import "./MachineStatus.css";
import "../common/ArrowStyles.scss";
import instance, {
  apiDecrypteRequest,
  currencyReturn,
  apiEncryptRequest,
  decryptData,
} from "../../Api";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import AppToast from "../../AppToast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { validate } from "uuid";
import * as XLSX from "xlsx";

const MachineStatus = () => {
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const location = useLocation();
  const { smuser, appCurrency, isLoginByParentUser } = useAuth();
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [activeButton, setActiveButton] = useState("SSH");
  const [loading, setLoading] = useState(true);
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const [machineData, setMachineData] = useState([]);

  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  const [changePass, setChangePass] = useState(false);
  const [vmRes, setVmRes] = useState(null);
  const [monitorData, setMonitorData] = useState([]);
  const vmDetails = location.state ? location.state.vmDetails : null;
  //console.log(vmDetails);

  const [isHovered, setIsHovered] = useState(false);
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [copied3, setCopied3] = useState(false);
  const [copied4, setCopied4] = useState(false);
  const [copied5, setCopied5] = useState(false);
  const [copied6, setCopied6] = useState(false);
  const [copied7, setCopied7] = useState(false);

  const [showVNCPass, setShowVNCPass] = useState(false);
  const [changeVNCPass, setChangeVNCPass] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  const [isFlipped, setIsFlipped] = useState(true);
  const [isFlippedIPView, setIsFlippedIPView] = useState(false);
  const [isFlippedHTTPView, setIsFlippedHTTPView] = useState(false);
  const [isShowBackupView, setIsShowBackupView] = useState(false);
  const [isShowVMView, setIsShowVMView] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [deletePopup, SetDeletePopup] = useState(false);
  const [isShowVMRestorePopup, SetVMRestorePopup] = useState(false);
  const [isShowVMRestoreCostCalPopup, SetVMRestoreCostCalPopup] =
    useState(false);
  const [isShowVMRestoreConfirmPopup, SetVMRestoreConfirmPopup] =
    useState(false);
  const [isShowSTOPBackUPPopup, SetSTOPBackUPPopup] = useState(false);
  const [isShowAssignDedicatedIPPopup, SetAssignDedicatedIPPopup] =
    useState(false);
  const [isShowChildUserContentPopup, SetChildUserContentPopup] =
    useState(false);
  const [isShowBackupPlanPopup, SetBackupPlanPopup] = useState(false);
  const [isShowCustomSSLPopup, SetCustomSSLPopup] = useState(false);
  const [progress, setProgress] = useState(0);

  const [setShowDownloadCSS, SetShowDownloadCSS] = useState(false);
  const [isSetUpInteractive, SetUpInteractive] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [domainID, setDomainId] = useState("");
  const [domainData, setDomainData] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const [selectDomainNameForDelete, setSelectDomainNameForDelete] =
    useState("");
  const [selectDomainIdForDelete, setSelectDomainIdForDelete] = useState("");
  const [portList, setPortList] = useState([]);
  const [urlPortList, setURLPortList] = useState([]);

  const [isShowCustomSupportPopup, setCustomSupportPopup] = useState(false);

  const initialPlaceholder = `What Kind of Application you want to Host on this Custom Port.\nWhat is the Use-case to Create Custom Port.\nPlease Describe in Brief about your Requirement.`;

  const [placeholder, setPlaceholder] = useState(initialPlaceholder);
  const [customReqtext, setCustomRequestText] = useState("");
  const [customProductTagText, setCustomProductTag] = useState("");
  const [customPortNumberText, setCustomPortNumber] = useState("");

  const [vmBackUpList, setVMBackUpList] = useState([]);
  const [isSelectedBackupForRestore, setSelectedBackupForRestore] = useState(
    []
  );
  const [isSelectedParentTime, setSelectedParentTime] = useState([]);
  const [isShowProgressView, setIsShowProgressView] = useState(false);
  const [rateData, setRateData] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState("");
  const [progressToMachine, setProgressToMachine] = useState("");
  const [isBackUpFail, setBackUpFail] = useState(false);

  const [isIntializing, setIntializing] = useState(false);
  const [restorePrice, setRestorePrice] = useState([]);
  const [restorePriceSameVm, setRestorePriceForSameVM] = useState([]);
  const [newMachineTime, setNewMachineTime] = useState("3");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("1");
  const [ipPrice, setIPPrice] = useState("");
  const [staticIP, setStaticIP] = useState("");
  const [showTick, setShowTick] = useState(false);
  const [isRegenerateSSH, setIsRegenerateSSH] = useState(false);
  let intervals;

  const [vmBackUpPlansList, setVMBackUpPlansList] = useState([]);

  const [planName, setPlanName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [defaultPolicy, setDefaultPolicy] = useState("DROP");

  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");

  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [selectedPrivFile, setSelectedPrivFile] = useState(null);
  const [selectedFullChainFile, setSelectedFullChainFile] = useState(null);
const [vmList, setVmList] = useState([]);
const [selectedVmId, setSelectedVmId] = useState(null);
const [error, setError] = useState("");
const [jumpservers, setJumpservers] = useState([]);
const [selectedJumpserverId, setSelectedJumpserverId] = useState("");
const isJumpserverAlreadyAttached = Boolean(monitorData?.jumpserver_id);
const [newUsername, setNewUsername] = useState("");
const [newPassword, setNewPassword] = useState("");

  const [rule, setRule] = useState({
    direction: "IN",
    ipType: "IPv4",
    decision: "ACCEPT",
    protocol: "TCP",
    sourcePort: "",
    destPort: "",
    source: "0.0.0.0/0",
  });

  useEffect(() => {
    console.log("ACTIVE BUTTON:", activeButton);
  }, [activeButton]);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleChangeFirewall = (e) => {
    const { name, value } = e.target;
    setRule((prev) => ({ ...prev, [name]: value }));
  };

  const styles = {
    container: {
      width: "50%",
      height: "30px",
      backgroundColor: "#e0e0e0",
      borderRadius: "5px",
      overflow: "hidden",
      position: "relative",
    },
    progress: {
      height: "100%",
      backgroundColor: "#e97730",
      transition: "width 0.5s ease-in-out",
    },
    label: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontWeight: "bold",
      color: "#035189",
    },
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setCustomRequestText(inputValue);
    if (inputValue !== "" && placeholder) {
      setPlaceholder("");
    }
    if (inputValue === "") {
      setPlaceholder(initialPlaceholder);
    }
  };

  

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const autoToggle = () => {
    const arrowElement = document.querySelector(".arrows");
    if (arrowElement) {
      arrowElement.classList.toggle("auto");
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      autoToggle();
    }, 3000);

    const duration = 120 * 1000;
    if (isRegenerateSSH) {
      intervals = setInterval(() => {
        setProgress((prevProgress) => {
          const nextProgress = prevProgress + 100 / (duration / 1000);
          return nextProgress >= 100 ? 100 : nextProgress;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(intervals); // Clean up interval on component unmount
    };
  }, [isSetUpInteractive, isRegenerateSSH]);

  const isValidPassword = (password) => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    return regex.test(password) && password.length >= 8;
  };

  const VNC = async (machineId) => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: machineId,
    };
    
    try {
      const vncResponse = await instance.post("vm/vnc", payload);
      if (vncResponse.data.status) {
        setLoading(false);
        const pushUrl = `${vncResponse.data.url}`;
        window.location.href = pushUrl;
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const regenerateSSH = async (machineId) => {
    setLoading(true);
    setIsRegenerateSSH(true);
    setProgress(1);

    const payload = {
      user_id: smuser.id,
      vm_id: machineId,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/regenerate",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      if (loginResponse.status) {
        handleDownload(loginResponse.private_key);
        setProgress(100);
      } else if (!loginResponse.status) {
        setIsRegenerateSSH(false);
        setProgress(0);
      }

      if (loginResponse.message) {
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
    // setLoading(false);
  };

  const handleDownload = (privateKey) => {
    // e.preventDefault();

    const pemFile = "ssh_key.pem";
    const pemFileContent = privateKey;

    const blob = new Blob([pemFileContent], {
      type: "application/x-pem-file",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = pemFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    SetShowDownloadCSS(true);
    SetUpInteractive(true);
    setLoading(false);
    setIsRegenerateSSH(false);
  };

  const UpdateMachinePass = async () => {
    setLoading(true);
    if (newPass !== "" && confPass !== "" && newPass === confPass) {
      if (isValidPassword(newPass)) {
        const payload = {
          user_id: smuser.id,
          vm_id: vmDetails,
          password: newPass,
          confirm_password: confPass,
        };
        try {
          const encryptedResponse = await apiEncryptRequest(payload);
          const loginUserResponse = await instance.post(
            "/vm/change-server-details",
            encryptedResponse
          );
          const loginResponse = await decryptData(loginUserResponse.data);
          setNewPass(null);
          setConfPass(null);
          setChangePass(false);

          if (loginResponse.status) {
            setShowTick(true);
            toast((t) => (
              <AppToast
                id={t.id}
                message={loginResponse.message}
                isMobile={isMobile}
              />
            ));
            const timer = setTimeout(() => {
              GetMyMachines();
            }, 2000);

            return () => clearTimeout(timer);
          } else {
            toast((t) => (
              <AppToast
                id={t.id}
                message={loginResponse.message}
                isMobile={isMobile}
              />
            ));
          }
          //console.log(loginResponse, "==!==!==change-server-details");
        } catch (error) {
          console.error(
            "Error during the change-server-details process:",
            error
          );
        }
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Password Must Contain Alphabets and Numerics"}
            isMobile={isMobile}
          />
        ));
      }
    } else {
      if (newPass == "" || confPass == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Password Required"}
            isMobile={isMobile}
          />
        ));
      } else if (newPass !== confPass) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"New Password and Confirm Password not matching"}
            isMobile={isMobile}
          />
        ));
      }
    }
    setLoading(false);
  };

  const GetMyMachines = async () => {
    setLoading(true);
    var vmData = [];
    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/vm/stats",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);

      //console.log(Response, "==!==!==stats");
      setVmRes(Response);
      const vm = Response.vm;
      vmData = vm;
      const rateList = Response.ratedata1;

      setMonitorData(vm);
      setRateData(rateList);
      // console.log(vm, "==!==!==stats");
      setStaticIP("6351");
      setShowTick(false);

      if (vm.vm_type === 1) {
        vmBACKUpPlansList();
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);

    vmData.vm_type === 1 ? getVMDomains() : vmbackupstatus(true);
    //getVMDomains();
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isRegenerateSSH) {
      GetMyMachines();
    }

    // Check backup status after 15 seconds
    const interval = setInterval(() => {
      if (progressPercentage && progressPercentage < 100 && !isBackUpFail) {
        if (!isRegenerateSSH) {
          vmbackupstatus();
        }
      }
    }, 10000);

    function handleResize() {
      setIsMobile(isMobileDevice()); // Update isMobile state based on device type
    }

    window.addEventListener("resize", handleResize); 
    return () => {
      clearTimeout(interval);
      window.removeEventListener("resize", handleResize); 
    };
  }, [progressPercentage, isBackUpFail, isMobile, isRegenerateSSH]);

  const fetchJumpservers = async () => {
    try {
      setLoading(true);

      const res = await instance.post("/jumpserver", {
        user_id: smuser.id,
      });

      console.log("RAW API RESPONSE >>>", res.data);

      if (res.data?.success && Array.isArray(res.data.jumpservers)) {
        // normalize + enforce types
        const list = res.data.jumpservers.map(js => ({
          id: Number(js.id),            // DB id (IMPORTANT)
          vm_id: js.vm_id,
          vm_name: js.vm_name,
          public_ip: js.public_ip,
          vm_port: js.vm_port,
          username: js.username,
        }));

        setJumpservers(list);
      } else {
        setJumpservers([]);
      }
    } catch (e) {
      console.error("fetchJumpservers error", e);
      setJumpservers([]);
    } finally {
      setLoading(false);
    }
  };

  const attachJumpserver = async () => {
    if (!selectedJumpserverId) {
      toast.error("Please select a jumpserver");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        user_id: smuser.id,
        vm_id: monitorData.vm_id,
        jumpserver_id: selectedJumpserverId,
      };

      const encrypted = await apiEncryptRequest(payload);
      const res = await instance.post("/attach-jumpserver", encrypted);
      const data = await decryptData(res.data);

      if (data.success) {
        toast.success("Jumpserver attached successfully");
        GetMyMachines();
        setActiveButton("SSH");
      } else {
        toast.error(data.message || "Failed to attach jumpserver");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to attach jumpserver");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: "45px",
    borderRadius: "25px",
    padding: "0 15px",
    marginBottom: "15px",
    border: "none",
    outline: "none",
  };

  const createVMUser = async () => {
      if (!newUsername || !newPassword) {
        toast.error("Username & Password required");
        return;
      }

      try {
        setLoading(true);

        const payload = {
          user_id: smuser.id,
          vm_id: monitorData.vm_id,
          username: newUsername,
          password: newPassword,
        };

        const encrypted = await apiEncryptRequest(payload);
        const res = await instance.post("/create-vm-user", encrypted);
        const data = await decryptData(res.data);

        if (data.code === 200) {
          toast.success("User created successfully");
          setNewUsername("");
          setNewPassword("");
        } else {
          toast.error(data.message || "Failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to create user");
      } finally {
        setLoading(false);
      }
    };

  const handleButtonClick = (button) => {
    console.log("button", button);

    // 1. Set active tab explicitly (NO toggle logic)
    setActiveButton(button);

    // 2. Reset all other UI states
    setIsFlipped(false);
    setIsShowBackupView(false);
    setIsShowVMView(false);
    setIsShowProgressView(false);

    // 3. Button-specific actions
    switch (button) {
      case "ATTACH_JUMPSERVER":
        console.log("Attach jumpserver under VM");
        fetchJumpservers();
        break;

      case "CREATE_USER":
        console.log("Create user under VM");
        break;

      case "SSH":
        // nothing extra needed
        break;

      default:
        break;
    }
  };

  const onClickBackup = () => {
    if (
      progressPercentage &&
      progressPercentage !== "100" &&
      isBackUpFail != true
    ) {
      setIsShowBackupView(false);
      // vmbackupstatus();
      handleButtonClick("");
      setIsShowProgressView(true);
    } else {
      vmbackuplist();
      setIsShowProgressView(false);
      handleButtonClick("");
    }
  };

  const handleExistingVMHide = () => {
    SetVMRestorePopup(!isShowVMRestorePopup);
    setIsShowBackupView(false);
    setIsShowVMView(true);
    handleButtonClick("");
  };

  // domain List
  const getVMDomains = async () => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/getsvpsdomains",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);
      const domainDetails = Response.domain;

      setDomainList(domainDetails);
      setDomainData(domainDetails[0]);
      setDomainName(domainDetails[0].domain_name);
      setDomainId(domainDetails[0].id);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
    portListApi();
  };

  // Port List
  const portListApi = async () => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/port_list",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);
      const portList = Response.port_list;
      setPortList(portList);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
    generatePortList();
  };

  // Add Domain APi
  const addDomain = async () => {
    setLoading(true);

    if (domainName !== null && domainName !== "") {
      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        domain_name: domainName,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/adddomain",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);
        setDomainId(Response.id);

        if (Response.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }
        getVMDomains();
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"please enter Domain name"}
          isMobile={isMobile}
        />
      ));
    }
    setLoading(false);
  };

  // validate Domain Api
  const validateDomain = async (domainName, domainId) => {
    setLoading(true);

    if (
      domainData &&
      domainData.domain_status === 0 &&
      domainName !== null &&
      domainName !== "" &&
      domainId !== null
    ) {
      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        domain_name: domainName,
        domain_id: domainId,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/domainstatus",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);

        if (Response.success) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    }
    setLoading(false);
  };

  // Enable HTTPs Redirect Api
  const redirectDomain = async (domainName, domainId) => {
    setLoading(true);

    if (
      domainData &&
      domainName !== null &&
      domainName !== "" &&
      domainId !== null
    ) {
      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        domain_name: domainName,
        domain_id: domainId,
      };
      // console.log(payload, "PAYload");
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/redirectdomain",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);

        if (Response.success) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }

        //console.log(Response, "==!==!==domain Response");
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      // if (domainId === null) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Domain id not found"}
          isMobile={isMobile}
        />
      ));
      // }
    }
    setLoading(false);
  };

  // Delete Domain APi
  const removeDomain = async () => {
    setLoading(true);

    if (
      selectDomainNameForDelete !== null &&
      selectDomainNameForDelete !== "" &&
      selectDomainIdForDelete !== null
    ) {
      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        domain_name: selectDomainNameForDelete,
        domain_id: selectDomainIdForDelete,
      };
      // console.log(payload, "PAYload");
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/removedomain",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);

        if (Response.success) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }

        getVMDomains();
        //console.log(Response, "==!==!==domain Response");
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      // if (domainId === null) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Domain id not found"}
          isMobile={isMobile}
        />
      ));
      // }
    }
    setLoading(false);
  };

  // redirect SSL
  const domainSSL = async (domainName, domainId) => {
    setLoading(true);

    if (
      domainData &&
      domainName !== null &&
      domainName !== "" &&
      domainId !== null
    ) {
      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        domain_name: domainName,
        domain_id: domainId,
      };
      // console.log(payload, "PAYload");
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/domainssl",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);

        if (Response.success) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Domain id not found"}
          isMobile={isMobile}
        />
      ));
      // }
    }
    setLoading(false);
  };

  // rename PortName
  const renamePort = async (portName, portId) => {
    setLoading(true);

    if (portName !== null && portName !== "" && portId !== null) {
      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        id: portId,
        port_name: portName,
      };

      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/edit_portname",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);

        if (Response.success) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      toast((t) => (
        <AppToast id={t.id} message={"Port id not found"} isMobile={isMobile} />
      ));
    }
    setLoading(false);
  };

  const generatePortList = async () => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/generate_portlist",
        encryptedResponse
      );

      const Response = await decryptData(loginUserResponse.data);

      const generatedPortlist = Response.generated_portlist;

      setURLPortList(generatedPortlist);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
    GetMachines();
  };

  // generate Port Url
  const generatePortURL = async (portName, destinationPorts, ID) => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
      destination_port: destinationPorts,
      port_name: portName,
      id: ID,
    };
    // console.log(payload, "PAYload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/generate_port_url",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);

      if (Response.success) {
        toast((t) => (
          <AppToast id={t.id} message={Response.message} isMobile={isMobile} />
        ));
      } else {
        toast((t) => (
          <AppToast id={t.id} message={Response.message} isMobile={isMobile} />
        ));
      }

      generatePortList();
      //console.log(Response, "==!==!==domain Response");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  // Delete Port APi
  const removePort = async (portId) => {
    setLoading(true);

    if (portId !== null && portId !== "") {
      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        id: portId,
      };
      // console.log(payload, "PAYload");
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/remove_port",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);

        if (Response.success) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }

        generatePortList();
        //console.log(Response, "==!==!==domain Response");
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      // if (domainId === null) {
      toast((t) => (
        <AppToast id={t.id} message={"Port id not found"} isMobile={isMobile} />
      ));
      // }
    }
    setLoading(false);
  };

  // other Port Url
  const otherPortURL = async () => {
    setLoading(true);

    if (
      customProductTagText != null &&
      customProductTagText !== "" &&
      customPortNumberText != null &&
      customPortNumberText !== ""
    ) {
      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        destination_port: customPortNumberText,
        port_name: customProductTagText,
      };
      // console.log(payload, "PAYload");
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/otherport_url",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);

        if (Response.success) {
          generatePortList();
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }

        //console.log(Response, "==!==!==domain Response");
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
      if (customProductTagText == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Please enter Product tag!"}
            isMobile={isMobile}
          />
        ));
      } else if (customPortNumberText == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Please enter Port Number!"}
            isMobile={isMobile}
          />
        ));
      }
    }
    setLoading(false);
  };

  // create Support Ticket Api
  const createSupport = async () => {
    setLoading(true);

    if (smuser !== null && customReqtext !== "") {
      const formDataProfile = new FormData();
      formDataProfile.append("file", null);
      formDataProfile.append("vm_id", vmDetails);
      formDataProfile.append("type", "Custom Request");
      formDataProfile.append("user_id", smuser.id);
      formDataProfile.append("name", smuser.name);
      formDataProfile.append("user_email", smuser.email);
      formDataProfile.append("user_mobile", smuser.phone);
      formDataProfile.append("msg", customReqtext);
      formDataProfile.append(
        "reply",
        "We are look into this. please wait while"
      );

      try {
        const cdnInfoResponse = await instance.post(
          "/create-enquiry",
          formDataProfile
        );
        const Response = await decryptData(cdnInfoResponse.data);
        setCustomRequestText("");
        if (Response.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Your Ticket generated"}
              isMobile={isMobile}
            />
          ));
        } else {
          // GetTickets();
        }
        setCustomSupportPopup(false);
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
      if (customReqtext == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Message is Required!"}
            isMobile={isMobile}
          />
        ));
      }
    }
    setLoading(false);
  };

  // VM Back List
  const vmbackuplist = async () => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
    };
    // console.log(payload, "PAYload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/vmbackuplist",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);
      const backUpList = Response?.list || [];

      setVMBackUpList(backUpList);
      setIsShowBackupView(true);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // get machine List
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

      const vmArray = Object.keys(vm).map((key) => vm[key]);
      setMachineData(vmArray);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
    vmbackupstatus(true);
  };

  const callBackUpRestoreOnSameVM = async () => {
    setLoading(true);
    // console.log(isSelectedBackupForRestore, "VVV");

    if (smuser.total_credit < restorePriceSameVm && restorePriceSameVm) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={`Oops! Your wallet balance is low, Please Add amount of ${restorePriceSameVm} to create machine`}
          isMobile={isMobile}
        />
      ));
    } else {
      if (restorePriceSameVm > 0) {
        const filePath =
          isSelectedBackupForRestore.filepath &&
          isSelectedBackupForRestore.filepath;
        const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);

        if (isSelectedBackupForRestore !== null && fileName !== null) {
          const payload = {
            user_id: smuser.id,
            vm_id: vmDetails,
            dir: isSelectedBackupForRestore.filepath,
            bkid: isSelectedBackupForRestore.bkid,
            file: fileName,
            time: isSelectedParentTime,
            htime: isSelectedBackupForRestore.htime,
            backup_file: isSelectedBackupForRestore.htime,
            backup_date: isSelectedParentTime,
            backup_type: "same",
            amount: restorePriceSameVm,
            machine_price: restorePriceSameVm,
          };
          // console.log(payload, "RESTORE PAYLOAD");
          try {
            const encryptedResponse = await apiEncryptRequest(payload);
            const loginUserResponse = await instance.post(
              "/restoresamevm",
              encryptedResponse
            );
            const loginResponse = await decryptData(loginUserResponse.data);
            // console.log(loginResponse, "Restore Response");
            // vmbackupstatus();

            if (loginResponse.status) {
              setLoading(false);
              const timeoutId = setTimeout(() => {
                vmbackupstatus();
              }, 70000); // 60000 ms = 60 seconds

              setIntializing(true);
              setIsShowProgressView(true);
              setIsShowBackupView(false);
              SetVMRestorePopup(false);
              handleButtonClick("");

              return () => clearTimeout(timeoutId);
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
            console.error( error);
          }
        } else {
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
        toast((t) => (
          <AppToast
            id={t.id}
            message={
              "Oops! Something went wrong while fetching the restore amount. Please try again later or contact support if the issue persists."
            }
            isMobile={isMobile}
          />
        ));
      }
    }
    setLoading(false);
  };

  // BACKUP RESTORE on NEW VM Api
  const callBackUpRestoreOnNewVM = async () => {
    setLoading(true);
    // console.log(isSelectedBackupForRestore, "VVV");

    const machine_price =
      restorePrice && monitorData && newMachineTime === "3"
        ? restorePrice &&
          monitorData &&
          ((monitorData.cpu * restorePrice.cpu_rate +
            (monitorData.ram / 1024) * restorePrice.ram_rate +
            monitorData.disk_type ==
          "hdd"
            ? monitorData.hard_disk
            : monitorData.disk_type == "nvme"
            ? monitorData.nvme
            : monitorData.ssd * restorePrice.hdd_rate +
              monitorData.data_transfer * 1 -
              (restorePrice.custom_discount *
                (monitorData.cpu * restorePrice.cpu_rate +
                  (monitorData.ram / 1024) * restorePrice.ram_rate +
                  monitorData.disk_type ==
                "hdd"
                  ? monitorData.hard_disk
                  : monitorData.disk_type == "nvme"
                  ? monitorData.nvme
                  : monitorData.ssd * restorePrice.hdd_rate +
                    monitorData.data_transfer * 1)) /
                100) /
            30) *
            3
        : newMachineTime === "7"
        ? ((monitorData.cpu * restorePrice.cpu_rate +
            (monitorData.ram / 1024) * restorePrice.ram_rate +
            monitorData.disk_type ==
          "hdd"
            ? monitorData.hard_disk
            : monitorData.disk_type == "nvme"
            ? monitorData.nvme
            : monitorData.ssd * restorePrice.hdd_rate +
              monitorData.data_transfer * 1 -
              (restorePrice.custom_discount *
                (monitorData.cpu * restorePrice.cpu_rate +
                  (monitorData.ram / 1024) * restorePrice.ram_rate +
                  monitorData.disk_type ==
                "hdd"
                  ? monitorData.hard_disk
                  : monitorData.disk_type == "nvme"
                  ? monitorData.nvme
                  : monitorData.ssd * restorePrice.hdd_rate +
                    monitorData.data_transfer * 1)) /
                100) /
            30) *
          7
        : (monitorData.cpu * restorePrice.cpu_rate +
            (monitorData.ram / 1024) * restorePrice.ram_rate +
            monitorData.disk_type ==
          "hdd"
            ? monitorData.hard_disk
            : monitorData.disk_type == "nvme"
            ? monitorData.nvme
            : monitorData.ssd * restorePrice.hdd_rate +
              monitorData.data_transfer * 1 -
              (restorePrice.custom_discount *
                (monitorData.cpu * restorePrice.cpu_rate +
                  (monitorData.ram / 1024) * restorePrice.ram_rate +
                  monitorData.disk_type ==
                "hdd"
                  ? monitorData.hard_disk
                  : monitorData.disk_type == "nvme"
                  ? monitorData.nvme
                  : monitorData.ssd * restorePrice.hdd_rate +
                    monitorData.data_transfer * 1)) /
                100) * newMachineTime;

    if (smuser.total_credit < machine_price) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={`Oops! Your wallet balance is low, Please Add amount of ${machine_price} to create machine`}
          isMobile={isMobile}
        />
      ));
    } else {
      if (machine_price > 0) {
        const filePath =
          isSelectedBackupForRestore.filepath &&
          isSelectedBackupForRestore.filepath;
        const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
        // console.log(fileName, "VVV");

        if (isSelectedBackupForRestore !== null && fileName !== null) {
          const payload = {
            user_id: smuser.id,
            vm_id: vmDetails,
            dir: isSelectedBackupForRestore.filepath,
            file: fileName,
            time: isSelectedParentTime, //isSelectedBackupForRestore.time,
            htime: isSelectedBackupForRestore.htime,
            backup_file: isSelectedBackupForRestore.htime,
            backup_type: "other",

            flag: "0",
            uuid: "4228c183-50f4-7640-ed7a-567b2a09eedb",
            name: `Rstd-${Date.now()}`,
            machine_val: "4228c183-50f4-7640-ed7a-567b2a09eedb",
            machine_price: machine_price, // machine_price,
            plan_time: newMachineTime,
            hdde:
              monitorData && monitorData.disk_type == "hdd"
                ? monitorData.hard_disk
                : monitorData.disk_type == "nvme"
                ? monitorData.nvme
                : monitorData.ssd,
            cpue: monitorData && monitorData.cpu,
            rame: monitorData && monitorData.ram / 1024,
            data_transfer: monitorData && monitorData.data_transfer,
            disk_type: monitorData && monitorData.disk_type,
            sub_config_type: "standard1",
            server_location: monitorData && monitorData.server_location,
            num_ip: monitorData && monitorData.num_ip,
            uid: smuser.uid,
            time_period: selectedTimePeriod,
          };
          // console.log(payload, "RESTORE PAYLOAD");
          try {
            const encryptedResponse = await apiEncryptRequest(payload);
            const loginUserResponse = await instance.post(
              "/restorebackup",
              encryptedResponse
            );
            const loginResponse = await decryptData(loginUserResponse.data);

            if (loginResponse.status) {
              setLoading(false);
              const timeoutId = setTimeout(() => {
                vmbackupstatus();
              }, 70000);

              setIntializing(true);
              setIsShowProgressView(true);
              setIsShowBackupView(false);
              SetVMRestorePopup(false);
              handleButtonClick("");
              return () => clearTimeout(timeoutId);
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
        } else {
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
        toast((t) => (
          <AppToast
            id={t.id}
            message={
              "Oops! Something went wrong while fetching restore amount. Please try again later or contact support if the issue persists."
            }
            isMobile={isMobile}
          />
        ));
      }
    }
    setLoading(false);
  };

  // check backup progress
  const vmbackupstatus = async (isLoadFirstTime) => {
    if (progressPercentage < 0) {
      setLoading(true);
    }

    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
      username: smuser.panel_email,
    };
    // console.log(payload, "PAYload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/vmbackupstatus",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);
      const progress = Response.progress;

      const keys = Object.keys(progress);
      const lastKey = keys[keys.length - 1];
      const lastArray = progress[lastKey];
      // console.log(lastArray, "LAST");

      setIntializing(false);

      const match = lastArray.data.match(/s:4:"date";i:(\d+);/);
      const backupNum = match ? match[1] : null;

      const regex = /(\d{4}_\d{2}_\d{2}-\d{2}_\d{2}_\d{2})/;
      const matchDate = lastArray.data.match(regex);

      const backup = `${backupNum} (${matchDate[0]})`;
      setProgressPercentage(lastArray.progress);
      setProgressToMachine(backup);

      if (smuser.uid == lastArray.uid) {
        if (lastArray.status === "1") {
          setBackUpFail(false);
          if (lastArray.progress < 100) {
            handleButtonClick("");
            setIsShowBackupView(false);
            setIsShowProgressView(true);
          }
        } else {
          setBackUpFail(true);
          if (!isLoadFirstTime) {
            toast((t) => (
              <AppToast
                id={t.id}
                message={lastArray.status_txt}
                isMobile={isMobile}
              />
            ));
          }
        }
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  // pricing for restore new VM
  const restorePriceForNewVM = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/restore_price",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "====== Restore Price Response");
      setRestorePrice(loginResponse.restore_price);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  // Pricing for restore same VM
  const restorePriceListForSameVM = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/restore_pricing",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "======Restore Price Response");
      setRestorePriceForSameVM(loginResponse.restore_price);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const changeBackupStatus = async () => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
      status: monitorData.backup_status == 1 ? "0" : "1",
    };
    // console.log(payload, "PAYload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/backupon",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);
      // console.log(Response, "backup On off Response===");
      if (Response.status) {
        GetMyMachines();
        toast((t) => (
          <AppToast id={t.id} message={Response.message} isMobile={isMobile} />
        ));
      } else {
        toast((t) => (
          <AppToast id={t.id} message={Response.message} isMobile={isMobile} />
        ));
      }

      //console.log(Response, "==!==!==domain Response");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const getIPPrice = async () => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
    };
    // console.log(payload, "PAYload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/ip_price",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);
      // console.log(Response, "==!==!==IP Price Response");
      setIPPrice(Response.ip_price);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const dedicatedIP = async () => {
    setLoading(true);

    if (ipPrice !== null) {
      if (smuser.total_credit < ipPrice) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={`Oops! Your wallet balance is low, Please add amount of ${ipPrice} to create machine`}
            isMobile={isMobile}
          />
        ));
      } else {
        const payload = {
          user_id: smuser.id,
          vm_id: vmDetails,
          amount: ipPrice,
        };
        // console.log(payload, "PAYload");
        try {
          const encryptedResponse = await apiEncryptRequest(payload);
          const loginUserResponse = await instance.post(
            "/dedicatedip",
            encryptedResponse
          );
          const Response = await decryptData(loginUserResponse.data);
          // console.log(Response, "backup On off Response===");
          if (Response.status) {
            SetAssignDedicatedIPPopup(false);
            GetMyMachines();
            toast((t) => (
              <AppToast
                id={t.id}
                message={Response.message}
                isMobile={isMobile}
              />
            ));
          } else {
            toast((t) => (
              <AppToast
                id={t.id}
                message={Response.message}
                isMobile={isMobile}
              />
            ));
          }

          //console.log(Response, "==!==!==domain Response");
        } catch (error) {
          console.error("Error during the login process:", error);
        }
      }
    } else {
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

  const vmBACKUpPlansList = async () => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      // vm_id: vmDetails,
    };
    // console.log(payload, "PAYload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/backup_plans",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);
      // console.log(Response, "==!==!==Backup List Response");

      const backUpPLansList = Response?.backup_plans || [];
      console.log(backUpPLansList, "==!==!==List ");
      setVMBackUpPlansList(backUpPLansList);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const vmBuyBackupPlan = async (bpid, price) => {
    if (smuser.total_credit < price) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={`Oops! Your wallet balance is low, Please Add amount of ${price} to Buy Plan`}
          isMobile={isMobile}
        />
      ));
    } else {
      setLoading(true);

      const payload = {
        user_id: smuser.id,
        vm_id: vmDetails,
        amount: price,
        bpid: bpid,
      };
      // console.log(payload, "PAYload");
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/vm/buybackup/plan",
          encryptedResponse
        );
        const Response = await decryptData(loginUserResponse.data);
        console.log(Response, "==!==!== Response");

        if (Response.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={Response.message}
              isMobile={isMobile}
            />
          ));
        }
      } catch (error) {
        console.error("Error during the process:", error);
        toast((t) => (
          <AppToast id={t.id} message={error} isMobile={isMobile} />
        ));
      }
      setLoading(false);
    }
  };

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const uploadCustomSSL = async () => {
    setLoading(true);

    if (!selectedPrivFile) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Please upload a private key file."}
          isMobile={isMobile}
        />
      ));
      setLoading(false);
      return;
    }

    if (!selectedFullChainFile) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Please upload a full chain key file."}
          isMobile={isMobile}
        />
      ));
      setLoading(false);
      return;
    }

    const payload = {
      user_id: smuser.id,
      vm_id: vmDetails,
      domain_name: selectedDomain,
      domain_id: selectedDomainId,
      privkey_pem: selectedPrivFile,
      fullchain_pem: selectedFullChainFile,
    };
    // console.log(payload, "PAYload");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/domaincustomssl",
        encryptedResponse
      );
      const Response = await decryptData(loginUserResponse.data);
      console.log(Response, "==!==!== Response");
      if (Response.status) {
        toast((t) => (
          <AppToast id={t.id} message={Response.message} isMobile={isMobile} />
        ));
      } else {
        toast((t) => (
          <AppToast id={t.id} message={Response.message} isMobile={isMobile} />
        ));
      }
    } catch (error) {
      console.error("Error during the process:", error);
      toast((t) => <AppToast id={t.id} message={error} isMobile={isMobile} />);
    }
    setLoading(false);
  };

  const openNewTab = () => {
    window.open(
      "https://www.upnetcloud.com/restore-pricing",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const innerButtons = ["Custom Request"];

  const exportToExcelSSH = (pub_ip, port, username, password) => {
    const data = [
      {
        IP: pub_ip || "",
        SSH_Port: port || "",
        UserName: username || "",
        SSH_Password: password || "",
      },
    ];

    // Create a worksheet with specific headers
    const fileName = "SSH_Details";
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToExcelGenerateURL = (urlPortList) => {
    const pub_ip = monitorData.public_ip;
    const urlData = urlPortList.map((item) => {
      return {
        Port_URL: `${pub_ip} : ${item.source_port}`,
        destination_port: item.destination_port,
      };
    });

    const urlWorksheet = XLSX.utils.json_to_sheet(urlData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, urlWorksheet, "URL Data");

    // Export the workbook
    const fileName = "GenerateURL_Details.xlsx";
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "65rem",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundColor: "#141414",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
        // backgroundColor: "white",
      }}
    >
      {/* Delete domain Popupview */}
      {deletePopup && (
        <div
          style={{
            top: isMobile ? "130%" : "10%",
            left: isMobile ? "5%" : "40%",
            position: "absolute",
            zIndex: "9",
            width: isMobile ? "23rem" : "27rem",
            backdropFilter: "blur(35px)",
            height: "20rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
            borderRadius: "12px", // Assuming you want rounded corners
            border: "2px solid #e97730",
            zIndex: "99999",
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
            Do you Really want to DELETE this Domain ?
          </h4>
          <div
            style={{
              position: "relative",
              marginLeft: isMobile ? "5%" : "10%",
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
                  removeDomain();
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

      {/* Three VM butotns Popupview  */}
      {isShowVMRestorePopup && (
        <div
          style={{
            top: isMobile ? "115%" : "20%",
            left: isMobile ? "5%" : "30%",
            position: "absolute",
            zIndex: "9",
            width: isMobile ? "23rem" : "50rem",
            backdropFilter: "blur(10px)",
            height: "15rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
            borderRadius: "12px", // Assuming you want rounded corners
            border: "2px solid #e97730",
            zIndex: "99999",
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
            onClick={() => SetVMRestorePopup(!isShowVMRestorePopup)}
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
              // marginLeft: "10%",
              marginTop: "12%",
              display: isMobile ? "inline-block" : "flex",
              gap: isMobile ? "" : "5%",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                style={{
                  width: "18rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#aaa",
                  outline: "4px solid #aaa",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() => {
                  SetVMRestorePopup(false);
                  SetVMRestoreConfirmPopup(true);
                  restorePriceListForSameVM();
                }}
              >
                Restore on same VM
              </button>
            </div>
            <div>
              {" "}
              <button
                style={{
                  width: "18rem",
                  marginTop: isMobile ? "20px" : "5px",
                  zIndex: "9",
                  position: "relative",
                  fontWeight: "700",
                  fontSize: "20px",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#e97730",
                  outline: "4px solid #e97730",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() => {
                  // callBackUpRestoreOnNewVM();
                  SetVMRestorePopup(false);
                  SetVMRestoreCostCalPopup(true);
                  restorePriceForNewVM();
                }}
              >
                Restore on New VM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VM Restore confirmation Popupview */}
      {isShowVMRestoreConfirmPopup && (
        <div
          style={{
            top: isMobile ? "95%" : "10%",
            left: isMobile ? "5%" : "33%",
            position: "absolute",
            zIndex: "9",
            width: isMobile ? "23rem" : "45rem",
            backdropFilter: "blur(20px)",
            height: "32rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
            borderRadius: "12px", // Assuming you want rounded corners
            border: "2px solid #e97730",
            zIndex: "99999",
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
            onClick={() =>
              SetVMRestoreConfirmPopup(!isShowVMRestoreConfirmPopup)
            }
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
              textAlign: "center",
            }}
          >

            <h4
              style={{
                color: "white",
                position: "absolute",
                top: "8rem",
                left: "50%",
                width: "80%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                outline: "4px solid #035189",
                border: "4px solid #fff",
                borderColor: "white",
                borderRadius: "30px",
                backgroundColor: "#035189",
                fontWeight: "600",
              }}
            >
              This Action will permanently Delete all files and data from your
              VM <br></br>
              {/* {monitorData && monitorData.vm_name && (
                <strong>{monitorData.vm_name}</strong>
              )} */}
              <div>
                <p>
                  <span role="img" aria-label="right pointing hand">
                    👉{" "}
                  </span>
                  {monitorData.vm_name}
                  <span role="img" aria-label="left pointing hand">
                    {" "}
                    👈
                  </span>
                </p>
              </div>
              Are you sure you want to Rebuild VM ?
              <h4
                style={{
                  color: "white",
                  position: "absolute",
                  top: "14rem",
                  left: "50%",
                  width: "100%",
                  height: "60px",
                  transform: "translate(-50%, -50%)",
                  padding: "20px",
                  outline: "4px solid #b71b1b",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                  backgroundColor: "#b71b1b",
                  fontWeight: "600",
                  fontSize: "17px",
                }}
              >
                Warning : Existing data on VM will be lost permanently.
              </h4>
              {/* , or <br></br> would
              you prefer to Go Back? */}
            </h4>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop: "21rem",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                style={{
                  width: isMobile ? "10rem" : "14rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#035189",
                  outline: "4px solid #035189",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
              >
                Restore Amount
              </button>
            </div>
            <div>
              {" "}
              <button
                style={{
                  width: isMobile ? "8rem" : "14rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#035189",
                  outline: "4px solid #035189",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
              >
                {currencyReturn({
                  price: restorePriceSameVm,
                  symbol: smuser.prefer_currency,
                  rates: appCurrency,
                })}
              </button>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop: "20px",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                style={{
                  width: isMobile ? "10rem" : "14rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#aaa",
                  outline: "4px solid #aaa",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() => {
                  SetVMRestoreConfirmPopup(false);
                  callBackUpRestoreOnSameVM();
                }}
              >
                Proceed Further
              </button>
            </div>
            <div>
              {" "}
              <button
                style={{
                  width: isMobile ? "8rem" : "14rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#e97730",
                  outline: "4px solid #e97730",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() =>
                  SetVMRestoreConfirmPopup(!isShowVMRestoreConfirmPopup)
                }
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VM Restore Cost calculation Popupview */}
      {isShowVMRestoreCostCalPopup && (
        <div
          style={{
            top: isMobile ? "95%" : "12%",
            left: isMobile ? "5%" : "35%",
            position: "absolute",
            zIndex: "9",
            width: isMobile ? "23rem" : "40rem",
            backdropFilter: "blur(20px)",
            height: "30rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
            borderRadius: "12px", // Assuming you want rounded corners
            border: "2px solid #e97730",
            zIndex: "99999",
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
            onClick={() =>
              SetVMRestoreCostCalPopup(!isShowVMRestoreCostCalPopup)
            }
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
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop: "4rem",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                style={{
                  width: isMobile ? "10rem" : "15rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#035189",
                  outline: "4px solid #035189",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
              >
                Validity
              </button>
            </div>

            <select
              name="plan_time"
              style={{
                width: isMobile ? "8rem" : "15rem",
                // zIndex: "9",
                position: "relative",
                fontSize: "18px",
                fontWeight: "700",
                color: "white",
                height: "55px",
                backgroundColor: "#035189",
                outline: "4px solid #035189",
                border: "4px solid #ffff",
                borderColor: "white",
                borderRadius: "30px",
                textAlign: "center",
              }}
              onChange={(e) => {
                setNewMachineTime(e.target.value);
                if (e.target.value === "3" || e.target.value === "7") {
                  setSelectedTimePeriod("1");
                } else {
                  setSelectedTimePeriod("0");
                }
              }}
            >
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="1">1 Month</option>
              <option value="6">6 Month</option>
              <option value="9">9 Month</option>
              <option value="12">1 Year</option>
              <option value="24">2 Years</option>
            </select>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop: "1rem",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                style={{
                  width: isMobile ? "10rem" : "15rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#035189",
                  outline: "4px solid #035189",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
              >
                Restore Amount
              </button>
            </div>
            <div>
              {" "}
              <button
                style={{
                  width: isMobile ? "8rem" : "15rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#035189",
                  outline: "4px solid #035189",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
              >
                {currencyReturn({
                  price:
                    newMachineTime === "3"
                      ? restorePrice &&
                        monitorData &&
                        ((monitorData.cpu * restorePrice.cpu_rate +
                          (monitorData.ram / 1024) * restorePrice.ram_rate +
                          monitorData.disk_type ==
                        "hdd"
                          ? monitorData.hard_disk
                          : monitorData.disk_type == "nvme"
                          ? monitorData.nvme
                          : monitorData.ssd * restorePrice.hdd_rate +
                            monitorData.data_transfer * 1 -
                            (restorePrice.custom_discount *
                              (monitorData.cpu * restorePrice.cpu_rate +
                                (monitorData.ram / 1024) *
                                  restorePrice.ram_rate +
                                monitorData.disk_type ==
                              "hdd"
                                ? monitorData.hard_disk
                                : monitorData.disk_type == "nvme"
                                ? monitorData.nvme
                                : monitorData.ssd * restorePrice.hdd_rate +
                                  monitorData.data_transfer * 1)) /
                              100) /
                          30) *
                          3
                      : newMachineTime === "7"
                      ? ((monitorData.cpu * restorePrice.cpu_rate +
                          (monitorData.ram / 1024) * restorePrice.ram_rate +
                          monitorData.disk_type ==
                        "hdd"
                          ? monitorData.hard_disk
                          : monitorData.disk_type == "nvme"
                          ? monitorData.nvme
                          : monitorData.ssd * restorePrice.hdd_rate +
                            monitorData.data_transfer * 1 -
                            (restorePrice.custom_discount *
                              (monitorData.cpu * restorePrice.cpu_rate +
                                (monitorData.ram / 1024) *
                                  restorePrice.ram_rate +
                                monitorData.disk_type ==
                              "hdd"
                                ? monitorData.hard_disk
                                : monitorData.disk_type == "nvme"
                                ? monitorData.nvme
                                : monitorData.ssd * restorePrice.hdd_rate +
                                  monitorData.data_transfer * 1)) /
                              100) /
                          30) *
                        7
                      : (monitorData.cpu * restorePrice.cpu_rate +
                          (monitorData.ram / 1024) * restorePrice.ram_rate +
                          monitorData.disk_type ==
                        "hdd"
                          ? monitorData.hard_disk
                          : monitorData.disk_type == "nvme"
                          ? monitorData.nvme
                          : monitorData.ssd * restorePrice.hdd_rate +
                            monitorData.data_transfer * 1 -
                            (restorePrice.custom_discount *
                              (monitorData.cpu * restorePrice.cpu_rate +
                                (monitorData.ram / 1024) *
                                  restorePrice.ram_rate +
                                monitorData.disk_type ==
                              "hdd"
                                ? monitorData.hard_disk
                                : monitorData.disk_type == "nvme"
                                ? monitorData.nvme
                                : monitorData.ssd * restorePrice.hdd_rate +
                                  monitorData.data_transfer * 1)) /
                              100) * newMachineTime,
                  symbol: smuser.prefer_currency,
                  rates: appCurrency,
                })}
              </button>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
            }}
          >
            <button
              style={{
                color: "white",
                position: "absolute",
                top: "3rem",
                left: "50%",
                width: "80%",
                height: "60px",
                transform: "translate(-50%, -50%)",
                // padding: "20px",
                outline: "4px solid #035189",
                border: "4px solid #ffff",
                borderColor: "white",
                borderRadius: "30px",
                backgroundColor: "#035189",
                fontWeight: "600",
                fontSize: "18px",
              }}
              onMouseOver={(e) => (e.target.style.fontSize = "19px")}
              onMouseOut={(e) => (e.target.style.fontSize = "18px")}
              onClick={() => {
                openNewTab();
              }}
            >
              Restore VM Pricing Details
            </button>
          </div>
          <div
            style={{
              position: "relative",
              textAlign: "center",
            }}
          >
            <button
              style={{
                color: "white",
                position: "absolute",
                top: "135px",
                left: "50%",
                width: "80%",
                height: "70px",
                transform: "translate(-50%, -50%)",
                // padding: "20px",
                outline: "4px solid #035189",
                border: "4px solid #ffff",
                borderColor: "white",
                borderRadius: "30px",
                backgroundColor: "#035189",
                fontWeight: "600",
                fontSize: "18px",
                textWrap: "wrap",
              }}
            >
              The Restored VM will have the same<br></br>configuration as the
              current VM
            </button>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop: "12rem",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                style={{
                  width: isMobile ? "10rem" : "14rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#aaa",
                  outline: "4px solid #aaa",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() => {
                  SetVMRestoreCostCalPopup(false);
                  callBackUpRestoreOnNewVM();
                }}
              >
                Proceed Further
              </button>
            </div>
            <div>
              {" "}
              <button
                style={{
                  width: isMobile ? "8rem" : "14rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#e97730",
                  outline: "4px solid #e97730",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() =>
                  SetVMRestoreCostCalPopup(!isShowVMRestoreCostCalPopup)
                }
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable Popupview */}
      {isShowSTOPBackUPPopup && (
        <div
          style={{
            top: isMobile ? "115%" : "15%",
            left: isMobile ? "5%" : "35%",
            position: "absolute",
            zIndex: "9",
            width: isMobile ? "23rem" : "40rem",
            backdropFilter: "blur(25px)",
            height: "23rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
            borderRadius: "12px", // Assuming you want rounded corners
            border: "2px solid #e97730",
            zIndex: "99999",
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
            onClick={() => SetSTOPBackUPPopup(!isShowSTOPBackUPPopup)}
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
              textAlign: "center",
            }}
          >
            <h4
              style={{
                color: "#09528a",
                position: "absolute",
                top: "8rem",
                left: "50%",
                width: "80%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                outline: "4px solid #aaa",
                border: "4px solid #ffff",
                borderColor: "white",
                borderRadius: "30px",
                backgroundColor: "#aaa",
              }}
            >
              {monitorData && monitorData.backup_status == 1
                ? "Are you sure you want to Disable BackUp, or"
                : "Are you sure you want to Enable BackUp, or"}
              <br></br> would you prefer to Go Back?
            </h4>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "15%" : "17%",
              // marginTop: "-3%",
              marginTop: "16rem",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "3%",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                style={{
                  width: isMobile ? "8rem" : "12rem",
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
                onMouseOver={(e) => (e.target.style.color = "#07528B")}
                onMouseOut={(e) => (e.target.style.color = "white")}
                onClick={() => {
                  SetSTOPBackUPPopup(false);
                  changeBackupStatus();
                }}
              >
                {monitorData && monitorData.backup_status == 1
                  ? "Disable"
                  : "Enable"}
              </button>
            </div>
            <div>
              {" "}
              <button
                style={{
                  width: isMobile ? "8rem" : "12rem",
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
                onMouseOver={(e) => (e.target.style.color = "#07528B")}
                onMouseOut={(e) => (e.target.style.color = "white")}
                onClick={() => SetSTOPBackUPPopup(!isShowSTOPBackUPPopup)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {isShowCustomSupportPopup && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backdropFilter: "blur(5px)",
              // backgroundColor: "#035189",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
              borderRadius: "12px", // Assuming you want rounded corners
              border: "2px solid #e97730",
              top: "10%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile ? "80%" : "40%",
              height: isMobile ? "30%" : "30rem",
            }}
          >
            <div style={{ display: "grid" }}>
              <button
                style={{
                  zIndex: "9",
                  position: "absolute",
                  backgroundColor: "transparent",
                  border: "none",
                  right: "0",
                }}
                onClick={() => setCustomSupportPopup(false)}
              >
                <FaX
                  style={{
                    marginTop: "5px",
                    color: "#e97730",
                    display: "inline-block",
                    fontSize: "19px",
                  }}
                />
              </button>{" "}
              <div style={{ height: "30rem" }}>
                <div
                  className="register-main see-full"
                  style={{
                    marginTop: "0rem",
                    // width: "45rem",
                    height: "29.8rem",
                  }}
                >
                  <div
                    className="buttons-container"
                    style={
                      {
                      }
                    }
                  >
                    {innerButtons.map((title, idx) => (
                      <Button
                        key={idx}
                        style={{
                          marginLeft: "-1px",
                          background: "#f47c20",
                          border: "none",
                          fontSize: "20px",
                          padding: "5px 15px",
                          color: "#fff",
                          fontWeight: "600",
                          borderRadius: "10px",
                          // marginBottom: "10px",
                        }}
                        onClick={() => setActiveButton(title)}
                      >
                        {title}
                      </Button>
                    ))}
                  </div>
                  <form className="see-full" style={{ marginTop: "20px" }}>
                    <input
                      type="hidden"
                      name="_token"
                      value="IHks1cEdGGmsvouWsdVeWVHE29KFoaLV0iN8cPkE"
                    />

                    <div className="form-top">
                      <h4 className="text-white">Send us your question</h4>

                      <div
                        className="input-container"
                        style={{ marginTop: "15px" }}
                      >
                        <textarea
                          className="custom-textarea"
                          style={{
                            // minHeight: "200px",
                            maxHeight: "200px",
                            padding: "10px",
                            height: "157px",
                            width: "100%",
                            backgroundColor: "transparent",
                            color: "white",
                            borderRadius: "30px",
                            border: "none",
                          }}
                          value={customReqtext}
                          placeholder={placeholder}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "30px",
                        justifyContent: "center",
                      }}
                    >
                      <div className="log-in" onClick={() => createSupport()}>
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
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Dedicated IP Popupview */}
      {isShowAssignDedicatedIPPopup && (
        <div
          style={{
            top: isMobile ? "95%" : "12%",
            left: isMobile ? "5%" : "30%",
            position: "absolute",
            zIndex: "9",
            width: isMobile ? "23rem" : "50rem",
            backdropFilter: "blur(20px)",
            height: "29rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", 
            borderRadius: "12px",
            border: "2px solid #e97730",
            zIndex: "99999",
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
            onClick={() =>
              SetAssignDedicatedIPPopup(!isShowAssignDedicatedIPPopup)
            }
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
              textAlign: "center",
            }}
          >

            <h4
              style={{
                color: "white",
                position: "absolute",
                top: "10rem",
                left: "50%",
                width: "80%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                outline: "4px solid #035189",
                border: "4px solid #fff",
                borderColor: "white",
                borderRadius: "30px",
                backgroundColor: "#035189",
                fontSize:
                  domainList &&
                  domainList
                    .reverse()
                    .filter(
                      (item) => item.domain_status === 1 && item.domain_name
                    ).length === 0
                    ? "18px"
                    : "24px",
                fontWeight: "600",
              }}
            >
              {domainList &&
              domainList
                .reverse()
                .filter((item) => item.domain_status === 1 && item.domain_name)
                .length === 0
                ? "If you do not have a specific requirement for a Dedicated IP, you can proceed and use the VM without any issues. However, if in the future you need to assign a dedicated IP to this VM, all existing configurations, such as domains, SSL certificates, redirects, and port mappings, will need to be reprocessed to ensure everything functions correctly with the new IP address."
                : " Once you assign a dedicated IP to this VM, all the domains, SSL certificates, redirects, and ports previously configured will need to be reprocessed to align with the new IP address. This ensures that all services Function correctly with the updated networkConfiguration."}
            </h4>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop:
                domainList &&
                domainList
                  .reverse()
                  .filter(
                    (item) => item.domain_status === 1 && item.domain_name
                  ).length === 0
                  ? "265px"
                  : "290px",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            <div>
              <h4
                style={{
                  width: isMobile ? "10rem" : "19rem",
                  // marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                  padding: "15px",
                  height: "55px",
                  backgroundColor: "#035189",
                  outline: "4px solid #035189",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
              >
                Dedicated IP Amount
              </h4>
            </div>
            <div>
              {" "}
              <h4
                style={{
                  width: isMobile ? "8rem" : "19rem",
                  // marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                  padding: "15px",
                  height: "55px",
                  backgroundColor: "#035189",
                  outline: "4px solid #035189",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
              >
                {currencyReturn({
                  price: ipPrice,
                  symbol: smuser.prefer_currency,
                  rates: appCurrency,
                })}
              </h4>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop: "10px",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                style={{
                  width: isMobile ? "10rem" : "12rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#aaa",
                  outline: "4px solid #aaa",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() => {
                  dedicatedIP();
                }}
              >
                Proceed
              </button>
            </div>
            <div>
              {" "}
              <button
                style={{
                  width: isMobile ? "8rem" : "12rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#e97730",
                  outline: "4px solid #e97730",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() =>
                  SetAssignDedicatedIPPopup(!isShowAssignDedicatedIPPopup)
                }
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {isShowCustomSSLPopup && (
        <div
          style={{
            top: isMobile ? "95%" : "16%",
            left: isMobile ? "5%" : "32%",
            position: "absolute",
            zIndex: "99999",
            width: isMobile ? "23rem" : "50rem",
            backdropFilter: "blur(20px)",
            height: "30rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            border: "2px solid #e97730",
            backgroundImage: `url("/images/blue-box-bg.svg")`,
            backgroundSize: "cover",
            backgroundColor: "#07528b",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={() => SetCustomSSLPopup(!isShowCustomSSLPopup)}
            >
              <FaX
                style={{
                  marginBottom: "2px",
                  color: "#e97730",
                  display: "inline-block",
                  fontSize: "19px",
                }}
              />
            </button>

            <h2 style={{ textAlign: "center", color: "white" }}>
              Custom SSL Certificate
            </h2>

            <div style={{ padding: "20px", textAlign: "left", color: "white" }}>
              <strong>Domain Name: {selectedDomain}</strong>
              <img
                className="hover-zoom"
                src={"/images/copy_icon.png"}
                style={{
                  marginLeft: "10px",
                  width: "30px",
                  height: "30px",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(selectedDomain);
                  setCopiedDomain(true);
                  setTimeout(() => setCopiedDomain(false), 2000);
                }}
              />
              {copiedDomain && <span className="blinkStyle">Copied!</span>}
            </div>

            <div style={{ padding: "20px" }}>
              <label style={{ color: "white" }}>Private key:</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid white",
                  borderRadius: "25px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <input
                  ref={fileInputRef1}
                  type="file"
                  accept=".pem,.key"
                  style={{ flex: 1, color: "white" }}
                  onChange={(e) => handleFileChange(e, setSelectedPrivFile)}
                />
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              <label style={{ color: "white" }}>Full Chain Key:</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid white",
                  borderRadius: "25px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <input
                  ref={fileInputRef2}
                  type="file"
                  accept=".pem,.crt"
                  style={{ flex: 1, color: "white" }}
                  onChange={(e) =>
                    handleFileChange(e, setSelectedFullChainFile)
                  }
                />
              </div>
            </div>
          </div>
          <button
            style={{
              marginLeft: "10px",
              backgroundColor: "#e97730",
              outline: "4px solid #e97730",
              border: "4px solid #ffff",
              borderColor: "white",
              borderRadius: "30px",
              fontWeight: "700",
              color: "white",
              height: "55px",
              width: "10rem",
            }}
            onClick={() => uploadCustomSSL()}
          >
            Upload
          </button>
        </div>
      )}

      {/* child user content popup */}
      {isShowChildUserContentPopup && (
        <div
          style={{
            top: isMobile ? "95%" : "10%",
            left: isMobile ? "5%" : "33%",
            position: "absolute",
            zIndex: "9",
            width: isMobile ? "23rem" : "45rem",
            backdropFilter: "blur(20px)",
            height: "22rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
            borderRadius: "12px", // Assuming you want rounded corners
            border: "2px solid #e97730",
            zIndex: "99999",
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
            onClick={() =>
              SetChildUserContentPopup(!isShowChildUserContentPopup)
            }
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
              textAlign: "center",
            }}
          >
            <h4
              style={{
                color: "white",
                position: "absolute",
                top: "8rem",
                left: "50%",
                width: "80%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                outline: "4px solid #035189",
                border: "4px solid #fff",
                borderColor: "white",
                borderRadius: "30px",
                backgroundColor: "#035189",
                fontWeight: "600",
              }}
            >
              This Feature is only available on the Master Account. You are
              currently logged in with a Child Account. Please connect to your
              Master Account to access this Feature.
            </h4>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop: "16rem",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            
            <div>
              {" "}
              <button
                style={{
                  width: isMobile ? "8rem" : "14rem",
                  marginTop: "2px",
                  zIndex: "9",
                  position: "relative",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  height: "55px",
                  backgroundColor: "#e97730",
                  outline: "4px solid #e97730",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onMouseOver={(e) => (e.target.style.fontSize = "21px")}
                onMouseOut={(e) => (e.target.style.fontSize = "20px")}
                onClick={() =>
                  SetChildUserContentPopup(!isShowChildUserContentPopup)
                }
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-support">
            Server Stats <span></span>
          </div>
          <div
            style={{
              marginLeft: "4rem",
              marginBottom: "-20rem",
              display: "grid",
              gridTemplateColumns: "auto auto auto auto",
              justifyItems: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: "20px 0px",
                flexWrap: "nowrap",
              }}
            >
              <img
                src="/images/admin/06-View-Stats/server.png"
                style={{
                  width: "80%",
                  height: "500px",
                  marginTop: "-30px",
                  marginBottom: "-15rem",
                }}
                className="bg-image"
              />
              <div
                className="stat"
                style={{
                  position: "absolute",
                  maxWidth: "20rem",
                  marginLeft: "1rem",
                }}
              >
                <div className="machine-icon-edit-profile">
                  <img src={"/images/admin/06-View-Stats/switch.svg"} />
                </div>
                <div
                  className="machine-title"
                  style={{
                    backgroundColor: monitorData.status == 1 ? "green" : "red",
                  }}
                >
                  {monitorData && monitorData.status == 1 ? "ON" : "OFF"}
                </div>
                <div className="mid-portion" />
                <div className="machine-subtitle theme-bg-blue">
                  {monitorData && monitorData.vm_name}
                </div>
              </div>

              <img
                src="/images/admin/06-View-Stats/server.png"
                style={{
                  width: "80%",
                  height: "500px",
                  marginTop: "-30px",
                  marginBottom: "-15rem",
                }}
                className="bg-image"
              />
              <div
                className="stat"
                style={{
                  position: "absolute",
                  maxWidth: "30rem",
                  marginTop: "14rem",
                  marginLeft: "1rem",
                }}
              >
                <div className="machine-icon-edit-profile">
                  <img src={"/admin/images/admin/13-Profile/server_icon.png"} />
                </div>
                <div className="machine-title theme-bg-orange">CPU</div>
                <div className="mid-portion" />
                <div className="machine-subtitle theme-bg-blue">
                  {monitorData && monitorData.cpu}
                </div>
              </div>

              <img
                src="/images/admin/06-View-Stats/server.png"
                style={{
                  width: "80%",
                  height: "500px",
                  marginTop: "-30px",
                  marginBottom: "-15rem",
                }}
                className="bg-image"
              />
              <div
                className="stat"
                style={{
                  position: "absolute",
                  maxWidth: "20rem",
                  marginTop: "29rem",
                  marginLeft: "1rem",
                }}
              >
                <div className="machine-icon-edit-profile">
                  <img src={"/images/admin/06-View-Stats/ram-icon.svg"} />
                </div>
                <div className="machine-title theme-bg-orange">RAM</div>
                <div className="mid-portion" />
                <div className="machine-subtitle theme-bg-blue">
                  {monitorData && monitorData.ram / 1024} GB
                </div>
              </div>

              <img
                src="/images/admin/06-View-Stats/server.png"
                style={{ width: "80%", height: "500px", marginTop: "-30px" }}
                className="bg-image"
              />
              <div
                className="stat"
                style={{
                  width: "80%",
                  position: "absolute",
                  maxWidth: "30rem",
                  marginTop: "43rem",
                }}
              >
                <div className="machine-icon-edit-profile">
                  <img
                    src={"/images/admin/06-View-Stats/disk-space-icon.svg"}
                  />
                </div>

                <div className="machine-title theme-bg-orange">Storage</div>
                <div className="mid-portion" />
                  <div className="machine-subtitle theme-bg-blue">
                    {monitorData && monitorData.disk_type == "hdd"
                      ? monitorData.hard_disk
                      : monitorData.disk_type == "nvme"
                      ? monitorData.nvme
                      : monitorData.ssd}{" "}
                    GB
                  </div>
                </div>

              <img
                src="/images/admin/06-View-Stats/server.png"
                style={{ width: "80%", height: "500px", marginTop: "-17rem" }}
                className="bg-image"
              />
              <div
                className="stat"
                style={{
                  width: "80%",
                  position: "absolute",
                  maxWidth: "20rem",
                  marginTop: "57rem",
                }}
              >
                <div className="machine-icon-edit-profile">
                  <img
                    src={"/images/admin/06-View-Stats/disk-space-icon.svg"}
                  />
                </div>
                <div className="machine-title theme-bg-orange">Server Type</div>
                <div className="mid-portion" />
                <div className="machine-subtitle theme-bg-blue">
                  {monitorData && monitorData.support_type}
                </div>
              </div>

              {/* BackUp */}
              <img
                src="/images/admin/06-View-Stats/server.png"
                style={{ width: "80%", height: "500px", marginTop: "-17rem" }}
                className="bg-image"
              />
              <div
                className="stat"
                style={{
                  width: "80%",
                  position: "absolute",
                  maxWidth: "20rem",
                  marginTop: "72rem",
                  // marginLeft: "1rem",
                }}
              >
                <div className="machine-icon-edit-profile">
                  <img
                    src={"/images/admin/06-View-Stats/disk-space-icon.svg"}
                  />
                </div>
                <div
                  className="machine-title"
                  style={{
                    backgroundColor:
                      monitorData.backup_status == 1 ? "green" : "red",
                    // height: "25px",
                  }}
                >
                  {monitorData && monitorData.backup_status == 1
                    ? "Backup ON"
                    : "Backup OFF"}
                </div>
                <div
                  className="profile-edit-badge-details"
                  onClick={() => SetSTOPBackUPPopup(true)}
                  style={{ marginRight: "-20px", left: "85%", top: "58%" }}
                >
                  <img
                    className="edit-iconimage"
                    src="/admin/images/admin/13-Profile/Pen.png"
                    style={{
                      paddingRight: "1px",
                    }}
                  />
                </div>
                <div className="mid-portion" />
                <div className="machine-subtitle theme-bg-blue">
                  <button
                    // className="more-details-hover"
                    onClick={() =>
                      // onClickBackup()
                      monitorData && monitorData.backup_status == 0
                        ? setIsShowBackupView(true)
                        : ""
                    }
                    style={{
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {monitorData && monitorData.backup_status == 1
                      ? isHovered
                        ? "More Details"
                        : "Enable"
                      : "Disable"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="button-group"
            style={{ marginTop: "4rem", marginLeft: "15px" }}
          >
            <button
              className={`btn ${activeButton === "SSH" ? "active" : ""}`}
              style={{
                background: `${activeButton === "SSH" ? "#f47c20" : "#035189"}`,
              }}
              onClick={() => handleButtonClick("SSH")}
            >
              SSH
            </button>
            {monitorData && monitorData.vm_type === 1 && (
              <button
                className={`btn ${
                  activeButton === "Add Domain" ? "active" : ""
                }`}
                style={{
                  background: `${
                    activeButton === "Add Domain" ? "#f47c20" : "#035189"
                  }`,
                }}
                onClick={() => handleButtonClick("Add Domain")}
              >
                Add Domain
              </button>
            )}

            {monitorData && monitorData.vm_type === 1 && (
              <button
                className={`btn ${activeButton === "SSL" ? "active" : ""}`}
                style={{
                  background: `${
                    activeButton === "SSL" ? "#f47c20" : "#035189"
                  }`,
                }}
                onClick={() => handleButtonClick("SSL")}
              >
                SSL
              </button>
            )}

            {monitorData && monitorData.vm_type === 1 && (
              <button
                className={`btn ${
                  activeButton === "HTTPS Redirect" ? "active" : ""
                }`}
                style={{
                  background: `${
                    activeButton === "HTTPS Redirect" ? "#f47c20" : "#035189"
                  }`,
                  marginTop: "10px",
                }}
                onClick={() => handleButtonClick("HTTPS Redirect")}
              >
                HTTPS Redirect
              </button>
            )}

            {monitorData && monitorData.vm_type === 1 && (
              <button
                className={`btn ${
                  activeButton === "Generate URL" ? "active" : ""
                }`}
                style={{
                  background: `${
                    activeButton === "Generate URL" ? "#f47c20" : "#035189"
                  }`,
                }}
                onClick={() => handleButtonClick("Generate URL")}
              >
                Generate URL
              </button>
            )}
          </div>

          {activeButton !== "SSH" &&
            activeButton !== "SSL" &&
            activeButton !== "ATTACH_JUMPSERVER" &&
            activeButton !== "CREATE_USER" &&
            !isShowBackupView &&
            !isShowVMView &&
            monitorData &&
            monitorData.vm_type === 1 && (
              <div
                className="input-container"
                style={{
                  marginLeft: "15%",
                  // marginRight: "25px",
                  position: "relative",
                  border: "2px solid #035189",
                  width: "18rem",
                  marginTop: "10px",
                  height: "40px",
                }}
              >
                <input
                  type="text"
                  name="search"
                  className="input-signup input-tickets"
                  placeholder={
                    activeButton === "Generate URL" ? "Search" : "Search Domain"
                  }
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

          {activeButton === "ATTACH_JUMPSERVER" && (
            <div
              style={{
                marginTop: "40px",
                minHeight: "20rem",
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                marginLeft: "20px",
                width: "100%",
                padding: "25px",
                backgroundColor: "#07528b",
                borderRadius: "12px",
                overflow: "visible",
                position: "relative",
                zIndex: 10,
              }}
            >
              <h3 style={{ color: "white", marginBottom: "15px" }}>
                Attach Jumpserver
              </h3>

              <p style={{ color: "white" }}>
                Jumpservers loaded: {jumpservers.length}
              </p>

              <select
                value={selectedJumpserverId}
                onChange={(e) => setSelectedJumpserverId(Number(e.target.value))}
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "20px",
                  padding: "0 15px",
                  marginTop: "10px",
                  position: "relative",
                  zIndex: 1000,
                }}
              >
                <option value="">Select Jumpserver</option>

                {jumpservers.map((js) => (
                  <option key={js.id} value={js.id}>
                    {js.vm_name} ({js.public_ip})
                  </option>
                ))}
              </select>

              <button
                disabled={!selectedJumpserverId}
                onClick={attachJumpserver}
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  opacity: selectedJumpserverId ? 1 : 0.5,
                  cursor: selectedJumpserverId ? "pointer" : "not-allowed",
                }}
              >
                Apply Jumpserver
              </button>
            </div>
          )}

          {activeButton === "CREATE_USER" && (
            <div
              style={{
                minHeight: "22rem",
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                marginLeft: "20px",
                width: "100%",
                padding: "25px",
                backgroundColor: "#07528b",
                borderRadius: "12px",
              }}
            >

              {/* Username */}
              <input
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                style={{
                        width: "100%",
                        height: "45px",
                        borderRadius: "25px",
                        padding: "0 15px",
                        marginBottom: "15px",
                        border: "none",
                        outline: "none",
                      }}
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                        width: "100%",
                        height: "45px",
                        borderRadius: "25px",
                        padding: "0 15px",
                        marginBottom: "15px",
                        border: "none",
                        outline: "none",
                      }}
              />

              <button
                onClick={createVMUser}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Create User
              </button>
            </div>
          )}

          {activeButton === "SSH" && (
            <div
              style={{
                minHeight: "34rem",
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                top: "1rem",
                // height: "40vh",
                marginLeft: "20px",
                width: "90%",
                // marginLeft: "25px",
                // display: "flex",

                padding: "1px 25px",
                position: "relative",
                backgroundColor: "#07528b", // Use backgroundColor instead of background
                borderRadius: "12px",
                // flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    position: "relative",
                    // display: "flex",
                    flexWrap: "wrap",
                    zIndex: "1",
                  }}
                >
                  <div
                    style={{
                      // width: "50%",
                      padding: "0px 10px",
                    }}
                  >
                    {/* IP */}
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid white",
                        borderRadius: "25px",
                        padding: "5px",
                        height: "50px",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontSize: "14px",
                          paddingTop: "15px",
                          marginLeft: "20px",
                        }}
                      >
                        {" "}
                        {/* IP : {vmRes && vmRes.ip} */}
                        IP : {monitorData && monitorData.public_ip}
                      </p>
                    </div>
                    {/* PAN Number */}
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid white",
                        borderRadius: "25px",
                        padding: "5px",
                        height: "50px",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontSize: "14px",
                          paddingTop: "15px",
                          marginLeft: "20px",
                        }}
                      >
                        {" "}
                        Username : {vmRes && vmRes.vm_username}
                      </p>
                    </div>
                    {/* Passport Or Driving Lic. No. */}
                  </div>
                  <div
                    style={{
                      // width: "50%",
                      padding: "0px 10px",
                    }}
                  >
                    {/* SSH Port */}
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid white",
                        borderRadius: "25px",
                        padding: "5px",
                        height: "50px",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontSize: "14px",
                          paddingTop: "15px",
                          marginLeft: "20px",
                        }}
                      >
                        {" "}
                        SSH Port :
                        {monitorData && monitorData.vm_type === 1
                          ? monitorData.vm_port
                          : monitorData.vm_port}
                      </p>
                    </div>
                    {/* PAN Number */}
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid white",
                        borderRadius: "25px",
                        padding: "5px",
                        height: "50px",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontSize: "14px",
                          paddingTop: "15px",
                          marginLeft: "20px",
                        }}
                      >
                        {" "}
                        Password :{" "}
                        {vmRes && showPass ? vmRes.vm_pass : "••••••••"}
                      </p>
                      <div style={{ position: "absolute", right: "6%" }}>
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
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button 
                    style={{
                      zIndex: "2",
                      position: "relative",
                      marginTop: "10%",
                      left: "25%",
                      fontWeight: "700",
                      color: "white",
                      height: "55px",
                      width: "11rem",
                      backgroundColor: "#e97730",
                      outline: "4px solid #e97730",
                      border: "4px solid #ffff",
                      borderColor: "white",
                      borderRadius: "30px",
                    }}
                    onClick={() => regenerateSSH(monitorData.vm_id)}
                  >
                    {" "}
                    SSH Key
                  </button>
                </div>

                <div onClick={() => setChangePass(!changePass)}>
                  <p
                    style={{
                      zIndex: "2",
                      position: "absolute",
                      marginTop: "20px",
                      color: "white",
                      textAlign: "center",
                      fontSize: "20px",
                      paddingTop: "15px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      marginLeft: "78px"
                    }}
                  >
                    {" "}
                    Change Password
                  </p>
                </div>
                {vmRes && vmRes.vnc_status && (
                  <button
                    style={{
                      zIndex: "2",
                      position: "relative",
                      marginTop: "6%",
                      left: "55%",
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
                    onClick={() => VNC(monitorData.vm_id)}
                  >
                    {" "}
                    <img
                      src={"/vmc-monitor.png"}
                      alt={"/vmc-monitor.png"}
                      style={{
                        marginRight: "5px",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    Connect VNC
                  </button>
                )}
              </div>
              {changePass && (
                <div
                  style={{
                    marginBottom: "5rem",
                    position: "relative",
                    display: "flex",
                    flexWrap: "wrap",
                    zIndex: "1",
                  }}
                >
                  <div
                    style={{
                      width: "23rem",
                      marginTop: "5rem",
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid white",
                      borderRadius: "25px",
                      padding: "5px",
                      height: "50px",
                    }}
                  >
                    <input
                      type={showNewPass ? "text" : "password"}
                      id="Password"
                      className="input-signup"
                      name="Password"
                      placeholder="New Password"
                      value={newPass}
                      style={{
                        color: "white",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        flex: "1",
                        padding: "5px",
                        fontSize: "16px",
                      }}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                    {showNewPass ? (
                      <FaEyeSlash
                        onClick={() => setShowNewPass(false)}
                        style={{ color: "white", width: "20px" }}
                      />
                    ) : (
                      <FaEye
                        onClick={() => setShowNewPass(true)}
                        style={{ color: "white", width: "20px" }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      width: "23rem",
                      marginTop: "15px",
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid white",
                      borderRadius: "25px",
                      padding: "5px",
                      height: "50px",
                    }}
                  >
                    <input
                      type={showConfPass ? "text" : "password"}
                      id="Confirm Password"
                      className="input-signup"
                      name="Confirm Password"
                      placeholder="Confirm Password"
                      value={confPass}
                      style={{
                        color: "white",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        flex: "1",
                        padding: "5px",
                        fontSize: "16px",
                      }}
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
                  </div>
                  <div
                    className="log-in"
                    style={{
                      marginTop: "20px",
                      // marginLeft: "-8rem",
                      justifyContent: "center",
                    }}
                    onClick={() => UpdateMachinePass()}
                  >
                    <a className="media-link">
                      <div
                        className="media-banner"
                        style={{
                          width: "auto",
                          height: "50px",
                          // marginTop: "10px",
                          // marginLeft: "10rem",
                          left: "50%",
                        }}
                      >
                        <img
                          className="normal-banner"
                          src="/images/signup-btn-bg.png"
                          alt=""
                          style={{
                            marginTop: "-6px",
                            width: "10rem",
                            height: "4rem",
                          }}
                        />
                        <img
                          className="hover-img-banner"
                          src="/images/search-btn-hover.png"
                          alt="/images/search-btn-hover.png"
                          style={{
                            marginTop: "-6px",
                            width: "10rem",
                            height: "4rem",
                          }}
                        />
                        <span
                          className="login-text"
                          style={{
                            fontSize: "20px",
                            color: "#07528B",
                            marginTop: "0px",
                          }}
                        >
                          Submit
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {vmRes && vmRes.vnc_status && (
                <>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid white",
                      borderRadius: "25px",
                      padding: "5px",
                      height: "50px",
                    }}
                  >
                    <p
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: "14px",
                        paddingTop: "15px",
                        marginLeft: "20px",
                      }}
                    >
                      {" "}
                      VNC IP : {vmRes && vmRes.vnc_ip}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid white",
                      borderRadius: "25px",
                      padding: "5px",
                      height: "50px",
                    }}
                  >
                    <p
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: "14px",
                        paddingTop: "15px",
                        marginLeft: "20px",
                      }}
                    >
                      {" "}
                      VNC PORT : {vmRes && vmRes.vnc_port}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid white",
                      borderRadius: "25px",
                      padding: "5px",
                      height: "50px",
                    }}
                  >
                    <p
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: "14px",
                        paddingTop: "15px",
                        marginLeft: "20px",
                      }}
                    >
                      {" "}
                      VNC Password :{" "}
                      {vmRes && showVNCPass ? vmRes.vnc_pass : "••••••••"}
                    </p>
                    <div style={{ position: "absolute", right: "10%" }}>
                      {showVNCPass ? (
                        <FaEyeSlash
                          onClick={() => setShowVNCPass(false)}
                          style={{ color: "white", width: "20px" }}
                        />
                      ) : (
                        <FaEye
                          onClick={() => setShowVNCPass(true)}
                          style={{ color: "white", width: "20px" }}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Add Domain View */}
          {activeButton === "Add Domain" && (
            <div
              style={{
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                top: "1rem",
                marginLeft: "20px",
                width: "90%",
                height: "70%",
                // padding: "15px 25px",
                position: "relative",
                backgroundColor: "#07528b",
                borderRadius: "12px",
                // flexWrap: "wrap",
              }}
            >
              <div
                className="table-row-noti"
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              >
                <div>
                  <Row>
                    <div className="col-md-5" style={{ marginTop: "5px" }}>
                      <Row>
                        <div
                          style={{
                            marginLeft: "-10px",
                            display: "flex",
                            justifyContent: "center",
                            margin: "10px 0",
                            alignItems: "center",
                            height: "50px",
                            width: "90%",
                            zIndex: "9",
                            // position: "relative",
                            color: "white",
                          }}
                        >
                          <input
                            type="text"
                            id="Domain"
                            className="input-signup"
                            name="Domain"
                            placeholder="Domain Name"
                            value={domainName}
                            style={{
                              fontSize: "15px",
                              color: "white",
                              // border: "none",
                              border: "2px solid #ffff",
                              borderColor: "white",
                              borderRadius: "30px",
                              outline: "none",
                              width: "70%",
                              height: "50px",
                              background: "transparent",
                              flex: "1",
                              padding: "15px",
                            }}
                            onChange={(e) => setDomainName(e.target.value)}
                          />

                          {domainData && domainData.domain_status !== 0 && (
                            <div onClick={() => addDomain()}>
                              <a className="media-link">
                                <div
                                  className="media-banner"
                                  style={{
                                    width: "auto",
                                    height: "45px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // marginTop: "10px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  <img
                                    className="normal-banner"
                                    src="/images/signup-btn-bg.png"
                                    alt=""
                                    style={{
                                      marginTop: "0px",
                                      width: "5rem",
                                      height: "3rem",
                                    }}
                                  />
                                  <img
                                    className="hover-img-banner"
                                    src="/images/search-btn-hover.png"
                                    alt="/images/search-btn-hover.png"
                                    style={{
                                      marginTop: "0px",
                                      width: "5rem",
                                      height: "3rem",
                                    }}
                                  />
                                  <span
                                    className="login-text"
                                    style={{
                                      fontSize: "20px",
                                      color: "#07528B",
                                      marginTop: "0px",
                                    }}
                                  >
                                    Add
                                  </span>
                                </div>
                              </a>
                            </div>
                          )}
                        </div>
                      </Row>

                      <div
                        style={{
                          marginTop: "15px",
                          marginLeft: "5px",
                          textAlign: "left",
                          color: "white",
                          fontWeight: "500",
                          fontSize: "18px",
                        }}
                      >
                        ADD A Record in Your DNS :
                      </div>

                      {/* { Second Record} */}
                      <Row>
                        <div>
                          <div
                            style={{
                              // marginLeft: "15px",
                              marginTop: "15px",
                              display: "flex",
                              alignItems: "center",
                              // padding: "5px",
                              height: "50px",
                              // width: "60px",
                              zIndex: "9",
                              position: "relative",
                              color: "white",
                            }}
                          >
                            <p
                              style={{
                                color: "white",
                                textAlign: "center",
                                fontSize: "15px",
                                fontWeight: "500",
                                paddingTop: "15px",
                                // marginLeft: "20px",
                                width: "60px",
                                height: "50px",
                                border: "2px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              {" "}
                              A
                            </p>

                            <p
                              style={{
                                color: "white",
                                textAlign: "center",
                                fontSize: "15px",
                                fontWeight: "500",
                                width: "60px",
                                height: "50px",
                                paddingTop: "15px",
                                marginLeft: "5px",
                                border: "2px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              {" "}
                              @
                            </p>

                            <p
                              style={{
                                height: "50px",
                                width: "58%",
                                color: "white",
                                textAlign: "center",
                                fontSize: "18px",
                                fontWeight: "500",
                                paddingTop: "10px",
                                marginLeft: "5px",
                                border: "2px solid #ffff",
                                borderColor: "white",
                                borderRadius: "30px",
                              }}
                            >
                              {monitorData && monitorData.public_ip}
                            </p>
                          </div>
                        </div>

                        <div
                          style={{
                            marginTop: "10px",
                            marginLeft: "-15px",
                            textAlign: "center",
                            // left: "100%",
                          }}
                          onClick={() =>
                            validateDomain(
                              domainData.domain_name,
                              domainData.id
                            )
                          }
                        >
                          <a className="media-link">
                            <div
                              className="media-banner"
                              style={{
                                width: "auto",
                                height: "50px",
                                // marginTop: "10px",
                                // marginLeft: "1rem",
                              }}
                            >
                              <img
                                className="normal-banner"
                                src="/images/signup-btn-bg.png"
                                alt=""
                                style={{
                                  marginTop: "0px",
                                  width: "8rem",
                                  height: "3rem",
                                }}
                              />
                              <img
                                className="hover-img-banner"
                                src="/images/search-btn-hover.png"
                                alt="/images/search-btn-hover.png"
                                style={{
                                  marginTop: "0px",
                                  width: "8rem",
                                  height: "3rem",
                                }}
                              />
                              <span
                                className="login-text"
                                style={{
                                  fontSize: "20px",
                                  color: "#07528B",
                                  marginTop: "0px",
                                }}
                              >
                                Validate
                              </span>
                            </div>
                          </a>
                        </div>
                      </Row>
                    </div>

                    {/* Table */}
                    <div className="col-md-5" style={{ marginTop: "10px" }}>
                      <div
                        style={{
                          maxHeight: "240px",
                          width: "90%",
                          overflowY: "auto",
                          // overflowX: "hidden",
                        }}
                      >
                        {domainList &&
                        domainList
                          .reverse()
                          .filter(
                            (item) =>
                              item.domain_status === 1 && item.domain_name
                          ).length === 0 ? (
                          <div
                            style={{
                              // marginLeft: "50px",
                              marginTop: "20px",
                              border: "1px solid white",
                              padding: "10px",
                              backgroundColor: "transparent",
                              color: "white",
                              // width: "60%",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              fontSize: "16px",
                              fontWeight: "600",
                              textAlign: "center",
                            }}
                          >
                            No Domains Found
                          </div>
                        ) : (
                          <table
                            className="table"
                            style={{
                              borderCollapse: "collapse",
                              width: "100%",
                            }}
                          >
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    width: "50%",
                                    color: "white",
                                  }}
                                >
                                  Domain Name
                                </th>
                                <th
                                  colspan="2"
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    color: "white",
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {domainList &&
                                domainList
                                  .reverse()
                                  .filter(
                                    (item) =>
                                      item.domain_status === 1 &&
                                      item.domain_name
                                        .toLowerCase()
                                        .includes(searchText.toLowerCase())
                                  )
                                  .map((item, idx) => (
                                    <tr>
                                      <td
                                        className="domain-name"
                                        style={{
                                          border: "1px solid white",
                                          padding: "10px",
                                          backgroundColor: "transparent",
                                          color: "white",
                                          width: "60%",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                          fontSize: "15px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {item.domain_name}
                                      </td>
                                      <td
                                        style={{
                                          backgroundColor: "transparent",
                                          border: "1px solid white",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        {item.domain_status === 0 ? (
                                          <div
                                            style={{
                                              width: "auto",
                                              height: "30px",
                                              // marginTop: "10px",
                                              // marginLeft: "1rem",
                                            }}
                                          >
                                            <a
                                              onClick={() =>
                                                validateDomain(
                                                  item.domain_name,
                                                  item.id
                                                )
                                              }
                                              className="underline-text"
                                              style={{
                                                // marginTop: "10px",
                                                // marginLeft: "15px",
                                                fontSize: "15px",
                                                color: "white",
                                                fontWeight: "600",
                                              }}
                                              onMouseOver={(e) => (
                                                (e.target.style.fontWeight =
                                                  "800"),
                                                (e.target.style.fontSize =
                                                  "16px"),
                                                (e.target.style.textDecoration =
                                                  "underline")
                                              )}
                                              onMouseOut={(e) => (
                                                (e.target.style.fontWeight =
                                                  "600"),
                                                (e.target.style.fontSize =
                                                  "15px"),
                                                (e.target.style.textDecoration =
                                                  "none")
                                              )}
                                            >
                                              Verify
                                            </a>
                                          </div>
                                        ) : (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <img
                                              src="/images/verified_success.png"
                                              style={{
                                                height: "28px",
                                                width: "28px",
                                                zIndex: "9",
                                                position: "relative",
                                                marginTop: "-2px",
                                                //left: "1%",
                                              }}
                                            />
                                            <div
                                              style={{
                                                width: "auto",
                                                height: "30px",
                                                // marginTop: "10px",
                                                marginLeft: "5px",
                                              }}
                                            >
                                              <a
                                                onClick={() =>
                                                  validateDomain(
                                                    item.domain_name,
                                                    item.id
                                                  )
                                                }
                                                className="underline-text"
                                                style={{
                                                  // marginTop: "10px",
                                                  // marginLeft: "15px",
                                                  fontSize: "15px",
                                                  color: "white",
                                                  fontWeight: "600",
                                                }}
                                                onMouseOver={(e) => (
                                                  (e.target.style.fontWeight =
                                                    "800"),
                                                  (e.target.style.fontSize =
                                                    "16px"),
                                                  (e.target.style.textDecoration =
                                                    "underline")
                                                )}
                                                onMouseOut={(e) => (
                                                  (e.target.style.fontWeight =
                                                    "600"),
                                                  (e.target.style.fontSize =
                                                    "15px"),
                                                  (e.target.style.textDecoration =
                                                    "none")
                                                )}
                                              >
                                                ReVerify
                                              </a>
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                      <td
                                        style={{
                                          backgroundColor: "transparent",
                                          border: "1px solid white",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "auto",
                                            height: "30px",
                                            // marginTop: "10px",
                                            // marginLeft: "1rem",
                                          }}
                                        >
                                          <a
                                            onClick={() => SetDeletePopup(true)}
                                            className="underline-text"
                                            style={{
                                              // marginTop: "10px",
                                              // marginLeft: "15px",
                                              fontSize: "15px",
                                              color: "white",
                                              fontWeight: "600",
                                            }}
                                            onMouseOver={(e) => (
                                              (e.target.style.fontWeight =
                                                "800"),
                                              (e.target.style.fontSize =
                                                "16px"),
                                              (e.target.style.textDecoration =
                                                "underline")
                                            )}
                                            onMouseOut={(e) => (
                                              (e.target.style.fontWeight =
                                                "600"),
                                              (e.target.style.fontSize =
                                                "15px"),
                                              (e.target.style.textDecoration =
                                                "none")
                                            )}
                                          >
                                            Remove
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                              {/* Add more rows as needed */}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
          )}

          {/* SSL */}
          {activeButton === "SSL" && (
            <div
              style={{
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                top: "1rem",
                marginLeft: "20px",
                width: "90%",
                height: "35%",
                // padding: "15px 25px",
                position: "relative",
                backgroundColor: "#07528b",
                borderRadius: "12px",
                // flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  maxHeight: "240px",
                  overflowY: "auto",
                  // overflowX: "hidden",
                }}
              >
                {" "}
                {domainList &&
                domainList
                  .reverse()
                  .filter(
                    (item) => item.domain_status === 1 && item.domain_name
                  ).length === 0 ? (
                  <div
                    style={{
                      border: "1px solid white",
                      padding: "10px",
                      backgroundColor: "transparent",
                      color: "white",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      fontSize: "16px",
                      fontWeight: "600",
                      height: "240px",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    No Domains Found
                  </div>
                ) : (
                  <table
                    className="table"
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid white",
                            padding: "8px",
                            backgroundColor: "transparent",
                            width: "50%",
                            color: "white",
                          }}
                        >
                          Domain Name
                        </th>
                        <th
                          colspan="2"
                          style={{
                            border: "1px solid white",
                            padding: "8px",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {domainList &&
                        domainList
                          .reverse()
                          .filter(
                            (item) =>
                              item.domain_status === 1 &&
                              item.domain_name
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                          )
                          .map((item, idx) => (
                            <tr>
                              <td
                                className="domain-name"
                                style={{
                                  border: "1px solid white",
                                  padding: "10px",
                                  backgroundColor: "transparent",
                                  color: "white",
                                  fontWeight: "600",
                                }}
                              >
                                {item.domain_name}
                              </td>
                              <td
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid white",
                                  paddingTop: "10px",
                                }}
                              >
                                {item.ssl_status === 0 ? (
                                  <div
                                    style={{
                                      width: "auto",
                                      height: "50px",
                                      textAlign: "left",
                                      // marginTop: "10px",
                                      // marginLeft: "1rem",
                                    }}
                                    onClick={() =>
                                      domainSSL(item.domain_name, item.id)
                                    }
                                  >
                                    <a
                                      className="underline-text"
                                      style={{
                                        // marginTop: "10px",
                                        marginLeft: "15px",
                                        fontSize: "15px",
                                        color: "white",
                                        fontWeight: "600",
                                      }}
                                      onMouseOver={(e) => (
                                        (e.target.style.fontWeight = "800"),
                                        (e.target.style.fontSize = "16px"),
                                        (e.target.style.textDecoration =
                                          "underline")
                                      )}
                                      onMouseOut={(e) => (
                                        (e.target.style.fontWeight = "600"),
                                        (e.target.style.fontSize = "15px"),
                                        (e.target.style.textDecoration = "none")
                                      )}
                                    >
                                      {/* SSL Redirect */}
                                      Auto SSL
                                    </a>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      width: "auto",
                                      height: "30px",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src="/images/verified_success.png"
                                      style={{
                                        height: "28px",
                                        width: "28px",
                                        zIndex: "9",
                                        position: "relative",
                                        marginTop: "-2px",
                                        //left: "1%",
                                      }}
                                    />
                                    <div
                                      style={{
                                        width: "auto",
                                        height: "30px",
                                        // marginTop: "10px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <a
                                        onClick={() =>
                                          validateDomain(
                                            item.domain_name,
                                            item.id
                                          )
                                        }
                                        className="underline-text"
                                        style={{
                                          // marginTop: "10px",
                                          // marginLeft: "15px",
                                          fontSize: "15px",
                                          color: "white",
                                          fontWeight: "600",
                                        }}
                                        onMouseOver={(e) => (
                                          (e.target.style.fontWeight = "800"),
                                          (e.target.style.fontSize = "16px"),
                                          (e.target.style.textDecoration =
                                            "underline")
                                        )}
                                        onMouseOut={(e) => (
                                          (e.target.style.fontWeight = "600"),
                                          (e.target.style.fontSize = "15px"),
                                          (e.target.style.textDecoration =
                                            "none")
                                        )}
                                      >
                                        Verified
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </td>
                              {/* <td
                                              style={{
                                                backgroundColor: "transparent",
                                                border: "1px solid white",
                                                paddingTop: "10px",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  width: "auto",
                                                  height: "30px",
                                                  // marginTop: "10px",
                                                  // marginLeft: "1rem",
                                                }}
                                              >
                                                <a
                                                  onClick={() => {
                                                    setSelectDomainNameForDelete(
                                                      item.domain_name
                                                    );
                                                    setSelectDomainIdForDelete(
                                                      item.id
                                                    );
                                                    SetDeletePopup(true);
                                                  }}
                                                  className="underline-text"
                                                  style={{
                                                    // marginTop: "10px",
                                                    // marginLeft: "15px",
                                                    fontSize: "15px",
                                                    color: "white",
                                                    fontWeight: "600",
                                                  }}
                                                  onMouseOver={(e) => (
                                                    (e.target.style.fontWeight =
                                                      "800"),
                                                    (e.target.style.fontSize =
                                                      "16px"),
                                                    (e.target.style.textDecoration =
                                                      "underline")
                                                  )}
                                                  onMouseOut={(e) => (
                                                    (e.target.style.fontWeight =
                                                      "600"),
                                                    (e.target.style.fontSize =
                                                      "15px"),
                                                    (e.target.style.textDecoration =
                                                      "none")
                                                  )}
                                                >
                                                  Remove
                                                </a>
                                              </div>
                                            </td> */}
                              <td
                                className="domain-name"
                                style={{
                                  border: "1px solid white",
                                  padding: "10px",
                                  backgroundColor: "transparent",
                                  color: "white",
                                  fontWeight: "600",
                                }}
                              >
                                <a
                                  className="underline-text"
                                  style={{
                                    // marginTop: "10px",
                                    marginLeft: "15px",
                                    fontSize: "15px",
                                    color: "white",
                                    fontWeight: "600",
                                  }}
                                  onMouseOver={(e) => (
                                    (e.target.style.fontWeight = "800"),
                                    (e.target.style.fontSize = "16px"),
                                    (e.target.style.textDecoration =
                                      "underline")
                                  )}
                                  onMouseOut={(e) => (
                                    (e.target.style.fontWeight = "600"),
                                    (e.target.style.fontSize = "15px"),
                                    (e.target.style.textDecoration = "none")
                                  )}
                                  onClick={() => {
                                    SetCustomSSLPopup(true);
                                    setSelectedDomain(item.domain_name);
                                    setSelectedDomainId(item.id);
                                  }}
                                >
                                  Custom SSL
                                </a>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeButton === "HTTPS Redirect" && (
            <div
              style={{
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                top: "1rem",
                width: "90%",
                height: "35%",
                marginLeft: "20px",
                marginBottom: "20px",
                // padding: "20px 25px",
                position: "relative",
                backgroundColor: "#07528b", // Use backgroundColor instead of background
                borderRadius: "12px",
                // flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  maxHeight: "240px",
                  overflowY: "auto",
                  // overflowX: "hidden",
                }}
              >
                {domainList &&
                domainList
                  .reverse()
                  .filter(
                    (item) => item.domain_status === 1 && item.domain_name
                  ).length === 0 ? (
                  <div
                    style={{
                      border: "1px solid white",
                      padding: "10px",
                      backgroundColor: "transparent",
                      color: "white",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      fontSize: "16px",
                      fontWeight: "600",
                      height: "240px",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    No Domains Found
                  </div>
                ) : (
                  <table
                    className="table"
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid white",
                            padding: "8px",
                            backgroundColor: "transparent",
                            width: "50%",
                            color: "white",
                          }}
                        >
                          Domain Name
                        </th>
                        <th
                          colspan="2"
                          style={{
                            border: "1px solid white",
                            padding: "8px",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {domainList &&
                        domainList
                          .reverse()
                          .filter(
                            (item) =>
                              item.domain_status === 1 &&
                              item.domain_name
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                          )
                          .map((item, idx) => (
                            <tr>
                              <td
                                className="domain-name"
                                style={{
                                  border: "1px solid white",
                                  padding: "10px",
                                  backgroundColor: "transparent",
                                  color: "white",
                                  fontWeight: "600",
                                }}
                              >
                                {item.domain_name}
                              </td>
                              <td
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid white",
                                  paddingTop: "10px",
                                }}
                              >
                                {item.redirect_status !== 1 ? (
                                  <div
                                    style={{
                                      width: "auto",
                                      height: "30px",
                                      // marginTop: "10px",
                                      // marginLeft: "1rem",
                                    }}
                                    onClick={() =>
                                      redirectDomain(item.domain_name, item.id)
                                    }
                                  >
                                    <a
                                      className="underline-text"
                                      style={{
                                        // marginTop: "10px",
                                        marginLeft: "15px",
                                        fontSize: "15px",
                                        color: "white",
                                        fontWeight: "600",
                                      }}
                                      onMouseOver={(e) => (
                                        (e.target.style.fontWeight = "800"),
                                        (e.target.style.fontSize = "16px"),
                                        (e.target.style.textDecoration =
                                          "underline")
                                      )}
                                      onMouseOut={(e) => (
                                        (e.target.style.fontWeight = "600"),
                                        (e.target.style.fontSize = "15px"),
                                        (e.target.style.textDecoration = "none")
                                      )}
                                    >
                                      Enable HTTPS Redirect
                                    </a>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src="/images/verified_success.png"
                                      style={{
                                        height: "28px",
                                        width: "28px",
                                        zIndex: "9",
                                        position: "relative",
                                        marginTop: "-2px",
                                        //left: "1%",
                                      }}
                                    />
                                    <div
                                      style={{
                                        width: "auto",
                                        height: "30px",
                                        // marginTop: "10px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <a
                                        onClick={() =>
                                          redirectDomain(
                                            item.domain_name,
                                            item.id
                                          )
                                        }
                                        className="underline-text"
                                        style={{
                                          // marginTop: "10px",
                                          // marginLeft: "15px",
                                          fontSize: "15px",
                                          color: "white",
                                          fontWeight: "600",
                                        }}
                                        onMouseOver={(e) => (
                                          (e.target.style.fontWeight = "800"),
                                          (e.target.style.fontSize = "16px"),
                                          (e.target.style.textDecoration =
                                            "underline")
                                        )}
                                        onMouseOut={(e) => (
                                          (e.target.style.fontWeight = "600"),
                                          (e.target.style.fontSize = "15px"),
                                          (e.target.style.textDecoration =
                                            "none")
                                        )}
                                      >
                                        ReVerify
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td
                                style={{
                                  backgroundColor: "transparent",
                                  border: "1px solid white",
                                  paddingTop: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "auto",
                                    height: "30px",
                                    // marginTop: "10px",
                                    // marginLeft: "1rem",
                                  }}
                                >
                                  <a
                                    onClick={() => {
                                      setSelectDomainNameForDelete(
                                        item.domain_name
                                      );
                                      setSelectDomainIdForDelete(item.id);
                                      SetDeletePopup(true);
                                    }}
                                    className="underline-text"
                                    style={{
                                      // marginTop: "10px",
                                      // marginLeft: "15px",
                                      fontSize: "15px",
                                      color: "white",
                                      fontWeight: "600",
                                    }}
                                    onMouseOver={(e) => (
                                      (e.target.style.fontWeight = "800"),
                                      (e.target.style.fontSize = "16px"),
                                      (e.target.style.textDecoration =
                                        "underline")
                                    )}
                                    onMouseOut={(e) => (
                                      (e.target.style.fontWeight = "600"),
                                      (e.target.style.fontSize = "15px"),
                                      (e.target.style.textDecoration = "none")
                                    )}
                                  >
                                    Remove
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeButton === "Generate URL" && (
            <div
              style={{
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                // top: "0rem",
                marginTop: "28px",
                marginLeft: "20px",
                width: "90%",
                height: "80%",
                // padding: "25px 25px",
                position: "relative",
                backgroundColor: "#07528b", // Use backgroundColor instead of background
                borderRadius: "12px",
                // flexWrap: "wrap",
              }}
            >
              <div
                className="table-row-noti"
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  marginLeft: "0px",
                }}
              >
                <div className="message" style={{ width: "100%" }}>
                  <Row>
                    <div className="col-md-5" style={{ textAlign: "center" }}>
                      <div
                        className="btn"
                        style={{
                          background: "white",
                          color: "#035189",
                          height: "35px",
                          fontSize: "18px",
                          marginTop: "10px",
                        }}
                      >
                        Product Table
                      </div>
                      <div
                        style={{
                          maxHeight: "150px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          marginTop: "20px",
                        }}
                      >
                        {portList && portList.reverse().length === 0 ? (
                          <div
                            style={{
                              marginLeft: "50px",
                              border: "1px solid white",
                              padding: "10px",
                              backgroundColor: "transparent",
                              color: "white",
                              // width: "60%",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            No Port Found
                          </div>
                        ) : (
                          <table
                            className="table"
                            style={{
                              borderCollapse: "collapse",
                              width: "100%",
                            }}
                          >
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    width: "20%",
                                    color: "white",
                                  }}
                                >
                                  Product Tag
                                </th>
                                <th
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    // width: "75%",
                                    color: "white",
                                  }}
                                >
                                  Port Number
                                </th>
                                <th
                                  colspan="2"
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    width: "20%",
                                    backgroundColor: "transparent",
                                    color: "white",
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {portList &&
                                portList
                                  .reverse()
                                  .filter((item) =>
                                    item.port
                                      .toLowerCase()
                                      .includes(searchText.toLowerCase())
                                  )
                                  .map((item, idx) => (
                                    <tr>
                                      <td
                                        className="domain-name"
                                        style={{
                                          border: "1px solid white",
                                          padding: "10px",
                                          backgroundColor: "transparent",
                                          color: "white",
                                          // width: "10%",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                          fontSize: "15px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <img
                                          src={portList && item.port_icon}
                                          style={{
                                            height: "24px",
                                            width: "72px",
                                            zIndex: "9",
                                            position: "relative",
                                            paddingTop: "5px",
                                            //left: "1%",
                                          }}
                                        />
                                      </td>
                                      <td
                                        className="domain-name"
                                        style={{
                                          border: "1px solid white",
                                          padding: "10px",
                                          backgroundColor: "transparent",
                                          color: "white",
                                          // width: "80%",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                          fontSize: "12px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {item.port}
                                      </td>

                                      <td
                                        style={{
                                          backgroundColor: "transparent",
                                          border: "1px solid white",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "auto",
                                            height: "30px",
                                            // marginTop: "10px",
                                            // marginLeft: "1rem",
                                          }}
                                          onClick={() => {
                                            generatePortURL(
                                              item.port_name,
                                              item.port,
                                              item.id
                                            );
                                          }}
                                        >
                                          <a
                                            className="underline-text"
                                            style={{
                                              // marginTop: "10px",
                                              // marginLeft: "15px",
                                              fontSize: "12px",
                                              color: "white",
                                              fontWeight: "600",
                                            }}
                                            onMouseOver={(e) => (
                                              (e.target.style.fontWeight =
                                                "800"),
                                              (e.target.style.fontSize =
                                                "13px"),
                                              (e.target.style.textDecoration =
                                                "underline")
                                            )}
                                            onMouseOut={(e) => (
                                              (e.target.style.fontWeight =
                                                "600"),
                                              (e.target.style.fontSize =
                                                "12px"),
                                              (e.target.style.textDecoration =
                                                "none")
                                            )}
                                          >
                                            Generate
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                      {smuser && smuser.custom_port === 0 ? (
                        <div
                          className="btn"
                          style={{
                            background: "white",
                            color: "#035189",
                            height: "35px",
                            fontSize: "18px",
                          }}
                          onClick={() => {
                            setCustomSupportPopup(true);
                          }}
                        >
                          Request Custom Port
                        </div>
                      ) : (
                        <table
                          className="table"
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            marginTop: "15px",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "26%",
                                  color: "white",
                                  textAlign: "left",
                                }}
                              >
                                <input
                                  type="text"
                                  id="Domain"
                                  className="input-signup"
                                  name="Domain"
                                  placeholder="Custom Tag"
                                  value={customProductTagText}
                                  style={{
                                    fontSize: "14px",
                                    //   color: "white",
                                    //   // border: "none",
                                    //   // border: "2px solid #ffff",
                                    //   // borderColor: "white",
                                    //   // borderRadius: "30px",
                                    //   // outline: "none",
                                    width: "100%",
                                    height: "20px",
                                    //   background: "transparent",
                                    //   flex: "1",
                                    //   padding: "15px",
                                  }}
                                  onChange={(e) =>
                                    setCustomProductTag(e.target.value)
                                  }
                                />
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "53%",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              >
                                <input
                                  type="text"
                                  id="Domain"
                                  className="input-signup"
                                  name="Domain"
                                  placeholder="Custom Port Number"
                                  value={customPortNumberText}
                                  style={{
                                    fontSize: "14px",
                                    textAlign: "center",
                                    //   color: "white",
                                    //   // border: "none",
                                    //   // border: "2px solid #ffff",
                                    //   // borderColor: "white",
                                    //   // borderRadius: "30px",
                                    //   // outline: "none",
                                    width: "100%",
                                    height: "20px",
                                    //   background: "transparent",
                                    //   flex: "1",
                                    //   padding: "15px",
                                  }}
                                  onChange={(e) =>
                                    setCustomPortNumber(e.target.value)
                                  }
                                />
                              </th>
                              <th
                                colspan="2"
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  width: "20%",
                                  backgroundColor: "transparent",
                                  color: "white",
                                }}
                              >
                                <div
                                  style={{
                                    paddingTop: "5px",
                                    width: "auto",
                                    height: "30px",
                                    // marginTop: "10px",
                                    // marginLeft: "1rem",
                                  }}
                                  onClick={() => {
                                    otherPortURL();
                                  }}
                                >
                                  <a
                                    className="underline-text"
                                    style={{
                                      // marginTop: "10px",
                                      // marginLeft: "15px",
                                      fontSize: "12px",
                                      color: "white",
                                      fontWeight: "600",
                                    }}
                                    onMouseOver={(e) => (
                                      (e.target.style.fontWeight = "800"),
                                      (e.target.style.fontSize = "13px"),
                                      (e.target.style.textDecoration =
                                        "underline")
                                    )}
                                    onMouseOut={(e) => (
                                      (e.target.style.fontWeight = "600"),
                                      (e.target.style.fontSize = "12px"),
                                      (e.target.style.textDecoration = "none")
                                    )}
                                  >
                                    Generate
                                  </a>
                                </div>
                              </th>
                            </tr>
                          </thead>
                        </table>
                      )}
                    </div>

                    {/* Table */}
                    <div
                      className="col-md-7"
                      style={{ textAlign: "center", width: "98%" }}
                    >
                      <div
                        className="btn"
                        style={{
                          background: "white",
                          color: "#035189",
                          height: "35px",
                          fontSize: "18px",
                        }}
                      >
                        URL Table
                      </div>
                      <div
                        style={{
                          maxHeight: "190px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          marginTop: "20px",
                        }}
                      >
                        {urlPortList &&
                        urlPortList.reverse().filter((item) => item.domain_name)
                          .length === 0 ? (
                          <div
                            style={{
                              // marginLeft: "50px",
                              border: "1px solid white",
                              padding: "10px",
                              backgroundColor: "transparent",
                              color: "white",
                              // width: "60%",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            No URL Found
                          </div>
                        ) : (
                          <table
                            className="table"
                            style={{
                              borderCollapse: "collapse",
                              width: "150%",
                            }}
                          >
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    width: "20%",
                                    color: "white",
                                  }}
                                >
                                  Product Tag
                                </th>
                                <th
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    // width: "20%",
                                    color: "white",
                                  }}
                                >
                                  Port URL
                                </th>
                                <th
                                  colspan="2"
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    width: "20%",
                                    backgroundColor: "transparent",
                                    color: "white",
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {urlPortList &&
                                urlPortList
                                  .reverse()
                                  .filter((item) =>
                                    item.url
                                      .toLowerCase()
                                      .includes(searchText.toLowerCase())
                                  )
                                  .map((item, idx) => (
                                    <tr>
                                      <td
                                        style={{
                                          backgroundColor: "transparent",
                                          border: "1px solid white",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "auto",
                                            height: "30px",
                                            // marginTop: "10px",
                                            // marginLeft: "1rem",
                                          }}
                                          onClick={() => {
                                            renamePort(item.port_name, item.id);
                                          }}
                                        >
                                          <a
                                            className="underline-text"
                                            style={{
                                              // marginTop: "10px",
                                              // marginLeft: "15px",
                                              fontSize: "15px",
                                              color: "white",
                                              fontWeight: "600",
                                            }}
                                            onMouseOver={(e) => (
                                              (e.target.style.fontWeight =
                                                "800"),
                                              (e.target.style.fontSize =
                                                "16px"),
                                              (e.target.style.textDecoration =
                                                "underline")
                                            )}
                                            onMouseOut={(e) => (
                                              (e.target.style.fontWeight =
                                                "600"),
                                              (e.target.style.fontSize =
                                                "15px"),
                                              (e.target.style.textDecoration =
                                                "none")
                                            )}
                                          >
                                            Rename
                                          </a>
                                        </div>
                                      </td>
                                      <td
                                        className="domain-name"
                                        style={{
                                          border: "1px solid white",
                                          padding: "10px",
                                          backgroundColor: "transparent",
                                          color: "white",
                                          // width: "60%",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                          fontSize: "15px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {item.domain_name}
                                      </td>

                                      <td
                                        style={{
                                          backgroundColor: "transparent",
                                          border: "1px solid white",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "auto",
                                            height: "30px",
                                            // marginTop: "10px",
                                            // marginLeft: "1rem",
                                          }}
                                          onClick={() => {
                                            removePort(item.id);
                                          }}
                                        >
                                          <a
                                            className="underline-text"
                                            style={{
                                              // marginTop: "10px",
                                              // marginLeft: "15px",
                                              fontSize: "15px",
                                              color: "white",
                                              fontWeight: "600",
                                            }}
                                            onMouseOver={(e) => (
                                              (e.target.style.fontWeight =
                                                "800"),
                                              (e.target.style.fontSize =
                                                "16px"),
                                              (e.target.style.textDecoration =
                                                "underline")
                                            )}
                                            onMouseOut={(e) => (
                                              (e.target.style.fontWeight =
                                                "600"),
                                              (e.target.style.fontSize =
                                                "15px"),
                                              (e.target.style.textDecoration =
                                                "none")
                                            )}
                                          >
                                            Remove
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
          )}

          {/* BackUpView */}
          {isShowBackupView && (
            <div
              style={{
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                // top: "0rem",
                marginTop: "28px",
                width: "90%",
                marginLeft: "20px",
                height: "35%",
                // padding: "25px 25px",
                position: "relative",
                backgroundColor: "#07528b", // Use backgroundColor instead of background
                borderRadius: "12px",
                // flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  maxHeight: "240px",
                  overflowY: "auto",
                  textAlign: "center",
                  // overflowX: "hidden",
                  marginTop: "20px",
                }}
              >
                {vmBackUpList && Object.entries(vmBackUpList).length === 0 ? (
                  <div
                    style={{
                      // marginLeft: "50px",
                      border: "1px solid white",
                      padding: "10px",
                      backgroundColor: "transparent",
                      color: "white",
                      // width: "60%",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      fontSize: "16px",
                      fontWeight: "600",
                      marginTop: "15px",
                      width: "95%",
                      marginLeft: "10px",
                    }}
                  >
                    No BackUp Found
                  </div>
                ) : (
                  <table
                    className="table"
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid white",
                            padding: "8px",
                            backgroundColor: "transparent",
                            width: "50%",
                            color: "white",
                          }}
                        >
                          BackUp
                        </th>
                        <th
                          colspan="2"
                          style={{
                            border: "1px solid white",
                            padding: "8px",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vmBackUpList &&
                        Object.entries(vmBackUpList).length > 0 &&
                        Object.entries(vmBackUpList).map(([key, item], idx) => (
                          <tr>
                            <td
                              className="domain-name"
                              style={{
                                border: "1px solid white",
                                padding: "10px",
                                backgroundColor: "transparent",
                                color: "white",
                              }}
                            >
                              {item.backup_name}
                            </td>

                            <td
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid white",
                                paddingTop: "10px",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex", // Use flexbox for centering
                                  justifyContent: "center", // Center horizontally
                                  alignItems: "center", // Center vertically
                                  width: "85px",
                                  height: "30px",
                                  backgroundColor: "white",
                                  borderRadius: "6px",
                                  marginLeft: "25%",
                                  // marginTop: "10px",
                                  // marginLeft: "1rem",
                                }}
                              >
                                <a
                                  onClick={() => SetVMRestorePopup(true)}
                                  className="underline-text"
                                  style={{
                                    // marginTop: "10px",
                                    // marginLeft: "15px",
                                    fontSize: "15px",
                                    color: "#035189",
                                    fontWeight: "600",
                                    display: "flex", // Ensure link content is centered
                                    justifyContent: "center", // Center text horizontally within the button
                                    alignItems: "center", // Center text vertically within the button
                                    height: "100%", // Take up full height of the parent div
                                    width: "100%", // Take up full width of the parent div
                                    textAlign: "center",
                                  }}
                                  onMouseOver={(e) => (
                                    (e.target.style.fontWeight = "800"),
                                    (e.target.style.fontSize = "16px"),
                                    (e.target.style.textDecoration =
                                      "underline")
                                  )}
                                  onMouseOut={(e) => (
                                    (e.target.style.fontWeight = "600"),
                                    (e.target.style.fontSize = "15px"),
                                    (e.target.style.textDecoration = "none")
                                  )}
                                >
                                  Restore
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                {/* <table
                  className="table"
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid white",
                          padding: "8px",
                          backgroundColor: "transparent",
                          width: "50%",
                          color: "white",
                        }}
                      >
                        BackUp
                      </th>
                      <th
                        colspan="2"
                        style={{
                          border: "1px solid white",
                          padding: "8px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        BackUp 123132
                      </td>

                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid white",
                          paddingTop: "10px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "flex", // Use flexbox for centering
                            justifyContent: "center", // Center horizontally
                            alignItems: "center", // Center vertically
                            width: "85px",
                            height: "30px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            marginLeft: "25%",
                            // marginTop: "10px",
                            // marginLeft: "1rem",
                          }}
                        >
                          <a
                            onClick={() => SetVMRestorePopup(true)}
                            className="underline-text"
                            style={{
                              // marginTop: "10px",
                              // marginLeft: "15px",
                              fontSize: "15px",
                              color: "#035189",
                              fontWeight: "600",
                              display: "flex", // Ensure link content is centered
                              justifyContent: "center", // Center text horizontally within the button
                              alignItems: "center", // Center text vertically within the button
                              height: "100%", // Take up full height of the parent div
                              width: "100%", // Take up full width of the parent div
                              textAlign: "center",
                            }}
                            onMouseOver={(e) => (
                              (e.target.style.fontWeight = "800"),
                              (e.target.style.fontSize = "16px"),
                              (e.target.style.textDecoration = "underline")
                            )}
                            onMouseOut={(e) => (
                              (e.target.style.fontWeight = "600"),
                              (e.target.style.fontSize = "15px"),
                              (e.target.style.textDecoration = "none")
                            )}
                          >
                            Restore
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
          )}

          {/* VM List View */}
          {isShowVMView && (
            <div
              style={{
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                // top: "0rem",
                marginTop: "28px",
                marginLeft: "20px",
                width: "90%",
                height: "38%",
                // padding: "25px 25px",
                position: "relative",
                backgroundColor: "#07528b", // Use backgroundColor instead of background
                borderRadius: "12px",
                // flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  maxHeight: "255px",
                  overflowY: "auto",
                  // overflowX: "hidden",
                }}
              >
                <table
                  className="table"
                  style={{
                    borderCollapse: "collapse",
                    width: "250%",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid white",
                          padding: "8px",
                          backgroundColor: "transparent",
                          width: "20%",
                          color: "white",
                        }}
                      >
                        VM Name
                      </th>
                      <th
                        style={{
                          border: "1px solid white",
                          padding: "8px",
                          backgroundColor: "transparent",
                          width: "10%",
                          color: "white",
                        }}
                      >
                        Public IP
                      </th>
                      <th
                        style={{
                          border: "1px solid white",
                          padding: "8px",
                          backgroundColor: "transparent",
                          width: "10%",
                          color: "white",
                        }}
                      >
                        Private IP
                      </th>
                      <th
                        colspan="2"
                        style={{
                          border: "1px solid white",
                          padding: "8px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        asddfasd 123132
                      </td>

                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid white",
                          paddingTop: "10px",
                        }}
                      >
                        {/* <div
                                  style={{
                                    width: "auto",
                                    height: "30px",
                                    // marginTop: "10px",
                                    // marginLeft: "1rem",
                                  }}
                                >
                                  <a
                                    onClick={() => ""}
                                    className="underline-text"
                                    style={{
                                      // marginTop: "10px",
                                      // marginLeft: "15px",
                                      fontSize: "15px",
                                      color: "white",
                                      fontWeight: "600",
                                    }}
                                    onMouseOver={(e) => (
                                      (e.target.style.fontWeight = "800"),
                                      (e.target.style.fontSize = "16px"),
                                      (e.target.style.textDecoration =
                                        "underline")
                                    )}
                                    onMouseOut={(e) => (
                                      (e.target.style.fontWeight = "600"),
                                      (e.target.style.fontSize = "15px"),
                                      (e.target.style.textDecoration = "none")
                                    )}
                                  >
                                    Restore
                                  </a>
                                </div> */}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px", // Adds space between progress bar and percentage
                          }}
                        >
                          <div
                            style={{
                              width: "95%",
                              height: "35px",
                              backgroundColor: "transparent",
                              borderRadius: "10px",
                              border: "3px solid white",
                              overflow: "hidden",
                              position: "relative", // Needed to position inner bar
                            }}
                          >
                            <div
                              style={{
                                // width: `${progress}%`,
                                width: `50%`,
                                height: "100%",
                                backgroundColor: "#EF6C35",
                                // borderRadius: "10px",
                                transition: "width 0.1s ease-in-out", // Smooth transition effect
                              }}
                            ></div>
                          </div>
                          <span
                            style={{
                              fontSize: "18px",
                              height: "35px",
                              width: "60px",
                              alignContent: "center",
                              fontWeight: "bold",
                              color: "white",
                              // backgroundColor: "#035189",
                              borderRadius: "10px",
                              border: "2px solid #fff",
                            }}
                          >
                            {/* {progress}% */}
                            50%
                          </span>
                        </div>
                      </td>
                    </tr>
                    {/* Add more rows as needed */}
                    <tr>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        asddfasd 123132
                      </td>

                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid white",
                          paddingTop: "10px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "flex", // Use flexbox for centering
                            justifyContent: "center", // Center horizontally
                            alignItems: "center", // Center vertically
                            width: "85px",
                            height: "30px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            marginLeft: "45%",
                            // marginTop: "10px",
                            // marginLeft: "1rem",
                          }}
                        >
                          <a
                            onClick={() => ""}
                            className="underline-text"
                            style={{
                              // marginTop: "10px",
                              // marginLeft: "15px",
                              fontSize: "15px",
                              color: "#035189",
                              fontWeight: "600",
                              display: "flex", // Ensure link content is centered
                              justifyContent: "center", // Center text horizontally within the button
                              alignItems: "center", // Center text vertically within the button
                              height: "100%", // Take up full height of the parent div
                              width: "100%", // Take up full width of the parent div
                              textAlign: "center",
                            }}
                            onMouseOver={(e) => (
                              (e.target.style.fontWeight = "800"),
                              (e.target.style.fontSize = "16px"),
                              (e.target.style.textDecoration = "underline")
                            )}
                            onMouseOut={(e) => (
                              (e.target.style.fontWeight = "600"),
                              (e.target.style.fontSize = "15px"),
                              (e.target.style.textDecoration = "none")
                            )}
                          >
                            Restore
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        asddfasd 123132
                      </td>

                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid white",
                          paddingTop: "10px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "flex", // Use flexbox for centering
                            justifyContent: "center", // Center horizontally
                            alignItems: "center", // Center vertically
                            width: "85px",
                            height: "30px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            marginLeft: "45%",
                            // marginTop: "10px",
                            // marginLeft: "1rem",
                          }}
                        >
                          <a
                            onClick={() => ""}
                            className="underline-text"
                            style={{
                              // marginTop: "10px",
                              // marginLeft: "15px",
                              fontSize: "15px",
                              color: "#035189",
                              fontWeight: "600",
                              display: "flex", // Ensure link content is centered
                              justifyContent: "center", // Center text horizontally within the button
                              alignItems: "center", // Center text vertically within the button
                              height: "100%", // Take up full height of the parent div
                              width: "100%", // Take up full width of the parent div
                              textAlign: "center",
                            }}
                            onMouseOver={(e) => (
                              (e.target.style.fontWeight = "800"),
                              (e.target.style.fontSize = "16px"),
                              (e.target.style.textDecoration = "underline")
                            )}
                            onMouseOut={(e) => (
                              (e.target.style.fontWeight = "600"),
                              (e.target.style.fontSize = "15px"),
                              (e.target.style.textDecoration = "none")
                            )}
                          >
                            Restore
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        asddfasd 123132
                      </td>

                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid white",
                          paddingTop: "10px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "flex", // Use flexbox for centering
                            justifyContent: "center", // Center horizontally
                            alignItems: "center", // Center vertically
                            width: "85px",
                            height: "30px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            marginLeft: "45%",
                            // marginTop: "10px",
                            // marginLeft: "1rem",
                          }}
                        >
                          <a
                            onClick={() => ""}
                            className="underline-text"
                            style={{
                              // marginTop: "10px",
                              // marginLeft: "15px",
                              fontSize: "15px",
                              color: "#035189",
                              fontWeight: "600",
                              display: "flex", // Ensure link content is centered
                              justifyContent: "center", // Center text horizontally within the button
                              alignItems: "center", // Center text vertically within the button
                              height: "100%", // Take up full height of the parent div
                              width: "100%", // Take up full width of the parent div
                              textAlign: "center",
                            }}
                            onMouseOver={(e) => (
                              (e.target.style.fontWeight = "800"),
                              (e.target.style.fontSize = "16px"),
                              (e.target.style.textDecoration = "underline")
                            )}
                            onMouseOut={(e) => (
                              (e.target.style.fontWeight = "600"),
                              (e.target.style.fontSize = "15px"),
                              (e.target.style.textDecoration = "none")
                            )}
                          >
                            Restore
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        asddfasd 123132
                      </td>

                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        className="domain-name"
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        123.132.23.144
                      </td>
                      <td
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid white",
                          paddingTop: "10px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "flex", // Use flexbox for centering
                            justifyContent: "center", // Center horizontally
                            alignItems: "center", // Center vertically
                            width: "85px",
                            height: "30px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            marginLeft: "45%",
                            // marginTop: "10px",
                            // marginLeft: "1rem",
                          }}
                        >
                          <a
                            onClick={() => ""}
                            className="underline-text"
                            style={{
                              // marginTop: "10px",
                              // marginLeft: "15px",
                              fontSize: "15px",
                              color: "#035189",
                              fontWeight: "600",
                              display: "flex", // Ensure link content is centered
                              justifyContent: "center", // Center text horizontally within the button
                              alignItems: "center", // Center text vertically within the button
                              height: "100%", // Take up full height of the parent div
                              width: "100%", // Take up full width of the parent div
                              textAlign: "center",
                            }}
                            onMouseOver={(e) => (
                              (e.target.style.fontWeight = "800"),
                              (e.target.style.fontSize = "16px"),
                              (e.target.style.textDecoration = "underline")
                            )}
                            onMouseOut={(e) => (
                              (e.target.style.fontWeight = "600"),
                              (e.target.style.fontSize = "15px"),
                              (e.target.style.textDecoration = "none")
                            )}
                          >
                            Restore
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "100%", padding: "5rem" }}
        >
          <div className="heading-dotted-support">
            Server Stats <span></span>
          </div>
          {isSetUpInteractive && (
            <span class="arrows">Check Downloads Folder</span>
          )}
          <div className="features-section-solution">
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-11">
                <div
                  style={{
                    marginBottom: "-20rem",
                    display: "grid",
                    gridTemplateColumns: "auto auto auto auto",
                    justifyItems: "center",
                    gridRowGap: "50px",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      position: "relative",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px 0px",
                      marginLeft: "-15px",
                    }}
                  >
                    <img
                      src="/images/admin/06-View-Stats/server.png"
                      style={{
                        width: "255px",
                        height: "500px",
                        marginTop: "-30px",
                      }}
                      className="bg-image"
                    />
                    <div
                      className="stat"
                      style={{
                        position: "absolute",
                        maxWidth: "15rem",
                        marginTop: "-15rem",
                        marginLeft: "-80rem",
                        // marginLeft: "-68rem",
                      }}
                    >
                      <div className="machine-icon-edit-profile">
                        <img src={"/images/admin/06-View-Stats/switch.svg"} />
                      </div>
                      <div
                        className="machine-title"
                        style={{
                          backgroundColor:
                            monitorData && monitorData.status == 1
                              ? "green"
                              : "red",
                        }}
                      >
                        {monitorData && monitorData.status == 1 ? "ON" : "OFF"}
                      </div>
                      <div className="mid-portion" />
                      <div className="machine-subtitle theme-bg-blue">
                        {monitorData && monitorData.vm_name}
                      </div>
                    </div>

                    <img
                      src="/images/admin/06-View-Stats/server.png"
                      style={{
                        width: "255px",
                        height: "500px",
                        marginTop: "-30px",
                      }}
                      className="bg-image"
                    />
                    <div
                      className="stat"
                      style={{
                        position: "absolute",
                        maxWidth: "15rem",
                        marginTop: "-15rem",
                        marginLeft: "-48rem",
                        // marginLeft: "-34rem",
                      }}
                    >
                      <div className="machine-icon-edit-profile">
                        <img
                          src={"/admin/images/admin/13-Profile/server_icon.png"}
                        />
                      </div>
                      <div className="machine-title theme-bg-orange">CPU</div>
                      <div className="mid-portion" />
                      <div className="machine-subtitle theme-bg-blue">
                        {monitorData && monitorData.cpu}
                      </div>
                    </div>

                    <img
                      src="/images/admin/06-View-Stats/server.png"
                      style={{
                        width: "255px",
                        height: "500px",
                        marginTop: "-30px",
                      }}
                      className="bg-image"
                    />
                    <div
                      className="stat"
                      style={{
                        position: "absolute",
                        maxWidth: "15rem",
                        marginTop: "-15rem",
                        marginLeft: "-16rem",
                        // marginLeft: "1rem",
                      }}
                    >
                      <div className="machine-icon-edit-profile">
                        <img src={"/images/admin/06-View-Stats/ram-icon.svg"} />
                      </div>
                      <div className="machine-title theme-bg-orange">RAM</div>
                      <div className="mid-portion" />
                      <div className="machine-subtitle theme-bg-blue">
                        {monitorData && monitorData.ram / 1024} GB
                      </div>
                    </div>

                    <img
                      src="/images/admin/06-View-Stats/server.png"
                      style={{
                        width: "255px",
                        height: "500px",
                        marginTop: "-30px",
                      }}
                      className="bg-image"
                    />
                    <div
                      className="stat"
                      style={{
                        position: "absolute",
                        maxWidth: "15rem",
                        marginTop: "-15rem",
                        marginLeft: "16rem",
                        // marginLeft: "35rem",
                      }}
                    >
                      <div className="machine-icon-edit-profile">
                        <img
                          src={
                            "/images/admin/06-View-Stats/disk-space-icon.svg"
                          }
                        />
                      </div>
                      <div className="machine-title theme-bg-orange">
                        Storage
                      </div>
                      <div className="mid-portion" />
                      <div className="machine-subtitle theme-bg-blue">
                        {monitorData && monitorData.disk_type
                          ? monitorData.disk_type == "hdd"
                            ? `${monitorData.hard_disk} GB`
                            : monitorData.disk_type == "nvme"
                            ? `${monitorData.nvme} GB`
                            : `${monitorData.ssd} GB`
                          : "0 GB"}
                      </div>
                    </div>

                    <img
                      src="/images/admin/06-View-Stats/server.png"
                      style={{
                        width: "255px",
                        height: "500px",
                        marginTop: "-30px",
                      }}
                      className="bg-image"
                    />
                    <div
                      className="stat"
                      style={{
                        position: "absolute",
                        maxWidth: "15rem",
                        marginTop: "-15rem",
                        marginLeft: "47rem",
                      }}
                    >
                      <div className="machine-icon-edit-profile">
                        <img
                          src={"/admin/images/admin/13-Profile/support.png"}
                        />
                      </div>
                      <div className="machine-title theme-bg-orange">
                        Server Type
                      </div>
                      <div className="mid-portion" />
                      <div className="machine-subtitle theme-bg-blue">
                        {monitorData && monitorData.support_type}
                      </div>
                    </div>

                    {/* BackUp  */}
                    <img
                      src="/images/admin/06-View-Stats/server.png"
                      style={{
                        width: "270px",
                        height: "500px",
                        marginTop: "-30px",
                      }}
                      className="bg-image"
                    />
                    <div
                      className="stat"
                      style={{
                        position: "absolute",
                        maxWidth: "15rem",
                        marginTop: "-15rem",
                        marginLeft: "80rem",
                      }}
                    >
                      <div className="machine-icon-edit-profile">
                        <img src={"/images/admin/06-View-Stats/switch.svg"} />
                      </div>
                      <div
                        className="machine-title"
                        style={{
                          backgroundColor:
                            monitorData && monitorData.backup_status == 1
                              ? "green"
                              : "red",
                          // height: "25px",
                        }}
                      >
                        {monitorData && monitorData.backup_status == 1
                          ? "Backup ON"
                          : "Backup OFF"}
                      </div>
                      <div
                        className="profile-edit-badge-details"
                        onClick={() => SetSTOPBackUPPopup(true)}
                      >
                        <img
                          className="edit-iconimage"
                          src="/admin/images/admin/13-Profile/Pen.png"
                          style={{
                            paddingRight: "0px",
                          }}
                        />
                      </div>
                      <div className="mid-portion" />
                      <div className="machine-subtitle theme-bg-blue">
                        <button
                          // className="more-details-hover"
                          onClick={() =>
                            isIntializing
                              ? ""
                              : monitorData.backup_status === 1
                              ? onClickBackup()
                              : ""
                          }
                          style={{
                            color: "white",
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          {progressPercentage &&
                          progressPercentage != 100 &&
                          isBackUpFail != true &&
                          monitorData.backup_status === 1
                            ? "Restore Status"
                            : (monitorData &&
                                monitorData.backup_status === 1) ||
                              progressPercentage === 100
                            ? isIntializing
                              ? "Restore Intilizing..."
                              : "More Details"
                            : monitorData && monitorData.backup_status === 1
                            ? "Enable"
                            : "Disable"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="button-group" style={{ marginTop: "4rem" }}>
                    <button
                      className={`btn ${
                        activeButton === "SSH" ? "active" : ""
                      }`}
                      style={{
                        background: `${
                          activeButton === "SSH" ? "#f47c20" : "#035189"
                        }`,
                      }}
                      onClick={() => handleButtonClick("SSH")}
                    >
                      SSH
                    </button>

                    <button
                      className={`btn ${activeButton === "ATTACH_JUMPSERVER" ? "active" : ""}`}
                      style={{
                        background: `${
                          activeButton === "ATTACH_JUMPSERVER" ? "#f47c20" : "#035189"
                        }`,
                      }}
                      onClick={() => handleButtonClick("ATTACH_JUMPSERVER")}
                    >
                      Attach Jumpserver
                    </button>

                    <button
                      className={`btn ${activeButton === "CREATE_USER" ? "active" : ""}`}
                      style={{
                        background: `${
                          activeButton === "CREATE_USER" ? "#f47c20" : "#035189"
                        }`,
                      }}
                      onClick={() => handleButtonClick("CREATE_USER")}
                    >
                      Create User
                    </button>

                    {monitorData && monitorData.vm_type == 1 && (
                      <button
                        className={`btn ${
                          activeButton === "Add Domain" ? "active" : ""
                        }`}
                        style={{
                          background: `${
                            activeButton === "Add Domain"
                              ? "#f47c20"
                              : "#035189"
                          }`,
                        }}
                        onClick={() => handleButtonClick("Add Domain")}
                      >
                        Add Domain
                      </button>
                    )}

                    {monitorData && monitorData.vm_type == 1 && (
                      <button
                        className={`btn ${
                          activeButton === "SSL" ? "active" : ""
                        }`}
                        style={{
                          background: `${
                            activeButton === "SSL" ? "#f47c20" : "#035189"
                          }`,
                        }}
                        onClick={() => handleButtonClick("SSL")}
                      >
                        SSL
                      </button>
                    )}

                    {monitorData && monitorData.vm_type == 1 && (
                      <button
                        className={`btn ${
                          activeButton === "HTTPS Redirect" ? "active" : ""
                        }`}
                        style={{
                          background: `${
                            activeButton === "HTTPS Redirect"
                              ? "#f47c20"
                              : "#035189"
                          }`,
                        }}
                        onClick={() => handleButtonClick("HTTPS Redirect")}
                      >
                        HTTPS Redirect
                      </button>
                    )}

                    {monitorData && monitorData.vm_type == 1 && (
                      <button
                        className={`btn ${
                          activeButton === "Generate URL" ? "active" : ""
                        }`}
                        style={{
                          background: `${
                            activeButton === "Generate URL"
                              ? "#f47c20"
                              : "#035189"
                          }`,
                        }}
                        onClick={() => handleButtonClick("Generate URL")}
                      >
                        Generate URL
                      </button>
                    )}

                    {monitorData &&
                      monitorData.vm_type == 1 &&
                      isLoginByParentUser == 1 && (
                        <button
                          className={`btn ${
                            activeButton === "Assign Dedicated IP"
                              ? "active"
                              : ""
                          }`}
                          style={{
                            background: `${
                              activeButton === "Assign Dedicated IP"
                                ? "#f47c20"
                                : "#035189"
                            }`,
                          }}
                          onClick={() => {
                            getIPPrice();
                            SetAssignDedicatedIPPopup(true);
                          }}
                        >
                          Assign Dedicated IP
                        </button>
                      )}

                    {monitorData &&
                      monitorData.vm_type == 1 &&
                      isLoginByParentUser == 1 && (
                        <button
                          className={`btn ${
                            activeButton === "BackUp Plans" ? "active" : ""
                          }`}
                          style={{
                            background: `${
                              activeButton === "BackUp Plans"
                                ? "#f47c20"
                                : "#035189"
                            }`,
                          }}
                          onClick={() => handleButtonClick("BackUp Plans")}
                        >
                          BackUp Plans
                        </button>
                      )}
                  </div>

                  {activeButton !== "SSH" &&
                    activeButton !== "SSL" &&
                    activeButton !== "ATTACH_JUMPSERVER" &&
                    activeButton !== "CREATE_USER" &&
                    !isShowBackupView &&
                    !isShowVMView &&
                    monitorData &&
                    monitorData.vm_type == 1 && (
                      <div
                        className="input-container"
                        style={{
                          // marginLeft: "1%",
                          marginRight: "25px",
                          position: "relative",
                          border: "2px solid #035189",
                          width: "18rem",
                          marginTop: "50px",
                          height: "40px",
                        }}
                      >
                        <input
                          type="text"
                          name="search"
                          className="input-signup input-tickets"
                          placeholder={
                            activeButton === "Generate URL"
                              ? "Search"
                              : "Search Domain"
                          }
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
                </div>

                <div
                  className="flip-card-container"
                  style={{ marginLeft: "10px" }}
                >

                  {activeButton === "ATTACH_JUMPSERVER" && (
                    <div
                      style={{
                          marginTop: "40px",
                          minHeight: "20rem",
                          backgroundImage: `url("/images/blue-box-bg.svg")`,
                          backgroundSize: "cover",
                          width: "100%",
                          padding: "25px",
                          backgroundColor: "#07528b",
                          borderRadius: "12px",
                          overflow: "visible", 
                          position: "relative",
                          zIndex: 10,
                      }}
                    >
                      <h3 style={{ color: "white" }}>Attach Jumpserver</h3>

                      <div
                        style={{
                          marginTop: "20px",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "10px",
                        }}
                      >
                        <select
                          value={selectedJumpserverId}
                          onChange={(e) => setSelectedJumpserverId(Number(e.target.value))}
                          style={{
                            width: "50%",
                            height: "40px",
                            borderRadius: "20px",
                            padding: "0 15px",
                          }}
                        >
                          <option value="">Select Jumpserver</option>

                          {jumpservers.map((js) => (
                            <option key={js.id} value={Number(js.id)}>
                              {js.vm_name} ({js.public_ip})
                            </option>
                          ))}
                        </select>

                        <button
                          style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            fontWeight: "700",
                            color: "white",
                            height: "42px",
                            backgroundColor: "#e97730",
                            outline: "4px solid #e97730",
                            border: "4px solid white",
                            borderRadius: "30px",
                            opacity:
                              !selectedJumpserverId || isJumpserverAlreadyAttached ? 0.6 : 1,
                            cursor:
                              !selectedJumpserverId || isJumpserverAlreadyAttached
                                ? "not-allowed"
                                : "pointer",
                          }}
                          disabled={!selectedJumpserverId || isJumpserverAlreadyAttached}
                          onClick={attachJumpserver}
                        >
                          {isJumpserverAlreadyAttached
                            ? "Jumpserver Already Attached"
                            : "Apply Jumpserver"}
                        </button>
                      </div>
                    </div>
                  )}

                  {activeButton === "CREATE_USER" && (
                    <div
                      style={{
                        marginTop: "60px",
                        minHeight: "22rem",
                        backgroundImage: `url("/images/blue-box-bg.svg")`,
                        backgroundSize: "cover",
                        width: "100%",
                        padding: "25px",
                        backgroundColor: "#07528b",
                        overflow: "visible",
                        borderRadius: "12px",
                      }}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          {/* Username */}
                          <input
                            type="text"
                            placeholder="Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            style={{
                                  width: "100%",
                                  height: "45px",
                                  borderRadius: "25px",
                                  padding: "0 15px",
                                  marginBottom: "15px",
                                  border: "none",
                                  outline: "none",
                                }}
                          />
                        </div>

                        <div className="col-md-6">
                          {/* Password */}
                          <input
                            type="password"
                            placeholder="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                                  width: "100%",
                                  height: "45px",
                                  borderRadius: "25px",
                                  padding: "0 15px",
                                  marginBottom: "15px",
                                  border: "none",
                                  outline: "none",
                                }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={createVMUser}
                        style={{
                          marginTop: "20px",
                          cursor: "pointer",
                          position: "absolute",
                          fontWeight: "700",
                          color: "white",
                          height: "42px",
                          width: "10rem",
                          backgroundColor: "#e97730",
                          outline: "4px solid #e97730",
                          border: "4px solid #ffff",
                          borderColor: "white",
                          borderRadius: "30px",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.color = "#07528B")
                        } 
                        onMouseOut={(e) =>
                          (e.target.style.color = "white")
                        }
                      >
                        Create User
                      </button>
                    </div>
                  )}

                  {/* Flip Views */}
                  {activeButton === "SSH" && (
                    <div
                      className={`flip-card ${isFlipped ? "" : ""}`}
                      style={{ marginTop: changePass ? "45px" : "5px" }}
                    >
                      <div className="flip-card-inner">
                        {/* SSH View */}
                        {/* Front Side */}
                        <div className="flip-card-front">
                          <div
                            style={{
                              backgroundImage: `url("/images/blue-box-bg.svg")`,
                              backgroundSize: "cover",
                              top: "0rem",
                              width: "100%",
                              padding: "30px 25px",
                              position: "relative",
                              backgroundColor: "#07528b",
                              borderRadius: "12px",
                              // flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={() => {
                                exportToExcelSSH(
                                  monitorData.public_ip,
                                  monitorData && monitorData.vm_type === 1
                                    ? monitorData.vm_port
                                    : monitorData.vm_port,
                                  vmRes.vm_username,
                                  vmRes.vm_pass
                                );
                              }}
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                                position: "absolute", 
                                top: "15px", 
                                right: "10px",
                                height: "30px",
                              }}
                            >
                              <img
                                className="hover-zoom"
                                src="/images/images/download_excel.png"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                  marginLeft: "98rem",
                                  marginTop: "1px",
                                }}
                              />
                            </button>
                            <div>
                              <div
                                style={{
                                  position: "relative",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  zIndex: "1",
                                  marginTop: "20px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "50%",
                                    padding: "0px 10px",
                                  }}
                                >
                                  {/* IP */}
                                  <div
                                    style={{
                                      marginTop: "15px",
                                      display: "flex",
                                      alignItems: "center",
                                      border: "2px solid white",
                                      borderRadius: "25px",
                                      padding: "5px",
                                      height: "50px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        color: "white",
                                        textAlign: "center",
                                        fontSize: "20px",
                                        paddingTop: "15px",
                                        marginLeft: "20px",
                                      }}
                                    >
                                      {" "}
                                      {/* IP : {vmRes && vmRes.ip} */}
                                      IP :{" "}
                                      {monitorData && monitorData.public_ip}
                                    </p>
                                    {vmRes && vmRes.ip && (
                                      <div className="img-wrapper">
                                        <img
                                          className="hover-zoom"
                                          src={"/images/copy_icon.png"}
                                          style={{
                                            marginLeft: "10px",
                                            width: "30px",
                                            height: "30px",
                                          }}
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              monitorData.public_ip
                                            );
                                            setCopied1(true);
                                            setTimeout(
                                              () => setCopied1(false),
                                              2000
                                            );
                                          }}
                                        />
                                        {copied1 && (
                                          <span className="blinkStyle">
                                            Copied!
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {/* User Name */}
                                  <div
                                    style={{
                                      marginTop: "15px",
                                      display: "flex",
                                      alignItems: "center",
                                      border: "2px solid white",
                                      borderRadius: "25px",
                                      padding: "5px",
                                      height: "50px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        color: "white",
                                        textAlign: "center",
                                        fontSize: "20px",
                                        paddingTop: "15px",
                                        marginLeft: "20px",
                                      }}
                                    >
                                      {" "}
                                      Username : {vmRes && vmRes.vm_username}
                                    </p>
                                    {vmRes && vmRes.vm_username && (
                                      <div className="img-wrapper">
                                        <img
                                          className="hover-zoom"
                                          src={"/images/copy_icon.png"}
                                          style={{
                                            marginLeft: "10px",
                                            width: "30px",
                                            height: "30px",
                                          }}
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              vmRes.vm_username
                                            );
                                            setCopied2(true);
                                            setTimeout(
                                              () => setCopied2(false),
                                              2000
                                            );
                                          }}
                                        />
                                        {copied2 && (
                                          <span className="blinkStyle">
                                            Copied!
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {/*  */}
                                </div>
                                <div
                                  style={{
                                    width: "50%",
                                    padding: "0px 10px",
                                  }}
                                >
                                  {/* SSH Port */}
                                  <div
                                    style={{
                                      marginTop: "15px",
                                      display: "flex",
                                      alignItems: "center",
                                      border: "2px solid white",
                                      borderRadius: "25px",
                                      padding: "5px",
                                      height: "50px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        color: "white",
                                        textAlign: "center",
                                        fontSize: "20px",
                                        paddingTop: "15px",
                                        marginLeft: "20px",
                                      }}
                                    >
                                      {" "}
                                      SSH Port :{" "}
                                      {monitorData && monitorData.vm_type === 1
                                        ? monitorData.vm_port
                                        : monitorData.vm_port}
                                    </p>
                                    <div className="img-wrapper">
                                      <img
                                        className="hover-zoom"
                                        src={"/images/copy_icon.png"}
                                        style={{
                                          marginLeft: "10px",
                                          width: "30px",
                                          height: "30px",
                                        }}
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            monitorData &&
                                              monitorData.vm_type === 1
                                              ? monitorData.vm_port
                                              : monitorData.vm_port
                                          );
                                          setCopied3(true);
                                          setTimeout(
                                            () => setCopied3(false),
                                            2000
                                          );
                                        }}
                                      />
                                      {copied3 && (
                                        <span className="blinkStyle">
                                          Copied!
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div onClick={() => setChangePass(!changePass)}>
                                <p
                                  style={{
                                    marginTop: "10px",
                                    color: "white",
                                    textAlign: "center",
                                    fontSize: "20px",
                                    paddingTop: "10px",
                                    marginLeft: "20px",
                                    fontWeight: "600",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {" "}
                                  Change Password
                                </p>
                              </div>

                              {vmRes && vmRes.vnc_status && (
                                <button
                                  style={{
                                    position: "absolute",
                                    top:
                                      vmRes && vmRes.vnc_status !== 0
                                        ? "73%"
                                        : "45%",
                                    left: "69%",
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
                                  onMouseOver={(e) =>
                                    (e.target.style.color = "#07528B")
                                  } // Change color on hover
                                  onMouseOut={(e) =>
                                    (e.target.style.color = "white")
                                  }
                                  onClick={() => VNC(monitorData.vm_id)}
                                >
                                  {" "}
                                  <img
                                    src={"/vmc-monitor.png"}
                                    alt={"/vmc-monitor.png"}
                                    style={{
                                      marginRight: "5px",
                                      width: "30px",
                                      height: "30px",
                                    }}
                                  />
                                  Connect VNC
                                </button>
                              )}

                              {/* Regenerate Button */}
                              <button
                                style={{
                                  position: "absolute",
                                  top:
                                    vmRes && vmRes.vnc_status !== 0
                                      ? "70%"
                                      : "70%",
                                  left: "88%",
                                  fontWeight: "700",
                                  color: "white",
                                  height: "42px",
                                  width: "10rem",
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
                                onClick={() => regenerateSSH(monitorData.vm_id)}
                              >
                                SSH Key
                              </button>
                            </div>
                            {changePass && (
                              <div
                                style={{
                                  marginLeft: "100px",
                                  position: "relative",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  zIndex: "1",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20rem",
                                    marginTop: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    border: "2px solid white",
                                    borderRadius: "25px",
                                    padding: "5px",
                                    height: "50px",
                                  }}
                                >
                                  <input
                                    type={showNewPass ? "text" : "password"}
                                    //id="Password"
                                    className="input-signup"
                                    //name="Password"
                                    placeholder="New Password"
                                    value={newPass}
                                    style={{
                                      color: "white",
                                      border: "none",
                                      outline: "none",
                                      background: "transparent",
                                      flex: "1",
                                      padding: "5px",
                                    }}
                                    onChange={(e) => setNewPass(e.target.value)}
                                  />
                                  {/* {showNewPass ? (
                                    <FaEyeSlash
                                      onClick={() => setShowNewPass(false)}
                                      style={{
                                        color: "white",
                                        width: "20px",
                                        position: "absolute",
                                        left: "16.5%",
                                      }}
                                    />
                                  ) : (
                                    <FaEye
                                      onClick={() => setShowNewPass(true)}
                                      style={{
                                        color: "white",
                                        width: "20px",
                                        position: "absolute",
                                        left: "16.5%",
                                      }}
                                    />
                                  )} */}
                                </div>
                                <div
                                  style={{
                                    marginLeft: "20px",
                                    width: "20rem",
                                    marginTop: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    border: "2px solid white",
                                    borderRadius: "25px",
                                    padding: "5px",
                                    height: "50px",
                                  }}
                                >
                                  <input
                                    type={showConfPass ? "text" : "password"}
                                    //id="Confirm Password"
                                    className="input-signup"
                                    //name="Confirm Password"
                                    placeholder="Confirm Password"
                                    value={confPass}
                                    style={{
                                      color: "white",
                                      border: "none",
                                      outline: "none",
                                      background: "transparent",
                                      flex: "1",
                                      padding: "5px",
                                    }}
                                    onChange={(e) =>
                                      setConfPass(e.target.value)
                                    }
                                  />
                                  {/* {showConfPass ? (
                                    <FaEyeSlash
                                      onClick={() => setShowConfPass(false)}
                                      style={{
                                        color: "white",
                                        width: "20px",
                                        position: "absolute",
                                        left: "36%",
                                      }}
                                    />
                                  ) : (
                                    <FaEye
                                      onClick={() => setShowConfPass(true)}
                                      style={{
                                        color: "white",
                                        width: "20px",
                                        position: "absolute",
                                        left: "36%",
                                      }}
                                    />
                                  )} */}
                                </div>
                                <div
                                  className="log-in"
                                  style={{
                                    marginTop: "10px",
                                    marginLeft: "-8rem",
                                    justifyContent: "center",
                                  }}
                                  // onClick={() => UpdateMachinePass()}
                                >
                                  <a className="media-link">
                                    <div
                                      className="media-banner"
                                      style={{
                                        width: "auto",
                                        height: "50px",
                                        // marginTop: "10px",
                                        marginLeft: "9rem",
                                        position: "absolute",
                                        marginTop: "-18px",
                                      }}
                                    >
                                      <img
                                        className="normal-banner"
                                        src="/images/signup-btn-bg.png"
                                        alt=""
                                        style={{
                                          marginTop: "-6px",
                                          width: "8rem",
                                          height: "3rem",
                                        }}
                                      />
                                      <img
                                        className="hover-img-banner"
                                        src="/images/search-btn-hover.png"
                                        alt="/images/search-btn-hover.png"
                                        style={{
                                          marginTop: "-6px",
                                          width: "8rem",
                                          height: "3rem",
                                        }}
                                      />
                                      <span
                                        className="login-text"
                                        style={{
                                          fontSize: "20px",
                                          color: "#07528B",
                                          marginTop: "-7px",
                                        }}
                                        onClick={() => UpdateMachinePass()}
                                      >
                                        Submit
                                      </span>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            )}

                            {/* VNC Details */}
                            {vmRes && vmRes.vnc_status && (
                              <div style={{ marginTop: "20px" }}>
                                <div
                                  style={{
                                    position: "relative",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    zIndex: "1",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "50%",
                                      padding: "0px 10px",
                                    }}
                                  >
                                    {/* IP */}
                                    <div
                                      style={{
                                        marginTop: "15px",
                                        display: "flex",
                                        alignItems: "center",
                                        border: "2px solid white",
                                        borderRadius: "25px",
                                        padding: "5px",
                                        height: "50px",
                                      }}
                                    >
                                      <p
                                        style={{
                                          color: "white",
                                          textAlign: "center",
                                          fontSize: "20px",
                                          paddingTop: "15px",
                                          marginLeft: "20px",
                                        }}
                                      >
                                        {" "}
                                        VNC IP : {vmRes && vmRes.vnc_ip}
                                      </p>
                                      {vmRes && vmRes.vnc_ip && (
                                        <div className="img-wrapper">
                                          <img
                                            className="hover-zoom"
                                            src={"/images/copy_icon.png"}
                                            style={{
                                              marginLeft: "10px",
                                              width: "30px",
                                              height: "30px",
                                            }}
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                vmRes.vnc_ip
                                              );
                                              setCopied5(true);
                                              setTimeout(
                                                () => setCopied5(false),
                                                2000
                                              );
                                            }}
                                          />
                                          {copied5 && (
                                            <span className="blinkStyle">
                                              Copied!
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    {/* User Name */}
                                    <div
                                      style={{
                                        marginTop: "15px",
                                        display: "flex",
                                        alignItems: "center",
                                        border: "2px solid white",
                                        borderRadius: "25px",
                                        padding: "5px",
                                        height: "50px",
                                      }}
                                    >
                                      <p
                                        style={{
                                          color: "white",
                                          textAlign: "center",
                                          fontSize: "20px",
                                          paddingTop: "15px",
                                          marginLeft: "20px",
                                        }}
                                      >
                                        {" "}
                                        VNC Password :{" "}
                                        {vmRes && showVNCPass
                                          ? vmRes.vnc_pass
                                          : "••••••••"}
                                      </p>
                                      {vmRes && vmRes.vnc_pass && (
                                        <div className="img-wrapper">
                                          <img
                                            className="hover-zoom"
                                            src={"/images/copy_icon.png"}
                                            style={{
                                              marginLeft: "10px",
                                              width: "30px",
                                              height: "30px",
                                            }}
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                vmRes.vnc_pass
                                              );
                                              setCopied6(true);
                                              setTimeout(
                                                () => setCopied6(false),
                                                2000
                                              );
                                            }}
                                          />
                                          {copied6 && (
                                            <span className="blinkStyle">
                                              Copied!
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      <div
                                        style={{
                                          position: "absolute",
                                          //right: "0.5%",
                                          marginLeft: "850px",
                                        }}
                                      >
                                        {showVNCPass ? (
                                          <FaEyeSlash
                                            onClick={() =>
                                              setShowVNCPass(false)
                                            }
                                            style={{
                                              color: "white",
                                              width: "20px",
                                            }}
                                          />
                                        ) : (
                                          <FaEye
                                            onClick={() => setShowVNCPass(true)}
                                            style={{
                                              color: "white",
                                              width: "20px",
                                            }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                    {/*  */}
                                  </div>
                                  <div
                                    style={{
                                      width: "50%",
                                      padding: "0px 10px",
                                    }}
                                  >
                                    {/* SSH Port */}
                                    <div
                                      style={{
                                        marginTop: "15px",
                                        display: "flex",
                                        alignItems: "center",
                                        border: "2px solid white",
                                        borderRadius: "25px",
                                        padding: "5px",
                                        height: "50px",
                                      }}
                                    >
                                      <p
                                        style={{
                                          color: "white",
                                          textAlign: "center",
                                          fontSize: "20px",
                                          paddingTop: "15px",
                                          marginLeft: "20px",
                                        }}
                                      >
                                        {" "}
                                        VNC PORT : {vmRes && vmRes.vnc_port}
                                      </p>
                                      {vmRes && vmRes.vnc_port && (
                                        <div className="img-wrapper">
                                          <img
                                            className="hover-zoom"
                                            src={"/images/copy_icon.png"}
                                            style={{
                                              marginLeft: "10px",
                                              width: "30px",
                                              height: "30px",
                                            }}
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                vmRes.vnc_port
                                              );
                                              setCopied7(true);
                                              setTimeout(
                                                () => setCopied7(false),
                                                2000
                                              );
                                            }}
                                          />
                                          {copied7 && (
                                            <span className="blinkStyle">
                                              Copied!
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* <div onClick={() => setChangeVNCPass(!changeVNCPass)}>
                            <p
                              style={{
                                marginTop: "10px",
                                color: "white",
                                textAlign: "center",
                                fontSize: "20px",
                                paddingTop: "10px",
                                marginLeft: "20px",
                                fontWeight: "600",
                                textDecoration: "underline",
                              }}
                            >
                              {" "}
                              Change VNC Password
                            </p>
                          </div> */}
                              </div>
                            )}

                            {/* {changeVNCPass && (
                          <div
                            style={{
                              marginLeft: "100px",
                              position: "relative",
                              display: "flex",
                              flexWrap: "wrap",
                              zIndex: "1",
                            }}
                          >
                            <div
                              style={{
                                width: "15rem",
                                marginTop: "10px",
                                display: "flex",
                                alignItems: "center",
                                border: "2px solid white",
                                borderRadius: "25px",
                                padding: "5px",
                                height: "50px",
                              }}
                            >
                              <input
                                type={showNewPass ? "text" : "password"}
                                id="VNC Password"
                                className="input-signup"
                                name="VNC Password"
                                placeholder="VNC New Password"
                                value={newPass}
                                style={{
                                  color: "white",
                                  border: "none",
                                  outline: "none",
                                  background: "transparent",
                                  flex: "1",
                                  padding: "5px",
                                }}
                                onChange={(e) => setNewPass(e.target.value)}
                              />
                              {showNewPass ? (
                                <FaEyeSlash
                                  onClick={() => setShowNewPass(false)}
                                  style={{ color: "white", width: "20px" }}
                                />
                              ) : (
                                <FaEye
                                  onClick={() => setShowNewPass(true)}
                                  style={{ color: "white", width: "20px" }}
                                />
                              )}
                            </div>
                            <div
                              style={{
                                marginLeft: "20px",
                                width: "17rem",
                                marginTop: "10px",
                                display: "flex",
                                alignItems: "center",
                                border: "2px solid white",
                                borderRadius: "25px",
                                padding: "5px",
                                height: "50px",
                              }}
                            >
                              <input
                                type={showConfPass ? "text" : "password"}
                                id="VNC Confirm Password"
                                className="input-signup"
                                name="VNC Confirm Password"
                                placeholder="VNC Confirm Password"
                                value={confPass}
                                style={{
                                  color: "white",
                                  border: "none",
                                  outline: "none",
                                  background: "transparent",
                                  flex: "1",
                                  padding: "5px",
                                }}
                                onChange={(e) => setConfPass(e.target.value)}
                              />
                              {/* {showConfPass ? (
                                <FaEyeSlash
                                  onClick={() => setShowConfPass(false)}
                                  style={{ color: "white", width: "20px" }}
                                />
                              ) : (
                                <FaEye
                                  onClick={() => setShowConfPass(true)}
                                  style={{ color: "white", width: "20px" }}
                                />
                              )} }
                            </div>
                            <div
                              className="log-in"
                              style={{
                                marginTop: "10px",
                                marginLeft: "-8rem",
                                justifyContent: "center",
                              }}
                              // onClick={() => UpdateMachinePass()}
                            >
                              <a className="media-link">
                                <div
                                  className="media-banner"
                                  style={{
                                    width: "auto",
                                    height: "50px",
                                    // marginTop: "10px",
                                    marginLeft: "10rem",

                                    position: "absolute",

                                    marginTop: "-28px",
                                  }}
                                >
                                  <img
                                    className="normal-banner"
                                    src="/images/signup-btn-bg.png"
                                    alt=""
                                    style={{
                                      marginTop: "-6px",
                                      width: "8rem",
                                      height: "4rem",
                                    }}
                                  />
                                  <img
                                    className="hover-img-banner"
                                    src="/images/search-btn-hover.png"
                                    alt="/images/search-btn-hover.png"
                                    style={{
                                      marginTop: "-6px",
                                      width: "8rem",
                                      height: "4rem",
                                    }}
                                  />
                                  <span
                                    className="login-text"
                                    style={{
                                      fontSize: "20px",
                                      color: "#07528B",
                                      marginTop: "0px",
                                    }}
                                    onClick={() => UpdateMachinePass()}
                                  >
                                    Submit
                                  </span>
                                </div>
                              </a>
                            </div>
                          </div>
                        )} */}
                          </div>

                          {/* Back Side */}
                          {/* <div
                        className="flip-card-back"
                        style={{ backgroundColor: "white" }}
                      >
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
                            onMouseOut={(e) => (e.target.style.color = "white")}
                            onClick={() => ""}
                          >
                            Reload
                          </button>
                        </div>
                      </div> */}
                        </div>

                        {/* <div className="flip-card-back">
                        <h2>SSH Back</h2>
                        <p>SSH configuration details go here</p>
                      </div> */}
                      </div>
                    </div>
                  )}

                  {activeButton === "Add Domain" && (
                    <div
                      className={`flip-card ${isFlipped ? "flipped" : ""}`}
                      style={{ marginTop: "-8px" }}
                    >
                      <div className="flip-card-inner">
                        {/* Add Domain View */}
                        <div className="flip-card-front">
                          <div
                            style={{
                              backgroundImage: `url("/images/blue-box-bg.svg")`,
                              backgroundSize: "cover",
                              top: "1rem",
                              width: "100%",
                              height: "148%",
                              padding: "15px 25px",
                              position: "relative",
                              backgroundColor: "#07528b",
                              borderRadius: "12px",
                              // flexWrap: "wrap",
                            }}
                          >
                            <div
                              className="table-row-noti"
                              style={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              }}
                            >
                              <div
                                className="message"
                                style={{ width: "100%" }}
                              >
                                <Row>
                                  <div
                                    className="col-md-7"
                                    style={{ marginTop: "20px" }}
                                  >
                                    <Row>
                                      {/* www */}
                                      <div
                                        className="col-md-9"
                                        style={{
                                          marginLeft: "15px",
                                          display: "flex",
                                          alignItems: "center",
                                          height: "50px",
                                          zIndex: "9",
                                          position: "relative",
                                          color: "white",
                                          border: "2px solid #ffff",
                                          borderColor: "white",
                                          borderRadius: "30px",
                                        }}
                                      >
                                        <input
                                          type="text"
                                          id="Domain"
                                          className="input-signup"
                                          name="Domain"
                                          placeholder="Domain Name"
                                          // value={""}
                                          style={{
                                            color: "white",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            flex: "1",
                                            padding: "15px",
                                          }}
                                          onChange={(e) =>
                                            setDomainName(e.target.value)
                                          }
                                        />
                                      </div>

                                      <div
                                        className="col-md-2"
                                        onClick={() => addDomain()}
                                      >
                                        <a className="media-link">
                                          <div
                                            className="media-banner"
                                            style={{
                                              width: "auto",
                                              height: "50px",
                                              // marginTop: "10px",
                                              // marginLeft: "1rem",
                                            }}
                                          >
                                            <img
                                              className="normal-banner"
                                              src="/images/signup-btn-bg.png"
                                              alt=""
                                              style={{
                                                marginTop: "0px",
                                                width: "6rem",
                                                height: "3rem",
                                              }}
                                            />
                                            <img
                                              className="hover-img-banner"
                                              src="/images/search-btn-hover.png"
                                              alt="/images/search-btn-hover.png"
                                              style={{
                                                marginTop: "0px",
                                                width: "6rem",
                                                height: "3rem",
                                              }}
                                            />
                                            <span
                                              className="login-text"
                                              style={{
                                                fontSize: "20px",
                                                color: "#07528B",
                                                marginTop: "0px",
                                              }}
                                            >
                                              Add
                                            </span>
                                          </div>
                                        </a>
                                      </div>
                                    </Row>

                                    <div
                                      style={{
                                        marginTop: "25px",
                                        marginLeft: "5px",
                                        textAlign: "left",
                                        color: "white",
                                        fontWeight: "500",
                                        fontSize: "18px",
                                      }}
                                    >
                                      ADD A Record in Your DNS :
                                    </div>

                                    {/* { Second Row} */}
                                    <Row>
                                      <div className="col-md-1">
                                        <div
                                          style={{
                                            // marginLeft: "15px",
                                            marginTop: "15px",
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "5px",
                                            height: "50px",
                                            width: "70px",
                                            zIndex: "9",
                                            position: "relative",
                                            color: "white",
                                            border: "2px solid #ffff",
                                            borderColor: "white",
                                            borderRadius: "30px",
                                          }}
                                        >
                                          <p
                                            style={{
                                              color: "white",
                                              textAlign: "center",
                                              fontSize: "18px",
                                              fontWeight: "500",
                                              paddingTop: "15px",
                                              marginLeft: "20px",
                                            }}
                                          >
                                            {" "}
                                            A
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-md-1">
                                        <div
                                          style={{
                                            marginLeft: "10px",
                                            marginTop: "15px",
                                            display: "flex",
                                            alignItems: "left",
                                            padding: "5px",
                                            height: "50px",
                                            width: "70px",
                                            zIndex: "9",
                                            color: "white",
                                            border: "2px solid #ffff",
                                            borderColor: "white",
                                            borderRadius: "30px",
                                          }}
                                        >
                                          <p
                                            style={{
                                              color: "white",
                                              textAlign: "center",
                                              fontSize: "18px",
                                              fontWeight: "500",
                                              paddingTop: "5px",
                                              marginLeft: "20px",
                                            }}
                                          >
                                            {" "}
                                            @
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-md-7">
                                        <div
                                          style={{
                                            marginLeft: "20px",
                                            marginTop: "15px",
                                            display: "flex",
                                            alignItems: "left",
                                            padding: "5px",
                                            height: "50px",
                                            width: "101%",
                                            zIndex: "9",
                                            position: "relative",
                                            color: "white",
                                            border: "2px solid #ffff",
                                            borderColor: "white",
                                            borderRadius: "30px",
                                          }}
                                        >
                                          <p
                                            style={{
                                              color: "white",
                                              textAlign: "center",
                                              fontSize: "18px",
                                              fontWeight: "500",
                                              paddingTop: "5px",
                                              marginLeft: "20px",
                                            }}
                                          >
                                            {monitorData &&
                                              monitorData.public_ip}
                                          </p>
                                        </div>
                                      </div>

                                      {/* {domainData && (
                                        <div
                                          className="col-md-2"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "20px",
                                          }}
                                          onClick={() =>
                                            validateDomain(
                                              domainData.domain_name,
                                              domainData.id
                                            )
                                          }
                                        >
                                          <a className="media-link">
                                            <div
                                              className="media-banner"
                                              style={{
                                                width: "auto",
                                                height: "50px",
                                                // marginTop: "10px",
                                                // marginLeft: "1rem",
                                              }}
                                            >
                                              <img
                                                className="normal-banner"
                                                src="/images/signup-btn-bg.png"
                                                alt=""
                                                style={{
                                                  marginTop: "0px",
                                                  width: "7rem",
                                                  height: "3rem",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/search-btn-hover.png"
                                                alt="/images/search-btn-hover.png"
                                                style={{
                                                  marginTop: "0px",
                                                  width: "7rem",
                                                  height: "3rem",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "#07528B",
                                                  marginTop: "0px",
                                                }}
                                              >
                                                Validate
                                              </span>
                                            </div>
                                          </a>
                                        </div>
                                      )} */}
                                    </Row>
                                  </div>

                                  {/* Table */}
                                  <div className="col-md-5">
                                    <div
                                      style={{
                                        maxHeight: "240px",
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                      }}
                                    >
                                      {domainList &&
                                      domainList
                                        .reverse()
                                        .filter((item) => item.domain_name)
                                        .length === 0 ? (
                                        <div
                                          style={{
                                            marginLeft: "50px",
                                            border: "1px solid white",
                                            padding: "10px",
                                            backgroundColor: "transparent",
                                            color: "white",
                                            // width: "60%",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          No Domains Found
                                        </div>
                                      ) : (
                                        <table
                                          className="table"
                                          style={{
                                            borderCollapse: "collapse",
                                            width: "100%",
                                          }}
                                        >
                                          <thead>
                                            <tr>
                                              <th
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  backgroundColor:
                                                    "transparent",
                                                  width: "50%",
                                                  color: "white",
                                                }}
                                              >
                                                Domain Name
                                              </th>
                                              <th
                                                colspan="2"
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  backgroundColor:
                                                    "transparent",
                                                  color: "white",
                                                }}
                                              >
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {domainList &&
                                              domainList
                                                .reverse()
                                                .filter((item) =>
                                                  item.domain_name
                                                    .toLowerCase()
                                                    .includes(
                                                      searchText.toLowerCase()
                                                    )
                                                )
                                                .map((item, idx) => (
                                                  <tr>
                                                    <td
                                                      className="domain-name"
                                                      style={{
                                                        border:
                                                          "1px solid white",
                                                        padding: "10px",
                                                        backgroundColor:
                                                          "transparent",
                                                        color: "white",
                                                        width: "60%",
                                                        whiteSpace: "nowrap",
                                                        textOverflow:
                                                          "ellipsis",
                                                        overflow: "hidden",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                      }}
                                                    >
                                                      {item.domain_name}
                                                    </td>

                                                    <td
                                                      style={{
                                                        backgroundColor:
                                                          "transparent",
                                                        border:
                                                          "1px solid white",
                                                        paddingTop: "10px",
                                                      }}
                                                    >
                                                      {item.domain_status ===
                                                      0 ? (
                                                        <div
                                                          style={{
                                                            width: "auto",
                                                            height: "30px",
                                                            // marginTop: "10px",
                                                            // marginLeft: "1rem",
                                                          }}
                                                        >
                                                          <a
                                                            onClick={() =>
                                                              validateDomain(
                                                                item.domain_name,
                                                                item.id
                                                              )
                                                            }
                                                            className="underline-text"
                                                            style={{
                                                              // marginTop: "10px",
                                                              // marginLeft: "15px",
                                                              fontSize: "15px",
                                                              color: "white",
                                                              fontWeight: "600",
                                                            }}
                                                            onMouseOver={(
                                                              e
                                                            ) => (
                                                              (e.target.style.fontWeight =
                                                                "800"),
                                                              (e.target.style.fontSize =
                                                                "16px"),
                                                              (e.target.style.textDecoration =
                                                                "underline")
                                                            )}
                                                            onMouseOut={(e) => (
                                                              (e.target.style.fontWeight =
                                                                "600"),
                                                              (e.target.style.fontSize =
                                                                "15px"),
                                                              (e.target.style.textDecoration =
                                                                "none")
                                                            )}
                                                          >
                                                            Verify
                                                          </a>
                                                        </div>
                                                      ) : (
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "center",
                                                          }}
                                                        >
                                                          <img
                                                            src="/images/verified_success.png"
                                                            style={{
                                                              height: "28px",
                                                              width: "28px",
                                                              zIndex: "9",
                                                              position:
                                                                "relative",
                                                              marginTop: "-2px",
                                                              //left: "1%",
                                                            }}
                                                          />
                                                          <div
                                                            style={{
                                                              width: "auto",
                                                              height: "30px",
                                                              // marginTop: "10px",
                                                              marginLeft: "5px",
                                                            }}
                                                          >
                                                            <a
                                                              onClick={() =>
                                                                validateDomain(
                                                                  item.domain_name,
                                                                  item.id
                                                                )
                                                              }
                                                              className="underline-text"
                                                              style={{
                                                                // marginTop: "10px",
                                                                // marginLeft: "15px",
                                                                fontSize:
                                                                  "15px",
                                                                color: "white",
                                                                fontWeight:
                                                                  "600",
                                                              }}
                                                              onMouseOver={(
                                                                e
                                                              ) => (
                                                                (e.target.style.fontWeight =
                                                                  "800"),
                                                                (e.target.style.fontSize =
                                                                  "16px"),
                                                                (e.target.style.textDecoration =
                                                                  "underline")
                                                              )}
                                                              onMouseOut={(
                                                                e
                                                              ) => (
                                                                (e.target.style.fontWeight =
                                                                  "600"),
                                                                (e.target.style.fontSize =
                                                                  "15px"),
                                                                (e.target.style.textDecoration =
                                                                  "none")
                                                              )}
                                                            >
                                                              ReVerify
                                                            </a>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </td>
                                                    <td
                                                      style={{
                                                        backgroundColor:
                                                          "transparent",
                                                        border:
                                                          "1px solid white",
                                                        paddingTop: "10px",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          width: "auto",
                                                          height: "30px",
                                                          // marginTop: "10px",
                                                          // marginLeft: "1rem",
                                                        }}
                                                        onClick={() => {
                                                          setSelectDomainNameForDelete(
                                                            item.domain_name
                                                          );
                                                          setSelectDomainIdForDelete(
                                                            item.id
                                                          );
                                                          SetDeletePopup(true);
                                                        }}
                                                      >
                                                        <a
                                                          className="underline-text"
                                                          style={{
                                                            // marginTop: "10px",
                                                            // marginLeft: "15px",
                                                            fontSize: "15px",
                                                            color: "white",
                                                            fontWeight: "600",
                                                          }}
                                                          onMouseOver={(e) => (
                                                            (e.target.style.fontWeight =
                                                              "800"),
                                                            (e.target.style.fontSize =
                                                              "16px"),
                                                            (e.target.style.textDecoration =
                                                              "underline")
                                                          )}
                                                          onMouseOut={(e) => (
                                                            (e.target.style.fontWeight =
                                                              "600"),
                                                            (e.target.style.fontSize =
                                                              "15px"),
                                                            (e.target.style.textDecoration =
                                                              "none")
                                                          )}
                                                        >
                                                          Remove
                                                        </a>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                  </div>
                                </Row>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flip-card-back">
                        <h2>Add Domain Back</h2>
                        <p>Domain configuration details go here</p>
                      </div> */}
                      </div>
                    </div>
                  )}

                  {activeButton === "SSL" && (
                    <div
                      className={`flip-card ${isFlipped ? "flipped" : ""}`}
                      style={{ marginTop: "8px" }}
                    >
                      <div className="flip-card-inner">
                        {/* HTTPS Redirect View */}
                        <div className="flip-card-front">
                          <div
                            style={{
                              backgroundImage: `url("/images/blue-box-bg.svg")`,
                              backgroundSize: "cover",
                              top: "0rem",
                              width: "100%",
                              height: "140%",
                              padding: "20px 25px",
                              position: "relative",
                              backgroundColor: "#07528b", // Use backgroundColor instead of background
                              borderRadius: "12px",
                              // flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                maxHeight: "240px",
                                overflowY: "auto",
                                overflowX: "hidden",
                              }}
                            >
                              {domainList &&
                              domainList
                                .reverse()
                                .filter(
                                  (item) =>
                                    item.domain_status === 1 && item.domain_name
                                ).length === 0 ? (
                                <div
                                  style={{
                                    border: "1px solid white",
                                    padding: "10px",
                                    backgroundColor: "transparent",
                                    color: "white",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    height: "240px",
                                    alignContent: "center",
                                  }}
                                >
                                  No Domains Found
                                </div>
                              ) : (
                                <table
                                  className="table"
                                  style={{
                                    borderCollapse: "collapse",
                                    width: "100%",
                                  }}
                                >
                                  <thead>
                                    <tr>
                                      <th
                                        style={{
                                          border: "1px solid white",
                                          padding: "8px",
                                          backgroundColor: "transparent",
                                          width: "50%",
                                          color: "white",
                                        }}
                                      >
                                        Domain Name
                                      </th>
                                      <th
                                        colspan="2"
                                        style={{
                                          border: "1px solid white",
                                          padding: "8px",
                                          backgroundColor: "transparent",
                                          color: "white",
                                        }}
                                      >
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {domainList &&
                                      domainList
                                        .reverse()
                                        .filter(
                                          (item) =>
                                            item.domain_status === 1 &&
                                            item.domain_name
                                              .toLowerCase()
                                              .includes(
                                                searchText.toLowerCase()
                                              )
                                        )
                                        .map((item, idx) => (
                                          <tr>
                                            <td
                                              className="domain-name"
                                              style={{
                                                border: "1px solid white",
                                                padding: "10px",
                                                backgroundColor: "transparent",
                                                color: "white",
                                                fontWeight: "600",
                                              }}
                                            >
                                              {item.domain_name}
                                            </td>
                                            <td
                                              style={{
                                                backgroundColor: "transparent",
                                                border: "1px solid white",
                                                paddingTop: "10px",
                                              }}
                                            >
                                              {item.ssl_status === 0 ? (
                                                <div
                                                  style={{
                                                    width: "auto",
                                                    height: "30px",
                                                    // marginTop: "10px",
                                                    // marginLeft: "1rem",
                                                  }}
                                                  onClick={() =>
                                                    domainSSL(
                                                      item.domain_name,
                                                      item.id
                                                    )
                                                  }
                                                >
                                                  <a
                                                    className="underline-text"
                                                    style={{
                                                      // marginTop: "10px",
                                                      marginLeft: "15px",
                                                      fontSize: "15px",
                                                      color: "white",
                                                      fontWeight: "600",
                                                    }}
                                                    onMouseOver={(e) => (
                                                      (e.target.style.fontWeight =
                                                        "800"),
                                                      (e.target.style.fontSize =
                                                        "16px"),
                                                      (e.target.style.textDecoration =
                                                        "underline")
                                                    )}
                                                    onMouseOut={(e) => (
                                                      (e.target.style.fontWeight =
                                                        "600"),
                                                      (e.target.style.fontSize =
                                                        "15px"),
                                                      (e.target.style.textDecoration =
                                                        "none")
                                                    )}
                                                  >
                                                    {/* SSL Redirect */}
                                                    Auto SSL
                                                  </a>
                                                </div>
                                              ) : (
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "auto",
                                                    height: "30px",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  <img
                                                    src="/images/verified_success.png"
                                                    style={{
                                                      height: "28px",
                                                      width: "28px",
                                                      zIndex: "9",
                                                      position: "relative",
                                                      marginTop: "-2px",
                                                      //left: "1%",
                                                    }}
                                                  />
                                                  <div
                                                    style={{
                                                      width: "auto",
                                                      height: "30px",
                                                      // marginTop: "10px",
                                                      marginLeft: "5px",
                                                    }}
                                                  >
                                                    <a
                                                      onClick={() =>
                                                        validateDomain(
                                                          item.domain_name,
                                                          item.id
                                                        )
                                                      }
                                                      className="underline-text"
                                                      style={{
                                                        // marginTop: "10px",
                                                        // marginLeft: "15px",
                                                        fontSize: "15px",
                                                        color: "white",
                                                        fontWeight: "600",
                                                      }}
                                                      onMouseOver={(e) => (
                                                        (e.target.style.fontWeight =
                                                          "800"),
                                                        (e.target.style.fontSize =
                                                          "16px"),
                                                        (e.target.style.textDecoration =
                                                          "underline")
                                                      )}
                                                      onMouseOut={(e) => (
                                                        (e.target.style.fontWeight =
                                                          "600"),
                                                        (e.target.style.fontSize =
                                                          "15px"),
                                                        (e.target.style.textDecoration =
                                                          "none")
                                                      )}
                                                    >
                                                      Verified
                                                    </a>
                                                  </div>
                                                </div>
                                              )}
                                            </td>
                                            <td
                                              className="domain-name"
                                              style={{
                                                border: "1px solid white",
                                                padding: "10px",
                                                backgroundColor: "transparent",
                                                color: "white",
                                                fontWeight: "600",
                                              }}
                                            >
                                              <a
                                                className="underline-text"
                                                style={{
                                                  // marginTop: "10px",
                                                  marginLeft: "15px",
                                                  fontSize: "15px",
                                                  color: "white",
                                                  fontWeight: "600",
                                                }}
                                                onMouseOver={(e) => (
                                                  (e.target.style.fontWeight =
                                                    "800"),
                                                  (e.target.style.fontSize =
                                                    "16px"),
                                                  (e.target.style.textDecoration =
                                                    "underline")
                                                )}
                                                onMouseOut={(e) => (
                                                  (e.target.style.fontWeight =
                                                    "600"),
                                                  (e.target.style.fontSize =
                                                    "15px"),
                                                  (e.target.style.textDecoration =
                                                    "none")
                                                )}
                                                onClick={() => {
                                                  SetCustomSSLPopup(true);
                                                  setSelectedDomain(
                                                    item.domain_name
                                                  );
                                                  setSelectedDomainId(item.id);
                                                }}
                                              >
                                                Custom SSL
                                              </a>
                                            </td>
                                          </tr>
                                        ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* <div className="flip-card-back">
                        <h2>HTTPS Redirect Back</h2>
                        <p>HTTPS Redirect configuration details go here</p>
                      </div> */}
                      </div>
                    </div>
                  )}

                  {activeButton === "HTTPS Redirect" && (
                    <div
                      className={`flip-card ${isFlipped ? "flipped" : ""}`}
                      style={{ marginTop: "8px" }}
                    >
                      <div className="flip-card-inner">
                        {/* HTTPS Redirect View */}
                        <div className="flip-card-front">
                          <div
                            style={{
                              backgroundImage: `url("/images/blue-box-bg.svg")`,
                              backgroundSize: "cover",
                              top: "0rem",
                              width: "100%",
                              height: "140%",
                              padding: "20px 25px",
                              position: "relative",
                              backgroundColor: "#07528b", // Use backgroundColor instead of background
                              borderRadius: "12px",
                              // flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                maxHeight: "240px",
                                overflowY: "auto",
                                overflowX: "hidden",
                              }}
                            >
                              {domainList &&
                              domainList
                                .reverse()
                                .filter(
                                  (item) =>
                                    item.domain_status === 1 && item.domain_name
                                ).length === 0 ? (
                                <div
                                  style={{
                                    border: "1px solid white",
                                    padding: "10px",
                                    backgroundColor: "transparent",
                                    color: "white",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    height: "240px",
                                    alignContent: "center",
                                  }}
                                >
                                  No Domains Found
                                </div>
                              ) : (
                                <table
                                  className="table"
                                  style={{
                                    borderCollapse: "collapse",
                                    width: "100%",
                                  }}
                                >
                                  <thead>
                                    <tr>
                                      <th
                                        style={{
                                          border: "1px solid white",
                                          padding: "8px",
                                          backgroundColor: "transparent",
                                          width: "50%",
                                          color: "white",
                                        }}
                                      >
                                        Domain Name
                                      </th>
                                      <th
                                        colspan="2"
                                        style={{
                                          border: "1px solid white",
                                          padding: "8px",
                                          backgroundColor: "transparent",
                                          color: "white",
                                        }}
                                      >
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {domainList &&
                                      domainList
                                        .reverse()
                                        .filter(
                                          (item) =>
                                            item.domain_status === 1 &&
                                            item.domain_name
                                              .toLowerCase()
                                              .includes(
                                                searchText.toLowerCase()
                                              )
                                        )
                                        .map((item, idx) => (
                                          <tr>
                                            <td
                                              className="domain-name"
                                              style={{
                                                border: "1px solid white",
                                                padding: "10px",
                                                backgroundColor: "transparent",
                                                color: "white",
                                                fontWeight: "600",
                                              }}
                                            >
                                              {item.domain_name}
                                            </td>
                                            <td
                                              style={{
                                                backgroundColor: "transparent",
                                                border: "1px solid white",
                                                paddingTop: "10px",
                                              }}
                                            >
                                              {item.redirect_status !== 1 ? (
                                                <div
                                                  style={{
                                                    width: "auto",
                                                    height: "30px",
                                                    // marginTop: "10px",
                                                    // marginLeft: "1rem",
                                                  }}
                                                  onClick={() =>
                                                    redirectDomain(
                                                      item.domain_name,
                                                      item.id
                                                    )
                                                  }
                                                >
                                                  <a
                                                    className="underline-text"
                                                    style={{
                                                      // marginTop: "10px",
                                                      marginLeft: "15px",
                                                      fontSize: "15px",
                                                      color: "white",
                                                      fontWeight: "600",
                                                    }}
                                                    onMouseOver={(e) => (
                                                      (e.target.style.fontWeight =
                                                        "800"),
                                                      (e.target.style.fontSize =
                                                        "16px"),
                                                      (e.target.style.textDecoration =
                                                        "underline")
                                                    )}
                                                    onMouseOut={(e) => (
                                                      (e.target.style.fontWeight =
                                                        "600"),
                                                      (e.target.style.fontSize =
                                                        "15px"),
                                                      (e.target.style.textDecoration =
                                                        "none")
                                                    )}
                                                  >
                                                    Enable HTTPS Redirect
                                                  </a>
                                                </div>
                                              ) : (
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  <img
                                                    src="/images/verified_success.png"
                                                    style={{
                                                      height: "28px",
                                                      width: "28px",
                                                      zIndex: "9",
                                                      position: "relative",
                                                      marginTop: "-2px",
                                                      //left: "1%",
                                                    }}
                                                  />
                                                  <div
                                                    style={{
                                                      width: "auto",
                                                      height: "30px",
                                                      // marginTop: "10px",
                                                      marginLeft: "5px",
                                                    }}
                                                  >
                                                    <a
                                                      onClick={() =>
                                                        redirectDomain(
                                                          item.domain_name,
                                                          item.id
                                                        )
                                                      }
                                                      className="underline-text"
                                                      style={{
                                                        // marginTop: "10px",
                                                        // marginLeft: "15px",
                                                        fontSize: "15px",
                                                        color: "white",
                                                        fontWeight: "600",
                                                      }}
                                                      onMouseOver={(e) => (
                                                        (e.target.style.fontWeight =
                                                          "800"),
                                                        (e.target.style.fontSize =
                                                          "16px"),
                                                        (e.target.style.textDecoration =
                                                          "underline")
                                                      )}
                                                      onMouseOut={(e) => (
                                                        (e.target.style.fontWeight =
                                                          "600"),
                                                        (e.target.style.fontSize =
                                                          "15px"),
                                                        (e.target.style.textDecoration =
                                                          "none")
                                                      )}
                                                    >
                                                      ReVerify
                                                    </a>
                                                  </div>
                                                </div>
                                              )}
                                            </td>
                                            <td
                                              style={{
                                                backgroundColor: "transparent",
                                                border: "1px solid white",
                                                paddingTop: "10px",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  width: "auto",
                                                  height: "30px",
                                                  // marginTop: "10px",
                                                  // marginLeft: "1rem",
                                                }}
                                              >
                                                <a
                                                  onClick={() => {
                                                    setSelectDomainNameForDelete(
                                                      item.domain_name
                                                    );
                                                    setSelectDomainIdForDelete(
                                                      item.id
                                                    );
                                                    SetDeletePopup(true);
                                                  }}
                                                  className="underline-text"
                                                  style={{
                                                    // marginTop: "10px",
                                                    // marginLeft: "15px",
                                                    fontSize: "15px",
                                                    color: "white",
                                                    fontWeight: "600",
                                                  }}
                                                  onMouseOver={(e) => (
                                                    (e.target.style.fontWeight =
                                                      "800"),
                                                    (e.target.style.fontSize =
                                                      "16px"),
                                                    (e.target.style.textDecoration =
                                                      "underline")
                                                  )}
                                                  onMouseOut={(e) => (
                                                    (e.target.style.fontWeight =
                                                      "600"),
                                                    (e.target.style.fontSize =
                                                      "15px"),
                                                    (e.target.style.textDecoration =
                                                      "none")
                                                  )}
                                                >
                                                  Remove
                                                </a>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* <div className="flip-card-back">
                        <h2>HTTPS Redirect Back</h2>
                        <p>HTTPS Redirect configuration details go here</p>
                      </div> */}
                      </div>
                    </div>
                  )}

                  {activeButton === "Generate URL" && (
                    <div
                      className={`flip-card ${isFlipped ? "flipped" : ""}`}
                      style={{ marginTop: "8px" }}
                    >
                      <div className="flip-card-inner">
                        {/* HTTPS Redirect View */}
                        <div className="flip-card-front">
                          <div
                            style={{
                              backgroundImage: `url("/images/blue-box-bg.svg")`,
                              backgroundSize: "cover",
                              top: "20px",
                              width: "100%",
                              height: "160%",
                              padding: "10px 10px",
                              position: "relative",
                              backgroundColor: "#07528b", // Use backgroundColor instead of background
                              borderRadius: "12px",
                              // flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={() => {
                                exportToExcelGenerateURL(urlPortList);
                              }}
                              style={{
                                zIndex: "99999",
                                border: "none",
                                backgroundColor: "transparent",
                                position: "absolute", // Position it absolutely within the div
                                top: "15px", // Adjust as needed for spacing
                                right: "10px",
                              }}
                            >
                              <img
                                className="hover-zoom"
                                src="/images/images/download_excel.png"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                  marginLeft: "98rem",
                                  marginTop: "5px",
                                }}
                              />
                            </button>
                            <div
                              className="table-row-noti"
                              style={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                marginLeft: "0px",
                              }}
                            >
                              <div
                                className="message"
                                style={{ width: "100%" }}
                              >
                                <Row>
                                  <div className="col-md-5">
                                    <div
                                      className="btn"
                                      style={{
                                        background: "white",
                                        color: "#035189",
                                        height: "35px",
                                        fontSize: "18px",
                                      }}
                                    >
                                      Product Table
                                    </div>
                                    <div
                                      style={{
                                        maxHeight: "150px",
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        marginTop: "20px",
                                      }}
                                    >
                                      {portList &&
                                      portList.reverse().length === 0 ? (
                                        <div
                                          style={{
                                            marginLeft: "50px",
                                            border: "1px solid white",
                                            padding: "10px",
                                            backgroundColor: "transparent",
                                            color: "white",
                                            // width: "60%",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          No Port Found
                                        </div>
                                      ) : (
                                        <table
                                          className="table"
                                          style={{
                                            borderCollapse: "collapse",
                                            width: "100%",
                                          }}
                                        >
                                          <thead>
                                            <tr>
                                              <th
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  backgroundColor:
                                                    "transparent",
                                                  width: "20%",
                                                  color: "white",
                                                }}
                                              >
                                                Product Tag
                                              </th>
                                              <th
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  backgroundColor:
                                                    "transparent",
                                                  // width: "75%",
                                                  color: "white",
                                                }}
                                              >
                                                Port Number
                                              </th>
                                              <th
                                                colspan="2"
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  width: "20%",
                                                  backgroundColor:
                                                    "transparent",
                                                  color: "white",
                                                }}
                                              >
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {portList &&
                                              portList
                                                .reverse()
                                                .filter((item) =>
                                                  item.port
                                                    .toLowerCase()
                                                    .includes(
                                                      searchText.toLowerCase()
                                                    )
                                                )
                                                .map((item, idx) => (
                                                  <tr>
                                                    <td
                                                      className="domain-name"
                                                      style={{
                                                        border:
                                                          "1px solid white",
                                                        padding: "10px",
                                                        backgroundColor:
                                                          "transparent",
                                                        color: "white",
                                                        // width: "10%",
                                                        whiteSpace: "nowrap",
                                                        textOverflow:
                                                          "ellipsis",
                                                        overflow: "hidden",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                      }}
                                                    >
                                                      <img
                                                        src={
                                                          portList &&
                                                          item.port_icon
                                                        }
                                                        style={{
                                                          height: "28px",
                                                          width: "80px",
                                                          zIndex: "9",
                                                          position: "relative",
                                                          paddingTop: "5px",
                                                          //left: "1%",
                                                        }}
                                                      />
                                                    </td>
                                                    <td
                                                      className="domain-name"
                                                      style={{
                                                        border:
                                                          "1px solid white",
                                                        padding: "10px",
                                                        backgroundColor:
                                                          "transparent",
                                                        color: "white",
                                                        // width: "80%",
                                                        whiteSpace: "nowrap",
                                                        textOverflow:
                                                          "ellipsis",
                                                        overflow: "hidden",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                      }}
                                                    >
                                                      {item.port}
                                                    </td>

                                                    <td
                                                      style={{
                                                        backgroundColor:
                                                          "transparent",
                                                        border:
                                                          "1px solid white",
                                                        paddingTop: "10px",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          width: "auto",
                                                          height: "30px",
                                                          // marginTop: "10px",
                                                          // marginLeft: "1rem",
                                                        }}
                                                        onClick={() => {
                                                          generatePortURL(
                                                            item.port_name,
                                                            item.port,
                                                            item.id
                                                          );
                                                        }}
                                                      >
                                                        <a
                                                          className="underline-text"
                                                          style={{
                                                            // marginTop: "10px",
                                                            // marginLeft: "15px",
                                                            fontSize: "15px",
                                                            color: "white",
                                                            fontWeight: "600",
                                                          }}
                                                          onMouseOver={(e) => (
                                                            (e.target.style.fontWeight =
                                                              "800"),
                                                            (e.target.style.fontSize =
                                                              "16px"),
                                                            (e.target.style.textDecoration =
                                                              "underline")
                                                          )}
                                                          onMouseOut={(e) => (
                                                            (e.target.style.fontWeight =
                                                              "600"),
                                                            (e.target.style.fontSize =
                                                              "15px"),
                                                            (e.target.style.textDecoration =
                                                              "none")
                                                          )}
                                                        >
                                                          Generate
                                                        </a>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                    {smuser && smuser.custom_port === 0 ? (
                                      <div
                                        className="btn"
                                        style={{
                                          background: "white",
                                          color: "#035189",
                                          height: "35px",
                                          fontSize: "18px",
                                          marginTop: "15px",
                                        }}
                                        onClick={() => {
                                          setCustomSupportPopup(true);
                                        }}
                                      >
                                        Request Custom Port
                                      </div>
                                    ) : (
                                      <table
                                        className="table"
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                          marginTop: "15px",
                                        }}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              style={{
                                                border: "1px solid white",
                                                padding: "8px",
                                                backgroundColor: "transparent",
                                                width: "18%",
                                                color: "white",
                                                textAlign: "left",
                                              }}
                                            >
                                              <input
                                                type="text"
                                                id="Domain"
                                                className="input-signup"
                                                name="Domain"
                                                placeholder="Custom Tag"
                                                value={customProductTagText}
                                                style={{
                                                  fontSize: "14px",
                                                  //   color: "white",
                                                  //   // border: "none",
                                                  //   // border: "2px solid #ffff",
                                                  //   // borderColor: "white",
                                                  //   // borderRadius: "30px",
                                                  //   // outline: "none",
                                                  width: "100%",
                                                  height: "20px",
                                                  //   background: "transparent",
                                                  //   flex: "1",
                                                  //   padding: "15px",
                                                }}
                                                onChange={(e) =>
                                                  setCustomProductTag(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </th>
                                            <th
                                              style={{
                                                border: "1px solid white",
                                                padding: "8px",
                                                backgroundColor: "transparent",
                                                width: "53%",
                                                color: "white",
                                                textAlign: "center",
                                              }}
                                            >
                                              <input
                                                type="text"
                                                id="Domain"
                                                className="input-signup"
                                                name="Domain"
                                                placeholder="Custom Port Number"
                                                value={customPortNumberText}
                                                style={{
                                                  fontSize: "14px",
                                                  textAlign: "center",
                                                  //   color: "white",
                                                  //   // border: "none",
                                                  //   // border: "2px solid #ffff",
                                                  //   // borderColor: "white",
                                                  //   // borderRadius: "30px",
                                                  //   // outline: "none",
                                                  width: "100%",
                                                  height: "20px",
                                                  //   background: "transparent",
                                                  //   flex: "1",
                                                  //   padding: "15px",
                                                }}
                                                onChange={(e) =>
                                                  setCustomPortNumber(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </th>
                                            <th
                                              colspan="2"
                                              style={{
                                                border: "1px solid white",
                                                padding: "8px",
                                                width: "20%",
                                                backgroundColor: "transparent",
                                                color: "white",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  paddingTop: "5px",
                                                  width: "auto",
                                                  height: "30px",
                                                  // marginTop: "10px",
                                                  // marginLeft: "1rem",
                                                }}
                                                onClick={() => {
                                                  otherPortURL();
                                                }}
                                              >
                                                <a
                                                  className="underline-text"
                                                  style={{
                                                    // marginTop: "10px",
                                                    // marginLeft: "15px",
                                                    fontSize: "15px",
                                                    color: "white",
                                                    fontWeight: "600",
                                                  }}
                                                  onMouseOver={(e) => (
                                                    (e.target.style.fontWeight =
                                                      "800"),
                                                    (e.target.style.fontSize =
                                                      "16px"),
                                                    (e.target.style.textDecoration =
                                                      "underline")
                                                  )}
                                                  onMouseOut={(e) => (
                                                    (e.target.style.fontWeight =
                                                      "600"),
                                                    (e.target.style.fontSize =
                                                      "15px"),
                                                    (e.target.style.textDecoration =
                                                      "none")
                                                  )}
                                                >
                                                  Generate
                                                </a>
                                              </div>
                                            </th>
                                          </tr>
                                        </thead>
                                      </table>
                                    )}
                                  </div>

                                  {/* URL Table */}
                                  <div className="col-md-7">
                                    <div
                                      className="btn"
                                      style={{
                                        background: "white",
                                        color: "#035189",
                                        height: "35px",
                                        fontSize: "18px",
                                      }}
                                    >
                                      URL Table
                                    </div>
                                    <div
                                      style={{
                                        maxHeight: "190px",
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        marginTop: "20px",
                                      }}
                                    >
                                      {urlPortList &&
                                      // .reverse()
                                      // .filter((item) => item.port_name)
                                      urlPortList.length === 0 ? (
                                        <div
                                          style={{
                                            // marginLeft: "50px",
                                            border: "1px solid white",
                                            padding: "10px",
                                            backgroundColor: "transparent",
                                            color: "white",
                                            // width: "60%",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          No URL Found
                                        </div>
                                      ) : (
                                        <table
                                          className="table"
                                          style={{
                                            borderCollapse: "collapse",
                                            width: "100%",
                                          }}
                                        >
                                          <thead>
                                            <tr>
                                              <th
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  backgroundColor:
                                                    "transparent",
                                                  width: "20%",
                                                  color: "white",
                                                }}
                                              >
                                                Product Tag
                                              </th>
                                              <th
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  backgroundColor:
                                                    "transparent",
                                                  // width: "20%",
                                                  color: "white",
                                                }}
                                              >
                                                Port URL
                                              </th>
                                              <th
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  backgroundColor:
                                                    "transparent",
                                                  // width: "20%",
                                                  color: "white",
                                                }}
                                              >
                                                Destination Port
                                              </th>
                                              <th
                                                colspan="2"
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "8px",
                                                  width: "20%",
                                                  backgroundColor:
                                                    "transparent",
                                                  color: "white",
                                                }}
                                              >
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {urlPortList &&
                                              urlPortList
                                                .reverse()
                                                .filter((item) =>
                                                  item.generated_url
                                                    .toLowerCase()
                                                    .includes(
                                                      searchText.toLowerCase()
                                                    )
                                                )
                                                .map((item, idx) => (
                                                  <tr>
                                                    <td
                                                      style={{
                                                        backgroundColor:
                                                          "transparent",
                                                        border:
                                                          "1px solid white",
                                                        paddingTop: "10px",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          width: "auto",
                                                          height: "30px",
                                                          // marginTop: "10px",
                                                          // marginLeft: "1rem",
                                                        }}
                                                        // onClick={() => {
                                                        //   renamePort(
                                                        //     item.port_name,
                                                        //     item.id
                                                        //   );
                                                        // }}
                                                      >
                                                        <a
                                                          //className="underline-text"
                                                          style={{
                                                            // marginTop: "10px",
                                                            // marginLeft: "15px",
                                                            fontSize: "15px",
                                                            color: "white",
                                                            fontWeight: "600",
                                                          }}
                                                          // onMouseOver={(e) => (
                                                          //   (e.target.style.fontWeight =
                                                          //     "800"),
                                                          //   (e.target.style.fontSize =
                                                          //     "16px"),
                                                          //   (e.target.style.textDecoration =
                                                          //     "underline")
                                                          // )}
                                                          // onMouseOut={(e) => (
                                                          //   (e.target.style.fontWeight =
                                                          //     "600"),
                                                          //   (e.target.style.fontSize =
                                                          //     "15px"),
                                                          //   (e.target.style.textDecoration =
                                                          //     "none")
                                                          // )}
                                                        >
                                                          {/* Rename */}
                                                          {item.port_name}
                                                        </a>
                                                      </div>
                                                    </td>
                                                    <td
                                                      className="domain-name"
                                                      style={{
                                                        border:
                                                          "1px solid white",
                                                        padding: "10px",
                                                        backgroundColor:
                                                          "transparent",
                                                        color: "white",
                                                        // width: "60%",
                                                        whiteSpace: "nowrap",
                                                        textOverflow:
                                                          "ellipsis",
                                                        overflow: "hidden",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                      }}
                                                    >
                                                      {monitorData &&
                                                        monitorData.public_ip}
                                                      :{item.source_port}
                                                    </td>

                                                    <td
                                                      className="domain-name"
                                                      style={{
                                                        border:
                                                          "1px solid white",
                                                        padding: "10px",
                                                        backgroundColor:
                                                          "transparent",
                                                        color: "white",
                                                        // width: "60%",
                                                        whiteSpace: "nowrap",
                                                        textOverflow:
                                                          "ellipsis",
                                                        overflow: "hidden",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                      }}
                                                    >
                                                      {item.destination_port}
                                                    </td>

                                                    <td
                                                      style={{
                                                        backgroundColor:
                                                          "transparent",
                                                        border:
                                                          "1px solid white",
                                                        paddingTop: "10px",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          width: "auto",
                                                          height: "30px",
                                                          // marginTop: "10px",
                                                          // marginLeft: "1rem",
                                                        }}
                                                        onClick={() => {
                                                          removePort(item.id);
                                                        }}
                                                      >
                                                        <a
                                                          className="underline-text"
                                                          style={{
                                                            // marginTop: "10px",
                                                            // marginLeft: "15px",
                                                            fontSize: "15px",
                                                            color: "white",
                                                            fontWeight: "600",
                                                          }}
                                                          onMouseOver={(e) => (
                                                            (e.target.style.fontWeight =
                                                              "800"),
                                                            (e.target.style.fontSize =
                                                              "16px"),
                                                            (e.target.style.textDecoration =
                                                              "underline")
                                                          )}
                                                          onMouseOut={(e) => (
                                                            (e.target.style.fontWeight =
                                                              "600"),
                                                            (e.target.style.fontSize =
                                                              "15px"),
                                                            (e.target.style.textDecoration =
                                                              "none")
                                                          )}
                                                        >
                                                          Remove
                                                        </a>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                  </div>
                                </Row>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flip-card-back">
                        <h2>HTTPS Redirect Back</h2>
                        <p>HTTPS Redirect configuration details go here</p>
                      </div> */}
                      </div>
                    </div>
                  )}

                  {activeButton === "BackUp Plans" && (
                    <div
                      style={{
                        backgroundImage: `url("/images/blue-box-bg.svg")`,
                        backgroundSize: "cover",
                        // top: "0rem",
                        marginTop: "28px",
                        width: "100%",
                        height: "100%",
                        padding: "25px 25px",
                        position: "relative",
                        backgroundColor: "#07528b", // Use backgroundColor instead of background
                        borderRadius: "12px",
                        // flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          maxHeight: "255px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <table
                          className="table"
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "40%",
                                  color: "white",
                                }}
                              >
                                Plan Name
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "20%",
                                  color: "white",
                                }}
                              >
                                Price
                              </th>
                              <th
                                colspan="2"
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  color: "white",
                                }}
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          {vmBackUpPlansList &&
                            vmBackUpPlansList.map((item, idx) => (
                              <tbody>
                                <tr>
                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {item.plan_name}
                                  </td>

                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {currencyReturn({
                                      price: item.price,
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}
                                  </td>
                                  {monitorData &&
                                  monitorData.bpid !== null &&
                                  monitorData.bpid !== "" ? (
                                    <td
                                      style={{
                                        backgroundColor: "transparent",
                                        border: "1px solid white",
                                        paddingTop: "10px",
                                      }}
                                    >
                                      <div
                                        className="domain-name"
                                        style={{
                                          backgroundColor: "transparent",
                                          color: "white",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "auto",
                                            height: "30px",
                                          }}
                                        >
                                          <img
                                            src="/images/verified_success.png"
                                            style={{
                                              height: "30px",
                                              width: "30px",
                                              zIndex: "9",
                                              position: "relative",
                                            }}
                                          />{" "}
                                          Active
                                        </div>
                                      </div>
                                    </td>
                                  ) : (
                                    <td
                                      style={{
                                        backgroundColor: "transparent",
                                        border: "1px solid white",
                                        paddingTop: "10px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "auto",
                                          height: "30px",
                                        }}
                                        onClick={() =>
                                          vmBuyBackupPlan(item.bpid, item.price)
                                        }
                                      >
                                        <a
                                          className="underline-text"
                                          style={{
                                            fontSize: "15px",
                                            color: "white",
                                            fontWeight: "600",
                                          }}
                                          onMouseOver={(e) => (
                                            (e.target.style.fontWeight = "800"),
                                            (e.target.style.fontSize = "17px"),
                                            (e.target.style.textDecoration =
                                              "underline")
                                          )}
                                          onMouseOut={(e) => (
                                            (e.target.style.fontWeight = "600"),
                                            (e.target.style.fontSize = "15px"),
                                            (e.target.style.textDecoration =
                                              "none")
                                          )}
                                        >
                                          Buy Plan
                                        </a>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            ))}
                        </table>
                      </div>
                    </div>
                  )}

                  {activeButton === "Firewall Plans" && (
                    <div
                      style={{
                        backgroundImage: `url("/images/blue-box-bg.svg")`,
                        backgroundSize: "cover",
                        // top: "0rem",
                        marginTop: "28px",
                        width: "100%",
                        height: "100%",
                        padding: "25px 25px",
                        position: "relative",
                        backgroundColor: "#07528b", // Use backgroundColor instead of background
                        borderRadius: "12px",
                        // flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          maxHeight: "255px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <table
                          className="table"
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "25%",
                                  color: "white",
                                }}
                              >
                                Plan Name
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "10%",
                                  color: "white",
                                }}
                              >
                                Direction
                              </th>
                              <th
                                // colspan="2"
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "10%",
                                  color: "white",
                                }}
                              >
                                Decision
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "10%",
                                  color: "white",
                                }}
                              >
                                Protocol
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "15%",
                                  color: "white",
                                }}
                              >
                                S Port
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "15%",
                                  color: "white",
                                }}
                              >
                                D Port
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "10%",
                                  color: "white",
                                }}
                              >
                                Source
                              </th>
                            </tr>
                          </thead>
                          {vmBackUpPlansList &&
                            vmBackUpPlansList.map((item, idx) => (
                              <tbody>
                                <tr>
                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {/* {item.plan_name} */}
                                  </td>

                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {/* {currencyReturn({
                                      price: item.price,
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })} */}
                                  </td>
                                  {monitorData &&
                                  monitorData.bpid !== null &&
                                  monitorData.bpid !== "" ? (
                                    <td
                                      style={{
                                        backgroundColor: "transparent",
                                        border: "1px solid white",
                                        paddingTop: "10px",
                                      }}
                                    >
                                      <div
                                        className="domain-name"
                                        style={{
                                          backgroundColor: "transparent",
                                          color: "white",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "auto",
                                            height: "30px",
                                          }}
                                        >
                                          {/* <img
                                            src="/images/verified_success.png"
                                            style={{
                                              height: "30px",
                                              width: "30px",
                                              zIndex: "9",
                                              position: "relative",
                                              // marginTop: "-70px",
                                              //left: "1%",
                                            }}
                                          />{" "}
                                          Active */}
                                        </div>
                                      </div>
                                    </td>
                                  ) : (
                                    <td
                                      style={{
                                        backgroundColor: "transparent",
                                        border: "1px solid white",
                                        paddingTop: "10px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "auto",
                                          height: "30px",
                                        }}
                                        onClick={() =>
                                          vmBuyBackupPlan(item.bpid, item.price)
                                        }
                                      >
                                        <a
                                          className="underline-text"
                                          style={{
                                            fontSize: "15px",
                                            color: "white",
                                            fontWeight: "600",
                                          }}
                                          onMouseOver={(e) => (
                                            (e.target.style.fontWeight = "800"),
                                            (e.target.style.fontSize = "17px"),
                                            (e.target.style.textDecoration =
                                              "underline")
                                          )}
                                          onMouseOut={(e) => (
                                            (e.target.style.fontWeight = "600"),
                                            (e.target.style.fontSize = "15px"),
                                            (e.target.style.textDecoration =
                                              "none")
                                          )}
                                        >
                                          Buy Plan
                                        </a>
                                      </div>
                                    </td>
                                  )}
                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {/* {item.plan_name} */}
                                  </td>
                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {/* {item.plan_name} */}
                                  </td>
                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {/* {item.plan_name} */}
                                  </td>
                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {/* {item.plan_name} */}
                                  </td>
                                </tr>
                              </tbody>
                            ))}
                        </table>
                      </div>
                    </div>
                  )}

                  {/* BackUpView */}
                  {isShowBackupView && (
                    <div
                      style={{
                        backgroundImage: `url("/images/blue-box-bg.svg")`,
                        backgroundSize: "cover",
                        // top: "0rem",
                        marginTop: "28px",
                        width: "100%",
                        height: "100%",
                        padding: "25px 25px",
                        position: "relative",
                        backgroundColor: "#07528b", // Use backgroundColor instead of background
                        borderRadius: "12px",
                        // flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          maxHeight: "240px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          textAlign: "center",
                        }}
                      >
                        {vmBackUpList &&
                        Object.entries(vmBackUpList).length === 0 ? (
                          <div
                            style={{
                              // marginLeft: "50px",
                              border: "1px solid white",
                              padding: "10px",
                              backgroundColor: "transparent",
                              color: "white",
                              // width: "60%",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            No BackUp Found
                          </div>
                        ) : (
                          <table
                            className="table"
                            style={{
                              borderCollapse: "collapse",
                              width: "100%",
                            }}
                          >
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    width: "50%",
                                    color: "white",
                                  }}
                                >
                                  BackUp
                                </th>
                                <th
                                  colspan="2"
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    color: "white",
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {vmBackUpList &&
                                Object.entries(vmBackUpList).length > 0 &&
                                Object.entries(vmBackUpList).map(
                                  ([key, item], idx) => (
                                    <React.Fragment key={key}>
                                      {/* Parent Row */}
                                      <tr>
                                        <td
                                          className="domain-name"
                                          style={{
                                            border: "1px solid white",
                                            padding: "10px",
                                            backgroundColor: "transparent",
                                            color: "white",
                                          }}
                                        >
                                          {`${item.vpsid}F${item.time}_${
                                            item.htime.split("-")[0]
                                          }_${item.htime.split("-")[1]}`}
                                        </td>
                                        <td
                                          style={{
                                            backgroundColor: "transparent",
                                            border: "1px solid white",
                                            paddingTop: "10px",
                                            textAlign: "center",
                                            verticalAlign: "middle",
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              width: "85px",
                                              height: "30px",
                                              backgroundColor: "white",
                                              borderRadius: "6px",
                                              marginLeft: "45%",
                                            }}
                                            onClick={() => {
                                              {
                                                if (isLoginByParentUser == 1) {
                                                  SetVMRestorePopup(true);
                                                  setSelectedParentTime(
                                                    item.time
                                                  );
                                                  setSelectedBackupForRestore(
                                                    item
                                                  );
                                                } else {
                                                  SetChildUserContentPopup(
                                                    true
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            <a
                                              className="underline-text"
                                              style={{
                                                fontSize: "15px",
                                                color: "#035189",
                                                fontWeight: "600",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%",
                                                width: "100%",
                                                textAlign: "center",
                                              }}
                                              onMouseOver={(e) => (
                                                (e.target.style.fontWeight =
                                                  "800"),
                                                (e.target.style.fontSize =
                                                  "16px"),
                                                (e.target.style.textDecoration =
                                                  "underline")
                                              )}
                                              onMouseOut={(e) => (
                                                (e.target.style.fontWeight =
                                                  "600"),
                                                (e.target.style.fontSize =
                                                  "15px"),
                                                (e.target.style.textDecoration =
                                                  "none")
                                              )}
                                            >
                                              Restore
                                            </a>
                                          </div>
                                        </td>
                                      </tr>

                                      {/* Children Rows */}
                                      {item.children &&
                                        Object.entries(item.children).map(
                                          ([childKey, childItem]) => (
                                            <tr key={childKey}>
                                              <td
                                                style={{
                                                  border: "1px solid white",
                                                  padding: "10px",
                                                  backgroundColor:
                                                    "transparent",
                                                  color: "white",
                                                }}
                                              >
                                                {`${item.vpsid}I${
                                                  childItem.time
                                                }_${
                                                  childItem.htime.split("-")[0]
                                                }_${
                                                  childItem.htime.split("-")[1]
                                                }`}
                                              </td>
                                              <td
                                                style={{
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "1px solid white",
                                                  paddingTop: "10px",
                                                  textAlign: "center",
                                                  verticalAlign: "middle",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: "85px",
                                                    height: "30px",
                                                    backgroundColor: "white",
                                                    borderRadius: "6px",
                                                    marginLeft: "45%",
                                                  }}
                                                  onClick={() => {
                                                    if (
                                                      isLoginByParentUser == 1
                                                    ) {
                                                      SetVMRestorePopup(true);
                                                      setSelectedParentTime(
                                                        item.time
                                                      );
                                                      setSelectedBackupForRestore(
                                                        childItem
                                                      );
                                                    } else {
                                                      SetChildUserContentPopup(
                                                        true
                                                      );
                                                    }
                                                  }}
                                                >
                                                  <a
                                                    className="underline-text"
                                                    style={{
                                                      fontSize: "15px",
                                                      color: "#035189",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                      height: "100%",
                                                      width: "100%",
                                                      textAlign: "center",
                                                    }}
                                                    onMouseOver={(e) => (
                                                      (e.target.style.fontWeight =
                                                        "800"),
                                                      (e.target.style.fontSize =
                                                        "16px"),
                                                      (e.target.style.textDecoration =
                                                        "underline")
                                                    )}
                                                    onMouseOut={(e) => (
                                                      (e.target.style.fontWeight =
                                                        "600"),
                                                      (e.target.style.fontSize =
                                                        "15px"),
                                                      (e.target.style.textDecoration =
                                                        "none")
                                                    )}
                                                  >
                                                    Restore
                                                  </a>
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                    </React.Fragment>
                                  )
                                )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  )}

                  {/* VM List View */}
                  {isShowVMView && (
                    <div
                      style={{
                        backgroundImage: `url("/images/blue-box-bg.svg")`,
                        backgroundSize: "cover",
                        // top: "0rem",
                        marginTop: "28px",
                        width: "100%",
                        height: "100%",
                        padding: "25px 25px",
                        position: "relative",
                        backgroundColor: "#07528b", // Use backgroundColor instead of background
                        borderRadius: "12px",
                        // flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          maxHeight: "255px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <table
                          className="table"
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "20%",
                                  color: "white",
                                }}
                              >
                                VM Name
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "10%",
                                  color: "white",
                                }}
                              >
                                Public IP
                              </th>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width: "10%",
                                  color: "white",
                                }}
                              >
                                Private IP
                              </th>
                              <th
                                colspan="2"
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  color: "white",
                                }}
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          {machineData &&
                            machineData.map((item, idx) => (
                              <tbody>
                                <tr>
                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {item.vm_name}
                                  </td>

                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {item.public_ip}
                                  </td>
                                  <td
                                    className="domain-name"
                                    style={{
                                      border: "1px solid white",
                                      padding: "10px",
                                      backgroundColor: "transparent",
                                      color: "white",
                                    }}
                                  >
                                    {item.ip_address}
                                  </td>
                                  <td
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "1px solid white",
                                      paddingTop: "10px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "auto",
                                        height: "30px",
                                      }}
                                      onClick={() => ""}
                                    >
                                      <a
                                        className="underline-text"
                                        style={{
                                          fontSize: "15px",
                                          color: "white",
                                          fontWeight: "600",
                                        }}
                                        onMouseOver={(e) => (
                                          (e.target.style.fontWeight = "800"),
                                          (e.target.style.fontSize = "16px"),
                                          (e.target.style.textDecoration =
                                            "underline")
                                        )}
                                        onMouseOut={(e) => (
                                          (e.target.style.fontWeight = "600"),
                                          (e.target.style.fontSize = "15px"),
                                          (e.target.style.textDecoration =
                                            "none")
                                        )}
                                      >
                                        Restore
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            ))}
                        </table>
                      </div>
                    </div>
                  )}

                  {/* VM Progress View */}
                  {isShowProgressView && (
                    <div
                      style={{
                        backgroundImage: `url("/images/blue-box-bg.svg")`,
                        backgroundSize: "cover",
                        // top: "0rem",
                        marginTop: "28px",
                        width: "100%",
                        height: "100%",
                        padding: "25px 25px",
                        position: "relative",
                        backgroundColor: "#07528b", // Use backgroundColor instead of background
                        borderRadius: "12px",
                        // flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          maxHeight: "255px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <table
                          className="table"
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: "1px solid white",
                                  padding: "8px",
                                  backgroundColor: "transparent",
                                  width:
                                    isIntializing === true ? "100%" : "50%",
                                  color: "white",
                                }}
                              >
                                {isIntializing === true ? "Restore" : "BackUp"}
                              </th>

                              {isIntializing === true ? (
                                ""
                              ) : (
                                <th
                                  colspan="2"
                                  style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "transparent",
                                    color: "white",
                                  }}
                                >
                                  Status
                                </th>
                              )}
                            </tr>
                          </thead>

                          <tbody>
                            {isIntializing === true ? (
                              <div className="loading-text">
                                Initializing<span className="dots"></span>
                              </div>
                            ) : (
                              <tr>
                                <td
                                  className="domain-name"
                                  style={{
                                    border: "1px solid white",
                                    padding: "10px",
                                    backgroundColor: "transparent",
                                    color: "white",
                                  }}
                                >
                                  {progressToMachine}
                                </td>

                                <td
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "1px solid white",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: "5px", // Adds space between progress bar and percentage
                                    }}
                                  >
                                    {isBackUpFail ? (
                                      <div
                                        className="domain-name"
                                        style={{
                                          backgroundColor: "transparent",
                                          color: "white",
                                        }}
                                      >
                                        Backup Failed
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    {isBackUpFail !== true &&
                                    progressPercentage === "100" ? (
                                      <div
                                        className="domain-name"
                                        style={{
                                          backgroundColor: "transparent",
                                          color: "white",
                                        }}
                                      >
                                        <img
                                          src="/images/verified_success.png"
                                          style={{
                                            height: "30px",
                                            width: "30px",
                                            zIndex: "9",
                                            position: "relative",
                                          }}
                                        />{" "}
                                        Completed
                                      </div>
                                    ) : isBackUpFail !== true ? (
                                      <div
                                        className="progress-cont"
                                        id="progress-cont14791"
                                      >
                                        <div
                                          className="progress_14791 progress"
                                          style={{ border: "2px" }}
                                        >
                                          <div
                                            className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                                            style={{
                                              width: `${progressPercentage}%`,
                                              display: "flex",
                                            }}
                                            id="progressbar14791"
                                          ></div>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </Row>
          </div>
        </div>
      )}
      <div className="apptoast-align">
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          {showTick ? (
            <div class="checkmark-wrapper">
              <div class="checkmark-border">
                <svg class="checkmark" viewBox="0 0 52 52">
                  <circle
                    class="checkmark-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    class="checkmark-check"
                    fill="none"
                    d="M14 27l7 7 16-16"
                  />
                </svg>
              </div>
            </div>
          ) : isRegenerateSSH ? (
            <>
              <div style={styles.container}>
                <div
                  style={{ ...styles.progress, width: `${progress}%` }}
                ></div>
                <span style={styles.label}>{`${Math.round(progress)}%`}</span>
              </div>
            </>
          ) : (
            loading && <Loader isLoading={loading} />
          )}
        </div>
      )}
    </div>
  );
};

export default MachineStatus;
