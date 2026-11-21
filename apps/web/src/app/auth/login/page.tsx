'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import ChatLedgerLogo from '../../../components/ChatLedgerLogo';
import { apiRequest } from '../../../lib/api';
import { useAuthStore } from '../../../lib/auth-store';
import { UserRole } from '@nexaflow/shared-types';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('doctor.sharma@apexclinic.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest<{
        user: any;
        accessToken: string;
        refreshToken: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAuth(data.user, data.accessToken, data.user.tenantId);

      // Role-based destination routing
      if (data.user.role === UserRole.SUPER_ADMIN) {
        router.push('/admin');
      } else if (
        data.user.role === UserRole.BUSINESS_OWNER ||
        data.user.role === UserRole.BUSINESS_ADMIN
      ) {
        router.push('/dashboard');
      } else {
        router.push('/workspace');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoPersona = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-[#202938]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center mb-3">
          <ChatLedgerLogo size="lg" subtitle="Enterprise WhatsApp Operations" />
        </Link>
        <h2 className="text-xl font-bold text-[#202938] tracking-tight">
          Sign In to Your Workspace
        </h2>
        <p className="mt-1 text-xs text-[#707B8B]">
          Or{' '}
          <Link href="/auth/register" className="font-semibold text-[#356AE6] hover:underline">
            register your business for a 14-day free trial
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick Demo Persona Switcher */}
        <div className="bg-white px-4 py-3 rounded-xl border border-[#E6EAF0] shadow-xs mb-4">
          <div className="text-[11px] font-bold text-[#707B8B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#356AE6]" />
            Quick Demo Persona Selector
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoPersona('doctor.sharma@apexclinic.com', 'Password123!')}
              className="p-2 rounded-lg border border-[#E6EAF0] hover:bg-[#F2F4F7] hover:border-[#356AE6] text-left transition-all"
            >
              <div className="font-bold text-[#202938]">🏥 Business Owner</div>
              <div className="text-[10px] text-[#707B8B] truncate">doctor.sharma@apexclinic.com</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoPersona('reception@apexclinic.com', 'Password123!')}
              className="p-2 rounded-lg border border-[#E6EAF0] hover:bg-[#F2F4F7] hover:border-[#356AE6] text-left transition-all"
            >
              <div className="font-bold text-[#202938]">👩‍⚕️ Reception Desk</div>
              <div className="text-[10px] text-[#707B8B] truncate">reception@apexclinic.com</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoPersona('admin@nexaflow.ai', 'AdminPassword123!')}
              className="p-2 rounded-lg border border-[#E6EAF0] hover:bg-[#F2F4F7] hover:border-[#356AE6] text-left transition-all"
            >
              <div className="font-bold text-[#202938]">🛡️ Super Admin</div>
              <div className="text-[10px] text-[#707B8B] truncate">admin@nexaflow.ai</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoPersona('support@apexclinic.com', 'Password123!')}
              className="p-2 rounded-lg border border-[#E6EAF0] hover:bg-[#F2F4F7] hover:border-[#356AE6] text-left transition-all"
            >
              <div className="font-bold text-[#202938]">🧑‍💻 Support Agent</div>
              <div className="text-[10px] text-[#707B8B] truncate">support@apexclinic.com</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white py-6 px-6 rounded-xl border border-[#E6EAF0] shadow-xs">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#D64B50]/10 border border-[#D64B50]/20 text-xs text-[#D64B50] font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-[#202938]">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#98A2B3]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 block w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-[#707B8B]">
                <input type="checkbox" defaultChecked className="rounded border-[#E6EAF0] text-[#356AE6] mr-2" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-[#356AE6] hover:underline">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 rounded-lg text-xs font-semibold text-white bg-[#243B5A] hover:bg-[#1a2d45] transition-all disabled:opacity-50 shadow-xs"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center text-[#707B8B] text-[11px] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#23865B]" />
            Protected by JWT token rotation & tenant-level isolation
          </div>
        </div>
      </div>
    </div>
  );
}
