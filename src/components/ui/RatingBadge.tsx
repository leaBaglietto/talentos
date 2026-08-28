import React from 'react';
import { Star, User, Users } from 'lucide-react';
import { formatAdminName } from '@/lib/types';

export interface RatingBadgeProps {
  rating: number | null;
  adminEmail?: string | null;
  ratingsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showAdmin?: boolean;
  interactive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  adminEmail,
  ratingsCount = 0,
  size = 'md',
  showAdmin = false,
  interactive = false,
  onClick,
}) => {
  let colorClass = 'bg-white/5 border border-white/10 text-neutral-400 hover:border-white/20';

  if (rating !== null) {
    if (rating >= 1 && rating < 4) {
      colorClass = 'bg-red-500/15 border border-red-500/30 text-red-400 hover:border-red-500/50';
    } else if (rating >= 4 && rating < 7) {
      colorClass = 'bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:border-amber-500/50';
    } else if (rating >= 7 && rating < 9) {
      colorClass = 'bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:border-orange-500/50';
    } else if (rating >= 9 && rating <= 10) {
      colorClass = 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:border-emerald-500/50';
    }
  }

  const sizeClass =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs gap-1.5'
      : size === 'lg'
      ? 'px-4 py-2 text-base gap-2'
      : 'px-3 py-1.5 text-sm gap-2';

  const numberClass =
    size === 'sm' ? 'text-xs font-bold' : size === 'lg' ? 'text-lg font-bold' : 'text-sm font-bold';
  const suffixClass = size === 'sm' ? 'text-[10px]' : 'text-xs';

  const adminName = formatAdminName(adminEmail);

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div
        onClick={onClick}
        className={`inline-flex items-center rounded-full font-medium transition-all shadow-sm select-none ${colorClass} ${sizeClass} ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        }`}
        title={
          rating !== null
            ? `Promedio: ${rating}/10 (${ratingsCount > 0 ? `${ratingsCount} valoracion${ratingsCount > 1 ? 'es' : ''}` : adminEmail || 'Admin'})`
            : 'Sin valoración asignada'
        }
      >
        <Star
          size={size === 'sm' ? 12 : 14}
          className={rating !== null ? 'fill-current' : 'opacity-40'}
        />
        {rating === null ? (
          <span className="font-semibold text-neutral-400 text-xs">Sin valorar</span>
        ) : (
          <div className="flex items-baseline">
            <span className={numberClass}>{rating}</span>
            <span className={`ml-0.5 opacity-60 font-semibold ${suffixClass}`}>/10</span>
          </div>
        )}
      </div>

      {showAdmin && rating !== null && (
        <div className="flex items-center text-[11px] text-neutral-400 font-medium pl-1 truncate max-w-[160px]">
          {ratingsCount > 1 ? (
            <div className="flex items-center text-neutral-300" title={`${ratingsCount} administradores valoraron a este candidato`}>
              <Users size={11} className="mr-1 text-[#FF6B00] flex-shrink-0" />
              <span>{ratingsCount} valoraciones</span>
            </div>
          ) : (
            <div className="flex items-center truncate" title={`Valorado por: ${adminEmail || 'Admin'}`}>
              <User size={11} className="mr-1 text-[#FF6B00] flex-shrink-0" />
              <span className="truncate">Por {adminName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


