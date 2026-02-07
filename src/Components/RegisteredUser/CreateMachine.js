import React, { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import "./CreateMachine.css";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "../../Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";
import { FaX } from "react-icons/fa6";

const CreateMachine = (props) => {
    const { isMobile } = props;
    const { smuser, appCurrency, isLoginByParentUser } = useAuth();
    const { updateUserDetails, updateCurrencyRate, updateAppCurrency } =
        useAuth();
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [showTermsCondition, setShowTermsCondition] = useState(false);
    const [customCPU, setCustomCPU] = useState(0);
    const [customRAM, setCustomRAM] = useState(0);
    const [customDISK, setCustomDISK] = useState(0);
    const [customDATAT, setCustomDATAT] = useState(0);
    const [diskType, setDisktype] = useState("ssd");

    const handleMouseEnter = (index) => {
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };
    const innerButtons = ["Standard", "CPU Proactive", "RAM Proactive"];
    const [configType, setConfigType] = useState(1);
    const [selectedCPU, setSelectedCPU] = useState(0);
    const [selectedRAM, setSelectedRAM] = useState(0);
    const [selectedSSD, setSelectedSSD] = useState(0);
    const [selectedDT, setSelectedDT] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState(null);

    const [activeButton, setActiveButton] = useState("Standard");
    const [activePage, setActivePage] = useState("Standard");
    const [finalAmount, setFinalAmount] = useState("0");
    const [showJumpServerPopup, setShowJumpServerPopup] = useState(false);
    const [jumpServerDetails, setJumpServerDetails] = useState(null);
    const [loadingJumpServer, setLoadingJumpServer] = useState(false);

    const [machineAmt, setMachineAmt] = useState("0");
    const NativePages = [
        "Standard",
        "CPU Proactive",
        "RAM Proactive",
        "Custom Configure",
    ];

    const CloudPages = ["Standard", "CPU Proactive", "RAM Proactive"];

    const [loading, setLoading] = useState(true);

    const [ubantuOS, setUbantuOS] = useState(null);
    const [fedoraOS, setFedoraOS] = useState(null);
    const [platformSelected, setPlatformSelected] = useState(null);
    const [ubantu_machine, setUbantu_machine] = useState(null);
    const [fedora_machine, setFedora_machine] = useState(null);

    const [redhat_fa, setRedhat_fa] = useState([]);
    const [windows_fa, setWindows_fa] = useState([]);

    const [centOS_fa, setCentOS_fa] = useState([]);
    const [ubuntu_fa, setUbuntu_fa] = useState([]);

    const [fedora_fa, setFedora_fa] = useState([]);
    const [linux_fa, setLinux_fa] = useState([]);
    const [rocky_fa, setRocky_fa] = useState([]);
    const [debian_fa, setDebian_fa] = useState([]);

    const [standardList, setStandardList] = useState(null);
    const [cpuList, setCPUList] = useState([]);
    const [ramList, setRamList] = useState([]);

    const [standardRates, setStandardRates] = useState({});
    const [cpuIntensiveRates, setCpuIntensiveRates] = useState(null);
    const [ramIntensiveRates, setRamIntensiveRates] = useState(null);

   const [jumpServer, setJumpServer] = useState(0);
    const [stdCusHDD, setStdCusHDD] = useState({});
    const [stdCusSSD, setStdCusSSD] = useState({});
    const [stdCusNVM, setStdCusNVM] = useState({});

    const [cpuCusHDD, setCpuCusHDD] = useState({});
    const [cpuCusSSD, setCpuCusSSD] = useState({});
    const [cpuCusNVM, setCpuCusNVM] = useState({});

    const [ramCusHDD, setRamCusHDD] = useState({});
    const [ramCusSSD, setRamCusSSD] = useState({});
    const [ramCusNVM, setRamCusNVM] = useState({});

    const [sHdd, setSHdd] = useState(null);
    const [sSsd, setSSsd] = useState(null);
    const [sNvm, setSNvm] = useState(null);

    const [cHdd, setCHdd] = useState(null);
    const [cSsd, setCSsd] = useState(null);
    const [cNvm, setCNvm] = useState(null);

    const [rHdd, setRHdd] = useState(null);
    const [rSsd, setRSsd] = useState(null);
    const [rNvm, setRNvm] = useState(null);

    // Create Machine
    const [newMachineName, setNewMachineName] = useState(null);
    const [newMahineOs, setNewMachineOs] = useState(null);
    const [newMahineConfigId, setNewMachineConfigId] = useState(null);
    const [newMachineTime, setNewMachineTime] = useState("1");

    const [showPhoneVerify, setShowPhoneVerify] = useState(false);
    const [phoneOTP, setPhoneOTP] = useState();
    const [phone, setPhone] = useState("");
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [userSystem, setUserSystem] = useState(null);
    const [allOsTemplete, setAllOsTemplete] = useState(null);

    const [discountRate, setDiscountRate] = useState("0");
    const [serverLocaiton, setServerLocaiton] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [custConfigStdHDD, setCustConfigStdHDD] = useState({});
    const [custConfigStdSSD, setCustConfigStdSSD] = useState({});
    const [custConfigStdNVME, setCustConfigStdNVME] = useState({});

    const [custConfigCpuHDD, setCustConfigCpuHDD] = useState({});
    const [custConfigCpuSSD, setCustConfigCpuSSD] = useState({});
    const [custConfigCpuNVME, setCustConfigCpuNVME] = useState({});

    const [custConfigRamHDD, setCustConfigRamHDD] = useState({});
    const [custConfigRamSSD, setCustConfigRamSSD] = useState({});
    const [custConfigRamNVME, setCustConfigRamNVME] = useState({});

    const [custConfigData, setCustConfigData] = useState({});
    const [showIPOptionPopup, setShowIPOptionPopup] = useState(null);

    const [counter, setCounter] = useState(1);
    const [iPPrice, setIPPrice] = useState(0);

    const [sHddStocks, setSHddStocks] = useState(null);
    const [sSsdStocks, setSSsdStocks] = useState(null);
    const [sNvmStocks, setSNvmStocks] = useState(null);

    const [cHddStocks, setCHddStocks] = useState(null);
    const [cSsdStocks, setCSsdStocks] = useState(null);
    const [cNvmStocks, setCNvmStocks] = useState(null);

    const [rHddStocks, setRHddStocks] = useState(null);
    const [rSsdStocks, setRSsdStocks] = useState(null);
    const [rNvmStocks, setRNvmStocks] = useState(null);

    const [stockAvailableStatus, setStockAvailableStatus] = useState(true);
    const [isShowUpnetCreditContentPopup, ShowUpnetCreditContentPopup] =
        useState(false);
    const [upnetPercentage, setUpnetPercentage] = useState(null);
    const [addToWalletAmt, setAddToWalletAmt] = useState(null);
    const [surcharge, setSurcharge] = useState(0);

    const ChangeCurrency = async () => {
        const payload = {
        country: smuser.prefer_currency,
        user_id: smuser.id,
        };
        //console.log(payload);
        try {
        const loginUserResponse = await instance.post(
            "/changescurrency",
            payload,
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

    const PhoneVerifyCall = async () => {
        setLoading(true);
        if (phone !== "") {
            const payload = {
                user_id: smuser.id,
                phone: phone,
                otp: phoneOTP,
                name: smuser.name,
            };
            try {
                const encryptedResponse = await apiEncryptRequest(payload);
                const loginUserResponse = await instance.post(
                "/getmobileotp",
                encryptedResponse,
                );
                const loginResponse = await decryptData(loginUserResponse.data);
                if (phoneOtpSent) {
                // console.log(loginResponse);
                if (loginResponse.status) {
                    toast((t) => (
                    <AppToast id={t.id} message={loginResponse.message} />
                    ));
                    setShowPhoneVerify(false);
                    ChangeCurrency();
                    //   window.location.href = "/vm/create";
                    // } else {
                    //   // console.log(loginResponse, "else status");
                }
                } else {
                // console.log(loginResponse);
                if (loginResponse.status) {
                    // console.log(loginResponse, s"after status");
                    setPhoneOtpSent(true);
                    toast((t) => (
                    <AppToast id={t.id} message={loginResponse.message} />
                    ));
                } else {
                    // console.log(loginResponse, "else status");
                }
                }
                // console.log(loginResponse.data, "<<<<<<getmobileotp");
            } catch (error) {
                console.error("Error during the login process:", error);
            }
        } else {
            toast.error("All fields are required!");
        }
        setLoading(false);
    };

    const GetSubConfigType = (type, diskType) => {
        if (type == 1) {
        return diskType == "hdd"
            ? "standard1"
            : diskType == "ssd"
            ? "standard2"
            : "standard3";
        } else if (type == 2) {
        return diskType == "hdd" ? "cpu1" : diskType == "ssd" ? "cpu2" : "cpu3";
        } else if (type == 3) {
        return diskType == "hdd" ? "ram1" : diskType == "ssd" ? "ram2" : "ram3";
        } else {
        return null;
        }
    };

    const fetchJumpServerDetails = async (jumpServerId) => {
        try {
        setLoadingJumpServer(true);

        const res = await fetch(
            `https://upntcld.com/api/jump-server/details?id=${jumpServerId}`,
        );
        const data = await res.json();
        console.log(data);
        setJumpServerDetails(data);
        setShowJumpServerPopup(true);
        } catch (error) {
        } finally {
        setLoadingJumpServer(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setUserSystem(window.navigator.userAgent); 
        localStorage.removeItem("machineTime");
        if (smuser) {
        setPlatformSelected(smuser.platform_status);
        if (smuser.platform_status == "1") {
            CreateLi();
        } else {
            CreateVm();
        }
        }
    }, [smuser]);

    const handleRedirect = () => {
        const currentTime = new Date().toISOString();
        localStorage.setItem("machineTime", currentTime);
        window.location.href = "/vm-machine";
    };

   const CreateMachine_Li = async (numOfIp, jumpServerValue) => {

        if (smuser.total_credit < finalAmount) {
        setShowIPOptionPopup(false);

        toast((t) => (
            <AppToast
            id={t.id}
            message={
                "Oops! Your wallet balance is low, Please Add Money to create machine"
            }
            isMobile={isMobile}
            />
        ));
        } else if (
          newMahineConfigId !== "" &&
          newMachineName !== "" &&
          newMahineOs !== "" &&
          newMahineOs !== "Select" &&
          newMahineConfigId !== null &&
          newMachineName !== null &&
          newMahineOs !== null &&
          finalAmount !== "0" &&
          newMachineTime !== "" &&
          selectedLocation !== null
        ) {
        setLoading(true);
        const finAmt =
            finalAmount -
            (finalAmount * discountRate) / 100 +
            totalIPPrice * newMachineTime;
            const payload = {
                uuid: newMahineOs,
                jump_server: jumpServerValue ? jumpServerValue : "0",
                config: newMahineConfigId,
                name: `${newMachineName}${Math.floor(100 + Math.random() * 900)}`, // newMachineName,
                machine_val: newMahineOs, //drop down id
                machine_price: finAmt,
                plan_time: newMachineTime, //1
                user_id: smuser.id,
                disk_type: diskType,
                server_location: selectedLocation,
                num_ip: numOfIp,
            };
        if (smuser.platform_status == "1") {
            try {
            const encryptedResponse = await apiEncryptRequest(payload);
            const createMachineRes = await instance.post(
                "/vm/store-li",
                encryptedResponse,
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
                handleRedirect();
                setLoading(false);
            }, 5000);
            const encryptedResponse = await apiEncryptRequest(payload);
            const createMachineRes = await instance.post(
                "/vm/store-vm",
                encryptedResponse
            );
            const finalResponse = await decryptData(createMachineRes.data);
            const Details = finalResponse;
            window.location.href = "/vm-machine";
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
        } else {
        if (newMahineConfigId == null) {
            toast((t) => (
            <AppToast
                id={t.id}
                message={"Machine Configuration Required"}
                isMobile={isMobile}
            />
            ));
        } else if (newMachineName == null) {
            toast((t) => (
            <AppToast
                id={t.id}
                message={"Machine Name Required"}
                isMobile={isMobile}
            />
            ));
        } else if (newMahineOs == null) {
            toast((t) => (
            <AppToast
                id={t.id}
                message={"Machine OS is Required"}
                isMobile={isMobile}
            />
            ));
        } else if (newMahineOs == "Select") {
            toast((t) => (
            <AppToast
                id={t.id}
                message={"Machine OS is Required"}
                isMobile={isMobile}
            />
            ));
        } else if (selectedLocation === null) {
            toast((t) => (
            <AppToast
                id={t.id}
                message={"Server Location is Required"}
                isMobile={isMobile}
            />
            ));
        } else {
            toast((t) => (
            <AppToast
                id={t.id}
                message={"All fields are Required"}
                isMobile={isMobile}
            />
            ));
        }
        setShowIPOptionPopup(false);
        }
        if (smuser.phoneverify === 0) {
        } else {
        }
    };

    const CreateCustomMachine_Li = async (numOfIp , jumpServerValue) => {
        setLoading(true);
        const newSubConfig = GetSubConfigType(configType, diskType);
        if (smuser.phoneverify === 1) {
        var amount = 0;

        const calculateAmount = (config, priceKey) => {
            const basePrice =
            customCPU * config.cpu_rate +
            customRAM * config.ram_rate +
            customDISK * config[priceKey] +
            customDATAT * 1;
            const discountedPrice = basePrice - (basePrice * discountRate) / 100;
            if (smuser.country === "India") {
            return discountedPrice + totalIPPrice * newMachineTime;
            } else {
            return (
                discountedPrice * (1 + surcharge / 100) +
                totalIPPrice * newMachineTime
            );
            }
        };

        if (configType === 1) {
            amount =
            diskType === "ssd"
                ? calculateAmount(stdCusSSD, "ssd_price")
                : diskType === "nvme"
                ? calculateAmount(stdCusNVM, "nvme_price")
                : calculateAmount(stdCusHDD, "hdd_rate");
        } else if (configType === 2) {
            amount =
            diskType === "ssd"
                ? calculateAmount(cpuCusSSD, "ssd_price")
                : diskType === "nvme"
                ? calculateAmount(cpuCusNVM, "nvme_price")
                : calculateAmount(cpuCusHDD, "hdd_rate");
        } else if (configType === 3) {
            amount =
            diskType === "ssd"
                ? calculateAmount(ramCusSSD, "ssd_price")
                : diskType === "nvme"
                ? calculateAmount(ramCusNVM, "nvme_price")
                : calculateAmount(ramCusHDD, "hdd_rate");
        }

        if (smuser.total_credit < amount) {
            toast((t) => (
            <AppToast
                id={t.id}
                message={
                "Oops! Your wallet balance is low, Please Add Money to create machine"
                }
                isMobile={isMobile}
            />
            ));
        } else if (
            newMahineConfigId !== "" &&
            newMachineName !== "" &&
            newMahineOs !== "" &&
            newMachineName !== null &&
            newMahineOs !== null &&
            amount !== 0 &&
            newMachineTime !== "" &&
            customDISK !== 0 &&
            customCPU !== 0 &&
            customRAM !== 0 &&
            customDATAT !== 0 &&
            
            selectedLocation !== null
        ) {
            const payload = {
            flag: 0,
            uuid: newMahineOs,
            name: `${newMachineName}${Math.floor(100 + Math.random() * 900)}`, //newMachineName,
            machine_val: newMahineOs, //drop down id
            jump_server: jumpServerValue ? 1 : 0,
            machine_price: amount, // finalAmount - discountRate,
            plan_time: newMachineTime, //1
            user_id: smuser.id,
            hdde: customDISK,
            cpue: customCPU,
            rame: customRAM,
            data_transfer: customDATAT,
            disk_type: diskType,
            sub_config_type: newSubConfig,
            server_location: selectedLocation,
            num_ip: numOfIp,
            // configType == 1
            //   ? "standard1"
            //   : configType == 2
            //   ? "cpu1"
            //   : configType == 2
            //   ? "ram1"
            };
            if (smuser.platform_status == "1") {
              try {
                  const encryptedResponse = await apiEncryptRequest(payload);
                  const createMachineRes = await instance.post(
                  "/vm/store-li",
                  encryptedResponse,
                  );
                  const finalResponse = await decryptData(createMachineRes.data);
                  const Details = finalResponse;
                  if (Details.status) {
                  window.location.href = "/vm-machine";
                  }
              } catch (error) {
              }
            } else {
              try {
                  setTimeout(() => {
                  window.location.href = "/vm-machine";
                  setLoading(false);
                  }, 3000);
                  const encryptedResponse = await apiEncryptRequest(payload);
                  const createMachineRes = await instance.post(
                  "/vm/store-vm",
                  encryptedResponse
                  );
                  handleRedirect();
                  const finalResponse = await decryptData(createMachineRes.data);
                  const Details = finalResponse;
                  console.log(Details, "==!==!==/vm/store-vm");
                  window.location.href = "/vm-machine";
              } catch (error) {
              }
            }
        } else {
            if (configType == null) {
            toast((t) => (
                <AppToast
                id={t.id}
                message={"Machine Configuration Required"}
                isMobile={isMobile}
                />
            ));
            } else if (newMachineName == null) {
            toast((t) => (
                <AppToast
                id={t.id}
                message={"Machine Name Required"}
                isMobile={isMobile}
                />
            ));
            } else if (newMahineOs == null) {
            toast((t) => (
                <AppToast
                id={t.id}
                message={"Machine OS is Required"}
                isMobile={isMobile}
                />
            ));
            } else if (selectedLocation === null) {
            toast((t) => (
                <AppToast
                id={t.id}
                message={"Server Location is Required"}
                isMobile={isMobile}
                />
            ));
            } else {
            toast((t) => (
                <AppToast
                id={t.id}
                message={"Must select configuration"}
                isMobile={isMobile}
                />
            ));
            }
        }
        setShowIPOptionPopup(false);
        } else {
        setShowPhoneVerify(true);
        setShowIPOptionPopup(false);
        }
        setLoading(false);
    };

    const CreateLi = async () => {
        setLoading(true);
        const payload = {
        user_id: smuser.id,
        };
        try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
            "/create_li",
            encryptedResponse,
        );
        const loginResponse = await decryptData(loginUserResponse.data);
        const userDetails = loginResponse;
        // console.log(userDetails, "==!==!==userDetails");

        const standardRates = userDetails.ratedata1;
        const cpuIntensiveRates = userDetails.ratedata3;
        const ramIntensiveRates = userDetails.ratedata4;

        setStandardRates(standardRates);
        setCpuIntensiveRates(cpuIntensiveRates);
        setRamIntensiveRates(ramIntensiveRates);
        const osTemp = userDetails.osTemp;

        const vm = userDetails.vms;
        const moniters_machine = userDetails.mergedData;
        // console.log(moniters_machine, "==!==!==moniters_machine");

        const vmArray = Object.keys(moniters_machine).map(
            (key) => moniters_machine[key],
        );
        // console.log(vmArray, "==!==!==vvmArraym");

        let standardList = [];
        let cpuList = [];
        let ramList = [];

        let customList = [];

        vmArray.forEach((item) => {
            const { cid, ...rest } = item;
            if (cid === 1) {
            standardList.push({ cid, ...rest });
            } else if (cid === 3) {
            cpuList.push({ cid, ...rest });
            } else if (cid === 4) {
            ramList.push({ cid, ...rest });
            }
        });

        vmArray.forEach((item) => {
            const { cid, ...rest } = item;
            if (cid === 1) {
            // standardList.push({ cid, ...rest });
            } else if (cid === 3) {
            // cpuList.push({ cid, ...rest });
            } else if (cid === 4) {
            // ramList.push({ cid, ...rest });
            }
        });

        // console.log(standardList, "==standardList");
        // console.log(cpuList, "==cpuList");
        // console.log(ramList, "==ramList");

        setStandardList(standardList);
        setCPUList(cpuList);
        setRamList(ramList);

        if (osTemp["Ubuntu_fa-ubuntu"]) {
            // console.log(osTemp["Ubuntu_fa-ubuntu"], "==");
            setUbantuOS(osTemp["Ubuntu_fa-ubuntu"]);
            setFedoraOS(osTemp["Fedora_fa-windows"]);
        }
        } catch (error) {
        // console.error("Error during the login process:", error);
        }
        setLoading(false);
    };

    const transformData = (data) => {
        const transformed = Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = value.map((item) => {
            const [name, id] = Object.entries(item)[0];
            return { name, id };
        });
        return acc;
        }, {});
        return transformed;
    };

    useEffect(() => {
        if (custConfigData && selectedLocation) {
        onChangeLocation(selectedLocation);
        }
    }, [custConfigData, selectedLocation]);

    const CreateVm = async () => {
        setLoading(true);
        const payload = {
        user_id: smuser.id,
        };
        try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
            "/create-vm",
            encryptedResponse,
        );
        const loginResponse = await decryptData(loginUserResponse.data);
        const userDetails = loginResponse;
        const surcharge = userDetails.surcharge.surcharge;
        setSurcharge(surcharge);
        localStorage.setItem("surcharge", surcharge);
        // console.log(userDetails.reedem_points);
        console.log(userDetails, "====loginUserResponse");

        setIPPrice(userDetails.ip_price);

        const osTemplete = transformData(userDetails.osTemp);
        // const billArray = Object.keys(osTemplete).map((key) => osTemplete[key]);
        setAllOsTemplete(osTemplete);
        // console.log(osTemplete, "====osTemplete");
        const standardRates = userDetails.ratedata1;
        const cpuIntensiveRates = userDetails.ratedata3;
        const ramIntensiveRates = userDetails.ratedata4;

        const sCusHDD = userDetails.ratedata1;
        const sCusSSD = userDetails.ratedata5;
        const sCusNVM = userDetails.ratedata6;

        const cCusHDD = userDetails.ratedata3;
        const cCusSSD = userDetails.ratedata7;
        const cCusNVM = userDetails.ratedata8;

        const rCusHDD = userDetails.ratedata4;
        const rCusSSD = userDetails.ratedata9;
        const rCusNVM = userDetails.ratedata10;

        setStdCusHDD(sCusHDD);
        setStdCusSSD(sCusSSD);
        setStdCusNVM(sCusNVM);

        setCpuCusHDD(cCusHDD);
        setCpuCusSSD(cCusSSD);
        setCpuCusNVM(cCusNVM);

        setRamCusHDD(rCusHDD);
        setRamCusSSD(rCusSSD);
        setRamCusNVM(rCusNVM);

        // 1 = std hdd
        // 5 = std ssd
        // 6 = std nvm

        // 3 = cpu hdd
        // 7 = cpu ssd
        // 8 = cpu nvm

        // 4 = ram hdd
        // 9 = ram ssd
        // 10 = ram nvm

        // const sCusHDD = userDetails.ratedata1;
        // const sCusSSD = userDetails.ratedata5;
        // const sCusNVM = userDetails.ratedata6;

        // const cCusHDD = userDetails.ratedata3;
        // const cCusSSD = userDetails.ratedata7;
        // const cCusNVM = userDetails.ratedata8;

        // const rHDD = userDetails.ratedata4;
        // const rSSD = userDetails.ratedata9;
        // const rNVM = userDetails.ratedata10

        setStandardRates(standardRates);
        setCpuIntensiveRates(cpuIntensiveRates);
        setRamIntensiveRates(ramIntensiveRates);

        const osTemp = userDetails.osTemp;

        const vm = userDetails.vms;
        const moniters_machine = userDetails.mergedData;
        // console.log(moniters_machine, "==!==!==moniters_machine");

        const vmArray = Object.keys(moniters_machine).map(
            (key) => moniters_machine[key],
        );
        // console.log(vmArray, "==!==!==vvmArraym");

        let stdHdd = [];
        let stdSsd = [];
        let stdNvm = [];

        let cpuHdd = [];
        let cpuSsd = [];
        let cpuNvm = [];

        let ramHdd = [];
        let ramSsd = [];
        let ramNvm = [];

        let standardList = [];
        let cpuList = [];
        let ramList = [];
        let customList = [];

        vmArray.forEach((item) => {
            const { cid, ...rest } = item;
            if (cid === 1) {
            standardList.push({ cid, ...rest });
            stdHdd.push({ cid, ...rest });
            } else if (cid === 3) {
            cpuList.push({ cid, ...rest });
            cpuHdd.push({ cid, ...rest });
            } else if (cid === 4) {
            ramList.push({ cid, ...rest });
            ramHdd.push({ cid, ...rest });
            } else if (cid === 5) {
            stdSsd.push({ cid, ...rest });
            } else if (cid === 6) {
            stdNvm.push({ cid, ...rest });
            } else if (cid === 7) {
            cpuSsd.push({ cid, ...rest });
            } else if (cid === 8) {
            cpuNvm.push({ cid, ...rest });
            } else if (cid === 9) {
            ramSsd.push({ cid, ...rest });
            } else if (cid === 10) {
            ramNvm.push({ cid, ...rest });
            }
        });

        setSSsd(stdSsd);
        setSHdd(stdHdd);
        setSNvm(stdNvm);

        setCSsd(cpuSsd);
        setCHdd(cpuHdd);
        setCNvm(cpuNvm);

        setRSsd(ramSsd);
        setRHdd(ramHdd);
        setRNvm(ramNvm);

        setStandardList(standardList);
        setCPUList(cpuList);
        setRamList(ramList);
        // Windows_fa-windows
        // redhat_fa-redhat
        // CentOS_fa-centos
        //Ubuntu_fa-ubuntu
        if (osTemp["Ubuntu_fa-ubuntu"]) {
            setUbuntu_fa(osTemp["Ubuntu_fa-ubuntu"]);
            setWindows_fa(osTemp["Windows_fa-windows"]);
            setRedhat_fa(osTemp["Redhat_fa-redhat"]);
            setCentOS_fa(osTemp["CentOS_fa-centos"]);
            setLinux_fa(osTemp["linux_fa-linux"]);
            setRocky_fa(osTemp["Rocky_fa-rokcy"]);
            setFedora_fa(osTemp["Fedora_fa-fedora"]);
            setDebian_fa(osTemp["Debian_fa-debian"]);
        }

        const stocks = userDetails.stocks;

        let stdHddStocks = [];
        let stdSsdStocks = [];
        let stdNvmStocks = [];

        let cpuHddStocks = [];
        let cpuSsdStocks = [];
        let cpuNvmStocks = [];

        let ramHddStocks = [];
        let ramSsdStocks = [];
        let ramNvmStocks = [];

        stocks.forEach((item) => {
            const { cid, ...rest } = item;
            if (cid === 1) {
            stdHddStocks.push({ cid, ...rest });
            } else if (cid === 3) {
            cpuHddStocks.push({ cid, ...rest });
            } else if (cid === 4) {
            ramHddStocks.push({ cid, ...rest });
            } else if (cid === 5) {
            stdSsdStocks.push({ cid, ...rest });
            } else if (cid === 6) {
            stdNvmStocks.push({ cid, ...rest });
            } else if (cid === 7) {
            cpuSsdStocks.push({ cid, ...rest });
            } else if (cid === 8) {
            cpuNvmStocks.push({ cid, ...rest });
            } else if (cid === 9) {
            ramSsdStocks.push({ cid, ...rest });
            } else if (cid === 10) {
            ramNvmStocks.push({ cid, ...rest });
            }
        });

        // console.log(stdHddStocks, "stdHddStocks");

        setSHddStocks(stdHddStocks);
        setSSsdStocks(stdSsdStocks);
        setSNvmStocks(stdNvmStocks);
        setCHddStocks(cpuHddStocks);
        setCSsdStocks(cpuSsdStocks);
        setCNvmStocks(cpuNvmStocks);
        setRHddStocks(ramHddStocks);
        setRSsdStocks(ramSsdStocks);
        setRNvmStocks(ramNvmStocks);

        const custConfig = userDetails.custom_configure;
        // setCustConfigData(custConfig);
        // console.log(custConfig, "====custConfig");

        const defaultLocation = userDetails.server_locaiton;

        setCustConfigData(custConfig);
        setServerLocaiton(defaultLocation);
        setSelectedLocation(defaultLocation[0].id);

        const rewards = userDetails.rewards;
        setUpnetPercentage(rewards.reward);

        // Fedora_fa-windows
        // setUbantuOS(osTemp[0]);
        // Ubuntu_fa-ubuntu
        } catch (error) {
        // console.error("Error during the login process:", error);
        }
        setLoading(false);
    };

    const onChangeLocation = (id) => {
        // console.log(custConfigData, "IDS");

        const stdHddCustConfig = custConfigData.filter(
        (item2) => item2.cid === 1 && id == item2.server_location,
        );
        // console.log(stdHddCustConfig, "DSss");
        const stdSsdCustConfig = custConfigData.filter(
        (item2) => item2.cid === 5 && id == item2.server_location,
        );
        const stdNvmCustConfig = custConfigData.filter(
        (item2) => item2.cid === 6 && id == item2.server_location,
        );

        const cpuHddCustConfig = custConfigData.filter(
        (item2) => item2.cid === 3 && id == item2.server_location,
        );
        const cpuSsdCustConfig = custConfigData.filter(
        (item2) => item2.cid === 7 && id == item2.server_location,
        );
        const cpuNvmCustConfig = custConfigData.filter(
        (item2) => item2.cid === 8 && id == item2.server_location,
        );

        const ramHddCustConfig = custConfigData.filter(
        (item2) => item2.cid === 4 && id == item2.server_location,
        );
        const ramSsdCustConfig = custConfigData.filter(
        (item2) => item2.cid === 9 && id == item2.server_location,
        );
        const ramNvmCustConfig = custConfigData.filter(
        (item2) => item2.cid === 10 && id == item2.server_location,
        );

        // console.log(stdHddCustConfig, "LLL");

        setCustConfigStdHDD(stdHddCustConfig);
        setCustConfigStdSSD(stdSsdCustConfig);
        setCustConfigStdNVME(stdNvmCustConfig);

        setCustConfigCpuHDD(cpuHddCustConfig);
        setCustConfigCpuSSD(cpuSsdCustConfig);
        setCustConfigCpuNVME(cpuNvmCustConfig);

        setCustConfigRamHDD(ramHddCustConfig);
        setCustConfigRamSSD(ramSsdCustConfig);
        setCustConfigRamNVME(ramNvmCustConfig);

        if (activePage === "Custom Configure") {
        if (activeButton === "Standard") {
            if (diskType === "ssd") {
            if (!stdSsdCustConfig || stdSsdCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            } else if (diskType === "hdd") {
            if (!stdHddCustConfig || stdHddCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            } else if (diskType === "nvme") {
            if (!stdNvmCustConfig || stdNvmCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            }
        } else if (activeButton === "CPU Proactive") {
            if (diskType === "ssd") {
            if (!cpuSsdCustConfig || cpuSsdCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            } else if (diskType === "hdd") {
            if (!cpuHddCustConfig || cpuHddCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            } else if (diskType === "nvme") {
            if (!cpuNvmCustConfig || cpuNvmCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            }
        } else if (activeButton === "RAM Proactive") {
            if (diskType === "ssd") {
            if (!ramSsdCustConfig || ramSsdCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            } else if (diskType === "hdd") {
            if (!ramHddCustConfig || ramHddCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            } else if (diskType === "nvme") {
            if (!ramNvmCustConfig || ramNvmCustConfig.length === 0) {
                setStockAvailableStatus(false);
                toast((t) => (
                <AppToast
                    id={t.id}
                    message={
                    "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                    }
                    isMobile={isMobile}
                />
                ));
            } else {
                setStockAvailableStatus(true);
            }
            }
        }
        }
    };

    const increment = () => {
        if (counter < 5) {
        setCounter((prevCount) => prevCount + 1);
        }
    };
    const decrement = () => {
        if (counter !== 1) {
        setCounter((prevCount) => prevCount - 1);
        }
    };
    var totalIPPrice = counter * iPPrice;
    var selectedNoIP = counter;

    const configMap = {
        "Standard-ssd": custConfigStdSSD,
        "Standard-hdd": custConfigStdHDD,
        "Standard-nvme": custConfigStdNVME,
        "CPU Proactive-ssd": custConfigCpuSSD,
        "CPU Proactive-hdd": custConfigCpuHDD,
        "CPU Proactive-nvme": custConfigCpuNVME,
        "RAM Proactive-ssd": custConfigRamSSD,
        "RAM Proactive-hdd": custConfigRamHDD,
        "RAM Proactive-nvme": custConfigRamNVME,
    };

  const calculatePercentageVCPU = () => {
    const configKey = `${activeButton}-${diskType}`;
    const selectedConfig = configMap[configKey] ?? [{ vcpu: 0 }];
    const maxVcpu = selectedConfig[0]?.vcpu ?? 0;

    return maxVcpu !== 0 ? (customCPU * 100) / maxVcpu : 0;
  };
  const percentage = calculatePercentageVCPU();

  // RAM Slider Val
  const getMaxRam = () => {
    const configs = {
      "Standard-ssd": custConfigStdSSD,
      "Standard-hdd": custConfigStdHDD,
      "Standard-nvme": custConfigStdNVME,
      "CPU Proactive-ssd": custConfigCpuSSD,
      "CPU Proactive-hdd": custConfigCpuHDD,
      "CPU Proactive-nvme": custConfigCpuNVME,
      "RAM Proactive-ssd": custConfigRamSSD,
      "RAM Proactive-hdd": custConfigRamHDD,
      "RAM Proactive-nvme": custConfigRamNVME,
    };

    return configs[`${activeButton}-${diskType}`]?.[0]?.ram ?? 0;
  };
  const calculatePercentageRam = (value, max) =>
    max ? (value * 100) / max : 0;

  // Disk Slider Val
  const calculatePercentageDISK = (diskValue, activeButton, diskType) => {
    const maxConfig = getDiskMaxValue(activeButton, diskType);
    return maxConfig !== 0 ? `${(diskValue * 100) / maxConfig}%` : "0%";
  };
  const getDiskMaxValue = (activeButton, diskType) => {
    if (activeButton === "Standard") {
      if (diskType === "ssd") return custConfigStdSSD?.[0]?.ssd ?? 0;
      if (diskType === "hdd") return custConfigStdHDD?.[0]?.hdd ?? 0;
      if (diskType === "nvme") return custConfigStdNVME?.[0]?.nvme ?? 0;
    } else if (activeButton === "CPU Proactive") {
      if (diskType === "ssd") return custConfigCpuSSD?.[0]?.ssd ?? 0;
      if (diskType === "hdd") return custConfigCpuHDD?.[0]?.hdd ?? 0;
      if (diskType === "nvme") return custConfigCpuNVME?.[0]?.nvme ?? 0;
    } else if (activeButton === "RAM Proactive") {
      if (diskType === "ssd") return custConfigRamSSD?.[0]?.ssd ?? 0;
      if (diskType === "hdd") return custConfigRamHDD?.[0]?.hdd ?? 0;
      if (diskType === "nvme") return custConfigRamNVME?.[0]?.nvme ?? 0;
    }
    return 0;
  };

  // Bandwidth slider Val
  const getConfig = () => {
    const configs = {
      "Standard-ssd": custConfigStdSSD,
      "Standard-hdd": custConfigStdHDD,
      "Standard-nvme": custConfigStdNVME,
      "CPU Proactive-ssd": custConfigCpuSSD,
      "CPU Proactive-hdd": custConfigCpuHDD,
      "CPU Proactive-nvme": custConfigCpuNVME,
      "RAM Proactive-ssd": custConfigRamSSD,
      "RAM Proactive-hdd": custConfigRamHDD,
      "RAM Proactive-nvme": custConfigRamNVME,
    };
    return configs[`${activeButton}-${diskType}`]?.[0]?.data_transfer ?? 0;
  };
  const calculatePercentageBandwidth = () => {
    const maxDataTransfer = getConfig();
    return maxDataTransfer !== 0 ? (customDATAT * 100) / maxDataTransfer : 0;
  };
  const percentageBandwidth = calculatePercentageBandwidth();

  const determineDiscountRate = (configType, diskType, newMachineTime) => {
    let discountValue = 0;

    if (configType === 1 || configType === 5 || configType === 6) {
        if (diskType === "ssd") {
            discountValue = stdCusSSD[`discount_price_${newMachineTime}`];
        } else if (diskType === "nvme") {
            discountValue = stdCusNVM[`discount_price_${newMachineTime}`];
        } else {
            discountValue = stdCusHDD[`discount_price_${newMachineTime}`];
        }
    } else if (configType === 3 || configType === 7 || configType === 8) {
    if (diskType === "ssd") {
        discountValue = cpuCusSSD[`discount_price_${newMachineTime}`];
    } else if (diskType === "nvme") {
        discountValue = cpuCusNVM[`discount_price_${newMachineTime}`];
    } else {
        discountValue =
        cpuCusHDD[`discount_price_${newMachineTime}`]?.custom_discount;
    }
    } else {
    if (diskType === "ssd") {
        discountValue = ramCusSSD[`discount_price_${newMachineTime}`];
    } else if (diskType === "nvme") {
        discountValue = ramCusNVM[`discount_price_${newMachineTime}`];
    } else {
        discountValue = ramCusHDD[`discount_price_${newMachineTime}`];
    }
    }

    setDiscountRate(discountValue);
  };

  const calculatePrice = (
    cpuRate,
    ramRate,
    diskPrice,
    discountRate,
    timeMultiplier,
  ) => {
    const basePrice =
      customCPU * cpuRate +
      customRAM * ramRate +
      customDISK * diskPrice +
      customDATAT * 1;
    const discount = (basePrice * discountRate) / 100;
    // console.log((basePrice * discountRate) / 100, "ppp");

    if (smuser.country === "India") {
      return basePrice - discount;
    } else {
      return (basePrice - discount) * (1 + surcharge / 100);
    }
  };

  const calculateOriginalPrice = (cpuRate, ramRate, diskPrice) => {
    return (
      customCPU * cpuRate +
      customRAM * ramRate +
      customDISK * diskPrice +
      customDATAT * 1
    );
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "75rem",
        position: "relative",
        backgroundImage: isMobile ? `url(/main-bg.jpg)` : `url(/main-bg.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          zIndex: "9999999999999999999999999999999999999999999",
        }}
      >
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>

      {showPhoneVerify && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backgroundSize: "cover",
              backgroundImage: isMobile
                ? `url(/main-bg.jpg)`
                : `url(/main-bg.jpg)`,
              top: "20%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile ? "90%" : "35%",
              backdropFilter: "blur(5px)",
              height: "20rem",
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
                onClick={() => setShowPhoneVerify(false)}
              >
                X
              </button>
              <h4 style={{ marginTop: "10px" }}>Verify your Phone</h4>
              <div
                className="input-container"
                style={{
                  marginTop: "15px",
                  border: "2px solid #fff",
                  backgroundColor: "#e97730",
                  outline: "2px solid #e97730",
                }}
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
                  disabled={phoneOtpSent}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {phoneOtpSent && (
                <div
                  className="input-container"
                  style={{
                    marginTop: "25px",
                    border: "2px solid #fff",
                    backgroundColor: "#e97730",
                    outline: "2px solid #e97730",
                  }}
                >
                  <input
                    type="number"
                    id="password-field"
                    className="input-signup"
                    name="phoneOtp"
                    placeholder="Enter OTP"
                    value={phoneOTP}
                    onChange={(e) => setPhoneOTP(e.target.value)}
                    style={{ textAlign: "center" }}
                  />
                </div>
              )}

              <button
                style={{
                  color: "white",
                  width: "8rem",
                  height: "45px",
                  backgroundColor: "#035189",
                  borderRadius: "25px",
                  border: "2px solid #ffff",
                  outline: "2px solid #035189",
                  marginTop: "25px",
                }}
                onClick={PhoneVerifyCall}
              >
                {" "}
                {phoneOtpSent ? "Verify OTP" : "Send OTP"}
              </button>
              {phoneOtpSent && (
                <div className="btm desk" style={{ marginTop: "20px" }}>
                  <span className="rgst mob">Not Received OTP? </span>
                  <button
                    onClick={PhoneVerifyCall}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      marginLeft: "-5px",
                    }}
                  >
                    Click Here
                  </button>
                </div>
              )}
            </div>
          </div>
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
              top: "20%",
              // left: "30%",
              position: "absolute",
              zIndex: "99",
              width: isMobile ? "90%" : "35%",
              backdropFilter: "blur(5px)",
              height: "45rem",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
              borderRadius: "12px", // Assuming you want rounded corners
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
                  height: "350px",
                  overflowY: "scroll",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #e97730",
                }}
              >
                <p>{""}</p>
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
                onClick={() => setShowTermsCondition(!showTermsCondition)}
              >
                I AGREE
                {/* I Agree all the terms & condition of UPNETCLOUD */}
              </button>
            </div>
          </div>
        </div>
      )}

      {showIPOptionPopup && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backdropFilter: "blur(30px)",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
              borderRadius: "12px", // Assuming you want rounded corners
              border: "2px solid #e97730",
              top: "12%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile ? "85%" : "60%",
              height: isMobile ? "60rem" : "32rem",
            }}
          >
            <div style={{ display: "grid", justifyItems: "center" }}>
              <button
                style={{
                  zIndex: "999",
                  position: "absolute",
                  backgroundColor: "transparent",
                  border: "none",
                  right: "0",
                }}
                onClick={() => setShowIPOptionPopup(false)}
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
              {isMobile ? (
                <div className="" style={{ height: "50rem" }}>
                  <div
                    className="wallet-container"
                    style={{
                      border: "none",
                    }}
                  >
                    {/* First Tab Mobile*/}

                    <div
                      className="box"
                      style={{
                        marginRight: "15px",
                        // marginTop: "10px",
                        width: "15rem",
                      }}
                    >
                      <div
                        style={{
                          // padding: "20px",
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
                        <div
                          className="machine-icon-edit-profile"
                          style={{
                            // marginLeft: "22px",
                            width: "94px",
                            height: "94px",
                          }}
                        >
                          <img
                            src={"/images/admin/01-home/cpu.svg"}
                            alt={""}
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </div>
                        <div
                          className="machine-titles theme-bg-orange"
                          style={{
                            width: "116px",
                            fontWeight: "600",
                            // height: "40px",
                          }}
                        >
                          Portgate VM
                        </div>

                        <div className="machine-name theme-color-blue">
                          {""}
                        </div>

                        <div
                          className="machine-config-badge"
                          style={{
                            color: "white",
                            backgroundColor: "#154e7a",
                            fontWeight: "600",
                            marginTop: "10px",
                          }}
                        >
                          {activePage === "Custom Configure" ? (
                            <>
                              {configType === 1 &&
                                smuser &&
                                appCurrency &&
                                stdCusHDD &&
                                stdCusSSD &&
                                stdCusNVM &&
                                currencyReturn({
                                  price:
                                    diskType === "ssd"
                                      ? calculatePrice(
                                          stdCusSSD.cpu_rate,
                                          stdCusSSD.ram_rate,
                                          stdCusSSD.ssd_price,
                                          discountRate || 0,
                                          1,
                                        )
                                      : diskType === "nvme"
                                        ? calculatePrice(
                                            stdCusNVM.cpu_rate,
                                            stdCusNVM.ram_rate,
                                            stdCusNVM.nvme_price,
                                            discountRate || 0,
                                            newMachineTime,
                                          )
                                        : calculatePrice(
                                            stdCusHDD.cpu_rate,
                                            stdCusHDD.ram_rate,
                                            stdCusHDD.hdd_rate,
                                            discountRate || 0,
                                            newMachineTime,
                                          ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}

                              {configType === 2 &&
                                smuser &&
                                appCurrency &&
                                cpuCusSSD &&
                                cpuCusNVM &&
                                cpuCusHDD &&
                                currencyReturn({
                                  price:
                                    diskType === "ssd"
                                      ? calculatePrice(
                                          cpuCusSSD.cpu_rate,
                                          cpuCusSSD.ram_rate,
                                          cpuCusSSD.ssd_price,
                                          discountRate || 0,
                                          newMachineTime,
                                        )
                                      : diskType === "nvme"
                                        ? calculatePrice(
                                            cpuCusNVM.cpu_rate,
                                            cpuCusNVM.ram_rate,
                                            cpuCusNVM.nvme_price,
                                            discountRate || 0,
                                            newMachineTime,
                                          )
                                        : calculatePrice(
                                            cpuCusHDD.cpu_rate,
                                            cpuCusHDD.ram_rate,
                                            cpuCusHDD.hdd_rate,
                                            discountRate || 0,
                                            newMachineTime,
                                          ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}

                              {configType === 3 &&
                                smuser &&
                                appCurrency &&
                                ramCusSSD &&
                                ramCusNVM &&
                                ramCusHDD &&
                                currencyReturn({
                                  price:
                                    diskType === "ssd"
                                      ? calculatePrice(
                                          ramCusSSD.cpu_rate,
                                          ramCusSSD.ram_rate,
                                          ramCusSSD.ssd_price,
                                          discountRate || 0,
                                          newMachineTime,
                                        )
                                      : diskType === "nvme"
                                        ? calculatePrice(
                                            ramCusNVM.cpu_rate,
                                            ramCusNVM.ram_rate,
                                            ramCusNVM.nvme_price,
                                            discountRate || 0,
                                            newMachineTime,
                                          )
                                        : calculatePrice(
                                            ramCusHDD.cpu_rate,
                                            ramCusHDD.ram_rate,
                                            ramCusHDD.hdd_rate,
                                            discountRate || 0,
                                            newMachineTime,
                                          ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                            </>
                          ) : (
                            currencyReturn({
                              price:
                                smuser.country === "India"
                                  ? finalAmount -
                                    (finalAmount * discountRate) / 100
                                  : (finalAmount -
                                      (finalAmount * discountRate) / 100) *
                                    (1 + surcharge / 100),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })
                          )}{" "}
                          / Month
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
                        <div
                          className="machine-ip"
                          style={{ marginTop: "8px" }}
                        >
                        </div>
                        <div
                          className="machine-ip"
                          style={{
                            marginTop: "8px",
                            textAlign: "center",
                            color: "#154e7a",
                            fontWeight: "600",
                          }}
                        >
                          Public IP
                        </div>
                        <div
                          className="machine-ip"
                          style={{ marginTop: "8px" }}
                        >
                          Required Domain
                        </div>
                        <div
                          className="machine-date"
                          style={{ marginTop: "8px", textAlign: "center" }}
                        >
                          HTTP to HTTPS <br></br> Redirect : Enabled
                        </div>

                        <div
                          className="machine-date"
                          style={{ marginTop: "8px" }}
                        >
                          SSL : Enabled
                        </div>

                        <div
                          className="log-in"
                          style={{
                            marginTop: "10px",
                            marginLeft: "-8rem",
                            justifyContent: "center",
                          }}
                          onClick={() => {
                            selectedNoIP = 0;
                            totalIPPrice = 0;   
                            if (activePage == "Custom Configure") {
                              CreateCustomMachine_Li(selectedNoIP, 0);
                            } else {
                              CreateMachine_Li(selectedNoIP,0);
                            }
                          }}
                        >
                          <a href="#" className="media-link">
                            <div
                              className="media-banner"
                              style={{
                                width: "auto",
                                height: "50px",
                                marginLeft: "10rem",
                              }}
                            >
                              <img
                                className="normal-banner"
                                src="/admin/images/admin/wallet/add-money-btn.png"
                                alt=""
                                style={{
                                  marginTop: "0px",
                                  width: "9rem",
                                  height: "3rem",
                                }}
                              />
                              <img
                                className="hover-img-banner"
                                src="/admin/images/admin/wallet/recharge-btn.png"
                                alt="/admin/images/admin/wallet/recharge-btn.png"
                                style={{
                                  marginTop: "0px",
                                  width: "9rem",
                                  height: "3rem",
                                }}
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
                                Launch Machine
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Second Tab Mobile*/}
                    <div
                      className="box"
                      style={{
                        marginRight: "15px",
                        marginTop: "-20px",
                        width: "15rem",
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
                        <div
                          className="machine-icon-edit-profile"
                          style={{
                            // marginLeft: "22px",
                            width: "94px",
                            height: "94px",
                          }}
                        >
                          <img
                            src={"/images/admin/01-home/cpu.svg"}
                            alt={""}
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </div>
                        <div
                          className="machine-titles theme-bg-orange"
                          style={{
                            width: "100px",
                            fontWeight: "600",
                            // height: "40px",
                          }}
                        >
                          Cloud VM
                        </div>

                        <div className="machine-name theme-color-blue">
                          {""}
                        </div>

                        <div
                          className="machine-config-badge"
                          style={{
                            color: "white",
                            backgroundColor: "#154e7a",
                            fontWeight: "600",
                            marginTop: "10px",
                          }}
                        >
                          {activePage === "Custom Configure"
                            ? (() => {
                                const calculatePrice = (config, priceKey) => {
                                  const basePrice =
                                    customCPU * config.cpu_rate +
                                    customRAM * config.ram_rate +
                                    customDISK * config[priceKey] +
                                    customDATAT * 1;
                                  const discountedPrice =
                                    basePrice -
                                    (basePrice * discountRate) / 100;
                                  if (smuser.country === "India") {
                                    return (
                                      discountedPrice * newMachineTime +
                                      totalIPPrice * newMachineTime
                                    );
                                  } else {
                                    return (
                                      discountedPrice * newMachineTime +
                                      totalIPPrice *
                                        newMachineTime *
                                        (1 + surcharge / 100)
                                    );
                                  }
                                };

                                if (!smuser || !appCurrency) return null;

                                switch (configType) {
                                  case 1:
                                    return currencyReturn({
                                      price:
                                        diskType === "ssd"
                                          ? calculatePrice(
                                              stdCusSSD,
                                              "ssd_price",
                                            )
                                          : diskType === "nvme"
                                            ? calculatePrice(
                                                stdCusNVM,
                                                "nvme_price",
                                              )
                                            : calculatePrice(
                                                stdCusHDD,
                                                "hdd_rate",
                                              ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    });
                                  case 2:
                                    return currencyReturn({
                                      price:
                                        diskType === "ssd"
                                          ? calculatePrice(
                                              cpuCusSSD,
                                              "ssd_price",
                                            )
                                          : diskType === "nvme"
                                            ? calculatePrice(
                                                cpuCusNVM,
                                                "nvme_price",
                                              )
                                            : calculatePrice(
                                                cpuCusHDD,
                                                "hdd_rate",
                                              ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    });
                                  case 3:
                                    return currencyReturn({
                                      price:
                                        diskType === "ssd"
                                          ? calculatePrice(
                                              ramCusSSD,
                                              "ssd_price",
                                            )
                                          : diskType === "nvme"
                                            ? calculatePrice(
                                                ramCusNVM,
                                                "nvme_price",
                                              )
                                            : calculatePrice(
                                                ramCusHDD,
                                                "hdd_rate",
                                              ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    });
                                  default:
                                    return null;
                                }
                              })()
                            : currencyReturn({
                                price:
                                  smuser.country === "India"
                                    ? finalAmount -
                                      (finalAmount * discountRate) / 100 +
                                      totalIPPrice * newMachineTime
                                    : (finalAmount -
                                        (finalAmount * discountRate) / 100) *
                                        (1 + surcharge / 100) +
                                      totalIPPrice * newMachineTime,
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}{" "}
                          / Month
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
                        <div
                          className="machine-ip"
                          style={{ marginTop: "15px" }}
                        >
                          {/* Location: {""} */}
                        </div>
                        <div
                          className="machine-ip"
                          style={{
                            marginTop: "0px",
                            textAlign: "center",
                            color: "#154e7a",
                            fontWeight: "600",
                          }}
                        >
                          Public IP
                          <div
                            className="counter-section"
                            style={{ marginTop: "10px" }}
                          >
                            <button onClick={decrement} className="counter-btn">
                              −
                            </button>
                            <span style={{ margin: "0 15px" }}>{counter}</span>
                            <button onClick={increment} className="counter-btn">
                              +
                            </button>
                          </div>
                        </div>
                        <div
                          className="machine-ip"
                          style={{ marginTop: "8px" }}
                        >
                          Domain not Required
                        </div>
                        <div
                          className="machine-date"
                          style={{ marginTop: "8px" }}
                        >
                          Unmanaged Cloud VM
                        </div>
                        <div
                          className="machine-date"
                          style={{ marginTop: "8px" }}
                        >
                          SSL Managed by VM Admin
                        </div>
                        <div
                          className="log-in"
                          style={{
                            marginTop: "5px",
                            marginLeft: "-8rem",
                            justifyContent: "center",
                          }}
                          onClick={() => {
                            // setSelectedNumIP(counter);
                            if (activePage == "Custom Configure") {
                              CreateCustomMachine_Li(selectedNoIP,0);
                            } else {
                              CreateMachine_Li(selectedNoIP,0);
                            }
                          }}
                        >
                          <a href="#" className="media-link">
                            <div
                              className="media-banner"
                              style={{
                                width: "auto",
                                height: "50px",
                                marginTop: "5px",
                                marginLeft: "10rem",
                              }}
                            >
                              <img
                                className="normal-banner"
                                src="/admin/images/admin/wallet/add-money-btn.png"
                                alt=""
                                style={{
                                  marginTop: "5px",
                                  width: "9rem",
                                  height: "3rem",
                                }}
                              />
                              <img
                                className="hover-img-banner"
                                src="/admin/images/admin/wallet/recharge-btn.png"
                                alt="/admin/images/admin/wallet/recharge-btn.png"
                                style={{
                                  marginTop: "5px",
                                  width: "9rem",
                                  height: "3rem",
                                }}
                              />

                              <span
                                className="login-text"
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  marginTop: "5px",
                                  fontWeight: "600",
                                }}
                              >
                                Launch Machine
                              </span>
                            </div>
                          </a>
                        </div>

                        <br />
                        <br />
                      </div>
                    </div>

                      <div
                      className="box"
                      style={{
                        marginRight: "15px",
                        marginTop: "-20px",
                        width: "15rem",
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
                        <div
                          className="machine-icon-edit-profile"
                          style={{
                            // marginLeft: "22px",
                            width: "94px",
                            height: "94px",
                          }}
                        >
                          <img
                            src={"/images/admin/01-home/cpu.svg"}
                            alt={""}
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </div>
                        <div
                          className="machine-titles theme-bg-orange"
                          style={{
                            width: "100px",
                            fontWeight: "600",
                            // height: "40px",
                          }}
                        >
                        Jump Server
                        </div>

                        <div className="machine-name theme-color-blue">
                          {""}
                        </div>

                        <div
                          className="machine-config-badge"
                          style={{
                            color: "white",
                            backgroundColor: "#154e7a",
                            fontWeight: "600",
                            marginTop: "10px",
                          }}
                        >
                          {activePage === "Custom Configure"
                            ? (() => {
                                const calculatePrice = (config, priceKey) => {
                                  const basePrice =
                                    customCPU * config.cpu_rate +
                                    customRAM * config.ram_rate +
                                    customDISK * config[priceKey] +
                                    customDATAT * 1;
                                  const discountedPrice =
                                    basePrice -
                                    (basePrice * discountRate) / 100;
                                  if (smuser.country === "India") {
                                    return (
                                      discountedPrice * newMachineTime +
                                      totalIPPrice * newMachineTime
                                    );
                                  } else {
                                    return (
                                      discountedPrice * newMachineTime +
                                      totalIPPrice *
                                        newMachineTime *
                                        (1 + surcharge / 100)
                                    );
                                  }
                                };

                                if (!smuser || !appCurrency) return null;

                                switch (configType) {
                                  case 1:
                                    return currencyReturn({
                                      price:
                                        diskType === "ssd"
                                          ? calculatePrice(
                                              stdCusSSD,
                                              "ssd_price",
                                            )
                                          : diskType === "nvme"
                                            ? calculatePrice(
                                                stdCusNVM,
                                                "nvme_price",
                                              )
                                            : calculatePrice(
                                                stdCusHDD,
                                                "hdd_rate",
                                              ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    });
                                  case 2:
                                    return currencyReturn({
                                      price:
                                        diskType === "ssd"
                                          ? calculatePrice(
                                              cpuCusSSD,
                                              "ssd_price",
                                            )
                                          : diskType === "nvme"
                                            ? calculatePrice(
                                                cpuCusNVM,
                                                "nvme_price",
                                              )
                                            : calculatePrice(
                                                cpuCusHDD,
                                                "hdd_rate",
                                              ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    });
                                  case 3:
                                    return currencyReturn({
                                      price:
                                        diskType === "ssd"
                                          ? calculatePrice(
                                              ramCusSSD,
                                              "ssd_price",
                                            )
                                          : diskType === "nvme"
                                            ? calculatePrice(
                                                ramCusNVM,
                                                "nvme_price",
                                              )
                                            : calculatePrice(
                                                ramCusHDD,
                                                "hdd_rate",
                                              ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    });
                                  default:
                                    return null;
                                }
                              })()
                            : currencyReturn({
                                price:
                                  smuser.country === "India"
                                    ? finalAmount -
                                      (finalAmount * discountRate) / 100 +
                                      totalIPPrice * newMachineTime
                                    : (finalAmount -
                                        (finalAmount * discountRate) / 100) *
                                        (1 + surcharge / 100) +
                                      totalIPPrice * newMachineTime,
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}{" "}
                          / Month
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
                        <div
                          className="machine-ip"
                          style={{ marginTop: "15px" }}
                        >
                          {/* Location: {""} */}
                        </div>
                        <div
                          className="machine-ip"
                          style={{
                            marginTop: "0px",
                            textAlign: "center",
                            color: "#154e7a",
                            fontWeight: "600",
                          }}
                        >
                          Public IP
                          <div
                            className="counter-section"
                            style={{ marginTop: "10px" }}
                          >
                            <button onClick={decrement} className="counter-btn">
                              −
                            </button>
                            <span style={{ margin: "0 15px" }}>{counter}</span>
                            <button onClick={increment} className="counter-btn">
                              +
                            </button>
                          </div>
                        </div>
                        <div
                          className="machine-ip"
                          style={{ marginTop: "8px" }}
                        >
                          Domain not Required
                        </div>
                        <div
                          className="machine-date"
                          style={{ marginTop: "8px" }}
                        >
                          Unmanaged Cloud VM
                        </div>
                        <div
                          className="machine-date"
                          style={{ marginTop: "8px" }}
                        >
                          SSL Managed by VM Admin
                        </div>
                        <div
                          className="log-in"
                          style={{
                            marginTop: "5px",
                            marginLeft: "-8rem",
                            justifyContent: "center",
                          }}
                          onClick={() => {
                            // setSelectedNumIP(counter);
                            setJumpServer(true)
                            if (activePage == "Custom Configure") {
                              CreateCustomMachine_Li(selectedNoIP,1);
                            } else {
                              CreateMachine_Li(selectedNoIP,1);
                            }
                          }}
                        >
                          <a href="#" className="media-link">
                            <div
                              className="media-banner"
                              style={{
                                width: "auto",
                                height: "50px",
                                marginTop: "5px",
                                marginLeft: "10rem",
                              }}
                            >
                              <img
                                className="normal-banner"
                                src="/admin/images/admin/wallet/add-money-btn.png"
                                alt=""
                                style={{
                                  marginTop: "5px",
                                  width: "9rem",
                                  height: "3rem",
                                }}
                              />
                              <img
                                className="hover-img-banner"
                                src="/admin/images/admin/wallet/recharge-btn.png"
                                alt="/admin/images/admin/wallet/recharge-btn.png"
                                style={{
                                  marginTop: "5px",
                                  width: "9rem",
                                  height: "3rem",
                                }}
                              />

                              <span
                                className="login-text"
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  marginTop: "5px",
                                  fontWeight: "600",
                                }}
                              >
                                Launch Machine
                              </span>
                            </div>
                          </a>
                        </div>

                        <br />
                        <br />
                      </div>
                    </div>
                    
                  </div>
                </div>
              ) : (
                // WEBVIEW
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "100px",
                    padding: "3rem",
                  }}
                >
                  {/* First Tab */}
                  <div
                    className="box"
                    style={{
                      marginRight: "15px",
                      // marginTop: "10px",
                      width: "15rem",
                    }}
                  >
                    <div
                      style={{
                        // padding: "20px",
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
                      <div
                        className="machine-icon-edit-profile"
                        style={{
                          // marginLeft: "22px",
                          width: "94px",
                          height: "94px",
                        }}
                      >
                        <img
                          src={"/images/admin/01-home/cpu.svg"}
                          alt={""}
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                        />
                      </div>
                      <div
                        className="machine-titles theme-bg-orange"
                        style={{
                          width: "116px",
                          fontWeight: "600",
                          // height: "40px",
                        }}
                      >
                        Portgate VM
                      </div>

                      <div className="machine-name theme-color-blue">{""}</div>

                      <div
                        className="machine-config-badge"
                        style={{
                          color: "white",
                          backgroundColor: "#154e7a",
                          fontWeight: "600",
                          marginTop: "10px",
                        }}
                      >
                        {activePage === "Custom Configure" ? (
                          <>
                            {configType === 1 &&
                              smuser &&
                              appCurrency &&
                              stdCusHDD &&
                              stdCusSSD &&
                              stdCusNVM &&
                              currencyReturn({
                                price:
                                  diskType === "ssd"
                                    ? calculatePrice(
                                        stdCusSSD.cpu_rate,
                                        stdCusSSD.ram_rate,
                                        stdCusSSD.ssd_price,
                                        discountRate || 0,
                                        1,
                                      )
                                    : diskType === "nvme"
                                      ? calculatePrice(
                                          stdCusNVM.cpu_rate,
                                          stdCusNVM.ram_rate,
                                          stdCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime,
                                        )
                                      : calculatePrice(
                                          stdCusHDD.cpu_rate,
                                          stdCusHDD.ram_rate,
                                          stdCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime,
                                        ),
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}

                            {configType === 2 &&
                              smuser &&
                              appCurrency &&
                              cpuCusSSD &&
                              cpuCusNVM &&
                              cpuCusHDD &&
                              currencyReturn({
                                price:
                                  diskType === "ssd"
                                    ? calculatePrice(
                                        cpuCusSSD.cpu_rate,
                                        cpuCusSSD.ram_rate,
                                        cpuCusSSD.ssd_price,
                                        discountRate || 0,
                                        newMachineTime,
                                      )
                                    : diskType === "nvme"
                                      ? calculatePrice(
                                          cpuCusNVM.cpu_rate,
                                          cpuCusNVM.ram_rate,
                                          cpuCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime,
                                        )
                                      : calculatePrice(
                                          cpuCusHDD.cpu_rate,
                                          cpuCusHDD.ram_rate,
                                          cpuCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime,
                                        ),
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}

                            {configType === 3 &&
                              smuser &&
                              appCurrency &&
                              ramCusSSD &&
                              ramCusNVM &&
                              ramCusHDD &&
                              currencyReturn({
                                price:
                                  diskType === "ssd"
                                    ? calculatePrice(
                                        ramCusSSD.cpu_rate,
                                        ramCusSSD.ram_rate,
                                        ramCusSSD.ssd_price,
                                        discountRate || 0,
                                        newMachineTime,
                                      )
                                    : diskType === "nvme"
                                      ? calculatePrice(
                                          ramCusNVM.cpu_rate,
                                          ramCusNVM.ram_rate,
                                          ramCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime,
                                        )
                                      : calculatePrice(
                                          ramCusHDD.cpu_rate,
                                          ramCusHDD.ram_rate,
                                          ramCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime,
                                        ),
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}
                          </>
                        ) : (
                          currencyReturn({
                            price:
                              smuser.country === "India"
                                ? finalAmount -
                                  (finalAmount * discountRate) / 100
                                : (finalAmount -
                                    (finalAmount * discountRate) / 100) *
                                  (1 + surcharge / 100),
                            symbol: smuser.prefer_currency,
                            rates: appCurrency,
                          })
                        )}{" "}
                        / Month
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
                      <div className="machine-ip" style={{ marginTop: "8px" }}>
                        {/* Location: {""} */}
                      </div>
                      <div
                        className="machine-ip"
                        style={{
                          marginTop: "8px",
                          textAlign: "center",
                          color: "#154e7a",
                          fontWeight: "600",
                        }}
                      >
                        Public IP
                      </div>
                      <div className="machine-ip" style={{ marginTop: "8px" }}>
                        Required Domain
                      </div>
                      <div
                        className="machine-date"
                        style={{ marginTop: "8px", textAlign: "center" }}
                      >
                        HTTP to HTTPS <br></br> Redirect : Enabled
                      </div>

                      <div
                        className="machine-date"
                        style={{ marginTop: "8px" }}
                      >
                        SSL : Enabled
                      </div>

                      <div
                        className="log-in"
                        style={{
                          marginTop: "10px",
                          marginLeft: "-8rem",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          // setSelectedNumIP(0);
                          selectedNoIP = 0;
                          totalIPPrice = 0;
                          if (activePage == "Custom Configure") {
                            CreateCustomMachine_Li(selectedNoIP,0);
                          } else {
                            CreateMachine_Li(selectedNoIP,0);
                          }
                        }}
                      >
                        <a href="#" className="media-link">
                          <div
                            className="media-banner"
                            style={{
                              width: "auto",
                              height: "50px",
                              // marginTop: "10px",
                              marginLeft: "10rem",
                            }}
                          >
                            <img
                              className="normal-banner"
                              src="/admin/images/admin/wallet/add-money-btn.png"
                              alt=""
                              style={{
                                marginTop: "0px",
                                width: "9rem",
                                height: "3rem",
                              }}
                            />
                            <img
                              className="hover-img-banner"
                              src="/admin/images/admin/wallet/recharge-btn.png"
                              alt="/admin/images/admin/wallet/recharge-btn.png"
                              style={{
                                marginTop: "0px",
                                width: "9rem",
                                height: "3rem",
                              }}
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
                              Launch Machine
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Second Tab */}
                  <div
                    className="box"
                    style={{
                      marginRight: "15px",
                      marginTop: "-20px",
                      width: "15rem",
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
                      <div
                        className="machine-icon-edit-profile"
                        style={{
                          // marginLeft: "22px",
                          width: "94px",
                          height: "94px",
                        }}
                      >
                        <img
                          src={"/images/admin/01-home/cpu.svg"}
                          alt={""}
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                        />
                      </div>
                      <div
                        className="machine-titles theme-bg-orange"
                        style={{
                          width: "100px",
                          fontWeight: "600",
                          // height: "40px",
                        }}
                      >
                        Cloud VM
                      </div>

                      <div className="machine-name theme-color-blue">{""}</div>

                      <div
                        className="machine-config-badge"
                        style={{
                          color: "white",
                          backgroundColor: "#154e7a",
                          fontWeight: "600",
                          marginTop: "10px",
                        }}
                      >
                        {activePage === "Custom Configure"
                          ? (() => {
                              const calculatePrice = (config, priceKey) => {
                                const basePrice =
                                  customCPU * config.cpu_rate +
                                  customRAM * config.ram_rate +
                                  customDISK * config[priceKey] +
                                  customDATAT * 1;
                                const discountedPrice =
                                  basePrice - (basePrice * discountRate) / 100;
                                if (smuser.country === "India") {
                                  return (
                                    discountedPrice * newMachineTime +
                                    totalIPPrice * newMachineTime
                                  );
                                } else {
                                  return (
                                    discountedPrice *
                                      newMachineTime *
                                      (1 + surcharge / 100) +
                                    totalIPPrice * newMachineTime
                                  );
                                }
                              };

                              if (!smuser || !appCurrency) return null;

                              switch (configType) {
                                case 1:
                                  return currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculatePrice(stdCusSSD, "ssd_price")
                                        : diskType === "nvme"
                                          ? calculatePrice(
                                              stdCusNVM,
                                              "nvme_price",
                                            )
                                          : calculatePrice(
                                              stdCusHDD,
                                              "hdd_rate",
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  });
                                case 2:
                                  return currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculatePrice(cpuCusSSD, "ssd_price")
                                        : diskType === "nvme"
                                          ? calculatePrice(
                                              cpuCusNVM,
                                              "nvme_price",
                                            )
                                          : calculatePrice(
                                              cpuCusHDD,
                                              "hdd_rate",
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  });
                                case 3:
                                  return currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculatePrice(ramCusSSD, "ssd_price")
                                        : diskType === "nvme"
                                          ? calculatePrice(
                                              ramCusNVM,
                                              "nvme_price",
                                            )
                                          : calculatePrice(
                                              ramCusHDD,
                                              "hdd_rate",
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  });
                                default:
                                  return null;
                              }
                            })()
                          : currencyReturn({
                              price:
                                smuser.country === "India"
                                  ? finalAmount -
                                    (finalAmount * discountRate) / 100 +
                                    totalIPPrice * newMachineTime
                                  : (finalAmount -
                                      (finalAmount * discountRate) / 100) *
                                      (1 + surcharge / 100) +
                                    totalIPPrice * newMachineTime,
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}{" "}
                        / Month
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
                      <div className="machine-ip" style={{ marginTop: "15px" }}>
                        {/* Location: {""} */}
                      </div>
                      <div
                        className="machine-ip"
                        style={{
                          marginTop: "0px",
                          textAlign: "center",
                          color: "#154e7a",
                          fontWeight: "600",
                        }}
                      >
                        Public IP
                        <div
                          className="counter-section"
                          style={{ marginTop: "10px" }}
                        >
                          <button onClick={decrement} className="counter-btn">
                            −
                          </button>
                          <span style={{ margin: "0 15px" }}>{counter}</span>
                          <button onClick={increment} className="counter-btn">
                            +
                          </button>
                        </div>
                      </div>
                      <div className="machine-ip" style={{ marginTop: "8px" }}>
                        Domain not Required
                      </div>
                      <div
                        className="machine-date"
                        style={{ marginTop: "8px" }}
                      >
                        Unmanaged Cloud VM
                      </div>
                      <div
                        className="machine-date"
                        style={{ marginTop: "8px" }}
                      >
                        SSL Managed by VM Admin
                      </div>
                      <div
                        className="log-in"
                        style={{
                          marginTop: "5px",
                          marginLeft: "-8rem",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          // setSelectedNumIP(counter);
                          if (activePage == "Custom Configure") {
                            CreateCustomMachine_Li(selectedNoIP,0);
                          } else {
                            CreateMachine_Li(selectedNoIP,0);
                          }
                        }}
                      >
                        <a href="#" className="media-link">
                          <div
                            className="media-banner"
                            style={{
                              width: "auto",
                              height: "50px",
                              marginTop: "5px",
                              marginLeft: "10rem",
                            }}
                          >
                            <img
                              className="normal-banner"
                              src="/admin/images/admin/wallet/add-money-btn.png"
                              alt=""
                              style={{
                                marginTop: "5px",
                                width: "9rem",
                                height: "3rem",
                              }}
                            />
                            <img
                              className="hover-img-banner"
                              src="/admin/images/admin/wallet/recharge-btn.png"
                              alt="/admin/images/admin/wallet/recharge-btn.png"
                              style={{
                                marginTop: "5px",
                                width: "9rem",
                                height: "3rem",
                              }}
                            />

                            <span
                              className="login-text"
                              style={{
                                color: "white",
                                fontSize: "15px",
                                marginTop: "5px",
                                fontWeight: "600",
                              }}
                            >
                              Launch Machine
                            </span>
                          </div>
                        </a>
                      </div>

                      <br />
                      <br />
                    </div>
                  </div>

                  {/* Third Tab */}
                  <div
                    className="box"
                    style={{
                      marginRight: "15px",
                      marginTop: "-20px",
                      width: "15rem",
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
                      <div
                        className="machine-icon-edit-profile"
                        style={{
                          width: "94px",
                          height: "94px",
                        }}
                      >
                        <img
                          src={"/images/admin/01-home/cpu.svg"}
                          alt={""}
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                        />
                      </div>
                      <div
                        className="machine-titles theme-bg-orange"
                        style={{
                          width: "100px",
                          fontWeight: "600",
                        }}
                      >
                        Jump Server
                      </div>

                      <div className="machine-name theme-color-blue">{""}</div>

                      <div
                        className="machine-config-badge"
                        style={{
                          color: "white",
                          backgroundColor: "#154e7a",
                          fontWeight: "600",
                          marginTop: "10px",
                        }}
                      >
                        {activePage === "Custom Configure"
                          ? (() => {
                              const calculatePrice = (config, priceKey) => {
                                const basePrice =
                                  customCPU * config.cpu_rate +
                                  customRAM * config.ram_rate +
                                  customDISK * config[priceKey] +
                                  customDATAT * 1;
                                const discountedPrice =
                                  basePrice - (basePrice * discountRate) / 100;
                                if (smuser.country === "India") {
                                  return (
                                    discountedPrice * newMachineTime +
                                    totalIPPrice * newMachineTime
                                  );
                                } else {
                                  return (
                                    discountedPrice *
                                      newMachineTime *
                                      (1 + surcharge / 100) +
                                    totalIPPrice * newMachineTime
                                  );
                                }
                              };

                              if (!smuser || !appCurrency) return null;

                              switch (configType) {
                                case 1:
                                  return currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculatePrice(stdCusSSD, "ssd_price")
                                        : diskType === "nvme"
                                          ? calculatePrice(
                                              stdCusNVM,
                                              "nvme_price",
                                            )
                                          : calculatePrice(
                                              stdCusHDD,
                                              "hdd_rate",
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  });
                                case 2:
                                  return currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculatePrice(cpuCusSSD, "ssd_price")
                                        : diskType === "nvme"
                                          ? calculatePrice(
                                              cpuCusNVM,
                                              "nvme_price",
                                            )
                                          : calculatePrice(
                                              cpuCusHDD,
                                              "hdd_rate",
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  });
                                case 3:
                                  return currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculatePrice(ramCusSSD, "ssd_price")
                                        : diskType === "nvme"
                                          ? calculatePrice(
                                              ramCusNVM,
                                              "nvme_price",
                                            )
                                          : calculatePrice(
                                              ramCusHDD,
                                              "hdd_rate",
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  });
                                default:
                                  return null;
                              }
                            })()
                          : currencyReturn({
                              price:
                                smuser.country === "India"
                                  ? finalAmount -
                                    (finalAmount * discountRate) / 100 +
                                    totalIPPrice * newMachineTime
                                  : (finalAmount -
                                      (finalAmount * discountRate) / 100) *
                                      (1 + surcharge / 100) +
                                    totalIPPrice * newMachineTime,
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}{" "}
                        / Month
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
                        >
                          
                        </div>
                      <div className="machine-ip" style={{ marginTop: "15px" }}>
                        {/* Location: {""} */}
                      </div>
                      <div
                        className="machine-ip"
                        style={{
                          marginTop: "0px",
                          textAlign: "center",
                          color: "#154e7a",
                          fontWeight: "600",
                        }}
                      >
                        Public IP
                        <div
                          className="counter-section"
                          style={{ marginTop: "10px" }}
                        >
                          <button onClick={decrement} className="counter-btn">
                            −
                          </button>
                          <span style={{ margin: "0 15px" }}>{counter}</span>
                          <button onClick={increment} className="counter-btn">
                            +
                          </button>
                        </div>
                      </div>
                      <div className="machine-ip" style={{ marginTop: "8px" }}>
                        Domain not Required
                      </div>
                      <div
                        className="machine-date"
                        style={{ marginTop: "8px" }}
                      >
                        Unmanaged Cloud VM
                      </div>
                      <div
                        className="machine-date"
                        style={{ marginTop: "8px" }}
                      >
                        SSL Managed by VM Admin
                      </div>
                      <div
                        className="log-in"
                        style={{
                          marginTop: "5px",
                          marginLeft: "-8rem",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          // setSelectedNumIP(counter);
                          if (activePage == "Custom Configure") {
                              setJumpServer(true);   
                              CreateCustomMachine_Li(selectedNoIP,1);
                          } else {
                              setJumpServer(true);   
                              CreateMachine_Li(selectedNoIP,1);
                          }
                        }}
                      >
                        <a href="#" className="media-link">
                          <div
                            className="media-banner"
                            style={{
                              width: "auto",
                              height: "50px",
                              marginTop: "5px",
                              marginLeft: "10rem",
                            }}
                          >
                            <img
                              className="normal-banner"
                              src="/admin/images/admin/wallet/add-money-btn.png"
                              alt=""
                              style={{
                                marginTop: "5px",
                                width: "9rem",
                                height: "3rem",
                              }}
                            />
                            <img
                              className="hover-img-banner"
                              src="/admin/images/admin/wallet/recharge-btn.png"
                              alt="/admin/images/admin/wallet/recharge-btn.png"
                              style={{
                                marginTop: "5px",
                                width: "9rem",
                                height: "3rem",
                              }}
                            />

                            <span
                              className="login-text"
                              style={{
                                color: "white",
                                fontSize: "15px",
                                marginTop: "5px",
                                fontWeight: "600",
                              }}
                            >
                              Launch Machine
                            </span>
                          </div>
                        </a>
                      </div>

                      <br />
                      <br />
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upnet credit content popup */}
      {isShowUpnetCreditContentPopup && (
        <div
          style={{
            top: isMobile ? "95%" : "10%",
            left: isMobile ? "5%" : "28%",
            position: "absolute",
            zIndex: "9",
            width: isMobile ? "23rem" : "60rem",
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
              ShowUpnetCreditContentPopup(!isShowUpnetCreditContentPopup)
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
                top: "13rem",
                left: "50%",
                width: "85%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                outline: "4px solid #035189",
                border: "4px solid #fff",
                borderColor: "white",
                borderRadius: "30px",
                backgroundColor: "#035189",
                fontSize: "18px",
                fontWeight: "normal",
                lineHeight: "2em",
                textAlign: "left",
              }}
            >
              <strong>UPNET Credits Applied:</strong> Your account has been
              credited with UPNET Credits.
              <br />
              <strong>Usage of Credits:</strong> You can utilize these credits
              alongside the standard discount, with a prorated calculation of
              {/* <strong> {upnetPercentage} %</strong>. */}
              <span
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#e97730",
                  border: "none",
                  fontSize: "20px",
                  padding: "6px ",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "10px",
                }}
              >
                {upnetPercentage}%
              </span>
              <br />
              <strong>Server Cost:</strong> The total cost for the server is
              <span
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#e97730",
                  border: "none",
                  fontSize: "20px",
                  padding: "6px",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "10px",
                }}
              >
                {currencyReturn({
                  price: finalAmount - (finalAmount * discountRate) / 100,
                  symbol: smuser.prefer_currency,
                  rates: appCurrency,
                })}
              </span>
              <br />
              <strong>Available Credits:</strong> You have
              <span
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#e97730",
                  border: "none",
                  fontSize: "20px",
                  padding: "6px",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "10px",
                }}
              >
                {currencyReturn({
                  price: smuser.reward_points,
                  symbol: smuser.prefer_currency,
                  rates: appCurrency,
                })}
              </span>{" "}
              in UPNET Credits.
              <br />
              <strong>Amount to Add:</strong> To launch the server, you need to
              add
              <span
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#e97730",
                  border: "none",
                  fontSize: "20px",
                  padding: "6px",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "10px",
                }}
              >
                {currencyReturn({
                  price: addToWalletAmt,
                  symbol: smuser.prefer_currency,
                  rates: appCurrency,
                })}
              </span>{" "}
              to your UPNET Wallet.
            </h4>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: isMobile ? "11%" : "10%",
              marginTop: "24rem",
              display: "flex",
              flexWrap: "nowrap",
              flexDirection: "row",
              gap: "4%",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                // width: isMobile ? "8rem" : "25rem",
                // marginTop: "80px",
                zIndex: "9",
                position: "relative",
                fontSize: "20px",
                // fontWeight: "700",
                color: "white",
                padding: "10px",
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
                ShowUpnetCreditContentPopup(!isShowUpnetCreditContentPopup);
                navigate("/wallet", {
                  state: {
                    isFromCredits: true,
                    upnetCreditAmount: addToWalletAmt,
                  },
                });
              }}
            >
              Add{" "}
              <strong>
                {currencyReturn({
                  price: addToWalletAmt,
                  symbol: smuser.prefer_currency,
                  rates: appCurrency,
                })}
              </strong>{" "}
              to your UPNET Wallet
            </button>
          </div>
        </div>
      )}

      {showJumpServerPopup && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backdropFilter: "blur(30px)",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              border: "2px solid #e97730",
              top: "12%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile ? "85%" : "40%",
              height: isMobile ? "30rem" : "30rem",
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          >
            <div
              style={{
                display: "grid",
                justifyItems: "center",
                padding: "2rem",
              }}
            >
              {/* Close Button */}
              <button
                style={{
                  position: "absolute",
                  backgroundColor: "transparent",
                  border: "none",
                  right: "10px",
                  top: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setShowJumpServerPopup(false)}
              >
                <FaX style={{ color: "#e97730", fontSize: "18px" }} />
              </button>

              <h3 style={{ color: "#154e7a", fontWeight: "700" }}>
                Jump Server Details
              </h3>

              {loadingJumpServer ? (
                <p style={{ marginTop: "2rem" }}>Loading...</p>
              ) : (
                <>
                  <div
                    style={{
                      marginTop: "1.5rem",
                      width: "100%",
                      display: "grid",
                      rowGap: "12px",
                      color: "#154e7a",
                      fontWeight: "600",
                    }}
                  >
                    <p>
                      <b>CPU:</b> {jumpServerDetails?.cpu}
                    </p>
                    <p>
                      <b>RAM:</b> {jumpServerDetails?.ram}
                    </p>
                    <p>
                      <b>Disk:</b> {jumpServerDetails?.disk}
                    </p>
                    <p>
                      <b>Price:</b> ${jumpServerDetails?.price} / Month
                    </p>
                  </div>

                  {/* Buttons */}
                  <div
                    style={{
                      marginTop: "2rem",
                      display: "flex",
                      gap: "15px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      style={{
                        padding: "10px 25px",
                        backgroundColor: "#e97730",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowJumpServerPopup(false);
                        setCounter(1);
                        setShowIPOptionPopup(true);
                      }}
                    >
                      Continue
                    </button>

                    <button
                      style={{
                        padding: "10px 25px",
                        backgroundColor: "transparent",
                        color: "#e97730",
                        border: "2px solid #e97730",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowJumpServerPopup(false)}
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <>
          <div className="scrollable-container" style={{ marginTop: "2rem" }}>
            {smuser && smuser.platform_status == "1" ? (
              <>
                <div style={{ width: "10rem", padding: "20px" }}>
                  <div
                    className="in-border"
                    style={{
                      alignContent: "center",
                      height: "100px",
                      width: "100px",
                      // padding: "5px",
                      borderColor: "yellow",
                      border: "2px solid #E97730",
                      borderRadius: "50%",
                      // display: "table",
                      // margin: "auto",
                      backgroundColor: "transparent",
                      padding: "0",
                      marginLeft: "30px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        height: "80px",
                        width: "80px",
                        padding: "1px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        margin: "auto",
                        backgroundColor: "#E97730",
                      }}
                    >
                      <figure
                        style={{
                          background: "#e97730",
                          borderRadius: "50%",
                          padding: "20px 8px 0px 0px",
                          // width: "70px",
                          // height: "70px",
                          objectFit: "cover",
                          display: "table",
                          margin: "auto",
                        }}
                      >
                        <img
                          src={"/images/admin/02-VM/ubanto-logo.svg"}
                          alt={""}
                          style={{ width: "40px", height: "40px" }}
                        />
                      </figure>
                    </div>
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#035189",
                      fontWeight: "600",
                      marginLeft: "24px",
                      marginTop: "5px",
                    }}
                  >
                    Ubantu
                  </h4>
                  <select
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "5px 5px",
                      border: "2px solid #e97730",
                      width: "10rem",
                    }}
                    value={ubantu_machine}
                    onChange={(e) => {
                      setNewMachineOs(e.target.value);
                      //console.log(e.target.value);
                      setUbantu_machine(e.target.value);
                      setFedora_machine("select");
                    }}
                  >
                    <option value="Select" selected>
                      Select
                    </option>
                    {ubantuOS &&
                      ubantuOS.map((item, index) => (
                        <option key={index} value={Object.values(item)[0]}>
                          {Object.keys(item)[0]}
                        </option>
                      ))}
                  </select>
                </div>
                <div style={{ width: "10rem", padding: "20px" }}>
                  <div
                    className="in-border"
                    style={{
                      alignContent: "center",
                      height: "100px",
                      width: "100px",
                      // padding: "5px",
                      borderColor: "yellow",
                      border: "2px solid #E97730",
                      borderRadius: "50%",
                      // display: "table",
                      // margin: "auto",
                      backgroundColor: "transparent",
                      padding: "0",
                      marginLeft: "30px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        height: "80px",
                        width: "80px",
                        padding: "1px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        margin: "auto",
                        backgroundColor: "#E97730",
                      }}
                    >
                      <figure
                        style={{
                          background: "#e97730",
                          borderRadius: "50%",
                          padding: "20px 8px 0px 0px",
                          // width: "70px",
                          // height: "70px",
                          objectFit: "cover",
                          display: "table",
                          margin: "auto",
                        }}
                      >
                        <img
                          src={"/images/admin/02-VM/window-logo.svg"}
                          alt={""}
                          style={{ width: "40px", height: "40px" }}
                        />
                      </figure>
                    </div>
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#035189",
                      fontWeight: "600",
                      marginLeft: "24px",
                      marginTop: "5px",
                    }}
                  >
                    Fedora
                  </h4>
                  <select
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "5px 5px",
                      border: "2px solid #e97730",
                      width: "10rem",
                      // marginRight: "15px",
                    }}
                    onChange={(e) => {
                      setNewMachineOs(e.target.value);
                      //console.log(e.target.value);
                      setUbantu_machine("Select");
                      setFedora_machine(e.target.value);
                    }}
                  >
                    <option value="Select" selected>
                      Select
                    </option>
                    {fedoraOS &&
                      fedoraOS.map((item, index) => (
                        <option key={index} value={Object.values(item)[0]}>
                          {Object.keys(item)[0]}
                        </option>
                      ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: "10rem",
                    padding: "20px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    className="in-border"
                    style={{
                      alignContent: "center",
                      height: "100px",
                      width: "100px",
                      // padding: "5px",
                      borderColor: "yellow",
                      border: "2px solid #E97730",
                      borderRadius: "50%",
                      // display: "table",
                      // margin: "auto",
                      backgroundColor: "transparent",
                      padding: "0",
                      marginLeft: "30px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        height: "80px",
                        width: "80px",
                        padding: "1px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        margin: "auto",
                        backgroundColor: "#E97730",
                      }}
                    >
                      <figure
                        style={{
                          background: "#e97730",
                          borderRadius: "50%",
                          padding: "20px 8px 0px 0px",
                          // width: "70px",
                          // height: "70px",
                          objectFit: "cover",
                          display: "table",
                          margin: "auto",
                        }}
                      >
                        <img
                          src={"/images/admin/02-VM/ubanto-logo.svg"}
                          alt={""}
                          style={{ width: "40px", height: "40px" }}
                        />
                      </figure>
                    </div>
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#035189",
                      fontWeight: "600",
                      marginLeft: "24px",
                      marginTop: "5px",
                    }}
                  >
                    Ubantu
                  </h4>
                  <select
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "5px 5px",
                      border: "2px solid #e97730",
                      width: "10rem",
                      marginRight: "5px",
                    }}
                    value={newMahineOs}
                    onChange={(e) => {
                      setNewMachineOs(e.target.value);
                      //console.log(e.target.value);
                    }}
                  >
                    <option value="Select" selected>
                      Select
                    </option>
                    {ubuntu_fa &&
                      ubuntu_fa.map((item, index) => (
                        <option key={index} value={Object.values(item)[0]}>
                          {Object.keys(item)[0]}
                        </option>
                      ))}
                  </select>
                </div>

                <div
                  style={{
                    width: "10rem",
                    padding: "20px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    className="in-border"
                    style={{
                      alignContent: "center",
                      height: "100px",
                      width: "100px",
                      // padding: "5px",
                      borderColor: "yellow",
                      border: "2px solid #E97730",
                      borderRadius: "50%",
                      // display: "table",
                      // margin: "auto",
                      backgroundColor: "transparent",
                      padding: "0",
                      marginLeft: "30px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        height: "80px",
                        width: "80px",
                        padding: "1px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        margin: "auto",
                        backgroundColor: "#E97730",
                      }}
                    >
                      <figure
                        style={{
                          background: "#e97730",
                          borderRadius: "50%",
                          padding: "20px 8px 0px 0px",
                          // width: "70px",
                          // height: "70px",
                          objectFit: "cover",
                          display: "table",
                          margin: "auto",
                        }}
                      >
                        <img
                          src={"/fedora-icon.svg"}
                          alt={"/fedora-icon.svg"}
                          style={{
                            marginLeft: "5px",
                            marginTop: "-15px",
                            // width: "100px",
                            // height: "60px",
                          }}
                        />
                      </figure>
                    </div>
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#035189",
                      fontWeight: "600",
                      marginLeft: "24px",
                      marginTop: "5px",
                    }}
                  >
                    Fedora
                  </h4>
                  <select
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "5px 5px",
                      border: "2px solid #e97730",
                      width: "10rem",
                    }}
                    value={newMahineOs}
                    onChange={(e) => {
                      setNewMachineOs(e.target.value);
                      //console.log(e.target.value);
                    }}
                  >
                    <option value="Select" selected>
                      Select
                    </option>
                    {fedora_fa &&
                      fedora_fa.map((item, index) => (
                        <option key={index} value={Object.values(item)[0]}>
                          {Object.keys(item)[0]}
                        </option>
                      ))}
                  </select>
                </div>

                <div
                  style={{
                    width: "10rem",
                    padding: "20px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    className="in-border"
                    style={{
                      alignContent: "center",
                      height: "100px",
                      width: "100px",
                      // padding: "5px",
                      borderColor: "yellow",
                      border: "2px solid #E97730",
                      borderRadius: "50%",
                      // display: "table",
                      // margin: "auto",
                      backgroundColor: "transparent",
                      padding: "0",
                      marginLeft: "30px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        height: "80px",
                        width: "80px",
                        padding: "1px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        margin: "auto",
                        backgroundColor: "#E97730",
                      }}
                    >
                      <figure
                        style={{
                          background: "#e97730",
                          borderRadius: "50%",
                          padding: "20px 8px 0px 0px",
                          // width: "70px",
                          // height: "70px",
                          objectFit: "cover",
                          display: "table",
                          margin: "auto",
                        }}
                      >
                        <img
                          src={"/images/admin/02-VM/centos-logo.svg"}
                          alt={""}
                          style={{ width: "40px", height: "40px" }}
                        />
                      </figure>
                    </div>
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#035189",
                      fontWeight: "600",
                      marginLeft: "24px",
                      marginTop: "5px",
                    }}
                  >
                    CentOS
                  </h4>
                  <select
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "5px 5px",
                      border: "2px solid #e97730",
                      width: "10rem",
                    }}
                    value={newMahineOs}
                    onChange={(e) => {
                      setNewMachineOs(e.target.value);
                      //console.log(e.target.value);
                    }}
                  >
                    <option value="Select" selected>
                      Select
                    </option>
                    {centOS_fa &&
                      centOS_fa.map((item, index) => (
                        <option key={index} value={Object.values(item)[0]}>
                          {Object.keys(item)[0]}
                        </option>
                      ))}
                  </select>
                </div>

                {redhat_fa && (
                  <div
                    style={{
                      width: "10rem",
                      padding: "20px",
                      marginRight: "10px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        alignContent: "center",
                        height: "100px",
                        width: "100px",
                        // padding: "5px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        // margin: "auto",
                        backgroundColor: "transparent",
                        padding: "0",
                        marginLeft: "30px",
                      }}
                    >
                      <div
                        className="in-border"
                        style={{
                          height: "80px",
                          width: "80px",
                          padding: "1px",
                          borderColor: "yellow",
                          border: "2px solid #E97730",
                          borderRadius: "50%",
                          // display: "table",
                          margin: "auto",
                          backgroundColor: "#E97730",
                        }}
                      >
                        <figure
                          style={{
                            background: "#e97730",
                            borderRadius: "50%",
                            padding: "20px 8px 0px 0px",
                            // width: "70px",
                            // height: "70px",
                            objectFit: "cover",
                            display: "table",
                            margin: "auto",
                          }}
                        >
                          <img
                            src={"/images/admin/02-VM/ubanto-logo.svg"}
                            alt={""}
                            style={{ width: "40px", height: "40px" }}
                          />
                        </figure>
                      </div>
                    </div>
                    <h4
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                        textTransform: "capitalize",
                        color: "#035189",
                        fontWeight: "600",
                        marginLeft: "24px",
                        marginTop: "5px",
                      }}
                    >
                      Redhat
                    </h4>
                    <select
                      name="plan_time"
                      style={{
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "5px 5px",
                        border: "2px solid #e97730",
                        width: "10rem",
                      }}
                      value={newMahineOs}
                      onChange={(e) => {
                        setNewMachineOs(e.target.value);
                        //console.log(e.target.value);
                      }}
                    >
                      <option value="Select Vm" selected>
                        Select Vm
                      </option>
                      {redhat_fa &&
                        redhat_fa.map((item, index) => (
                          <option key={index} value={Object.values(item)[0]}>
                            {Object.keys(item)[0]}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div
                  style={{
                    width: "10rem",
                    padding: "20px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    className="in-border"
                    style={{
                      alignContent: "center",
                      height: "100px",
                      width: "100px",
                      // padding: "5px",
                      borderColor: "yellow",
                      border: "2px solid #E97730",
                      borderRadius: "50%",
                      // display: "table",
                      // margin: "auto",
                      backgroundColor: "transparent",
                      padding: "0",
                      marginLeft: "30px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        height: "80px",
                        width: "80px",
                        padding: "1px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        margin: "auto",
                        backgroundColor: "#E97730",
                      }}
                    >
                      <figure
                        style={{
                          background: "#e97730",
                          borderRadius: "50%",
                          padding: "20px 8px 0px 0px",
                          // width: "70px",
                          // height: "70px",
                          objectFit: "cover",
                          display: "table",
                          margin: "auto",
                        }}
                      >
                        <img
                          src={"/rocky-icon.svg"}
                          alt={"/rocky-icon.svg"}
                          style={{
                            marginTop: "-5px",
                            marginLeft: "10px",
                            width: "50px",
                            height: "50px",
                          }}
                        />
                      </figure>
                    </div>
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#035189",
                      fontWeight: "600",
                      marginLeft: "40px",
                      marginTop: "5px",
                    }}
                  >
                    Rocky
                  </h4>
                  <select
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "5px 5px",
                      border: "2px solid #e97730",
                      width: "10rem",
                    }}
                    value={newMahineOs}
                    onChange={(e) => {
                      setNewMachineOs(e.target.value);
                      //console.log(e.target.value);
                    }}
                  >
                    <option value="Select Vm" selected>
                      Select
                    </option>
                    {rocky_fa &&
                      rocky_fa.map((item, index) => (
                        <option key={index} value={Object.values(item)[0]}>
                          {Object.keys(item)[0]}
                        </option>
                      ))}
                  </select>
                </div>

                <div
                  style={{
                    width: "10rem",
                    padding: "20px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    className="in-border"
                    style={{
                      alignContent: "center",
                      height: "100px",
                      width: "100px",
                      // padding: "5px",
                      borderColor: "yellow",
                      border: "2px solid #E97730",
                      borderRadius: "50%",
                      // display: "table",
                      // margin: "auto",
                      backgroundColor: "transparent",
                      padding: "0",
                      marginLeft: "30px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        height: "80px",
                        width: "80px",
                        padding: "1px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        margin: "auto",
                        backgroundColor: "#E97730",
                      }}
                    >
                      <figure
                        style={{
                          background: "#e97730",
                          borderRadius: "50%",
                          padding: "20px 8px 0px 0px",
                          // width: "70px",
                          // height: "70px",
                          objectFit: "cover",
                          display: "table",
                          margin: "auto",
                        }}
                      >
                        <img
                          src={"/alma-icon.svg"}
                          alt={"/alma-icon.svg"}
                          style={{
                            marginTop: "-5px",
                            marginLeft: "10px",
                            width: "50px",
                            height: "50px",
                          }}
                        />
                      </figure>
                    </div>
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#035189",
                      fontWeight: "600",
                      marginLeft: "24px",
                      marginTop: "5px",
                    }}
                  >
                    Almalinux
                  </h4>
                  <select
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "5px 5px",
                      border: "2px solid #e97730",
                      width: "10rem",
                    }}
                    value={newMahineOs}
                    onChange={(e) => {
                      setNewMachineOs(e.target.value);
                      //console.log(e.target.value);
                    }}
                  >
                    <option value="Select Vm" selected>
                      Select
                    </option>
                    {linux_fa &&
                      linux_fa.map((item, index) => (
                        <option key={index} value={Object.values(item)[0]}>
                          {Object.keys(item)[0]}
                        </option>
                      ))}
                  </select>
                </div>

                <div
                  style={{
                    width: "10rem",
                    padding: "20px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    className="in-border"
                    style={{
                      alignContent: "center",
                      height: "100px",
                      width: "100px",
                      // padding: "5px",
                      borderColor: "yellow",
                      border: "2px solid #E97730",
                      borderRadius: "50%",
                      // display: "table",
                      // margin: "auto",
                      backgroundColor: "transparent",
                      padding: "0",
                      marginLeft: "30px",
                    }}
                  >
                    <div
                      className="in-border"
                      style={{
                        height: "80px",
                        width: "80px",
                        padding: "1px",
                        borderColor: "yellow",
                        border: "2px solid #E97730",
                        borderRadius: "50%",
                        // display: "table",
                        margin: "auto",
                        backgroundColor: "#E97730",
                      }}
                    >
                      <figure
                        style={{
                          background: "#e97730",
                          borderRadius: "50%",
                          padding: "20px 8px 0px 0px",
                          // width: "70px",
                          // height: "70px",
                          objectFit: "cover",
                          display: "table",
                          margin: "auto",
                        }}
                      >
                        <img
                          src={"/debian-icon.svg"}
                          alt={"/debian-icon.svg"}
                          style={{
                            marginTop: "-5px",
                            marginLeft: "10px",
                            width: "50px",
                            height: "50px",
                          }}
                        />
                      </figure>
                    </div>
                  </div>
                  <h4
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      color: "#035189",
                      fontWeight: "600",
                      marginLeft: "24px",
                      marginTop: "5px",
                    }}
                  >
                    Debian
                  </h4>
                  <select
                    name="plan_time"
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "5px 5px",
                      border: "2px solid #e97730",
                      width: "10rem",
                    }}
                    value={newMahineOs}
                    onChange={(e) => {
                      setNewMachineOs(e.target.value);
                      //console.log(e.target.value);
                    }}
                  >
                    <option value="Select Vm" selected>
                      Select
                    </option>
                    {debian_fa &&
                      debian_fa.map((item, index) => (
                        <option key={index} value={Object.values(item)[0]}>
                          {Object.keys(item)[0]}
                        </option>
                      ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: "6rem", marginBottom: "75px" }}>
            <div
              style={{ borderTop: "1px solid #919191", margin: "6px" }}
            ></div>
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                height: "3rem",
                justifyContent: "space-around",
                marginLeft: "10px",
              }}
            >
              <select
                name="time"
                style={{
                  height: "35px",
                  width: "100px",
                  borderRadius: "30px",
                  padding: "5px 5px",
                  border: "2px solid #e97730",
                }}
                onChange={(e) => {
                  setFinalAmount(machineAmt * e.target.value);
                  setNewMachineTime(e.target.value);
                  // setSelectedIdx(null);

                  {
                    activePage === "Custom Configure" ? (
                      <></>
                    ) : activePage === "Standard" ? (
                      <>
                        {diskType == "ssd" ? (
                          <>
                            {sSsd &&
                              sSsd.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        ) : diskType == "nvme" ? (
                          <>
                            {sNvm &&
                              sNvm.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        ) : (
                          <>
                            {sHdd &&
                              sHdd.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        )}
                      </>
                    ) : activePage === "CPU Proactive" ? (
                      <>
                        {diskType == "ssd" ? (
                          <>
                            {cSsd &&
                              cSsd.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        ) : diskType == "nvme" ? (
                          <>
                            {cNvm &&
                              cNvm.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        ) : (
                          <>
                            {cHdd &&
                              cHdd.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {diskType == "ssd" ? (
                          <>
                            {rSsd &&
                              rSsd.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        ) : diskType == "nvme" ? (
                          <>
                            {rNvm &&
                              rNvm.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        ) : (
                          <>
                            {rHdd &&
                              rHdd.map((item, idx) =>
                                setDiscountRate(
                                  item[`discount_price_${e.target.value}`],
                                ),
                              )}
                          </>
                        )}
                      </>
                    );
                  }
                }}
              >
                <option value="1">1 Month</option>
                <option value="3">3 Month</option>
                <option value="6">6 Month</option>
                <option value="9">9 Month</option>
                <option value="12">1 Year</option>
                <option value="24">2 Years</option>
              </select>
              <select
                name="plan_time"
                style={{
                  marginLeft: "15px",
                  borderRadius: "30px",
                  marginRight: "10px",
                  //padding: "10px 15px",
                  border: "2px solid #e97730",
                  width: "10rem",
                  height: "35px",
                }}
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                }}
              >
                {/* <option value="Select" selected>
                  Select Location
                </option> */}
                {serverLocaiton &&
                  serverLocaiton.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.server_location}
                    </option>
                  ))}
              </select>
              <div
                className="input-container"
                style={{
                  marginLeft: "5px",
                  height: "35px",
                  border: "2px solid #e97730",
                  width: "10rem",
                  marginTop: "0px",
                  marginRight: "15px",
                }}
              >
                <input
                  value={newMachineName}
                  type="text"
                  name="CompanyName"
                  className="input-create-machine"
                  placeholder="Name of Machine"
                  style={{
                    width: "4rem",
                    color: "black",
                  }}
                  onChange={(e) => setNewMachineName(e.target.value)}
                />
              </div>

              <br />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center", // Align items vertically in the center
                // backgroundColor: "#e97730",
                marginLeft: "5px",
                color: "white",
                fontWeight: "600",
              }}
            >
              {activePage == "Custom Configure" ? (
                <>
                  <div
                    className="price-container"
                    style={{ marginBottom: "10px", marginLeft: "7px" }}
                  >
                    <div className="price-old">
                      {(() => {
                        let discount;

                        if (
                          configType === 1 ||
                          configType === 5 ||
                          configType === 6
                        ) {
                          discount =
                            diskType === "ssd"
                              ? `${
                                  stdCusSSD[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : diskType === "nvme"
                                ? `${
                                    stdCusNVM[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : `${
                                    stdCusHDD[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`;
                        } else if (
                          configType === 3 ||
                          configType === 7 ||
                          configType === 8
                        ) {
                          discount =
                            diskType === "ssd"
                              ? `${
                                  cpuCusSSD[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : diskType === "nvme"
                                ? `${
                                    cpuCusNVM[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : `${
                                    cpuCusHDD[
                                      `discount_price_${newMachineTime}`
                                    ].custom_discount
                                  } % OFF`;
                        } else {
                          discount =
                            diskType === "ssd"
                              ? `${
                                  ramCusSSD[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : diskType === "nvme"
                                ? `${
                                    ramCusNVM[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : `${
                                    ramCusHDD[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`;
                        }

                        if (parseFloat(discount) > 0) {
                          return (
                            <span
                              style={{
                                textDecoration: "line-through",
                                fontSize: "15px",
                                marginRight: "10px",
                              }}
                            >
                              {configType === 1 &&
                                smuser &&
                                appCurrency &&
                                stdCusHDD &&
                                stdCusSSD &&
                                stdCusNVM &&
                                currencyReturn({
                                  price:
                                    diskType === "ssd"
                                      ? calculateOriginalPrice(
                                          stdCusSSD.cpu_rate,
                                          stdCusSSD.ram_rate,
                                          stdCusSSD.ssd_price,
                                        )
                                      : diskType === "nvme"
                                        ? calculateOriginalPrice(
                                            stdCusNVM.cpu_rate,
                                            stdCusNVM.ram_rate,
                                            stdCusNVM.nvme_price,
                                          )
                                        : calculateOriginalPrice(
                                            stdCusHDD.cpu_rate,
                                            stdCusHDD.ram_rate,
                                            stdCusHDD.hdd_rate,
                                          ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}

                              {configType === 2 &&
                                smuser &&
                                appCurrency &&
                                cpuCusSSD &&
                                cpuCusNVM &&
                                cpuCusHDD &&
                                currencyReturn({
                                  price:
                                    diskType === "ssd"
                                      ? calculateOriginalPrice(
                                          cpuCusSSD.cpu_rate,
                                          cpuCusSSD.ram_rate,
                                          cpuCusSSD.ssd_price,
                                        )
                                      : diskType === "nvme"
                                        ? calculateOriginalPrice(
                                            cpuCusNVM.cpu_rate,
                                            cpuCusNVM.ram_rate,
                                            cpuCusNVM.nvme_price,
                                          )
                                        : calculateOriginalPrice(
                                            cpuCusHDD.cpu_rate,
                                            cpuCusHDD.ram_rate,
                                            cpuCusHDD.hdd_rate,
                                          ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}

                              {configType === 3 &&
                                smuser &&
                                appCurrency &&
                                ramCusSSD &&
                                ramCusNVM &&
                                ramCusHDD &&
                                currencyReturn({
                                  price:
                                    diskType === "ssd"
                                      ? calculateOriginalPrice(
                                          ramCusSSD.cpu_rate,
                                          ramCusSSD.ram_rate,
                                          ramCusSSD.ssd_price,
                                        )
                                      : diskType === "nvme"
                                        ? calculateOriginalPrice(
                                            ramCusNVM.cpu_rate,
                                            ramCusNVM.ram_rate,
                                            ramCusNVM.nvme_price,
                                          )
                                        : calculateOriginalPrice(
                                            ramCusHDD.cpu_rate,
                                            ramCusHDD.ram_rate,
                                            ramCusHDD.hdd_rate,
                                          ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                            </span>
                          );
                        }

                        return null; // Return null if discount is not greater than 0
                      })()}

                      {configType === 1 &&
                        smuser &&
                        appCurrency &&
                        stdCusHDD &&
                        stdCusSSD &&
                        stdCusNVM &&
                        currencyReturn({
                          price:
                            diskType === "ssd"
                              ? calculatePrice(
                                  stdCusSSD.cpu_rate,
                                  stdCusSSD.ram_rate,
                                  stdCusSSD.ssd_price,
                                  discountRate || 0,
                                  1,
                                )
                              : diskType === "nvme"
                                ? calculatePrice(
                                    stdCusNVM.cpu_rate,
                                    stdCusNVM.ram_rate,
                                    stdCusNVM.nvme_price,
                                    discountRate || 0,
                                    newMachineTime,
                                  )
                                : calculatePrice(
                                    stdCusHDD.cpu_rate,
                                    stdCusHDD.ram_rate,
                                    stdCusHDD.hdd_rate,
                                    discountRate || 0,
                                    newMachineTime,
                                  ),
                          symbol: smuser.prefer_currency,
                          rates: appCurrency,
                        })}

                      {configType === 2 &&
                        smuser &&
                        appCurrency &&
                        cpuCusSSD &&
                        cpuCusNVM &&
                        cpuCusHDD &&
                        currencyReturn({
                          price:
                            diskType === "ssd"
                              ? calculatePrice(
                                  cpuCusSSD.cpu_rate,
                                  cpuCusSSD.ram_rate,
                                  cpuCusSSD.ssd_price,
                                  discountRate || 0,
                                  newMachineTime,
                                )
                              : diskType === "nvme"
                                ? calculatePrice(
                                    cpuCusNVM.cpu_rate,
                                    cpuCusNVM.ram_rate,
                                    cpuCusNVM.nvme_price,
                                    discountRate || 0,
                                    newMachineTime,
                                  )
                                : calculatePrice(
                                    cpuCusHDD.cpu_rate,
                                    cpuCusHDD.ram_rate,
                                    cpuCusHDD.hdd_rate,
                                    discountRate || 0,
                                    newMachineTime,
                                  ),
                          symbol: smuser.prefer_currency,
                          rates: appCurrency,
                        })}

                      {configType === 3 &&
                        smuser &&
                        appCurrency &&
                        ramCusSSD &&
                        ramCusNVM &&
                        ramCusHDD &&
                        currencyReturn({
                          price:
                            diskType === "ssd"
                              ? calculatePrice(
                                  ramCusSSD.cpu_rate,
                                  ramCusSSD.ram_rate,
                                  ramCusSSD.ssd_price,
                                  discountRate || 0,
                                  newMachineTime,
                                )
                              : diskType === "nvme"
                                ? calculatePrice(
                                    ramCusNVM.cpu_rate,
                                    ramCusNVM.ram_rate,
                                    ramCusNVM.nvme_price,
                                    discountRate || 0,
                                    newMachineTime,
                                  )
                                : calculatePrice(
                                    ramCusHDD.cpu_rate,
                                    ramCusHDD.ram_rate,
                                    ramCusHDD.hdd_rate,
                                    discountRate || 0,
                                    newMachineTime,
                                  ),
                          symbol: smuser.prefer_currency,
                          rates: appCurrency,
                        })}
                    </div>

                    {(() => {
                      let discount;

                      if (
                        configType === 1 ||
                        configType === 5 ||
                        configType === 6
                      ) {
                        discount =
                          diskType === "ssd"
                            ? `${
                                stdCusSSD[`discount_price_${newMachineTime}`]
                              } % OFF`
                            : diskType === "nvme"
                              ? `${
                                  stdCusNVM[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : `${
                                  stdCusHDD[`discount_price_${newMachineTime}`]
                                } % OFF`;
                      } else if (
                        configType === 3 ||
                        configType === 7 ||
                        configType === 8
                      ) {
                        discount =
                          diskType === "ssd"
                            ? `${
                                cpuCusSSD[`discount_price_${newMachineTime}`]
                              } % OFF`
                            : diskType === "nvme"
                              ? `${
                                  cpuCusNVM[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : `${
                                  cpuCusHDD[`discount_price_${newMachineTime}`]
                                    .custom_discount
                                } % OFF`;
                      } else {
                        discount =
                          diskType === "ssd"
                            ? `${
                                ramCusSSD[`discount_price_${newMachineTime}`]
                              } % OFF`
                            : diskType === "nvme"
                              ? `${
                                  ramCusNVM[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : `${
                                  ramCusHDD[`discount_price_${newMachineTime}`]
                                } % OFF`;
                      }

                      if (parseFloat(discount) > 0) {
                        return (
                          <div className="price-new">
                            <span style={{ zIndex: "9" }}>
                              {/* {configType === 1 ||
                          configType === 5 ||
                          configType === 6
                            ? diskType === "ssd"
                              ? `${stdCusSSD.custom_discount} % OFF`
                              : diskType === "nvme"
                              ? `${stdCusNVM.custom_discount} % OFF`
                              : `${stdCusHDD.custom_discount} % OFF`
                            : configType === 3 ||
                              configType === 7 ||
                              configType === 8
                            ? diskType === "ssd"
                              ? `${cpuCusSSD.custom_discount} % OFF`
                              : diskType === "nvme"
                              ? `${cpuCusNVM.custom_discount} % OFF`
                              : `${cpuCusHDD.custom_discount} % OFF`
                            : diskType === "ssd"
                            ? `${ramCusSSD.custom_discount} % OFF`
                            : diskType === "nvme"
                            ? `${ramCusNVM.custom_discount} % OFF`
                            : `${ramCusHDD.custom_discount} % OFF`} */}
                              {configType === 1 ||
                              configType === 5 ||
                              configType === 6
                                ? diskType === "ssd"
                                  ? `${
                                      stdCusSSD[
                                        `discount_price_${newMachineTime}`
                                      ]
                                    } % OFF`
                                  : diskType === "nvme"
                                    ? `${
                                        stdCusNVM[
                                          `discount_price_${newMachineTime}`
                                        ]
                                      } % OFF`
                                    : `${
                                        stdCusHDD[
                                          `discount_price_${newMachineTime}`
                                        ]
                                      } % OFF`
                                : configType === 3 ||
                                    configType === 7 ||
                                    configType === 8
                                  ? diskType === "ssd"
                                    ? `${
                                        cpuCusSSD[
                                          `discount_price_${newMachineTime}`
                                        ]
                                      } % OFF`
                                    : diskType === "nvme"
                                      ? `${
                                          cpuCusNVM[
                                            `discount_price_${newMachineTime}`
                                          ]
                                        } % OFF`
                                      : `${
                                          cpuCusHDD[
                                            `discount_price_${newMachineTime}`
                                          ]
                                        } % OFF`
                                  : diskType === "ssd"
                                    ? `${
                                        ramCusSSD[
                                          `discount_price_${newMachineTime}`
                                        ]
                                      } % OFF`
                                    : diskType === "nvme"
                                      ? `${
                                          ramCusNVM[
                                            `discount_price_${newMachineTime}`
                                          ]
                                        } % OFF`
                                      : `${
                                          ramCusHDD[
                                            `discount_price_${newMachineTime}`
                                          ]
                                        } % OFF`}
                            </span>
                          </div>
                        );
                      }

                      return null; // Return null if discount is not greater than 0
                    })()}
                  </div>
                </>
              ) : (
                <>
                  {smuser && appCurrency && (
                    <div
                      className="price-container"
                      style={{ marginBottom: "10px", marginLeft: "7px" }}
                    >
                      {smuser && appCurrency && finalAmount > 0 && (
                        <div className="price-old">
                          {discountRate > 0 && (
                            <span
                              style={{
                                textDecoration:
                                  finalAmount !== "0" ? "line-through" : "",
                                fontSize: "16px",
                                marginRight: "9px",
                              }}
                            >
                              {currencyReturn({
                                price: finalAmount,
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}
                            </span>
                          )}
                          {finalAmount !== "0" && (
                            <span style={{ zIndex: "9", fontSize: "20px" }}>
                              {currencyReturn({
                                price:
                                  smuser.country === "India"
                                    ? finalAmount -
                                      (finalAmount * discountRate) / 100
                                    : (finalAmount -
                                        (finalAmount * discountRate) / 100) *
                                      (1 + surcharge / 100),
                                symbol: smuser.prefer_currency,
                                rates: appCurrency,
                              })}
                              {/* ({discountRate} % off) */}
                            </span>
                          )}
                        </div>
                      )}
                      {smuser && appCurrency && finalAmount > 0 && (
                        <div
                          className="price-new"
                          style={{ marginLeft: "10px" }}
                        >
                          {finalAmount !== 0 && (
                            <span style={{ zIndex: "9", fontSize: "20px" }}>
                              {discountRate}% OFF
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="buttons-container" style={{ padding: "0px" }}>
              {/* {topButtons.map((title, idx) => ( */}
              <Button className="mobile-top-buttons-creact-machine">
                {selectedCPU} vCPU
              </Button>
              <Button className="mobile-top-buttons-creact-machine">
                {selectedRAM} GB RAM
              </Button>
              <Button className="mobile-top-buttons-creact-machine">
                {selectedSSD} GB Disk
              </Button>
              <Button className="mobile-top-buttons-creact-machine">
                {selectedDT} TB Data Transfer
              </Button>
              {/* ))} */}
              <a
                onClick={() => {
                  if (smuser.phoneverify === 1) {
                    if (
                      newMachineName !== "" &&
                      newMahineOs !== "" &&
                      newMahineOs !== "Select" &&
                      newMachineName !== null &&
                      newMahineOs !== null
                    ) {
                      if (stockAvailableStatus) {
                        if (selectedSSD >= 20) {
                          var serverCost =
                            finalAmount - (finalAmount * discountRate) / 100;
                          var creditDiscAmt =
                            (serverCost * upnetPercentage) / 100;
                          var amount = serverCost - creditDiscAmt;

                          var fAmount = amount - smuser.total_credit;
                          setAddToWalletAmt(fAmount);
                          if (
                            fAmount > smuser.total_credit &&
                            smuser.reward_points !== null &&
                            smuser.reward_points > 0
                          ) {
                            ShowUpnetCreditContentPopup(true);
                          } else {
                            setCounter(1);
                            setShowIPOptionPopup(true);
                          }
                        } else {
                          toast((t) => (
                            <AppToast
                              id={t.id}
                              message={
                                "Please select minimum 20 GB Disk Storage."
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
                              "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                            }
                            isMobile={isMobile}
                          />
                        ));
                      }
                    } else if (newMachineName == null) {
                      toast((t) => (
                        <AppToast
                          id={t.id}
                          message={"Machine Name Required"}
                          isMobile={isMobile}
                        />
                      ));
                    } else if (newMahineOs == null) {
                      toast((t) => (
                        <AppToast
                          id={t.id}
                          message={"Machine OS is Required"}
                          isMobile={isMobile}
                        />
                      ));
                    } else if (newMahineOs == "Select") {
                      toast((t) => (
                        <AppToast
                          id={t.id}
                          message={"Machine OS is Required"}
                          isMobile={isMobile}
                        />
                      ));
                    }

                    
                  } else {
                    setShowPhoneVerify(true);
                  }
                }}
                className="underline-text"
                style={{
                  marginTop: "5px",
                  marginLeft: "10px",
                  justifyContent: "right",
                  fontSize: "16px",
                  color: "#035189",
                  fontWeight: "600",
                }}
              >
                Create Machine1
              </a>
            </div>

            <div>
              <div
                className={`${
                  activePage === "Standard"
                    ? "active-mobile-vm"
                    : "non-active-mobile-vm"
                }`}
                onClick={() => {
                  setActivePage("Standard");
                  setSelectedIdx(null);
                  setFinalAmount("0");
                  setDiscountRate("0");
                }}
              >
                Standard
              </div>
              <div
                className={`${
                  activePage === "CPU Proactive"
                    ? "active-mobile-vm"
                    : "non-active-mobile-vm"
                }`}
                style={{ marginLeft: "90px" }}
                onClick={() => {
                  setActivePage("CPU Proactive");
                  setSelectedIdx(null);
                  setFinalAmount("0");
                  setDiscountRate("0");
                }}
              >
                CPU Proactive
              </div>
              <div
                className={`${
                  activePage === "RAM Proactive"
                    ? "active-mobile-vm"
                    : "non-active-mobile-vm"
                }`}
                style={{ marginLeft: "180px" }}
                onClick={() => {
                  setActivePage("RAM Proactive");
                  setSelectedIdx(null);
                  setFinalAmount("0");
                  setDiscountRate("0");
                }}
              >
                RAM Proactive
              </div>
              <div
                className={`${
                  activePage === "Custom Configure"
                    ? "active-mobile-vm"
                    : "non-active-mobile-vm"
                }`}
                style={{ marginLeft: "270px" }}
                onClick={() => {
                  setActivePage("Custom Configure");
                  setSelectedIdx(null);
                  setFinalAmount("0");
                  setDiscountRate("0");
                }}
              >
                Custom Configure
              </div>
            </div>

            <div className="tab-box-mobile-create-machine">
              {activePage === "Custom Configure" ? (
                <>
                  <div
                    className="buttons-container"
                    style={{ padding: "15px" }}
                  >
                    {innerButtons.map((title, idx) => (
                      <Button
                        key={idx}
                        style={{
                          background: `${
                            activeButton === title ? "#f47c20" : "#035189"
                          }`,
                          border: "none",
                          fontSize: "11px",
                          padding: "5px 15px",
                          color: "#fff",
                          fontWeight: "600",
                          borderRadius: "5px",
                          marginBottom: "10px",
                        }}
                        onClick={() => {
                          setActiveButton(title);
                          setConfigType(idx + 1);
                        }}
                      >
                        {title}
                      </Button>
                    ))}
                  </div>
                  <div className="title-box">
                    <h6
                      style={{
                        width: "25%",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      vCPU
                    </h6>
                    <h6
                      style={{
                        width: "25%",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "700",
                        marginTop: "10px",
                      }}
                    >
                      RAM
                    </h6>
                    <div
                      className="ssd price"
                      data-value="40"
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "16px",
                        position: "relative",
                        // marginTop: "4px",
                      }}
                    >
                      <select
                        name="plan_time"
                        value={diskType}
                        style={{
                          borderRadius: "30px",
                          padding: "5px",
                          fontSize: "16px",
                          border: "2px solid #e97730",
                          color: "#144e7b",
                          fontWeight: "700",
                          backgroundColor: "transparent",
                        }}
                        onChange={(e) => {
                          setDisktype(e.target.value);
                          setCustomDISK(0);
                        }}
                      >
                        {activeButton == "Standard" ? (
                          diskType == "ssd" ? (
                            <>
                              {sHddStocks[0].stocks == 1 && (
                                <option value="hdd" selected>
                                  HDD Disk
                                </option>
                              )}
                              {sSsdStocks[0].stocks == 1 && (
                                <option value="ssd" selected>
                                  SSD Disk
                                </option>
                              )}
                              {sNvmStocks[0].stocks == 1 && (
                                <option value="nvme" selected>
                                  NVMe Disk
                                </option>
                              )}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {sHddStocks[0].stocks == 1 && (
                                <option value="hdd" selected>
                                  HDD Disk
                                </option>
                              )}
                              {sSsdStocks[0].stocks == 1 && (
                                <option value="ssd" selected>
                                  SSD Disk
                                </option>
                              )}
                              {sNvmStocks[0].stocks == 1 && (
                                <option value="nvme" selected>
                                  NVMe Disk
                                </option>
                              )}
                            </>
                          ) : (
                            <>
                              {sHddStocks[0].stocks == 1 && (
                                <option value="hdd" selected>
                                  HDD Disk
                                </option>
                              )}
                              {sSsdStocks[0].stocks == 1 && (
                                <option value="ssd" selected>
                                  SSD Disk
                                </option>
                              )}
                              {sNvmStocks[0].stocks == 1 && (
                                <option value="nvme" selected>
                                  NVMe Disk
                                </option>
                              )}
                            </>
                          )
                        ) : activeButton == "CPU Proactive" ? (
                          diskType == "ssd" ? (
                            <>
                              {cHddStocks[0].stocks == 1 && (
                                <option value="hdd" selected>
                                  HDD Disk
                                </option>
                              )}
                              {cSsdStocks[0].stocks == 1 && (
                                <option value="ssd" selected>
                                  SSD Disk
                                </option>
                              )}
                              {cNvmStocks[0].stocks == 1 && (
                                <option value="nvme" selected>
                                  NVMe Disk
                                </option>
                              )}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {cHddStocks[0].stocks == 1 && (
                                <option value="hdd" selected>
                                  HDD Disk
                                </option>
                              )}
                              {cSsdStocks[0].stocks == 1 && (
                                <option value="ssd" selected>
                                  SSD Disk
                                </option>
                              )}
                              {cNvmStocks[0].stocks == 1 && (
                                <option value="nvme" selected>
                                  NVMe Disk
                                </option>
                              )}
                            </>
                          ) : (
                            <>
                              {cHddStocks[0].stocks == 1 && (
                                <option value="hdd" selected>
                                  HDD Disk
                                </option>
                              )}
                              {cSsdStocks[0].stocks == 1 && (
                                <option value="ssd" selected>
                                  SSD Disk
                                </option>
                              )}
                              {cNvmStocks[0].stocks == 1 && (
                                <option value="nvme" selected>
                                  NVMe Disk
                                </option>
                              )}
                            </>
                          )
                        ) : diskType == "ssd" ? (
                          <>
                            {rHddStocks[0].stocks == 1 && (
                              <option value="hdd" selected>
                                HDD Disk
                              </option>
                            )}
                            {rSsdStocks[0].stocks == 1 && (
                              <option value="ssd" selected>
                                SSD Disk
                              </option>
                            )}
                            {rNvmStocks[0].stocks == 1 && (
                              <option value="nvme" selected>
                                NVMe Disk
                              </option>
                            )}
                          </>
                        ) : diskType == "nvme" ? (
                          <>
                            {rHddStocks[0].stocks == 1 && (
                              <option value="hdd" selected>
                                HDD Disk
                              </option>
                            )}
                            {rSsdStocks[0].stocks == 1 && (
                              <option value="ssd" selected>
                                SSD Disk
                              </option>
                            )}
                            {rNvmStocks[0].stocks == 1 && (
                              <option value="nvme" selected>
                                NVMe Disk
                              </option>
                            )}
                          </>
                        ) : (
                          <>
                            {rHddStocks[0].stocks == 1 && (
                              <option value="hdd" selected>
                                HDD Disk
                              </option>
                            )}
                            {rSsdStocks[0].stocks == 1 && (
                              <option value="ssd" selected>
                                SSD Disk
                              </option>
                            )}
                            {rNvmStocks[0].stocks == 1 && (
                              <option value="nvme" selected>
                                NVMe Disk
                              </option>
                            )}
                          </>
                        )}
                      </select>
                    </div>
                    {/* <h6
                      style={{
                        width: "25%",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "700",
                        // marginTop: "10px",
                      }}
                    >
                      DISK SPACE
                    </h6> */}
                    <h6
                      style={{
                        width: "25%",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "700",
                        // marginTop: "10px",
                      }}
                    >
                      BAND<br></br>WIDTH
                    </h6>
                  </div>

                  <div
                    style={{
                      marginLeft: "-24rem",
                      marginTop: "22rem",
                      // marginTop: "11rem",
                      position: "absolute",
                    }}
                  >
                    {/* CPU CORE */}
                    <div
                      className="range-slider-vrt"
                      // style={{ marginLeft: "-15px" }}
                    >
                      <div
                        className="tooltip-horz-vrt"
                        // style={{
                        //   bottom: `${(((customDATAT * 100) / 200) * 100) / 160}%`,
                        // }}
                        style={{
                          left: "1.9rem",
                          top: "-13rem",
                          position: "absolute",
                        }}
                      >
                        {/* <FaChevronDown /> */}
                        {customCPU}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="32"
                        value={customCPU}
                        onChange={(event) => {
                          setCustomCPU(event.target.value);
                          setSelectedCPU(event.target.value);
                        }}
                        className="custom-rangeInput-vrt"
                        style={{
                          left: "-6rem",
                          position: "absolute",
                          background: `linear-gradient(to right, #e97730 ${
                            (customCPU * 100) / 32
                          }%, #ddd ${(customCPU * 100) / 32}%)`,
                        }}
                      />
                    </div>
                    {/* RAM */}
                    <div className="range-slider-vrt">
                      <div
                        className="tooltip-horz-vrt"
                        style={{
                          left: "6.9rem",
                          top: "-13rem",
                          position: "absolute",
                        }}
                      >
                        {/* <FaChevronDown /> */}
                        {customRAM}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="510"
                        value={customRAM}
                        onChange={(event) => {
                          setCustomRAM(event.target.value);
                          setSelectedRAM(event.target.value);
                        }}
                        className="custom-rangeInput-vrt"
                        style={{
                          left: "-1rem",
                          position: "absolute",
                          background: `linear-gradient(to right, #e97730 ${
                            (customRAM * 100) / 510
                          }%, #ddd ${(customRAM * 100) / 510}%)`,
                        }}
                      />
                    </div>
                    {/* DISK */}
                    <div className="range-slider-vrt">
                      <div
                        className="tooltip-horz-vrt"
                        style={{
                          left: "12rem",
                          top: "-13rem",
                          position: "absolute",
                        }}
                      >
                        {customDISK}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={diskType == "hdd" ? "10000" : "5000"}
                        value={customDISK}
                        onChange={(event) => {
                          setCustomDISK(event.target.value);
                          setSelectedSSD(event.target.value);
                        }}
                        className="custom-rangeInput-vrt"
                        style={{
                          left: "4.2rem",
                          position: "absolute",
                          background: `linear-gradient(to right, #e97730 ${
                            (customDISK * 100) /
                            (diskType == "hdd" ? 10000 : 5000)
                          }%, #ddd ${
                            (customDISK * 100) /
                            (diskType == "hdd" ? 10000 : 5000)
                          }%)`,
                        }}
                      />
                    </div>
                    {/* BANDWIDTH */}
                    <div
                      className="range-slider-vrt"
                      // style={{ marginLeft: "-15px" }}
                    >
                      <div
                        className="tooltip-horz-vrt"
                        style={{
                          left: "17.9rem",
                          top: "-13rem",
                          position: "absolute",
                        }}
                      >
                        {customDATAT}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="32"
                        value={customDATAT}
                        onChange={(event) => {
                          setCustomDATAT(event.target.value);
                          setSelectedDT(event.target.value);
                        }}
                        className="custom-rangeInput-vrt"
                        style={{
                          left: "10rem",
                          position: "absolute",
                          background: `linear-gradient(to right, #e97730 ${
                            (customDATAT * 100) / 32
                          }%, #ddd ${(customDATAT * 100) / 32}%)`,
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      marginLeft: "-1rem",
                    }}
                  >
                    {activePage === "Custom Configure" ? (
                      <>
                        <div
                          className="buttons-container"
                          style={{ padding: "15px", marginTop: "-8rem" }}
                        >
                          {innerButtons.map((title, idx) => (
                            <Button
                              key={idx}
                              style={{
                                background: `${
                                  activeButton === title ? "#f47c20" : "#035189"
                                }`,
                                border: "none",
                                fontSize: "22px",
                                padding: "5px 15px",
                                color: "#fff",
                                fontWeight: "600",
                                borderRadius: "5px",
                                marginBottom: "10px",
                              }}
                              onClick={() => setActiveButton(title)}
                            >
                              {title}
                            </Button>
                          ))}
                        </div>
                        <div className="title-box">
                          <h6
                            style={{
                              textAlign: "center",
                              fontSize: "30px",
                              fontWeight: "800",
                              marginTop: "40px",
                            }}
                          >
                            vCPU
                          </h6>
                          <h6
                            style={{
                              textAlign: "center",
                              fontSize: "30px",
                              fontWeight: "800",
                              marginTop: "60px",
                            }}
                          >
                            RAM
                          </h6>

                          <h6
                            style={{
                              textAlign: "center",
                              fontSize: "30px",
                              fontWeight: "800",
                              marginTop: "50px",
                            }}
                          >
                            DISK <br />
                            SPACE
                          </h6>
                          <h6
                            style={{
                              textAlign: "center",
                              fontSize: "30px",
                              fontWeight: "800",
                              marginTop: "20px",
                            }}
                          >
                            BANDWIDTH
                          </h6>
                        </div>
                        <div>
                          <div className="range-slider">
                            <div
                              className="tooltip-horz"
                              style={{
                                left: `${(customDATAT * 100) / 32}%`,
                              }}
                            >
                              {customDATAT}
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="32"
                              value={customDATAT}
                              onChange={(event) => {
                                setCustomDATAT(event.target.value);
                                setSelectedDT(event.target.value);
                              }}
                              className="custom-rangeInput"
                              style={{
                                background: `linear-gradient(to right, #e97730 ${
                                  (customDATAT * 100) / 32
                                }%, #ddd ${(customDATAT * 100) / 32}%)`,
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            marginLeft: "15rem",
                            position: "relative",
                            marginTop: "-25rem",
                            flexWrap: "wrap",
                            justifyContent: "space-around",
                          }}
                        ></div>
                      </>
                    ) : (
                      <>
                        {activePage === "Standard" ? (
                          <>
                            {diskType == "ssd" ? (
                              <>
                                {sSsd &&
                                  sSsd.map((item, idx) => (
                                    <div
                                      className="package"
                                      style={{
                                        width: "350px",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <label className="custom-checkbox">
                                        <span
                                          style={{
                                            width: "17rem",
                                            marginTop: "10px",
                                            marginLeft: "48px",
                                            padding: "15px",
                                            borderRadius: "35px",
                                            display: "inline-block",
                                            fontSize: "17px",
                                            background:
                                              selectedIdx === idx
                                                ? "#035189"
                                                : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                            color: "rgb(0, 0, 0)",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold",
                                            height: "10rem",
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                          }}
                                          onClick={() => {
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime,
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ],
                                            );
                                            setMachineAmt(
                                              item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate,
                                            );
                                            setSelectedIdx(idx);
                                            setNewMachineConfigId(
                                              item.config_id,
                                            );
                                            console.log(
                                              "CHECK CONFIGID: item.config_id",
                                              item.config_id,
                                            );
                                          }}
                                        >
                                          <div
                                            className="top-head see-white-text"
                                            style={{
                                              marginTop: "1.5rem",
                                              position: "relative",
                                              textAlign: "center",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            <img
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              className="orange-bg"
                                              alt="orange background"
                                              style={{ width: "100%" }}
                                            />
                                            <img
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              className="white-bg hide"
                                              alt="white background"
                                              style={{ width: "100%" }}
                                            />
                                            <h4
                                              style={{
                                                marginTop: "-40px",
                                                fontSize: "24px",
                                                color: "white",
                                              }}
                                            >
                                              Standard
                                            </h4>
                                          </div>

                                          <div className="top-body theme-color-blue">
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {smuser &&
                                                appCurrency &&
                                                currencyReturn({
                                                  price:
                                                    item.ssd_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate,
                                                  symbol:
                                                    smuser.prefer_currency,
                                                  rates: appCurrency,
                                                })}
                                              <span> Month </span>
                                            </div>
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                              }}
                                            >
                                              {(
                                                (diskType == "ssd"
                                                  ? item.ssd_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : diskType == "hdd"
                                                    ? item.hdd_rate * item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : item.nvme_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram *
                                                        item.ram_rate) /
                                                appCurrency /
                                                30
                                              ).toFixed(2)}{" "}
                                              / <span>day</span>
                                            </div>
                                          </div>
                                        </span>
                                      </label>

                                      <div style={{ marginLeft: "40px" }}>
                                        <img
                                          src="/images/admin/02-VM/gray-box-bg.svg"
                                          className="gray-bg"
                                          alt="gray background"
                                          style={{ height: "15rem" }}
                                        />
                                        <img
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          className="orange-bg hide"
                                          alt="orange background"
                                          style={{ height: "15rem" }}
                                        />
                                        <div
                                          style={{
                                            marginTop: "-14rem",
                                            marginLeft: "5px",
                                            color: "#444",
                                          }}
                                        >
                                          <div
                                            className="cpu price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.cpu} vCPU
                                          </div>
                                          <div
                                            className="ram price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.ram} GB RAM
                                          </div>
                                          <div
                                            className="ssd price"
                                            data-value="40"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            <select
                                              name="plan_time"
                                              value={diskType}
                                              style={{
                                                borderRadius: "30px",
                                                // marginRight: "10px",
                                                padding: "5px 5px",
                                                border: "2px solid #e97730",
                                              }}
                                              onChange={(e) => {
                                                setSelectedCPU(0);
                                                setSelectedRAM(0);
                                                setSelectedSSD(0);
                                                setSelectedDT(null);
                                                setFinalAmount("0");
                                                setDiscountRate("0");
                                                setMachineAmt("0");
                                                setSelectedIdx(null);
                                                setNewMachineConfigId(null);
                                                setDisktype(e.target.value);
                                              }}
                                            >
                                              {sHddStocks[0].stocks == 1 && (
                                                <option value="hdd" selected>
                                                  {item.hdd} GB HDD Disk
                                                </option>
                                              )}
                                              {sSsdStocks[0].stocks == 1 && (
                                                <option value="ssd" selected>
                                                  {item.hdd} GB SSD Disk
                                                </option>
                                              )}
                                              {sNvmStocks[0].stocks == 1 && (
                                                <option value="nvme" selected>
                                                  {item.hdd} GB NVMe Disk
                                                </option>
                                              )}
                                            </select>
                                          </div>
                                          <div
                                            className="data price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.data_transfer} TB Bandwidth
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </>
                            ) : diskType == "nvme" ? (
                              <>
                                {sNvm &&
                                  sNvm.map((item, idx) => (
                                    <div
                                      className="package"
                                      style={{
                                        width: "350px",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <label className="custom-checkbox">
                                        <span
                                          style={{
                                            width: "17rem",
                                            marginTop: "10px",
                                            marginLeft: "48px",
                                            padding: "15px",
                                            borderRadius: "35px",
                                            display: "inline-block",
                                            fontSize: "17px",
                                            background:
                                              selectedIdx === idx
                                                ? "#035189"
                                                : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                            color: "rgb(0, 0, 0)",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold",
                                            height: "10rem",
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                          }}
                                          onClick={() => {
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime,
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ],
                                            );
                                            setMachineAmt(
                                              item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate,
                                            );
                                            setSelectedIdx(idx);
                                            setNewMachineConfigId(
                                              item.config_id,
                                            );
                                          }}
                                        >
                                          <div
                                            className="top-head see-white-text"
                                            style={{
                                              marginTop: "1.5rem",
                                              position: "relative",
                                              textAlign: "center",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            <img
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              className="orange-bg"
                                              alt="orange background"
                                              style={{ width: "100%" }}
                                            />
                                            <img
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              className="white-bg hide"
                                              alt="white background"
                                              style={{ width: "100%" }}
                                            />
                                            <h4
                                              style={{
                                                marginTop: "-40px",
                                                fontSize: "24px",
                                                color: "white",
                                              }}
                                            >
                                              Standard
                                            </h4>
                                          </div>

                                          <div className="top-body theme-color-blue">
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {smuser &&
                                                appCurrency &&
                                                currencyReturn({
                                                  price:
                                                    item.nvme_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate,
                                                  symbol:
                                                    smuser.prefer_currency,
                                                  rates: appCurrency,
                                                })}
                                              <span> Month </span>
                                            </div>
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                              }}
                                            >
                                              {(
                                                (diskType == "ssd"
                                                  ? item.ssd_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : diskType == "hdd"
                                                    ? item.hdd_rate * item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : item.nvme_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram *
                                                        item.ram_rate) /
                                                appCurrency /
                                                30
                                              ).toFixed(2)}{" "}
                                              / <span>day</span>
                                            </div>
                                          </div>
                                        </span>
                                      </label>

                                      <div style={{ marginLeft: "40px" }}>
                                        <img
                                          src="/images/admin/02-VM/gray-box-bg.svg"
                                          className="gray-bg"
                                          alt="gray background"
                                          style={{ height: "15rem" }}
                                        />
                                        <img
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          className="orange-bg hide"
                                          alt="orange background"
                                          style={{ height: "15rem" }}
                                        />
                                        <div
                                          style={{
                                            marginTop: "-14rem",
                                            marginLeft: "5px",
                                            color: "#444",
                                          }}
                                        >
                                          <div
                                            className="cpu price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.cpu} vCPU
                                          </div>
                                          <div
                                            className="ram price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.ram} GB RAM
                                          </div>
                                          <div
                                            className="ssd price"
                                            data-value="40"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            <select
                                              name="plan_time"
                                              value={diskType}
                                              style={{
                                                borderRadius: "30px",
                                                // marginRight: "10px",
                                                padding: "5px 5px",
                                                border: "2px solid #e97730",
                                              }}
                                              onChange={(e) => {
                                                setSelectedCPU(0);
                                                setSelectedRAM(0);
                                                setSelectedSSD(0);
                                                setSelectedDT(null);
                                                setFinalAmount("0");
                                                setDiscountRate("0");
                                                setMachineAmt("0");
                                                setSelectedIdx(null);
                                                setNewMachineConfigId(null);
                                                setDisktype(e.target.value);
                                              }}
                                            >
                                              {/* <option value="hdd" selected>
                                                        {item.hdd} GB HDD Disk
                                                    </option>
                                                    <option value="ssd" selected>
                                                        {item.hdd} GB SSD Disk
                                                    </option>
                                                    <option value="nvme" selected>
                                                        {item.hdd} GB NVMe Disk
                                                    </option> */}
                                              {sHddStocks[0].stocks == 1 && (
                                                <option value="hdd" selected>
                                                  {item.hdd} GB HDD Disk
                                                </option>
                                              )}
                                              {sSsdStocks[0].stocks == 1 && (
                                                <option value="ssd" selected>
                                                  {item.hdd} GB SSD Disk
                                                </option>
                                              )}
                                              {sNvmStocks[0].stocks == 1 && (
                                                <option value="nvme" selected>
                                                  {item.hdd} GB NVMe Disk
                                                </option>
                                              )}
                                            </select>
                                            {/* {item.hdd} GB SSD Disk */}
                                          </div>
                                          <div
                                            className="data price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.data_transfer} TB Bandwidth
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </>
                            ) : (
                              <>
                                {sHdd &&
                                  sHdd.map((item, idx) => (
                                    <div
                                      className="package"
                                      style={{
                                        width: "350px",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <label className="custom-checkbox">
                                        <span
                                          style={{
                                            width: "17rem",
                                            marginTop: "10px",
                                            marginLeft: "48px",
                                            padding: "15px",
                                            borderRadius: "35px",
                                            display: "inline-block",
                                            fontSize: "17px",
                                            background:
                                              selectedIdx === idx
                                                ? "#035189"
                                                : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                            color: "rgb(0, 0, 0)",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold",
                                            height: "10rem",
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                          }}
                                          onClick={() => {
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime,
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ],
                                            );
                                            setMachineAmt(
                                              item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate,
                                            );
                                            setSelectedIdx(idx);
                                            setNewMachineConfigId(
                                              item.config_id,
                                            );
                                            console.log(
                                              "CHECK CONFIGID: item.config_id",
                                              item.config_id,
                                            );
                                          }}
                                        >
                                          <div
                                            className="top-head see-white-text"
                                            style={{
                                              marginTop: "1.5rem",
                                              position: "relative",
                                              textAlign: "center",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            <img
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              className="orange-bg"
                                              alt="orange background"
                                              style={{ width: "100%" }}
                                            />
                                            <img
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              className="white-bg hide"
                                              alt="white background"
                                              style={{ width: "100%" }}
                                            />
                                            <h4
                                              style={{
                                                marginTop: "-40px",
                                                fontSize: "24px",
                                                color: "white",
                                              }}
                                            >
                                              Standard
                                            </h4>
                                          </div>

                                          <div className="top-body theme-color-blue">
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {smuser &&
                                                appCurrency &&
                                                currencyReturn({
                                                  price:
                                                    item.hdd_rate * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate,
                                                  symbol:
                                                    smuser.prefer_currency,
                                                  rates: appCurrency,
                                                })}
                                              <span> Month </span>
                                              {/* ₹{" "}
                                                    {item.hdd_rate * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate}{" "}
                                                    / <span> Month </span> */}
                                            </div>
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                              }}
                                            >
                                              {(
                                                (diskType == "ssd"
                                                  ? item.ssd_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : diskType == "hdd"
                                                    ? item.hdd_rate * item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : item.nvme_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram *
                                                        item.ram_rate) /
                                                appCurrency /
                                                30
                                              ).toFixed(2)}{" "}
                                              / <span>day</span>
                                            </div>
                                          </div>
                                        </span>
                                      </label>

                                      <div style={{ marginLeft: "40px" }}>
                                        <img
                                          src="/images/admin/02-VM/gray-box-bg.svg"
                                          className="gray-bg"
                                          alt="gray background"
                                          style={{ height: "15rem" }}
                                        />
                                        <img
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          className="orange-bg hide"
                                          alt="orange background"
                                          style={{ height: "15rem" }}
                                        />
                                        <div
                                          style={{
                                            marginTop: "-14rem",
                                            marginLeft: "5px",
                                            color: "#444",
                                          }}
                                        >
                                          <div
                                            className="cpu price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.cpu} vCPU
                                          </div>
                                          <div
                                            className="ram price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.ram} GB RAM
                                          </div>
                                          <div
                                            className="ssd price"
                                            data-value="40"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            <select
                                              name="plan_time"
                                              value={diskType}
                                              style={{
                                                borderRadius: "30px",
                                                // marginRight: "10px",
                                                padding: "5px 5px",
                                                border: "2px solid #e97730",
                                              }}
                                              onChange={(e) => {
                                                setSelectedCPU(0);
                                                setSelectedRAM(0);
                                                setSelectedSSD(0);
                                                setSelectedDT(null);
                                                setFinalAmount("0");
                                                setDiscountRate("0");
                                                setMachineAmt("0");
                                                setSelectedIdx(null);
                                                setNewMachineConfigId(null);
                                                setDisktype(e.target.value);
                                              }}
                                            >
                                              {/* <option value="hdd" selected>
                                                        {item.hdd} GB HDD Disk
                                                    </option>
                                                    <option value="ssd" selected>
                                                        {item.hdd} GB SSD Disk
                                                    </option>
                                                    <option value="nvme" selected>
                                                        {item.hdd} GB NVMe Disk
                                                    </option> */}
                                              {sHddStocks[0].stocks == 1 && (
                                                <option value="hdd" selected>
                                                  {item.hdd} GB HDD Disk
                                                </option>
                                              )}
                                              {sSsdStocks[0].stocks == 1 && (
                                                <option value="ssd" selected>
                                                  {item.hdd} GB SSD Disk
                                                </option>
                                              )}
                                              {sNvmStocks[0].stocks == 1 && (
                                                <option value="nvme" selected>
                                                  {item.hdd} GB NVMe Disk
                                                </option>
                                              )}
                                            </select>
                                            {/* {item.hdd} GB SSD Disk */}
                                          </div>
                                          <div
                                            className="data price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.data_transfer} TB Bandwidth
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </>
                            )}
                          </>
                        ) : activePage === "CPU Proactive" ? (
                          <>
                            {diskType == "ssd" ? (
                              <>
                                {cSsd &&
                                  cSsd.map((item, idx) => (
                                    <div
                                      className="package"
                                      style={{
                                        width: "350px",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <label className="custom-checkbox">
                                        <span
                                          style={{
                                            width: "17rem",
                                            marginTop: "10px",
                                            marginLeft: "48px",
                                            padding: "15px",
                                            borderRadius: "35px",
                                            display: "inline-block",
                                            fontSize: "17px",
                                            background:
                                              selectedIdx === idx
                                                ? "#035189"
                                                : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                            color: "rgb(0, 0, 0)",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold",
                                            height: "10rem",
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                          }}
                                          onClick={() => {
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime,
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ],
                                            );
                                            setMachineAmt(
                                              item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate,
                                            );
                                            setSelectedIdx(idx);
                                            setNewMachineConfigId(
                                              item.config_id,
                                            );
                                            console.log(
                                              "CHECK CONFIGID: item.config_id",
                                              item.config_id,
                                            );
                                          }}
                                        >
                                          <div
                                            className="top-head see-white-text"
                                            style={{
                                              marginTop: "1.5rem",
                                              position: "relative",
                                              textAlign: "center",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            <img
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              className="orange-bg"
                                              alt="orange background"
                                              style={{ width: "100%" }}
                                            />
                                            <img
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              className="white-bg hide"
                                              alt="white background"
                                              style={{ width: "100%" }}
                                            />
                                            <h4
                                              style={{
                                                marginTop: "-40px",
                                                fontSize: "24px",
                                                color: "white",
                                              }}
                                            >
                                              CPU Proactive
                                            </h4>
                                          </div>

                                          <div className="top-body theme-color-blue">
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {smuser &&
                                                appCurrency &&
                                                currencyReturn({
                                                  price:
                                                    item.ssd_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate,
                                                  symbol:
                                                    smuser.prefer_currency,
                                                  rates: appCurrency,
                                                })}
                                              <span> Month </span>
                                            </div>
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                              }}
                                            >
                                              {(
                                                (diskType == "ssd"
                                                  ? item.ssd_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : diskType == "hdd"
                                                    ? item.hdd_rate * item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : item.nvme_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram *
                                                        item.ram_rate) /
                                                appCurrency /
                                                30
                                              ).toFixed(2)}{" "}
                                              / <span>day</span>
                                            </div>
                                          </div>
                                        </span>
                                      </label>

                                      <div style={{ marginLeft: "40px" }}>
                                        <img
                                          src="/images/admin/02-VM/gray-box-bg.svg"
                                          className="gray-bg"
                                          alt="gray background"
                                          style={{ height: "15rem" }}
                                        />
                                        <img
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          className="orange-bg hide"
                                          alt="orange background"
                                          style={{ height: "15rem" }}
                                        />
                                        <div
                                          style={{
                                            marginTop: "-14rem",
                                            marginLeft: "5px",
                                            color: "#444",
                                          }}
                                        >
                                          <div
                                            className="cpu price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.cpu} vCPU
                                          </div>
                                          <div
                                            className="ram price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.ram} GB RAM
                                          </div>
                                          <div
                                            className="ssd price"
                                            data-value="40"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            <select
                                              name="plan_time"
                                              value={diskType}
                                              style={{
                                                borderRadius: "30px",
                                                // marginRight: "10px",
                                                padding: "5px 5px",
                                                border: "2px solid #e97730",
                                              }}
                                              onChange={(e) => {
                                                setSelectedCPU(0);
                                                setSelectedRAM(0);
                                                setSelectedSSD(0);
                                                setSelectedDT(null);
                                                setFinalAmount("0");
                                                setDiscountRate("0");
                                                setMachineAmt("0");
                                                setSelectedIdx(null);
                                                setNewMachineConfigId(null);
                                                setDisktype(e.target.value);
                                              }}
                                            >
                                              {/* <option value="hdd" selected>
                                                        {item.hdd} GB HDD Disk
                                                    </option>
                                                    <option value="ssd" selected>
                                                        {item.hdd} GB SSD Disk
                                                    </option>
                                                    <option value="nvme" selected>
                                                        {item.hdd} GB NVMe Disk
                                                    </option> */}
                                              {cHddStocks[0].stocks == 1 && (
                                                <option value="hdd" selected>
                                                  {item.hdd} GB HDD Disk
                                                </option>
                                              )}
                                              {cSsdStocks[0].stocks == 1 && (
                                                <option value="ssd" selected>
                                                  {item.hdd} GB SSD Disk
                                                </option>
                                              )}
                                              {cNvmStocks[0].stocks == 1 && (
                                                <option value="nvme" selected>
                                                  {item.hdd} GB NVMe Disk
                                                </option>
                                              )}
                                            </select>
                                            {/* {item.hdd} GB SSD Disk */}
                                          </div>
                                          <div
                                            className="data price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.data_transfer} TB Bandwidth
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </>
                            ) : diskType == "nvme" ? (
                              <>
                                {cNvm &&
                                  cNvm.map((item, idx) => (
                                    <div
                                      className="package"
                                      style={{
                                        width: "350px",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <label className="custom-checkbox">
                                        <span
                                          style={{
                                            width: "17rem",
                                            marginTop: "10px",
                                            marginLeft: "48px",
                                            padding: "15px",
                                            borderRadius: "35px",
                                            display: "inline-block",
                                            fontSize: "17px",
                                            background:
                                              selectedIdx === idx
                                                ? "#035189"
                                                : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                            color: "rgb(0, 0, 0)",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold",
                                            height: "10rem",
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                          }}
                                          onClick={() => {
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime,
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ],
                                            );
                                            setMachineAmt(
                                              item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate,
                                            );
                                            setSelectedIdx(idx);
                                            setNewMachineConfigId(
                                              item.config_id,
                                            );
                                          }}
                                        >
                                          <div
                                            className="top-head see-white-text"
                                            style={{
                                              marginTop: "1.5rem",
                                              position: "relative",
                                              textAlign: "center",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            <img
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              className="orange-bg"
                                              alt="orange background"
                                              style={{ width: "100%" }}
                                            />
                                            <img
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              className="white-bg hide"
                                              alt="white background"
                                              style={{ width: "100%" }}
                                            />
                                            <h4
                                              style={{
                                                marginTop: "-40px",
                                                fontSize: "24px",
                                                color: "white",
                                              }}
                                            >
                                              CPU Proactive
                                            </h4>
                                          </div>

                                          <div className="top-body theme-color-blue">
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {smuser &&
                                                appCurrency &&
                                                currencyReturn({
                                                  price:
                                                    item.nvme_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate,
                                                  symbol:
                                                    smuser.prefer_currency,
                                                  rates: appCurrency,
                                                })}
                                              <span> Month </span>
                                            </div>
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                              }}
                                            >
                                              {(
                                                (diskType == "ssd"
                                                  ? item.ssd_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : diskType == "hdd"
                                                    ? item.hdd_rate * item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : item.nvme_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram *
                                                        item.ram_rate) /
                                                appCurrency /
                                                30
                                              ).toFixed(2)}{" "}
                                              / <span>day</span>
                                            </div>
                                          </div>
                                        </span>
                                      </label>

                                      <div style={{ marginLeft: "40px" }}>
                                        <img
                                          src="/images/admin/02-VM/gray-box-bg.svg"
                                          className="gray-bg"
                                          alt="gray background"
                                          style={{ height: "15rem" }}
                                        />
                                        <img
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          className="orange-bg hide"
                                          alt="orange background"
                                          style={{ height: "15rem" }}
                                        />
                                        <div
                                          style={{
                                            marginTop: "-14rem",
                                            marginLeft: "5px",
                                            color: "#444",
                                          }}
                                        >
                                          <div
                                            className="cpu price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.cpu} vCPU
                                          </div>
                                          <div
                                            className="ram price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.ram} GB RAM
                                          </div>
                                          <div
                                            className="ssd price"
                                            data-value="40"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            <select
                                              name="plan_time"
                                              value={diskType}
                                              style={{
                                                borderRadius: "30px",
                                                // marginRight: "10px",
                                                padding: "5px 5px",
                                                border: "2px solid #e97730",
                                              }}
                                              onChange={(e) => {
                                                setSelectedCPU(0);
                                                setSelectedRAM(0);
                                                setSelectedSSD(0);
                                                setSelectedDT(null);
                                                setFinalAmount("0");
                                                setDiscountRate("0");
                                                setMachineAmt("0");
                                                setSelectedIdx(null);
                                                setNewMachineConfigId(null);
                                                setDisktype(e.target.value);
                                              }}
                                            >
                                              {/* <option value="hdd" selected>
                                                        {item.hdd} GB HDD Disk
                                                    </option>
                                                    <option value="ssd" selected>
                                                        {item.hdd} GB SSD Disk
                                                    </option>
                                                    <option value="nvme" selected>
                                                        {item.hdd} GB NVMe Disk
                                                    </option> */}
                                              {cHddStocks[0].stocks == 1 && (
                                                <option value="hdd" selected>
                                                  {item.hdd} GB HDD Disk
                                                </option>
                                              )}
                                              {cSsdStocks[0].stocks == 1 && (
                                                <option value="ssd" selected>
                                                  {item.hdd} GB SSD Disk
                                                </option>
                                              )}
                                              {cNvmStocks[0].stocks == 1 && (
                                                <option value="nvme" selected>
                                                  {item.hdd} GB NVMe Disk
                                                </option>
                                              )}
                                            </select>
                                            {/* {item.hdd} GB SSD Disk */}
                                          </div>
                                          <div
                                            className="data price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.data_transfer} TB Bandwidth
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </>
                            ) : (
                              <>
                                {cHdd &&
                                  cHdd.map((item, idx) => (
                                    <div
                                      className="package"
                                      style={{
                                        width: "350px",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <label className="custom-checkbox">
                                        <span
                                          style={{
                                            width: "17rem",
                                            marginTop: "10px",
                                            marginLeft: "48px",
                                            padding: "15px",
                                            borderRadius: "35px",
                                            display: "inline-block",
                                            fontSize: "17px",
                                            background:
                                              selectedIdx === idx
                                                ? "#035189"
                                                : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                            color: "rgb(0, 0, 0)",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold",
                                            height: "10rem",
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                          }}
                                          onClick={() => {
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime,
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ],
                                            );
                                            setMachineAmt(
                                              item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate,
                                            );
                                            setSelectedIdx(idx);
                                            setNewMachineConfigId(
                                              item.config_id,
                                            );
                                            console.log(
                                              "CHECK CONFIGID: item.config_id",
                                              item.config_id,
                                            );
                                          }}
                                        >
                                          <div
                                            className="top-head see-white-text"
                                            style={{
                                              marginTop: "1.5rem",
                                              position: "relative",
                                              textAlign: "center",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            <img
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              className="orange-bg"
                                              alt="orange background"
                                              style={{ width: "100%" }}
                                            />
                                            <img
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              className="white-bg hide"
                                              alt="white background"
                                              style={{ width: "100%" }}
                                            />
                                            <h4
                                              style={{
                                                marginTop: "-40px",
                                                fontSize: "24px",
                                                color: "white",
                                              }}
                                            >
                                              CPU Proactive
                                            </h4>
                                          </div>

                                          <div className="top-body theme-color-blue">
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {smuser &&
                                                appCurrency &&
                                                currencyReturn({
                                                  price:
                                                    item.hdd_rate * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate,
                                                  symbol:
                                                    smuser.prefer_currency,
                                                  rates: appCurrency,
                                                })}
                                              <span> Month </span>
                                              {/* ₹{" "}
                                                    {item.hdd_rate * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate}{" "}
                                                    / <span> Month </span> */}
                                            </div>
                                            <div
                                              className="price"
                                              style={{
                                                color:
                                                  selectedIdx === idx
                                                    ? "#fff"
                                                    : "#545454",
                                                textAlign: "center",
                                              }}
                                            >
                                              {(
                                                (diskType == "ssd"
                                                  ? item.ssd_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : diskType == "hdd"
                                                    ? item.hdd_rate * item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : item.nvme_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram *
                                                        item.ram_rate) /
                                                appCurrency /
                                                30
                                              ).toFixed(2)}{" "}
                                              / <span>day</span>
                                            </div>
                                          </div>
                                        </span>
                                      </label>

                                      <div style={{ marginLeft: "40px" }}>
                                        <img
                                          src="/images/admin/02-VM/gray-box-bg.svg"
                                          className="gray-bg"
                                          alt="gray background"
                                          style={{ height: "15rem" }}
                                        />
                                        <img
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          className="orange-bg hide"
                                          alt="orange background"
                                          style={{ height: "15rem" }}
                                        />
                                        <div
                                          style={{
                                            marginTop: "-14rem",
                                            marginLeft: "5px",
                                            color: "#444",
                                          }}
                                        >
                                          <div
                                            className="cpu price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.cpu} vCPU
                                          </div>
                                          <div
                                            className="ram price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.ram} GB RAM
                                          </div>
                                          <div
                                            className="ssd price"
                                            data-value="40"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            <select
                                              name="plan_time"
                                              value={diskType}
                                              style={{
                                                borderRadius: "30px",
                                                // marginRight: "10px",
                                                padding: "5px 5px",
                                                border: "2px solid #e97730",
                                              }}
                                              onChange={(e) => {
                                                setSelectedCPU(0);
                                                setSelectedRAM(0);
                                                setSelectedSSD(0);
                                                setSelectedDT(null);
                                                setFinalAmount("0");
                                                setDiscountRate("0");
                                                setMachineAmt("0");
                                                setSelectedIdx(null);
                                                setNewMachineConfigId(null);
                                                setDisktype(e.target.value);
                                              }}
                                            >
                                              {/* <option value="hdd" selected>
                                                        {item.hdd} GB HDD Disk
                                                    </option>
                                                    <option value="ssd" selected>
                                                        {item.hdd} GB SSD Disk
                                                    </option>
                                                    <option value="nvme" selected>
                                                        {item.hdd} GB NVMe Disk
                                                    </option> */}
                                              {cHddStocks[0].stocks == 1 && (
                                                <option value="hdd" selected>
                                                  {item.hdd} GB HDD Disk
                                                </option>
                                              )}
                                              {cSsdStocks[0].stocks == 1 && (
                                                <option value="ssd" selected>
                                                  {item.hdd} GB SSD Disk
                                                </option>
                                              )}
                                              {cNvmStocks[0].stocks == 1 && (
                                                <option value="nvme" selected>
                                                  {item.hdd} GB NVMe Disk
                                                </option>
                                              )}
                                            </select>
                                            {/* {item.hdd} GB SSD Disk */}
                                          </div>
                                          <div
                                            className="data price"
                                            data-value="1"
                                            style={{
                                              textAlign: "center",
                                              fontWeight: "600",
                                              fontSize: "24px",
                                              position: "relative",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {item.data_transfer} TB Bandwidth
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </>
                            )}
                          </>
                        ) : activePage === "RAM Proactive" ? (
                          <>
                            <>
                              {diskType == "ssd" ? (
                                <>
                                  {rSsd &&
                                    rSsd.map((item, idx) => (
                                      <div
                                        className="package"
                                        style={{
                                          width: "350px",
                                          marginBottom: "25px",
                                        }}
                                      >
                                        <label className="custom-checkbox">
                                          <span
                                            style={{
                                              width: "17rem",
                                              marginTop: "10px",
                                              marginLeft: "48px",
                                              padding: "15px",
                                              borderRadius: "35px",
                                              display: "inline-block",
                                              fontSize: "17px",
                                              background:
                                                selectedIdx === idx
                                                  ? "#035189"
                                                  : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                              color: "rgb(0, 0, 0)",
                                              cursor: "pointer",
                                              userSelect: "none",
                                              fontWeight: "bold",
                                              height: "10rem",
                                              boxShadow:
                                                "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                            }}
                                            onClick={() => {
                                              setSelectedCPU(item.cpu);
                                              setSelectedRAM(item.ram);
                                              setSelectedSSD(item.hdd);
                                              setSelectedDT(item.data_transfer);
                                              setFinalAmount(
                                                (item.ssd_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate) *
                                                  newMachineTime,
                                              );
                                              setDiscountRate(
                                                item[
                                                  `discount_price_${newMachineTime}`
                                                ],
                                              );
                                              setMachineAmt(
                                                item.ssd_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                              );
                                              setSelectedIdx(idx);
                                              setNewMachineConfigId(
                                                item.config_id,
                                              );
                                              console.log(
                                                "CHECK CONFIGID: item.config_id",
                                                item.config_id,
                                              );
                                            }}
                                          >
                                            <div
                                              className="top-head see-white-text"
                                              style={{
                                                marginTop: "1.5rem",
                                                position: "relative",
                                                textAlign: "center",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                              }}
                                            >
                                              <img
                                                src="/images/admin/02-VM/title-bg-orange.svg"
                                                className="orange-bg"
                                                alt="orange background"
                                                style={{ width: "100%" }}
                                              />
                                              <img
                                                src="/images/admin/02-VM/title-bg-white.svg"
                                                className="white-bg hide"
                                                alt="white background"
                                                style={{ width: "100%" }}
                                              />
                                              <h4
                                                style={{
                                                  marginTop: "-40px",
                                                  fontSize: "24px",
                                                  color: "white",
                                                }}
                                              >
                                                RAM Proactive
                                              </h4>
                                            </div>

                                            <div className="top-body theme-color-blue">
                                              <div
                                                className="price"
                                                style={{
                                                  color:
                                                    selectedIdx === idx
                                                      ? "#fff"
                                                      : "#545454",
                                                  textAlign: "center",
                                                  marginTop: "15px",
                                                }}
                                              >
                                                {smuser &&
                                                  appCurrency &&
                                                  currencyReturn({
                                                    price:
                                                      item.ssd_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate,
                                                    symbol:
                                                      smuser.prefer_currency,
                                                    rates: appCurrency,
                                                  })}
                                                <span> Month </span>
                                                {/* ₹{" "}
                                                {item.hdd_rate * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate}{" "}
                                                / <span> Month </span> */}
                                              </div>
                                              <div
                                                className="price"
                                                style={{
                                                  color:
                                                    selectedIdx === idx
                                                      ? "#fff"
                                                      : "#545454",
                                                  textAlign: "center",
                                                }}
                                              >
                                                {(
                                                  (diskType == "ssd"
                                                    ? item.ssd_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : diskType == "hdd"
                                                      ? item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram * item.ram_rate
                                                      : item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate) /
                                                  appCurrency /
                                                  30
                                                ).toFixed(2)}{" "}
                                                / <span>day</span>
                                              </div>
                                            </div>
                                          </span>
                                        </label>

                                        <div style={{ marginLeft: "40px" }}>
                                          <img
                                            src="/images/admin/02-VM/gray-box-bg.svg"
                                            className="gray-bg"
                                            alt="gray background"
                                            style={{ height: "15rem" }}
                                          />
                                          <img
                                            src="/images/admin/02-VM/orange-box-bg.svg"
                                            className="orange-bg hide"
                                            alt="orange background"
                                            style={{ height: "15rem" }}
                                          />
                                          <div
                                            style={{
                                              marginTop: "-14rem",
                                              marginLeft: "5px",
                                              color: "#444",
                                            }}
                                          >
                                            <div
                                              className="cpu price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.cpu} vCPU
                                            </div>
                                            <div
                                              className="ram price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.ram} GB RAM
                                            </div>
                                            <div
                                              className="ssd price"
                                              data-value="40"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              <select
                                                name="plan_time"
                                                value={diskType}
                                                style={{
                                                  borderRadius: "30px",
                                                  // marginRight: "10px",
                                                  padding: "5px 5px",
                                                  border: "2px solid #e97730",
                                                }}
                                                onChange={(e) => {
                                                  setSelectedCPU(0);
                                                  setSelectedRAM(0);
                                                  setSelectedSSD(0);
                                                  setSelectedDT(null);
                                                  setFinalAmount("0");
                                                  setDiscountRate("0");
                                                  setMachineAmt("0");
                                                  setSelectedIdx(null);
                                                  setNewMachineConfigId(null);
                                                  setDisktype(e.target.value);
                                                }}
                                              >
                                                {/* <option value="hdd" selected>
                                                        {item.hdd} GB HDD Disk
                                                        </option>
                                                        <option value="ssd" selected>
                                                        {item.hdd} GB SSD Disk
                                                        </option>
                                                        <option value="nvme" selected>
                                                        {item.hdd} GB NVMe Disk
                                                        </option> */}
                                                {rHddStocks[0].stocks == 1 && (
                                                  <option value="hdd" selected>
                                                    {item.hdd} GB HDD Disk
                                                  </option>
                                                )}
                                                {rSsdStocks[0].stocks == 1 && (
                                                  <option value="ssd" selected>
                                                    {item.hdd} GB SSD Disk
                                                  </option>
                                                )}
                                                {rNvmStocks[0].stocks == 1 && (
                                                  <option value="nvme" selected>
                                                    {item.hdd} GB NVMe Disk
                                                  </option>
                                                )}
                                              </select>
                                              {/* {item.hdd} GB SSD Disk */}
                                            </div>
                                            <div
                                              className="data price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.data_transfer} TB Bandwidth
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </>
                              ) : diskType == "nvme" ? (
                                <>
                                  {rNvm &&
                                    rNvm.map((item, idx) => (
                                      <div
                                        className="package"
                                        style={{
                                          width: "350px",
                                          marginBottom: "25px",
                                        }}
                                      >
                                        <label className="custom-checkbox">
                                          <span
                                            style={{
                                              width: "17rem",
                                              marginTop: "10px",
                                              marginLeft: "48px",
                                              padding: "15px",
                                              borderRadius: "35px",
                                              display: "inline-block",
                                              fontSize: "17px",
                                              background:
                                                selectedIdx === idx
                                                  ? "#035189"
                                                  : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                              color: "rgb(0, 0, 0)",
                                              cursor: "pointer",
                                              userSelect: "none",
                                              fontWeight: "bold",
                                              height: "10rem",
                                              boxShadow:
                                                "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                            }}
                                            onClick={() => {
                                              setSelectedCPU(item.cpu);
                                              setSelectedRAM(item.ram);
                                              setSelectedSSD(item.hdd);
                                              setSelectedDT(item.data_transfer);
                                              setFinalAmount(
                                                (item.nvme_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate) *
                                                  newMachineTime,
                                              );
                                              setDiscountRate(
                                                item[
                                                  `discount_price_${newMachineTime}`
                                                ],
                                              );
                                              setMachineAmt(
                                                item.nvme_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                              );
                                              setSelectedIdx(idx);
                                              setNewMachineConfigId(
                                                item.config_id,
                                              );
                                            }}
                                          >
                                            <div
                                              className="top-head see-white-text"
                                              style={{
                                                marginTop: "1.5rem",
                                                position: "relative",
                                                textAlign: "center",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                              }}
                                            >
                                              <img
                                                src="/images/admin/02-VM/title-bg-orange.svg"
                                                className="orange-bg"
                                                alt="orange background"
                                                style={{ width: "100%" }}
                                              />
                                              <img
                                                src="/images/admin/02-VM/title-bg-white.svg"
                                                className="white-bg hide"
                                                alt="white background"
                                                style={{ width: "100%" }}
                                              />
                                              <h4
                                                style={{
                                                  marginTop: "-40px",
                                                  fontSize: "24px",
                                                  color: "white",
                                                }}
                                              >
                                                RAM Proactive
                                              </h4>
                                            </div>

                                            <div className="top-body theme-color-blue">
                                              <div
                                                className="price"
                                                style={{
                                                  color:
                                                    selectedIdx === idx
                                                      ? "#fff"
                                                      : "#545454",
                                                  textAlign: "center",
                                                  marginTop: "15px",
                                                }}
                                              >
                                                {smuser &&
                                                  appCurrency &&
                                                  currencyReturn({
                                                    price:
                                                      item.nvme_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate,
                                                    symbol:
                                                      smuser.prefer_currency,
                                                    rates: appCurrency,
                                                  })}
                                                <span> Month </span>
                                              </div>
                                              <div
                                                className="price"
                                                style={{
                                                  color:
                                                    selectedIdx === idx
                                                      ? "#fff"
                                                      : "#545454",
                                                  textAlign: "center",
                                                }}
                                              >
                                                {(
                                                  (diskType == "ssd"
                                                    ? item.ssd_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : diskType == "hdd"
                                                      ? item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram * item.ram_rate
                                                      : item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate) /
                                                  appCurrency /
                                                  30
                                                ).toFixed(2)}{" "}
                                                / <span>day</span>
                                              </div>
                                            </div>
                                          </span>
                                        </label>

                                        <div style={{ marginLeft: "40px" }}>
                                          <img
                                            src="/images/admin/02-VM/gray-box-bg.svg"
                                            className="gray-bg"
                                            alt="gray background"
                                            style={{ height: "15rem" }}
                                          />
                                          <img
                                            src="/images/admin/02-VM/orange-box-bg.svg"
                                            className="orange-bg hide"
                                            alt="orange background"
                                            style={{ height: "15rem" }}
                                          />
                                          <div
                                            style={{
                                              marginTop: "-14rem",
                                              marginLeft: "5px",
                                              color: "#444",
                                            }}
                                          >
                                            <div
                                              className="cpu price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.cpu} vCPU
                                            </div>
                                            <div
                                              className="ram price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.ram} GB RAM
                                            </div>
                                            <div
                                              className="ssd price"
                                              data-value="40"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              <select
                                                name="plan_time"
                                                value={diskType}
                                                style={{
                                                  borderRadius: "30px",
                                                  // marginRight: "10px",
                                                  padding: "5px 5px",
                                                  border: "2px solid #e97730",
                                                }}
                                                onChange={(e) => {
                                                  setSelectedCPU(0);
                                                  setSelectedRAM(0);
                                                  setSelectedSSD(0);
                                                  setSelectedDT(null);
                                                  setFinalAmount("0");
                                                  setDiscountRate("0");
                                                  setMachineAmt("0");
                                                  setSelectedIdx(null);
                                                  setNewMachineConfigId(null);
                                                  setDisktype(e.target.value);
                                                }}
                                              >
                                                {/* <option value="hdd" selected>
                                                        {item.hdd} GB HDD Disk
                                                        </option>
                                                        <option value="ssd" selected>
                                                        {item.hdd} GB SSD Disk
                                                        </option>
                                                        <option value="nvme" selected>
                                                        {item.hdd} GB NVMe Disk
                                                        </option> */}
                                                {rHddStocks[0].stocks == 1 && (
                                                  <option value="hdd" selected>
                                                    {item.hdd} GB HDD Disk
                                                  </option>
                                                )}
                                                {rSsdStocks[0].stocks == 1 && (
                                                  <option value="ssd" selected>
                                                    {item.hdd} GB SSD Disk
                                                  </option>
                                                )}
                                                {rNvmStocks[0].stocks == 1 && (
                                                  <option value="nvme" selected>
                                                    {item.hdd} GB NVMe Disk
                                                  </option>
                                                )}
                                              </select>
                                              {/* {item.hdd} GB SSD Disk */}
                                            </div>
                                            <div
                                              className="data price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.data_transfer} TB Bandwidth
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </>
                              ) : (
                                <>
                                  {rHdd &&
                                    rHdd.map((item, idx) => (
                                      <div
                                        className="package"
                                        style={{
                                          width: "350px",
                                          marginBottom: "25px",
                                        }}
                                      >
                                        <label className="custom-checkbox">
                                          <span
                                            style={{
                                              width: "17rem",
                                              marginTop: "10px",
                                              marginLeft: "48px",
                                              padding: "15px",
                                              borderRadius: "35px",
                                              display: "inline-block",
                                              fontSize: "17px",
                                              background:
                                                selectedIdx === idx
                                                  ? "#035189"
                                                  : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",
                                              color: "rgb(0, 0, 0)",
                                              cursor: "pointer",
                                              userSelect: "none",
                                              fontWeight: "bold",
                                              height: "10rem",
                                              boxShadow:
                                                "rgba(0, 0, 0, 0.2) 2px 2px 0px",
                                            }}
                                            onClick={() => {
                                              setSelectedCPU(item.cpu);
                                              setSelectedRAM(item.ram);
                                              setSelectedSSD(item.hdd);
                                              setSelectedDT(item.data_transfer);
                                              setFinalAmount(
                                                (item.hdd_rate * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate) *
                                                  newMachineTime,
                                              );
                                              setDiscountRate(
                                                item[
                                                  `discount_price_${newMachineTime}`
                                                ],
                                              );
                                              setMachineAmt(
                                                item.hdd_rate * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                              );
                                              setSelectedIdx(idx);
                                              setNewMachineConfigId(
                                                item.config_id,
                                              );
                                              console.log(
                                                "CHECK CONFIGID: item.config_id",
                                                item.config_id,
                                              );
                                            }}
                                          >
                                            <div
                                              className="top-head see-white-text"
                                              style={{
                                                marginTop: "1.5rem",
                                                position: "relative",
                                                textAlign: "center",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                              }}
                                            >
                                              <img
                                                src="/images/admin/02-VM/title-bg-orange.svg"
                                                className="orange-bg"
                                                alt="orange background"
                                                style={{ width: "100%" }}
                                              />
                                              <img
                                                src="/images/admin/02-VM/title-bg-white.svg"
                                                className="white-bg hide"
                                                alt="white background"
                                                style={{ width: "100%" }}
                                              />
                                              <h4
                                                style={{
                                                  marginTop: "-40px",
                                                  fontSize: "24px",
                                                  color: "white",
                                                }}
                                              >
                                                RAM Proactive
                                              </h4>
                                            </div>

                                            <div className="top-body theme-color-blue">
                                              <div
                                                className="price"
                                                style={{
                                                  color:
                                                    selectedIdx === idx
                                                      ? "#fff"
                                                      : "#545454",
                                                  textAlign: "center",
                                                  marginTop: "15px",
                                                }}
                                              >
                                                {smuser &&
                                                  appCurrency &&
                                                  currencyReturn({
                                                    price:
                                                      item.hdd_rate * item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate,
                                                    symbol:
                                                      smuser.prefer_currency,
                                                    rates: appCurrency,
                                                  })}
                                                <span> Month </span>
                                                {/* ₹{" "}
                                                    {item.hdd_rate * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate}{" "}
                                                    / <span> Month </span> */}
                                              </div>
                                              <div
                                                className="price"
                                                style={{
                                                  color:
                                                    selectedIdx === idx
                                                      ? "#fff"
                                                      : "#545454",
                                                  textAlign: "center",
                                                }}
                                              >
                                                {(
                                                  (diskType == "ssd"
                                                    ? item.ssd_price *
                                                        item.hdd +
                                                      item.cpu_rate * item.cpu +
                                                      item.ram * item.ram_rate
                                                    : diskType == "hdd"
                                                      ? item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram * item.ram_rate
                                                      : item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate) /
                                                  appCurrency /
                                                  30
                                                ).toFixed(2)}{" "}
                                                / <span>day</span>
                                              </div>
                                            </div>
                                          </span>
                                        </label>

                                        <div style={{ marginLeft: "40px" }}>
                                          <img
                                            src="/images/admin/02-VM/gray-box-bg.svg"
                                            className="gray-bg"
                                            alt="gray background"
                                            style={{ height: "15rem" }}
                                          />
                                          <img
                                            src="/images/admin/02-VM/orange-box-bg.svg"
                                            className="orange-bg hide"
                                            alt="orange background"
                                            style={{ height: "15rem" }}
                                          />
                                          <div
                                            style={{
                                              marginTop: "-14rem",
                                              marginLeft: "5px",
                                              color: "#444",
                                            }}
                                          >
                                            <div
                                              className="cpu price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.cpu} vCPU
                                            </div>
                                            <div
                                              className="ram price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.ram} GB RAM
                                            </div>
                                            <div
                                              className="ssd price"
                                              data-value="40"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              <select
                                                name="plan_time"
                                                value={diskType}
                                                style={{
                                                  borderRadius: "30px",
                                                  // marginRight: "10px",
                                                  padding: "5px 5px",
                                                  border: "2px solid #e97730",
                                                }}
                                                onChange={(e) => {
                                                  setSelectedCPU(0);
                                                  setSelectedRAM(0);
                                                  setSelectedSSD(0);
                                                  setSelectedDT(null);
                                                  setFinalAmount("0");
                                                  setDiscountRate("0");
                                                  setMachineAmt("0");
                                                  setSelectedIdx(null);
                                                  setNewMachineConfigId(null);
                                                  setDisktype(e.target.value);
                                                }}
                                              >
                                                {/* <option value="hdd" selected>
                                                        {item.hdd} GB HDD Disk
                                                        </option>
                                                        <option value="ssd" selected>
                                                        {item.hdd} GB SSD Disk
                                                        </option>
                                                        <option value="nvme" selected>
                                                        {item.hdd} GB NVMe Disk
                                                        </option> */}
                                                {rHddStocks[0].stocks == 1 && (
                                                  <option value="hdd" selected>
                                                    {item.hdd} GB HDD Disk
                                                  </option>
                                                )}
                                                {rSsdStocks[0].stocks == 1 && (
                                                  <option value="ssd" selected>
                                                    {item.hdd} GB SSD Disk
                                                  </option>
                                                )}
                                                {rNvmStocks[0].stocks == 1 && (
                                                  <option value="nvme" selected>
                                                    {item.hdd} GB NVMe Disk
                                                  </option>
                                                )}
                                              </select>
                                              {/* {item.hdd} GB SSD Disk */}
                                            </div>
                                            <div
                                              className="data price"
                                              data-value="1"
                                              style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "24px",
                                                position: "relative",
                                                marginTop: "15px",
                                              }}
                                            >
                                              {item.data_transfer} TB Bandwidth
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </>
                              )}
                            </>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        // WEBVIEW

        <>
          <Row>
            <div className="col-md-1"></div>
            <div
              className="see-width col-md-11"
              style={{
                marginTop: "4rem",
                paddingLeft: "2rem",
                marginBottom: "4rem",
              }}
            >
              <div style={{ display: "flex" }}>
                {smuser && smuser.platform_status == "0" ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        padding: "10px 0",
                        width: "100%",
                        scrollbarWidth: "thin",
                      }}
                    >
                      <div style={{ width: "15rem" }}>
                        <div
                          className="in-border"
                          style={{
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
                            marginLeft: "50px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              height: "110px",
                              width: "110px",
                              padding: "1px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              margin: "auto",
                              backgroundColor: "#E97730",
                            }}
                          >
                            <figure
                              style={{
                                background: "#e97730",
                                borderRadius: "50%",
                                padding: "20px 8px 0px 0px",
                                // width: "70px",
                                // height: "70px",
                                objectFit: "cover",
                                display: "table",
                                margin: "auto",
                              }}
                            >
                              <img
                                src={"/images/admin/02-VM/ubanto-logo.svg"}
                                alt={""}
                                style={{ width: "60px", height: "60px" }}
                              />
                            </figure>
                          </div>
                        </div>
                        <h4
                          style={{
                            fontSize: "24px",
                            textTransform: "capitalize",
                            color: "#035189",
                            fontWeight: "500",
                            textAlign: "center",
                            marginTop: "5px",
                          }}
                        >
                          Ubantu
                        </h4>
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                            width: "15rem",
                            marginRight: "15px",
                          }}
                          value={newMahineOs}
                          onChange={(e) => {
                            setNewMachineOs(e.target.value);
                            //console.log(e.target.value);
                          }}
                        >
                          <option value="Select" selected>
                            Select
                          </option>
                          {ubuntu_fa &&
                            ubuntu_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div style={{ width: "15rem", marginLeft: "15px" }}>
                        <div
                          className="in-border"
                          style={{
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
                            marginLeft: "50px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              height: "110px",
                              width: "110px",
                              padding: "1px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              margin: "auto",
                              backgroundColor: "#E97730",
                            }}
                          >
                            <figure
                              style={{
                                background: "#e97730",
                                borderRadius: "50%",
                                padding: "20px 8px 0px 0px",
                                // width: "70px",
                                // height: "70px",
                                objectFit: "cover",
                                display: "table",
                                margin: "auto",
                              }}
                            >
                              <img
                                src={"/fedora-icon.svg"}
                                alt={"/fedora-icon.svg"}
                                style={{
                                  marginLeft: "5px",
                                  width: "100px",
                                  height: "60px",
                                }}
                              />
                            </figure>
                          </div>
                        </div>
                        <h4
                          style={{
                            fontSize: "24px",
                            textTransform: "capitalize",
                            color: "#035189",
                            fontWeight: "500",
                            textAlign: "center",
                            marginTop: "5px",
                          }}
                        >
                          Fedora
                        </h4>
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                            width: "15rem",
                          }}
                          value={newMahineOs}
                          onChange={(e) => {
                            setNewMachineOs(e.target.value);
                            //console.log(e.target.value);
                          }}
                        >
                          <option value="Select" selected>
                            Select
                          </option>
                          {fedora_fa &&
                            fedora_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div style={{ width: "15rem", marginLeft: "15px" }}>
                        <div
                          className="in-border"
                          style={{
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
                            marginLeft: "50px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              height: "110px",
                              width: "110px",
                              padding: "1px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              margin: "auto",
                              backgroundColor: "#E97730",
                            }}
                          >
                            <figure
                              style={{
                                background: "#e97730",
                                borderRadius: "50%",
                                padding: "20px 8px 0px 0px",
                                // width: "70px",
                                // height: "70px",
                                objectFit: "cover",
                                display: "table",
                                margin: "auto",
                              }}
                            >
                              <img
                                src={"/images/admin/02-VM/centos-logo.svg"}
                                alt={""}
                                style={{ width: "60px", height: "60px" }}
                              />
                            </figure>
                          </div>
                        </div>
                        <h4
                          style={{
                            fontSize: "24px",
                            textTransform: "capitalize",
                            color: "#035189",
                            fontWeight: "500",
                            textAlign: "center",
                            marginTop: "5px",
                          }}
                        >
                          CentOS
                        </h4>
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                            width: "15rem",
                          }}
                          value={newMahineOs}
                          onChange={(e) => {
                            setNewMachineOs(e.target.value);
                            //console.log(e.target.value);
                          }}
                        >
                          <option value="Select" selected>
                            Select
                          </option>
                          {centOS_fa &&
                            centOS_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))}
                        </select>
                      </div>

                      {redhat_fa && (
                        <div style={{ width: "15rem", marginLeft: "15px" }}>
                          <div
                            className="in-border"
                            style={{
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
                              marginLeft: "50px",
                            }}
                          >
                            <div
                              className="in-border"
                              style={{
                                height: "110px",
                                width: "110px",
                                padding: "1px",
                                borderColor: "yellow",
                                border: "2px solid #E97730",
                                borderRadius: "50%",
                                // display: "table",
                                margin: "auto",
                                backgroundColor: "#E97730",
                              }}
                            >
                              <figure
                                style={{
                                  background: "#e97730",
                                  borderRadius: "50%",
                                  padding: "20px 8px 0px 0px",
                                  // width: "70px",
                                  // height: "70px",
                                  objectFit: "cover",
                                  display: "table",
                                  margin: "auto",
                                }}
                              >
                                <img
                                  src={"/images/admin/02-VM/centos-logo.svg"}
                                  alt={"/images/admin/02-VM/centos-logo.svg"}
                                  style={{ width: "60px", height: "60px" }}
                                />
                              </figure>
                            </div>
                          </div>
                          <h4
                            style={{
                              fontSize: "24px",
                              textTransform: "capitalize",
                              color: "#035189",
                              fontWeight: "500",
                              textAlign: "center",
                              marginTop: "5px",
                            }}
                          >
                            Redhat
                          </h4>
                          <select
                            name="plan_time"
                            style={{
                              borderRadius: "30px",
                              marginRight: "10px",
                              padding: "10px 15px",
                              border: "2px solid #e97730",
                              width: "15rem",
                            }}
                            value={newMahineOs}
                            onChange={(e) => {
                              setNewMachineOs(e.target.value);
                              //console.log(e.target.value);
                            }}
                          >
                            <option value="Select" selected>
                              Select
                            </option>
                            {redhat_fa &&
                              redhat_fa.map((item, index) => (
                                <option
                                  key={index}
                                  value={Object.values(item)[0]}
                                >
                                  {Object.keys(item)[0]}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      <div style={{ width: "15rem", marginLeft: "15px" }}>
                        <div
                          className="in-border"
                          style={{
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
                            marginLeft: "50px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              height: "110px",
                              width: "110px",
                              padding: "1px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              margin: "auto",
                              backgroundColor: "#E97730",
                            }}
                          >
                            <figure
                              style={{
                                background: "#e97730",
                                borderRadius: "50%",
                                padding: "20px 8px 0px 0px",
                                // width: "70px",
                                // height: "70px",
                                objectFit: "cover",
                                display: "table",
                                margin: "auto",
                              }}
                            >
                              <img
                                src={"/rocky-icon.svg"}
                                alt={"/rocky-icon.svg"}
                                style={{
                                  marginLeft: "5px",
                                  width: "60px",
                                  height: "60px",
                                }}
                              />
                            </figure>
                          </div>
                        </div>
                        <h4
                          style={{
                            fontSize: "24px",
                            textTransform: "capitalize",
                            color: "#035189",
                            fontWeight: "500",
                            textAlign: "center",
                            marginTop: "5px",
                          }}
                        >
                          Rocky
                        </h4>
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                            width: "15rem",
                          }}
                          value={newMahineOs}
                          onChange={(e) => {
                            setNewMachineOs(e.target.value);
                            //console.log(e.target.value);
                          }}
                        >
                          <option value="Select" selected>
                            Select
                          </option>
                          {rocky_fa &&
                            rocky_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div style={{ width: "15rem", marginLeft: "15px" }}>
                        <div
                          className="in-border"
                          style={{
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
                            marginLeft: "50px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              height: "110px",
                              width: "110px",
                              padding: "1px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              margin: "auto",
                              backgroundColor: "#E97730",
                            }}
                          >
                            <figure
                              style={{
                                background: "#e97730",
                                borderRadius: "50%",
                                padding: "20px 8px 0px 0px",
                                // width: "70px",
                                // height: "70px",
                                objectFit: "cover",
                                display: "table",
                                margin: "auto",
                              }}
                            >
                              <img
                                src={"/alma-icon.svg"}
                                alt={"/alma-icon.svg"}
                                style={{ width: "60px", height: "60px" }}
                              />
                            </figure>
                          </div>
                        </div>
                        <h4
                          style={{
                            fontSize: "24px",
                            textTransform: "capitalize",
                            color: "#035189",
                            fontWeight: "500",
                            textAlign: "center",
                            marginTop: "5px",
                          }}
                        >
                          Almalinux
                        </h4>
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                            width: "15rem",
                          }}
                          value={newMahineOs}
                          onChange={(e) => {
                            setNewMachineOs(e.target.value);
                            //console.log(e.target.value);
                          }}
                        >
                          <option value="Select" selected>
                            Select
                          </option>
                          {linux_fa &&
                            linux_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div style={{ width: "15rem", marginLeft: "15px" }}>
                        <div
                          className="in-border"
                          style={{
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
                            marginLeft: "50px",
                          }}
                        >
                          <div
                            className="in-border"
                            style={{
                              height: "110px",
                              width: "110px",
                              padding: "1px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              margin: "auto",
                              backgroundColor: "#E97730",
                            }}
                          >
                            <figure
                              style={{
                                background: "#e97730",
                                borderRadius: "50%",
                                padding: "20px 8px 0px 0px",
                                // width: "70px",
                                // height: "70px",
                                objectFit: "cover",
                                display: "table",
                                margin: "auto",
                              }}
                            >
                              <img
                                src={"/debian-icon.svg"}
                                alt={"/debian-icon.svg"}
                                style={{ width: "60px", height: "60px" }}
                              />
                            </figure>
                          </div>
                        </div>
                        <h4
                          style={{
                            fontSize: "24px",
                            textTransform: "capitalize",
                            color: "#035189",
                            fontWeight: "500",
                            textAlign: "center",
                            marginTop: "5px",
                          }}
                        >
                          Debian
                        </h4>
                        <select
                          name="plan_time"
                          style={{
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid #e97730",
                            width: "15rem",
                          }}
                          value={newMahineOs}
                          onChange={(e) => {
                            setNewMachineOs(e.target.value);
                            //console.log(e.target.value);
                          }}
                        >
                          <option value="Select" selected>
                            Select
                          </option>
                          {debian_fa &&
                            debian_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: "15rem" }}>
                      <div
                        className="in-border"
                        style={{
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
                          marginLeft: "50px",
                        }}
                      >
                        <div
                          className="in-border"
                          style={{
                            height: "110px",
                            width: "110px",
                            padding: "1px",
                            borderColor: "yellow",
                            border: "2px solid #E97730",
                            borderRadius: "50%",
                            // display: "table",
                            margin: "auto",
                            backgroundColor: "#E97730",
                          }}
                        >
                          <figure
                            style={{
                              background: "#e97730",
                              borderRadius: "50%",
                              padding: "20px 8px 0px 0px",
                              // width: "70px",
                              // height: "70px",
                              objectFit: "cover",
                              display: "table",
                              margin: "auto",
                            }}
                          >
                            <img
                              src={"/images/admin/02-VM/ubanto-logo.svg"}
                              alt={""}
                              style={{ width: "60px", height: "60px" }}
                            />
                          </figure>
                        </div>
                      </div>
                      <h4
                        style={{
                          fontSize: "24px",
                          textTransform: "capitalize",
                          color: "#035189",
                          fontWeight: "500",
                          textAlign: "center",
                          marginTop: "5px",
                        }}
                      >
                        Ubantu
                      </h4>
                      <select
                        name="plan_time"
                        style={{
                          borderRadius: "30px",
                          marginRight: "10px",
                          padding: "10px 15px",
                          border: "2px solid #e97730",
                          width: "15rem",
                          marginRight: "15px",
                        }}
                        value={ubantu_machine}
                        onChange={(e) => {
                          setNewMachineOs(e.target.value);
                          //console.log(e.target.value);
                          setUbantu_machine(e.target.value);
                          setFedora_machine("select");
                        }}
                      >
                        <option value="Select" selected>
                          Select
                        </option>
                        {ubantuOS &&
                          ubantuOS.map((item, index) => (
                            <option key={index} value={Object.values(item)[0]}>
                              {Object.keys(item)[0]}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div style={{ width: "15rem", marginLeft: "15px" }}>
                      <div
                        className="in-border"
                        style={{
                          alignContent: "center",
                          height: "130px",
                          width: "130px",
                          borderColor: "yellow",
                          border: "2px solid #E97730",
                          borderRadius: "50%",
                          backgroundColor: "transparent",
                          padding: "0",
                          marginLeft: "50px",
                        }}
                      >
                        <div
                          className="in-border"
                          style={{
                            height: "110px",
                            width: "110px",
                            padding: "1px",
                            borderColor: "yellow",
                            border: "2px solid #E97730",
                            borderRadius: "50%",
                            // display: "table",
                            margin: "auto",
                            backgroundColor: "#E97730",
                          }}
                        >
                          <figure
                            style={{
                              background: "#e97730",
                              borderRadius: "50%",
                              padding: "20px 8px 0px 0px",
                              // width: "70px",
                              // height: "70px",
                              objectFit: "cover",
                              display: "table",
                              margin: "auto",
                            }}
                          >
                            <img
                              src={"/images/admin/02-VM/window-logo.svg"}
                              alt={""}
                              style={{ width: "60px", height: "60px" }}
                            />
                          </figure>
                        </div>
                      </div>
                      <h4
                        style={{
                          fontSize: "24px",
                          textTransform: "capitalize",
                          color: "#035189",
                          fontWeight: "500",
                          textAlign: "center",
                          marginTop: "5px",
                        }}
                      >
                        Fedora
                      </h4>
                      <select
                        name="plan_time"
                        style={{
                          borderRadius: "30px",
                          marginRight: "10px",
                          padding: "10px 15px",
                          border: "2px solid #e97730",
                          width: "15rem",
                        }}
                        onChange={(e) => {
                          setNewMachineOs(e.target.value);
                          //console.log(e.target.value);
                          setUbantu_machine("Select");
                          setFedora_machine(e.target.value);
                        }}
                      >
                        <option value="Select" selected>
                          Select
                        </option>
                        {fedoraOS &&
                          fedoraOS.map((item, index) => (
                            <option key={index} value={Object.values(item)[0]}>
                              {Object.keys(item)[0]}
                            </option>
                          ))}
                      </select>
                    </div>
                  </>
                )}

                {smuser && smuser.platform_status == "0" ? <></> : null}
              </div>
              <hr />
              <div
                className="buttons-container"
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  // justifyContent: "flex-end",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                {/* {topButtons.map((title, idx) => ( */}
                <Button className="top-buttons-creact-machine">
                  {selectedCPU} vCPU
                </Button>

                <Button className="top-buttons-creact-machine">
                  {selectedRAM} GB RAM
                </Button>

                <Button className="top-buttons-creact-machine">
                  {selectedSSD} GB Disk
                </Button>

                <Button className="top-buttons-creact-machine">
                  {selectedDT} TB Bandwidth
                </Button>
                {/* ))} */}
                <select
                  name="plan_time"
                  style={{
                    borderRadius: "30px",
                    marginRight: "10px",
                    padding: "10px 15px",
                    border: "2px solid #e97730",
                  }}
                  onChange={(e) => {
                    setFinalAmount(machineAmt * e.target.value);
                    setNewMachineTime(e.target.value);
                    // setSelectedIdx(null);

                    {
                      activePage === "Custom Configure" ? (
                        determineDiscountRate(
                          configType,
                          diskType,
                          e.target.value,
                        )
                      ) : activePage === "Standard" ? (
                        <>
                          {diskType == "ssd" ? (
                            <>
                              {sSsd &&
                                sSsd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {sNvm &&
                                sNvm.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          ) : (
                            <>
                              {sHdd &&
                                sHdd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          )}
                        </>
                      ) : activePage === "CPU Proactive" ? (
                        <>
                          {diskType == "ssd" ? (
                            <>
                              {cSsd &&
                                cSsd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {cNvm &&
                                cNvm.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          ) : (
                            <>
                              {cHdd &&
                                cHdd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {diskType == "ssd" ? (
                            <>
                              {rSsd &&
                                rSsd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {rNvm &&
                                rNvm.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          ) : (
                            <>
                              {rHdd &&
                                rHdd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`],
                                  ),
                                )}
                            </>
                          )}
                        </>
                      );
                    }
                  }}
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Month</option>
                  <option value="6">6 Month</option>
                  <option value="9">9 Month</option>
                  <option value="12">1 Year</option>
                  <option value="24">2 Years</option>
                </select>
                <select
                  name="plan_time"
                  style={{
                    borderRadius: "30px",
                    marginRight: "10px",
                    padding: "10px 15px",
                    border: "2px solid #e97730",
                    width: "9rem",
                  }}
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    onChangeLocation(e.target.value);
                  }}
                >
                  <option value="Select" selected>
                    Select Location
                  </option>
                  {serverLocaiton &&
                    serverLocaiton.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.server_location}
                      </option>
                    ))}
                </select>
                <div
                  className="input-container"
                  style={{
                    border: "2px solid #e97730",
                    width: "13rem",
                    marginTop: "0px",
                  }}
                >
                  <input
                    type="text"
                    name="CompanyName"
                    className="input-create-machine"
                    placeholder="Name of Machine"
                    value={newMachineName}
                    style={{
                      color: "black",
                      textAlign: "center",
                      width: "15px",
                    }}
                    onChange={(e) => setNewMachineName(e.target.value)}
                  />
                </div>
                <a
                  onClick={() => {
                    if (smuser.phoneverify === 1) {
                      if (activePage == "Custom Configure") {
                      } else {
                      }
                      if (
                        newMachineName !== "" &&
                        newMahineOs !== "" &&
                        newMahineOs !== "Select" &&
                        newMachineName !== null &&
                        newMahineOs !== null
                      ) {
                        if (stockAvailableStatus) {
                          if (selectedSSD >= 20) {
                            var serverCost =
                              finalAmount - (finalAmount * discountRate) / 100;
                            var creditDiscAmt =
                              (serverCost * upnetPercentage) / 100;
                            var amount = serverCost - creditDiscAmt;

                            var fAmount = amount - smuser.total_credit;
                            setAddToWalletAmt(fAmount);
                            if (
                              fAmount > smuser.total_credit &&
                              smuser.reward_points !== null &&
                              smuser.reward_points > 0
                            ) {
                              ShowUpnetCreditContentPopup(true);
                            } else {
                              setCounter(1);
                              setShowIPOptionPopup(true);
                            }
                          } else {
                            toast((t) => (
                              <AppToast
                                id={t.id}
                                message={
                                  "Please select minimum 20 GB Disk Storage."
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
                                "Stock is currently unavailable for this location. You may raise a support ticket for further assistance."
                              }
                              isMobile={isMobile}
                            />
                          ));
                        }
                      } else if (newMachineName == null) {
                        toast((t) => (
                          <AppToast
                            id={t.id}
                            message={"Machine Name Required"}
                            isMobile={isMobile}
                          />
                        ));
                      } else if (newMahineOs == null) {
                        toast((t) => (
                          <AppToast
                            id={t.id}
                            message={"Machine OS is Required"}
                            isMobile={isMobile}
                          />
                        ));
                      } else if (newMahineOs == "Select") {
                        toast((t) => (
                          <AppToast
                            id={t.id}
                            message={"Machine OS is Required"}
                            isMobile={isMobile}
                          />
                        ));
                      }
                    } else {
                      setShowPhoneVerify(true);
                    }
                  }}
                  className="underline-text"
                  style={{
                    marginTop: "10px",
                    marginLeft: "18px",
                    fontSize: "24px",
                    color: "#035189",
                    fontWeight: "600",
                  }}
                  onMouseOver={(e) => (
                    (e.target.style.fontWeight = "800"),
                    (e.target.style.textDecoration = "underline")
                  )}
                  onMouseOut={(e) => (
                    (e.target.style.fontWeight = "600"),
                    (e.target.style.textDecoration = "none")
                  )}
                >
                  Create Machine
                </a>
                {activePage == "Custom Configure" ? (
                  <>
                    <div className="price-container">
                      <div className="price-old">
                        {(() => {
                          let discount;

                          if (configType === 1) {
                            discount =
                              diskType === "ssd"
                                ? `${
                                    stdCusSSD[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : diskType === "nvme"
                                  ? `${
                                      stdCusNVM[
                                        `discount_price_${newMachineTime}`
                                      ]
                                    } % OFF`
                                  : `${
                                      stdCusHDD[
                                        `discount_price_${newMachineTime}`
                                      ]
                                    } % OFF`;
                          } else if (configType === 3) {
                            discount =
                              diskType === "ssd"
                                ? `${
                                    cpuCusSSD[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : diskType === "nvme"
                                  ? `${
                                      cpuCusNVM[
                                        `discount_price_${newMachineTime}`
                                      ]
                                    } % OFF`
                                  : `${
                                      cpuCusHDD[
                                        `discount_price_${newMachineTime}`
                                      ]
                                    } % OFF`;
                          } else {
                            discount =
                              diskType === "ssd"
                                ? `${
                                    ramCusSSD[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : diskType === "nvme"
                                  ? `${
                                      ramCusNVM[
                                        `discount_price_${newMachineTime}`
                                      ]
                                    } % OFF`
                                  : `${
                                      ramCusHDD[
                                        `discount_price_${newMachineTime}`
                                      ]
                                    } % OFF`;
                          }

                          if (parseFloat(discount) > 0) {
                            return (
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  fontSize: "15px",
                                  marginRight: "10px",
                                }}
                              >
                                {configType === 1 &&
                                  smuser &&
                                  appCurrency &&
                                  stdCusHDD &&
                                  stdCusSSD &&
                                  stdCusNVM &&
                                  currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculateOriginalPrice(
                                            stdCusSSD.cpu_rate,
                                            stdCusSSD.ram_rate,
                                            stdCusSSD.ssd_price,
                                          )
                                        : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              stdCusNVM.cpu_rate,
                                              stdCusNVM.ram_rate,
                                              stdCusNVM.nvme_price,
                                            )
                                          : calculateOriginalPrice(
                                              stdCusHDD.cpu_rate,
                                              stdCusHDD.ram_rate,
                                              stdCusHDD.hdd_rate,
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  })}

                                {configType === 2 &&
                                  smuser &&
                                  appCurrency &&
                                  cpuCusSSD &&
                                  cpuCusNVM &&
                                  cpuCusHDD &&
                                  currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculateOriginalPrice(
                                            cpuCusSSD.cpu_rate,
                                            cpuCusSSD.ram_rate,
                                            cpuCusSSD.ssd_price,
                                          )
                                        : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              cpuCusNVM.cpu_rate,
                                              cpuCusNVM.ram_rate,
                                              cpuCusNVM.nvme_price,
                                            )
                                          : calculateOriginalPrice(
                                              cpuCusHDD.cpu_rate,
                                              cpuCusHDD.ram_rate,
                                              cpuCusHDD.hdd_rate,
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  })}

                                {configType === 3 &&
                                  smuser &&
                                  appCurrency &&
                                  ramCusSSD &&
                                  ramCusNVM &&
                                  ramCusHDD &&
                                  currencyReturn({
                                    price:
                                      diskType === "ssd"
                                        ? calculateOriginalPrice(
                                            ramCusSSD.cpu_rate,
                                            ramCusSSD.ram_rate,
                                            ramCusSSD.ssd_price,
                                          )
                                        : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              ramCusNVM.cpu_rate,
                                              ramCusNVM.ram_rate,
                                              ramCusNVM.nvme_price,
                                            )
                                          : calculateOriginalPrice(
                                              ramCusHDD.cpu_rate,
                                              ramCusHDD.ram_rate,
                                              ramCusHDD.hdd_rate,
                                            ),
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  })}
                              </span>
                            );
                          }

                          return null; // Return null if discount is not greater than 0
                        })()}

                        {configType === 1 &&
                          smuser &&
                          appCurrency &&
                          stdCusHDD &&
                          stdCusSSD &&
                          stdCusNVM &&
                          currencyReturn({
                            price:
                              diskType === "ssd"
                                ? calculatePrice(
                                    stdCusSSD.cpu_rate,
                                    stdCusSSD.ram_rate,
                                    stdCusSSD.ssd_price,
                                    discountRate || 0,
                                    1,
                                  )
                                : diskType === "nvme"
                                  ? calculatePrice(
                                      stdCusNVM.cpu_rate,
                                      stdCusNVM.ram_rate,
                                      stdCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime,
                                    )
                                  : calculatePrice(
                                      stdCusHDD.cpu_rate,
                                      stdCusHDD.ram_rate,
                                      stdCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime,
                                    ),
                            symbol: smuser.prefer_currency,
                            rates: appCurrency,
                          })}

                        {configType === 2 &&
                          smuser &&
                          appCurrency &&
                          cpuCusSSD &&
                          cpuCusNVM &&
                          cpuCusHDD &&
                          currencyReturn({
                            price:
                              diskType === "ssd"
                                ? calculatePrice(
                                    cpuCusSSD.cpu_rate,
                                    cpuCusSSD.ram_rate,
                                    cpuCusSSD.ssd_price,
                                    discountRate || 0,
                                    newMachineTime,
                                  )
                                : diskType === "nvme"
                                  ? calculatePrice(
                                      cpuCusNVM.cpu_rate,
                                      cpuCusNVM.ram_rate,
                                      cpuCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime,
                                    )
                                  : calculatePrice(
                                      cpuCusHDD.cpu_rate,
                                      cpuCusHDD.ram_rate,
                                      cpuCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime,
                                    ),
                            symbol: smuser.prefer_currency,
                            rates: appCurrency,
                          })}

                        {configType === 3 &&
                          smuser &&
                          appCurrency &&
                          ramCusSSD &&
                          ramCusNVM &&
                          ramCusHDD &&
                          currencyReturn({
                            price:
                              diskType === "ssd"
                                ? calculatePrice(
                                    ramCusSSD.cpu_rate,
                                    ramCusSSD.ram_rate,
                                    ramCusSSD.ssd_price,
                                    discountRate || 0,
                                    newMachineTime,
                                  )
                                : diskType === "nvme"
                                  ? calculatePrice(
                                      ramCusNVM.cpu_rate,
                                      ramCusNVM.ram_rate,
                                      ramCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime,
                                    )
                                  : calculatePrice(
                                      ramCusHDD.cpu_rate,
                                      ramCusHDD.ram_rate,
                                      ramCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime,
                                    ),
                            symbol: smuser.prefer_currency,
                            rates: appCurrency,
                          })}
                      </div>

                      {(() => {
                        let discount;

                        if (configType === 1) {
                          discount =
                            diskType === "ssd"
                              ? `${
                                  stdCusSSD[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : diskType === "nvme"
                                ? `${
                                    stdCusNVM[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : `${
                                    stdCusHDD[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`;
                        } else if (configType === 3) {
                          discount =
                            diskType === "ssd"
                              ? `${
                                  cpuCusSSD[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : diskType === "nvme"
                                ? `${
                                    cpuCusNVM[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : `${
                                    cpuCusHDD[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`;
                        } else {
                          discount =
                            diskType === "ssd"
                              ? `${
                                  ramCusSSD[`discount_price_${newMachineTime}`]
                                } % OFF`
                              : diskType === "nvme"
                                ? `${
                                    ramCusNVM[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`
                                : `${
                                    ramCusHDD[
                                      `discount_price_${newMachineTime}`
                                    ]
                                  } % OFF`;
                        }

                        if (parseFloat(discount) > 0) {
                          // const getDiscountText = (ssd, nvme, hdd) => {
                          //   return diskType === "ssd"
                          //     ? `${
                          //         ssd[`discount_price_${newMachineTime}`]
                          //       } % OFF`
                          //     : diskType === "nvme"
                          //     ? `${
                          //         nvme[`discount_price_${newMachineTime}`]
                          //       } % OFF`
                          //     : `${
                          //         hdd[`discount_price_${newMachineTime}`]
                          //       } % OFF`;
                          // };

                          // const discountText =
                          //   configType === 1
                          //     ? getDiscountText(stdCusSSD, stdCusNVM, stdCusHDD)
                          //     : configType === 3
                          //     ? getDiscountText(cpuCusSSD, cpuCusNVM, cpuCusHDD)
                          //     : getDiscountText(
                          //         ramCusSSD,
                          //         ramCusNVM,
                          //         ramCusHDD
                          //       );

                          return (
                            <div className="price-new">
                              <span style={{ zIndex: "9" }}>
                                {/* {discountText} */}
                                {discountRate} % OFF
                              </span>
                            </div>
                          );
                        }

                        return null; // Return null if discount is not greater than 0
                      })()}
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    {smuser && appCurrency && (
                      <div className="price-container">
                        {smuser && appCurrency && finalAmount > 0 && (
                          <div className="price-old">
                            {discountRate > 0 && (
                              <span
                                style={{
                                  textDecoration:
                                    finalAmount !== "0" ? "line-through" : "",
                                  fontSize: "16px",
                                  marginRight: "9px",
                                }}
                              >
                                {currencyReturn({
                                  price: finalAmount,
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              </span>
                            )}
                            {finalAmount !== "0" && (
                              <span style={{ zIndex: "9", fontSize: "20px" }}>
                                {currencyReturn({
                                  price:
                                    smuser.country === "India"
                                      ? finalAmount -
                                        (finalAmount * discountRate) / 100
                                      : (finalAmount -
                                          (finalAmount * discountRate) / 100) *
                                        (1 + surcharge / 100),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                                {/* ({discountRate} % off) */}
                              </span>
                            )}
                          </div>
                        )}
                        {smuser &&
                          appCurrency &&
                          finalAmount > 0 &&
                          discountRate > 0 && (
                            <div className="price-new">
                              {finalAmount !== 0 && (
                                <span style={{ zIndex: "9", fontSize: "20px" }}>
                                  {discountRate}% OFF
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div
                className="tab-box-web-vm"
                style={{ height: "60vh !important" }}
              >
                {platformSelected && platformSelected == "1" ? (
                  <>
                    {NativePages.map((item, idx) => (
                      <div
                        className={`${
                          activePage === item
                            ? "active-web-vm"
                            : "non-active-web-vm"
                        }`}
                        onClick={() => {
                          setActivePage(item);
                          setSelectedIdx(null);
                          setFinalAmount("0");
                          // setDiscountRate("0");
                        }}
                        style={{
                          paddingTop: item == "Standard" ? "44px" : "",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {" "}
                    {NativePages.map((item, idx) => (
                      <div
                        className={`${
                          activePage === item
                            ? "active-web-vm"
                            : "non-active-web-vm"
                        }`}
                        onClick={() => {
                          setActivePage(item);
                          setSelectedIdx(null);
                          setFinalAmount("0");
                        }}
                        style={
                          item === "Standard"
                            ? {
                                paddingTop:
                                  activePage === "Standard" ? "44px" : "33px",
                              }
                            : {}
                        }
                      >
                        {item}
                      </div>
                    ))}
                  </>
                )}

                <div
                  style={{
                    marginLeft: "1rem",
                    marginTop: "-29rem",
                  }}
                >
                  {activePage === "Custom Configure" ? (
                    <>
                      <div
                        className="buttons-container"
                        style={{ padding: "15px", marginTop: "-8rem" }}
                      >
                        {innerButtons.map((title, idx) => (
                          <Button
                            key={idx}
                            style={{
                              background: `${
                                activeButton === title ? "#f47c20" : "#035189"
                              }`,
                              border: "none",
                              fontSize: "22px",
                              padding: "5px 15px",
                              color: "#fff",
                              fontWeight: "600",
                              borderRadius: "5px",
                              marginBottom: "10px",
                            }}
                            onClick={() => {
                              setActiveButton(title);
                              setConfigType(idx + 1);
                              setDisktype("ssd");
                            }}
                          >
                            {title}
                          </Button>
                        ))}
                      </div>
                      <div
                        className="title-box-slider"
                        style={{
                          backgroundImage: `url(${"/images/frontend/price/server-img.png"})`,
                          backgroundPosition: "center",
                        }}
                      >
                        <h6
                          style={{
                            textAlign: "center",
                            fontSize: "30px",
                            fontWeight: "800",
                            marginTop: "25px",
                          }}
                        >
                          vCPU
                        </h6>
                        <h6
                          style={{
                            textAlign: "center",
                            fontSize: "30px",
                            fontWeight: "800",
                            marginTop: "60px",
                          }}
                        >
                          RAM
                        </h6>
                        <h6
                          style={{
                            textAlign: "center",
                            fontSize: "30px",
                            fontWeight: "800",
                            marginTop: "55px",
                          }}
                        >
                          <div
                            className="ssd price"
                            data-value="40"
                            style={{
                              textAlign: "center",
                              fontWeight: "600",
                              fontSize: "24px",
                              position: "relative",
                              marginTop: "0px",
                            }}
                          >
                            <select
                              name="plan_time"
                              value={diskType}
                              style={{
                                borderRadius: "30px",
                                padding: "5px",
                                fontSize: "30px",
                                border: "2px solid #e97730",
                                color: "#144e7b",
                                fontWeight: "700",
                                backgroundColor: "transparent",
                              }}
                              onChange={(e) => {
                                setDisktype(e.target.value);
                              }}
                            >
                              {activeButton == "Standard" ? (
                                diskType == "ssd" ? (
                                  <>
                                    {sHddStocks[0].stocks == 1 && (
                                      <option value="hdd" selected>
                                        HDD Disk
                                      </option>
                                    )}
                                    {sSsdStocks[0].stocks == 1 && (
                                      <option value="ssd" selected>
                                        SSD Disk
                                      </option>
                                    )}
                                    {sNvmStocks[0].stocks == 1 && (
                                      <option value="nvme" selected>
                                        NVMe Disk
                                      </option>
                                    )}
                                  </>
                                ) : diskType == "nvme" ? (
                                  <>
                                    {sHddStocks[0].stocks == 1 && (
                                      <option value="hdd" selected>
                                        HDD Disk
                                      </option>
                                    )}
                                    {sSsdStocks[0].stocks == 1 && (
                                      <option value="ssd" selected>
                                        SSD Disk
                                      </option>
                                    )}
                                    {sNvmStocks[0].stocks == 1 && (
                                      <option value="nvme" selected>
                                        NVMe Disk
                                      </option>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {sHddStocks[0].stocks == 1 && (
                                      <option value="hdd" selected>
                                        HDD Disk
                                      </option>
                                    )}
                                    {sSsdStocks[0].stocks == 1 && (
                                      <option value="ssd" selected>
                                        SSD Disk
                                      </option>
                                    )}
                                    {sNvmStocks[0].stocks == 1 && (
                                      <option value="nvme" selected>
                                        NVMe Disk
                                      </option>
                                    )}
                                  </>
                                )
                              ) : activeButton == "CPU Proactive" ? (
                                diskType == "ssd" ? (
                                  <>
                                    {cHddStocks[0].stocks == 1 && (
                                      <option value="hdd" selected>
                                        HDD Disk
                                      </option>
                                    )}
                                    {cSsdStocks[0].stocks == 1 && (
                                      <option value="ssd" selected>
                                        SSD Disk
                                      </option>
                                    )}
                                    {cNvmStocks[0].stocks == 1 && (
                                      <option value="nvme" selected>
                                        NVMe Disk
                                      </option>
                                    )}
                                  </>
                                ) : diskType == "nvme" ? (
                                  <>
                                    {cHddStocks[0].stocks == 1 && (
                                      <option value="hdd" selected>
                                        HDD Disk
                                      </option>
                                    )}
                                    {cSsdStocks[0].stocks == 1 && (
                                      <option value="ssd" selected>
                                        SSD Disk
                                      </option>
                                    )}
                                    {cNvmStocks[0].stocks == 1 && (
                                      <option value="nvme" selected>
                                        NVMe Disk
                                      </option>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {cHddStocks[0].stocks == 1 && (
                                      <option value="hdd" selected>
                                        HDD Disk
                                      </option>
                                    )}
                                    {cSsdStocks[0].stocks == 1 && (
                                      <option value="ssd" selected>
                                        SSD Disk
                                      </option>
                                    )}
                                    {cNvmStocks[0].stocks == 1 && (
                                      <option value="nvme" selected>
                                        NVMe Disk
                                      </option>
                                    )}
                                  </>
                                )
                              ) : diskType == "ssd" ? (
                                <>
                                  {rHddStocks[0].stocks == 1 && (
                                    <option value="hdd" selected>
                                      HDD Disk
                                    </option>
                                  )}
                                  {rSsdStocks[0].stocks == 1 && (
                                    <option value="ssd" selected>
                                      SSD Disk
                                    </option>
                                  )}
                                  {rNvmStocks[0].stocks == 1 && (
                                    <option value="nvme" selected>
                                      NVMe Disk
                                    </option>
                                  )}
                                </>
                              ) : diskType == "nvme" ? (
                                <>
                                  {rHddStocks[0].stocks == 1 && (
                                    <option value="hdd" selected>
                                      HDD Disk
                                    </option>
                                  )}
                                  {rSsdStocks[0].stocks == 1 && (
                                    <option value="ssd" selected>
                                      SSD Disk
                                    </option>
                                  )}
                                  {rNvmStocks[0].stocks == 1 && (
                                    <option value="nvme" selected>
                                      NVMe Disk
                                    </option>
                                  )}
                                </>
                              ) : (
                                <>
                                  {rHddStocks[0].stocks == 1 && (
                                    <option value="hdd" selected>
                                      HDD Disk
                                    </option>
                                  )}
                                  {rSsdStocks[0].stocks == 1 && (
                                    <option value="ssd" selected>
                                      SSD Disk
                                    </option>
                                  )}
                                  {rNvmStocks[0].stocks == 1 && (
                                    <option value="nvme" selected>
                                      NVMe Disk
                                    </option>
                                  )}
                                </>
                              )}
                            </select>
                          </div>
                        </h6>
                        <h6
                          style={{
                            textAlign: "center",
                            fontSize: "30px",
                            fontWeight: "800",
                            marginTop: "60px",
                          }}
                        >
                          BANDWIDTH
                        </h6>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          marginLeft: "22rem",
                          position: "absolute",
                          marginTop: "-26rem",
                          flexDirection: "column",
                          width: "60%",
                        }}
                      >
                        {/* CORE vCPU */}
                        <div>
                          <div className="range-slider">
                            <div
                              className="tooltip-horz"
                              style={{ left: `${percentage}%` }}
                            >
                              {percentage === 0 ? 0 : customCPU} vCPU
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={
                                configMap[`${activeButton}-${diskType}`]?.[0]
                                  ?.vcpu ?? 0
                              }
                              value={percentage === 0 ? 0 : customCPU}
                              onChange={(event) => {
                                setCustomCPU(event.target.value);
                                setSelectedCPU(event.target.value);
                              }}
                              className="custom-rangeInput"
                              style={{
                                background: `linear-gradient(to right, #e97730 ${percentage}%, #ddd ${percentage}%)`,
                              }}
                            />
                          </div>
                        </div>

                        {/* RAM */}
                        <div>
                          <div className="range-slider">
                            <div
                              className="tooltip-horz"
                              style={{
                                left: `${calculatePercentageRam(
                                  customRAM,
                                  getMaxRam(),
                                )}%`,
                              }}
                            >
                              {calculatePercentageRam(
                                customRAM,
                                getMaxRam(),
                              ) === 0
                                ? "0 GB"
                                : `${customRAM} GB`}
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={getMaxRam()}
                              value={
                                calculatePercentageRam(
                                  customRAM,
                                  getMaxRam(),
                                ) === 0
                                  ? "0"
                                  : customRAM
                              }
                              onChange={(event) => {
                                setCustomRAM(event.target.value);
                                setSelectedRAM(event.target.value);
                              }}
                              className="custom-rangeInput"
                              style={{
                                background: `linear-gradient(to right, #e97730 ${calculatePercentageRam(
                                  customRAM,
                                  getMaxRam(),
                                )}%, #ddd ${calculatePercentageRam(
                                  customRAM,
                                  getMaxRam(),
                                )}%)`,
                              }}
                            />
                          </div>
                        </div>

                        {/* DISK */}
                        <div>
                          <div className="range-slider">
                            <div
                              className="tooltip-horz"
                              style={{
                                left: calculatePercentageDISK(
                                  customDISK,
                                  activeButton,
                                  diskType,
                                ),
                              }}
                            >
                              {calculatePercentageDISK(
                                customDISK,
                                activeButton,
                                diskType,
                              ) === "0%"
                                ? "0 GB"
                                : `${customDISK} GB`}
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={getDiskMaxValue(activeButton, diskType)}
                              value={
                                calculatePercentageDISK(
                                  customDISK,
                                  activeButton,
                                  diskType,
                                ) === "0%"
                                  ? "0"
                                  : customDISK
                              }
                              onChange={(event) => {
                                setCustomDISK(event.target.value);
                                setSelectedSSD(event.target.value);
                              }}
                              className="custom-rangeInput"
                              style={{
                                background: `linear-gradient(to right, #e97730 ${calculatePercentageDISK(
                                  customDISK,
                                  activeButton,
                                  diskType,
                                )}, #ddd ${calculatePercentageDISK(
                                  customDISK,
                                  activeButton,
                                  diskType,
                                )})`,
                              }}
                            />
                          </div>
                        </div>

                        {/* BANDWIDTH */}
                        <div>
                          <div className="range-slider">
                            <div
                              className="tooltip-horz"
                              style={{
                                left: `${percentageBandwidth}%`,
                              }}
                            >
                              {percentageBandwidth === 0 ? 0 : customDATAT} TB
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={getConfig()}
                              value={
                                percentageBandwidth === 0 ? 0 : customDATAT
                              }
                              onChange={(event) => {
                                setCustomDATAT(event.target.value);
                                setSelectedDT(event.target.value);
                              }}
                              className="custom-rangeInput"
                              style={{
                                background: `linear-gradient(to right, #e97730 ${percentageBandwidth}%, #ddd ${percentageBandwidth}%)`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      className="standard-machine-list"
                      style={{
                        height: "60vh !important",
                      }}
                    >
                      {activePage === "Standard" ? (
                        <>
                          {diskType == "ssd" ? (
                            <>
                              {sSsd &&
                                sSsd.map((item, idx) => (
                                  <div
                                    className="package"
                                    style={{ width: "350px" }}
                                    onClick={() => {
                                      setSelectedCPU(item.cpu);
                                      setSelectedRAM(item.ram);
                                      setSelectedSSD(item.hdd);
                                      setSelectedDT(item.data_transfer);
                                      setFinalAmount(
                                        (item.ssd_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate) *
                                          newMachineTime,
                                      );
                                      setDiscountRate(
                                        item[
                                          `discount_price_${newMachineTime}`
                                        ],
                                      );
                                      setMachineAmt(
                                        item.ssd_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate,
                                      );
                                      setSelectedIdx(idx);
                                      setNewMachineConfigId(item.config_id);
                                      console.log(
                                        "CHECK CONFIGID: item.config_id",
                                        item.config_id,
                                        item.stock,
                                        item[
                                          `discount_price_${newMachineTime}`
                                        ],
                                      );
                                    }}
                                  >
                                    <label className="custom-checkbox">
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              Standard
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.ssd_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (diskType == "ssd"
                                                ? item.ssd_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate
                                                : diskType == "hdd"
                                                  ? item.hdd_rate * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : item.nvme_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div
                                      style={{
                                        // marginLeft: "50px"
                                        position: "relative",
                                        left: "3rem",
                                      }}
                                    >
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "-35px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* <option value="hdd" selected>
                                              {item.hdd} GB HDD Disk
                                            </option>
                                            <option value="ssd" selected>
                                              {item.hdd} GB SSD Disk
                                            </option>
                                            <option value="nvme" selected>
                                              {item.hdd} GB NVMe Disk
                                            </option> */}

                                            {sHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {sSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {sNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {sNvm &&
                                sNvm.map((item, idx) => (
                                  <div
                                    className="package"
                                    style={{ width: "350px" }}
                                  >
                                    <label
                                      className="custom-checkbox"
                                      onClick={() => {
                                        setSelectedCPU(item.cpu);
                                        setSelectedRAM(item.ram);
                                        setSelectedSSD(item.hdd);
                                        setSelectedDT(item.data_transfer);
                                        setFinalAmount(
                                          (item.nvme_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate) *
                                            newMachineTime,
                                        );
                                        setDiscountRate(
                                          item[
                                            `discount_price_${newMachineTime}`
                                          ],
                                        );
                                        setMachineAmt(
                                          item.nvme_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                        );
                                        setSelectedIdx(idx);
                                        setNewMachineConfigId(item.config_id);
                                      }}
                                    >
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              Standard
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.nvme_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                            {/* ₹{" "}
                                          {item.hdd_rate * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate}{" "}
                                          / <span> Month </span> */}
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (diskType == "ssd"
                                                ? item.ssd_price * item.hdd +
                                                  +item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate
                                                : diskType == "hdd"
                                                  ? item.hdd_rate * item.hdd +
                                                    +item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : item.nvme_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div
                                      style={{
                                        // marginLeft: "50px"
                                        position: "relative",
                                        left: "3rem",
                                      }}
                                    >
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "-35px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* <option value="hdd" selected>
                                              {item.hdd} GB HDD Disk
                                            </option>
                                            <option value="ssd" selected>
                                              {item.hdd} GB SSD Disk
                                            </option>
                                            <option value="nvme" selected>
                                              {item.hdd} GB NVMe Disk
                                            </option> */}
                                            {sHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {sSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {sNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <>
                              {sHdd &&
                                sHdd.map((item, idx) => (
                                  <div
                                    className="package"
                                    style={{ width: "350px" }}
                                  >
                                    <label
                                      className="custom-checkbox"
                                      onClick={() => {
                                        setSelectedCPU(item.cpu);
                                        setSelectedRAM(item.ram);
                                        setSelectedSSD(item.hdd);
                                        setSelectedDT(item.data_transfer);
                                        setFinalAmount(
                                          (item.hdd_rate * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate) *
                                            newMachineTime,
                                        );
                                        setDiscountRate(
                                          item[
                                            `discount_price_${newMachineTime}`
                                          ],
                                        );
                                        setMachineAmt(
                                          item.hdd_rate * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                        );
                                        setSelectedIdx(idx);
                                        setNewMachineConfigId(item.config_id);
                                      }}
                                    >
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              Standard
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.hdd_rate * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                            {/* ₹{" "}
                                            {item.hdd_rate * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate}{" "}
                                            / <span> Month </span> */}
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (diskType == "ssd"
                                                ? item.ssd_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate
                                                : diskType == "hdd"
                                                  ? item.hdd_rate * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate
                                                  : item.nvme_price * item.hdd +
                                                    item.cpu_rate * item.cpu +
                                                    item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div
                                      style={{
                                        // marginLeft: "50px"
                                        position: "relative",
                                        left: "3rem",
                                      }}
                                    >
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "-35px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* {item.hdd_stock === 0 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {item.ssd_stock === 0 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {item.NVMe_stock === 0 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )} */}
                                            {sHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {sSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {sNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          )}
                        </>
                      ) : activePage === "CPU Proactive" ? (
                        <>
                          {diskType == "ssd" ? (
                            <>
                              {cSsd &&
                                cSsd.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="package"
                                    style={{ width: "350px" }}
                                    onClick={() => {
                                      setSelectedCPU(item.cpu);
                                      setSelectedRAM(item.ram);
                                      setSelectedSSD(item.hdd);
                                      setSelectedDT(item.data_transfer);
                                      setFinalAmount(
                                        (item.ssd_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate) *
                                          newMachineTime,
                                      );
                                      setDiscountRate(
                                        item[
                                          `discount_price_${newMachineTime}`
                                        ],
                                      );
                                      setMachineAmt(
                                        item.ssd_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate,
                                      );
                                      setSelectedIdx(idx);
                                      setNewMachineConfigId(item.config_id);
                                    }}
                                  >
                                    <label className="custom-checkbox">
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              CPU Proactive
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.ssd_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div style={{ marginLeft: "50px" }}>
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "5px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* <option value="hdd" selected>
                                              {item.hdd} GB HDD Disk
                                            </option>
                                            <option value="ssd" selected>
                                              {item.hdd} GB SSD Disk
                                            </option>
                                            <option value="nvme" selected>
                                              {item.hdd} GB NVMe Disk
                                            </option> */}
                                            {cHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {cSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {cNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {cNvm &&
                                cNvm.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="package"
                                    style={{ width: "350px" }}
                                    onClick={() => {
                                      setSelectedCPU(item.cpu);
                                      setSelectedRAM(item.ram);
                                      setSelectedSSD(item.hdd);
                                      setSelectedDT(item.data_transfer);
                                      setFinalAmount(
                                        (item.nvme_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate) *
                                          newMachineTime,
                                      );
                                      setDiscountRate(
                                        item[
                                          `discount_price_${newMachineTime}`
                                        ],
                                      );
                                      setMachineAmt(
                                        // getPrice(item, diskType)
                                        item.nvme_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate,
                                      );
                                      setSelectedIdx(idx);
                                      setNewMachineConfigId(item.config_id);
                                    }}
                                  >
                                    <label className="custom-checkbox">
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              CPU Proactive
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.nvme_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div style={{ marginLeft: "50px" }}>
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "5px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* <option value="hdd" selected>
                                              {item.hdd} GB HDD Disk
                                            </option>
                                            <option value="ssd" selected>
                                              {item.hdd} GB SSD Disk
                                            </option>
                                            <option value="nvme" selected>
                                              {item.hdd} GB NVMe Disk
                                            </option> */}
                                            {cHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {cSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {cNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                          {/* {item.hdd} GB SSD Disk */}
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <>
                              {cHdd &&
                                cHdd.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="package"
                                    style={{ width: "350px" }}
                                    onClick={() => {
                                      setSelectedCPU(item.cpu);
                                      setSelectedRAM(item.ram);
                                      setSelectedSSD(item.hdd);
                                      setSelectedDT(item.data_transfer);
                                      setFinalAmount(
                                        (item.hdd_rate * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate) *
                                          newMachineTime,
                                      );
                                      setDiscountRate(
                                        item[
                                          `discount_price_${newMachineTime}`
                                        ],
                                      );
                                      setMachineAmt(
                                        item.hdd_rate * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate,
                                      );
                                      setSelectedIdx(idx);
                                      setNewMachineConfigId(item.config_id);
                                    }}
                                  >
                                    <label className="custom-checkbox">
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              CPU Proactive
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.hdd_rate * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div style={{ marginLeft: "50px" }}>
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "5px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* <option value="hdd" selected>
                                              {item.hdd} GB HDD Disk
                                            </option>
                                            <option value="ssd" selected>
                                              {item.hdd} GB SSD Disk
                                            </option>
                                            <option value="nvme" selected>
                                              {item.hdd} GB NVMe Disk
                                            </option> */}
                                            {cHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {cSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {cNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                          {/* {item.hdd} GB SSD Disk */}
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {diskType == "ssd" ? (
                            <>
                              {rSsd &&
                                rSsd.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="package"
                                    style={{ width: "350px" }}
                                    onClick={() => {
                                      setSelectedCPU(item.cpu);
                                      setSelectedRAM(item.ram);
                                      setSelectedSSD(item.hdd);
                                      setSelectedDT(item.data_transfer);
                                      setFinalAmount(
                                        (item.ssd_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate) *
                                          newMachineTime,
                                      );
                                      setDiscountRate(
                                        item[
                                          `discount_price_${newMachineTime}`
                                        ],
                                      );
                                      setMachineAmt(
                                        item.ssd_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate,
                                      );
                                      setSelectedIdx(idx);
                                      setNewMachineConfigId(item.config_id);
                                    }}
                                  >
                                    <label className="custom-checkbox">
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              RAM Proactive
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.ssd_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div style={{ marginLeft: "50px" }}>
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "5px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* <option value="hdd" selected>
                                              {item.hdd} GB HDD Disk
                                            </option>
                                            <option value="ssd" selected>
                                              {item.hdd} GB SSD Disk
                                            </option>
                                            <option value="nvme" selected>
                                              {item.hdd} GB NVMe Disk
                                            </option> */}
                                            {rHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {rSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {rNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                          {/* {item.hdd} GB SSD Disk */}
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {rNvm &&
                                rNvm.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="package"
                                    style={{ width: "350px" }}
                                    onClick={() => {
                                      setSelectedCPU(item.cpu);
                                      setSelectedRAM(item.ram);
                                      setSelectedSSD(item.hdd);
                                      setSelectedDT(item.data_transfer);
                                      setFinalAmount(
                                        (item.nvme_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate) *
                                          newMachineTime,
                                      );
                                      setDiscountRate(
                                        item[
                                          `discount_price_${newMachineTime}`
                                        ],
                                      );
                                      setMachineAmt(
                                        // getPrice(item, diskType)
                                        item.nvme_price * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate,
                                      );
                                      setSelectedIdx(idx);
                                      setNewMachineConfigId(item.config_id);
                                    }}
                                  >
                                    <label className="custom-checkbox">
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              RAM Proactive
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.nvme_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div style={{ marginLeft: "50px" }}>
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "5px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* <option value="hdd" selected>
                                              {item.hdd} GB HDD Disk
                                            </option>
                                            <option value="ssd" selected>
                                              {item.hdd} GB SSD Disk
                                            </option>
                                            <option value="nvme" selected>
                                              {item.hdd} GB NVMe Disk
                                            </option> */}
                                            {rHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {rSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {rNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                          {/* {item.hdd} GB SSD Disk */}
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Data Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <>
                              {rHdd &&
                                rHdd.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="package"
                                    style={{ width: "350px" }}
                                    onClick={() => {
                                      setSelectedCPU(item.cpu);
                                      setSelectedRAM(item.ram);
                                      setSelectedSSD(item.hdd);
                                      setSelectedDT(item.data_transfer);
                                      setFinalAmount(
                                        (item.hdd_rate * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate) *
                                          newMachineTime,
                                      );
                                      setDiscountRate(
                                        item[
                                          `discount_price_${newMachineTime}`
                                        ],
                                      );
                                      setMachineAmt(
                                        // getPrice(item, diskType)
                                        item.hdd_rate * item.hdd +
                                          item.cpu_rate * item.cpu +
                                          item.ram * item.ram_rate,
                                      );
                                      setSelectedIdx(idx);
                                      setNewMachineConfigId(item.config_id);
                                    }}
                                  >
                                    <label className="custom-checkbox">
                                      <span
                                        style={{
                                          marginTop: "35px",
                                          marginLeft: "27px",
                                          padding: "30px 30px 15px",
                                          borderRadius: "30px",
                                          display: "inline-block",
                                          width: "100%",
                                          padding: "15px 15px",
                                          fontSize: "22px",
                                          borderRadius: "35px",
                                          background:
                                            selectedIdx === idx
                                              ? "#035189"
                                              : "linear-gradient(180deg, #bfbfbf, #e5e5e5 50%)",

                                          color: "#000",
                                          cursor: "pointer",
                                          userSelect: "none",
                                          fontWeight: "bold",
                                          height: "12rem",
                                          boxShadow:
                                            "2px 2px 0px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div className="top-head see-white-text top-head-sub-style">
                                          <div
                                            className="media"
                                            onMouseEnter={() =>
                                              handleMouseEnter(idx)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <img
                                              className="normal"
                                              src="/images/admin/02-VM/title-bg-orange.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <img
                                              className="hover-img"
                                              src="/images/admin/02-VM/title-bg-white.svg"
                                              alt=""
                                              style={{ width: "20rem" }}
                                            />
                                            <span
                                              key={idx}
                                              className="login-text"
                                              style={{
                                                color:
                                                  hoverIndex === idx
                                                    ? "rgb(3, 81, 137)"
                                                    : "white",
                                                fontSize: "31px",
                                              }}
                                            >
                                              RAM Proactive
                                            </span>
                                          </div>
                                        </div>
                                        <div className="log-in">
                                          <a className="media-link"></a>
                                        </div>

                                        <div className="top-body theme-color-blue">
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                              marginTop: "15px",
                                            }}
                                          >
                                            {smuser &&
                                              appCurrency &&
                                              currencyReturn({
                                                price:
                                                  item.hdd_rate * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate,
                                                symbol: smuser.prefer_currency,
                                                rates: appCurrency,
                                              })}
                                            <span> Month </span>
                                          </div>
                                          <div
                                            className="price"
                                            style={{
                                              color:
                                                selectedIdx === idx
                                                  ? "#fff"
                                                  : "#545454",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              (item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) /
                                              appCurrency /
                                              30
                                            ).toFixed(2)}{" "}
                                            / <span>day</span>
                                          </div>
                                        </div>
                                      </span>
                                    </label>

                                    <div style={{ marginLeft: "50px" }}>
                                      <div className="media">
                                        <img
                                          className="normal"
                                          src={
                                            selectedIdx === idx
                                              ? "/images/admin/02-VM/orange-box-bg.svg"
                                              : "/images/admin/02-VM/gray-box-bg.svg"
                                          }
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                        <img
                                          className="hover-img"
                                          src="/images/admin/02-VM/orange-box-bg.svg"
                                          alt=""
                                          style={{ height: "17rem" }}
                                        />
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "-16rem",
                                          marginLeft: "5px",
                                          color: "#444",
                                        }}
                                      >
                                        <div
                                          className="cpu price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.cpu} vCPU
                                        </div>
                                        <div
                                          className="ram price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.ram} GB RAM
                                        </div>
                                        <div
                                          className="ssd price"
                                          data-value="40"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          <select
                                            name="plan_time"
                                            value={diskType}
                                            style={{
                                              borderRadius: "30px",
                                              // marginRight: "10px",
                                              padding: "5px 5px",
                                              border: "2px solid #e97730",
                                            }}
                                            onChange={(e) => {
                                              setSelectedCPU(0);
                                              setSelectedRAM(0);
                                              setSelectedSSD(0);
                                              setSelectedDT(null);
                                              setFinalAmount("0");
                                              setDiscountRate("0");
                                              setMachineAmt("0");
                                              setSelectedIdx(null);
                                              setNewMachineConfigId(null);
                                              setDisktype(e.target.value);
                                            }}
                                          >
                                            {/* <option value="hdd">
                                              {item.hdd} GB HDD Disk
                                            </option>
                                            <option value="ssd">
                                              {item.hdd} GB SSD Disk
                                            </option>
                                            <option value="nvme">
                                              {item.hdd} GB NVMe Disk
                                            </option> */}
                                            {rHddStocks[0].stocks == 1 && (
                                              <option value="hdd" selected>
                                                {item.hdd} GB HDD Disk
                                              </option>
                                            )}
                                            {rSsdStocks[0].stocks == 1 && (
                                              <option value="ssd" selected>
                                                {item.hdd} GB SSD Disk
                                              </option>
                                            )}
                                            {rNvmStocks[0].stocks == 1 && (
                                              <option value="nvme" selected>
                                                {item.hdd} GB NVMe Disk
                                              </option>
                                            )}
                                          </select>
                                          {/* {item.hdd} GB SSD Disk */}
                                        </div>
                                        <div
                                          className="data price"
                                          data-value="1"
                                          style={{
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            position: "relative",
                                            marginTop: "15px",
                                          }}
                                        >
                                          {item.data_transfer} TB Data Bandwidth
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Row>
        </>
      )}

      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
    </div>
  );
};

export default CreateMachine;
