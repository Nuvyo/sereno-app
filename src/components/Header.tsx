import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SigninButton } from '@/components/SigninButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { useApiPost } from '../hooks/use-api';
import { ISession } from '../interfaces/session';

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasSession } = useSession();
  const { mutateAsync: postSignout } = useApiPost<ISession>('/v1/auth/signout');
  const unloggedClasses = '';
  const loggedClasses = 'border-b backdrop-blur border-slate-400';
  const authPages = ['/auth/signin', '/auth/signup'];
  const isAuthPage = authPages.includes(location.pathname);
  const signout = () => {
    localStorage.removeItem('session');
    navigate('/auth/signin');
    postSignout(null);
  };

  return (
    <header
      className={`sticky flex items-center top-0 z-50 w-full py-2 sm:px-4 justify-between ${hasSession ? loggedClasses : unloggedClasses}`}
    >
      <h1 className='text-2xl font-bold cursor-pointer' onClick={() => navigate('/')}>
        Sereno App
      </h1>

      <div className='flex gap-2'>
        <ThemeToggle />
        <LanguageToggle />
        {!isAuthPage && !hasSession && <SigninButton />}
        {!isAuthPage && hasSession && (
          <Button onClick={() => signout()}>
            <span>{t('signOut')}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
