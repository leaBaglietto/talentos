import React from 'react';
import { User, Trash2 } from 'lucide-react';
import { formatAdminName } from '@/lib/types';

export interface RatingSelectorProps {
  value: number | null;
  adminEmail?: string | null;
  label?: string;
  onChange: (value: number) => void;
  onRemove?: () => void;
}

export const RatingSelector: React.FC<RatingSelectorProps> = ({
  value,
  adminEmail,
  label = 'Tu valoración',
  onChange,
  onRemove,
}) => {
  const getButtonColorClass = (num: number, selectedValue: number | null) => {
    if (selectedValue === null || num > selectedValue) {
      return 'bg-dark-700/60 border border-white/10 text-dark-300 hover:border-orange-500/40 hover:text-white';
    }

    // Active colors
    if (selectedValue >= 1 && selectedValue <= 3) {
      return 'bg-red-500/20 border border-red-500 text-red-400 shadow-md shadow-red-500/20';
    } else if (selectedValue >= 4 && selectedValue <= 6) {
      return 'bg-amber-500/20 border border-amber-500 text-amber-400 shadow-md shadow-amber-500/20';
    } else if (selectedValue >= 7 && selectedValue <= 8) {
      return 'bg-orange-500/20 border border-orange-500 text-orange-400 shadow-md shadow-orange-500/20';
    } else {
      return 'bg-emerald-500/20 border border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs sm:text-sm text-dark-200 font-medium tracking-wide">
          {label}
        </label>
        {value !== null && (
          <span className="text-xs font-bold text-orange-400">
            {value}/10
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isSelected = value === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer outline-none
                ${getButtonColorClass(num, value)}
                ${isSelected ? 'ring-2 ring-orange-500 scale-105' : ''}
              `}
            >
              {num}
            </button>
          );
        })}
      </div>

      {value !== null && (
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <User size={12} className="text-[#FF6B00]" />
            <span>Por: <strong className="text-neutral-200">{formatAdminName(adminEmail)}</strong></span>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 hover:underline cursor-pointer"
            >
              <Trash2 size={11} />
              <span>Quitar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};


