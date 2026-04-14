import { useCallback, useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

export function useSession() {
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      // Tenta acessar o endpoint /me para verificar se há uma sessão ativa
      await apiService.get('/v1/auth/me');
      setHasSession(true);
    } catch (_error) {
      // Se receber 401 ou qualquer erro, não há sessão
      setHasSession(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verifica sessão ao montar o componente
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return { hasSession, isLoading, checkSession };
}
