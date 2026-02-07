import React, { useRef, useState, useEffect } from "react";
import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";
import "./PricingPage.css";
import "./rangSliderVert.css";
import { useAuth } from "../AuthContext";
import instance, {
  currencyReturn,
  apiEncryptRequest,
  decryptData,
} from "../Api";
import Loader from "./common/Loader";

const sliderContainerStyle = {
  display: "flex",
  alignItems: "center",
  height: "300px",
  justifyContent: "space-evenly",
  marginTop: "70px",
};
const sliderWrapperStyle = {
  position: "relative",
  height: "100%",
  margin: "0 10px",
  backgroundColor: "white",
  color: "orange",
};
const valueLabelStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  color: "white",
  backgroundColor: "green",
  borderRadius: "3px",
  padding: "2px 5px",
  fontSize: "14px",
  zIndex: 99, // Ensure the label is above the slider thumb
};
const sliderInputStyle = {
  writingMode: "bt-lr", // IE
  WebkitAppearance: "slider-vertical", // WebKit
  appearance: "slider-vertical",
  width: "10px",
  height: "100%",
  background: "green",
  borderRadius: "4px",
  outline: "none",
  opacity: "0.7",
  transition: "opacity 0.2s",
  border: "3px solid #e97730",
};
const sliderInputStyleHorz = {
  writingMode: "bt-lr", // IE
  WebkitAppearance: "slider-vertical", // WebKit
  appearance: "slider-vertical",
  width: "10px",
  height: "100%",
  background: "red",
  borderRadius: "4px",
  outline: "none",
  opacity: "0.7",
  transition: "opacity 0.2s",
  border: "3px solid #e97730",
};
const sliderThumbStyle = {
  WebkitAppearance: "none",
  appearance: "none",
  width: "25px",
  height: "25px",
  background: "#f47c20",
  cursor: "pointer",
  borderRadius: "50%",
};

const Slider = ({ value, onChange, max, label }) => {
  const dynamicLabelStyle = {
    ...valueLabelStyle,
    bottom: `${(value / max) * 100}%`,
  };

  return (
    <div style={sliderWrapperStyle}>
      <div style={dynamicLabelStyle}>{label}</div>
      <input
        type="range"
        orient="vertical"
        min="0"
        max={max}
        value={value}
        onChange={onChange}
        style={sliderInputStyle}
      />
    </div>
  );
};
// const SliderHorz = ({ value, onChange, max, label }) => {
//   const dynamicLabelStyle = {
//     ...valueLabelStyle,
//     bottom: `${(value / max) * 100}%`,
//   };

//   return (
//     <div style={sliderWrapperStyle}>
//       {/* <div style={dynamicLabelStyle}>{label}</div> */}
//       <input
//         type="range"
//         orient="horizontal"
//         min="0"
//         max={max}
//         value={value}
//         onChange={onChange}
//         style={sliderInputStyleHorz}
//       />
//     </div>
//   );
// };

