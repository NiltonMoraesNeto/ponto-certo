import api from "./api";

export async function fetchProfileById(id: string) {
  const response = await api.get("/perfil", {
    params: { id },
  });
  return response.data;
}
export async function fetchAllListProfiles(
  page: number,
  limit: number,
  descriptionFilter: string
) {
  try {
    const responsePaged = await api.get("/perfil", {
      params: {
        _page: page,
        _per_page: limit,
        descricao: descriptionFilter,
      },
    });

    const pagedData = responsePaged.data.data;
    const totalCount = responsePaged.data.items;

    return {
      data: pagedData,
      totalCount,
    };
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }
}
