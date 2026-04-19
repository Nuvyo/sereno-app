import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button-link';
import { useApiGet } from '@/hooks/use-api';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface CancelAccountConfirmResponse {
  message: string;
}

export default function CancelAccountConfirm() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { isLoading, isSuccess, isError } = useApiGet<CancelAccountConfirmResponse>(
    ['cancel-account-confirm', token ?? ''],
    `/v1/auth/cancel-account/confirm?token=${token}`,
    { enabled: !!token, retry: false },
  );

  const noToken = !token;

  return (
    <Layout>
      <div className='flex w-full h-full items-center justify-center'>
        <Card className='p-8 space-y-6 min-w-[22rem] max-w-sm w-full flex flex-col items-center text-center'>
          {isLoading && (
            <>
              <Loader2 className='h-12 w-12 text-primary animate-spin' />
              <div className='space-y-1'>
                <h2 className='text-lg font-semibold text-foreground'>{t('cancelAccountConfirm.confirming')}</h2>
              </div>
            </>
          )}

          {isSuccess && (
            <>
              <CheckCircle2 className='h-12 w-12 text-green-500' />
              <div className='space-y-1'>
                <h2 className='text-lg font-semibold text-foreground'>{t('cancelAccountConfirm.success')}</h2>
                <p className='text-sm text-muted-foreground'>{t('cancelAccountConfirm.successDescription')}</p>
              </div>
              <ButtonLink to='/auth/signin' variant='default'>
                {t('cancelAccountConfirm.goToSignin')}
              </ButtonLink>
            </>
          )}

          {(isError || noToken) && (
            <>
              <XCircle className='h-12 w-12 text-destructive' />
              <div className='space-y-1'>
                <h2 className='text-lg font-semibold text-foreground'>{t('cancelAccountConfirm.error')}</h2>
                <p className='text-sm text-muted-foreground'>{t('cancelAccountConfirm.errorDescription')}</p>
              </div>
              <ButtonLink to='/auth/signin' variant='default'>
                {t('cancelAccountConfirm.goToSignin')}
              </ButtonLink>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}
