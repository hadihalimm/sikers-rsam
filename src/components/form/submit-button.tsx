import React from 'react';
import { useFormContext } from '.';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface SubmitButtonprops {
  children: React.ReactNode;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
  className?: string;
}

const SubmitButton = ({ children, variant, className }: SubmitButtonprops) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          variant={variant}
          disabled={isSubmitting}
          className={cn('', className)}>
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
};

export default SubmitButton;
