"use client";

import { Toaster } from "react-hot-toast";

export default function HotToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={10}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#0f172a",
          color: "#ffffff",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "14px 16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          fontSize: "14px",
          minWidth: "280px",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#0b1220",
          },
          style: {
            border: "1px solid #22c55e55",
            background: "#052e1c",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#1a0b0b",
          },
          style: {
            border: "1px solid #ef444455",
            background: "#3a0f0f",
          },
        },
      }}
    />
  );
}
