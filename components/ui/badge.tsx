import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-500 text-white',
        secondary: 'border-transparent bg-secondary-500 text-white',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'border-gray-300 bg-transparent text-gray-700',
        info: 'border-transparent bg-blue-500 text-white',
        warning: 'border-transparent bg-yellow-500 text-black',
        success: 'border-transparent bg-kick-green text-white',
        light: 'border-gray-300 bg-gray-100 text-gray-800',
        dark: 'border-gray-700 bg-gray-900 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };