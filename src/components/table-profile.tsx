import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Pencil, EllipsisVertical, Trash } from "lucide-react";
import { ProfileList } from "../model/profile-model";

interface TableProfilesProps {
  profile: ProfileList[] | undefined;
  onDelete: (profile: ProfileList) => void;
  onEdit: (profile: ProfileList) => void;
}

export function TableProfiles({
  profile,
  onDelete,
  onEdit,
}: TableProfilesProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProfile, setSelectedProfile] = useState<ProfileList | null>(
    null
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    profile: ProfileList
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProfile(profile);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProfile(null);
  };

  const handleEdit = () => {
    if (selectedProfile) {
      onEdit(selectedProfile);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedProfile) {
      onDelete(selectedProfile);
    }
    handleMenuClose();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-indigo-900 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("profile.table.id")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("profile.table.description")}
            </th>
            <th className="py-3 px-4 border-b border-gray-200 text-right text-sm font-medium text-gray-700 dark:text-white bg-gray-50 dark:bg-indigo-900">
              {t("profile.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {profile?.map((profiles) => (
            <tr
              key={profiles.id}
              className="hover:bg-gray-100 dark:hover:bg-indigo-800"
            >
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {profiles.id}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-left text-sm text-gray-900 dark:text-white">
                {profiles.descricao}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-right text-sm text-gray-900 dark:text-white">
                <IconButton
                  aria-label="Ações"
                  onClick={(e) => handleMenuOpen(e, profiles)}
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
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Pencil size={18} />
          </ListItemIcon>
          <ListItemText>{t("profile.table.edit")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Trash size={18} />
          </ListItemIcon>
          <ListItemText>{t("profile.table.delete")}</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
