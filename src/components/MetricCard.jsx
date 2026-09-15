import React from 'react';

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'violet',
  badge,
}) => {
  const colorMap = {
    violet: 'bg-mx-surface text-mx-blue border-mx-blue/20 ring-mx-blue/10',
    emerald: 'bg-mx-surface text-emerald-400 border-emerald-500/20 ring-emerald-500/10',
    amber: 'bg-mx-surface text-amber-400 border-amber-500/20 ring-amber-500/10',
    rose: 'bg-mx-surface text-rose-400 border-rose-500/20 ring-rose-500/10',
    sky: 'bg-mx-surface text-sky-400 border-sky-500/20 ring-sky-500/10',
  };

  const iconBgMap = {
    violet: 'bg-mx-blue/15 text-mx-blue',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    amber: 'bg-amber-500/15 text-amber-400',
    rose: 'bg-rose-500/15 text-rose-400',
    sky: 'bg-sky-500/15 text-sky-400',
  };

  return (
    <div
      className={`rounded-2xl p-5 bg-gradient-to-br ${
        colorMap[color] || colorMap.violet
      } border ring-1 ring-white/5 backdrop-blur-md shadow-lg transition-all hover:scale-[1.01] flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-mx-subtle uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl ${iconBgMap[color] || iconBgMap.violet}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="my-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mx-elevated text-neutral-300 border border-mx-border2">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-mx-subtle">
        <span>{subtitle}</span>
        {trend && (
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              trendPositive ? 'text-emerald-400' : 'text-rose-400'
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
