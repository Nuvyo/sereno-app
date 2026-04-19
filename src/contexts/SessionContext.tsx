import { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { apiService } from '@/lib/api';
import { SessionContext, SessionContextType } from './session.types';

const SESSION_CHANNEL = 'sereno_session';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const applySession = useCallback((value: boolean) => {
    setHasSession(value);
    channelRef.current?.postMessage({ hasSession: value });
  }, []);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiService.get('/v1/auth/me');
      applySession(true);
    } catch (_error) {
      applySession(false);
    } finally {
      setIsLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    const channel = new BroadcastChannel(SESSION_CHANNEL);

    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<{ hasSession: boolean }>) => {
      setHasSession(event.data.hasSession);
    };

    checkSession();

    return () => channel.close();
  }, [checkSession]);

  const value: SessionContextType = { hasSession, isLoading, checkSession };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
