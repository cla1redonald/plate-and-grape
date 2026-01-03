'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

const QUICK_REFINEMENTS = [
  'Lighter',
  'Bolder',
  'Cheaper',
  'Red only',
  'White only',
];

interface RefinementInputProps {
  onRefine: (refinement: string) => void;
  loading?: boolean;
}

export function RefinementInput({ onRefine, loading }: RefinementInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim() && !loading) {
      onRefine(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleQuickRefine = (refinement: string) => {
    if (!loading) {
      onRefine(refinement);
    }
  };

  return (
    <div className="space-y-3">
      {/* Quick Refinement Chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK_REFINEMENTS.map((refinement) => (
          <button
            key={refinement}
            onClick={() => handleQuickRefine(refinement)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full text-sm bg-white border border-[#E5E5E5] text-[#2D2D2D] hover:border-[#722F37] hover:text-[#722F37] transition-colors disabled:opacity-50"
          >
            {refinement}
          </button>
        ))}
      </div>

      {/* Text Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Show me lighter options..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/20 disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || loading}
          className="p-3 rounded-full bg-[#722F37] text-white disabled:opacity-50 hover:bg-[#5a252c] transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
