'use client';

import { cn } from '@/lib/utils';
import { Camera, Check, Plus } from 'lucide-react';

interface CaptureButtonProps {
  label: string;
  icon: 'menu' | 'wine';
  images: string[];
  onClick: () => void;
}

export function CaptureButton({ label, icon, images, onClick }: CaptureButtonProps) {
  const hasImages = images.length > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all overflow-hidden',
        hasImages
          ? 'border-[#7D8471] bg-[#7D8471]/10'
          : 'border-dashed border-[#9B9B9B] bg-white hover:border-[#722F37]'
      )}
    >
      {hasImages ? (
        <div className="relative w-full h-full p-2">
          {/* Thumbnail Grid */}
          <div className={cn(
            'w-full h-full grid gap-1 rounded-xl overflow-hidden',
            images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          )}>
            {images.slice(0, 4).map((img, idx) => (
              <div key={idx} className="relative overflow-hidden bg-[#E5E5E5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${label} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Show +N overlay on last image if more than 4 */}
                {idx === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Count Badge */}
          <div className="absolute top-3 right-3 bg-[#7D8471] rounded-full px-2 py-0.5 flex items-center gap-1">
            <Check size={12} className="text-white" />
            <span className="text-white text-xs font-medium">{images.length}</span>
          </div>

          {/* Add More Hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
            <Plus size={14} className="text-[#722F37]" />
            <span className="text-xs font-medium text-[#2D2D2D]">Add more</span>
          </div>
        </div>
      ) : (
        <>
          <div className="text-3xl">{icon === 'menu' ? '🍽️' : '🍷'}</div>
          <span className="text-sm font-medium text-[#2D2D2D]">{label}</span>
          <div className="flex items-center gap-1 text-[#9B9B9B]">
            <Camera size={16} />
            <span className="text-xs">Tap to capture</span>
          </div>
        </>
      )}
    </button>
  );
}
