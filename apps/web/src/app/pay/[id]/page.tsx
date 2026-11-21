'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  QrCode,
  Smartphone,
  CreditCard,
  Building,
  ChevronDown,
  ChevronUp,
  Receipt,
  Download,
  Check,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';
import ChatLedgerLogo from '../../../components/ChatLedgerLogo';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useLanguage } from '../../../i18n/LanguageContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export default function RazorpayCheckoutPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const paymentId = (params?.id as string) || 'apex_demo_pay';

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<'upi_apps' | 'upi_qr' | 'card' | 'netbanking'>('upi_apps');
  const [selectedApp, setSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiId, setUpiId] = useState('sunita.menon@okhdfcbank');
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Payment processing simulation
  const [processingState, setProcessingState] = useState<'idle' | 'authorizing' | 'success'>('idle');
  const [transactionRef, setTransactionRef] = useState<string>('');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/payments/public/request/${paymentId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setPayment(json.data);
          if (json.data.status === 'PAID') {
            setProcessingState('success');
            setTransactionRef(json.data.razorpayPaymentId || `pay_rzp_${Date.now().toString(36)}`);
          }
        } else {
          // Fallback demo payment
          setPayment({
            id: paymentId,
            amount: 1416,
            description: 'Consultation & Comprehensive Blood Panel for Sunita Menon',
            invoiceNumber: 'INV-2026-APX-0104',
            status: 'PENDING',
            customer: { name: 'Sunita Menon', phone: '+91 98334 45566', email: 'sunita.m@outlook.com' },
            tenant: { name: 'Apex Multispecialty Clinic', city: 'Mumbai', phone: '+91 98201 23456' },
            invoice: { subtotal: 1200, taxGst: 216, totalAmount: 1416 },
          });
        }
      } catch (err) {
        // Offline / fallback data
        setPayment({
          id: paymentId,
          amount: 1416,
          description: 'Consultation & Comprehensive Blood Panel for Sunita Menon',
          invoiceNumber: 'INV-2026-APX-0104',
          status: 'PENDING',
          customer: { name: 'Sunita Menon', phone: '+91 98334 45566', email: 'sunita.m@outlook.com' },
          tenant: { name: 'Apex Multispecialty Clinic', city: 'Mumbai', phone: '+91 98201 23456' },
          invoice: { subtotal: 1200, taxGst: 216, totalAmount: 1416 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  const handleSimulatePayment = async () => {
    setProcessingState('authorizing');

    try {
      const res = await fetch(`${API_BASE_URL}/payments/public/request/${paymentId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: selectedMethod.toUpperCase() }),
      });
      const data = await res.json();

      setTimeout(() => {
        setTransactionRef(data.transactionId || `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`);
        setProcessingState('success');
      }, 1400);
    } catch (e) {
      setTimeout(() => {
        setTransactionRef(`pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`);
        setProcessingState('success');
      }, 1400);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C121E] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
          <span className="text-xs text-slate-400">Loading Razorpay Secure Checkout...</span>
        </div>
      </div>
    );
  }

  const subtotal = payment?.invoice?.subtotal || Math.round(payment?.amount / 1.18) || 1200;
  const gst = payment?.invoice?.taxGst || payment?.amount - subtotal || 216;
  const total = payment?.amount || 1416;

  return (
    <div className="min-h-screen bg-[#0C121E] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 font-sans">
      {/* Checkout Container */}
      <div className="w-full max-w-lg bg-[#141C2E] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Razorpay Header */}
        <div className="bg-[#0B2546] border-b border-slate-700/50 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Razorpay Brand Mark */}
            <div className="w-7 h-7 rounded-md bg-[#0D9488] flex items-center justify-center text-white font-black text-xs tracking-wider shadow-sm">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs tracking-tight text-white">
                  Razorpay
                </span>
                <span className="text-[10px] text-teal-300 font-bold bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-500/30">
                  TRUSTED CHECKOUT
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Official Business Gateway • 256-bit SSL Encrypted
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="compact" />
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified
            </div>
          </div>
        </div>

        {/* Merchant & Order Summary Bar */}
        <div className="px-5 py-4 bg-[#182338] border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Paying To:</div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              🏥 {payment?.tenant?.name || 'Apex Multispecialty Clinic'}
            </h2>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Invoice #{payment?.invoiceNumber || 'INV-2026-APX-0104'}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
            <span className="text-xl font-black text-emerald-400">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Expandable Order Breakdown */}
        <div className="bg-[#121927] border-b border-slate-800 px-5 py-2.5 text-xs">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-slate-400 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Receipt className="w-3.5 h-3.5 text-teal-400" />
              Itemized GST Invoice Breakdown
            </span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showBreakdown && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>{payment?.description || 'Medical Consultation & Vitals'}</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Integrated GST (18% IGST)</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800">
                <span>Final Payable (Inclusive of Taxes)</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Payment Section */}
        {processingState === 'idle' && (
          <div className="p-5 space-y-4">
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi_apps')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedMethod === 'upi_apps'
                    ? 'bg-teal-950/60 border-teal-500 text-teal-200 shadow-sm'
                    : 'bg-[#182338] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 mb-2 text-teal-400" />
                <span className="text-xs font-bold block">UPI Apps</span>
                <span className="text-[10px] text-slate-400">GPay, PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('upi_qr')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedMethod === 'upi_qr'
                    ? 'bg-teal-950/60 border-teal-500 text-teal-200 shadow-sm'
                    : 'bg-[#182338] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <QrCode className="w-4 h-4 mb-2 text-teal-400" />
                <span className="text-xs font-bold block">Scan QR</span>
                <span className="text-[10px] text-slate-400">Any UPI app</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedMethod === 'card'
                    ? 'bg-teal-950/60 border-teal-500 text-teal-200 shadow-sm'
                    : 'bg-[#182338] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-2 text-teal-400" />
                <span className="text-xs font-bold block">Cards / Net</span>
                <span className="text-[10px] text-slate-400">Debit, Credit</span>
              </button>
            </div>

            {/* Method Details: UPI Apps */}
            {selectedMethod === 'upi_apps' && (
              <div className="space-y-3 bg-[#182338] p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Select your UPI App to approve payment:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'gpay', name: 'Google Pay', icon: '🟢', vpa: 'sunita.menon@okhdfcbank' },
                    { id: 'phonepe', name: 'PhonePe', icon: '🟣', vpa: '9833445566@ybl' },
                    { id: 'paytm', name: 'Paytm UPI', icon: '🔵', vpa: '9833445566@paytm' },
                    { id: 'bhim', name: 'BHIM UPI', icon: '🟠', vpa: 'sunita@upi' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => {
                        setSelectedApp(app.id as any);
                        setUpiId(app.vpa);
                      }}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                        selectedApp === app.id
                          ? 'bg-teal-900/40 border-teal-400 text-white font-bold'
                          : 'bg-[#141C2E] border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="text-base">{app.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{app.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{app.vpa}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Or enter any UPI Virtual Payment Address (VPA):
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi"
                    className="w-full bg-[#141C2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Method Details: QR Code */}
            {selectedMethod === 'upi_qr' && (
              <div className="bg-[#182338] p-4 rounded-xl border border-slate-800 text-center space-y-3">
                <div className="text-xs font-semibold text-slate-300">
                  Scan this QR code with any UPI app to pay:
                </div>

                <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl flex flex-col items-center justify-center shadow-md relative">
                  {/* Simulated QR Pattern */}
                  <div className="w-full h-full border-4 border-slate-900 p-2 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 bg-slate-900"></div>
                      <div className="w-8 h-8 bg-slate-900"></div>
                    </div>
                    <div className="text-center font-mono font-bold text-slate-900 text-xs">
                      UPI PAY<br />
                      ₹{total}
                    </div>
                    <div className="flex justify-between">
                      <div className="w-8 h-8 bg-slate-900"></div>
                      <div className="w-4 h-4 bg-teal-600 rounded-full mx-auto"></div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  QR code valid for 10:00 minutes
                </div>
              </div>
            )}

            {/* Method Details: Cards */}
            {selectedMethod === 'card' && (
              <div className="bg-[#182338] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4111 •••• •••• 1111"
                    className="w-full bg-[#141C2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Expiry</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full bg-[#141C2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="789"
                      className="w-full bg-[#141C2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm shadow-lg shadow-teal-900/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Lock className="w-4 h-4 text-teal-200" />
              <span>Pay ₹{total.toLocaleString('en-IN')} Securely</span>
            </button>

            <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              Powered by Razorpay • RBI Authorized Payment Aggregator
            </div>
          </div>
        )}

        {/* Processing State: Authorizing */}
        {processingState === 'authorizing' && (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 border-2 border-teal-500 border-t-transparent animate-spin mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6 text-teal-400 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Waiting for UPI PIN Authorization
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                A payment request for ₹{total.toLocaleString('en-IN')} has been sent to <strong>{upiId}</strong>. Please approve on your UPI app.
              </p>
            </div>

            <div className="p-3 bg-[#182338] rounded-xl border border-slate-800 text-[11px] text-slate-300 inline-block">
              Simulating instant bank confirmation...
            </div>
          </div>
        )}

        {/* Success State */}
        {processingState === 'success' && (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/20 animate-scale-in">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                Payment Successful
              </span>
              <h3 className="text-lg font-black text-white mt-2">
                ₹{total.toLocaleString('en-IN')} Paid Successfully
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your payment to {payment?.tenant?.name || 'Apex Multispecialty Clinic'} has been verified and credited.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-[#182338] p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment ID:</span>
                <span className="font-mono text-white font-semibold">{transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-mono text-teal-300 font-semibold">{payment?.invoiceNumber || 'INV-2026-APX-0104'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UPI Ref / RRN:</span>
                <span className="font-mono text-slate-300">611294829104</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="text-white font-medium">UPI ({selectedApp.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paid At:</span>
                <span className="text-slate-300">{new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link
                href="/dashboard/payments"
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors text-center border border-slate-700"
              >
                ← Return to Business Ledger
              </Link>
              <Link
                href="/whatsapp-simulator"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs transition-colors text-center shadow-md flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" />
                View WhatsApp Receipt
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-center text-xs text-slate-500 max-w-sm flex flex-col items-center gap-1.5">
        <ChatLedgerLogo size="xs" inverted showText={true} />
        <span>Official verified checkout session for ChatLedger AI operations.</span>
      </div>
    </div>
  );
}
