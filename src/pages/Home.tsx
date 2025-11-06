import { Card } from '@/components/ui/card';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-foreground">Bem-vindo</h1>

      <p className="mt-2 text-muted-foreground">
        Esta é a página inicial
      </p>

      <Card className="p-6">
        Olá
      </Card>
    </Layout>
  );
};
