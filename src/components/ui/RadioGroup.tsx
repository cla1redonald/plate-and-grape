'use client';

import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export function RadioGroup({ options, value, onChange, name }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
            value === option.value
              ? 'bg-[#722F37]/10 border border-[#722F37]'
              : 'bg-white border border-[#E5E5E5] hover:border-[#722F37]'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-[#722F37] focus:ring-[#722F37]"
          />
          <div>
            <div className="font-medium text-[#2D2D2D]">{option.label}</div>
            {option.description && (
              <div className="text-sm text-[#9B9B9B]">{option.description}</div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
