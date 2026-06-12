'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { 
  CloudSun, 
  MessageCircle, 
  BarChart3, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  MapPin
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  // Propagar coordenadas si existen
  const queryString = lat && lon ? `?lat=${lat}&lon=${lon}` : '';

  const menuItems = [
    {
      name: 'Explorador Climático',
      href: '/',
      icon: CloudSun,
      restricted: false,
    },
    {
      name: 'Asistente IA',
      href: '/chat',
      icon: MessageCircle,
      restricted: true,
    },
    {
      name: 'Predicciones ML',
      href: '/prediction',
      icon: BarChart3,
      restricted: true,
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0d1326] border-r border-[var(--color-border)] p-5">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--color-border)]">
        <CloudSun size={28} className="text-[var(--color-accent)] animate-pulse" />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Deteclima</h1>
          <p className="text-[9px] text-[var(--color-text-secondary)] tracking-widest uppercase">San Vicente de Paúl</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={`${item.href}${queryString}`}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-l-4 border-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon 
                size={18} 
                className={`transition-colors ${
                  isActive ? 'text-[var(--color-accent)]' : 'text-gray-400 group-hover:text-white'
                }`} 
              />
              <span className="flex-1">{item.name}</span>
              {item.restricted && !user && (
                <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                  🔒
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Location Badge (If selected) */}
      {lat && lon && (
        <div className="glass rounded-xl p-3 mb-4 flex items-center gap-2 border border-white/5 bg-white/[0.01]">
          <MapPin size={14} className="text-[var(--color-accent)] shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-[var(--color-text-secondary)] font-medium">Ubicación Activa</p>
            <p className="text-[10px] font-mono truncate text-white/90">
              {parseFloat(lat).toFixed(3)}, {parseFloat(lon).toFixed(3)}
            </p>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="pt-4 border-t border-[var(--color-border)]">
        {loading ? (
          <div className="animate-pulse h-10 bg-white/5 rounded-xl" />
        ) : user ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-2 py-1">
              <UserCircle size={28} className="text-[var(--color-accent)] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-white">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-[9px] text-[var(--color-text-secondary)] truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl py-2 text-xs font-semibold transition-all mt-1"
            >
              <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link
            href={`/auth?redirect=${pathname}${queryString}`}
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-md"
          >
            <UserCircle size={15} /> Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between bg-[#0a0f1e]/80 backdrop-blur-md border-b border-[var(--color-border)] px-5 py-4 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2.5">
          <CloudSun size={24} className="text-[var(--color-accent)]" />
          <span className="font-bold text-base tracking-tight">Deteclima</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Enlace rápido de login/perfil para móviles */}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            <Link 
              href={`/auth?redirect=${pathname}${queryString}`}
              className="p-2 text-[var(--color-accent)] hover:text-white transition-colors"
              aria-label="Ver Perfil"
            >
              <UserCircle size={20} />
            </Link>
          ) : (
            <Link 
              href={`/auth?redirect=${pathname}${queryString}`}
              className="text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-3 py-1.5 rounded-full font-bold border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)] hover:text-white transition-all"
            >
              Ingresar
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay Sidebar (Drawer) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={toggleSidebar}
          />
          {/* Content */}
          <div className="relative w-64 max-w-xs h-full animate-fade-in shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
