import { useCallback, useEffect, useState, ReactNode } from 'react';
import { apiService } from '@/lib/api';
import { SessionContext, SessionContextType } from './session.types';

export function SessionProvider({ children }: { children: ReactNode }) {
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

  const value: SessionContextType = { hasSession, isLoading, checkSession };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
