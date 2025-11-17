import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("@user_data");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log("Restore user failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password, role) => {
  try {
    const res = await loginUser({ email, password, role }); //  role send kar rahe hain
    if (res.data && res.data.role) {
      setUser(res.data);
      await AsyncStorage.setItem("@user_data", JSON.stringify(res.data));
      return res.data.role;
    } else {
      throw new Error("Invalid login response");
    }
  } catch (err) {
    console.log("Login error:", err.response?.data || err.message);
    throw err;
  }
};


  const logout = async () => {
    await AsyncStorage.removeItem("@user_data");
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
