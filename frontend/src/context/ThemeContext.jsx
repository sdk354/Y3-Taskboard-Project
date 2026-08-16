import React, { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../hooks/useTheme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("taskboard-theme") || "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("taskboard-theme", theme);
    // keeps the phone status bar the same colour as the page
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#161619" : "#f2efe9";
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((p) => (p === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
