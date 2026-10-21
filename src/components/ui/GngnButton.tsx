import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'gold' | 'pink' | 'dark';
  children: ReactNode;
};

export function GngnButton({ variant = 'gold', className = '', children, ...rest }: Props) {
  return (
    <button type="button" className={`gngn-btn gngn-btn--${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
