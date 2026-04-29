'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Props {
  message: string | null;
  onClose: () => void;
}

export function AlertBanner({ message, onClose }: Props) {
  const { user } = useAuth();
  const [dismissedMessage, setDismissedMessage] = useState<string | null>(null);

  // Consider it visible if there's a message, a user, and this specific message hasn't been dismissed
  const isVisible = !!(message && user && dismissedMessage !== message);

  if (!isVisible || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
      <div className="bg-rose-500/20 glass border border-rose-500/50 rounded-xl p-4 shadow-2xl flex gap-4 max-w-sm">
        <div className="text-rose-400 mt-0.5">
          <AlertTriangle size={24} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-rose-100 font-bold mb-1">¡Alerta Temprana!</h3>
          <p className="text-sm text-rose-200/90 leading-tight">
            {message}
          </p>
        </div>
        <button 
          onClick={() => { setDismissedMessage(message); onClose(); }} 
          className="text-white/50 hover:text-white transition-colors h-fit"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
