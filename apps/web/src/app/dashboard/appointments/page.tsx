'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { formatCurrency } from '../../../lib/utils';
import { AppointmentStatus } from '@nexaflow/shared-types';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  );
  const [selectedSlotTime, setSelectedSlotTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Add Service Modal
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('1000');
  const [newServiceDuration, setNewServiceDuration] = useState('30');

  const fetchData = async () => {
    try {
      const [appts, srvs, custs] = await Promise.all([
        apiRequest<any[]>('/appointments'),
        apiRequest<any[]>('/appointments/services'),
        apiRequest<any[]>('/customers'),
      ]);
      setAppointments(appts);
      setServices(srvs);
      setCustomers(custs);
      if (custs.length > 0) setSelectedCustomerId(custs[0].id);
      if (srvs.length > 0) setSelectedServiceId(srvs[0].id);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedServiceId) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedSlotTime}:00`);

      await apiRequest('/appointments/book', {
        method: 'POST',
        body: JSON.stringify({
          customerId: selectedCustomerId,
          serviceId: selectedServiceId,
          scheduledAt: scheduledAt.toISOString(),
          notes,
        }),
      });

      setIsBookModalOpen(false);
      setNotes('');
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Double booking collision detected or invalid slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    try {
      await apiRequest('/appointments/services', {
        method: 'POST',
        body: JSON.stringify({
          name: newServiceName,
          price: newServicePrice,
          durationMinutes: newServiceDuration,
        }),
      });
      setIsAddServiceOpen(false);
      setNewServiceName('');
      fetchData();
    } catch (err) {
      console.error('Failed to create service', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await apiRequest(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

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
            <Calendar className="w-5 h-5 text-[#356AE6]" />
            Appointments & Doctor Schedule
          </h1>
          <p className="text-xs text-[#707B8B]">
            Real-time bookings synchronized with WhatsApp AI assistant with collision prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddServiceOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-[#E6EAF0] hover:bg-[#F7F8FA] font-semibold text-xs text-[#202938] transition-colors shadow-xs"
          >
            + Add Service
          </button>
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#243B5A] hover:bg-[#1A2B42] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            Book Slot
          </button>
        </div>
      </div>

      {/* Services Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {services.map((srv) => (
          <div key={srv.id} className="bg-white p-3.5 rounded-xl border border-[#E6EAF0] shadow-xs">
            <div className="text-xs font-bold text-[#202938]">{srv.name}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2F4F7]">
              <span className="text-xs font-bold text-[#23865B]">
                {formatCurrency(srv.price)}
              </span>
              <span className="text-[11px] text-[#707B8B] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#98A2B3]" />
                {srv.durationMinutes} mins
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Confirmed & Scheduled Appointments
          </h3>
          <span className="text-xs bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-700">
            {appointments.length} Bookings
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No upcoming appointments.
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 font-bold text-xs flex flex-col items-center justify-center flex-shrink-0 border border-blue-100">
                    <span>{new Date(apt.scheduledAt).getDate()}</span>
                    <span className="text-[9px] uppercase">
                      {new Date(apt.scheduledAt).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{apt.customer?.name}</h4>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {apt.customer?.phone}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-semibold mt-0.5">
                      {apt.service?.name} ({apt.durationMinutes} mins)
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(apt.scheduledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(apt.endAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>•</span>
                      <span>Assigned: {apt.assignedUser?.fullName || 'Reception Desk'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      apt.status === AppointmentStatus.CONFIRMED
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === AppointmentStatus.COMPLETED
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {apt.status}
                  </span>

                  <select
                    value={apt.status}
                    onChange={(e) => handleUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                    className="text-xs rounded-xl border border-slate-300 py-1 px-2 bg-white"
                  >
                    <option value={AppointmentStatus.CONFIRMED}>Confirmed</option>
                    <option value={AppointmentStatus.COMPLETED}>Completed</option>
                    <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
                    <option value={AppointmentStatus.NO_SHOW}>No Show</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: BOOK APPOINTMENT */}
      {/* ======================================================== */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Book Client Appointment</h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Patient / Customer *</label>
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
                <label className="font-semibold text-slate-700">Service Category *</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {formatCurrency(s.price)} ({s.durationMinutes} mins)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Date *</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Slot Time *</label>
                  <input
                    type="time"
                    required
                    value={selectedSlotTime}
                    onChange={(e) => setSelectedSlotTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Notes / Symptoms</label>
                <textarea
                  rows={2}
                  placeholder="Routine follow-up or consultation details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Checking Collision...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD SERVICE */}
      {/* ======================================================== */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Service to Menu</h3>
              <button onClick={() => setIsAddServiceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pediatric Consultation"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Fee / Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
