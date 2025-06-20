export function getCurrentQuinzena(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = date.getDate();
  
    // Descobre o último dia do mês
    const lastDay = new Date(year, date.getMonth() + 1, 0).getDate();
  
    if (day <= 15) {
      // Primeira quinzena
      return `${year}-${month}-01_${year}-${month}-15`;
    } else {
      // Segunda quinzena
      return `${year}-${month}-16_${year}-${month}-${lastDay}`;
    }
}
  
export function getQuinzenaString({
  year,
  month,
  quinzena,
}: {
  year: number;
  month: number;
  quinzena: "1" | "2";
}) {
  const m = month.toString().padStart(2, "0");
  if (quinzena === "1") {
    return `${year}-${m}-01_${year}-${m}-15`;
  }
  // Último dia do mês
  const last = new Date(year, month, 0).getDate();
  return `${year}-${m}-16_${year}-${m}-${last}`;
}