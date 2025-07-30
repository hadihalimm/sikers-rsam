import { cn } from '@/lib/utils';
import { useFieldContext } from '.';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

const SelectField = ({
  label,
  options,
  placeholder,
  disabled,
  className,
  onValueChange,
}: SelectFieldProps) => {
  const field = useFieldContext<string>();
  const handleValueChange = (value: string) => {
    field.handleChange(value);
    onValueChange?.(value);
  };
  return (
    <div className="flex flex-col gap-y-1">
      <Label className="ml-1">{label}</Label>
      <Select
        value={field.state.value}
        onValueChange={handleValueChange}
        disabled={disabled}>
        <SelectTrigger className={cn('w-full !h-auto', className)}>
          <div className="text-start">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>

        <SelectContent className="w-full max-w-[var(--radix-select-trigger-width)]">
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
