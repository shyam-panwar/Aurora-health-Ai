import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { env, isSupabaseConfigured } from '../../lib/env';
import { supabase } from '../../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export const authCallbackPath = 'auth/callback';

const ensureSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY before testing auth.',
    );
  }
};

export const getPasswordResetRedirectTo = () =>
  AuthSession.makeRedirectUri({
    path: 'reset-password',
    scheme: env.appScheme,
  });

export const getAuthRedirectTo = () =>
  AuthSession.makeRedirectUri({
    path: authCallbackPath,
    scheme: env.appScheme,
  });

export const createSessionFromUrl = async (url: string) => {
  const { errorCode, params } = QueryParams.getQueryParams(url);

  if (errorCode) {
    throw new Error(errorCode);
  }

  const code = params.code;

  if (typeof code === 'string' && code.length > 0) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw error;
    }

    return data.session;
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw error;
  }

  return data.session;
};

export const signInWithGoogle = async () => {
  ensureSupabase();

  const redirectTo = getAuthRedirectTo();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  const result = await WebBrowser.openAuthSessionAsync(data?.url ?? '', redirectTo);

  if (result.type === 'success') {
    return createSessionFromUrl(result.url);
  }

  return null;
};

export const signInWithApple = async () => {
  ensureSupabase();

  if (Platform.OS !== 'ios') {
    throw new Error('Apple sign-in is only available on iOS.');
  }

  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  const credential = await AppleAuthentication.signInAsync({
    nonce: hashedNonce,
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error('Apple did not return an identity token.');
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    nonce: rawNonce,
    provider: 'apple',
    token: credential.identityToken,
  });

  if (error) {
    throw error;
  }

  if (credential.fullName) {
    const fullName = [credential.fullName.givenName, credential.fullName.familyName]
      .filter(Boolean)
      .join(' ')
      .trim();

    if (fullName.length > 0) {
      await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          given_name: credential.fullName.givenName,
          family_name: credential.fullName.familyName,
        },
      });
    }
  }

  return data.session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};
