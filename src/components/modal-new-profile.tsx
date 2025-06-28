import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { SetStateAction } from "react";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { NewProfileForm, ProfileList } from "../model/profile-model";

interface ModalNewProfileProps {
  openModalNewProfile: boolean;
  setOpenModalNewProfile: (value: SetStateAction<boolean>) => void;
  register: UseFormRegister<NewProfileForm>;
  handleSubmit: UseFormHandleSubmit<NewProfileForm>;
  onSubmit: (data: NewProfileForm) => void | Promise<void>;
  reset: UseFormReset<NewProfileForm>;
  errors: FieldErrors<NewProfileForm>;
  isSubmitting: boolean;
  isEditing?: boolean;
  profileToEdit?: ProfileList | null;
  onClose?: () => void;
  setValue: UseFormSetValue<{
    descricao: string;
  }>;
}

export function ModalNewProfile({
  openModalNewProfile,
  setOpenModalNewProfile,
  register,
  handleSubmit,
  onSubmit,
  reset,
  errors,
  isSubmitting,
  isEditing,
  profileToEdit,
  onClose,
  setValue,
}: ModalNewProfileProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (openModalNewProfile) {
      if (isEditing && profileToEdit) {
        reset({ descricao: profileToEdit.descricao });
        setValue("descricao", profileToEdit.descricao);
      } else {
        reset();
        setValue("descricao", "");
      }
    }
  }, [openModalNewProfile, isEditing, profileToEdit, reset]);

  const handleClose = () => {
    if (onClose) {
      onClose(); // 👈 já vai limpar tudo lá no pai
    } else {
      setOpenModalNewProfile(false);
      reset();
      setValue("descricao", "");
    }
  };

  return (
    <Dialog
      open={openModalNewProfile}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEditing
          ? t("profile.formEditProfile.title")
          : t("profile.formNewProfile.title")}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label={t("profile.formNewProfile.labelDescription")}
            fullWidth
            margin="normal"
            {...register("descricao")}
            error={!!errors.descricao}
            helperText={errors.descricao?.message}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t("profile.formNewProfile.btnCancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {t("profile.formNewProfile.btnSave")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
