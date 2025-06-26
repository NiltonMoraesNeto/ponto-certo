import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { Box, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import LoadingSpin from "../../components/loading-spin";
import { Pagination } from "../../components/pagination";
import { ProfileList } from "../../model/profile-model";
import { TableProfiles } from "../../components/table-profile";
import { fetchAllListProfiles } from "../../services/profile";
import { useToast } from "../../contexts/toast-context";
import { useDebounce } from "../../hooks/useDebounce";

export function ProfilesPage() {
  const { t } = useTranslation();
  const { dataUser } = useAuth();
  const [profile, setProfile] = useState<ProfileList[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [descriptionFilter, setDescriptionFilter] = useState("");
  const debouncedDescription = useDebounce(descriptionFilter, 500);

  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
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
    };

    fetchProfile();
  }, [dataUser?.id, page, limit, debouncedDescription, t, showToast]);

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
        </div>
        {loading ? <LoadingSpin /> : <TableProfiles profile={profile} />}
        <Box mt={3} display="flex" justifyContent="end"></Box>
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        </Box>
      </div>
    </div>
  );
}
