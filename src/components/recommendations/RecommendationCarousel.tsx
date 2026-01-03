'use client';

import { useState, useRef, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecommendationCard } from './RecommendationCard';
import { cn } from '@/lib/utils';
import { Recommendation } from '@/types';

interface RecommendationCarouselProps {
  recommendations: Omit<Recommendation, 'id' | 'session_id' | 'created_at'>[];
}

export function RecommendationCarousel({ recommendations }: RecommendationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < recommendations.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goToPrevious = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const goToNext = () => {
    if (activeIndex < recommendations.length - 1) setActiveIndex(activeIndex + 1);
  };

  return (
    <div className="relative">
      {/* Mobile Carousel View */}
      <div className="md:hidden">
        {/* Carousel Container */}
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {recommendations.map((rec, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <RecommendationCard
                  rank={rec.rank}
                  foodName={rec.food_name}
                  wineName={rec.wine_name}
                  reasoning={rec.reasoning}
                  priceIndicator={rec.price_indicator}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center px-2 mt-4">
          <button
            onClick={goToPrevious}
            disabled={activeIndex === 0}
            className={cn(
              'p-2 rounded-full transition-all',
              activeIndex === 0
                ? 'text-[#E5E5E5] cursor-not-allowed'
                : 'text-[#722F37] hover:bg-[#722F37]/10'
            )}
            aria-label="Previous pairing"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Pagination Dots */}
          <div className="flex gap-2">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all duration-200',
                  index === activeIndex
                    ? 'bg-[#722F37] scale-110'
                    : 'bg-[#E5E5E5] hover:bg-[#9B9B9B]'
                )}
                aria-label={`Go to pairing ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={activeIndex === recommendations.length - 1}
            className={cn(
              'p-2 rounded-full transition-all',
              activeIndex === recommendations.length - 1
                ? 'text-[#E5E5E5] cursor-not-allowed'
                : 'text-[#722F37] hover:bg-[#722F37]/10'
            )}
            aria-label="Next pairing"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Current Card Indicator */}
        <p className="text-center text-sm text-[#9B9B9B] mt-2">
          {activeIndex + 1} of {recommendations.length} pairings
        </p>
      </div>

      {/* Desktop Stacked View */}
      <div className="hidden md:block space-y-4 px-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={index}
            rank={rec.rank}
            foodName={rec.food_name}
            wineName={rec.wine_name}
            reasoning={rec.reasoning}
            priceIndicator={rec.price_indicator}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
