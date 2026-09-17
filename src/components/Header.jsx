import React from 'react';
import { Link } from 'react-router-dom';
import ProfileMenu from './navigation/ProfileMenu';
import BrandLogo from './BrandLogo';

/**
 * Animated Sidebar Toggle Icon
 * When Sidebar is OPEN (isOpen = true): Shows left-pointing arrow (<-)
 * When Sidebar is CLOSED (isOpen = false): Shows 3 horizontal lines in a stack
 */
const AnimatedToggleIcon = ({ isOpen = true }) => {
  return (
    <div className="w-4 h-4 relative flex flex-col justify-center items-center pointer-events-none text-white">
      {/* Top Bar */}
      <span
        className={`absolute h-[1.5px] bg-white rounded-sm transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-[9px] -rotate-45 -translate-x-[3.5px] -translate-y-[2.8px]'
            : 'w-4 -translate-y-[4px]'
        }`}
      />
      {/* Middle Bar */}
      <span
        className="absolute h-[1.5px] w-4 bg-white rounded-sm transition-all duration-300 ease-in-out"
      />
      {/* Bottom Bar */}
      <span
        className={`absolute h-[1.5px] bg-white rounded-sm transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-[9px] rotate-45 -translate-x-[3.5px] translate-y-[2.8px]'
            : 'w-4 translate-y-[4px]'
        }`}
      />
    </div>
  );
};

const Header = ({
  isSidebarCollapsed = false,
  onToggleSidebar,
  isMobileDrawerOpen = false,
  onToggleMobileDrawer,
}) => {
  return (
    <header className="h-14 w-full bg-mx-surface border-b border-mx-border sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* LEFT: [Sidebar Toggle] [MegaTrix Logo with Tech Expand on Hover] */}
      <div className="flex items-center gap-4">
        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-sm text-white hover:bg-mx-panel transition-colors cursor-pointer focus:outline-none focus:border focus:border-mx-blue border border-mx-border"
        >
          <AnimatedToggleIcon isOpen={!isSidebarCollapsed} />
        </button>

        {/* Mobile Sidebar / Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleMobileDrawer}
          aria-label="Toggle navigation menu"
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-sm text-white hover:bg-mx-panel transition-colors cursor-pointer focus:outline-none focus:border focus:border-mx-blue border border-mx-border"
        >
          <AnimatedToggleIcon isOpen={isMobileDrawerOpen} />
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-mx-border hidden sm:block" />

        {/* Brand Logo with MT Pixel Mark & Inverted Hover Transition */}
        <Link
          to="/"
          className="group flex items-center cursor-pointer select-none py-1 focus:outline-none"
          aria-label="MegaTrix Core Business Intelligence"
        >
          <BrandLogo />
        </Link>
      </div>

      {/* RIGHT: [User Avatar & Profile Menu] */}
      <div className="flex items-center gap-3">
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Header;
