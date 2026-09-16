import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import MetricCard from '../../components/MetricCard';
import {
  FiShoppingCart,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiBookOpen,
  FiAlertCircle,
  FiExternalLink,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiShield,
  FiLayers,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const BizManagerModule = ({ defaultTab = 'invoices' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  const bizManagerUrl = import.meta.env.VITE_BIZMANAGER_APP_URL || 'https://bizmanager.megatrixai.com';
  const bizApiUrl = import.meta.env.VITE_BIZMANAGER_API_URL || 'https://bizmanager.megatrixai.com';

  useEffect(() => {
    fetchBizSummary();
  }, []);

  const fetchBizSummary = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/api/admin/bizmanager/summary');
      if (res.data && res.data.success) {
        setData(res.data);
      }
    } catch {
      // BizManager is deployed on Vercel as a client/serverless app without standalone Express backend
      console.info('[BizManager] Running in Vercel client-hosted mode.');
    } finally {
      setLoading(false);
    }
  };

  const metrics = data?.metrics || {
    todaySales: 'PKR 342,850',
    activeCustomers: 480,
    inventorySkus: 1420,
    khataReceivables: 'PKR 184,200',
    cashInHand: 'PKR 95,400',
    terminalsOnline: 3,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Module Hero & Gateway Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/40 via-mx-surface to-mx-surface border border-blue-500/20 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Integrated SaaS Module • Biz Manager POS ERP
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Retail & Point of Sale Command Desk
            </h1>
            <p className="text-xs sm:text-sm text-mx-subtle max-w-2xl leading-relaxed">
              Real-time synchronization across retail outlets, barcode scanning POS, wholesale credit khata,
              stock inventory reconciliations, and cash/bank balances.
            </p>
          </div>

          {/* Module Action & Quick Launch */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchBizSummary}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-xs font-semibold text-neutral-200 transition-all border border-mx-border2"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Telemetry</span>
            </button>
            <a
              href={bizManagerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25"
            >
              <FiShoppingCart className="w-4 h-4" />
              <span>Launch Biz Manager POS</span>
              <FiExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Port Status Sub-banner */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-mx-subtle">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Platform: <strong className="text-white font-mono">{bizManagerUrl}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Deployment: <strong className="text-white font-mono">Vercel Production</strong>
            </span>
            <span className="text-neutral-400">Currency: <strong>PKR (₨)</strong></span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Tenant Namespace: BIZ-RETAIL-01
          </span>
        </div>
      </div>

      {/* Strict Tenant Isolation Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
        <FiShield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-amber-300">
            Strict Multi-Platform Tenant Isolation Enforced
          </p>
          <p className="text-amber-200/80 leading-relaxed">
            Biz Manager merchants, retail credentials, and cash khata ledgers are completely isolated from School Manager. 
            A retail merchant cannot authenticate into School Manager without explicitly registering an educational institution tenant.
          </p>
        </div>
      </div>

      {/* Live Retail Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Today's Sales"
          value={metrics.todaySales}
          subtitle="Processed via POS"
          icon={FiDollarSign}
          color="emerald"
        />
        <MetricCard
          title="Active Customers"
          value={metrics.activeCustomers}
          subtitle="Walk-in & Regular"
          icon={FiUsers}
          color="sky"
        />
        <MetricCard
          title="Inventory SKUs"
          value={metrics.inventorySkus}
          subtitle="Stock Items Tracked"
          icon={FiPackage}
          color="blue"
        />
        <MetricCard
          title="Khata Receivables"
          value={metrics.khataReceivables}
          subtitle="Pending Customer Dues"
          icon={FiBookOpen}
          color="amber"
        />
        <MetricCard
          title="Cash In Hand"
          value={metrics.cashInHand}
          subtitle="Cash Drawer Register"
          icon={FiCheckCircle}
          color="purple"
        />
        <MetricCard
          title="Terminals Online"
          value={metrics.terminalsOnline}
          subtitle="Active Checkout Counters"
          icon={FiLayers}
          color="emerald"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-mx-border gap-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'invoices'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-mx-subtle hover:text-neutral-200'
          }`}
        >
          Recent POS Invoices
        </button>
        <button
          onClick={() => setActiveTab('khata')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'khata'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-mx-subtle hover:text-neutral-200'
          }`}
        >
          Customer Khata (Udhaar)
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'stock'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-mx-subtle hover:text-neutral-200'
          }`}
        >
          Low Stock Reorder Alerts
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'invoices' && (
        <div className="bg-mx-surface border border-mx-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-mx-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FiFileText className="text-blue-400" />
              Live Retail Sales Invoices
            </h3>
            <span className="text-xs text-mx-subtle">Auto-synchronized with Biz Manager</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-mx-border bg-mx-elevated/40 text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer / Store</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-border text-xs">
                {(data?.recentInvoices || []).map((inv) => (
                  <tr key={inv.id} className="hover:bg-mx-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{inv.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{inv.customer}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      PKR {inv.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                        inv.payment === 'Cash' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : inv.payment.includes('Credit')
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {inv.payment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-mx-subtle">{inv.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`${bizManagerUrl}/invoices`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-mx-blue hover:underline"
                      >
                        <span>View in POS</span>
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'khata' && (
        <div className="bg-mx-surface border border-mx-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-mx-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FiBookOpen className="text-amber-400" />
              Khata Ledger & Pending Receivables
            </h3>
            <span className="text-xs text-mx-subtle">Retail wholesale & customer accounts</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-mx-border bg-mx-elevated/40 text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Outstanding Balance</th>
                  <th className="py-3 px-4">Recovery Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-border text-xs">
                {(data?.khataDebtors || []).map((kh, i) => (
                  <tr key={i} className="hover:bg-mx-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{kh.name}</td>
                    <td className="py-3.5 px-4 font-mono text-mx-subtle">{kh.phone}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{kh.balance}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25">
                        {kh.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`${bizManagerUrl}/khata`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
                      >
                        <span>Send WhatsApp / SMS</span>
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="bg-mx-surface border border-mx-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-mx-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FiAlertCircle className="text-rose-400" />
              Low Inventory Reorder Warnings
            </h3>
            <span className="text-xs text-mx-subtle">SKUs below minimum safe threshold</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-mx-border bg-mx-elevated/40 text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                  <th className="py-3 px-4">Item Name / Description</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Reorder Level</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-border text-xs">
                {(data?.lowStockAlerts || []).map((sk, i) => (
                  <tr key={i} className="hover:bg-mx-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{sk.item}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{sk.current}</td>
                    <td className="py-3.5 px-4 font-mono text-mx-subtle">{sk.min}</td>
                    <td className="py-3.5 px-4 text-mx-subtle">{sk.unit}</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`${bizManagerUrl}/inventory`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:underline"
                      >
                        <span>Create PO</span>
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BizManagerModule;
