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
        _limit: limit,
        _sort: "id",
        _order: "asc",
      },
    });

    // 2. Busca total (sem paginação)
    const responseAll = await api.get("/atividades", {
      params: {
        usuarioId,
        quinzena,
        status,
        _sort: "id",
        _order: "asc",
      },
    });

    const totalCount = responseAll.data.length;

    return {
      data: responsePaged.data,
      totalCount,
    };
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    // Pode lançar novamente, retornar um valor padrão, ou retornar o erro para o componente tratar:
    throw error;
    // ou return [];  // se quiser retornar um array vazio no erro
  }
}

// Função para checar se já existe tarefa em andamento
export async function podeIniciarTarefa(usuarioId: number) {
  const response = await api.get("/registrosAtividades", {
    params: {
      usuarioId,
      dataFim: null,
    },
  });
  // Só pode iniciar se NÃO existir nenhuma tarefa em andamento
  return response.data.length === 0;
}

// Função para iniciar tarefa
export async function iniciarTarefa(
  usuarioId: number,
  atividadeId: number,
  quinzena: string
) {
  const podeIniciar = await podeIniciarTarefa(usuarioId);
  if (!podeIniciar) {
    throw new Error("Já existe uma tarefa em andamento para este usuário.");
  }
  const now = new Date().toISOString();
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
