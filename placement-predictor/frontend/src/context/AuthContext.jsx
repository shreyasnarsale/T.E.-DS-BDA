import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("placementai-user");
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage");
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("placementai-user", JSON.stringify(user));
      } else {
        localStorage.removeItem("placementai-user");
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
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

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};