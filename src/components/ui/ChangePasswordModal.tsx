import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { KeyRound, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { user, updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Por favor completá todos los campos.');
      return;
    }

    if (password.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);

    if (updateError) {
      setError(updateError.message || 'Error al actualizar la contraseña.');
    } else {
      setSuccess(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar mi Contraseña" size="md">
      {success ? (
        <div className="flex flex-col items-center text-center py-4 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">¡Contraseña actualizada!</h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm">
              Tu nueva contraseña fue guardada correctamente. A partir de tu próximo inicio de sesión deberás utilizarla.
            </p>
          </div>

          <div className="w-full pt-2">
            <Button onClick={handleClose} variant="primary" size="md" className="w-full rounded-full text-xs font-bold">
              Entendido
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-neutral-300 flex items-center justify-between">
            <span className="text-neutral-400">Usuario:</span>
            <span className="font-semibold text-white truncate max-w-[240px]">{user?.email}</span>
          </div>

          <p className="text-xs text-neutral-400">
            Ingresá tu nueva clave de acceso personalizada para reemplazar la contraseña temporal.
          </p>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-300">
              Nueva contraseña <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full bg-dark-700/60 border border-white/10 focus:border-[#FF6B00] rounded-2xl h-12 pl-5 pr-11 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-neutral-400 hover:text-white cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-300">
              Confirmar nueva contraseña <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí la nueva contraseña"
                required
                className="w-full bg-dark-700/60 border border-white/10 focus:border-[#FF6B00] rounded-2xl h-12 pl-5 pr-11 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 p-1 text-neutral-400 hover:text-white cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit footer with increased top separation and button padding */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="rounded-full px-8 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/20"
            >
              <KeyRound size={15} className="mr-2" />
              Guardar Contraseña
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
