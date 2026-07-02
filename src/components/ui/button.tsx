import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-signal-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:bg-signal-600 hover:shadow-[0_0_28px_rgba(139,92,246,0.5)]',
        volt: 'bg-volt text-volt-foreground shadow-[0_0_20px_rgba(0,217,255,0.35)] hover:brightness-110',
        outline: 'border border-white/15 bg-transparent hover:bg-white/5 hover:border-white/25',
        ghost: 'hover:bg-white/5',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        link: 'text-signal-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
