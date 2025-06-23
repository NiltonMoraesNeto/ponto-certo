import { useTranslation } from "react-i18next";
import { Tasks } from "../model/tasks";
import formatDateBR from "../utils/format-date-br";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Ban, Pencil, Play, Trash, EllipsisVertical } from "lucide-react";
import React, { useState } from "react";
import { iniciarTarefa, pararTarefa } from "../services/tasks";
import DefaultAlertToast from "./default-alert-toast";

interface TableTasksProps {
  tasks: Tasks[] | undefined;
}

export function TableTasks({ tasks }: TableTasksProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi, setMsgApi] = useState("");

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    task: Tasks
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handlePlay = async () => {
    try {
      if (
        selectedTask?.usuarioId !== undefined &&
        selectedTask?.id !== undefined
      ) {
        await iniciarTarefa(
          parseInt(selectedTask.usuarioId),
          selectedTask.id,
          selectedTask.quinzena
        );
        setOpenAlert(true);
        setMsgApi(t("tasks.api.startTaskSuccess"));
      } else {
        setOpenAlert(true);
        setMsgApi(t("tasks.api.startTaskError"));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOpenAlert(true);
        if (
          err.message === "Já existe uma tarefa em andamento para este usuário."
        ) {
          setMsgApi(t("tasks.api.startTaskPlayError"));
        } else {
          setMsgApi(err.message);
        }
      } else {
        setOpenAlert(true);
        setMsgApi("Ocorreu um erro desconhecido.");
      }
    }
    handleMenuClose();
  };
  const handleBan = async () => {
    try {
      if (
        selectedTask?.usuarioId !== undefined &&
        selectedTask?.id !== undefined &&
        selectedTask?.quinzena
      ) {
        await pararTarefa(
          parseInt(selectedTask.usuarioId),
          selectedTask.id,
          selectedTask.quinzena
        );
        setOpenAlert(true);
        setMsgApi(t("tasks.api.stopTaskSuccess"));
      } else {
        setOpenAlert(true);
        setMsgApi("Dados da tarefa inválidos.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOpenAlert(true);
        if (
          err.message ===
          "Não existe tarefa dessa atividade em andamento para este usuário!"
        ) {
          setMsgApi(t("tasks.api.errorStopTask"));
        } else {
          setMsgApi(err.message);
        }
      } else {
        setOpenAlert(true);
        setMsgApi("Ocorreu um erro desconhecido.");
      }
    }
    handleMenuClose();
  };
  const handleEdit = () => {
    // Lógica para editar tarefa
    // Exemplo: console.log("Editar", selectedTask);
    console.log("Editar", selectedTask);
    handleMenuClose();
  };
  const handleDelete = () => {
    // Lógica para deletar tarefa
    // Exemplo: console.log("Excluir", selectedTask);
    console.log("Excluir", selectedTask);
    handleMenuClose();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-indigo-900 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("tasks.table.id")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("tasks.table.description")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("tasks.table.dateCreated")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("tasks.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-gray-100 dark:hover:bg-indigo-800"
            >
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {task.id}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {task.descricao}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {formatDateBR(task.dataCriacao)}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                <IconButton
                  aria-label="Ações"
                  onClick={(e) => handleMenuOpen(e, task)}
                >
                  <EllipsisVertical size={20} />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DefaultAlertToast
        open={openAlert}
        setOpen={setOpenAlert}
        message={msgApi}
        actionLabel=""
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePlay}>
          <ListItemIcon>
            <Play size={18} />
          </ListItemIcon>
          <ListItemText>{t("tasks.table.play")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleBan}>
          <ListItemIcon>
            <Ban size={18} />
          </ListItemIcon>
          <ListItemText>{t("tasks.table.stop")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Pencil size={18} />
          </ListItemIcon>
          <ListItemText>{t("tasks.table.edit")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Trash size={18} />
          </ListItemIcon>
          <ListItemText>{t("tasks.table.delete")}</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
