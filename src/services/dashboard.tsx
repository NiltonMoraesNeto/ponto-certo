import {
  HorasTrabalhadas,
  ValorHoraFuncionario,
} from "../model/dashboard-model";
import { getCurrentQuinzena } from "../utils/getCurrentQuinzena";
import api from "./api";

function minutosParaHoras(minutos: number): number {
  return minutos / 60;
}

export const fetchListActivities = async (quinzena: string) => {
  try {
    const response = await api.get(
      `atividades?quinzena=${quinzena}&status=true`
    );

    if (response.data) {
      const countAtivas = response.data.length;
      return countAtivas;
    }
    return false;
  } catch (error) {
    console.error("Erro", error);
    return false;
  }
};

export async function fetchHorasQuinzena(
  usuarioId: string | undefined,
  quinzena: string
) {
  try {
    const response = await api.get(
      `horasTrabalhadas?usuarioId=${usuarioId}&quinzena=${quinzena}`
    );
    if (response.data) {
      const totalHoras = response.data.reduce(
        (acc: number, curr: HorasTrabalhadas) => acc + Number(curr.horas),
        0
      );
      return totalHoras;
    }
    return 0;
  } catch (error) {
    console.error("Erro ao buscar horas da quinzena:", error);
    return 0;
  }
}

export async function fetchSalarioQuinzena(
  usuarioId: string | undefined,
  quinzena?: string
) {
  try {
    if (!quinzena) quinzena = getCurrentQuinzena();

    // Busca as horas trabalhadas na quinzena
    const horasResponse = await api.get(
      `horasTrabalhadas?usuarioId=${usuarioId}&quinzena=${quinzena}`
    );
    const totalMinutos = horasResponse.data.reduce(
      (acc: number, curr: HorasTrabalhadas) => acc + Number(curr.horas),
      0
    );
    const totalHoras = minutosParaHoras(totalMinutos);

    // Busca o valor da hora do funcionário, considerando validade da data
    const valorHoraResponse = await api.get(
      `valorHoraFuncionario?usuarioId=${usuarioId}`
    );

    const [quinzenaInicio] = quinzena.split("_");
    // Pega o valor da hora vigente na data de início da quinzena

    const valorHoraObj = (
      valorHoraResponse.data as ValorHoraFuncionario[]
    ).find((item) => {
      const inicio = new Date(item.dataInicio);
      const fim = item.dataFim ? new Date(item.dataFim) : null;
      const data = new Date(quinzenaInicio);
      return data >= inicio && (!fim || data <= fim);
    });

    const valorHora = valorHoraObj ? Number(valorHoraObj.valor) : 0;

    // Calcula o salário
    const salario = valorHora * totalHoras;

    return {
      totalHoras,
      valorHora,
      salario,
    };
  } catch (error) {
    console.error("Erro ao calcular o salário da quinzena:", error);
    return {
      totalHoras: 0,
      valorHora: 0,
      salario: 0,
    };
  }
}
