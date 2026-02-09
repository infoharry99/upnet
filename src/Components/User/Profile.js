import React, { useEffect, useRef, useState } from "react";
import "./Profile.css";
import { Row } from "react-bootstrap";
import instance, {
  AllCountryList,
  apiEncryptRequest,
  apiDecrypteRequest,
  decryptData,
} from "../../Api";
import { useAuth } from "../../AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../common/Loader";
import AppToast from "../../AppToast";
import { FaX } from "react-icons/fa6";
import { faR } from "@fortawesome/free-solid-svg-icons";

const Profile = (props) => {
  const { smuser } = useAuth();
  const { isMobile } = props;
  const fileInputGSTRef = useRef(null);
  const fileInputPANRef = useRef(null);
  const fileInputAdharRef = useRef(null);
  const fileInputCompanyPANRef = useRef(null);
  const fileInputCINRef = useRef(null);
  const fileInputIdentityRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    GetMyDetails();
  }, []);
  const [userData, setUserData] = useState(null);
  const [vmData, setVmData] = useState(null);
  const [gstNum, setGstNum] = useState(null);
  const [adharNum, setAdharNum] = useState(null);
  const [panNum, setPanNum] = useState(null);
  const [compPANNum, setCompPANNum] = useState(null);
  const [cinNum, setCINNum] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGSTImage, setSelectedGSTImage] = useState(null);
  const [selectedPANImage, setSelectedPANImage] = useState(null);
  const [selectedAdharImage, setSelectedAdharImage] = useState(null);
  const [selectedCompanyPANImage, setSelectedCompanyPANImage] = useState(null);
  const [selectedCINImage, setSelectedCINImage] = useState(null);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewGSTImage, setPreviewGSTImage] = useState(null);
  const [previewAdharImage, setPreviewAdharImage] = useState(null);
  const [previewPANImage, setPreviewPANImage] = useState(null);
  const [previewCompanyPANImage, setPreviewCompanyPANImage] = useState(null);
  const [previewCINImage, setPreviewCINImage] = useState(null);

  const [supportType, setSupportType] = useState(null);
  const [userIP, setUserIP] = useState("");
  const [userStates, setUserStates] = useState(null);

  const [showEditPopup, setShowEditPopup] = useState(null);
  const [userName, setUserName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userMobile, setUserMobile] = useState(null);

  const [chkGSTVerify, setGSTVerified] = useState(null);
  const [chkAdharVerify, setAdharVerified] = useState(null);
  const [chkPANVerify, setPANVerified] = useState(null);
  const [chkCompPANVerify, setCompPANVerified] = useState(null);
  const [chkCINVerify, setCINVerified] = useState(null);

  const [showAdharPopup, setShowAdharPopup] = useState(null);
  const [adharRequestId, setAdharRequestId] = useState(null);
  const [adharOTP, setAdharOTP] = useState(null);

  const [showImagePopup, setShowImagePopup] = useState(null);
  const [showPreviewImagePopup, setPreviewImagePopup] = useState(null);

  const [identityNum, setIdentityNum] = useState(null);
  const [selectedIdentityImage, setIdentityImage] = useState(null);
  const [chkIdentiyVerify, setIdentityVerified] = useState(null);
  const [previewIdentityImage, setPreviewIdentityImage] = useState(null);
  const [is2FAOnOff, set2FAOnOFF] = useState(true);

  useEffect(() => {
    GetState();
    GetTemp("India");
    setUserIP("103.240.168.48");
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserIP(data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };
    // fetchIP();
  }, []);

  const fetchIPData = async () => {
    const apiKey = "1af218008b2040cc8f6488d266b1364f";
    const ipAddress = userIP;
    try {
      const response = await fetch(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ipAddress}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
    } catch (error) {
      console.error("Error fetching IP data:", error);
    }
  };

  const GetCountry = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const loginUserResponse = await instance.post("/country");
      //console.log(loginUserResponse.data, "====/vm/monitor");
      const loginResponse = await apiDecrypteRequest(loginUserResponse.data);
      // console.log(loginResponse, "country");
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const GetState = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const loginUserResponse = await instance.post("/state");
      //console.log(loginUserResponse.data, "====/vm/monitor");
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "state");
      setUserStates(loginResponse.state);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const GetTemp = async (country) => {
    setLoading(true);
    const payload = {
      country: country, //"China",
    };
    try {
      const loginUserResponse = await instance.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        payload
      );
      setUserStates(loginUserResponse.data.data.states);
    } catch (error) {
      console.error("Error during the login process:", error);
    }
    setLoading(false);
  };

  const GetMyDetails = async () => {
    setLoading(true);
    const payload = {
      user_id: smuser.id,
    };
    try {
      const loginUserResponse = await instance.post("/editprofile", payload);

      const User = loginUserResponse.data.user;
      setSelectedCountry(User.country);
      setSelectedState(User.state_region);
      console.log(User, "==!==!==User");
      setUserData(User);
      if (User.gstno !== null && User.gstno !== "null") {
        setGstNum(User.gstno);
      }
      if (User.aadharno !== null && User.aadharno !== "null") {
        setAdharNum(User.aadharno);
      }
      if (User.panno !== null && User.panno !== "null") {
        setPanNum(User.panno);
      }
      if (User.driving_number !== null && User.driving_number !== "null") {
        setCompPANNum(User.driving_number);
      }
      if (User.ciin_no !== null && User.ciin_no !== "null") {
        setCINNum(User.ciin_no);
      }
      if (User.identity_no !== null && User.identity_no !== "null") {
        setIdentityNum(User.identity_no);
      }

      setSupportType(User.support);

      if (User.companyname !== null && User.companyname !== "null") {
        setCompanyName(User.companyname);
      }
      if (User.name !== null && User.name !== "null") {
        setUserName(User.name);
      }
      if (User.email !== null && User.email !== "null") {
        setUserEmail(User.email);
      }
      if (User.phone !== null && User.phone !== "null") {
        setUserMobile(User.phone);
      }

      if (User.gst_verify == 1) {
        setGSTVerified(true);
      } else {
        setGSTVerified(false);
      }
      if (User.aadhar_verify == 1) {
        setAdharVerified(true);
      } else {
        setAdharVerified(false);
      }
      if (User.pan_verify == 1) {
        setPANVerified(true);
      } else {
        setPANVerified(false);
      }
      if (User.driving_verify == 1) {
        setCompPANVerified(true);
      } else {
        setCompPANVerified(false);
      }
      if (User.ciib_verify == 1) {
        setCINVerified(true);
      } else {
        setCINVerified(false);
      }
      if (User.identity_verify == 1) {
        setIdentityVerified(true);
      } else {
        setIdentityVerified(false);
      }

      const Vm = loginUserResponse.data.vm[0];
      setVmData(Vm);
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
    setLoading(false);
  };

  const handleImageChange = (e) => {
    //console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGSTChangeBtn = async () => {
    if (fileInputGSTRef.current) {
      fileInputGSTRef.current.click();
    }
  };
  const removeImageApi = async (type) => {

    if (smuser.id !== null && smuser.id !== "") {
      setLoading(true);
      const payload = {
        user_id: smuser.id,
        type: type,
      };
      // console.log("payloadddd", payload);
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const distroyResponse = await instance.post(
          "/removeimge",
          encryptedResponse
        );
        const updateProfileResponse = await decryptData(distroyResponse.data);
        // console.log("UPDATED Response== ", updateProfileResponse);

        if (updateProfileResponse.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
          GetMyDetails();
          window.location.reload();
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
      setLoading(false);
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

  const handleImageAdharChangeBtn = () => {
    if (fileInputAdharRef.current) {
      fileInputAdharRef.current.click();
    }
  };

  const handleImagePANChangeBtn = () => {
    if (fileInputPANRef.current) {
      fileInputPANRef.current.click();
    }
  };

  const handleImageCompanyPANChangeBtn = () => {
    if (fileInputCompanyPANRef.current) {
      fileInputCompanyPANRef.current.click();
    }
  };
  const handleImageCINNoChangeBtn = () => {
    if (fileInputCINRef.current) {
      fileInputCINRef.current.click();
    }
  };

  const handleImageGSTChange = (e) => {
    setPreviewGSTImage(null);
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
      setSelectedGSTImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewGSTImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePANChange = (e) => {
    const file = e.target.files[0];
    setPreviewPANImage(null);

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
        e.target.value = null;
        return;
      }
      setSelectedPANImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPANImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAdharChange = (e) => {
    const file = e.target.files[0];

    setPreviewAdharImage(null);
    // Check if a file is selected
    if (file) {
      // Check file size
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

      // Set selected file
      setSelectedAdharImage(file);

      // Read file and set preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAdharImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageCompanyPANChange = (e) => {
    const file = e.target.files[0];

    setPreviewCompanyPANImage(null);
    // Check if a file is selected
    if (file) {
      // Check file size
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

      // Set selected file
      setSelectedCompanyPANImage(file);

      // Read file and set preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCompanyPANImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageCINNoChange = (e) => {
    const file = e.target.files[0];

    setPreviewCINImage(null);
    // Check if a file is selected
    if (file) {
      // Check file size
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

      // Set selected file
      setSelectedCINImage(file);

      // Read file and set preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCINImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageIdentityChange = (e) => {
    setPreviewIdentityImage(null);
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
      setIdentityImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewIdentityImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfile(file);
      if (selectedProfile !== null) {
        UpdateProfileImage();
      }
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = handleProfileChange;
    fileInput.click();
  };

  const UpdateProfileImage = async () => {
    // if (gstNum !== "" && panNum !== "" && passDrivNum !== "") {
    setLoading(true);
    const formDataProfile = new FormData();
    formDataProfile.append("file", selectedProfile);
    formDataProfile.append("user_id", smuser.id);

    try {
      const profileRes = await instance.post("/upload-image", formDataProfile);
      //console.log(profileRes.data, "====/profileRes");
      GetMyDetails();
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
  };

  const UpdateInfo = async () => {
    setLoading(true);
    if (gstNum !== "" && panNum !== "") {
      const formData = new FormData();

      formData.append("user_id", smuser.id);
      formData.append("name", smuser.name);
      formData.append("country", selectedCountry);
      formData.append("state", selectedState);
      formData.append("gstno", gstNum);
      formData.append("aadharno", adharNum);
      //formData.append("driving_number", passDrivNum);
      formData.append("panno", panNum);
      formData.append("ciin_no", cinNum);
      formData.append("gst_image", selectedGSTImage);
      formData.append("aadhar_image", selectedAdharImage);
      formData.append("pan_image", selectedPANImage);
      formData.append("driving_licence_img", selectedCompanyPANImage);
      formData.append("ciin_img", selectedCINImage);

      // const payload = {
      //   user_id: smuser.id,
      //   gst: gstNum,
      //   pan: panNum,
      //   aadhar: passDrivNum,
      //   gst_image: selectedImage,
      // };
      try {
        const updateUserInfoResponse = await instance.post(
          "/updateuserinfo",
          formData
        );
        //console.log(updateUserInfoResponse.data, "====/updateUserInfoResponse");
      } catch (error) {
        toast((t) => (
          <AppToast id={t.id} message={error} isMobile={isMobile} />
        ));
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

  const updateUserProfile = async () => {
    if (
      userName !== null &&
      userName !== "" &&
      userEmail !== null &&
      userEmail !== "" &&
      userMobile !== null &&
      userMobile !== ""
    ) {
      setLoading(true);
      const payload = {
        user_id: smuser.id,
        name: userName,
        email: userEmail,
        phone: userMobile,
        companyname: companyName,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const distroyResponse = await instance.post(
          "/updateuseprofile",
          encryptedResponse
        );
        const updateProfileResponse = await decryptData(distroyResponse.data);
        // console.log("UPDATED Response== ", updateProfileResponse);

        if (updateProfileResponse.status) {
          setShowEditPopup(false);
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
          GetMyDetails();
        } else {
          setShowEditPopup(false);
        }
      } catch (error) {
        setShowEditPopup(false);
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
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"User email and mobile both required!"}
          isMobile={isMobile}
        />
      ));
    }
  };

  const gstVerify = async () => {
    if (
      gstNum !== null &&
      gstNum !== "" &&
      companyName !== null &&
      companyName !== ""
    ) {
      setLoading(true);
      const payload = {
        user_id: smuser.id,
        gstno: gstNum,
        gst_image: null,
        companyname: companyName,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const distroyResponse = await instance.post(
          "/verifygst",
          encryptedResponse
        );
        const updateProfileResponse = await decryptData(distroyResponse.data);
        // console.log("UPDATED Response== ", updateProfileResponse);

        if (updateProfileResponse.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
          GetMyDetails();
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
      setLoading(false);
    } else {
      if (gstNum === null || gstNum === "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"GST Number required!"}
            isMobile={isMobile}
          />
        ));
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Company Name required!"}
            isMobile={isMobile}
          />
        ));
      }
    }
  };
  const gstEdit = async () => {
    setGSTVerified(false);
  };

  const generateaadhar_otp = async () => {
    if (adharNum !== null && adharNum !== "") {
      setLoading(true);
      const payload = {
        user_id: smuser.id,
        aadharno: adharNum,
        aadhar_image: null,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const distroyResponse = await instance.post(
          "/generateaadhar_otp",
          encryptedResponse
        );
        const updateProfileResponse = await decryptData(distroyResponse.data);
        // console.log("UPDATED Response== ", updateProfileResponse);

        if (updateProfileResponse.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
          //GetMyDetails();
          setAdharRequestId(updateProfileResponse.request_id);
          setShowAdharPopup(true);
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
      setLoading(false);
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Aadhar Number required!"}
          isMobile={isMobile}
        />
      ));
    }
  };

  const adharVerify = async () => {
    if (adharOTP !== "" && adharOTP !== null) {
      setLoading(true);
      const payload = {
        user_id: smuser.id,
        request_id: adharRequestId,
        otp: adharOTP,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const distroyResponse = await instance.post(
          "/verifyaadhar",
          encryptedResponse
        );
        const updateProfileResponse = await decryptData(distroyResponse.data);
        // console.log("UPDATED Response== ", updateProfileResponse);

        if (updateProfileResponse.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
          GetMyDetails();
          showAdharPopup(false);
        }
      } catch (error) {
        showAdharPopup(false);
        // toast((t) => (
        //   <AppToast
        //     id={t.id}
        //     message={
        //       "Oops! Something went wrong while fetching the data. Please try again later or contact support if the issue persists."
        //     }
        //     isMobile={isMobile}
        //   />
        // ));
      }
    } else {
      toast((t) => (
        <AppToast id={t.id} message={"OTP required!"} isMobile={isMobile} />
      ));
    }
    setLoading(false);
  };

  const adharEdit = async () => {
    setAdharVerified(false);
  };

  const panVerify = async () => {
    if (panNum !== null && panNum !== "") {
      setLoading(true);
      const payload = {
        user_id: smuser.id,
        pan_no: panNum,
        pan_image: null,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const distroyResponse = await instance.post(
          "/verifypan",
          encryptedResponse
        );
        const updateProfileResponse = await decryptData(distroyResponse.data);
        // console.log("UPDATED Response== ", updateProfileResponse);

        if (updateProfileResponse.status) {
          setPANVerified(true);
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
          GetMyDetails();
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
        }
      } catch (error) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={
              "Please Enter the Correct Name with Exact Spelling Provided on your ID Card"
            }
            isMobile={isMobile}
          />
        ));
      }
      setLoading(false);
    } else {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"PAN Number required!"}
          isMobile={isMobile}
        />
      ));
    }
  };
  const panEdit = async () => {
    setPANVerified(false);
  };

  const compPanVerify = async () => {
    if (
      compPANNum !== null &&
      compPANNum !== "" &&
      companyName !== null &&
      companyName !== ""
    ) {
      setLoading(true);
      const payload = {
        user_id: smuser.id,
        driving_number: compPANNum,
        driving_licence_img: null,
        companyname: companyName,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const distroyResponse = await instance.post(
          "/driving-license",
          encryptedResponse
        );
        const updateProfileResponse = await decryptData(distroyResponse.data);
        // console.log("UPDATED Response== ", updateProfileResponse);

        if (updateProfileResponse.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
          GetMyDetails();
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
      setLoading(false);
    } else {
      if (compPANNum === null || compPANNum === "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Company PAN Number required!"}
            isMobile={isMobile}
          />
        ));
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Company Name required!"}
            isMobile={isMobile}
          />
        ));
      }
    }
  };
  const compPANEdit = async () => {
    setCompPANVerified(false);
  };

  const cinVerify = async () => {
    if (
      cinNum !== null &&
      cinNum !== "" &&
      companyName !== null &&
      companyName !== ""
    ) {
      setLoading(true);
      const payload = {
        user_id: smuser.id,
        ciin_no: cinNum,
        ciin_img: null,
        companyname: companyName,
      };
      try {
        const encryptedResponse = await apiEncryptRequest(payload);
        const distroyResponse = await instance.post(
          "/verifyciin",
          encryptedResponse
        );
        const updateProfileResponse = await decryptData(distroyResponse.data);
        // console.log("UPDATED Response== ", updateProfileResponse);

        if (updateProfileResponse.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
          GetMyDetails();
        } else {
          toast((t) => (
            <AppToast
              id={t.id}
              message={updateProfileResponse.message}
              isMobile={isMobile}
            />
          ));
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
      setLoading(false);
    } else {
      if (cinNum === null || cinNum === "") {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"CIN Number required!"}
            isMobile={isMobile}
          />
        ));
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={"Company Name required!"}
            isMobile={isMobile}
          />
        ));
      }
    }
  };
  const cinnoEdit = async () => {
    setCINVerified(false);
  };

  const IdentityVerify = async () => {
    if (
      identityNum !== null &&
      identityNum !== "" &&
      selectedIdentityImage !== null &&
      selectedIdentityImage !== ""
    ) {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", smuser.id);
      formData.append("identity_no", identityNum);
      formData.append("identity_image", selectedIdentityImage);
      try {
        const updateIdentityResponse = await instance.post(
          "/verifyidentity",
          formData
        );
        const updateProfileResponse = await decryptData(
          updateIdentityResponse.data
        );

        console.log("UPDATED Response== ", updateProfileResponse)
        if (updateProfileResponse.status) {
            if (updateProfileResponse?.url) {
                window.open(updateProfileResponse.url, '_blank');
            };
            toast((t) => (
                <AppToast
                id={t.id}
                message={
                    "We will verify your identity shortly. Please ensure your details are accurate."
                }
                isMobile={isMobile}
                />
            ));
            GetMyDetails();
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
      setLoading(false);
    } else if (identityNum == null || identityNum === "") {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Identity Number required!"}
          isMobile={isMobile}
        />
      ));
    } else if (selectedIdentityImage == null) {
      toast((t) => (
        <AppToast
          id={t.id}
          message={"Identity Image required!"}
          isMobile={isMobile}
        />
      ));
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
  };

  const identityEdit = async () => {
    setIdentityVerified(false);
  };

  const UploadImages = async () => {
    setLoading(true);
    if (smuser.id !== null) {
      const formData = new FormData();

      formData.append("user_id", smuser.id);
      formData.append("name", smuser.name);
      formData.append("country", selectedCountry);
      formData.append("state", selectedState);
      formData.append("gstno", gstNum);
      formData.append("aadharno", adharNum);
      formData.append("panno", panNum);
      formData.append("driving_number", compPANNum);
      formData.append("ciin_no", cinNum);
      formData.append("gst_image", selectedGSTImage);
      formData.append("aadhar_image", selectedAdharImage);
      formData.append("pan_image", selectedPANImage);
      formData.append("driving_licence_img", selectedCompanyPANImage);
      formData.append("ciin_img", selectedCINImage);

      try {
        const updateImageResponse = await instance.post(
          "/updateuserinfo",
          formData
        );
        //console.log(updateUserInfoResponse.data, "====/updateUserInfoResponse");

        if (updateImageResponse.status) {
          toast((t) => (
            <AppToast
              id={t.id}
              message={"Image uploaded successfully"}
              isMobile={isMobile}
            />
          ));
          GetMyDetails();
          window.location.reload();
        } else {
          // toast((t) => (
          //   <AppToast
          //     id={t.id}
          //     message={updateImageResponse.message}
          //     isMobile={isMobile}
          //   />
          // ));
        }
      } catch (error) {
        toast((t) => (
          <AppToast id={t.id} message={error} isMobile={isMobile} />
        ));
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

  const handleMouseEnter = () => {
    setIsHovered(true);
    //api call
    // const 2faResponse = await instance.post(
      //   "/updateuserinfo",
      //   formData
      // );

  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={{
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
      }}
    >
      {showEditPopup && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backdropFilter: "blur(25px)",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              border: "2px solid #e97730",
              top: "20%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile ? "80%" : "35%",
              height: "35rem",
            }}
          >
            <div style={{ display: "grid", justifyItems: "center" }}>
              <button
                style={{
                  zIndex: "9",
                  position: "absolute",
                  backgroundColor: "transparent",
                  border: "none",
                  right: "0",
                }}
                onClick={() => setShowEditPopup(false)}
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
              <div
                className="popup-input-container"
                style={{
                  top: "50px",
                  right: "0px",
                  marginTop: isMobile ? "60px" : "30px",
                }}
              >
                <input
                  defaultValue={userData.companyname}
                  type="text"
                  className="input-signup"
                  placeholder="Company Name"
                  style={{
                    borderRadius: "10px",
                    width: isMobile ? "15rem" : "25rem",
                    marginTop: "-2px",
                  }}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div
                className="popup-input-container"
                style={{
                  top: "50px",
                  right: "0px",
                  marginTop: isMobile ? "60px" : "30px",
                }}
              >
                <input
                  defaultValue={userData.name}
                  type="text"
                  className="input-signup"
                  placeholder="Name"
                  style={{
                    borderRadius: "10px",
                    width: isMobile ? "15rem" : "25rem",
                    marginTop: "-2px",
                  }}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div
                className="popup-input-container"
                style={{
                  top: "50px",
                  right: "0px",
                  marginTop: isMobile ? "60px" : "30px",
                }}
              >
                <input
                  defaultValue={userData.email}
                  type="text"
                  name="amount"
                  className="input-signup"
                  placeholder="Email Address"
                  style={{
                    borderRadius: "10px",
                    width: isMobile ? "15rem" : "25rem",
                    marginTop: "-2px",
                  }}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              <div
                className="popup-input-container"
                style={{
                  top: "50px",
                  right: "0px",
                  marginTop: isMobile ? "60px" : "30px",
                }}
              >
                <input
                  defaultValue={userData.phone}
                  type="number"
                  name="amount"
                  className="input-signup"
                  placeholder="Mobile Number"
                  style={{
                    borderRadius: "10px",
                    width: isMobile ? "15rem" : "25rem",
                    marginTop: "-2px",
                  }}
                  onChange={(e) => setUserMobile(e.target.value)}
                />
              </div>
              <button
                style={{
                  color: "white",
                  width: "10rem",
                  height: "50px",
                  fontWeight: "bold",
                  backgroundColor: "#035189",
                  borderRadius: "25px",
                  border: "2px solid #ffff",
                  outline: "2px solid #035189",
                  marginTop: "110px",
                }}
                onClick={() => {
                  updateUserProfile();
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdharPopup && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              backdropFilter: "blur(25px)",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
              borderRadius: "12px", // Assuming you want rounded corners
              border: "2px solid #e97730",
              top: "30%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile ? "80%" : "35%",
              height: "20rem",
            }}
          >
            <div style={{ display: "grid", justifyItems: "center" }}>
              <button
                style={{
                  zIndex: "9",
                  position: "absolute",
                  backgroundColor: "transparent",
                  border: "none",
                  right: "0",
                }}
                onClick={() => setShowAdharPopup(false)}
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
              <div
                className="popup-input-container"
                style={{
                  top: "50px",
                  right: "0px",
                  marginTop: isMobile ? "60px" : "30px",
                }}
              >
                <input
                  defaultValue={""}
                  type="text"
                  className="input-signup"
                  placeholder="Enter OTP"
                  style={{
                    borderRadius: "10px",
                    width: isMobile ? "15rem" : "25rem",
                    marginTop: "-2px",
                  }}
                  onChange={(e) => setAdharOTP(e.target.value)}
                />
              </div>
              <button
                style={{
                  color: "white",
                  width: "10rem",
                  height: "50px",
                  fontWeight: "bold",
                  backgroundColor: "#035189",
                  borderRadius: "25px",
                  border: "2px solid #ffff",
                  outline: "2px solid #035189",
                  marginTop: "110px",
                }}
                onClick={() => {
                  adharVerify();
                }}
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {showImagePopup && (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <div
            style={{
              // backdropFilter: "blur(25px)",
              backgroundColor: "white",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow added
              borderRadius: "12px", // Assuming you want rounded corners
              border: "2px solid #e97730",
              top: "30%",
              position: "absolute",
              zIndex: "999999999999",
              width: isMobile ? "80%" : "30%",
              height: isMobile ? "40%" : "30rem",
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
                    height: "70%",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "white",
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
          style={{
            marginTop: "4rem",
            display: "grid",
            justifyItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="profile-image-cont">
            <div className="profile-image-outer">
              <div
                className="profile-image-inner"
                style={{ backgroundColor: "#e97730" }}
              >
                {userData && userData.image !== null ? (
                  <img
                    //src={`https://console.upnetcloud.com/${userData.image}`}
                    src={`${userData.image}`}
                    alt="Not Available"
                    style={{ padding: "10px" }}
                  />
                ) : (
                  <img
                    src="/admin/images/admin/common/admin-icon.png"
                    alt="Not Available"
                    style={{ padding: "15px" }}
                  />
                )}
              </div>
            </div>
            <div
              className="profile-edit-badge"
              onClick={() => handleButtonClick()}
            >
              <img
                src="/admin/images/admin/13-Profile/Pen.png"
                style={{
                  paddingRight: "5px",
                }}
              />
              Edit Photo
            </div>
          </div>

          <div>
            <div
              style={{
                marginTop: "-4rem",
                backgroundImage: `url("/images/blue-box-bg.svg")`,
                backgroundSize: "cover",
                top: "5rem",
                // paddingLeft: "5px",
                paddingRight: "5px",
                paddingBottom: "50px",
                width: "90%",
                marginLeft: "20px",
                position: "relative",
                backgroundColor: "#07528b", // Use backgroundColor instead of background
                borderRadius: "12px",
                textAlign: "center",
                // flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexWrap: "wrap",
                    zIndex: "1",
                  }}
                >
                  <div
                    style={{
                      // width: "50%",
                      padding: "0px 10px",
                    }}
                  >
                    <select
                      name="plan_time"
                      style={{
                        marginTop: "17px",
                        borderRadius: "30px",
                        marginRight: "15px",
                        padding: "10px 15px",
                        border: "2px solid rgb(255 255 255)",
                        width: "22rem",
                      }}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        GetTemp(e.target.value);
                      }}
                    >
                      <option value="Select" selected>
                        Country
                      </option>

                      {AllCountryList &&
                        AllCountryList.map((item, index) => (
                          <option key={index} value={item.value}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                    {selectedCountry === "India" ? (
                      <select
                        name="plan_time"
                        style={{
                          marginTop: "12px",
                          borderRadius: "30px",
                          marginRight: "15px",
                          padding: "10px 15px",
                          border: "2px solid rgb(255 255 255)",
                          width: "22rem",
                        }}
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        <option value="Select" selected>
                          Select State
                        </option>
                        {userStates &&
                          userStates.map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <select
                        name="plan_time"
                        style={{
                          marginTop: "12px",
                          borderRadius: "30px",
                          marginRight: "15px",
                          padding: "10px 15px",
                          border: "2px solid rgb(255 255 255)",
                          width: "22rem",
                        }}
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        <option value="Select" selected>
                          Select Province
                        </option>
                        {userStates &&
                          userStates.map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    )}
                    {/* Identity Number */}
                    {selectedCountry !== "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          marginRight: "15px",
                        }}
                      >
                        <input
                          type="text"
                          className="form-control white-placeholder"
                          name="Identity Number"
                          placeholder="Identity Number"
                          disabled={chkIdentiyVerify ? true : false}
                          value={identityNum}
                          style={{
                            color: "white",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            flex: "1",
                            padding: "5px",
                          }}
                          onChange={(e) => setIdentityNum(e.target.value)}
                        />

                        {chkIdentiyVerify && (
                          <img
                            src="/images/verified_success.png"
                            style={{ height: "34px", width: "34px" }}
                          />
                        )}
                        <button
                          style={{
                            color: "black",
                            marginRight: "5px",
                            borderRadius: "8px",
                          }}
                          onClick={
                            chkIdentiyVerify ? identityEdit : IdentityVerify
                          }
                        >
                          {chkIdentiyVerify ? "Edit" : "Verify"}
                        </button>
                      </div>
                    )}
                    {/* GST Number */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          marginRight: "15px",
                        }}
                      >
                        <input
                          type="text"
                          id="Gst Number"
                          className="form-control white-placeholder"
                          name="Gst Number"
                          placeholder="GST Number"
                          disabled={chkGSTVerify ? true : false}
                          value={gstNum}
                          style={{
                            color: "white",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            flex: "1",
                            padding: "5px",
                          }}
                          onChange={(e) => setGstNum(e.target.value)}
                        />
                        {chkGSTVerify && (
                          <img
                            src="/images/verified_success.png"
                            style={{ height: "34px", width: "34px" }}
                          />
                        )}
                        <button
                          style={{
                            color: "black",
                            marginRight: "5px",
                            borderRadius: "8px",
                          }}
                          onClick={chkGSTVerify ? gstEdit : gstVerify}
                        >
                          {chkGSTVerify ? "Edit" : "Verify"}
                        </button>
                      </div>
                    )}
                    
                    {/* Adhar Number */}
                    {!chkGSTVerify &&
                      !chkAdharVerify &&
                      !chkPANVerify &&
                      !chkCompPANVerify &&
                      !chkCINVerify &&
                      // <div class="arrow">
                      //   <span></span>
                      //   <span></span>
                      //   <span></span>
                      // </div>
                      ""}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          marginRight: "15px",
                        }}
                      >
                        <input
                          type="Number"
                          id="Adhar Number"
                          className="no-arrows"
                          name="Adhar Number"
                          placeholder="Aadhar Number"
                          disabled={chkAdharVerify ? true : false}
                          value={adharNum}
                          style={{
                            color: "white",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            flex: "1",
                            padding: "5px",
                          }}
                          onChange={(e) => setAdharNum(e.target.value)}
                        />
                        {chkAdharVerify && (
                          <img
                            src="/images/verified_success.png"
                            style={{ height: "34px", width: "34px" }}
                          />
                        )}
                        <button
                          className={`${
                            !chkGSTVerify &&
                            !chkAdharVerify &&
                            !chkPANVerify &&
                            !chkCompPANVerify &&
                            !chkCINVerify &&
                            "loader"
                          }`}
                          style={{
                            marginTop: "5px",
                            height: "30px",
                            width: "60px",
                            color: "black",
                            marginRight: "5px",
                            borderRadius: "8px",
                          }}
                          onClick={
                            chkAdharVerify ? adharEdit : generateaadhar_otp
                          }
                        >
                          {chkAdharVerify ? "Edit" : "Verify"}
                        </button>
                      </div>
                    )}
                    {/* PAN Number */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          marginRight: "15px",
                        }}
                      >
                        {/* <img
                      src="https://www.smartcloudvm.com/images/lock.svg"
                      alt=""
                      style={{
                        width: "15px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                    /> */}
                        <input
                          type="text"
                          id="Pan No"
                          className="form-control white-placeholder"
                          name="Pan No"
                          placeholder="PAN Number"
                          disabled={chkPANVerify ? true : false}
                          value={panNum}
                          style={{
                            color: "white",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            flex: "1",
                            padding: "5px",
                          }}
                          onChange={(e) => setPanNum(e.target.value)}
                        />
                        {chkPANVerify && (
                          <img
                            src="/images/verified_success.png"
                            style={{ height: "34px", width: "34px" }}
                          />
                        )}
                        <button
                          style={{
                            color: "black",
                            marginRight: "5px",
                            borderRadius: "8px",
                          }}
                          onClick={chkPANVerify ? panEdit : panVerify}
                        >
                          {chkPANVerify ? "Edit" : "Verify"}
                        </button>
                      </div>
                    )}
                    {/* Company PAN No.. */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          marginRight: "15px",
                        }}
                      >
                        <input
                          type="text"
                          id="Company PAN"
                          className="form-control white-placeholder"
                          name="Company PAN"
                          placeholder={"Company PAN No"}
                          disabled={chkCompPANVerify ? true : false}
                          value={compPANNum}
                          style={{
                            color: "white",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            flex: "1",
                            padding: "5px",
                          }}
                          onChange={(e) => setCompPANNum(e.target.value)}
                        />
                        {chkCompPANVerify && (
                          <img
                            src="/images/verified_success.png"
                            style={{ height: "34px", width: "34px" }}
                          />
                        )}
                        <button
                          style={{
                            color: "black",
                            marginRight: "5px",
                            borderRadius: "8px",
                          }}
                          onClick={
                            chkCompPANVerify ? compPANEdit : compPanVerify
                          }
                        >
                          {chkCompPANVerify ? "Edit" : "Verify"}
                        </button>
                      </div>
                    )}
                    {/* CIN No */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          marginRight: "15px",
                        }}
                      >
                        <input
                          type="text"
                          id="CIN No"
                          className="form-control white-placeholder"
                          name="CIN No"
                          placeholder="CIN No."
                          disabled={chkCINVerify ? true : false}
                          value={cinNum}
                          style={{
                            color: "white",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            flex: "1",
                            padding: "5px",
                          }}
                          onChange={(e) => setCINNum(e.target.value)}
                        />
                        {chkCINVerify && (
                          <img
                            src="/images/verified_success.png"
                            style={{ height: "34px", width: "34px" }}
                          />
                        )}
                        <button
                          style={{
                            color: "black",
                            marginRight: "5px",
                            borderRadius: "8px",
                          }}
                          onClick={chkCINVerify ? cinnoEdit : cinVerify}
                        >
                          {chkCINVerify ? "Edit" : "Verify"}
                        </button>
                      </div>
                    )}
                    {/* Identity Image */}
                    {selectedCountry !== "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          height: "45px",
                          marginRight: "15px",
                        }}
                      >
                        {userData && userData.identity_image !== null ? (
                          <>
                            <a
                              style={{
                                marginTop: "2px",
                                marginLeft: "5%",
                                color: "white",
                              }}
                            >
                              <button
                                onClick={() => {
                                  setPreviewImagePopup(
                                    userData && `${userData.identity_image}`
                                  );
                                  setShowImagePopup(true);
                                }}
                                style={{ borderRadius: "8px" }}
                              >
                                View
                              </button>{" "}
                              Identity Image
                            </a>
                            <button
                              onClick={() => removeImageApi("identity")}
                              style={{
                                position: "absolute",
                                right: "20px",
                                borderRadius: "8px",
                              }}
                            >
                              {" "}
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              ref={fileInputIdentityRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageIdentityChange}
                              style={{ color: "white", borderRadius: "10px" }}
                            />
                            {/* {previewIdentityImage && (
                                <button
                                  onClick={UploadImages}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Upload
                                </button>
                              )} */}
                          </>
                        )}
                      </div>
                    )}
                    {/* GST Image */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          height: "45px",
                          marginRight: "15px",
                        }}
                      >
                        {userData && userData.gst_image !== null ? (
                          <>
                            <a
                              style={{
                                marginTop: "2px",
                                marginLeft: "5%",
                                color: "white",
                              }}
                              // href={
                              //   userData &&
                              //   `https://console.upnetcloud.com/${userData.gst_image}`
                              // }
                              //href={userData && `${userData.gst_image}`}
                              // target="_blank"
                              // rel="noopener noreferrer"
                            >
                              <button
                                onClick={() => {
                                  setPreviewImagePopup(
                                    userData && `${userData.gst_image}`
                                  );
                                  setShowImagePopup(true);
                                }}
                                style={{ borderRadius: "8px" }}
                              >
                                View
                              </button>{" "}
                              GST or VAT Image
                            </a>
                            <button
                              //onClick={handleImageGSTChangeBtn}
                              onClick={() => removeImageApi("gst")}
                              style={{
                                position: "absolute",
                                right: "20px",
                                borderRadius: "8px",
                              }}
                            >
                              {" "}
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              ref={fileInputGSTRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageGSTChange}
                              style={{ color: "white", borderRadius: "10px" }}
                            />
                            {previewGSTImage && (
                              <button
                                onClick={UploadImages}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                Upload
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {/* Adhar Image */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          height: "45px",
                          marginRight: "15px",
                        }}
                      >
                        {userData && userData.aadhar_image !== null ? (
                          <>
                            <a
                              style={{
                                marginTop: "2px",
                                marginLeft: "5%",
                                color: "white",
                              }}
                              // href={
                              //   userData &&
                              //   `https://console.upnetcloud.com/${userData.aadhar_image}`
                              // }
                              //href={userData && `${userData.aadhar_image}`}
                              // target="_blank"
                              // rel="noopener noreferrer"
                            >
                              <button
                                onClick={() => {
                                  setPreviewImagePopup(
                                    userData && `${userData.aadhar_image}`
                                  );
                                  setShowImagePopup(true);
                                }}
                                style={{ borderRadius: "8px" }}
                              >
                                View
                              </button>{" "}
                              Adhar Image
                            </a>
                            <button
                              // onClick={handleImageAdharChangeBtn}
                              onClick={() => removeImageApi("aadhar")}
                              style={{
                                position: "absolute",
                                right: "20px",
                                borderRadius: "8px",
                              }}
                            >
                              {" "}
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            {" "}
                            <input
                              ref={fileInputAdharRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageAdharChange}
                              style={{ color: "white", borderRadius: "10px" }}
                            />
                            {previewAdharImage && (
                              <button
                                onClick={UploadImages}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                Upload
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {/* Pan Image */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          height: "45px",
                          marginRight: "15px",
                        }}
                      >
                        {userData && userData.pan_image !== null ? (
                          <>
                            {" "}
                            <a
                              style={{
                                marginTop: "2px",
                                marginLeft: "5%",
                                color: "white",
                              }}
                              // href={
                              //   userData &&
                              //   `https://console.upnetcloud.com/${userData.pan_image}`
                              // }
                              //href={userData && `${userData.pan_image}`}
                              // target="_blank"
                              // rel="noopener noreferrer"
                            >
                              <button
                                onClick={() => {
                                  setPreviewImagePopup(
                                    userData && `${userData.pan_image}`
                                  );
                                  setShowImagePopup(true);
                                }}
                                style={{ borderRadius: "8px" }}
                              >
                                View
                              </button>{" "}
                              PAN Card Image
                            </a>
                            <button
                              // onClick={handleImagePANChangeBtn}
                              onClick={() => removeImageApi("pan")}
                              style={{
                                position: "absolute",
                                right: "20px",
                                borderRadius: "8px",
                              }}
                            >
                              {" "}
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              ref={fileInputPANRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImagePANChange}
                              style={{ color: "white", borderRadius: "10px" }}
                            />
                            {previewPANImage && (
                              <button
                                onClick={UploadImages}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                Upload
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {/* Company PAN Image */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          height: "45px",
                          marginRight: "15px",
                        }}
                      >
                        {userData && userData.driving_licence_img !== null ? (
                          <>
                            <a
                              style={{
                                marginTop: "2px",
                                marginLeft: "5%",
                                color: "white",
                              }}
                              // href={
                              //   userData &&
                              //   `https://console.upnetcloud.com/${userData.driving_licence_img}`
                              // }
                              //href={userData && `${userData.driving_licence_img}`}
                              // target="_blank"
                              // rel="noopener noreferrer"
                            >
                              <button
                                onClick={() => {
                                  setPreviewImagePopup(
                                    userData &&
                                      `${userData.driving_licence_img}`
                                  );
                                  setShowImagePopup(true);
                                }}
                                style={{ borderRadius: "8px" }}
                              >
                                View
                              </button>{" "}
                              Company PAN image
                            </a>
                            <button
                              // onClick={handleImageCompanyPANChangeBtn}
                              onClick={() => removeImageApi("driver")}
                              style={{
                                position: "absolute",
                                right: "20px",
                                borderRadius: "8px",
                              }}
                            >
                              {" "}
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            {" "}
                            <input
                              ref={fileInputCompanyPANRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageCompanyPANChange}
                              style={{ color: "white", borderRadius: "10px" }}
                            />
                            {previewCompanyPANImage && (
                              <button
                                onClick={UploadImages}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                Upload
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {/* CIN Image */}
                    {selectedCountry === "India" && (
                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          alignItems: "center",
                          border: "2px solid white",
                          borderRadius: "25px",
                          padding: "5px",
                          height: "45px",
                          marginRight: "15px",
                        }}
                      >
                        {userData && userData.ciin_img !== null ? (
                          <>
                            <a
                              style={{
                                marginTop: "2px",
                                marginLeft: "5%",
                                color: "white",
                              }}
                              // href={
                              //   userData &&
                              //   `https://console.upnetcloud.com/${userData.ciin_img}`
                              // }
                              //href={userData && `${userData.ciin_img}`}
                              // target="_blank"
                              // rel="noopener noreferrer"
                            >
                              <button
                                onClick={() => {
                                  setPreviewImagePopup(
                                    userData && `${userData.ciin_img}`
                                  );
                                  setShowImagePopup(true);
                                }}
                                style={{ borderRadius: "8px" }}
                              >
                                View
                              </button>{" "}
                              CIN No Image
                            </a>
                            <button
                              //onClick={handleImageCINNoChangeBtn}
                              onClick={() => removeImageApi("ciin")}
                              style={{
                                position: "absolute",
                                right: "20px",
                                borderRadius: "8px",
                              }}
                            >
                              {" "}
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            {" "}
                            <input
                              ref={fileInputCINRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageCINNoChange}
                              style={{ color: "white", borderRadius: "10px" }}
                            />
                            {previewCINImage && (
                              <button
                                onClick={UploadImages}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                Upload
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            justifyItems: "center",
            justifyContent: "center",
          }}
        >
          <Row>
            <div
              className="col-md-3"
              style={{ marginTop: "120px", paddingLeft: "80px" }}
            >
              <div
                className="profile-image-cont"
                style={{ paddingLeft: "80px" }}
              >
                <div
                  className="profile-image-outer"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="profile-image-inner"
                    // style={{ backgroundColor: "#e97730" }}
                  >
                    {userData && userData.image !== null ? (
                      <img
                        // src={`https://console.upnetcloud.com/${userData.image}`}
                        src={`${userData.image}`}
                        alt="Image Not Available"
                        style={{ padding: "10px", color: "white" }}
                      />
                    ) : (
                      <img
                        src="/admin/images/admin/common/admin-icon.png"
                        alt="Image Not Available"
                        style={{ padding: "15px", color: "white" }}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="profile-edit-badge"
                  onClick={() => handleButtonClick()}
                >
                  <img
                    src="/admin/images/admin/13-Profile/Pen.png"
                    style={{
                      paddingRight: "5px",
                    }}
                  />
                  Edit Photo
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div
                className="details-profile-edit"
                style={{
                  overflowX: "auto", // Enable horizontal scrolling
                  whiteSpace: "nowrap", // Prevent content from wrapping
                  paddingBottom: "10px", // Optional: Space below for smooth scrolling
                  paddingRight: "20px",
                }}
              >
                {userData && (
                  <>
                    <div className="stat" style={{ width: "13rem" }}>
                      <div className="machine-icon-edit-profile">
                        <img
                          src={"/admin/images/admin/13-Profile/user-white.png"}
                        />
                      </div>
                      <div className="machine-title theme-bg-orange">
                        Company Name
                      </div>
                      <div className="mid-portion" />
                      <div
                        className="machine-subtitle theme-bg-blue"
                        style={{ width: "190px" }}
                      >
                        {userData.companyname !== null &&
                        userData.companyname !== ""
                          ? userData.companyname
                          : "N/A"}
                      </div>
                      <div
                        className="profile-edit-badge-details"
                        onClick={() => setShowEditPopup(true)}
                      >
                        <img
                          className="edit-iconimage"
                          src="/admin/images/admin/13-Profile/Pen.png"
                          style={{
                            paddingRight: "1px",
                          }}
                        />
                      </div>
                    </div>

                    {/* <div className="stat" style={{ maxWidth: "0rem",marginTop: "120px", }}>
                      <div className="profile-edit-badge"
                      onClick={() => setShowEditPopup(true)} >
                        <img
                          src="/admin/images/admin/13-Profile/Pen.png"
                          style={{
                            paddingRight: "1px",
                          }}
                        />
                      </div>
                    </div> */}

                    <div className="stat" style={{ width: "13rem" }}>
                      <div className="machine-icon-edit-profile">
                        <img
                          src={"/admin/images/admin/13-Profile/user-white.png"}
                        />
                      </div>
                      <div className="machine-title theme-bg-orange">Name</div>
                      <div className="mid-portion" />
                      <div
                        className="machine-subtitle theme-bg-blue"
                        style={{ textAlign: "center", width: "190px" }}
                      >
                        {userData.name}
                      </div>
                      <div
                        className="profile-edit-badge-details"
                        onClick={() => setShowEditPopup(true)}
                      >
                        <img
                          className="edit-iconimage"
                          src="/admin/images/admin/13-Profile/Pen.png"
                          style={{
                            paddingRight: "1px",
                          }}
                        />
                      </div>
                    </div>
                    <div className="stat" style={{ width: "13rem" }}>
                      <div className="machine-icon-edit-profile">
                        <img src={"/admin/images/admin/13-Profile/email.png"} />
                      </div>
                      <div className="machine-title theme-bg-orange">Email</div>
                      <div className="mid-portion" />
                      <div
                        className="machine-subtitle theme-bg-blue"
                        style={{ textAlign: "left", width: "190px" }}
                      >
                        {userData.email}
                      </div>
                      <div
                        className="profile-edit-badge-details"
                        onClick={() => setShowEditPopup(true)}
                      >
                        <img
                          className="edit-iconimage"
                          src="/admin/images/admin/13-Profile/Pen.png"
                          style={{
                            paddingRight: "1px",
                          }}
                        />
                      </div>
                    </div>
                    {userData.phone && (
                      <div className="stat" style={{ width: "13rem" }}>
                        <div className="machine-icon-edit-profile">
                          <img
                            src={"/admin/images/admin/13-Profile/phone.png"}
                          />
                        </div>
                        <div className="machine-title theme-bg-orange">
                          Mobile No.
                        </div>
                        <div className="mid-portion" />
                        <div
                          className="machine-subtitle theme-bg-blue"
                          style={{ width: "190px" }}
                        >
                          {userData.phone}
                        </div>
                        <div
                          className="profile-edit-badge-details"
                          // style={{
                          //   left: "90%",
                          //   top: "130px",
                          //   display: "",
                          //   width: "11px",
                          //   height: "22px",
                          //   position: "absolute",
                          //   background: "#035189",
                          //   padding: "0px 10px",
                          //   borderRadius: "25px",
                          //   color: "#fff",
                          //   textAlign: "center",
                          //   border: "2px solid #fff",
                          //   cursor: "pointer",
                          //   outline: "2px solid #035189",
                          // }}
                          onClick={() => setShowEditPopup(true)}
                        >
                          <img
                            className="edit-iconimage"
                            src="/admin/images/admin/13-Profile/Pen.png"
                            style={{
                              paddingRight: "1px",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="stat" style={{ width: "13rem" }}>
                      <div className="machine-icon-edit-profile">
                        <img
                          src={"/admin/images/admin/13-Profile/server_icon.png"}
                        />
                      </div>
                      <div className="machine-title theme-bg-orange">
                        Total Machine
                      </div>
                      <div className="mid-portion" />
                      <div
                        className="machine-subtitle theme-bg-blue"
                        style={{ width: "190px" }}
                      >
                        {vmData.total}
                      </div>
                    </div>

                    <div className="stat" style={{ width: "11rem" }}>
                      <div className="machine-icon-edit-profile">
                        <img
                          src={"/admin/images/admin/13-Profile/support.png"}
                        />
                      </div>
                      <div className="machine-title theme-bg-orange">
                        Support
                      </div>
                      <div className="mid-portion" />
                      <div
                        className="machine-subtitle theme-bg-blue"
                        style={{ width: "170px" }}
                      >
                        {supportType}
                      </div>
                    </div>

                    <div
                      className="stat"
                      style={{
                        width: "11rem",
                      }}
                    >
                      <div className="machine-icon-edit-profile">
                        <img src={"/images/admin/06-View-Stats/switch.svg"} />
                      </div>
                      <div
                        className="machine-title"
                        style={{
                          backgroundColor:
                            // monitorData && monitorData.status == 1
                            //   ? "green"
                            //   : "red",
                            "green",
                        }}
                      >
                        {/* {monitorData && monitorData.status == 1 ? "ON" : "OFF"} */}
                        2FA ON
                      </div>
                      <div className="mid-portion" />
                      <div
                        className="machine-subtitle theme-bg-blue"
                        style={{ width: "170px", cursor: "pointer" }}
                        onClick={() => ""}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {isHovered ? "Disable" : "Enable"}
                      </div>
                      {/* <div
                        className="profile-edit-badge-details"
                        onClick={() => ""}
                      >
                        <img
                          className="edit-iconimage"
                          src="/admin/images/admin/13-Profile/Pen.png"
                          style={{
                            paddingRight: "1px",
                          }}
                        />
                      </div> */}
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  backgroundImage: `url("/images/blue-box-bg.svg")`,
                  backgroundSize: "cover",
                  top: "5rem",
                  width: "100%",
                  padding: "50px 50px",
                  position: "relative",
                  backgroundColor: "#07528b",
                  borderRadius: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexWrap: "wrap",
                      zIndex: "1",
                    }}
                  >
                    <div
                      style={{
                        width: "50%",
                        padding: "0px 10px",
                      }}
                    >
                      <select
                        name="plan_time"
                        style={{
                          marginTop: "13px",
                          borderRadius: "30px",
                          marginRight: "10px",
                          padding: "10px 15px",
                          border: "2px solid rgb(255 255 255)",
                          width: "100%",
                        }}
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          GetTemp(e.target.value);
                          setIdentityImage(null);
                        }}
                      >
                        <option value="Select" selected>
                          Select Country
                        </option>

                        {AllCountryList &&
                          AllCountryList.map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                      {selectedCountry !== "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                          }}
                        >
                          <input
                            type="text"
                            className="form-control white-placeholder"
                            name="Identity Number"
                            placeholder="Identity Number"
                            disabled={chkIdentiyVerify ? true : false}
                            value={identityNum}
                            style={{
                              color: "white",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              flex: "1",
                              padding: "5px",
                            }}
                            onChange={(e) => setIdentityNum(e.target.value)}
                          />

                          {chkIdentiyVerify && (
                            <img
                              src="/images/verified_success.png"
                              style={{
                                height: "30px",
                                width: "30px",
                                marginRight: "3px",
                              }}
                            />
                          )}
                          <button
                            style={{
                              width: "60px",
                              color: "black",
                              marginRight: "5px",
                              borderRadius: "8px",
                            }}
                            onClick={
                              chkIdentiyVerify ? identityEdit : IdentityVerify
                            }
                          >
                            {chkIdentiyVerify ? "Edit" : "Verify"}
                          </button>
                        </div>
                      )}
                      {/* GST Number */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                          }}
                        >
                          <input
                            type="text"
                            id="Gst Number"
                            className="form-control white-placeholder"
                            name="Gst Number"
                            placeholder="GST Number"
                            disabled={chkGSTVerify ? true : false}
                            value={gstNum}
                            style={{
                              color: "white",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              flex: "1",
                              padding: "5px",
                            }}
                            onChange={(e) => setGstNum(e.target.value)}
                          />
                          {/* <button
                            style={{color: "black", backgroundColor: "white"}}
                            onClick={ gstVerify}>
                          Verify
                        </button> */}

                          {chkGSTVerify && (
                            <img
                              src="/images/verified_success.png"
                              style={{
                                height: "30px",
                                width: "30px",
                                marginRight: "3px",
                              }}
                            />
                          )}
                          <button
                            style={{
                              width: "60px",
                              color: "black",
                              marginRight: "5px",
                              borderRadius: "8px",
                            }}
                            onClick={chkGSTVerify ? gstEdit : gstVerify}
                          >
                            {chkGSTVerify ? "Edit" : "Verify"}
                          </button>
                        </div>
                      )}
                      {/* Adhar Number */}
                      {!chkGSTVerify &&
                        !chkAdharVerify &&
                        !chkPANVerify &&
                        !chkCompPANVerify &&
                        !chkCINVerify &&
                        selectedCountry === "India" && (
                          <div class="arrow">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        )}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                          }}
                        >
                          <input
                            type="Number"
                            id="Adhar Number"
                            className="no-arrows form-control white-placeholder"
                            name="Adhar Number"
                            placeholder="Aadhar Number"
                            disabled={chkAdharVerify ? true : false}
                            value={adharNum}
                            style={{
                              color: "white",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              flex: "1",
                              padding: "5px",
                            }}
                            onChange={(e) => setAdharNum(e.target.value)}
                          />
                          {/* <button
                            style={{color: "black", backgroundColor: "white"}}
                            onClick={ generateaadhar_otp}>
                          Verify
                        </button> */}

                          {/* <button className= {chkAdharVerify ? "verified-button" : ""}
                            style={{color: chkAdharVerify ? "white" : "black", marginRight: "5px"}}
                            onClick={chkAdharVerify ? empty : generateaadhar_otp}>
                             {chkAdharVerify ? <span className="checkmark">&#x2714;</span> : <></> }
                              </button> */}

                          {chkAdharVerify && (
                            <img
                              src="/images/verified_success.png"
                              style={{ height: "34px", width: "34px" }}
                            />
                          )}
                          <button
                            className={`${
                              !chkGSTVerify &&
                              !chkAdharVerify &&
                              !chkPANVerify &&
                              !chkCompPANVerify &&
                              !chkCINVerify &&
                              "loader"
                            }`}
                            style={{
                              height: "30px",
                              width: "60px",
                              color: "black",
                              marginRight: "5px",
                              borderRadius: "8px",
                            }}
                            onClick={
                              chkAdharVerify ? adharEdit : generateaadhar_otp
                            }
                          >
                            {chkAdharVerify ? "Edit" : "Verify"}
                          </button>
                        </div>
                      )}
                      {/* PAN Number */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                          }}
                        >
                          <input
                            type="text"
                            id="PAN no"
                            className="form-control white-placeholder"
                            name="PAN no"
                            placeholder="PAN Number"
                            disabled={chkPANVerify ? true : false}
                            value={panNum}
                            style={{
                              color: "white",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              flex: "1",
                              padding: "5px",
                            }}
                            onChange={(e) => setPanNum(e.target.value)}
                          />
                          {/* <button className= {chkPANVerify ? "verified-button" : ""}
                            style={{color: chkPANVerify ? "white" : "black", marginRight: "5px"}}
                            onClick={chkPANVerify ? empty : panVerify}>
                             {chkPANVerify ? <span className="checkmark">&#x2714;</span> : <></> }
                        </button> */}
                          {chkPANVerify && (
                            <img
                              src="/images/verified_success.png"
                              style={{ height: "34px", width: "34px" }}
                            />
                          )}
                          <button
                            style={{
                              width: "60px",
                              color: "black",
                              marginRight: "5px",
                              borderRadius: "8px",
                            }}
                            onClick={chkPANVerify ? panEdit : panVerify}
                          >
                            {chkPANVerify ? "Edit" : "Verify"}
                          </button>
                        </div>
                      )}
                      {/* Company PAN No.. */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                          }}
                        >
                          <input
                            type="text"
                            id="Company PAN"
                            className="form-control white-placeholder"
                            name="Company PAN"
                            placeholder={"Company PAN No."}
                            disabled={chkCompPANVerify ? true : false}
                            value={compPANNum}
                            style={{
                              color: "white",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              flex: "1",
                              padding: "5px",
                            }}
                            onChange={(e) => setCompPANNum(e.target.value)}
                          />
                          {chkCompPANVerify && (
                            <img
                              src="/images/verified_success.png"
                              style={{ height: "34px", width: "34px" }}
                            />
                          )}
                          <button
                            style={{
                              width: "60px",
                              color: "black",
                              marginRight: "5px",
                              borderRadius: "8px",
                            }}
                            onClick={
                              chkCompPANVerify ? compPANEdit : compPanVerify
                            }
                          >
                            {chkCompPANVerify ? "Edit" : "Verify"}
                          </button>
                        </div>
                      )}
                      {/* CIN No */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                          }}
                        >
                          <input
                            type="text"
                            id="CIN No"
                            className="form-control white-placeholder"
                            name="CIN No"
                            placeholder="CIN No."
                            disabled={chkCINVerify ? true : false}
                            value={cinNum}
                            style={{
                              color: "white",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              flex: "1",
                              padding: "5px",
                            }}
                            onChange={(e) => setCINNum(e.target.value)}
                          />
                          {/* <button
                            style={{color: "black", backgroundColor: "white"}}
                            onClick={ cinVerify}>
                          Verify
                        </button> */}

                          {/* <button className= {chkCINVerify ? "verified-button" : ""}
                            style={{color: chkCINVerify ? "white" : "black", marginRight: "5px"}}
                            onClick={chkCINVerify ? empty : cinVerify}>
                             {chkCINVerify ? <span className="checkmark">&#x2714;</span> : <></> }
                              </button> */}

                          {chkCINVerify && (
                            <img
                              src="/images/verified_success.png"
                              style={{ height: "34px", width: "34px" }}
                            />
                          )}
                          <button
                            style={{
                              width: "60px",
                              color: "black",
                              marginRight: "5px",
                              borderRadius: "8px",
                            }}
                            onClick={chkCINVerify ? cinnoEdit : cinVerify}
                          >
                            {chkCINVerify ? "Edit" : "Verify"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        width: "50%",
                        padding: "0px 10px",
                      }}
                    >
                      {selectedCountry === "India" ? (
                        <select
                          name="plan_time"
                          style={{
                            marginTop: "10px",
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid rgb(255 255 255)",
                            width: "100%",
                          }}
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                        >
                          <option value="Select" selected>
                            Select State
                          </option>
                          {userStates &&
                            userStates.map((item, index) => (
                              <option key={index} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <select
                          name="plan_time"
                          style={{
                            marginTop: "10px",
                            borderRadius: "30px",
                            marginRight: "10px",
                            padding: "10px 15px",
                            border: "2px solid rgb(255 255 255)",
                            width: "100%",
                          }}
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                        >
                          <option value="Select" selected>
                            Select Province
                          </option>
                          {userStates &&
                            userStates.map((item, index) => (
                              <option key={index} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      )}

                      {/* Identity Image */}
                      {selectedCountry !== "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                            height: "45px",
                          }}
                        >
                          {userData && userData.identity_image !== null ? (
                            <>
                              <a
                                style={{
                                  marginTop: "2px",
                                  marginLeft: "5%",
                                  color: "white",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setPreviewImagePopup(
                                      userData && `${userData.identity_image}`
                                    );
                                    setShowImagePopup(true);
                                  }}
                                  style={{ borderRadius: "8px" }}
                                >
                                  View
                                </button>{" "}
                                Identity Image
                              </a>
                              <button
                                onClick={() => removeImageApi("identity")}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                {" "}
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                ref={fileInputIdentityRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageIdentityChange}
                                style={{ color: "white", borderRadius: "10px" }}
                              />
                              {/* {previewIdentityImage && (
                                <button
                                  onClick={UploadImages}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Upload
                                </button>
                              )} */}
                            </>
                          )}
                        </div>
                      )}

                      {/* GST IMage */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                            height: "45px",
                          }}
                        >
                          {userData && userData.gst_image !== null ? (
                            <>
                              <a
                                style={{
                                  marginTop: "2px",
                                  marginLeft: "5%",
                                  color: "white",
                                }}
                                // href={
                                //   userData &&
                                //   `https://console.upnetcloud.com/${userData.gst_image}`
                                // }
                                //href={userData && `${userData.gst_image}`}
                                // target="_blank"
                                // rel="noopener noreferrer"
                              >
                                <button
                                  onClick={() => {
                                    setPreviewImagePopup(
                                      userData && `${userData.gst_image}`
                                    );
                                    setShowImagePopup(true);
                                  }}
                                  style={{ borderRadius: "8px" }}
                                >
                                  View
                                </button>{" "}
                                GST or VAT Image
                              </a>
                              <button
                                onClick={() => removeImageApi("gst")}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                {" "}
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                ref={fileInputGSTRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageGSTChange}
                                style={{ color: "white", borderRadius: "10px" }}
                              />
                              {previewGSTImage && (
                                <button
                                  onClick={UploadImages}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Upload
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {/* Adhar Number */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                            height: "45px",
                          }}
                        >
                          {userData && userData.aadhar_image !== null ? (
                            <>
                              <a
                                style={{
                                  marginTop: "2px",
                                  marginLeft: "5%",
                                  color: "white",
                                }}
                                // href={
                                //   userData &&
                                //   `https://console.upnetcloud.com/${userData.aadhar_image}`
                                // }
                                //href={userData && `${userData.aadhar_image}`}
                                // target="_blank"
                                // rel="noopener noreferrer"
                              >
                                <button
                                  onClick={() => {
                                    setPreviewImagePopup(
                                      userData && `${userData.aadhar_image}`
                                    );
                                    setShowImagePopup(true);
                                  }}
                                  style={{ borderRadius: "8px" }}
                                >
                                  View
                                </button>{" "}
                                Adhar Image
                              </a>

                              {/* <button
                                onClick={handleImageAdharChangeBtn}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                {" "}
                                Remove
                              </button> */}

                              <button
                                //onClick={handleImageAdharChangeBtn}
                                onClick={() => removeImageApi("aadhar")}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                {" "}
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                ref={fileInputAdharRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageAdharChange}
                                style={{ color: "white", borderRadius: "10px" }}
                              />
                              {previewAdharImage && (
                                <button
                                  onClick={UploadImages}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Upload
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {/* PAN Image */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                            height: "45px",
                          }}
                        >
                          {userData && userData.pan_image !== null ? (
                            <>
                              {" "}
                              <a
                                style={{
                                  marginTop: "2px",
                                  marginLeft: "5%",
                                  color: "white",
                                }}
                                // href={
                                //   userData &&
                                //   `https://console.upnetcloud.com/${userData.pan_image}`
                                // }
                                //href={userData && `${userData.pan_image}`}
                                // target="_blank"
                                // rel="noopener noreferrer"
                              >
                                <button
                                  onClick={() => {
                                    setPreviewImagePopup(
                                      userData && `${userData.pan_image}`
                                    );
                                    setShowImagePopup(true);
                                  }}
                                  style={{ borderRadius: "8px" }}
                                >
                                  View
                                </button>{" "}
                                PAN Card Image
                              </a>
                              <button
                                // onClick={handleImagePANChangeBtn}
                                onClick={() => removeImageApi("pan")}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                {" "}
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                ref={fileInputPANRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImagePANChange}
                                style={{ color: "white", borderRadius: "10px" }}
                              />
                              {previewPANImage && (
                                <button
                                  onClick={UploadImages}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Upload
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {/* Company PAN Image */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                            height: "45px",
                          }}
                        >
                          {userData && userData.driving_licence_img !== null ? (
                            <>
                              <a
                                style={{
                                  marginTop: "2px",
                                  marginLeft: "5%",
                                  color: "white",
                                }}
                                // href={
                                //   userData &&
                                //   `https://console.upnetcloud.com/${userData.driving_licence_img}`
                                // }
                                // href={
                                //   userData && `${userData.driving_licence_img}`
                                // }
                                // target="_blank"
                                // rel="noopener noreferrer"
                              >
                                <button
                                  onClick={() => {
                                    setPreviewImagePopup(
                                      userData &&
                                        `${userData.driving_licence_img}`
                                    );
                                    setShowImagePopup(true);
                                  }}
                                  style={{ borderRadius: "8px" }}
                                >
                                  View
                                </button>{" "}
                                Company PAN image
                              </a>
                              <button
                                //onClick={handleImageCompanyPANChangeBtn}
                                onClick={() => removeImageApi("driver")}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                {" "}
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              {" "}
                              <input
                                ref={fileInputCompanyPANRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageCompanyPANChange}
                                style={{ color: "white", borderRadius: "10px" }}
                              />
                              {previewCompanyPANImage && (
                                <button
                                  onClick={UploadImages}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Upload
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {/* CIN Image */}
                      {selectedCountry === "India" && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid white",
                            borderRadius: "25px",
                            padding: "5px",
                            height: "45px",
                          }}
                        >
                          {userData && userData.ciin_img !== null ? (
                            <>
                              <a
                                style={{
                                  marginTop: "2px",
                                  marginLeft: "5%",
                                  color: "white",
                                }}
                                // href={
                                //   userData &&
                                //   `https://console.upnetcloud.com/${userData.ciin_img}`
                                // }
                                //href={userData && `${userData.ciin_img}`}
                                // target="_blank"
                                // rel="noopener noreferrer"
                              >
                                <button
                                  onClick={() => {
                                    setPreviewImagePopup(
                                      userData && `${userData.ciin_img}`
                                    );
                                    setShowImagePopup(true);
                                  }}
                                  style={{ borderRadius: "8px" }}
                                >
                                  View
                                </button>{" "}
                                CIN No Image
                              </a>
                              <button
                                //onClick={handleImageCINNoChangeBtn}
                                onClick={() => removeImageApi("ciin")}
                                style={{
                                  position: "absolute",
                                  right: "20px",
                                  borderRadius: "8px",
                                }}
                              >
                                {" "}
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              {" "}
                              <input
                                ref={fileInputCINRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageCINNoChange}
                                style={{ color: "white", borderRadius: "10px" }}
                              />
                              {previewCINImage && (
                                <button
                                  onClick={UploadImages}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Upload
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </div>
      )}
      <div className="apptoast-align">
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>
      {loading && (
        <div
          className="loading-overlay"
          style={{ position: "absolute", zIndex: "9999999999999999999" }}
        >
          <Loader isLoading={loading} />
        </div>
      )}
    </div>
  );
};

export default Profile;
