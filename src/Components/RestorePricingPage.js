import React, { useEffect, useState } from "react";
import { Container, Button, Carousel, Spinner, Row } from "react-bootstrap";
import "./PricingPage.css";
import "./rangSliderVert.css";
import RangeSlider from "./common/RangeSlider";
import { useAuth } from "../AuthContext";
import instance, {
  currencyReturn,
  decryptData,
  apiEncryptRequest,
} from "../Api";

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

const RestorePricingPage = (props) => {
  const { isMobile } = props;
  const { smuser } = useAuth();

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const topButtons = [
    "1 CPU",
    "1 GB RAM",
    "40 GB Disk Space",
    "1 TB Bandwidth",
  ];

  const Pages = ["Restore Pricing"];

  // const innerButtons = ["Standard", "vCPU Intensive", "RAM Intensive"];
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

  const [activePage, setActivePage] = useState("Restore Pricing");
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [finalAmount, setFinalAmount] = useState("0");
  const [value, setValue] = useState(0);
  const [dataTransferValue, setDataTransferValue] = useState("");
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

  const [loading, setLoading] = useState(false);
  const [restorePriceList, setRestorePriceList] = useState([]);

  const labels = ["1 Core", "3925 GB", "111", "124"];
  const maxValues = [50, 4448, 200, 200];

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    restorePriceForNewVM();
  }, []);

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
      setRestorePriceList(loginResponse.restore_price);
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
              Restore Pricing 
              <span></span>
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
              {/* ))} */}
            </div>
            <div
              className="log-in"
              style={{ marginTop: "-2.5rem", marginLeft: "-40px" }}
            >
              <a href="/wallet" className="media-link">
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
                    Add Money
                  </span>
                </div>
              </a>
            </div>
            <div className="active-mobile">Restore Pricing </div>
            <div className="pricing-right">
              ₹{" "}
              {configType === 1 &&
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
                  customDATAT * 1}
              {/* {customCPU * 255 +
                    customRAM * 255 +
                    customDISK * 5 +
                    customDATAT * 1} */}
            </div>
            <div className="tab-box">
              {/* <div className="buttons-container" style={{ padding: "15px" }}>
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
              </div> */}
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
                    padding: "5px",
                    fontSize: "14px",
                    border: "2px solid #e97730",
                    color: "#144e7b",
                    fontWeight: "700",
                    backgroundColor: "transparent",
                  }}
                  onChange={(e) => {
                    // console.log(e.target.value);
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
                  BANDWIDTH
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
                {/* RAM */}

                {/* <Slider
                  key={index}
                  value={dataTran}
                  onChange={(event) =>
                    setDataTran(parseInt(event.target.value, 10))
                  }
                  max={200}
                  label={dataTran}
                /> */}
                {/* ))} */}
              </div>
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
                Restore Pricing <span></span>
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
                style={{ marginTop: "-4.5rem", marginLeft: "73%" }}
              >
                <a href="/wallet" className="media-link">
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
                      Add Money
                    </span>
                  </div>
                </a>
              </div>
              <div
                className="tab-box"
                style={{
                  minHeight:
                    activePage === "Restore Pricing" ? "35rem" : "100px",
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
                      item === "Restore Pricing"
                        ? {
                            paddingTop:
                              activePage === "Restore Pricing"
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
                  <>
                    {(() => {
                      const totalPrice = () => {
                        //if (configType === 1) {
                        return (
                          // customCPU * restorePriceList.cpu_rate +
                          // customRAM * restorePriceList.ram_rate +
                          // customDISK * restorePriceList.hdd_rate +
                          // customDATAT * 1

                          customCPU * restorePriceList.cpu_rate +
                          customRAM * restorePriceList.ram_rate +
                          customDISK * restorePriceList.hdd_rate +
                          customDATAT * 1 -
                          (restorePriceList.custom_discount *
                            (customCPU * restorePriceList.cpu_rate +
                              customRAM * restorePriceList.ram_rate +
                              customDISK * restorePriceList.hdd_rate +
                              customDATAT * 1)) /
                            100
                        );
                        // } else if (configType === 2) {
                        //   return (
                        //     customCPU * 250 +
                        //     customRAM * 250 +
                        //     customDISK * 10 +
                        //     customDATAT * 1
                        //   );
                        // } else if (configType === 3) {
                        //   return (
                        //     customCPU * 275 +
                        //     customRAM * 275 +
                        //     customDISK * 15 +
                        //     customDATAT * 1
                        //   );
                        // } else {
                        //   return 0; // Default to 0 if configType doesn't match
                        // }
                      };

                      return currencyReturn({
                        price: totalPrice(),
                        symbol: localStorage.getItem("PrefCurrency"),
                        rates: appCurrency,
                      });
                    })()}
                  </>
                </div>
                {activePage === "Restore Pricing" ? (
                  <>
                    {/* <div
                      className="buttons-container"
                      style={{ padding: "15px", marginTop: "-7rem" }}
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
                    </div> */}

                    <div
                      className="title-box-pricing"
                      style={{
                        backgroundImage: `url(${"/images/frontend/price/server-img.png"})`,
                        backgroundPosition: "center",
                        marginTop: "-7rem",
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
                            // console.log(e.target.value);
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
                          marginTop: "40px",
                        }}
                      >
                        Bandwidth
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
                      {/* <RangeSlider style={{ padding: "1rem" }} />
                  <RangeSlider />
                  <RangeSlider />
                  <RangeSlider /> */}
                      {/* CORE */}
                      <div>
                        <div className="range-slider">
                          <div
                            className="tooltip-horz"
                            style={{ left: `${(customCPU * 100) / 32}%` }}
                          >
                            {/* <FaChevronDown /> */}
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
                          style={{ marginTop: "60px" }}
                        >
                          <div
                            className="tooltip-horz"
                            style={{ left: `${(customRAM * 100) / 510}%` }}
                          >
                            {/* <FaChevronDown /> */}
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
                          style={{ marginTop: "65px" }}
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
                            {/* <FaChevronDown /> */}
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
                          style={{ marginTop: "30px" }}
                        >
                          <div
                            className="tooltip-horz"
                            style={{ left: `${(customDATAT * 100) / 32}%` }}
                          >
                            {/* <FaChevronDown /> */}
                            {customDATAT} TB
                          </div>
                          ``{" "}
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
                    </div>
                    {
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
                              {/* <FaChevronDown /> */}
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
                          {/* <RangeSlider /> */}
                        </div>
                      </div>
                    }

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
    </div>
  );
};

export default RestorePricingPage;
