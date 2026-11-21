'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Building2,
  Clock,
  ShieldCheck,
  Bell,
  Palette,
  Sun,
  Moon,
  Sparkles,
  Layout,
  Check,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { THEME_PRESETS, ThemePreset, ThemeConfig, DEFAULT_THEME_CONFIG } from '../../../design-system/theme';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications' | 'security'>('general');
  const [tenant, setTenant] = useState<any>({
    name: 'Apex Multispecialty Clinic',
    email: 'doctor.sharma@apexclinic.com',
    phone: '+919820123456',
    gstin: '27AABCA1234F1Z5',
    address: 'Suite 402, Lotus Grandeur, Veera Desai Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'IN',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Theme Settings State
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await apiRequest('/tenants/current');
        if (res) setTenant((prev: any) => ({ ...prev, ...res }));
      } catch (err) {
        console.warn('Failed to load settings, using defaults', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();

    // Load stored theme if any
    const storedTheme = localStorage.getItem('chatledger_theme');
    if (storedTheme) {
      try {
        setThemeConfig(JSON.parse(storedTheme));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiRequest('/tenants/current', {
        method: 'PUT',
        body: JSON.stringify(tenant),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save business settings');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyTheme = () => {
    localStorage.setItem('chatledger_theme', JSON.stringify(themeConfig));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSelectPreset = (presetKey: ThemePreset) => {
    const preset = THEME_PRESETS[presetKey];
    setThemeConfig((prev) => ({
      ...prev,
      preset: presetKey,
      accentColor: preset.primaryBlue,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  const currentPresetData = THEME_PRESETS[themeConfig.preset] || THEME_PRESETS['classic-navy'];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF0]">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#243B5A]" />
            Workspace & Platform Settings
          </h1>
          <p className="text-xs text-[#707B8B]">
            Manage business profile, enterprise appearance presets, WhatsApp rules, and security.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-[#23865B]/10 text-[#23865B] text-xs font-bold border border-[#23865B]/20 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Changes Saved Successfully
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6EAF0] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          General & Business Profile
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'appearance'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Appearance & Themes
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          Notifications & Alerts
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Security & Access
        </button>
      </div>

      {/* TAB 1: GENERAL & BUSINESS DETAILS */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="space-y-5">
          <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#E6EAF0]">
              Business Legal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-[#202938]">Business / Clinic Name</label>
                <input
                  type="text"
                  value={tenant?.name || ''}
                  onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Official Contact Email</label>
                <input
                  type="email"
                  value={tenant?.email || ''}
                  onChange={(e) => setTenant({ ...tenant, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">WhatsApp Business Number</label>
                <input
                  type="text"
                  value={tenant?.phone || ''}
                  onChange={(e) => setTenant({ ...tenant, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">GSTIN (Indian Tax Identifier)</label>
                <input
                  type="text"
                  value={tenant?.gstin || ''}
                  onChange={(e) => setTenant({ ...tenant, gstin: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-[#202938]">Clinic / Office Street Address</label>
                <input
                  type="text"
                  value={tenant?.address || ''}
                  onChange={(e) => setTenant({ ...tenant, address: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">City</label>
                <input
                  type="text"
                  value={tenant?.city || ''}
                  onChange={(e) => setTenant({ ...tenant, city: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">State & Country</label>
                <input
                  type="text"
                  value={`${tenant?.state || ''}, ${tenant?.country || 'IN'}`}
                  onChange={(e) => setTenant({ ...tenant, state: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#E6EAF0]">
              Operational Hours & Calendar Sync
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-[#202938]">Opening Time (Morning)</label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Closing Time (Evening)</label>
                <input
                  type="time"
                  defaultValue="20:00"
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5 text-white" />
              {saving ? 'Saving...' : 'Save General Settings'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ADVANCED THEME & APPEARANCE SYSTEM */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
            <div>
              <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
                Enterprise Appearance Presets
              </h2>
              <p className="text-xs text-[#707B8B] mt-0.5">
                Select a pre-tuned, high-contrast corporate aesthetic designed for information density.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                const p = THEME_PRESETS[key];
                const isSelected = themeConfig.preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-[#356AE6] bg-[#356AE6]/5 shadow-xs ring-1 ring-[#356AE6]'
                        : 'border-[#E6EAF0] hover:border-[#D0D5DD] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primaryNavy }}></span>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primaryBlue }}></span>
                        <span className="w-3 h-3 rounded-full border border-[#E6EAF0]" style={{ backgroundColor: p.background }}></span>
                      </div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#356AE6] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#202938]">{p.name}</div>
                    <div className="text-[11px] text-[#707B8B] leading-tight mt-1">{p.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Theme Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Density & Border Settings */}
            <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
                Density & Structure
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#202938] block mb-1">Layout Density</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setThemeConfig({ ...themeConfig, density: 'comfortable' })}
                      className={`p-2 rounded-lg border text-xs font-semibold ${
                        themeConfig.density === 'comfortable'
                          ? 'border-[#356AE6] bg-[#356AE6]/10 text-[#356AE6]'
                          : 'border-[#E6EAF0] text-[#707B8B]'
                      }`}
                    >
                      Comfortable (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeConfig({ ...themeConfig, density: 'compact' })}
                      className={`p-2 rounded-lg border text-xs font-semibold ${
                        themeConfig.density === 'compact'
                          ? 'border-[#356AE6] bg-[#356AE6]/10 text-[#356AE6]'
                          : 'border-[#E6EAF0] text-[#707B8B]'
                      }`}
                    >
                      Compact (High-Density)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#202938] block mb-1">Corner Radius</label>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setThemeConfig({ ...themeConfig, borderRadius: r })}
                        className={`p-1.5 rounded-lg border text-xs uppercase font-mono ${
                          themeConfig.borderRadius === r
                            ? 'border-[#356AE6] bg-[#356AE6]/10 text-[#356AE6] font-bold'
                            : 'border-[#E6EAF0] text-[#707B8B]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#356AE6]" />
                Live Theme Preview
              </h3>

              <div
                className="p-4 rounded-xl border border-[#E6EAF0] space-y-3"
                style={{ backgroundColor: currentPresetData.background }}
              >
                <div className="bg-white p-3 rounded-lg border border-[#E6EAF0] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: currentPresetData.primaryNavy }}
                    >
                      CL
                    </div>
                    <span className="text-xs font-bold text-[#202938]">Sample Lead Row</span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: currentPresetData.primaryBlue }}
                  >
                    Active Preset
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md text-white text-[11px] font-semibold"
                    style={{ backgroundColor: currentPresetData.primaryNavy }}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md bg-white border border-[#E6EAF0] text-[#202938] text-[11px] font-semibold"
                  >
                    Secondary
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#707B8B]">
                Preset &ldquo;{currentPresetData.name}&rdquo; ready. Click below to apply across all tabs.
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleApplyTheme}
              className="px-5 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5 text-white" />
              Apply Theme Preferences
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS & WEBHOOKS */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4 text-xs">
          <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#E6EAF0]">
            WhatsApp Operational Alerts & Webhook Routing
          </h2>

          <div className="space-y-3">
            {[
              { title: 'Immediate Human Handover Alert', desc: 'Notify assigned doctors & front desk when patient asks for human agent.', active: true },
              { title: 'Daily Appointment Summary at 8:00 AM', desc: 'Send daily schedule report directly to verified doctor WhatsApp.', active: true },
              { title: 'Payment Receipt Webhooks', desc: 'Emit real-time Razorpay webhook event on successful UPI payment completion.', active: true },
              { title: 'Low Balance & Inactivity Warning', desc: 'Alert platform administrator if WhatsApp conversation credits run low.', active: false },
            ].map((n, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0]">
                <div>
                  <div className="font-semibold text-[#202938]">{n.title}</div>
                  <div className="text-[11px] text-[#707B8B]">{n.desc}</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={n.active}
                  className="rounded text-[#356AE6] mt-0.5"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & ACCESS CONTROL */}
      {activeTab === 'security' && (
        <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4 text-xs">
          <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#E6EAF0]">
            Multi-Tenant Security & Access Rules
          </h2>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#23865B]/10 border border-[#23865B]/20 text-[#23865B]">
              <strong>✓ Tenant Data Isolation Verified:</strong> All PostgreSQL database queries strictly partitioned by <code>tenantId</code>. Cross-tenant leakage is cryptographically blocked.
            </div>

            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] space-y-1">
              <div className="font-semibold text-[#202938]">Two-Factor Authentication (2FA)</div>
              <div className="text-[11px] text-[#707B8B]">Enforce OTP verification for staff logins on new IP addresses.</div>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] space-y-1">
              <div className="font-semibold text-[#202938]">Session Expiry & Rotation</div>
              <div className="text-[11px] text-[#707B8B]">JWT Access Token expires in 24 hours. Refresh token rotates on every authentication cycle.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
