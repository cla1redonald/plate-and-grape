'use client';

import { useState, KeyboardEvent } from 'react';
import { Chip } from './Chip';
import { Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onTagsChange, placeholder = 'Add item...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim().toLowerCase())) {
        onTagsChange([...tags, inputValue.trim().toLowerCase()]);
      }
      setInputValue('');
      setIsAdding(false);
    } else if (e.key === 'Escape') {
      setInputValue('');
      setIsAdding(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip key={tag} label={tag} removable onRemove={() => removeTag(tag)} />
        ))}
        {isAdding ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setInputValue('');
              setIsAdding(false);
            }}
            placeholder={placeholder}
            autoFocus
            className="px-3 py-1.5 rounded-full border border-[#722F37] text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37] min-w-[120px]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-[#9B9B9B] text-[#9B9B9B] text-sm hover:border-[#722F37] hover:text-[#722F37] transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
