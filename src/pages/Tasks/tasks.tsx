import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getQuinzenaString } from "../../utils/getCurrentQuinzena";
import { useAuth } from "../../contexts/auth-context";
import { criarNovaTarefa, fetchListTasks } from "../../services/tasks";
import LoadingSpin from "../../components/loading-spin";
import { QuinzenaFilter } from "../../components/quinzena-filter";
import { Tasks } from "../../model/tasks";
import { TableTasks } from "../../components/table-tasks";
import { Box, Button } from "@mui/material";
import { Pagination } from "../../components/pagination";
import { ModalNovaTarefa } from "../../components/modal-new-task";
import DefaultAlertToast from "../../components/default-alert-toast";

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
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const quinzenaAtual = getQuinzenaString(filtro);
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi, setMsgApi] = useState("");

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
        setTotalPages(Math.ceil(totalCount / limit));
        setTasks(data);
      } catch (error) {
        setOpenAlert(true);
        setMsgApi("Erro ao buscar atividades: " + error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [quinzenaAtual, dataUser?.id, page, limit]);

  async function handleNovaTarefa(ticket: string, descricao: string) {
    if (!dataUser?.id) return;
    const descricaoFinal = `${ticket} - ${descricao}`;
    await criarNovaTarefa({
      usuarioId: parseInt(dataUser.id),
      descricao: descricaoFinal,
      quinzena: quinzenaAtual,
    });
    setOpenModal(false);
    setOpenAlert(true);
    setMsgApi("Atividade salva com sucesso");
    setPage(1);
    setLoading(true);
    const { data, totalCount } = await fetchListTasks(
      quinzenaAtual,
      true,
      parseInt(dataUser.id),
      1,
      limit
    );
    setTotalPages(Math.ceil(totalCount / limit));
    setTasks(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-primaryBlue/50 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-primaryBlue">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primaryBlue dark:text-primaryOrange">
            {t("tasks.title")}
          </h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <QuinzenaFilter
            year={filtro.year}
            month={filtro.month}
            quinzena={filtro.quinzena}
            onChange={setFiltro}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(true)}
          >
            {t("tasks.buttonNewTask")}
          </Button>
        </div>
        {loading ? <LoadingSpin /> : <TableTasks tasks={tasks} />}
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        </Box>
        <ModalNovaTarefa
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleNovaTarefa}
        />
        <DefaultAlertToast
          open={openAlert}
          setOpen={setOpenAlert}
          message={msgApi}
          actionLabel=""
        />
      </div>
    </div>
  );
}
