import { create } from 'zustand';
import { UserRole } from '@nexaflow/shared-types';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  tenantId?: string;
  tenantSlug?: string;
  businessName?: string;
  permissions?: string[];
}

interface AuthState {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserSession, token: string, tenantId?: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token, tenantId) => {
    localStorage.setItem('chatledger_token', token);
    localStorage.setItem('nexaflow_token', token);
    localStorage.setItem('chatledger_user', JSON.stringify(user));
    localStorage.setItem('nexaflow_user', JSON.stringify(user));
    const tid = tenantId || user.tenantId || '';
    if (tid) {
      localStorage.setItem('chatledger_tenant_id', tid);
      localStorage.setItem('nexaflow_tenant_id', tid);
    }
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('chatledger_token');
    localStorage.removeItem('nexaflow_token');
    localStorage.removeItem('chatledger_user');
    localStorage.removeItem('nexaflow_user');
    localStorage.removeItem('chatledger_tenant_id');
    localStorage.removeItem('nexaflow_tenant_id');
    set({ user: null, token: null, isAuthenticated: false });
  },
  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('chatledger_token') || localStorage.getItem('nexaflow_token');
    const userStr = localStorage.getItem('chatledger_user') || localStorage.getItem('nexaflow_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
        return;
      } catch (e) {
        localStorage.removeItem('chatledger_token');
        localStorage.removeItem('nexaflow_token');
      }
    }

    // Default seeded clinic owner session for seamless demonstration
    const demoUser: UserSession = {
      id: '6436eff4-399f-498a-8d8a-54be97283e31',
      email: 'doctor.sharma@apexclinic.com',
      fullName: 'Dr. Rajesh Sharma',
      role: UserRole.BUSINESS_OWNER,
      tenantId: '315cecc2-276f-4ce8-9340-a6cf93a90067',
      tenantSlug: 'apex-clinic',
      businessName: 'Apex Multispecialty Clinic',
      permissions: ['*'],
    };
    set({ user: demoUser, token: token || null, isAuthenticated: true });
  },
}));
