import { RegistroAtividade } from "../model/tasks";
import { getLocalISOString } from "../utils/get-local-ISOS-string";
import api from "./api";

export async function fetchListTasks(
  quinzena: string,
  status: boolean,
  usuarioId: number,
  page: number,
  limit: number
) {
  try {
    const responsePaged = await api.get("/atividades", {
      params: {
        usuarioId,
        quinzena,
        status,
        _page: page,
        _per_page: limit,
      },
    });

    const pagedData = responsePaged.data.data;
    const totalCount = responsePaged.data.items;

    return {
      data: pagedData,
      totalCount,
    };
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    throw error;
  }
}

export async function fetchAllListTasks(
  usuarioId: number,
  quinzena: string,
  page: number,
  limit: number
) {
  const response = await api.get("/atividades", {
    params: { usuarioId, quinzena, _page: page, _per_page: limit },
  });
  return response.data;
}

export async function podeIniciarTarefa(usuarioId: number) {
  const response = await api.get("/registrosAtividades", {
    params: { usuarioId },
  });

  const emAndamento = (response.data as RegistroAtividade[]).filter(
    (r: RegistroAtividade) => r.dataFim === null || r.dataFim === undefined
  );
  return emAndamento.length === 0;
}

export async function iniciarTarefa(
  usuarioId: number,
  atividadeId: string,
  quinzena: string
) {
  const podeIniciar = await podeIniciarTarefa(usuarioId);
  if (!podeIniciar) {
    throw new Error("Já existe uma tarefa em andamento para este usuário.");
  }
  const now = getLocalISOString();
  const response = await api.post("/registrosAtividades", {
    usuarioId,
    atividadeId,
    dataInicio: now,
    dataFim: null,
    quinzena,
    duracaoMinutos: null,
  });
  return response.data;
}

export async function pararTarefa(
  usuarioId: number,
  atividadeId: string,
  quinzena: string
) {
  const response = await api.get("/registrosAtividades", {
    params: { usuarioId },
  });

  const registroEmAndamento = (response.data as RegistroAtividade[]).find(
    (r: RegistroAtividade) =>
      r.dataFim === null && String(r.atividadeId) === String(atividadeId)
  );

  if (!registroEmAndamento) {
    throw new Error(
      "Não existe tarefa dessa atividade em andamento para este usuário!"
    );
  }

  // 3. Calcular duração em minutos
  const dataInicio = new Date(registroEmAndamento.dataInicio);
  const dataFimLocal = getLocalISOString();
  const dataFimDate = new Date(dataFimLocal);
  const duracaoMinutos = Math.round(
    (dataFimDate.getTime() - dataInicio.getTime()) / 60000
  );

  // 4. Atualizar registro
  await api.patch(`/registrosAtividades/${registroEmAndamento.id}`, {
    dataFim: dataFimLocal,
    duracaoMinutos,
  });

  // 5. Atualizar as horas gerais da quinzena
  await atualizarHorasTrabalhadas(usuarioId, quinzena);

  return {
    ...registroEmAndamento,
    dataFim: dataFimLocal,
    duracaoMinutos,
  };
}

export async function atualizarHorasTrabalhadas(
  usuarioId: number,
  quinzena: string
) {
  const response = await api.get("/registrosAtividades", {
    params: { usuarioId, quinzena },
  });

  const totalMinutos = (response.data as RegistroAtividade[]).reduce(
    (soma: number, registro: RegistroAtividade) =>
      soma + (registro.duracaoMinutos || 0),
    0
  );

  const htResponse = await api.get("/horasTrabalhadas", {
    params: { usuarioId, quinzena },
  });
  const horasTrabalhadas = htResponse.data[0];

  if (horasTrabalhadas) {
    await api.patch(`/horasTrabalhadas/${horasTrabalhadas.id}`, {
      horas: totalMinutos,
    });
  } else {
    await api.post("/horasTrabalhadas", {
      usuarioId,
      quinzena,
      data: quinzena.split("_")[0],
      horas: totalMinutos,
    });
  }
}

export async function criarNovaTarefa({
  usuarioId,
  descricao,
  quinzena,
}: {
  usuarioId: number;
  descricao: string;
  quinzena: string;
}) {
  const now = new Date();
  const dataCriacao = now.toISOString().slice(0, 10);
  return api.post("/atividades", {
    usuarioId,
    descricao,
    dataCriacao,
    dataFinalizacao: "",
    status: true,
    quinzena,
  });
}
