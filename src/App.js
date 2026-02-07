import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Header from "./Components/Header";
import { useEffect, useState } from "react";
import { UserProvider } from "./UserContext";
// import { generateToken, messaging } from "./firebase";
// import firebaseApp from "./firebase";
import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";
import SolutionsPage from "./Components/SolutionsPage";
import Blog from "./Components/Blog";
import ProductPage from "./Components/ProductPage";

import Login from "./Components/User/Login";
import HeaderLeft from "./Components/HeaderLeft";
import SignUp from "./Components/User/SignUp";
import PricingPage from "./Components/PricingPage";
import Profile from "./Components/User/Profile";
import Footer from "./Components/Footer";
import TermsConditions from "./Components/TermsConditions";
import BillingPage from "./Components/RegisteredUser/BillingPage";
import SupportPage from "./Components/RegisteredUser/SupportPage";
import MonitoringPage from "./Components/RegisteredUser/MonitoringPage";
import CDNPage from "./Components/RegisteredUser/CDNPage";
import CreateMachine from "./Components/RegisteredUser/CreateMachine";
import WalletPage from "./Components/RegisteredUser/WalletPage";
import ChangePassword from "./Components/User/ChangePassword";
import MyMachinePage from "./Components/RegisteredUser/MyMachinePage";
import UtilisationsPage from "./Components/RegisteredUser/UtilisationsPage";
import BlogsMore from "./Components/Details/BlogsMore";
import { useAuth } from "./AuthContext";
import Notification from "./Components/RegisteredUser/Notification";
import PaymentData from "./Components/RegisteredUser/PaymentData";
import BillReport from "./Components/RegisteredUser/BillReport";
import InvoicePage from "./Components/User/InvoicePage";
import MachineStatus from "./Components/RegisteredUser/MachineStatus";
import EditMachine from "./Components/RegisteredUser/EditMachine";
// import ProductDetails from "./Components/ProductDetailsWindows";
import EmailVerification from "./Components/RegisteredUser/EmailVerification";
import ProductDetailsUbantu from "./Components/ProductDetailsUbantu";
import ProductDetailsWindows from "./Components/ProductDetailsWindows";
import ForgotPassword from "./Components/User/ForgotPassword";
import ResetPassword from "./Components/User/ResetPassword";
import { generateToken, messaging } from "./firebase";
import { createGlobalStyle } from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import AppToast from "./AppToast";
import instance, { decryptData } from "./Api";
import { DropdownProvider } from "./Components/Header";
import SettingsPage from "./Components/User/Settings";
import VMAssignPage from "./Components/User/VMAssignPage";
import AssignedMachinePage from "./Components/User/AssignedMachinePage";
import AssignedCDNPage from "./Components/User/AssignedCDNPage";
import UserSupportPage from "./Components/User/UserSupportPage";
import RestorePricingPage from "./Components/RestorePricingPage";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import SolutionDetailPage from "./Components/SolutionDetailPage";
import BlogSearchPage from "./Components/Details/BlogSearchPage";
import NotServed from "./Components/NotServed/NotServedPage";
import StripePayment from "./StripePayment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentPage from "./StripePaymentPage";
import OTPVerify2FA from "./Components/User/OTPVerify2FA";
import ChildUserPage from "./Components/User/ChildUserPage";
import StripePaymentPage from "./StripePaymentPage";
import MonitorGraph from "./Components/RegisteredUser/MonitorGraph";

// import getMAC from "getmac";
// import * as FingerprintJS from "fingerprintjs2";

