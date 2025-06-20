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
import { iniciarTarefa } from "../services/tasks";

interface TableTasksProps {
  tasks: Tasks[] | undefined;
}

export function TableTasks({ tasks }: TableTasksProps) {
  const { t } = useTranslation();

  // Estado para controlar qual menu está aberto e qual tarefa foi selecionada
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);

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

  // Exemplo de handlers internos (ajuste depois conforme sua lógica)
  const handlePlay = async () => {
    // Lógica para iniciar tarefa
    // Exemplo: console.log("Iniciar", selectedTask);
    console.log("Iniciar", selectedTask);
    try {
      if (
        selectedTask?.usuarioId !== undefined &&
        selectedTask?.id !== undefined
      ) {
        await iniciarTarefa(
          parseInt(selectedTask.usuarioId),
          parseInt(selectedTask.id),
          selectedTask.quinzena
        );
        // Sucesso: tarefa iniciada!
      } else {
        alert("Usuário ou tarefa inválida.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message); // Já existe uma tarefa em andamento para este usuário.
      } else {
        alert("Ocorreu um erro desconhecido."); // Mensagem genérica para erros desconhecidos
      }
    }
    handleMenuClose();
  };
  const handleBan = () => {
    // Lógica para pausar tarefa
    // Exemplo: console.log("Pausar", selectedTask);
    console.log("Pausar", selectedTask);
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
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 bg-gray-50">
              {t("tasks.table.id")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 bg-gray-50">
              {t("tasks.table.description")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 bg-gray-50">
              {t("tasks.table.dateCreated")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 bg-gray-50">
              {t("tasks.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr key={task.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900">
                {task.id}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900">
                {task.descricao}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900">
                {formatDateBR(task.dataCriacao)}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900">
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
