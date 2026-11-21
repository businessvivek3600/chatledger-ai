'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  ExternalLink,
  Receipt,
  AlertCircle,
  X,
  ShieldCheck,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';
import { PaymentStatus } from '@nexaflow/shared-types';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const [payments, setPayments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [subtotal, setSubtotal] = useState('1200');
  const [description, setDescription] = useState('Consultation & Medical Prescription');
  const [includeGst, setIncludeGst] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayments = async () => {
    try {
      const [pays, custs] = await Promise.all([
        apiRequest<any[]>('/payments/requests'),
        apiRequest<any[]>('/customers'),
      ]);
      setPayments(pays);
      setCustomers(custs);
      if (custs.length > 0) setSelectedCustomerId(custs[0].id);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !subtotal) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/payments/requests', {
        method: 'POST',
        body: JSON.stringify({
          customerId: selectedCustomerId,
          subtotal: parseFloat(subtotal),
          description,
          includeGst,
          sendViaWhatsApp: sendWhatsApp,
        }),
      });

      setIsModalOpen(false);
      fetchPayments();
    } catch (err: any) {
      alert(`Failed to create payment link: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCollected = payments
    .filter((p) => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === PaymentStatus.PENDING)
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#243B5A]" />
            {t('payments.title', 'Customer Payments & GST Invoicing Ledger')}
          </h1>
          <p className="text-xs text-[#707B8B]">
            {t('payments.subtitle', 'Automated Razorpay UPI payment links with 18% GST calculation, receipt delivery on WhatsApp, and ledger accounting.')}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          {t('payments.generateUpiLink', 'Generate UPI Link')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="text-[10px] font-bold text-[#707B8B] uppercase tracking-wider">
            {t('payments.totalRevenue', 'Total Revenue Collected')}
          </div>
          <div className="text-xl font-bold text-[#23865B] mt-1">
            {formatCurrency(totalCollected)}
          </div>
          <div className="text-[11px] text-[#707B8B] mt-0.5">
            Verified via Razorpay Webhooks
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="text-[10px] font-bold text-[#707B8B] uppercase tracking-wider">
            {t('payments.pendingLinks', 'Pending Payment Links')}
          </div>
          <div className="text-xl font-bold text-[#B98535] mt-1">
            {formatCurrency(totalPending)}
          </div>
          <div className="text-[11px] text-[#707B8B] mt-0.5">
            Active WhatsApp customer payment links
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="text-[10px] font-bold text-[#707B8B] uppercase tracking-wider">
            {t('payments.taxCompliance', 'Tax Compliance')}
          </div>
          <div className="text-xl font-bold text-[#243B5A] mt-1">18% GST Invoicing</div>
          <div className="text-[11px] text-[#707B8B] mt-0.5">
            {t('payments.taxSubtitle', 'Instant GST invoice receipts for patient records')}
          </div>
        </div>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-white rounded-xl border border-[#E6EAF0] shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-[#E6EAF0] flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
            {t('payments.transactionsHeader', 'UPI Transactions & Invoices')}
          </h3>
          <span className="text-[11px] bg-[#F7F8FA] border border-[#E6EAF0] px-2.5 py-0.5 rounded-md font-semibold text-[#707B8B]">
            {payments.length} {t('common.actions', 'Transactions')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] text-[#707B8B] font-bold border-b border-[#E6EAF0] uppercase text-[10px]">
              <tr>
                <th className="p-3.5">{t('payments.invoiceNumber', 'Invoice #')}</th>
                <th className="p-3.5">{t('common.customer', 'Customer')}</th>
                <th className="p-3.5">{t('payments.description', 'Description')}</th>
                <th className="p-3.5">{t('common.amount', 'Amount')} (INR)</th>
                <th className="p-3.5">{t('common.status', 'Status')}</th>
                <th className="p-3.5">{t('payments.paymentLink', 'Payment Link')}</th>
                <th className="p-3.5 text-right">{t('common.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EAF0]">
              {payments.map((p) => {
                const isPaid = p.status === PaymentStatus.PAID;
                return (
                  <tr key={p.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="p-3.5 font-mono text-[11px] font-bold text-[#202938]">
                      {p.invoiceNumber || 'INV-DRAFT'}
                    </td>
                    <td className="p-3.5 font-bold text-[#202938]">
                      {p.customer?.name}
                      <div className="text-[10px] text-[#707B8B] font-normal">
                        {p.customer?.phone}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#707B8B] max-w-xs truncate">
                      {p.description}
                    </td>
                    <td className="p-3.5 font-extrabold text-[#202938]">
                      {formatCurrency(p.amount)}
                      {p.invoice?.taxGst > 0 && (
                        <span className="block text-[10px] text-[#707B8B] font-normal">
                          incl. ₹{p.invoice.taxGst} GST
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-[#23865B]/10 text-[#23865B] border border-[#23865B]/20'
                            : 'bg-[#B98535]/10 text-[#B98535] border border-[#B98535]/20'
                        }`}
                      >
                        {isPaid ? t('payments.paidBadge', 'PAID') : t('payments.pendingBadge', 'PENDING')}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-[#356AE6]">
                      {p.paymentUrl ? (
                        <Link
                          href={`/pay/${p.id}`}
                          target="_blank"
                          className="hover:underline flex items-center gap-1 font-semibold"
                        >
                          Checkout Link <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-[#98A2B3]">—</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {p.paymentUrl && !isPaid && (
                        <button
                          onClick={() => alert(`WhatsApp link shared with ${p.customer?.phone}`)}
                          className="p-1.5 text-[#356AE6] hover:bg-[#356AE6]/10 rounded-lg transition-colors inline-block"
                          title="Resend payment link on WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate UPI Link */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-[#E6EAF0] max-w-md w-full p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6EAF0]">
              <h2 className="text-sm font-bold text-[#202938]">
                {t('payments.generateUpiLink', 'Generate UPI & Card Payment Link')}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#707B8B] hover:text-[#202938]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#202938] block mb-1">{t('common.customer', 'Customer')} *</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6] bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#202938] block mb-1">{t('common.amount', 'Amount')} (₹ INR) *</label>
                <input
                  type="number"
                  required
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                  className="w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938] block mb-1">{t('payments.description', 'Description')}</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGst}
                    onChange={(e) => setIncludeGst(e.target.checked)}
                    className="rounded text-[#356AE6]"
                  />
                  <span className="font-semibold text-[#202938]">Apply 18% GST (Tax Compliance)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendWhatsApp}
                    onChange={(e) => setSendWhatsApp(e.target.checked)}
                    className="rounded text-[#356AE6]"
                  />
                  <span className="font-semibold text-[#202938]">Send link immediately to WhatsApp</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6EAF0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#E6EAF0] hover:bg-[#F7F8FA] text-[#707B8B] font-semibold text-xs"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs disabled:opacity-50"
                >
                  {isSubmitting ? t('common.creating', 'Generating...') : t('payments.generateUpiLink', 'Generate Link')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
