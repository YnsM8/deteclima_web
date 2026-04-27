'use client';

import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-sm text-black text-center py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium">
      <WifiOff size={16} />
      <span>Modo offline — mostrando datos guardados</span>
    </div>
  );
}
