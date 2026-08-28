import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PostulacionExito() {
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
          paddingTop: '2%',
          paddingBottom: '2%',
          marginTop: '2%',
          marginBottom: '2%',
        }}
        className="z-10 w-full max-w-[540px] bg-dark-800/80 backdrop-blur-2xl border border-white/10 rounded-[36px] shadow-2xl shadow-black/80 flex flex-col items-center relative transition-all duration-300"
      >
        {/* Inner Container (80% width) */}
        <div className="w-[80%] flex flex-col items-center py-6 sm:py-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="rounded-full bg-orange-500/10 border border-orange-500/30 p-3.5 sm:p-4">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-orange-500" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2.5">
            ¡Postulación enviada!
          </h1>
          
          <p className="text-dark-300 text-xs sm:text-sm mb-7 leading-relaxed max-w-sm">
            Gracias por postularte. Revisaremos tu perfil y nos pondremos en contacto a la brevedad.
          </p>
          
          <div className="w-full">
            <Link to="/" className="w-full block">
              <Button
                variant="primary"
                size="lg"
                className="w-full rounded-full h-14 sm:h-16 text-base font-bold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98]"
              >
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
