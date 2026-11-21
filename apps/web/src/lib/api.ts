export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("chatledger_custom_api_url");
    if (saved) return saved.replace(/\/$/, "");

    // When deployed on live hosting (e.g. Vercel) without env var, default to live backend endpoint
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "https://chatledger-api.onrender.com/api/v1";
    }
  }
  return "http://localhost:4000/api/v1";
}

let pendingDemoAuth: Promise<string | null> | null = null;

export async function loginDemoUser(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
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
      localStorage.setItem('chatledger_token', t);
      localStorage.setItem('nexaflow_token', t);
      localStorage.setItem('chatledger_user', JSON.stringify(json.data.user));
      localStorage.setItem('nexaflow_user', JSON.stringify(json.data.user));
      localStorage.setItem('chatledger_tenant_id', tid);
      localStorage.setItem('nexaflow_tenant_id', tid);
      return t;
    }
  } catch (e) {
    console.warn('Auto demo auth failed', e);
  }
  return null;
}

async function getOrInitToken(): Promise<{ token: string | null; tenantId: string | null }> {
  if (typeof window === 'undefined') return { token: null, tenantId: null };
  const token = localStorage.getItem('chatledger_token') || localStorage.getItem('nexaflow_token');
  const tenantId = localStorage.getItem('chatledger_tenant_id') || localStorage.getItem('nexaflow_tenant_id');

  if (token) {
    return { token, tenantId };
  }

  // Auto-authenticate as seeded Doctor Sharma if user navigated straight to protected pages
  if (!pendingDemoAuth) {
    pendingDemoAuth = loginDemoUser().finally(() => {
      pendingDemoAuth = null;
    });
  }

  const newToken = await pendingDemoAuth;
  return {
    token: newToken || localStorage.getItem('chatledger_token') || localStorage.getItem('nexaflow_token'),
    tenantId: localStorage.getItem('chatledger_tenant_id') || localStorage.getItem('nexaflow_tenant_id'),
  };
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false,
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

  const url = `${getApiBaseUrl()}${endpoint.startsWith("/" ) ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized by clearing stale tokens and refreshing once
  if (res.status === 401 && !isAuthEndpoint && !isRetry) {
    localStorage.removeItem('chatledger_token');
    localStorage.removeItem('nexaflow_token');
    const freshToken = await loginDemoUser();
    if (freshToken) {
      return apiRequest<T>(endpoint, options, true);
    }
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = json?.error?.message || json?.message || 'An error occurred';
    throw new Error(errorMsg);
  }

  return (json?.data !== undefined ? json.data : json) as T;
}
