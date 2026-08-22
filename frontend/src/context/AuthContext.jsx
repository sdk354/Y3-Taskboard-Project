import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  login as loginRequest,
  getMe,
} from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getMe(token);
        setUser(currentUser);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, [token]);

  const login = async (username, password) => {
    const newToken = await loginRequest(
      username,
      password
    );

    localStorage.setItem("token", newToken);
    setToken(newToken);

    const currentUser = await getMe(newToken);
    setUser(currentUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};