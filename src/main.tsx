import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { AppRoutes } from "./router";
import "./index.css";
import { ThemeProvider } from "./contexts/theme-context";
import { I18nProvider } from "./components/I18nProvider";
import { ToastProvider } from "./contexts/toast-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <I18nProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </I18nProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
