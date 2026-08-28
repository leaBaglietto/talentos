import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-all animate-in fade-in duration-200" onClick={onClose}>
      <div
        className={`bg-[#141414] border border-[#FF6B00]/40 rounded-[28px] sm:rounded-[36px] shadow-2xl shadow-black w-full flex flex-col transform transition-all scale-100 ${sizeClasses[size]} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-white/10" style={{ padding: '24px 32px 16px 32px' }}>
          <h2 className="font-bold text-white tracking-tight" style={{ fontSize: 22 }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer outline-none"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ padding: '24px 32px', maxHeight: '80vh' }}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
