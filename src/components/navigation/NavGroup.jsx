import React, { useState } from 'react';
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

  let isActive = false;
  if (to.includes('?')) {
    const [targetPath, targetQuery] = to.split('?');
    const targetParams = new URLSearchParams(targetQuery);
    const searchParams = new URLSearchParams(location.search);
    const targetTab = targetParams.get('tab');
    const currentTab = searchParams.get('tab') || (targetPath === '/settings' ? 'profile' : null);

    isActive = location.pathname === targetPath && targetTab === currentTab;
  } else {
    isActive = exact
      ? location.pathname === to
      : location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  }

  if (isCollapsed) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        title={label}
        aria-label={label}
        className={`w-8 h-8 mx-auto rounded-sm flex items-center justify-center transition-colors relative group focus:outline-none focus:border focus:border-mx-blue ${
          isActive
            ? 'bg-white text-black font-bold'
            : 'text-mx-muted hover:text-white hover:bg-mx-panel'
        }`}
      >
        {Icon && <Icon size={16} strokeWidth={1.5} color="currentColor" className="shrink-0" />}
        {isActive && (
          <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-sm bg-mx-blue" />
        )}

        {/* Hover Flyout Tooltip */}
        <div className="absolute left-full ml-2 px-2 py-1 bg-mx-surface border border-mx-border rounded-sm text-xs text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {label}
          {badge && (
            <span className="ml-1.5 text-[11px] font-mono text-mx-blue">
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
      aria-label={label}
      className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-colors group focus:outline-none focus:border focus:border-mx-blue min-h-[36px] ${
        isActive
          ? 'bg-white text-black font-semibold'
          : 'text-mx-subtle hover:text-white hover:bg-mx-panel'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={1.5}
            color="currentColor"
            className={`shrink-0 transition-colors ${
              isActive ? 'text-black' : 'text-mx-muted group-hover:text-white'
            }`}
          />
        )}
        <span className="truncate">{label}</span>
      </div>

      {badge && (
        <span
          className={`text-[11px] font-mono px-2 py-1 rounded-sm ${
            isActive
              ? 'bg-black/10 text-black'
              : 'bg-mx-panel text-mx-subtle border border-mx-border'
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

  if (isCollapsed) {
    return (
      <div className="relative group flex justify-center py-1">
        <button
          type="button"
          title={title}
          aria-label={title}
          className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors ${
            isAnySubActive
              ? 'bg-mx-panel text-white'
              : 'text-mx-muted hover:text-white hover:bg-mx-panel'
          }`}
        >
          {Icon && <Icon size={16} strokeWidth={1.5} color="currentColor" />}
        </button>

        {/* Hover Popover */}
        <div className="absolute left-full ml-2 top-0 bg-mx-surface border border-mx-border rounded-sm shadow-xl p-2 w-48 hidden group-hover:block z-50 animate-in fade-in duration-150">
          <p className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider px-2 py-1 mb-1 border-b border-mx-border font-mono">
            {title}
          </p>
          <div className="space-y-1">
            {items.map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = location.pathname.startsWith(sub.to);
              return (
                <NavLink
                  key={sub.to}
                  to={sub.to}
                  onClick={onItemClick}
                  aria-label={sub.label}
                  className={`flex items-center gap-2 px-2 py-2 rounded-sm text-xs transition-colors min-h-[32px] ${
                    isSubActive
                      ? 'bg-white text-black font-semibold'
                      : 'text-mx-subtle hover:text-white hover:bg-mx-panel'
                  }`}
                >
                  {SubIcon && <SubIcon size={14} strokeWidth={1.5} color="currentColor" />}
                  <span className="truncate">{sub.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Toggle ${title} group`}
        className="w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors cursor-pointer min-h-[36px]"
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={16} strokeWidth={1.5} color="currentColor" className="text-mx-muted" />}
          <span className="truncate font-semibold">{title}</span>
        </div>
        <ChevronRight
          size={14}
          strokeWidth={1.5}
          color="currentColor"
          className={`text-mx-muted transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="ml-4 pl-2 border-l border-mx-border space-y-1 my-1">
          {items.map((sub) => {
            const SubIcon = sub.icon;
            const isSubActive = location.pathname === sub.to || (sub.to !== '/' && location.pathname.startsWith(sub.to));

            return (
              <NavLink
                key={sub.to}
                to={sub.to}
                onClick={onItemClick}
                aria-label={sub.label}
                className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-colors min-h-[32px] ${
                  isSubActive
                    ? 'bg-white text-black font-semibold'
                    : 'text-mx-subtle hover:text-white hover:bg-mx-panel'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {SubIcon && (
                    <SubIcon
                      size={14}
                      strokeWidth={1.5}
                      color="currentColor"
                      className={isSubActive ? 'text-black' : 'text-mx-muted'}
                    />
                  )}
                  <span className="truncate">{sub.label}</span>
                </div>
                {sub.badge && (
                  <span
                    className={`text-[11px] font-mono px-2 py-1 rounded-sm ${
                      isSubActive
                        ? 'bg-black/10 text-black'
                        : 'bg-mx-panel text-mx-subtle border border-mx-border'
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
