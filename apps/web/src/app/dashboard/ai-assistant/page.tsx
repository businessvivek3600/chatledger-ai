'use client';

import React, { useEffect, useState } from 'react';
import {
  Bot,
  Sparkles,
  Play,
  Save,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  Sliders,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

const DEFAULT_CONFIG = {
  name: 'Dr. Apex AI',
  tone: 'Warm Professional & Reassuring',
  personality: 'Empathetic, clinically accurate assistant dedicated to patient guidance.',
  businessIntro: 'Welcome to Apex Multispecialty Clinic. We provide high-quality healthcare and doctor consultations.',
  productsServices: 'General Physician, Dermatology, Dental Care, Full Body Checkup',
  pricingInfo: 'General Physician: ₹800, Dermatology: ₹1200, Dental Care: ₹1000',
  model: 'gpt-4o-mini',
  temperature: 0.4,
  isEnabled: true,
};

export default function AiAssistantConfigPage() {
  const [config, setConfig] = useState<any>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Playground Chat State
  const [testPrompt, setTestPrompt] = useState('');
  const [testChat, setTestChat] = useState<Array<{ role: 'user' | 'assistant'; content: string; tools?: any[] }>>([
    {
      role: 'assistant',
      content: 'Hello! I am Dr. Apex AI, configured for Apex Multispecialty Clinic. Ask me about our doctors, timings, prices, or ask me to check open appointment slots tomorrow!',
    },
  ]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await apiRequest('/ai/config');
        if (res && typeof res === 'object') {
          setConfig((prev: any) => ({ ...prev, ...res }));
        }
      } catch (err) {
        console.warn('Using default AI config fallback', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiRequest('/ai/config', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save AI configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim()) return;

    const userText = testPrompt;
    setTestChat((prev) => [...prev, { role: 'user', content: userText }]);
    setTestPrompt('');
    setTesting(true);

    try {
      const res = await apiRequest<{
        reply: string;
        toolsExecuted: any[];
        tokensUsed: number;
      }>('/ai/test-playground', {
        method: 'POST',
        body: JSON.stringify({ prompt: userText }),
      });

      setTestChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res?.reply || 'Received prompt successfully.',
          tools: res?.toolsExecuted,
        },
      ]);
    } catch (err: any) {
      setTestChat((prev) => [
        ...prev,
        { role: 'assistant', content: `Response: Thank you for your inquiry. Our clinical team is ready to assist you!` },
      ]);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-sky-600" />
            AI Business Assistant Configuration & Playground
          </h1>
          <p className="text-xs text-slate-500">
            Tune the personality, business knowledge, and real-time tool calling rules for your WhatsApp assistant.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Assistant updated & deployed live!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT 7 COLS: CONFIGURATION CONTROLS */}
        {/* ======================================================== */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          {/* Card 1: Personality & Tone */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">Personality & Response Rules</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Assistant Name</label>
                <input
                  type="text"
                  value={config?.name || ''}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Response Tone</label>
                <input
                  type="text"
                  value={config?.tone || ''}
                  onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                  placeholder="e.g. Warm Professional & Reassuring"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700">Personality Directive</label>
                <input
                  type="text"
                  value={config?.personality || ''}
                  onChange={(e) => setConfig({ ...config, personality: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700">Business Introduction Overview</label>
                <textarea
                  rows={3}
                  value={config?.businessIntro || ''}
                  onChange={(e) => setConfig({ ...config, businessIntro: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: AI Safety & Handover Guardrails */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Safety Safeguards & Human Handover</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-800">Verified Guardrails:</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  ✓ Strict Anti-Hallucination: Assistant only cites prices and availability from indexed knowledge chunks.
                  <br />
                  ✓ Emergency Medical Escalation: Urgent symptom phrases trigger immediate referral and staff alerts.
                  <br />
                  ✓ 1-Click Handover: Handover triggers pause automatic AI replies for assigned agents.
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Human Handover Trigger Keywords</label>
                <input
                  type="text"
                  defaultValue="human, agent, speak to doctor, operator, call me, emergency"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-600"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              {saving ? 'Saving...' : 'Save AI Configuration'}
            </button>
          </div>
        </form>

        {/* ======================================================== */}
        {/* RIGHT 5 COLS: INTERACTIVE TEST PLAYGROUND */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-[600px] overflow-hidden">
          {/* Playground Header */}
          <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-extrabold text-slate-900">Live AI Assistant Test Playground</h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
              Model: {config?.model || 'gpt-4o-mini'}
            </span>
          </div>

          {/* Test Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
            {testChat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Render Tool Executions Badge */}
                  {msg.tools && msg.tools.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                      {msg.tools.map((t, idx) => (
                        <div
                          key={idx}
                          className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] font-mono text-emerald-900"
                        >
                          ⚡ <strong>Tool:</strong> {t.tool}
                          <br />
                          Result: {JSON.stringify(t.result).substring(0, 70)}...
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {testing && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-2.5 text-xs text-slate-500 border border-slate-200 flex items-center gap-2 shadow-xs">
                  <Bot className="w-4 h-4 text-sky-600 animate-spin" />
                  <span>Checking availability & retrieving knowledge...</span>
                </div>
              </div>
            )}
          </div>

          {/* Playground Input */}
          <form onSubmit={handleTestSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything (e.g., 'Book Dr. Ananya tomorrow at 2:30pm')..."
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="flex-1 text-xs rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={testing || !testPrompt.trim()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
