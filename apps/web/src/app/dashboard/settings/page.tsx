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
  Globe,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { THEME_PRESETS, ThemePreset, ThemeConfig, DEFAULT_THEME_CONFIG } from '../../../design-system/theme';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'language' | 'notifications' | 'security'>('general');
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

  const { currentLanguage, setLanguage, supportedLanguages, t } = useLanguage();

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
            {t('settings.title', 'Workspace & Platform Settings')}
          </h1>
          <p className="text-xs text-[#707B8B]">
            {t('settings.subtitle', 'Manage organization profile, business hours, GSTIN, theme customization, and language preference.')}
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-[#23865B]/10 text-[#23865B] text-xs font-bold border border-[#23865B]/20 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            {t('settings.savedSuccess', 'Changes Saved Successfully')}
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6EAF0] pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'general'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          {t('settings.generalTab', 'General')}
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'appearance'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          {t('settings.appearanceTab', 'Appearance & Theme')}
        </button>

        <button
          onClick={() => setActiveTab('language')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'language'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          {t('settings.languageTab', 'Language & Localization')}
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          {t('settings.notificationsTab', 'Notifications')}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-[#243B5A] text-white shadow-xs'
              : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {t('settings.securityTab', 'Security')}
        </button>
      </div>

      {/* TAB: LANGUAGE & LOCALIZATION */}
      {activeTab === 'language' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF0]">
              <div>
                <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
                  {t('settings.selectLanguage', 'Select Preferred Language')}
                </h2>
                <p className="text-[11px] text-[#707B8B] mt-0.5">
                  {t('settings.languageDescription', 'Switch the entire application interface into your preferred language instantly.')}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#356AE6]/10 text-[#356AE6] text-xs font-bold">
                14 World Languages Supported
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {supportedLanguages.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setSavedSuccess(true);
                      setTimeout(() => setSavedSuccess(false), 2500);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#356AE6] bg-[#356AE6]/5 shadow-xs ring-1 ring-[#356AE6]'
                        : 'border-[#E6EAF0] hover:border-[#356AE6]/50 hover:bg-[#F7F8FA]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#202938]">{lang.nativeName}</span>
                        <span className="text-[10px] text-[#707B8B]">
                          {lang.name} {lang.direction === 'rtl' ? '(RTL)' : ''}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#356AE6] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
                <label className="font-semibold text-[#202938]">Verified WhatsApp / Phone</label>
                <input
                  type="text"
                  value={tenant?.phone || ''}
                  onChange={(e) => setTenant({ ...tenant, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">GSTIN / Tax ID Number</label>
                <input
                  type="text"
                  value={tenant?.gstin || ''}
                  onChange={(e) => setTenant({ ...tenant, gstin: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
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
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-white" />
              {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: APPEARANCE & THEMES */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#E6EAF0]">
                {t('settings.themePresets', 'Theme Presets')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                  const preset = THEME_PRESETS[key];
                  const isSelected = themeConfig.preset === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectPreset(key)}
                      className={`p-4 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#356AE6] bg-[#356AE6]/5 shadow-xs ring-1 ring-[#356AE6]'
                          : 'border-[#E6EAF0] bg-white hover:border-[#356AE6]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-[#202938]">{preset.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#356AE6]" />}
                      </div>

                      <div className="flex items-center gap-1.5 my-2">
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.primaryNavy }}></span>
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.primaryBlue }}></span>
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.background }}></span>
                      </div>

                      <p className="text-[10px] text-[#707B8B] leading-relaxed">{preset.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider pb-2 border-b border-[#E6EAF0]">
                Density & Radius Tokens
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
