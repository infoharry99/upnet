import React, { useEffect, useState, useRef } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import "./BillingPage.css";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const BillingPage = () => {
  const { smuser, appCurrency } = useAuth();
  const navigate = useNavigate();
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [billingData, setBillingData] = useState([]);
  const [allVMS, setAllVMS] = useState([]);
  const [allCDN, setAllCDN] = useState([]);
  const [showvm, setShowvm] = useState("all");
  const [activeButton, setActiveButton] = useState("SERVER");

  const tabs = ["SERVER", "CDN"];

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

  const BillingCall = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post("/bill", encryptedResponse);
      //////console.log(loginUserResponse.data, "====loginUserResponse");

      const loginResponse = await decryptData(loginUserResponse.data);
      const userDetails = loginResponse;
      const user = loginResponse.user;
      const vm = loginResponse.vm;

      // //console.log(loginResponse, "==!==!==BILLLINGG");
      // //console.log(userDetails, "==!==!==vvmArraym");
      // //console.log(user, "==!==!==user");
      // //console.log(vm, "==!==!==vm");
      const vmArray = Object.keys(vm).map((key) => vm[key]);
      setAllVMS(vmArray);

      const cdn = loginResponse.cdn;
      const cdnArray = Object.keys(cdn).map((key) => cdn[key]);
      setAllCDN(cdnArray);

      // //console.log(vmArray, "==!==!==vvmArraym");
      setBillingData(vmArray);
      setFilteredServerData(vmArray);
      setFilteredCDNData(cdnArray);
      // const vmArray = Object.keys(vm).map((key) => vm[key]);
      // localStorage.setItem("NEW_USER", JSON.stringify(userDetails));
      // window.location.href = "/";
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };
  const handleNext = (inputData) => {
    navigate("/paymentdata", { state: { billData: inputData } });
  };

  const filterByStatus = (dataArray, vmid) => {
    if (vmid === "") {
      // //console.log(dataArray, vmid, "filterByStatus");
      return dataArray;
    } else {
      // //console.log(dataArray, vmid, "filterByStatus");
      return dataArray.filter((item) => item.vm_id === vmid);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    BillingCall();
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    document.addEventListener("mousedown", handleClick, false);
    // return () => document.removeEventListener("mousedown", handleClick, false);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClick, false);
    };
  }, [isMobile]);

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
    setFilteredServerData(billingData);
    if (e.target.value === "") {
      setShowvm("all");
    }
    if (!visible) {
      setVisible(true);
    }
  };

  const handleChangeCDN = (e) => {
    setSearchTextCDN(e.target.value);
    // setFilteredCDNData(allCDN);
    if (e.target.value === "") {
      setShowCDN("all");
    }
    if (!visibleCDN) {
      setVisibleCDN(true);
    }
  };

  const selectItem = (item) => {
    setSearchText(item.vm_name);
    // setSelectedVM(item.vm_id);
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
    const filtered = allCDN.filter((item) => {
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

  const exportToExcelServer = (data) => {
    const filteredData = data.map((item) => {
      const amount =
        appCurrency && smuser
          ? currencyReturn({
              price: item.cost,
              symbol: smuser.prefer_currency,
              rates: appCurrency,
            })
          : ""; // Handle the case where appCurrency or smuser is not available

      return {
        vm_type: "ubuntu",
        vm_name: `${item.vm_name} ${
          item.disk_type !== null
            ? `${item.ram / 1024} GB / ${
                item.disk_type === "hdd"
                  ? `${item.hard_disk} GB`
                  : item.disk_type === "ssd"
                  ? `${item.ssd} GB`
                  : `${item.nvme} GB`
              } / ${item.cpu} vCPU(s)`
            : `${item.ram / 1024} GB / ${item.hard_disk} GB / ${item.cpu} vCPU`
        }`,
        created_date: item.created_at,
        amount: amount, // Set the amount for this item
      };
    });

    // Calculate total cost
    const totalCost = data.reduce((acc, item) => acc + item.cost, 0);

    // Add Total Amount as a separate row
    filteredData.push({
      vm_type: "Total Amount",
      vm_name: "", // Empty column
      created_date: "", // Empty column
      amount:
        appCurrency && smuser
          ? currencyReturn({
              price: totalCost,
              symbol: smuser.prefer_currency,
              rates: appCurrency,
            })
          : totalCost,
    });

    // Create a worksheet with specific headers
    const fileName = "billingData";
    const worksheet = XLSX.utils.json_to_sheet(filteredData, {
      header: ["vm_type", "vm_name", "created_date", "amount"],
    });

    // Create a new workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToExcelCDN = (data) => {
    const filteredData = data.map((item) => ({
      type: "CDN",
      cdn_name: item.cdn_name,
      total_data: item.datatransfer_value,
      created_date: item.created_at,
      amount: `${
        appCurrency &&
        smuser &&
        currencyReturn({
          price: item.cost,
          symbol: smuser.prefer_currency,
          rates: appCurrency,
        })
      }`,
    }));

    // Calculate total cost
    const totalCost = data.reduce((acc, item) => acc + item.cost, 0);

    // Add totalAmount as the last row
    filteredData.push({
      type: "Total Amount",
      cdn_name: "", // Leave empty
      total_data: "", // Leave empty
      created_date: "", // Leave empty
      amount: `${
        appCurrency &&
        smuser &&
        currencyReturn({
          price: totalCost,
          symbol: smuser.prefer_currency,
          rates: appCurrency,
        })
      }`,
    });

    // Create a worksheet
    const fileName = "cdn_Data";
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
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
            Billing List <span></span>
          </div>
          <button
            style={{
              position: "absolute",
              top: "6%",
              right: "10%",
              border: "2px solid white",
              outline: "2px solid #e97730",
              background: "#e97730",
              color: "white",
              borderRadius: "15px",
              fontWeight: "600",
            }}
            onClick={() =>
              navigate("/paymentdata", {
                state: { billData: "item" },
              })
            }
          >
            Invoice Details
          </button>
          {/* <div
            style={{
              position: "relative",
              marginTop: "-15%",
              marginLeft: "65%",
            }}
            onClick={() =>
              navigate("/paymentdata", {
                state: { billData: "item" },
              })
            }
          >
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
                  src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                  alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                  style={{ height: "40px" }}
                />
                <img
                  className="hover-img-banner"
                  src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                  alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                  style={{ height: "40px" }}
                />
                <span
                  className="login-text"
                  style={{
                    color: "white",
                    fontSize: "16px",
                    marginTop: "-5px",
                    fontWeight: "600",
                  }}
                >
                  Invoice Details
                </span>
              </div>
            </a>
          </div> */}

          <div
            style={{
              position: "absolute",
              marginLeft: "16px",
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
                  // if (activeButton === "Server") {
                  //   setCDNID(null);
                  // }
                  // if (activeButton === "CDN") {
                  //   setVmID(null);
                  // }
                }}
              >
                {title}
              </Button>
            ))}
          </div>

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
                textAlign: "center",
              }}
            >
              <select
                name="plan_time"
                style={{
                  borderRadius: "30px",
                  marginRight: "10px",
                  padding: "10px 15px",
                  border: "2px solid #e97730",
                  width: "20rem",
                  marginLeft: "5px",
                  marginRight: "15px",
                }}
                // value={activeId}
                onChange={(e) => {
                  // setActiveID(e.target.value);
                  // handleChangeMachine(e.target.value);
                  //////console.log(e.target.value);
                }}
              >
                {/* <option value={activeId}>Select</option> */}
          {/* {allVMS &&
                  allVMS.map((item, index) => (
                    <option key={index} value={item.vm_id}>
                      {item.vm_name}
                    </option>
                  ))} }
              </select>
              <div className="search-form" style={{ marginTop: "10px" }}>
                <div
                  className="input-container-notif"
                  style={{ width: "19rem" }}
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
                  style={{ width: "19rem" }}
                >
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
                        // paddingLeft: "23px",
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
            <div
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
                  position: "relative",
                  zIndex: "1",
                  textAlign: "center",
                }}
              >
                <input
                  className="input"
                  type="text"
                  placeholder="Search Server"
                  value={searchText}
                  onChange={handleChange}
                  style={{
                    borderRadius: "30px",
                    marginRight: "10px",
                    padding: "10px 15px",
                    border: "2px solid #e97730",
                    // width: "20rem",
                    marginLeft: "5px",
                    marginRight: "15px",
                    fontSize: "16px",
                  }}
                  onFocus={() => {
                    // if (searchValue) {
                    setVisible(true);
                    setStartDate("");
                    setEndDate("");
                    // };
                  }}
                />
                <div
                  ref={dropdownRef}
                  className={`dropdown ${visible ? "v" : ""}`}
                >
                  {visible && (
                    <ul>
                      {!allVMS && (
                        <li key="zxc" className="dropdown_item">
                          no result
                        </li>
                      )}

                      {allVMS &&
                        searchFilter(searchText, allVMS).map((x) => (
                          <option
                            key={x.vm_id}
                            // value={x.vm_id}
                            onClick={() => selectItem(x)}
                            className="dropdown_item"
                          >
                            {/* <option key={index} value={item.vm_id}>
                              {item.vm_name}
                            </option> */}
                            <div className="item_text1">{x.vm_name}</div>
                          </option>
                        ))}
                    </ul>
                  )}
                </div>

                <div className="search-form" style={{ marginTop: "10px" }}>
                  {/* Start Date */}
                  <div
                    className="input-container-notif"
                    style={{ width: "17rem" }}
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
                    style={{ width: "17rem" }}
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
                        onClick={() => {
                          filterServerByDate();
                        }}
                      />
                    </div>

                    {/* Export Button */}

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
                          exportToExcelServer(
                            filteredServerData &&
                              filteredServerData.filter(
                                (item) =>
                                  showvm === "all" || item.vm_id === showvm
                              )
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeButton === "CDN" && (
            <div
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
                  position: "relative",
                  zIndex: "1",
                  textAlign: "center",
                }}
              >
                <input
                  className="input"
                  type="text"
                  placeholder="Search Website"
                  value={searchTextCDN}
                  onChange={handleChangeCDN}
                  style={{
                    borderRadius: "30px",
                    marginRight: "10px",
                    padding: "10px 15px",
                    border: "2px solid #e97730",
                    // width: "20rem",
                    marginLeft: "5px",
                    marginRight: "15px",
                    fontSize: "16px",
                  }}
                  onFocus={() => {
                    // if (searchValue) {
                    setVisibleCDN(true);
                    setStartDateCDN("");
                    setEndDateCDN("");
                    // };
                  }}
                />
                <div
                  ref={dropdownRef}
                  className={`dropdown ${visibleCDN ? "v" : ""}`}
                >
                  {visibleCDN && (
                    <ul>
                      {!allCDN && (
                        <li key="zxc" className="dropdown_item">
                          no result
                        </li>
                      )}

                      {allCDN &&
                        searchFilterCDN(searchTextCDN, allCDN).map((x) => (
                          <option
                            key={x.id}
                            // value={x.vm_id}
                            onClick={() => selectItemCDN(x)}
                            className="dropdown_item"
                          >
                            {/* <option key={index} value={item.vm_id}>
                              {item.vm_name}
                            </option> */}
                            <div className="item_text1">{x.website_url}</div>
                          </option>
                        ))}
                    </ul>
                  )}
                </div>

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
                      value={startDatecdn}
                      onChange={(e) => setStartDateCDN(e.target.value)}
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
                      value={endDatecdn}
                      onChange={(e) => setEndDateCDN(e.target.value)}
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
                        onClick={() =>
                          exportToExcelCDN(
                            filteredCDNData &&
                              filteredCDNData.filter(
                                (item) =>
                                  showCDN === "all" || item.id === showCDN
                              )
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeButton === "SERVER" && (
            <div
              className="features-section-solution"
              style={{
                backgroundImage: isMobile
                  ? `url(./main-bg.jpg)`
                  : `url(./main-bg.jpg)`,
              }}
            >
              <Row>
                <div className="col-md-1"></div>
                <div className="col-md-10" style={{ marginBottom: "5rem" }}>
                  <div className="billing-list">
                    <div className="table-row no-hover">
                      <div className="table-head">
                        <div className="table-content">VM Type</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">VM Details</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Created Date</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Billing Amount</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Details/Payment</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                    </div>
                    {filteredServerData &&
                      filteredServerData
                        .filter(
                          (item) => showvm === "all" || item.vm_id === showvm
                        )
                        .map((item, idx) => (
                          <div className="table-row">
                            <div className="table-data">
                              <div className="table-content">
                                <img
                                  src="/images/color-ubantu-icon.png"
                                  className="centos-icon"
                                  alt="Ubuntu Icon"
                                />
                                <div>ubuntu</div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>{item.vm_name}</div>
                                {item.disk_type !== null ? (
                                  <div>
                                    {item.ram / 1024} GB /{" "}
                                    {item.disk_type == "hdd"
                                      ? item.hard_disk
                                      : item.disk_type == "ssd"
                                      ? item.ssd
                                      : item.nvme}{" "}
                                    GB / {item.cpu} vCPU(s)
                                  </div>
                                ) : (
                                  <div>
                                    {item.ram / 1024} GB / {item.hard_disk} GB /{" "}
                                    {item.cpu} vCPU
                                  </div>
                                )}
                                {/* <div>
                              {item.ram / 1024} GB / {item.hard_disk} GB /{" "}
                              {item.cpu} vCPU
                            </div> */}
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>{item.created_at}</div>
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
                                  <strong>
                                    <i
                                      className="fas fa-rupee-sign"
                                      style={{ paddingTop: "3px" }}
                                      aria-hidden="true"
                                    ></i>
                                    <span>
                                      {appCurrency &&
                                        smuser &&
                                        currencyReturn({
                                          price: item.cost,
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {/* <FaRupeeSign />
                                  {item.cost} /- */}
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
                            <div className="table-data">
                              <div className="table-content">
                                <div
                                  className="button-field"
                                  // style={{
                                  //   display: "flex",
                                  //   flexDirection: "column",
                                  //   flexWrap: "nowrap",
                                  //   justifyContent: "center",
                                  //   alignItems: "center",
                                  // }}
                                >
                                  <div
                                    className="log-in"
                                    style={{
                                      marginTop: "-7px",
                                      marginBottom: "-15px",
                                      marginRight: "10px",
                                      marginLeft: "70px",
                                    }}
                                    onClick={() =>
                                      navigate("/billreport", {
                                        state: {
                                          billData: item,
                                          isServerOrCDN: "SERVER",
                                        },
                                      })
                                    }
                                  >
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
                                          src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                          alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                          style={{ height: "40px" }}
                                        />
                                        <img
                                          className="hover-img-banner"
                                          src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                          alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                          style={{ height: "40px" }}
                                        />
                                        <span
                                          className="login-text"
                                          style={{
                                            color: "white",
                                            fontSize: "16px",
                                            marginTop: "-5px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          ledger report
                                        </span>
                                      </div>
                                    </a>
                                  </div>
                                  {/* <div
                                className="log-in"
                                style={{
                                  marginBottom: "20px",
                                  marginRight: "10px",
                                  marginLeft: "70px",
                                }}
                                onClick={() =>
                                  navigate("/paymentdata", {
                                    state: { billData: item },
                                  })
                                }
                              >
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
                                      src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                      alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                      style={{ height: "40px" }}
                                    />
                                    <img
                                      className="hover-img-banner"
                                      src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                      alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                      style={{ height: "40px" }}
                                    />
                                    <span
                                      className="login-text"
                                      style={{
                                        color: "white",
                                        fontSize: "16px",
                                        marginTop: "-5px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Payment
                                    </span>
                                  </div>
                                </a>
                              </div> */}
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
                <div className="col-md-1"></div>
              </Row>
            </div>
          )}

          {activeButton === "CDN" && (
            <div
              className="features-section-solution"
              style={{
                backgroundImage: isMobile
                  ? `url(./main-bg.jpg)`
                  : `url(./main-bg.jpg)`,
              }}
            >
              <Row>
                <div className="col-md-1"></div>
                <div className="col-md-10" style={{ marginBottom: "5rem" }}>
                  <div className="billing-list">
                    <div className="table-row no-hover">
                      <div className="table-head">
                        <div className="table-content">Type</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Total Data</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Created Date</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Billing Amount</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Details/Payment</div>
                        <img
                          src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                    </div>
                    {filteredCDNData &&
                      filteredCDNData
                        .filter(
                          (item) => showCDN === "all" || item.id === showCDN
                        )
                        .map((item, idx) => (
                          <div className="table-row">
                            <div className="table-data">
                              <div className="table-content">
                                <img
                                  src="/images/color-ubantu-icon.png"
                                  className="centos-icon"
                                  alt="Ubuntu Icon"
                                />
                                <div>CDN</div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>{item.datatransfer_value} TB</div>
                              </div>
                              <img
                                src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                className="bg-image"
                                alt="Background"
                              />
                            </div>
                            <div className="table-data">
                              <div className="table-content">
                                <div>{item.created_at}</div>
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
                                  <strong>
                                    <i
                                      className="fas fa-rupee-sign"
                                      style={{ paddingTop: "3px" }}
                                      aria-hidden="true"
                                    ></i>
                                    <span>
                                      {appCurrency &&
                                        smuser &&
                                        currencyReturn({
                                          price: item.cost,
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                      {/* <FaRupeeSign />
                                  {item.cost} /- */}
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
                            <div className="table-data">
                              <div className="table-content">
                                <div
                                  className="button-field"
                                  // style={{
                                  //   display: "flex",
                                  //   flexDirection: "column",
                                  //   flexWrap: "nowrap",
                                  //   justifyContent: "center",
                                  //   alignItems: "center",
                                  // }}
                                >
                                  <div
                                    className="log-in"
                                    style={{
                                      marginTop: "-7px",
                                      marginBottom: "-15px",
                                      marginRight: "10px",
                                      marginLeft: "70px",
                                    }}
                                    onClick={() =>
                                      navigate("/billreport", {
                                        state: {
                                          billData: item,
                                          isServerOrCDN: "CDN",
                                        },
                                      })
                                    }
                                  >
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
                                          src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                          alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                          style={{ height: "40px" }}
                                        />
                                        <img
                                          className="hover-img-banner"
                                          src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                          alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                          style={{ height: "40px" }}
                                        />
                                        <span
                                          className="login-text"
                                          style={{
                                            color: "white",
                                            fontSize: "16px",
                                            marginTop: "-5px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          ledger report
                                        </span>
                                      </div>
                                    </a>
                                  </div>
                                  {/* <div
                                className="log-in"
                                style={{
                                  marginBottom: "20px",
                                  marginRight: "10px",
                                  marginLeft: "70px",
                                }}
                                onClick={() =>
                                  navigate("/paymentdata", {
                                    state: { billData: item },
                                  })
                                }
                              >
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
                                      src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                      alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                      style={{ height: "40px" }}
                                    />
                                    <img
                                      className="hover-img-banner"
                                      src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                      alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                      style={{ height: "40px" }}
                                    />
                                    <span
                                      className="login-text"
                                      style={{
                                        color: "white",
                                        fontSize: "16px",
                                        marginTop: "-5px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Payment
                                    </span>
                                  </div>
                                </a>
                              </div> */}
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
                <div className="col-md-1"></div>
              </Row>
            </div>
          )}
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "50rem", paddingLeft: "15rem", paddingTop: "4rem" }}
        >
          <div className="heading-dotted-bill" style={{ marginLeft: "10px" }}>
            Billing List <span></span>
          </div>

          <div
            style={{
              position: "absolute",
              marginLeft: "1px",
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
                  // if (activeButton === "Server") {
                  //   setCDNID(null);
                  // }
                  // if (activeButton === "CDN") {
                  //   setVmID(null);
                  // }
                }}
              >
                {title}
              </Button>
            ))}
          </div>

          {activeButton === "SERVER" && (
            <div
              style={{
                marginTop: "80px",
                marginLeft: "10px",
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
                {/* {isDropdownOpen && (
                  <input
                    name="plan_time"
                    value={searchText}
                    placeholder="Search..."
                    style={{
                      borderRadius: "30px",
                      marginRight: "10px",
                      padding: "10px 15px",
                      border: "2px solid #e97730",
                      width: "17rem",
                      marginRight: "15px",
                    }}
                    // value={activeId}
                    onChange={
                      (e) =>
                        // setShowvm(e.target.value);
                        handleSearchChange

                      // handleChangeMachine(e.target.value);
                      //////console.log(e.target.value);
                    }
                  >
                    {/* <option value={activeId}>Select</option> */}
                {/* <option key={index} value={"all"}>
                  ALL Machine
                </option> */}
                {/* {allVMS &&
                      allVMS.map((item, index) => (
                        <option key={index} value={item.vm_id}>
                          {item.vm_name}
                        </option>
                      ))} }   
                  </input>
                )} */}

                <input
                  className="input"
                  type="text"
                  placeholder="Search Server"
                  value={searchText}
                  onChange={handleChange}
                  style={{ borderRadius: "15px" }}
                  onFocus={() => {
                    // if (searchValue) {
                    setVisible(true);
                    setStartDate("");
                    setEndDate("");
                    // };
                  }}
                />

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
                        onClick={() => {
                          filterServerByDate();
                        }}
                      />
                    </div>

                    {/* Export Button */}

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
                          exportToExcelServer(
                            filteredServerData &&
                              filteredServerData.filter(
                                (item) =>
                                  showvm === "all" || item.vm_id === showvm
                              )
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={dropdownRef}
                className={`dropdown ${visible ? "v" : ""}`}
              >
                {visible && (
                  <ul>
                    {!allVMS && (
                      <li key="zxc" className="dropdown_item">
                        no result
                      </li>
                    )}

                    {allVMS &&
                      searchFilter(searchText, allVMS).map((x) => (
                        <option
                          key={x.vm_id}
                          // value={x.vm_id}
                          onClick={() => selectItem(x)}
                          className="dropdown_item"
                        >
                          {/* <option key={index} value={item.vm_id}>
                              {item.vm_name}
                            </option> */}
                          <div className="item_text1">{x.vm_name}</div>
                        </option>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeButton === "CDN" && (
            <div
              style={{
                marginTop: "80px",
                marginLeft: "10px",
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
                    width: "17rem",
                    marginRight: "15px",
                  }}
                  // value={activeId}
                  onChange={(e) => {
                    setShowvm(e.target.value);
                    // handleChangeMachine(e.target.value);
                    //////console.log(e.target.value);
                  }}
                >
                  {/* <option value={activeId}>Select</option> }
                  <option key={index} value={"all"}>
                    ALL CDN
                  </option>
                  {allCDN &&
                    allCDN.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.website_url}
                      </option>
                    ))}
                  </select> */}

                <input
                  className="input"
                  type="text"
                  placeholder="Search Website"
                  value={searchTextCDN}
                  onChange={handleChangeCDN}
                  style={{ borderRadius: "15px" }}
                  onFocus={() => {
                    // if (searchValue) {
                    setVisibleCDN(true);
                    setStartDateCDN("");
                    setEndDateCDN("");
                    // };
                  }}
                />

                <div
                  className="search-form"
                  style={{ marginTop: "10px", marginLeft: "20px" }}
                >
                  <div
                    className="input-container-notif"
                    style={{ width: "16rem" }}
                  >
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
                    style={{ width: "16rem" }}
                  >
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
                        onClick={() =>
                          exportToExcelCDN(
                            filteredCDNData &&
                              filteredCDNData.filter(
                                (item) =>
                                  showCDN === "all" || item.id === showCDN
                              )
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={dropdownRef}
                className={`dropdown ${visibleCDN ? "v" : ""}`}
              >
                {visibleCDN && (
                  <ul>
                    {!allCDN && (
                      <li key="zxc" className="dropdown_item">
                        no result
                      </li>
                    )}

                    {allCDN &&
                      searchFilterCDN(searchTextCDN, allCDN).map((x) => (
                        <option
                          key={x.id}
                          // value={x.vm_id}
                          onClick={() => selectItemCDN(x)}
                          className="dropdown_item"
                        >
                          {/* <option key={index} value={item.vm_id}>
                              {item.vm_name}
                            </option> */}
                          <div className="item_text1">{x.website_url}</div>
                        </option>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <button
            style={{
              position: "absolute",
              top: "23%",
              right: "15%",
              border: "2px solid white",
              outline: "2px solid #e97730",
              background: "#e97730",
              color: "white",
              borderRadius: "15px",
              fontWeight: "600",
              fontSize: "22px",
            }}
            onClick={() =>
              navigate("/paymentdata", {
                state: { billData: "item" },
              })
            }
          >
            Invoice Details
          </button>
          {/* <div
            style={{
              position: "relative",
              marginTop: "-3%",
              marginLeft: "75%",
            }}
            onClick={() =>
              navigate("/paymentdata", {
                state: { billData: "item" },
              })
            }
          >
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
                  src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                  alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                  style={{ height: "40px" }}
                />
                <img
                  className="hover-img-banner"
                  src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                  alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                  style={{ height: "40px" }}
                />
                <span
                  className="login-text"
                  style={{
                    color: "white",
                    fontSize: "16px",
                    marginTop: "-5px",
                    fontWeight: "600",
                  }}
                >
                  Invoice Details
                </span>
              </div>
            </a>
          </div> */}

          {activeButton === "SERVER" && (
            <div className="features-section-solution">
              <Row>
                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      marginTop: "1rem",
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="billing-list">
                      <div className="table-row no-hover">
                        <div className="table-head">
                          <div className="table-content">VM Type</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">VM Details</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Created Date</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Billing Amount</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Details/Payment</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                      </div>
                      {filteredServerData &&
                        filteredServerData
                          .filter(
                            (item) => showvm === "all" || item.vm_id === showvm
                          )
                          .map((item, idx) => (
                            <div className="table-row">
                              <div className="table-data">
                                <div className="table-content">
                                  <img
                                    src="/images/color-ubantu-icon.png"
                                    className="centos-icon"
                                    alt="Ubuntu Icon"
                                  />
                                  <div>ubuntu</div>
                                </div>
                                <img
                                  src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                  className="bg-image"
                                  alt="Background"
                                />
                              </div>
                              <div className="table-data">
                                <div className="table-content">
                                  <div>{item.vm_name}</div>
                                  {item.disk_type !== null ? (
                                    <div>
                                      {item.ram / 1024} GB /{" "}
                                      {item.disk_type == "hdd"
                                        ? item.hard_disk
                                        : item.disk_type == "ssd"
                                        ? item.ssd
                                        : item.nvme}{" "}
                                      GB / {item.cpu} vCPU(s)
                                    </div>
                                  ) : (
                                    <div>
                                      {item.ram / 1024} GB / {item.hard_disk} GB
                                      / {item.cpu} vCPU
                                    </div>
                                  )}
                                </div>
                                <img
                                  src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                  className="bg-image"
                                  alt="Background"
                                />
                              </div>
                              <div className="table-data">
                                <div className="table-content">
                                  <div>{item.created_at}</div>
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
                                    <strong>
                                      <i
                                        className="fas fa-rupee-sign"
                                        style={{ paddingTop: "3px" }}
                                        aria-hidden="true"
                                      ></i>
                                      <span>
                                        {appCurrency &&
                                          smuser &&
                                          currencyReturn({
                                            price: item.cost,
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
                              <div className="table-data">
                                <div className="table-content">
                                  <div
                                    className="button-field"
                                    // style={{
                                    //   display: "flex",
                                    //   flexDirection: "column",
                                    //   flexWrap: "nowrap",
                                    //   justifyContent: "center",
                                    //   alignItems: "center",
                                    // }}
                                  >
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "-7px",
                                        marginBottom: "-15px",
                                        marginRight: "10px",
                                        marginLeft: "70px",
                                      }}
                                      onClick={() =>
                                        navigate("/billreport", {
                                          state: {
                                            billData: item,
                                            isServerOrCDN: "SERVER",
                                          },
                                        })
                                      }
                                    >
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
                                            src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                            alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                            style={{ height: "40px" }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                            alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                            style={{ height: "40px" }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              color: "white",
                                              fontSize: "16px",
                                              marginTop: "-5px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            ledger report
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                    {/* <div
                                  className="log-in"
                                  style={{
                                    marginBottom: "20px",
                                    marginRight: "10px",
                                    marginLeft: "70px",
                                  }}
                                  onClick={() =>
                                    navigate("/paymentdata", {
                                      state: { billData: item },
                                    })
                                  }
                                >
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
                                        src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                        alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                        style={{ height: "40px" }}
                                      />
                                      <img
                                        className="hover-img-banner"
                                        src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                        alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                        style={{ height: "40px" }}
                                      />
                                      <span
                                        className="login-text"
                                        style={{
                                          color: "white",
                                          fontSize: "16px",
                                          marginTop: "-5px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Payment
                                      </span>
                                    </div>
                                  </a>
                                </div> */}
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
                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      marginTop: "1rem",
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="billing-list">
                      <div className="table-row no-hover">
                        <div className="table-head">
                          <div className="table-content"> Type</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content"> Total Data </div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Created Date</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Billing Amount</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                        <div className="table-head">
                          <div className="table-content">Details/Payment</div>
                          <img
                            src="/images/admin/08-VM-Billing-List/server-top-img.svg"
                            className="bg-image"
                            alt="Background"
                          />
                        </div>
                      </div>
                      {filteredCDNData &&
                        filteredCDNData
                          .filter(
                            (item) => showCDN === "all" || item.id === showCDN
                          )
                          .map((item, idx) => (
                            <div className="table-row">
                              <div className="table-data">
                                <div className="table-content">
                                  {/* <img
                                  src="/images/color-ubantu-icon.png"
                                  className="centos-icon"
                                  alt="Ubuntu Icon"
                                /> */}
                                  <div>CDN</div>
                                </div>
                                <img
                                  src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                  className="bg-image"
                                  alt="Background"
                                />
                              </div>
                              <div className="table-data">
                                <div className="table-content">
                                  <div>{item.datatransfer_value} TB </div>
                                </div>
                                <img
                                  src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                                  className="bg-image"
                                  alt="Background"
                                />
                              </div>
                              <div className="table-data">
                                <div className="table-content">
                                  <div>{item.created_at}</div>
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
                                    <strong>
                                      <i
                                        className="fas fa-rupee-sign"
                                        style={{ paddingTop: "3px" }}
                                        aria-hidden="true"
                                      ></i>
                                      <span>
                                        {appCurrency &&
                                          smuser &&
                                          currencyReturn({
                                            price: item.cost,
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
                              <div className="table-data">
                                <div className="table-content">
                                  <div
                                    className="button-field"
                                    // style={{
                                    //   display: "flex",
                                    //   flexDirection: "column",
                                    //   flexWrap: "nowrap",
                                    //   justifyContent: "center",
                                    //   alignItems: "center",
                                    // }}
                                  >
                                    <div
                                      className="log-in"
                                      style={{
                                        marginTop: "-7px",
                                        marginBottom: "-15px",
                                        marginRight: "10px",
                                        marginLeft: "70px",
                                      }}
                                      onClick={() =>
                                        navigate("/billreport", {
                                          state: {
                                            billData: item,
                                            isServerOrCDN: "CDN",
                                          },
                                        })
                                      }
                                    >
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
                                            src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                            alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                            style={{ height: "40px" }}
                                          />
                                          <img
                                            className="hover-img-banner"
                                            src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                            alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                            style={{ height: "40px" }}
                                          />
                                          <span
                                            className="login-text"
                                            style={{
                                              color: "white",
                                              fontSize: "16px",
                                              marginTop: "-5px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            ledger report
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                    {/* <div
                                  className="log-in"
                                  style={{
                                    marginBottom: "20px",
                                    marginRight: "10px",
                                    marginLeft: "70px",
                                  }}
                                  onClick={() =>
                                    navigate("/paymentdata", {
                                      state: { billData: item },
                                    })
                                  }
                                >
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
                                        src="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                        alt="/images/admin/08-VM-Billing-List/payment-blue-btn.svg"
                                        style={{ height: "40px" }}
                                      />
                                      <img
                                        className="hover-img-banner"
                                        src="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                        alt="/images/admin/08-VM-Billing-List/payment-orange-btn.svg"
                                        style={{ height: "40px" }}
                                      />
                                      <span
                                        className="login-text"
                                        style={{
                                          color: "white",
                                          fontSize: "16px",
                                          marginTop: "-5px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Payment
                                      </span>
                                    </div>
                                  </a>
                                </div> */}
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

export default BillingPage;