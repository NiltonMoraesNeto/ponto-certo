import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getQuinzenaString } from "../../utils/getCurrentQuinzena";
import { useAuth } from "../../contexts/auth-context";
import { fetchListTasks } from "../../services/tasks";
import LoadingSpin from "../../components/loading-spin";
import { QuinzenaFilter } from "../../components/quinzena-filter";
import { Tasks } from "../../model/tasks";
import { TableTasks } from "../../components/table-tasks";
import { Box } from "@mui/material";
import { Pagination } from "../../components/pagination";

export function TasksPage() {
  const { t } = useTranslation();
  const { dataUser } = useAuth();
  const [tasks, setTasks] = useState<Tasks[]>();
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [filtro, setFiltro] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    quinzena: (now.getDate() <= 15 ? "1" : "2") as "1" | "2",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const quinzenaAtual = getQuinzenaString(filtro);

  useEffect(() => {
    setLoading(true);
    const fetchTasks = async () => {
      try {
        const { data, totalCount } = await fetchListTasks(
          quinzenaAtual,
          true,
          parseInt(dataUser?.id ?? "0"),
          page,
          limit
        );
        console.log("🚀 response - ", data);
        setTotalPages(Math.ceil(totalCount / limit));
        setTasks(data);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [quinzenaAtual, dataUser?.id, page]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-primaryBlue/50 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-primaryBlue">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primaryBlue dark:text-primaryOrange">
            {t("tasks.title")}
          </h1>
        </div>
        <QuinzenaFilter
          year={filtro.year}
          month={filtro.month}
          quinzena={filtro.quinzena}
          onChange={setFiltro}
        />
        {loading ? <LoadingSpin /> : <TableTasks tasks={tasks} />}
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </Box>
      </div>
    </div>
  );
}
