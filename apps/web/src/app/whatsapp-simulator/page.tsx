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
  ExternalLink,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';
import { generateSimulatorResponse } from '../../lib/simulatorLogic';

interface ChatMessage {
  sender: 'customer' | 'ai';
  text: string;
  time: string;
  quickActions?: string[];
}

const INITIAL_WELCOME: ChatMessage = {
  sender: 'ai',
  text: 'Hello Rohan! Welcome to Apex Multispecialty Clinic. How can we assist you with doctor schedules, appointment bookings, or clinic timings today?',
  time: '11:00 AM',
  quickActions: [
    '📅 Book Appointment',
    '💰 Inquire Fees',
    '📍 Timings & Location',
    '🙋 Request Human',
  ],
};

export default function WhatsAppSimulatorPage() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('+919811223344');
  const [customerName, setCustomerName] = useState('Rohan Deshmukh');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [isTyping, setIsTyping] = useState(false);
  const [handlingMode, setHandlingMode] = useState<'AI' | 'HUMAN'>('AI');
  const [isResetting, setIsResetting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      // 1. Try relative Next.js API route first
      let res: any = null;
      try {
        const localApi = await fetch(`/api/whatsapp/simulator/messages?phone=${encodeURIComponent(phone)}`);
        if (localApi.ok) {
          const json = await localApi.json();
          res = json.data || json;
        }
      } catch (e) {
        // Fallback to backend API
      }

      if (!res) {
        res = await apiRequest<any>(`/whatsapp/simulator/messages?phone=${encodeURIComponent(phone)}`);
      }

      const msgList = Array.isArray(res) ? res : res?.messages || [];
      if (res?.handlingMode) {
        setHandlingMode(res.handlingMode);
      }

      if (Array.isArray(msgList) && msgList.length > 0) {
        const formatted: ChatMessage[] = msgList.map((m: any) => ({
          sender: m.sender === 'CUSTOMER' ? ('customer' as const) : ('ai' as const),
          text: m.content,
          time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(formatted);
      } else {
        setMessages([INITIAL_WELCOME]);
      }
    } catch (err) {
      console.warn('Backend history unavailable, keeping initial welcome state', err);
      setMessages([INITIAL_WELCOME]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [phone]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend || inputMessage).trim();
    if (!rawText) return;

    // Clean up if a button with leading icon was clicked (e.g., "📅 Book Appointment" -> "Book Appointment")
    const cleanActionText = rawText.replace(/^[^a-zA-Z0-9#+*]+\s*/, '');
    const text = cleanActionText || rawText;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'customer', text: rawText, time: timeNow }]);
    setInputMessage('');
    setIsTyping(true);

    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 800));

    let replyText = '';
    let updatedMode = handlingMode;
    let nextQuickActions: string[] | undefined = undefined;

    try {
      // 1. Try Next.js internal serverless route first
      let serverResponse: any = null;
      try {
        const serverlessRes = await fetch('/api/whatsapp/simulator/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            customerName,
            text,
            handlingMode,
          }),
        });
        if (serverlessRes.ok) {
          serverResponse = await serverlessRes.json();
        }
      } catch (e) {
        // Ignore and fallback to remote api
      }

      // 2. Try remote backend API if internal was not available
      if (!serverResponse?.reply && !serverResponse?.data?.reply) {
        try {
          const remoteRes = await apiRequest<{
            reply?: string;
            handlingMode?: 'AI' | 'HUMAN';
          }>('/whatsapp/simulator/send', {
            method: 'POST',
            body: JSON.stringify({
              phone,
              customerName,
              text,
            }),
          });
          serverResponse = remoteRes;
        } catch (e) {
          // Ignore and let local generator handle
        }
      }

      const receivedReply =
        serverResponse?.data?.reply ||
        serverResponse?.reply ||
        serverResponse?.message?.content;

      const receivedMode =
        serverResponse?.data?.handlingMode ||
        serverResponse?.handlingMode;

      if (receivedReply) {
        replyText = receivedReply;
        if (receivedMode) updatedMode = receivedMode;
        nextQuickActions = serverResponse?.data?.quickActions;
      } else {
        // 3. Resilient client-side simulation engine (Guaranteed zero-failure)
        const localResult = generateSimulatorResponse(text, handlingMode, customerName);
        replyText = localResult.reply;
        updatedMode = localResult.handlingMode;
        nextQuickActions = localResult.quickActions;
      }
    } catch (err) {
      console.warn('Network call failed, using client simulation engine', err);
      const localResult = generateSimulatorResponse(text, handlingMode, customerName);
      replyText = localResult.reply;
      updatedMode = localResult.handlingMode;
      nextQuickActions = localResult.quickActions;
    } finally {
      // Ensure realistic typing indicator delay has elapsed
      await minDelayPromise;
      setIsTyping(false);

      if (replyText) {
        setHandlingMode(updatedMode);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickActions: nextQuickActions,
          },
        ]);
      }
    }
  };

  const handleResetChat = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/whatsapp/simulator/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      }).catch(() => {});

      await apiRequest('/whatsapp/simulator/reset', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      }).catch(() => {});
    } catch (err) {
      console.warn('Backend reset unavailable, resetting local state', err);
    } finally {
      setHandlingMode('AI');
      setMessages([INITIAL_WELCOME]);
      setIsResetting(false);
    }
  };

  // Helper to render message text with clickable links
  const renderMessageContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline font-semibold hover:text-emerald-900 inline-flex items-center gap-0.5 break-all"
          >
            {part}
            <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Get active quick actions from the last AI message
  const lastAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');
  const activeQuickActions = lastAiMessage?.quickActions || [
    '📅 Book Appointment',
    '💰 Inquire Fees',
    '📍 Timings & Location',
    '🙋 Request Human',
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Top Banner Navigation, Reset & Language Switcher */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between">
        <Link
          href="/dashboard/inbox"
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('inbox.title', 'Shared Inbox')}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" />

          <button
            onClick={handleResetChat}
            disabled={isResetting}
            className="text-[11px] font-semibold text-rose-300 hover:text-rose-100 flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/80 px-2.5 py-1.5 rounded-xl border border-rose-800/80 shadow-sm transition-colors cursor-pointer"
            title="Reset conversation state back to fresh AI assistant mode"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            {t('common.refresh', 'Reset')}
          </button>
        </div>
      </div>

      {/* Preset Action Chips at Top */}
      <div className="w-full max-w-md mb-3 flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-300 pb-1 scrollbar-none">
        <button
          onClick={() => handleSendMessage('Do you have openings tomorrow for skin consultation?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap active:scale-95 transition-all text-emerald-300 cursor-pointer"
        >
          📅 {t('appointments.bookAppointment', 'Book Appointment')}
        </button>
        <button
          onClick={() => handleSendMessage('What are your consultation charges and fees?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap active:scale-95 transition-all text-amber-300 cursor-pointer"
        >
          💰 {t('payments.title', 'Inquire Fees')}
        </button>
        <button
          onClick={() => handleSendMessage('Where is your clinic located and what are your timings?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap active:scale-95 transition-all text-sky-300 cursor-pointer"
        >
          📍 Timings & Location
        </button>
        <button
          onClick={() => handleSendMessage('I want to speak with a human agent please.')}
          className="px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 whitespace-nowrap active:scale-95 transition-all text-purple-300 cursor-pointer"
        >
          🙋 {t('inbox.humanAgent', 'Request Human')}
        </button>
        {handlingMode === 'HUMAN' && (
          <button
            onClick={() => handleSendMessage('restart')}
            className="px-2.5 py-1.5 rounded-full bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600 text-emerald-200 whitespace-nowrap active:scale-95 transition-all font-semibold cursor-pointer"
          >
            🤖 {t('inbox.aiMode', 'Resume AI')}
          </button>
        )}
      </div>

      {/* Mode Indicator Banner */}
      <div className="w-full max-w-sm mb-2 flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">{t('common.status', 'Mode')}:</span>
          {handlingMode === 'AI' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Bot className="w-3 h-3" />
              {t('inbox.aiHandledBadge', 'Automated AI Assistant')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <UserCheck className="w-3 h-3" />
              {t('inbox.humanHandledBadge', 'Handed Over to Human Staff')}
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
                  {isTyping ? (
                    <span className="text-emerald-200 animate-pulse font-medium">{t('simulator.typing', 'typing...')}</span>
                  ) : (
                    <span>{t('simulator.online', 'online')}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-emerald-100">
              <Video className="w-4 h-4 cursor-pointer hover:text-white" />
              <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
              <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[radial-gradient(#075e5410_1px,transparent_1px)] [background-size:16px_16px]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'customer' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs shadow-xs leading-relaxed relative ${
                    m.sender === 'customer'
                      ? 'bg-[#E7FFDB] text-slate-900 rounded-tr-none'
                      : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{renderMessageContent(m.text)}</div>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                    <span>{m.time}</span>
                    {m.sender === 'customer' && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                  </div>
                </div>

                {/* Inline Quick Action Buttons for latest AI message */}
                {m.sender === 'ai' && idx === messages.length - 1 && m.quickActions && m.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[88%]">
                    {m.quickActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSendMessage(action)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 active:scale-95 shadow-xs transition-all cursor-pointer"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-slate-500 border border-slate-200/60 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">Apex AI typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Suggestions Bar above input */}
          {!isTyping && activeQuickActions.length > 0 && (
            <div className="px-2.5 py-1.5 bg-[#E6E2DC] flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-300/40">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 shrink-0">Quick:</span>
              {activeQuickActions.slice(0, 3).map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(act)}
                  className="px-2 py-0.5 rounded-md bg-white text-slate-800 text-[10px] font-medium border border-slate-300 hover:bg-slate-100 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {act}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2 bg-[#F0F2F5] flex items-center gap-2 border-t border-slate-200"
          >
            <Smile className="w-5 h-5 text-slate-500 cursor-pointer" />
            <Paperclip className="w-4 h-4 text-slate-500 cursor-pointer" />
            <input
              type="text"
              placeholder={t('simulator.sendPlaceholder', 'Message WhatsApp Bot...')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none border border-slate-300 shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center hover:bg-[#075E54] active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
