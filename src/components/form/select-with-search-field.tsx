import { useId, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { useFieldContext } from '.';
import { Label } from '../ui/label';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectWithSearchFieldProps {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
}

const SelectWithSearchField = ({
  label,
  options,
  onSelect,
  placeholder,
  disabled,
  className,
}: SelectWithSearchFieldProps) => {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const field = useFieldContext<string>();

  const handleValueChange = (value: string) => {
    field.handleChange(value);
    onSelect?.(value);
  };

  return (
    <div className="flex flex-col gap-y-1">
      <Label className="ml-1">{label}</Label>
      <div className="*:not-first:mt-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                'bg-background hover:bg-background border-input w-full !h-auto max-w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
                className,
              )}>
              <span
                className={cn(
                  'truncate max-w-full whitespace-normal break-words text-start',
                  !field.state.value && 'text-muted-foreground',
                )}>
                {field.state.value
                  ? options.find((option) => option.value === field.state.value)
                      ?.label
                  : `Pilih ${placeholder}`}
              </span>
              <ChevronDownIcon
                size={16}
                className="text-muted-foreground/80 shrink-0"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="border-input w-full min-w-[var(--radix-popper-anchor-width)] max-w-[var(--radix-popover-trigger-width)] p-0"
            align="start">
            <Command>
              <CommandInput placeholder={`Search ${placeholder}...`} />
              <CommandList>
                <CommandEmpty>Tidak ada data.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        handleValueChange(option.value);
                        setOpen(false);
                      }}>
                      {option.label}
                      {field.state.value === option.value && (
                        <CheckIcon size={16} className="ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SelectWithSearchField;
