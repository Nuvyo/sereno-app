import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { ButtonLink } from '@/components/ui/button-link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>404</AlertTitle>
        <AlertDescription>Página não encontrada</AlertDescription>
      </Alert>

      <ButtonLink to='/'>Voltar para a página inicial</ButtonLink>
    </Layout>
  );
}
