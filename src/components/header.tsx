import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "./theme-toogle";
import { Avatar } from "@mui/material";
import { UserInfoModal } from "./modal-user-info";

const Header: React.FC = () => {
  const { logout, dataUser } = useAuth();
  const navigate = useNavigate();
  const [openUserModal, setOpenUserModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-primaryBlue text-primaryBlue dark:text-blue-600 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-center">
          {/* Logo para tema claro, só em telas md+ */}
          <img
            src="/logo-theme-light.png"
            className="hidden md:block dark:md:hidden w-20 ml-20"
            alt="Logo light"
          />
          {/* Logo para tema escuro, só em telas md+ */}
          <img
            src="/logo-theme-dark.png"
            className="hidden dark:md:block md:hidden w-20 ml-20"
            alt="Logo dark"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <label className="text-primaryBlue dark:text-white">
          {dataUser?.nome}
        </label>
        <Avatar
          alt="Avatar User"
          src={dataUser?.avatar}
          onClick={() => setOpenUserModal(true)}
          sx={{ cursor: "pointer" }}
        />
        <UserInfoModal
          open={openUserModal}
          onClose={() => setOpenUserModal(false)}
        />
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
