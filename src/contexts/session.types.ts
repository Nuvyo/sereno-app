import { createContext } from 'react';

export interface SessionContextType {
  hasSession: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);
