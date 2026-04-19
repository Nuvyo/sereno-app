import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SigninButton } from '@/components/SigninButton';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { useApiPost } from '../hooks/use-api';
import { ISession } from '../interfaces/session';
import { UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authPages = ['/auth/signin', '/auth/signup'];
  const isAuthPage = authPages.includes(location.pathname);
  const { hasSession, checkSession } = useSession();
  const { mutateAsync: postSignout } = useApiPost<ISession>('/v1/auth/signout');
  const signout = async () => {
    localStorage.removeItem('session');
    await postSignout(null);
    await checkSession();
    navigate('/auth/signin');
  };
  const unloggedHeader = (
    <header className='sticky flex items-center top-0 z-50 w-full py-2 sm:px-4 justify-between'>
      <h1 className='text-2xl font-bold cursor-pointer' onClick={() => navigate('/')}>
        Sereno App
      </h1>

      <div className='flex gap-2'>
        <ThemeToggle />
        <LanguageToggle />
        {!isAuthPage && <SigninButton />}
      </div>
    </header>
  );
  const loggedHeader = (
    <header className='sticky flex items-center top-0 z-50 w-full py-2 sm:px-4 justify-between border-b backdrop-blur border-slate-400'>
      <h1 className='text-2xl font-bold cursor-pointer' onClick={() => navigate('/')}>
        Sereno App
      </h1>

      <div className='flex gap-2'>
        <ThemeToggle />
        <LanguageToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <UserCircle className='h-5 w-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => navigate('/auth/account')}>{t('myAccount')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signout()}>{t('signOut')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );

  return hasSession ? loggedHeader : unloggedHeader;
}
