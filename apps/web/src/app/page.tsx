'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Bot,
  Calendar,
  Zap,
  TrendingUp,
  CreditCard,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  PhoneCall,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  Play,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function MarketingHomePage() {
  // Interactive Live AI Demo on Hero
  const [demoInput, setDemoInput] = useState('');
  const [demoMessages, setDemoMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'user',
      text: 'Hi! Do you have any dermatologist appointments open tomorrow afternoon?',
    },
    {
      sender: 'ai',
      text: 'Hello! Yes, Dr. Ananya Roy (Dermatologist) has openings tomorrow at 2:30 PM, 3:30 PM, and 4:15 PM at our Andheri clinic. The consultation fee is ₹1,200. Would you like me to reserve the 2:30 PM slot for you?',
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Interactive ROI Calculator State
  const [monthlyInquiries, setMonthlyInquiries] = useState(600);
  const [avgDealValue, setAvgDealValue] = useState(2500);

  const estimatedConverted = Math.round(monthlyInquiries * 0.18);
  const estimatedRevenue = estimatedConverted * avgDealValue;
  const hoursSavedPerMonth = Math.round(monthlyInquiries * 0.25);

  const handleSendDemo = () => {
    if (!demoInput.trim()) return;
    const userText = demoInput;
    setDemoMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setDemoInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = "Thank you for asking! I'm your 24/7 ChatLedger AI assistant. I can check real-time doctor availability, qualify leads, generate GST invoices, and track UPI payment receipts directly inside WhatsApp.";
      const lower = userText.toLowerCase();
      if (lower.includes('price') || lower.includes('cost')) {
        reply = "Our standard consultation is ₹800 - ₹1,200, which includes a digital prescription, invoice, and 7-day follow-up. Would you like me to book a slot and send a UPI payment link?";
      } else if (lower.includes('book') || lower.includes('yes') || lower.includes('slot')) {
        reply = "Great! I have reserved your 2:30 PM slot tomorrow. A confirmation WhatsApp with invoice, calendar invite, and UPI QR link has been sent to your phone! 🎉";
      } else if (lower.includes('human') || lower.includes('agent')) {
        reply = "Understood! I've notified our front desk and Mrs. Pooja from reception has taken over this chat. She will call you shortly.";
      }

      setDemoMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      setIsAiTyping(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-slate-900 text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-teal-500/30">
          NEW
        </span>
        <span>ChatLedger AI: Real-Time Appointment Booking, Invoicing & UPI Ledger on WhatsApp!</span>
        <Link href="/auth/register" className="underline font-semibold hover:text-teal-300 ml-1">
          Start 14-Day Free Trial →
        </Link>
      </div>

      {/* 2. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-900/10 font-bold text-sm">
              CL
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                ChatLedger<span className="text-teal-600">.AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider text-teal-800 uppercase bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                WhatsApp Operations & UPI Ledger
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-slate-900 transition-colors">Solutions</a>
            <a href="#roi-calculator" className="hover:text-slate-900 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <Link href="/whatsapp-simulator" className="text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Live WhatsApp Simulator
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Next-Gen WhatsApp AI Operations, Bookings & UPI Invoices
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
                Turn Every WhatsApp Conversation Into a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                  Business Opportunity.
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Replace slow manual replies and chaotic personal chats. ChatLedger AI combines an intelligent, business-trained AI assistant, shared team inbox, CRM pipelines, collision-free appointment booking, and Razorpay UPI payments into one unified platform.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/auth/register"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-base shadow-lg shadow-slate-900/15 hover:bg-slate-800 hover:shadow-slate-900/25 transition-all flex items-center gap-2"
                >
                  Start 14-Day Free Trial
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>

                <Link
                  href="/whatsapp-simulator"
                  className="px-6 py-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold text-base hover:bg-emerald-100/80 transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  Test Live Simulator
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Official Meta Cloud API
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Strict Tenant Isolation
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Razorpay UPI & GST Ready
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive WhatsApp AI Assistant Demonstration */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm rounded-[2.5rem] bg-slate-950 p-4 shadow-2xl border-4 border-slate-800">
                {/* Phone Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-950 mr-3"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                </div>

                {/* Phone Screen Container */}
                <div className="relative rounded-[2rem] overflow-hidden bg-slate-100 flex flex-col h-[520px]">
                  {/* WhatsApp Header */}
                  <div className="bg-[#075E54] text-white pt-8 pb-3 px-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs text-white">
                        AI
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight flex items-center gap-1">
                          Apex Clinic Assistant
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                        </div>
                        <div className="text-[10px] text-emerald-100">Official Business Account</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-700/60 px-2 py-0.5 rounded text-white font-medium">
                      24/7 Active
                    </span>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#E5DDD5]">
                    <div className="text-center my-1">
                      <span className="text-[10px] bg-amber-100/90 text-amber-900 px-2.5 py-1 rounded shadow-xs">
                        🔒 Verified End-to-End Encrypted WhatsApp
                      </span>
                    </div>

                    {demoMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-xs shadow-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none'
                              : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/50'
                          }`}
                        >
                          {msg.text}
                          <div className="text-[9px] text-slate-400 text-right mt-1">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-lg px-3 py-2 text-[11px] text-slate-500 rounded-tl-none shadow-xs flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                          <span>Dr. Apex AI is typing...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Demo Input */}
                  <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a test message (e.g., 'What are the charges?')..."
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendDemo()}
                      className="flex-1 text-xs px-3 py-2 rounded-full border border-slate-300 focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      onClick={handleSendDemo}
                      className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center hover:bg-[#075E54] transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE PLATFORM CAPABILITIES */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-wider text-sky-600 uppercase">
              Engineered for Real Operations
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything Your Business Needs to Grow on WhatsApp
            </p>
            <p className="mt-3 text-base text-slate-600">
              Not another basic chatbot. ChatLedger AI integrates directly with your business workflow, calendars, and accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">RAG AI Assistant</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Trained on your PDFs, service lists, prices, and FAQs. Understands natural language, qualifies leads, and triggers validated actions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3-Column Team Inbox</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Shared WhatsApp inbox with agent assignment, internal team notes, customer 360-degree timeline, and seamless human handover.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Collision-Free Booking</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Transactional slot reservations prevent double bookings. Automated WhatsApp reminders reduce client no-shows by up to 65%.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Visual Workflow Builder</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Drag-and-drop triggers, conditions, delays, and actions. Automate follow-up reminders, tag leads, and alert staff effortlessly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Complete CRM Pipeline</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Kanban and table views track prospects from New to Converted. Automatically extracts budgets and requirements from chat.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Razorpay & GST Invoicing</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Generate 1-click UPI and card payment links. Automatically issue 18% GST invoices and receipt notifications in WhatsApp.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Staff RBAC & Permissions</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Invite receptionists, sales agents, and managers. Assign specific permissions, track response times, and monitor conversions.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tenant Data Isolation</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Enterprise-grade architecture ensures every business workspace, document chunk, and customer record is strictly isolated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INDUSTRY SPECIFIC PRESETS */}
      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
              Tailored Industry Solutions
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pre-Configured for Your Specific Business Model
            </p>
            <p className="mt-3 text-base text-slate-600">
              Select your industry during onboarding and ChatLedger AI instantly configures pre-built services, knowledge bases, and AI personality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Industry 1: Clinics & Healthcare */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  🏥
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Clinics & Healthcare</h3>
                  <div className="text-xs text-slate-500">OPD & Specialist Centers</div>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Doctor schedule & OPD slot booking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Prescription & blood report follow-ups
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Automated appointment reminder notifications
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Launch Clinic Workspace →
              </Link>
            </div>

            {/* Industry 2: Salons & Beauty */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  💇‍♀️
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Salons & Beauty Studios</h3>
                  <div className="text-xs text-slate-500">Hair, Spa & Aesthetics</div>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                  Service menu with dynamic duration calculation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                  Bridal makeup inquiries & deposit collection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                  Monthly repeat pampering reminder broadcasts
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1"
              >
                Launch Salon Workspace →
              </Link>
            </div>

            {/* Industry 3: Coaching & Education */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  🎓
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Coaching & Education</h3>
                  <div className="text-xs text-slate-500">Institutes, Academies & Tutors</div>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Complimentary demo class registration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Course syllabus & fee installment queries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Parent updates & fee payment reminders
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                Launch Coaching Workspace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE ROI CALCULATOR */}
      <section id="roi-calculator" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Data-Driven ROI
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Calculate How Much Revenue You Leave on the Table.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                68% of customers buy from the business that responds first on WhatsApp. When your AI assistant responds in under 2 seconds 24/7, your conversion rates skyrocket.
              </p>

              <div className="pt-4 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Monthly WhatsApp Inquiries</span>
                    <span className="text-emerald-400 font-bold">{monthlyInquiries} inquiries</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={monthlyInquiries}
                    onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Average Value Per Customer / Booking</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(avgDealValue)}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="25000"
                    step="250"
                    value={avgDealValue}
                    onChange={(e) => setAvgDealValue(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* ROI Results Card */}
            <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                Estimated Monthly Value Unlocked
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Extra Bookings/Month</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">+{estimatedConverted}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">at 18% AI conversion</div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Staff Hours Saved</div>
                  <div className="text-2xl font-black text-sky-400 mt-1">{hoursSavedPerMonth} hrs</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">~{Math.round(hoursSavedPerMonth / 8)} workdays</div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Average Response</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">1.8 sec</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">24 hours / 7 days</div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-transparent border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-emerald-400">Projected New Monthly Revenue:</div>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    {formatCurrency(estimatedRevenue)}
                  </div>
                </div>
                <Link
                  href="/auth/register"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
                >
                  Claim Your Growth →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING PLANS */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-wider text-sky-600 uppercase">
              Transparent SaaS Pricing
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple, Predictable Plans for Growing Teams
            </p>
            <p className="mt-3 text-base text-slate-600">
              No hidden surcharges. All plans include official Meta WhatsApp Cloud API connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">Starter</div>
                <div className="text-xs text-slate-500 mt-1">For single-location businesses & boutiques</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₹1,999</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    1 WhatsApp Phone Number
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    5 Team Members
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    2,000 AI Conversations / mo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Collision-Free Appointment Engine
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    10 Active Visual Automations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Razorpay UPI Payment Links
                  </li>
                </ul>
              </div>

              <Link
                href="/auth/register"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-white rounded-2xl p-8 border-2 border-sky-600 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular for Clinics & Salons
              </div>

              <div>
                <div className="text-sm font-bold text-slate-900">Growth</div>
                <div className="text-xs text-slate-500 mt-1">For multi-specialist practices & agencies</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₹4,999</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    2 WhatsApp Phone Numbers
                  </li>
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    15 Team Members
                  </li>
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    10,000 AI Conversations / mo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    Custom RAG Knowledge Base (PDF, URLs, FAQs)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    Visual Workflow Builder (25 Workflows)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    Bulk WhatsApp Broadcast Campaigns
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    GST-Compliant Automated Invoicing
                  </li>
                </ul>
              </div>

              <Link
                href="/auth/register"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 transition-colors shadow-sm"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">Professional</div>
                <div className="text-xs text-slate-500 mt-1">High-volume enterprises & multi-branch groups</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₹9,999</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    5 WhatsApp Phone Numbers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    35 Team Seats
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    35,000 AI Conversations / mo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Unlimited Visual Automations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Custom Webhooks & Google Calendar Sync
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Dedicated Priority Account Manager
                  </li>
                </ul>
              </div>

              <Link
                href="/auth/register"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-wider text-sky-600 uppercase">
              Got Questions?
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Does this use the official WhatsApp Cloud API?</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Yes. ChatLedger AI integrates with Meta’s official WhatsApp Cloud API. Your business account avoids arbitrary number bans, gets green-badge verification eligibility, and enjoys high-speed enterprise message delivery.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Can our staff jump into conversations when needed?</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Absolutely. With 1 click in the 3-column team inbox, any agent can switch a conversation from AI Mode to Human Mode. When human mode is active, automatic AI replies pause immediately while preserving the full chat history.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">How does the AI know our clinic/salon prices and timings?</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                You configure your working hours, services, and upload your FAQs/PDFs in your Knowledge Base. ChatLedger uses semantic RAG embeddings to retrieve exact answers and never hallucinates unconfirmed prices or bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="py-20 bg-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Automate Your WhatsApp Operations?
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Join hundreds of forward-thinking clinics, salons, coaching institutes, and local service providers streamlining customer management with ChatLedger AI.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all shadow-lg shadow-emerald-500/20"
            >
              Start Free 14-Day Trial Now
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base transition-all"
            >
              Log In to Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* 10. SAAS FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-sm font-bold text-white mb-3">ChatLedger AI</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enterprise-grade WhatsApp-first AI operations, booking automation, and lead management SaaS.
            </p>
          </div>
          <div>
            <div className="text-sm font-bold text-white mb-3">Product</div>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white">Shared Team Inbox</a></li>
              <li><a href="#features" className="hover:text-white">RAG AI Assistant</a></li>
              <li><a href="#features" className="hover:text-white">Visual Automations</a></li>
              <li><a href="#pricing" className="hover:text-white">SaaS Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold text-white mb-3">Portals</div>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="hover:text-white">Business Owner Login</Link></li>
              <li><Link href="/workspace" className="hover:text-white">Employee Workspace</Link></li>
              <li><Link href="/admin" className="hover:text-white">Super Admin Console</Link></li>
              <li><Link href="/whatsapp-simulator" className="hover:text-white">WhatsApp Simulator</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold text-white mb-3">Compliance & Trust</div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Official Meta Business Solution Provider partner architecture. Designed with Indian DPDP and GST invoicing guidelines.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-slate-500">
          © {new Date().getFullYear()} ChatLedger AI Platforms Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
