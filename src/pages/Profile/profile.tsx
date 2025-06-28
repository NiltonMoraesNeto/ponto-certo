import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/auth-context";
import { Box, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import LoadingSpin from "../../components/loading-spin";
import { Pagination } from "../../components/pagination";
import { ProfileList } from "../../model/profile-model";
import { TableProfiles } from "../../components/table-profile";
import {
  createNewProfile,
  fetchAllListProfiles,
  deleteProfile,
  updateProfile,
} from "../../services/profile";
import { useToast } from "../../contexts/toast-context";
import { useDebounce } from "../../hooks/useDebounce";
import { schemaNewProfile } from "../../schemas/new-profile-schema";
import { ModalNewProfile } from "../../components/modal-new-profile";
import { ModalDeleteProfile } from "../../components/modal-delete-profile";

type FormData = z.infer<ReturnType<typeof schemaNewProfile>>;

export function ProfilesPage() {
  const { t } = useTranslation();
  const { dataUser } = useAuth();
  const [profile, setProfile] = useState<ProfileList[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [openModalNewProfile, setOpenModalNewProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<ProfileList | null>(null);

  const [descriptionFilter, setDescriptionFilter] = useState("");
  const debouncedDescription = useDebounce(descriptionFilter, 500);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<ProfileList | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schemaNewProfile(t)),
  });

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, totalCount } = await fetchAllListProfiles(
        page,
        limit,
        debouncedDescription
      );
      setTotalPages(Math.ceil(totalCount / limit));
      setProfile(data);
    } catch (error) {
      showToast(t("Erro ao buscar perfis: " + error));
      setProfile([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedDescription, t, showToast]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles, dataUser?.id]);

  async function onSubmit(data: FormData) {
    try {
      if (isEditing && profileToEdit) {
        await updateProfile({
          id: String(profileToEdit.id),
          descricao: data.descricao,
        });
        showToast(
          t("profile.formEditProfile.msgSuccess", "Perfil editado com sucesso!")
        );
      } else {
        await createNewProfile(data.descricao);
        showToast(
          t(
            "profile.formNewProfile.msgSuccess",
            "Perfil adicionado com sucesso!"
          )
        );
      }
      setOpenModalNewProfile(false);
      setIsEditing(false);
      setProfileToEdit(null);
      reset();
      setValue("descricao", "");
      setPage(1);
      setDescriptionFilter("");
      await fetchProfiles();
    } catch (error) {
      showToast(
        t(
          isEditing
            ? "profile.formEditProfile.msgError"
            : "profile.formNewProfile.msgError"
        ) + error
      );
    }
  }

  function handleRequestDelete(profile: ProfileList) {
    setProfileToDelete(profile);
    setOpenConfirmDelete(true);
  }

  function handleRequestEdit(profile: ProfileList) {
    setProfileToEdit(profile);
    setIsEditing(true);
    setOpenModalNewProfile(true);
  }

  async function handleConfirmDelete() {
    if (!profileToDelete) return;
    try {
      await deleteProfile(profileToDelete.id.toString());
      showToast(
        t(
          "profile.formDeleteProfile.msgSuccess",
          "Perfil deletado com sucesso!"
        )
      );
      setOpenConfirmDelete(false);
      setProfileToDelete(null);
      await fetchProfiles();
    } catch (error) {
      showToast(
        t("profile.formDeleteProfile.msgError", "Erro ao deletar perfil: ") +
          error
      );
    }
  }

  function handleCancelDelete() {
    setOpenConfirmDelete(false);
    setProfileToDelete(null);
  }

  function handleCloseModalNewProfile() {
    setOpenModalNewProfile(false);
    setIsEditing(false);
    setProfileToEdit(null);
    reset();
    setValue("descricao", "");
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-primaryBlue/50 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-primaryBlue">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primaryBlue dark:text-primaryOrange">
            {t("profile.title")}
          </h1>
        </div>
        <div className="flex flex-col gap-2 mb-4 sm:flex-row justify-between items-center">
          <TextField
            label={t("profile.table.search")}
            value={descriptionFilter}
            onChange={(e) => {
              setPage(1);
              setDescriptionFilter(e.target.value);
            }}
            variant="outlined"
            size="small"
            className="w-full sm:w-72"
          />
          <Button
            variant="contained"
            color="primary"
            className="mt-2 sm:mt-0"
            onClick={() => {
              setOpenModalNewProfile(true);
              setIsEditing(false);
              setProfileToEdit(null);
            }}
            style={{ minWidth: 150 }}
          >
            {t("profile.formNewProfile.btnNewProfile")}
          </Button>
        </div>
        {loading ? (
          <LoadingSpin />
        ) : (
          <TableProfiles
            profile={profile}
            onDelete={handleRequestDelete}
            onEdit={handleRequestEdit}
          />
        )}
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        </Box>
        <ModalNewProfile
          openModalNewProfile={openModalNewProfile}
          setOpenModalNewProfile={setOpenModalNewProfile}
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          reset={reset}
          errors={errors}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          profileToEdit={profileToEdit}
          onClose={handleCloseModalNewProfile}
          setValue={setValue}
        />
        <ModalDeleteProfile
          openConfirmDelete={openConfirmDelete}
          handleCancelDelete={handleCancelDelete}
          profileToDelete={profileToDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
