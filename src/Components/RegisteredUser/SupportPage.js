import React, { useEffect, useRef, useState } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import "./SupportPage.css";
import { useAuth } from "../../AuthContext";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  decryptData,
} from "../../Api";
import Loader from "../common/Loader";
import { FaX } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "../../AppToast";

// import RangeSlider from "./common/RangeSlider";

const SupportPage = () => {
  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  const fileInputRef = useRef(null);
  const { smuser, isLoginByParentUser } = useAuth();
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [activeButton, setActiveButton] = useState("");
  const [machineData, setMachineData] = useState([]);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportMachine, setSupportMachine] = useState("");
  const [supportMachineArr, setSupportMachineArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [showMore, setShowMore] = useState(false);
  const [showMoreID, setShowMoreID] = useState(null);
  const [enquiries, setEnquiries] = useState(null);
  const [enqID, setEnqID] = useState("");

  const [replyArr, setReplyArr] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [noVM, setNoVM] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const [ticketType, setTicketType] = useState("");
  const innerButtons =
    isLoginByParentUser == 1
      ? [
          "Performance Issue",
          "Network Issue",
          "Installation Issue",
          "Sales",
          "Billing Query",
          "Other",
        ]
      : ["Performance Issue", "Network Issue", "Installation Issue", "Other"];

  const ticketButtons = ["open", "progress", "complete", "archived", ""];
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageRply, setSelectedImageRply] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(null);
  const [showPreviewImagePopup, setPreviewImagePopup] = useState(null);
  const DateTimeSplit = ({ datetime }) => {
    // Split the date and time
    const [date, time] = datetime.split(" ");

    return (
      <div>
        <p>{date}</p>
        <p>{time}</p>
      </div>
    );
  };

  const getCommaSeparatedString = (arr) => {
    return arr.join(", ");
  };

  const toggleMachineIdValue = (value) => {
    if (supportMachineArr.includes(value)) {
      // If value is already present, remove it
      const filteredArray = supportMachineArr.filter((item) => item !== value);
      setSupportMachineArr(filteredArray);
    } else {
      // If value is not present, add it
      setSupportMachineArr([...supportMachineArr, value]);
    }
  };

  const handleButtonClick = () => {
    // Programmatically trigger click on file input
    // console.log("Programmatically trigger click on file input");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    //console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast((t) => (
          <AppToast
            id={t.id}
            message={
              "Selected file size exceeds 2MB. Please choose a smaller file."
            }
            isMobile={isMobile}
          />
        ));
        // Optionally clear the selected file input
        e.target.value = null;
        return;
      }
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpdateRply = (e) => {
    //console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("File size exceeds 2MB. Please choose a smaller file.");
        // Optionally clear the selected file input
        e.target.value = null;
        return;
      }
      setSelectedImageRply(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const UpdateSupport = async () => {
    setLoading(true);
    if (
      activeButton === "Sales" ||
      activeButton === "Billing Query" ||
      activeButton === "Other"
    ) {
      setNoVM(true);
    }
    if (
      smuser !== null &&
      supportMsg !== "" &&
      // supportMachine !== "" &&
      activeButton !== ""
    ) {
      const formDataProfile = new FormData();
      formDataProfile.append("file", selectedImage);
      formDataProfile.append(
        "vm_id",
        getCommaSeparatedString(supportMachineArr)
      ); //JSON.stringify(supportMachineArr));
      formDataProfile.append("type", activeButton);
      formDataProfile.append("user_id", smuser.id);
      formDataProfile.append("name", smuser.name);
      formDataProfile.append("user_email", smuser.email);
      formDataProfile.append("user_mobile", smuser.phone);
      formDataProfile.append("msg", supportMsg);
      formDataProfile.append(
        "reply",
        "We are look into this. please wait while"
      );

      // console.log(formDataProfile.values);
      // console.log(supportMachineArr);
      try {
        // First API call to encrypt the request
        // const encryptedResponse = await apiEncryptRequest(payload);
        // //console.log(encryptedResponse, "=encryptedResponse");

        // Second API call to login with encrypted response
        const cdnInfoResponse = await instance.post(
          "/create-enquiry",
          formDataProfile
        );
        //console.log(cdnInfoResponse.data, "====cdnInfoResponse");

        // Third API call to decrypt the login response
        const Response = await decryptData(cdnInfoResponse.data);
        // console.log(Response);
        setSupportMachine(null);
        setSupportMsg("");
        setSelectedImage(null);
        setActiveButton("");
        //console.log(Response, "==!==!==Response");
        if (Response.status) {
          //toast.success("Your Ticket generated");
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Your Ticket generated"}
              isMobile={isMobile}
            />
          ));
          window.location.href = "/create-ticket";
        } else {
          GetTickets();
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
      if (supportMsg == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Message is Required!"}
            isMobile={isMobile}
          />
        ));
      } else if (activeButton == "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Select Support Type Required!"}
            isMobile={isMobile}
          />
        ));
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"All fields are required!"}
            isMobile={isMobile}
          />
        ));
      }
    }
    setLoading(false);
  };

  const GetMachines = async () => {
    const payload = {
      user_id: smuser.id,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/machines",
        encryptedResponse
      );
      // const loginResponse = await apiDecrypteRequest(loginUserResponse.data);

      const localDecrypt = await decryptData(loginUserResponse.data);
      // console.log(localDecrypt, "localDecrypt");
      const userDetails = localDecrypt;
      const user = localDecrypt.user;
      const vm = localDecrypt.vm;

      // //console.log(user, "==!==!==user");
      //console.log(vm, "==!==!==vm");
      const vmArray = Object.keys(vm).map((key) => vm[key]);
      // console.log(vmArray, "==!==!==vvmArraym");
      setMachineData(vmArray);
      // const vmArray = Object.keys(vm).map((key) => vm[key]);
      // localStorage.setItem("NEW_USER", JSON.stringify(userDetails));
      // window.location.href = "/";
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  // const filterByEnquiryId = (dataArray, enquiryId) => {
  //   return dataArray.filter((item) => item.enquiry_id === enquiryId);
  // };
  const filterByEnquiryId = (dataArray, enquiryId) => {
    // Flatten the dataArray first, assuming dataArray is [{}, {}]
    const flattenedArray = dataArray.flat();
    console.log(
      flattenedArray.filter((item) => item.enquiry_id === enquiryId),
      "flattenedArray"
    );
    // Filter and return objects with matching enquiry_id
    return flattenedArray.filter((item) => item.enquiry_id === enquiryId);
  };

  const filterByStatus = (dataArray, status) => {
    if (status === "") {
      return dataArray;
    } else {
      return dataArray.filter((item) => item.status === status);
    }
  };

  const convertToString = (value) => {
    // Check if value is an array
    if (Array.isArray(value)) {
      // Convert array to comma-separated string
      return value.join(", ");
    } else {
      // Return string directly
      return value;
    }
  };

  const GetTickets = async () => {
    setLoading(true);
    if (smuser !== null) {
      const payload = {
        user_id: smuser.id,
      };
      //console.log(payload);
      try {
        // const encryptedResponse = await apiEncryptRequest(payload);
        const cdnInfoResponse = await instance.post("/enquirys", payload);
        //console.log(cdnInfoResponse.data, "====tickets");
        const Response = await decryptData(cdnInfoResponse.data);

        // console.log(Response, "==!==!==tickets");
        const enq = Response.enquiries;
        const enqMsgs = Response.enquiry_replys;
        setReplyArr(enqMsgs);
        // console.log(enqMsgs, "enqMsgs");
        // console.log(enq);
        setEnquiries(enq);

        if (
          filterByStatus(enq, "").filter((item) => item.status === "progress")
            .length > 0
        ) {
          setTicketType("inProgress");
        } else {
          setTicketType("open");
        }
      } catch (error) {
        console.error("Error during the login process:", error);
      }
    } else {
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
    setLoading(false);
  };

  const TicketsReply = async (replyID, ID) => {
    setLoading(true);
    if (
      replyText !== "" &&
      replyID !== "" &&
      replyText !== null &&
      replyID !== null
    ) {
      const formDataProfile = new FormData();
      if (replyID && replyText && ID && smuser.id) {
        formDataProfile.append(
          "file",
          selectedImageRply === null ? "" : selectedImageRply
        );
        formDataProfile.append("id", replyID);
        formDataProfile.append("reply_message", replyText);
        formDataProfile.append("enquiry_id", ID);
        formDataProfile.append("user_id", smuser.id);

        // Send formDataProfile or log it
        // console.log(...formDataProfile.entries());
      } else {
        console.error("Missing data for form submission");
      }

      try {
        const cdnInfoResponse = await instance.post(
          "/reply_enquiry",
          formDataProfile
        );
        //console.log(cdnInfoResponse.data, "====tickets");

        // Third API call to decrypt the login response
        // console.log(cdnInfoResponse, "==!==!==reply_enquiry");
        if (cdnInfoResponse.status) {
          setReplyText("");
          setSelectedImageRply(null);
          GetTickets();
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
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Please write your reply!"}
          isMobile={isMobile}
        />
      ));
    }
    setLoading(false);
  };

  const ArchiveTicket = async (data) => {
    //     status == 'archived',
    // status == 'close'
    setLoading(true);
    // console.log(data, "ArchiveTicket");
    // if (enqID !== "") {
    const payload = {
      enquiry_id: data.id,
      user_id: smuser.id,
      status: data.status,
    };
    // console.log(payload, "reply_enquiry");
    try {
      const cdnInfoResponse = await instance.post("/archived_enquiry", payload);
      //console.log(cdnInfoResponse.data, "====tickets");

      // Third API call to decrypt the login response
      // console.log(cdnInfoResponse, "==!==!==reply_enquiry");
      if (cdnInfoResponse.status) {
        GetTickets();
      }
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    // } else {
    //   alert("Please write your reply!");
    // }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    GetMachines();
    GetTickets();
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, enqID]);

  const [index, setIndex] = useState(0);

  const handleSupportMachineClick = (vmId) => {
    toggleMachineIdValue(vmId);
    setSupportMachine(vmId);
  };
  const handleOptionVM = (event) => {
    toggleMachineIdValue(event.target.value);
    // console.log(event.target.value);
    setSupportMachine(event.target.value);
  };
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const featureListStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: "20px",
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
      {showImagePopup && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backdropFilter: "blur(5px)",
              // backgroundColor: "white",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
              borderRadius: "12px", // Assuming you want rounded corners
              border: "2px solid #e97730",
              top: "30%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile ? "80%" : "30%",
              height: isMobile ? "30%" : "30rem",
            }}
          >
            <div style={{ display: "grid", justifyItems: "center" }}>
              <button
                style={{
                  zIndex: "9",
                  position: "absolute",
                  backgroundColor: "white",
                  border: "none",
                  right: "0",
                }}
                onClick={() => setShowImagePopup(false)}
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
              {showPreviewImagePopup !== null &&
              showPreviewImagePopup !== "" ? (
                <img
                  src={`${showPreviewImagePopup}`}
                  style={{
                    width: "70%",
                    height: isMobile ? "80%" : "70%",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#f47c20",
                    marginTop: "55px",
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <div
          className=""
          style={{
            width: "100%",
            minHeight: "65rem",
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
          <div className="heading-dotted-support">
            Support <span></span>
          </div>
          <div
            className="features-section-solution"
            style={{ marginTop: "0px" }}
          >
            {showSupport ? (
              <div>
                <div className="buttons-container">
                  {innerButtons.map((title, idx) => (
                    <Button
                      key={idx}
                      style={{
                        background: `${
                          activeButton === title ? "#035189" : "#f47c20"
                        }`,
                        border: "none",
                        fontSize: "16px",
                        padding: "5px 15px",
                        color: "#fff",
                        fontWeight: "600",
                        borderRadius: "20px",
                        marginBottom: "10px",
                      }}
                      onClick={() => setActiveButton(title)}
                    >
                      {title}
                    </Button>
                  ))}
                </div>
                <div
                  className="register-main see-full"
                  style={{ marginTop: "2rem" }}
                >
                  <div className="bg-img">
                    <img
                      src="/images/blue-box-bg.svg"
                      alt=""
                      style={{ width: "100%" }}
                    />
                  </div>
                  <form className="see-full">
                    <input
                      type="hidden"
                      name="_token"
                      value="IHks1cEdGGmsvouWsdVeWVHE29KFoaLV0iN8cPkE"
                    />

                    <div className="form-top">
                      <h4 className="text-white">Send us your question</h4>
                      <p
                        style={{
                          color: "white",
                          marginTop: "15px",
                          fontSize: "16px",
                          lineHeight: "150%",
                        }}
                      >
                        To help us resolve your Server related problem quickly,
                        We might Require Temporary access credentials
                        (root/admin) to your server. Please provide us with a
                        detailed specification of what the issue is.
                      </p>
                      {machineData.length > 0 ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            {machineData &&
                              machineData.map((item, idx) => (
                                <>
                                  {(item.public_ip || item.ip_address) && (
                                    <div
                                      style={{
                                        backgroundColor: "#f47c20",
                                        border: "none",
                                        borderRadius: "20px",
                                        paddingLeft: "10px",
                                        paddingBottom: "10px",
                                        width: "max-content",
                                      }}
                                      onClick={() =>
                                        handleSupportMachineClick(item.vm_id)
                                      }
                                    >
                                      <label
                                        className="radio-label"
                                        style={{ marginTop: "8px" }}
                                      >
                                        <input
                                          type="radio"
                                          value={item.vm_id}
                                          checked={supportMachineArr.includes(
                                            item.vm_id
                                          )}
                                          onChange={handleOptionVM}
                                          className="radio-input"
                                          style={{ marginBottom: "-3px" }}
                                        />
                                        {item.vm_name}
                                      </label>
                                    </div>
                                  )}
                                </>
                              ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            style={{
                              borderRadius: "5px",
                              paddingRight: "5px",
                              paddingLeft: "5px",

                              height: "25px",

                              backgroundColor: "#f47c20",

                              position: "absolute",
                              color: "white",
                            }}
                          >
                            No Machines
                          </p>
                        </>
                      )}

                      {activeButton === "Sales" ||
                      activeButton === "Billing Query" ||
                      activeButton === "Other" ? (
                        <p
                          style={{
                            position: "absolute",
                            left: "50%",
                            color: "white",
                            top: "21%",
                          }}
                        >
                          (Optional)
                        </p>
                      ) : null}
                      <div
                        className="input-container"
                        style={{ marginTop: "50px" }}
                      >
                        <textarea
                          placeholder="Content"
                          style={{
                            minHeight: "200px",
                            maxHeight: "500px",
                            padding: "10px",
                            height: "157px",
                            width: "100%",
                            backgroundColor: "transparent",
                            color: "white",
                            borderRadius: "30px",
                            border: "none",
                          }}
                        ></textarea>
                      </div>
                      {/* File Selection */}
                      <div
                        style={{
                          // width: "10rem",
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          // border: "2px solid white",
                          // borderRadius: "25px",
                          padding: "5px",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{
                            marginTop: "0px",
                            marginLeft: "15px",
                            color: "grey",
                            fontSize: "21px",
                          }}
                        />
                      </div>
                      <br />
                      <label
                        style={{
                          width: "max-content",
                          position: "absolute",
                          /* left: 170px; */
                          fontSize: "14px",
                          fontStyle: "italic",
                          color: "white",
                          fontWeight: "600",
                          marginTop: "-22px",
                        }}
                      >
                        Note : Please upload .png .jpeg .jpg images only.
                      </label>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div className="log-in">
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
                              src="/images/more-info-btn-bg.svg"
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
                                color: "white",
                                marginTop: "0px",
                                fontWeight: "600",
                              }}
                            >
                              Submit
                            </span>
                          </div>
                        </a>
                      </div>
                      <div
                        className="log-in"
                        onClick={() => setShowSupport(false)}
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
                                fontWeight: "600",
                              }}
                            >
                              Cancel
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div style={{ position: "absolute" }}>
                <Button
                  style={{
                    background: "#035189",
                    border: "none",
                    fontSize: "20px",
                    padding: "5px 15px",
                    color: "#fff",
                    fontWeight: "600",
                    // borderRadius: "20px",
                    marginBottom: "10px",
                  }}
                  onClick={() => setShowSupport(true)}
                >
                  Create Ticket
                </Button>
              </div>
            )}

            {/* Present Tickets */}
            <div
              className="heading-dotted-support"
              style={{ marginLeft: "-4px" }}
            >
              tickets{" "}
            </div>
            <div
              className="buttons-container"
              style={{
                display: "flex",
                marginTop: "15px",
                marginLeft: "-5px",
                marginBottom: "-15px",
              }}
            >
              <div style={{ marginLeft: "auto" }}>
                {ticketButtons.map((title, idx) => (
                  <Button
                    key={idx}
                    style={{
                      background: `${
                        idx === 1 && ticketType === "inProgress"
                          ? "#f47c20"
                          : ticketType === title
                          ? "#f47c20"
                          : "#035189"
                      }`,
                      border: "none",
                      fontSize: "14px",
                      padding: "5px 15px",
                      color: "#fff",
                      fontWeight: "600",
                      borderRadius: "20px",
                      marginBottom: "10px",
                    }}
                    onClick={() => setTicketType(title)}
                  >
                    {idx == 0
                      ? "Open"
                      : idx == 1
                      ? "inProgress"
                      : idx == 2
                      ? "Closed"
                      : idx == 3
                      ? "Archive"
                      : idx == 4
                      ? "All"
                      : ""}
                  </Button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", marginTop: "35px" }}>
              <Button
                style={{
                  background: "#035189",
                  border: "none",
                  fontSize: "20px",
                  padding: "5px 15px",
                  color: "#fff",
                  fontWeight: "600",
                  // borderRadius: "20px",
                  marginBottom: "10px",
                }}
              >
                Latest
              </Button>
              <div
                className="input-container"
                style={{
                  border: "2px solid #035189",
                  width: "10rem",
                  marginTop: "0px",
                  height: "45px",
                }}
              >
                <input
                  type="text"
                  name="search"
                  className="input-signup input-tickets"
                  placeholder="Search"
                  value={searchText}
                  style={{
                    color: "black",
                    textAlign: "center",
                    width: "10px",
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                {searchText && (
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    onClick={() => setSearchText("")}
                  >
                    <FaX
                      style={{
                        marginBottom: "2px",
                        color: "#154e7a",
                        display: "inline-block",
                        fontSize: "19px",
                      }}
                    />
                  </button>
                )}
              </div>
            </div>

            <div
              className="notification-cont"
              style={{ height: "50vh", marginBottom: "3rem" }}
            >
              {/* inProgress */}
              {ticketType === "progress" || ticketType === "inProgress" ? (
                <>
                  {enquiries &&
                    filterByStatus(enquiries, "")
                      .filter(
                        (item) =>
                          item.status === "progress" &&
                          item.enquiry_unique_id
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                      )
                      .map((item, idx) => (
                        <div className="table-row-noti" key={idx}>
                          <div className="bar"></div>
                          <div className="message">
                            <Button
                              style={{
                                marginLeft: "0px",
                                marginTop: "5px",
                                background: "#035189",
                                border: "none",
                                fontSize: "20px",
                                padding: "5px 15px",
                                color: "#fff",
                                fontWeight: "600",
                                // width: "17%",
                              }}
                            >
                              Ticket No. : {item.enquiry_unique_id}
                            </Button>
                            {/* {item.vm_id !== "null" && item.vm_id !== null && (
                              <div class="desc">Machine : {item.vm_name}</div>
                            )} */}
                            <div
                              class="desc"
                              style={{
                                fontSize: "12px",
                                marginTop: "10px",
                                color: "#035189",
                                maxHeight: "100px",
                                fontWeight: "600",
                                maxWidth: "150px",
                              }}
                            >
                              Subject : {item.type}
                            </div>
                            <div
                              class="desc"
                              style={{
                                fontSize: "12px",
                                marginTop: "10px",
                                color: "#f47c20",
                                maxHeight: "100px",
                                fontWeight: "600",
                                maxWidth: "100rem",
                              }}
                            >
                              Desc. : {item.enquiry}
                            </div>
                            {item.image !== null && item.image !== "" && (
                              <div style={{ marginTop: "10px" }}>
                                {item.image !== null && item.image !== "" ? (
                                  <button
                                    onClick={() => {
                                      setPreviewImagePopup(item.image);
                                      setShowImagePopup(true);
                                    }}
                                    style={{
                                      border: "none",
                                      background: "none",
                                      padding: 0,
                                    }}
                                  >
                                    <img
                                      //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                      src={`${item.image}`}
                                      style={{
                                        maxWidth: "150px",
                                        maxHeight: "150px",
                                        border: "2px solid #f47c20",
                                        borderRadius: "8px",
                                        // backgroundColor: "#f47c20",
                                      }}
                                    />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}

                            <div
                              class=""
                              style={{ fontSize: "24px" }}
                              onClick={() => {
                                setShowMore(!showMore);
                                setShowMoreID(idx);
                              }}
                            >
                              <Button
                                style={{
                                  marginLeft: "0px",
                                  marginTop: "10px",
                                  background: "#035189",
                                  border: "none",
                                  fontSize: "20px",
                                  padding: "5px 15px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  marginBottom: "10px",
                                }}
                              >
                                {" "}
                                {showMore && showMoreID === idx
                                  ? "Hide"
                                  : "Show More"}{" "}
                              </Button>
                            </div>
                            {showMore && showMoreID === idx && (
                              <>
                                {/* <div> Description: {item.enquiry}</div> */}
                                <div
                                  className="you-title"
                                  style={{
                                    fontSize: "24px",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {filterByEnquiryId(replyArr, item.id).map(
                                    (msg, idx) => (
                                      <>
                                        <div
                                          //class="desc"
                                          style={{ maxHeight: "none" }}
                                        >
                                          <p
                                            style={{
                                              //marginBottom: "0rem",
                                              marginTop: "10px",
                                              marginRight: "200px",
                                            }}
                                          >
                                            {" "}
                                            {msg.admin_reply !== null ? (
                                              <span
                                                className="spanWithMargin"
                                                style={{
                                                  color: "#035189",
                                                  //marginBottom: "10px",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                Support :{" "}
                                                <span
                                                // style={{
                                                //   color: "black",
                                                //   fontWeight: "300",
                                                //   fontSize: "13px",
                                                // }}
                                                >
                                                  {msg.admin_reply}
                                                </span>
                                              </span>
                                            ) : null}
                                            {msg.reply !== null ? (
                                              <span
                                                style={{
                                                  color: "#f47c20",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                You:{" "}
                                                <span
                                                  style={{
                                                    whiteSpace: "pre-wrap",
                                                  }}
                                                >
                                                  {msg.reply}
                                                </span>
                                              </span>
                                            ) : null}
                                          </p>
                                          {msg.image !== null &&
                                          msg.image !== "" ? (
                                            <img
                                              //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                              src={`${msg.image}`}
                                              style={{
                                                maxWidth: "150px",
                                                maxHeight: "150px",
                                                border: "2px solid #f47c20",
                                                borderRadius: "8px",
                                              }}
                                            />
                                          ) : null}
                                        </div>
                                      </>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                          <div
                            className="datetime"
                            style={{
                              // display: "flex",
                              marginLeft: "80%",
                              marginRight: "0px",
                              position: "absolute",
                              top: "15px",
                            }}
                          >
                            Created at : {item.createdAt}
                            <select
                              name="plan_time"
                              style={{
                                borderRadius: "4px",
                                background:
                                  item.status === "completed"
                                    ? "green"
                                    : item.status === "progress"
                                    ? "#aaaa00" //YELLOW
                                    : item.status === "open"
                                    ? "#f47c20"
                                    : "#aa0000", // RED
                                border: "none",
                                fontSize: "18px",
                                padding: "5px 15px",
                                color: "#fff",
                                fontWeight: "600",
                                // borderRadius: "20px",
                                marginBottom: "10px",
                              }}
                              value={item.status}
                              onChange={(e) => {
                                // setSupportMachine(e.target.value);
                                ArchiveTicket({
                                  id: item.id,
                                  status: e.target.value,
                                });
                              }}
                            >
                              <option value="completed" disabled="true">
                                Complete
                              </option>
                              <option value="progress" disabled="true">
                                inProgress
                              </option>
                              <option value="open" disabled="true">
                                Open
                              </option>
                              <option value="pending" disabled="true">
                                Pending
                              </option>
                              <option
                                value="archived"
                                disabled={item.archived === "archived"}
                              >
                                Archive
                              </option>
                              <option value="close">Close</option>
                            </select>
                          </div>
                        </div>
                      ))}
                </>
              ) : (
                <></>
              )}

              {/* Complete */}
              {console.log("ticketType=", ticketType)}
              {ticketType === "complete" ? (
                <>
                  {enquiries &&
                    filterByStatus(enquiries, "")
                      .filter(
                        (item) =>
                          item.status === "completed" &&
                          item.enquiry_unique_id
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                      )
                      .map((item, idx) => (
                        <div className="table-row-noti" key={idx}>
                          <div className="bar"></div>
                          <div className="message">
                            {item.archived !== "archived" ? (
                              <div
                                className="archive-noti"
                                style={{
                                  top: "1px",
                                  left: "85%",
                                  position: "absolute",
                                }}
                              >
                                <button
                                  style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() => {
                                    setEnqID(item.id);
                                    ArchiveTicket();
                                  }}
                                >
                                  <img
                                    src="/images/admin/17-Notification/archive.png"
                                    title="Move to Archive"
                                  />
                                </button>
                              </div>
                            ) : null}

                            <Button
                              style={{
                                fontWeight: "600",
                                marginLeft: "0px",
                                marginTop: "5px",
                                background: "#035189",
                                border: "none",
                                fontSize: "10px",
                                padding: "5px 15px",
                                color: "#fff",
                              }}
                            >
                              Ticket No. : {item.enquiry_unique_id}
                            </Button>
                            {/* {item.vm_id !== "null" && item.vm_id !== null && (
                              <div class="desc">Machine : {item.vm_name}</div>
                            )} */}
                            <div
                              class="desc"
                              style={{
                                fontSize: "12px",
                                marginTop: "10px",
                                color: "#035189",
                                maxHeight: "100px",
                                fontWeight: "600",
                                maxWidth: "150px",
                              }}
                            >
                              Subject : {item.type}
                            </div>
                            <div
                              class=""
                              style={{
                                color: "#f47c20",
                                fontSize: "12px",
                                marginTop: "15px",
                                maxHeight: "4.5rem",
                                paddingRight: "100px",
                                fontWeight: "600",
                                //maxWidth: "50rem",
                                wordWrap: "break-word",
                                overflow: "hidden",
                              }}
                            >
                              Desc. : {item.enquiry}
                            </div>
                            {item.image !== null && item.image !== "" && (
                              <div style={{ marginTop: "10px" }}>
                                {item.image !== null && item.image !== "" ? (
                                  <button
                                    onClick={() => {
                                      setPreviewImagePopup(item.image);
                                      setShowImagePopup(true);
                                    }}
                                    style={{
                                      border: "none",
                                      background: "none",
                                      padding: 0,
                                    }}
                                  >
                                    <img
                                      //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                      src={`${item.image}`}
                                      style={{
                                        maxWidth: "150px",
                                        maxHeight: "150px",
                                        border: "2px solid #f47c20",
                                        borderRadius: "8px",
                                        // backgroundColor: "#f47c20",
                                      }}
                                    />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}

                            <div
                              class=""
                              style={{ marginTop: "10px" }}
                              onClick={() => {
                                setShowMore(!showMore);
                                setShowMoreID(idx);
                              }}
                            >
                              <Button
                                style={{
                                  marginLeft: "0px",
                                  marginTop: "15px",
                                  background: "#035189",
                                  border: "none",
                                  fontSize: "12px",
                                  padding: "5px 15px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  marginBottom: "10px",
                                }}
                              >
                                {" "}
                                {showMore && showMoreID === idx
                                  ? "Hide"
                                  : "Show More"}{" "}
                              </Button>
                            </div>
                            {showMore && showMoreID === idx && (
                              <>
                                {/* <div> Description: {item.enquiry}</div> */}
                                <div>
                                  {filterByEnquiryId(replyArr, item.id).map(
                                    (msg, idx) => (
                                      <>
                                        <div
                                          class="desc"
                                          style={{ maxHeight: "none" }}
                                        >
                                          <p style={{ marginBottom: "0rem" }}>
                                            {" "}
                                            {msg.admin_reply !== null ? (
                                              <span
                                                className="spanWithMargin"
                                                style={{
                                                  color: "#035189",
                                                  fontSize: "12px",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                Support :{" "}
                                                <span>{msg.admin_reply}</span>
                                              </span>
                                            ) : null}
                                            {msg.reply !== null ? (
                                              <span
                                                style={{
                                                  color: "#f47c20",
                                                  fontSize: "12px",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                You:{" "}
                                                <span
                                                  style={{
                                                    whiteSpace: "pre-wrap",
                                                  }}
                                                >
                                                  {msg.reply}
                                                </span>
                                              </span>
                                            ) : null}
                                          </p>
                                        </div>
                                      </>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          <div
                            className="datetime"
                            style={{
                              marginTop: "10px",
                              marginLeft: "60%",
                              marginRight: "0px",
                              position: "absolute",
                              top: "15px",
                              fontSize: "10px",
                            }}
                          >
                            Created at : {item.createdAt}
                            <select
                              name="plan_time"
                              style={{
                                borderRadius: "4px",
                                background:
                                  item.status === "complete"
                                    ? "green"
                                    : item.status === "progress"
                                    ? "#aaaa00" //YELLOW
                                    : item.status === "open"
                                    ? "#f47c20"
                                    : "#aa0000", // RED
                                border: "none",
                                fontSize: "12px",
                                width: "105px",
                                padding: "5px 15px",
                                color: "#fff",
                                fontWeight: "600",
                                // borderRadius: "20px",
                                marginBottom: "10px",
                              }}
                              value={item.status}
                              onChange={(e) => {
                                // setSupportMachine(e.target.value);
                                ArchiveTicket({
                                  id: item.id,
                                  status: e.target.value,
                                });
                              }}
                            >
                              <option value="complete" disabled="true">
                                Complete
                              </option>
                              <option value="progress" disabled="true">
                                inProgress
                              </option>
                              <option value="open" disabled="true">
                                Open
                              </option>
                              <option value="pending" disabled="true">
                                Pending
                              </option>
                              <option
                                value="archived"
                                disabled={item.archived === "archived"}
                              >
                                Archive
                              </option>
                              <option value="close">Close</option>
                            </select>
                          </div>
                        </div>
                      ))}
                </>
              ) : (
                <></>
              )}
              {/* Archived */}
              {ticketType === "archived" ? (
                <>
                  {enquiries &&
                    filterByStatus(enquiries, "")
                      .filter((item) => item.archived === "archived")
                      .filter(
                        (item) =>
                          item.archived === "archived" &&
                          item.enquiry_unique_id
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                      )
                      .map((item, idx) => (
                        <div className="table-row-noti" key={idx}>
                          <div className="bar"></div>
                          <div className="message">
                            {item.archived !== "archived" ? (
                              <div
                                className="archive-noti"
                                style={{
                                  top: "1px",
                                  left: "85%",
                                  position: "absolute",
                                }}
                              >
                                <button
                                  style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() => {
                                    setEnqID(item.id);
                                    ArchiveTicket();
                                  }}
                                >
                                  <img
                                    src="/images/admin/17-Notification/archive.png"
                                    title="Move to Archive"
                                  />
                                </button>
                              </div>
                            ) : null}

                            <Button
                              style={{
                                fontWeight: "600",
                                marginLeft: "0px",
                                marginTop: "5px",
                                background: "#035189",
                                border: "none",
                                fontSize: "10px",
                                padding: "5px 15px",
                                color: "#fff",
                              }}
                            >
                              Ticket No. : {item.enquiry_unique_id}
                            </Button>
                            {/* {item.vm_id !== "null" && item.vm_id !== null && (
                              <div class="desc"> Machine : {item.vm_name}</div>
                            )} */}
                            <div
                              class="desc"
                              style={{
                                fontSize: "12px",
                                marginTop: "10px",
                                color: "#035189",
                                maxHeight: "100px",
                                fontWeight: "600",
                                maxWidth: "150px",
                              }}
                            >
                              Subject : {item.type}
                            </div>
                            <div
                              class=""
                              style={{
                                color: "#f47c20",
                                fontSize: "12px",
                                marginTop: "10px",
                                maxHeight: "4.5rem",
                                paddingRight: "100px",
                                fontWeight: "600",
                                //maxWidth: "50rem",
                                wordWrap: "break-word",
                                overflow: "hidden",
                              }}
                            >
                              Desc. : {item.enquiry}
                            </div>
                            {item.image !== null && item.image !== "" && (
                              <div style={{ marginTop: "10px" }}>
                                {item.image !== null && item.image !== "" ? (
                                  <button
                                    onClick={() => {
                                      setPreviewImagePopup(item.image);
                                      setShowImagePopup(true);
                                    }}
                                    style={{
                                      border: "none",
                                      background: "none",
                                      padding: 0,
                                    }}
                                  >
                                    <img
                                      //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                      src={`${item.image}`}
                                      style={{
                                        maxWidth: "150px",
                                        maxHeight: "150px",
                                        border: "2px solid #f47c20",
                                        borderRadius: "8px",
                                        // backgroundColor: "#f47c20",
                                      }}
                                    />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}

                            <div
                              class=""
                              style={{ marginTop: "10px" }}
                              onClick={() => {
                                setShowMore(!showMore);
                                setShowMoreID(idx);
                              }}
                            >
                              <Button
                                style={{
                                  marginLeft: "0px",
                                  marginTop: "10px",
                                  background: "#035189",
                                  border: "none",
                                  fontSize: "12px",
                                  padding: "5px 15px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  marginBottom: "10px",
                                }}
                              >
                                {" "}
                                {showMore && showMoreID === idx
                                  ? "Hide"
                                  : "Show More"}{" "}
                              </Button>
                            </div>
                            {showMore && showMoreID === idx && (
                              <>
                                {/* <div> Description: {item.enquiry}</div> */}
                                <div>
                                  {filterByEnquiryId(replyArr, item.id).map(
                                    (msg, idx) => (
                                      <>
                                        <div
                                          class="desc"
                                          style={{ maxHeight: "none" }}
                                        >
                                          <p style={{ marginBottom: "0rem" }}>
                                            {" "}
                                            {msg.admin_reply !== null ? (
                                              <span
                                                className="spanWithMargin"
                                                style={{
                                                  color: "#035189",
                                                  fontSize: "12px",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                Support :{" "}
                                                <span>{msg.admin_reply}</span>
                                              </span>
                                            ) : null}
                                            {msg.reply !== null ? (
                                              <span
                                                style={{
                                                  color: "#f47c20",
                                                  fontSize: "12px",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                You:{" "}
                                                <span
                                                  style={{
                                                    whiteSpace: "pre-wrap",
                                                  }}
                                                >
                                                  {msg.reply}
                                                </span>
                                              </span>
                                            ) : null}
                                          </p>
                                        </div>
                                      </>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          <div
                            className="datetime"
                            style={{
                              marginTop: "10px",
                              marginLeft: "60%",
                              marginRight: "0px",
                              position: "absolute",
                              top: "15px",
                              fontSize: "10px",
                            }}
                          >
                            Created at : {item.createdAt}
                            <select
                              name="plan_time"
                              style={{
                                borderRadius: "4px",
                                background:
                                  item.status === "complete"
                                    ? "green"
                                    : item.status === "progress"
                                    ? "#aaaa00" //YELLOW
                                    : item.status === "open"
                                    ? "#f47c20"
                                    : "#aa0000", // RED
                                border: "none",
                                fontSize: "12px",
                                width: "105px",
                                padding: "5px 15px",
                                color: "#fff",
                                fontWeight: "600",
                                // borderRadius: "20px",
                                marginBottom: "10px",
                              }}
                              value={item.status}
                              onChange={(e) => {
                                // setSupportMachine(e.target.value);
                                ArchiveTicket({
                                  id: item.id,
                                  status: e.target.value,
                                });
                              }}
                            >
                              <option value="complete" disabled="true">
                                Complete
                              </option>
                              <option value="progress" disabled="true">
                                inProgress
                              </option>
                              <option value="open" disabled="true">
                                Open
                              </option>
                              <option value="pending" disabled="true">
                                Pending
                              </option>
                              <option
                                value="archived"
                                disabled={item.archived === "archived"}
                              >
                                Archive
                              </option>
                              <option value="close">Close</option>
                            </select>
                          </div>
                        </div>
                      ))}
                </>
              ) : (
                <>
                  {enquiries &&
                    filterByStatus(enquiries, ticketType)
                      .filter((item) =>
                        // item.archived === "archived" &&
                        item.enquiry_unique_id
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      )
                      .map((item, idx) => (
                        <div className="table-row-noti" key={idx}>
                          <div
                            className="bar"
                            style={{ margin: "0px 5px" }}
                          ></div>
                          <div className="message">
                            {item.archived !== "archived" ? (
                              <div
                                className="archive-noti"
                                style={{
                                  top: "1px",
                                  left: "85%",
                                  position: "absolute",
                                }}
                              >
                                <button
                                  style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                  }}
                                  onClick={() => {
                                    setEnqID(item.id);
                                    ArchiveTicket();
                                  }}
                                >
                                  <img
                                    src="/images/admin/17-Notification/archive.png"
                                    title="Move to Archive"
                                  />
                                </button>
                              </div>
                            ) : null}

                            <Button
                              style={{
                                fontWeight: "600",
                                marginLeft: "0px",
                                marginTop: "5px",
                                background: "#035189",
                                border: "none",
                                fontSize: "10px",
                                padding: "5px 15px",
                                color: "#fff",
                              }}
                            >
                              Ticket No. : {item.enquiry_unique_id}
                            </Button>
                            {/* {item.vm_id !== "null" && item.vm_id !== null && (
                              <div class="desc"> Machine : {item.vm_name}</div>
                            )} */}
                            <div
                              class="desc"
                              style={{
                                fontSize: "12px",
                                marginTop: "10px",
                                color: "#035189",
                                maxHeight: "100px",
                                fontWeight: "600",
                                maxWidth: "150px",
                              }}
                            >
                              Subject : {item.type}
                            </div>
                            <div
                              class=""
                              style={{
                                color: "#f47c20",
                                fontSize: "12px",
                                marginTop: "10px",
                                maxHeight: "4.5rem",
                                paddingRight: "100px",
                                fontWeight: "600",
                                //maxWidth: "50rem",
                                wordWrap: "break-word",
                                overflow: "hidden",
                              }}
                            >
                              Desc. : {item.enquiry}
                            </div>
                            {item.image !== null && item.image !== "" && (
                              <div style={{ marginTop: "10px" }}>
                                {item.image !== null && item.image !== "" ? (
                                  <button
                                    onClick={() => {
                                      setPreviewImagePopup(item.image);
                                      setShowImagePopup(true);
                                    }}
                                    style={{
                                      border: "none",
                                      background: "none",
                                      padding: 0,
                                    }}
                                  >
                                    <img
                                      //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                      src={`${item.image}`}
                                      style={{
                                        maxWidth: "150px",
                                        maxHeight: "150px",
                                        border: "2px solid #f47c20",
                                        borderRadius: "8px",
                                        // backgroundColor: "#f47c20",
                                      }}
                                    />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}

                            <div
                              class=""
                              style={{ marginTop: "10px" }}
                              onClick={() => {
                                setShowMore(!showMore);
                                setShowMoreID(idx);
                              }}
                            >
                              <Button
                                style={{
                                  marginLeft: "0px",
                                  marginTop: "10px",
                                  background: "#035189",
                                  border: "none",
                                  fontSize: "12px",
                                  padding: "5px 15px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  marginBottom: "10px",
                                }}
                              >
                                {" "}
                                {showMore && showMoreID === idx
                                  ? "Hide"
                                  : "Show More"}{" "}
                              </Button>
                            </div>
                            {showMore && showMoreID === idx && (
                              <>
                                {/* <div> Description: {item.enquiry}</div> */}
                                <div>
                                  {filterByEnquiryId(replyArr, item.id).map(
                                    (msg, idx) => (
                                      <>
                                        <div
                                          class="desc"
                                          style={{ maxHeight: "none" }}
                                        >
                                          <p style={{ marginBottom: "0rem" }}>
                                            {" "}
                                            {msg.admin_reply !== null ? (
                                              <span
                                                className="spanWithMargin"
                                                style={{
                                                  color: "#035189",
                                                  fontSize: "12px",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                Support :{" "}
                                                <span>{msg.admin_reply}</span>
                                              </span>
                                            ) : null}
                                            {msg.reply !== null ? (
                                              <span
                                                style={{
                                                  color: "#f47c20",
                                                  fontSize: "12px",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                You:{" "}
                                                <span
                                                  style={{
                                                    whiteSpace: "pre-wrap",
                                                  }}
                                                >
                                                  {msg.reply}
                                                </span>
                                              </span>
                                            ) : null}
                                          </p>
                                        </div>
                                      </>
                                    )
                                  )}

                                  <div
                                    style={{
                                      display: "flex",
                                      marginTop: "15px",
                                    }}
                                  >
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageUpdateRply}
                                      style={{
                                        display: "none",
                                        position: "absolute",

                                        marginLeft: "-5px",
                                        height: "40px",
                                        width: "40px",
                                        color: "rgb(255 0 0 / 0%)",
                                        fontSize: "0px",
                                        backgroundColor: "#ff0000",
                                      }}
                                    />
                                    {selectedImageRply && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          zIndex: "1",
                                          width: "10px",
                                          height: "10px",
                                          backgroundColor: "red",
                                          borderRadius: "50%",
                                        }}
                                      ></div>
                                    )}

                                    <Button
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        marginLeft: "0px",
                                        backgroundColor: "#f47c2000",
                                        border: "none",
                                        color: "white",
                                      }}
                                      onClick={handleButtonClick}
                                    >
                                      <img
                                        src="./filepin.png"
                                        style={{ opacity: "1" }}
                                      />
                                    </Button>

                                    <textarea
                                      placeholder="Content"
                                      style={{
                                        minHeight: "100px",
                                        maxHeight: "300px",
                                        padding: "10px",

                                        width: "50%",
                                        backgroundColor: "transparent",
                                        color: "black",
                                        borderRadius: "30px",
                                        border: "2px solid grey",
                                      }}
                                      value={supportMsg}
                                      onChange={(e) =>
                                        setSupportMsg(e.target.value)
                                      }
                                    />
                                    <Button
                                      style={{
                                        height: "40px",
                                        marginLeft: "10px",
                                        backgroundColor: "#f47c20",
                                        border: "none",
                                        color: "white",
                                        marginTop: "30px",
                                      }}
                                      onClick={() => {
                                        setEnqID(item.id);
                                        const filteredReplies =
                                          filterByEnquiryId(replyArr, item.id);
                                        const lastReplyID =
                                          filteredReplies[
                                            filteredReplies.length - 1
                                          ].id;
                                        TicketsReply(lastReplyID, item.id);
                                      }}
                                    >
                                      {" "}
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <div
                            className="datetime"
                            style={{
                              marginTop: "10px",
                              marginLeft: "60%",
                              marginRight: "0px",
                              position: "absolute",
                              top: "15px",
                              fontSize: "10px",
                            }}
                          >
                            Created at : {item.createdAt}
                            <select
                              name="plan_time"
                              style={{
                                borderRadius: "4px",
                                background:
                                  item.status === "complete"
                                    ? "green"
                                    : item.status === "progress"
                                    ? "#aaaa00" //YELLOW
                                    : item.status === "open"
                                    ? "#f47c20"
                                    : "#aa0000", // RED
                                border: "none",
                                fontSize: "12px",
                                width: "100px",
                                padding: "5px 15px",
                                color: "#fff",
                                fontWeight: "600",
                                // borderRadius: "20px",
                                marginBottom: "10px",
                              }}
                              value={item.status}
                              onChange={(e) => {
                                // setSupportMachine(e.target.value);
                                ArchiveTicket({
                                  id: item.id,
                                  status: e.target.value,
                                });
                              }}
                            >
                              <option value="complete" disabled="true">
                                Complete
                              </option>
                              <option value="progress" disabled="true">
                                inProgress
                              </option>
                              <option value="open" disabled="true">
                                Open
                              </option>
                              <option value="pending" disabled="true">
                                Pending
                              </option>
                              <option
                                value="archived"
                                disabled={item.archived === "archived"}
                              >
                                Archive
                              </option>
                              <option value="close">Close</option>
                            </select>
                          </div>
                        </div>
                      ))}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        // WEBVIEW

        <div
          className="features-page-solution"
          style={{ height: "100%", padding: "5rem" }}
        >
          <div className="heading-dotted-support">
            Support <span></span>
          </div>
          <div className="features-section-solution">
            <Row>
              <div className="col-md-1"></div>
              <div className="col-md-10">
                {showSupport ? (
                  <div>
                    <div
                      className="buttons-container"
                      style={{
                        marginLeft: "-5px",
                        marginBottom: "-15px",
                      }}
                    >
                      {innerButtons.map((title, idx) => (
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
                            borderRadius: "20px",
                            marginBottom: "10px",
                          }}
                          onClick={() => setActiveButton(title)}
                        >
                          {title}
                        </Button>
                      ))}
                    </div>
                    <div
                      className="register-main see-full"
                      style={{ marginTop: "2rem" }}
                    >
                      <div className="bg-img">
                        <img src="/images/blue-box-bg.svg" alt="" />
                        <img src="/images/blue-box-bg.svg" alt="" />
                      </div>
                      <form className="see-full">
                        <input
                          type="hidden"
                          name="_token"
                          value="IHks1cEdGGmsvouWsdVeWVHE29KFoaLV0iN8cPkE"
                        />

                        <div className="form-top">
                          <h4 className="text-white">Send us your question</h4>
                          <p
                            style={{
                              color: "white",
                              marginTop: "15px",
                              fontSize: "16px",
                              lineHeight: "150%",
                            }}
                          >
                            To help us resolve your Server related problem
                            quickly, We might Require Temporary access
                            credentials (root/admin) to your server. Please
                            provide us with a detailed specification of what the
                            issue is.
                          </p>

                          {machineData.length > 0 ? (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  flexWrap: "wrap",
                                  marginTop: "40px",
                                }}
                              >
                                {machineData &&
                                  machineData.map((item, idx) => (
                                    <>
                                      {(item.public_ip || item.ip_address) && (
                                        <div
                                          style={{
                                            backgroundColor: "#f47c20",
                                            border: "none",
                                            borderRadius: "20px",
                                            paddingLeft: "10px",
                                            paddingBottom: "10px",
                                            width: "max-content",
                                          }}
                                          onClick={() =>
                                            handleSupportMachineClick(
                                              item.vm_id
                                            )
                                          }
                                        >
                                          <label
                                            className="radio-label"
                                            style={{ marginTop: "8px" }}
                                          >
                                            <input
                                              type="radio"
                                              value={item.vm_id}
                                              checked={supportMachineArr.includes(
                                                item.vm_id
                                              )}
                                              onChange={handleOptionVM}
                                              className="radio-input"
                                              style={{
                                                marginBottom: "-3px",
                                                backgroundColor: "white",
                                              }}
                                            />
                                            {item.vm_name}
                                          </label>
                                        </div>
                                      )}
                                    </>
                                  ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <p
                                style={{
                                  borderRadius: "5px",
                                  paddingRight: "5px",
                                  paddingLeft: "5px",

                                  height: "25px",

                                  backgroundColor: "#f47c20",

                                  position: "absolute",
                                  color: "white",
                                  marginTop: "-0.5%",
                                }}
                              >
                                No Machines
                              </p>
                            </>
                          )}

                          {activeButton === "Sales" ||
                          activeButton === "Billing Query" ||
                          activeButton === "Other" ? (
                            <p
                              style={{
                                position: "absolute",
                                color: "white",
                                top: machineData.length > 0 ? "28%" : "20%",
                              }}
                            >
                              (Optional)
                            </p>
                          ) : null}
                          <div
                            className="input-container"
                            style={{ marginTop: "65px" }}
                          >
                            <textarea
                              placeholder="Content"
                              style={{
                                minHeight: "200px",
                                maxHeight: "500px",
                                padding: "10px",
                                height: "157px",
                                width: "100%",
                                backgroundColor: "transparent",
                                color: "white",
                                borderRadius: "30px",
                                border: "none",
                              }}
                              value={supportMsg}
                              onChange={(e) => setSupportMsg(e.target.value)}
                            ></textarea>
                          </div>
                          {/* FILES */}
                          <div
                            style={{
                              width: selectedImage !== null ? "25rem" : "15rem",
                              marginTop: "15px",
                              display: "flex",
                              alignItems: "center",
                              // border: "2px solid white",
                              // borderRadius: "25px",
                              padding: "5px",
                              alignContent: "center",
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{
                                marginTop: "10px",
                                marginLeft: "30px",
                                height: "45px",
                                color:
                                  selectedImage !== null
                                    ? "white"
                                    : "#80808000", //"grey",
                                fontSize: "21px",
                              }}
                            />
                            {/* </Button> */}
                          </div>

                          <label
                            style={{
                              position: "absolute",
                              transform: "translateY(-50%)",
                              fontSize: "18px",
                              fontStyle: "italic",
                              color: "white",
                              fontWeight: "500",
                              marginTop: "1rem",
                            }}
                          >
                            Note : Please upload .png .jpeg .jpg images only.
                          </label>
                        </div>
                        <div style={{ display: "flex", marginTop: "40px" }}>
                          <div
                            className="log-in"
                            onClick={() => UpdateSupport()}
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
                                  src="/images/more-info-btn-bg.svg"
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

                                    marginTop: "0px",
                                    fontWeight: "600",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.target.style.color = "#07528B")
                                  } // Change color on hover
                                  onMouseOut={(e) =>
                                    (e.target.style.color = "white")
                                  }
                                >
                                  Submit
                                </span>
                              </div>
                            </a>
                          </div>
                          <div
                            className="log-in"
                            onClick={() => setShowSupport(false)}
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
                                    fontWeight: "600",
                                  }}
                                >
                                  Cancel
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: "absolute" }}>
                    <Button
                      style={{
                        background: "#035189",
                        border: "none",
                        fontSize: "20px",
                        padding: "5px 15px",
                        color: "#fff",
                        fontWeight: "600",
                        // borderRadius: "20px",
                        marginBottom: "10px",
                      }}
                      onClick={() => setShowSupport(true)}
                    >
                      Create Ticket
                    </Button>
                  </div>
                )}

                {/* enquiries */}
                <div style={{}}>
                  {enquiries && (
                    <>
                      <div
                        className="heading-dotted-support"
                        style={{
                          marginLeft: "-27px",
                          marginTop: showSupport ? "" : "5rem",
                        }}
                      >
                        tickets{" "}
                      </div>
                      {enquiries.length > 0 && (
                        <div
                          className="buttons-container"
                          style={{
                            display: "flex",
                            marginTop: "15px",
                            marginLeft: "-5px",
                            marginBottom: "-15px",
                          }}
                        >
                          <Button
                            style={{
                              background: "#035189",
                              border: "none",
                              fontSize: "20px",
                              padding: "5px 15px",
                              color: "#fff",
                              fontWeight: "600",
                              // borderRadius: "20px",
                              marginBottom: "10px",
                            }}
                          >
                            Latest
                          </Button>
                          <div
                            className="input-container"
                            style={{
                              border: "2px solid #035189",
                              width: "10rem",
                              marginTop: "0px",
                              height: "45px",
                            }}
                          >
                            <input
                              type="text"
                              name="search"
                              className="input-signup input-tickets"
                              placeholder="Search"
                              value={searchText}
                              style={{
                                color: "black",
                                textAlign: "center",
                                width: "10px",
                              }}
                              onChange={(e) => setSearchText(e.target.value)}
                            />
                            {searchText && (
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                }}
                                onClick={() => setSearchText("")}
                              >
                                <FaX
                                  style={{
                                    marginBottom: "2px",
                                    color: "#154e7a",
                                    display: "inline-block",
                                    fontSize: "19px",
                                  }}
                                />
                              </button>
                            )}
                          </div>

                          <div style={{ marginLeft: "auto" }}>
                            {ticketButtons.map((title, idx) => (
                              // console.log(idx, "idx=="),
                              <Button
                                key={idx}
                                style={{
                                  background: `${
                                    idx === 1 && ticketType === "inProgress"
                                      ? "#f47c20"
                                      : ticketType === title
                                      ? "#f47c20"
                                      : "#035189"
                                  }`,
                                  border: "none",
                                  fontSize: "14px",
                                  padding: "5px 15px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  borderRadius: "20px",
                                  marginBottom: "10px",
                                }}
                                onClick={() => setTicketType(title)}
                              >
                                {idx == 0
                                  ? "Open"
                                  : idx == 1
                                  ? "inProgress"
                                  : idx == 2
                                  ? "Closed"
                                  : idx == 3
                                  ? "Archive"
                                  : idx == 4
                                  ? "All"
                                  : ""}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div
                        // className="notification-cont"
                        style={{ marginTop: "30px" }}
                      >
                        {console.log("enquiries==", enquiries)}

                        {/* inProgress */}
                        {ticketType === "progress" ||
                        ticketType === "inProgress" ? (
                          <>
                            {enquiries &&
                              filterByStatus(enquiries, "")
                                .filter(
                                  (item) =>
                                    item.status === "progress" &&
                                    item.enquiry_unique_id
                                      .toLowerCase()
                                      .includes(searchText.toLowerCase())
                                )
                                .map((item, idx) => (
                                  <div className="table-row-noti" key={idx}>
                                    <div className="bar"></div>
                                    <div className="message">
                                      <Button
                                        style={{
                                          marginLeft: "0px",
                                          marginTop: "5px",
                                          background: "#035189",
                                          border: "none",
                                          fontSize: "20px",
                                          padding: "5px 15px",
                                          color: "#fff",
                                          fontWeight: "600",
                                          // width: "17%",
                                        }}
                                      >
                                        Ticket No. : {item.enquiry_unique_id}
                                      </Button>
                                      {/* {item.vm_id !== "null" &&
                                        item.vm_id !== null && (
                                          <div class="desc">
                                            Machine : {item.vm_name}
                                          </div>
                                        )} */}
                                      <div
                                        class="desc"
                                        style={{
                                          fontSize: "24px",
                                          marginTop: "20px",
                                          color: "#035189",
                                          maxHeight: "100px",
                                          fontWeight: "600",
                                          maxWidth: "100rem",
                                        }}
                                      >
                                        Subject : {item.type}
                                      </div>
                                      <div
                                        class="desc"
                                        style={{
                                          fontSize: "24px",
                                          marginTop: "15px",
                                          color: "#f47c20",
                                          maxHeight: "100px",
                                          fontWeight: "600",
                                          maxWidth: "100rem",
                                        }}
                                      >
                                        Desc. : {item.enquiry}
                                      </div>
                                      {item.image !== null &&
                                        item.image !== "" && (
                                          <div style={{ marginTop: "10px" }}>
                                            {item.image !== null &&
                                            item.image !== "" ? (
                                              <button
                                                onClick={() => {
                                                  setPreviewImagePopup(
                                                    item.image
                                                  );
                                                  setShowImagePopup(true);
                                                }}
                                                style={{
                                                  border: "none",
                                                  background: "none",
                                                  padding: 0,
                                                }}
                                              >
                                                <img
                                                  //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                                  src={`${item.image}`}
                                                  style={{
                                                    maxWidth: "40rem",
                                                    maxHeight: "30rem",
                                                    border: "2px solid #f47c20",
                                                    borderRadius: "8px",
                                                    // backgroundColor: "#f47c20",
                                                  }}
                                                />
                                              </button>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        )}

                                      <div
                                        class=""
                                        style={{ fontSize: "24px" }}
                                        onClick={() => {
                                          setShowMore(!showMore);
                                          setShowMoreID(idx);
                                        }}
                                      >
                                        <Button
                                          style={{
                                            marginLeft: "0px",
                                            marginTop: "20px",
                                            background: "#035189",
                                            border: "none",
                                            fontSize: "20px",
                                            padding: "5px 15px",
                                            color: "#fff",
                                            fontWeight: "600",
                                            marginBottom: "10px",
                                          }}
                                        >
                                          {" "}
                                          {showMore && showMoreID === idx
                                            ? "Hide"
                                            : "Show More"}{" "}
                                        </Button>
                                      </div>
                                      {showMore && showMoreID === idx && (
                                        <>
                                          {/* <div> Description: {item.enquiry}</div> */}
                                          <div
                                            className="you-title"
                                            style={{
                                              fontSize: "24px",
                                              marginBottom: "20px",
                                            }}
                                          >
                                            {filterByEnquiryId(
                                              replyArr,
                                              item.id
                                            ).map((msg, idx) => (
                                              <>
                                                <div
                                                  //class="desc"
                                                  style={{ maxHeight: "none" }}
                                                >
                                                  <p
                                                    style={{
                                                      //marginBottom: "0rem",
                                                      marginTop: "10px",
                                                      marginRight: "200px",
                                                    }}
                                                  >
                                                    {" "}
                                                    {msg.reply !== null ? (
                                                      <div
                                                        className="row"
                                                        style={{
                                                          color: "#f47c20",
                                                          fontWeight: "600",
                                                          width: "126%",
                                                          marginBottom: "20px",
                                                        }}
                                                      >
                                                        <div
                                                          className="col-md-9"
                                                          style={{
                                                            wordBreak:
                                                              "break-word",
                                                            maxWidth: "100%",
                                                            // whiteSpace:
                                                            //   "pre-wrap",
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              width: "4rem",
                                                            }}
                                                          >
                                                            You:
                                                          </span>

                                                          <span
                                                            style={{
                                                              maxWidth: "80ch",
                                                              // display: "flex",
                                                              marginLeft:
                                                                "10px",
                                                              whiteSpace:
                                                                "pre-wrap",
                                                            }}
                                                          >
                                                            {msg.reply}
                                                          </span>
                                                        </div>
                                                        <div className="col-md-3">
                                                          <span
                                                            className="datetime"
                                                            style={{
                                                              //display: "flex",
                                                              // position:"absolute",
                                                              // marginLeft: "20%",
                                                              // marginRight: "0px",
                                                              fontSize: "14px",
                                                              // fontWeight: "300px",
                                                              color: "#898989",
                                                              marginLeft: "20%",
                                                            }}
                                                          >
                                                            Created at :
                                                            {msg.created_at}
                                                            {/* {
                                                              <DateTimeSplit
                                                                datetime={
                                                                  msg.created_at
                                                                }
                                                              />
                                                            } */}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    ) : null}
                                                    {msg.admin_reply !==
                                                    null ? (
                                                      <span
                                                        className="spanWithMargin"
                                                        style={{
                                                          color: "#035189",
                                                          //marginBottom: "10px",
                                                          fontWeight: "600",
                                                        }}
                                                      >
                                                        Support :{" "}
                                                        <span
                                                        // style={{
                                                        //   color: "black",
                                                        //   fontWeight: "300",
                                                        //   fontSize: "13px",
                                                        // }}
                                                        >
                                                          {msg.admin_reply}
                                                        </span>
                                                      </span>
                                                    ) : null}
                                                  </p>
                                                  {msg.image !== null &&
                                                  msg.image !== "" ? (
                                                    <img
                                                      //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                                      src={`${msg.image}`}
                                                      style={{
                                                        maxWidth: "40rem",
                                                        maxHeight: "30rem",
                                                        border:
                                                          "2px solid #f47c20",
                                                        borderRadius: "8px",
                                                      }}
                                                    />
                                                  ) : null}
                                                </div>
                                              </>
                                            ))}
                                            <div
                                              style={{
                                                display: "flex",
                                                marginTop: "15px",
                                              }}
                                            >
                                              <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpdateRply}
                                                style={{
                                                  display: "none",
                                                  position: "absolute",
                                                  zIndex: "1",

                                                  marginLeft: "-5px",
                                                  height: "40px",
                                                  width: "40px",
                                                  color: "rgb(255 0 0 / 0%)",
                                                  fontSize: "0px",
                                                  backgroundColor: "#ff0000",
                                                }}
                                              />
                                              {selectedImageRply && (
                                                <div
                                                  style={{
                                                    position: "absolute",
                                                    zIndex: "1",
                                                    width: "10px",
                                                    height: "10px",
                                                    backgroundColor: "red",
                                                    borderRadius: "50%",
                                                  }}
                                                ></div>
                                              )}
                                              <Button
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                  marginLeft: "0px",
                                                  backgroundColor: "#f47c2000",
                                                  border: "none",
                                                  color: "white",
                                                }}
                                                onClick={handleButtonClick}
                                              >
                                                <img
                                                  src="./filepin.png"
                                                  style={{ opacity: "1" }}
                                                />
                                              </Button>

                                              <textarea
                                                placeholder="Content"
                                                style={{
                                                  minHeight: "100px",
                                                  maxHeight: "300px",
                                                  padding: "10px",
                                                  width: "100%",
                                                  backgroundColor:
                                                    "transparent",
                                                  color: "black",
                                                  borderRadius: "30px",
                                                  border: "2px solid grey",
                                                }}
                                                value={replyText}
                                                onChange={(e) =>
                                                  setReplyText(e.target.value)
                                                }
                                              />
                                              <Button
                                                style={{
                                                  height: "40px",
                                                  marginLeft: "10px",
                                                  marginTop: "30px",
                                                  backgroundColor: "#f47c20",
                                                  border: "none",
                                                  color: "white",
                                                }}
                                                onClick={() => {
                                                  setEnqID(item.id);

                                                  const filteredReplies =
                                                    filterByEnquiryId(
                                                      replyArr,
                                                      item.id
                                                    );
                                                  const lastReplyID =
                                                    filteredReplies[
                                                      filteredReplies.length - 1
                                                    ].id;
                                                  TicketsReply(
                                                    lastReplyID,
                                                    item.id
                                                  );
                                                }}
                                              >
                                                {" "}
                                                Reply
                                              </Button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <div
                                      className="datetime"
                                      style={{
                                        // display: "flex",
                                        marginLeft: "80%",
                                        marginRight: "0px",
                                        position: "absolute",
                                        top: "15px",
                                      }}
                                    >
                                      Created at : {item.createdAt}
                                      <select
                                        name="plan_time"
                                        style={{
                                          borderRadius: "4px",
                                          background:
                                            item.status === "completed"
                                              ? "green"
                                              : item.status === "progress"
                                              ? "#aaaa00" //YELLOW
                                              : item.status === "open"
                                              ? "#f47c20"
                                              : "#aa0000", // RED
                                          border: "none",
                                          fontSize: "18px",
                                          padding: "5px 15px",
                                          color: "#fff",
                                          fontWeight: "600",
                                          // borderRadius: "20px",
                                          marginBottom: "10px",
                                        }}
                                        value={item.status}
                                        onChange={(e) => {
                                          // setSupportMachine(e.target.value);
                                          ArchiveTicket({
                                            id: item.id,
                                            status: e.target.value,
                                          });
                                        }}
                                      >
                                        <option
                                          value="completed"
                                          disabled="true"
                                        >
                                          Complete
                                        </option>
                                        <option
                                          value="progress"
                                          disabled="true"
                                        >
                                          inProgress
                                        </option>
                                        <option value="open" disabled="true">
                                          Open
                                        </option>
                                        <option value="pending" disabled="true">
                                          Pending
                                        </option>
                                        <option
                                          value="archived"
                                          disabled={
                                            item.archived === "archived"
                                          }
                                        >
                                          Archive
                                        </option>
                                        <option value="close">Close</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}
                            {filterByStatus(enquiries, "").filter(
                              (item) =>
                                item.status === "progress" &&
                                item.enquiry_unique_id
                                  .toLowerCase()
                                  .includes(searchText.toLowerCase())
                            ).length === 0 ? (
                              <div
                                style={{
                                  position: "relative",
                                  left: "40%",
                                  marginTop: "15px",
                                  fontSize: "24px",
                                  fontWeight: "400",
                                }}
                              >
                                No Records
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          <></>
                        )}

                        {/* Complete */}
                        {ticketType === "complete" ? (
                          <>
                            {enquiries &&
                              filterByStatus(enquiries, "")
                                .filter(
                                  (item) =>
                                    item.status === "completed" &&
                                    item.enquiry_unique_id
                                      .toLowerCase()
                                      .includes(searchText.toLowerCase())
                                )
                                .map((item, idx) => (
                                  <div className="table-row-noti" key={idx}>
                                    <div className="bar"></div>
                                    <div className="message">
                                      <Button
                                        style={{
                                          marginLeft: "0px",
                                          marginTop: "5px",
                                          background: "#035189",
                                          border: "none",
                                          fontSize: "20px",
                                          padding: "5px 15px",
                                          color: "#fff",
                                          fontWeight: "600",
                                          // width: "17%",
                                        }}
                                      >
                                        Ticket No. : {item.enquiry_unique_id}
                                      </Button>
                                      {/* {item.vm_id !== "null" &&
                                        item.vm_id !== null && (
                                          <div class="desc">
                                            Machine : {item.vm_name}
                                          </div>
                                        )} */}
                                      <div
                                        class="desc"
                                        style={{
                                          fontSize: "24px",
                                          marginTop: "20px",
                                          color: "#035189",
                                          maxHeight: "100px",
                                          fontWeight: "600",
                                          maxWidth: "100rem",
                                        }}
                                      >
                                        Subject : {item.type}
                                      </div>
                                      <div
                                        class="desc"
                                        style={{
                                          fontSize: "24px",
                                          marginTop: "15px",
                                          color: "#f47c20",
                                          maxHeight: "100px",
                                          fontWeight: "600",
                                          maxWidth: "100rem",
                                        }}
                                      >
                                        Desc. : {item.enquiry}
                                      </div>
                                      {item.image !== null &&
                                        item.image !== "" && (
                                          <div style={{ marginTop: "10px" }}>
                                            {item.image !== null &&
                                            item.image !== "" ? (
                                              <button
                                                onClick={() => {
                                                  setPreviewImagePopup(
                                                    item.image
                                                  );
                                                  setShowImagePopup(true);
                                                }}
                                                style={{
                                                  border: "none",
                                                  background: "none",
                                                  padding: 0,
                                                }}
                                              >
                                                <img
                                                  //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                                  src={`${item.image}`}
                                                  style={{
                                                    maxWidth: "40rem",
                                                    maxHeight: "30rem",
                                                    border: "2px solid #f47c20",
                                                    borderRadius: "8px",
                                                    // backgroundColor: "#f47c20",
                                                  }}
                                                />
                                              </button>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        )}

                                      <div
                                        class=""
                                        style={{ fontSize: "24px" }}
                                        onClick={() => {
                                          setShowMore(!showMore);
                                          setShowMoreID(idx);
                                        }}
                                      >
                                        <Button
                                          style={{
                                            marginLeft: "0px",
                                            marginTop: "20px",
                                            background: "#035189",
                                            border: "none",
                                            fontSize: "20px",
                                            padding: "5px 15px",
                                            color: "#fff",
                                            fontWeight: "600",
                                            marginBottom: "10px",
                                          }}
                                        >
                                          {" "}
                                          {showMore && showMoreID === idx
                                            ? "Hide"
                                            : "Show More"}{" "}
                                        </Button>
                                      </div>
                                      {showMore && showMoreID === idx && (
                                        <>
                                          {/* <div> Description: {item.enquiry}</div> */}
                                          <div
                                            className="you-title"
                                            style={{
                                              fontSize: "24px",
                                              marginBottom: "20px",
                                            }}
                                          >
                                            {filterByEnquiryId(
                                              replyArr,
                                              item.id
                                            ).map((msg, idx) => (
                                              <>
                                                <div
                                                  //class="desc"
                                                  style={{ maxHeight: "none" }}
                                                >
                                                  <p
                                                    style={{
                                                      //marginBottom: "0rem",
                                                      marginTop: "10px",
                                                      marginRight: "200px",
                                                    }}
                                                  >
                                                    {" "}
                                                    {msg.reply !== null ? (
                                                      <div
                                                        className="row"
                                                        style={{
                                                          color: "#f47c20",
                                                          fontWeight: "600",
                                                          width: "126%",
                                                          marginBottom: "20px",
                                                        }}
                                                      >
                                                        <div
                                                          className="col-md-9"
                                                          style={{
                                                            wordBreak:
                                                              "break-word",
                                                            maxWidth: "100%",
                                                            // whiteSpace:
                                                            //   "pre-wrap",
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              width: "4rem",
                                                            }}
                                                          >
                                                            You:
                                                          </span>

                                                          <span
                                                            style={{
                                                              maxWidth: "80ch",
                                                              // display: "flex",
                                                              marginLeft:
                                                                "10px",
                                                              whiteSpace:
                                                                "pre-wrap",
                                                            }}
                                                          >
                                                            {msg.reply}
                                                          </span>
                                                        </div>
                                                        <div className="col-md-3">
                                                          <span
                                                            className="datetime"
                                                            style={{
                                                              //display: "flex",
                                                              // position:"absolute",
                                                              // marginLeft: "20%",
                                                              // marginRight: "0px",
                                                              fontSize: "14px",
                                                              // fontWeight: "300px",
                                                              color: "#898989",
                                                              marginLeft: "20%",
                                                            }}
                                                          >
                                                            Created at :
                                                            {msg.created_at}
                                                            {/* {
                                                              <DateTimeSplit
                                                                datetime={
                                                                  msg.created_at
                                                                }
                                                              />
                                                            } */}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    ) : null}
                                                    {msg.admin_reply !==
                                                    null ? (
                                                      <span
                                                        className="spanWithMargin"
                                                        style={{
                                                          color: "#035189",
                                                          //marginBottom: "10px",
                                                          fontWeight: "600",
                                                        }}
                                                      >
                                                        Support :{" "}
                                                        <span
                                                        // style={{
                                                        //   color: "black",
                                                        //   fontWeight: "300",
                                                        //   fontSize: "13px",
                                                        // }}
                                                        >
                                                          {msg.admin_reply}
                                                        </span>
                                                      </span>
                                                    ) : null}
                                                  </p>
                                                  {msg.image !== null &&
                                                  msg.image !== "" ? (
                                                    <img
                                                      //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                                      src={`${msg.image}`}
                                                      style={{
                                                        maxWidth: "40rem",
                                                        maxHeight: "30rem",
                                                        border:
                                                          "2px solid #f47c20",
                                                        borderRadius: "8px",
                                                      }}
                                                    />
                                                  ) : null}
                                                </div>
                                              </>
                                            ))}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <div
                                      className="datetime"
                                      style={{
                                        // display: "flex",
                                        marginLeft: "80%",
                                        marginRight: "0px",
                                        position: "absolute",
                                        top: "15px",
                                      }}
                                    >
                                      Created at : {item.createdAt}
                                      <select
                                        name="plan_time"
                                        style={{
                                          borderRadius: "4px",
                                          background:
                                            item.status === "completed"
                                              ? "green"
                                              : item.status === "progress"
                                              ? "#aaaa00" //YELLOW
                                              : item.status === "open"
                                              ? "#f47c20"
                                              : "#aa0000", // RED
                                          border: "none",
                                          fontSize: "18px",
                                          padding: "5px 15px",
                                          color: "#fff",
                                          fontWeight: "600",
                                          // borderRadius: "20px",
                                          marginBottom: "10px",
                                        }}
                                        value={item.status}
                                        onChange={(e) => {
                                          // setSupportMachine(e.target.value);
                                          ArchiveTicket({
                                            id: item.id,
                                            status: e.target.value,
                                          });
                                        }}
                                      >
                                        <option
                                          value="completed"
                                          disabled="true"
                                        >
                                          Complete
                                        </option>
                                        <option
                                          value="progress"
                                          disabled="true"
                                        >
                                          inProgress
                                        </option>
                                        <option value="open" disabled="true">
                                          Open
                                        </option>
                                        <option value="pending" disabled="true">
                                          Pending
                                        </option>
                                        <option
                                          value="archived"
                                          disabled={
                                            item.archived === "archived"
                                          }
                                        >
                                          Archive
                                        </option>
                                        <option value="close">Close</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}

                            {filterByStatus(enquiries, "").filter(
                              (item) =>
                                item.status === "completed" &&
                                item.enquiry_unique_id
                                  .toLowerCase()
                                  .includes(searchText.toLowerCase())
                            ).length === 0 ? (
                              <div
                                style={{
                                  position: "relative",
                                  left: "40%",
                                  marginTop: "15px",
                                  fontSize: "24px",
                                  fontWeight: "400",
                                }}
                              >
                                No Records
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          <></>
                        )}

                        {/* Archived */}

                        {ticketType === "archived" ? (
                          <>
                            {enquiries &&
                              filterByStatus(enquiries, "")
                                .filter(
                                  (item) =>
                                    item.status === "archived" &&
                                    item.enquiry_unique_id
                                      .toLowerCase()
                                      .includes(searchText.toLowerCase())
                                )
                                .map((item, idx) => (
                                  <div className="table-row-noti" key={idx}>
                                    <div className="bar"></div>
                                    <div className="message">
                                      <Button
                                        style={{
                                          marginLeft: "0px",
                                          marginTop: "5px",
                                          background: "#035189",
                                          border: "none",
                                          fontSize: "20px",
                                          padding: "5px 15px",
                                          color: "#fff",
                                          fontWeight: "600",
                                          // width: "17%",
                                        }}
                                      >
                                        Ticket No. : {item.enquiry_unique_id}
                                      </Button>
                                      {/* {item.vm_id !== "null" &&
                                        item.vm_id !== null && (
                                          <div class="desc">
                                            Machine : {item.vm_name}
                                          </div>
                                        )} */}
                                      <div
                                        class="desc"
                                        style={{
                                          fontSize: "24px",
                                          marginTop: "20px",
                                          color: "#035189",
                                          maxHeight: "100px",
                                          fontWeight: "600",
                                          maxWidth: "100rem",
                                        }}
                                      >
                                        Subject : {item.type}
                                      </div>
                                      <div
                                        class="desc"
                                        style={{
                                          fontSize: "24px",
                                          marginTop: "15px",
                                          color: "#f47c20",
                                          maxHeight: "100px",
                                          fontWeight: "600",
                                          maxWidth: "100rem",
                                        }}
                                      >
                                        Desc. : {item.enquiry}
                                      </div>
                                      {item.image !== null &&
                                        item.image !== "" && (
                                          <div style={{ marginTop: "10px" }}>
                                            {item.image !== null &&
                                            item.image !== "" ? (
                                              <button
                                                onClick={() => {
                                                  setPreviewImagePopup(
                                                    item.image
                                                  );
                                                  setShowImagePopup(true);
                                                }}
                                                style={{
                                                  border: "none",
                                                  background: "none",
                                                  padding: 0,
                                                }}
                                              >
                                                <img
                                                  //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                                  src={`${item.image}`}
                                                  style={{
                                                    maxWidth: "40rem",
                                                    maxHeight: "30rem",
                                                    border: "2px solid #f47c20",
                                                    borderRadius: "8px",
                                                    // backgroundColor: "#f47c20",
                                                  }}
                                                />
                                              </button>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        )}

                                      <div
                                        class=""
                                        style={{ fontSize: "24px" }}
                                        onClick={() => {
                                          setShowMore(!showMore);
                                          setShowMoreID(idx);
                                        }}
                                      >
                                        <Button
                                          style={{
                                            marginLeft: "0px",
                                            marginTop: "20px",
                                            background: "#035189",
                                            border: "none",
                                            fontSize: "20px",
                                            padding: "5px 15px",
                                            color: "#fff",
                                            fontWeight: "600",
                                            // width: "17%",
                                            marginBottom: "10px",
                                          }}
                                        >
                                          {" "}
                                          {showMore && showMoreID === idx
                                            ? "Hide"
                                            : "Show More"}{" "}
                                        </Button>
                                      </div>
                                      {showMore && showMoreID === idx && (
                                        <>
                                          {/* <div> Description: {item.enquiry}</div> */}
                                          <div
                                            className="you-title"
                                            style={{
                                              fontSize: "24px",
                                              marginBottom: "20px",
                                            }}
                                          >
                                            {filterByEnquiryId(
                                              replyArr,
                                              item.id
                                            ).map((msg, idx) => (
                                              <>
                                                <div
                                                  //class="desc"
                                                  style={{ maxHeight: "none" }}
                                                >
                                                  <p
                                                    style={{
                                                      //marginBottom: "0rem",
                                                      marginTop: "10px",
                                                      marginRight: "200px",
                                                    }}
                                                  >
                                                    {" "}
                                                    {msg.reply !== null ? (
                                                      <div
                                                        className="row"
                                                        style={{
                                                          color: "#f47c20",
                                                          fontWeight: "600",
                                                          width: "126%",
                                                          marginBottom: "20px",
                                                        }}
                                                      >
                                                        <div
                                                          className="col-md-9"
                                                          style={{
                                                            wordBreak:
                                                              "break-word",
                                                            maxWidth: "100%",
                                                            // whiteSpace:
                                                            //   "pre-wrap",
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              width: "4rem",
                                                            }}
                                                          >
                                                            You:
                                                          </span>

                                                          <span
                                                            style={{
                                                              maxWidth: "80ch",
                                                              // display: "flex",
                                                              marginLeft:
                                                                "10px",
                                                              whiteSpace:
                                                                "pre-wrap",
                                                            }}
                                                          >
                                                            {msg.reply}
                                                          </span>
                                                        </div>
                                                        <div className="col-md-3">
                                                          <span
                                                            className="datetime"
                                                            style={{
                                                              //display: "flex",
                                                              // position:"absolute",
                                                              // marginLeft: "20%",
                                                              // marginRight: "0px",
                                                              fontSize: "14px",
                                                              // fontWeight: "300px",
                                                              color: "#898989",
                                                              marginLeft: "20%",
                                                            }}
                                                          >
                                                            Created at :
                                                            {msg.created_at}
                                                            {/* {
                                                              <DateTimeSplit
                                                                datetime={
                                                                  msg.created_at
                                                                }
                                                              />
                                                            } */}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    ) : null}
                                                    {msg.admin_reply !==
                                                    null ? (
                                                      <span
                                                        className="spanWithMargin"
                                                        style={{
                                                          color: "#035189",
                                                          //marginBottom: "10px",
                                                          fontWeight: "600",
                                                        }}
                                                      >
                                                        Support :{" "}
                                                        <span
                                                        // style={{
                                                        //   color: "black",
                                                        //   fontWeight: "300",
                                                        //   fontSize: "13px",
                                                        // }}
                                                        >
                                                          {msg.admin_reply}
                                                        </span>
                                                      </span>
                                                    ) : null}
                                                  </p>
                                                  {msg.image !== null &&
                                                  msg.image !== "" ? (
                                                    <img
                                                      //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                                      src={`${msg.image}`}
                                                      style={{
                                                        maxWidth: "40rem",
                                                        maxHeight: "30rem",
                                                        border:
                                                          "2px solid #f47c20",
                                                        borderRadius: "8px",
                                                      }}
                                                    />
                                                  ) : null}
                                                </div>
                                              </>
                                            ))}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <div
                                      className="datetime"
                                      style={{
                                        // display: "flex",
                                        marginLeft: "80%",
                                        marginRight: "0px",
                                        position: "absolute",
                                        top: "15px",
                                      }}
                                    >
                                      Created at : {item.createdAt}
                                      <select
                                        name="plan_time"
                                        style={{
                                          borderRadius: "4px",
                                          background:
                                            item.status === "completed"
                                              ? "green"
                                              : item.status === "progress"
                                              ? "#aaaa00" //YELLOW
                                              : item.status === "open"
                                              ? "#f47c20"
                                              : "#aa0000", // RED
                                          border: "none",
                                          fontSize: "18px",
                                          padding: "5px 15px",
                                          color: "#fff",
                                          fontWeight: "600",
                                          // borderRadius: "20px",
                                          marginBottom: "10px",
                                        }}
                                        value={item.status}
                                        onChange={(e) => {
                                          // setSupportMachine(e.target.value);
                                          ArchiveTicket({
                                            id: item.id,
                                            status: e.target.value,
                                          });
                                        }}
                                      >
                                        <option
                                          value="completed"
                                          disabled="true"
                                        >
                                          Complete
                                        </option>
                                        <option
                                          value="progress"
                                          disabled="true"
                                        >
                                          inProgress
                                        </option>
                                        <option value="open" disabled="true">
                                          Open
                                        </option>
                                        <option value="pending" disabled="true">
                                          Pending
                                        </option>
                                        <option
                                          value="archived"
                                          disabled={
                                            item.archived === "archived"
                                          }
                                        >
                                          Archive
                                        </option>
                                        <option value="close">Close</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}
                            {filterByStatus(enquiries, "").filter(
                              (item) =>
                                item.status === "archived" &&
                                item.enquiry_unique_id
                                  .toLowerCase()
                                  .includes(searchText.toLowerCase())
                            ).length === 0 ? (
                              <div
                                style={{
                                  position: "relative",
                                  left: "40%",
                                  marginTop: "15px",
                                  fontSize: "24px",
                                  fontWeight: "400",
                                }}
                              >
                                No Records
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          <>
                            {/* {console.log(enquiries, ticketType,"ENQ&Tic")} */}
                            {enquiries &&
                              filterByStatus(enquiries, ticketType)
                                .filter((item) =>
                                  // item.archived === "archived" &&
                                  item.enquiry_unique_id
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase())
                                )
                                .map((item, idx) => (
                                  <div className="table-row-noti" key={idx}>
                                    <div className="bar"></div>
                                    <div className="message">
                                      <div>
                                        <Button
                                          style={{
                                            marginLeft: "0px",
                                            marginTop: "5px",
                                            background: "#035189",
                                            border: "none",
                                            fontSize: "20px",
                                            padding: "5px 15px",
                                            color: "#fff",
                                            fontWeight: "600",
                                            // width: "17%",
                                          }}
                                        >
                                          Ticket No. : {item.enquiry_unique_id}
                                        </Button>
                                      </div>
                                      {/* {item.vm_id !== "null" &&
                                        item.vm_id !== null && (
                                          <div class="desc">
                                            Machine : {item.vm_name}
                                          </div>
                                        )} */}
                                      <div
                                        class="desc"
                                        style={{
                                          fontSize: "24px",
                                          marginTop: "20px",
                                          color: "#035189",
                                          maxHeight: "100px",
                                          fontWeight: "600",
                                          maxWidth: "100rem",
                                        }}
                                      >
                                        Subject : {item.type}
                                      </div>
                                      <div
                                        class="desc"
                                        style={{
                                          fontSize: "24px",
                                          marginTop: "15px",
                                          color: "#f47c20",
                                          maxHeight: "100px",
                                          fontWeight: "600",
                                          maxWidth: "100rem",
                                        }}
                                      >
                                        Desc. : {item.enquiry}
                                      </div>

                                      {item.image !== null &&
                                        item.image !== "" && (
                                          <div style={{ marginTop: "10px" }}>
                                            {item.image !== null &&
                                            item.image !== "" ? (
                                              <button
                                                onClick={() => {
                                                  setPreviewImagePopup(
                                                    item.image
                                                  );
                                                  setShowImagePopup(true);
                                                }}
                                                style={{
                                                  border: "none",
                                                  background: "none",
                                                  padding: 0,
                                                }}
                                              >
                                                <img
                                                  //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                                  src={`${item.image}`}
                                                  style={{
                                                    maxWidth: "40rem",
                                                    maxHeight: "30rem",
                                                    border: "2px solid #f47c20",
                                                    borderRadius: "8px",
                                                    // backgroundColor: "#f47c20",
                                                  }}
                                                />
                                              </button>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        )}

                                      <div
                                        class=""
                                        style={{ fontSize: "24px" }}
                                        onClick={() => {
                                          setShowMore(!showMore);
                                          setShowMoreID(idx);
                                        }}
                                      >
                                        <Button
                                          style={{
                                            marginLeft: "0px",
                                            marginTop: "20px",
                                            background: "#035189",
                                            border: "none",
                                            fontSize: "20px",
                                            padding: "5px 15px",
                                            color: "#fff",
                                            fontWeight: "600",
                                            // width: "17%",
                                            marginBottom: "10px",
                                          }}
                                        >
                                          {" "}
                                          {showMore && showMoreID === idx
                                            ? "Hide"
                                            : "Show More"}{" "}
                                        </Button>
                                      </div>
                                      {showMore && showMoreID === idx && (
                                        <>
                                          {/* <div> Description: {item.enquiry}</div> */}
                                          <div
                                            className="you-title"
                                            style={{
                                              fontSize: "24px",
                                              marginBottom: "20px",
                                            }}
                                          >
                                            {filterByEnquiryId(
                                              replyArr,
                                              item.id
                                            ).map((msg, idx) => (
                                              <>
                                                <div
                                                  //class="desc"
                                                  style={{ maxHeight: "none" }}
                                                >
                                                  <p
                                                    style={{
                                                      //marginBottom: "0rem",
                                                      marginTop: "10px",
                                                      marginRight: "200px",
                                                    }}
                                                  >
                                                    {" "}
                                                    {msg.reply !== null ? (
                                                      <div
                                                        className="row"
                                                        style={{
                                                          color: "#f47c20",
                                                          fontWeight: "600",
                                                          width: "126%",
                                                          marginBottom: "20px",
                                                        }}
                                                      >
                                                        <div
                                                          className="col-md-9"
                                                          style={{
                                                            wordBreak:
                                                              "break-word",
                                                            maxWidth: "100%",
                                                            // whiteSpace:
                                                            //   "pre-wrap",
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              width: "4rem",
                                                            }}
                                                          >
                                                            You:
                                                          </span>

                                                          <span
                                                            style={{
                                                              maxWidth: "80ch",
                                                              // display: "flex",
                                                              marginLeft:
                                                                "10px",
                                                              whiteSpace:
                                                                "pre-wrap",
                                                            }}
                                                          >
                                                            {msg.reply}
                                                          </span>
                                                        </div>
                                                        <div className="col-md-3">
                                                          <span
                                                            className="datetime"
                                                            style={{
                                                              //display: "flex",
                                                              // position:"absolute",
                                                              // marginLeft: "20%",
                                                              // marginRight: "0px",
                                                              fontSize: "14px",
                                                              // fontWeight: "300px",
                                                              color: "#898989",
                                                              marginLeft: "20%",
                                                            }}
                                                          >
                                                            Created at :
                                                            {msg.created_at}
                                                            {/* {
                                                              <DateTimeSplit
                                                                datetime={
                                                                  msg.created_at
                                                                }
                                                              />
                                                            } */}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    ) : null}
                                                    {msg.admin_reply !==
                                                    null ? (
                                                      <span
                                                        className="spanWithMargin"
                                                        style={{
                                                          color: "#035189",
                                                          //marginBottom: "10px",
                                                          fontWeight: "600",
                                                        }}
                                                      >
                                                        Support :{" "}
                                                        <span
                                                        // style={{
                                                        //   color: "black",
                                                        //   fontWeight: "300",
                                                        //   fontSize: "13px",
                                                        // }}
                                                        >
                                                          {msg.admin_reply}
                                                        </span>
                                                      </span>
                                                    ) : null}
                                                  </p>
                                                  {msg.image !== null &&
                                                  msg.image !== "" ? (
                                                    <img
                                                      //src={`https://console.upnetcloud.com/public/uploads/tickets/${msg.image}`}
                                                      src={`${msg.image}`}
                                                      style={{
                                                        maxWidth: "40rem",
                                                        maxHeight: "30rem",
                                                        border:
                                                          "2px solid #f47c20",
                                                        borderRadius: "8px",
                                                      }}
                                                    />
                                                  ) : null}
                                                </div>
                                              </>
                                            ))}

                                            {item.status !== "completed" &&
                                              item.status !== "archived" && (
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    marginTop: "15px",
                                                  }}
                                                >
                                                  <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={
                                                      handleImageUpdateRply
                                                    }
                                                    style={{
                                                      display: "none",
                                                      position: "absolute",
                                                      zIndex: "1",

                                                      marginLeft: "-5px",
                                                      height: "40px",
                                                      width: "40px",
                                                      color:
                                                        "rgb(255 0 0 / 0%)",
                                                      fontSize: "0px",
                                                      backgroundColor:
                                                        "#ff0000",
                                                    }}
                                                  />
                                                  {selectedImageRply && (
                                                    <div
                                                      style={{
                                                        position: "absolute",
                                                        zIndex: "1",
                                                        width: "10px",
                                                        height: "10px",
                                                        backgroundColor: "red",
                                                        borderRadius: "50%",
                                                      }}
                                                    ></div>
                                                  )}
                                                  <Button
                                                    style={{
                                                      width: "30px",
                                                      height: "30px",
                                                      marginLeft: "0px",
                                                      backgroundColor:
                                                        "#f47c2000",
                                                      border: "none",
                                                      color: "white",
                                                    }}
                                                    onClick={handleButtonClick}
                                                  >
                                                    <img
                                                      src="./filepin.png"
                                                      style={{ opacity: "1" }}
                                                    />
                                                  </Button>

                                                  <textarea
                                                    placeholder="Content"
                                                    style={{
                                                      minHeight: "100px",
                                                      maxHeight: "300px",
                                                      padding: "10px",
                                                      width: "100%",
                                                      backgroundColor:
                                                        "transparent",
                                                      color: "black",
                                                      borderRadius: "30px",
                                                      border: "2px solid grey",
                                                    }}
                                                    value={replyText}
                                                    onChange={(e) =>
                                                      setReplyText(
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <Button
                                                    style={{
                                                      height: "40px",
                                                      marginLeft: "10px",
                                                      marginTop: "30px",
                                                      width: "95px",
                                                      backgroundColor:
                                                        "#f47c20",
                                                      border: "none",
                                                      color: "white",
                                                    }}
                                                    onClick={() => {
                                                      setEnqID(item.id);

                                                      const filteredReplies =
                                                        filterByEnquiryId(
                                                          replyArr,
                                                          item.id
                                                        );
                                                      const lastReplyID =
                                                        filteredReplies[
                                                          filteredReplies.length -
                                                            1
                                                        ].id;
                                                      TicketsReply(
                                                        lastReplyID,
                                                        item.id
                                                      );
                                                    }}
                                                  >
                                                    {" "}
                                                    Reply
                                                  </Button>
                                                </div>
                                              )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <div
                                      className="datetime"
                                      style={{
                                        // display: "flex",
                                        marginLeft: "80%",
                                        marginRight: "0px",
                                        position: "absolute",
                                        top: "15px",
                                      }}
                                    >
                                      Created at : {item.createdAt}
                                      <select
                                        name="plan_time"
                                        style={{
                                          borderRadius: "4px",
                                          background:
                                            item.status === "completed"
                                              ? "green"
                                              : item.status === "progress"
                                              ? "#aaaa00" //YELLOW
                                              : item.status === "open"
                                              ? "#f47c20"
                                              : "#aa0000", // RED
                                          border: "none",
                                          fontSize: "18px",
                                          padding: "5px 15px",
                                          color: "#fff",
                                          fontWeight: "600",
                                          // borderRadius: "20px",
                                          marginBottom: "10px",
                                        }}
                                        value={item.status}
                                        onChange={(e) => {
                                          // setSupportMachine(e.target.value);
                                          ArchiveTicket({
                                            id: item.id,
                                            status: e.target.value,
                                          });
                                        }}
                                      >
                                        <option
                                          value="completed"
                                          disabled="true"
                                        >
                                          Complete
                                        </option>
                                        <option
                                          value="progress"
                                          disabled="true"
                                        >
                                          inProgress
                                        </option>
                                        <option value="open" disabled="true">
                                          Open
                                        </option>
                                        <option value="pending" disabled="true">
                                          Pending
                                        </option>
                                        <option
                                          value="archived"
                                          disabled={
                                            item.archived === "archived"
                                          }
                                        >
                                          Archive
                                        </option>
                                        <option value="close">Close</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}
                            {ticketType === "open" &&
                            filterByStatus(enquiries, ticketType).length ===
                              0 ? (
                              <div
                                style={{
                                  position: "relative",
                                  left: "40%",
                                  marginTop: "15px",
                                  fontSize: "24px",
                                  fontWeight: "400",
                                }}
                              >
                                No Records
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </div>

                      {filterByStatus(enquiries, ticketType).length === 0 ? (
                        //
                        ""
                      ) : (
                        <></>
                      )}
                      {/* {console.log("ticketType=1", ticketType)} */}
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-1"></div>
            </Row>
          </div>
        </div>
      )}
      <div className="apptoast-align">
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "9999999999999999" }}>
          <Loader isLoading={loading} />
          {/* <Spinner animation="border" /> */}
        </div>
      )}
    </div>
  );
};

export default SupportPage;
