import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Main from '@/components/Main';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}
