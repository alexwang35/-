import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f] antialiased flex justify-center selection:bg-gray-300">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl shadow-gray-200/50 relative overflow-hidden flex flex-col">
        {/* Top Gradient Decoration */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-gray-50 to-white pointer-events-none z-0" />
        
        {/* Content Area */}
        <main className="relative z-10 flex-1 flex flex-col">
          {children}
        </main>

        {/* Footer Area - simulating strict minimalism */}
        <footer className="py-6 text-center text-xs text-gray-400">
          <p>© Zenith Health · Scientific Wellness</p>
        </footer>
      </div>
    </div>
  );
};
