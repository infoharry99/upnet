import React, { useEffect, useState, useRef } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import "./BillingPage.css";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  currencyReturn,
  currencyReturnOnlyAmount,
  decryptData,
  getCurrencySymbol,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const BillReport = () => {
  const { smuser, appCurrency } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [billingData, setBillingData] = useState([]);
  const [allVMS, setAllVMS] = useState(null);
  const [cdnBillingData, setCDNBillingData] = useState([]);
  const [allCDN, setAllCDN] = useState([]);
  const [activeId, setActiveID] = useState(null);
  const billData = location.state ? location.state.billData : null;
  const isServerOrCDN = location.state ? location.state.isServerOrCDN : null;

  const [activeButton, setActiveButton] = useState("SERVER");
  const tabs = ["SERVER", "CDN"];

  const [showvm, setShowvm] = useState("all");
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedVM, setSelectedVM] = useState(null);
  const dropdownRef = useRef(null);

  const [visibleCDN, setVisibleCDN] = useState(false);
  const [showCDN, setShowCDN] = useState("all");
  const [searchTextCDN, setSearchTextCDN] = useState("");
  const [selectedCDN, setSelectedCDN] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredServerData, setFilteredServerData] = useState([]);
  const [startDatecdn, setStartDateCDN] = useState("");
  const [endDatecdn, setEndDateCDN] = useState("");
  const [filteredCDNData, setFilteredCDNData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveButton(isServerOrCDN);

    if (billData === null) {
      navigate(-1);
    } else {
      setActiveID(billData.vm_id);
      // console.log(billData, ".........BillingCall");
      BillingCall();
    }
    // BillingCall();
    function handleResize() {
      setIsMobile(isMobileDevice());
    }
    // document.addEventListener("mousedown", handleClick, false);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      // document.removeEventListener("mousedown", handleClick, false);
    };
  }, [isMobile]);

  const BillingCall = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: billData.vm_id,
      cdn_id: billData.id,
    };
    //console.log(payload, "CDNPAY");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/bill/bill_reports",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      const bills = loginResponse.bills;
      const cdnbills = loginResponse.cdnbills;
      const vms = loginResponse.vms;
      const cdn = loginResponse.cdn;

      // console.log(cdnbills, "==!==!==/bill/bill_reports");
      setCDNBillingData(cdnbills);
      setFilteredCDNData(cdnbills);

      if (vms !== null) {
        const vmArray = Object.keys(vms).map((key) => vms[key]);
        setAllVMS(vmArray);
      }

      if (cdn !== null) {
        const cdnArray = Object.keys(cdn).map((key) => cdn[key]);
        setAllCDN(cdnArray);
        // console.log(cdnArray, "==!==!==cdnArray");
      }

      const billsArray = Object.keys(bills).map((key) => bills[key]);
      setBillingData(billsArray);
      setFilteredServerData(billsArray);
      // const cdnbillsArray = Object.keys(cdnbills).map((key) => cdnbills[key]);

      setSearchText(billData.vm_name);
      setShowvm(billsArray.vm_id);

      // const userDetails = loginResponse;
      // const user = loginResponse.user;
      // const vm = loginResponse.vm;

      // const vmArray = Object.keys(vm).map((key) => vm[key]);
      // //console.log(vmArray, "==!==!==vvmArraym");
      // setBillingData(vmArray);
      // const vmArray = Object.keys(vm).map((key) => vm[key]);
      // localStorage.setItem("NEW_USER", JSON.stringify(userDetails));
      // window.location.href = "/";
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const handleChangeMachine = (value) => {
    if (activeId !== null) {
      setBillingData(null);
      UpdateTable();
    }
  };

  const UpdateTable = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      vm_id: activeId,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/bill/bill_reports",
        encryptedResponse
      );   
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "==!==!==/bill/bill_reports");
      const bills = loginResponse.bills;
      setBillingData(bills);
      const vms = loginResponse.vms;
      const vmArray = Object.keys(vms).map((key) => vms[key]);
      //console.log(bills, "==!==!==bills");
      //console.log(vmArray, "==!==!==vmArray");
      setAllVMS(vmArray);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleClick = (e) => {
    // if (dropdownRef.current.contains(e.target)) {
    //   return;
    // }
    if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
      return;
    }
    setVisible(false);
    setVisibleCDN(false);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setShowvm("all");
    }
    if (!visible) {
      setVisible(true);
    }
  };

  const handleChangeCDN = (e) => {
    setSearchTextCDN(e.target.value);
    if (e.target.value === "") {
      setShowCDN("all");
    }
    if (!visibleCDN) {
      setVisibleCDN(true);
    }
  };

  const selectItem = (item) => {
    setSearchText(item.vm_name);
    setSelectedVM(item.vm_id);
    setShowvm(item.vm_id);
    setVisible(false);
  };

  const selectItemCDN = (item) => {
    setSearchTextCDN(item.website_url);
    setSelectedCDN(item.id);
    setShowCDN(item.id);
    setVisibleCDN(false);
  };

  const searchFilter = (searchValue, list, searchBy = "vm_name") => {
    let lowerCaseQuery = searchValue.toLowerCase();
    let filteredList = searchValue
      ? list.filter((x) => x[searchBy].toLowerCase().includes(lowerCaseQuery))
      : list;
    return filteredList;
  };

  const searchFilterCDN = (searchValue, list, searchBy = "website_url") => {
    let lowerCaseQuery = searchValue.toLowerCase();
    let filteredList = searchValue
      ? list.filter((x) => x[searchBy].toLowerCase().includes(lowerCaseQuery))
      : list;
    return filteredList;
  };

  const exportToExcelServer = (data) => {
    // console.log(data, "bill Data");

    const filteredData = data.map((item) => ({
      server_name: billData.vm_name,
      Action_performed: `${item.vm_action}\n${item.action_time}\n${
        item.vm_action === "DELETE" ? "(added to wallet)" : ""
      }`,

      Previous_action: `${item.vm_action}\n${item.created_at}\n${
        item.vm_action === "DELETE" ? "(added to wallet)" : ""
      }`,

      Previous_configuration: ` ${
        item.disk_type !== null
          ? `${item.ram / 1024} GB / ${
              item.disk_type === "hdd"
                ? item.hard_disk
                : item.disk_type === "ssd"
                ? item.ssd
                : item.nvme
            } GB / ${item.cpu} vCPU(s)`
          : `${item.ram / 1024} GB / ${item.hard_disk} GB / ${item.cpu} vCPU`
      }`,

      Present_configuration: ` ${
        item.disk_type !== null
          ? `${item.ram / 1024} GB / ${
              item.disk_type === "hdd"
                ? item.hard_disk
                : item.disk_type === "ssd"
                ? item.ssd
                : item.nvme
            } GB / ${item.cpu} vCPU(s)`
          : `${item.ram / 1024} GB / ${item.hard_disk} GB / ${item.cpu} vCPU`
      }`,

      cost: `${
        appCurrency &&
        smuser &&
        currencyReturn({
          price:
            item.vm_action == "DELETE" ? item.wallet_comes : item.linode_rate,
          symbol: smuser.prefer_currency,
          rates: appCurrency,
        })
      }`,
    }));

    const fileName = "billingData";
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToExcelCDN = (data) => {
    // console.log(data, "AA");
    const filteredData = data.map((item) => ({
      cdn_name: billData.website_url,
      Action_performed: item.vm_action,
      Previous_action: item.vm_action,
      total_data: item.cdn_datatransfer,
      remain_data: item.remaining_data,
      amount: `${
        appCurrency &&
        smuser &&
        currencyReturn({
          price:
            item.vm_action == "DELETE" ? item.wallet_comes : item.linode_rate,
          symbol: smuser.prefer_currency,
          rates: appCurrency,
        })
      }`,
    }));

    const fileName = "cdn_Data";
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const filterServerByDate = () => {
    const filtered = billingData.filter((item) => {
      const itemDate = new Date(item.created_at);
      const start = new Date(startDate);
      const end = new Date(endDate);

      itemDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return itemDate >= start && itemDate <= end;
    });
    setFilteredServerData(filtered);
  };

  const filterCDNbyDate = () => {
    const filtered = cdnBillingData.filter((item) => {
      const itemDate = new Date(item.created_at);
      const start = new Date(startDatecdn);
      const end = new Date(endDatecdn);

      itemDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return (
        (itemDate >= start || itemDate == start) &&
        (itemDate <= end || itemDate == end)
      );
    });
    setFilteredCDNData(filtered);
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
      }}
    >
      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-bill">
            VM Billing List <span></span>
          </div>
          <div
            style={{
              position: "absolute",
              marginLeft: "15px",
              marginTop: "1rem",
            }}
          >
            {tabs.map((title, idx) => (
              <Button
                key={idx}
                style={{
                  background: `${
                    activeButton === title ? "#f47c20" : "#035189"
                  }`,
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
                onClick={() => {
                  setActiveButton(title);
                }}
              >
                {title}
              </Button>
            ))}
          </div>

          <div className="features-section-solution">
            {/* <div
              style={{
                position: "relative",
                backgroundColor: "#e97730",
                padding: "18px",
                borderRadius: "20px",
                zIndex: "999",
                width: "88%",
                marginLeft: "25px",
                marginTop: "5rem",
              }}
            >
              <div
                style={{
                  // display: "flex",
                  position: "relative",
                  zIndex: "1",
                }}
              >
                <select
                  name="plan_time"
                  style={{
                    borderRadius: "30px",
                    marginRight: "10px",
                    padding: "10px 15px",
                    border: "2px solid #e97730",
                    width: "17rem",
                    marginRight: "15px",
                  }}
                  // value={activeId}
                  onChange={(e) => {
                    setActiveID(e.target.value);
                    handleChangeMachine(e.target.value);
                    ////console.log(e.target.value);
                  }}
                >
                  {/* <option value={activeId}>Select</option> }
                  {allVMS &&
                    allVMS.map((item, index) => (
                      <option key={index} value={item.vm_id}>
                        {item.vm_name}
                      </option>
                    ))}
                </select>
                <div className="search-form" style={{ marginTop: "10px" }}>
                  <div
                    className="input-container-notif"
                    style={{ width: "16rem" }}
                  >
                    {/* <FaCalendar style={{ color: "white" }} /> }
                    <input
                      //   value={email}
                      type="date"
                      name="from"
                      className="input-signup"
                      placeholder="From"
                      //   onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div
                    className="input-container-notif"
                    style={{ width: "16rem" }}
                  >
                    {/* <FaCalendar style={{ color: "white" }} /> }
                    <input
                      //   value={email}
                      type="date"
                      name="to"
                      className="input-signup"
                      placeholder="To"
                      //   style={{color:'white'}}
                      //   onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <input type="hidden" id="getval" value="All" />
                  <div className="button-fields">
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
                        // onClick={submitData}
                      />
                    </div>
                    <div
                      className="button-cont"
                      style={{
                        marginTop: "-11px",
                        // marginRight: "10px",
                      }}
                    >
                      <input
                        type="export"
                        name="export"
                        value="Export"
                        className="input-submit new-btn-export"
                        style={{
                          paddingLeft: "33px",
                          fontWeight: "700",
                          color: "#154e7a",
                          backgroundColor: "white",
                          marginLeft: "10px",
                          width: "7rem",
                          /* margin-top: 35px; 
                          borderRadius: "50px",
                          /* padding: 10px 30px; 
                          border: "1px solid rgb(255, 255, 255);",
                        }}
                        // onClick={submitData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {activeButton === "SERVER" && (
              <Row>
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "#e97730",
                    padding: "18px",
                    borderRadius: "20px",
                    zIndex: "999",
                    width: "88%",
                    marginLeft: "20px",
                    marginTop: "2rem",
                  }}
                >
                  <div
                    style={{
                      // display: "flex",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    {/* <select
                      name="plan_time"
                      style={{
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "10px 15px",
                        border: "2px solid #e97730",
                        width: "15rem",
                        marginRight: "15px",
                      }}
                      // value={activeId}
                      onChange={(e) => {
                        setActiveID(e.target.value);
                        handleChangeMachine(e.target.value);
                        //console.log(e.target.value);
                      }}
                    >
                      {/* <option value={activeId}>Select</option> }
                      {allVMS &&
                        allVMS.map((item, index) => (
                          <option key={index} value={item.vm_id}>
                            {item.vm_name}
                          </option>
                        ))}
                    </select> */}

                    <input
                      className="input"
                      type="text"
                      // placeholder="Search Server"
                      value={billData.vm_name}
                      // onChange={handleChange}
                      style={{
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "10px 15px",
                        border: "2px solid #e97730",
                        // width: "20rem",
                        // marginLeft: "5px",
                        marginRight: "15px",
                        fontSize: "16px",
                      }}
                      onFocus={() => {
                        //   // if (searchValue) {
                        //   setVisible(true);
                        //   // };
                        setStartDate("");
                        setEndDate("");
                      }}
                    />

                    <div className="search-form" style={{ marginTop: "10px" }}>
                      <div
                        className="input-container-notif"
                        style={{ width: "17rem" }}
                      >
                        <input
                          //   value={email}
                          type="date"
                          name="from"
                          className="input-signup"
                          placeholder="From"
                          //   onChange={(e) => setEmail(e.target.value)}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div
                        className="input-container-notif"
                        style={{ width: "17rem" }}
                      >
                        <input
                          //   value={email}
                          type="date"
                          name="to"
                          className="input-signup"
                          placeholder="To"
                          //   style={{color:'white'}}
                          //   onChange={(e) => setEmail(e.target.value)}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <input type="hidden" id="getval" value="All" />
                      <div className="button-fields">
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
                            onClick={() => {
                              filterServerByDate();
                            }}
                          />
                        </div>
                        <div
                          className="button-cont"
                          style={{
                            marginTop: "-11px",
                            // marginRight: "10px",
                          }}
                        >
                          <input
                            type="export"
                            name="export"
                            value="Export"
                            readOnly
                            className="input-submit new-btn-export"
                            style={{
                              // paddingLeft: "23px",
                              fontWeight: "700",
                              color: "#154e7a",
                              backgroundColor: "white",
                              marginLeft: "10px",
                              width: "7rem",
                              /* margin-top: 35px; */
                              borderRadius: "50px",
                              /* padding: 10px 30px; */
                              border: "1px solid rgb(255, 255, 255);",
                            }}
                            onClick={() =>
                              exportToExcelServer(filteredServerData)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div
                    // ref={dropdownRef}
                    className={`dropdown ${visible ? "v" : ""}`}
                  >
                    {
                      <ul>
                        {/* {!allVMS && (
                          <li key="zxc" className="dropdown_item">
                            no result
                          </li>
                        )} */}

                  {/* {allVMS &&
                          searchFilter(searchText, allVMS).map((x) => (
                            <option
                              key={x.vm_id}
                              // value={x.vm_id}
                              // onClick={() => selectItem(x)}
                              className="dropdown_item"
                            > */}
                  {/* <option key={index} value={item.vm_id}>
                              {item.vm_name}
                            </option> */}
                  {/* <div className="item_text1">{billData.vm_name}</div> */}
                  {/* </option>
                          ))} }
                      </ul>
                    }
                  </div> */}
                </div>

                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      marginTop: "2rem",
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="billing-list">
                      <div className="table-row no-hover">
                        <div className="table-head">
                          <div className="table-content">
                            <div>Action Performed</div>
                            <div style={{ fontSize: "14px" }}>Action Time</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Previous Action</div>
                            <div style={{ fontSize: "14px" }}>Action Time</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Previous Configuration</div>
                            <div style={{ fontSize: "14px" }}>
                              RAM/DISK/vCPU
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Present Configuration</div>
                            <div style={{ fontSize: "14px" }}>
                              RAM/DISK/vCPU
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>

                        <div className="table-head">
                          <div className="table-content">
                            <div>Cost</div>
                            <div style={{ fontSize: "14px" }}>
                              (in {smuser && smuser.prefer_currency}) (
                              {getCurrencySymbol(smuser.prefer_currency)})
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                      </div>
                      {/* .filter((item) => item.wallet_comes !== null) */}
                      {billingData &&
                        billingData.map((item, idx) => (
                          <div className="table-row">
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.vm_action}
                                  {/* {item.bill_type === "recharge"
                                ? "RECHARGE"
                                : item.vm_action === "CREATE"
                                ? "CREATE"
                                : null} */}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.action_time}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.vm_action === "DELETE"
                                    ? "(added to wallet)"
                                    : ""}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.vm_action}
                                  {item.vm_action === "DELETE" ? "1" : ""}
                                  {/* {item.bill_type === "recharge"
                                ? "RECHARGE"
                                : item.vm_action === "DELETE"
                                ? "DELETE"
                                : null} */}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.created_at}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.vm_action === "DELETE"
                                    ? "(added to wallet)"
                                    : ""}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                {item.ram / 1024} GB /{" "}
                                {item.disk_type == "hdd"
                                  ? item.hard_disk
                                  : item.disk_type == "ssd"
                                  ? item.ssd
                                  : item.nvme}{" "}
                                GB / {item.cpu} CPU(s)
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.ram / 1024} GB /{" "}
                                  {item.disk_type == "hdd"
                                    ? item.hard_disk
                                    : item.disk_type == "ssd"
                                    ? item.ssd
                                    : item.nvme}{" "}
                                  GB / {item.cpu} CPU(s)
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            {/* <div className="table-data">
                            <div className="table-content">
                               {item.ram / 1024} GB / {item.hard_disk} GB /{" "}
                              {item.cpu} CPU(s) 
                            </div>
                            <img
                              src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                              className="bg-image"
                              alt="Background"
                            />
                          </div> */}
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  <strong>
                                    <i
                                      className="fas fa-rupee-sign"
                                      style={{ paddingTop: "3px" }}
                                      aria-hidden="true"
                                    ></i>
                                    <span>
                                      -
                                      {appCurrency &&
                                        smuser &&
                                        currencyReturnOnlyAmount({
                                          price:
                                            item.vm_action == "DELETE"
                                              ? item.wallet_comes
                                              : item.linode_rate,
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {/* currencyReturn({price: "userNative_credit",symbol: "smuser.prefer_currency",rates: "appCurrency"}) */}
                                      {/* <FaRupeeSign />
                                    {appCurrency &&
                                      item.cost / parseFloat(appCurrency)}{" "}
                                    /- */}
                                    </span>
                                  </strong>
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                          </div>
                        ))}

                      <div className="table-row no-hover">
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        {/* <div className="table-foot">
                        <img
                          src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div> */}
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            )}

            {activeButton === "CDN" && (
              <Row>
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "#e97730",
                    padding: "18px",
                    borderRadius: "20px",
                    zIndex: "999",
                    width: "88%",
                    marginLeft: "20px",
                    marginTop: "2rem",
                  }}
                >
                  <div
                    style={{
                      // display: "flex",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    {/* <select
                      name="plan_time"
                      style={{
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "10px 15px",
                        border: "2px solid #e97730",
                        width: "15rem",
                        marginRight: "15px",
                      }}
                      // value={activeId}
                      onChange={(e) => {
                        //setActiveID(e.target.value);
                        //handleChangeMachine(e.target.value);
                        //console.log(e.target.value);
                      }}
                    >
                      {/* <option value={activeId}>Select</option> */}
                    {/* {allCDN &&
                        allCDN.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.website_url}
                          </option>
                        ))} }
                    </select> */}

                    <input
                      className="input"
                      type="text"
                      // placeholder="Search Website"
                      value={billData.website_url}
                      // onChange={handleChangeCDN}
                      style={{
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "10px 15px",
                        border: "2px solid #e97730",
                        // width: "20rem",
                        // marginLeft: "5px",
                        marginRight: "15px",
                        fontSize: "16px",
                      }}
                      onFocus={() => {
                        //   // if (searchValue) {
                        //   setVisibleCDN(true);
                        //   // };
                        setStartDateCDN("");
                        setEndDateCDN("");
                      }}
                    />

                    <div className="search-form" style={{ marginTop: "10px" }}>
                      <div
                        className="input-container-notif"
                        style={{ width: "17rem" }}
                      >
                        {/* <FaCalendar style={{ color: "white" }} /> */}
                        <input
                          //   value={email}
                          type="date"
                          name="from"
                          className="input-signup"
                          placeholder="From"
                          value={startDatecdn}
                          onChange={(e) => setStartDateCDN(e.target.value)}
                        />
                      </div>
                      <div
                        className="input-container-notif"
                        style={{ width: "17rem" }}
                      >
                        {/* <FaCalendar style={{ color: "white" }} /> */}
                        <input
                          //   value={email}
                          type="date"
                          name="to"
                          className="input-signup"
                          placeholder="To"
                          value={endDatecdn}
                          onChange={(e) => setEndDateCDN(e.target.value)}
                        />
                      </div>
                      <input type="hidden" id="getval" value="All" />
                      <div className="button-fields">
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
                            onClick={() => {
                              filterCDNbyDate();
                            }}
                          />
                        </div>
                        <div
                          className="button-cont"
                          style={{
                            marginTop: "-11px",
                            // marginRight: "10px",
                          }}
                        >
                          <input
                            type="export"
                            name="export"
                            value="Export"
                            readOnly
                            className="input-submit new-btn-export"
                            style={{
                              // paddingLeft: "23px",
                              fontWeight: "700",
                              color: "#154e7a",
                              backgroundColor: "white",
                              marginLeft: "10px",
                              width: "7rem",
                              /* margin-top: 35px; */
                              borderRadius: "50px",
                              /* padding: 10px 30px; */
                              border: "1px solid rgb(255, 255, 255);",
                            }}
                            onClick={() => exportToExcelCDN(filteredCDNData)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div
                    // ref={dropdownRef}
                    className={`dropdown ${visibleCDN ? "v" : ""}`}
                  >
                    {visibleCDN && (
                      <ul>
                        {/* {!allCDN && (
                          <li key="zxc" className="dropdown_item">
                            no result
                          </li>
                        )} */}

                  {/* {allCDN &&
                          searchFilterCDN(searchTextCDN, allCDN).map((x) => (
                            <option
                              key={x.id}
                              // value={x.vm_id}
                              onClick={() => selectItemCDN(x)}
                              className="dropdown_item"
                            > */}
                  {/* <option key={index} value={item.vm_id}>
                              {item.vm_name}
                            </option> }
                        <div className="item_text1">
                          {billData.website_url}
                        </div>
                        {/* </option> */}
                  {/* ))}}
                      </ul>
                    )}
                  </div> */}
                </div>

                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      marginTop: "2rem",
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="billing-list">
                      <div className="table-row no-hover">
                        <div className="table-head">
                          <div className="table-content">
                            <div>Action Performed</div>
                            <div style={{ fontSize: "14px" }}>Action Time</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Previous Action</div>
                            <div style={{ fontSize: "14px" }}>Action Time</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Total Data</div>
                            {/* <div style={{ fontSize: "14px" }}>
                              RAM/DISK/vCPU
                            </div> */}
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Remain Data</div>
                            {/* <div style={{ fontSize: "14px" }}>
                              RAM/DISK/vCPU
                            </div> */}
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>

                        <div className="table-head">
                          <div className="table-content">
                            <div>Cost</div>
                            <div style={{ fontSize: "14px" }}>
                              (in {smuser && smuser.prefer_currency}) (
                              {getCurrencySymbol(smuser.prefer_currency)})
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                      </div>
                      {/* .filter((item) => item.wallet_comes !== null) */}
                      {filteredCDNData &&
                        filteredCDNData.map((item, idx) => (
                          <div className="table-row">
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.vm_action}
                                  {/* {item.bill_type === "recharge"
                                  ? "RECHARGE"
                                  : item.vm_action === "CREATE"
                                  ? "CREATE"
                                  : null} */}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.action_time}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.vm_action === "DELETE"
                                    ? "(added to wallet)"
                                    : ""}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.vm_action}

                                  {/* {item.bill_type === "recharge"
                                  ? "RECHARGE"
                                  : item.vm_action === "DELETE"
                                  ? "DELETE"
                                  : null} */}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.created_at}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.vm_action === "DELETE"
                                    ? "(added to wallet)"
                                    : ""}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                {/* {item.ram / 1024} GB /{" "}
                              {item.disk_type == "hdd"
                                ? item.hard_disk
                                : item.disk_type == "ssd"
                                ? item.ssd
                                : item.nvme}{" "}
                              GB / {item.cpu} vCPU(s) */}
                                {item.cdn_datatransfer} TB{" "}
                                {/* {item.disk_type == "hdd"
                                  ? item.hard_disk
                                  : item.disk_type == "ssd"
                                  ? item.ssd
                                  : item.nvme}{" "}
                                GB / {item.cpu} vCPU */}
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.remaining_data} TB{" "}
                                  {/* {item.disk_type == "hdd"
                                    ? item.hard_disk
                                    : item.disk_type == "ssd"
                                    ? item.ssd
                                    : item.nvme}{" "}
                                  GB / {item.cpu} vCPU */}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            {/* <div className="table-data">
                            <div className="table-content">
                               {item.ram / 1024} GB / {item.hard_disk} GB /{" "}
                              {item.cpu} CPU(s) 
                            </div>
                            <img
                              src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                              className="bg-image"
                              alt="Background"
                            />
                          </div> */}
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  <strong>
                                    <i
                                      className="fas fa-rupee-sign"
                                      style={{ paddingTop: "3px" }}
                                      aria-hidden="true"
                                    ></i>
                                    <span>
                                      {item.vm_action == "DELETE" ? "+ " : "- "}

                                      {appCurrency &&
                                        smuser &&
                                        currencyReturnOnlyAmount({
                                          price:
                                            item.vm_action == "DELETE"
                                              ? item.wallet_comes
                                              : item.linode_rate,
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {/* currencyReturn({price: "userNative_credit",symbol: "smuser.prefer_currency",rates: "appCurrency"}) */}
                                      {/* <FaRupeeSign />
                                    {appCurrency &&
                                      item.cost / parseFloat(appCurrency)}{" "}
                                    /- */}
                                    </span>
                                  </strong>
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                          </div>
                        ))}

                      <div className="table-row no-hover">
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        {/* <div className="table-foot">
                        <img
                          src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div> */}
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            )}
          </div>
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "50rem", paddingLeft: "7rem", paddingTop: "4rem" }}
        >
          <div className="heading-dotted-bill">
            VM Billing List <span></span>
          </div>
          <div
            style={{
              position: "absolute",
              marginLeft: "9rem",
              marginTop: "1rem",
            }}
          >
            {tabs.map((title, idx) => (
              <Button
                key={idx}
                style={{
                  background: `${
                    activeButton === title ? "#f47c20" : "#035189"
                  }`,
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
                onClick={() => {
                  setActiveButton(title);
                }}
              >
                {title}
              </Button>
            ))}
          </div>

          {activeButton === "SERVER" && (
            <div className="features-section-solution">
              <Row>
                <div
                  style={{
                    marginLeft: "9rem",
                    marginTop: "60px",
                    position: "relative",
                    backgroundColor: "#e97730",
                    padding: "18px",
                    borderRadius: "20px",
                    zIndex: "999",
                    width: "70%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    {/* <select
                      name="plan_time"
                      style={{
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "10px 15px",
                        border: "2px solid #e97730",
                        width: "15rem",
                        marginRight: "15px",
                      }}
                      // value={activeId}
                      onChange={(e) => {
                        setActiveID(e.target.value);
                        handleChangeMachine(e.target.value);
                        //console.log(e.target.value);
                      }}
                    >
                      {/* <option value={activeId}>Select</option> }
                      {allVMS &&
                        allVMS.map((item, index) => (
                          <option key={index} value={item.vm_id}>
                            {item.vm_name}
                          </option>
                        ))}
                    </select> */}

                    <input
                      className="input"
                      type="text"
                      // placeholder="Search Server"
                      value={billData.vm_name}
                      // onChange={handleChange}
                      style={{
                        borderRadius: "15px",
                        paddingLeft: "10px",
                        marginLeft: "10px",
                      }}
                      onFocus={() => {
                        //   // if (searchValue) {
                        //   setVisible(true);
                        //   // };
                        setStartDate("");
                        setEndDate("");
                      }}
                    />

                    <div
                      className="search-form"
                      style={{ marginTop: "10px", marginLeft: "20px" }}
                    >
                      <div className="input-container-notif">
                        {/* <FaCalendar style={{ color: "white" }} /> */}
                        <input
                          //   value={email}
                          type="date"
                          name="from"
                          className="input-signup"
                          placeholder="From"
                          //   onChange={(e) => setEmail(e.target.value)}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="input-container-notif">
                        {/* <FaCalendar style={{ color: "white" }} /> */}
                        <input
                          //   value={email}
                          type="date"
                          name="to"
                          className="input-signup"
                          placeholder="To"
                          //   style={{color:'white'}}
                          //   onChange={(e) => setEmail(e.target.value)}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <input type="hidden" id="getval" value="All" />
                      <div className="button-fields">
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
                            onClick={() => {
                              filterServerByDate();
                            }}
                          />
                        </div>
                        <div
                          className="button-cont"
                          style={{
                            marginTop: "-11px",
                            // marginRight: "10px",
                          }}
                        >
                          <input
                            type="export"
                            name="export"
                            value="Export"
                            readOnly
                            className="input-submit new-btn-export"
                            style={{
                              paddingLeft: "23px",
                              fontWeight: "700",
                              color: "#154e7a",
                              backgroundColor: "white",
                              marginLeft: "10px",
                              width: "6rem",
                              /* margin-top: 35px; */
                              borderRadius: "50px",
                              /* padding: 10px 30px; */
                              border: "1px solid rgb(255, 255, 255);",
                            }}
                            onClick={() =>
                              exportToExcelServer(filteredServerData)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div
                    // ref={dropdownRef}
                    className={`dropdown ${visible ? "v" : ""}`}
                  >
                    {
                      <ul>
                        {/* {!allVMS && (
                          <li key="zxc" className="dropdown_item">
                            no result
                          </li>
                        )} */}

                  {/* {allVMS &&
                          searchFilter(searchText, allVMS).map((x) => (
                            <option
                              key={x.vm_id}
                              // value={x.vm_id}
                              // onClick={() => selectItem(x)}
                              className="dropdown_item"
                            > */}
                  {/* <option key={index} value={item.vm_id}>
                              {item.vm_name}
                            </option> */}
                  {/* <div className="item_text1">{billData.vm_name}</div> */}
                  {/* </option>
                          ))} }
                      </ul>
                    }
                  </div> */}
                </div>

                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      marginLeft: "8rem",
                      marginTop: "2rem",
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="billing-list">
                      <div className="table-row no-hover">
                        <div className="table-head">
                          <div className="table-content">
                            <div>Action Performed</div>
                            <div style={{ fontSize: "14px" }}>Action Time</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Previous Action</div>
                            <div style={{ fontSize: "14px" }}>Action Time</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Previous Configuration</div>
                            <div style={{ fontSize: "14px" }}>
                              RAM/DISK/vCPU
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Present Configuration</div>
                            <div style={{ fontSize: "14px" }}>
                              RAM/DISK/vCPU
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>

                        <div className="table-head">
                          <div className="table-content">
                            <div>Cost</div>
                            <div style={{ fontSize: "14px" }}>
                              (in {smuser && smuser.prefer_currency}) (
                              {getCurrencySymbol(smuser.prefer_currency)})
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                      </div>
                      {/* .filter((item) => item.wallet_comes !== null) */}
                      {filteredServerData &&
                        filteredServerData.map((item, idx) => (
                          <div className="table-row">
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.vm_action}
                                  {/* {item.bill_type === "recharge"
                                  ? "RECHARGE"
                                  : item.vm_action === "CREATE"
                                  ? "CREATE"
                                  : null} */}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.action_time}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.vm_action === "DELETE"
                                    ? "(added to wallet)"
                                    : ""}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.vm_action}

                                  {/* {item.bill_type === "recharge"
                                  ? "RECHARGE"
                                  : item.vm_action === "DELETE"
                                  ? "DELETE"
                                  : null} */}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.created_at}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.vm_action === "DELETE"
                                    ? "(added to wallet)"
                                    : ""}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                {/* {item.ram / 1024} GB /{" "}
                              {item.disk_type == "hdd"
                                ? item.hard_disk
                                : item.disk_type == "ssd"
                                ? item.ssd
                                : item.nvme}{" "}
                              GB / {item.cpu} vCPU(s) */}
                                {item.ram / 1024} GB /{" "}
                                {item.disk_type == "hdd"
                                  ? item.hard_disk
                                  : item.disk_type == "ssd"
                                  ? item.ssd
                                  : item.nvme}{" "}
                                GB / {item.cpu} vCPU
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.ram / 1024} GB /{" "}
                                  {item.disk_type == "hdd"
                                    ? item.hard_disk
                                    : item.disk_type == "ssd"
                                    ? item.ssd
                                    : item.nvme}{" "}
                                  GB / {item.cpu} vCPU
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            {/* <div className="table-data">
                            <div className="table-content">
                               {item.ram / 1024} GB / {item.hard_disk} GB /{" "}
                              {item.cpu} CPU(s) 
                            </div>
                            <img
                              src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                              className="bg-image"
                              alt="Background"
                            />
                          </div> */}
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  <strong>
                                    <i
                                      className="fas fa-rupee-sign"
                                      style={{ paddingTop: "3px" }}
                                      aria-hidden="true"
                                    ></i>
                                    <span>
                                      {item.vm_action == "DELETE" ? "+ " : "- "}

                                      {appCurrency &&
                                        smuser &&
                                        currencyReturnOnlyAmount({
                                          price:
                                            item.vm_action == "DELETE"
                                              ? item.wallet_comes
                                              : item.linode_rate,
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {/* currencyReturn({price: "userNative_credit",symbol: "smuser.prefer_currency",rates: "appCurrency"}) */}
                                      {/* <FaRupeeSign />
                                    {appCurrency &&
                                      item.cost / parseFloat(appCurrency)}{" "}
                                    /- */}
                                    </span>
                                  </strong>
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                          </div>
                        ))}

                      <div className="table-row no-hover">
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        {/* <div className="table-foot">
                        <img
                          src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div> */}
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </div>
          )}

          {activeButton === "CDN" && (
            <div className="features-section-solution">
              <Row>
                <div
                  style={{
                    marginLeft: "9rem",
                    marginTop: "60px",
                    position: "relative",
                    backgroundColor: "#e97730",
                    padding: "18px",
                    borderRadius: "20px",
                    zIndex: "999",
                    width: "70%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    {/* <select
                      name="plan_time"
                      style={{
                        borderRadius: "30px",
                        marginRight: "10px",
                        padding: "10px 15px",
                        border: "2px solid #e97730",
                        width: "15rem",
                        marginRight: "15px",
                      }}
                      // value={activeId}
                      onChange={(e) => {
                        //setActiveID(e.target.value);
                        //handleChangeMachine(e.target.value);
                        //console.log(e.target.value);
                      }}
                    >
                      {/* <option value={activeId}>Select</option> */}
                    {/* {allCDN &&
                        allCDN.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.website_url}
                          </option>
                        ))} }
                    </select> */}

                    <input
                      className="input"
                      type="text"
                      // placeholder="Search Website"
                      value={billData.website_url}
                      // onChange={handleChangeCDN}
                      style={{ borderRadius: "15px", marginLeft: "10px" }}
                      onFocus={() => {
                        //   // if (searchValue) {
                        //   setVisibleCDN(true);
                        //   // };
                        setStartDateCDN("");
                        setEndDateCDN("");
                      }}
                    />

                    <div
                      className="search-form"
                      style={{ marginTop: "10px", marginLeft: "20px" }}
                    >
                      <div className="input-container-notif">
                        {/* <FaCalendar style={{ color: "white" }} /> */}
                        <input
                          //   value={email}
                          type="date"
                          name="from"
                          className="input-signup"
                          placeholder="From"
                          value={startDatecdn}
                          onChange={(e) => setStartDateCDN(e.target.value)}
                        />
                      </div>
                      <div className="input-container-notif">
                        {/* <FaCalendar style={{ color: "white" }} /> */}
                        <input
                          //   value={email}
                          type="date"
                          name="to"
                          className="input-signup"
                          placeholder="To"
                          value={endDatecdn}
                          onChange={(e) => setEndDateCDN(e.target.value)}
                        />
                      </div>
                      <input type="hidden" id="getval" value="All" />
                      <div className="button-fields">
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
                            onClick={() => {
                              filterCDNbyDate();
                            }}
                          />
                        </div>
                        <div
                          className="button-cont"
                          style={{
                            marginTop: "-11px",
                            // marginRight: "10px",
                          }}
                        >
                          <input
                            type="export"
                            name="export"
                            value="Export"
                            readOnly
                            className="input-submit new-btn-export"
                            style={{
                              paddingLeft: "23px",
                              fontWeight: "700",
                              color: "#154e7a",
                              backgroundColor: "white",
                              marginLeft: "10px",
                              width: "6rem",
                              /* margin-top: 35px; */
                              borderRadius: "50px",
                              /* padding: 10px 30px; */
                              border: "1px solid rgb(255, 255, 255);",
                            }}
                            onClick={() => exportToExcelCDN(filteredCDNData)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div
                    // ref={dropdownRef}
                    className={`dropdown ${visibleCDN ? "v" : ""}`}
                  >
                    {visibleCDN && (
                      <ul>
                        {/* {!allCDN && (
                          <li key="zxc" className="dropdown_item">
                            no result
                          </li>
                        )} */}

                  {/* {allCDN &&
                          searchFilterCDN(searchTextCDN, allCDN).map((x) => (
                            <option
                              key={x.id}
                              // value={x.vm_id}
                              onClick={() => selectItemCDN(x)}
                              className="dropdown_item"
                            > */}
                  {/* <option key={index} value={item.vm_id}>
                              {item.vm_name}
                            </option> }
                        <div className="item_text1">
                          {billData.website_url}
                        </div>
                        {/* </option> */}
                  {/* ))}}
                      </ul>
                    )}
                  </div> */}
                </div>

                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      marginLeft: "8rem",
                      marginTop: "2rem",
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="billing-list">
                      <div className="table-row no-hover">
                        <div className="table-head">
                          <div className="table-content">
                            <div>Action Performed</div>
                            <div style={{ fontSize: "14px" }}>Action Time</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Previous Action</div>
                            <div style={{ fontSize: "14px" }}>Action Time</div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Total Data</div>
                            {/* <div style={{ fontSize: "14px" }}>
                              RAM/DISK/vCPU
                            </div> */}
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">
                            <div>Remain Data</div>
                            {/* <div style={{ fontSize: "14px" }}>
                              RAM/DISK/vCPU
                            </div> */}
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>

                        <div className="table-head">
                          <div className="table-content">
                            <div>Cost</div>
                            <div style={{ fontSize: "14px" }}>
                              (in {smuser && smuser.prefer_currency}) (
                              {getCurrencySymbol(smuser.prefer_currency)})
                            </div>
                          </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                      </div>
                      {/* .filter((item) => item.wallet_comes !== null) */}
                      {filteredCDNData &&
                        filteredCDNData.map((item, idx) => (
                          <div className="table-row">
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.vm_action}
                                  {/* {item.bill_type === "recharge"
                                  ? "RECHARGE"
                                  : item.vm_action === "CREATE"
                                  ? "CREATE"
                                  : null} */}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.action_time}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.vm_action === "DELETE"
                                    ? "(added to wallet)"
                                    : ""}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.vm_action}

                                  {/* {item.bill_type === "recharge"
                                  ? "RECHARGE"
                                  : item.vm_action === "DELETE"
                                  ? "DELETE"
                                  : null} */}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.created_at}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {item.vm_action === "DELETE"
                                    ? "(added to wallet)"
                                    : ""}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                {/* {item.ram / 1024} GB /{" "}
                              {item.disk_type == "hdd"
                                ? item.hard_disk
                                : item.disk_type == "ssd"
                                ? item.ssd
                                : item.nvme}{" "}
                              GB / {item.cpu} vCPU(s) */}
                                {item.cdn_datatransfer} TB{" "}
                                {/* {item.disk_type == "hdd"
                                  ? item.hard_disk
                                  : item.disk_type == "ssd"
                                  ? item.ssd
                                  : item.nvme}{" "}
                                GB / {item.cpu} vCPU */}
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  {item.remaining_data} TB{" "}
                                  {/* {item.disk_type == "hdd"
                                    ? item.hard_disk
                                    : item.disk_type == "ssd"
                                    ? item.ssd
                                    : item.nvme}{" "}
                                  GB / {item.cpu} vCPU */}
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            {/* <div className="table-data">
                            <div className="table-content">
                               {item.ram / 1024} GB / {item.hard_disk} GB /{" "}
                              {item.cpu} CPU(s) 
                            </div>
                            <img
                              src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                              className="bg-image"
                              alt="Background"
                            />
                          </div> */}
                            <div className="table-data">
                              <div className="table-content">
                                <div>
                                  <strong>
                                    <i
                                      className="fas fa-rupee-sign"
                                      style={{ paddingTop: "3px" }}
                                      aria-hidden="true"
                                    ></i>
                                    <span>
                                      {item.vm_action == "DELETE" ? "+ " : "- "}

                                      {appCurrency &&
                                        smuser &&
                                        currencyReturnOnlyAmount({
                                          price:
                                            item.vm_action == "DELETE"
                                              ? item.wallet_comes
                                              : item.linode_rate,
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {/* currencyReturn({price: "userNative_credit",symbol: "smuser.prefer_currency",rates: "appCurrency"}) */}
                                      {/* <FaRupeeSign />
                                    {appCurrency &&
                                      item.cost / parseFloat(appCurrency)}{" "}
                                    /- */}
                                    </span>
                                  </strong>
                                </div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                          </div>
                        ))}

                      <div className="table-row no-hover">
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                        {/* <div className="table-foot">
                        <img
                          src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div> */}
                        <div className="table-foot">
                          <img
                            src="/images/admin/09-Billing-Table/server-bottom-bg.svg"
                            className="table-footer-image-size"
                            alt="Background"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </div>
          )}
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

export default BillReport;
