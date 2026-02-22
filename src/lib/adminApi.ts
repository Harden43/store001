// src/lib/adminApi.ts
// Client helper to call the admin-api Edge Function

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function getAdminPassword(): string {
  return sessionStorage.getItem('admin_password') || '';
}

export async function adminApi<T = unknown>(
  action: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${getAdminPassword()}`,
    },
    body: JSON.stringify({ action, ...params }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `Admin API error (${res.status})`);
  }

  return res.json();
}
