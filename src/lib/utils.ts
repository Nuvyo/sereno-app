import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy hh:mm:ss)
 * @param dateString - String da data em formato ISO ou timestamp
 * @returns Data formatada no padrão brasileiro
 */
export function formatDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Sao_Paulo'
    }).format(date);
  } catch {
    return 'Data inválida';
  }
}

/**
 * Formata uma data de forma relativa (ex: "há 2 minutos", "ontem")
 * @param dateString - String da data em formato ISO ou timestamp
 * @returns Data formatada de forma relativa
 */
export function formatRelativeDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'agora mesmo';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    }
    
    // Para datas mais antigas, mostrar a data formatada
    return formatDate(date);
  } catch {
    return 'Data inválida';
  }
}
