import { useContext } from 'react';
import { SessionContext, SessionContextType } from './session.types';

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession deve ser usado dentro de SessionProvider');
  }

  return context;
}
