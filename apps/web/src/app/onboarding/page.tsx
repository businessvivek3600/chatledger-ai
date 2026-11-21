'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Sparkles,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Bot,
  Layers,
  MapPin,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuthStore } from '../../lib/auth-store';
import { IndustryType } from '@nexaflow/shared-types';
import ChatLedgerLogo from '../../components/ChatLedgerLogo';

export default function OnboardingWizard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState(user?.businessName || 'My Business');
  const [industry, setIndustry] = useState<IndustryType>(IndustryType.CLINIC);
  const [address, setAddress] = useState('Suite 402, Lotus Grandeur, Andheri West');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400053');
  const [gstin, setGstin] = useState('27AABCA1234M1Z5');

  // AI State
  const [assistantName, setAssistantName] = useState('ChatLedger AI Assistant');
  const [businessIntro, setBusinessIntro] = useState(
    'Welcome! We provide premium healthcare consultations, treatments, and diagnostics.',
  );

  // Meta WhatsApp Status
  const [metaConnected, setMetaConnected] = useState(false);

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      await apiRequest('/tenants/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          name: businessName,
          industry,
          address,
          city,
          state,
          pincode,
          gstin,
          assistantName,
          businessIntro,
        }),
      });

      router.push('/dashboard');
    } catch (err) {
      alert('Failed to save onboarding settings. Continuing to dashboard.');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center font-sans text-[#202938]">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <ChatLedgerLogo size="lg" subtitle="Workspace Initialization" />
          </div>
          <h1 className="text-xl font-bold text-[#202938]">
            Configure Your Business Workspace
          </h1>
          <p className="text-xs text-[#707B8B] mt-1">
            Step {step} of 4 — Initializing WhatsApp automation & UPI ledger for {businessName}
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? 'w-8 bg-[#356AE6]' : step > s ? 'w-4 bg-[#23865B]' : 'w-4 bg-[#E6EAF0]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Box */}
        <div className="bg-white rounded-xl p-6 border border-[#E6EAF0] shadow-xs">
          {/* STEP 1: Business Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E6EAF0]">
                <div className="w-9 h-9 rounded-lg bg-[#F2F4F7] text-[#243B5A] flex items-center justify-center border border-[#E6EAF0]">
                  <Building2 className="w-4 h-4 text-[#356AE6]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#202938]">Business Profile & Location</h3>
                  <div className="text-[11px] text-[#707B8B]">Used for WhatsApp headers, address cards, and GST invoices</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[#202938]">Business / Clinic Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202938]">Industry Preset</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as IndustryType)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] bg-white focus:outline-none focus:border-[#356AE6]"
                  >
                    <option value={IndustryType.CLINIC}>Clinics & Healthcare</option>
                    <option value={IndustryType.SALON}>Salons & Beauty</option>
                    <option value={IndustryType.COACHING}>Coaching & Education</option>
                    <option value={IndustryType.REAL_ESTATE}>Real Estate</option>
                    <option value={IndustryType.RETAIL}>Retail & Trade</option>
                    <option value={IndustryType.CONSULTING}>Consulting</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#202938]">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202938]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202938]">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202938]">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202938]">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs hover:bg-[#1a2d45] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  Next: WhatsApp Cloud API <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Meta WhatsApp Connection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E6EAF0]">
                <div className="w-9 h-9 rounded-lg bg-[#23865B]/10 text-[#23865B] flex items-center justify-center border border-[#23865B]/20">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#202938]">Meta WhatsApp Business Cloud API</h3>
                  <div className="text-[11px] text-[#707B8B]">Connect your official WhatsApp Business Account (WABA)</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#23865B] animate-pulse"></span>
                    <span className="text-xs font-bold text-[#202938]">
                      Official Meta Embedded Signup & Webhook Adapter
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#23865B]/10 text-[#23865B] px-2 py-0.5 rounded border border-[#23865B]/20 font-semibold">
                    Cloud API v19.0
                  </span>
                </div>
                <p className="text-xs text-[#707B8B] leading-relaxed">
                  ChatLedger AI connects to Meta Cloud API to route messages, send automated appointment slots, and issue UPI invoice links.
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setMetaConnected(true)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-xs ${
                      metaConnected
                        ? 'bg-[#23865B] text-white'
                        : 'bg-[#243B5A] hover:bg-[#1a2d45] text-white'
                    }`}
                  >
                    {metaConnected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        Meta WABA Connected (+91 98201 23456)
                      </>
                    ) : (
                      <>
                        <Phone className="w-3.5 h-3.5" />
                        Connect Meta WhatsApp Account
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg border border-[#E6EAF0] text-xs font-semibold text-[#707B8B] hover:bg-[#F2F4F7]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs hover:bg-[#1a2d45] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  Next: AI Assistant Personality <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AI Configuration */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E6EAF0]">
                <div className="w-9 h-9 rounded-lg bg-[#356AE6]/10 text-[#356AE6] flex items-center justify-center border border-[#356AE6]/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#202938]">AI Assistant Personality & Prompting</h3>
                  <div className="text-[11px] text-[#707B8B]">Customize how the AI responds to customers on WhatsApp</div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#202938]">Assistant Public Persona Name</label>
                  <input
                    type="text"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202938]">Welcome Greeting & Introduction</label>
                  <textarea
                    rows={3}
                    value={businessIntro}
                    onChange={(e) => setBusinessIntro(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg border border-[#E6EAF0] text-xs font-semibold text-[#707B8B] hover:bg-[#F2F4F7]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs hover:bg-[#1a2d45] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  Next: Review & Launch <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Launch */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E6EAF0]">
                <div className="w-9 h-9 rounded-lg bg-[#23865B]/10 text-[#23865B] flex items-center justify-center border border-[#23865B]/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#202938]">Ready to Launch Workspace</h3>
                  <div className="text-[11px] text-[#707B8B]">Your WhatsApp AI assistant is configured and primed</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#707B8B]">Business:</span>
                  <strong className="text-[#202938]">{businessName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707B8B]">Industry:</span>
                  <strong className="text-[#202938]">{industry}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707B8B]">AI Agent:</span>
                  <strong className="text-[#356AE6]">{assistantName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707B8B]">Location:</span>
                  <strong className="text-[#202938]">{city}, {state}</strong>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-lg border border-[#E6EAF0] text-xs font-semibold text-[#707B8B] hover:bg-[#F2F4F7]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCompleteOnboarding}
                  className="px-6 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs hover:bg-[#1a2d45] transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {loading ? 'Initializing...' : 'Launch ChatLedger Dashboard'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
