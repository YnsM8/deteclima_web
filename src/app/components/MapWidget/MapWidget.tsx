'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MapPin, Globe, Star, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';

// Dynamic import with SSR Disabled (vital for Leaflet to not crash on Next.js server)
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-white/5 w-full h-full min-h-[400px] rounded-xl flex items-center justify-center border border-white/10">
      <span className="text-[var(--color-text-secondary)] flex items-center gap-2">
        <Globe size={20} className="animate-spin" /> Cargando cartografía...
      </span>
    </div>
  )
});

interface Props {
  lat: number;
  lon: number;
  setCoordinates: (lat: number, lon: number) => void;
}

export function MapWidget({ lat, lon, setCoordinates }: Props) {
  const { user } = useAuth();
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveLocation = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('user_locations')
        .insert([
          { 
            user_id: user.id, 
            latitude: lat, 
            longitude: lon, 
            name: isFreeMode ? `Punto (${lat.toFixed(2)}, ${lon.toFixed(2)})` : 'Zona de interés' 
          }
        ]);

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving location:', err);
      alert('Error al guardar ubicación. ¿Está creada la tabla user_locations en Supabase?');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full w-full glass rounded-xl p-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[var(--color-border)] pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
            {isFreeMode ? <Globe size={20} /> : <MapPin size={20} />}
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight">Explorador Climático</h2>
            <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5">
              {isFreeMode ? 'Cualquier coordenada' : 'Zonas predefinidas'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Save Button for Auth Users */}
          {user && (
            <button
              onClick={handleSaveLocation}
              disabled={isSaving}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                saved 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20'
              }`}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Star size={14} />}
              {saved ? 'Guardado' : 'Guardar'}
            </button>
          )}

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer touch-manipulation min-h-[44px]">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isFreeMode}
              onChange={() => setIsFreeMode(!isFreeMode)}
              aria-label="Alternar modo libre"
            />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[12px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            <span className="ml-3 text-xs font-semibold text-gray-300">
              Modo Libre
            </span>
          </label>
        </div>
      </div>

      <div className="flex-1 w-full h-[400px] relative z-0">
        <MapClient lat={lat} lon={lon} setCoordinates={setCoordinates} isFreeMode={isFreeMode} />
      </div>
    </div>
  );
}
