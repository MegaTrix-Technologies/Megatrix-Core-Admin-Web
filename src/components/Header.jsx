import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PanelLeft, PanelLeftClose, Menu } from 'lucide-react';
import ProfileMenu from './navigation/ProfileMenu';

const Header = ({
  isSidebarCollapsed = false,
  onToggleSidebar,
  isMobileDrawerOpen = false,
  onToggleMobileDrawer,
}) => {
  const [logoPopoverOpen, setLogoPopoverOpen] = useState(false);
  const popoverTimeoutRef = useRef(null);

  const handleMouseEnterLogo = () => {
    if (popoverTimeoutRef.current) clearTimeout(popoverTimeoutRef.current);
    setLogoPopoverOpen(true);
  };

  const handleMouseLeaveLogo = () => {
    popoverTimeoutRef.current = setTimeout(() => {
      setLogoPopoverOpen(false);
    }, 150);
  };

  return (
    <header className="h-14 w-full bg-mx-surface/90 border-b border-mx-border sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* LEFT: [Sidebar Toggle] [MegaTrix Logo] */}
      <div className="flex items-center gap-3">
        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-mx-elevated transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-mx-blue"
        >
          {isSidebarCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Mobile Sidebar / Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleMobileDrawer}
          aria-label="Toggle navigation menu"
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-mx-elevated transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-mx-blue"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-mx-border hidden sm:block" />

        {/* MegaTrix Logo with Premium Subtle Popover */}
        <div
          className="relative flex items-center"
          onMouseEnter={handleMouseEnterLogo}
          onMouseLeave={handleMouseLeaveLogo}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="MegaTrix Technologies Home"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <img
                src="/megatrix-icon.svg"
                alt="MegaTrix"
                className="w-6 h-auto drop-shadow-xs group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="font-tech flex items-center tracking-tight select-none">
              <span className="text-sm font-black text-white group-hover:text-neutral-200 transition-colors">
                MegaTrix
              </span>
              <span className="text-sm font-black text-mx-blue ml-1">
                Core
              </span>
            </div>
          </Link>

          {/* Subtle Premium Logo Tooltip / Popover on Hover */}
          {logoPopoverOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-mx-surface border border-mx-border rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-mx-blue" />
                <h3 className="text-xs font-bold text-white tracking-wide font-tech">
                  MegaTrix Technologies
                </h3>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Centralized multi-SaaS governance & ecosystem operations.
              </p>
              <div className="mt-2 pt-2 border-t border-mx-border flex items-center justify-between text-[9px] text-mx-subtle uppercase tracking-wider">
                <span>Unified Command Center</span>
                <span>v1.0 Release</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: [User Avatar] */}
      <div className="flex items-center gap-3">
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Header;
