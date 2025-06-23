import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import LoadingSpin from "../../components/loading-spin";
import { useAuth } from "../../contexts/auth-context";
import { QuinzenaFilter } from "../../components/quinzena-filter";
import { getQuinzenaString } from "../../utils/getCurrentQuinzena";
import { fetchRegistrosAtividades } from "../../services/report";
import { ListReports } from "../../model/reports-model";
import DefaultAlertToast from "../../components/default-alert-toast";
import { Pagination } from "../../components/pagination";
import { TableReports } from "../../components/table-reports";
import { fetchAllListTasks } from "../../services/tasks";
import { Tasks } from "../../model/tasks";
import { fetchHorasQuinzena } from "../../services/dashboard";
import { formatMinutesToHHMM } from "../../utils/formatMinutesToHHMM";
import { exportToExcelPersonalReport } from "../../components/export-to-excel-report-personal";
import { useTheme } from "../../contexts/theme-context";

export function ReportPersonalPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { dataUser } = useAuth();
  const [reports, setReports] = useState<ListReports[]>();
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [filtro, setFiltro] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    quinzena: (now.getDate() <= 15 ? "1" : "2") as "1" | "2",
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [msgApi, setMsgApi] = useState("");
  const [totalHours, setTotalHours] = useState("");

  const quinzenaAtual = getQuinzenaString(filtro);

  useEffect(() => {
    setLoading(true);
    const fetchTasks = async () => {
      try {
        const { data, totalCount } = await fetchRegistrosAtividades(
          parseInt(dataUser?.id ?? "0"),
          quinzenaAtual,
          page,
          limit
        );
        console.log("🚀 data - ", data);
        setTotalPages(Math.ceil(totalCount / limit));
        setReports(data);
        // Busca atividades para mapear descrição
        const tasksData = await fetchAllListTasks(
          parseInt(dataUser?.id ?? "0"),
          quinzenaAtual,
          page,
          limit
        );
        console.log("🚀 tasksData - ", tasksData);
        setTasks(tasksData.data);
      } catch (error) {
        setOpenAlert(true);
        setMsgApi("Erro ao buscar atividades: " + error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalHoras = async () => {
      try {
        const response = await fetchHorasQuinzena(dataUser?.id, quinzenaAtual);
        const horasFormatadas = formatMinutesToHHMM(response);
        setTotalHours(horasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    fetchTotalHoras();
  }, [quinzenaAtual, dataUser?.id, page, limit]);

  const atividadeMap = React.useMemo(() => {
    const map = new Map();
    tasks.forEach((a) => map.set(String(a.id), a.descricao));
    return map;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-primaryBlue/50 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-primaryBlue">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primaryBlue dark:text-primaryOrange">
            {t("reportPersonal.title")}
          </h1>
        </div>
        <div className="flex flex-col gap-2 mb-4 sm:flex-row justify-between items-center">
          <QuinzenaFilter
            year={filtro.year}
            month={filtro.month}
            quinzena={filtro.quinzena}
            onChange={setFiltro}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.theme === "dark" ? "#EA5C11" : "#011F3A",
              color: "white",
              "&:hover": {
                backgroundColor: "#1E3A8A",
              },
              mt: -3,
            }}
            onClick={() =>
              exportToExcelPersonalReport(
                reports ?? [],
                atividadeMap,
                totalHours
              )
            }
          >
            {t("reportPersonal.labelExportExcel")}
          </Button>
        </div>
        {loading ? (
          <LoadingSpin />
        ) : (
          <TableReports reports={reports} atividadeMap={atividadeMap} />
        )}
        <Box mt={3} display="flex" justifyContent="end">
          <h1 className="text-sm font-bold text-primaryBlue dark:text-primaryOrange">
            {t("reportPersonal.labelTotalHours")} {totalHours}
          </h1>
        </Box>
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        </Box>
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
