import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { RenstraDetail } from '@/types/database';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface IndikatorSasaranTargetFilterDropdownProps {
  data: RenstraDetail[];
  selectedLevels: number[];
  onFilterChange: (levels: number[]) => void;
}

const IndikatorSasaranTargetFilterDropdown = ({
  data,
  selectedLevels,
  onFilterChange,
}: IndikatorSasaranTargetFilterDropdownProps) => {
  const levelOptions = Array.from(
    new Set(
      data.flatMap((renstra) =>
        renstra.sasaranList.map((sasaran) => sasaran.level),
      ),
    ),
  )
    .sort((a, b) => a - b)
    .map((level) => ({
      label: `Level ${level}`,
      value: level,
    }));

  const [sasaranLevels, setSasaranLevels] = useState<number[]>(() => {
    return selectedLevels || levelOptions.map((option) => option.value);
  });

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) {
          onFilterChange(sasaranLevels);
        }
      }}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="w-8">
          <SlidersHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter Sasaran</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 flex flex-col gap-y-2">
          {levelOptions.map((level) => (
            <div key={level.value} className="flex gap-x-2">
              <Checkbox
                id={String(level.value)}
                checked={sasaranLevels.includes(level.value)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...sasaranLevels, level.value]
                    : sasaranLevels.filter((value) => value !== level.value);
                  setSasaranLevels(next);
                }}
              />
              <Label htmlFor={String(level.value)}>{level.label}</Label>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IndikatorSasaranTargetFilterDropdown;
