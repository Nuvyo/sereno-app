import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/use-theme';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ThemeToggle() {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === 'dark';
  const sun = <Sun className='h-4 w-4 text-gray-950 dark:text-gray-50' />;
  const moon = <Moon className='h-4 w-4 text-gray-950 dark:text-gray-50' />;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='h-9 w-9'>
        {sun}
      </Button>
    );
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='h-9 w-9'
      title={t('toggleTheme')}
    >
      {isDark ? sun : moon}
      <span className='sr-only'>{t('toggleTheme')}</span>
    </Button>
  );
}
