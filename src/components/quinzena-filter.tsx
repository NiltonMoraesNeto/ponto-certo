import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type QuinzenaOption = "1" | "2";

interface QuinzenaFilterProps {
  year: number;
  month: number;
  quinzena: QuinzenaOption;
  onChange: (quinzena: {
    year: number;
    month: number;
    quinzena: QuinzenaOption;
  }) => void;
}

export const QuinzenaFilter: React.FC<QuinzenaFilterProps> = ({
  year,
  month,
  quinzena,
  onChange,
}) => {
  const { t } = useTranslation();
  const now = new Date();

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i); // Ex: 2023 a 2027
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleChange =
    (field: "year" | "month" | "quinzena") => (event: SelectChangeEvent) => {
      onChange({
        year: field === "year" ? Number(event.target.value) : year,
        month: field === "month" ? Number(event.target.value) : month,
        quinzena:
          field === "quinzena"
            ? (event.target.value as QuinzenaOption)
            : quinzena,
      });
    };

  return (
    <Box
      className="
        flex flex-col gap-2 mb-4
        sm:flex-row
      "
      // sm:flex-row: lado a lado em telas >=640px, column no mobile
    >
      <FormControl size="small" className="w-full sm:w-auto">
        <InputLabel id="quinzena-year-label">{t("home.year")}</InputLabel>
        <Select
          labelId="quinzena-year-label"
          value={String(year)}
          label="Ano"
          onChange={handleChange("year")}
        >
          {years.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" className="w-full sm:w-auto">
        <InputLabel id="quinzena-month-label">{t("home.month")}</InputLabel>
        <Select
          labelId="quinzena-month-label"
          value={String(month)}
          label="Mês"
          onChange={handleChange("month")}
        >
          {months.map((m) => (
            <MenuItem key={m} value={m}>
              {m.toString().padStart(2, "0")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" className="w-full sm:w-auto">
        <InputLabel id="quinzena-label">{t("home.fortnight")}</InputLabel>
        <Select
          labelId="quinzena-label"
          value={quinzena}
          label="Quinzena"
          onChange={handleChange("quinzena")}
        >
          <MenuItem value="1">1ª {t("home.fortnight")} (01 a 15)</MenuItem>
          <MenuItem value="2">2ª {t("home.fortnight")} (16 a 30/31)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
