import { Card } from '@/components/ui/card';

interface ComponentSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const ComponentSection = ({ title, description, children }: ComponentSectionProps) => {
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-semibold text-foreground'>{title}</h3>
        {description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
      </div>
      <Card className='p-8 shadow-md border-border/50 bg-card'>
        <div className='flex flex-wrap items-center gap-4'>{children}</div>
      </Card>
    </div>
  );
};
