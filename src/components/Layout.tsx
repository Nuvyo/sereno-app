import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard,
  MousePointer,
  FormInput,
  CreditCard,
  MessageSquare,
  Bell,
  Navigation,
  Table,
  Image,
  PanelLeft,
  Info,
  Keyboard,
  Menu,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { path: '/components', label: 'Overview', icon: LayoutDashboard },
  { path: '/components/buttons', label: 'Buttons', icon: MousePointer },
  { path: '/components/forms', label: 'Forms', icon: FormInput },
  { path: '/components/cards', label: 'Cards', icon: CreditCard },
  { path: '/components/dialogs', label: 'Dialogs', icon: MessageSquare },
  { path: '/components/alerts', label: 'Alerts', icon: Bell },
  { path: '/components/navigation', label: 'Navigation', icon: Navigation },
  { path: '/components/data-display', label: 'Data Display', icon: Table },
  { path: '/components/carousel', label: 'Carousel', icon: Image },
  { path: '/components/layout', label: 'Layout', icon: PanelLeft },
  { path: '/components/sidebar', label: 'Sidebar', icon: PanelLeft },
  { path: '/components/feedback', label: 'Feedback', icon: Info },
  { path: '/components/advanced-inputs', label: 'Advanced Inputs', icon: Keyboard },
  { path: '/components/menus', label: 'Menus', icon: Menu },
  { path: '/components/misc', label: 'Diversos', icon: Sparkles },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-sidebar-border px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  UI Showcase
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">Componentes Interativos</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border px-6 py-4">
            <p className="text-xs text-muted-foreground">Sistema de Design © 2025</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64">
        <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
};
