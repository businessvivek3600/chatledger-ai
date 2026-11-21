const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

let pendingDemoAuth: Promise<string | null> | null = null;

async function getOrInitToken(): Promise<{ token: string | null; tenantId: string | null }> {
  if (typeof window === 'undefined') return { token: null, tenantId: null };
  const token = localStorage.getItem('nexaflow_token');
  const tenantId = localStorage.getItem('nexaflow_tenant_id');

  if (token) {
    return { token, tenantId };
  }

  // Auto-authenticate as seeded Doctor Sharma if user navigated straight to protected pages
  if (!pendingDemoAuth) {
    pendingDemoAuth = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'doctor.sharma@apexclinic.com',
            password: 'Password123!',
          }),
        });
        const json = await res.json();
        if (json?.data?.accessToken) {
          const t = json.data.accessToken;
          const tid = json.data.user?.tenantId || '315cecc2-276f-4ce8-9340-a6cf93a90067';
          localStorage.setItem('nexaflow_token', t);
          localStorage.setItem('nexaflow_user', JSON.stringify(json.data.user));
          localStorage.setItem('nexaflow_tenant_id', tid);
          return t;
        }
      } catch (e) {
        console.warn('Auto demo auth failed', e);
      } finally {
        pendingDemoAuth = null;
      }
      return null;
    })();
  }

  const newToken = await pendingDemoAuth;
  return {
    token: newToken || localStorage.getItem('nexaflow_token'),
    tenantId: localStorage.getItem('nexaflow_tenant_id'),
  };
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
  let token: string | null = null;
  let tenantId: string | null = null;

  if (!isAuthEndpoint) {
    const auth = await getOrInitToken();
    token = auth.token;
    tenantId = auth.tenantId;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = json?.error?.message || json?.message || 'An error occurred';
    throw new Error(errorMsg);
  }

  return (json?.data !== undefined ? json.data : json) as T;
}
