import React, { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import "./ProductDetails.css";
import PageControl from "./PageControl";
import { useAuth } from "../AuthContext";
import instance, {
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "../Api";
import Loader from "./common/Loader";
import { useLocation } from "react-router-dom";

const ProductDetailsUbantu = (props) => {
  const location = useLocation();
  const { isMobile } = props;
  const { appCurrency } = useAuth();
  const totalPages = 2;
  const scrollThreshold = 0.5; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBtn, setSelectedBtn] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sHddStocks, setSHddStocks] = useState(null);
  const [sSsdStocks, setSSsdStocks] = useState(null);
  const [sNvmStocks, setSNvmStocks] = useState(null);

  const [cHddStocks, setCHddStocks] = useState(null);
  const [cSsdStocks, setCSsdStocks] = useState(null);
  const [cNvmStocks, setCNvmStocks] = useState(null);

  const [rHddStocks, setRHddStocks] = useState(null);
  const [rSsdStocks, setRSsdStocks] = useState(null);
  const [rNvmStocks, setRNvmStocks] = useState(null);

  const [sHdd, setSHdd] = useState(null);
  const [sSsd, setSSsd] = useState(null);
  const [sNvm, setSNvm] = useState(null);

  const [cHdd, setCHdd] = useState(null);
  const [cSsd, setCSsd] = useState(null);
  const [cNvm, setCNvm] = useState(null);

  const [rHdd, setRHdd] = useState(null);
  const [rSsd, setRSsd] = useState(null);
  const [rNvm, setRNvm] = useState(null);

  const [diskType, setDisktype] = useState("ssd");

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: (page - 1) * window.innerHeight,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    CreateVm();

    console.log(location.state && location.state.tab, "tab");
    if (location.state && location.state.tab) {
      setSelectedBtn(location.state.tab);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, totalPages, location.state]);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const pageHeight = window.innerHeight;
    const nextPage = Math.ceil(
      (scrollPosition + pageHeight * scrollThreshold) / pageHeight
    );

    if (nextPage >= 1 && nextPage <= totalPages && nextPage !== currentPage) {
      setCurrentPage(nextPage);
    }
  };

  const InnovativeSolutionsArr = [
    {
      title: "Vertical Scaling",
      desc: "Vertical cloud scaling boosts your server's performance by upgrading its resources, ensuring it handles increased demand seamlessly. It simplifies management and offers a straightforward way to enhance your system's capabilities. Ideal for resource-Proactive applications, it provides an efficient and powerful solution to meet your growing needs.",
      img: "/images/cpu-white.png",
    },
    {
      title: "VPC Enabled",
      desc: "A Virtual Private Cloud (VPC) offers enhanced security and customization by isolating your network and allowing precise control over traffic and access. It provides flexibility to scale resources as needed and integrates seamlessly with other cloud services. With a VPC, you get a secure, adaptable, and cost-effective solution tailored to your specific needs.",
      img: "/images/performance-white.png",
    },
    {
      title: "Scanner Enabled",
      desc: "A scanner enhances server security by protecting against malware and viruses, ensuring your data stays safe and your server runs smoothly. It minimizes downtime by catching threats early, keeping operations uninterrupted. Plus, it helps meet compliance standards, providing peace of mind with reliable protection.",
      img: "/images/scalable-white.png",
    },
    {
      title: "High Bandwidth Enabled",
      desc: "A high bandwidth server boosts performance by managing large data volumes and high traffic smoothly. It enhances user experience with reduced latency and fast load times, ensuring seamless interactions. Plus, it scales effortlessly to meet growing demands, supporting your expanding business needs efficiently.",
      img: "/images/bandwidth-white.png",
    },
    {
      title: "Customized Server",
      desc: "A customized server delivers optimized performance tailored to your unique needs, ensuring efficient handling of your workloads. It offers cost efficiency by providing only the resources you need, avoiding over-provisioning. Plus, it’s flexible and scalable, easily adapting to your business's growth and changing requirements.",
      img: "/images/secure-01-white.png",
    },
    {
      title: "intuitive dashboard",
      desc: "An intuitive dashboard makes managing your systems effortless with easy navigation and clear data visualization. It delivers quick insights, empowering faster decision-making and better understanding of key metrics. Enhance productivity by consolidating information in one place, streamlining your workflow and boosting efficiency",
      img: "/images/windows-cloud.svg",
    },
  ];

  const standardArr = [
    {
      title: "Standard Linux Server",
      topPrice: `${currencyReturn({
        price: 10.81,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 0.48,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "1 CPU",
      RAM: "40 GB RAM",
      hdd: "40 GB SSD Disk",
      data: "1 TB Bandwidth",
    },
    {
      title: "Standard Linux Server",
      topPrice: `${currencyReturn({
        price: 14.71,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 0.48,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "1 CPU",
      RAM: "60 GB RAM",
      hdd: "60 GB SSD Disk",
      data: "2 TB Bandwidth",
    },
    {
      title: "Standard Linux Server",
      topPrice: `${currencyReturn({
        price: 21.62,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 0.72,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "2 CPU",
      RAM: "80 GB RAM",
      hdd: "80 GB SSD Disk",
      data: "2 TB Bandwidth",
    },
    {
      title: "Standard Linux Server",
      topPrice: `${currencyReturn({
        price: 28.22,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 0.96,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "2 CPU",
      RAM: "100 GB RAM",
      hdd: "100 GB SSD Disk",
      data: "3 TB Bandwidth",
    },
  ];
  const cpuArr = [
    {
      title: "Linux CPU Proactive VMs",
      topPrice: `${currencyReturn({
        price: 50.4,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 0.07,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "4 CPU",
      RAM: "100 GB RAM",
      hdd: "100 GB SSD Disk",
      data: "4 TB Bandwidth",
    },
    {
      title: "Linux CPU Proactive VMs",
      topPrice: `${currencyReturn({
        price: 95.47,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 0.13,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "8 CPU",
      RAM: "200 GB RAM",
      hdd: "200 GB SSD Disk",
      data: "8 TB Bandwidth",
    },
    {
      title: "Linux CPU Proactive VMs",
      topPrice: `${currencyReturn({
        price: 140.51,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 0.2,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "12 CPU",
      RAM: "300 GB RAM",
      hdd: "300 GB SSD Disk",
      data: "10 TB Bandwidth",
    },
    {
      title: "Linux CPU Proactive VMs",
      topPrice: `${currencyReturn({
        price: 206.56,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 0.29,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "16 CPU",
      RAM: "480 GB RAM",
      hdd: "480 GB SSD Disk",
      data: "15 TB Bandwidth",
    },
  ];
  const RAMArr = [
    {
      title: "RAM Proactive Server",
      topPrice: `${currencyReturn({
        price: 80.46,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 2.64,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "4 CPU",
      RAM: "240 GB RAM",
      hdd: "240 GB SSD Disk",
      data: "4 TB Bandwidth",
    },
    {
      title: "RAM Proactive Server",
      topPrice: `${currencyReturn({
        price: 150.11,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 5.4,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "8 CPU",
      RAM: "300 GB RAM",
      hdd: "300 GB SSD Disk",
      data: "8 TB Bandwidth",
    },
    {
      title: "RAM Proactive Server",
      topPrice: `${currencyReturn({
        price: 270.11,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 9.12,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "12 CPU",
      RAM: "480 GB RAM",
      hdd: "480 GB SSD Disk",
      data: "10 TB Bandwidth",
    },
    {
      title: "RAM Proactive Server",
      topPrice: `${currencyReturn({
        price: 389.7,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / Month`,
      price: `${currencyReturn({
        price: 12.96,
        symbol: localStorage.getItem("PrefCurrency"),
        rates: appCurrency,
      })} / day`,
      cpu: "16 CPU",
      RAM: "650 GB RAM",
      hdd: "650 GB SSD Disk",
      data: "15 TB Bandwidth",
    },
  ];

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
      console.log(userDetails, "====loginUserResponse");

      const vm = userDetails.vms;
      const moniters_machine = userDetails.mergedData;

      const vmArray = Object.keys(moniters_machine).map(
        (key) => moniters_machine[key]
      );

      let stdHdd = [];
      let stdSsd = [];
      let stdNvm = [];

      let cpuHdd = [];
      let cpuSsd = [];
      let cpuNvm = [];

      let RAMHdd = [];
      let RAMSsd = [];
      let RAMNvm = [];

      let standardList = [];
      let cpuList = [];
      let RAMList = [];

      vmArray.forEach((item) => {
        const { cid, ...rest } = item;
        if (cid === 1) {
          standardList.push({ cid, ...rest });
          stdHdd.push({ cid, ...rest });
        } else if (cid === 3) {
          cpuList.push({ cid, ...rest });
          cpuHdd.push({ cid, ...rest });
        } else if (cid === 4) {
          RAMList.push({ cid, ...rest });
          RAMHdd.push({ cid, ...rest });
        } else if (cid === 5) {
          stdSsd.push({ cid, ...rest });
        } else if (cid === 6) {
          stdNvm.push({ cid, ...rest });
        } else if (cid === 7) {
          cpuSsd.push({ cid, ...rest });
        } else if (cid === 8) {
          cpuNvm.push({ cid, ...rest });
        } else if (cid === 9) {
          RAMSsd.push({ cid, ...rest });
        } else if (cid === 10) {
          RAMNvm.push({ cid, ...rest });
        }
      });

      setSSsd(stdSsd);
      setSHdd(stdHdd);
      setSNvm(stdNvm);

      setCSsd(cpuSsd);
      setCHdd(cpuHdd);
      setCNvm(cpuNvm);

      setRSsd(RAMSsd);
      setRHdd(RAMHdd);
      setRNvm(RAMNvm);

      // setStandardList(standardList);
      // setCPUList(cpuList);
      // setRAMList(RAMList);

      const stocks = userDetails.stocks;

      let stdHddStocks = [];
      let stdSsdStocks = [];
      let stdNvmStocks = [];

      let cpuHddStocks = [];
      let cpuSsdStocks = [];
      let cpuNvmStocks = [];

      let RAMHddStocks = [];
      let RAMSsdStocks = [];
      let RAMNvmStocks = [];

      stocks.forEach((item) => {
        const { cid, ...rest } = item;
        if (cid === 1) {
          stdHddStocks.push({ cid, ...rest });
        } else if (cid === 3) {
          cpuHddStocks.push({ cid, ...rest });
        } else if (cid === 4) {
          RAMHddStocks.push({ cid, ...rest });
        } else if (cid === 5) {
          stdSsdStocks.push({ cid, ...rest });
        } else if (cid === 6) {
          stdNvmStocks.push({ cid, ...rest });
        } else if (cid === 7) {
          cpuSsdStocks.push({ cid, ...rest });
        } else if (cid === 8) {
          cpuNvmStocks.push({ cid, ...rest });
        } else if (cid === 9) {
          RAMSsdStocks.push({ cid, ...rest });
        } else if (cid === 10) {
          RAMNvmStocks.push({ cid, ...rest });
        }
      });

      setSHddStocks(stdHddStocks);
      setSSsdStocks(stdSsdStocks);
      setSNvmStocks(stdNvmStocks);
      setCHddStocks(cpuHddStocks);
      setCSsdStocks(cpuSsdStocks);
      setCNvmStocks(cpuNvmStocks);
      setRHddStocks(RAMHddStocks);
      setRSsdStocks(RAMSsdStocks);
      setRNvmStocks(RAMNvmStocks);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          minHeight: "100%",
          position: "relative",
          backgroundImage: isMobile
            ? `url(./main-bg.jpg)`
            : `url(./main-bg.jpg)`,
          backgroundSize: "cover",
          // backgroundPosition: "center",
          // backgroundColor: "#141414",
          backgroundRepeat: "round",
          backgroundBlendMode: "overlay",
        }}
      >
        {isMobile ? (
          <>
            <div
              style={{
                width: "100% !important",
                paddingBottom: "10px",
                justifyContent: "center",
              }}
            >
              <div
                className="tabs-pd"
                style={{ marginTop: "3rem", marginLeft: "0px" }}
              >
                <div
                  className="heading-pd"
                  style={{
                    fontSize: "20px",
                    marginBottom: "5px",
                    marginLeft: "-5px",
                  }}
                >
                  {selectedBtn == 1
                    ? "Standard"
                    : selectedBtn == 2
                    ? "CPU Proactive"
                    : "RAM Proactive"}{" "}
                  <span> Linux Servers</span>
                </div>
                <Button
                  className="tablinks-mobile"
                  style={{
                    color: selectedBtn === 1 ? "#ffd8bb" : "#154e7a",
                    backgroundColor: selectedBtn === 1 ? "#154e7a" : "#ffd8bb",
                    marginLeft: "15px",
                  }}
                  onClick={() => setSelectedBtn(1)}
                >
                  Standard
                </Button>
                <Button
                  className="tablinks-mobile"
                  style={{
                    color: selectedBtn === 2 ? "#ffd8bb" : "#154e7a",
                    backgroundColor: selectedBtn === 2 ? "#154e7a" : "#ffd8bb",
                  }}
                  onClick={() => setSelectedBtn(2)}
                >
                  CPU Proactive
                </Button>
                <Button
                  className="tablinks-mobile"
                  style={{
                    color: selectedBtn === 3 ? "#ffd8bb" : "#154e7a",
                    backgroundColor: selectedBtn === 3 ? "#154e7a" : "#ffd8bb",
                  }}
                  onClick={() => setSelectedBtn(3)}
                >
                  {" "}
                  RAM Proactive
                </Button>
                <div
                  className=""
                  style={{ marginLeft: "15px", marginRight: "15px" }}
                >
                  <p
                    className="description-solution-product"
                    style={{
                      marginTop: "20px",
                      fontSize: "16px",
                      fontFamily: "Lexend Deca",
                      color: "#4d4c4c",
                    }}
                  >
                    {selectedBtn == 1
                      ? "The Standard Server offered by UPNETCLOUD provides a reliable and scalable hosting solution tailored for businesses of all sizes. With robust hardware and high-performance specifications, it ensures optimal performance for your applications and websites. Enhanced security features and 24/7 support offer peace of mind, ensuring your online presence is always accessible and secure. Whether you're running a small website or a large application, UPNETCLOUD's Standard Server effectively meets diverse requirements."
                      : selectedBtn == 2
                      ? "The CPU Optimized Server offered by UPNETCLOUD is meticulously designed for applications that demand superior processing power and efficiency. Featuring cutting-edge CPU configurations, it excels at handling computation-heavy tasks, including data analysis, gaming, and application hosting. This server is perfect for businesses requiring dependable processing capabilities to manage demanding workloads effortlessly."
                      : "The RAM Optimized Server from UPNETCLOUD is designed for applications requiring high RAM performance and speed. With increased RAM capacity, it ensures faster data processing and improved multitasking capabilities, making it ideal for resource-Proactive tasks such as database management and real-time analytics. This server configuration enhances application responsiveness and supports seamless user experiences."}
                  </p>
                </div>
                <div className="package-container">
                  <div
                    style={{
                      position: "relative",
                      color: "#154e7a",
                      fontSize: "40px",
                      textTransform: "capitalize",
                      fontWeight: "600",
                    }}
                  >
                    Choose your
                  </div>
                  <div class="sub-heading">
                    high performance{" "}
                    {selectedBtn == 1
                      ? "Standard Servers"
                      : selectedBtn == 2
                      ? "CPU Proactive"
                      : "RAM Proactive"}
                  </div>
                  <div
                    className="wallet-box"
                    style={{
                      marginTop: "20px",
                      height: "40rem",
                      // width: "80%",
                      //marginLeft: "20rem",
                    }}
                  >
                    {selectedBtn == 1 ? (
                      <>
                        {diskType == "ssd" ? (
                          <>
                            {sSsd &&
                              sSsd.map((item, idx) => (
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">Standard</span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
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
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">Standard</span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
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
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">Standard</span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </>
                        )}
                      </>
                    ) : selectedBtn == 2 ? (
                      <>
                        {diskType == "ssd" ? (
                          <>
                            {cSsd &&
                              cSsd.map((item, idx) => (
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">
                                        CPU Proactive
                                      </span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                            setDisktype(e.target.value);
                                          }}
                                        >
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
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
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
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">
                                        CPU Proactive
                                      </span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                            setDisktype(e.target.value);
                                          }}
                                        >
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
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
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
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">
                                        CPU Proactive
                                      </span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                            setDisktype(e.target.value);
                                          }}
                                        >
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
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
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
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">
                                        RAM Proactive
                                      </span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                            setDisktype(e.target.value);
                                          }}
                                        >
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
                                      </div>
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
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
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">
                                        RAM Proactive
                                      </span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                            setDisktype(e.target.value);
                                          }}
                                        >
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
                                      </div>
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
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
                                <div className="" style={{ marginTop: "25px" }}>
                                  <div className="package-top bg-gradient-white">
                                    <div className="top-head-pd see-white-text">
                                      <img
                                        src="/images/title-bg-orange.png"
                                        alt="Title Background Orange"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/title-bg-white.png"
                                        alt="Title Background White"
                                      />
                                      <span className="plan-typ">
                                        RAM Proactive
                                      </span>
                                    </div>
                                    <div className="top-body theme-color-blue">
                                      <div className="mob-bg">
                                        {/* <div className="price-pd">
                                          {item.topPrice}
                                        </div> */}
                                        {/* <div className="or-bg">or</div> */}
                                        <div className="time">
                                          {" "}
                                          {currencyReturn({
                                            price:
                                              item.ssd_price * item.hdd +
                                              item.cpu_rate * item.cpu +
                                              item.ram * item.ram_rate,
                                            symbol:
                                              localStorage.getItem(
                                                "PrefCurrency"
                                              ),
                                            rates: appCurrency,
                                          })}
                                          <span> Month </span>
                                        </div>
                                        <div className="time">
                                          {" "}
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
                                    </div>
                                  </div>
                                  <div className="package-bottom">
                                    <figure>
                                      <img
                                        src="/images/box-bg-white.png"
                                        alt="Box Background White"
                                      />
                                      <img
                                        className="hover-img"
                                        src="/images/orange-box-bg.png"
                                        alt="Orange Box Background"
                                      />
                                    </figure>
                                    <div
                                      className="package-cont"
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <div className="price-pd">
                                        {" "}
                                        {item.cpu} vCPU
                                      </div>
                                      <div className="price-pd">
                                        {" "}
                                        {item.ram} GB RAM
                                      </div>
                                      <div className="price-pd">
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
                                            setDisktype(e.target.value);
                                          }}
                                        >
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
                                      </div>
                                      <div className="price-pd">
                                        {item.data_transfer} TB Bandwidth
                                      </div>
                                      <div className="price-pd">
                                        <div
                                          className="log-in"
                                          style={{
                                            marginTop: "15px",
                                            marginLeft: "-8rem",
                                            justifyContent: "center",
                                          }}
                                          // onClick={() => UpdateInfo()}
                                        >
                                          <a
                                            className="media-link"
                                            href="/signUp"
                                          >
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
                                                src="/images/blue-btn-big.png"
                                                alt=""
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <img
                                                className="hover-img-banner"
                                                src="/images/orange-btn-big.png"
                                                alt="/images/orange-btn-big.png"
                                                style={{
                                                  marginTop: "-6px",
                                                  width: "10rem",
                                                  height: "50px",
                                                }}
                                              />
                                              <span
                                                className="login-text"
                                                style={{
                                                  fontSize: "20px",
                                                  color: "white",
                                                  marginTop: "-8px",
                                                }}
                                              >
                                                Buy Now
                                              </span>
                                            </div>
                                          </a>
                                        </div>
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
                  <div
                    style={{
                      marginTop: "5rem",
                    }}
                  >
                    <div
                      className="heading-dotted-product"
                      style={{ fontSize: "30px" }}
                    >
                      Benefits of UpnetCloud <span></span>
                    </div>

                    <div
                      className="solution-posts-inner"
                      style={{
                        marginLeft: "2rem",
                        marginRight: "2rem",
                        marginTop: "5rem",
                        // width: "100%",
                        marginBottom: "5rem",
                      }}
                    >
                      {InnovativeSolutionsArr.map((item, index) => (
                        <div className="solution-post">
                          <div
                            style={{
                              backgroundImage:
                                "linear-gradient(#FFFFFF, #EFEFEF)",
                              borderRadius: "15px",
                            }}
                          >
                            <div
                              className="solution-card-solution"
                              key={index}
                              style={{
                                height: "18rem",
                                // marginLeft: "15px",
                                // marginRight: "15px",
                              }}
                            >
                              <div
                                className="in-border"
                                style={{
                                  alignContent: "center",
                                  height: "90px",
                                  width: "90px",
                                  // padding: "5px",
                                  borderColor: "yellow",
                                  border: "2px solid #E97730",
                                  borderRadius: "50%",
                                  // display: "table",
                                  margin: "auto",
                                  backgroundColor: "transparent",
                                  marginTop: "-55%",
                                  padding: "0",
                                  position: "relative",
                                  top: "2rem",
                                }}
                              >
                                <div
                                  className="in-border"
                                  style={{
                                    height: "80px",
                                    width: "80px",
                                    padding: "10px",
                                    borderColor: "yellow",
                                    border: "2px solid #E97730",
                                    borderRadius: "50%",
                                    // display: "table",
                                    margin: "auto",
                                    backgroundColor: "#E97730",
                                  }}
                                >
                                  <figure>
                                    <img src={item.img} alt={item.img} />
                                  </figure>
                                </div>
                              </div>
                              <div className="content-solution">
                                <h3
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    color: "#2D394B",
                                    textAlign: "center",
                                    margin: "35px 0 10px",
                                  }}
                                >
                                  {item.title}
                                </h3>
                                <p className="description-solution-product">
                                  {item.desc}
                                </p>
                              </div>
                              {/* <div
                              // className="log-in"
                              style={{ justifyContent: "center" }}
                            >
                              <a href="/blogmore" className="media-link">
                                <div
                                  className="media-banner"
                                  style={{ width: "auto" }}
                                >
                                  <img
                                    className="normal-banner"
                                    src="/images/read-more-btn.png"
                                    alt=""
                                  />
                                  <img
                                    className="hover-img-banner"
                                    src={"/images/orange-btn.png"}
                                    alt=""
                                  />
                                  <span
                                    className="login-text"
                                    style={{
                                      fontSize: "20px",
                                      color: "white",
                                      top: "46%",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.color = "#07528B")
                                    } // Change color on hover
                                    onMouseOut={(e) =>
                                      (e.target.style.color = "white")
                                    }
                                  >
                                    Read More
                                  </span>
                                </div>
                              </a>
                            </div> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Row>
              <div className="col-md-2"></div>
              <div
                className="product1-top see-full-pd col-md-10"
                style={{ marginTop: "5rem", marginLeft: "10rem" }}
              >
                <div className="product1-left see-pd-6">
                  {" "}
                  <div className="mob-center">
                    <div className="media-pd">
                      <img src="/images/Icons8_flat_linux.svg" alt="" />
                    </div>
                    <div className="heading-pd">
                      {selectedBtn == 1
                        ? "Standard"
                        : selectedBtn == 2
                        ? "CPU Proactive"
                        : "RAM Proactive"}{" "}
                      <span> Linux Servers</span>
                    </div>
                  </div>
                  {/* <div className="tabs-pd mobile-pd">
                  <Button className="tablinks">Standard</Button>
                  <Button className="tablinks">Standard</Button>
                  <Button className="tablinks">Standard</Button>
                </div> */}
                </div>
                <div className="product1-left see-pd-6">
                  <p
                    className="description-solution-product"
                    style={{ marginTop: "50px", fontSize: "16px" }}
                  >
                    {selectedBtn == 1
                      ? "The Standard Server offered by UPNETCLOUD provides a reliable and scalable hosting solution tailored for businesses of all sizes. With robust hardware and high-performance specifications, it ensures optimal performance for your applications and websites. Enhanced security features and 24/7 support offer peace of mind, ensuring your online presence is always accessible and secure. Whether you're running a small website or a large application, UPNETCLOUD's Standard Server effectively meets diverse requirements."
                      : selectedBtn == 2
                      ? "The CPU Optimized Server offered by UPNETCLOUD is meticulously designed for applications that demand superior processing power and efficiency. Featuring cutting-edge CPU configurations, it excels at handling computation-heavy tasks, including data analysis, gaming, and application hosting. This server is perfect for businesses requiring dependable processing capabilities to manage demanding workloads effortlessly."
                      : "The RAM Optimized Server from UPNETCLOUD is designed for applications requiring high RAM performance and speed. With increased RAM capacity, it ensures faster data processing and improved multitasking capabilities, making it ideal for resource-Proactive tasks such as database management and real-time analytics. This server configuration enhances application responsiveness and supports seamless user experiences."}
                  </p>
                </div>
              </div>
              <div className="product1-bottom see-full-pd">
                <div className="tabs-pd">
                  {/* #ffd8bb #154e7a */}
                  <Button
                    className="tablinks"
                    style={{
                      color: selectedBtn === 1 ? "#ffd8bb" : "#154e7a",
                      backgroundColor:
                        selectedBtn === 1 ? "#154e7a" : "#ffd8bb",
                    }}
                    onClick={() => setSelectedBtn(1)}
                  >
                    Standard
                  </Button>
                  <Button
                    className="tablinks"
                    style={{
                      color: selectedBtn === 2 ? "#ffd8bb" : "#154e7a",
                      backgroundColor:
                        selectedBtn === 2 ? "#154e7a" : "#ffd8bb",
                    }}
                    onClick={() => setSelectedBtn(2)}
                  >
                    CPU Proactive
                  </Button>
                  <Button
                    className="tablinks"
                    style={{
                      color: selectedBtn === 3 ? "#ffd8bb" : "#154e7a",
                      backgroundColor:
                        selectedBtn === 3 ? "#154e7a" : "#ffd8bb",
                    }}
                    onClick={() => setSelectedBtn(3)}
                  >
                    {" "}
                    RAM Proactive
                  </Button>
                </div>
              </div>
              <div className="package-container">
                <div
                  style={{
                    position: "relative",
                    color: "#154e7a",
                    fontSize: "40px",
                    textTransform: "capitalize",
                    fontWeight: "600",
                  }}
                >
                  Choose your
                </div>
                <div class="sub-heading">
                  high performance{" "}
                  {selectedBtn == 1
                    ? "Standard Servers"
                    : selectedBtn == 2
                    ? "CPU Proactive"
                    : "RAM Proactive"}
                </div>
              </div>
              {/* <div className="wallet-container"> */}
              <div
                className="wallet-box"
                style={{
                  marginTop: "30px",
                  height: "25rem",
                  width: "80%",
                  marginLeft: "18rem",
                }}
              >
                {selectedBtn == 1 ? (
                  <>
                    {diskType == "ssd" ? (
                      <>
                        {sSsd &&
                          sSsd.map((item, idx) => (
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Standard
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.ssd_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
                                          // color:
                                          //   selectedIdx === idx
                                          //     ? "#fff"
                                          //     : "#545454",
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
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
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Standard
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.nvme_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
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
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Standard
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.nvme_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </>
                    )}
                  </>
                ) : selectedBtn == 2 ? (
                  <>
                    {diskType == "ssd" ? (
                      <>
                        {cSsd &&
                          cSsd.map((item, idx) => (
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    CPU Proactive
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.ssd_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
                                          // color:
                                          //   selectedIdx === idx
                                          //     ? "#fff"
                                          //     : "#545454",
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                        setDisktype(e.target.value);
                                      }}
                                    >
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
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
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
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    CPU Proactive
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.nvme_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                        setDisktype(e.target.value);
                                      }}
                                    >
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
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
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
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    CPU Proactive
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.nvme_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                        setDisktype(e.target.value);
                                      }}
                                    >
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
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
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
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    RAM Proactive
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.ssd_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
                                          // color:
                                          //   selectedIdx === idx
                                          //     ? "#fff"
                                          //     : "#545454",
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                        setDisktype(e.target.value);
                                      }}
                                    >
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
                                  </div>
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
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
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    RAM Proactive
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.nvme_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                        setDisktype(e.target.value);
                                      }}
                                    >
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
                                  </div>
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
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
                            <div className="package see-3 see-ltb-3 see-tb-3 see-sm-6 see-xsm-12">
                              <div className="package-top bg-gradient-white">
                                <div
                                  className="top-head-pd see-white-text"
                                  style={{ height: "2rem" }}
                                >
                                  <img
                                    src="/images/title-bg-orange.png"
                                    alt="Title Background Orange"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/title-bg-white.png"
                                    alt="Title Background White"
                                    style={{
                                      paddingTop: "20px",
                                      height: "60px",
                                    }}
                                  />
                                  <span
                                    className="plan-typ"
                                    style={{
                                      paddingTop: "45px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    RAM Proactive
                                  </span>
                                </div>
                                <div className="top-body theme-color-blue">
                                  <div className="mob-bg">
                                    {/* <div className="price-pd">
                                      {item.topPrice}
                                    </div> */}
                                    <div
                                      // className="or-bg"
                                      style={{ marginTop: "25px" }}
                                    ></div>

                                    <div className="top-body theme-color-blue">
                                      <div
                                        className="price"
                                        style={{
                                          color: "#154e7a",
                                          textAlign: "center",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {currencyReturn({
                                          price:
                                            item.nvme_price * item.hdd +
                                            item.cpu_rate * item.cpu +
                                            item.ram * item.ram_rate,
                                          symbol:
                                            localStorage.getItem(
                                              "PrefCurrency"
                                            ),
                                          rates: appCurrency,
                                        })}
                                        <span> Month </span>
                                      </div>
                                      <div
                                        className="price"
                                        style={{
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
                                  </div>
                                </div>
                              </div>
                              <div
                                className="package-bottom"
                                style={{
                                  // marginLeft: "12px",
                                  marginTop: "10px",
                                  // width: "14rem",
                                }}
                              >
                                <figure>
                                  <img
                                    src="/images/box-bg-white.png"
                                    alt="Box Background White"
                                  />
                                  <img
                                    className="hover-img"
                                    src="/images/orange-box-bg.png"
                                    alt="Orange Box Background"
                                  />
                                </figure>
                                <div
                                  className="package-cont"
                                  style={{ paddingTop: "20px" }}
                                >
                                  {/* <div className="title">RAM Proactive VMs Servers</div> */}
                                  <div className="price-pd">
                                    {item.cpu} vCPU
                                  </div>
                                  <div className="price-pd">
                                    {item.ram} GB RAM
                                  </div>
                                  {/* <div className="price-pd">{item.hdd}</div> */}
                                  <div className="price-pd">
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
                                        setDisktype(e.target.value);
                                      }}
                                    >
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
                                  </div>
                                  <div className="price-pd">
                                    {" "}
                                    {item.data_transfer} TB Bandwidth
                                  </div>
                                  <div className="price-pd">
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "15px",
                                        marginLeft: "-8rem",
                                        justifyContent: "center",
                                      }}
                                      // onClick={() => UpdateInfo()}
                                    >
                                      <a className="media-link" href="/signUp">
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
                                            src="/images/blue-btn-big.png"
                                            alt=""
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/orange-btn-big.png"
                                            alt="/images/orange-btn-big.png"
                                            style={{
                                              marginTop: "-6px",
                                              width: "10rem",
                                              height: "50px",
                                            }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              fontSize: "20px",
                                              color: "white",
                                              marginTop: "-8px",
                                            }}
                                          >
                                            Buy Now
                                          </span>
                                        </div>
                                      </a>
                                    </div>
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
              {/* </div> */}
              <div
                style={{
                  marginTop: "5rem",
                }}
              >
                <div
                  className="heading-dotted-product"
                  style={{ marginLeft: "19rem", fontSize: "50px" }}
                >
                  Benefits of UpnetCloud <span></span>
                </div>

                <div
                  className="solution-posts-inner"
                  style={{
                    marginLeft: "18rem",
                    marginTop: "2rem",
                    width: "75%",
                    marginBottom: "10rem",
                  }}
                >
                  {InnovativeSolutionsArr.map((item, index) => (
                    <div className="solution-post">
                      <div
                        style={{
                          backgroundImage: "linear-gradient(#FFFFFF, #EFEFEF)",
                          borderRadius: "15px",
                        }}
                      >
                        <div className="solution-card-solution" key={index}>
                          <div
                            className="in-border"
                            style={{
                              alignContent: "center",
                              height: "90px",
                              width: "90px",
                              // padding: "5px",
                              borderColor: "yellow",
                              border: "2px solid #E97730",
                              borderRadius: "50%",
                              // display: "table",
                              margin: "auto",
                              backgroundColor: "transparent",
                              marginTop: "-32%",
                              padding: "0",
                              position: "relative",
                              top: "1rem",
                            }}
                          >
                            <div
                              className="in-border"
                              style={{
                                height: "80px",
                                width: "80px",
                                padding: "10px",
                                borderColor: "yellow",
                                border: "2px solid #E97730",
                                borderRadius: "50%",
                                // display: "table",
                                margin: "auto",
                                backgroundColor: "#E97730",
                              }}
                            >
                              <figure>
                                <img src={item.img} alt={item.img} />
                              </figure>
                            </div>
                          </div>
                          <div className="content-solution">
                            <h3
                              style={{
                                fontSize: "20px",
                                fontWeight: "500",
                                color: "#2D394B",
                                textAlign: "center",
                                margin: "35px 0 10px",
                              }}
                            >
                              {item.title}
                            </h3>
                            <p className="description-solution-product">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Row>
            <PageControl
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
    </>
  );
};

export default ProductDetailsUbantu;
