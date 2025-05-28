import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "./theme-toogle";
import { Avatar } from "@mui/material";

const Header: React.FC = () => {
  const { logout, dataUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-primaryBlue text-primaryBlue dark:text-blue-600 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-center">
          {/* <img src="/ponto-certo-logo.png" className="items-center w-20 ml-20" /> */}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <label className="text-primaryBlue dark:text-white">
          {dataUser?.nome}
        </label>
        <Avatar alt="Avatar User" src={dataUser?.avatar} />
        <ThemeToggle />
        <button
          className="focus:outline-none hover:text-gray-300 dark:bg-indigo-950 dark:text-white"
          onClick={handleLogout}
        >
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
