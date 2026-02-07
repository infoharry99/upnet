import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
// Go_CLIENT_ID = '867679532540-61nng56kf1lpseig8i98o0uf3tnqqg1m.apps.googleusercontent.com'
// bebbbu : 14688835477-9l3s4022au3ro4g6gijf223d2paai2bp.apps.googleusercontent.com
//  353355576045-jaluuosa8s012a5c0tn06tg9rg3u6p4f.apps.googleusercontent.com
serviceWorkerRegistration.register();

root.render(
  <GoogleOAuthProvider clientId="353355576045-q0f89hue0s12oqeb082fm7t86udqbj9s.apps.googleusercontent.com">
    <React.StrictMode>
      {/* <UserProvider> */}
      <AuthProvider>
        <App />
      </AuthProvider>
      {/* </UserProvider> */}
    </React.StrictMode>
  </GoogleOAuthProvider>
);

//register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
