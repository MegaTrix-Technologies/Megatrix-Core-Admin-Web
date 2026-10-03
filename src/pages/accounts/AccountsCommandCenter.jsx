import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Wallet,
  LayoutDashboard,
  DollarSign,
  Receipt,
  Users,
  Clock,
  FolderKanban,
  FileText,
  TrendingUp,
  Scale,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  ChevronDown,
  ShieldCheck,
  Server,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { accountsApi } from '../../services/adminApi';

// Tabs
import AccountsOverviewTab from './tabs/AccountsOverviewTab';
import SalesLedgerTab from './tabs/SalesLedgerTab';
import ReceivablesAgingTab from './tabs/ReceivablesAgingTab';
import CommissionsTab from './tabs/CommissionsTab';
import ProjectFinancialsTab from './tabs/ProjectFinancialsTab';
import InflowsLedgerTab from './tabs/InflowsLedgerTab';
import ExpensesLedgerTab from './tabs/ExpensesLedgerTab';
import ProfitLossTab from './tabs/ProfitLossTab';
import CashFlowTab from './tabs/CashFlowTab';
import ReconciliationTab from './tabs/ReconciliationTab';
import SyncLogsTab from './tabs/SyncLogsTab';

// Modals
import SaleDetailModal from './modals/SaleDetailModal';
import ExpenseModal from './modals/ExpenseModal';
import AdjustmentModal from './modals/AdjustmentModal';
import DarkDateRangePicker from '../../components/common/DarkDateRangePicker';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'sales', label: 'Sales Ledger', icon: DollarSign },
  { id: 'receivables', label: 'Receivables & Aging', icon: Clock },
  { id: 'commissions', label: 'Commissions', icon: Users },
  { id: 'projects', label: 'Project Financials', icon: FolderKanban },
  { id: 'inflows', label: 'Cash Inflows', icon: TrendingUp },
  { id: 'expenses', label: 'Operating Expenses', icon: Receipt },
  { id: 'pnl', label: 'Profit & Loss', icon: FileText },
  { id: 'cash_flow', label: 'Cash Flow', icon: Layers },
  { id: 'reconciliation', label: 'Reconciliation', icon: Scale },
  { id: 'sync_logs', label: 'Sync Logs', icon: RefreshCw },
];

