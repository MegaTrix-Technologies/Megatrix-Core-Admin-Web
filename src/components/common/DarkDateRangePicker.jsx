import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  X,
  Check,
  Clock,
  ArrowRight,
} from 'lucide-react';
import DarkDatePicker, { formatToYMD, formatDisplayDate } from './DarkDatePicker';

export const PRESET_RANGES = [
  { id: 'all_time', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This Week' },
  { id: 'last_week', label: 'Last Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'this_quarter', label: 'This Quarter' },
  { id: 'this_year', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' },
];

export const calculatePresetDates = (presetId) => {
  const now = new Date();
  let start = null;
  let end = null;

  switch (presetId) {
    case 'today': {
      start = formatToYMD(now);
      end = formatToYMD(now);
      break;
    }
    case 'yesterday': {
      const y = new Date();
      y.setDate(now.getDate() - 1);
      start = formatToYMD(y);
      end = formatToYMD(y);
      break;
    }
    case 'this_week': {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      const monday = new Date(now.setDate(diff));
      start = formatToYMD(monday);
      end = formatToYMD(new Date());
      break;
    }
    case 'last_week': {
      const day = now.getDay();
      const diff = now.getDate() - day - 6;
      const prevMon = new Date(now.setDate(diff));
      const prevSun = new Date(prevMon);
      prevSun.setDate(prevMon.getDate() + 6);
      start = formatToYMD(prevMon);
      end = formatToYMD(prevSun);
      break;
    }
    case 'this_month': {
      start = formatToYMD(new Date(now.getFullYear(), now.getMonth(), 1));
      end = formatToYMD(new Date());
      break;
    }
    case 'last_month': {
      start = formatToYMD(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      end = formatToYMD(new Date(now.getFullYear(), now.getMonth(), 0));
      break;
    }
    case 'this_quarter': {
      const quarter = Math.floor(now.getMonth() / 3);
      start = formatToYMD(new Date(now.getFullYear(), quarter * 3, 1));
      end = formatToYMD(new Date());
      break;
    }
    case 'this_year': {
      start = formatToYMD(new Date(now.getFullYear(), 0, 1));
      end = formatToYMD(new Date());
      break;
    }
    default:
      start = '';
      end = '';
      break;
  }

  return { startDate: start, endDate: end };
};

const DarkDateRangePicker = ({
  startDate = '',
  endDate = '',
  preset = 'all_time',
  onApplyRange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(preset || 'all_time');
  const [tempStart, setTempStart] = useState(startDate || '');
  const [tempEnd, setTempEnd] = useState(endDate || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setSelectedPreset(preset || 'all_time');
    setTempStart(startDate || '');
    setTempEnd(endDate || '');
  }, [preset, startDate, endDate]);

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

  const handleSelectPreset = (pId) => {
    setSelectedPreset(pId);
    if (pId !== 'custom') {
      const { startDate: s, endDate: e } = calculatePresetDates(pId);
      setTempStart(s);
      setTempEnd(e);
      if (onApplyRange) {
        onApplyRange({ preset: pId, startDate: s, endDate: e });
      }
      setIsOpen(false);
    }
  };

  const handleApplyCustom = () => {
    if (onApplyRange) {
      onApplyRange({
        preset: 'custom',
        startDate: tempStart,
        endDate: tempEnd,
      });
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedPreset('all_time');
    setTempStart('');
    setTempEnd('');
    if (onApplyRange) {
      onApplyRange({ preset: 'all_time', startDate: '', endDate: '' });
    }
    setIsOpen(false);
  };

  // Label display
  const activePresetObj = PRESET_RANGES.find((p) => p.id === selectedPreset);
  const displayLabel =
    selectedPreset === 'custom' && tempStart && tempEnd
      ? `${formatDisplayDate(tempStart)} → ${formatDisplayDate(tempEnd)}`
      : activePresetObj?.label || 'Date Range';

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1.5 rounded-sm bg-mx-surface border border-mx-border text-xs font-mono text-white hover:border-mx-blue transition-colors flex items-center gap-2 ${
          isOpen ? 'border-mx-blue ring-1 ring-mx-blue/50' : ''
        }`}
      >
        <CalendarIcon size={13} className="text-mx-subtle shrink-0" />
        <span>{displayLabel}</span>
        <ChevronDown size={12} className="text-mx-subtle" />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-1 z-50 w-80 rounded-md bg-mx-panel border border-mx-border shadow-2xl p-4 animate-fadeIn select-none space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-mx-border">
            <span className="text-[11px] font-bold text-white uppercase font-mono flex items-center gap-1.5">
              <CalendarIcon size={13} className="text-mx-blue" /> Select Reporting Period
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] font-mono text-mx-subtle hover:text-red-400"
            >
              Reset All
            </button>
          </div>

          {/* Quick Presets Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            {PRESET_RANGES.map((p) => {
              const isSelected = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`px-2.5 py-1.5 rounded-sm text-left transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-mx-blue text-white font-bold'
                      : 'bg-mx-surface text-mx-subtle hover:text-white hover:bg-mx-surface/80'
                  }`}
                >
                  <span>{p.label}</span>
                  {isSelected && <Check size={12} />}
                </button>
              );
            })}
          </div>

          {/* Custom Start & End Date Inputs */}
          <div className="pt-3 border-t border-mx-border space-y-2.5">
            <span className="text-[10px] font-mono text-mx-subtle uppercase block">
              Or Custom Date Range
            </span>

            <div className="space-y-2">
              <DarkDatePicker
                label="Start Date"
                value={tempStart}
                onChange={(val) => {
                  setTempStart(val);
                  setSelectedPreset('custom');
                }}
                placeholder="From date..."
              />
              <DarkDatePicker
                label="End Date"
                value={tempEnd}
                onChange={(val) => {
                  setTempEnd(val);
                  setSelectedPreset('custom');
                }}
                placeholder="To date..."
              />
            </div>

            <button
              type="button"
              onClick={handleApplyCustom}
              className="w-full mt-2 py-1.5 rounded-sm bg-mx-blue text-xs font-bold text-white hover:bg-blue-600 transition-colors font-mono"
            >
              Apply Custom Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkDateRangePicker;
