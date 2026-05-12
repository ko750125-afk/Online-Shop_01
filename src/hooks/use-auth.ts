'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { isAdminEmail } from '@/lib/constants';
import { checkIsMasterClient, getMasterUser, clearMasterAdminCookie } from '@/lib/auth-utils';

export function useAuth() {
  const [user, setUser] = useState<{ email?: string | null; isMaster?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 마스터 관리자 우선 체크
    if (checkIsMasterClient()) {
      setUser(getMasterUser());
      setLoading(false);
      return;
    }

    // 2. Supabase 세션 확인
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    // 3. 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (checkIsMasterClient()) {
        setUser(getMasterUser());
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    clearMasterAdminCookie();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isAdmin = !!user && (user.isMaster || isAdminEmail(user.email));

  return {
    user,
    loading,
    isAdmin,
    logout,
  };
}
