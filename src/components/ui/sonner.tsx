"use client";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import React from "react";

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme();

  // Define base styles
  const baseStyle: React.CSSProperties = {
    border: "4px solid black",
    borderRadius: "0", // sharp edges like your app's blocks
    fontFamily: "'Courier New', monospace", // or your app font
    boxShadow: theme === "dark" ? "8px 8px 0 #666" : "6px 6px 0 #000",
    padding: "1rem",
    backgroundColor: theme === "dark" ? "#111" : "#d0f99b", // lime-ish for light
    color: theme === "dark" ? "#d0f99b" : "#000",
    textTransform: "uppercase" as const,
    fontWeight: "700",
    letterSpacing: "0.05em",
  };

  return (
    <Sonner
      {...props}
      toastOptions={{
        duration: 4000,
        style: baseStyle,
        classNames: {
          toast: "sonner-toast",
          success: "sonner-success",
          error: "sonner-error",
          warning: "sonner-warning",
          info: "sonner-info",
        },
      }}
      position="bottom-right"
    />
  );
};

export { Toaster };