const PricingPage = (props) => {
  const { isMobile } = props;
  const Pages = ["Custom Configure", "CDN"];
  const innerButtons = ["Standard", "CPU Proactive", "RAM Proactive"];
  const [customCPU, setCustomCPU] = useState(0);
  const [customRAM, setCustomRAM] = useState(0);
  const [customDISK, setCustomDISK] = useState(0);
  const [customDATAT, setCustomDATAT] = useState(0);

  const [selectedCPU, setSelectedCPU] = useState(0);
  const [selectedRAM, setSelectedRAM] = useState(0);
  const [selectedSSD, setSelectedSSD] = useState(0);
  const [selectedDT, setSelectedDT] = useState(0);

  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);
  const [diskSpace, setDiskSpace] = useState(0);
  const [dataTran, setDataTran] = useState(0);
  const [configType, setConfigType] = useState(1);
  const [activeButton, setActiveButton] = useState("Standard");

  const [diskType, setDisktype] = useState("ssd");
  const [values, setValues] = React.useState([cpu, ram, diskSpace, dataTran]);

  const [activePage, setActivePage] = useState("Custom Configure");
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [finalAmount, setFinalAmount] = useState("0");
  const [value, setValue] = useState(0);
  const [custConfigData, setCustConfigData] = useState({});

  const [stdCusHDD, setStdCusHDD] = useState({});
  const [stdCusSSD, setStdCusSSD] = useState({});
  const [stdCusNVM, setStdCusNVM] = useState({});

  const [cpuCusHDD, setCpuCusHDD] = useState({});
  const [cpuCusSSD, setCpuCusSSD] = useState({});
  const [cpuCusNVM, setCpuCusNVM] = useState({});

  const [ramCusHDD, setRamCusHDD] = useState({});
  const [ramCusSSD, setRamCusSSD] = useState({});
  const [ramCusNVM, setRamCusNVM] = useState({});
  const [loading, setLoading] = useState(true);

  const [cdnGBPrice, setGBPrice] = useState("");
  const [cdnTBPrice, setTBPrice] = useState("");
  const [selectedTransfers, setSelectedTransfers] = useState("GB");

  const {
    updateUserDetails,
    updateCurrencyRate,
    updateAppCurrency,
    appCurrency,
  } = useAuth();
  const handleSliderChange = (index) => (event) => {
    const newValues = [...values];
    newValues[index] = parseInt(event.target.value, 10);
    setValues(newValues);
  };

  const dataTransfers = ["GB", "TB"];

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSelectionChange = (option) => {
    if (selectedTransfers !== option) {
      setSelectedTransfers(option);
    }
  };

  useEffect(() => {
    CreateVm();
    CdnPrice();
  }, []);

  const CreateVm = async () => {
    setLoading(true);
    // const payload = {
    //   user_id: smuser.id,
    // };
    try {
      // const encryptedResponse = await apiEncryptRequest(payload);
      const encryptedResponse = await apiEncryptRequest();
      const loginUserResponse = await instance.post(
        "/create-vm",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      const userDetails = loginResponse;

      // console.log(userDetails.reedem_points);
      console.log(userDetails, "====loginUserResponse");

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

      const vm = userDetails.vms;
      const moniters_machine = userDetails.mergedData;
      // console.log(moniters_machine, "==!==!==moniters_machine");

      const vmArray = Object.keys(moniters_machine).map(
        (key) => moniters_machine[key]
      );
      // console.log(vmArray, "==!==!==vvmArraym");

      const custConfig = userDetails.custom_configure;
      setCustConfigData(custConfig);
    } catch (error) {
      // console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const CdnPrice = async () => {
    setLoading(true);
    // const payload = {
    //   user_id: "4577",
    // };
    //console.log(payload);
    try {
      // const encryptedResponse = await apiEncryptRequest(payload);
      const encryptedResponse = await apiEncryptRequest();
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

  return (
    <div style={{ height: "100vh" }}>
      {isMobile ? (
        <>
          <div className="heading-dotted-pricing">
            Pricing <span></span>
          </div>
          <div style={{ marginTop: "6rem", display: "" }}>
            <div className="buttons-container">
              <Button
                className="top-buttons-creact-machine"
                style={{ fontSize: "14px" }}
              >
                {selectedCPU} vCPU
              </Button>
              <Button
                className="top-buttons-creact-machine"
                style={{ fontSize: "14px" }}
              >
                {selectedRAM} GB RAM
              </Button>
              <Button
                className="top-buttons-creact-machine"
                style={{ fontSize: "14px" }}
              >
                {selectedSSD} GB SSD Disk
              </Button>
              <Button
                className="top-buttons-creact-machine"
                style={{ fontSize: "14px" }}
              >
                {selectedDT} TB Bandwidth
              </Button>
            </div>
            <div className="log-in" style={{ marginLeft: "-40px" }}>
              <a href="/signUp" className="media-link">
                <div
                  className="media-banner"
                  style={{
                    width: "160px",
                    height: "65px",
                    // marginTop: "10px",
                    marginLeft: "16rem",
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
                    }}
                  >
                    Create Machine
                  </span>
                </div>
              </a>
            </div>
            {/* <div className="active-mobile">Custom Configure </div>
            <div className="active-mobile" style={{ marginLeft: "5rem" }}>
              CDN{" "}
            </div> */}

            {Pages.map((item, idx) => (
              <div
                className={`${
                  activePage === item
                    ? "active-mobile-vm"
                    : "non-active-mobile-vm"
                }`}
                onClick={() => {
                  setActivePage(item);
                  setSelectedIdx(null);
                  setFinalAmount("0");
                  //setDiscountRate("0");
                }}
                style={
                  item === "Custom Configure"
                    ? {
                        paddingTop:
                          activePage === "Custom Configure" ? "24px" : "20px",
                        marginTop: "-10px",
                      }
                    : {
                        paddingTop: "25px",
                        marginLeft: "5rem",
                        marginTop: "-10px",
                      }
                }
              >
                {item}
              </div>
            ))}
            <div className="pricing-right" style={{ fontSize: "20px" }}>
              {activePage === "Custom Configure" ? (
                <>
                  {/* {configType === 1 &&
                        customCPU * 225 +
                          customRAM * 225 +
                          customDISK * 5 +
                          customDATAT * 1}
                      {configType === 2 &&
                        customCPU * 250 +
                          customRAM * 250 +
                          customDISK * 10 +
                          customDATAT * 1}
                      {configType === 3 &&
                        customCPU * 275 +
                          customRAM * 275 +
                          customDISK * 15 +
                          customDATAT * 1} */}
                  {(() => {
                    const totalPrice = () => {
                      if (configType === 1) {
                        return diskType == "ssd"
                          ? customCPU * stdCusSSD.cpu_rate +
                              customRAM * stdCusSSD.ram_rate +
                              customDISK * stdCusSSD.ssd_price +
                              customDATAT * 1 -
                              (stdCusSSD.custom_discount *
                                (customCPU * stdCusSSD.cpu_rate +
                                  customRAM * stdCusSSD.ram_rate +
                                  customDISK * stdCusSSD.ssd_price +
                                  customDATAT * 1)) /
                                100
                          : diskType == "nvme"
                          ? customCPU * stdCusNVM.cpu_rate +
                            customRAM * stdCusNVM.ram_rate +
                            customDISK * stdCusNVM.nvme_price +
                            customDATAT * 1 -
                            (stdCusNVM.custom_discount *
                              (customCPU * stdCusNVM.cpu_rate +
                                customRAM * stdCusNVM.ram_rate +
                                customDISK * stdCusNVM.nvme_price +
                                customDATAT * 1)) /
                              100
                          : customCPU * stdCusHDD.cpu_rate +
                            customRAM * stdCusHDD.ram_rate +
                            customDISK * stdCusHDD.hdd_rate +
                            customDATAT * 1 -
                            (stdCusHDD.custom_discount *
                              (customCPU * stdCusHDD.cpu_rate +
                                customRAM * stdCusHDD.ram_rate +
                                customDISK * stdCusHDD.hdd_rate +
                                customDATAT * 1)) /
                              100;
                      } else if (configType === 2) {
                        return diskType == "ssd"
                          ? customCPU * cpuCusSSD.cpu_rate +
                              customRAM * cpuCusSSD.ram_rate +
                              customDISK * cpuCusSSD.ssd_price +
                              customDATAT * 1 -
                              (cpuCusSSD.custom_discount *
                                (customCPU * cpuCusSSD.cpu_rate +
                                  customRAM * cpuCusSSD.ram_rate +
                                  customDISK * cpuCusSSD.ssd_price +
                                  customDATAT * 1)) /
                                100
                          : diskType == "nvme"
                          ? customCPU * cpuCusNVM.cpu_rate +
                            customRAM * cpuCusNVM.ram_rate +
                            customDISK * cpuCusNVM.nvme_price +
                            customDATAT * 1 -
                            (cpuCusNVM.custom_discount *
                              (customCPU * cpuCusNVM.cpu_rate +
                                customRAM * cpuCusNVM.ram_rate +
                                customDISK * cpuCusNVM.nvme_price +
                                customDATAT * 1)) /
                              100
                          : customCPU * cpuCusHDD.cpu_rate +
                            customRAM * cpuCusHDD.ram_rate +
                            customDISK * cpuCusHDD.hdd_rate +
                            customDATAT * 1 -
                            (cpuCusHDD.custom_discount *
                              (customCPU * cpuCusHDD.cpu_rate +
                                customRAM * cpuCusHDD.ram_rate +
                                customDISK * cpuCusHDD.hdd_rate +
                                customDATAT * 1)) /
                              100;
                      } else if (configType === 3) {
                        return diskType == "ssd"
                          ? customCPU * ramCusSSD.cpu_rate +
                              customRAM * ramCusSSD.ram_rate +
                              customDISK * ramCusSSD.ssd_price +
                              customDATAT * 1 -
                              (ramCusSSD.custom_discount *
                                (customCPU * ramCusSSD.cpu_rate +
                                  customRAM * ramCusSSD.ram_rate +
                                  customDISK * ramCusSSD.ssd_price +
                                  customDATAT * 1)) /
                                100
                          : diskType == "nvme"
                          ? customCPU * ramCusNVM.cpu_rate +
                            customRAM * ramCusNVM.ram_rate +
                            customDISK * ramCusNVM.nvme_price +
                            customDATAT * 1 -
                            (ramCusNVM.custom_discount *
                              (customCPU * ramCusNVM.cpu_rate +
                                customRAM * ramCusNVM.ram_rate +
                                customDISK * ramCusNVM.nvme_price +
                                customDATAT * 1)) /
                              100
                          : customCPU * ramCusHDD.cpu_rate +
                            customRAM * ramCusHDD.ram_rate +
                            customDISK * ramCusHDD.hdd_rate +
                            customDATAT * 1 -
                            (ramCusHDD.custom_discount *
                              (customCPU * ramCusHDD.cpu_rate +
                                customRAM * ramCusHDD.ram_rate +
                                customDISK * ramCusHDD.hdd_rate +
                                customDATAT * 1)) /
                              100;
                      } else {
                        return 0; // Default to 0 if configType doesn't match
                      }
                    };

                    return currencyReturn({
                      price: totalPrice(),
                      symbol: localStorage.getItem("PrefCurrency"),
                      rates: appCurrency,
                    });
                  })()}
                </>
              ) : (
                currencyReturn({
                  price:
                    selectedTransfers === "GB"
                      ? value * cdnGBPrice * 1024
                      : value * cdnTBPrice * 1024,
                  symbol: localStorage.getItem("PrefCurrency"),
                  rates: appCurrency,
                })
                // <>₹ {value * 1024}</>
              )}
            </div>
            <div
              className="tab-box"
              style={{
                minHeight:
                  activePage === "Custom Configure" ? "40rem" : "100px",
              }}
            >
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
                          fontSize: "14px",
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
                    <select
                      name="plan_time"
                      value={diskType}
                      style={{
                        borderRadius: "30px",
                        // padding: "5px",
                        fontSize: "15px",
                        border: "2px solid #e97730",
                        color: "#144e7b",
                        fontWeight: "700",
                        backgroundColor: "transparent",
                      }}
                      onChange={(e) => {
                        setDisktype(e.target.value);
                        setCustomDISK(0);
                        // setFinalAmount(
                        //   // getPrice(item, diskType) * newMachineTime
                        // );
                      }}
                    >
                      <option value="hdd" selected>
                        HDD Disk
                      </option>
                      <option value="ssd" selected>
                        SSD Disk
                      </option>
                      <option value="nvme" selected>
                        NVMe Disk
                      </option>
                    </select>
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
                  <div style={{}}>
                    {/* {values.map((value, index) => ( */}

                    {/* CPU */}
                    <div
                      style={{
                        marginTop: "12rem",
                        position: "absolute",
                      }}
                    >
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
                          {/* <FaChevronDown /> */}
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
                          {/* <FaChevronDown /> */}
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
                  </div>
                </>
              ) : (
                <>
                  <div className="title-box">
                    <h6
                      style={{
                        // width: "25%",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "700",
                        marginTop: "15px",
                      }}
                    >
                      CDN BANDWIDTH
                    </h6>
                  </div>

                  <div
                    className="multi-select-container"
                    style={{ marginLeft: "5px" }}
                  >
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

                  <div
                    className="range-slider-vrt"
                    style={{ marginLeft: "50px", marginTop: "-30px" }}
                  >
                    <div
                      className="tooltip-horz-vrt"
                      style={{
                        left: "9.2rem",
                        top: "-20px",
                        position: "absolute",
                      }}
                    >
                      {value} {selectedTransfers === "GB" ? "GB" : "TB"}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={handleChange}
                      className="custom-rangeInput-vrt"
                      style={{
                        left: "1.3rem",
                        top: "200px",
                        position: "absolute",
                        background: `linear-gradient(to right, #e97730 ${value}%, #ddd ${value}%)`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <Row>
            <div className="col-md-1"></div>
            <div
              className="see-width col-md-11"
              style={{ marginTop: "5rem", marginLeft: "11rem", width: "90%" }}
            >
              <div className="heading-dotted-pricing">
                Pricing <span></span>
              </div>
              <div className="buttons-container" style={{ marginTop: "2rem" }}>
                <Button className="top-buttons-creact-machine">
                  {selectedCPU} vCPU
                </Button>
                <Button className="top-buttons-creact-machine">
                  {selectedRAM} GB RAM
                </Button>
                <Button className="top-buttons-creact-machine">
                  {selectedSSD} GB SSD Disk
                </Button>
                <Button className="top-buttons-creact-machine">
                  {selectedDT} TB Bandwidth
                </Button>
              </div>
              <div
                className="log-in"
                style={{ marginTop: "-4.5rem", marginLeft: "70%" }}
              >
                <a href="/signUp" className="media-link">
                  <div
                    className="media-banner"
                    style={{
                      width: "160px",
                      height: "65px",
                      marginTop: "10px",
                      marginLeft: "16rem",
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
                      }}
                    >
                      Create Machine
                    </span>
                  </div>
                </a>
              </div>

              <div
                className="tab-box"
                style={{
                  minHeight:
                    activePage === "Custom Configure" ? "40rem" : "100px",
                  marginTop: "50px",
                }}
              >
                {Pages.map((item, idx) => (
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
                      //setDiscountRate("0");
                    }}
                    style={
                      item === "Custom Configure"
                        ? {
                            paddingTop:
                              activePage === "Custom Configure"
                                ? "24px"
                                : "20px",
                          }
                        : {
                            paddingTop: "40px",
                          }
                    }
                  >
                    {item}
                  </div>
                ))}
                {/* <div className="active-web">Custom Configure </div> */}
                <div className="pricing-right">
                  {activePage === "Custom Configure" ? (
                    <>
                      {(() => {
                        const totalPrice = () => {
                          if (configType === 1) {
                            return diskType == "ssd"
                              ? customCPU * stdCusSSD.cpu_rate +
                                  customRAM * stdCusSSD.ram_rate +
                                  customDISK * stdCusSSD.ssd_price +
                                  customDATAT * 1 -
                                  (stdCusSSD.custom_discount *
                                    (customCPU * stdCusSSD.cpu_rate +
                                      customRAM * stdCusSSD.ram_rate +
                                      customDISK * stdCusSSD.ssd_price +
                                      customDATAT * 1)) /
                                    100
                              : diskType == "nvme"
                              ? customCPU * stdCusNVM.cpu_rate +
                                customRAM * stdCusNVM.ram_rate +
                                customDISK * stdCusNVM.nvme_price +
                                customDATAT * 1 -
                                (stdCusNVM.custom_discount *
                                  (customCPU * stdCusNVM.cpu_rate +
                                    customRAM * stdCusNVM.ram_rate +
                                    customDISK * stdCusNVM.nvme_price +
                                    customDATAT * 1)) /
                                  100
                              : customCPU * stdCusHDD.cpu_rate +
                                customRAM * stdCusHDD.ram_rate +
                                customDISK * stdCusHDD.hdd_rate +
                                customDATAT * 1 -
                                (stdCusHDD.custom_discount *
                                  (customCPU * stdCusHDD.cpu_rate +
                                    customRAM * stdCusHDD.ram_rate +
                                    customDISK * stdCusHDD.hdd_rate +
                                    customDATAT * 1)) /
                                  100;
                          } else if (configType === 2) {
                            return diskType == "ssd"
                              ? customCPU * cpuCusSSD.cpu_rate +
                                  customRAM * cpuCusSSD.ram_rate +
                                  customDISK * cpuCusSSD.ssd_price +
                                  customDATAT * 1 -
                                  (cpuCusSSD.custom_discount *
                                    (customCPU * cpuCusSSD.cpu_rate +
                                      customRAM * cpuCusSSD.ram_rate +
                                      customDISK * cpuCusSSD.ssd_price +
                                      customDATAT * 1)) /
                                    100
                              : diskType == "nvme"
                              ? customCPU * cpuCusNVM.cpu_rate +
                                customRAM * cpuCusNVM.ram_rate +
                                customDISK * cpuCusNVM.nvme_price +
                                customDATAT * 1 -
                                (cpuCusNVM.custom_discount *
                                  (customCPU * cpuCusNVM.cpu_rate +
                                    customRAM * cpuCusNVM.ram_rate +
                                    customDISK * cpuCusNVM.nvme_price +
                                    customDATAT * 1)) /
                                  100
                              : customCPU * cpuCusHDD.cpu_rate +
                                customRAM * cpuCusHDD.ram_rate +
                                customDISK * cpuCusHDD.hdd_rate +
                                customDATAT * 1 -
                                (cpuCusHDD.custom_discount *
                                  (customCPU * cpuCusHDD.cpu_rate +
                                    customRAM * cpuCusHDD.ram_rate +
                                    customDISK * cpuCusHDD.hdd_rate +
                                    customDATAT * 1)) /
                                  100;
                          } else if (configType === 3) {
                            return diskType == "ssd"
                              ? customCPU * ramCusSSD.cpu_rate +
                                  customRAM * ramCusSSD.ram_rate +
                                  customDISK * ramCusSSD.ssd_price +
                                  customDATAT * 1 -
                                  (ramCusSSD.custom_discount *
                                    (customCPU * ramCusSSD.cpu_rate +
                                      customRAM * ramCusSSD.ram_rate +
                                      customDISK * ramCusSSD.ssd_price +
                                      customDATAT * 1)) /
                                    100
                              : diskType == "nvme"
                              ? customCPU * ramCusNVM.cpu_rate +
                                customRAM * ramCusNVM.ram_rate +
                                customDISK * ramCusNVM.nvme_price +
                                customDATAT * 1 -
                                (ramCusNVM.custom_discount *
                                  (customCPU * ramCusNVM.cpu_rate +
                                    customRAM * ramCusNVM.ram_rate +
                                    customDISK * ramCusNVM.nvme_price +
                                    customDATAT * 1)) /
                                  100
                              : customCPU * ramCusHDD.cpu_rate +
                                customRAM * ramCusHDD.ram_rate +
                                customDISK * ramCusHDD.hdd_rate +
                                customDATAT * 1 -
                                (ramCusHDD.custom_discount *
                                  (customCPU * ramCusHDD.cpu_rate +
                                    customRAM * ramCusHDD.ram_rate +
                                    customDISK * ramCusHDD.hdd_rate +
                                    customDATAT * 1)) /
                                  100;
                          } else {
                            return 0; // Default to 0 if configType doesn't match
                          }
                        };

                        return currencyReturn({
                          price: totalPrice(),
                          symbol: localStorage.getItem("PrefCurrency"),
                          rates: appCurrency,
                        });
                      })()}
                    </>
                  ) : (
                    currencyReturn({
                      price:
                        selectedTransfers === "GB"
                          ? value * cdnGBPrice * 1024
                          : value * cdnTBPrice * 1024,
                      symbol: localStorage.getItem("PrefCurrency"),
                      rates: appCurrency,
                    })
                    // <>₹ {value * 1024}</>
                  )}
                </div>
                {activePage === "Custom Configure" ? (
                  <>
                    <div
                      className="buttons-container"
                      style={{ padding: "15px", marginTop: "-14rem" }}
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
                          }}
                        >
                          {title}
                        </Button>
                      ))}
                    </div>

                    <div
                      className="title-box-pricing"
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
                          marginTop: "45px",
                        }}
                      >
                        vCPU
                      </h6>
                      <h6
                        style={{
                          textAlign: "center",
                          fontSize: "30px",
                          fontWeight: "800",
                          marginTop: "85px",
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
                          fontSize: "24px",
                          position: "relative",
                          marginTop: "80px",
                        }}
                      >
                        <select
                          name="plan_time"
                          value={diskType}
                          style={{
                            borderRadius: "30px",
                            padding: "5px",

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
                          <option value="hdd" selected>
                            HDD Disk
                          </option>
                          <option value="ssd" selected>
                            SSD Disk
                          </option>
                          <option value="nvme" selected>
                            NVMe Disk
                          </option>
                        </select>
                      </div>

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
                        marginLeft: "19rem",
                        // display: "flex",
                        position: "relative",
                        marginTop: "-30rem",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                      }}
                    >
                      {/* CPU */}
                      <div>
                        <div className="range-slider">
                          <div
                            className="tooltip-horz"
                            style={{ left: `${(customCPU * 100) / 32}%` }}
                          >
                            {customCPU} Core
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
                            className="custom-rangeInput"
                            style={{
                              background: `linear-gradient(to right, #e97730 ${
                                (customCPU * 100) / 32
                              }%, #ddd ${(customCPU * 100) / 32}%)`,
                            }}
                          />
                        </div>
                      </div>
                      {/* RAM */}
                      <div>
                        <div
                          className="range-slider"
                          style={{ marginTop: "70px" }}
                        >
                          <div
                            className="tooltip-horz"
                            style={{ left: `${(customRAM * 100) / 510}%` }}
                          >
                            {customRAM} GB
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="510"
                            value={customRAM}
                            onChange={(event) => {
                              setCustomRAM(event.target.value);
                              //console.log(event.target.value);
                              setSelectedRAM(event.target.value);
                            }}
                            className="custom-rangeInput"
                            style={{
                              background: `linear-gradient(to right, #e97730 ${
                                (customRAM * 100) / 510
                              }%, #ddd ${(customRAM * 100) / 510}%)`,
                            }}
                          />
                        </div>
                        {/* <RangeSlider /> */}
                      </div>
                      {/* customDISK */}
                      <div>
                        <div
                          className="range-slider"
                          style={{ marginTop: "60px" }}
                        >
                          <div
                            className="tooltip-horz"
                            style={{
                              left: `${
                                (customDISK * 100) /
                                (diskType == "hdd" ? 10000 : 5000)
                              }%`,
                            }}
                          >
                            {customDISK} GB
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
                            className="custom-rangeInput"
                            style={{
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
                        {/* <RangeSlider /> */}
                      </div>
                      {/* customDATAT */}
                      <div>
                        <div
                          className="range-slider"
                          style={{ marginTop: "45px" }}
                        >
                          <div
                            className="tooltip-horz"
                            style={{ left: `${(customDATAT * 100) / 32}%` }}
                          >
                            {customDATAT} TB
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
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="title-box-cdn-pricing"
                      style={{
                        backgroundImage: `url(${"/images/frontend/price/server-img.png"})`,
                        backgroundPosition: "center",
                        height: "30px",
                        marginTop: "-8rem",
                      }}
                    >
                      <h6
                        style={{
                          textAlign: "center",
                          fontSize: "25px",
                          fontWeight: "800",
                          marginTop: "30px",
                        }}
                      >
                        CDN
                        <p>Bandwidth</p>
                      </h6>
                      <div
                        className="multi-select-container"
                        style={{
                          marginLeft: "13rem",
                          marginTop: "-11rem",
                        }}
                      >
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
                    </div>

                    <div
                      style={{
                        width: "85%",
                        height: "200px",
                        marginLeft: "15rem",
                        marginTop: "-8rem",
                      }}
                    >
                      <div
                        style={{
                          marginLeft: "-15px",
                          marginRight: "-10px",
                          marginTop: "0px",
                          marginBottom: "-10px",
                        }}
                      >
                        <div className="range-slider">
                          <div
                            className="tooltip-horz"
                            style={{ left: `${value}%` }}
                          >
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
                      </div>
                    </div>

                    {/* <div
                      style={{
                        marginLeft: "19rem",
                        // display: "flex",
                        position: "relative",
                        marginTop: "-5rem",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                      }}
                    >
                      {/* CDN }
                      <div>
                        <div className="range-slider">
                          <div
                            className="tooltip-horz"
                            style={{ left: `${value}%` }}
                          >
                            {/* <FaChevronDown />}
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
                    </div> */}
                  </>
                )}
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

export default PricingPage;
