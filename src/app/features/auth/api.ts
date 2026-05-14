export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface AuthUser {
  user_id: number;
  name: string;
  email: string;
  role: 'admin' | 'teamleader' | 'programmer';
  created_at: string;
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message = json?.message || 'Login request failed.';
    throw new Error(message);
  }

  if (!json || !json.success || !json.user) {
    throw new Error(json?.message || 'Invalid login response.');
  }

  return json.user as AuthUser;
}
