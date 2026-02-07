// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCbVVfPY8aTQcY93vYB9pHAY5d23j4WOGY",
  authDomain: "upnetcloud-28bf0.firebaseapp.com",
  projectId: "upnetcloud-28bf0",
  storageBucket: "upnetcloud-28bf0.appspot.com",
  messagingSenderId: "548381202011",
  appId: "1:548381202011:web:ca4deea946a4f9e3ba117e",
  measurementId: "G-77BLLS7GEP",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

export const generateToken = async () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  const permission = await Notification.requestPermission();
  // console.warn(permission);
  const registration = await navigator.serviceWorker.register(
    "./firebase-messaging-sw.js"
  );

  // Wait for serviceWorker.ready
  await navigator.serviceWorker.ready;
  if (permission === "granted") {
    var token = "";
    // const token = await getToken(messaging, {
    //   serviceWorkerRegistration: registration,
    //   vapidKey:
    //     "BNu5kkLYf1C8f4UOWyiGFi3j22kiOwn8GAvpnbL7CTtjy2FF1B7A0muqAWETgZBSEHKrUOdAu5OET3UvWoHh_qU",
    // })
    //   .then((currentToken) => {
    //     if (currentToken) {
    //       console.log("FCM Token:", currentToken);
    //     } else {
    //       console.log(
    //         "No registration token available. Request permission to generate one."
    //       );
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("An error occurred while retrieving token:", err);
    //   });
    try {
      const registration = await navigator.serviceWorker.ready;
      const currentToken = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey:
          "BNu5kkLYf1C8f4UOWyiGFi3j22kiOwn8GAvpnbL7CTtjy2FF1B7A0muqAWETgZBSEHKrUOdAu5OET3UvWoHh_qU",
      });
      // console.log(currentToken, "token");
      token = currentToken;
      localStorage.setItem("NewfcmUPNET", JSON.stringify(currentToken));
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        // setToken(currentToken); // Store the token in state or send it to your server
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.error("An error occurred while retrieving token:", err);
      // setError(err.message);
    }

    // console.log(token, "token");
    // messaging
    //   .getToken({
    //     vapidKey:
    //       "BNu5kkLYf1C8f4UOWyiGFi3j22kiOwn8GAvpnbL7CTtjy2FF1B7A0muqAWETgZBSEHKrUOdAu5OET3UvWoHh_qU",
    //   })
    //   .then((currentToken) => {
    //     if (currentToken) {
    //       console.log("FCM Token:", currentToken);
    //     } else {
    //       console.log(
    //         "No registration token available. Request permission to generate one."
    //       );
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("An error occurred while retrieving token:", err);
    //   });
    //localStorage.setItem("NewfcmUPNET", JSON.stringify(token));
    return token;
  }
};

export default firebaseApp;
