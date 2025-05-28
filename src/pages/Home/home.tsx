import { useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export function HomePage() {
  const { t } = useTranslation();
  const [selectedCard, setSelectedCard] = useState(0);
  const cards = [
    {
      id: 1,
      title: "Opção 01",
      description: "Subtítulo 01",
    },
    {
      id: 2,
      title: "Opção 02",
      description: "Subtítulo 02",
    },
    {
      id: 3,
      title: "Opção 03",
      description: "Subtítulo 03",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-primaryBlue/50 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-primaryBlue">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primaryBlue dark:text-primaryOrange">
            {t("home.title")} - Home
          </h1>
        </div>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
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
                  <Typography variant="h5" component="div">
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
      </div>
    </div>
  );
}
