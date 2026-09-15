import React from 'react';

const StatusPill = ({ type = 'account', status, isLifetime }) => {
  if (isLifetime) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>LIFETIME VIP</span>
      </span>
    );
  }

  if (type === 'account') {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Active</span>
        </span>
      );
    }
    if (status === 'suspended' || status === 'locked') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span>Blocked</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-mx-elevated text-neutral-300 border border-mx-border2">
        <span>{status || 'Unknown'}</span>
      </span>
    );
  }

  if (type === 'subscription') {
    if (status === 'trial') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/25">
          <span>Free Trial</span>
        </span>
      );
    }
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
          <span>Active Paid</span>
        </span>
      );
    }
    if (status === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25">
          <span>Expired</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-mx-elevated text-neutral-300">
        <span>{status || 'Trial'}</span>
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-mx-elevated text-neutral-300">
      {status}
    </span>
  );
};

export default StatusPill;
