'use client';

import { cn } from '@/lib/utils';
import { Camera, Check } from 'lucide-react';

interface CaptureButtonProps {
  label: string;
  icon: 'menu' | 'wine';
  captured: boolean;
  thumbnail?: string;
  onClick: () => void;
}

export function CaptureButton({ label, icon, captured, thumbnail, onClick }: CaptureButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all',
        captured
          ? 'border-[#7D8471] bg-[#7D8471]/10'
          : 'border-dashed border-[#9B9B9B] bg-white hover:border-[#722F37]'
      )}
    >
      {captured && thumbnail ? (
        <div className="relative w-full h-full p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={label}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute top-3 right-3 bg-[#7D8471] rounded-full p-1">
            <Check size={16} className="text-white" />
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
