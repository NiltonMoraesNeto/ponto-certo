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
    const response = await api.post("/usuarios/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Erro no fetchLogin:", error);
    return false;
  }
};

export const resetPassword = async (
  email: string,
  resetCode: string,
  newPassword: string
) => {
  try {
    const response = await api.put("/usuarios/reset-password", {
      email,
      resetCode,
      newPassword,
    });
    return response;
  } catch (error) {
    console.error("Erro no resetPassword:", error);
    return error;
  }
};

export const resetCodeDelete = async (email: string, resetCode: string) => {
  try {
    const response = await api.put("/usuarios/clean-resetCode", {
      email,
      resetCode,
    });
    return response;
  } catch (error) {
    console.error("Erro no resetCode Delete:", error);
    return error;
  }
};
