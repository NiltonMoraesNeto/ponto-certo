/**
 * Converte minutos para string no formato HH:MM
 * @param minutos Quantidade de minutos
 * @returns String no formato "08:00", "12:30", etc.
 */
export function formatMinutesToHHMM(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }