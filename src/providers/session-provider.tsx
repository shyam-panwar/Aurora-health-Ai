import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Linking from 'expo-linking';
import { Session } from '@supabase/supabase-js';

import { createSessionFromUrl } from '../features/auth/auth';
import { supabase } from '../lib/supabase';

type SessionContextValue = {
  initialized: boolean;
  session: Session | null;
};

const SessionContext = createContext<SessionContextValue>({
  initialized: false,
  session: null,
});

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleUrl = async (url: string | null) => {
      if (!url) {
        return null;
      }

      try {
        return await createSessionFromUrl(url);
      } catch (error) {
        console.warn('Deep link session exchange failed', error);
        return null;
      }
    };

    const bootstrap = async () => {
      const [{ data, error }, initialUrl] = await Promise.all([
        supabase.auth.getSession(),
        Linking.getInitialURL(),
      ]);

      if (error) {
        console.warn('Failed to restore session', error.message);
      }

      const nextSession = (await handleUrl(initialUrl)) ?? data.session;

      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setInitialized(true);
    };

    bootstrap();

    const linkSubscription = Linking.addEventListener('url', ({ url }) => {
      void handleUrl(url).then((nextSession) => {
        if (nextSession && isMounted) {
          setSession(nextSession);
        }
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession);
      }
    });

    return () => {
      isMounted = false;
      linkSubscription.remove();
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      initialized,
      session,
    }),
    [initialized, session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
