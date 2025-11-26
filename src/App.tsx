import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import ServerStatus from '@/pages/ServerStatus';
import Signup from '@/pages/auth/Signup';
import Signin from '@/pages/auth/Signin';
import { I18nProvider } from '@/providers/I18nProvider';

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme='system'>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className='p-4 text-sm text-muted-foreground'>Carregando…</div>}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/server-status' element={<ServerStatus />} />
                <Route path='/auth/signup' element={<Signup />} />
                <Route path='/auth/signin' element={<Signin />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
