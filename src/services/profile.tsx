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

export async function createNewProfile(descricao: string) {
  try {
    const response = await api.post("/perfil", { descricao });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateProfile({
  id,
  descricao,
}: {
  id: string;
  descricao: string;
}) {
  try {
    const response = await api.put(`/perfil/${id}`, { descricao });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteProfile(id: string) {
  try {
    await api.delete(`/perfil/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
