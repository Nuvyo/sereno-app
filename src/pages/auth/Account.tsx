import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useApiGet, useApiPatch, useApiDeletePlain } from '@/hooks/use-api';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import { IUser } from '@/interfaces/user';

interface UpdateProfileValues {
  name: string;
}

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

interface MessageResponse {
  message: string;
}

export default function Account() {
  const { t } = useTranslation();

  const { data: user, isLoading } = useApiGet<IUser>(['me'], '/v1/auth/me');

  const profileForm = useForm<UpdateProfileValues>({ values: { name: user?.name ?? '' } });
  const passwordForm = useForm<ChangePasswordValues>({
    defaultValues: { currentPassword: '', newPassword: '', newPasswordConfirmation: '' },
  });

  const [profilePending, setProfilePending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);

  const { mutateAsync: patchMe } = useApiPatch<MessageResponse, Record<string, string>>('/v1/auth/me');
  const { mutateAsync: cancelAccount, isPending: cancelPending } = useApiDeletePlain<MessageResponse>(
    '/v1/auth/cancel-account',
  );

  const onSaveProfile = (values: UpdateProfileValues) => {
    if (!values.name.trim()) {
      toast.error(t('form.nameRequired'));
      return;
    }

    setProfilePending(true);
    patchMe({ name: values.name })
      .then(() => toast.success(t('account.profileUpdated')))
      .catch((err) => toast.error(err.message || t('serverError')))
      .finally(() => setProfilePending(false));
  };

  const onChangePassword = (values: ChangePasswordValues) => {
    if (!values.currentPassword) {
      toast.error(t('form.passwordRequired'));
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(values.newPassword)) {
      toast.error(t('form.passwordInvalid'));
      return;
    }

    if (values.newPassword !== values.newPasswordConfirmation) {
      toast.error(t('form.passwordsDoNotMatch'));
      return;
    }

    setPasswordPending(true);
    patchMe({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      newPasswordConfirmation: values.newPasswordConfirmation,
    })
      .then(() => {
        toast.success(t('account.passwordUpdated'));
        passwordForm.reset();
      })
      .catch((err) => toast.error(err.message || t('serverError')))
      .finally(() => setPasswordPending(false));
  };

  const onCancelAccount = () => {
    cancelAccount()
      .then(() => toast.success(t('account.cancelAccountEmailSent')))
      .catch((err) => toast.error(err.message || t('serverError')));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className='flex w-full h-full items-center justify-center'>
          <p className='text-sm text-muted-foreground'>Carregando…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex w-full h-full justify-center py-10 px-4'>
        <div className='w-full max-w-lg space-y-6'>
          <h1 className='text-2xl font-semibold'>{t('account.title')}</h1>

          {/* Profile */}
          <Card className='p-6 space-y-4'>
            <h2 className='text-base font-medium'>{t('account.profileSection')}</h2>
            <p className='text-sm text-muted-foreground'>{user?.email}</p>
            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className='flex flex-col gap-3'>
              <Input
                type='text'
                placeholder={t('account.namePlaceholder')}
                {...profileForm.register('name')}
              />
              <Button type='submit' disabled={profilePending} className='self-end'>
                {t('account.saveProfile')}
              </Button>
            </form>
          </Card>

          {/* Change password */}
          <Card className='p-6 space-y-4'>
            <h2 className='text-base font-medium'>{t('account.passwordSection')}</h2>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className='flex flex-col gap-3'>
              <Input
                type='password'
                placeholder={t('account.currentPassword')}
                {...passwordForm.register('currentPassword')}
              />
              <Input
                type='password'
                placeholder={t('account.newPassword')}
                {...passwordForm.register('newPassword')}
              />
              <Input
                type='password'
                placeholder={t('account.confirmNewPassword')}
                {...passwordForm.register('newPasswordConfirmation')}
              />
              <Button type='submit' disabled={passwordPending} className='self-end'>
                {t('account.savePassword')}
              </Button>
            </form>
          </Card>

          {/* Danger zone */}
          <Card className='p-6 space-y-4 border-destructive/40'>
            <h2 className='text-base font-medium text-destructive'>{t('account.dangerZone')}</h2>
            <p className='text-sm text-muted-foreground'>{t('account.cancelAccountDescription')}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive' disabled={cancelPending}>
                  {t('account.cancelAccount')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('account.cancelAccountConfirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('account.cancelAccountConfirmDescription')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('account.cancelAccountCancelButton')}</AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    onClick={onCancelAccount}
                  >
                    {t('account.cancelAccountConfirmButton')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
