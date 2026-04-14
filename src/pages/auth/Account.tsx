import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApiGet } from '@/hooks/use-api';
import { IUser } from '@/interfaces/user';

export default function Account() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: userData, isLoading, error } = useApiGet<IUser>([], '/v1/auth/me');

  return (
    <Layout>
      <Card className='p-6 space-y-4 min-w-[25rem]'>Teste</Card>
    </Layout>
  );
}
