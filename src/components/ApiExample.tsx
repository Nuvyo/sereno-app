import React from 'react';
import { useApiGet, useApiPost } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';

// Exemplo de tipos para a API
interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserData extends Record<string, unknown> {
  name: string;
  email: string;
}

export function ApiExample() {
  // Exemplo de requisição GET
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useApiGet<User[]>(['users'], '/users');

  // Exemplo de requisição POST
  const createUserMutation = useApiPost<User, CreateUserData>('/users', {
    onSuccess: () => {
      console.log('Usuário criado com sucesso!');
      refetch(); // Recarrega a lista de usuários
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
    },
  });

  const handleCreateUser = () => {
    createUserMutation.mutate({
      name: 'João Silva',
      email: 'joao@exemplo.com',
    });
  };

  if (isLoading) {
    return <div>Carregando usuários...</div>;
  }

  if (error) {
    return <div>Erro ao carregar usuários: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exemplo de Integração com API</h2>
      
      <div className="mb-4">
        <Button 
          onClick={handleCreateUser}
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? 'Criando...' : 'Criar Usuário'}
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Lista de Usuários:</h3>
        {users?.data && users.data.length > 0 ? (
          <ul className="space-y-2">
            {users.data.map((user) => (
              <li key={user.id} className="p-2 border rounded">
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}
