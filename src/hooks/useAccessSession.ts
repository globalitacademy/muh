import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AccessSession {
  id: string;
  code: string;
  partnerId: string;
  moduleId?: string;
  activityDurationMinutes: number;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
}

// Session management hooks
export const useAccessSession = () => {
  const [session, setSession] = useState<AccessSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('partner_access_session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        const endTime = new Date(parsedSession.endTime);
        const now = new Date();
        
        if (endTime > now) {
          setSession({
            ...parsedSession,
            startTime: new Date(parsedSession.startTime),
            endTime: endTime,
          });
          setTimeRemaining(Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000)));
        } else {
          // Session expired, remove it
          localStorage.removeItem('partner_access_session');
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('partner_access_session');
      }
    }
  }, []);

  // Timer to update remaining time
  useEffect(() => {
    if (!session || !session.isActive) return;

    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((session.endTime.getTime() - now.getTime()) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        endSession();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  const startSession = (sessionData: Omit<AccessSession, 'id' | 'startTime' | 'endTime' | 'isActive'>) => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + sessionData.activityDurationMinutes * 60 * 1000);
    
    const newSession: AccessSession = {
      ...sessionData,
      id: crypto.randomUUID(),
      startTime,
      endTime,
      isActive: true,
    };

    setSession(newSession);
    setTimeRemaining(sessionData.activityDurationMinutes * 60);
    localStorage.setItem('partner_access_session', JSON.stringify(newSession));
  };

  const endSession = () => {
    setSession(null);
    setTimeRemaining(0);
    localStorage.removeItem('partner_access_session');
  };

  const hasModuleAccess = (moduleId?: string) => {
    if (!session || !session.isActive) return false;
    if (session.moduleId && moduleId && session.moduleId !== moduleId) return false;
    return new Date() < session.endTime;
  };

  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    session,
    timeRemaining,
    startSession,
    endSession,
    hasModuleAccess,
    formatTimeRemaining,
    isActive: session?.isActive ?? false,
  };
};

// Access code validation hook
export const useAccessCodeValidation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCode = async (code: string, moduleId?: string): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.rpc('use_access_code', {
        p_code: code.toUpperCase(),
        p_user_id: user.user?.id,
        p_module_id: moduleId,
      });

      if (error) throw error;

      const result = data as any;
      if (!result.success) {
        throw new Error(result.error || 'Անվավեր կոդ');
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Կոդի ստուգման սխալ';
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
      throw new Error(err.message || 'Կոդի կարգավիճակի ստուգման սխալ');
    }
  };

  return {
    validateCode,
    checkCodeStatus,
    isLoading,
    error,
  };
};