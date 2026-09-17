import React from 'react';

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  isHero = false,
  badge,
}) => {
  return (
    <div
      className={`rounded-md p-4 bg-mx-panel border border-mx-border transition-colors flex flex-col justify-between ${
        isHero ? 'sm:col-span-2 lg:col-span-2' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-sm bg-mx-surface border border-mx-border flex items-center justify-center text-mx-subtle">
            <Icon size={18} strokeWidth={1.5} color="currentColor" />
          </div>
        )}
      </div>

      <div className="my-4 flex items-baseline gap-2">
        <span
          className={`font-mono tracking-tight text-white ${
            isHero ? 'text-[40px] font-bold leading-none' : 'text-[28px] font-bold leading-none'
          }`}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {badge && (
          <span className="text-[11px] font-mono px-2 py-1 rounded-sm bg-mx-surface text-mx-subtle border border-mx-border">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-mx-subtle">
        <span>{subtitle}</span>
        {trend && (
          <span
            className={`font-mono text-[11px] ${
              trendPositive ? 'text-mx-positive' : 'text-mx-danger'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
