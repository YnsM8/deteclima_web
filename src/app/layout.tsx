import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import OfflineBanner from '@/presentation/components/OfflineBanner';
import { AuthProvider } from '@/presentation/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Deteclima — Monitor Climático Inteligente',
  description: 'Plataforma educativa de monitoreo climático con IA para estudiantes de educación básica regular',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Deteclima',
  },
};

export const viewport: Viewport = {
  themeColor: '#38bdf8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-[#0a0f1e] text-white min-h-screen">
        <AuthProvider>
          <OfflineBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
