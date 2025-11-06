import { Card } from '@/components/ui/card';
import { useApiGet } from '@/hooks/use-api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatRelativeDate } from '@/lib/utils';
import Layout from '@/components/Layout';

interface ServerStatus {
  updated_at: string;
  dependencies: {
    database: {
      version: string;
      max_connections: number;
      opened_connections: number;
    };
  };
}

export default function ServerStatus() {
  const {
    data: serverStatus,
    isLoading,
    error,
    refetch
  } = useApiGet<ServerStatus>([], '');

  if (isLoading) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold text-foreground">Status do Servidor</h1>

        <Card>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold text-foreground">Status do Servidor</h1>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>Erro ao carregar status do servidor: {error.message}</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-foreground">Status do Servidor</h1>

      <Card className="p-6 space-y-4">
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground">Última atualização:</span>
          <div className="space-y-1">
            <div className="font-medium">{serverStatus?.updated_at ? formatDate(serverStatus.updated_at) : 'N/A'}</div>
            <div className="text-sm text-muted-foreground">({serverStatus?.updated_at ? formatRelativeDate(serverStatus.updated_at) : 'N/A'})</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Banco de dados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Versão</span>
              <div className="font-medium">{serverStatus?.dependencies.database.version}</div>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Máx. conexões</span>
              <div className="font-medium">{serverStatus?.dependencies.database.max_connections}</div>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Conexões abertas</span>
              <div className="font-medium">{serverStatus?.dependencies.database.opened_connections}</div>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
