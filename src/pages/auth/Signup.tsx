import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useApiPost } from '@/hooks/use-api';
import { IUser } from '@/interfaces/user';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ButtonLink } from '../../components/ui/button-link';

class SignupFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;

  constructor() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.passwordConfirmation = '';
  }
}

export default function Signup() {
  const { t } = useTranslation();
  const form = useForm<SignupFormValues>({
    defaultValues: new SignupFormValues(),
  });
  const { mutateAsync: post, isPending } = useApiPost<IUser>('/v1/auth/signup');

  const onSubmit = (body: SignupFormValues) => {
    if (body.password !== body.passwordConfirmation) {
      toast.error(t('error.passwordsDoNotMatch'), { position: 'top-center' });
      return;
    }

    post(body)
      .then(() => {
        toast.success('Usuário cadastrado com sucesso!', { position: 'top-center' });
      })
      .catch((error) => {
        toast.error(`Erro ao cadastrar usuário: ${error.message}`, { position: 'top-center' });
      });
  };

  return (
    <Layout>
      <div className='flex w-full y-full items-center justify-center'>
        <Card className='p-6 space-y-4 min-w-[25rem]'>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
            <div className='flex flex-col space-y-4'>
              <Input type='text' placeholder={t('field.name')} {...form.register('name')} />

              <Input type='email' placeholder={t('field.email')} {...form.register('email')} />

              <Input type='password' placeholder={t('field.password')} {...form.register('password')} />

              <Input
                type='password'
                placeholder={t('field.confirmPassword')}
                {...form.register('passwordConfirmation')}
              />
            </div>

            <div className='flex flex-col items-center justify-center space-y-4'>
              <Button type='submit' className='' disabled={isPending}>
                {t('signUp')}
              </Button>

              <ButtonLink to='/auth/signin'>{t('redirectToSignIn')}</ButtonLink>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
