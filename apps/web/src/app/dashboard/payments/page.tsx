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

export default function PaymentsPage() {
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
      setDescription('');
      fetchPayments();
    } catch (err: any) {
      alert(`Error generating payment link: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await apiRequest(`/payments/requests/${id}/mark-paid`, {
        method: 'PATCH',
      });
      fetchPayments();
    } catch (err) {
      console.error('Failed to mark payment paid', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const totalCollected = payments
    .filter((p) => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === PaymentStatus.PENDING)
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#23865B]" />
            Customer Payments & GST Invoicing Ledger
          </h1>
          <p className="text-xs text-[#707B8B]">
            Automated Razorpay UPI payment links with 18% GST calculation, receipt delivery on WhatsApp, and ledger accounting.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          Generate UPI Link
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E6EAF0] shadow-xs">
          <div className="text-[10px] font-bold text-[#707B8B] uppercase tracking-wider">
            Total Revenue Collected
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
            Pending Payment Links
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
            Tax Compliance
          </div>
          <div className="text-xl font-bold text-[#243B5A] mt-1">18% GST Invoicing</div>
          <div className="text-[11px] text-[#707B8B] mt-0.5">
            Instant GST invoice receipts for patient records
          </div>
        </div>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-white rounded-xl border border-[#E6EAF0] shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-[#E6EAF0] flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider">
            UPI Transactions & Invoices
          </h3>
          <span className="text-[11px] bg-[#F7F8FA] border border-[#E6EAF0] px-2.5 py-0.5 rounded-md font-semibold text-[#707B8B]">
            {payments.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Amount (INR)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Payment Link</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => {
                const isPaid = p.status === PaymentStatus.PAID;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">
                      {p.invoiceNumber || 'INV-DRAFT'}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {p.customer?.name}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {p.customer?.phone}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">
                      {p.description}
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      {formatCurrency(p.amount)}
                      {p.invoice?.taxGst > 0 && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          incl. ₹{p.invoice.taxGst} GST
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Link
                        href={`/pay/${p.id}`}
                        target="_blank"
                        className="text-[#356AE6] hover:text-[#243B5A] font-semibold flex items-center gap-1.5 bg-[#356AE6]/10 hover:bg-[#356AE6]/20 px-2.5 py-1 rounded-md text-[11px] w-fit border border-[#356AE6]/20 transition-all shadow-xs"
                      >
                        <CreditCard className="w-3 h-3 text-[#356AE6]" />
                        Razorpay Portal <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </td>
                    <td className="p-3.5 text-right">
                      {!isPaid && (
                        <button
                          onClick={() => handleMarkPaid(p.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs transition-all"
                        >
                          Mark Paid
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

      {/* ======================================================== */}
      {/* MODAL: GENERATE PAYMENT REQUEST */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Generate Razorpay Payment Link</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Customer *</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Subtotal Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="1200"
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Item Description / Service</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGst}
                    onChange={(e) => setIncludeGst(e.target.checked)}
                    className="rounded text-sky-600 mr-2"
                  />
                  Calculate 18% GST automatically (+₹{Math.round(Number(subtotal || 0) * 0.18)})
                </label>

                <label className="flex items-center text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendWhatsApp}
                    onChange={(e) => setSendWhatsApp(e.target.checked)}
                    className="rounded text-sky-600 mr-2"
                  />
                  Send payment link immediately to customer on WhatsApp
                </label>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Total Invoice Amount:</span>
                <span className="font-black text-base text-slate-900">
                  {formatCurrency(Number(subtotal || 0) + (includeGst ? Math.round(Number(subtotal || 0) * 0.18) : 0))}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Payment Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
