// Simple API client with automatic JSON handling and auth header injection

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiError extends Error {
  status?: number;
  details?: any;
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  let body: any = null;
  const text = await res.text();
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  if (!res.ok) {
    let message = 'Request failed';
    if (body) {
      if (typeof body === 'string') message = body;
      else if (body.detail) {
        if (Array.isArray(body.detail)) {
          // Pydantic validation errors array
            message = body.detail.map((d: any) => {
              const loc = Array.isArray(d.loc) ? d.loc.filter((p: any) => typeof p === 'string').join('.') : '';
              return loc ? `${loc}: ${d.msg}` : d.msg;
            }).join('\n');
        } else if (typeof body.detail === 'string') {
          message = body.detail;
        }
      } else if (body.message) message = body.message;
    }
    const err: ApiError = new Error(message);
    err.status = res.status;
    err.details = body;
    throw err;
  }
  return body as T;
}

// Keep standard request available for public API endpoints (llm, recommend, chat-history)
// but provide mocked auth endpoints so the frontend doesn't fail when invoking them.

export const api = {
  signup: async (name: string, email: string, _password: string) => {
    // Return a lightweight mock object. Client will call login next in some flows,
    // but our AuthProvider is no-op so this is just for compatibility.
    return Promise.resolve({ id: `mock-${Date.now()}`, name, email });
  },
  login: async (email: string, _password: string) => {
    // Return a dummy access token; AuthContext no-op will accept it.
    return Promise.resolve({ access_token: `mock-token-${btoa(email).slice(0,8)}`, token_type: 'bearer' });
  },
  me: async (_token: string) => {
    // Return a mock user profile. Keep shape compatible with existing code.
    return Promise.resolve({ id: 'anon', name: 'Founder', email: '' });
  },
  // expose generic request for non-auth endpoints
  request,
};

export default api;