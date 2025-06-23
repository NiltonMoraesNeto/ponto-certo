// Função utilitária para pegar data/hora local em formato ISO (yyyy-MM-ddTHH:mm:ss)
export function getLocalISOString() {
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - tzOffsetMs)
      .toISOString()
      .slice(0, 19);
    return localISOTime;
  }