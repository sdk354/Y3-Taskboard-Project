import React, { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../hooks/useTheme";

const THEME_VARS = {
  light: { "--bg": "#fff", "--text": "#000", "--border": "#ccc" },
  dark: { "--bg": "#222", "--text": "#fff", "--border": "#555" },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Writing to the DOM belongs in an effect, not the render body
  useEffect(() => {
    Object.entries(THEME_VARS[theme]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
