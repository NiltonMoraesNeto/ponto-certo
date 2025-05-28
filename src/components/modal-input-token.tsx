import React, { useState, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaNewPassword } from "../schemas/new-password-schema";
import { resetCodeDelete, resetPassword } from "../services/usuarios";
import { useUserStore } from "../stores/use-user";
import { isSuccessRequest } from "../utils/response-request";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
} from "@mui/material";
import DefaultAlertToast from "./default-alert-toast";
import { useTranslation } from "react-i18next";

interface ModalInputTokenProps {
  openModalInputToken: boolean;
  setOpenModalInputToken: React.Dispatch<React.SetStateAction<boolean>>;
  tokenIsValid: boolean;
  setTokenIsValid: (value: React.SetStateAction<boolean>) => void;
}

export function ModalInputToken({
  openModalInputToken,
  setOpenModalInputToken,
  tokenIsValid,
  setTokenIsValid,
}: ModalInputTokenProps) {
  const [valueToken, setValueToken] = useState(["", "", "", ""]);
  const emailUser = useUserStore((state) => state.emailUser);
  const updateEmailUser = useUserStore((state) => state.updateEmailUser);
  const [open, setOpen] = useState(false);
  const [msgAlert, setMsgAlert] = useState("");
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { t } = useTranslation();

  const handleValidarToken = () => {
    const resetCode = localStorage.getItem("resetCode");
    const token = valueToken.join(""); // Junta os valores dos inputs
    if (resetCode === token) {
      setTokenIsValid(true);
      setMsgAlert(t("validateToken.labelValidToken"));
      setOpen(true);
    } else {
      setMsgAlert(t("validateToken.labelInvalidToken"));
      setOpen(true);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schemaNewPassword>>({
    resolver: zodResolver(schemaNewPassword),
    defaultValues: {
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const handleSubmitNewPassword: SubmitHandler<{
    newPassword: string;
    newPasswordConfirmation: string;
  }> = async (data) => {
    const token = valueToken.join(""); // Junta os valores dos inputs
    const response = (await resetPassword(
      emailUser,
      token,
      data.newPassword
    )) as {
      status?: number;
    };

    if (isSuccessRequest(response?.status)) {
      await resetCodeDelete(emailUser, token);
      localStorage.removeItem("resetCode");
      updateEmailUser("");
      setMsgAlert(t("validateToken.msgSuccess"));
      setOpen(true);
      setOpenModalInputToken(false);
      setValueToken(["", "", "", ""]);
      setTokenIsValid(false);
    } else {
      setMsgAlert(t("validateToken.msgError"));
      setOpen(true);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      // Atualiza o valor no índice correspondente
      const newValues = [...valueToken];
      newValues[index] = value;
      setValueToken(newValues);

      // Move para o próximo input se o valor for válido e não estiver vazio
      if (value !== "" && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (
      event.key === "Backspace" &&
      !valueToken[index] &&
      inputRefs.current[index - 1]
    ) {
      // Volta para o input anterior se o atual estiver vazio
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <>
      <Dialog
        open={openModalInputToken}
        onClose={() => setOpenModalInputToken(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("validateToken.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {tokenIsValid
              ? t("validateToken.newPassword")
              : t("validateToken.subTitle")}
          </DialogContentText>

          {tokenIsValid ? (
            <Box component="form" noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        label={t("validateToken.labelNewPassword")}
                        fullWidth
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="newPasswordConfirmation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        label={t("validateToken.labelConfirmNewPassword")}
                        fullWidth
                        error={!!errors.newPasswordConfirmation}
                        helperText={errors.newPasswordConfirmation?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box display="flex" gap={2} justifyContent="center">
              {valueToken.map((value, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el!)}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center" },
                  }}
                  type="text"
                  variant="outlined"
                  sx={{ width: "3rem" }}
                />
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {tokenIsValid ? (
            <Button
              variant="contained"
              onClick={handleSubmit(handleSubmitNewPassword)}
            >
              {t("validateToken.buttonChangePassword")}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleValidarToken}>
              {t("validateToken.buttonValidateToken")}
            </Button>
          )}
          <Button onClick={() => setOpenModalInputToken(false)}>
            {t("validateToken.buttonCancel")}
          </Button>
        </DialogActions>
      </Dialog>
      <DefaultAlertToast
        open={open}
        setOpen={setOpen}
        message={msgAlert}
        actionLabel=""
      />
    </>
  );
}
