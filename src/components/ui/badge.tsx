import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest transition-colors', {
  variants: {
    variant: {
      default: 'border-transparent bg-signal-500/15 text-signal-400',
      volt: 'border-transparent bg-volt/15 text-volt',
      outline: 'border-white/15 text-mist',
      destructive: 'border-transparent bg-destructive/15 text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
