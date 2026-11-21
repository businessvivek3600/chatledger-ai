'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  MessageSquare,
  Plus,
  Tag,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';

export default function CustomersDirectoryPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await apiRequest<any[]>(`/customers${search ? `?search=${search}` : ''}`);
      setCustomers(res);
      if (res.length > 0 && !selectedCustomer) {
        loadCustomerDetail(res[0].id);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerDetail = async (id: string) => {
    try {
      const detail = await apiRequest(`/customers/${id}`);
      setSelectedCustomer(detail);
    } catch (err) {
      console.error('Failed to load customer detail', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#356AE6]" />
            Customers 360° Directory
          </h1>
          <p className="text-xs text-[#707B8B]">
            Unified customer profiles, visit history, lifetime value, and WhatsApp engagement.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E6EAF0] bg-white shadow-xs focus:outline-none focus:border-[#356AE6]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Customer List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E6EAF0] shadow-xs divide-y divide-[#F2F4F7] overflow-hidden">
          {customers.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#98A2B3]">
              No customers found.
            </div>
          ) : (
            customers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => loadCustomerDetail(c.id)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-[#F2F4F7] border-l-2 border-[#356AE6]' : 'hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E6EAF0] text-[#243B5A] font-bold text-xs flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#202938]">{c.name}</div>
                      <div className="text-[11px] text-[#707B8B]">{c.phone}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#23865B] block">
                      {formatCurrency(c.lifetimeValue || 0)}
                    </span>
                    <span className="text-[10px] text-[#98A2B3]">
                      {c._count?.appointments || 0} visits
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Customer 360 Detail View */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E6EAF0] shadow-xs p-5 space-y-5">
          {selectedCustomer ? (
            <>
              {/* Profile Card */}
              <div className="flex items-start justify-between pb-3 border-b border-[#E6EAF0]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#243B5A] text-white font-bold text-sm flex items-center justify-center">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#202938]">
                      {selectedCustomer.name}
                    </h2>
                    <div className="text-xs text-[#707B8B] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#98A2B3]" />
                        {selectedCustomer.phone}
                      </span>
                      <span>•</span>
                      <span>Type: <strong className="text-[#356AE6]">{selectedCustomer.type}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#707B8B] block font-medium">Lifetime Value</span>
                  <span className="text-base font-bold text-[#23865B]">
                    {formatCurrency(selectedCustomer.lifetimeValue || 0)}
                  </span>
                </div>
              </div>

              {/* Appointments Timeline */}
              <div>
                <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#243B5A]" />
                  Appointment History
                </h3>
                {selectedCustomer.appointments?.length === 0 ? (
                  <div className="text-xs text-[#98A2B3] p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0]">
                    No past appointments recorded.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.appointments?.map((apt: any) => (
                      <div
                        key={apt.id}
                        className="p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0] text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-[#202938]">{apt.service?.name}</div>
                          <div className="text-[11px] text-[#707B8B]">
                            {new Date(apt.scheduledAt).toLocaleDateString()} at{' '}
                            {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#23865B] bg-[#23865B]/10 px-2 py-0.5 rounded border border-[#23865B]/20">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Requests & Invoices */}
              <div>
                <h3 className="text-xs font-bold text-[#202938] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#356AE6]" />
                  Payments & Invoices
                </h3>
                {selectedCustomer.paymentRequests?.length === 0 ? (
                  <div className="text-xs text-[#98A2B3] p-3 bg-[#F7F8FA] rounded-lg border border-[#E6EAF0]">
                    No invoices generated yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.paymentRequests?.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/pay/${p.id}`}
                        target="_blank"
                        className="p-3 bg-[#F7F8FA] hover:bg-[#F2F4F7] rounded-lg border border-[#E6EAF0] text-xs flex items-center justify-between transition-colors block"
                      >
                        <div>
                          <div className="font-bold text-[#202938]">
                            {p.invoiceNumber || 'INV'} - {p.description}
                          </div>
                          <div className="text-[11px] text-[#707B8B]">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#202938] block">
                            {formatCurrency(p.amount)}
                          </span>
                          <span className="text-[10px] font-bold text-[#23865B] uppercase bg-[#23865B]/10 px-2 py-0.5 rounded border border-[#23865B]/20">
                            {p.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-xs text-[#98A2B3]">
              Select a customer to inspect 360° timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
