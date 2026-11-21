'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  TrendingUp,
  Calendar,
  CheckSquare,
  User,
  LogOut,
  Send,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuthStore } from '../../lib/auth-store';
import { formatCurrency } from '../../lib/utils';
import { MessageType } from '@nexaflow/shared-types';

export default function EmployeeWorkspacePage() {
  const router = useRouter();
  const { user, logout, initialize } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'conversations' | 'tasks' | 'appointments'>('conversations');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const fetchData = async () => {
    try {
      const [convs, tsks, appts] = await Promise.all([
        apiRequest<any[]>('/conversations'),
        apiRequest<any[]>('/tasks'),
        apiRequest<any[]>('/appointments'),
      ]);
      if (Array.isArray(convs)) {
        setConversations(convs);
        setActiveConv((current: any) => {
          if (current && convs.some((c: any) => c.id === current.id)) {
            return current;
          }
          return convs.length > 0 ? convs[0] : null;
        });
      }
      if (Array.isArray(tsks)) setTasks(tsks);
      if (Array.isArray(appts)) setAppointments(appts);
    } catch (err) {
      console.error('Failed to load employee workspace', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;

    try {
      await apiRequest(`/conversations/${activeConv.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: replyText,
          messageType: MessageType.TEXT,
        }),
      });

      setReplyText('');
      const updated = await apiRequest(`/conversations/${activeConv.id}`);
      setActiveConv(updated);
      fetchData();
    } catch (err: any) {
      alert(`Error sending: ${err.message}`);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F8FA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans text-[#202938]">
      {/* Employee Top Header */}
      <header className="h-16 bg-white border-b border-[#E6EAF0] px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#243B5A] text-white font-bold flex items-center justify-center text-xs tracking-wider shadow-xs">
            CL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-[#202938]">
                ChatLedger Desk
              </span>
              <span className="text-[10px] font-bold text-[#23865B] bg-[#23865B]/10 px-2 py-0.5 rounded border border-[#23865B]/20 uppercase">
                Staff Agent
              </span>
            </div>
            <span className="text-[10px] text-[#707B8B] block">
              {user?.fullName || 'Pooja Verma (Reception)'} • {user?.role || 'Staff Operator'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#202938] hover:bg-[#F2F4F7] bg-white px-3 py-1.5 rounded-lg border border-[#E6EAF0] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Owner View <ArrowRight className="w-3 h-3 text-[#707B8B]" />
          </Link>
          <button
            onClick={handleSignOut}
            className="text-xs font-semibold text-[#D64B50] hover:bg-[#D64B50]/10 px-3 py-1.5 rounded-lg border border-[#D64B50]/20 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: My Assigned Tasks & Quick Stats */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Performance Card */}
          <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs space-y-3">
            <h3 className="text-[11px] font-bold text-[#707B8B] uppercase tracking-wider">
              Today's Queue & Activity
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#F7F8FA] p-2.5 rounded-lg border border-[#E6EAF0]">
                <span className="text-[10px] text-[#707B8B] block font-medium">Chats</span>
                <strong className="text-[#202938] text-base font-bold">{conversations.length}</strong>
              </div>
              <div className="bg-[#F7F8FA] p-2.5 rounded-lg border border-[#E6EAF0]">
                <span className="text-[10px] text-[#707B8B] block font-medium">Bookings</span>
                <strong className="text-[#356AE6] text-base font-bold">{appointments.length}</strong>
              </div>
              <div className="bg-[#F7F8FA] p-2.5 rounded-lg border border-[#E6EAF0]">
                <span className="text-[10px] text-[#707B8B] block font-medium">Tasks</span>
                <strong className="text-[#23865B] text-base font-bold">{tasks.length}</strong>
              </div>
            </div>
          </div>

          {/* Assigned Follow-ups & Reminders */}
          <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-[#356AE6]" />
              My Follow-up Tasks ({tasks.length})
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="text-xs text-[#98A2B3] py-6 text-center">No pending tasks.</div>
              ) : (
                tasks.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] text-xs">
                    <div className="font-semibold text-[#202938]">{t.title}</div>
                    <div className="text-[10px] text-[#707B8B] mt-0.5">
                      {t.customer?.name} • Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Today'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Shared WhatsApp Inbox for Assigned Chats */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E6EAF0] shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Inbox Top Bar */}
          <div className="p-3.5 bg-white border-b border-[#E6EAF0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E6EAF0] text-[#243B5A] font-bold text-xs flex items-center justify-center">
                {activeConv?.customer?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#202938]">
                  {activeConv?.customer?.name || 'Select a Conversation'}
                </h3>
                <span className="text-[11px] text-[#707B8B]">{activeConv?.customer?.phone}</span>
              </div>
            </div>

            <span className="text-[10px] font-bold bg-[#23865B]/10 text-[#23865B] px-2.5 py-0.5 rounded-full border border-[#23865B]/20">
              Live WhatsApp Connected
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F7F8FA]">
            {activeConv?.messages?.map((msg: any) => {
              const isCust = msg.sender === 'CUSTOMER';
              return (
                <div key={msg.id} className={`flex ${isCust ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[75%] rounded-xl p-3 text-xs leading-relaxed border ${
                      isCust
                        ? 'bg-white text-[#202938] border-[#E6EAF0]'
                        : 'bg-[#243B5A] text-white border-[#243B5A]'
                    }`}
                  >
                    <div className={`text-[10px] font-medium mb-0.5 ${isCust ? 'text-[#707B8B]' : 'text-slate-300'}`}>
                      {isCust ? activeConv.customer?.name : 'Staff Agent'}
                    </div>
                    {msg.content}
                    <div className={`text-[9px] text-right mt-1 ${isCust ? 'text-[#98A2B3]' : 'text-slate-300'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-[#E6EAF0] flex items-center gap-2">
            <input
              type="text"
              placeholder="Send WhatsApp reply to customer..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs rounded-lg border border-[#E6EAF0] px-3 py-2 text-[#202938] focus:outline-none focus:border-[#356AE6]"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-4 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 hover:bg-[#1a2d45]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
