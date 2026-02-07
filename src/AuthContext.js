import React, { createContext, useContext, useState } from "react";

// Create a context object
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [smuser, setSmuser] = useState(null); // State to manage user data
  const [isLoginByParentUser, setLoginByParentUser] = useState(null);
  const [currencyRates, setCurrencyRate] = useState(null);
  const [appCurrency, setAppCurrency] = useState(null);
  //   const [currentCurrency, setCurrentCurrency] = useState(null);

  const updateCurrencyRate = (currencyData) => {
    console.log("updateCurrencyRate>>>", currencyData);
    // if (smuser.prefer_currency === "EUR") {
    //   setCurrencyRate(currencyData.cu_EURO);
    // } else if (smuser.prefer_currency === "GBP") {
    //   setCurrencyRate(currencyData.cu_GBP);
    // } else if (smuser.prefer_currency === "INR") {
    //   setCurrencyRate(currencyData.cu_INR);
    // } else if (smuser.prefer_currency === "USD") {
    //   setCurrencyRate(currencyData.cu_USD);
    // } else if (smuser.prefer_currency === "AED") {
    //   setCurrencyRate(currencyData.cu_AED);
    // }

    setCurrencyRate(currencyData);
    localStorage.setItem("currentRate", JSON.stringify(currencyRates));
  };

  const updateAppCurrency = (currencyData) => {
    setAppCurrency(currencyData);
    localStorage.setItem("appCurrency", currencyData);
  };

  const login = (userData) => {
    setSmuser(userData);
    localStorage.setItem("user_sm", JSON.stringify(userData));

    if (userData.is_main == 0 && userData.parent_id !== null) {
      setLoginByParentUser(0);
      localStorage.setItem("user_sm_parent", 0);
      window.location.href = "/vm-machine";
    } else {
      setLoginByParentUser(1);
      localStorage.setItem("user_sm_parent", 1);
      window.location.href = "/vm/create";
    }
  };

  const updateUserDetails = (userData) => {
    setSmuser(userData);
    localStorage.setItem("user_sm", JSON.stringify(userData));
  };

  const logout = () => {
    setSmuser(null);
    localStorage.removeItem("user_sm");
    localStorage.removeItem("user_sm_parent");
    localStorage.removeItem("surcharge");
    window.location.href = "/";
  };

  // Check if the user is already logged in from localStorage
  // This is useful for maintaining user session on page reload
  useState(() => {
    const storedUser = localStorage.getItem("user_sm");
    const storedRate = localStorage.getItem("currentRate");
    const storedAppCurrency = localStorage.getItem("appCurrency");
    const storedUserParentOrChild = localStorage.getItem("user_sm_parent");

    if (storedUser) {
      setSmuser(JSON.parse(storedUser));
    }
    if (storedRate) {
      setCurrencyRate(JSON.parse(storedRate));
    }
    if (storedAppCurrency) {
      setAppCurrency(storedAppCurrency);
    }
    if (storedUserParentOrChild) {
      setLoginByParentUser(storedUserParentOrChild);
    }
  }, []);

  // Value object to be provided to consuming components
  const value = {
    updateAppCurrency,
    appCurrency,
    updateCurrencyRate,
    currencyRates,
    smuser,
    isLoginByParentUser,
    updateUserDetails,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
