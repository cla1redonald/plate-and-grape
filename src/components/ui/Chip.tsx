'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  selected?: boolean;
  removable?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
}

export function Chip({ label, selected, removable, onToggle, onRemove }: ChipProps) {
  if (removable) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#722F37] text-white text-sm">
        {label}
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
        >
          <X size={14} />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
        selected
          ? 'bg-[#722F37] text-white'
          : 'bg-white text-[#2D2D2D] border border-[#E5E5E5] hover:border-[#722F37]'
      )}
    >
      {label}
    </button>
  );
}
