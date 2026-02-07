import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./Notification.css";
import { useAuth } from "../../AuthContext";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  currencyReturn,
  decryptData,
} from "../../Api";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { FaSearch } from "react-icons/fa";

// import RangeSlider from "./common/RangeSlider";

const Notification = () => {
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const navigate = useNavigate();
  const { smuser, appCurrency, isLoginByParentUser } = useAuth();

  const [allNotificationCloud, setAllNotificationCloud] = useState([]);
  const [allNotificationNative, setAllNotificationNative] = useState([]);

  const [allNotification, setAllNotification] = useState([]);
  const [adminNoti, setadminNoti] = useState([]);
  const [vmNoti, setVmNoti] = useState([]);
  const [billNoti, setBillNoti] = useState([]);
  const [paymentNoti, setPaymentNoti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allnotiArchive, setAllNotiArchive] = useState([]);

  const [isLatest, setIsLatest] = useState(true);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [activeButton, setActiveButton] = useState(5);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  const [selectedAllId, setSelectAllId] = useState([]);

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleViewInvoice = (data) => {
    // console.log(data);
    const item = {
      id: data.paymnet_id,
      orderid: data.order_id,
    };

    navigate("/invoice", {
      state: { billData: item },
    });
  };

  const ArchiveCall = async (notifiID) => {
    // console.log(notifiID, "IDs");
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      notification_id: notifiID,
    };
    //console.log(payload, "ONNNN");
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const distroyResponse = await instance.post(
        "/notificationarchive",
        encryptedResponse
      );
      //console.log(distroyResponse.data, "==notificationarchive");
      GetNotification();
      const Response = await decryptData(distroyResponse.data);
      console.log(Response, "====notificationarchive");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const GetNotification = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      // const encryptedResponse = await apiEncryptRequest(payload);
      // ////console.log(encryptedResponse, "=encryptedResponse");
      const notificationResponse = await instance.post(
        "/notification",
        payload
      );
      ////console.log(notificationResponse.data, "====notificationResponse");
      const allnotificationarchive =
        notificationResponse.data.allnotificationarchive;
      ////console.log(allnotificationarchive, "====allnotificationarchive");
      setAllNotiArchive(allnotificationarchive);

      const allnotificationnative =
        notificationResponse.data.allnotificationnative;
      setAllNotificationNative(allnotificationnative);

      const allnotificationcloud =
        notificationResponse.data.allnotificationcloud;
      setAllNotificationCloud(allnotificationcloud);
      // smuser.platform_status === 0 means Native and 1 means Cloud
      if (smuser.platform_status === 0) {
        const vmDataAdmin = allnotificationnative.filter((item) =>
          [20].includes(item.use_history_type)
        );
        const vmData = allnotificationnative.filter((item) =>
          [8, 7, 6].includes(item.use_history_type)
        );
        const billData = allnotificationnative.filter((item) =>
          [11, 12].includes(item.use_history_type)
        );

        const payData = allnotificationnative.filter((item) =>
          [9, 10].includes(item.use_history_type)
        );
        ////console.log(payData, "-------payData");
        setBillNoti(billData);
        setadminNoti(vmDataAdmin);
        setVmNoti(vmData);
        setPaymentNoti(payData);
        setAllNotificationNative(allnotificationnative);
        setAllNotification(allnotificationnative);
        setFilteredNotifications(allnotificationnative);
        const allIds = allnotificationnative.map(
          (notification) => notification.id
        );

        setSelectAllId(allIds);
      } else {
        const vmDataAdmin = allnotificationcloud.filter((item) =>
          [20].includes(item.use_history_type)
        );
        const vmData = allnotificationcloud.filter((item) =>
          [8, 7, 6].includes(item.use_history_type)
        );
        const billData = allnotificationcloud.filter((item) =>
          [11, 12].includes(item.use_history_type)
        );

        const payData = allnotificationcloud.filter((item) =>
          [9, 10].includes(item.use_history_type)
        );
        ////console.log(payData.reverse(), "-------payData");
        setBillNoti(billData);
        setadminNoti(vmDataAdmin);
        setVmNoti(vmData);
        setPaymentNoti(payData);
        setAllNotificationCloud(allnotificationcloud);
        setAllNotification(allnotificationcloud);
        setFilteredNotifications(allnotificationcloud);
        setSelectAllId(allnotificationcloud.id);
      }

      ////console.log(allnotificationcloud);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };
  
  const getVoice = async () => {
    const payload = {
      user_id: smuser.id,
      id: 7,
    };
    try {
      const eeeeeeee = await instance.post("/invoiceview", payload);
      ////console.log(eeeeeeee.data, "====eeeeeeee");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
  };

  // const innerButtons = [
  //   "Admin Notification (0)",
  //   "VM Notification (8)",
  //   "Billing Notification (6)",
  //   "Payment Notification (16)",
  //   //"System Profile Notification (6)",
  //   "All Notification (36)",
  // ];

  const changeCurrency = (value) => {
    // Add your currency change logic here
    //console.log("Currency changed to:", value);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    GetNotification();
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const filterByDate = () => {
    // console.log(activeButton, "BUTT");
    const filtered = allNotification.filter((item) => {
      const itemDate = new Date(item.created_at);
      const start = new Date(startDate);
      const end = new Date(endDate);

      itemDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return itemDate >= start && itemDate <= end;
    });
    setFilteredNotifications(filtered);
  };

  // const handleCheckboxChange = (event) => {
  //   setIsChecked(event.target.checked);
  // };

  const handleSelectAll = () => {
    setActiveButton(6); // Active state for Select All
    setIsAllSelected(true); // Mark all as selected
  };

  const handleDeselectAll = () => {
    setActiveButton(null); // Reset active state
    setIsAllSelected(false); // Mark all as deselected
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const styles = {
    container: {
      marginLeft: isMobile ? "4rem" : "55rem",
      marginTop: isMobile ? "40px" : "-40px",
      display: "flex",
      alignItems: "center",
      width: "300px",
      height: "40px",
      padding: "0 12px",
      borderRadius: "20px",
      backgroundColor: "#f8f9fa",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
      border: "2px solid #7890a1",
    },
    searchIcon: {
      fontSize: "18px",
      color: "#9aa0a6",
      marginRight: "8px",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      //   backgroundColor: "transparent",
      fontSize: "16px",
      color: "black",
    },
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
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
          {/* <Spinner animation="border" /> */}
        </div>
      )}
      {isMobile ? (
        <div className="" style={{ height: "50rem" }}>
          <div className="heading-dotted-machine">
            Notification <span></span>
          </div>

          <div className="billing-table-cont">
            <div
              className="billing-search"
              style={{
                position: "relative",
                left: "20px",
                width: "60%",
                height: "15rem",
              }}
            >
              <div className="search-form">
                <div className="input-container-notif">
                  {/* <FaCalendar style={{ color: "white" }} /> */}
                  <input
                    //   value={email}
                    type="date"
                    name="from"
                    className="input-signup"
                    placeholder="From"
                    //   onChange={(e) => setEmail(e.target.value)}
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
                </div>
                <div style={styles.container}>
                  <FaSearch style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search..."
                    style={styles.input}
                    value={searchText}
                    onChange={handleInputChange}
                  />
                </div>

                <div
                  style={{
                    position: "absolute",
                    zIndex: "1",
                    top: "3rem",
                    width: "120px",
                    height: "60px",
                    backgroundColor: "transparent",
                    left: "130%",
                  }}
                >
                  <div
                    onClick={() => setIsLatest(false)}
                    style={{
                      borderRadius: "12px",
                      borderStartStartRadius: "0px",
                      borderBottomLeftRadius: "0px",
                      position: "absolute",
                      zIndex: "1",
                      top: "0rem",
                      width: "60px",
                      height: "60px",
                      left: "60px",
                      backgroundColor: isLatest ? "#f1ddc8" : "#e97730",
                      // left: "75rem",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "center",
                        fontWeight: "700",
                        fontSize: "12px",
                        marginTop: "20px",
                        color: isLatest ? "#e97730" : "white",
                      }}
                    >
                      Archive
                    </p>
                  </div>
                  <div
                    onClick={() => setIsLatest(true)}
                    style={{
                      borderRadius: "12px",
                      borderStartEndRadius: "0px",
                      borderBottomRightRadius: "0px",
                      position: "absolute",
                      zIndex: "1",
                      top: "0rem",
                      width: "60px",
                      height: "60px",
                      backgroundColor: isLatest ? "#e97730" : "#f1ddc8",
                      // left: "75rem",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "center",
                        fontWeight: "700",
                        fontSize: "12px",
                        marginTop: "20px",
                        color: isLatest ? "white" : "#e97730",
                      }}
                    >
                      Latest
                    </p>
                  </div>
                </div>
              </div>

              <img
                src="/images/admin/09-Billing-Table/blue-bg.svg"
                className="bg-imagee mobile"
                alt="Background"
              />
            </div>
            <div className="tab-buttons-cont"></div>
            {isLatest && (
              <div
                className="buttons-container"
                style={{ padding: "15px", marginTop: "50px" }}
              >
                {/* {innerButtons.map((title, idx) => ( */}
                <Button
                  className="list-btns-mobile"
                  style={{
                    background: `${activeButton === 1 ? "#035189" : "#f47c20"}`,
                  }}
                  onClick={() => {
                    setActiveButton(1);
                    setAllNotification(adminNoti);
                    setFilteredNotifications(adminNoti);
                  }}
                >
                  Admin Notif. ({adminNoti !== null ? adminNoti.length : 0})
                </Button>
                <Button
                  className="list-btns-mobile"
                  style={{
                    background: `${activeButton === 2 ? "#035189" : "#f47c20"}`,
                  }}
                  onClick={() => {
                    setActiveButton(2);
                    setAllNotification(vmNoti);
                    setFilteredNotifications(vmNoti);
                  }}
                >
                  VM Notif. ({vmNoti !== null ? vmNoti.length : 0})
                  {/* VM Notification {"("} {vmNoti !== null ? "": 0{")"}} */}
                </Button>
                <Button
                  className="list-btns-mobile"
                  style={{
                    background: `${activeButton === 3 ? "#035189" : "#f47c20"}`,
                  }}
                  onClick={() => {
                    setActiveButton(3);
                    setAllNotification(billNoti);
                    setFilteredNotifications(billNoti);
                  }}
                >
                  Billing Notif. ({billNoti !== null ? billNoti.length : 0})
                </Button>

                <Button
                  className="list-btns-mobile"
                  style={{
                    background: `${activeButton === 4 ? "#035189" : "#f47c20"}`,
                  }}
                  onClick={() => {
                    setActiveButton(4);
                    setAllNotification(paymentNoti);
                    setFilteredNotifications(paymentNoti);
                  }}
                >
                  Payment Notif. (
                  {paymentNoti !== null ? paymentNoti.length : 0})
                </Button>

                {/* <Button
                className="list-btns-mobile"
                style={{
                  background: `${activeButton === 5 ? "#035189" : "#f47c20"}`,
                }}
                onClick={() => setActiveButton(5)}
              >
                System Profile Noti. {"("}0{")"}
              </Button> */}

                <Button
                  className="list-btns-mobile"
                  style={{
                    background: `${activeButton === 5 ? "#035189" : "#f47c20"}`,
                  }}
                  onClick={() => {
                    setActiveButton(5);
                    setAllNotification(
                      smuser.platform_status == 0
                        ? allNotificationNative
                        : allNotificationCloud
                    );
                    setFilteredNotifications(
                      smuser.platform_status == 0
                        ? allNotificationNative
                        : allNotificationCloud
                    );
                  }}
                >
                  All Notif. (
                  {smuser.platform_status == 0
                    ? allNotificationNative.length
                    : 0}
                  )
                </Button>
                {isLoginByParentUser == 1 &&
                  filteredNotifications.length > 0 &&
                  isLatest && (
                    <Button
                      className="list-btns-mobile"
                      style={{
                        background: `${"#f47c20"}`,
                      }}
                      onClick={() => {
                        // setActiveButton(6);
                        if (isAllSelected) {
                          handleDeselectAll(); // Deselect all items
                        } else {
                          handleSelectAll(); // Select all items
                        }
                      }}
                    >
                      {isAllSelected ? "Unselect All" : "Select All"}
                    </Button>
                  )}
                {isLoginByParentUser == 1 &&
                  activeButton === 6 &&
                  filteredNotifications.length > 0 &&
                  isLatest &&
                  isAllSelected && (
                    <Button
                      className="list-btns-mobile"
                      style={{
                        background: `${"#035189"}`,
                      }}
                      onClick={() => {
                        setActiveButton(6);
                        ArchiveCall(selectedAllId);
                      }}
                    >
                      Apply Archive
                    </Button>
                  )}
                {/* ))} */}
              </div>
            )}
            {isLatest ? (
              <>
                <div className="notification-cont">
                  {allNotification &&
                    allNotification
                      .filter(
                        (item) =>
                          item.title
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                          item.UserIP?.toLowerCase().includes(
                            searchText.toLowerCase()
                          ) ||
                          item.machineID
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase())
                      )
                      .map((item, idx) => (
                        <div className="table-row-noti">
                          <div className="bar"></div>
                          <div className="message">
                            {/* <div className="title">{item.title}</div> */}
                            <div className="title">{item.title}</div>
                            {/* UserIP */}
                            {activeButton === 1 &&
                              (item.remarks !== null ? (
                                <div class="desc">
                                  Description : {item.remarks}
                                </div>
                              ) : null)}{" "}
                            {activeButton !== 1 && item.UserIP !== null ? (
                              <div class="desc">
                                USER LOGIN IP : {item.UserIP}
                              </div>
                            ) : null}
                            {item.machineID !== null ? (
                              <div className="desc">
                                Machine ID : {item.machineID}
                              </div>
                            ) : null}
                            {item.order_id !== null ? (
                              <div
                                style={{ maxHeight: "none" }}
                                className="desc"
                                onClick={() => handleViewInvoice(item)}
                              >
                                Payment ID :{" "}
                                <button
                                  style={{
                                    color: "rgb(3, 81, 137)",
                                    border: "none",
                                    backgroundColor: "transparent",
                                    fontWeight: "600",
                                  }}
                                >
                                  {item.order_id}
                                </button>
                              </div>
                            ) : null}
                            {item.price !== null ? (
                              <div className="desc">
                                Amount:
                                {appCurrency &&
                                  smuser &&
                                  currencyReturn({
                                    price: item.price,
                                    symbol: smuser.prefer_currency,
                                    rates: appCurrency,
                                  })}
                              </div>
                            ) : null}
                            {/* </div> */}
                          </div>
                          <div className="datetime">{item.created_at}</div>
                          <div className="archive-noti">
                            <a>
                              <img
                                src="/images/admin/17-Notification/archive.png"
                                title="Move to Archive"
                              />
                            </a>
                          </div>
                        </div>
                      ))}
                </div>
              </>
            ) : (
              <>
                <div
                  className="notification-cont"
                  style={{ marginTop: !isLatest ? "60px" : "" }}
                >
                  {allnotiArchive &&
                    allnotiArchive
                      .filter(
                        (item) =>
                          item.title
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                          item.description
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                          item.created_at
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase())
                      )
                      .map((item, idx) => (
                        <div className="table-row-noti">
                          <div className="bar"></div>
                          <div>
                            {item.image !== "" ? (
                              <>
                                <img
                                  src={`/uploads/${item.image}`}
                                  // alt="/admin/images/admin/common/admin-icon.svg"
                                  style={{
                                    // borderRadius: "50%",
                                    // backgroundColor: "#86b4fc",
                                    width: "35px",
                                    height: "35px",
                                    // marginRight: "10px",
                                  }}
                                />
                              </>
                            ) : (
                              <div
                                className="desc"
                                style={{ fontSize: "14px" }}
                              >
                                No image found
                              </div>
                            )}
                          </div>
                          <div className="datetime-arc-mobile">
                            <div className="message">
                              <div
                                className="title"
                                style={{
                                  color: "#035189",
                                  fontWeight: "500",
                                }}
                              >
                                {item.title}
                              </div>
                              <div className="desc">{item.description}</div>
                            </div>
                          </div>
                          <div className="datetime-arc-mobile">
                            {item.created_at}
                          </div>
                        </div>
                      ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "100%", padding: "5rem" }}
        >
          <div className="heading-dotted-machine">
            Notification <span></span>
          </div>
          <div className="features-section-solution">
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-10">
                <div className="billing-table-cont">
                  <div
                    className="billing-search"
                    style={{
                      width: isLoginByParentUser == 1 ? "50%" : "40%",
                      height: "4rem",
                    }}
                  >
                    <div className="search-form">
                      <div className="input-container-notif">
                        {/* <FaCalendar style={{ color: "white" }} /> */}
                        <input
                          //   value={email}
                          type="date"
                          name="from"
                          className="input-signup"
                          placeholder="From"
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
                              filterByDate();
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={styles.container}>
                      <FaSearch style={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder="Search..."
                        style={styles.input}
                        value={searchText}
                        onChange={handleInputChange}
                      />
                    </div>

                    <img
                      src="/images/admin/09-Billing-Table/blue-bg.svg"
                      className="bg-imagee desktop"
                      alt="Background"
                    />
                    <img
                      src="/images/admin/09-Billing-Table/blue-bg.svg"
                      className="bg-imagee mobile"
                      alt="Background"
                    />
                    {isLoginByParentUser == 1 && (
                      <div
                        style={{
                          position: "absolute",
                          zIndex: "1",
                          top: "0rem",
                          width: "200px",
                          height: "60px",
                          backgroundColor: "transparent",
                          left: "170%",
                        }}
                      >
                        <div
                          onClick={() => setIsLatest(false)}
                          style={{
                            borderRadius: "12px",
                            borderStartStartRadius: "0px",
                            borderBottomLeftRadius: "0px",
                            position: "absolute",
                            zIndex: "1",
                            top: "0rem",
                            width: "100px",
                            height: "60px",
                            left: "100px",
                            backgroundColor: isLatest ? "#f1ddc8" : "#e97730",
                            // left: "75rem",
                          }}
                        >
                          <p
                            style={{
                              textAlign: "center",
                              fontWeight: "700",
                              fontSize: "17px",
                              marginTop: "15px",
                              color: isLatest ? "#e97730" : "white",
                            }}
                          >
                            Archive
                          </p>
                        </div>
                        <div
                          onClick={() => setIsLatest(true)}
                          style={{
                            borderRadius: "12px",
                            borderStartEndRadius: "0px",
                            borderBottomRightRadius: "0px",
                            position: "absolute",
                            zIndex: "1",
                            top: "0rem",
                            width: "100px",
                            height: "60px",
                            backgroundColor: isLatest ? "#e97730" : "#f1ddc8",
                            // left: "75rem",
                          }}
                        >
                          <p
                            style={{
                              textAlign: "center",
                              fontWeight: "700",
                              fontSize: "17px",
                              marginTop: "15px",
                              color: isLatest ? "white" : "#e97730",
                            }}
                          >
                            Latest
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="tab-buttons-cont"></div>
                  {isLatest && (
                    <div
                      className="buttons-container"
                      style={{ padding: "15px" }}
                    >
                      {/* {innerButtons.map((title, idx) => ( */}
                      {isLoginByParentUser == 1 && (
                        <Button
                          className="list-btns-web"
                          style={{
                            background: `${
                              activeButton === 1 ? "#035189" : "#f47c20"
                            }`,
                          }}
                          onClick={() => {
                            setActiveButton(1);
                            setAllNotification(adminNoti);
                            setFilteredNotifications(adminNoti);
                          }}
                        >
                          Admin Notif. (
                          {adminNoti !== null ? adminNoti.length : 0})
                        </Button>
                      )}
                      <Button
                        className="list-btns-web"
                        style={{
                          background: `${
                            activeButton === 2 ? "#035189" : "#f47c20"
                          }`,
                        }}
                        onClick={() => {
                          setActiveButton(2);
                          setAllNotification(vmNoti);
                          setFilteredNotifications(vmNoti);
                        }}
                      >
                        VM Notif. ({vmNoti !== null ? vmNoti.length : 0})
                        {/* VM Notification {"("} {vmNoti !== null ? "": 0{")"}} */}
                      </Button>
                      {isLoginByParentUser == 1 && (
                        <Button
                          className="list-btns-web"
                          style={{
                            background: `${
                              activeButton === 3 ? "#035189" : "#f47c20"
                            }`,
                          }}
                          onClick={() => {
                            setActiveButton(3);
                            setAllNotification(billNoti);
                            setFilteredNotifications(billNoti);
                          }}
                        >
                          Billing Notif. (
                          {billNoti !== null ? billNoti.length : 0})
                        </Button>
                      )}
                      {isLoginByParentUser == 1 && (
                        <Button
                          className="list-btns-web"
                          style={{
                            background: `${
                              activeButton === 4 ? "#035189" : "#f47c20"
                            }`,
                          }}
                          onClick={() => {
                            setActiveButton(4);
                            setAllNotification(paymentNoti);
                            setFilteredNotifications(paymentNoti);
                          }}
                        >
                          Payment Notif. (
                          {paymentNoti !== null ? paymentNoti.length : 0})
                        </Button>
                      )}
                      {/* <Button
                      className="list-btns-web"
                      style={{
                        background: `${
                          activeButton === 5 ? "#035189" : "#f47c20"
                        }`,
                      }}
                      onClick={() => setActiveButton(5)}
                    >
                      System Profile Noti. {"("}0{")"}
                    </Button> */}
                      <Button
                        className="list-btns-web"
                        style={{
                          background: `${
                            activeButton === 5 ? "#035189" : "#f47c20"
                          }`,
                        }}
                        onClick={() => {
                          setActiveButton(5);
                          setAllNotification(
                            smuser.platform_status == 0
                              ? allNotificationNative
                              : allNotificationCloud
                          );
                          setFilteredNotifications(
                            smuser.platform_status == 0
                              ? allNotificationNative
                              : allNotificationCloud
                          );
                        }}
                      >
                        All Notif. (
                        {smuser.platform_status == 0
                          ? allNotificationNative.length
                          : 0}
                        )
                      </Button>
                      {/* ))} */}
                      {isLoginByParentUser == 1 &&
                        filteredNotifications.length > 0 &&
                        isLatest && (
                          <Button
                            className="list-btns-web"
                            style={{
                              background: `${"#f47c20"}`,
                            }}
                            onClick={() => {
                              // setActiveButton(6);
                              if (isAllSelected) {
                                handleDeselectAll(); // Deselect all items
                              } else {
                                handleSelectAll(); // Select all items
                              }
                            }}
                          >
                            {isAllSelected ? "Unselect All" : "Select All"}
                          </Button>
                        )}
                      {isLoginByParentUser == 1 &&
                        activeButton === 6 &&
                        filteredNotifications.length > 0 &&
                        isLatest &&
                        isAllSelected && (
                          <Button
                            className="list-btns-web"
                            style={{
                              background: `${"#035189"}`,
                            }}
                            onClick={() => {
                              setActiveButton(6);
                              ArchiveCall(selectedAllId);
                            }}
                          >
                            Apply Archive
                          </Button>
                        )}
                    </div>
                  )}

                  {isLatest ? (
                    <>
                      <div className="notification-cont">
                        {filteredNotifications &&
                          filteredNotifications
                            .filter(
                              (item) =>
                                item.remarks
                                  ?.toLowerCase()
                                  .includes(searchText.toLowerCase()) ||
                                item.UserIP?.toLowerCase().includes(
                                  searchText.toLowerCase()
                                ) ||
                                item.machineID
                                  ?.toLowerCase()
                                  .includes(searchText.toLowerCase())
                            )
                            .map((item, idx) => (
                              <div
                                className="table-row-noti"
                                style={{ marginBottom: "15px" }}
                              >
                                <div className="bar"></div>
                                <div className="message">
                                  {/* <div className="title">{item.title}</div> */}
                                  <div className="title">{item.title}</div>
                                  {/* UserIP */}
                                  {activeButton === 1 &&
                                    (item.remarks !== null ? (
                                      <div class="desc">
                                        Description : {item.remarks}
                                      </div>
                                    ) : null)}{" "}
                                  {activeButton !== 1 &&
                                  item.UserIP !== null ? (
                                    <div class="desc">
                                      USER LOGIN IP : {item.UserIP}
                                    </div>
                                  ) : null}
                                  {item.machineID !== null ? (
                                    <div className="desc">
                                      Machine ID : {item.machineID}
                                    </div>
                                  ) : null}
                                  {item.order_id !== null ? (
                                    <div
                                      className="desc"
                                      onClick={() => handleViewInvoice(item)}
                                    >
                                      {/* onClick={() =>
                                  
                                } paymnet_id*/}
                                      Payment ID :{" "}
                                      <button
                                        style={{
                                          color: "rgb(3, 81, 137)",
                                          border: "none",
                                          backgroundColor: "transparent",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {item.order_id}
                                      </button>
                                    </div>
                                  ) : null}
                                  {item.price !== null ? (
                                    <div className="desc">
                                      Amount:
                                      {appCurrency &&
                                        smuser &&
                                        currencyReturn({
                                          price: item.price,
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                    </div>
                                  ) : null}
                                  {/* </div> */}
                                </div>
                                <div className="datetime">
                                  {item.created_at}
                                  {/* 16-02-2024 00:08:22 */}
                                </div>
                                {isLoginByParentUser == 1 && (
                                  <div
                                    className="archive-noti"
                                    onClick={() => ArchiveCall(item.id)}
                                  >
                                    <a>
                                      <img
                                        src="/images/admin/17-Notification/archive.png"
                                        title="Move to Archive"
                                      />
                                    </a>
                                  </div>
                                )}
                                {activeButton === 6 && (
                                  <input
                                    type="checkbox"
                                    checked="true"
                                    style={{
                                      marginRight: "25px",
                                      width: "28px",
                                      // height: "20px",
                                      backgroundColor: "035189",
                                    }}
                                    // onChange={handleCheckboxChange}
                                  />
                                )}
                              </div>
                            ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="notification-cont">
                        {/* {allnotiArchive &&
                          allnotiArchive.map((item, idx) => (
                            <div className="table-row-noti">
                              <div className="bar"></div>
                              <div className="message">
                                <div className="title">{item.title}</div>
                                <div className="desc">
                                  Mchine ID : {item.id}
                                </div>
                                <div className="desc">
                                  Payment ID:
                                  <a
                                    href=""
                                    style={{ color: "green" }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="invoice"
                                  >
                                    Invoice Order ID - SCVM75210720240216
                                  </a>
                                  <div className="desc">
                                    Amount:
                                    <FontAwesomeIcon
                                      icon={<FaRupeeSign />}
                                      style={{ fontSize: "24px" }}
                                      aria-hidden="true"
                                    />{" "}
                                    50
                                  </div>
                                </div>
                              </div>
                              <div className="datetime">
                                16-02-2024 00:08:22
                              </div>
                            </div>
                          ))} */}
                        {allnotiArchive &&
                          allnotiArchive
                            .filter(
                              (item) =>
                                item.title
                                  ?.toLowerCase()
                                  .includes(searchText.toLowerCase()) ||
                                item.UserIP?.toLowerCase().includes(
                                  searchText.toLowerCase()
                                ) ||
                                item.machineID
                                  ?.toLowerCase()
                                  .includes(searchText.toLowerCase())
                            )
                            .map((item, idx) => (
                              // <div className="table-row-noti">
                              //   <div className="bar"></div>
                              //   <div>
                              //     {item.image !== "" ? (
                              //       <>
                              //         <img
                              //           src={`/uploads/${item.image}`}
                              //           // alt="/admin/images/admin/common/admin-icon.svg"
                              //           style={{
                              //             // borderRadius: "50%",
                              //             // backgroundColor: "#86b4fc",
                              //             width: "35px",
                              //             height: "35px",
                              //             // marginRight: "10px",
                              //           }}
                              //         />
                              //       </>
                              //     ) : (
                              //       <div
                              //         className="desc"
                              //         style={{ fontSize: "14px" }}
                              //       >
                              //         No image found
                              //       </div>
                              //     )}
                              //   </div>
                              //   <div className="datetime-arc-mobile">
                              //     <div className="message">
                              //       <div
                              //         className="title"
                              //         style={{
                              //           color: "#035189",
                              //           fontWeight: "500",
                              //         }}
                              //       >
                              //         {item.title}
                              //       </div>
                              //       <div className="desc">{item.description}</div>
                              //     </div>
                              //   </div>
                              //   <div className="datetime-arc-mobile">
                              //     {item.created_at}
                              //   </div>
                              // </div>
                              <div
                                className="table-row-noti"
                                style={{ marginBottom: "15px" }}
                              >
                                <div className="bar"></div>
                                <div className="message">
                                  {/* <div className="title">{item.title}</div> */}
                                  <div className="title">{item.title}</div>
                                  {/* UserIP */}
                                  {item.UserIP !== null ? (
                                    <div class="desc">
                                      USER LOGIN IP : {item.UserIP}
                                    </div>
                                  ) : null}

                                  {item.machineID !== null ? (
                                    <div className="desc">
                                      Machine ID : {item.machineID}
                                    </div>
                                  ) : null}

                                  {item.order_id !== null ? (
                                    <div
                                      className="desc"
                                      onClick={() => handleViewInvoice(item)}
                                    >
                                      {/* onClick={() =>
                                  
                                } paymnet_id*/}
                                      Payment ID :{" "}
                                      <button
                                        style={{
                                          color: "rgb(3, 81, 137)",
                                          border: "none",
                                          backgroundColor: "transparent",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {item.order_id}
                                      </button>
                                    </div>
                                  ) : null}

                                  {item.price !== null ? (
                                    <div className="desc">
                                      Amount:
                                      {appCurrency &&
                                        smuser &&
                                        currencyReturn({
                                          price: item.price,
                                          symbol: smuser.prefer_currency,
                                          rates: appCurrency,
                                        })}
                                    </div>
                                  ) : null}
                                  {/* </div> */}
                                </div>
                                <div className="datetime">
                                  {item.created_at}
                                  {/* 16-02-2024 00:08:22 */}
                                </div>
                                {/* <div
                                className="archive-noti"
                                onClick={() => ArchiveCall(item.id)}
                              >
                                <a>
                                  <img
                                    src="/images/admin/17-Notification/archive.png"
                                    title="Move to Archive"
                                  />
                                </a>
                              </div> */}
                              </div>
                            ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-1"></div>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;