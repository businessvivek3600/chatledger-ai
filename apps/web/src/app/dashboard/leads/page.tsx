'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Calendar,
  Building2,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';
import { LeadStage, LeadPriority } from '@nexaflow/shared-types';

export default function LeadsCrmPage() {
  const [kanbanData, setKanbanData] = useState<any>(null);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newStage, setNewStage] = useState<LeadStage>(LeadStage.NEW);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeads = async () => {
    try {
      const [kanban, list] = await Promise.all([
        apiRequest('/leads/kanban'),
        apiRequest<any[]>(`/leads${searchQuery ? `?search=${searchQuery}` : ''}`),
      ]);
      setKanbanData(kanban);
      setLeadsList(list);
    } catch (err) {
      console.error('Failed to load leads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchQuery]);

  const handleStageChange = async (leadId: string, nextStage: LeadStage) => {
    try {
      await apiRequest(`/leads/${leadId}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage: nextStage }),
      });
      fetchLeads();
    } catch (err) {
      console.error('Failed to update stage', err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify({
          name: newName,
          phone: newPhone,
          email: newEmail,
          budget: newBudget,
          requirements: newRequirements,
          stage: newStage,
        }),
      });

      setIsAddModalOpen(false);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewBudget('');
      setNewRequirements('');
      fetchLeads();
    } catch (err: any) {
      alert(`Error creating lead: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const STAGES = [
    { key: LeadStage.NEW, label: 'New', color: 'border-slate-300' },
    { key: LeadStage.CONTACTED, label: 'Contacted', color: 'border-blue-400' },
    { key: LeadStage.QUALIFIED, label: 'Qualified', color: 'border-sky-500' },
    { key: LeadStage.INTERESTED, label: 'Interested', color: 'border-purple-500' },
    { key: LeadStage.PROPOSAL_SENT, label: 'Proposal Sent', color: 'border-amber-500' },
    { key: LeadStage.NEGOTIATION, label: 'Negotiation', color: 'border-orange-500' },
    { key: LeadStage.CONVERTED, label: 'Converted', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#356AE6]" />
            Leads Pipeline & CRM
          </h1>
          <p className="text-xs text-[#707B8B]">
            Automated qualification, pipeline Kanban, and AI lead scoring for WhatsApp inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-[#F7F8FA] border border-[#E6EAF0] p-0.5 rounded-lg flex items-center text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#202938] shadow-xs'
                  : 'text-[#707B8B] hover:text-[#202938]'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#202938] shadow-xs'
                  : 'text-[#707B8B] hover:text-[#202938]'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by lead name, phone, or clinical requirement..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E6EAF0] bg-white shadow-xs focus:outline-none focus:border-[#356AE6]"
        />
      </div>

      {/* ======================================================== */}
      {/* KANBAN BOARD VIEW */}
      {/* ======================================================== */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-[1200px]">
            {STAGES.map((col) => {
              const leads = kanbanData?.columns?.[col.key] || [];

              return (
                <div
                  key={col.key}
                  className="w-64 bg-[#F7F8FA] rounded-xl p-3 border border-[#E6EAF0] flex flex-col flex-shrink-0"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6EAF0]">
                    <span className="text-xs font-bold text-[#202938]">{col.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-[#707B8B] border border-[#E6EAF0]">
                      {leads.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-20rem)] pr-0.5">
                    {leads.length === 0 ? (
                      <div className="text-center py-8 text-[11px] text-[#98A2B3]">
                        No leads in stage
                      </div>
                    ) : (
                      leads.map((lead: any) => (
                        <div
                          key={lead.id}
                          className="bg-white p-3 rounded-lg border border-[#E6EAF0] shadow-xs space-y-2 hover:border-[#356AE6] transition-all"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-xs font-bold text-[#202938] leading-tight">
                              {lead.name}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F2F4F7] text-[#707B8B] uppercase">
                              {lead.priority}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#707B8B] flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-[#98A2B3]" />
                            {lead.phone}
                          </div>

                          {lead.requirements && (
                            <div className="text-[11px] text-[#202938] line-clamp-2 leading-relaxed bg-[#F7F8FA] p-1.5 rounded-md border border-[#E6EAF0]">
                              {lead.requirements}
                            </div>
                          )}

                          {lead.budget && (
                            <div className="text-[11px] font-bold text-[#23865B]">
                              Budget: {formatCurrency(lead.budget)}
                            </div>
                          )}

                          {/* Quick Advance Button */}
                          <div className="pt-1.5 border-t border-[#E6EAF0] flex items-center justify-between text-[10px]">
                            <span className="text-[#98A2B3]">
                              {lead.source}
                            </span>
                            <select
                              value={lead.stage}
                              onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                              className="text-[10px] font-semibold text-[#356AE6] bg-[#356AE6]/10 border border-[#356AE6]/20 rounded px-1.5 py-0.5"
                            >
                              {STAGES.map((s) => (
                                <option key={s.key} value={s.key}>
                                  → {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* TABLE LIST VIEW */
        /* ======================================================== */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Lead Name</th>
                <th className="p-3.5">Phone / Contact</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">Budget</th>
                <th className="p-3.5">Assigned Agent</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leadsList.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{lead.name}</td>
                  <td className="p-3.5 text-slate-600">{lead.phone}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-700">
                    {lead.budget ? formatCurrency(lead.budget) : '—'}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {lead.assignedUser?.fullName || 'Unassigned'}
                  </td>
                  <td className="p-3.5 text-slate-500">{lead.source}</td>
                  <td className="p-3.5 text-right">
                    <select
                      value={lead.stage}
                      onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                      className="text-xs rounded border border-slate-300 py-1 px-2"
                    >
                      {STAGES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW CRM LEAD */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add New CRM Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Phone Number * (WhatsApp)</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98200 11223"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Initial Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as LeadStage)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Requirements & Inquiry Notes</label>
                <textarea
                  rows={2}
                  placeholder="Patient asked for specialized pediatric consultation quote..."
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
