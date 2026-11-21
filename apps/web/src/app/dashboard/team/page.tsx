'use client';

import React, { useEffect, useState } from 'react';
import {
  UserPlus,
  Users,
  Shield,
  Plus,
  TrendingUp,
  MessageSquare,
  Calendar,
  X,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { UserRole } from '@nexaflow/shared-types';

export default function TeamManagementPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.APPOINTMENT_MANAGER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await apiRequest<any[]>('/users/team');
      setTeam(res);
    } catch (err) {
      console.error('Failed to load team', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/users/team/invite', {
        method: 'POST',
        body: JSON.stringify({ email, fullName, phone, role }),
      });

      setIsModalOpen(false);
      setEmail('');
      setFullName('');
      setPhone('');
      fetchTeam();
    } catch (err: any) {
      alert(`Invite error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Users className="w-5 h-5 text-[#356AE6]" />
            Team Members & Staff Permissions
          </h1>
          <p className="text-xs text-[#707B8B]">
            Manage staff accounts, role-based access control (RBAC), and employee response performance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-white" />
          Invite Staff Member
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {team.map((m) => (
          <div
            key={m.id}
            className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#243B5A] text-white font-bold text-sm flex items-center justify-center">
                  {m.user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F2F4F7] text-[#243B5A] uppercase border border-[#E6EAF0]">
                  {m.role}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-xs font-bold text-[#202938]">{m.user?.fullName}</h3>
                <div className="text-[11px] text-[#707B8B] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3 text-[#98A2B3]" />
                  {m.user?.email}
                </div>
                {m.user?.phone && (
                  <div className="text-[11px] text-[#707B8B] flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-[#98A2B3]" />
                    {m.user.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="pt-3 border-t border-[#E6EAF0] grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#F7F8FA] p-2 rounded-lg border border-[#E6EAF0]">
                <span className="text-[10px] text-[#707B8B] block font-medium">Leads</span>
                <strong className="text-[#202938] font-bold">{m.performance?.assignedLeads || 0}</strong>
              </div>
              <div className="bg-[#F7F8FA] p-2 rounded-lg border border-[#E6EAF0]">
                <span className="text-[10px] text-[#707B8B] block font-medium">Bookings</span>
                <strong className="text-[#356AE6] font-bold">{m.performance?.assignedAppointments || 0}</strong>
              </div>
              <div className="bg-[#F7F8FA] p-2 rounded-lg border border-[#E6EAF0]">
                <span className="text-[10px] text-[#707B8B] block font-medium">Chats</span>
                <strong className="text-[#23865B] font-bold">{m.performance?.handledConversations || 0}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Invite Member */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#202938]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-lg border border-[#E6EAF0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0]">
              <h3 className="text-sm font-bold text-[#202938]">Invite Staff Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#98A2B3] hover:text-[#202938]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#202938]">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Joshi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:border-[#356AE6] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="meera@apexclinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:border-[#356AE6] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Phone (WhatsApp Number)</label>
                <input
                  type="text"
                  placeholder="+91 98200 44556"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:border-[#356AE6] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Role & Permission Tier</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] bg-white focus:border-[#356AE6] outline-none"
                >
                  <option value={UserRole.APPOINTMENT_MANAGER}>Appointment Manager (Front Desk)</option>
                  <option value={UserRole.CUSTOMER_SUPPORT}>Customer Support Agent</option>
                  <option value={UserRole.SALES_AGENT}>Sales & Lead Agent</option>
                  <option value={UserRole.MANAGER}>Operations Manager</option>
                  <option value={UserRole.BUSINESS_ADMIN}>Business Admin</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E6EAF0] text-xs font-semibold text-[#707B8B] hover:bg-[#F2F4F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs hover:bg-[#1a2d45] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Invite...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
