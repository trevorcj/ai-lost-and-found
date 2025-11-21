import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem("demo_current_user") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem("demo_current_user", currentUser);
      else localStorage.removeItem("demo_current_user");
    } catch (err) {
      console.log(err);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
