import React, { createContext, useState } from "react";
import { loginUser } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const resp = await loginUser({ email, password });
      if (resp.data.role) {
        setUser(resp.data);
        return resp.data.role;  // Admin / Employee
      }
      return null;
    } catch (err) {
      console.log("Login error:", err?.response?.data || err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};