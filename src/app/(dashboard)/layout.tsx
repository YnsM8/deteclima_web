import { Suspense } from 'react';
import { Sidebar } from '@/presentation/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a0f1e] text-white">
      {/* Sidebar Navigation */}
      <Suspense fallback={<div className="w-64 h-screen bg-[#0d1326]" />}>
        <Sidebar />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
