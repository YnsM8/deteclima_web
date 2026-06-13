'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { supabase } from '@/infrastructure/adapters/out/persistence/supabase/client';
import { CloudSun, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl = searchParams.get('redirect') || '/explorer';

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        if (data?.session) {
          router.push(redirectUrl);
          return;
        }
        
        setError('Se ha enviado un correo de confirmación. Por favor, revísalo para activar tu cuenta.');
        setIsLogin(true);
        return;
      }
      router.push(redirectUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error en autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={36} className="animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-radial from-[#0f172a] via-[#0a0f1e] to-[#020617]">
      {/* Background blobs for premium styling */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      {/* Back to Home Button */}
      <Link 
        href="/explorer"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-white transition-colors glass px-4 py-2 rounded-full border border-white/5"
      >
        <ArrowLeft size={14} /> Volver al Explorador
      </Link>

      {/* Auth Card */}
      <div className="glass w-full max-w-md rounded-2xl p-8 border border-[var(--color-border)] shadow-2xl relative">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-[var(--color-accent)]/10 rounded-full mb-3 border border-[var(--color-accent)]/20">
            <CloudSun size={32} className="text-[var(--color-accent)]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isLogin ? 'Acceso a Alertas y Módulos' : 'Crear Nueva Cuenta'}
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 max-w-xs">
            {isLogin 
              ? 'Inicia sesión para interactuar con la IA de Deteclima y ver análisis avanzados.' 
              : 'Únete para guardar ubicaciones e investigar sobre heladas.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
             <AlertCircle size={16} className="mt-0.5 shrink-0" />
             <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-semibold">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="estudiante@colegio.edu.pe"
              className="w-full bg-black/35 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-accent)]/80 focus:bg-black/50 transition-all placeholder:text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-semibold">
              Contraseña
            </label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/35 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-accent)]/80 focus:bg-black/50 transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/95 hover:shadow-lg hover:shadow-sky-500/10 text-white rounded-xl py-3 text-sm font-bold transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : (isLogin ? 'Ingresar' : 'Registrarse')}
          </button>
        </form>

        <div className="text-center text-xs mt-8 text-[var(--color-text-secondary)]">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="ml-1.5 text-[var(--color-accent)] hover:underline font-bold"
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={36} className="animate-spin text-[var(--color-accent)]" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
