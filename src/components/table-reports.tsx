import { useTranslation } from "react-i18next";
import { ListReports } from "../model/reports-model";
import { formatDateHHBR } from "../utils/format-date-br";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Pencil, EllipsisVertical } from "lucide-react";
import React, { useState } from "react";
import DefaultAlertToast from "./default-alert-toast";
import { formatMinutesToHHMM } from "../utils/formatMinutesToHHMM";

interface TableReportsProps {
  reports: ListReports[] | undefined;
  atividadeMap: Map<string, string>;
}

export function TableReports({ reports, atividadeMap }: TableReportsProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<ListReports | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi] = useState("");

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    task: ListReports
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleEdit = () => {
    // Lógica para editar tarefa
    // Exemplo: console.log("Editar", selectedTask);
    console.log("Editar", selectedTask);
    handleMenuClose();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-indigo-900 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("reportPersonal.table.id")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("reportPersonal.table.description")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("reportPersonal.table.dateCreated")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("reportPersonal.table.dateFinished")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("reportPersonal.table.totalHours")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("reportPersonal.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {reports?.map((report) => (
            <tr
              key={report.id}
              className="hover:bg-gray-100 dark:hover:bg-indigo-800"
            >
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {report.id}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {atividadeMap.get(String(report.atividadeId)) ||
                  report.atividadeId}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {formatDateHHBR(report.dataInicio)}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {formatDateHHBR(report.dataFim)}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {formatMinutesToHHMM(report.duracaoMinutos)}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                <IconButton
                  aria-label="Ações"
                  onClick={(e) => handleMenuOpen(e, report)}
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
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Pencil size={18} />
          </ListItemIcon>
          <ListItemText>{t("tasks.table.edit")}</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
