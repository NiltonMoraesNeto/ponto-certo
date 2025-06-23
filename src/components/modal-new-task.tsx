import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaNewTicket } from "../schemas/new-tasks";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

interface ModalNovaTarefaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (ticket: string, descricao: string) => Promise<void>;
}

export function ModalNovaTarefa({
  open,
  onClose,
  onSubmit,
}: ModalNovaTarefaProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<ReturnType<typeof schemaNewTicket>>>({
    resolver: zodResolver(schemaNewTicket(t)),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  async function handleForm(data: z.infer<ReturnType<typeof schemaNewTicket>>) {
    await onSubmit(data.ticket, data.descricao);
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("tasks.formNewTask.title")}</DialogTitle>
      <form onSubmit={handleSubmit(handleForm)}>
        <DialogContent>
          <TextField
            label={t("tasks.formNewTask.labelTicket")}
            fullWidth
            margin="normal"
            {...register("ticket")}
            error={!!errors.ticket}
            helperText={errors.ticket?.message}
            autoFocus
          />
          <TextField
            label={t("tasks.formNewTask.labelDescription")}
            fullWidth
            margin="normal"
            {...register("descricao")}
            error={!!errors.descricao}
            helperText={errors.descricao?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            {t("tasks.formNewTask.btnCancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {t("tasks.formNewTask.btnSave")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
