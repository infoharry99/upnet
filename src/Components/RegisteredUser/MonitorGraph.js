import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";

import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  decryptData,
} from "../../Api";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const MonitorGraph = () => {
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const navigate = useNavigate();
  const location = useLocation();
  const { smuser } = useAuth();
  const [cpuData, setCPUData] = useState(null);
  const [cpuInfo, setCPUInfo] = useState(null);

  const [diskData, setDISKData] = useState(null);
  const [diskInfo, setDISKInfo] = useState(null);

  const [iNodesData, setINODESData] = useState(null);
  const [inodesInfo, setINodesInfo] = useState(null);

  const [ramData, setRAMData] = useState(null);
  const [ramInfo, setRAMInfo] = useState(null);

  const [resData, setResData] = useState(null);
  const [ioReadData, setIOReadData] = useState(null);
  const [ioWriteData, setIOWriteData] = useState(null);

  const [bandwidthData, setBandwidthResData] = useState(null);
  const [bandwidthInfo, setBandwidthInfo] = useState(null);
  const [bandwidthIn, setBandwidthIn] = useState(null);
  const [bandwidthOut, setBandwidthOut] = useState(null);
  const [bandwidthPercent, setBandwidthPercent] = useState(null);

  const [monthlyUsage, setMonthlyUsage] = useState([]);

  const [networkData, setNetworkData] = useState([]);

  const [loading, setLoading] = useState(true);
  // const [vmData, setVmData] = useState(null);
  const vm_data = location.state ? location.state.vm_data : null;
  const [stats, setStats] = useState({ limit: 0, utilized: 0 });

  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [activeButton, setActiveButton] = useState("Overview");
  const [activeGraphButton, setActiveGraphBtn] = useState("System");

  const [monthlyRawData, setMonthlyRawData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterCPUData, setFiltCPU] = useState([]);
  const [filterNetworkData, setFiltNetwork] = useState([]);
  const [filterDiskData, setFiltDISK] = useState([]);
  const [filterRAMData, setFiltRAM] = useState([]);
  const [filterIOReadData, setFiltIORead] = useState([]);
  const [filterIOWriteData, setFiltIOWrite] = useState([]);
  const [filterINodeData, setFiltINode] = useState([]);
  const [filterBandwidthData, setFiltBandwidth] = useState([]);

  const cpuDatas = [
    { time: "1", percent: 3 },
    { time: "2", percent: 4 },
    { time: "3", percent: 3.5 },
    { time: "4", percent: 6 },
    { time: "5", percent: 12.5 },
    { time: "6", percent: 8 },
    { time: "7", percent: 3.2 },
  ];

  const networkDatas = [
    { time: "1", total: 20000, download: 12000, upload: 8000 },
    { time: "2", total: 30000, download: 15000, upload: 15000 },
    { time: "3", total: 50000, download: 32000, upload: 18000 },
    { time: "4", total: 45000, download: 25000, upload: 20000 },
    { time: "5", total: 70000, download: 40000, upload: 30000 },
  ];

  const monthlyData = [
    { month: "Jan", in: 0, out: 0 },
    { month: "Feb", in: 780, out: 20 },
    { month: "Mar", in: 400, out: 10 },
    { month: "Apr", in: 100, out: 20 },
    { month: "May", in: 200, out: 50 },
    { month: "Jun", in: 150, out: 40 },
    { month: "Jul", in: 170, out: 60 },
  ];

  const utilizeCall = async () => {
    setLoading(true);
    // console.log(smuser.id, vm_data, "==!==!==moniter");

    if (vm_data !== null) {
      const payload = {
        user_id: smuser.id,
        vm_id: vm_data,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const loginUserResponse = await instance.post(
          "/monitoring",
          encryptedResponse
        );
        // const loginResponse = await decryptData(loginUserResponse.data);
        const userDetails = loginUserResponse;
        const resData = userDetails.data;
        console.log(resData, "==!==!==moniter");

        const cpu = resData?.data.cpu.cpu;
        setCPUInfo(cpu);

        const disk = resData?.data.disk.disk;
        const diskDatas = resData?.data.disk;
        // console.log(disk, "==!==!==diskk");
        setDISKInfo(disk);


        
        const inodes = diskDatas.inodes;
        setINodesInfo(inodes);

        const ram = resData?.data.ram;
        setRAMInfo(ram);
        console.log(resData?.data.res.monthly_data, "==!==!==resdata");
        const res = resData?.data.res;
        console.log(resData, "==!==!==cpu");
        const monthlyRawData = res.monthly_data;
        setMonthlyRawData(monthlyRawData);

        const cpuData = Array.isArray(monthlyRawData)
          ? Object.values(
              monthlyRawData.reduce((acc, item) => {
                const timestamp = parseInt(item[1]) * 1000;
                const date = new Date(timestamp).toISOString().slice(0, 10); // e.g., "2025-08-01"

                const percent = parseFloat(item[6]);
                if (!acc[date]) {
                  acc[date] = { date, total: percent, count: 1 };
                } else {
                  acc[date].total += percent;
                  acc[date].count += 1;
                }

                return acc;
              }, {})
            )
              .map((entry) => ({
                time: new Date(entry.date),
                percent: entry.total / entry.count, // average
              }))
              .sort((a, b) => a.time - b.time)
          : [];

        const diskData = Array.isArray(monthlyRawData)
          ? Object.values(
              monthlyRawData.reduce((acc, item) => {
                const timestamp = parseInt(item[1]) * 1000;
                const date = new Date(timestamp).toISOString().slice(0, 10); // 'YYYY-MM-DD'

                const usedGB = parseFloat(item[3]) / 1024; // Convert MB to GB

                if (!acc[date]) {
                  acc[date] = { date, total: usedGB, count: 1 };
                } else {
                  acc[date].total += usedGB;
                  acc[date].count += 1;
                }

                return acc;
              }, {})
            )
              .map((entry) => ({
                time: new Date(entry.date),
                used_gb: entry.total / entry.count, // average usage per day
              }))
              .sort((a, b) => a.time - b.time)
          : [];

        const ramData = Array.isArray(monthlyRawData)
          ? Object.values(
              monthlyRawData.reduce((acc, item) => {
                const timestamp = parseInt(item[1]) * 1000;
                const date = new Date(timestamp).toISOString().slice(0, 10); // 'YYYY-MM-DD'

                const ramMB = parseFloat(item[5]);

                if (!acc[date]) {
                  acc[date] = { date, total: ramMB, count: 1 };
                } else {
                  acc[date].total += ramMB;
                  acc[date].count += 1;
                }

                return acc;
              }, {})
            )
              .map((entry) => ({
                time: new Date(entry.date),
                ram_mb: entry.total / entry.count, // average RAM usage per day
              }))
              .sort((a, b) => a.time - b.time)
          : [];

        const inodeData = Array.isArray(monthlyRawData)
          ? Object.values(
              monthlyRawData.reduce((acc, item) => {
                const timestamp = parseInt(item[1]) * 1000;
                const date = new Date(timestamp).toISOString().slice(0, 10); // 'YYYY-MM-DD'

                const inodesMB = parseFloat(item[4]) / (1024 * 1024); // bytes → MB

                if (!acc[date]) {
                  acc[date] = { date, total: inodesMB, count: 1 };
                } else {
                  acc[date].total += inodesMB;
                  acc[date].count += 1;
                }

                return acc;
              }, {})
            )
              .map((entry) => ({
                time: new Date(entry.date),
                inodes_mb: entry.total / entry.count, // average per day
              }))
              .sort((a, b) => a.time - b.time)
          : [];

        const ioReadData = Array.isArray(monthlyRawData)
          ? Object.values(
              monthlyRawData.reduce((acc, item) => {
                const timestamp = parseInt(item[1]) * 1000;
                const date = new Date(timestamp).toISOString().slice(0, 10); // YYYY-MM-DD

                const ioReadMB = parseFloat(item[9]);

                if (!acc[date]) {
                  acc[date] = { date, total: ioReadMB, count: 1 };
                } else {
                  acc[date].total += ioReadMB;
                  acc[date].count += 1;
                }

                return acc;
              }, {})
            )
              .map((entry) => ({
                time: new Date(entry.date),
                ioRead_mb: entry.total / entry.count, // average per day
              }))
              .sort((a, b) => a.time - b.time)
          : [];

        const ioWriteData = Array.isArray(monthlyRawData)
          ? Object.values(
              monthlyRawData.reduce((acc, item) => {
                const timestamp = parseInt(item[1]) * 1000;
                const date = new Date(timestamp).toISOString().slice(0, 10); // YYYY-MM-DD

                const ioWriteMB = parseFloat(item[10]);

                if (!acc[date]) {
                  acc[date] = { date, total: ioWriteMB, count: 1 };
                } else {
                  acc[date].total += ioWriteMB;
                  acc[date].count += 1;
                }

                return acc;
              }, {})
            )
              .map((entry) => ({
                time: new Date(entry.date),
                ioWrite_mb: entry.total / entry.count, // average per day
              }))
              .sort((a, b) => a.time - b.time)
          : [];

        setCPUData(cpuData);
        setFiltCPU(cpuData);
        setDISKData(diskData);
        setFiltDISK(diskData);
        setINODESData(inodeData);
        setFiltINode(inodeData);
        setRAMData(ramData);
        setFiltRAM(ramData);
        setResData(res);
        setIOReadData(ioReadData);
        setFiltIORead(ioReadData);
        setIOWriteData(ioWriteData);
        setFiltIOWrite(ioWriteData);

        const networkData = Array.isArray(monthlyRawData)
          ? Object.values(
              monthlyRawData.reduce((acc, item) => {
                const timestamp = parseInt(item[1]) * 1000;
                const date = new Date(timestamp).toISOString().slice(0, 10); // 'YYYY-MM-DD'

                const download = parseInt(item[7], 10) || 0;
                const upload = parseInt(item[8], 10) || 0;

                if (!acc[date]) {
                  acc[date] = {
                    date,
                    totalDownload: download,
                    totalUpload: upload,
                  };
                } else {
                  acc[date].totalDownload += download;
                  acc[date].totalUpload += upload;
                }

                return acc;
              }, {})
            )
              .map((entry) => ({
                time: new Date(entry.date),
                download: entry.totalDownload,
                upload: entry.totalUpload,
                total: entry.totalDownload + entry.totalUpload,
              }))
              .sort((a, b) => a.time - b.time)
          : [];

        setNetworkData(networkData);
        setFiltNetwork(networkData);

        const bandwidth = resData?.bandwidth;
        
        console.log(resData , "====band");
        const totalIn = Object.values(bandwidth.in).reduce(
          (sum, val) => sum + val,
          0
        );
        const totalOut = Object.values(bandwidth.out).reduce(
          (sum, val) => sum + val,
          0
        );
        const grandTotal = totalIn + totalOut;

        let inPercent = 0;
        let outPercent = 0;

        if (grandTotal > 0) {
          inPercent = (totalIn / grandTotal) * 100;
          outPercent = (totalOut / grandTotal) * 100;
        }

        // console.log("IN %:", inPercent.toFixed(2));
        // console.log("OUT %:", outPercent.toFixed(2));
        setBandwidthIn(inPercent);
        setBandwidthOut(outPercent);
        setBandwidthInfo(bandwidth);

        const totalBandPer = (bandwidth.used_gb / bandwidth.limit_gb) * 100;
        setBandwidthPercent(totalBandPer);

        const { in: inData, out: outData, usage: usageData } = bandwidth;

        const bandwidthData = Object.keys(usageData).map((key) => {
          const year = parseInt(key.slice(0, 4), 10);
          const month = parseInt(key.slice(4, 6), 10) - 1; // JS months are 0-indexed
          const day = parseInt(key.slice(6, 8), 10);

          return {
            time: new Date(year, month, day),
            upload: outData[key] || 0,
            download: inData[key] || 0,
            total: usageData[key] || 0,
          };
        });
        // console.log(bandwidthData, "==!==!==bIN");
        setBandwidthResData(bandwidthData);
        setFiltBandwidth(bandwidthData);

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Assume this is your full bandwidth object from the image
        const { in: inDatas, out: outDatas } = bandwidth;
        // Prepare a lookup table for month-wise accumulation
        const monthlyTotals = {};

        Object.keys(inDatas).forEach((key) => {
          const year = key.slice(0, 4);
          const monthIndex = parseInt(key.slice(4, 6), 10) - 1; // 0-based
          const monthName = months[monthIndex];

          if (!monthlyTotals[monthName]) {
            monthlyTotals[monthName] = { month: monthName, in: 0, out: 0 };
          }

          monthlyTotals[monthName].in += inDatas[key] || 0;
          monthlyTotals[monthName].out += outDatas[key] || 0;
        });

        // Now convert it into the final array
        const monthlyData = months.map(
          (m) => monthlyTotals[m] || { month: m, in: 0, out: 0 }
        );
        setMonthlyUsage(monthlyData);
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (activeGraphButton !== "Bandwidth") {
      const dataInRange = cpuData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltCPU(dataInRange);

      const dataInRange1 = diskData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltDISK(dataInRange1);

      const dataInRange2 = ramData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltRAM(dataInRange2);

      const dataInRange3 = ioReadData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltIORead(dataInRange3);

      const dataInRange4 = iNodesData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltINode(dataInRange4);

      const dataInRange5 = ioWriteData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltIOWrite(dataInRange5);

      const dataInRange6 = networkData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltNetwork(dataInRange6);
    }

    if (activeGraphButton === "Bandwidth") {
      const dataInRange7 = bandwidthData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltBandwidth(dataInRange7);
    }
  };

  // Today
  const handleToday = () => {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    filterByDateRange(start, end);
  };

  // Yesterday
  const handleYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const start = new Date(yesterday.setHours(0, 0, 0, 0));
    const end = new Date(yesterday.setHours(23, 59, 59, 999));
    filterByDateRange(start, end);
  };

  // Last Week (last 7 days including today)
  const handleLastWeek = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    filterByDateRange(start, end);
  };

  // Utility: filter data by date range
  const filterByDateRange = (start, end) => {
    // const result = cpuData.filter((item) => {
    //   const itemDate = new Date(item.time);
    //   return itemDate >= start && itemDate <= end;
    // });
    // setFilteredData(result);

    if (activeGraphButton !== "Bandwidth") {
      const dataInRange = cpuData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltCPU(dataInRange);

      const dataInRange1 = diskData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltDISK(dataInRange1);

      const dataInRange2 = ramData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltRAM(dataInRange2);

      const dataInRange3 = ioReadData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltIORead(dataInRange3);

      const dataInRange4 = iNodesData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltINode(dataInRange4);

      const dataInRange5 = ioWriteData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltIOWrite(dataInRange5);

      const dataInRange6 = networkData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltNetwork(dataInRange6);
    }

    if (activeGraphButton === "Bandwidth") {
      const dataInRange7 = bandwidthData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });
      setFiltBandwidth(dataInRange7);
    }
  };

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

  const handleButtonClick = (button) => {
    // If clicking the same button, toggle flip
    if (activeButton === button) {
    } else {
      setActiveButton(button);
    }
  };

  const handleGraphButtonClick = (button) => {
    // If clicking the same button, toggle flip
    if (activeGraphButton === button) {
    } else {
      setActiveGraphBtn(button);
    }
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
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
          {/* <Spinner animation="border" /> */}
        </div>
      )}
      {isMobile ? (
        <div className="">
          <div className="heading-dotted-machine">
            Monitoring <span></span>
          </div>

          <div
          // className="features-page-solution"
          // style={{ height: "100%", padding: "5rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                className="button-group"
                // style={{ marginTop: "4rem", marginLeft: "11rem" }}
              >
                <button
                  className={`btn ${
                    activeButton === "Overview" ? "active" : ""
                  }`}
                  style={{
                    background: `${
                      activeButton === "Overview" ? "#f47c20" : "#035189"
                    }`,
                  }}
                  onClick={() => handleButtonClick("Overview")}
                >
                  Overview
                </button>
                <button
                  className={`btn ${activeButton === "Graphs" ? "active" : ""}`}
                  style={{
                    background: `${
                      activeButton === "Graphs" ? "#f47c20" : "#035189"
                    }`,
                  }}
                  onClick={() => handleButtonClick("Graphs")}
                >
                  Graphs
                </button>
              </div>
            </div>

            <div className="p-4 bg-white min-h-screen">
              {activeButton == "Overview" && (
                <Tabs>
                  <Tab title="Overview">
                    <Row>
                      <div className="col-md-4">
                        {/* Column 1: Disk Usage & Bandwidth */}
                        <ResponsiveContainer width="100%" height={200}>
                          <div className="col-span-4 flex flex-col gap-4">
                            {/* Disk Usage */}
                            <div
                              className="rounded-xl shadow p-4"
                              style={{ borderRadius: "10px" }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <h4 className="text-sm font-semibold text-gray-800">
                                  Disk Usage
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {diskInfo && diskInfo.used_gb} /{" "}
                                  {diskInfo && diskInfo.limit_gb} GB
                                </p>
                              </div>
                              <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{
                                    width: diskInfo && diskInfo.percent,
                                  }}
                                ></div>
                              </div>
                              <p className="text-sm text-green-600 mt-1">
                                {diskInfo && diskInfo.percent}%
                              </p>
                            </div>
                          </div>
                        </ResponsiveContainer>

                        <div className="grid grid-cols-12 gap-4">
                          {/* Bandwidth */}
                          <div
                            className="rounded-xl shadow p-4"
                            style={{ borderRadius: "10px" }}
                          >
                            <h4>Bandwidth</h4>
                            <p className="text-gray-600">
                              {bandwidthInfo && bandwidthInfo.used_gb} /{" "}
                              {bandwidthInfo && bandwidthInfo.limit_gb} GB
                            </p>
                            <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: "5.8%" }}
                              ></div>
                            </div>
                            {/* <div className="flex justify-between mt-2">
                              <div className="text-blue-500">64.05% IN</div>
                              <div className="text-red-400">35.95% OUT</div>
                            </div> */}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: CPU */}
                      <div
                        className="col-span-4 rounded-xl shadow p-4 col-md-4"
                        style={{ borderRadius: "10px" }}
                      >
                        <h4 className="bg-transparent text-sm font-semibold text-gray-800">
                          CPU
                        </h4>

                        {cpuData && (
                          <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={cpuData && cpuData}>
                              {/* <XAxis dataKey="time" hide /> */}
                              <XAxis
                                dataKey="time"
                                tickFormatter={(str) =>
                                  new Date(str).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                }
                              />
                              <YAxis
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v.toFixed(2)} %`}
                              />

                              {/* <Tooltip formatter={(v) => `${v.toFixed(2)} %`} /> */}
                              <Area
                                type="monotone"
                                dataKey="percent"
                                stroke="#2f80ed"
                                strokeWidth={2}
                                fill="#eaf4ff"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                        <p className="text-right text-green-500">
                          {cpuInfo && cpuInfo.percent}%
                        </p>
                      </div>

                      {/* Column 3: Network Speed */}
                      <div
                        className="col-span-4 rounded-xl shadow p-4 col-md-4"
                        style={{ borderRadius: "10px" }}
                      >
                        <h4>Network Speed (MB/s)</h4>
                        <ResponsiveContainer width="100%" height={400}>
                          <AreaChart data={networkData}>
                            <defs>
                              <linearGradient
                                id="total"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#2f80ed"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#2f80ed"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                              <linearGradient
                                id="download"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#27ae60"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#27ae60"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                              <linearGradient
                                id="upload"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#f39c12"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#f39c12"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>

                            {/* <XAxis dataKey="time" hide /> */}
                            <XAxis
                              dataKey="time"
                              tickFormatter={(str) =>
                                new Date(str).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              }
                            />
                            {/* <YAxis
                              tickFormatter={(value) =>
                                `${(value / 1024).toFixed(1)}`
                              }
                              domain={[0, "auto"]}
                            /> */}
                            <YAxis
                              tickFormatter={(v) =>
                                `${(v / 1024).toFixed(1)} MB/s`
                              }
                            />
                            <Tooltip
                              formatter={(value) =>
                                `${(value / 1024).toFixed(2)} KB/s`
                              }
                            />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="total"
                              stroke="#2f80ed"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#total)"
                              name="Total speed"
                            />
                            <Area
                              type="monotone"
                              dataKey="download"
                              stroke="#27ae60"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#download)"
                              name="Download"
                            />
                            <Area
                              type="monotone"
                              dataKey="upload"
                              stroke="#f39c12"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#upload)"
                              name="Upload"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        <p className="text-right text-green-500">0.04 MB/s</p>
                      </div>

                      {/* Account Section */}
                      {/* <div className="mt-6 rounded-xl shadow p-4 w-1/3">
                        <h4>Account</h4>
                        <p className="text-gray-600">Last Login</p>
                      </div> */}
                      {/* <div className="col-md-2"></div> */}
                    </Row>
                  </Tab>
                </Tabs>
              )}

              {activeButton == "Graphs" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="button-group">
                      <button
                        className={`btn ${
                          activeGraphButton === "Bandwidth" ? "active" : ""
                        }`}
                        style={{
                          background: `${
                            activeGraphButton === "Bandwidth"
                              ? "#f47c20"
                              : "#035189"
                          }`,
                        }}
                        onClick={() => handleGraphButtonClick("Bandwidth")}
                      >
                        Bandwidth Statistics
                      </button>
                      <button
                        className={`btn ${
                          activeGraphButton === "System" ? "active" : ""
                        }`}
                        style={{
                          background: `${
                            activeGraphButton === "System"
                              ? "#f47c20"
                              : "#035189"
                          }`,
                        }}
                        onClick={() => handleGraphButtonClick("System")}
                      >
                        System Statistics
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      position: "relative",
                      backgroundColor: "#e97730",
                      padding: "18px",
                      borderRadius: "20px",
                      zIndex: "999",
                      width: "90%",
                      marginLeft: "10px",
                      marginTop: "2rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        zIndex: "1",
                      }}
                    >
                      <div
                        className="search-form"
                        style={{ marginTop: "10px", marginLeft: "20px" }}
                      >
                        {/* Start Date */}
                        <div
                          className="input-container-notif"
                          style={{ width: "16rem" }}
                        >
                          <input
                            type="date"
                            name="from"
                            className="input-signup"
                            placeholder="From"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        {/* End Date */}
                        <div
                          className="input-container-notif"
                          style={{ width: "16rem" }}
                        >
                          <input
                            type="date"
                            name="to"
                            className="input-signup"
                            placeholder="To"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>

                        <input type="hidden" id="getval" value="All" />
                        <div className="button-fields">
                          {/* Submit Button */}
                          <div
                            className="button-cont"
                            style={{
                              marginTop: "-11px",
                            }}
                          >
                            <input
                              type="submit"
                              name="submit"
                              value="Submit"
                              className="input-submit new-btn"
                              onClick={handleSubmit}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div className="button-fields">
                            {/* today Button */}
                            <div
                              // className="button-cont"
                              style={{
                                marginTop: "-11px",
                                marginLeft: "5px",
                              }}
                            >
                              <input
                                type="button"
                                name="today"
                                value="today"
                                // className="input-today new-btn"
                                className="btn"
                                style={{ width: "100px" }}
                                onClick={handleToday}
                              />
                            </div>
                          </div>
                          <div className="button-fields">
                            {/* yesterday Button */}
                            <div
                              // className="button-cont"
                              style={{
                                marginTop: "-11px",
                                marginLeft: "5px",
                              }}
                            >
                              <input
                                type="button"
                                name="yesterday"
                                value="yesterday"
                                // className="input-yesterday new-btn"
                                className="btn"
                                style={{ width: "130px" }}
                                onClick={handleYesterday}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="button-fields">
                          {/* lastweek Button */}
                          <div
                            // className="button-cont"
                            style={{
                              marginTop: "-11px",
                              marginLeft: "5px",
                            }}
                          >
                            <input
                              type="button"
                              name="lastweek"
                              value="lastweek"
                              // className="input-lastweek new-btn"
                              className="btn"
                              style={{ width: "120px" }}
                              onClick={handleLastWeek}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeButton == "Graphs" && activeGraphButton !== "System" && (
                <Tab title="Graphs">
                  <Row>
                    <div className="col-md-6">
                      <div className="grid grid-cols-12 gap-4">
                        <div
                          className="col-span-6 rounded-xl shadow p-4"
                          style={{ borderRadius: "10px" }}
                        >
                          <h4 className="mb-2">Daily Bandwidth Usage</h4>
                          <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={filterBandwidthData}>
                              <XAxis
                                dataKey="time"
                                tickFormatter={(str) =>
                                  new Date(str).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                }
                              />
                              <YAxis
                                tickFormatter={(v) =>
                                  `${(v / 1024).toFixed(1)} GB`
                                }
                              />
                              {/* <Tooltip
                                formatter={(v) => `${(v / 1024).toFixed(2)} GB`}
                              /> */}
                              <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#f39c12"
                                strokeWidth={2}
                                fill="#fceac1"
                                name="Usage"
                              />
                              <Area
                                type="monotone"
                                dataKey="upload"
                                stroke="#f012be"
                                strokeWidth={2}
                                fill="#fad4f4"
                                name="Out"
                              />
                              <Area
                                type="monotone"
                                dataKey="download"
                                stroke="#ffc107"
                                strokeWidth={2}
                                fill="#fff2c2"
                                name="In"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div
                      className="col-span-6 rounded-xl shadow p-4 col-md-6"
                      style={{ borderRadius: "10px" }}
                    >
                      <h4 className="mb-2">Monthly Chart</h4>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyUsage}>
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(v) => `${v} GB`} />
                          <Tooltip formatter={(v) => `${v} GB`} />
                          <Legend />
                          <Bar dataKey="in" fill="#2196f3" name="In" />
                          <Bar dataKey="out" fill="#00b894" name="Out" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Row>
                </Tab>
              )}

              {activeButton == "Graphs" && activeGraphButton == "System" && (
                <>
                  <Row>
                    <div className="col-md-6" style={{ marginTop: "50px" }}>
                      <div className="grid grid-cols-12 gap-4">
                        <div
                          className="col-span-4 rounded-xl shadow p-4"
                          style={{ borderRadius: "10px" }}
                        >
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex-1">
                              {/* <span className="text-blue-600 font-bold">
                                CPU Hz :
                              </span>
                              <span> 2476.02 MHz </span> */}
                            </div>

                            <div className="flex-1 text-right">
                              <span className="text-blue-600 font-bold">
                                Utilized :
                              </span>
                              <span> {cpuInfo?.percent} % </span>
                            </div>
                          </div>

                          <ResponsiveContainer
                            width="100%"
                            height={300}
                            style={{ marginTop: "3rem" }}
                          >
                            <AreaChart data={filterCPUData && filterCPUData}>
                              <XAxis
                                dataKey="time"
                                tickFormatter={(str) =>
                                  new Date(str).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                }
                              />
                              <YAxis
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v.toFixed(0)} %`}
                              />
                              {/* <Tooltip formatter={(v) => `${v.toFixed(2)} %`} /> */}
                              <Area
                                type="monotone"
                                dataKey="percent"
                                stroke="#f39c12"
                                strokeWidth={2}
                                fill="#fdecc8"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                          <div className="text-center mt-2">
                            <p className="text-sm text-gray-500">
                              CPU Information
                            </p>
                            <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mx-auto">
                              {/* <span className="text-blue-600 font-semibold">
                              {cpuData && cpuData.percent}%
                            </span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="col-span-6 rounded-xl shadow p-4 col-md-6"
                      style={{ marginTop: "50px", borderRadius: "10px" }}
                    >
                      <div className="flex justify-between">
                        <div>
                          <span className="text-blue-600 font-bold">
                            Total Disk :
                          </span>
                          <span> {diskInfo && diskInfo.limit_gb} GB </span>
                        </div>
                        <div>
                          <span className="text-blue-600 font-bold">
                            Utilized :
                          </span>
                          <span> {diskInfo && diskInfo.used_gb} GB </span>
                        </div>
                        <div>
                          <span className="text-blue-600 font-bold">
                            Utilization :
                          </span>
                          <span> {diskInfo && diskInfo.percent} % </span>
                        </div>
                      </div>
                      <ResponsiveContainer
                        width="100%"
                        height={250}
                        style={{ marginTop: "3rem" }}
                      >
                        <AreaChart data={filterDiskData}>
                          <XAxis
                            dataKey="time"
                            tickFormatter={(str) =>
                              new Date(str).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })
                            }
                          />
                          <YAxis
                            domain={["auto", "auto"]}
                            tickFormatter={(v) => `${v.toFixed(1)} GB`}
                          />
                          {/* <Tooltip formatter={(v) => `${v.toFixed(2)} GB`} /> */}
                          <Area
                            type="monotone"
                            dataKey="used_gb"
                            stroke="#ff5722"
                            strokeWidth={2}
                            fill="#ffccbc"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div className="text-center mt-2">
                        <p className="text-sm text-gray-500">
                          Disk Information
                        </p>
                        {/* <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mx-auto">
                        <span className="text-blue-600 font-semibold">
                          32.1%
                        </span>
                      </div> */}
                      </div>
                    </div>
                  </Row>

                  <Row>
                    <div className="col-md-6">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Column 1: RAM Info */}
                        <div
                          className="col-span-6 rounded-xl shadow p-4"
                          style={{ borderRadius: "10px" }}
                        >
                          <h4 className="text-lg font-semibold mb-4">
                            RAM Information
                          </h4>
                          <div className="flex justify-between items-center mb-4">
                            <div className="space-x-4 flex items-center">
                              <span className="text-blue-600 font-bold">
                                RAM :{" "}
                              </span>
                              <span> {ramInfo && ramInfo.limit} MB </span>
                            </div>
                            <div>
                              <span className="text-blue-600 font-bold">
                                Utilized :
                              </span>
                              <span> {ramInfo && ramInfo.used} MB </span>
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={filterRAMData}>
                              <XAxis
                                dataKey="time"
                                tickFormatter={(str) =>
                                  new Date(str).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                }
                              />
                              {/* <YAxis domain={["auto", "auto"]} /> */}
                              <YAxis tickFormatter={(v) => `${v} MB`} />
                              {/* <Tooltip formatter={(v) => `${v} MB`} /> */}
                              <Area
                                type="monotone"
                                dataKey="ram_mb"
                                stroke="#fcd34d"
                                strokeWidth={2}
                                fill="#fef9c3"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                          <div className="text-center mt-2">
                            <p className="text-sm text-gray-500">
                              Ram Utilization
                            </p>
                            <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mx-auto">
                              <span className="text-blue-600 font-semibold">
                                {ramInfo && ramInfo.percent} %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="col-span-6 rounded-xl shadow p-4 col-md-6"
                      style={{ borderRadius: "10px" }}
                    >
                      <h4 className="text-lg font-semibold mb-4">
                        Disk Information
                      </h4>
                      <div
                        className="flex justify-between items-center mb-4"
                        style={{ borderRadius: "10px" }}
                      >
                        <div>
                          {/* <span className="text-blue-600 font-bold">
                            I/O Read Speed :{" "}
                          </span>
                          <span> 0.01771 MB/s </span> */}
                        </div>
                        <span className="text-blue-600 font-medium">
                          🔵 I/O Read Speed(MB/s)
                        </span>
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={filterIOReadData}>
                          <XAxis
                            dataKey="time"
                            tickFormatter={(str) =>
                              new Date(str).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })
                            }
                          />
                          <YAxis tickFormatter={(v) => `${v}`} />
                          {/* <Tooltip formatter={(v) => `${v} MB/s`} /> */}
                          <Bar dataKey="ioRead_mb" fill="#2f80ed" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Row>

                  <Row>
                    <div className="col-md-6">
                      {/* Column 3: Inodes */}
                      <div
                        className="col-span-6 rounded-xl shadow p-4 mt-4"
                        style={{ borderRadius: "10px" }}
                      >
                        <h4 className="text-lg font-semibold mb-4">
                          Inodes Information
                        </h4>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-blue-600 font-bold">
                              Total Inodes :
                            </span>
                            <span> {inodesInfo && inodesInfo.limit} </span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-bold">
                              Utilized :
                            </span>
                            <span> {inodesInfo && inodesInfo.used} </span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-bold">
                              Utilization(%) :
                            </span>
                            <span> {inodesInfo && inodesInfo.percent} % </span>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={filterINodeData}>
                            <XAxis
                              dataKey="time"
                              tickFormatter={(str) => {
                                const date = new Date(str);
                                return date.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                });
                              }}
                            />
                            {/* <YAxis domain={["auto", "auto"]} /> */}
                            <YAxis
                              tickFormatter={(v) => `${v.toFixed(1)} MB`}
                            />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="inodes_mb"
                              stroke="#374151"
                              strokeWidth={2}
                              fill="#e5e7eb"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Column 4: Disk Write */}
                    <div
                      className="col-span-6 rounded-xl shadow p-4 mt-4 col-md-6"
                      style={{ borderRadius: "10px" }}
                    >
                      {/* <h4 className="text-lg font-semibold mb-4">
                      Disk Write Speed
                    </h4> */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-blue-600 font-bold">
                            I/O Write Speed(MB/s)
                          </span>
                          {/* <span> 0.28699 MB/s </span> */}
                        </div>
                        {/* <span className="text-green-600 font-medium">
                         I/O Write Speed
                      </span> */}
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={filterIOWriteData}>
                          <XAxis
                            dataKey="time"
                            tickFormatter={(str) =>
                              new Date(str).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })
                            }
                          />
                          <YAxis tickFormatter={(v) => `${v}`} />
                          {/* <Tooltip formatter={(v) => `${v} MB/s`} /> */}
                          <Bar dataKey="ioWrite_mb" fill="#27ae60" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Row>

                  <Row>
                    <div className="col-md-6">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Other Info Components */}
                        <div
                          className="col-span-12 rounded-xl shadow p-4"
                          style={{ borderRadius: "10px" }}
                        >
                          <h4 className="text-lg font-semibold mb-4">
                            Network Info(MB/s)
                          </h4>
                          {/* <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-blue-600 font-bold">
                                Average Download Speed :
                              </span>
                              <span> 0.04655 MB/s </span>
                            </div>
                            <div>
                              <span className="text-blue-600 font-bold">
                                Average Upload Speed :
                              </span>
                              <span> 0.04655 MB/s </span>
                            </div>
                          </div> */}
                          <ResponsiveContainer
                            width="100%"
                            height={350}
                            style={{ marginTop: "2rem" }}
                          >
                            <AreaChart data={filterNetworkData}>
                              <XAxis
                                dataKey="time"
                                tickFormatter={(str) =>
                                  new Date(str).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                }
                              />
                              <YAxis
                                tickFormatter={(v) =>
                                  `${(v / 1024).toFixed(1)}`
                                }
                              />
                              <Tooltip
                                formatter={(v) =>
                                  `${(v / 1024).toFixed(2)} MB/s`
                                }
                              />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="download"
                                stroke="#0000ff"
                                strokeWidth={2}
                                fillOpacity={0}
                                name="Download Speed"
                              />
                              <Area
                                type="monotone"
                                dataKey="upload"
                                stroke="#ff00ff"
                                strokeWidth={2}
                                fillOpacity={0}
                                name="Upload Speed"
                              />
                              <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#ff1493"
                                strokeWidth={2}
                                fillOpacity={0}
                                name="Total Speed"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </Row>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "100%", padding: "5rem" }}
        >
          <div className="heading-dotted-machine">
            Monitoring <span></span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="button-group"
              style={{ marginTop: "4rem", marginLeft: "11rem" }}
            >
              <button
                className={`btn ${activeButton === "Overview" ? "active" : ""}`}
                style={{
                  background: `${
                    activeButton === "Overview" ? "#f47c20" : "#035189"
                  }`,
                }}
                onClick={() => handleButtonClick("Overview")}
              >
                Overview
              </button>
              <button
                className={`btn ${activeButton === "Graphs" ? "active" : ""}`}
                style={{
                  background: `${
                    activeButton === "Graphs" ? "#f47c20" : "#035189"
                  }`,
                }}
                onClick={() => handleButtonClick("Graphs")}
              >
                Graphs
              </button>
            </div>
          </div>

          <div
            className="p-4 bg-white min-h-screen"
            style={{ marginLeft: "10rem" }}
          >
            {activeButton == "Overview" && (
              <Tabs>
                <Tab title="Overview">
                  <Row>
                    <div className="col-md-4">
                      {/* Column 1: Disk Usage & Bandwidth */}
                      <ResponsiveContainer width="100%" height={250}>
                        {/* <div className="col-span-4 flex flex-col gap-4">
                          <div
                            className="rounded-xl shadow p-4"
                            style={{ borderRadius: "10px" }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <h4 className="text-sm font-semibold text-gray-800">
                                Disk Usage
                              </h4>
                              <p className="text-sm text-gray-600">
                                {diskInfo && diskInfo.used_gb} /{" "}
                                {diskInfo && diskInfo.limit_gb} GB
                              </p>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: diskInfo && diskInfo.percent }}
                              ></div>
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                              {diskInfo && diskInfo.percent}%
                            </p>
                          </div>
                        </div> */}
                        <div className="w-96 p-4 rounded-xl shadow-md border bg-white">
                          {/* Header */}
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-lg text-gray-800 m-0">
                              Disk Usage
                            </h3>
                            <span className="text-sm text-gray-600">
                              {diskInfo && diskInfo.used_gb} /{" "}
                              {diskInfo && diskInfo.limit_gb} GB
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                            <div
                              className="h-full rounded-lg transition-all duration-500"
                              style={{
                                width: `${diskInfo && diskInfo.percent}%`,
                                backgroundColor: "#34d399", // green (Tailwind's green-400)
                                borderRadius: "10px",
                                padding: "5px",
                              }}
                            >
                              <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-700 font-medium">
                                {diskInfo && diskInfo.percent} %
                              </span>
                            </div>
                          </div>
                        </div>
                      </ResponsiveContainer>

                      {/* <div className="grid grid-cols-12 gap-4">
                        <div
                          className="rounded-xl shadow p-4"
                          style={{ borderRadius: "10px" }}
                        >
                          <h4>Bandwidth</h4>
                          <p className="text-gray-600">
                            {bandwidthInfo && bandwidthInfo.used_gb} /{" "}
                            {bandwidthInfo && bandwidthInfo.limit_gb} GB
                          </p>
                          <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: "5.8%" }}
                            ></div>
                          </div>
                         
                        </div>
                      </div> */}

                      <div className="w-96 p-4 rounded-xl shadow-md border bg-white">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg text-gray-800">
                            Bandwidth
                          </h3>
                          <span className="text-sm text-gray-600">
                            {bandwidthInfo && bandwidthInfo.used_gb} /{" "}
                            {bandwidthInfo && bandwidthInfo.limit_gb} GB
                          </span>
                        </div>

                        {/* Total Progress Bar */}
                        <div className="relative w-full h-6 bg-gray-100 rounded-lg overflow-hidden mb-4">
                          {bandwidthPercent > 0 && (
                            <div
                              className="h-full rounded-lg transition-all duration-500 flex items-center justify-center text-sm font-medium text-white"
                              style={{
                                width: `${bandwidthPercent}%`,
                                backgroundColor: "#34d399", // green
                                borderRadius: "10px",
                                padding: "5px",
                              }}
                            >
                              {bandwidthPercent}%
                            </div>
                          )}
                        </div>

                        {/* IN / OUT Section */}
                        <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                          {/* IN */}
                          <span className="mt-1">IN</span>
                          <div className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full h-8 flex rounded-lg overflow-hidden"
                              style={{
                                width: `${100}%`,
                                backgroundColor: "#e0f2fe",
                                borderRadius: "10px",
                              }}
                            >
                              <div
                                className="flex items-center justify-center text-xs font-semibold text-gray-700"
                                style={{
                                  width: `${bandwidthIn}%`,
                                  backgroundColor: "#93c5fd", // blue-300
                                  borderRadius: "10px",
                                  padding: "8px",
                                }}
                              >
                                {bandwidthIn}%
                              </div>
                            </div>
                          </div>

                          {/* OUT */}
                          <span className="mt-1">OUT</span>
                          <div className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full h-8 flex rounded-lg overflow-hidden"
                              style={{
                                width: `${100}%`,
                                backgroundColor: "#fee2e2",
                                borderRadius: "10px",
                              }}
                            >
                              <div
                                className="flex items-center justify-center text-xs font-semibold text-gray-700"
                                style={{
                                  width: `${bandwidthOut}%`,
                                  backgroundColor: "#fca5a5", // red-300
                                  borderRadius: "10px",
                                  padding: "8px",
                                }}
                              >
                                {bandwidthOut}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: CPU */}
                    <div
                      className="col-span-4 rounded-xl shadow p-4 col-md-4"
                      style={{ borderRadius: "10px" }}
                    >
                      <div className="flex flex-row items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-800 m-0">
                          CPU
                        </h4>
                        <p className="text-green-500 m-0">
                          {cpuInfo && cpuInfo.percent}%
                        </p>
                      </div>
                      {cpuData && (
                        <ResponsiveContainer
                          width="100%"
                          height={400}
                          // style={{ marginTop: "20px",backgroundColor: "ActiveBorder" }}
                        >
                          <AreaChart data={cpuData && cpuData}>
                            {/* <XAxis dataKey="time" hide /> */}
                            <XAxis
                              dataKey="time"
                              tickFormatter={(str) =>
                                new Date(str).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              }
                            />
                            <YAxis
                              domain={[0, 100]}
                              tickFormatter={(v) => `${v.toFixed(0)} %`}
                            />
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                            />

                            <Tooltip formatter={(v) => `${v.toFixed(2)} %`} />
                            <Area
                              type="monotone"
                              dataKey="percent"
                              stroke="#2f80ed"
                              strokeWidth={2}
                              fill="#eaf4ff"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    {/* Column 3: Network Speed */}
                    <div
                      className="col-span-4 rounded-xl shadow p-4 col-md-4"
                      style={{ borderRadius: "10px" }}
                    >
                      <h4>Network Speed (MB/s)</h4>
                      <ResponsiveContainer width="100%" height={460}>
                        <AreaChart data={networkData}>
                          <defs>
                            <linearGradient
                              id="total"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#2f80ed"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#2f80ed"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="download"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#27ae60"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#27ae60"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="upload"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f39c12"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f39c12"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>

                          {/* <XAxis dataKey="time" hide /> */}
                          <XAxis
                            dataKey="time"
                            tickFormatter={(str) =>
                              new Date(str).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })
                            }
                            // minTickGap={30}
                          />
                          {/* <YAxis
                            tickFormatter={(value) =>
                              `${(value / 1024).toFixed(1)}`
                            }
                            domain={[0, "auto"]}
                          /> */}
                          <YAxis
                            tickFormatter={(v) => `${(v / 1024).toFixed(1)}`}
                          />
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <Tooltip
                            formatter={(value) =>
                              `${(value / 1024).toFixed(2)} MB/s`
                            }
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#2f80ed"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#total)"
                            name="Total speed"
                          />
                          <Area
                            type="monotone"
                            dataKey="download"
                            stroke="#27ae60"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#download)"
                            name="Download"
                          />
                          <Area
                            type="monotone"
                            dataKey="upload"
                            stroke="#f39c12"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#upload)"
                            name="Upload"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      {/* <p className="text-right text-green-500">0.04 MB/s</p> */}
                    </div>

                    {/* Account Section */}
                    {/* <div className="mt-6 rounded-xl shadow p-4 w-1/3">
                        <h4>Account</h4>
                        <p className="text-gray-600">Last Login</p>
                      </div> */}
                    {/* <div className="col-md-2"></div> */}
                  </Row>
                </Tab>
              </Tabs>
            )}

            {activeButton == "Graphs" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="button-group">
                    <button
                      className={`btn ${
                        activeGraphButton === "Bandwidth" ? "active" : ""
                      }`}
                      style={{
                        background: `${
                          activeGraphButton === "Bandwidth"
                            ? "#f47c20"
                            : "#035189"
                        }`,
                      }}
                      onClick={() => handleGraphButtonClick("Bandwidth")}
                    >
                      Bandwidth Statistics
                    </button>
                    <button
                      className={`btn ${
                        activeGraphButton === "System" ? "active" : ""
                      }`}
                      style={{
                        background: `${
                          activeGraphButton === "System" ? "#f47c20" : "#035189"
                        }`,
                      }}
                      onClick={() => handleGraphButtonClick("System")}
                    >
                      System Statistics
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    marginLeft: "20rem",
                    backgroundColor: "#e97730",
                    padding: "18px",
                    borderRadius: "20px",
                    zIndex: "999",
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {/* Start Date */}
                  <input
                    type="date"
                    name="from"
                    className="input-signup"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: "16rem",
                      border: "3px solid #ffff",
                      borderColor: "white",
                      borderRadius: "30px",
                    }}
                  />

                  {/* End Date */}
                  <input
                    type="date"
                    name="to"
                    className="input-signup"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      width: "16rem",
                      border: "3px solid #ffff",
                      borderColor: "white",
                      borderRadius: "30px",
                    }}
                  />

                  {/* Buttons */}
                  <input
                    type="submit"
                    value="Submit"
                    className="new-btn"
                    onClick={handleSubmit}
                  />
                  <input
                    type="button"
                    value="Today"
                    className="btn no-hover"
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#035189"; // stays same on hover
                    }}
                    onClick={handleToday}
                  />
                  <input
                    type="button"
                    value="Yesterday"
                    className="btn no-hover"
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#035189"; // stays same on hover
                    }}
                    onClick={handleYesterday}
                  />
                  <input
                    type="button"
                    value="Last Week"
                    className="btn no-hover"
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#035189"; // stays same on hover
                    }}
                    onClick={handleLastWeek}
                  />
                </div>
              </>
            )}

            {activeButton == "Graphs" && activeGraphButton !== "System" && (
              <Tab title="Graphs">
                <Row>
                  <div className="col-md-6">
                    <div className="grid grid-cols-12 gap-4">
                      <div
                        className="col-span-6 rounded-xl shadow p-4"
                        style={{ borderRadius: "10px" }}
                      >
                        <h4 className="mb-2">Daily Bandwidth Usage</h4>
                        <ResponsiveContainer width="100%" height={400}>
                          <AreaChart data={filterBandwidthData}>
                            <XAxis
                              dataKey="time"
                              tickFormatter={(str) =>
                                new Date(str).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              }
                            />
                            <YAxis
                              tickFormatter={(v) =>
                                `${(v / 1024).toFixed(0)} GB`
                              }
                            />
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <Tooltip
                              formatter={(v) => `${(v / 1024).toFixed(2)} GB`}
                            />
                            <Area
                              type="monotone"
                              dataKey="total"
                              stroke="#f39c12"
                              strokeWidth={2}
                              fill="#fceac1"
                              name="Usage"
                            />
                            <Area
                              type="monotone"
                              dataKey="upload"
                              stroke="#f012be"
                              strokeWidth={2}
                              fill="#fad4f4"
                              name="Out"
                            />
                            <Area
                              type="monotone"
                              dataKey="download"
                              stroke="#ffc107"
                              strokeWidth={2}
                              fill="#fff2c2"
                              name="In"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-span-6 rounded-xl shadow p-4 col-md-6"
                    style={{ borderRadius: "10px" }}
                  >
                    <h4 className="mb-2">Monthly Chart</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={monthlyUsage}>
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(v) => `${v} GB`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip formatter={(v) => `${v} GB`} />
                        <Legend />
                        <Bar dataKey="in" fill="#2196f3" name="In" />
                        <Bar dataKey="out" fill="#00b894" name="Out" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Row>
              </Tab>
            )}

            {activeButton == "Graphs" && activeGraphButton == "System" && (
              <>
                <Row>
                  <div className="col-md-6" style={{ marginTop: "50px" }}>
                    <div className="grid grid-cols-12 gap-4">
                      <div
                        className="col-span-4 rounded-xl shadow p-4"
                        style={{ borderRadius: "10px" }}
                      >
                        <div className="flex items-center justify-between space-x-4">
                          <div className="flex-1">
                            {/* <span className="text-blue-600 font-bold">
                              CPU Hz :
                            </span>
                            <span> 2476.02 MHz </span> */}
                          </div>

                          <div className="flex-1 text-right">
                            <span className="text-blue-600 font-bold">
                              Utilized :
                            </span>
                            <span> {cpuInfo?.percent} % </span>
                          </div>
                        </div>

                        <ResponsiveContainer
                          width="100%"
                          height={300}
                          style={{ marginTop: "3rem" }}
                        >
                          <AreaChart data={filterCPUData && filterCPUData}>
                            <XAxis
                              dataKey="time"
                              tickFormatter={(str) =>
                                new Date(str).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              }
                            />
                            <YAxis
                              domain={[0, 100]}
                              tickFormatter={(v) => `${v.toFixed(0)} %`}
                            />
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <Tooltip formatter={(v) => `${v.toFixed(2)} %`} />
                            <Area
                              type="monotone"
                              dataKey="percent"
                              stroke="#f39c12"
                              strokeWidth={2}
                              fill="#fdecc8"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        <div className="text-center mt-2">
                          <p className="text-sm text-gray-500">
                            CPU Information
                          </p>
                          <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mx-auto">
                            {/* <span className="text-blue-600 font-semibold">
                              {cpuData && cpuData.percent}%
                            </span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-span-6 rounded-xl shadow p-4 col-md-6"
                    style={{ marginTop: "50px", borderRadius: "10px" }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <span className="text-blue-600 font-bold">
                          Total Disk :
                        </span>
                        <span> {diskInfo && diskInfo.limit_gb} GB </span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-bold">
                          Utilized :
                        </span>
                        <span> {diskInfo && diskInfo.used_gb} GB </span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-bold">
                          Utilization :
                        </span>
                        <span> {diskInfo && diskInfo.percent} % </span>
                      </div>
                    </div>
                    <ResponsiveContainer
                      width="100%"
                      height={255}
                      style={{ marginTop: "3rem" }}
                    >
                      <AreaChart data={filterDiskData}>
                        <XAxis
                          dataKey="time"
                          tickFormatter={(str) =>
                            new Date(str).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })
                          }
                        />
                        {/* <YAxis
                          domain={["auto", "auto"]}
                          tickFormatter={(v) => `${v.toFixed(1)} GB`}
                        /> */}
                        <YAxis tickFormatter={(v) => `${v.toFixed(1)} GB`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip formatter={(v) => `${v.toFixed(2)} GB`} />
                        <Area
                          type="monotone"
                          dataKey="used_gb"
                          stroke="#ff5722"
                          strokeWidth={2}
                          fill="#ffccbc"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-2">
                      <p className="text-sm text-gray-500">Disk Information</p>
                      {/* <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mx-auto">
                        <span className="text-blue-600 font-semibold">
                          32.1%
                        </span>
                      </div> */}
                    </div>
                  </div>
                </Row>

                <Row>
                  <div className="col-md-6">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Column 1: RAM Info */}
                      <div
                        className="col-span-6 rounded-xl shadow p-4"
                        style={{ borderRadius: "10px" }}
                      >
                        <h4 className="text-lg font-semibold mb-4">
                          RAM Information
                        </h4>
                        <div className="flex justify-between items-center mb-4">
                          <div className="space-x-4 flex items-center">
                            <span className="text-blue-600 font-bold">
                              RAM :{" "}
                            </span>
                            <span> {ramInfo && ramInfo.limit} MB </span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-bold">
                              Utilized :
                            </span>
                            <span> {ramInfo && ramInfo.used} MB </span>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={filterRAMData}>
                            <XAxis
                              dataKey="time"
                              tickFormatter={(str) =>
                                new Date(str).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              }
                            />
                            {/* <YAxis domain={["auto", "auto"]} /> */}
                            <YAxis tickFormatter={(v) => `${v} MB`} />
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <Tooltip formatter={(v) => `${v} MB`} />
                            <Area
                              type="monotone"
                              dataKey="ram_mb"
                              stroke="#fcd34d"
                              strokeWidth={2}
                              fill="#fef9c3"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        <div className="text-center mt-2">
                          <p className="text-sm text-gray-500">
                            Ram Utilization
                          </p>
                          <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mx-auto">
                            <span className="text-blue-600 font-semibold">
                              {ramInfo && ramInfo.percent} %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-span-6 rounded-xl shadow p-4 col-md-6"
                    style={{ borderRadius: "10px" }}
                  >
                    <h4 className="text-lg font-semibold mb-4">
                      Disk Information
                    </h4>
                    <div
                      className="flex justify-between items-center mb-4"
                      style={{ borderRadius: "10px" }}
                    >
                      <div>
                        {/* <span className="text-blue-600 font-bold">
                          I/O Read Speed :{" "}
                        </span>
                        <span> 0.01771 MB/s </span> */}
                      </div>
                      <span className="text-blue-600 font-medium">
                        🔵 I/O Read Speed(MB/s)
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={275}>
                      <BarChart data={filterIOReadData}>
                        <XAxis
                          dataKey="time"
                          tickFormatter={(str) =>
                            new Date(str).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })
                          }
                        />
                        <YAxis tickFormatter={(v) => `${v}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip formatter={(v) => `${v} MB/s`} />
                        <Bar dataKey="ioRead_mb" fill="#2f80ed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Row>

                <Row>
                  <div className="col-md-6">
                    {/* Column 3: Inodes */}
                    <div
                      className="col-span-6 rounded-xl shadow p-4 mt-4"
                      style={{ borderRadius: "10px" }}
                    >
                      <h4 className="text-lg font-semibold mb-4">
                        Inodes Information
                      </h4>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-blue-600 font-bold">
                            Total Inodes :
                          </span>
                          <span> {inodesInfo && inodesInfo.limit} </span>
                        </div>
                        <div>
                          <span className="text-blue-600 font-bold">
                            Utilized :
                          </span>
                          <span> {inodesInfo && inodesInfo.used} </span>
                        </div>
                        <div>
                          <span className="text-blue-600 font-bold">
                            Utilization(%) :
                          </span>
                          <span> {inodesInfo && inodesInfo.percent} % </span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={filterINodeData}>
                          <XAxis
                            dataKey="time"
                            tickFormatter={(str) => {
                              const date = new Date(str);
                              return date.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              });
                            }}
                          />
                          {/* <YAxis domain={["auto", "auto"]} /> */}
                          <YAxis tickFormatter={(v) => `${v.toFixed(1)} MB`} />
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="inodes_mb"
                            stroke="#374151"
                            strokeWidth={2}
                            fill="#e5e7eb"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Column 4: Disk Write */}
                  <div
                    className="col-span-6 rounded-xl shadow p-4 mt-4 col-md-6"
                    style={{ borderRadius: "10px" }}
                  >
                    {/* <h4 className="text-lg font-semibold mb-4">
                      Disk Write Speed
                    </h4> */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-blue-600 font-bold">
                          I/O Write Speed(MB/s)
                        </span>
                        {/* <span> 0.28699 MB/s </span> */}
                      </div>
                      {/* <span className="text-green-600 font-medium">
                         I/O Write Speed
                      </span> */}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={filterIOWriteData}>
                        <XAxis
                          dataKey="time"
                          tickFormatter={(str) =>
                            new Date(str).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })
                          }
                        />
                        <YAxis tickFormatter={(v) => `${v}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip formatter={(v) => `${v} MB/s`} />
                        <Bar dataKey="ioWrite_mb" fill="#27ae60" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Row>

                <Row>
                  <div className="col-md-6">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Other Info Components */}
                      <div
                        className="col-span-12 rounded-xl shadow p-4"
                        style={{ borderRadius: "10px" }}
                      >
                        <h4 className="text-lg font-semibold mb-4">
                          Network Info
                        </h4>
                        {/* <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-blue-600 font-bold">
                              Average Download Speed :
                            </span>
                            <span> 0.04655 MB/s </span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-bold">
                              Average Upload Speed :
                            </span>
                            <span> 0.04655 MB/s </span>
                          </div>
                        </div> */}
                        <ResponsiveContainer
                          width="100%"
                          height={350}
                          style={{ marginTop: "2rem" }}
                        >
                          <AreaChart data={filterNetworkData}>
                            <XAxis
                              dataKey="time"
                              tickFormatter={(str) =>
                                new Date(str).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              }
                            />
                            <YAxis
                              tickFormatter={(v) => `${(v / 1024).toFixed(1)}`}
                            />
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <Tooltip
                              formatter={(v) => `${(v / 1024).toFixed(2)} MB/s`}
                            />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="download"
                              stroke="#0000ff"
                              strokeWidth={2}
                              fillOpacity={0}
                              name="Download Speed"
                            />
                            <Area
                              type="monotone"
                              dataKey="upload"
                              stroke="#ff00ff"
                              strokeWidth={2}
                              fillOpacity={0}
                              name="Upload Speed"
                            />
                            <Area
                              type="monotone"
                              dataKey="total"
                              stroke="#ff1493"
                              strokeWidth={2}
                              fillOpacity={0}
                              name="Total Speed"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </Row>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitorGraph;

const UsageBar = ({ title, used, total }) => {
  const percent = ((used / total) * 100).toFixed(1);
  const bgColor =
    percent < 50
      ? "bg-green-400"
      : percent < 80
      ? "bg-yellow-400"
      : "bg-red-500";

  return (
    <div className="rounded-xl shadow-md p-4 w-full bg-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="text-sm font-medium text-gray-700">
          {used} / {total} GB
        </span>
      </div>
      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full text-xs text-center text-white ${bgColor}`}
          style={{
            width: `${percent}%`,
            borderRadius: "0.5rem",
          }}
        >
          {percent} %
        </div>
      </div>
    </div>
  );
};
