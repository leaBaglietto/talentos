import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email || !password) {
      setError('Por favor, ingresá tu email y contraseña.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Credenciales inválidas. Verificá tus datos.');
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleResetPassword = async () => {
    clearMessages();
    if (!email) {
      setError('Ingresá tu email en el campo para recibir el enlace de recuperación.');
      return;
    }

    setLoading(true);
    const { error: resetError } = await resetPassword(email.trim());
    setLoading(false);

    if (resetError) {
      setError(resetError.message || 'Error al enviar el correo de recuperación.');
    } else {
      setSuccess('¡Enlace de recuperación enviado! Revisá tu bandeja de entrada.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-4 sm:p-6 text-white font-sans relative overflow-hidden selection:bg-orange-500 selection:text-dark-900">
      {/* Dynamic ambient background glow */}
      <div className="absolute left-1/2 top-1/2 h-[55vh] w-[75vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-orange-500/15 via-orange-600/5 to-transparent blur-[140px] pointer-events-none z-0"></div>

      {/* Brand Header */}
      <div className="z-10 mb-8 flex flex-col items-center">
        <Link to="/" className="transition-transform duration-300 hover:scale-105">
          <img
            src="/logos/JoyAgency_Logo.png"
            alt="Joy Agency"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Main Glass Card Box */}
      <div
        style={{
          paddingTop: '3%',
          paddingBottom: '3%',
          marginTop: '2%',
          marginBottom: '2%',
        }}
        className="z-10 w-full max-w-[500px] bg-dark-800/80 backdrop-blur-2xl border border-white/10 rounded-[36px] shadow-2xl shadow-black/80 flex flex-col items-center relative transition-all duration-300"
      >
        {/* Inner Form Container */}
        <div className="w-[85%] flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Acceso Administradores</h2>
            <p className="text-xs text-neutral-400 mt-1">Ingresá tus credenciales para gestionar el portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="w-full mb-5 p-3.5 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
            {/* Email field */}
            <div className="relative flex items-center w-full group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                required
                style={{ paddingLeft: '6%' }}
                className="w-full bg-transparent hover:bg-orange-500/[0.02] border border-orange-500 rounded-full h-14 sm:h-15 pr-14 text-sm text-white placeholder-dark-300 outline-none focus:outline-none focus:ring-0 focus:border-orange-500 transition-colors"
              />
              <User className="absolute right-6 w-5 h-5 text-orange-500 pointer-events-none" />
            </div>

            {/* Password field with eye icon toggle */}
            <div className="relative flex items-center w-full group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                style={{ paddingLeft: '6%' }}
                className="w-full bg-transparent hover:bg-orange-500/[0.02] border border-orange-500 rounded-full h-14 sm:h-15 pr-14 text-sm text-white placeholder-dark-300 outline-none focus:outline-none focus:ring-0 focus:border-orange-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 p-1.5 text-orange-500 hover:text-orange-300 transition-colors cursor-pointer outline-none focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember me & Forgot password row */}
            <div className="flex items-center justify-between text-xs text-dark-200 px-2 -mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-dark-700 border-white/20 text-orange-500 accent-orange-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="group-hover:text-white transition-colors">Recordarme</span>
              </label>

              <button
                type="button"
                onClick={handleResetPassword}
                className="text-dark-200 hover:text-orange-400 transition-colors font-medium cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit button */}
            <div className="pt-2 w-full">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full rounded-full h-14 text-base font-bold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98]"
              >
                Iniciar sesión
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="z-10 mt-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-dark-400 hover:text-orange-400 text-sm font-medium transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
}


