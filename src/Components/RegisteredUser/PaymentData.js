import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import "./BillingPage.css";
import instance, { currencyReturn } from "../../Api";
import { useAuth } from "../../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import * as XLSX from "xlsx";

const PaymentData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //   const { billData } = location.state;

  const { smuser, appCurrency } = useAuth();
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const billData = location.state ? location.state.billData : null;

  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredBillingData, setFilteredBillingData] = useState([]);

  const BillingCall = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
      // vm_id: billData.vm_id,
    };
    try {
      const loginUserResponse = await instance.post("/paymentdata", payload);
      //console.log(loginUserResponse.data.bills, "====paymentdata");
      const bills = loginUserResponse.data.bills;
      // const billArray = Object.keys(bills).map((key) => bills[key]);
      const billArray = Object.values(bills);
      const successfulBills = billArray.filter(
        (item) => item.status === "Transaction successful"
      );
      setBillingData(successfulBills);
      setFilteredBillingData(successfulBills);
      //console.log(bills);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const filterByDate = () => {
    const filtered = billingData.filter((item) => {
      const itemDate = new Date(item.created_at);
      const start = new Date(startDate);
      const end = new Date(endDate);

      itemDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return itemDate >= start && itemDate <= end;
    });
    setFilteredBillingData(filtered);
  };

  useEffect(() => {
    BillingCall();
    // if (billData === null) {
    //   navigate(-1);
    // } else {
    //   BillingCall();
    // }
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const exportToExcel = (data) => {
    const filteredData = data.map((item) => ({
      paid_on: item.created_at,
      period: "Not Applicable",
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

    const fileName = "billing_Data";
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: isMobile
          ? filteredBillingData.length > 0
            ? "65rem"
            : ""
          : "65rem",
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
          <div className="heading-dotted-bill">
            Billing <span></span>
          </div>
          <div
            style={{
              position: "relative",
              backgroundColor: "#e97730",
              padding: "18px",
              borderRadius: "20px",
              zIndex: "999",
              width: "90%",
              marginLeft: "20px",
            }}
          >
            <div
              style={{
                // display: "flex",
                position: "relative",
                zIndex: "1",
              }}
            >
              <div className="search-form" style={{ marginTop: "10px" }}>
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
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                        filterByDate();
                      }}
                    />
                  </div>
                  {/* <div
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
                        paddingLeft: "23px",
                        fontWeight: "700",
                        color: "#154e7a",
                        backgroundColor: "white",
                        marginLeft: "10px",
                        width: "6rem",
                        /* margin-top: 35px; 
                        borderRadius: "50px",
                        /* padding: 10px 30px; 
                        border: "1px solid rgb(255, 255, 255);",
                      }}
                      // onClick={submitData}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          {filteredBillingData.length > 0 && (
            <div className="features-section-solution">
              <Row>
                <div className="col-md-1"></div>
                <div className="col-md-10">
                  <div className="billing-list">
                    <div className="table-row no-hover">
                      <div className="table-head">
                        <div className="table-content">Paid On</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Period</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content"> Invoice #</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Status</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Amount</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                    </div>
                    {filteredBillingData &&
                      filteredBillingData.map((item, idx) => (
                        <div className="table-row">
                          <div className="table-data">
                            <img
                              src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                              className="bg-image"
                              alt="Background"
                            />
                            <div className="table-content">
                              <div>{formatDate(item.created_at)}</div>
                            </div>
                          </div>
                          <div className="table-data">
                            <div className="table-content">
                              <div style={{ fontSize: "17px" }}>
                                Not Applicable
                                {/* {formatDate(item.created_at)} -
                              {formatDate(item.updated_at)} */}
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
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "600",
                                }}
                              >
                                {item.orderid}
                              </div>
                              <a
                                onClick={() =>
                                  navigate("/invoice", {
                                    state: { billData: item },
                                  })
                                }
                                target="_blank"
                                style={{
                                  display: "inline-block",
                                  color: "#289cef",
                                  fontWeight: "500",
                                  textDecoration: "underline",
                                }}
                              >
                                View
                              </a>

                              <a
                                onClick={() =>
                                  navigate("/invoice", {
                                    state: { billData: item },
                                  })
                                }
                                target="_blank"
                                style={{
                                  marginLeft: "5px",
                                  display: "inline-block",
                                  color: "#289cef",
                                  fontWeight: "500",
                                  textDecoration: "underline",
                                }}
                              >
                                Download
                              </a>
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
                                  {/* <i
                                  className="fas fa-rupee-sign"
                                  style={{ paddingTop: "3px" }}
                                  aria-hidden="true"
                                ></i> */}
                                  <span
                                    style={{
                                      color:
                                        item.status === "Transaction successful"
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {" "}
                                    {item.status === "Transaction successful"
                                      ? "#paid"
                                      : "#unpaid"}
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
                              <span>
                                {currencyReturn({
                                  price: item.amount,
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              </span>
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
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                      <div className="table-foot">
                        <img
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                      <div className="table-foot">
                        <img
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                      <div className="table-foot">
                        <img
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                      <div className="table-foot">
                        <img
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
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
          {filteredBillingData.length === 0 ? (
            <div
              style={{
                position: "relative",
                left: "30%",
                marginTop: "5rem",
                fontSize: "24px",
                fontWeight: "400",
              }}
            >
              No Records
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div
          className="features-page-solution"
          style={{ height: "50rem", paddingLeft: "15rem", paddingTop: "4rem" }}
        >
          <div className="heading-dotted-bill" style={{ marginLeft: "0.5rem" }}>
            Billing
          </div>
          <div
            style={{
              marginTop: "20px",
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
              <div className="search-form" style={{ marginTop: "10px" }}>
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
                  {/* <div
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
                        paddingLeft: "23px",
                        fontWeight: "700",
                        color: "#154e7a",
                        backgroundColor: "white",
                        marginLeft: "10px",
                        width: "6rem",
                        /* margin-top: 35px; 
                        borderRadius: "50px",
                        /* padding: 10px 30px;
                        border: "1px solid rgb(255, 255, 255);",
                      }}
                      // onClick={submitData}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="features-section-solution">
            <Row>
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
                        <div className="table-content">Paid On</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content"> Period</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Invoice # </div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Status</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                      <div className="table-head">
                        <div className="table-content">Amount</div>
                        <img
                          src="/images/admin/10-Billing-Details/server-top-img.png"
                          className="bg-image"
                          alt="Background"
                        />
                      </div>
                    </div>
                    {filteredBillingData &&
                      filteredBillingData.map((item, idx) => (
                        <div className="table-row">
                          <div className="table-data">
                            <img
                              src="/images/admin/08-VM-Billing-List/server-middle-img.svg"
                              className="bg-image"
                              alt="Background"
                            />
                            <div className="table-content">
                              <div>{formatDate(item.created_at)}</div>
                            </div>
                          </div>
                          <div className="table-data">
                            <div className="table-content">
                              <div style={{ fontSize: "17px" }}>
                                Not Applicable
                                {/* {formatDate(item.created_at)} -
                                {formatDate(item.updated_at)} */}
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
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "600",
                                }}
                              >
                                {item.orderid}
                              </div>
                              <button
                                onClick={() =>
                                  navigate("/invoice", {
                                    state: { billData: item },
                                  })
                                }
                                target="_blank"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  display: "inline-block",
                                  color: "#289cef",
                                  fontWeight: "500",
                                  textDecoration: "underline",
                                }}
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  navigate("/invoice", {
                                    state: { billData: item },
                                  })
                                }
                                target="_blank"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  marginLeft: "5px",
                                  display: "inline-block",
                                  color: "#289cef",
                                  fontWeight: "500",
                                  textDecoration: "underline",
                                }}
                              >
                                Download
                              </button>
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
                                  {/* <i
                                    className="fas fa-rupee-sign"
                                    style={{ paddingTop: "3px" }}
                                    aria-hidden="true"
                                  ></i> */}
                                  <span
                                    style={{
                                      color:
                                        item.status === "Transaction successful"
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {" "}
                                    {item.status === "Transaction successful"
                                      ? "#paid"
                                      : "#unpaid"}
                                    {/* {appCurrency &&
                                      smuser &&
                                      currencyReturn({
                                        price: item.cost,
                                        symbol: smuser.prefer_currency,
                                        rates: appCurrency,
                                      })} */}
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
                              <span>
                                {currencyReturn({
                                  price: item.amount,
                                  symbol: smuser.prefer_currency,
                                  rates: appCurrency,
                                })}
                              </span>
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
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                      <div className="table-foot">
                        <img
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                      <div className="table-foot">
                        <img
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                      <div className="table-foot">
                        <img
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                      <div className="table-foot">
                        <img
                          src="/images/admin/10-Billing-Details/server-bottom-img.png"
                          className="table-footer-image-size"
                          alt="Background"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
            {filteredBillingData.length === 0 ? (
              <div
                style={{
                  position: "relative",
                  left: "40%",
                  marginTop: "-15rem",
                  fontSize: "24px",
                  fontWeight: "400",
                }}
              >
                No Records
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentData;
