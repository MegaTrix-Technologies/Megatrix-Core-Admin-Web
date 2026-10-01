import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Check,
} from 'lucide-react';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Format a Date object to YYYY-MM-DD in local time
 */
export const formatToYMD = (date) => {
  if (!date || isNaN(new Date(date).getTime())) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format YYYY-MM-DD to display string like "Sep 27, 2026"
 */
export const formatDisplayDate = (ymdStr) => {
  if (!ymdStr) return '';
  const parts = ymdStr.split('-');
  if (parts.length !== 3) return ymdStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  if (isNaN(d.getTime())) return ymdStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const DarkDatePicker = ({
  value = '',
  onChange,
  label = '',
  placeholder = 'Select date...',
  required = false,
  disabled = false,
  className = '',
  minDate = null,
  maxDate = null,
  align = 'left', // 'left' or 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial view date from value or fallback to today
  const initialDate = value ? new Date(value) : new Date();
  const validInitialDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

  const [viewYear, setViewYear] = useState(validInitialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(validInitialDate.getMonth());

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Year options (-10 years to +5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 10; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }

  // Navigation handlers
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Calendar Days Grid Generation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const d = new Date(viewYear, viewMonth - 1, dayNum);
    calendarDays.push({
      date: d,
      dayNum,
      isCurrentMonth: false,
      ymd: formatToYMD(d),
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(viewYear, viewMonth, i);
    calendarDays.push({
      date: d,
      dayNum: i,
      isCurrentMonth: true,
      ymd: formatToYMD(d),
    });
  }

  // Next month leading days to complete 42 cells (6 rows)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(viewYear, viewMonth + 1, i);
    calendarDays.push({
      date: d,
      dayNum: i,
      isCurrentMonth: false,
      ymd: formatToYMD(d),
    });
  }

  const selectedYmd = value ? formatToYMD(new Date(value)) : '';
  const todayYmd = formatToYMD(new Date());

  const handleSelectDay = (ymd) => {
    if (disabled) return;
    if (onChange) onChange(ymd);
    setIsOpen(false);
  };

  const handleQuickPreset = (type) => {
    const now = new Date();
    let target = new Date();
    if (type === 'today') {
      target = now;
    } else if (type === 'yesterday') {
      target.setDate(now.getDate() - 1);
    } else if (type === 'week_ago') {
      target.setDate(now.getDate() - 7);
    } else if (type === 'month_ago') {
      target.setMonth(now.getMonth() - 1);
    } else if (type === 'clear') {
      if (onChange) onChange('');
      setIsOpen(false);
      return;
    }
    const ymd = formatToYMD(target);
    if (onChange) onChange(ymd);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-mono text-mx-subtle uppercase mb-1">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Input Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 bg-mx-surface border border-mx-border rounded-sm text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed bg-mx-panel' : 'hover:border-mx-blue focus-within:border-mx-blue'
        } ${isOpen ? 'border-mx-blue ring-1 ring-mx-blue/50' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon size={14} className="text-mx-subtle shrink-0" />
          <span className={value ? 'text-white font-medium' : 'text-mx-subtle/60'}>
            {value ? `${formatDisplayDate(selectedYmd)} (${selectedYmd})` : placeholder}
          </span>
        </div>

        {value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onChange) onChange('');
            }}
            className="p-0.5 text-mx-subtle hover:text-white rounded-sm"
            title="Clear Date"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Popover Dark Calendar Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1 z-50 w-72 rounded-md bg-mx-panel border border-mx-border shadow-2xl p-3 animate-fadeIn select-none ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Header Navigation */}
          <div className="flex items-center justify-between gap-1 mb-3 pb-2 border-b border-mx-border">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-sm text-mx-subtle hover:text-white hover:bg-mx-surface transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {/* Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="bg-mx-surface border border-mx-border rounded-sm text-xs font-mono text-white px-2 py-1 focus:outline-none focus:border-mx-blue cursor-pointer"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx} className="bg-mx-panel text-white">
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="bg-mx-surface border border-mx-border rounded-sm text-xs font-mono text-white px-2 py-1 focus:outline-none focus:border-mx-blue cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y} className="bg-mx-panel text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-sm text-mx-subtle hover:text-white hover:bg-mx-surface transition-colors"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="text-[10px] font-mono text-mx-subtle uppercase py-0.5">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs font-mono">
            {calendarDays.map((cell, idx) => {
              const isSelected = cell.ymd === selectedYmd;
              const isToday = cell.ymd === todayYmd;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(cell.ymd)}
                  className={`h-7 w-full rounded-sm flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-mx-blue text-white font-bold shadow-sm'
                      : isToday
                      ? 'border border-mx-blue text-mx-blue hover:bg-mx-surface'
                      : cell.isCurrentMonth
                      ? 'text-white hover:bg-mx-surface'
                      : 'text-mx-subtle/30 hover:bg-mx-surface/40'
                  }`}
                >
                  {cell.dayNum}
                </button>
              );
            })}
          </div>

          {/* Quick Preset Actions */}
          <div className="mt-3 pt-2.5 border-t border-mx-border flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleQuickPreset('today')}
                className="px-2 py-1 rounded-sm bg-mx-surface border border-mx-border text-mx-subtle hover:text-white hover:bg-mx-surface/80 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('yesterday')}
                className="px-2 py-1 rounded-sm bg-mx-surface border border-mx-border text-mx-subtle hover:text-white hover:bg-mx-surface/80 transition-colors"
              >
                Yesterday
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleQuickPreset('clear')}
              className="px-2 py-1 rounded-sm text-mx-subtle hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkDatePicker;
