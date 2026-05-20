import React, { createContext, useState, useContext } from "react";
import { ThemeProvider } from "styled-components";

const ThemeContext = createContext();

export const themes = {
  purple: {
    name: "Neon Void",
    primary: "#7c52ff",
    secondary: "#9a86f3",
    bgGrad: "linear-gradient(135deg, #0a0616 0%, #120b24 100%)",
    containerBg: "rgba(12, 8, 28, 0.75)",
    sidebarBg: "#0c0822",
    currentUserBg: "#09051c",
    chatBg: "rgba(15, 10, 35, 0.4)",
    activeBg: "rgba(124, 82, 255, 0.2)",
    contactHoverBg: "rgba(255, 255, 255, 0.05)",
    textPrimary: "#ffffff",
    textSecondary: "#a0aec0",
    messageSelfBg: "rgba(124, 82, 255, 0.25)",
    messageSelfText: "#ffffff",
    messageOtherBg: "rgba(255, 255, 255, 0.08)",
    messageOtherText: "#e2e8f0",
    border: "rgba(124, 82, 255, 0.15)",
    glassBorder: "rgba(255, 255, 255, 0.05)",
    cardBg: "rgba(20, 16, 38, 0.8)",
    inputBg: "rgba(255, 255, 255, 0.08)",
    buttonText: "#ffffff",
    scrollbarBg: "rgba(255, 255, 255, 0.05)",
    scrollbarThumb: "#7c52ff",
    emojiPickerBg: "#0c0822",
    emojiPickerShadow: "rgba(124, 82, 255, 0.3)",
    onlineDot: "#10b981",
  },
  light: {
    name: "Solar Aurora",
    primary: "#ff7b89",
    secondary: "#8b5cf6",
    bgGrad: "linear-gradient(135deg, #fff5f5 0%, #eef2ff 100%)",
    containerBg: "rgba(255, 255, 255, 0.85)",
    sidebarBg: "rgba(248, 250, 252, 0.95)",
    currentUserBg: "rgba(241, 245, 249, 0.95)",
    chatBg: "rgba(243, 244, 246, 0.5)",
    activeBg: "rgba(239, 68, 68, 0.15)",
    contactHoverBg: "rgba(0, 0, 0, 0.03)",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    messageSelfBg: "rgba(239, 68, 68, 0.15)",
    messageSelfText: "#1e293b",
    messageOtherBg: "rgba(255, 255, 255, 0.95)",
    messageOtherText: "#334155",
    border: "rgba(226, 232, 240, 0.8)",
    glassBorder: "rgba(255, 255, 255, 0.6)",
    cardBg: "rgba(255, 255, 255, 0.9)",
    inputBg: "rgba(0, 0, 0, 0.04)",
    buttonText: "#ffffff",
    scrollbarBg: "rgba(0, 0, 0, 0.05)",
    scrollbarThumb: "#ff7b89",
    emojiPickerBg: "#ffffff",
    emojiPickerShadow: "rgba(239, 68, 68, 0.2)",
    onlineDot: "#10b981",
  },
  forest: {
    name: "Nordic Forest",
    primary: "#10b981",
    secondary: "#34d399",
    bgGrad: "linear-gradient(135deg, #050b0c 0%, #0c181a 100%)",
    containerBg: "rgba(8, 16, 18, 0.8)",
    sidebarBg: "#060c0d",
    currentUserBg: "#040809",
    chatBg: "rgba(10, 22, 24, 0.45)",
    activeBg: "rgba(16, 185, 129, 0.2)",
    contactHoverBg: "rgba(255, 255, 255, 0.03)",
    textPrimary: "#e2e8f0",
    textSecondary: "#94a3b8",
    messageSelfBg: "rgba(16, 185, 129, 0.25)",
    messageSelfText: "#ffffff",
    messageOtherBg: "rgba(255, 255, 255, 0.08)",
    messageOtherText: "#cbd5e1",
    border: "rgba(16, 185, 129, 0.15)",
    glassBorder: "rgba(255, 255, 255, 0.04)",
    cardBg: "rgba(12, 24, 26, 0.85)",
    inputBg: "rgba(255, 255, 255, 0.08)",
    buttonText: "#ffffff",
    scrollbarBg: "rgba(255, 255, 255, 0.03)",
    scrollbarThumb: "#10b981",
    emojiPickerBg: "#060c0d",
    emojiPickerShadow: "rgba(16, 185, 129, 0.3)",
    onlineDot: "#10b981",
  },
  cyberpunk: {
    name: "Cyber Amber",
    primary: "#ffb300",
    secondary: "#ffe082",
    bgGrad: "linear-gradient(135deg, #080808 0%, #141414 100%)",
    containerBg: "rgba(10, 10, 10, 0.85)",
    sidebarBg: "#080808",
    currentUserBg: "#050505",
    chatBg: "rgba(18, 18, 18, 0.5)",
    activeBg: "rgba(255, 179, 0, 0.2)",
    contactHoverBg: "rgba(255, 255, 255, 0.04)",
    textPrimary: "#f3f4f6",
    textSecondary: "#a1a1aa",
    messageSelfBg: "rgba(255, 179, 0, 0.25)",
    messageSelfText: "#ffffff",
    messageOtherBg: "rgba(255, 255, 255, 0.08)",
    messageOtherText: "#e4e4e7",
    border: "rgba(255, 179, 0, 0.2)",
    glassBorder: "rgba(255, 255, 255, 0.03)",
    cardBg: "rgba(14, 14, 14, 0.9)",
    inputBg: "rgba(255, 255, 255, 0.07)",
    buttonText: "#000000",
    scrollbarBg: "rgba(255, 255, 255, 0.02)",
    scrollbarThumb: "#ffb300",
    emojiPickerBg: "#080808",
    emojiPickerShadow: "rgba(255, 179, 0, 0.3)",
    onlineDot: "#ffb300",
  }
};

export const CustomThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("chatsphere-theme") || "purple";
  });

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setThemeState(themeName);
      localStorage.setItem("chatsphere-theme", themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={themes[theme]}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
