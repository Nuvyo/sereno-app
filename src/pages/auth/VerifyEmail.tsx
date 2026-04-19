import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApiGet, useApiPost } from '@/hooks/use-api';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/useSession';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface VerifyEmailResponse {
  message: string;
}

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { hasSession, isLoading: isSessionLoading } = useSession();
  const [resendEmail, setResendEmail] = useState('');
  const [resendDone, setResendDone] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && hasSession) {
      navigate('/');
    }
  }, [hasSession, isSessionLoading, navigate]);

  const { isLoading, isSuccess, isError } = useApiGet<VerifyEmailResponse>(
    ['verify-email', token ?? ''],
    `/v1/auth/verify-email?token=${token}`,
    { enabled: !!token && !isSessionLoading && !hasSession, retry: false },
  );

  const { mutateAsync: postResend, isPending: isResending } = useApiPost('/v1/auth/resend-verification');

  const handleResend = async () => {
    await postResend({ email: resendEmail });
    setResendDone(true);
  };

  const noToken = !token;

  return (
    <Layout>
      <div className='flex w-full h-full items-center justify-center'>
        <Card className='p-8 space-y-4 min-w-[22rem] max-w-sm w-full flex flex-col items-center text-center'>
          {isLoading && (
            <>
              <Loader2 className='h-12 w-12 text-primary animate-spin' />
              <div className='space-y-1'>
                <h2 className='text-lg font-semibold text-foreground'>{t('verifyEmail.verifying')}</h2>
              </div>
            </>
          )}

          {isSuccess && (
            <>
              <CheckCircle2 className='h-12 w-12 text-green-500' />
              <div className='space-y-1'>
                <h2 className='text-lg font-semibold text-foreground'>{t('verifyEmail.success')}</h2>
                <p className='text-sm text-muted-foreground'>{t('verifyEmail.successDescription')}</p>
              </div>
              <ButtonLink to='/auth/signin' variant='default'>{t('verifyEmail.goToSignin')}</ButtonLink>
            </>
          )}

          {(isError || noToken) && (
            <>
              <XCircle className='h-12 w-12 text-destructive' />
              <div className='space-y-1'>
                <h2 className='text-lg font-semibold text-foreground'>{t('verifyEmail.error')}</h2>
                <p className='text-sm text-muted-foreground'>{t('verifyEmail.errorDescription')}</p>
              </div>
              {resendDone ? (
                <p className='text-sm text-muted-foreground'>{t('verifyEmail.resendSuccess')}</p>
              ) : (
                <div className='flex w-full gap-2'>
                  <Input
                    type='email'
                    placeholder={t('verifyEmail.resendEmailPlaceholder')}
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                  />
                  <Button onClick={handleResend} disabled={!resendEmail || isResending}>
                    {isResending ? <Loader2 className='h-4 w-4 animate-spin' /> : t('verifyEmail.resendLink')}
                  </Button>
                </div>
              )}
              <p className='text-sm text-muted-foreground'>{t('or')}</p>
              <ButtonLink to='/auth/signin' variant='outline'>{t('verifyEmail.goToSignin')}</ButtonLink>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}
