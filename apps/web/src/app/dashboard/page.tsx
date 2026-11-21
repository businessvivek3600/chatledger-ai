'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  MessageSquare,
  Users,
  Calendar,
  CreditCard,
  Bot,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PhoneCall,
  UserCheck,
  Download,
  Filter,
  Check,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export default function DashboardOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [comparePeriod, setComparePeriod] = useState(true);
  const [exportNotice, setExportNotice] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await apiRequest('/reports/overview');
        setData(res);
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const handleExport = () => {
    const csvContent =
      'Metric,Current Period,Previous Period,Change\n' +
      'Total Leads,12,9,+33%\n' +
      'New Leads Today,3,1,+200%\n' +
      'Total Customers,45,38,+18%\n' +
      'Active Conversations,8,6,+33%\n' +
      'AI Handled Conversations,28,21,+33%\n' +
      'Upcoming Appointments,4,3,+33%\n' +
      'Conversion Rate,24%,20%,+4%\n' +
      'Total Revenue,28400,21200,+34%\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ChatLedger_BI_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalLeads: 12,
    newLeadsToday: 3,
    totalCustomers: 45,
    unassignedConversations: 2,
    activeConversations: 8,
    aiHandledConversations: 28,
    humanHandledConversations: 6,
    upcomingAppointments: 4,
    pendingTasks: 5,
    conversionRate: 24,
    totalRevenue: 28400,
    monthlyWhatsAppUsage: 312,
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP BUSINESS INTELLIGENCE HEADER */}
      <div className="bg-white rounded-xl p-5 border border-[#E6EAF0] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#23865B] animate-pulse"></span>
            <span className="text-[11px] font-semibold text-[#23865B] uppercase tracking-wider">
              WhatsApp Cloud API Connected & AI Online
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#202938] tracking-tight">
            Apex Multispecialty Clinic — Operations Overview
          </h1>
          <p className="text-xs text-[#707B8B] mt-0.5">
            Welcome back, Dr. Rajesh Sharma. Live patient inquiries, appointments, and UPI ledger performance.
          </p>
        </div>

        {/* Date Filter & Export Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex items-center rounded-lg border border-[#E6EAF0] bg-[#F7F8FA] p-0.5 text-xs font-semibold">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'This Month' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setDateRange(t.id)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  dateRange === t.id
                    ? 'bg-white text-[#243B5A] shadow-xs font-bold'
                    : 'text-[#707B8B] hover:text-[#202938]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Export Report Action */}
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg border border-[#E6EAF0] bg-white hover:bg-[#F7F8FA] text-xs font-semibold text-[#202938] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#707B8B]" />
            <span>Export BI Report</span>
          </button>

          {exportNotice && (
            <span className="text-[11px] font-semibold text-[#23865B] animate-in fade-in">
              ✓ Downloaded
            </span>
          )}

          <Link
            href="/whatsapp-simulator"
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span>Open Simulator</span>
          </Link>
        </div>
      </div>

      {/* 2. COMPACT KPI STATISTICAL CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Leads */}
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#707B8B] text-[11px] font-semibold">
            <span>Total Leads</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#356AE6]" />
          </div>
          <div className="text-xl font-bold text-[#202938] mt-1.5">{kpis.totalLeads}</div>
          <div className="flex items-center gap-1 text-[11px] text-[#23865B] font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+25% vs last period</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#707B8B] text-[11px] font-semibold">
            <span>Customers 360</span>
            <Users className="w-3.5 h-3.5 text-[#4F46E5]" />
          </div>
          <div className="text-xl font-bold text-[#202938] mt-1.5">{kpis.totalCustomers}</div>
          <div className="flex items-center gap-1 text-[11px] text-[#23865B] font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18% retained</span>
          </div>
        </div>

        {/* Active Conversations */}
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#707B8B] text-[11px] font-semibold">
            <span>WhatsApp Active</span>
            <MessageSquare className="w-3.5 h-3.5 text-[#23865B]" />
          </div>
          <div className="text-xl font-bold text-[#202938] mt-1.5">{kpis.activeConversations}</div>
          <div className="text-[11px] text-[#B98535] font-semibold mt-1">
            {kpis.unassignedConversations} require review
          </div>
        </div>

        {/* AI Resolution Rate */}
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#707B8B] text-[11px] font-semibold">
            <span>AI Automated</span>
            <Bot className="w-3.5 h-3.5 text-[#356AE6]" />
          </div>
          <div className="text-xl font-bold text-[#202938] mt-1.5">
            {kpis.aiHandledConversations}
            <span className="text-xs font-normal text-[#707B8B] ml-1">/ {kpis.aiHandledConversations + kpis.humanHandledConversations}</span>
          </div>
          <div className="text-[11px] text-[#23865B] font-semibold mt-1">
            82% automated resolution
          </div>
        </div>

        {/* Appointments Confirmed */}
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#707B8B] text-[11px] font-semibold">
            <span>Bookings</span>
            <Calendar className="w-3.5 h-3.5 text-[#243B5A]" />
          </div>
          <div className="text-xl font-bold text-[#202938] mt-1.5">{kpis.upcomingAppointments}</div>
          <div className="text-[11px] text-[#707B8B] font-semibold mt-1">
            Next 7 days confirmed
          </div>
        </div>

        {/* Revenue Collected */}
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between text-[#707B8B] text-[11px] font-semibold">
            <span>UPI Ledger Rev</span>
            <CreditCard className="w-3.5 h-3.5 text-[#23865B]" />
          </div>
          <div className="text-xl font-bold text-[#202938] mt-1.5">{formatCurrency(kpis.totalRevenue)}</div>
          <div className="flex items-center gap-1 text-[11px] text-[#23865B] font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+34% via Razorpay</span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS & REVENUE LEDGER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weekly Lead & WhatsApp Traffic Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
                Lead Acquisition & WhatsApp Traffic Flow
              </h3>
              <p className="text-xs text-[#707B8B]">Daily volume of inbound conversations vs verified qualified leads</p>
            </div>
            <span className="text-[11px] font-semibold text-[#707B8B] bg-[#F7F8FA] border border-[#E6EAF0] px-2.5 py-1 rounded-md">
              7-Day Rolling Trend
            </span>
          </div>

          <div className="h-56 flex items-end gap-3 pt-4 px-2 border-b border-[#E6EAF0]">
            {[
              { day: 'Mon', leads: 4, conv: 18 },
              { day: 'Tue', leads: 7, conv: 25 },
              { day: 'Wed', leads: 5, conv: 22 },
              { day: 'Thu', leads: 9, conv: 31 },
              { day: 'Fri', leads: 12, conv: 40 },
              { day: 'Sat', leads: 15, conv: 48 },
              { day: 'Sun', leads: 6, conv: 14 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-44">
                  {/* Conversations Bar */}
                  <div
                    style={{ height: `${(bar.conv / 50) * 100}%` }}
                    className="w-1/2 bg-[#6D8ED8]/50 group-hover:bg-[#356AE6] rounded-t-sm transition-all"
                    title={`${bar.conv} conversations`}
                  />
                  {/* Leads Bar */}
                  <div
                    style={{ height: `${(bar.leads / 20) * 100}%` }}
                    className="w-1/2 bg-[#23865B] group-hover:bg-[#1E744E] rounded-t-sm transition-all"
                    title={`${bar.leads} leads`}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#707B8B]">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-4 text-xs font-medium text-[#707B8B]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#6D8ED8]/60"></span>
              <span>Inbound WhatsApp Traffic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#23865B]"></span>
              <span>CRM Qualified Leads</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Intent Resolution Breakdown */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
                Dr. Apex AI Accuracy
              </h3>
              <span className="text-xs font-bold text-[#23865B]">88% Automated</span>
            </div>
            <p className="text-xs text-[#707B8B] mb-4">
              Real-time classification of patient inquiries by intent.
            </p>

            <div className="space-y-3">
              {[
                { label: 'Appointment Booking', pct: 48, color: 'bg-[#23865B]' },
                { label: 'Pricing & Treatment Fees', pct: 30, color: 'bg-[#356AE6]' },
                { label: 'Timings & Address Info', pct: 14, color: 'bg-[#4F46E5]' },
                { label: 'Human Agent Handover', pct: 8, color: 'bg-[#B98535]' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#202938]">{item.label}</span>
                    <span className="text-[#202938]">{item.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F2F4F7] overflow-hidden">
                    <div style={{ width: `${item.pct}%` }} className={`h-full rounded-full ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0]">
            <div className="text-xs font-bold text-[#202938] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#356AE6]" />
              Knowledge Base RAG Active
            </div>
            <p className="text-[11px] text-[#707B8B] mt-1 leading-relaxed">
              3 documents indexed in PostgreSQL. Average response generation latency: 380ms.
            </p>
          </div>
        </div>
      </div>

      {/* 4. UPCOMING APPOINTMENTS & FOLLOW-UP TASKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Confirmed Appointments */}
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E6EAF0]">
            <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#243B5A]" />
              Confirmed Doctor Appointments
            </h3>
            <Link href="/dashboard/appointments" className="text-xs font-semibold text-[#356AE6] hover:underline">
              View Calendar →
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-md bg-[#243B5A] text-white font-bold text-xs flex items-center justify-center">
                  11:00 AM
                </div>
                <div>
                  <div className="text-xs font-bold text-[#202938]">Rohan Deshmukh</div>
                  <div className="text-[11px] text-[#707B8B]">Dermatology Clinic • Dr. Ananya Patel</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#23865B] bg-[#23865B]/10 px-2 py-0.5 rounded-full border border-[#23865B]/20">
                CONFIRMED
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-md bg-[#356AE6] text-white font-bold text-xs flex items-center justify-center">
                  04:30 PM
                </div>
                <div>
                  <div className="text-xs font-bold text-[#202938]">Sunita Menon</div>
                  <div className="text-[11px] text-[#707B8B]">General Physician • Dr. Rajesh Sharma</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#23865B] bg-[#23865B]/10 px-2 py-0.5 rounded-full border border-[#23865B]/20">
                CONFIRMED
              </span>
            </div>
          </div>
        </div>

        {/* Operational Tasks & Follow-ups */}
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E6EAF0]">
            <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B98535]" />
              Pending Follow-ups & Action Items
            </h3>
            <Link href="/dashboard/tasks" className="text-xs font-semibold text-[#356AE6] hover:underline">
              All Tasks →
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#202938]">Confirm tomorrow acne consultation with Rohan</div>
                <div className="text-[11px] text-[#707B8B]">Assigned: Reception Team</div>
              </div>
              <span className="text-[10px] font-bold text-[#B98535] bg-[#B98535]/10 px-2 py-0.5 rounded-full border border-[#B98535]/20">
                HIGH PRIORITY
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#202938]">Send UPI invoice receipt to Sunita Menon</div>
                <div className="text-[11px] text-[#707B8B]">Assigned: Dr. Rajesh Sharma</div>
              </div>
              <span className="text-[10px] font-bold text-[#356AE6] bg-[#356AE6]/10 px-2 py-0.5 rounded-full border border-[#356AE6]/20">
                IN PROGRESS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
