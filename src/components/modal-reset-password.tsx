import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSendToken } from "../services/usuarios";
import { schemaResetPassword } from "../schemas/reset-password-schema";
import { useUserStore } from "../stores/use-user";
import DefaultAlertToast from "./default-alert-toast";
import { useTranslation } from "react-i18next";

interface ModalResetPasswordProps {
  openModalResetPassword: boolean;
  setOpenModalResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalInputToken: (value: React.SetStateAction<boolean>) => void;
}

export function ModalResetPassword({
  openModalResetPassword,
  setOpenModalResetPassword,
  setOpenModalInputToken,
}: ModalResetPasswordProps) {
  const updateEmailUser = useUserStore((state) => state.updateEmailUser);
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi, setMsgApi] = useState("");
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<ReturnType<typeof schemaResetPassword>>>({
    resolver: zodResolver(schemaResetPassword(t)),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmitResetPassword: SubmitHandler<{ email: string }> = async (
    data
  ) => {
    try {
      updateEmailUser(data.email);
      const response = await resetPasswordSendToken(data.email);

      if (response) {
        localStorage.setItem("resetCode", response.resetCode);
        setMsgApi(t("resetPassword.msgSendToken"));
        setOpenAlert(true);
        setValue("email", "");
        setOpenModalResetPassword(false);
        setOpenModalInputToken(true);
      } else {
        setMsgApi(t("resetPassword.msgEmailNotFound"));
        setOpenAlert(true);
      }
    } catch (error) {
      console.error(t("resetPassword.msgErrorSending"), error);
      setMsgApi(t("resetPassword.msgEmailNotFound"));
      setOpenAlert(true);
    }
  };

  const handleClose = () => {
    setOpenModalResetPassword(false);
  };

  return (
    <>
      <Dialog
        open={openModalResetPassword}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("resetPassword.title")}</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t("resetPassword.subTitle")}
          </DialogContentText>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("resetPassword.inputEmail")}
                fullWidth
                margin="normal"
                type="email"
                placeholder={t("resetPassword.placeholderEmail")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Typography variant="body2" sx={{ mt: 2 }}>
            <Link
              component="button"
              variant="body2"
              underline="hover"
              onClick={() => {
                handleClose();
                setOpenModalInputToken(true);
              }}
            >
              {t("resetPassword.labelToken")}
            </Link>
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t("resetPassword.buttonCancel")}
          </Button>
          <Button
            onClick={handleSubmit(handleSubmitResetPassword)}
            variant="contained"
          >
            {t("resetPassword.buttonSend")}
          </Button>
        </DialogActions>
      </Dialog>
      <DefaultAlertToast
        open={openAlert}
        setOpen={setOpenAlert}
        message={msgApi}
        actionLabel=""
      />
    </>
  );
}
