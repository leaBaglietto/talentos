import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { UserPlus, Mail, User, Eye, EyeOff, AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react';
import { createAdminAccount } from '@/lib/adminAuth';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ email: string; pass: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessData(null);
    setCopied(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Por favor completá los campos obligatorios.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error: authError } = await createAdminAccount(email.trim(), password, fullName);
    setLoading(false);

    if (authError) {
      setError(authError.message || 'Ocurrió un error al crear la cuenta del administrador.');
    } else {
      setSuccessData({
        email: email.trim(),
        pass: password,
        name: fullName.trim() || email.split('@')[0],
      });
    }
  };

  const handleCopyCredentials = () => {
    if (!successData) return;
    const text = `Hola ${successData.name},\n\nYa tenés acceso como Administrador a la plataforma de Joy Agency Talentos:\n\n🔗 Link: ${window.location.origin}/admin/login\n📧 Usuario/Email: ${successData.email}\n🔑 Contraseña provisoria: ${successData.pass}\n\n¡Bienvenido al equipo!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Nuevo Administrador" size="md">
      {successData ? (
        <div className="flex flex-col items-center text-center py-4 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">¡Administrador creado con éxito!</h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm">
              La cuenta para <strong className="text-white">{successData.email}</strong> ya está activa y puede iniciar sesión inmediatamente.
            </p>
          </div>

          {/* Credentials Summary Box */}
          <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Email / Usuario:</span>
              <span className="font-semibold text-white font-mono">{successData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Contraseña temporal:</span>
              <span className="font-semibold text-[#FF6B00] font-mono">{successData.pass}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
            <button
              type="button"
              onClick={handleCopyCredentials}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? '¡Credenciales copiadas!' : 'Copiar mensaje de bienvenida'}</span>
            </button>

            <Button onClick={handleClose} variant="primary" size="md" className="flex-1 rounded-full text-xs font-bold">
              Listo
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <p className="text-xs text-neutral-400">
            Creá una cuenta para un compañero de equipo. Podrá acceder a todas las postulaciones, admitidos y valoraciones.
          </p>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div style={{ marginBottom: 16 }}>
            <label className="block text-xs font-medium text-neutral-300" style={{ marginBottom: 6 }}>
              Nombre y apellido <span className="text-neutral-500 font-normal">(opcional)</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Martin Gómez"
                style={{ paddingLeft: 20, paddingRight: 44, height: 48, fontSize: 14 }}
                className="w-full bg-dark-700/60 border border-white/10 focus:border-[#FF6B00] rounded-2xl text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <User className="absolute w-4 h-4 text-neutral-400 pointer-events-none" style={{ right: 16 }} />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label className="block text-xs font-medium text-neutral-300" style={{ marginBottom: 6 }}>
              Correo electrónico <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@joyagency.com"
                required
                style={{ paddingLeft: 20, paddingRight: 44, height: 48, fontSize: 14 }}
                className="w-full bg-dark-700/60 border border-white/10 focus:border-[#FF6B00] rounded-2xl text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <Mail className="absolute w-4 h-4 text-neutral-400 pointer-events-none" style={{ right: 16 }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label className="block text-xs font-medium text-neutral-300" style={{ marginBottom: 6 }}>
              Contraseña provisoria <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                style={{ paddingLeft: 20, paddingRight: 44, height: 48, fontSize: 14 }}
                className="w-full bg-dark-700/60 border border-white/10 focus:border-[#FF6B00] rounded-2xl text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-neutral-400 hover:text-white cursor-pointer"
                style={{ right: 14, padding: 4 }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 8 }}>
            <label className="block text-xs font-medium text-neutral-300" style={{ marginBottom: 6 }}>
              Confirmar contraseña <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí la contraseña"
                required
                style={{ paddingLeft: 20, paddingRight: 44, height: 48, fontSize: 14 }}
                className="w-full bg-dark-700/60 border border-white/10 focus:border-[#FF6B00] rounded-2xl text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute text-neutral-400 hover:text-white cursor-pointer"
                style={{ right: 14, padding: 4 }}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit footer */}
          <div
            className="flex items-center justify-end border-t border-white/10"
            style={{ gap: 12, paddingTop: 24, marginTop: 24 }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              style={{ padding: '10px 22px', fontSize: 13 }}
            >
              Cancelar
            </button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="rounded-full font-bold shadow-lg shadow-orange-500/20"
              style={{ padding: '12px 32px', fontSize: 13 }}
            >
              <UserPlus size={15} style={{ marginRight: 8 }} />
              Crear Administrador
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
