'use client';

import React, { useEffect, useState } from 'react';
import {
  Send,
  Plus,
  CheckCircle2,
  Clock,
  Eye,
  AlertTriangle,
  Play,
  X,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { CampaignStatus } from '@nexaflow/shared-types';

export default function WhatsAppCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('appointment_confirmation_v1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await apiRequest<any[]>('/campaigns');
      if (Array.isArray(res)) {
        setCampaigns(res);
      }
    } catch (err) {
      console.error('Failed to load campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleLaunch = async (id: string) => {
    try {
      await apiRequest(`/campaigns/${id}/launch`, { method: 'POST' });
      fetchCampaigns();
    } catch (err: any) {
      alert(err.message || 'Failed to launch broadcast');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      await apiRequest('/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: campaignName,
          templateId: selectedTemplate,
        }),
      });

      setIsModalOpen(false);
      setCampaignName('');
      fetchCampaigns();
    } catch (err: any) {
      setFormError(err.message || 'Error creating campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#356AE6]" />
            WhatsApp Broadcast Campaigns
          </h1>
          <p className="text-xs text-[#707B8B]">
            Send Meta-approved template broadcasts to segmented leads, past patients, and customer groups.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-white" />
          New Campaign
        </button>
      </div>

      {/* Compliance Notice */}
      <div className="p-3.5 rounded-xl bg-white border border-[#E6EAF0] shadow-xs flex items-start gap-3 text-xs text-[#202938]">
        <ShieldCheck className="w-4 h-4 text-[#23865B] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#202938] font-bold block mb-0.5">
            Meta WhatsApp Policy & Anti-Spam Compliance:
          </strong>
          <p className="text-[#707B8B] text-[11px] leading-relaxed">
            ChatLedger AI enforces pre-approved WhatsApp templates for all outbound broadcasts. Automatic opt-out triggers ('STOP' / 'UNSUBSCRIBE') are respected immediately.
          </p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-white rounded-xl border border-[#E6EAF0] text-xs text-[#98A2B3]">
            No broadcast campaigns created yet.
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xs font-bold text-[#202938] leading-tight">
                    {camp.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      camp.status === CampaignStatus.COMPLETED
                        ? 'bg-[#23865B]/10 text-[#23865B] border-[#23865B]/20'
                        : 'bg-[#B98535]/10 text-[#B98535] border-[#B98535]/20'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#707B8B] space-y-1">
                  <div>Template: <strong className="text-[#202938]">{camp.templateId || 'General Broadcast'}</strong></div>
                  <div>Target Audience: <strong>{camp.totalRecipients || 45} opted-in contacts</strong></div>
                </div>
              </div>

              {camp.status === CampaignStatus.COMPLETED ? (
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E6EAF0] text-center text-xs">
                  <div className="bg-[#F7F8FA] p-2 rounded-lg border border-[#E6EAF0]">
                    <span className="text-[10px] text-[#707B8B] block font-medium">Sent</span>
                    <strong className="text-[#202938] font-bold">{camp.sentCount}</strong>
                  </div>
                  <div className="bg-[#F7F8FA] p-2 rounded-lg border border-[#E6EAF0]">
                    <span className="text-[10px] text-[#707B8B] block font-medium">Delivered</span>
                    <strong className="text-[#356AE6] font-bold">{camp.deliveredCount}</strong>
                  </div>
                  <div className="bg-[#F7F8FA] p-2 rounded-lg border border-[#E6EAF0]">
                    <span className="text-[10px] text-[#707B8B] block font-medium">Read</span>
                    <strong className="text-[#23865B] font-bold">{camp.readCount}</strong>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleLaunch(camp.id)}
                  className="w-full py-2 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Launch WhatsApp Broadcast
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: New Campaign */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#202938]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-lg border border-[#E6EAF0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0]">
              <h3 className="text-sm font-bold text-[#202938]">Create WhatsApp Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#98A2B3] hover:text-[#202938]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-3 p-2.5 rounded-lg bg-[#D64B50]/10 border border-[#D64B50]/20 text-xs text-[#D64B50] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#D64B50]" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#202938]">Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Dermatology Consultation Announcement"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Meta Approved Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] bg-white focus:outline-none focus:border-[#356AE6]"
                >
                  <option value="appointment_confirmation_v1">appointment_confirmation_v1 (UTILITY)</option>
                  <option value="payment_receipt_notice">payment_receipt_notice (UTILITY)</option>
                  <option value="seasonal_wellness_reminder">seasonal_wellness_reminder (MARKETING)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E6EAF0] text-xs font-semibold text-[#707B8B] hover:bg-[#F2F4F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs hover:bg-[#1a2d45] transition-all disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
