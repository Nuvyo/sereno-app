import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CommonProps = Omit<ButtonProps, 'asChild' | 'href'> & {
  className?: string;
  children: React.ReactNode;
};

type RouterLinkProps = CommonProps & {
  to: string;
  href?: never;
  external?: never;
};

type AnchorLinkProps = CommonProps & {
  href: string;
  to?: never;
  external?: boolean;
};

export type ButtonLinkProps = RouterLinkProps | AnchorLinkProps;

export const ButtonLink = React.forwardRef<HTMLButtonElement, ButtonLinkProps>(
  ({ children, className, variant = 'link', size, ...rest }, ref) => {
    if ('to' in rest) {
      const { to, ...btnProps } = rest;

      return (
        <Button ref={ref} variant={variant} size={size} className={cn(className)} asChild {...btnProps}>
          <Link to={to}>{children}</Link>
        </Button>
      );
    }

    const { href, external, ...btnProps } = rest;

    return (
      <Button ref={ref} variant={variant} size={size} className={cn(className)} asChild {...btnProps}>
        <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      </Button>
    );
  },
);
ButtonLink.displayName = 'ButtonLink';
