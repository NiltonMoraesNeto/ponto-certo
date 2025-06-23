export interface Tasks {
  id: string;
  usuarioId: string;
  descricao: string;
  dataCriacao: string;
  dataFinalizacao: string;
  status: boolean;
  quinzena: string;
}

export type RegistroAtividade = {
  id: number;
  usuarioId: number;
  atividadeId: number;
  dataInicio: string;
  dataFim: string | null;
  quinzena?: string;
  duracaoMinutos?: number | null;
};
