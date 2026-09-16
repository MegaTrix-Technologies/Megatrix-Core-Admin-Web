import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { EXPOSED_PORTALS } from '../../config/platforms';
import { ChevronDown, Check, GraduationCap, ShoppingBag } from 'lucide-react';

const PORTAL_ICONS = {
  schoolhub: GraduationCap,
  schoolmanager: GraduationCap,
  bizmanager: ShoppingBag,
};

const PortalSelector = ({ isCollapsed = false, onSelectPortal }) => {
  const { activePlatform, switchPlatform } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (portalId) => {
    switchPlatform(portalId);
    setIsOpen(false);
    if (onSelectPortal) {
      onSelectPortal(portalId);
    } else {
      // If currently on a product-specific route, transition to the new product's dashboard immediately
      const isCurrentlyProductRoute =
        location.pathname.startsWith('/schoolhub') ||
        location.pathname.startsWith('/bizmanager') ||
        location.pathname.startsWith('/modules');

      if (isCurrentlyProductRoute || location.pathname === '/') {
        if (portalId === 'schoolhub' || portalId === 'schoolmanager') {
          navigate('/schoolhub');
        } else if (portalId === 'bizmanager') {
          navigate('/bizmanager');
        }
      }
    }
  };

  const ActiveIcon = PORTAL_ICONS[activePlatform?.id] || GraduationCap;

  if (isCollapsed) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title={`Active Portal: ${activePlatform?.name}`}
          aria-label={`Active Portal: ${activePlatform?.name}. Click to switch.`}
          aria-expanded={isOpen}
          className="w-10 h-10 mx-auto rounded-lg bg-mx-elevated border border-mx-border hover:border-mx-blue/50 flex items-center justify-center text-white transition-colors relative group cursor-pointer focus:outline-none focus:ring-1 focus:ring-mx-blue"
        >
          <ActiveIcon className="w-5 h-5 text-mx-blue" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-mx-blue animate-pulse" />
        </button>

        {isOpen && (
          <div className="absolute top-0 left-full ml-2 w-52 bg-mx-surface border border-mx-border rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-mx-subtle uppercase tracking-wider border-b border-mx-border mb-1">
              Switch SaaS Portal
            </div>
            {EXPOSED_PORTALS.map((portal) => {
              const Icon = PORTAL_ICONS[portal.id] || GraduationCap;
              const isSelected =
                activePlatform?.id === portal.id ||
                activePlatform?.aliasId === portal.id;
              return (
                <button
                  key={portal.id}
                  type="button"
                  onClick={() => handleSelect(portal.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-mx-elevated text-white font-bold border border-mx-border'
                      : 'text-neutral-300 hover:bg-mx-elevated/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-mx-blue' : 'text-mx-subtle'}`} />
                    <span className="truncate">{portal.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-mx-blue shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="text-[10px] font-bold text-mx-subtle uppercase tracking-wider mb-1.5 px-0.5">
        Command Portal
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch SaaS Portal"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-mx-elevated border border-mx-border hover:border-neutral-700 text-left transition-colors cursor-pointer group focus:outline-none focus:ring-1 focus:ring-mx-blue"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-mx-surface border border-mx-border flex items-center justify-center shrink-0">
            <ActiveIcon className="w-4 h-4 text-mx-blue" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">
                {activePlatform?.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            </div>
            <p className="text-[10px] text-mx-subtle truncate">
              {activePlatform?.tagline || 'Ecosystem Module'}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-mx-subtle transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-white' : 'group-hover:text-white'
          }`}
        />
      </button>

      {/* Portal Dropdown Menu — ONLY School Hub and Biz Manager */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-mx-surface border border-mx-border rounded-xl shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-mx-subtle uppercase tracking-wider border-b border-mx-border mb-1">
            Integrated Portals
          </div>
          {EXPOSED_PORTALS.map((portal) => {
            const Icon = PORTAL_ICONS[portal.id] || GraduationCap;
            const isSelected =
              activePlatform?.id === portal.id ||
              activePlatform?.aliasId === portal.id;
            return (
              <button
                key={portal.id}
                type="button"
                onClick={() => handleSelect(portal.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-mx-elevated text-white font-bold border border-mx-border'
                    : 'text-neutral-300 hover:bg-mx-elevated/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-mx-surface border border-mx-border' : 'bg-mx-elevated'
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-mx-blue' : 'text-mx-subtle'}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold block truncate text-white">{portal.name}</span>
                    <span className="text-[10px] text-mx-subtle block truncate">
                      {portal.quickStats?.category || portal.code}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-mx-blue shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalSelector;
