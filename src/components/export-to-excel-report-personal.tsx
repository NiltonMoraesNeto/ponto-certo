import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatDateHHBR } from "../utils/format-date-br";
import { formatMinutesToHHMM } from "../utils/formatMinutesToHHMM";
import { ListReports } from "../model/reports-model";

export async function exportToExcelPersonalReport(
  reports: ListReports[],
  atividadeMap: Map<string, string>,
  totalHours: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Relatório Pessoal");

  // Cabeçalhos da tabela
  worksheet.addRow([
    "ID",
    "Descrição da Atividade",
    "Data Início",
    "Data Fim",
    "Duração (HH:mm)",
  ]);

  // Adiciona cada report como uma linha
  reports.forEach((report) => {
    worksheet.addRow([
      report.id,
      atividadeMap.get(String(report.atividadeId)) ?? report.atividadeId,
      formatDateHHBR(report.dataInicio),
      formatDateHHBR(report.dataFim),
      formatMinutesToHHMM(report.duracaoMinutos),
    ]);
  });

  // Linha em branco
  worksheet.addRow([]);

  // Total de horas
  worksheet.addRow(["", "", "", "Total de Horas:", totalHours]);

  // Estiliza o cabeçalho
  worksheet.getRow(1).font = { bold: true };

  // Gera o buffer e baixa o arquivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "relatorio-pessoal.xlsx");
}
