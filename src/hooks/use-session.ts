import { useCallback, useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

export function useSession() {
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiService.get('/v1/auth/me');

      setHasSession(true);
    } catch (_error) {
      setHasSession(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return { hasSession, isLoading, checkSession };
}
