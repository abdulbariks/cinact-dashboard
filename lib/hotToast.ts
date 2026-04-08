import toast from "react-hot-toast";

export const showSuccessToast = (message: string) => {
  return toast.success(message);
};

export const showErrorToast = (message: string) => {
  return toast.error(message);
};

export const showWarningToast = (message: string) => {
  return toast(message, {
    icon: "⚠️",
    duration: 4000,
    style: {
      background: "#3a2a08",
      color: "#fff8e1",
      border: "1px solid #f59e0b66",
      borderRadius: "12px",
      padding: "14px 16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
      fontSize: "14px",
      minWidth: "280px",
    },
  });
};
