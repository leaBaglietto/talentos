import React, { useEffect, useRef, useState } from 'react';
import { Star, X, Trash2, ShieldCheck, User, Users } from 'lucide-react';
import { CandidateRating, formatAdminName } from '@/lib/types';

interface RatingQuickPopoverProps {
  candidateId: string;
  candidateName: string;
  averageRating: number | null;
  ratings?: CandidateRating[];
  activeAdminEmail?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveRating: (rating: number | null) => Promise<void>;
}

export const RatingQuickPopover: React.FC<RatingQuickPopoverProps> = ({
  candidateName,
  averageRating,
  ratings = [],
  activeAdminEmail,
  isOpen,
  onClose,
  onSaveRating,
}) => {
  // Find current admin's own rating if any
  const myExistingRating = ratings.find(
    (r) => r.admin_email && activeAdminEmail && r.admin_email.toLowerCase() === activeAdminEmail.toLowerCase()
  )?.rating ?? null;

  const [selectedRating, setSelectedRating] = useState<number | null>(myExistingRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedRating(myExistingRating);
  }, [myExistingRating, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectNumber = async (num: number) => {
    setSelectedRating(num);
    setSaving(true);
    await onSaveRating(num);
    setSaving(false);
  };

  const handleRemoveRating = async () => {
    setSelectedRating(null);
    setSaving(true);
    await onSaveRating(null);
    setSaving(false);
  };

  const getScoreLabel = (val: number | null) => {
    if (!val) return 'Seleccioná tu puntaje';
    if (val <= 3) return 'Nivel básico / Requiere mejora';
    if (val <= 6) return 'Nivel intermedio / Aceptable';
    if (val <= 8) return 'Nivel avanzado / Muy bueno';
    return 'Excelente / Sobresaliente';
  };

  const getScoreColor = (val: number | null) => {
    if (!val) return 'text-neutral-400';
    if (val <= 3) return 'text-red-400';
    if (val <= 6) return 'text-amber-400';
    if (val <= 8) return 'text-orange-400';
    return 'text-emerald-400';
  };

  const getBadgeColor = (val: number) => {
    if (val <= 3) return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (val <= 6) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    if (val <= 8) return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  };

  const activeValue = hoverRating || selectedRating;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 z-50 w-88 sm:w-96 rounded-3xl bg-[#18110D] border-2 border-[#FF6B00] p-5 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-left"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]">
            <Star size={15} className="fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">Valoraciones del prospecto</h4>
            <p className="text-[11px] text-neutral-400 truncate max-w-[210px]">{candidateName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Summary / Average Banner */}
      <div className="rounded-2xl bg-white/5 border border-white/5 p-3 mb-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-neutral-400 block font-medium">Promedio general</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-white">
              {averageRating !== null ? averageRating : '-'}
            </span>
            {averageRating !== null && <span className="text-xs text-neutral-400 font-semibold">/10</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-semibold text-neutral-300">
            <Users size={12} className="text-[#FF6B00]" />
            <span>{ratings.length} {ratings.length === 1 ? 'administrador' : 'administradores'}</span>
          </div>
        </div>
      </div>

      {/* Admin Ratings Breakdown List (like candidate_notes) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
            Votos por administrador
          </span>
        </div>

        {ratings.length > 0 ? (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {ratings.map((r) => {
              const isMe =
                activeAdminEmail && r.admin_email.toLowerCase() === activeAdminEmail.toLowerCase();
              return (
                <div
                  key={r.id || r.admin_email}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    isMe ? 'bg-[#FF6B00]/10 border border-[#FF6B00]/30' : 'bg-white/5 border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <User size={13} className={isMe ? 'text-[#FF6B00]' : 'text-neutral-400'} />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate flex items-center gap-1.5">
                        <span>{formatAdminName(r.admin_email)}</span>
                        {isMe && (
                          <span className="text-[10px] bg-[#FF6B00] text-white px-1.5 py-0.2 rounded-full font-bold">
                            Tú
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">{r.admin_email}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-lg font-bold text-xs flex-shrink-0 ${getBadgeColor(r.rating)}`}>
                    {r.rating}/10
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 italic py-1 text-center bg-white/[0.02] rounded-xl border border-white/5">
            Aún no hay valoraciones registradas.
          </p>
        )}
      </div>

      {/* Active Admin Section: Tu Valoración */}
      <div className="border-t border-white/10 pt-3 mb-2">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <ShieldCheck size={14} className="text-[#FF6B00]" />
            <span>Tu valoración:</span>
          </div>
          <span className={`font-bold transition-colors ${getScoreColor(activeValue)}`}>
            {activeValue ? `${activeValue}/10` : 'Sin puntaje'}
          </span>
        </div>

        {/* 1-10 selector buttons */}
        <div className="grid grid-cols-5 gap-1.5 mb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const isSelected = selectedRating === num;
            const isHovered = hoverRating === num;

            let btnClass = 'bg-white/5 border-white/10 text-neutral-300 hover:border-[#FF6B00] hover:text-white';
            if (num <= 3) {
              if (isSelected) btnClass = 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/30';
              else if (isHovered) btnClass = 'bg-red-500/20 text-red-400 border-red-500/50';
            } else if (num <= 6) {
              if (isSelected) btnClass = 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30';
              else if (isHovered) btnClass = 'bg-amber-500/20 text-amber-400 border-amber-500/50';
            } else if (num <= 8) {
              if (isSelected) btnClass = 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-orange-500/30';
              else if (isHovered) btnClass = 'bg-[#FF6B00]/20 text-[#FF6B00] border-[#FF6B00]/50';
            } else {
              if (isSelected) btnClass = 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/30';
              else if (isHovered) btnClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            }

            return (
              <button
                key={num}
                type="button"
                disabled={saving}
                onClick={() => handleSelectNumber(num)}
                onMouseEnter={() => setHoverRating(num)}
                onMouseLeave={() => setHoverRating(null)}
                className={`h-9 rounded-xl border font-bold text-xs flex items-center justify-center transition-all duration-150 cursor-pointer outline-none active:scale-95 ${btnClass} ${
                  isSelected ? 'scale-105 ring-2 ring-white/30' : ''
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Dynamic score label */}
        <p className={`text-[11px] font-medium text-center min-h-[16px] transition-colors ${getScoreColor(activeValue)}`}>
          {getScoreLabel(activeValue)}
        </p>
      </div>

      {/* Footer / Delete my rating */}
      {myExistingRating !== null && (
        <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
          <button
            type="button"
            disabled={saving}
            onClick={handleRemoveRating}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer transition-colors"
          >
            <Trash2 size={13} />
            <span>Quitar mi valoración</span>
          </button>
          <span className="text-[10px] text-neutral-400">
            Tu nota actual: <strong>{myExistingRating}/10</strong>
          </span>
        </div>
      )}
    </div>
  );
};

