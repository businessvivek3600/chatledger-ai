'use client';

import React, { useEffect, useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';
import { SubscriptionPlanTier } from '@nexaflow/shared-types';

export default function BillingPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSub, setCurrentSub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [plns, sub] = await Promise.all([
        apiRequest<any[]>('/payments/plans'),
        apiRequest<any>('/payments/subscription'),
      ]);
      setPlans(plns);
      setCurrentSub(sub);
    } catch (err) {
      console.error('Failed to load billing plans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpgrade = async (tier: SubscriptionPlanTier) => {
    setUpgradingTier(tier);
    try {
      await apiRequest('/payments/subscription/upgrade', {
        method: 'POST',
        body: JSON.stringify({ tier }),
      });
      await fetchData();
      alert(`Subscription successfully updated to ${tier}!`);
    } catch (err) {
      alert('Failed to update subscription tier');
    } finally {
      setUpgradingTier(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const activeTier = currentSub?.plan?.tier || SubscriptionPlanTier.GROWTH;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[#356AE6]" />
          SaaS Subscription & Billing Management
        </h1>
        <p className="text-xs text-[#707B8B]">
          Manage your ChatLedger AI plan tier, usage quotas, team seat allocations, and renewal cycles.
        </p>
      </div>

      {/* Current Active Plan Banner */}
      <div className="bg-white text-[#202938] rounded-xl p-5 border border-[#E6EAF0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#23865B] uppercase tracking-wider bg-[#23865B]/10 px-2 py-0.5 rounded border border-[#23865B]/20">
            Current Active Plan
          </span>
          <h2 className="text-xl font-bold mt-1 text-[#202938]">
            {currentSub?.plan?.name || 'Growth Plan'}
          </h2>
          <p className="text-xs text-[#707B8B] mt-0.5">
            Status: <strong className="text-[#23865B] uppercase">{currentSub?.status || 'ACTIVE'}</strong> • Next renewal on{' '}
            {currentSub?.currentPeriodEnd
              ? new Date(currentSub.currentPeriodEnd).toLocaleDateString()
              : 'Dec 21, 2026'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-[#202938]">
            {formatCurrency(currentSub?.plan?.priceMonthly || 4999)}
            <span className="text-xs text-[#707B8B] font-normal">/mo</span>
          </span>
        </div>
      </div>

      {/* Usage Quotas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E6EAF0] shadow-xs">
          <span className="text-[10px] text-[#707B8B] font-bold uppercase">WhatsApp Numbers</span>
          <div className="text-lg font-bold text-[#202938] mt-1">1 / 2</div>
          <div className="w-full h-1.5 rounded-full bg-[#F2F4F7] mt-2 overflow-hidden">
            <div className="w-1/2 h-full bg-[#356AE6] rounded-full" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E6EAF0] shadow-xs">
          <span className="text-[10px] text-[#707B8B] font-bold uppercase">Team Members</span>
          <div className="text-lg font-bold text-[#202938] mt-1">3 / 15</div>
          <div className="w-full h-1.5 rounded-full bg-[#F2F4F7] mt-2 overflow-hidden">
            <div className="w-1/5 h-full bg-[#23865B] rounded-full" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E6EAF0] shadow-xs">
          <span className="text-[10px] text-[#707B8B] font-bold uppercase">AI Conversations</span>
          <div className="text-lg font-bold text-[#202938] mt-1">312 / 10,000</div>
          <div className="w-full h-1.5 rounded-full bg-[#F2F4F7] mt-2 overflow-hidden">
            <div className="w-1/12 h-full bg-[#4F46E5] rounded-full" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E6EAF0] shadow-xs">
          <span className="text-[10px] text-[#707B8B] font-bold uppercase">Automations</span>
          <div className="text-lg font-bold text-[#202938] mt-1">1 / 25</div>
          <div className="w-full h-1.5 rounded-full bg-[#F2F4F7] mt-2 overflow-hidden">
            <div className="w-1/20 h-full bg-[#B98535] rounded-full" />
          </div>
        </div>
      </div>

      {/* All Available Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p) => {
          const isCurrent = p.tier === activeTier;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-2 border-sky-600 shadow-xl'
                  : 'border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                      CURRENT PLAN
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    {formatCurrency(p.priceMonthly)}
                  </span>
                  <span className="text-xs text-slate-500">/mo</span>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  {(p.features as string[])?.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs"
                  >
                    Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(p.tier)}
                    disabled={upgradingTier === p.tier}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    {upgradingTier === p.tier ? 'Upgrading...' : `Switch to ${p.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
