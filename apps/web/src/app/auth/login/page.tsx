'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import ChatLedgerLogo from '../../../components/ChatLedgerLogo';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useLanguage } from '../../../i18n/LanguageContext';
import { apiRequest } from '../../../lib/api';
import { useAuthStore } from '../../../lib/auth-store';
import { UserRole } from '@nexaflow/shared-types';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-[#202938] relative">
      {/* Top Language Switcher Bar */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageSwitcher variant="compact" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center mb-3">
          <ChatLedgerLogo size="lg" subtitle="Enterprise WhatsApp Operations" />
        </Link>
        <h2 className="text-xl font-bold text-[#202938] tracking-tight">
          {t('auth.signIn', 'Sign In to Your Workspace')}
        </h2>
        <p className="mt-1 text-xs text-[#707B8B]">
          Or{' '}
          <Link href="/auth/register" className="font-semibold text-[#356AE6] hover:underline">
            {t('auth.startTrial', 'register your business for a 14-day free trial')}
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

        <div className="bg-white py-6 px-4 shadow-sm border border-[#E6EAF0] rounded-2xl sm:px-8">
          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-lg bg-[#D64B50]/10 border border-[#D64B50]/20 text-[#D64B50] text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#202938]">
                {t('auth.email', 'Email address')}
              </label>
              <div className="mt-1 relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#98A2B3]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-[#E6EAF0] rounded-lg text-xs placeholder-[#98A2B3] focus:outline-none focus:border-[#356AE6] bg-[#F7F8FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202938]">
                {t('auth.password', 'Password')}
              </label>
              <div className="mt-1 relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#98A2B3]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-[#E6EAF0] rounded-lg text-xs placeholder-[#98A2B3] focus:outline-none focus:border-[#356AE6] bg-[#F7F8FA]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-3.5 w-3.5 text-[#356AE6] border-[#E6EAF0] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[#707B8B]">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-semibold text-[#356AE6] hover:underline">
                  {t('auth.forgotPassword', 'Forgot password?')}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-[#243B5A] hover:bg-[#1A2B42] focus:outline-none transition-colors disabled:opacity-50"
              >
                {loading ? t('common.loading', 'Signing in...') : t('auth.signIn', 'Sign In')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
