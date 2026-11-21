'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Lock, Mail, Building2, Phone, ArrowRight, User } from 'lucide-react';
import ChatLedgerLogo from '../../../components/ChatLedgerLogo';
import { apiRequest } from '../../../lib/api';
import { useAuthStore } from '../../../lib/auth-store';
import { IndustryType } from '@nexaflow/shared-types';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [password, setPassword] = useState('');
  const [industry, setIndustry] = useState<IndustryType>(IndustryType.CLINIC);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest<{
        user: any;
        accessToken: string;
        refreshToken: string;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          businessName,
          fullName,
          email,
          phone,
          password,
          industry,
        }),
      });

      setAuth(data.user, data.accessToken, data.user.tenantId);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-[#202938]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center mb-3">
          <ChatLedgerLogo size="lg" subtitle="14-Day Free Enterprise Trial" />
        </Link>
        <h2 className="text-xl font-bold text-[#202938] tracking-tight">
          Create Your Business Workspace
        </h2>
        <p className="mt-1 text-xs text-[#707B8B]">
          14-day free trial • No credit card required • Instant WhatsApp setup
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-6 rounded-xl border border-[#E6EAF0] shadow-xs">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#D64B50]/10 border border-[#D64B50]/20 text-xs text-[#D64B50] font-medium">
              {error}
            </div>
          )}

          <form className="space-y-3.5" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-semibold text-[#202938]">Business / Clinic Name</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#98A2B3]">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Multispecialty Clinic"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938]">Industry Vertical</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustryType)}
                className="mt-1 block w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] bg-white focus:outline-none focus:border-[#356AE6]"
              >
                <option value={IndustryType.CLINIC}>Healthcare, Clinic & Doctor Practice</option>
                <option value={IndustryType.SALON}>Salon, Spa & Beauty Wellness</option>
                <option value={IndustryType.COACHING}>Coaching Institute & Education</option>
                <option value={IndustryType.REAL_ESTATE}>Real Estate Agency & Brokerage</option>
                <option value={IndustryType.RETAIL}>Local Retail & D2C Store</option>
                <option value={IndustryType.CONSULTING}>Professional Consulting & CA</option>
                <option value={IndustryType.REPAIR}>Home Maintenance & Repairs</option>
                <option value={IndustryType.AGENCY}>Marketing Agency & Freelancer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938]">Owner Full Name</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#98A2B3]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938]">Work Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#98A2B3]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="doctor@apexclinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938]">Official WhatsApp Number</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#98A2B3]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="+91 98201 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938]">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#98A2B3]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 rounded-lg text-xs font-semibold text-white bg-[#243B5A] hover:bg-[#1a2d45] transition-all disabled:opacity-50 shadow-xs"
              >
                {loading ? 'Creating Workspace...' : 'Launch ChatLedger Workspace'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-xs text-[#707B8B]">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-[#356AE6] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
