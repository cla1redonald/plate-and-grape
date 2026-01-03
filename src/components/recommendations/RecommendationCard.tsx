'use client';

import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  rank: 1 | 2 | 3;
  foodName: string;
  wineName: string;
  reasoning: string;
  priceIndicator: string;
}

const RANK_CONFIG = {
  1: { label: 'Best Match', emoji: '🥇', bgColor: 'bg-[#C9A962]/10', borderColor: 'border-[#C9A962]' },
  2: { label: 'Great Choice', emoji: '🥈', bgColor: 'bg-[#9B9B9B]/10', borderColor: 'border-[#9B9B9B]' },
  3: { label: 'Also Consider', emoji: '🥉', bgColor: 'bg-[#CD7F32]/10', borderColor: 'border-[#CD7F32]' },
};

export function RecommendationCard({
  rank,
  foodName,
  wineName,
  reasoning,
  priceIndicator,
}: RecommendationCardProps) {
  const config = RANK_CONFIG[rank];

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 border-2 shadow-sm',
        config.borderColor
      )}
    >
      {/* Rank Badge */}
      <div className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mb-3', config.bgColor)}>
        <span>{config.emoji}</span>
        <span className="text-[#2D2D2D]">{config.label}</span>
      </div>

      {/* Pairing */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-[#2D2D2D]">{foodName}</h3>
        <p className="text-[#9B9B9B] text-sm">paired with</p>
        <h4 className="text-lg font-semibold text-[#722F37]">{wineName}</h4>
        <span className="text-sm text-[#9B9B9B]">{priceIndicator}</span>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-[#2D2D2D] italic leading-relaxed">
        &ldquo;{reasoning}&rdquo;
      </p>
    </div>
  );
}
