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

export const api = {
  signup: (name: string, email: string, password: string) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>(
      '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  me: (token: string) => request('/auth/me', { method: 'GET' }, token),
};

export default api;