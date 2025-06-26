import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { fetchLogin } from "../services/usuarios";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ModalResetPassword } from "./modal-reset-password";
import { ModalInputToken } from "./modal-input-token";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeToggle } from "./theme-toogle";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n";
import { TranslationChange } from "./translation-change";

export function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [openModalInputToken, setOpenModalInputToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { t } = useTranslation();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [tokenIsValid, setTokenIsValid] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = {
      password: password,
      email: user,
    };

    const result = await fetchLogin(form);

    if (result) {
      const { token } = result;
      login(token);
      setLoading(false);
      navigate("/home");
    } else {
      setError(t("login.errorLogin"));
      setLoading(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Coluna esquerda - Roxo  */}
      <div className="hidden w-1/2 flex-col justify-between bg-indigo-600 dark:bg-indigo-900 p-12 text-white md:flex h-full">
        <div></div>
        <div className="space-y-3">
          <Typography variant="h4" gutterBottom>
            {t("login.title")}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t("login.subTtitle")}
          </Typography>
        </div>
        <div className="space-y-3">
          <div>
            <Typography variant="body1" gutterBottom>
              {t("login.noAccount")}
            </Typography>
            <div className="flex justify-between">
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                className="dark:text-white !bg-primaryBlue"
                onClick={() => console.log("criar a tela")}
              >
                {t("login.buttonCreate")}
              </Button>
              <ThemeToggle />
            </div>
            <TranslationChange
              changeLanguage={changeLanguage}
              isOpen={true}
              isLoginPage={true}
            />
          </div>
        </div>
      </div>

      {/* Coluna direita - Branco */}
      <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-primaryBlue p-6 md:w-1/2 md:p-12 h-full">
        <div className="w-full max-w-md">
          <div className="text-center">
            {/* Logo para o tema claro */}
            <img
              src="/logo-theme-light.png"
              className="items-center mx-auto mb-4 h-14 dark:hidden"
              alt="Logo light"
            />

            {/* Logo para o tema escuro */}
            <img
              src="/logo-theme-dark.png"
              className="items-center mx-auto mb-4 h-14 hidden dark:block"
              alt="Logo dark"
            />
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <TextField
                  fullWidth
                  margin="normal"
                  label={t("login.inputUser")}
                  id="usuario"
                  type="email"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="border-indigo-200 focus-visible:ring-indigo-500 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <TextField
                  fullWidth
                  margin="normal"
                  label={t("login.inputPassword")}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-indigo-200 focus-visible:ring-indigo-500 dark:text-white"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="text"
                  color="warning"
                  size="small"
                  onClick={() => setOpenModalResetPassword(true)}
                  className="!text-primaryOrange"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    mt: 1,
                  }}
                >
                  {t("login.labelForgotPassword")}
                </Button>
                <Button
                  variant="text"
                  color="warning"
                  size="small"
                  onClick={() => setOpenModalInputToken(true)}
                  className="!text-primaryOrange"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    mt: 1,
                  }}
                >
                  {t("login.labelResetPassword")}
                </Button>
                <ModalResetPassword
                  openModalResetPassword={openModalResetPassword}
                  setOpenModalResetPassword={setOpenModalResetPassword}
                  setOpenModalInputToken={setOpenModalInputToken}
                />
                <ModalInputToken
                  openModalInputToken={openModalInputToken}
                  setOpenModalInputToken={setOpenModalInputToken}
                  tokenIsValid={tokenIsValid}
                  setTokenIsValid={setTokenIsValid}
                />
              </div>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              className="w-full !bg-primaryBlue dark:text-white dark:!bg-primaryOrange"
            >
              {t("login.buttonAccess")}
            </Button>
            <Typography
              variant="body1"
              gutterBottom
              className="text-primaryOrange underline text-center"
            >
              v 1.00
            </Typography>

            {loading && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryBlue dark:border-primaryOrange"></div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
