import { env } from './env';
import { supabase } from './supabase';

type ApiResponse<T> = {
  data: T;
};

export const fetchProtectedProfile = async (): Promise<ApiResponse<{
  email: string | null;
  message: string;
  userId: string;
}>> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('You must be signed in to call the protected API.');
  }

  const response = await fetch(`${env.apiUrl}/api/protected/profile`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  const payload = (await response.json()) as ApiResponse<{
    email: string | null;
    message: string;
    userId: string;
  }> & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? 'The protected API request failed.');
  }

  return payload;
};
