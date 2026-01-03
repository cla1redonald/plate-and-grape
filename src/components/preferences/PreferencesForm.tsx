'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { TagInput } from '@/components/ui/TagInput';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { ArrowLeft } from 'lucide-react';
import { PreferencesInput, PriceSensitivity } from '@/types';

const CUISINE_OPTIONS = [
  'Italian',
  'French',
  'Asian',
  'Mediterranean',
  'Modern British',
  'Spanish',
  'Indian',
  'Middle Eastern',
];

const PRICE_OPTIONS = [
  { value: 'budget', label: 'Budget-friendly', description: 'Best value options' },
  { value: 'moderate', label: 'Moderate', description: 'Balance of quality and price' },
  { value: 'premium', label: 'Treat yourself', description: 'Best quality, price secondary' },
];

interface PreferencesFormProps {
  initialPreferences: PreferencesInput;
  onSave: (preferences: PreferencesInput) => Promise<void>;
  onBack: () => void;
}

export function PreferencesForm({ initialPreferences, onSave, onBack }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<PreferencesInput>(initialPreferences);
  const [saving, setSaving] = useState(false);

  const toggleCuisine = (cuisine: string) => {
    const lower = cuisine.toLowerCase();
    setPreferences((prev) => ({
      ...prev,
      cuisine_styles: prev.cuisine_styles.includes(lower)
        ? prev.cuisine_styles.filter((c) => c !== lower)
        : [...prev.cuisine_styles, lower],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(preferences);
      onBack();
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="sticky top-0 bg-[#FAF7F2] border-b border-[#E5E5E5] px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-[#2D2D2D]" />
        </button>
        <h1 className="text-xl font-semibold text-[#2D2D2D]">Preferences</h1>
      </header>

      {/* Form */}
      <div className="p-4 space-y-6 pb-24">
        {/* Cuisine Styles */}
        <section>
          <h2 className="text-lg font-medium text-[#2D2D2D] mb-2">Cuisine Styles</h2>
          <p className="text-sm text-[#9B9B9B] mb-3">What do you enjoy?</p>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((cuisine) => (
              <Chip
                key={cuisine}
                label={cuisine}
                selected={preferences.cuisine_styles.includes(cuisine.toLowerCase())}
                onToggle={() => toggleCuisine(cuisine)}
              />
            ))}
          </div>
        </section>

        <hr className="border-[#E5E5E5]" />

        {/* Price Sensitivity */}
        <section>
          <h2 className="text-lg font-medium text-[#2D2D2D] mb-2">Price Sensitivity</h2>
          <p className="text-sm text-[#9B9B9B] mb-3">What&apos;s your budget mindset?</p>
          <RadioGroup
            name="price_sensitivity"
            options={PRICE_OPTIONS}
            value={preferences.price_sensitivity}
            onChange={(value) =>
              setPreferences((prev) => ({
                ...prev,
                price_sensitivity: value as PriceSensitivity,
              }))
            }
          />
        </section>

        <hr className="border-[#E5E5E5]" />

        {/* Allergies */}
        <section>
          <h2 className="text-lg font-medium text-[#2D2D2D] mb-2">Allergies</h2>
          <p className="text-sm text-[#9B9B9B] mb-3">
            We&apos;ll strictly avoid these in recommendations
          </p>
          <TagInput
            tags={preferences.allergies}
            onTagsChange={(allergies) => setPreferences((prev) => ({ ...prev, allergies }))}
            placeholder="e.g., shellfish"
          />
        </section>

        <hr className="border-[#E5E5E5]" />

        {/* Dislikes */}
        <section>
          <h2 className="text-lg font-medium text-[#2D2D2D] mb-2">Dislikes</h2>
          <p className="text-sm text-[#9B9B9B] mb-3">Foods or wines you prefer to avoid</p>
          <TagInput
            tags={preferences.dislikes}
            onTagsChange={(dislikes) => setPreferences((prev) => ({ ...prev, dislikes }))}
            placeholder="e.g., blue cheese"
          />
        </section>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FAF7F2] border-t border-[#E5E5E5]">
        <Button onClick={handleSave} loading={saving} className="w-full" size="lg">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
