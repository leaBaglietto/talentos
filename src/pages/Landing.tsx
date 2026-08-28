import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden text-white font-sans px-6 py-12">
      {/* Background ambient lighting */}
      <div className="absolute left-1/2 top-1/2 h-[45vh] w-[65vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[140px] pointer-events-none z-0"></div>

      {/* Perfectly Centered Hero Container */}
      <main className="z-10 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center px-4">
        {/* Logo right near the main title */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <img
            src="/logos/JoyAgency_Logo.png"
            alt="Joy Agency"
            className="h-12 sm:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15] max-w-3xl mx-auto">
          Sumate a nuestro equipo freelance
        </h1>

        {/* Subtitle */}
        <p
          style={{ marginTop: '50px', marginBottom: '50px' }}
          className="text-dark-200 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-normal"
        >
          Buscamos talentos creativos para proyectos únicos. Postulate y sé parte de nuestra red de profesionales.
        </p>

        {/* CTA & Admin Links */}
        <div className="flex flex-col items-center gap-5">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/postulacion')}
            style={{ paddingLeft: '60px', paddingRight: '60px' }}
            className="shadow-xl shadow-orange-500/15 hover:shadow-orange-500/30"
          >
            <span>Quiero sumarme como freelance</span>
            <ArrowUpRight className="size-[1.15em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>

          <Link
            to="/admin/login"
            className="group inline-flex items-center gap-2 text-dark-300 hover:text-orange-500 text-sm font-medium transition-colors py-2 px-3"
          >
            <Lock className="w-4 h-4 text-dark-400 group-hover:text-orange-500 transition-colors" />
            <span>Acceso administradores</span>
          </Link>
        </div>
      </main>

      {/* Footer absolute at bottom without altering vertical centering */}
      <footer className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-10 w-full text-center px-4">
        <p className="text-dark-400 text-xs tracking-wider">
          © {new Date().getFullYear()} Joy Agency. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
