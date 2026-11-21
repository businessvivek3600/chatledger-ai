'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Send,
  CheckSquare,
  CreditCard,
  BarChart3,
  UserPlus,
  BookOpen,
  Puzzle,
  Receipt,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  Plus,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../lib/auth-store';
import { apiRequest } from '../../lib/api';
import { CommandPalette } from '../../components/CommandPalette';
import ChatLedgerLogo, { ChatLedgerEmblem } from '../../components/ChatLedgerLogo';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initialize } = useAuthStore();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tenantData, setTenantData] = useState<any>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const tenant = await apiRequest('/tenants/current');
        setTenantData(tenant);
      } catch (err) {
        // fallback
      }
    };
    fetchTenant();
  }, [user]);

  const handleSignOut = () => {
    logout();
    router.push('/auth/login');
  };

  const navGroups = [
    {
      groupKey: 'nav.operations',
      defaultGroup: 'Operations',
      items: [
        { key: 'nav.overview', defaultName: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { key: 'nav.inbox', defaultName: 'WhatsApp Inbox', href: '/dashboard/inbox', icon: MessageSquare, badgeKey: 'common.live' },
        { key: 'nav.aiAssistant', defaultName: 'AI Business Assistant', href: '/dashboard/ai-assistant', icon: Bot },
      ],
    },
    {
      groupKey: 'nav.crmPipeline',
      defaultGroup: 'CRM & Pipeline',
      items: [
        { key: 'nav.leads', defaultName: 'Leads & CRM', href: '/dashboard/leads', icon: TrendingUp },
        { key: 'nav.customers', defaultName: 'Customers 360', href: '/dashboard/customers', icon: Users },
        { key: 'nav.campaigns', defaultName: 'Broadcast Campaigns', href: '/dashboard/campaigns', icon: Send },
      ],
    },
    {
      groupKey: 'nav.bookingsFinance',
      defaultGroup: 'Bookings & Finance',
      items: [
        { key: 'nav.appointments', defaultName: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { key: 'nav.tasks', defaultName: 'Tasks & Follow-ups', href: '/dashboard/tasks', icon: CheckSquare },
        { key: 'nav.payments', defaultName: 'Payments & GST Invoices', href: '/dashboard/payments', icon: CreditCard },
      ],
    },
    {
      groupKey: 'nav.automationInsights',
      defaultGroup: 'Automation & Insights',
      items: [
        { key: 'nav.automations', defaultName: 'Visual Automations', href: '/dashboard/automations', icon: Zap },
        { key: 'nav.reports', defaultName: 'Reports & Analytics', href: '/dashboard/reports', icon: BarChart3 },
        { key: 'nav.knowledgeBase', defaultName: 'Knowledge Base (RAG)', href: '/dashboard/knowledge-base', icon: BookOpen },
      ],
    },
    {
      groupKey: 'nav.workspaceSystem',
      defaultGroup: 'Workspace & System',
      items: [
        { key: 'nav.team', defaultName: 'Team Members', href: '/dashboard/team', icon: UserPlus },
        { key: 'nav.integrations', defaultName: 'Integrations', href: '/dashboard/integrations', icon: Puzzle },
        { key: 'nav.billing', defaultName: 'SaaS Subscription', href: '/dashboard/billing', icon: Receipt },
        { key: 'nav.settings', defaultName: 'Appearance & Settings', href: '/dashboard/settings', icon: Settings },
      ],
    },
  ];

  const getPageTitle = () => {
    const clean = pathname.replace('/dashboard/', '').replace('/dashboard', '');
    if (!clean) return t('nav.overview', 'Overview');
    const matched = navGroups.flatMap(g => g.items).find(i => i.href === pathname);
    if (matched) return t(matched.key, matched.defaultName);
    return clean
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex text-[#202938]">
      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* 1. ENTERPRISE SIDEBAR (DESKTOP) */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-[#E6EAF0] flex-shrink-0 transition-all duration-200 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Brand & Workspace Header */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#E6EAF0]">
          {!sidebarCollapsed ? (
            <Link href="/dashboard" className="flex items-center min-w-0">
              <ChatLedgerLogo
                size="sm"
                subtitle={tenantData?.name || user?.businessName || t('nav.workspace', 'Workspace')}
              />
            </Link>
          ) : (
            <Link href="/dashboard" className="mx-auto" title="ChatLedger AI">
              <ChatLedgerEmblem size={28} />
            </Link>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7] transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* WhatsApp Simulator Shortcut Bar */}
        {!sidebarCollapsed && (
          <div className="px-3 pt-3">
            <Link
              href="/whatsapp-simulator"
              target="_blank"
              className="p-2 rounded-xl bg-[#F2F4F7] hover:bg-[#E6EAF0] border border-[#E6EAF0] flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#23865B] animate-pulse"></span>
                <span className="text-[11px] font-semibold text-[#202938]">{t('nav.whatsappLive', 'WhatsApp Live')}</span>
              </div>
              <span className="text-[10px] text-[#356AE6] font-bold flex items-center gap-0.5">
                {t('common.live', 'Live')} <ExternalLink className="w-3 h-3" />
              </span>
            </Link>
          </div>
        )}

        {/* Organized Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((grp) => (
            <div key={grp.groupKey} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2 pb-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
                  {t(grp.groupKey, grp.defaultGroup)}
                </div>
              )}
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const label = t(item.key, item.defaultName);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={sidebarCollapsed ? label : undefined}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F2F4F7] text-[#243B5A] font-semibold border-l-2 border-[#356AE6]'
                        : 'text-[#707B8B] hover:text-[#202938] hover:bg-[#F7F8FA]'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#356AE6]' : 'text-[#707B8B]'}`} />
                      {!sidebarCollapsed && <span className="truncate">{label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badgeKey && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#23865B]/10 text-[#23865B] border border-[#23865B]/20">
                        {t(item.badgeKey, 'Live')}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-[#E6EAF0] flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#243B5A] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#202938] truncate">{user?.fullName || 'Dr. Rajesh Sharma'}</div>
                <div className="text-[10px] text-[#707B8B] truncate">{user?.role || 'BUSINESS_OWNER'}</div>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-7 h-7 rounded-full bg-[#243B5A] text-white flex items-center justify-center text-xs font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          )}

          {!sidebarCollapsed && (
            <button
              onClick={handleSignOut}
              title={t('nav.signOut', 'Sign Out')}
              className="p-1.5 text-[#707B8B] hover:text-[#D64B50] hover:bg-[#F2F4F7] rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E6EAF0] px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-20">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#202938] hover:bg-[#F2F4F7]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 text-xs text-[#707B8B]">
              <span className="font-semibold text-[#202938]">
                {tenantData?.name || 'Apex Multispecialty Clinic'}
              </span>
              <span>/</span>
              <span className="text-[#356AE6] font-semibold">{getPageTitle()}</span>
            </div>
          </div>

          {/* Center / Right: Global Search Trigger, Language Picker & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Language Switcher */}
            <LanguageSwitcher variant="header" />

            {/* Search Trigger */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E6EAF0] bg-[#F7F8FA] hover:bg-white text-xs text-[#707B8B] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t('header.command', 'Search or command...')}</span>
              <kbd className="text-[10px] bg-white border border-[#E6EAF0] px-1.5 py-0.5 rounded font-mono ml-2">
                ⌘K
              </kbd>
            </button>

            {/* Quick Create Button & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                className="px-3 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('header.quickAction', 'New Action')}</span>
              </button>

              {quickCreateOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E6EAF0] py-1 text-xs z-50 animate-in fade-in"
                  onClick={() => setQuickCreateOpen(false)}
                >
                  <Link href="/dashboard/leads" className="block px-3 py-2 text-[#202938] hover:bg-[#F2F4F7]">
                    + {t('leads.addLead', 'Add New Lead')}
                  </Link>
                  <Link href="/dashboard/appointments" className="block px-3 py-2 text-[#202938] hover:bg-[#F2F4F7]">
                    + {t('appointments.bookAppointment', 'Book Appointment')}
                  </Link>
                  <Link href="/dashboard/campaigns" className="block px-3 py-2 text-[#202938] hover:bg-[#F2F4F7]">
                    + {t('campaigns.newCampaign', 'Broadcast Campaign')}
                  </Link>
                  <Link href="/dashboard/payments" className="block px-3 py-2 text-[#202938] hover:bg-[#F2F4F7]">
                    + {t('payments.generateUpiLink', 'Generate Payment Link')}
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-[#707B8B] hover:text-[#202938] hover:bg-[#F2F4F7] rounded-lg transition-colors relative"
                title={t('header.notifications', 'Notifications')}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#356AE6]"></span>
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E6EAF0] p-3 text-xs z-50 animate-in fade-in space-y-2"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <div className="font-bold text-[#202938] pb-1 border-b border-[#E6EAF0] flex items-center justify-between">
                    <span>{t('header.notifications', 'Notifications')}</span>
                    <span className="text-[10px] text-[#356AE6] font-semibold">2 {t('common.active', 'Active')}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0]">
                      <div className="font-semibold text-[#202938]">New WhatsApp Lead</div>
                      <div className="text-[10px] text-[#707B8B]">Rohan Deshmukh requested skin consultation</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0]">
                      <div className="font-semibold text-[#202938]">AI Handover Resolved</div>
                      <div className="text-[10px] text-[#707B8B]">Dr. Sharma replied to Sunita Menon</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Employee Desk View Shortcut */}
            <Link
              href="/workspace"
              className="text-xs font-semibold text-[#202938] hover:text-[#356AE6] bg-[#F2F4F7] hover:bg-[#E6EAF0] px-3 py-1.5 rounded-lg transition-colors hidden lg:inline-block"
            >
              {t('header.employeeView', 'Employee View')} →
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white p-4 border-b border-[#E6EAF0] space-y-3 z-40">
            {navGroups.map((grp) => (
              <div key={grp.groupKey} className="space-y-1">
                <div className="text-[10px] font-bold text-[#98A2B3] uppercase">
                  {t(grp.groupKey, grp.defaultGroup)}
                </div>
                {grp.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#202938] hover:bg-[#F2F4F7]"
                  >
                    <item.icon className="w-4 h-4 text-[#356AE6]" />
                    <span>{t(item.key, item.defaultName)}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F7F8FA]">
          {children}
        </main>
      </div>
    </div>
  );
}
