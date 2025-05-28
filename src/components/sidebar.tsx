import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ExpandLess,
  ExpandMore,
  ArrowLeft as ArrowLeftIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { useTheme } from "../contexts/theme-context";
import { Banknote, HandCoins, PackageOpen, Receipt } from "lucide-react";
import { TranslationChange } from "./translation-change";
import i18n from "../config/i18n";
import { useTranslation } from "react-i18next";

const drawerWidth = 240; // Largura da sidebar aberta
const closedDrawerWidth = 60; // Largura da sidebar fechada

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const { dataUser } = useAuth();
  const theme = useTheme();
  const dividerColor = theme.theme === "dark" ? "white" : "#011f3a3e";

  const toggleSubmenu = (menu: string): void => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
      return t("sidebar.morning");
    } else if (hours < 18) {
      return t("sidebar.afternoon");
    } else {
      return t("sidebar.evening");
    }
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? drawerWidth : closedDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isOpen ? drawerWidth : closedDrawerWidth,
            boxSizing: "border-box",
            transition: "width 0.3s",
            backgroundColor: theme.theme === "dark" ? "#011F3A" : "#fff",
            color: theme.theme === "dark" ? "#fff" : "#011F3A",
            overflowX: "hidden", // Impede rolagem horizontal
          },
        }}
      >
        {/* Botão de controle da sidebar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "flex-end" : "center", // Centraliza o botão quando fechado
            p: 2,
          }}
        >
          <IconButton
            onClick={toggleSidebar}
            sx={{ color: theme.theme === "dark" ? "#EA5C11" : "#011F3A" }}
          >
            {isOpen ? <ArrowLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: isOpen ? "flex-start" : "center", // Centraliza o botão quando fechado
            p: 2,
          }}
        >
          <div className="flex items-start">
            <Link
              to="/home"
              className="text-2xl font-bold hover:text-gray-300 text-primaryBlue"
            >
              {isOpen ? (
                <div className="text-2xl font-bold hover:text-gray-300 text-primaryBlue dark:text-primaryOrange">
                  {/* <img src="/ponto-certo-logo.png" className="" /> */}
                  IMAGEM
                </div>
              ) : (
                <div className="text-2xl font-bold hover:text-gray-300 text-primaryBlue dark:text-primaryOrange">
                  PC
                </div>
              )}
            </Link>
          </div>
        </Box>
        {isOpen && (
          <>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" noWrap>
                {getGreeting()}
              </Typography>
              <Typography variant="body2" noWrap>
                {dataUser?.nome}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: dividerColor }} />
          </>
        )}
        <Box sx={{ overflow: "auto" }}>
          <List>
            {/* Home Item */}
            <ListItem button component={Link} to="/home">
              <ListItemIcon
                sx={{ color: theme.theme === "dark" ? "#EA5C11" : "#011F3A" }}
              >
                <HomeIcon />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Home" />}
            </ListItem>
            <Divider sx={{ borderColor: dividerColor }} />

            <ListItem button component={Link} to="/clock-in">
              <ListItemIcon
                sx={{ color: theme.theme === "dark" ? "#EA5C11" : "#011F3A" }}
              >
                <PackageOpen />
              </ListItemIcon>
              {isOpen && <ListItemText primary={t("sidebar.optionClockIn")} />}
            </ListItem>
            <Divider sx={{ borderColor: dividerColor }} />

            {/* Submenu Cadastros */}
            <ListItem button onClick={() => toggleSubmenu("cadastros")}>
              <ListItemIcon
                sx={{ color: theme.theme === "dark" ? "#EA5C11" : "#011F3A" }}
              >
                <Receipt />
              </ListItemIcon>
              {isOpen && (
                <>
                  <ListItemText primary={t("sidebar.optionRegistration")} />
                  {openSubmenus["cadastros"] ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItem>
            <Collapse
              in={openSubmenus["cadastros"]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} component={Link} to="/profiles">
                  {isOpen ? (
                    <ListItemText
                      primary={t("sidebar.menuRegistration.profiles")}
                    />
                  ) : (
                    <button>
                      <HandCoins />
                    </button>
                  )}
                </ListItem>
              </List>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} component={Link} to="/tasks">
                  {isOpen ? (
                    <ListItemText
                      primary={t("sidebar.menuRegistration.tasks")}
                    />
                  ) : (
                    <button>
                      <Banknote />
                    </button>
                  )}
                </ListItem>
              </List>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} component={Link} to="/users">
                  {isOpen ? (
                    <ListItemText
                      primary={t("sidebar.menuRegistration.users")}
                    />
                  ) : (
                    <button>
                      <Banknote />
                    </button>
                  )}
                </ListItem>
              </List>
            </Collapse>
            <Divider sx={{ borderColor: dividerColor }} />
          </List>
        </Box>
        <TranslationChange
          changeLanguage={changeLanguage}
          isOpen={isOpen}
          isLoginPage={false}
        />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
