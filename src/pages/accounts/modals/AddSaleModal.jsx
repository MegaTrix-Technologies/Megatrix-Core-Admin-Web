import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  Building2,
  Calendar,
  Layers,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  Percent,
  CreditCard,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { accountsApi } from '../../../services/adminApi';
import DarkDatePicker from '../../../components/common/DarkDatePicker';
import { PAKISTAN_PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD, fmtPKR } from '../../../config/currency';

const AddSaleModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [salesAgents, setSalesAgents] = useState([]);

  // Form State
  const [customer, setCustomer] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: 'Lahore',
    area: '',
    category: 'Software & Technology',
  });

  const [products, setProducts] = useState([
    { name: 'Core Enterprise Digital Contract', quantity: 1, unitPrice: 150000, subtotal: 150000 },
  ]);

  const [advanceAmount, setAdvanceAmount] = useState(50000);
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const [closedAt, setClosedAt] = useState(new Date().toISOString().slice(0, 10));

  // Attribution & Agent Selectors State
  const [selectedCloserId, setSelectedCloserId] = useState('');
  const [closedByName, setClosedByName] = useState('Super Admin');

  const [selectedLeadGenId, setSelectedLeadGenId] = useState('');
  const [leadGeneratedByName, setLeadGeneratedByName] = useState('Sales Desk');

  const [selectedDevIds, setSelectedDevIds] = useState([]);
  const [assignedDevelopers, setAssignedDevelopers] = useState('Dev Lead');

  const [selectedReferralId, setSelectedReferralId] = useState('');
  const [referralPartnerName, setReferralPartnerName] = useState('');
  const [notes, setNotes] = useState('');

  // Commission Rates (Auto-populated from agent profile, fully Admin editable)
  const [commissionRates, setCommissionRates] = useState({
    leadGenPercent: 0,
    closerPercent: 0,
    developerPercent: 0,
    referralPercent: 0,
  });

  // Fetch Sales Team Roster from CRM / Core
  useEffect(() => {
    const loadAgents = async () => {
      setAgentsLoading(true);
      try {
        const res = await accountsApi.getSalesAgents();
        if (res.success && Array.isArray(res.agents)) {
          setSalesAgents(res.agents);
        }
      } catch (err) {
        console.warn('[AddSaleModal] Could not fetch sales agents:', err.message);
      } finally {
        setAgentsLoading(false);
      }
    };
    loadAgents();
  }, []);

  // Handle Closer selection
  const handleCloserSelect = (agentId) => {
    setSelectedCloserId(agentId);
    if (!agentId) {
      setClosedByName('Super Admin');
      setCommissionRates((prev) => ({ ...prev, closerPercent: 0 }));
      return;
    }
    const agent = salesAgents.find((a) => a.id === agentId);
    if (agent) {
      setClosedByName(agent.name);
      setCommissionRates((prev) => ({
        ...prev,
        closerPercent: Number(agent.commissionRates?.closerPercent) || 0,
      }));
    }
  };

  // Handle Lead Gen selection
  const handleLeadGenSelect = (agentId) => {
    setSelectedLeadGenId(agentId);
    if (!agentId) {
      setLeadGeneratedByName('Sales Desk');
      setCommissionRates((prev) => ({ ...prev, leadGenPercent: 0, referralPercent: 0 }));
      return;
    }
    const agent = salesAgents.find((a) => a.id === agentId);
    if (agent) {
      setLeadGeneratedByName(agent.name);
      setCommissionRates((prev) => ({
        ...prev,
        leadGenPercent: Number(agent.commissionRates?.leadGenPercent) || 0,
        referralPercent: Number(agent.commissionRates?.referralPercent) || 0,
      }));
    }
  };

  // Handle Developer selection
  const handleDevSelect = (agentId) => {
    if (!agentId) return;
    const agent = salesAgents.find((a) => a.id === agentId);
    if (!agent) return;

    if (!selectedDevIds.includes(agentId)) {
      const nextIds = [...selectedDevIds, agentId];
      setSelectedDevIds(nextIds);
      const names = nextIds
        .map((id) => salesAgents.find((a) => a.id === id)?.name)
        .filter(Boolean)
        .join(', ');
      setAssignedDevelopers(names);

      const totalDevRate = nextIds.reduce((sum, id) => {
        const dev = salesAgents.find((a) => a.id === id);
        return sum + (Number(dev?.commissionRates?.developerPercent) || 0);
      }, 0);
      setCommissionRates((prev) => ({ ...prev, developerPercent: totalDevRate }));
    }
  };

  const removeDev = (agentId) => {
    const nextIds = selectedDevIds.filter((id) => id !== agentId);
    setSelectedDevIds(nextIds);
    const names = nextIds
      .map((id) => salesAgents.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    setAssignedDevelopers(names || 'Dev Lead');

    const totalDevRate = nextIds.reduce((sum, id) => {
      const dev = salesAgents.find((a) => a.id === id);
      return sum + (Number(dev?.commissionRates?.developerPercent) || 0);
    }, 0);
    setCommissionRates((prev) => ({ ...prev, developerPercent: totalDevRate }));
  };

  // Derived Calculations
  const totalAmount = products.reduce(
    (sum, p) => sum + (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0),
    0
  );

  const numericAdvance = Math.max(0, Number(advanceAmount) || 0);
  const remainingAmount = Math.max(0, totalAmount - numericAdvance);

  const totalCommissionPercent =
    (Number(commissionRates.leadGenPercent) || 0) +
    (Number(commissionRates.closerPercent) || 0) +
    (Number(commissionRates.developerPercent) || 0) +
    (referralPartnerName.trim() ? Number(commissionRates.referralPercent) || 0 : 0);

  const estimatedCommission = Math.round((totalAmount * totalCommissionPercent) / 100);

  const handleProductChange = (index, field, value) => {
    setProducts((prev) => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      const qty = Number(field === 'quantity' ? value : item.quantity) || 0;
      const price = Number(field === 'unitPrice' ? value : item.unitPrice) || 0;
      item.subtotal = qty * price;
      next[index] = item;
      return next;
    });
  };

  const addProductLine = () => {
    setProducts((prev) => [
      ...prev,
      { name: '', quantity: 1, unitPrice: 0, subtotal: 0 },
    ]);
  };

  const removeProductLine = (index) => {
    if (products.length <= 1) {
      toast.warning('A sale must have at least one product line item.');
      return;
    }
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.businessName.trim()) {
      toast.error('Customer business name is required.');
      return;
    }

    if (totalAmount <= 0) {
      toast.error('Total contract amount must be greater than zero.');
      return;
    }

    if (numericAdvance < 0) {
      toast.error('Advance amount cannot be negative.');
      return;
    }

    if (numericAdvance > totalAmount) {
      toast.error('Advance amount cannot exceed the total contract value.');
      return;
    }

    if (customer.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer.email.trim())) {
        toast.error('Please enter a valid customer email address.');
        return;
      }
    }

    setLoading(true);
    try {
      const devArray = assignedDevelopers
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        customer: {
          businessName: customer.businessName.trim(),
          contactPerson: customer.contactPerson.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          city: customer.city.trim() || 'Lahore',
          area: customer.area.trim(),
          category: customer.category.trim() || 'General',
        },
        products,
        totalAmount,
        advanceAmount: numericAdvance,
        paymentMethod,
        leadGeneratedBy: {
          id: selectedLeadGenId || null,
          name: leadGeneratedByName.trim() || 'Sales Desk',
        },
        closedBy: {
          id: selectedCloserId || null,
          name: closedByName.trim() || 'Super Admin',
        },
        assignedDevelopers: selectedDevIds.length > 0
          ? selectedDevIds.map((id) => ({
              id,
              name: salesAgents.find((a) => a.id === id)?.name || 'Developer',
              role: 'Developer',
            }))
          : devArray.map((name) => ({ id: null, name, role: 'Developer' })),
        referralPartner: {
          id: selectedReferralId || null,
          name: referralPartnerName.trim() || '',
        },
        leadGeneratedByName: leadGeneratedByName.trim() || 'Sales Desk',
        closedByName: closedByName.trim() || 'Super Admin',
        assignedDeveloperNames: selectedDevIds.length > 0
          ? selectedDevIds.map((id) => salesAgents.find((a) => a.id === id)?.name || 'Developer')
          : (devArray.length > 0 ? devArray : ['Dev Lead']),
        referralPartnerName: referralPartnerName.trim(),
        closedAt,
        notes: notes.trim(),
        commissionRates,
      };

      const res = await accountsApi.createSale(payload);
      if (res.success) {
        toast.success(`Sale ${res.sale?.saleNumber || ''} created & synced to CRM!`);
        onSuccess(res.sale);
        onClose();
      } else {
        toast.error(res.message || 'Failed to create sale contract.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Network error saving contract.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = fmtPKR;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      data-testid="modal-add-sale"
    >
      <div
        className="bg-mx-panel border border-mx-border rounded-lg w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
        data-testid="add-sale-modal"
      >
        {/* Header */}
        <div className="p-4 border-b border-mx-border flex items-center justify-between bg-mx-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-emerald-400">
              <DollarSign size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Add New Core Sales Contract
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Native Core Record
                </span>
              </h2>
              <p className="text-xs text-mx-subtle">
                Customer Profile, Scope Deliverables, Payment Terms & Commission Splits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors"
            data-testid="btn-close-add-sale"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* ─────────────────────────────────────────────────────────────
           * 1. CUSTOMER INFORMATION
           * ───────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Building2 size={14} className="text-mx-subtle" /> Customer & Business Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  required
                  data-testid="input-customer-business"
                  placeholder="e.g. Apex Global Logistics"
                  value={customer.businessName}
                  onChange={(e) => setCustomer({ ...customer, businessName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  data-testid="input-customer-name"
                  placeholder="e.g. Tariq Mehmood"
                  value={customer.contactPerson}
                  onChange={(e) => setCustomer({ ...customer, contactPerson: e.target.value })}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  data-testid="input-customer-email"
                  placeholder="client@company.pk"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  data-testid="input-customer-phone"
                  placeholder="0300-1234567"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  placeholder="Lahore, Karachi, Islamabad..."
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  Category / Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Retail, FinTech, Logistics"
                  value={customer.category}
                  onChange={(e) => setCustomer({ ...customer, category: e.target.value })}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                />
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
           * 2. DELIVERABLES / PRODUCTS & SERVICES
           * ───────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers size={14} className="text-mx-subtle" /> Scope Deliverables & Contract Pricing
              </h3>
              <button
                type="button"
                onClick={addProductLine}
                className="px-2.5 py-1 rounded-sm bg-mx-panel border border-mx-border text-[11px] font-mono text-mx-blue hover:text-white transition-colors flex items-center gap-1"
                data-testid="btn-add-line-item"
              >
                <Plus size={12} /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {products.map((p, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-mx-panel p-2 rounded-sm border border-mx-border"
                >
                  <div className="col-span-6">
                    <input
                      type="text"
                      required
                      placeholder="Service / Product Description *"
                      value={p.name}
                      onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
                      data-testid={`input-item-name-${idx}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={p.quantity}
                      onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                      className="w-full px-2.5 py-1 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono focus:outline-none focus:border-mx-blue"
                      data-testid={`input-item-qty-${idx}`}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="Price (PKR)"
                      value={p.unitPrice}
                      onChange={(e) => handleProductChange(idx, 'unitPrice', e.target.value)}
                      className="w-full px-2.5 py-1 bg-mx-surface border border-mx-border rounded-sm text-xs text-white font-mono focus:outline-none focus:border-mx-blue"
                      data-testid={`input-item-price-${idx}`}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeProductLine(idx)}
                      className="text-mx-subtle hover:text-red-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal Strip */}
            <div className="flex justify-between items-center pt-2 border-t border-mx-border text-xs font-mono">
              <span className="text-mx-subtle">Calculated Total Contract Value:</span>
              <span className="text-sm font-bold text-white" data-testid="text-total-amount">
                {fmt(totalAmount)}
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
           * 3. FINANCIAL TERMS & ADVANCE PAYMENT
           * ───────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <CreditCard size={14} className="text-mx-subtle" /> Financial Terms & Realized Advance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  Contract Close Date *
                </label>
                <DarkDatePicker
                  value={closedAt}
                  onChange={(d) => setClosedAt(d)}
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  Initial Advance Paid (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  step="1000"
                  data-testid="input-advance-amount"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white font-mono focus:outline-none focus:border-mx-blue"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white font-mono focus:outline-none focus:border-mx-blue"
                >
                  {PAKISTAN_PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Financial Status Summary */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-sm bg-mx-panel border border-mx-border text-xs font-mono text-center">
              <div>
                <span className="text-[10px] text-mx-subtle block uppercase">Contract Value</span>
                <span className="text-white font-bold">{fmt(totalAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-mx-subtle block uppercase">Inflow Advance</span>
                <span className="text-emerald-400 font-bold">{fmt(numericAdvance)}</span>
              </div>
              <div>
                <span className="text-[10px] text-mx-subtle block uppercase">Remaining Due</span>
                <span
                  className={`font-bold ${remainingAmount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}
                  data-testid="text-remaining-amount"
                >
                  {fmt(remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
           * 4. SALES ATTRIBUTION & COMMISSIONS
           * ───────────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <User size={14} className="text-emerald-400" /> Sales Team Attribution & Dynamic Commissions
              </h3>
              <span className="text-[10px] font-mono text-mx-subtle bg-mx-panel px-2 py-0.5 rounded border border-mx-border">
                {salesAgents.length} Team Members Synced
              </span>
            </div>

            {/* Agent Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Sales Closer Selector */}
              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1 flex items-center justify-between">
                  <span>Sales Closer</span>
                  <span className="text-[10px] text-blue-400">Rate: {commissionRates.closerPercent}%</span>
                </label>
                <select
                  value={selectedCloserId}
                  onChange={(e) => handleCloserSelect(e.target.value)}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white font-mono text-xs focus:outline-none focus:border-mx-blue"
                  data-testid="select-closer"
                >
                  <option value="">-- Manual Entry / Super Admin --</option>
                  {salesAgents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email || 'Agent'}) — Closer: {a.commissionRates.closerPercent}%
                    </option>
                  ))}
                </select>
                {!selectedCloserId && (
                  <input
                    type="text"
                    placeholder="Custom Closer Name"
                    value={closedByName}
                    onChange={(e) => setClosedByName(e.target.value)}
                    className="w-full mt-1 px-3 py-1 bg-mx-panel/60 border border-mx-border/70 rounded-sm text-white text-xs focus:outline-none focus:border-mx-blue"
                  />
                )}
              </div>

              {/* Lead Generator / Outreach Rep Selector */}
              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1 flex items-center justify-between">
                  <span>Lead Generator / Outreach Rep</span>
                  <span className="text-[10px] text-emerald-400">Rate: {commissionRates.leadGenPercent}%</span>
                </label>
                <select
                  value={selectedLeadGenId}
                  onChange={(e) => handleLeadGenSelect(e.target.value)}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white font-mono text-xs focus:outline-none focus:border-mx-blue"
                  data-testid="select-lead-gen"
                >
                  <option value="">-- Manual Entry / Sales Desk --</option>
                  {salesAgents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email || 'Agent'}) — LeadGen: {a.commissionRates.leadGenPercent}%
                    </option>
                  ))}
                </select>
                {!selectedLeadGenId && (
                  <input
                    type="text"
                    placeholder="Custom Lead Generator Name"
                    value={leadGeneratedByName}
                    onChange={(e) => setLeadGeneratedByName(e.target.value)}
                    className="w-full mt-1 px-3 py-1 bg-mx-panel/60 border border-mx-border/70 rounded-sm text-white text-xs focus:outline-none focus:border-mx-blue"
                  />
                )}
              </div>

              {/* Assigned Developers Multi-Selector */}
              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1 flex items-center justify-between">
                  <span>Assigned Developers</span>
                  <span className="text-[10px] text-purple-400">Rate: {commissionRates.developerPercent}%</span>
                </label>
                <select
                  value=""
                  onChange={(e) => handleDevSelect(e.target.value)}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white font-mono text-xs focus:outline-none focus:border-mx-blue"
                >
                  <option value="">+ Add Developer from Team...</option>
                  {salesAgents.map((a) => (
                    <option key={a.id} value={a.id} disabled={selectedDevIds.includes(a.id)}>
                      {a.name} ({a.roles?.join(', ') || 'Developer'})
                    </option>
                  ))}
                </select>
                {selectedDevIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedDevIds.map((devId) => {
                      const dev = salesAgents.find((a) => a.id === devId);
                      return (
                        <span
                          key={devId}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-mx-surface border border-mx-border text-[11px] text-white font-mono"
                        >
                          {dev?.name || 'Developer'}
                          <button
                            type="button"
                            onClick={() => removeDev(devId)}
                            className="hover:text-red-400 cursor-pointer ml-0.5"
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Dev Lead / Custom developers (comma separated)"
                    value={assignedDevelopers}
                    onChange={(e) => setAssignedDevelopers(e.target.value)}
                    className="w-full mt-1 px-3 py-1 bg-mx-panel/60 border border-mx-border/70 rounded-sm text-white text-xs focus:outline-none focus:border-mx-blue"
                  />
                )}
              </div>

              {/* Referral Partner */}
              <div>
                <label className="text-[11px] font-mono text-mx-subtle block mb-1 flex items-center justify-between">
                  <span>Referral Partner / Affiliate</span>
                  <span className="text-[10px] text-amber-400">Rate: {commissionRates.referralPercent}%</span>
                </label>
                <select
                  value={selectedReferralId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedReferralId(id);
                    if (!id) {
                      setReferralPartnerName('');
                      setCommissionRates((prev) => ({ ...prev, referralPercent: 0 }));
                    } else {
                      const agent = salesAgents.find((a) => a.id === id);
                      if (agent) {
                        setReferralPartnerName(agent.name);
                        setCommissionRates((prev) => ({
                          ...prev,
                          referralPercent: agent.commissionRates?.referralPercent || 5,
                        }));
                      }
                    }
                  }}
                  className="w-full px-3 py-1.5 bg-mx-panel border border-mx-border rounded-sm text-white font-mono text-xs focus:outline-none focus:border-mx-blue"
                >
                  <option value="">-- None / Custom Affiliate --</option>
                  {salesAgents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Referral: {a.commissionRates.referralPercent || 0}%)
                    </option>
                  ))}
                </select>
                {!selectedReferralId && (
                  <input
                    type="text"
                    placeholder="Referral Partner Name (optional)"
                    value={referralPartnerName}
                    onChange={(e) => setReferralPartnerName(e.target.value)}
                    className="w-full mt-1 px-3 py-1 bg-mx-panel/60 border border-mx-border/70 rounded-sm text-white text-xs focus:outline-none focus:border-mx-blue"
                  />
                )}
              </div>
            </div>

            {/* Admin Commission Rate Override Panel */}
            <div className="p-3 rounded-lg bg-mx-panel border border-mx-border space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Percent size={13} className="text-purple-400" /> Admin Rate Override Controls
                </span>
                <span className="text-mx-subtle text-[11px]">
                  Auto-calculated from total: {fmt(totalAmount)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {/* Lead Gen Rate */}
                <div className="p-2 rounded bg-mx-surface border border-mx-border/60">
                  <div className="text-mx-subtle text-[10px] mb-1">Lead Gen %</div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={commissionRates.leadGenPercent}
                      onChange={(e) =>
                        setCommissionRates({ ...commissionRates, leadGenPercent: Number(e.target.value) || 0 })
                      }
                      className="w-full px-2 py-0.5 bg-mx-panel border border-mx-border rounded text-emerald-400 font-bold text-center focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-mx-subtle">%</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80 mt-1 text-center font-bold">
                    {fmt(Math.round((totalAmount * (commissionRates.leadGenPercent || 0)) / 100))}
                  </div>
                </div>

                {/* Closer Rate */}
                <div className="p-2 rounded bg-mx-surface border border-mx-border/60">
                  <div className="text-mx-subtle text-[10px] mb-1">Closer %</div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={commissionRates.closerPercent}
                      onChange={(e) =>
                        setCommissionRates({ ...commissionRates, closerPercent: Number(e.target.value) || 0 })
                      }
                      className="w-full px-2 py-0.5 bg-mx-panel border border-mx-border rounded text-blue-400 font-bold text-center focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-mx-subtle">%</span>
                  </div>
                  <div className="text-[10px] text-blue-400/80 mt-1 text-center font-bold">
                    {fmt(Math.round((totalAmount * (commissionRates.closerPercent || 0)) / 100))}
                  </div>
                </div>

                {/* Developer Rate */}
                <div className="p-2 rounded bg-mx-surface border border-mx-border/60">
                  <div className="text-mx-subtle text-[10px] mb-1">Dev Pool %</div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={commissionRates.developerPercent}
                      onChange={(e) =>
                        setCommissionRates({ ...commissionRates, developerPercent: Number(e.target.value) || 0 })
                      }
                      className="w-full px-2 py-0.5 bg-mx-panel border border-mx-border rounded text-purple-400 font-bold text-center focus:outline-none focus:border-purple-400"
                    />
                    <span className="text-mx-subtle">%</span>
                  </div>
                  <div className="text-[10px] text-purple-400/80 mt-1 text-center font-bold">
                    {fmt(Math.round((totalAmount * (commissionRates.developerPercent || 0)) / 100))}
                  </div>
                </div>

                {/* Referral Rate */}
                <div className="p-2 rounded bg-mx-surface border border-mx-border/60">
                  <div className="text-mx-subtle text-[10px] mb-1">Referral %</div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={commissionRates.referralPercent}
                      onChange={(e) =>
                        setCommissionRates({ ...commissionRates, referralPercent: Number(e.target.value) || 0 })
                      }
                      className="w-full px-2 py-0.5 bg-mx-panel border border-mx-border rounded text-amber-400 font-bold text-center focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-mx-subtle">%</span>
                  </div>
                  <div className="text-[10px] text-amber-400/80 mt-1 text-center font-bold">
                    {fmt(Math.round((totalAmount * (commissionRates.referralPercent || 0)) / 100))}
                  </div>
                </div>
              </div>

              {/* Commission Liability Total Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-mx-border/60 text-xs font-mono">
                <span className="text-mx-subtle">
                  Total Attributed Commission ({totalCommissionPercent}%):
                </span>
                <span className="text-purple-300 font-bold" data-testid="text-estimated-commission">
                  {fmt(estimatedCommission)}
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
           * 5. CONTRACT NOTES / MEMO
           * ───────────────────────────────────────────────────────────── */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-mx-subtle block">
              Contract Terms & Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Payment milestones, deliverables timeline, client specific conditions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-mx-surface border border-mx-border rounded-sm text-xs text-white placeholder:text-mx-subtle/50 focus:outline-none focus:border-mx-blue"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-mx-border flex items-center justify-between bg-mx-surface">
          <span className="text-[11px] font-mono text-mx-subtle">
            Calculated Live &bull; Dual-Basis Ledger Synced
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-sm bg-mx-panel border border-mx-border text-xs text-mx-subtle hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              data-testid="btn-submit-sale"
              className="px-5 py-1.5 rounded-sm bg-mx-blue text-xs font-bold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 font-mono flex items-center gap-1.5"
            >
              {loading ? 'Recording Contract...' : 'Save & Record Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSaleModal;
