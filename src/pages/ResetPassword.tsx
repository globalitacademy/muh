import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const { updatePassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthRecovery = async () => {
      // Check for Supabase auth tokens in URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      // Also check query parameters (fallback)
      const queryAccessToken = searchParams.get('access_token');
      const queryRefreshToken = searchParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        try {
          // Set the session with the tokens from the email link
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting session:', error);
            toast.error('Վերականգնման հղումը անվավեր է');
            navigate('/auth');
          } else {
            setIsValidSession(true);
          }
        } catch (error) {
          console.error('Error during auth recovery:', error);
          toast.error('Վերականգնման հղումը անվավեր է');
          navigate('/auth');
        }
      } else if (queryAccessToken && queryRefreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: queryAccessToken,
            refresh_token: queryRefreshToken
          });
          
          if (error) {
            console.error('Error setting session:', error);
            toast.error('Վերականգնման հղումը անվավեր է');
            navigate('/auth');
          } else {
            setIsValidSession(true);
          }
        } catch (error) {
          console.error('Error during auth recovery:', error);
          toast.error('Վերականգնման հղումը անվավեր է');
          navigate('/auth');
        }
      } else {
        // Check if user is already authenticated (may have been set by Supabase automatically)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
        } else {
          toast.error('Վերականգնման հղումը անվավեր է կամ ժամկետանց');
          navigate('/auth');
        }
      }
    };

    handleAuthRecovery();
  }, [navigate, searchParams]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidSession) {
      toast.error('Խնդրում ենք նորից օգտագործել վերականգնման հղումը');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error(t('auth.passwords-not-match'));
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Գաղտնաբառը պետք է լինի առնվազն 6 նիշ');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (!result.error) {
        toast.success(t('auth.password-updated'));
        // Sign out after password update to force fresh login
        await supabase.auth.signOut();
        navigate('/auth');
      } else {
        toast.error(t('auth.password-update-error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-armenian">
            Ստուգվում է վերականգնման հղումը...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/auth')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('auth.back-to-signin')}
        </Button>

        <Card className="shadow-xl border">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold font-armenian">
              {t('auth.set-new-password')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="font-armenian">
                  {t('auth.new-password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="font-armenian">
                  {t('auth.confirm-password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full font-armenian" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.update-password')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;