import React, { useState, useEffect } from "react";
import { initI18n } from "../config/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n().then(() => {
      setIsI18nInitialized(true);
    });
  }, []);

  if (!isI18nInitialized) {
    return <div>Carregando...</div>; // Ou qualquer outro componente de loading
  }

  return <>{children}</>;
}
