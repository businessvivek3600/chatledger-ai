'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Calendar,
  CheckSquare,
  Send,
  CreditCard,
  Bot,
  Zap,
  Settings,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';
import { apiRequest } from '../lib/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    leads?: any[];
    customers?: any[];
    conversations?: any[];
  }>({});
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // toggled from parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({});
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [leads, customers] = await Promise.all([
          apiRequest<any[]>(`/leads?search=${encodeURIComponent(query)}`).catch(() => []),
          apiRequest<any[]>(`/customers?search=${encodeURIComponent(query)}`).catch(() => []),
        ]);
        setResults({
          leads: Array.isArray(leads) ? leads.slice(0, 3) : [],
          customers: Array.isArray(customers) ? customers.slice(0, 3) : [],
        });
      } catch (err) {
        console.error('Command search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const quickNav = [
    { label: 'WhatsApp Inbox', path: '/dashboard/inbox', icon: MessageSquare, category: 'Navigation' },
    { label: 'Leads & CRM Pipeline', path: '/dashboard/leads', icon: TrendingUp, category: 'Navigation' },
    { label: 'Appointments Calendar', path: '/dashboard/appointments', icon: Calendar, category: 'Navigation' },
    { label: 'AI Business Assistant', path: '/dashboard/ai-assistant', icon: Bot, category: 'Navigation' },
    { label: 'Invoices & Payments', path: '/dashboard/payments', icon: CreditCard, category: 'Navigation' },
    { label: 'Visual Automations Studio', path: '/dashboard/automations', icon: Zap, category: 'Navigation' },
    { label: 'Broadcast Campaigns', path: '/dashboard/campaigns', icon: Send, category: 'Navigation' },
    { label: 'Appearance & Themes', path: '/dashboard/settings', icon: Settings, category: 'Settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E6EAF0] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#E6EAF0]">
          <Search className="w-4 h-4 text-[#707B8B] mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search leads, customers, modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs text-[#202938] placeholder-[#98A2B3] focus:outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#98A2B3] hover:text-[#202938] rounded-md transition-colors"
          >
            <kbd className="text-[10px] bg-[#F2F4F7] border border-[#E6EAF0] px-1.5 py-0.5 rounded text-[#707B8B] font-mono">
              ESC
            </kbd>
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#F2F4F7]">
          {/* Quick Actions if no query */}
          {!query && (
            <div className="py-2">
              <div className="px-3 pb-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
                Quick Navigation & Actions
              </div>
              <div className="space-y-0.5">
                {quickNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigateTo(item.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#202938] hover:bg-[#F2F4F7] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-[#356AE6]" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[#98A2B3]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="py-2 space-y-3">
              {/* Leads */}
              {results.leads && results.leads.length > 0 && (
                <div>
                  <div className="px-3 pb-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
                    Matching Leads
                  </div>
                  {results.leads.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => navigateTo(`/dashboard/leads`)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-[#202938] hover:bg-[#F2F4F7] text-left"
                    >
                      <div>
                        <div className="font-semibold">{l.name}</div>
                        <div className="text-[10px] text-[#707B8B]">{l.phone} • Status: {l.status}</div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#356AE6]">Open CRM →</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Customers */}
              {results.customers && results.customers.length > 0 && (
                <div>
                  <div className="px-3 pb-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
                    Customers
                  </div>
                  {results.customers.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => navigateTo(`/dashboard/customers`)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-[#202938] hover:bg-[#F2F4F7] text-left"
                    >
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-[10px] text-[#707B8B]">{c.phone}</div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#356AE6]">Customer 360 →</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isSearching && (!results.leads || results.leads.length === 0) && (!results.customers || results.customers.length === 0) && (
                <div className="text-center py-6 text-xs text-[#707B8B]">
                  No records matching &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#F7F8FA] border-t border-[#E6EAF0] flex items-center justify-between text-[11px] text-[#707B8B]">
          <span>Tip: Use <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-[#E6EAF0]">⌘K</kbd> anywhere</span>
          <span>ChatLedger AI Command Engine</span>
        </div>
      </div>
    </div>
  );
}
