import { Avatar } from "@mui/material";

interface TranslationChangeProps {
  changeLanguage: (lng: string) => void;
  isOpen: boolean;
  isLoginPage: boolean;
}

export function TranslationChange({
  changeLanguage,
  isOpen,
  isLoginPage,
}: TranslationChangeProps) {
  return (
    <div
      className={`${isOpen ? "flex" : "inline"} ${
        isLoginPage ? "justify-start" : "justify-between"
      } mt-4`}
    >
      <Avatar
        alt="Flag of Brazil"
        src="/bra.png"
        className={`cursor-pointer ${isLoginPage ? "ml-0" : "ml-3 mb-2"}`}
        onClick={() => changeLanguage("br")}
      />
      <Avatar
        alt="Flag of the United States"
        src="/usa.png"
        className="cursor-pointer ml-3 mb-2"
        onClick={() => changeLanguage("en")}
      />
      <Avatar
        alt="Flag of Spain"
        src="/esp.png"
        className="cursor-pointer ml-3"
        onClick={() => changeLanguage("es")}
      />
    </div>
  );
}
