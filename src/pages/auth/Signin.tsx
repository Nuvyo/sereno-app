import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useApiPost } from '@/hooks/use-api';
import { toast } from 'sonner';
import { ButtonLink } from '@/components/ui/button-link';
import { useNavigate } from 'react-router-dom';
import { ISession } from '@/interfaces/session';
import { useSession } from '@/hooks/use-session';
import { useEffect } from 'react';

class SigninFormValues {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}

export default function Signin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { checkSession, hasSession, isLoading: isSessionLoading } = useSession();
  const form = useForm<SigninFormValues>({
    defaultValues: new SigninFormValues(),
  });
  const { mutateAsync: post, isPending } = useApiPost<ISession>('/v1/auth/signin');
  const validateBody = (body: SigninFormValues) => {
    if (!body.email) {
      toast.error(t('form.emailRequired'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(body.email)) {
      toast.error(t('form.invalidEmail'));
      return false;
    }

    if (!body.password) {
      toast.error(t('form.passwordRequired'));
      return false;
    }

    return true;
  };
  const onSubmit = (body: SigninFormValues) => {
    const isValid = validateBody(body);

    if (!isValid) {
      return;
    }

    post(body)
      .then(async () => {
        // Valida a sessão após o login bem-sucedido
        await checkSession();
        navigate('/auth/account');
      })
      .catch((error) => {
        toast.error(error.message || t('serverError'));
      });
  };

  useEffect(() => {
    if (!isSessionLoading && hasSession) {
      navigate('/');
    }
  }, [hasSession, isSessionLoading, navigate]);

  return (
    <Layout>
      <div className='flex w-full y-full items-center justify-center'>
        <Card className='p-6 space-y-4 min-w-[25rem]'>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
            <div className='flex flex-col space-y-4'>
              <Input type='email' placeholder={t('field.email')} {...form.register('email')} />

              <Input type='password' placeholder={t('field.password')} {...form.register('password')} />
            </div>

            <div className='flex flex-col items-center justify-center space-y-4'>
              <Button type='submit' className='' disabled={isPending}>
                {t('signIn')}
              </Button>

              <ButtonLink to='/auth/signup'>{t('redirectToSignUp')}</ButtonLink>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
