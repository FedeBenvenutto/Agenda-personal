import React, { useState, useEffect, createContext } from "react";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setLoading,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};