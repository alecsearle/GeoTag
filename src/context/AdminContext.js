import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load admin state from AsyncStorage on mount
  useEffect(() => {
    async function loadAdminState() {
      try {
        const savedState = await AsyncStorage.getItem("user_is_admin");
        if (savedState !== null) {
          setIsAdmin(JSON.parse(savedState));
        }
      } catch (error) {
        console.error("Error loading admin state:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAdminState();
  }, []);

  // Toggle admin state and persist to AsyncStorage
  const toggleAdmin = async () => {
    try {
      const newState = !isAdmin;
      setIsAdmin(newState);
      await AsyncStorage.setItem("user_is_admin", JSON.stringify(newState));
    } catch (error) {
      console.error("Error saving admin state:", error);
    }
  };

  // Set admin state
  const setAdminState = async (state) => {
    try {
      setIsAdmin(state);
      await AsyncStorage.setItem("user_is_admin", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving admin state:", error);
    }
  };

  const value = {
    isAdmin,
    loading,
    toggleAdmin,
    setAdminState,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
