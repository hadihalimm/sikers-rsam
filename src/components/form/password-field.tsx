import { cn } from '@/lib/utils';
import { useFieldContext } from '.';
import { Input } from '../ui/input';
import { AlertCircle, Eye, EyeClosed } from 'lucide-react';
import { Label } from '../ui/label';
import { InputHTMLAttributes, useState } from 'react';

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

const PasswordField = ({
  label,
  className,
  ...inputProps
}: PasswordFieldProps) => {
  const field = useFieldContext<string>();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col gap-y-1">
      <Label className="ml-1">{label}</Label>
      <div className="flex relative items-center">
        <Input
          type={showPassword ? 'text' : 'password'}
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className={cn('', className)}
          autoComplete="off"
          {...inputProps}
        />
        <button
          type="button"
          className="absolute right-3"
          onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <Eye /> : <EyeClosed />}
        </button>
      </div>
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

export default PasswordField;
