import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('megatrix_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('megatrix_sidebar_collapsed', String(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* 1. Unified Clean Header */}
      <Header
        isSidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        isMobileDrawerOpen={mobileDrawerOpen}
        onToggleMobileDrawer={() => setMobileDrawerOpen(!mobileDrawerOpen)}
      />

      {/* 2. Body Container: Sidebar + Fluid Main Content */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Desktop Sidebar (Fixed-width transition, zero layout jumps) */}
        <div className="hidden md:block shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
          <Sidebar isCollapsed={sidebarCollapsed} />
        </div>

        {/* Mobile Slide-in Drawer with Backdrop */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />
            {/* Drawer */}
            <div className="relative z-10 h-full animate-in slide-in-from-left duration-200 shadow-2xl">
              <Sidebar
                isMobile={true}
                onCloseMobile={() => setMobileDrawerOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Fluid Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8 bg-black">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
