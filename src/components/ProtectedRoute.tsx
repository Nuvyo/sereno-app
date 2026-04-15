import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { hasSession, isLoading } = useSession();

  if (isLoading) {
    return <div className='flex items-center justify-center min-h-screen'>Carregando…</div>;
  }

  if (!hasSession) {
    return <Navigate to='/auth/signin' replace />;
  }

  return children;
}
