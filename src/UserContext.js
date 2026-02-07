import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("OlapleAppUser");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  useEffect(() => {
    localStorage.setItem("OlapleAppUser", JSON.stringify(userData));
  }, [userData]);

  const updateUser = (newUserData) => {
    setUserData(newUserData);
  };

  const logout = () => {
    setUserData(null);
    localStorage.removeItem("OlapleAppUser");
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
