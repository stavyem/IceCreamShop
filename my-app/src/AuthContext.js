import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookie = getCookie("username");
    if (cookie) {
      login({ username: cookie });
    }
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData.username);
  };

  const logout = async () => {
    try {
      
      const response = await axios.post("http://localhost:8000/auth/logout", {
        user
      });
      
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUser(null);  
      }
      else if (response.status === 400)
      {
        alert("No user is logged in.");
      }
      else
      {
        alert("Internal server error.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  };  

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);