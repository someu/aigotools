"use client";
import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ThemeToastContainer() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      autoClose={1000}
      limit={1}
      pauseOnFocusLoss={false}
      position="top-center"
      theme={theme}
    />
  );
}
