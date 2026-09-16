import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const NavItem = ({
  to,
  icon: Icon,
  label,
  badge,
  isCollapsed = false,
  onClick,
  exact = false,
}) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  if (isCollapsed) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        title={label}
        aria-label={label}
        className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center transition-colors relative group focus:outline-none focus:ring-1 focus:ring-mx-blue ${
          isActive
            ? 'bg-white text-black font-bold shadow-sm'
            : 'text-neutral-400 hover:text-white hover:bg-mx-elevated'
        }`}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        {/* Subtle active pill indicator on left edge when collapsed */}
        {isActive && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-mx-blue" />
        )}

        {/* Hover Flyout Tooltip */}
        <div className="absolute left-full ml-2.5 px-2.5 py-1 bg-mx-surface border border-mx-border rounded-md text-xs font-medium text-white shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {label}
          {badge && (
            <span className="ml-1.5 text-[9px] text-mx-blue font-semibold">
              {badge}
            </span>
          )}
        </div>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group focus:outline-none focus:ring-1 focus:ring-mx-blue ${
        isActive
          ? 'bg-white text-black font-semibold shadow-xs'
          : 'text-neutral-400 hover:text-white hover:bg-mx-elevated'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              isActive ? 'text-black' : 'text-neutral-500 group-hover:text-white'
            }`}
          />
        )}
        <span className="truncate">{label}</span>
      </div>

      {badge && (
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            isActive
              ? 'bg-black/10 text-black'
              : 'bg-mx-elevated text-neutral-400 border border-mx-border'
          }`}
        >
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export const NavGroup = ({
  icon: Icon,
  title,
  items = [],
  isCollapsed = false,
  onItemClick,
  defaultExpanded = true,
}) => {
  const location = useLocation();
  const isAnySubActive = items.some((item) =>
    location.pathname.startsWith(item.to)
  );

  const [isOpen, setIsOpen] = useState(defaultExpanded || isAnySubActive);
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  // Keep open if route is inside
  useEffect(() => {
    if (isAnySubActive) {
      setIsOpen(true);
    }
  }, [isAnySubActive]);

  if (isCollapsed) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setFlyoutOpen(true)}
        onMouseLeave={() => setFlyoutOpen(false)}
      >
        <button
          type="button"
          onClick={() => setFlyoutOpen(!flyoutOpen)}
          aria-label={title}
          title={title}
          className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center transition-colors cursor-pointer relative group focus:outline-none focus:ring-1 focus:ring-mx-blue ${
            isAnySubActive
              ? 'bg-mx-elevated text-mx-blue font-bold border border-mx-border'
              : 'text-neutral-400 hover:text-white hover:bg-mx-elevated'
          }`}
        >
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {isAnySubActive && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-mx-blue" />
          )}
        </button>

        {/* Collapsed Flyout Submenu */}
        {flyoutOpen && (
          <div className="absolute top-0 left-full ml-2 w-52 bg-mx-surface border border-mx-border rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2.5 py-1 text-[10px] font-bold text-mx-subtle uppercase tracking-wider border-b border-mx-border mb-1">
              {title}
            </div>
            <div className="space-y-0.5">
              {items.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = location.pathname === sub.to;
                return (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    onClick={() => {
                      setFlyoutOpen(false);
                      if (onItemClick) onItemClick();
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                      isSubActive
                        ? 'bg-white text-black font-bold'
                        : 'text-neutral-300 hover:text-white hover:bg-mx-elevated'
                    }`}
                  >
                    {SubIcon && <SubIcon className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{sub.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group focus:outline-none focus:ring-1 focus:ring-mx-blue ${
          isAnySubActive
            ? 'text-white font-semibold'
            : 'text-neutral-400 hover:text-white hover:bg-mx-elevated/60'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isAnySubActive ? 'text-mx-blue' : 'text-neutral-500 group-hover:text-white'
              }`}
            />
          )}
          <span className="truncate">{title}</span>
        </div>

        <ChevronRight
          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-90 text-white' : 'group-hover:text-white'
          }`}
        />
      </button>

      {/* Expanded Sub-items with subtle vertical guide */}
      {isOpen && (
        <div className="ml-4 pl-3 border-l border-mx-border space-y-0.5 mt-0.5">
          {items.map((sub) => {
            const isSubActive = location.pathname === sub.to;
            const SubIcon = sub.icon;
            return (
              <NavLink
                key={sub.to}
                to={sub.to}
                onClick={onItemClick}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  isSubActive
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-mx-elevated'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {SubIcon && (
                    <SubIcon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSubActive ? 'text-black' : 'text-neutral-500'
                      }`}
                    />
                  )}
                  <span className="truncate">{sub.label}</span>
                </div>
                {sub.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isSubActive
                        ? 'bg-black/10 text-black'
                        : 'text-neutral-500'
                    }`}
                  >
                    {sub.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NavGroup;
