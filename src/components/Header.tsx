import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header className='sticky flex items-center justify-between top-0 z-50 w-full py-2 sm:px-4 border-b backdrop-blur border-slate-400'>
      <h1 className='text-2xl font-bold'>Sereno App</h1>

      <div className='flex gap-2'>
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
}
