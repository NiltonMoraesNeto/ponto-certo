import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  fetchHorasQuinzena,
  fetchListActivities,
  fetchSalarioQuinzena,
} from "../../services/dashboard";
import LoadingSpin from "../../components/loading-spin";
import { useAuth } from "../../contexts/auth-context";
import { formatMinutesToHHMM } from "../../utils/formatMinutesToHHMM";
import { formatCurrency } from "../../utils/format-currency";
import { QuinzenaFilter } from "../../components/quinzena-filter";
import { getQuinzenaString } from "../../utils/getCurrentQuinzena";

export function HomePage() {
  const { t, i18n } = useTranslation();
  const { dataUser } = useAuth();
  const [selectedCard, setSelectedCard] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([
    {
      id: 1,
      title: t("home.activeActivities"),
      description: "",
    },
    {
      id: 2,
      title: t("home.totalHours"),
      description: "00:00",
    },
    {
      id: 3,
      title: t("home.billingValue"),
      description: "R$ 0,00",
    },
  ]);
  const now = new Date();
  const [filtro, setFiltro] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    quinzena: (now.getDate() <= 15 ? "1" : "2") as "1" | "2",
  });

  const quinzenaAtual = getQuinzenaString(filtro);

  useEffect(() => {
    setLoading(true);
    const fetchAtividades = async () => {
      try {
        const response = await fetchListActivities(quinzenaAtual);
        setCards((prev) =>
          prev.map((card) =>
            card.id === 1
              ? {
                  ...card,
                  description: `Quantidade: ${response}`,
                }
              : card
          )
        );
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalHoras = async () => {
      try {
        const response = await fetchHorasQuinzena(dataUser?.id, quinzenaAtual);
        const horasFormatadas = formatMinutesToHHMM(response);
        setCards((prev) =>
          prev.map((card) =>
            card.id === 2
              ? {
                  ...card,
                  description: `Total de Horas: ${horasFormatadas}`,
                }
              : card
          )
        );
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSalario = async () => {
      try {
        const response = await fetchSalarioQuinzena(
          dataUser?.id,
          quinzenaAtual
        );
        setCards((prev) =>
          prev.map((card) =>
            card.id === 3
              ? {
                  ...card,
                  description: `Faturamento: ${formatCurrency(
                    response.salario
                  )}`,
                }
              : card
          )
        );
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAtividades();
    fetchTotalHoras();
    fetchSalario();
  }, [quinzenaAtual, dataUser?.id]);

  useEffect(() => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === 1)
          return { ...card, title: t("home.activeActivities") };
        if (card.id === 2) return { ...card, title: t("home.totalHours") };
        if (card.id === 3) return { ...card, title: t("home.billingValue") };
        return card;
      })
    );
  }, [t, i18n.language]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-primaryBlue/50 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-primaryBlue">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primaryBlue dark:text-primaryOrange">
            {t("home.title")} - Home
          </h1>
        </div>
        <QuinzenaFilter
          year={filtro.year}
          month={filtro.month}
          quinzena={filtro.quinzena}
          onChange={setFiltro}
        />
        {loading ? (
          <LoadingSpin />
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                lg: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
                xl: "repeat(auto-fill, minmax(min(360px, 100%), 1fr))",
              },
              gap: 2,
            }}
          >
            {cards.map((card, index) => (
              <Card key={index}>
                <CardActionArea
                  onClick={() => setSelectedCard(index)}
                  data-active={selectedCard === index ? "" : undefined}
                  sx={{
                    height: "100%",
                    "&[data-active]": {
                      backgroundColor: "action.selected",
                      "&:hover": {
                        backgroundColor: "action.selectedHover",
                      },
                    },
                  }}
                >
                  <CardContent sx={{ height: "100%" }}>
                    <Typography variant="h6" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </div>
    </div>
  );
}
