import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function SigninButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Button onClick={() => navigate('/auth/signin')}>
      <span>{t('signIn')}</span>
    </Button>
  );
}
