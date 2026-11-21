'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Bot,
  User,
  Send,
  CheckCheck,
  Check,
  Clock,
  Phone,
  Calendar,
  CreditCard,
  Tag,
  Paperclip,
  Smile,
  ShieldAlert,
  UserCheck,
  Plus,
  RefreshCw,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';
import {
  ConversationStatus,
  HandlingMode,
  MessageType,
  MessageSender,
} from '@nexaflow/shared-types';

export default function WhatsAppTeamInboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);

  // Filters
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Message Sending
  const [inputMessage, setInputMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Team Members for Assignment
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const activeConvIdRef = React.useRef<string | null>(null);

  const fetchConversations = async () => {
    try {
      const query = new URLSearchParams();
      if (filterTab !== 'all') query.set('status', filterTab);
      if (searchQuery) query.set('search', searchQuery);

      const res = await apiRequest<any[]>(`/conversations?${query.toString()}`);
      if (Array.isArray(res)) {
        setConversations(res);
        setActiveConvId((current) => {
          if (current && res.some((c) => c.id === current)) {
            return current;
          }
          return res.length > 0 ? res[0].id : null;
        });
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveConversation = async (id: string) => {
    try {
      const res = await apiRequest(`/conversations/${id}`);
      setActiveConversation(res);
    } catch (err) {
      console.error('Failed to fetch conversation details', err);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await apiRequest<any[]>('/users/team');
      if (Array.isArray(res)) {
        setTeamMembers(res);
      }
    } catch (err) {
      console.error('Failed to load team', err);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    fetchActiveConversation(id);
  };

  useEffect(() => {
    activeConvIdRef.current = activeConvId;
    if (activeConvId) {
      fetchActiveConversation(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    fetchConversations();
    fetchTeam();
    const interval = setInterval(() => {
      fetchConversations();
      if (activeConvIdRef.current) {
        fetchActiveConversation(activeConvIdRef.current);
      }
    }, 4000); // Poll live updates safely
    return () => clearInterval(interval);
  }, [filterTab, searchQuery]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConvId) return;

    setIsSending(true);
    try {
      await apiRequest(`/conversations/${activeConvId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: inputMessage,
          isInternalNote,
          messageType: MessageType.TEXT,
        }),
      });

      setInputMessage('');
      setIsInternalNote(false);
      await fetchActiveConversation(activeConvId);
      await fetchConversations();
    } catch (err: any) {
      alert(`Message send failed: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleHandlingMode = async (newMode: HandlingMode) => {
    if (!activeConvId) return;
    try {
      await apiRequest(`/conversations/${activeConvId}/mode`, {
        method: 'POST',
        body: JSON.stringify({ mode: newMode }),
      });
      await fetchActiveConversation(activeConvId);
      await fetchConversations();
    } catch (err) {
      console.error('Failed to update mode', err);
    }
  };

  const handleAssignAgent = async (agentId: string) => {
    if (!activeConvId) return;
    try {
      await apiRequest(`/conversations/${activeConvId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ assignedUserId: agentId }),
      });
      await fetchActiveConversation(activeConvId);
      await fetchConversations();
    } catch (err) {
      console.error('Failed to assign agent', err);
    }
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] bg-white rounded-xl border border-[#E6EAF0] shadow-xs overflow-hidden flex flex-col md:flex-row">
      {/* ======================================================== */}
      {/* 1. LEFT COLUMN: CONVERSATION LIST (320px) */}
      {/* ======================================================== */}
      <div className="w-full md:w-80 lg:w-96 border-r border-[#E6EAF0] flex flex-col h-full bg-white flex-shrink-0">
        {/* Header & Search */}
        <div className="p-3.5 border-b border-[#E6EAF0] bg-white">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-bold text-[#202938] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#356AE6]" />
              WhatsApp Shared Inbox
            </h2>
            <button
              onClick={fetchConversations}
              className="p-1.5 text-[#707B8B] hover:text-[#202938] rounded-md hover:bg-[#F2F4F7] transition-colors"
              title="Refresh inbox"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search phone, patient, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E6EAF0] bg-[#F7F8FA] focus:bg-white focus:outline-none focus:border-[#356AE6]"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#F7F8FA] border-b border-[#E6EAF0] overflow-x-auto text-[11px] font-semibold text-[#707B8B] scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'unassigned', label: 'Unassigned' },
            { id: 'open', label: 'Open' },
            { id: 'pending', label: 'Pending' },
            { id: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-white text-[#243B5A] shadow-xs font-bold border border-[#E6EAF0]'
                  : 'hover:text-[#202938]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F2F4F7]">
          {conversations.length === 0 ? (
            <div className="text-center py-12 text-[#98A2B3] text-xs">
              No conversations found.
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = activeConvId === conv.id;
              const lastMsg = conv.messages?.[0];
              const isAi = conv.handlingMode === HandlingMode.AI;

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#F2F4F7] border-l-2 border-[#356AE6]'
                      : 'hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#E6EAF0] text-[#243B5A] flex items-center justify-center font-bold text-xs flex-shrink-0 relative">
                    {conv.customer?.name?.charAt(0) || 'C'}
                    {isAi && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#356AE6] text-white flex items-center justify-center text-[8px] shadow-xs">
                        🤖
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#202938] truncate">
                        {conv.customer?.name || 'Customer'}
                      </span>
                      <span className="text-[10px] text-[#98A2B3] whitespace-nowrap">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#707B8B] truncate mb-1">
                      {lastMsg?.content || conv.summary || 'WhatsApp conversation'}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isAi
                            ? 'bg-[#356AE6]/10 text-[#356AE6]'
                            : 'bg-[#B98535]/10 text-[#B98535]'
                        }`}
                      >
                        {isAi ? 'AI Handled' : 'Human Handled'}
                      </span>
                      {conv.customer?.phone && (
                        <span className="text-[10px] text-[#98A2B3]">
                          {conv.customer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CENTER COLUMN: MESSAGES & CHAT THREAD */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col h-full bg-[#F7F8FA] min-w-0">
        {activeConversation ? (
          <>
            {/* Chat Top Header */}
            <div className="h-16 bg-white border-b border-[#E6EAF0] px-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#243B5A] text-white font-bold text-xs flex items-center justify-center">
                  {activeConversation.customer?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#202938] flex items-center gap-2">
                    {activeConversation.customer?.name}
                    <span className="text-[10px] text-[#707B8B] font-normal">
                      {activeConversation.customer?.phone}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#707B8B] flex items-center gap-2">
                    <span>Status: <strong className="uppercase text-[#202938]">{activeConversation.status}</strong></span>
                    <span>•</span>
                    <span>Assigned: <strong>{activeConversation.assignedUser?.fullName || 'Unassigned'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Controls: Mode Switcher & Assign Dropdown */}
              <div className="flex items-center gap-2">
                {/* AI vs Human Mode Switch */}
                <div className="bg-[#F2F4F7] p-0.5 rounded-lg border border-[#E6EAF0] flex items-center text-xs">
                  <button
                    onClick={() => handleToggleHandlingMode(HandlingMode.AI)}
                    className={`px-2 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${
                      activeConversation.handlingMode === HandlingMode.AI
                        ? 'bg-[#356AE6] text-white shadow-xs'
                        : 'text-[#707B8B] hover:text-[#202938]'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    AI Mode
                  </button>
                  <button
                    onClick={() => handleToggleHandlingMode(HandlingMode.HUMAN)}
                    className={`px-2 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${
                      activeConversation.handlingMode === HandlingMode.HUMAN
                        ? 'bg-[#B98535] text-white shadow-xs'
                        : 'text-[#707B8B] hover:text-[#202938]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Human Agent
                  </button>
                </div>

                {/* Assign Dropdown */}
                <select
                  value={activeConversation.assignedUserId || ''}
                  onChange={(e) => handleAssignAgent(e.target.value)}
                  className="text-xs rounded-lg border border-[#E6EAF0] py-1.5 px-2 bg-white text-[#202938] focus:outline-none focus:border-[#356AE6]"
                >
                  <option value="">Assign Employee...</option>
                  {teamMembers.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.user?.fullName} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeConversation.messages?.map((msg: any) => {
                const isCustomer = msg.sender === MessageSender.CUSTOMER;
                const isInternal = msg.messageType === MessageType.NOTE;
                const isAi = msg.sender === MessageSender.AI;

                if (isInternal) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-2 rounded-xl max-w-md shadow-xs">
                        <div className="font-bold text-[10px] text-amber-700 uppercase mb-0.5">
                          📌 Internal Staff Note ({msg.senderUser?.fullName || 'Agent'})
                        </div>
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl p-3 shadow-xs text-xs leading-relaxed ${
                        isCustomer
                          ? 'bg-white text-[#202938] rounded-tl-none border border-[#E6EAF0]'
                          : isAi
                          ? 'bg-white text-[#202938] rounded-tr-none border border-[#356AE6]/30 shadow-xs'
                          : 'bg-[#243B5A] text-white rounded-tr-none'
                      }`}
                    >
                      {!isCustomer && (
                        <div className={`text-[10px] font-bold mb-1 flex items-center gap-1 ${isAi ? 'text-[#356AE6]' : 'text-slate-300'}`}>
                          {isAi ? (
                            <>
                              <Bot className="w-3 h-3 text-[#356AE6]" />
                              Dr. Apex Assistant
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 text-slate-200" />
                              {msg.senderUser?.fullName || 'Staff Agent'}
                            </>
                          )}
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${!isCustomer && !isAi ? 'text-slate-300' : 'text-[#98A2B3]'}`}>
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {!isCustomer && (
                          <span>
                            {msg.deliveryStatus === 'READ' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-[#356AE6]" />
                            ) : msg.deliveryStatus === 'DELIVERED' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-[#98A2B3]" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-[#98A2B3]" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Message Composer */}
            <div className="bg-white p-3 border-t border-[#E6EAF0]">
              {isInternalNote && (
                <div className="mb-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 font-semibold flex items-center justify-between">
                  <span>Adding Internal Note (Customer will NOT see this on WhatsApp)</span>
                  <button onClick={() => setIsInternalNote(false)} className="text-amber-900 font-bold">
                    Cancel
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInternalNote(!isInternalNote)}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                    isInternalNote
                      ? 'bg-[#B98535] text-white border-[#B98535]'
                      : 'border-[#E6EAF0] text-[#707B8B] hover:bg-[#F7F8FA]'
                  }`}
                  title="Toggle Internal Team Note"
                >
                  Note
                </button>

                <input
                  type="text"
                  placeholder={
                    isInternalNote
                      ? 'Write an internal staff note...'
                      : 'Type a message to reply on WhatsApp...'
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6] bg-[#F7F8FA] focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={isSending || !inputMessage.trim()}
                  className="px-4 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a conversation from the left to view messages.
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. RIGHT COLUMN: CUSTOMER 360 & OPERATIONAL ACTIONS */}
      {/* ======================================================== */}
      {activeConversation && (
        <div className="w-full md:w-72 lg:w-80 border-l border-[#E6EAF0] bg-white p-4 overflow-y-auto space-y-4 flex-shrink-0 text-xs">
          {/* Profile Header */}
          <div className="text-center pb-3 border-b border-[#E6EAF0]">
            <div className="w-12 h-12 rounded-xl bg-[#243B5A] text-white font-bold text-sm flex items-center justify-center mx-auto mb-2 shadow-xs">
              {activeConversation.customer?.name?.charAt(0) || 'C'}
            </div>
            <h3 className="text-xs font-bold text-[#202938]">
              {activeConversation.customer?.name}
            </h3>
            <div className="text-[11px] text-[#707B8B] mt-0.5">
              {activeConversation.customer?.phone}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="text-[10px] font-bold bg-[#F2F4F7] text-[#202938] px-2 py-0.5 rounded border border-[#E6EAF0]">
                {activeConversation.customer?.type || 'REGULAR'}
              </span>
              <span className="text-[10px] font-bold bg-[#23865B]/10 text-[#23865B] px-2 py-0.5 rounded border border-[#23865B]/20">
                LTV: {formatCurrency(activeConversation.customer?.lifetimeValue || 0)}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
              Quick Operations
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/dashboard/appointments"
                className="p-2 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] font-semibold text-[#202938] hover:bg-white text-center block transition-all"
              >
                📅 Book Slot
              </Link>
              <Link
                href="/dashboard/payments"
                className="p-2 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] font-semibold text-[#202938] hover:bg-white text-center block transition-all"
              >
                💳 Pay Link
              </Link>
            </div>
          </div>

          {/* Appointment History */}
          <div>
            <div className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider mb-1.5">
              Appointment History
            </div>
            {activeConversation.customer?.appointments?.length === 0 ? (
              <div className="text-[11px] text-[#707B8B]">No appointments recorded.</div>
            ) : (
              <div className="space-y-1.5">
                {activeConversation.customer?.appointments?.map((apt: any) => (
                  <div
                    key={apt.id}
                    className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] text-xs"
                  >
                    <div className="font-semibold text-[#202938]">{apt.service?.name}</div>
                    <div className="text-[11px] text-[#707B8B]">
                      {new Date(apt.scheduledAt).toLocaleDateString()} at{' '}
                      {new Date(apt.scheduledAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Tags */}
          <div>
            <div className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider mb-1.5">
              Tags & Segments
            </div>
            <div className="flex flex-wrap gap-1">
              {(activeConversation.customer?.tags || ['patient', 'inquiry']).map(
                (tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium bg-[#F2F4F7] text-[#707B8B] px-2 py-0.5 rounded border border-[#E6EAF0]"
                  >
                    #{tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
