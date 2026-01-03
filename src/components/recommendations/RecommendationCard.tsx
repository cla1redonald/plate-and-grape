'use client';

import { useState } from 'react';
import { Heart, Share2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  rank: 1 | 2 | 3;
  foodName: string;
  wineName: string;
  reasoning: string;
  priceIndicator: string;
  index?: number;
  onSave?: (saved: boolean) => void;
  onShare?: () => void;
}

const RANK_CONFIG = {
  1: {
    label: 'Best Match',
    emoji: '🥇',
    cardClass: 'bg-gradient-to-br from-white to-[#C9A962]/5 border-[#C9A962] shadow-lg shadow-[#C9A962]/20 scale-[1.02]',
    badgeClass: 'bg-[#C9A962]/20 text-[#8B7355]',
  },
  2: {
    label: 'Great Choice',
    emoji: '🥈',
    cardClass: 'bg-white border-[#9B9B9B]/50',
    badgeClass: 'bg-[#9B9B9B]/10 text-[#6B6B6B]',
  },
  3: {
    label: 'Also Consider',
    emoji: '🥉',
    cardClass: 'bg-white border-[#CD7F32]/50',
    badgeClass: 'bg-[#CD7F32]/10 text-[#8B5A2B]',
  },
};

const PRICE_LEVELS = {
  '£': 1,
  '££': 2,
  '£££': 3,
};

export function RecommendationCard({
  rank,
  foodName,
  wineName,
  reasoning,
  priceIndicator,
  index = 0,
  onSave,
  onShare,
}: RecommendationCardProps) {
  const [saved, setSaved] = useState(false);
  const config = RANK_CONFIG[rank];
  const priceLevel = PRICE_LEVELS[priceIndicator as keyof typeof PRICE_LEVELS] || 2;

  const handleSave = () => {
    const newSaved = !saved;
    setSaved(newSaved);
    onSave?.(newSaved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PlateAndGrape Pairing',
          text: `${foodName} paired with ${wineName} - ${reasoning}`,
        });
      } catch (err) {
        // User cancelled or share failed silently
      }
    }
    onShare?.();
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5 border-2 transition-all duration-300',
        config.cardClass,
        'animate-fade-in-up'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header: Badge + Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold', config.badgeClass)}>
          <span>{config.emoji}</span>
          <span>{config.label}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            className="p-2 rounded-full hover:bg-[#FAF7F2] transition-colors"
            aria-label={saved ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart
              size={20}
              className={cn(
                'transition-all duration-200',
                saved ? 'fill-[#722F37] text-[#722F37] scale-110' : 'text-[#9B9B9B]'
              )}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-[#FAF7F2] transition-colors"
            aria-label="Share this pairing"
          >
            <Share2 size={20} className="text-[#9B9B9B]" />
          </button>
        </div>
      </div>

      {/* Food & Wine Pairing */}
      <div className="mb-4">
        {/* Food */}
        <div className="flex items-start gap-3 mb-2">
          <span className="text-2xl" role="img" aria-label="food">🍽️</span>
          <h3 className="text-lg font-semibold text-[#2D2D2D] leading-tight">{foodName}</h3>
        </div>

        {/* Connector */}
        <div className="flex items-center gap-3 my-2 ml-3">
          <div className="w-0.5 h-4 bg-gradient-to-b from-[#2D2D2D]/20 to-[#722F37]/20" />
          <span className="text-xs text-[#9B9B9B] italic">pairs beautifully with</span>
        </div>

        {/* Wine */}
        <div className="flex items-start gap-3">
          <span className="text-2xl" role="img" aria-label="wine">🍷</span>
          <h4 className="text-lg font-semibold text-[#722F37] leading-tight">{wineName}</h4>
        </div>
      </div>

      {/* Sommelier Note */}
      <div className="bg-[#FAF7F2] rounded-xl p-4 mb-4 relative">
        <MessageCircle size={16} className="absolute top-3 left-3 text-[#C9A962]/50" />
        <p className="text-sm text-[#2D2D2D] italic leading-relaxed pl-5">
          &ldquo;{reasoning}&rdquo;
        </p>
      </div>

      {/* Price Indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#9B9B9B] font-medium uppercase tracking-wide">Price</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9B9B9B]">Budget</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  level <= priceLevel ? 'bg-[#722F37]' : 'bg-[#E5E5E5]'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-[#9B9B9B]">Premium</span>
        </div>
      </div>
    </div>
  );
}
