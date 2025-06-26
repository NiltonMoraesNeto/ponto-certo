import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import { useAuth } from "../contexts/auth-context";
import { useTranslation } from "react-i18next";

interface UserInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = ({
  open,
  onClose,
}) => {
  const { dataUser, profileUser } = useAuth();
  const { t } = useTranslation();
  if (!dataUser) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("profileModal.title")}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            alt={dataUser.nome}
            src={dataUser.avatar}
            sx={{ width: 72, height: 72 }}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            width="100%"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="body1">
              {t("profileModal.name")} {dataUser.nome}
            </Typography>
            <Typography variant="body1">
              {t("profileModal.email")} {dataUser.email}
            </Typography>
          </Stack>
          <Divider sx={{ width: "100%" }} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            width="100%"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="body1">
              {t("profileModal.zipCode")} {dataUser.cep}
            </Typography>
            <Typography variant="body1">
              {t("profileModal.profile")} {profileUser}
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("profileModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