const AccountsCommandCenter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const [dateRange, setDateRange] = useState({ preset: 'all_time', startDate: '', endDate: '' });
  const [basisView, setBasisView] = useState('dual'); // 'dual', 'cash', 'accrual'
  const [overviewData, setOverviewData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [adjustmentInitialData, setAdjustmentInitialData] = useState({});

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const [fetchError, setFetchError] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await accountsApi.getOverview({
        preset: dateRange.preset,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res.success) {
        setOverviewData(res);
        setFetchError(null);
      }
    } catch (err) {
      console.error('[AccountsCommandCenter] Overview fetch error:', err);
      const isNetwork = !err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error');
      const msg = isNetwork
        ? 'Core Admin Backend (Port 5002) is offline or unreachable. Please ensure the backend server is running.'
        : (err.response?.data?.message || 'Failed to load accounts telemetry');
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [dateRange]);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await accountsApi.triggerSync();
      if (res.success) {
        toast.success(`CRM Telemetry updated (${res.meta?.durationMs || 0}ms via ${res.meta?.mode})`);
        fetchOverview();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    setExportDropdownOpen(false);
    try {
      const blob = await accountsApi.exportExcel();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MegaTrix_Financial_Dossier_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Financial Excel Dossier downloaded');
    } catch (err) {
      toast.error('Failed to generate Excel export');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    setExportDropdownOpen(false);
    try {
      const blob = await accountsApi.exportPdf();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MegaTrix_Executive_Dossier_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Executive PDF Dossier downloaded');
    } catch (err) {
      toast.error('Failed to generate PDF export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ─────────────────────────────────────────────────────────────
       * 1. HEADER & GLOBAL CONTROLS
       * ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-lg bg-mx-panel border border-mx-border">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-md bg-mx-surface border border-mx-border flex items-center justify-center text-emerald-400">
            <Wallet size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Global Accounts & Financial Command Center
              </h1>
              {overviewData?.meta?.mode && (
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  title={`Ingestion mode: ${overviewData.meta.mode}`}
                >
                  {overviewData.meta.mode === 'standalone_native' ? 'Standalone Core Native' : (overviewData.meta.mode === 'api_gateway' ? 'Live API Gateway' : 'Atlas Direct Fallback')}
                </span>
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
                PKR (Rs)
              </span>
            </div>
            <p className="text-xs text-mx-subtle font-mono mt-0.5">
              Dual-Basis Accounting, Receivables Aging, Profitability & Integrity Audits
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dark Theme Date Range Selector */}
          <DarkDateRangePicker
            preset={dateRange.preset}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onApplyRange={(range) => setDateRange(range)}
          />

          {/* Basis View Selector */}
          <div className="flex items-center rounded-sm bg-mx-surface border border-mx-border p-0.5 text-xs font-mono">
            <button
              onClick={() => setBasisView('dual')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                basisView === 'dual' ? 'bg-mx-panel text-white font-bold' : 'text-mx-subtle hover:text-white'
              }`}
            >
              Dual Basis
            </button>
            <button
              onClick={() => setBasisView('cash')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                basisView === 'cash' ? 'bg-mx-panel text-emerald-400 font-bold' : 'text-mx-subtle hover:text-white'
              }`}
            >
              Cash Basis
            </button>
            <button
              onClick={() => setBasisView('accrual')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                basisView === 'accrual' ? 'bg-mx-panel text-blue-400 font-bold' : 'text-mx-subtle hover:text-white'
              }`}
            >
              Accrual
            </button>
          </div>

          {/* Sync / Refresh Button */}
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="px-3 py-1.5 rounded-sm bg-mx-surface border border-mx-border text-xs text-mx-subtle hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50 font-mono"
            title="Recalculate ledger metrics and create snapshot"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin text-mx-blue' : ''} />
            {syncing ? 'Refreshing...' : 'Refresh Ledger'}
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              disabled={exporting}
              className="px-3 py-1.5 rounded-sm bg-mx-blue text-xs font-bold text-white hover:bg-blue-600 transition-colors flex items-center gap-1.5 font-mono"
            >
              <Download size={13} />
              {exporting ? 'Exporting...' : 'Export Reports'}
              <ChevronDown size={12} />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 rounded-md bg-mx-panel border border-mx-border shadow-2xl z-40 py-1 font-mono text-xs">
                <button
                  onClick={handleExportExcel}
                  className="w-full px-4 py-2 text-left text-white hover:bg-mx-surface flex items-center gap-2"
                >
                  <FileText size={14} className="text-emerald-400" />
                  Export Multi-Tab Excel (.xlsx)
                </button>
                <button
                  onClick={handleExportPdf}
                  className="w-full px-4 py-2 text-left text-white hover:bg-mx-surface flex items-center gap-2"
                >
                  <FileText size={14} className="text-red-400" />
                  Export Executive PDF Dossier (.pdf)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 2. HORIZONTAL TAB NAVIGATION BAR
       * ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-mx-border no-scrollbar select-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-2 rounded-t-sm text-xs font-mono font-medium flex items-center gap-2 transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-mx-blue text-white bg-mx-panel'
                  : 'border-transparent text-mx-subtle hover:text-white hover:bg-mx-surface/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-mx-blue' : 'text-mx-subtle'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 3. ACTIVE TAB CONTENT VIEW
       * ───────────────────────────────────────────────────────────── */}
      <div>
        {activeTab === 'overview' && (
          <AccountsOverviewTab
            overviewData={overviewData}
            loading={loading}
            error={fetchError}
            onRetry={fetchOverview}
            basisView={basisView}
            onSelectTab={handleTabChange}
            onOpenAdjustment={(init = {}) => {
              setAdjustmentInitialData(init);
              setAdjustmentModalOpen(true);
            }}
          />
        )}

        {activeTab === 'sales' && (
          <SalesLedgerTab
            onOpenSaleDetail={(id) => setSelectedSaleId(id)}
          />
        )}

        {activeTab === 'receivables' && (
          <ReceivablesAgingTab
            onOpenSaleDetail={(id) => setSelectedSaleId(id)}
          />
        )}

        {activeTab === 'commissions' && (
          <CommissionsTab
            onOpenSaleDetail={(id) => setSelectedSaleId(id)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectFinancialsTab />
        )}

        {activeTab === 'inflows' && (
          <InflowsLedgerTab />
        )}

        {activeTab === 'expenses' && (
          <ExpensesLedgerTab
            refreshKey={refreshKey}
            onOpenAddExpense={() => {
              setSelectedExpense(null);
              setExpenseModalOpen(true);
            }}
            onOpenEditExpense={(exp) => {
              setSelectedExpense(exp);
              setExpenseModalOpen(true);
            }}
          />
        )}

        {activeTab === 'pnl' && (
          <ProfitLossTab />
        )}

        {activeTab === 'cash_flow' && (
          <CashFlowTab />
        )}

        {activeTab === 'reconciliation' && (
          <ReconciliationTab
            refreshKey={refreshKey}
            onOpenAdjustment={(init = {}) => {
              setAdjustmentInitialData(init);
              setAdjustmentModalOpen(true);
            }}
            onOpenSaleDetail={(id) => setSelectedSaleId(id)}
          />
        )}

        {activeTab === 'sync_logs' && (
          <SyncLogsTab onSyncSuccess={fetchOverview} />
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * 4. GLOBAL MODALS
       * ───────────────────────────────────────────────────────────── */}
      {selectedSaleId && (
        <SaleDetailModal
          saleId={selectedSaleId}
          onClose={() => setSelectedSaleId(null)}
        />
      )}

      {expenseModalOpen && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => {
            setExpenseModalOpen(false);
            setSelectedExpense(null);
          }}
          onSuccess={() => {
            setRefreshKey((k) => k + 1);
            fetchOverview();
          }}
        />
      )}

      {adjustmentModalOpen && (
        <AdjustmentModal
          initialData={adjustmentInitialData}
          onClose={() => {
            setAdjustmentModalOpen(false);
            setAdjustmentInitialData({});
          }}
          onSuccess={() => {
            setRefreshKey((k) => k + 1);
            fetchOverview();
          }}
        />
      )}
    </div>
  );
};

export default AccountsCommandCenter;
