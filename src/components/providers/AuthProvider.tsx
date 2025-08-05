
import { useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthContext } from '@/contexts/AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData?.name || '',
            role: userData?.role || 'student',
            groupNumber: userData?.groupNumber || '',
            organizationName: userData?.organizationName || '',
            managerName: userData?.managerName || '',
            organizationPhone: userData?.organizationPhone || '',
            organizationAddress: userData?.organizationAddress || '',
            institutionName: userData?.institutionName || '',
            directorName: userData?.directorName || '',
            institutionAddress: userData?.institutionAddress || '',
            institutionPhone: userData?.institutionPhone || '',
            phone: userData?.phone || '',
            department: userData?.department || '',
          }
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          toast.error('Այս էլ.փոստի հասցեով օգտատեր արդեն գրանցված է: Փորձեք մուտք գործել:');
        } else if (error.message.includes('invalid email')) {
          toast.error('Խնդրում ենք մուտքագրել վավեր էլ.փոստի հասցե:');
        } else if (error.message.includes('Password should be')) {
          toast.error('Գաղտնաբառը պետք է լինի առնվազն 6 նիշ:');
        } else {
          toast.error(`Գրանցման սխալ: ${error.message}`);
        }
        return { error };
      }

      // Check if user was created successfully
      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Գրանցումը հաջողված է: Ադմինը կանցնի գիծ ձեր դիմումը և կծանուցի արդյունքի մասին:');
      } else if (data.user) {
        toast.success('Գրանցումը հաջողված է: Ադմինը կանցնի գիծ ձեր դիմումը:');
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Սխալ է տեղի ունեցել: Խնդրում ենք նորից փորձել:');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Սխալ էլ.փոստ կամ գաղտնաբառ: Խնդրում ենք ստուգել և նորից փորձել:');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Խնդրում ենք նախ հաստատել ձեր էլ.փոստը:');
        } else if (error.message.includes('Too many requests')) {
          toast.error('Չափազանց շատ փորձություններ: Խնդրում ենք սպասել և նորից փորձել:');
        } else {
          toast.error(`Մուտքի սխալ: ${error.message}`);
        }
        return { error };
      }

      if (data.user) {
        // Check if user is approved
        const { data: profile } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', data.user.id)
          .single();
          
        if (profile?.status === 'pending') {
          await supabase.auth.signOut();
          toast.error('Ձեր հաշիվը դեռ սպասման վիճակում է: Խնդրում ենք սպասել ադմինի հաստատմանը:');
          return { error: new Error('Account pending approval') };
        } else if (profile?.status === 'blocked' || profile?.status === 'suspended') {
          await supabase.auth.signOut();
          toast.error('Ձեր հաշիվը արգելափակված է: Կապվեք ադմինիստրատորի հետ:');
          return { error: new Error('Account blocked') };
        }
        
        toast.success('Հաջողությամբ մուտք գործեցիք');
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Signin error:', error);
      toast.error('Սխալ է տեղի ունեցել: Խնդրում ենք նորից փորձել:');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Հաջողությամբ դուրս եկաք');
      }
    } catch (error: any) {
      toast.error('Սխալ է տեղի ունեցել');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
