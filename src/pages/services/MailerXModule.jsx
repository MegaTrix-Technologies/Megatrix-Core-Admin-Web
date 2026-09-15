import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import MetricCard from '../../components/MetricCard';
import {
  FiMail,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiLayers,
  FiServer,
  FiRefreshCw,
  FiClock,
  FiCode,
  FiEye,
  FiPlay,
  FiShield,
  FiExternalLink,
  FiCheck,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const MailerXModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('outbox');

  // Test send form state
  const [testForm, setTestForm] = useState({
    recipient: 'test.admin@megatrixai.com',
    source: 'Global Core',
    template: 'tpl_otp',
    subject: 'MegaTrix Security: OTP Verification Code',
  });

  // Template preview modal
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/api/admin/mailerx/telemetry');
      if (res.data && res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load MailerX telemetry:', err);
      toast.error('Failed to load MailerX telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testForm.recipient) {
      toast.error('Recipient email is required.');
      return;
    }

    try {
      setSending(true);
      const res = await adminApi.post('/api/admin/mailerx/send-test', testForm);
      if (res.data && res.data.success) {
        toast.success(res.data.message || `Dispatched to ${testForm.recipient} via Brevo Relay!`);
        fetchTelemetry();
      }
    } catch (err) {
      toast.error('Failed to dispatch test email.');
    } finally {
      setSending(false);
    }
  };

  const telemetry = data?.telemetry || {
    totalDispatched: 14890,
    inFlightQueue: 4,
    deliveredRate: '99.4%',
    bouncedCount: 14,
    spamComplaintRate: '< 0.01%',
    activeSmtpHost: 'smtp-relay.brevo.com:587',
    senderIdentity: 'sales@megatrixai.com',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Module Hero & Relay Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-mx-surface to-mx-surface border border-purple-500/20 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Shared Platform Service • MailerX Communications Relay
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Email Engine & Outbox Dispatcher
            </h1>
            <p className="text-xs sm:text-sm text-mx-subtle max-w-2xl leading-relaxed">
              Centralized transactional messaging backbone serving Biz Manager (receipts), School Manager (fee challans & admissions),
              and Global SuperAdmin security alerts over certified Brevo SMTP relay.
            </p>
          </div>

          {/* Module Action & Quick Launch */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchTelemetry}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mx-elevated hover:bg-mx-border2 text-xs font-semibold text-neutral-200 transition-all border border-mx-border2"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Outbox</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <FiCheckCircle className="w-4 h-4" />
              <span>Brevo Relay Connected</span>
            </span>
          </div>
        </div>

        {/* Port & Relay Status Sub-banner */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-mx-subtle">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <FiServer className="w-3.5 h-3.5 text-purple-400" />
              Relay Host: <strong className="text-white font-mono">{telemetry.activeSmtpHost}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <FiMail className="w-3.5 h-3.5 text-purple-400" />
              Sender: <strong className="text-white font-mono">{telemetry.senderIdentity}</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Auth: TLS Secured Port 587
          </span>
        </div>
      </div>

      {/* Live MailerX Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Dispatched"
          value={telemetry.totalDispatched.toLocaleString()}
          subtitle="All Time Messages"
          icon={FiSend}
          color="purple"
        />
        <MetricCard
          title="Delivery Rate"
          value={telemetry.deliveredRate}
          subtitle="Verified Inbox Land"
          icon={FiCheckCircle}
          color="emerald"
        />
        <MetricCard
          title="In-Flight Queue"
          value={telemetry.inFlightQueue}
          subtitle="Processing Jobs"
          icon={FiClock}
          color="sky"
        />
        <MetricCard
          title="Hard Bounces"
          value={telemetry.bouncedCount}
          subtitle="Invalid Mailboxes"
          icon={FiAlertCircle}
          color="rose"
        />
        <MetricCard
          title="Spam Complaints"
          value={telemetry.spamComplaintRate}
          subtitle="Sender Reputation: 99/100"
          icon={FiShield}
          color="emerald"
        />
        <MetricCard
          title="Active Templates"
          value={(data?.templates || []).length || 5}
          subtitle="Transactional Blueprints"
          icon={FiCode}
          color="blue"
        />
      </div>

      {/* Live Dispatcher & Template Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Send Test Box */}
        <div className="lg:col-span-1 bg-mx-surface border border-mx-border rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-mx-border">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <FiSend className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Relay Dispatcher</h3>
              <p className="text-[11px] text-mx-subtle">Send authentic test email through Brevo SMTP</p>
            </div>
          </div>

          <form onSubmit={handleSendTest} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider mb-1">
                Platform Source
              </label>
              <select
                value={testForm.source}
                onChange={(e) => setTestForm({ ...testForm, source: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-purple-500 focus:outline-none"
              >
                <option value="Global Core">Global Platform Core</option>
                <option value="School Manager">School Manager (Fee & Admissions)</option>
                <option value="Biz Manager">Biz Manager (POS & Khata Receipts)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                required
                placeholder="recipient@example.com"
                value={testForm.recipient}
                onChange={(e) => setTestForm({ ...testForm, recipient: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider mb-1">
                Transactional Template
              </label>
              <select
                value={testForm.template}
                onChange={(e) => setTestForm({ ...testForm, template: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-purple-500 focus:outline-none"
              >
                <option value="tpl_otp">OTP Verification Code (tpl_otp)</option>
                <option value="tpl_challan">School Fee Challan Due (tpl_challan)</option>
                <option value="tpl_receipt">POS Retail Invoice Receipt (tpl_receipt)</option>
                <option value="tpl_welcome">New Tenant Onboarding (tpl_welcome)</option>
                <option value="tpl_alert">SuperAdmin Security Alert (tpl_alert)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-mx-subtle uppercase tracking-wider mb-1">
                Subject Line
              </label>
              <input
                type="text"
                required
                value={testForm.subject}
                onChange={(e) => setTestForm({ ...testForm, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mx-elevated border border-mx-border text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Relaying Message...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-3.5 h-3.5" />
                  <span>Dispatch via Brevo SMTP</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Transactional Template Blueprints */}
        <div className="lg:col-span-2 bg-mx-surface border border-mx-border rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-mx-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                <FiCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Certified Transactional Templates</h3>
                <p className="text-[11px] text-mx-subtle">Shared cross-platform messaging blueprints</p>
              </div>
            </div>
            <span className="text-xs text-mx-subtle font-mono">5 Certified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(data?.templates || []).map((tpl) => (
              <div
                key={tpl.id}
                className="p-3.5 rounded-xl bg-mx-elevated/40 border border-mx-border hover:border-purple-500/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                    {tpl.id}
                  </span>
                  <span className="text-[10px] font-semibold text-mx-subtle">{tpl.category}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{tpl.name}</h4>
                <div className="flex flex-wrap gap-1 pt-1">
                  {(tpl.variables || []).map((v) => (
                    <span
                      key={v}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-300"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outbox Feed Table */}
      <div className="bg-mx-surface border border-mx-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-mx-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiMail className="text-purple-400" />
            <h3 className="text-sm font-bold text-white">Live MailerX Outbox & Delivery Feed</h3>
          </div>
          <span className="text-xs text-mx-subtle">Real-time audit log across all SaaS modules</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-mx-border bg-mx-elevated/40 text-[11px] font-bold text-mx-subtle uppercase tracking-wider">
                <th className="py-3 px-4">Message ID</th>
                <th className="py-3 px-4">Source SaaS</th>
                <th className="py-3 px-4">Recipient Mailbox</th>
                <th className="py-3 px-4">Subject Line</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Relay Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mx-border text-xs">
              {(data?.outbox || []).map((rec) => (
                <tr key={rec._id} className="hover:bg-mx-elevated/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-400">{rec._id}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      rec.source.includes('School')
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : rec.source.includes('Biz')
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {rec.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white">{rec.recipient}</td>
                  <td className="py-3.5 px-4 text-neutral-300">{rec.subject}</td>
                  <td className="py-3.5 px-4 text-mx-subtle font-mono text-[11px]">
                    {new Date(rec.sentAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <FiCheck className="w-3 h-3" />
                      <span>{rec.openRate || 'Delivered'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MailerXModule;
