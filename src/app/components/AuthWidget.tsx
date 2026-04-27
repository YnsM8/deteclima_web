'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { UserCircle, LogOut, X, Loader2, AlertCircle } from 'lucide-react';

export function AuthWidget() {
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <div className="animate-pulse h-8 w-24 bg-white/5 rounded-full" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Notify user if email confirmation is enabled on supabase
        setError("Revisa tu correo para confirmar (si está activado) o inicia sesión.");
        setIsLogin(true);
        return;
      }
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error en autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-text-secondary)] hidden md:inline">
              Usuario: <strong className="text-white">{user.email?.split('@')[0]}</strong>
            </span>
            <button
              onClick={signOut}
              className="glass rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-white/10 transition-colors text-rose-300 border border-rose-500/20"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="glass rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-2 hover:bg-[var(--color-accent)] hover:text-white transition-colors"
          >
            <UserCircle size={16} /> Iniciar Sesión / Alertas
          </button>
        )}
      </div>

      {/* Modal */}
      {isOpen && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-sm rounded-2xl p-6 relative border border-[var(--color-border)] shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-1">
              {isLogin ? 'Acceso a Alertas' : 'Crear Cuenta'}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mb-6">
              Autentícate para recibir alertas de temperatura y guardar tus ubicaciones.
            </p>

            {error && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                 <AlertCircle size={14} className="mt-0.5 shrink-0" />
                 <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]/80"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Contraseña</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]/80"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors flex justify-center items-center gap-2"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : (isLogin ? 'Ingresar' : 'Registrarse')}
              </button>
            </form>

            <p className="text-center text-xs mt-6 text-[var(--color-text-secondary)]">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="ml-1 text-[var(--color-accent)] hover:underline"
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
