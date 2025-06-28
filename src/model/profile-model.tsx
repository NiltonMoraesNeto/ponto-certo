export interface TokenPayload {
  id: string;
  email: string;
  nome: string;
  perfil: string;
  cep: string;
  avatar: string;
  exp: number; // Expiração do token em timestamp UNIX (segundos)
}

export interface ProfileList {
  id: number;
  descricao: string;
}

export interface FormDataAddProfile {
  descricao: string;
}

export type NewProfileForm = {
  descricao: string;
};
