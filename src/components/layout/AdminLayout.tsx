import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Menu, X, LogOut, Check, Minus, Ban, UserPlus, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CandidateStatus } from '@/lib/types';
import { CreateAdminModal } from '@/components/ui/CreateAdminModal';
import { ChangePasswordModal } from '@/components/ui/ChangePasswordModal';

interface AdminLayoutProps {
  activeView: CandidateStatus;
  onViewChange: (status: CandidateStatus) => void;
  counts: { pending: number; accepted: number; rejected: number };
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeView,
  onViewChange,
  counts,
  children
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatCount = (count: number) => {
    return count.toString().padStart(3, '0');
  };

  const navItems = [
    {
      id: 'pending' as CandidateStatus,
      label: 'No entrevistados',
      icon: Minus,
      count: formatCount(counts.pending),
    },
    {
      id: 'accepted' as CandidateStatus,
      label: 'Admitidos',
      icon: Check,
      count: formatCount(counts.accepted),
    },
    {
      id: 'rejected' as CandidateStatus,
      label: 'Rechazados',
      icon: Ban,
      count: formatCount(counts.rejected),
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full bg-[#121212] border-b border-[#FF6B00] z-20">
        <div className="flex items-center justify-between" style={{ padding: '12px 40px' }}>
          <Link to="/" className="inline-flex items-center group cursor-pointer transition-opacity hover:opacity-90" style={{ margin: 10 }}>
            <img
              src="/logos/JoyAgency_Logo.png"
              alt="JOY"
              className="w-auto object-contain"
              style={{ height: 48 }}
            />
          </Link>

          <div className="flex items-center gap-3">
            {/* Header Create Admin Button */}
            <button
              type="button"
              onClick={() => setIsCreateAdminOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 hover:border-[#FF6B00] hover:bg-[#FF6B00]/10 text-neutral-200 hover:text-white font-semibold text-xs transition-all cursor-pointer shadow-sm"
              style={{ padding: '10px 20px', marginRight: 8 }}
              title="Registrar un nuevo administrador para la plataforma"
            >
              <UserPlus size={15} className="text-[#FF6B00]" />
              <span>+ Nuevo Administrador</span>
            </button>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#FF6B00] transition-colors"
                aria-label="Abrir menú"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex relative">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-30 animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed lg:static top-[82px] bottom-0 left-0 z-40 bg-[#121212] lg:border-r border-[#FF6B00] flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0 border-r border-[#FF6B00]' : '-translate-x-full'
          }`}
          style={{ width: 300, padding: '24px 20px' }}
        >
          {/* Navigation Items */}
          <nav className="flex flex-col" style={{ gap: 12 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between text-left transition-all duration-200 cursor-pointer group outline-none"
                  style={{ padding: '10px 0' }}
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      size={20}
                      className={`transition-transform duration-200 ${
                        isActive ? 'text-[#FF6B00] stroke-[3] scale-110' : 'text-[#FF6B00] stroke-[2.5] group-hover:scale-110'
                      }`}
                    />
                    <span
                      className={`text-lg font-bold tracking-tight transition-colors ${
                        isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-lg font-bold tracking-wider ${
                      isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom section: User profile & Logout */}
          <div className="flex flex-col gap-3">

            <div className="border-t border-white/10 flex items-center justify-between" style={{ paddingTop: 16, gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <p className="text-neutral-500 uppercase tracking-wider font-semibold" style={{ fontSize: 11 }}>Administrador</p>
                <p
                  className="text-neutral-200 font-medium"
                  style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}
                  title={user?.email || ''}
                >
                  {user?.email || 'admin@joyagency.com'}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="rounded-xl text-neutral-400 hover:text-[#FF6B00] hover:bg-white/5 transition-colors cursor-pointer p-2"
                  title="Cambiar mi contraseña"
                >
                  <KeyRound size={17} />
                </button>
                <button
                  onClick={handleSignOut}
                  className="rounded-xl text-neutral-400 hover:text-[#FF6B00] hover:bg-white/5 transition-colors cursor-pointer p-2"
                  title="Cerrar sesión"
                >
                  <LogOut size={17} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-[#121212] overflow-x-hidden" style={{ padding: '32px 40px' }}>
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Create New Admin Modal */}
      <CreateAdminModal
        isOpen={isCreateAdminOpen}
        onClose={() => setIsCreateAdminOpen(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};
