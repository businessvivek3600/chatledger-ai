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
import { useLanguage } from '../../../i18n/LanguageContext';

export default function WhatsAppCampaignsPage() {
  const { t } = useLanguage();
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
            {t('campaigns.title', 'WhatsApp Broadcast Campaigns')}
          </h1>
          <p className="text-xs text-[#707B8B]">
            {t('campaigns.subtitle', 'Send Meta-approved template broadcasts to segmented leads, past patients, and customer groups.')}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-white" />
          {t('campaigns.newCampaign', 'New Campaign')}
        </button>
      </div>

      {/* Compliance Notice */}
      <div className="p-3.5 rounded-xl bg-white border border-[#E6EAF0] shadow-xs flex items-start gap-3 text-xs text-[#202938]">
        <ShieldCheck className="w-4 h-4 text-[#23865B] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#202938] font-bold block mb-0.5">
            {t('campaigns.complianceNoticeTitle', 'Meta WhatsApp Policy & Anti-Spam Compliance:')}
          </strong>
          <p className="text-[#707B8B] text-[11px] leading-relaxed">
            {t('campaigns.complianceNoticeDesc', "ChatLedger AI enforces pre-approved WhatsApp templates for all outbound broadcasts. Automatic opt-out triggers ('STOP' / 'UNSUBSCRIBE') are respected immediately.")}
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E6EAF0] p-12 text-center shadow-xs">
          <Megaphone className="w-8 h-8 text-[#98A2B3] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#202938]">{t('campaigns.title', 'No broadcast campaigns created yet')}</h3>
          <p className="text-xs text-[#707B8B] mt-1 max-w-sm mx-auto">
            Create your first compliant template broadcast to re-engage previous appointments or qualify leads.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-[#356AE6] hover:bg-[#2855b8] text-white font-semibold text-xs transition-colors"
          >
            {t('campaigns.newCampaign', 'New Campaign')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-xl border border-[#E6EAF0] p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      camp.status === CampaignStatus.COMPLETED
                        ? 'bg-[#23865B]/10 text-[#23865B]'
                        : camp.status === CampaignStatus.SENDING
                        ? 'bg-[#356AE6]/10 text-[#356AE6] animate-pulse'
                        : 'bg-[#707B8B]/10 text-[#707B8B]'
                    }`}
                  >
                    {camp.status}
                  </span>
                  <span className="text-[10px] text-[#98A2B3]">
                    {new Date(camp.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#202938] mb-1">{camp.name}</h3>
                <p className="text-xs text-[#707B8B] font-mono bg-[#F7F8FA] p-1.5 rounded border border-[#E6EAF0] mb-3 truncate">
                  Template: {camp.templateId}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-[#E6EAF0] mb-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#707B8B] block">{t('campaigns.sent', 'Sent')}</span>
                    <strong className="text-[#202938]">{camp.sentCount || 0}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#707B8B] block">{t('campaigns.delivered', 'Delivered')}</span>
                    <strong className="text-[#23865B]">{camp.deliveredCount || 0}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#707B8B] block">{t('campaigns.read', 'Read')}</span>
                    <strong className="text-[#356AE6]">{camp.readCount || 0}</strong>
                  </div>
                </div>
              </div>

              {camp.status === CampaignStatus.DRAFT && (
                <button
                  onClick={() => handleLaunch(camp.id)}
                  className="w-full py-2 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-white" />
                  {t('campaigns.launchBroadcast', 'Launch Broadcast')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Campaign */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-[#E6EAF0] max-w-md w-full p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF0]">
              <h2 className="text-sm font-bold text-[#202938]">
                {t('campaigns.createModalTitle', 'Create WhatsApp Campaign')}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#707B8B] hover:text-[#202938]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-lg bg-[#D64B50]/10 text-[#D64B50] text-xs font-semibold border border-[#D64B50]/20 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#202938] block mb-1">
                  {t('campaigns.campaignName', 'Campaign Name')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skin Consultation Follow-up Week 3"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938] block mb-1">
                  {t('campaigns.metaTemplate', 'Meta Approved Template')}
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6] bg-white"
                >
                  <option value="appointment_confirmation_v1">appointment_confirmation_v1 (UTILITY)</option>
                  <option value="seasonal_skin_checkup_promo">seasonal_skin_checkup_promo (MARKETING)</option>
                  <option value="doctor_followup_reminder">doctor_followup_reminder (UTILITY)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6EAF0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#E6EAF0] hover:bg-[#F7F8FA] text-[#707B8B] font-semibold text-xs"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs disabled:opacity-50"
                >
                  {isSubmitting ? t('common.creating', 'Creating...') : t('common.create', 'Create Campaign')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
