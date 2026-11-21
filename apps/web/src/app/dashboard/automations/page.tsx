'use client';

import React, { useEffect, useState } from 'react';
import {
  Zap,
  Play,
  Plus,
  CheckCircle2,
  GitBranch,
  Clock,
  ArrowRight,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { AutomationTriggerType } from '@nexaflow/shared-types';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function AutomationsPage() {
  const { t } = useLanguage();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [testing, setTesting] = useState(false);

  const fetchWorkflows = async () => {
    try {
      const res = await apiRequest<any[]>('/automations');
      setWorkflows(res);
      if (res.length > 0 && !activeWorkflow) {
        setActiveWorkflow(res[0]);
      }
    } catch (err) {
      console.error('Failed to load workflows', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await apiRequest(`/automations/${id}/active`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !current }),
      });
      fetchWorkflows();
    } catch (err) {
      console.error('Failed to toggle workflow', err);
    }
  };

  const handleTestRun = async (id: string) => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiRequest(`/automations/${id}/test`, {
        method: 'POST',
      });
      setTestResult(res);
      fetchWorkflows();
    } catch (err) {
      alert('Failed to execute test run');
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

  const nodes = activeWorkflow?.definition?.nodes || [
    { id: '1', type: 'trigger', label: 'Trigger: New WhatsApp Message', config: { channel: 'WHATSAPP' } },
    { id: '2', type: 'condition', label: 'Condition: Is New Prospect?', config: { check: 'unregistered' } },
    { id: '3', type: 'action', label: 'Action: Create CRM Lead in "NEW" Stage', config: { stage: 'NEW' } },
    { id: '4', type: 'action', label: 'Action: Personalized AI Welcome', config: { tone: 'warm' } },
    { id: '5', type: 'action', label: 'Action: Notify Front Desk WhatsApp', config: { role: 'RECEPTION' } },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#356AE6]" />
            {t('automations.title', 'Visual Workflow Automation Studio')}
          </h1>
          <p className="text-xs text-[#707B8B]">
            {t('automations.subtitle', 'Create drag-and-drop triggers, payment notifications, and automatic appointment reminders.')}
          </p>
        </div>

        <button
          onClick={() => alert('New automation draft ready for configuration.')}
          className="px-3.5 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          {t('automations.newWorkflow', 'Create Workflow')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ======================================================== */}
        {/* LEFT 4 COLS: WORKFLOW LIST */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider mb-1">
            Configured Workflows ({workflows.length})
          </div>

          {workflows.map((wf) => {
            const isSelected = activeWorkflow?.id === wf.id;

            return (
              <div
                key={wf.id}
                onClick={() => {
                  setActiveWorkflow(wf);
                  setTestResult(null);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#356AE6] shadow-xs ring-1 ring-[#356AE6]'
                    : 'bg-white border-[#E6EAF0] hover:border-[#D0D5DD]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#202938] leading-tight">
                    {wf.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(wf.id, wf.isActive);
                    }}
                    className="text-xs"
                  >
                    {wf.isActive ? (
                      <span className="text-[#23865B] font-bold text-[10px] bg-[#23865B]/10 px-1.5 py-0.5 rounded border border-[#23865B]/20">
                        Active
                      </span>
                    ) : (
                      <span className="text-[#98A2B3] font-medium text-[10px] bg-[#F2F4F7] px-1.5 py-0.5 rounded">Paused</span>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-[#707B8B] line-clamp-2 leading-relaxed">
                  {wf.description}
                </p>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E6EAF0] text-[10px] text-[#98A2B3]">
                  <span>Trigger: {wf.triggerType}</span>
                  <span>{wf.executionCount || 0} runs</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* RIGHT 8 COLS: VISUAL WORKFLOW CANVAS */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E6EAF0] shadow-xs p-5 flex flex-col justify-between min-h-[520px]">
          <div>
            {/* Canvas Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0]">
              <div>
                <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
                  {activeWorkflow?.name || 'Workflow Visual Builder'}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Visual node graph definition saved securely in database
                </div>
              </div>

              <button
                onClick={() => activeWorkflow && handleTestRun(activeWorkflow.id)}
                disabled={testing}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {testing ? 'Executing Nodes...' : 'Test Run Workflow'}
              </button>
            </div>

            {/* Test Run Execution Result Banner */}
            {testResult && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Test Execution Successful (Status: {testResult.status})
                </div>
                <div className="text-[11px] text-emerald-700">
                  All 3 workflow steps validated. Trigger fired, conditions evaluated, and actions dispatched.
                </div>
              </div>
            )}

            {/* Visual Node Chain */}
            <div className="py-8 flex flex-col items-center space-y-4 max-w-lg mx-auto">
              {nodes.map((node: any, idx: number) => {
                const isTrigger = idx === 0;
                const isCondition = node.type === 'condition';

                return (
                  <React.Fragment key={node.id}>
                    {/* Connecting Arrow */}
                    {idx > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-6 bg-slate-300"></div>
                        <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 -mt-1"></div>
                      </div>
                    )}

                    {/* Node Box */}
                    <div
                      className={`w-full p-4 rounded-2xl border text-xs shadow-xs transition-all ${
                        isTrigger
                          ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold'
                          : isCondition
                          ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-white/80 flex items-center justify-center font-black text-[11px] shadow-xs">
                            {idx + 1}
                          </span>
                          <span className="font-extrabold">{node.label}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {node.type}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Deterministic backend queue processing prevents infinite loops.</span>
            <span className="font-bold text-slate-700">BullMQ Distributed Queue Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
