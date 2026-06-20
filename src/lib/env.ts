const requireEnv = (value: string | undefined, fallback: string) => {
  return value && value.length > 0 ? value : fallback;
};

const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const env = {
  apiUrl: requireEnv(process.env.EXPO_PUBLIC_API_URL, 'http://10.0.2.2:4000'),
  appScheme: requireEnv(process.env.EXPO_PUBLIC_APP_SCHEME, 'auroraauth'),
  supabaseKey: requireEnv(supabaseKey, 'replace-with-your-supabase-publishable-key'),
  supabaseUrl: requireEnv(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    'https://your-project.supabase.co',
  ),
};

export const isSupabaseConfigured =
  !env.supabaseUrl.includes('your-project') &&
  !env.supabaseKey.includes('replace-with-your-supabase');
