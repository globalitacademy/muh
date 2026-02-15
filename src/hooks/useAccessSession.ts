import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface IpAccessSession {
  id: string;
  code: string;
  partnerId: string;
  moduleId?: string | null;
  activityDurationMinutes: number;
  startedAt: string;
  expiresAt: string;
}

const EDGE_FUNCTION_URL = 'https://uiiholvhyjxlutzuebpb.supabase.co/functions/v1/partner-session';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpaWhvbHZoeWp4bHV0enVlYnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjMzODAsImV4cCI6MjA2NTk5OTM4MH0.ez0Bj9B3COmaX1BbL_5uBUL3O3CHv79OkUtjDY8yqYM';

// Hook for IP-based partner access sessions
export const useAccessSession = () => {
  const [session, setSession] = useState<IpAccessSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check for active IP-based session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        setSession(null);
        localStorage.removeItem('partner_access_session');
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': ANON_KEY,
        },
        body: JSON.stringify({ action: 'check' }),
      });

      const data = await res.json();

      if (data.active && data.session) {
        const s: IpAccessSession = {
          id: data.session.id,
          code: data.session.code,
          partnerId: data.session.partner_id,
          moduleId: data.session.module_id,
          activityDurationMinutes: data.session.activity_duration_minutes,
          startedAt: data.session.started_at,
          expiresAt: data.session.expires_at,
        };
        setSession(s);
        // Also save to localStorage as fallback for quick checks
        localStorage.setItem('partner_access_session', JSON.stringify(s));
      } else {
        setSession(null);
        localStorage.removeItem('partner_access_session');
      }
    } catch (err) {
      console.error('Error checking IP session:', err);
      // Fallback: check localStorage
      const saved = localStorage.getItem('partner_access_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (new Date(parsed.expiresAt) > new Date()) {
            setSession(parsed);
          } else {
            localStorage.removeItem('partner_access_session');
          }
        } catch {
          localStorage.removeItem('partner_access_session');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startSession = async (sessionData: {
    code: string;
    partnerId: string;
    moduleId?: string;
    activityDurationMinutes: number;
  }) => {
    // Session is started via edge function in activateCode, so just set it
    // This is kept for backward compatibility
  };

  const activateCode = useCallback(async (code: string, moduleId?: string): Promise<any> => {
    const res = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
      },
      body: JSON.stringify({ action: 'activate', code, module_id: moduleId }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to activate code');
    }

    const s: IpAccessSession = {
      id: data.session.id,
      code: data.session.code,
      partnerId: data.session.partner_id,
      moduleId: data.session.module_id,
      activityDurationMinutes: data.session.activity_duration_minutes,
      startedAt: data.session.started_at,
      expiresAt: data.session.expires_at,
    };
    setSession(s);
    localStorage.setItem('partner_access_session', JSON.stringify(s));

    return {
      ...data,
      activity_duration_minutes: data.session.activity_duration_minutes,
      partner_id: data.session.partner_id,
      module_id: data.session.module_id,
    };
  }, []);

  const endSession = useCallback(() => {
    setSession(null);
    setTimeRemaining(0);
    localStorage.removeItem('partner_access_session');
  }, []);

  const hasModuleAccess = useCallback((moduleId?: string) => {
    if (!session) return false;
    if (session.moduleId && moduleId && session.moduleId !== moduleId) return false;
    return new Date(session.expiresAt) > new Date();
  }, [session]);

  const formatTimeRemaining = useCallback(() => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  return {
    session,
    timeRemaining,
    startSession,
    activateCode,
    endSession,
    hasModuleAccess,
    formatTimeRemaining,
    isActive: !!session && new Date(session.expiresAt) > new Date(),
    isLoading,
    checkSession,
  };
};

// Access code validation hook (kept for backward compatibility but now uses edge function)
export const useAccessCodeValidation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCode = async (code: string, moduleId?: string): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': ANON_KEY,
        },
        body: JSON.stringify({ action: 'activate', code, module_id: moduleId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid code');
      }

      return {
        activity_duration_minutes: data.session.activity_duration_minutes,
        partner_id: data.session.partner_id,
        module_id: data.session.module_id,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Code validation error';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCodeStatus = async (code: string): Promise<any> => {
    try {
      const { data, error } = await supabase.rpc('check_access_code_status', {
        p_code: code.toUpperCase(),
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Code status check error');
    }
  };

  return {
    validateCode,
    checkCodeStatus,
    isLoading,
    error,
  };
};
