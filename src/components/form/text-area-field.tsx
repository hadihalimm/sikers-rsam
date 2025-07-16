import { AlertCircle } from 'lucide-react';
import { useFieldContext } from '.';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

interface TextAreaFieldProps {
  label: string;
  className?: string;
}

const TextAreaField = ({ label, className }: TextAreaFieldProps) => {
  const field = useFieldContext<string>();
  return (
    <div className="flex flex-col gap-y-1">
      <Label className="ml-1">{label}</Label>
      <Textarea
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={cn('', className)}
        rows={3}
        autoComplete="off"
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

export default TextAreaField;
