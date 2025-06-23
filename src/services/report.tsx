import api from "./api";
import { ListReports } from "../model/reports-model";

export async function fetchRegistrosAtividades(
  usuarioId: number,
  quinzena: string,
  page: number,
  limit: number
): Promise<{ data: ListReports[]; totalCount: number }> {
  try {
    const response = await api.get("/registrosAtividades", {
      params: {
        usuarioId,
        quinzena,
        _page: page,
        _per_page: limit,
      },
    });

    return {
      data: response.data.data,
      totalCount: response.data.items,
    };
  } catch (error) {
    console.error("Erro ao buscar registros de atividades:", error);
    throw error;
  }
}
