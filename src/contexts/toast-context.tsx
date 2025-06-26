import React, { createContext, useContext, useState } from "react";
import DefaultAlertToast from "../components/default-alert-toast";

type ToastOptions = {
  autoHideDuration?: number;
  actionLabel?: string;
  onActionClick?: () => void;
};

type ToastContextType = {
  showToast: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState<ToastOptions>({});

  const showToast = (msg: string, opts?: ToastOptions) => {
    setMessage(msg);
    setOptions(opts || {});
    setOpen(false); // Fecha, caso esteja aberto
    setTimeout(() => setOpen(true), 50); // Pequeno delay para garantir reset
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <DefaultAlertToast
        open={open}
        setOpen={setOpen}
        message={message}
        autoHideDuration={options.autoHideDuration}
        actionLabel={options.actionLabel}
        onActionClick={options.onActionClick}
      />
    </ToastContext.Provider>
  );
};
