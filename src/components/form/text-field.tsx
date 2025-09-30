import { cn } from '@/lib/utils';
import { useFieldContext } from '.';
import { Input } from '../ui/input';
import { AlertCircle } from 'lucide-react';
import { Label } from '../ui/label';
import { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

const TextField = ({ label, className, ...inputProps }: TextFieldProps) => {
  const field = useFieldContext<string>();
  return (
    <div className="flex flex-col gap-y-1">
      <Label className="ml-1">{label}</Label>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={cn('', className)}
        autoComplete="off"
        {...inputProps}
      />
      {field.state.meta.isTouched &&
        field.state.meta.errors.map(({ message }, index) => (
          <div key={index} className="flex items-center gap-x-1">
            <AlertCircle size="15" className="text-destructive" />
            <p className="text-xs text-destructive">{message}</p>
          </div>
        ))}
    </div>
  );
};

export default TextField;
