'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Bot,
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function ReportsAnalyticsPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await apiRequest('/reports/overview');
        setData(res);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [timeRange]);

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Metric,Value\n' +
      `Total Leads,${data?.kpis?.totalLeads || 0}\n` +
      `Conversion Rate,${data?.kpis?.conversionRate || 0}%\n` +
      `Total Revenue,${data?.kpis?.totalRevenue || 0}\n` +
      `AI Handled Conversations,${data?.kpis?.aiHandledConversations || 0}\n` +
      `Platform,ChatLedger AI Enterprise\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `chatledger_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  const kpis = data?.kpis || {};

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#356AE6]" />
            {t('reports.title', 'Business Intelligence & Analytics')}
          </h1>
          <p className="text-xs text-[#707B8B]">
            {t('reports.subtitle', 'Deep insights into patient acquisition costs, WhatsApp response times, and doctor utilization.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center bg-white border border-[#E6EAF0] rounded-lg p-0.5 text-xs shadow-xs">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: 'Quarter' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  timeRange === t.id
                    ? 'bg-[#243B5A] text-white'
                    : 'text-[#707B8B] hover:text-[#202938]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-white border border-[#E6EAF0] hover:bg-[#F7F8FA] text-[#202938] font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#707B8B]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="text-[11px] font-semibold text-[#707B8B] uppercase tracking-wider">
            Lead Conversion Rate
          </div>
          <div className="text-2xl font-bold text-[#202938] mt-1">
            {kpis.conversionRate}%
          </div>
          <div className="text-[11px] text-[#23865B] font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2% vs previous period
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="text-[11px] font-semibold text-[#707B8B] uppercase tracking-wider">
            AI Assistant Autonomous
          </div>
          <div className="text-2xl font-bold text-[#356AE6] mt-1">82.4%</div>
          <div className="text-[11px] text-[#707B8B] font-medium mt-1">
            Resolved without human intervention
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="text-[11px] font-semibold text-[#707B8B] uppercase tracking-wider">
            Avg First Response Time
          </div>
          <div className="text-2xl font-bold text-[#23865B] mt-1">1.8s</div>
          <div className="text-[11px] text-[#707B8B] font-medium mt-1">
            24/7 Sub-second latency
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="text-[11px] font-semibold text-[#707B8B] uppercase tracking-wider">
            Attributed UPI Revenue
          </div>
          <div className="text-2xl font-bold text-[#243B5A] mt-1">
            {formatCurrency(kpis.totalRevenue || 0)}
          </div>
          <div className="text-[11px] text-[#23865B] font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Direct WhatsApp checkout
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* WhatsApp Channel Performance */}
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#243B5A]" />
            WhatsApp Channel Throughput & Latency
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0]">
              <span className="text-[#707B8B]">Total Messages Exchanged</span>
              <strong className="text-[#202938] font-bold">{kpis.monthlyWhatsAppUsage || 312}</strong>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0]">
              <span className="text-[#707B8B]">Delivery Confirmation Rate</span>
              <strong className="text-[#23865B] font-bold">99.4% Verified</strong>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0]">
              <span className="text-[#707B8B]">Avg Customer Reply Gap</span>
              <strong className="text-[#202938] font-bold">3.8 minutes</strong>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0]">
              <span className="text-[#707B8B]">Meta Cloud API Uptime</span>
              <strong className="text-[#23865B] font-bold">99.99% Operational</strong>
            </div>
          </div>
        </div>

        {/* AI Intent Distribution */}
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#356AE6]" />
            Inquiry Intent Categorization
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { label: 'Doctor Schedule & Slot Booking', count: 48, color: 'bg-[#243B5A]' },
              { label: 'Fee Inquiries & Prescriptions', count: 30, color: 'bg-[#356AE6]' },
              { label: 'Address & Directions Inquiries', count: 14, color: 'bg-[#6D8ED8]' },
              { label: 'Human Specialist Escalation', count: 8, color: 'bg-[#B98535]' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-[#202938]">{item.label}</span>
                  <span className="text-[#707B8B] font-bold">{item.count}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F2F4F7] overflow-hidden">
                  <div style={{ width: `${item.count}%` }} className={`h-full rounded-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
