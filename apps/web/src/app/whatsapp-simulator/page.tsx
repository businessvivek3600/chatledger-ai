'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  CheckCheck,
  Bot,
  UserCheck,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export default function WhatsAppSimulatorPage() {
  const [phone, setPhone] = useState('+919811223344');
  const [customerName, setCustomerName] = useState('Rohan Deshmukh');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'customer' | 'ai'; text: string; time: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [handlingMode, setHandlingMode] = useState<'AI' | 'HUMAN'>('AI');
  const [isResetting, setIsResetting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const res = await apiRequest<any>(`/whatsapp/simulator/messages?phone=${encodeURIComponent(phone)}`);
      const msgList = Array.isArray(res) ? res : res?.messages || [];
      if (res?.handlingMode) {
        setHandlingMode(res.handlingMode);
      }

      if (Array.isArray(msgList) && msgList.length > 0) {
        const formatted = msgList.map((m: any) => ({
          sender: m.sender === 'CUSTOMER' ? ('customer' as const) : ('ai' as const),
          text: m.content,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(formatted);
      } else {
        setMessages([
          {
            sender: 'ai',
            text: 'Hello Rohan! Welcome to Apex Multispecialty Clinic. How can we assist you with doctor schedules, appointment bookings, or clinic timings today?',
            time: '11:00 AM',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load chat history', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [phone]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'customer', text: textToSend, time: nowTime }]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    try {
      // 1. Trigger backend webhook processing
      const response = await apiRequest<any>('/whatsapp/simulate-incoming', {
        method: 'POST',
        body: JSON.stringify({
          phone,
          name: customerName,
          message: textToSend,
        }),
      });

      // 2. Extract AI response directly from webhook execution
      const aiMsg = response?.results?.[0]?.aiResponse;
      const conv = response?.results?.[0]?.conversation;
      if (conv?.handlingMode) {
        setHandlingMode(conv.handlingMode);
      }

      const aiReplyText =
        aiMsg?.content ||
        'Thank you for contacting Apex Clinic! How else may I assist you with your appointment or inquiry?';

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: aiReplyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
      }, 600);
    } catch (err: any) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Thank you for your message! Our clinic team is available to assist you.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleResetChat = async () => {
    setIsResetting(true);
    try {
      await apiRequest('/whatsapp/simulator/reset', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      setHandlingMode('AI');
      setMessages([
        {
          sender: 'ai',
          text: 'Hello Rohan! Welcome to Apex Multispecialty Clinic. How can we assist you with doctor schedules, appointment bookings, or clinic timings today?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Reset failed', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Top Banner Navigation & Reset */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between">
        <Link
          href="/dashboard/inbox"
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Shared Inbox
        </Link>
        <button
          onClick={handleResetChat}
          disabled={isResetting}
          className="text-[11px] font-semibold text-rose-300 hover:text-rose-100 flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/80 px-2.5 py-1.5 rounded-xl border border-rose-800/80 shadow-sm transition-colors"
          title="Reset conversation state back to fresh AI assistant mode"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          Reset Chat & AI
        </button>
      </div>

      {/* Preset Action Chips */}
      <div className="w-full max-w-md mb-3 flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-300 pb-1 scrollbar-none">
        <button
          onClick={() => handleSendMessage('Do you have openings tomorrow for skin consultation?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap active:scale-95 transition-all text-emerald-300"
        >
          📅 Ask Open Slots
        </button>
        <button
          onClick={() => handleSendMessage('What are your consultation charges and fees?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap active:scale-95 transition-all text-amber-300"
        >
          💰 Inquire Fees
        </button>
        <button
          onClick={() => handleSendMessage('Where is your clinic located and what are your timings?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap active:scale-95 transition-all text-sky-300"
        >
          📍 Timings & Location
        </button>
        <button
          onClick={() => handleSendMessage('I want to speak with a human agent please.')}
          className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap active:scale-95 transition-all text-purple-300"
        >
          🙋 Request Human
        </button>
        {handlingMode === 'HUMAN' && (
          <button
            onClick={() => handleSendMessage('restart')}
            className="px-2.5 py-1.5 rounded-full bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600 text-emerald-200 whitespace-nowrap active:scale-95 transition-all font-semibold"
          >
            🤖 Resume AI
          </button>
        )}
      </div>

      {/* Mode Indicator Banner */}
      <div className="w-full max-w-sm mb-2 flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Current Mode:</span>
          {handlingMode === 'AI' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Bot className="w-3 h-3" />
              Automated AI Assistant
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <UserCheck className="w-3 h-3" />
              Handed Over to Human Staff
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500 font-mono">+91 98112 23344</span>
      </div>

      {/* Smartphone Device Shell */}
      <div className="w-full max-w-sm h-[660px] bg-slate-950 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
        {/* Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-900 rounded-full z-20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-950 mr-3"></div>
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
        </div>

        {/* Screen */}
        <div className="w-full h-full rounded-[2.3rem] overflow-hidden flex flex-col bg-[#EFEAE2] relative text-slate-900">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white pt-8 pb-3 px-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs text-white shadow-inner">
                🏥
              </div>
              <div>
                <div className="text-xs font-bold leading-tight flex items-center gap-1">
                  Apex Multispecialty Clinic
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-emerald-100 font-medium flex items-center gap-1">
                  <span>Official WhatsApp Verified</span>
                  <span>•</span>
                  <span className="text-emerald-200">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <Video className="w-4 h-4 cursor-pointer hover:opacity-80" />
              <Phone className="w-4 h-4 cursor-pointer hover:opacity-80" />
              <MoreVertical className="w-4 h-4 cursor-pointer hover:opacity-80" />
            </div>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#E5DDD5]">
            <div className="text-center my-1">
              <span className="text-[10px] bg-amber-100/90 text-amber-900 px-3 py-1 rounded-md shadow-xs border border-amber-200/50">
                🔒 Messages are end-to-end encrypted. Meta Cloud API verified.
              </span>
            </div>

            {messages.map((m, idx) => {
              const isCust = m.sender === 'customer';
              return (
                <div key={idx} className={`flex ${isCust ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed shadow-xs ${
                      isCust
                        ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none border border-emerald-300/40'
                        : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/70'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                      <span>{m.time}</span>
                      {isCust && <CheckCheck className="w-3 h-3 text-sky-500" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg px-3 py-1.5 text-[11px] text-slate-600 rounded-tl-none shadow-xs flex items-center gap-2 border border-slate-200">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="font-medium text-slate-500">Apex Assistant is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Bottom Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2 bg-[#F0F2F5] flex items-center gap-2 border-t border-slate-200"
          >
            <Smile className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
            <Paperclip className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-700" />

            <input
              type="text"
              placeholder="Type a WhatsApp message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-slate-900 focus:outline-none border border-slate-300"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-400 text-center max-w-sm">
        Every message typed here executes the full backend pipeline and syncs in real-time with the{' '}
        <Link href="/dashboard/inbox" className="underline text-emerald-400 font-semibold hover:text-emerald-300">
          Business Owner Shared Inbox
        </Link>
        .
      </div>
    </div>
  );
}
