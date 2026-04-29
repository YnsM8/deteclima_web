'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';

export function useRegionalAlerts() {
  const { user } = useAuth();
  const [alert, setAlert] = useState<string | null>(null);

  const checkAlerts = useCallback(async () => {
    if (!user) return;

    try {
      // 1. Get saved locations
      const { data: locations, error: locError } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id);

      if (locError) throw locError;
      if (!locations || locations.length === 0) return;

      // 2. Check weather for each location
      // We'll just check the first 3 to avoid hitting rate limits too fast in this demo
      for (const loc of locations.slice(0, 3)) {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`);
        if (!res.ok) continue;
        
        const data = await res.json();
        const temp = data.current_weather.temperature;

        if (temp <= 5) {
          setAlert(`¡Riesgo de Helada! En tu ubicación guardada "${loc.name}" se registra una temperatura de ${temp}°C.`);
          break; // Show only one alert at a time
        }
      }
    } catch (err: any) {
      console.error('Error checking regional alerts:', err.message || err);
    }
  }, [user]);

  useEffect(() => {
    let isActive = true;
    
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      checkAlerts().then(() => {
        if (!isActive) return;
      });
      
      // Check every 15 minutes
      const interval = setInterval(() => {
        if (isActive) checkAlerts();
      }, 15 * 60 * 1000);
      
      return () => {
        isActive = false;
        clearInterval(interval);
      };
    } else {
      setAlert(null);
    }
  }, [user, checkAlerts]);

  return { alert, clearAlert: () => setAlert(null) };
}
