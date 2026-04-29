import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { UserCircle, LogOut, X, Loader2, AlertCircle, MapPin, Trash2 } from 'lucide-react';

export function AuthWidget() {
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface SavedLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    created_at: string;
  }
  
  // Saved locations state
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const fetchLocations = useCallback(async () => {
    if (!user) return;
    setLoadingLocations(true);
    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedLocations(data || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoadingLocations(false);
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;
    if (user && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchLocations().then(() => {
        if (ignore) return;
      });
    }
    return () => { ignore = true; };
  }, [user, isOpen, fetchLocations]);

  const handleDeleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_locations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setSavedLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      console.error('Error deleting location:', err);
    }
  };

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error en autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsOpen(true)}
              className="text-xs text-[var(--color-text-secondary)] hidden md:inline hover:text-white transition-colors"
            >
              Hola, <strong className="text-[var(--color-accent)]">{user.email?.split('@')[0]}</strong>
            </button>
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-sm rounded-2xl p-6 relative border border-[var(--color-border)] shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            {user ? (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Tu Perfil Climático</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Gestiona tus alertas y zonas de interés.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin size={16} className="text-[var(--color-accent)]" /> 
                    Mis Ubicaciones Guardadas
                  </h3>
                  
                  <div className="max-h-48 overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
                    {loadingLocations ? (
                      <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin opacity-50" /></div>
                    ) : savedLocations.length > 0 ? (
                      savedLocations.map(loc => (
                        <div key={loc.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-medium">{loc.name}</p>
                            <p className="text-[10px] opacity-50">{loc.latitude.toFixed(3)}, {loc.longitude.toFixed(3)}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteLocation(loc.id)}
                            className="text-rose-400 opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/20 rounded transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-center py-4 text-[var(--color-text-secondary)] italic">
                        No tienes ubicaciones guardadas aún.
                      </p>
                    )}
                  </div>
                </div>

                <button 
                  onClick={signOut}
                  className="w-full mt-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-lg py-2.5 text-sm font-semibold transition-colors flex justify-center items-center gap-2"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