const App = () => {
  const [popup, setPopup] = useState(true);
  const [userIP, setUserIP] = useState(null);
  const [country, setCountry] = useState("India");
  const [newUser, setNewUser] = useState(null);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const { smuser, isLoginByParentUser } = useAuth();

  function isMobileDevice() {
    return window.matchMedia("(max-width: 1200px)").matches;
  }
  const FetchUser = () => {
    const storedUserData = localStorage.getItem("NEW_USER");
    // const storedSocial = localStorage.getItem("SocialLogin");
    // ocalStorage.setItem("SocialLogin", true);
    return storedUserData ? JSON.parse(storedUserData) : null;
  };

  // useEffect(() => {
  //   const client = new ClientJS();
  //   const fingerprint = client.getFingerprint();
  //   console.log(fingerprint); // Unique fingerprint
  // }, []);

  const sendTokenToServer = async () => {
    if (localStorage.getItem("NewfcmUPNET") !== null) {
      const storedUserFcmToken = localStorage
        .getItem("NewfcmUPNET")
        .replace(/"/g, "");
      if (storedUserFcmToken) {
        await updateNotification(storedUserFcmToken);
      }
    } else {
      const token = await generateToken();
      if (token) {
        await updateNotification(token);
      }
    }
  };

  const updateNotification = async (token) => {
    try {
      await instance.post(
        `/saveUnauthUsersDeviceDetails?id=1&FCM_TOKEN=${token}&FINGERPRINT=${null}&DEVICE_LANGUAGE=${null}`
      );
    } catch (error) {
      console.error("Error saving FCM token:", error);
    }
  };

  useEffect(() => {
    sendTokenToServer();
    onMessage(messaging, (payload) => {
      let notificationTitle;
      let notificationOptions;
      if (payload.notification) {
        notificationTitle = payload.notification.title;
        notificationOptions = {
          body: payload.notification.body,
          icon: payload.notification.image,
          image: payload.data.image, 
        };
      } else if (payload.data) {
        notificationTitle = payload.data.title;
        notificationOptions = {
          body: payload.data.body,
          icon: payload.data.image,
          image: payload.data.image,
        };
      }

      toast((t) => (
        <AppToast
          id={t.id}
          message={`${payload.data.title}\n ${payload.data.body}`}
        />
      ));

      console.log(payload);
    });

    async function fetchUserIP() {
      try {

        const data = await window.fetchIPData(); 
        if (data && data.country_name) {
          setCountry(data.country_name);
          localStorage.setItem("current_country", data.country_name);
          setUserIP(data.ip);
        } else {
          throw new Error("Invalid IP data");
        }
      } catch (error) {
        console.error("Error fetching user IP:", error);
        setUserIP(null); 
      }
    }
    console.log(
      window.navigator.userAgent,
      window.navigator.language,
      window.getUserIP(),
      "window.navigator.userAgent"
    );
    fetchUserIP();
    function handleResize() {
      setIsMobile(isMobileDevice());
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [userIP]);

  
  const GlobalStyle = createGlobalStyle`
  body {
    background-image: url('/main-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: round;
    height: 100vh;
    margin: 0;
    width: 100%;
  }
`;

  const stripePromise = loadStripe(
    "pk_test_51OuUXdSJRv4SF2lDndvO2OGpb6PDwa9RM52p0ZtysACVET8x6di0EfKdvkA1j3nGMJEBjTFHrWbBuHoYeY038vU300tPGRTYei"
  );

  const options = {
    mode: "payment",
    amount: 1099,
    currency: "usd",
    appearance: {
      /*...*/
    },
  };

  return (
    <>
      <Router>
        {/* {country == "India" ? ( */}
        <DropdownProvider>
          <UserProvider>
            <GlobalStyle />
            <div
              style={{
                width: "100%",
                minHeight: isMobile ? "" : "75rem",
                position: "relative",
                backgroundImage: isMobile
                  ? `url(./main-bg.jpg)`
                  : `url(./main-bg.jpg)`,
                backgroundSize: "cover",
                backgroundRepeat: "round",
                backgroundBlendMode: "overlay",
              }}
              onClick={() => setPopup(!popup)}
            >
              {newUser === null ? (
                <Header user={newUser} popup={popup} ip={userIP} />
              ) : (
                <Header popup={popup} />
              )}
              {userIP && (
                <div>
                  <Routes>
                    <>
                      {/* Common Route */}
                      <Route
                        path="/"
                        element={<Home ip={userIP} user={newUser} />}
                      />
                      <Route
                        path="/solutions"
                        element={<SolutionsPage ip={userIP} />}
                      />
                      <Route
                        path="/solutiondetail"
                        element={<SolutionDetailPage ip={userIP} />}
                      />
                      <Route
                        path="/blog"
                        element={<Blog ip={userIP} isMobile={isMobile} />}
                      />
                      <Route
                        path="/blogmore"
                        element={<BlogsMore ip={userIP} />}
                      />
                      <Route
                        path="/blogsearch"
                        element={<BlogSearchPage ip={userIP} />}
                      />
                      <Route
                        path="/product"
                        element={<ProductPage isMobile={isMobile} />}
                      />
                      <Route
                        path="/product-details-ubantu"
                        element={
                          <ProductDetailsUbantu
                            isMobile={isMobile}
                            ip={userIP}
                          />
                        }
                      />
                      <Route
                        path="/product-details-windows"
                        element={<ProductDetailsWindows isMobile={isMobile} />}
                      />
                      <Route
                        path="/pricing"
                        element={<PricingPage isMobile={isMobile} />}
                      />
                      <Route
                        path="/termsConditions"
                        element={<TermsConditions isMobile={isMobile} />}
                      />
                      <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicy isMobile={isMobile} />}
                      />
                      <Route
                        path="/login"
                        element={<Login isMobile={isMobile} ip={userIP} />}
                      />
                      <Route
                        path="/otpverify-2fa"
                        element={
                          <OTPVerify2FA isMobile={isMobile} ip={userIP} />
                        }
                      />
                      <Route
                        path="/signUp"
                        element={<SignUp isMobile={isMobile} ip={userIP} />}
                      />
                      <Route
                        path="/vm/create"
                        element={
                          smuser !== null && isLoginByParentUser == 1 ? (
                            <CreateMachine isMobile={isMobile} />
                          ) : smuser !== null && isLoginByParentUser == 0 ? (
                            <></>
                          ) : (
                            <SignUp isMobile={isMobile} />
                          )
                        }
                      />
                      <Route
                        path="/bill"
                        element={
                          smuser !== null && isLoginByParentUser == 1 ? (
                            <BillingPage isMobile={isMobile} />
                          ) : smuser !== null && isLoginByParentUser == 0 ? (
                            <></>
                          ) : (
                            <SignUp isMobile={isMobile} />
                          )
                        }
                      />
                      <Route
                        path="/forgotpassword"
                        element={<ForgotPassword isMobile={isMobile} />}
                      />
                      <Route
                        path="/reset_password/*"
                        element={<ResetPassword isMobile={isMobile} />}
                      />
                      <Route
                        path="/change-password"
                        element={<ChangePassword isMobile={isMobile} />}
                      />
                      <Route
                        path="/email/verification"
                        element={<EmailVerification isMobile={isMobile} />}
                      />

                      {/* Parent User Route */}
                      {smuser !== null && isLoginByParentUser == 1 ? (
                        <>
                          <Route
                            path="/create-ticket"
                            element={<SupportPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm/monitor"
                            element={<MonitoringPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/wallet"
                            element={<WalletPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm-machine"
                            element={<MyMachinePage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm/moniter/utilize"
                            element={<UtilisationsPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm/cdn"
                            element={<CDNPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/settings"
                            element={
                              <SettingsPage isMobile={isMobile} ip={userIP} />
                            }
                          />
                          <Route
                            path="/childuser"
                            element={
                              <ChildUserPage isMobile={isMobile} ip={userIP} />
                            }
                          />
                          <Route
                            path="/vm-assign"
                            element={
                              <VMAssignPage isMobile={isMobile} ip={userIP} />
                            }
                          />
                          <Route
                            path="/assigned-vm"
                            element={
                              <AssignedMachinePage
                                isMobile={isMobile}
                                ip={userIP}
                              />
                            }
                          />
                          <Route
                            path="/assigned-cdn"
                            element={
                              <AssignedCDNPage
                                isMobile={isMobile}
                                ip={userIP}
                              />
                            }
                          />
                          <Route
                            path="/user-create-ticket"
                            element={
                              <UserSupportPage
                                isMobile={isMobile}
                                ip={userIP}
                              />
                            }
                          />
                          <Route
                            path="/restore-pricing"
                            element={
                              <RestorePricingPage
                                isMobile={isMobile}
                                ip={userIP}
                              />
                            }
                          />
                          <Route
                            path="/edit-profile"
                            element={<Profile isMobile={isMobile} />}
                          />{" "}
                          <Route
                            path="/notification"
                            element={<Notification isMobile={isMobile} />}
                          />
                          <Route
                            path="/paymentdata"
                            element={<PaymentData isMobile={isMobile} />}
                          />
                          <Route
                            path="/billreport"
                            element={<BillReport isMobile={isMobile} />}
                          />
                          <Route
                            path="/invoice"
                            element={<InvoicePage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm/status"
                            element={<MachineStatus isMobile={isMobile} />}
                          />
                          <Route
                            path="/edit-vm"
                            element={<EditMachine isMobile={isMobile} />}
                          />
                          <Route
                            path="/succes-payment"
                            element={<EditMachine isMobile={isMobile} />}
                          />
                          {/* <Route
                            path="/stripe-payment"
                            element={<StripePayment />}
                          /> */}
                          {/* <Route
                            path="/stripe-payment"
                            element={
                              <Elements stripe={stripePromise}>
                                <StripePayment />
                              </Elements>
                            }
                          /> */}
                          <Route
                            path="/stripe-paymentpage"
                            element={<StripePaymentPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/monitor-graph"
                            element={<MonitorGraph isMobile={isMobile} />}
                          />
                        </>
                      ) : smuser !== null && isLoginByParentUser == 0 ? (
                        <>
                          {/* Child User Route */}
                          <Route
                            path="/create-ticket"
                            element={<SupportPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm/monitor"
                            element={<MonitoringPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm-machine"
                            element={<MyMachinePage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm/moniter/utilize"
                            element={<UtilisationsPage isMobile={isMobile} />}
                          />
                          <Route
                            path="/vm/cdn"
                            element={<CDNPage isMobile={isMobile} />}
                          />
                          {/* <Route
                            path="/restore-pricing"
                            element={
                              <RestorePricingPage
                                isMobile={isMobile}
                                ip={userIP}
                              />
                            }
                          /> */}
                          <Route
                            path="/edit-profile"
                            element={<Profile isMobile={isMobile} />}
                          />{" "}
                          <Route
                            path="/notification"
                            element={<Notification isMobile={isMobile} />}
                          />
                          {/* <Route
                            path="/paymentdata"
                            element={<PaymentData isMobile={isMobile} />}
                          /> */}
                          {/* <Route
                            path="/billreport"
                            element={<BillReport isMobile={isMobile} />}
                          />
                          <Route
                            path="/invoice"
                            element={<InvoicePage isMobile={isMobile} />}
                          /> */}
                          <Route
                            path="/vm/status"
                            element={<MachineStatus isMobile={isMobile} />}
                          />
                          {/* <Route
                            path="/edit-vm"
                            element={<EditMachine isMobile={isMobile} />}
                          /> */}
                          {/* <Route
                            path="/succes-payment"
                            element={<EditMachine isMobile={isMobile} />}
                          /> */}
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  </Routes>
                </div>
              )}

              <Footer ip={userIP} />
              {/* {isMobile && <Footer />} */}
            </div>
            <HeaderLeft />
          </UserProvider>
        </DropdownProvider>
        {/* ) : (
          <NotServed />
        )} */}
      </Router>
    </>
  );
};

export default App;
