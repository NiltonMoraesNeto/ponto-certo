import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tasks } from "../model/tasks";
import { useTranslation } from "react-i18next";
import { schemaEditTask } from "../schemas/edit-task-schema";

type EditTaskForm = z.infer<ReturnType<typeof schemaEditTask>>;

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EditTaskForm) => Promise<void>;
  initialData: Tasks | null;
}

export function EditTaskModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: EditTaskModalProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<EditTaskForm>({
    resolver: zodResolver(schemaEditTask(t)),
    defaultValues: {
      descricao: initialData?.descricao ?? "",
      status: initialData?.status ?? true,
    },
  });

  useEffect(() => {
    reset({
      descricao: initialData?.descricao ?? "",
      status: initialData?.status ?? true,
    });
  }, [initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("reportPersonal.formEditTask.title")}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label={t("reportPersonal.formEditTask.labelDescription")}
            fullWidth
            margin="normal"
            {...register("descricao")}
            error={!!errors.descricao}
            helperText={errors.descricao?.message}
            autoFocus
          />
          <Box mt={2}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={!!field.value}
                      color="primary"
                    />
                  }
                  label={
                    field.value
                      ? t("reportPersonal.formEditTask.labelStatusActive")
                      : t("reportPersonal.formEditTask.labelStatusInactive")
                  }
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            {t("reportPersonal.formEditTask.btnCancel")}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {t("reportPersonal.formEditTask.btnSave")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
