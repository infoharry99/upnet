importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker
// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

const firebaseConfig = {
  // apiKey: "AIzaSyC6LJwOCz59yI_wZ1N3BGVUzJ7fzrkT4o4",
  // authDomain: "demobebu.firebaseapp.com",
  // projectId: "demobebu",
  // storageBucket: "demobebu.appspot.com",
  // messagingSenderId: "836912395201",
  // appId: "1:836912395201:web:a68c71acd67c1941243540",
  apiKey: "AIzaSyCbVVfPY8aTQcY93vYB9pHAY5d23j4WOGY",
  authDomain: "upnetcloud-28bf0.firebaseapp.com",
  projectId: "upnetcloud-28bf0",
  storageBucket: "upnetcloud-28bf0.appspot.com",
  messagingSenderId: "548381202011",
  appId: "1:548381202011:web:ca4deea946a4f9e3ba117e",
  measurementId: "G-77BLLS7GEP",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(payload, "onBackgroundMessage");

  let notificationTitle;
  let notificationOptions;

  // Check if notification data is directly available or within data
  // if (payload.notification) {
  //   notificationTitle = payload.notification.title;
  //   notificationOptions = {
  //     body: payload.notification.body,
  //     icon: payload.notification.image,
  //     image: payload.data.image, // Display the image in the notification if supported
  //   };
  // } else if (payload.data) {
  notificationTitle = payload.data.title;
  notificationOptions = {
    body: payload.data.body,
    icon: payload.data.image,
    image: payload.data.image, // Display the image in the notification if supported
  };
  //}
  console.log(payload.notification);
  console.log(payload.data);

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  // console.log("Notification click received.", event);

  // Close the notification
  event.notification.close();

  // Define the URL you want to open
  const clickActionUrl = "https://upnetcloud.com/"; // Replace with your PWA or website URL

  // Open the URL or focus if it's already open
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if (client.url === clickActionUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(clickActionUrl);
        }
      })
  );
});
