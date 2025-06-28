import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ProfileList } from "../model/profile-model";

interface ModalDeleteProfileProps {
  openConfirmDelete: boolean;
  handleCancelDelete(): void;
  profileToDelete: ProfileList | null;
  handleConfirmDelete(): Promise<void>;
}

export function ModalDeleteProfile({
  openConfirmDelete,
  handleCancelDelete,
  profileToDelete,
  handleConfirmDelete,
}: ModalDeleteProfileProps) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={openConfirmDelete}
      onClose={handleCancelDelete}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{t("profile.formDeleteProfile.title")}</DialogTitle>
      <DialogContent>
        <Typography>{t("profile.formDeleteProfile.text")}</Typography>
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          {t("profile.formDeleteProfile.labelNameProfile")}{" "}
          {profileToDelete?.descricao}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDelete} color="info" variant="outlined">
          {t("profile.formDeleteProfile.btnCancel")}
        </Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained">
          {t("profile.formDeleteProfile.btnDelete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
