export function formatCurrency(value: number): string {
  // Garante que o valor seja tratado como número para o Real Brasileiro
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatDate(date: string | Date): string {
  try {
    // Se a data vier vazia ou inválida, não quebra o app do mestre
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Data inválida";
    
    return new Intl.DateTimeFormat('pt-BR').format(d);
  } catch {
    return "Data inválida";
  }
}
