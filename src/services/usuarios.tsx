import { LoginForm } from "../model/login-model";
import api from "./api";
import jwtEncode from "jwt-encode";

export const fetchLogin = async (form: LoginForm) => {
  try {
    // Busca usuários com email e password
    const response = await api.get("/usuarios", {
      params: { ...form },
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Usuarios encontrados (array)
    const usuarios = response.data;

    // Se não encontrou nenhum usuário, login inválido
    if (!usuarios || usuarios.length === 0) {
      return false;
    }

    const user = usuarios[0];

    // Monta payload para JWT
    const payload = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      perfil: user.perfil,
      cep: user.cep,
      avatar: user.avatar,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // expira em 24h
    };

    // Gera o token JWT
    const token = jwtEncode(payload, import.meta.env.VITE_SECRET_API);

    // Salva no localStorage
    localStorage.setItem("auth_token", token);

    return user;
  } catch (error) {
    console.error("Erro no fetchLogin:", error);
    return false;
  }
};

export const resetPasswordSendToken = async (email: string) => {
  try {
    // Busca o usuário pelo email
    const response = await api.get("/usuarios", { params: { email } });
    const users = response.data;

    if (!users || users.length === 0) {
      // Usuário não encontrado
      return false;
    }

    const user = users[0];
    // Gera um código de 4 dígitos aleatórios
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Atualiza o usuário com o novo resetCode
    await api.patch(`/usuarios/${user.id}`, { resetCode });

    return { ...user, resetCode };
  } catch (error) {
    console.error("Erro no resetPasswordSendToken:", error);
    return false;
  }
};

export const resetPassword = async (
  email: string,
  resetCode: string,
  newPassword: string
) => {
  try {
    // 1. Busca o usuário pelo email e resetCode
    const response = await api.get("/usuarios", {
      params: { email, resetCode },
    });
    const users = response.data;

    if (!users || users.length === 0) {
      // Usuário ou código inválido
      return { error: "Código ou email inválido" };
    }

    const user = users[0];

    // 2. Atualiza a senha (e limpa o resetCode)
    await api.patch(`/usuarios/${user.id}`, {
      password: newPassword,
      resetCode: "",
    });

    return { success: true };
  } catch (error) {
    console.error("Erro no resetPassword:", error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};
