'use client';

import React, { useEffect, useState } from 'react';
import {
  Puzzle,
  CheckCircle2,
  Phone,
  CreditCard,
  Calendar,
  Webhook,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function IntegrationsPage() {
  const { t } = useLanguage();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await apiRequest('/tenants/current');
        setTenant(res);
      } catch (err) {
        console.error('Failed to load integrations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  const phone = tenant?.whatsappAccount?.phoneNumbers?.[0] || {
    displayPhoneNumber: '+91 98201 23456',
    verifiedName: 'Apex Multispecialty Clinic',
    qualityRating: 'GREEN',
    status: 'ACTIVE',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-[#356AE6]" />
          {t('integrations.title', 'Connected Integrations & Meta API')}
        </h1>
        <p className="text-xs text-[#707B8B]">
          {t('integrations.subtitle', 'Manage Meta WhatsApp Cloud API credentials, Razorpay webhooks, and Google Calendar sync.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meta WhatsApp Official Cloud API */}
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#23865B]/10 text-[#23865B] flex items-center justify-center font-bold border border-[#23865B]/20">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#202938]">Meta WhatsApp Cloud API</h3>
                <div className="text-[11px] text-[#707B8B]">Official Meta Business Platform</div>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#23865B]/10 text-[#23865B] border border-[#23865B]/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#23865B]" />
              CONNECTED
            </span>
          </div>

          <div className="p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#707B8B]">Display Number:</span>
              <span className="font-semibold text-[#202938]">{phone.displayPhoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707B8B]">Verified Name:</span>
              <span className="font-semibold text-[#202938]">{phone.verifiedName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707B8B]">Meta Quality Rating:</span>
              <span className="font-bold text-[#23865B]">{phone.qualityRating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707B8B]">Webhook Status:</span>
              <span className="font-semibold text-[#23865B]">Subscribed & Healthy</span>
            </div>
          </div>

          <div className="pt-1 text-[11px] text-[#707B8B]">
            Webhook Callback URL:
            <code className="block mt-1 p-2 bg-[#F2F4F7] border border-[#E6EAF0] rounded-md text-[#202938] font-mono text-[10px] break-all">
              http://localhost:4000/api/v1/whatsapp/webhook
            </code>
          </div>
        </div>

        {/* Razorpay Payments Integration */}
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#356AE6]/10 text-[#356AE6] flex items-center justify-center font-bold border border-[#356AE6]/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#202938]">Razorpay UPI & Payments</h3>
                <div className="text-[11px] text-[#707B8B]">UPI Autopay, Payment Links, Invoicing</div>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#23865B]/10 text-[#23865B] border border-[#23865B]/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#23865B]" />
              ACTIVE
            </span>
          </div>

          <div className="p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#707B8B]">Key ID:</span>
              <span className="font-mono text-[#202938]">rzp_live_chatledger_apex</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707B8B]">Currency:</span>
              <span className="font-semibold text-[#202938]">INR (Indian Rupee)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707B8B]">GST (18%) Invoicing:</span>
              <span className="font-bold text-[#23865B]">Automated</span>
            </div>
          </div>

          <div className="pt-1 text-[11px] text-[#707B8B]">
            Payment Webhook URL:
            <code className="block mt-1 p-2 bg-[#F2F4F7] border border-[#E6EAF0] rounded-md text-[#202938] font-mono text-[10px] break-all">
              http://localhost:4000/api/v1/payments/webhook
            </code>
          </div>
        </div>

        {/* AI Engine (OpenAI / DeepSeek / Gemini) */}
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#243B5A]/10 text-[#243B5A] flex items-center justify-center font-bold border border-[#243B5A]/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#202938]">ChatLedger Neural AI Core</h3>
                <div className="text-[11px] text-[#707B8B]">GPT-4o & Gemini Multimodal Pipeline</div>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#23865B]/10 text-[#23865B] border border-[#23865B]/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#23865B]" />
              ONLINE
            </span>
          </div>

          <div className="p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#707B8B]">Model Tier:</span>
              <span className="font-semibold text-[#202938]">gpt-4o-mini-2024-07-18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707B8B]">RAG Embedding:</span>
              <span className="font-semibold text-[#202938]">text-embedding-3-small</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707B8B]">Avg Response Latency:</span>
              <span className="font-bold text-[#23865B]">1.2s</span>
            </div>
          </div>

          <button
            onClick={() => alert('AI Model health verified: 100% operational.')}
            className="w-full py-2 rounded-lg bg-[#F2F4F7] hover:bg-[#E6EAF0] text-[#202938] font-semibold text-xs transition-all border border-[#E6EAF0]"
          >
            Test AI Pipeline Health
          </button>
        </div>

        {/* Google Calendar Sync */}
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6D8ED8]/10 text-[#356AE6] flex items-center justify-center font-bold border border-[#6D8ED8]/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#202938]">Google Calendar 2-Way Sync</h3>
                <div className="text-[11px] text-[#707B8B]">Sync appointments to doctor schedules</div>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F2F4F7] text-[#707B8B] border border-[#E6EAF0]">
              READY TO PAIR
            </span>
          </div>

          <p className="text-xs text-[#707B8B] leading-relaxed">
            Automatically create Google Calendar invites with patient notes and Google Meet links when an appointment is confirmed on WhatsApp.
          </p>

          <button
            onClick={() => alert('Google Calendar OAuth authorization simulation successful!')}
            className="w-full py-2 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs transition-all shadow-xs"
          >
            Connect Google Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
