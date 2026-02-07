import React, { useEffect, useRef, useState } from "react";
import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";
import "./CreateMachine.css";
import RangeSlider from "../common/RangeSlider";
import instance, {
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "../../Api";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";

const EditMachine = (props) => {
  const location = useLocation();
  const { isMobile } = props;
  const { smuser, appCurrency } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);

  const [customCPU, setCustomCPU] = useState(0);
  const [customRAM, setCustomRAM] = useState(0);
  const [customDISK, setCustomDISK] = useState(0);
  const [customDATAT, setCustomDATAT] = useState(0);
  const [diskType, setDisktype] = useState("ssd");

  const [sHdd, setSHdd] = useState(null);
  const [sSsd, setSSsd] = useState(null);
  const [sNvm, setSNvm] = useState(null);

  const [cHdd, setCHdd] = useState(null);
  const [cSsd, setCSsd] = useState(null);
  const [cNvm, setCNvm] = useState(null);

  const [rHdd, setRHdd] = useState(null);
  const [rSsd, setRSsd] = useState(null);
  const [rNvm, setRNvm] = useState(null);

  const [stdCusHDD, setStdCusHDD] = useState({});
  const [stdCusSSD, setStdCusSSD] = useState({});
  const [stdCusNVM, setStdCusNVM] = useState({});

  const [cpuCusHDD, setCpuCusHDD] = useState({});
  const [cpuCusSSD, setCpuCusSSD] = useState({});
  const [cpuCusNVM, setCpuCusNVM] = useState({});

  const [ramCusHDD, setRamCusHDD] = useState({});
  const [ramCusSSD, setRamCusSSD] = useState({});
  const [ramCusNVM, setRamCusNVM] = useState({});

  const machineData = location.state ? location.state.machineData : null;
  const editType = location.state ? location.state.editType : null;
  // console.log(editType, "<<<editType");
  // console.log(machineData, "<<<machineData");
  const topButtons = ["0 CPU", "0 GB RAM", "0 GB SSD Disk", "0 TB Bandwidth"];
  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };
  const handleMouseLeave = () => {
    setHoverIndex(null);
  };
  const innerButtons = ["Standard", "CPU Proactive", "RAM Proactive"];

  const [selectedCPU, setSelectedCPU] = useState(0);
  const [selectedRAM, setSelectedRAM] = useState(0);
  const [selectedSSD, setSelectedSSD] = useState(0);
  const [selectedDT, setSelectedDT] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);
  const [diskSpace, setDiskSpace] = useState(0);
  const [dataTran, setDataTran] = useState(0);

  const [activeButton, setActiveButton] = useState("Standard");
  const [activePage, setActivePage] = useState(null);
  const [finalAmount, setFinalAmount] = useState("0");
  const [machineAmt, setMachineAmt] = useState("0");
  const [nativePages, setNativePages] = useState([]);
  // const NatisvePages = [
  //   "Standard",
  //   "CPU Proactive",
  //   "RAM Proactive",
  //   "Custom Configure",
  // ];

  const CloudPages = ["Standard", "CPU Proactive", "RAM Proactive"];

  const [values, setValues] = React.useState([cpu, ram, diskSpace, dataTran]);
  const [currentMachine, setCurrentMachine] = useState(null);
  // const [ubantuOS, setUbantuOS] = useState[];
  // const [fedoraOS, setfedoraOS] = useState[];
  // native =0 , cloud =1
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

  // Create Machine
  const [configPlan, setConfigPlan] = useState(null);
  const [newMachineName, setNewMachineName] = useState(null);
  const [newMahineOs, setNewMachineOs] = useState(null);
  const [updateMahineOs, setUpdateMachineOs] = useState(null);
  const [newMahineConfigId, setNewMachineConfigId] = useState(null);
  const [newMachineTime, setNewMachineTime] = useState("1");
  const [currentOSName, setCurrentOSName] = useState("");
  const [currentVM, setCurrentVM] = useState(null);
  const [oldMachineVal, setOldMachineVal] = useState(null);
  const [vmCat, setVmCat] = useState(null);
  const [discountRate, setDiscountRate] = useState("0");
  const [serverLocation, setServerLocation] = useState(null);
  const [vm_Type, setVMType] = useState("0");

  useEffect(() => {
    //console.log(machineData, "--------------machineData");
    if (smuser) {
      GetEditMachine();
      setPlatformSelected(smuser.platform_status);
    }
  }, [smuser]);

  const handleSliderChange = (index) => (event) => {
    const newValues = [...values];
    newValues[index] = parseInt(event.target.value, 10);
    setValues(newValues);
  };

  const UpdateMachine_Li = async () => {
    setLoading(true);
    var payload = {};
    var amount = 0;
    var finAmt = 0;

    if (activePage === "Custom Configure") {
      function calculateAmount(cpuRate, ramRate, diskPrice) {
        const baseAmount =
          customCPU * cpuRate +
          customRAM * ramRate +
          customDISK * diskPrice +
          customDATAT * 1;

        const discount = (baseAmount * discountRate) / 100;
        return baseAmount - discount;
      }

      if (configPlan === 1 || configPlan === 5 || configPlan === 6) {
        amount =
          diskType === "ssd"
            ? calculateAmount(
                stdCusSSD.cpu_rate,
                stdCusSSD.ram_rate,
                stdCusSSD.ssd_price
              )
            : diskType === "nvme"
            ? calculateAmount(
                stdCusNVM.cpu_rate,
                stdCusNVM.ram_rate,
                stdCusNVM.nvme_price
              )
            : calculateAmount(
                stdCusHDD.cpu_rate,
                stdCusHDD.ram_rate,
                stdCusHDD.hdd_rate
              );
      } else if (configPlan === 3 || configPlan === 7 || configPlan === 8) {
        amount =
          diskType === "ssd"
            ? calculateAmount(
                cpuCusSSD.cpu_rate,
                cpuCusSSD.ram_rate,
                cpuCusSSD.ssd_price
              )
            : diskType === "nvme"
            ? calculateAmount(
                cpuCusNVM.cpu_rate,
                cpuCusNVM.ram_rate,
                cpuCusNVM.nvme_price
              )
            : calculateAmount(
                cpuCusHDD.cpu_rate,
                cpuCusHDD.ram_rate,
                cpuCusHDD.hdd_rate
              );
      } else if (configPlan === 4 || configPlan === 9 || configPlan === 10) {
        amount =
          diskType === "ssd"
            ? calculateAmount(
                ramCusSSD.cpu_rate,
                ramCusSSD.ram_rate,
                ramCusSSD.ssd_price
              )
            : diskType === "nvme"
            ? calculateAmount(
                ramCusNVM.cpu_rate,
                ramCusNVM.ram_rate,
                ramCusNVM.nvme_price
              )
            : calculateAmount(
                ramCusHDD.cpu_rate,
                ramCusHDD.ram_rate,
                ramCusHDD.hdd_rate
              );
      }
    } else {
      finAmt = finalAmount - (finalAmount * discountRate) / 100;
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
    } else {
      if (activePage === "Custom Configure") {
        payload = {
          vm_cat: vmCat,
          vm_id: machineData,
          config: newMahineConfigId,
          name: newMachineName,
          machine_val: isMobile
            ? newMahineOs
            : editType === "os"
            ? updateMahineOs
            : newMahineOs, //drop down id
          machine_price: editType === "os" ? "0" : amount,
          plan_time: newMachineTime, //1
          user_id: smuser.id,
          flag: "0",
          sub_config_type: configPlan,
          cpue: customCPU,
          rame: customRAM,
          hdde: customDISK, // selectedSSD, //customDISK,
          data_transfer: customDATAT,
        };
      } else {
        payload = {
          flag: newMahineConfigId === null && "0",
          sub_config_type: configPlan,
          vm_cat: vmCat,
          vm_id: machineData,
          config: newMahineConfigId,
          name: newMachineName,
          machine_val: isMobile
            ? newMahineOs
            : editType === "os"
            ? updateMahineOs
            : oldMachineVal, //drop down id
          machine_price: editType === "os" ? "0" : finAmt,
          plan_time: newMachineTime, //1
          user_id: smuser.id,
          cpue: selectedCPU,
          rame: selectedRAM,
          hdde: selectedSSD,
          data_transfer: selectedDT,
        };
      }
    }
    console.log(payload, "UpdateMachine_Li");

    try {
      // First API call to encrypt the request
      const encryptedResponse = await apiEncryptRequest(payload);
      //console.log(encryptedResponse, "=encryptedResponse");

      // Second API call to login with encrypted response
      const createMachineRes = await instance.post(
        "/vm/update",
        encryptedResponse
      );
      //console.log(createMachineRes.data, "====update");

      // Third API call to decrypt the login response
      const finalResponse = await decryptData(createMachineRes.data);
      const Details = finalResponse;
      console.log(Details, "==!==!==update");
      if (Details.status) {
        window.location.href = "/vm-machine";
      } else {
        window.location.href = "/vm-machine";
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const GetEditMachine = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: machineData,
    };
    try {
      // First API call to encrypt the request
      const encryptedResponse = await apiEncryptRequest(payload);
      //console.log(encryptedResponse, "=encryptedResponse");

      // Second API call to login with encrypted response
      const loginUserResponse = await instance.post(
        "/vm/edit",
        encryptedResponse
      );
      //console.log(loginUserResponse.data, "====GetEditMachine");

      // Third API call to decrypt the login response
      const loginResponse = await decryptData(loginUserResponse.data);
      console.log(loginResponse, "/vm/edit");

      const oldVM = loginResponse.vm;
      setCurrentVM(oldVM);
      setCustomCPU(oldVM.cpu);
      setCustomRAM(oldVM.ram / 1024);
      // setCustomDISK(oldVM.hard_disk);
      if (oldVM.disk_type == "ssd") {
        setSelectedSSD(oldVM.ssd);
      } else if (oldVM.disk_type == "hdd") {
        setSelectedSSD(oldVM.hard_disk);
      } else {
        setSelectedSSD(oldVM.nvme);
      }
      setCustomDATAT(oldVM.data_transfer);
      console.log(oldVM, "oldVM");

      const userDetails = loginResponse;
      // const configData = userDetails.config;
      const OSID = loginResponse.edit_template.uuid;
      setOldMachineVal(OSID);
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

      // const standardRates = userDetails.ratedata1;
      // const cpuProactiveRates = userDetails.ratedata3;
      // const ramProactiveRates = userDetails.ratedata4;

      // setStandardRates(standardRates);
      // setCpuProactiveRates(cpuProactiveRates);
      // setRamProactiveRates(ramProactiveRates);
      const ConfigPlan = userDetails.vm.vm_config_category;
      const disk_type = userDetails.vm.disk_type;
      setDisktype(disk_type);
      // console.log(disk_type, "disk_type");
      const configHDD = userDetails.vm.hard_disk;
      // const congifID =
      //   configHDD === 25
      //     ? "37"
      //     : configHDD === 50
      //     ? "38"
      //     : configHDD === 80
      //     ? "39"
      //     : configHDD === 160
      //     ? "40"
      //     : configHDD === 320
      //     ? "41"
      //     : configHDD === 640
      //     ? "42"
      //     : "37";
      setConfigPlan(ConfigPlan);
      setNativePages(
        ConfigPlan == 1
          ? [
              oldVM.vm_type == 1 ? "Portgate Standard" : "Cloud Standard",
              "Custom Configure",
            ]
          : ConfigPlan == 5
          ? [
              oldVM.vm_type == 1 ? "Portgate Standard" : "Cloud Standard",
              ,
              "Custom Configure",
            ]
          : ConfigPlan == 6
          ? [
              oldVM.vm_type == 1 ? "Portgate Standard" : "Cloud Standard",
              ,
              "Custom Configure",
            ]
          : ConfigPlan == 3
          ? [
              oldVM.vm_type == 1 ? "Portgate CPU Proactive" : "Cloud CPU Proactive",
              "Custom Configure",
            ]
          : ConfigPlan == 7
          ? [
              oldVM.vm_type == 1 ? "Portgate CPU Proactive" : "Cloud CPU Proactive",
              ,
              "Custom Configure",
            ]
          : ConfigPlan == 8
          ? [
              oldVM.vm_type == 1 ? "Portgate CPU Proactive" : "Cloud CPU Proactive",
              ,
              "Custom Configure",
            ]
          : [
              oldVM.vm_type == 1 ? "Portgate RAM Proactive" : "Cloud RAM Proactive",
              "Custom Configure",
            ]
      );
      setVMType(oldVM.vm_type);
      setActivePage(
        ConfigPlan === 1 || ConfigPlan === 5 || ConfigPlan === 6
          ? oldVM.vm_type === 1
            ? "Portgate Standard"
            : "Cloud Standard"
          : ConfigPlan === 3 || ConfigPlan === 7 || ConfigPlan === 8
          ? oldVM.vm_type === 1
            ? "Portgate CPU Proactive."
            : "Cloud CPU Proactive"
          : oldVM.vm_type === 1
          ? "Portgate RAM Proactive"
          : "Cloud RAM Proactive"
      );
      
      setNewMachineOs(OSID);
      const moniters_machine = loginResponse.mergedData;

      const vmArray = Object.keys(moniters_machine).map(
        (key) => moniters_machine[key]
      );
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
      if (disk_type == "hdd" && ConfigPlan == 1) {
        setStandardList(standardList);
      } else if (disk_type == "ssd" && ConfigPlan == 5) {
        setStandardList(stdSsd);
      } else if (disk_type == "nvme" && ConfigPlan == 6) {
        setStandardList(stdNvm);
      }

      if (disk_type == "hdd" && ConfigPlan == 3) {
        setCPUList(cpuList);
      } else if (disk_type == "ssd" && ConfigPlan == 7) {
        setCPUList(cpuSsd);
      } else if (disk_type == "nvme" && ConfigPlan == 8) {
        setCPUList(cpuNvm);
      }

      if (disk_type == "hdd" && ConfigPlan == 4) {
        setRamList(ramList);
      } else if (disk_type == "ssd" && ConfigPlan == 9) {
        setRamList(ramList);
      } else if (disk_type == "nvme" && ConfigPlan == 10) {
        setRamList(ramList);
      }

      setSSsd(stdSsd);
      setSHdd(stdHdd);
      setSNvm(stdNvm);

      setCSsd(cpuSsd);
      setCHdd(cpuHdd);
      setCNvm(cpuNvm);

      setRSsd(ramSsd);
      setRHdd(ramHdd);
      setRNvm(ramNvm);

      const osTemps = loginResponse.osTemp;

      if (osTemps["CentOS_fa-centos"]) {
        setCentOS_fa(osTemps["CentOS_fa-centos"]);
      }
      if (osTemps["Windows_fa-windows"]) {
        setWindows_fa(osTemps["Windows_fa-windows"]);
      }
      if (osTemps["Ubuntu_fa-ubuntu"]) {
        setUbuntu_fa(osTemps["Ubuntu_fa-ubuntu"]);
      }
      if (osTemps["Redhat_fa-redhat"]) {
        setRedhat_fa(osTemps["Redhat_fa-redhat"]);
      }

      if (osTemps["Debian_fa-debian"]) {
        setDebian_fa(osTemps["Debian_fa-debian"]);
      }
      if (osTemps["Fedora_fa-fedora"]) {
        setFedora_fa(osTemps["Fedora_fa-fedora"]);
      }
      if (osTemps["Rocky_fa-rokcy"]) {
        setRocky_fa(osTemps["Rocky_fa-rokcy"]);
      }

      const currentOS = ubuntu_fa.some((obj) =>
        Object.values(obj).includes(newMahineOs)
      )
        ? "Ubantu"
        : windows_fa.some((obj) => Object.values(obj).includes(newMahineOs))
        ? "Windows"
        : centOS_fa.some((obj) => Object.values(obj).includes(newMahineOs))
        ? "CentOS"
        : "Redhat";

      setCurrentOSName(currentOS);
      // console.log(currentOS);

      const vm = loginResponse.vm;
      console.log(vm, "VM");
      setVmCat(vm.vm_config_category);
      setCurrentMachine(vm);
      setSelectedCPU(vm.cpu);
      setSelectedRAM(vm.ram / 1024);
      if (vm.disk_type == "ssd") {
        setSelectedSSD(vm.ssd);
      } else if (vm.disk_type == "hdd") {
        setSelectedSSD(vm.hard_disk);
      } else {
        setSelectedSSD(vm.nvme);
      }
      setSelectedDT(vm.data_transfer);
      setNewMachineName(vm.vm_name);
      setNewMachineTime(vm.plan_time);
      setFinalAmount(vm.machine_o_rate);
      setNewMachineConfigId(vm.vm_config_type);

      const location = loginResponse.location;
      setServerLocation(location.server_location);
      //console.log(vm, "==!==!==moniters_machine");

      if (selectedIdx === null) {
        setFinalAmount(0);
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const calculateOriginalPrice = (cpuRate, ramRate, diskPrice) => {
    return (
      customCPU * cpuRate +
      customRAM * ramRate +
      customDISK * diskPrice +
      customDATAT * 1
    );
  };
  const calculatePrice = (
    cpuRate,
    ramRate,
    diskPrice,
    discountRate,
    timeMultiplier
  ) => {
    const basePrice =
      customCPU * cpuRate +
      customRAM * ramRate +
      customDISK * diskPrice +
      customDATAT * 1;
    const discount = (basePrice * discountRate) / 100;
    // console.log((basePrice * discountRate) / 100, "ppp");
    return basePrice - discount;
  };

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

  return (
    <div style={{ minHeight: "55rem" }}>
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
      {isMobile ? (
        <>
          <div
            className="heading-dotted-bill"
            style={{
              position: "relative",
              top: editType === "os" ? "5rem" : "5rem",
            }}
          >
            Edit Machine {editType === "os" ? "OS" : "Config"}
          </div>

          {editType === "os" ? (
            <>
              <button
                style={{
                  zIndex: "9",
                  position: "absolute",
                  marginTop: "20%",
                  right: "10px",
                  fontWeight: "700",
                  color: "white",
                  height: "45px",
                  fontSize: "17px",
                  // width: "10rem",
                  backgroundColor: "#e97730",
                  outline: "4px solid #e97730",
                  border: "4px solid #ffff",
                  borderColor: "white",
                  borderRadius: "30px",
                }}
                onClick={() => UpdateMachine_Li()}
              >
                {" "}
                Update Machine OS
              </button>
              <div
                className="scrollable-container"
                style={{
                  marginTop: "3rem",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
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
                        value={newMahineOs}
                        onChange={(e) => {
                          setUpdateMachineOs(e.target.value);
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
                        value={newMahineOs}
                        onChange={(e) => {
                          setUpdateMachineOs(e.target.value);
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
                          border: "2px solid #E97730",
                          borderRadius: "50%",
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

                    {/* <div
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
                        Windows
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
                          ////console.log(e.target.value);
                        }}
                      >
                        <option value="Select" selected>
                          Select
                        </option>
                        {windows_fa &&
                          windows_fa.map((item, index) => (
                            <option key={index} value={Object.values(item)[0]}>
                              {Object.keys(item)[0]}
                            </option>
                          ))}
                      </select>
                    </div> */}

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
                        }}
                        value={newMahineOs}
                        onChange={(e) => {
                          setNewMachineOs(e.target.value);
                          ////console.log(e.target.value);
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
                          ////console.log(e.target.value);
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
                          ////console.log(e.target.value);
                        }}
                      >
                        <option value="Select" selected>
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
                        marginBottom: "2rem",
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
                          ////console.log(e.target.value);
                        }}
                      >
                        <option value="Select" selected>
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
                    {/* <div
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
                        <option value="Select" selected>
                          Select
                        </option>
                        {redhat_fa &&
                          redhat_fa.map((item, index) => (
                            <option key={index} value={Object.values(item)[0]}>
                              {Object.keys(item)[0]}
                            </option>
                          ))}
                      </select>
                    </div> */}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: "3rem", marginBottom: "75px" }}>
                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    height: "3rem",
                    justifyContent: "space-around",
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
                    value={newMachineTime}
                    onChange={(e) => {
                      setFinalAmount(machineAmt * e.target.value);
                      setNewMachineTime(e.target.value);

                      activePage === "Custom Configure" ? (
                        determineDiscountRate(
                          configPlan,
                          diskType,
                          e.target.value
                        )
                      ) : activePage === "Cloud Standard" ||
                        activePage === "RAW Standard" ? (
                        <>
                          {diskType == "ssd" ? (
                            <>
                              {sSsd &&
                                sSsd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`]
                                  )
                                )}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {sNvm &&
                                sNvm.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`]
                                  )
                                )}
                            </>
                          ) : (
                            <>
                              {sHdd &&
                                sHdd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`]
                                  )
                                )}
                            </>
                          )}
                        </>
                      ) : activePage === "Progate CPU Proactive" ||
                        activePage === "Cloud CPU Proactive" ? (
                        <>
                          {diskType == "ssd" ? (
                            <>
                              {cSsd &&
                                cSsd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`]
                                  )
                                )}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {cNvm &&
                                cNvm.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`]
                                  )
                                )}
                            </>
                          ) : (
                            <>
                              {cHdd &&
                                cHdd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`]
                                  )
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
                                    item[`discount_price_${e.target.value}`]
                                  )
                                )}
                            </>
                          ) : diskType == "nvme" ? (
                            <>
                              {rNvm &&
                                rNvm.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`]
                                  )
                                )}
                            </>
                          ) : (
                            <>
                              {rHdd &&
                                rHdd.map((item, idx) =>
                                  setDiscountRate(
                                    item[`discount_price_${e.target.value}`]
                                  )
                                )}
                            </>
                          )}
                        </>
                      );
                    }}
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Month</option>
                    <option value="6">6 Month</option>
                    <option value="9">9 Month</option>
                    <option value="12">1 Year</option>
                    <option value="24">2 Years</option>
                  </select>
                  <div
                    className="input-container"
                    style={{
                      border: "2px solid #e97730",
                      width: "6rem",
                      height: "35px",
                      marginTop: "0px",
                    }}
                  >
                    <input
                      type="text"
                      //name="CompanyName"
                      className="input-signup"
                      placeholder="Location"
                      disabled="true"
                      value={serverLocation}
                      style={{
                        color: "black",
                        textAlign: "center",
                        fontSize: "15px",
                        width: "10px",
                      }}
                      // onChange={(e) => setNewMachineName(e.target.value)}
                    />
                  </div>
                  <div
                    className="input-container"
                    style={{
                      //marginLeft: "5px",
                      height: "35px",
                      border: "2px solid #e97730",
                      width: "6rem",
                      marginTop: "0px",
                    }}
                  >
                    <input
                      type="text"
                      name="machineName"
                      className="input-signup"
                      placeholder="MachineName"
                      value={newMachineName}
                      style={{
                        width: "3rem",
                        color: "black",
                        fontSize: "15px",
                      }}
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
                        style={{ marginBottom: "10px", marginLeft: "15px" }}
                      >
                        <div className="price-old">
                          {(() => {
                            let discount;

                            if (
                              configPlan === 1 ||
                              configPlan === 5 ||
                              configPlan === 6
                            ) {
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
                            } else if (
                              configPlan === 3 ||
                              configPlan === 7 ||
                              configPlan === 8
                            ) {
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
                                    fontSize: "18px",
                                    marginRight: "10px",
                                  }}
                                >
                                  {configPlan === 1 &&
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
                                              stdCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              stdCusNVM.cpu_rate,
                                              stdCusNVM.ram_rate,
                                              stdCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              stdCusHDD.cpu_rate,
                                              stdCusHDD.ram_rate,
                                              stdCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}
                                  {configPlan === 5 &&
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
                                              stdCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              stdCusNVM.cpu_rate,
                                              stdCusNVM.ram_rate,
                                              stdCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              stdCusHDD.cpu_rate,
                                              stdCusHDD.ram_rate,
                                              stdCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}
                                  {configPlan === 6 &&
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
                                              stdCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              stdCusNVM.cpu_rate,
                                              stdCusNVM.ram_rate,
                                              stdCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              stdCusHDD.cpu_rate,
                                              stdCusHDD.ram_rate,
                                              stdCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}

                                  {configPlan === 3 &&
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
                                              cpuCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              cpuCusNVM.cpu_rate,
                                              cpuCusNVM.ram_rate,
                                              cpuCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              cpuCusHDD.cpu_rate,
                                              cpuCusHDD.ram_rate,
                                              cpuCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}
                                  {configPlan === 7 &&
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
                                              cpuCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              cpuCusNVM.cpu_rate,
                                              cpuCusNVM.ram_rate,
                                              cpuCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              cpuCusHDD.cpu_rate,
                                              cpuCusHDD.ram_rate,
                                              cpuCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}
                                  {configPlan === 8 &&
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
                                              cpuCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              cpuCusNVM.cpu_rate,
                                              cpuCusNVM.ram_rate,
                                              cpuCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              cpuCusHDD.cpu_rate,
                                              cpuCusHDD.ram_rate,
                                              cpuCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}

                                  {configPlan === 4 &&
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
                                              ramCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              ramCusNVM.cpu_rate,
                                              ramCusNVM.ram_rate,
                                              ramCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              ramCusHDD.cpu_rate,
                                              ramCusHDD.ram_rate,
                                              ramCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}
                                  {configPlan === 9 &&
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
                                              ramCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              ramCusNVM.cpu_rate,
                                              ramCusNVM.ram_rate,
                                              ramCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              ramCusHDD.cpu_rate,
                                              ramCusHDD.ram_rate,
                                              ramCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}
                                  {configPlan === 10 &&
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
                                              ramCusSSD.ssd_price
                                            )
                                          : diskType === "nvme"
                                          ? calculateOriginalPrice(
                                              ramCusNVM.cpu_rate,
                                              ramCusNVM.ram_rate,
                                              ramCusNVM.nvme_price
                                            )
                                          : calculateOriginalPrice(
                                              ramCusHDD.cpu_rate,
                                              ramCusHDD.ram_rate,
                                              ramCusHDD.hdd_rate
                                            ),
                                      symbol: smuser.prefer_currency,
                                      rates: appCurrency,
                                    })}
                                </span>
                              );
                            }

                            return null; // Return null if discount is not greater than 0
                          })()}

                          {configPlan === 1 &&
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
                                      1
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      stdCusNVM.cpu_rate,
                                      stdCusNVM.ram_rate,
                                      stdCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      stdCusHDD.cpu_rate,
                                      stdCusHDD.ram_rate,
                                      stdCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                          {configPlan === 5 &&
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
                                      1
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      stdCusNVM.cpu_rate,
                                      stdCusNVM.ram_rate,
                                      stdCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      stdCusHDD.cpu_rate,
                                      stdCusHDD.ram_rate,
                                      stdCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                          {configPlan === 6 &&
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
                                      1
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      stdCusNVM.cpu_rate,
                                      stdCusNVM.ram_rate,
                                      stdCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      stdCusHDD.cpu_rate,
                                      stdCusHDD.ram_rate,
                                      stdCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}

                          {configPlan === 3 &&
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
                                      newMachineTime
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      cpuCusNVM.cpu_rate,
                                      cpuCusNVM.ram_rate,
                                      cpuCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      cpuCusHDD.cpu_rate,
                                      cpuCusHDD.ram_rate,
                                      cpuCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                          {configPlan === 7 &&
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
                                      newMachineTime
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      cpuCusNVM.cpu_rate,
                                      cpuCusNVM.ram_rate,
                                      cpuCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      cpuCusHDD.cpu_rate,
                                      cpuCusHDD.ram_rate,
                                      cpuCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                          {configPlan === 8 &&
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
                                      newMachineTime
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      cpuCusNVM.cpu_rate,
                                      cpuCusNVM.ram_rate,
                                      cpuCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      cpuCusHDD.cpu_rate,
                                      cpuCusHDD.ram_rate,
                                      cpuCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}

                          {configPlan === 4 &&
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
                                      newMachineTime
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      ramCusNVM.cpu_rate,
                                      ramCusNVM.ram_rate,
                                      ramCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      ramCusHDD.cpu_rate,
                                      ramCusHDD.ram_rate,
                                      ramCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                          {configPlan === 9 &&
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
                                      newMachineTime
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      ramCusNVM.cpu_rate,
                                      ramCusNVM.ram_rate,
                                      ramCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      ramCusHDD.cpu_rate,
                                      ramCusHDD.ram_rate,
                                      ramCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                          {configPlan === 10 &&
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
                                      newMachineTime
                                    )
                                  : diskType === "nvme"
                                  ? calculatePrice(
                                      ramCusNVM.cpu_rate,
                                      ramCusNVM.ram_rate,
                                      ramCusNVM.nvme_price,
                                      discountRate || 0,
                                      newMachineTime
                                    )
                                  : calculatePrice(
                                      ramCusHDD.cpu_rate,
                                      ramCusHDD.ram_rate,
                                      ramCusHDD.hdd_rate,
                                      discountRate || 0,
                                      newMachineTime
                                    ),
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })}
                        </div>

                        {(() => {
                          let discount;

                          if (
                            configPlan === 1 ||
                            configPlan === 5 ||
                            configPlan === 6
                          ) {
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
                          } else if (
                            configPlan === 3 ||
                            configPlan === 7 ||
                            configPlan === 8
                          ) {
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
                              // <div className="price-new">
                              //   <span style={{ zIndex: "9" }}>
                              //     {configPlan === 1 ||
                              //     configPlan === 5 ||
                              //     configPlan === 6
                              //       ? diskType === "ssd"
                              //         ? `${
                              //             stdCusSSD[
                              //               `discount_price_${newMachineTime}`
                              //             ]
                              //           } % OFF`
                              //         : diskType === "nvme"
                              //         ? `${
                              //             stdCusNVM[
                              //               `discount_price_${newMachineTime}`
                              //             ]
                              //           } % OFF`
                              //         : `${
                              //             stdCusHDD[
                              //               `discount_price_${newMachineTime}`
                              //             ]
                              //           } % OFF`
                              //       : configPlan === 3 ||
                              //         configPlan === 7 ||
                              //         configPlan === 8
                              //       ? diskType === "ssd"
                              //         ? `${
                              //             cpuCusSSD[
                              //               `discount_price_${newMachineTime}`
                              //             ]
                              //           } % OFF`
                              //         : diskType === "nvme"
                              //         ? `${
                              //             cpuCusNVM[
                              //               `discount_price_${newMachineTime}`
                              //             ]
                              //           } % OFF`
                              //         : `${
                              //             cpuCusHDD[
                              //               `discount_price_${newMachineTime}`
                              //             ]
                              //           } % OFF`
                              //       : diskType === "ssd"
                              //       ? `${
                              //           ramCusSSD[
                              //             `discount_price_${newMachineTime}`
                              //           ]
                              //         } % OFF`
                              //       : diskType === "nvme"
                              //       ? `${
                              //           ramCusNVM[
                              //             `discount_price_${newMachineTime}`
                              //           ]
                              //         } % OFF`
                              //       : `${
                              //           ramCusHDD[
                              //             `discount_price_${newMachineTime}`
                              //           ]
                              //         } % OFF`}
                              //   </span>
                              // </div>
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
                      {smuser && appCurrency && (
                        <div
                          className="price-container"
                          style={{ marginBottom: "10px", marginLeft: "15px" }}
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
                                      finalAmount -
                                      (finalAmount * discountRate) / 100,
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
                            discountRate && (
                              <div
                                className="price-new"
                                style={{ marginLeft: "10px" }}
                              >
                                {finalAmount !== 0 && (
                                  <span
                                    style={{ zIndex: "9", fontSize: "20px" }}
                                  >
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

                <div className="buttons-container" style={{ padding: "10px" }}>
                  {activePage === "Custom Configure" ? (
                    <>
                      <Button className="mobile-top-buttons-creact-machine">
                        {customCPU} CPU
                      </Button>
                      <Button className="mobile-top-buttons-creact-machine">
                        {customRAM} GB RAM
                      </Button>
                      <Button className="mobile-top-buttons-creact-machine">
                        {customDISK} GB {diskType.toUpperCase()} Disk
                      </Button>
                      <Button className="mobile-top-buttons-creact-machine">
                        {customDATAT} TB Bandwidth
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="mobile-top-buttons-creact-machine">
                        {selectedCPU} CPU
                      </Button>
                      <Button className="mobile-top-buttons-creact-machine">
                        {selectedRAM} GB RAM
                      </Button>
                      <Button className="mobile-top-buttons-creact-machine">
                        {selectedSSD} GB {diskType.toUpperCase()} Disk
                      </Button>
                      <Button className="mobile-top-buttons-creact-machine">
                        {selectedDT} TB Bandwidth
                      </Button>
                    </>
                  )}

                  <a
                    onClick={() => UpdateMachine_Li()}
                    className="underline-text"
                    style={{
                      marginTop: "5px",
                      marginLeft: "10px",
                      fontSize: "16px",
                      color: "#035189",
                      fontWeight: "600",
                    }}
                  >
                    Update Machine
                  </a>
                </div>
                <div style={{ display: "flex" }}>
                  {/* Standard */}
                  {(configPlan === 1 ||
                    configPlan === 5 ||
                    configPlan === 6) && (
                    <div
                      className={`${
                        activePage === "Standard"
                          ? "active-mobile-vm"
                          : "non-active-mobile-vm"
                      }`}
                      onClick={() => {
                        setActivePage(
                          vm_Type === 1 ? "Cloud Standard" : "RAW Standard"
                        );
                        setSelectedIdx(null);
                        setFinalAmount(0);
                      }}
                    >
                      Standard
                    </div>
                  )}

                  {/* CPU Proactive */}
                  {(configPlan === 3 ||
                    configPlan === 7 ||
                    configPlan === 8) && (
                    <div
                      className={`${
                        activePage === "CPU Proactive"
                          ? "active-mobile-vm"
                          : "non-active-mobile-vm"
                      }`}
                      style={{ marginLeft: "90px" }}
                      onClick={() => {
                        setActivePage(
                          vm_Type === 1 ? "Portgate CPU Proactive" : "Cloud CPU Proactive"
                        );
                        setSelectedIdx(null);
                        setFinalAmount(0);
                      }}
                    >
                      CPU Proactive
                    </div>
                  )}

                  {/* RAM Proactive */}
                  {(configPlan === 4 ||
                    configPlan === 9 ||
                    configPlan === 10) && (
                    <div
                      className={`${
                        activePage === "RAM Proactive"
                          ? "active-mobile-vm"
                          : "non-active-mobile-vm"
                      }`}
                      style={{ marginLeft: "180px" }}
                      onClick={() => {
                        setActivePage(
                          vm_Type === 1 ? "Portgate RAM Proactive" : "Cloud RAM Proactive"
                        );
                        setSelectedIdx(null);
                        setFinalAmount(0);
                      }}
                    >
                      RAM Proactive
                    </div>
                  )}

                  {/* Custom Configure */}
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
                      setFinalAmount(0);
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
                        <Button
                          style={{
                            background: "#f47c20",
                            border: "none",
                            fontSize: "11px",
                            padding: "5px 15px",
                            color: "#fff",
                            fontWeight: "600",
                            borderRadius: "5px",
                            marginBottom: "10px",
                          }}
                        >
                          {configPlan == 1
                            ? "Standard"
                            : configPlan == 5
                            ? "Standard"
                            : configPlan == 6
                            ? "Standard"
                            : configPlan == 3
                            ? "CPU Proactive"
                            : configPlan == 7
                            ? "CPU Proactive"
                            : configPlan == 8
                            ? "CPU Proactive"
                            : "RAM Proactive"}
                        </Button>
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
                          CPU
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
                        <h6
                          style={{
                            width: "25%",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: "700",
                          }}
                        >
                          DISK SPACE
                        </h6>
                        <h6
                          style={{
                            width: "25%",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: "700",
                          }}
                        >
                          BANDWIDTH
                        </h6>
                      </div>
                      <div
                        style={{
                          marginLeft: "-24rem",
                          marginTop: "20rem",
                          position: "absolute",
                        }}
                      >
                        {/* CPU */}
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
                            {customCPU}
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="200"
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
                                (customCPU * 100) / 200
                              }%, #ddd ${(customCPU * 100) / 200}%)`,
                            }}
                          />
                        </div>
                        {/* RAM */}
                        <div className="range-slider-vrt">
                          <div
                            className="tooltip-horz-vrt"
                            // style={{
                            //   bottom: `${(((customDATAT * 100) / 200) * 100) / 160}%`,
                            // }}
                            style={{
                              left: "6.9rem",
                              top: "-13rem",
                              position: "absolute",
                            }}
                          >
                            {customRAM}
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="200"
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
                                (customRAM * 100) / 200
                              }%, #ddd ${(customRAM * 100) / 200}%)`,
                            }}
                          />
                        </div>
                        {/* DISK */}
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
                            max="5000"
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
                                (customDISK * 100) / 5000
                              }%, #ddd ${(customDISK * 100) / 5000}%)`,
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
                            max="200"
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
                                (customDATAT * 100) / 200
                              }%, #ddd ${(customDATAT * 100) / 200}%)`,
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
                        {/* will remove once confirm */}
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
                                      activeButton === title
                                        ? "#f47c20"
                                        : "#035189"
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
                                CPU
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
                            <div
                              style={{
                                marginLeft: "15rem",
                                display: "flex",
                                position: "relative",
                                marginTop: "-25rem",
                                flexWrap: "wrap",
                                justifyContent: "space-around",
                              }}
                            >
                              <RangeSlider
                                style={{ padding: "1rem" }}
                                unit={"Core"}
                                max={"30"}
                              />
                              <RangeSlider unit={"GB"} max={"512"} />
                              <RangeSlider unit={""} max={"5000"} />
                              <RangeSlider unit={""} max={"200"} />
                            </div>
                          </>
                        ) : (
                          <>
                            {(activePage && activePage == "Cloud Standard") ||
                            (activePage && activePage == "RAW Standard") ? (
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
                                          onClick={() => {
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
                                            setNewMachineConfigId(item.id);
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
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.ssd_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                        item.cpu_rate *
                                                          item.cpu +
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                                  newMachineTime
                                              );
                                              setDiscountRate(
                                                item[
                                                  `discount_price_${newMachineTime}`
                                                ]
                                              );
                                              setMachineAmt(
                                                item.nvme_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate
                                              );
                                              setSelectedIdx(idx);
                                              setNewMachineConfigId(item.id);
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
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                        +item.cpu_rate *
                                                          item.cpu +
                                                        item.ram * item.ram_rate
                                                      : diskType == "hdd"
                                                      ? item.hdd_rate *
                                                          item.hdd +
                                                        +item.cpu_rate *
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                                  newMachineTime
                                              );
                                              setDiscountRate(
                                                item[
                                                  `discount_price_${newMachineTime}`
                                                ]
                                              );
                                              setMachineAmt(
                                                item.hdd_rate * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate
                                              );
                                              setSelectedIdx(idx);
                                              setNewMachineConfigId(item.id);
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
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                        item.cpu_rate *
                                                          item.cpu +
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </>
                                )}
                              </>
                            ) : (activePage &&
                                activePage == "Cloud CPU Int.") ||
                              (activePage && activePage == "RAW CPU Int.") ? (
                              <>
                                {diskType == "ssd" ? (
                                  <>
                                    {" "}
                                    {cSsd &&
                                      cSsd.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="package"
                                          style={{
                                            width: "350px",
                                            marginBottom: "25px",
                                          }}
                                          onClick={() => {
                                            setVmCat("3");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.ssd_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.ssd_price * item.hdd +
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} Bandwidth
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </>
                                ) : diskType == "nvme" ? (
                                  <>
                                    {" "}
                                    {cNvm &&
                                      cNvm.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="package"
                                          style={{
                                            width: "350px",
                                            marginBottom: "25px",
                                          }}
                                          onClick={() => {
                                            setVmCat("3");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              // getPrice(item, diskType)
                                              item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.nvme_price *
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                          style={{
                                            width: "350px",
                                            marginBottom: "25px",
                                          }}
                                          onClick={() => {
                                            setVmCat("3");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.hdd_rate * item.hdd +
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                          style={{
                                            width: "350px",
                                            marginBottom: "25px",
                                          }}
                                          onClick={() => {
                                            setVmCat("4");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.ssd_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.ssd_price * item.hdd +
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                          style={{
                                            width: "350px",
                                            marginBottom: "25px",
                                          }}
                                          onClick={() => {
                                            setVmCat("4");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              // getPrice(item, diskType)
                                              item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.nvme_price *
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                          style={{
                                            width: "350px",
                                            marginBottom: "25px",
                                          }}
                                          onClick={() => {
                                            setVmCat("4");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              // getPrice(item, diskType)
                                              item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.hdd_rate * item.hdd +
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        // WEBVIEW
        <>
          <Row>
            <div className="col-md-1"></div>

            {currentMachine && (
              <div
                className="see-width col-md-11"
                style={{
                  marginTop: editType === "os" ? "5%" : "4rem",
                  paddingLeft: editType === "os" ? "15%" : "2rem",
                  marginBottom: "4rem",
                }}
              >
                <div
                  className="heading-dotted-bill"
                  style={{
                    position: "relative",
                    top: editType === "os" ? "-1rem" : "",
                    left: editType === "os" ? "-20rem" : "-9rem",
                  }}
                >
                  Edit Machine {editType === "os" ? "OS" : "Config"}
                </div>
                {editType === "os" ? (
                  <>
                    {/* <h3 style={{ marginLeft: "-10rem" }}>Current OS</h3>
                    <div
                      style={{
                        width: "15rem",
                        marginLeft: "-4rem",
                        marginTop: "25px",
                      }}
                    >
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
                        {ubuntu_fa.some((obj) =>
                          Object.values(obj).includes(newMahineOs)
                        )
                          ? "Ubantu"
                          : windows_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Windows"
                          : centOS_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "CentOS"
                          : debian_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Debian"
                          : fedora_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Fedora"
                          : rocky_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Rocky"
                          : redhat_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Redhat"
                          : "Unknown"}
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
                        value={
                          updateMahineOs !== null ? updateMahineOs : newMahineOs
                        }
                        onChange={(e) => {
                          setUpdateMachineOs(e.target.value);
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
                    </div> */}
                    <h3 style={{ marginLeft: "-10rem", marginTop: "25px" }}>
                      Other OS
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "2rem",
                        marginLeft: "-5rem",
                      }}
                    >
                      {smuser && smuser.platform_status == "0" ? (
                        <>
                          {!ubuntu_fa.some((obj) =>
                            Object.values(obj).includes(newMahineOs)
                          ) ? (
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
                                        src={
                                          "/images/admin/02-VM/ubanto-logo.svg"
                                        }
                                        alt={""}
                                        style={{
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
                                  value={updateMahineOs}
                                  onChange={(e) => {
                                    setUpdateMachineOs(e.target.value);
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
                            </>
                          ) : null}

                          {/* {!windows_fa.some((obj) =>
                            Object.values(obj).includes(newMahineOs)
                          ) ? (
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
                                      src={
                                        "/images/admin/02-VM/window-logo.svg"
                                      }
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
                                Windows
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
                                value={updateMahineOs}
                                onChange={(e) => {
                                  setUpdateMachineOs(e.target.value);
                                  ////console.log(e.target.value);
                                }}
                              >
                                <option value="Select" selected>
                                  Select
                                </option>
                                {windows_fa &&
                                  windows_fa.map((item, index) => (
                                    <option
                                      key={index}
                                      value={Object.values(item)[0]}
                                    >
                                      {Object.keys(item)[0]}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          ) : null} */}

                          {!centOS_fa.some((obj) =>
                            Object.values(obj).includes(newMahineOs)
                          ) ? (
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
                                      src={
                                        "/images/admin/02-VM/centos-logo.svg"
                                      }
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
                                value={updateMahineOs}
                                onChange={(e) => {
                                  setUpdateMachineOs(e.target.value);
                                  // console.log(e.target.value, "COS");
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
                          ) : null}

                          {/* {!redhat_fa.some((obj) =>
                            Object.values(obj).includes(newMahineOs)
                          ) ? (
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
                                      src={
                                        "/images/admin/02-VM/centos-logo.svg"
                                      }
                                      alt={
                                        "/images/admin/02-VM/centos-logo.svg"
                                      }
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
                                value={updateMahineOs}
                                onChange={(e) => {
                                  setUpdateMachineOs(e.target.value);
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
                          ) : null} */}

                          {!fedora_fa.some((obj) =>
                            Object.values(obj).includes(newMahineOs)
                          ) ? (
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
                                value={updateMahineOs}
                                onChange={(e) => {
                                  setUpdateMachineOs(e.target.value);
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
                          ) : null}

                          {!rocky_fa.some((obj) =>
                            Object.values(obj).includes(newMahineOs)
                          ) ? (
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
                                value={updateMahineOs}
                                onChange={(e) => {
                                  setUpdateMachineOs(e.target.value);
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
                          ) : null}

                          {!debian_fa.some((obj) =>
                            Object.values(obj).includes(newMahineOs)
                          ) ? (
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
                                value={updateMahineOs}
                                onChange={(e) => {
                                  setUpdateMachineOs(e.target.value);
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
                          ) : null}
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
                              value={updateMahineOs}
                              onChange={(e) => {
                                setUpdateMachineOs(e.target.value);
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
                              value={updateMahineOs}
                              onChange={(e) => {
                                setUpdateMachineOs(e.target.value);
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
                                  <option
                                    key={index}
                                    value={Object.values(item)[0]}
                                  >
                                    {Object.keys(item)[0]}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </>
                      )}

                      {smuser && smuser.platform_status == "0" ? <></> : null}
                    </div>
                    <button
                      style={{
                        zIndex: "9",
                        position: "absolute",
                        marginTop: "-15%",
                        left: "75%",
                        fontWeight: "700",
                        color: "white",
                        height: "55px",

                        // width: "10rem",
                        backgroundColor: "#e97730",
                        outline: "4px solid #e97730",
                        border: "4px solid #ffff",
                        borderColor: "white",
                        borderRadius: "30px",
                      }}
                      onClick={() => UpdateMachine_Li()}
                    >
                      {" "}
                      Update Machine OS
                    </button>
                    <h3 style={{ marginLeft: "-10rem", marginTop: "4rem" }}>
                      Current OS
                    </h3>
                    <div
                      style={{
                        width: "15rem",
                        marginLeft: "-4rem",
                        marginTop: "25px",
                      }}
                    >
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
                        {ubuntu_fa.some((obj) =>
                          Object.values(obj).includes(newMahineOs)
                        )
                          ? "Ubantu"
                          : windows_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Windows"
                          : centOS_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "CentOS"
                          : debian_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Debian"
                          : fedora_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Fedora"
                          : rocky_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Rocky"
                          : redhat_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? "Redhat"
                          : "Unknown"}
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
                        value={
                          updateMahineOs !== null ? updateMahineOs : newMahineOs
                        }
                        onChange={(e) => {
                          setUpdateMachineOs(e.target.value);
                          //console.log(e.target.value);
                        }}
                      >
                        <option value="Select" selected>
                          Select
                        </option>
                        {/* {console.log(newMahineOs, "NEWOS")} */}
                        {ubuntu_fa.some((obj) =>
                          Object.values(obj).includes(newMahineOs)
                        )
                          ? ubuntu_fa &&
                            ubuntu_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))
                          : rocky_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? rocky_fa &&
                            rocky_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))
                          : centOS_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? centOS_fa &&
                            centOS_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))
                          : fedora_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? fedora_fa &&
                            fedora_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))
                          : windows_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? windows_fa &&
                            windows_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))
                          : debian_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? debian_fa &&
                            debian_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))
                          : redhat_fa.some((obj) =>
                              Object.values(obj).includes(newMahineOs)
                            )
                          ? redhat_fa &&
                            redhat_fa.map((item, index) => (
                              <option
                                key={index}
                                value={Object.values(item)[0]}
                              >
                                {Object.keys(item)[0]}
                              </option>
                            ))
                          : ""}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
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
                      {activePage === "Custom Configure" ? (
                        <>
                          <Button className="top-buttons-create-machine">
                            {customCPU} CPU
                          </Button>
                          <Button className="top-buttons-create-machine">
                            {customRAM} GB RAM
                          </Button>
                          <Button className="top-buttons-create-machine">
                            {customDISK} GB {diskType.toUpperCase()} Disk
                          </Button>
                          <Button className="top-buttons-create-machine">
                            {customDATAT} TB Bandwidth
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button className="mobile-top-buttons-creact-machine">
                            {selectedCPU} CPU
                          </Button>
                          <Button className="mobile-top-buttons-creact-machine">
                            {selectedRAM} GB RAM
                          </Button>
                          <Button className="mobile-top-buttons-creact-machine">
                            {selectedSSD} GB {diskType.toUpperCase()} Disk
                          </Button>
                          <Button className="mobile-top-buttons-creact-machine">
                            {selectedDT} TB Bandwidth
                          </Button>
                        </>
                      )}

                      <select
                        name="plan_time"
                        style={{
                          borderRadius: "30px",
                          marginRight: "10px",
                          padding: "10px 15px",
                          border: "2px solid #e97730",
                        }}
                        value={newMachineTime}
                        onChange={(e) => {
                          setFinalAmount(machineAmt * e.target.value);
                          setNewMachineTime(e.target.value);

                          activePage === "Custom Configure" ? (
                            determineDiscountRate(
                              configPlan,
                              diskType,
                              e.target.value
                            )
                          ) : activePage === "Cloud Standard" ||
                            activePage === "RAW Standard" ? (
                            <>
                              {diskType == "ssd" ? (
                                <>
                                  {sSsd &&
                                    sSsd.map((item, idx) =>
                                      setDiscountRate(
                                        item[`discount_price_${e.target.value}`]
                                      )
                                    )}
                                </>
                              ) : diskType == "nvme" ? (
                                <>
                                  {sNvm &&
                                    sNvm.map((item, idx) =>
                                      setDiscountRate(
                                        item[`discount_price_${e.target.value}`]
                                      )
                                    )}
                                </>
                              ) : (
                                <>
                                  {sHdd &&
                                    sHdd.map((item, idx) =>
                                      setDiscountRate(
                                        item[`discount_price_${e.target.value}`]
                                      )
                                    )}
                                </>
                              )}
                            </>
                          ) : activePage === "Cloud CPU Int." ||
                            activePage === "RAW CPU Int." ? (
                            <>
                              {diskType == "ssd" ? (
                                <>
                                  {cSsd &&
                                    cSsd.map((item, idx) =>
                                      setDiscountRate(
                                        item[`discount_price_${e.target.value}`]
                                      )
                                    )}
                                </>
                              ) : diskType == "nvme" ? (
                                <>
                                  {cNvm &&
                                    cNvm.map((item, idx) =>
                                      setDiscountRate(
                                        item[`discount_price_${e.target.value}`]
                                      )
                                    )}
                                </>
                              ) : (
                                <>
                                  {cHdd &&
                                    cHdd.map((item, idx) =>
                                      setDiscountRate(
                                        item[`discount_price_${e.target.value}`]
                                      )
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
                                        item[`discount_price_${e.target.value}`]
                                      )
                                    )}
                                </>
                              ) : diskType == "nvme" ? (
                                <>
                                  {rNvm &&
                                    rNvm.map((item, idx) =>
                                      setDiscountRate(
                                        item[`discount_price_${e.target.value}`]
                                      )
                                    )}
                                </>
                              ) : (
                                <>
                                  {rHdd &&
                                    rHdd.map((item, idx) =>
                                      setDiscountRate(
                                        item[`discount_price_${e.target.value}`]
                                      )
                                    )}
                                </>
                              )}
                            </>
                          );
                        }}
                      >
                        <option value="1">1 Month</option>
                        <option value="3">3 Month</option>
                        <option value="6">6 Month</option>
                        <option value="9">9 Month</option>
                        <option value="12">1 Year</option>
                        <option value="24">2 Years</option>
                      </select>
                      <div
                        className="input-container"
                        style={{
                          border: "2px solid #e97730",
                          width: "10rem",
                          marginTop: "0px",
                        }}
                      >
                        <input
                          type="text"
                          //name="CompanyName"
                          className="input-signup"
                          placeholder="Location"
                          disabled="true"
                          value={serverLocation}
                          style={{
                            color: "black",
                            textAlign: "center",
                            width: "10px",
                            marginLeft: "0px",
                          }}
                          // onChange={(e) => setNewMachineName(e.target.value)}
                        />
                      </div>
                      <div
                        className="input-container"
                        style={{
                          border: "2px solid #e97730",
                          width: "10rem",
                          marginTop: "0px",
                          marginLeft: "5px",
                        }}
                      >
                        <input
                          type="text"
                          name="CompanyName"
                          className="input-signup"
                          placeholder="Name of Machine"
                          value={newMachineName}
                          style={{
                            color: "black",
                            textAlign: "center",
                            width: "10px",
                          }}
                          // onChange={(e) => setNewMachineName(e.target.value)}
                        />
                      </div>
                      <a
                        onClick={() => UpdateMachine_Li()}
                        className="underline-text"
                        style={{
                          marginTop: "10px",
                          marginLeft: "15px",
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
                        Update Machine
                      </a>
                      {activePage === "Custom Configure" ? (
                        <>
                          <div className="price-container">
                            <div className="price-old">
                              {(() => {
                                let discount;

                                if (
                                  configPlan === 1 ||
                                  configPlan === 5 ||
                                  configPlan === 6
                                ) {
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
                                } else if (
                                  configPlan === 3 ||
                                  configPlan === 7 ||
                                  configPlan === 8
                                ) {
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
                                        fontSize: "18px",
                                        marginRight: "10px",
                                      }}
                                    >
                                      {configPlan === 1 &&
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
                                                  stdCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  stdCusNVM.cpu_rate,
                                                  stdCusNVM.ram_rate,
                                                  stdCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  stdCusHDD.cpu_rate,
                                                  stdCusHDD.ram_rate,
                                                  stdCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {configPlan === 5 &&
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
                                                  stdCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  stdCusNVM.cpu_rate,
                                                  stdCusNVM.ram_rate,
                                                  stdCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  stdCusHDD.cpu_rate,
                                                  stdCusHDD.ram_rate,
                                                  stdCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {configPlan === 6 &&
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
                                                  stdCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  stdCusNVM.cpu_rate,
                                                  stdCusNVM.ram_rate,
                                                  stdCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  stdCusHDD.cpu_rate,
                                                  stdCusHDD.ram_rate,
                                                  stdCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}

                                      {configPlan === 3 &&
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
                                                  cpuCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  cpuCusNVM.cpu_rate,
                                                  cpuCusNVM.ram_rate,
                                                  cpuCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  cpuCusHDD.cpu_rate,
                                                  cpuCusHDD.ram_rate,
                                                  cpuCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {configPlan === 7 &&
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
                                                  cpuCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  cpuCusNVM.cpu_rate,
                                                  cpuCusNVM.ram_rate,
                                                  cpuCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  cpuCusHDD.cpu_rate,
                                                  cpuCusHDD.ram_rate,
                                                  cpuCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {configPlan === 8 &&
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
                                                  cpuCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  cpuCusNVM.cpu_rate,
                                                  cpuCusNVM.ram_rate,
                                                  cpuCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  cpuCusHDD.cpu_rate,
                                                  cpuCusHDD.ram_rate,
                                                  cpuCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}

                                      {configPlan === 4 &&
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
                                                  ramCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  ramCusNVM.cpu_rate,
                                                  ramCusNVM.ram_rate,
                                                  ramCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  ramCusHDD.cpu_rate,
                                                  ramCusHDD.ram_rate,
                                                  ramCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {configPlan === 9 &&
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
                                                  ramCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  ramCusNVM.cpu_rate,
                                                  ramCusNVM.ram_rate,
                                                  ramCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  ramCusHDD.cpu_rate,
                                                  ramCusHDD.ram_rate,
                                                  ramCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {configPlan === 10 &&
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
                                                  ramCusSSD.ssd_price
                                                )
                                              : diskType === "nvme"
                                              ? calculateOriginalPrice(
                                                  ramCusNVM.cpu_rate,
                                                  ramCusNVM.ram_rate,
                                                  ramCusNVM.nvme_price
                                                )
                                              : calculateOriginalPrice(
                                                  ramCusHDD.cpu_rate,
                                                  ramCusHDD.ram_rate,
                                                  ramCusHDD.hdd_rate
                                                ),
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                    </span>
                                  );
                                }

                                return null; // Return null if discount is not greater than 0
                              })()}

                              {configPlan === 1 &&
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
                                          1
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          stdCusNVM.cpu_rate,
                                          stdCusNVM.ram_rate,
                                          stdCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          stdCusHDD.cpu_rate,
                                          stdCusHDD.ram_rate,
                                          stdCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              {configPlan === 5 &&
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
                                          1
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          stdCusNVM.cpu_rate,
                                          stdCusNVM.ram_rate,
                                          stdCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          stdCusHDD.cpu_rate,
                                          stdCusHDD.ram_rate,
                                          stdCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              {configPlan === 6 &&
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
                                          1
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          stdCusNVM.cpu_rate,
                                          stdCusNVM.ram_rate,
                                          stdCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          stdCusHDD.cpu_rate,
                                          stdCusHDD.ram_rate,
                                          stdCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}

                              {configPlan === 3 &&
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
                                          newMachineTime
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          cpuCusNVM.cpu_rate,
                                          cpuCusNVM.ram_rate,
                                          cpuCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          cpuCusHDD.cpu_rate,
                                          cpuCusHDD.ram_rate,
                                          cpuCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              {configPlan === 7 &&
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
                                          newMachineTime
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          cpuCusNVM.cpu_rate,
                                          cpuCusNVM.ram_rate,
                                          cpuCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          cpuCusHDD.cpu_rate,
                                          cpuCusHDD.ram_rate,
                                          cpuCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              {configPlan === 8 &&
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
                                          newMachineTime
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          cpuCusNVM.cpu_rate,
                                          cpuCusNVM.ram_rate,
                                          cpuCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          cpuCusHDD.cpu_rate,
                                          cpuCusHDD.ram_rate,
                                          cpuCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}

                              {configPlan === 4 &&
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
                                          newMachineTime
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          ramCusNVM.cpu_rate,
                                          ramCusNVM.ram_rate,
                                          ramCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          ramCusHDD.cpu_rate,
                                          ramCusHDD.ram_rate,
                                          ramCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              {configPlan === 9 &&
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
                                          newMachineTime
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          ramCusNVM.cpu_rate,
                                          ramCusNVM.ram_rate,
                                          ramCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          ramCusHDD.cpu_rate,
                                          ramCusHDD.ram_rate,
                                          ramCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              {configPlan === 10 &&
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
                                          newMachineTime
                                        )
                                      : diskType === "nvme"
                                      ? calculatePrice(
                                          ramCusNVM.cpu_rate,
                                          ramCusNVM.ram_rate,
                                          ramCusNVM.nvme_price,
                                          discountRate || 0,
                                          newMachineTime
                                        )
                                      : calculatePrice(
                                          ramCusHDD.cpu_rate,
                                          ramCusHDD.ram_rate,
                                          ramCusHDD.hdd_rate,
                                          discountRate || 0,
                                          newMachineTime
                                        ),
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                            </div>

                            {(() => {
                              let discount;

                              if (
                                configPlan === 1 ||
                                configPlan === 5 ||
                                configPlan === 6
                              ) {
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
                              } else if (
                                configPlan === 3 ||
                                configPlan === 7 ||
                                configPlan === 8
                              ) {
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
                                  // <div className="price-new">
                                  //   <span style={{ zIndex: "9" }}>
                                  //     {configPlan === 1 ||
                                  //     configPlan === 5 ||
                                  //     configPlan === 6
                                  //       ? diskType === "ssd"
                                  //         ? `${
                                  //             stdCusSSD[
                                  //               `discount_price_${newMachineTime}`
                                  //             ]
                                  //           } % OFF`
                                  //         : diskType === "nvme"
                                  //         ? `${
                                  //             stdCusNVM[
                                  //               `discount_price_${newMachineTime}`
                                  //             ]
                                  //           } % OFF`
                                  //         : `${
                                  //             stdCusHDD[
                                  //               `discount_price_${newMachineTime}`
                                  //             ]
                                  //           } % OFF`
                                  //       : configPlan === 3 ||
                                  //         configPlan === 7 ||
                                  //         configPlan === 8
                                  //       ? diskType === "ssd"
                                  //         ? `${
                                  //             cpuCusSSD[
                                  //               `discount_price_${newMachineTime}`
                                  //             ]
                                  //           } % OFF`
                                  //         : diskType === "nvme"
                                  //         ? `${
                                  //             cpuCusNVM[
                                  //               `discount_price_${newMachineTime}`
                                  //             ]
                                  //           } % OFF`
                                  //         : `${
                                  //             cpuCusHDD[
                                  //               `discount_price_${newMachineTime}`
                                  //             ]
                                  //           } % OFF`
                                  //       : diskType === "ssd"
                                  //       ? `${
                                  //           ramCusSSD[
                                  //             `discount_price_${newMachineTime}`
                                  //           ]
                                  //         } % OFF`
                                  //       : diskType === "nvme"
                                  //       ? `${
                                  //           ramCusNVM[
                                  //             `discount_price_${newMachineTime}`
                                  //           ]
                                  //         } % OFF`
                                  //       : `${
                                  //           ramCusHDD[
                                  //             `discount_price_${newMachineTime}`
                                  //           ]
                                  //         } % OFF`}
                                  //   </span>
                                  // </div>
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
                          {/* {smuser && appCurrency && (
                            <div className="price-container">
                              {smuser && appCurrency && finalAmount > 0 && (
                                <div className="price-old">
                                  {discountRate > 0 && (
                                    <span
                                      style={{
                                        textDecoration:
                                          finalAmount !== "0"
                                            ? "line-through"
                                            : "",
                                        fontSize: "18px",
                                        marginRight: "10px",
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
                                    <span style={{ zIndex: "9" }}>
                                      {currencyReturn({
                                        price:
                                          finalAmount -
                                          (finalAmount * discountRate) / 100,
                                        symbol: smuser.prefer_currency,
                                        rates: appCurrency,
                                      })}
                                      {/* ({discountRate} % off) }
                                    </span>
                                  )}
                                </div>
                              )}
                              {smuser &&
                                appCurrency &&
                                finalAmount > 0 &&
                                discountRate > 0 && (
                                  <div
                                    // className="top-buttons-discountoff-machine"
                                    // style={{
                                    //   marginLeft: "1rem",
                                    //   color: "white",
                                    // }}
                                    className="price-new"
                                  >
                                    {finalAmount !== 0 && (
                                      <span style={{ zIndex: "9" }}>
                                        {/* {currencyReturn({
                              price:
                                finalAmount -
                                (finalAmount * discountRate) / 100,
                              symbol: smuser.prefer_currency,
                              rates: appCurrency,
                            })} }
                                        {discountRate}% OFF
                                      </span>
                                    )}
                                  </div>
                                )}
                            </div>
                          )} */}
                          {smuser && appCurrency && (
                            <div
                              className="price-container"
                              style={{
                                marginBottom: "10px",
                                marginLeft: "7px",
                              }}
                            >
                              {smuser && appCurrency && finalAmount > 0 && (
                                <div className="price-old">
                                  {discountRate > 0 && (
                                    <span
                                      style={{
                                        textDecoration:
                                          finalAmount !== "0"
                                            ? "line-through"
                                            : "",
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
                                    <span
                                      style={{ zIndex: "9", fontSize: "20px" }}
                                    >
                                      {currencyReturn({
                                        price:
                                          finalAmount -
                                          (finalAmount * discountRate) / 100,
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
                                    <span
                                      style={{ zIndex: "9", fontSize: "20px" }}
                                    >
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
                      style={{
                        height: "auto !important",
                        minHeight:
                          activePage === "Custom Configure" ? "90vh" : "77vh", // "60vh",
                        marginBottom: "0rem",
                      }}
                    >
                      {platformSelected && platformSelected == "1" ? (
                        <>
                          {nativePages &&
                            nativePages.map((item, idx) => (
                              <div
                                className={`${
                                  activePage === item
                                    ? "active-web-vm"
                                    : "non-active-web-vm"
                                }`}
                                onClick={() => {
                                  setActivePage(item);
                                  setSelectedIdx(null);
                                  setFinalAmount(0);
                                  setDiscountRate(0);
                                }}
                              >
                                {item}
                              </div>
                            ))}
                        </>
                      ) : (
                        <>
                          {" "}
                          {nativePages &&
                            nativePages.map((item, idx) => (
                              <div
                                className={`${
                                  activePage === item
                                    ? "active-web-vm"
                                    : "non-active-web-vm"
                                }`}
                                onClick={() => {
                                  setActivePage(item);
                                  setSelectedIdx(null);
                                  setFinalAmount(0);
                                  // setDiscountRate(0);
                                }}
                              >
                                {item}
                              </div>
                            ))}
                        </>
                      )}

                      <div
                        style={{
                          marginLeft: "1rem",
                          // display: "flex",
                          // position: "relative",
                          marginTop: "-28rem",
                          // flexWrap: "wrap",
                          // justifyContent: "space-around",
                        }}
                      >
                        {activePage && activePage == "Custom Configure" ? (
                          <>
                            <div
                              className="buttons-container"
                              style={{
                                position: "absolute",
                                padding: "15px",
                                marginTop: "13rem",
                                marginLeft: "36px",
                              }}
                            >
                              {/* {innerButtons.map((title, idx) => ( */}
                              <Button
                                // key={idx}
                                style={{
                                  background: "#f47c20",
                                  border: "none",
                                  fontSize: "22px",
                                  padding: "5px 15px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  borderRadius: "5px",
                                  marginBottom: "10px",
                                }}
                                // onClick={() => {
                                //   setActiveButton(title);
                                //   setCustomConfigType(idx + 1);
                                // }}
                              >
                                {configPlan == 1
                                  ? "Standard"
                                  : configPlan == 5
                                  ? "Standard"
                                  : configPlan == 6
                                  ? "Standard"
                                  : configPlan == 3
                                  ? "CPU Proactive"
                                  : configPlan == 7
                                  ? "CPU Proactive"
                                  : configPlan == 8
                                  ? "CPU Proactive"
                                  : "RAM Proactive"}
                              </Button>
                              {/* ))} */}
                            </div>
                            <div
                              className="title-box-pricing"
                              style={{
                                position: "absolute",
                                backgroundImage: `url(${"/images/frontend/price/server-img.png"})`,
                                backgroundPosition: "center",
                                marginTop: "19rem",
                                width: "50rem",
                                //height: "30rem"
                                marginLeft: "60px",
                              }}
                            >
                              <h6
                                style={{
                                  textAlign: "center",
                                  fontSize: "30px",
                                  fontWeight: "800",
                                  marginTop: "50px",
                                }}
                              >
                                vCPU
                              </h6>
                              <h6
                                style={{
                                  textAlign: "center",
                                  fontSize: "30px",
                                  fontWeight: "800",
                                  marginTop: "80px",
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
                                  marginTop: "60px",
                                }}
                              >
                                {/* DATA
                                <br />
                                TRANSFER */}
                                BANDWIDTH
                              </h6>
                            </div>
                            <div
                              style={{
                                marginTop: "-25rem",
                                justifyContent: "space-around",
                                maxWidth: "60%",
                                width: "-webkit-fill-available",
                                position: "absolute",
                                marginLeft: "20rem",
                                marginTop: "21rem",
                              }}
                            >
                              {/* CPU */}
                              <div>
                                <div className="range-slider">
                                  <div
                                    className="tooltip-horz"
                                    style={{
                                      left: `${(customCPU * 100) / 30}%`,
                                    }}
                                  >
                                    {customCPU} vCPU
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    value={customCPU}
                                    onChange={(event) => {
                                      setCustomCPU(event.target.value);
                                      // setFinalRam(event.target.value * 255);
                                      // setFinalAmount(
                                      //   customCPU * 255 + customRAM * 255
                                      // );
                                      setSelectedCPU(event.target.value);
                                    }}
                                    className="custom-rangeInput"
                                    style={{
                                      background: `linear-gradient(to right, #e97730 ${
                                        (customCPU * 100) / 30
                                      }%, #ddd ${(customCPU * 100) / 30}%)`,
                                    }}
                                  />
                                </div>
                              </div>
                              {/* RAM */}
                              <div style={{ marginTop: "60px" }}>
                                <div className="range-slider">
                                  <div
                                    className="tooltip-horz"
                                    style={{
                                      left: `${(customRAM * 100) / 512}%`,
                                    }}
                                  >
                                    {/* <FaChevronDown /> */}
                                    {customRAM} GB
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="512"
                                    value={customRAM}
                                    onChange={(event) => {
                                      setCustomRAM(event.target.value);
                                      //console.log(event.target.value);
                                      setSelectedRAM(event.target.value);
                                    }}
                                    className="custom-rangeInput"
                                    style={{
                                      background: `linear-gradient(to right, #e97730 ${
                                        (customRAM * 100) / 512
                                      }%, #ddd ${(customRAM * 100) / 512}%)`,
                                    }}
                                  />
                                </div>
                                {/* <RangeSlider /> */}
                              </div>
                              {/* DISK */}
                              <div style={{ marginTop: "50px" }}>
                                <div className="range-slider">
                                  <div
                                    className="tooltip-horz"
                                    style={{
                                      left: `${(customDISK * 100) / 5000}%`,
                                    }}
                                  >
                                    {customDISK} GB
                                  </div>
                                  <input
                                    type="range"
                                    min="0" //{currentVM.hard_disk}
                                    max="5000"
                                    value={customDISK}
                                    onChange={(event) => {
                                      setCustomDISK(event.target.value);
                                      setSelectedSSD(event.target.value);
                                    }}
                                    className="custom-rangeInput"
                                    style={{
                                      background: `linear-gradient(to right, #e97730 ${
                                        (customDISK * 100) / 5000
                                      }%, #ddd ${(customDISK * 100) / 5000}%)`,
                                    }}
                                  />
                                </div>
                                {/* <RangeSlider /> */}
                              </div>
                              {/* BANDWIDTH */}
                              <div style={{ marginTop: "50px" }}>
                                <div className="range-slider">
                                  <div
                                    className="tooltip-horz"
                                    style={{
                                      left: `${(customDATAT * 100) / 200}%`,
                                    }}
                                  >
                                    {customDATAT} TB
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={customDATAT}
                                    onChange={(event) => {
                                      setCustomDATAT(event.target.value);
                                      setSelectedDT(event.target.value);
                                    }}
                                    className="custom-rangeInput"
                                    style={{
                                      background: `linear-gradient(to right, #e97730 ${
                                        (customDATAT * 100) / 200
                                      }%, #ddd ${(customDATAT * 100) / 200}%)`,
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
                              marginTop: "13rem",
                              position: "absolute",
                              width: "80%",
                              height: "75vh",
                            }}
                          >
                            {(activePage && activePage == "Cloud Standard") ||
                            (activePage && activePage == "RAW Standard") ? (
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
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
                                            setNewMachineConfigId(item.id);
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
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.ssd_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                        item.cpu_rate *
                                                          item.cpu +
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                                  newMachineTime
                                              );
                                              setDiscountRate(
                                                item[
                                                  `discount_price_${newMachineTime}`
                                                ]
                                              );
                                              setMachineAmt(
                                                item.nvme_price * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate
                                              );
                                              setSelectedIdx(idx);
                                              setNewMachineConfigId(item.id);
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
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                        +item.cpu_rate *
                                                          item.cpu +
                                                        item.ram * item.ram_rate
                                                      : diskType == "hdd"
                                                      ? item.hdd_rate *
                                                          item.hdd +
                                                        +item.cpu_rate *
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                                  newMachineTime
                                              );
                                              setDiscountRate(
                                                item[
                                                  `discount_price_${newMachineTime}`
                                                ]
                                              );
                                              setMachineAmt(
                                                item.hdd_rate * item.hdd +
                                                  item.cpu_rate * item.cpu +
                                                  item.ram * item.ram_rate
                                              );
                                              setSelectedIdx(idx);
                                              setNewMachineConfigId(item.id);
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
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                        item.cpu_rate *
                                                          item.cpu +
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </>
                                )}
                              </>
                            ) : (activePage &&
                                activePage == "Cloud CPU Int.") ||
                              (activePage && activePage == "RAW CPU Int.") ? (
                              <>
                                {diskType == "ssd" ? (
                                  <>
                                    {" "}
                                    {cSsd &&
                                      cSsd.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="package"
                                          style={{ width: "350px" }}
                                          onClick={() => {
                                            setVmCat("3");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.ssd_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.ssd_price * item.hdd +
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} Bandwidth
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </>
                                ) : diskType == "nvme" ? (
                                  <>
                                    {" "}
                                    {cNvm &&
                                      cNvm.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="package"
                                          style={{ width: "350px" }}
                                          onClick={() => {
                                            setVmCat("3");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              // getPrice(item, diskType)
                                              item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.nvme_price *
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                            setVmCat("3");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.hdd_rate * item.hdd +
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                            setVmCat("4");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              item.ssd_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.ssd_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.ssd_price * item.hdd +
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                            setVmCat("4");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              // getPrice(item, diskType)
                                              item.nvme_price * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.nvme_price *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.nvme_price *
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                                            setVmCat("4");
                                            setSelectedCPU(item.cpu);
                                            setSelectedRAM(item.ram);
                                            setSelectedSSD(item.hdd);
                                            setSelectedDT(item.data_transfer);
                                            setFinalAmount(
                                              (item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate) *
                                                newMachineTime
                                            );
                                            setDiscountRate(
                                              item[
                                                `discount_price_${newMachineTime}`
                                              ]
                                            );
                                            setMachineAmt(
                                              // getPrice(item, diskType)
                                              item.hdd_rate * item.hdd +
                                                item.cpu_rate * item.cpu +
                                                item.ram * item.ram_rate
                                            );
                                            setSelectedIdx(idx);
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
                                                <div
                                                  className="media"
                                                  onMouseEnter={() =>
                                                    handleMouseEnter(idx)
                                                  }
                                                  onMouseLeave={
                                                    handleMouseLeave
                                                  }
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
                                                        item.hdd_rate *
                                                          item.hdd +
                                                        item.cpu_rate *
                                                          item.cpu +
                                                        item.ram *
                                                          item.ram_rate,
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
                                                    (item.hdd_rate * item.hdd +
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

                                          <div style={{ marginLeft: "50px" }}>
                                            <div className="media">
                                              <img
                                                className="normal"
                                                src="/images/admin/02-VM/gray-box-bg.svg"
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
                                                {item.cpu} CPU
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
                                                {item.hdd} GB{" "}
                                                {diskType.toUpperCase()} Disk
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
                                                {item.data_transfer} TB
                                                Bandwidth
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
                  </>
                )}
              </div>
            )}
            {/* <div className="col-md-"></div> */}
          </Row>
        </>
      )}
    </div>
  );
};

export default EditMachine;
