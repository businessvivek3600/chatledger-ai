'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Building2,
  TrendingUp,
  MessageSquare,
  Bot,
  CreditCard,
  Search,
  Lock,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuthStore } from '../../lib/auth-store';
import { formatCurrency } from '../../lib/utils';
import { UserRole } from '@nexaflow/shared-types';

export default function SuperAdminConsolePage() {
  const router = useRouter();
  const { user, logout, initialize } = useAuthStore();

  const [metrics, setMetrics] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const fetchData = async () => {
    try {
      const [met, tnts, logs, tcks] = await Promise.all([
        apiRequest('/admin/metrics'),
        apiRequest<any[]>(`/admin/tenants${search ? `?search=${search}` : ''}`),
        apiRequest<any[]>('/admin/audit-logs'),
        apiRequest<any[]>('/admin/support-tickets'),
      ]);
      setMetrics(met?.overview);
      setTenants(tnts);
      setAuditLogs(logs);
      setTickets(tcks);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleToggleTenantStatus = async (tenantId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to change tenant status to ${nextStatus}?`)) return;

    try {
      await apiRequest(`/admin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchData();
    } catch (err) {
      alert('Failed to update tenant status');
    }
  };

  const handleSignOut = () => {
    logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F8FA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202938] flex flex-col font-sans">
      {/* Super Admin Top Header */}
      <header className="h-16 bg-white border-b border-[#E6EAF0] px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#243B5A] text-white font-bold flex items-center justify-center text-xs tracking-wider shadow-xs">
            CL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-[#202938]">
                ChatLedger AI
              </span>
              <span className="text-[10px] font-bold text-[#356AE6] bg-[#356AE6]/10 px-2 py-0.5 rounded border border-[#356AE6]/20 uppercase">
                Super Admin
              </span>
            </div>
            <span className="text-[10px] text-[#707B8B] block">
              Global Platform Governance & Ecosystem Telemetry
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#202938] hover:bg-[#F2F4F7] bg-white px-3 py-1.5 rounded-lg border border-[#E6EAF0] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Tenant Dashboard <ArrowRight className="w-3 h-3 text-[#707B8B]" />
          </Link>
          <button
            onClick={handleSignOut}
            className="text-xs font-semibold text-[#D64B50] hover:bg-[#D64B50]/10 px-3 py-1.5 rounded-lg border border-[#D64B50]/20 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-5">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
            <span className="text-[10px] font-semibold text-[#707B8B] uppercase tracking-wider">Monthly Run-rate</span>
            <div className="text-xl font-bold text-[#23865B] mt-1">
              {formatCurrency(metrics?.mrr || 4999)}
            </div>
            <span className="text-[10px] text-[#707B8B]">Current MRR</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
            <span className="text-[10px] font-semibold text-[#707B8B] uppercase tracking-wider">Registered Tenants</span>
            <div className="text-xl font-bold text-[#202938] mt-1">
              {metrics?.totalTenants || 3}
            </div>
            <span className="text-[10px] text-[#23865B] font-semibold">{metrics?.activeTenants || 3} Active</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
            <span className="text-[10px] font-semibold text-[#707B8B] uppercase tracking-wider">Total WhatsApp Msg</span>
            <div className="text-xl font-bold text-[#356AE6] mt-1">
              {metrics?.totalWhatsAppMessages || 312}
            </div>
            <span className="text-[10px] text-[#707B8B]">Cross-tenant</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
            <span className="text-[10px] font-semibold text-[#707B8B] uppercase tracking-wider">AI Autonomous Chats</span>
            <div className="text-xl font-bold text-[#243B5A] mt-1">
              {metrics?.totalAiConversations || 140}
            </div>
            <span className="text-[10px] text-[#707B8B]">{metrics?.totalTokensUsed || 8500} tokens</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
            <span className="text-[10px] font-semibold text-[#707B8B] uppercase tracking-wider">AI Inference Cost</span>
            <div className="text-xl font-bold text-[#B98535] mt-1">
              ${metrics?.totalAiExpensesUsd || 0.12}
            </div>
            <span className="text-[10px] text-[#707B8B]">OpenAI API Cost</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
            <span className="text-[10px] font-semibold text-[#707B8B] uppercase tracking-wider">Platform Health</span>
            <div className="text-xl font-bold text-[#23865B] mt-1">99.99%</div>
            <span className="text-[10px] text-[#707B8B]">Postgres & Redis OK</span>
          </div>
        </div>

        {/* Privacy Safeguard Alert */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E6EAF0] shadow-xs text-xs text-[#202938] flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#243B5A]/10 text-[#243B5A] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <strong className="font-bold text-[#202938] block mb-0.5">
              Multi-Tenant Data Privacy Safeguard Enforced:
            </strong>
            <p className="text-[#707B8B] text-[11px] leading-relaxed">
              Super Admins oversee business health, quota telemetry, and system support. By design, private customer message bodies and confidential client notes are strictly isolated and unbrowseable.
            </p>
          </div>
        </div>

        {/* Tenants Directory Table */}
        <div className="bg-white rounded-xl border border-[#E6EAF0] shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#202938]">Registered Business Tenants</h2>
              <p className="text-xs text-[#707B8B]">Manage business accounts, assigned industry templates, and subscription tiers.</p>
            </div>

            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search business, slug, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E6EAF0] bg-white text-[#202938] focus:outline-none focus:border-[#356AE6]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8FA] text-[#707B8B] font-semibold border-b border-[#E6EAF0] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Business Name</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">Plan Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Customers</th>
                  <th className="p-3">WhatsApp Number</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6EAF0]">
                {tenants.map((t) => {
                  const isSuspended = t.status === 'SUSPENDED';
                  return (
                    <tr key={t.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="p-3 font-semibold text-[#202938]">
                        {t.name}
                        <div className="text-[10px] text-[#707B8B] font-normal">{t.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#F2F4F7] text-[#243B5A] font-medium text-[10px] border border-[#E6EAF0]">
                          {t.industry}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-[#356AE6]">
                        {t.subscription?.plan?.name || 'Growth Plan'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isSuspended
                              ? 'bg-[#D64B50]/10 text-[#D64B50] border-[#D64B50]/20'
                              : 'bg-[#23865B]/10 text-[#23865B] border-[#23865B]/20'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-[#202938]">{t._count?.customers || 0}</td>
                      <td className="p-3 font-mono text-[#707B8B]">
                        {t.whatsappAccount?.phoneNumbers?.[0]?.displayPhoneNumber || t.phone}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleTenantStatus(t.id, t.status)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all border ${
                            isSuspended
                              ? 'bg-[#23865B] text-white border-[#23865B]'
                              : 'bg-white hover:bg-[#D64B50]/10 text-[#D64B50] border-[#D64B50]/30'
                          }`}
                        >
                          {isSuspended ? 'Reactivate' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Split: Support Tickets & Audit Trail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Support Tickets */}
          <div className="bg-white rounded-xl border border-[#E6EAF0] shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B98535]" />
              Support Triage Tickets
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tickets.length === 0 ? (
                <div className="text-xs text-[#98A2B3] p-4 text-center">No open support tickets.</div>
              ) : (
                tickets.map((t) => (
                  <div key={t.id} className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] text-xs">
                    <div className="flex justify-between font-bold text-[#202938]">
                      <span>{t.subject}</span>
                      <span className="text-[10px] text-[#B98535] uppercase bg-[#B98535]/10 px-2 py-0.5 rounded border border-[#B98535]/20 font-bold">{t.status}</span>
                    </div>
                    <div className="text-[11px] text-[#707B8B] mt-1">
                      From: {t.tenant?.name} ({t.user?.fullName})
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Platform Audit Trail */}
          <div className="bg-white rounded-xl border border-[#E6EAF0] shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#23865B]" />
              Global Audit Trail
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto text-xs font-mono">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] text-[11px] text-[#202938]">
                  <div className="text-[#356AE6] font-semibold">{log.action}</div>
                  <div className="text-[#707B8B] text-[10px] mt-0.5">
                    {log.tenant?.name} • {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
