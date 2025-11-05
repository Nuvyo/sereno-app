import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { useQuery } from '@tanstack/react-query';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const fetchTodo = async (): Promise<Todo> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  if (!res.ok) throw new Error('Falha ao buscar exemplo');
  return res.json();
};

const Home = () => {
  const { data, isLoading, isError, refetch, error, isFetching } = useQuery({
    queryKey: ['example-todo'],
    queryFn: fetchTodo,
    // evita buscar automaticamente para deixar claro o exemplo; o primeiro fetch ocorre ao montar
    // enabled: false,
  });

  return (
    <main className="mx-auto max-w-5xl px-8 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo</h1>
          <p className="mt-2 text-muted-foreground">
            Esta página inicial traz um exemplo simples de consulta a uma API pública usando React
            Query.
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Exemplo de consulta</h2>
              <p className="text-sm text-muted-foreground">
                Endpoint: jsonplaceholder.typicode.com/todos/1
              </p>
            </div>
            <Button onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Buscando...' : 'Recarregar'}
            </Button>
          </div>

          <div className="mt-4 text-sm">
            {isLoading && <p className="text-muted-foreground">Carregando…</p>}
            {isError && <p className="text-destructive">Erro: {(error as Error)?.message}</p>}
            {data && (
              <div className="space-y-1">
                <p>
                  <span className="font-medium">ID:</span> {data.id}
                </p>
                <p>
                  <span className="font-medium">Título:</span> {data.title}
                </p>
                <p>
                  <span className="font-medium">Concluído:</span> {data.completed ? 'Sim' : 'Não'}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Home;
