import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

const ForgotPasswordForm = ({ onBackToSignIn }: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useLanguage();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await resetPassword(email);
      if (!result.error) {
        setEmailSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold font-armenian">{t('auth.reset-email-sent')}</h3>
        <p className="text-muted-foreground font-armenian">
          {t('auth.reset-email-sent-message')}
        </p>
        <Button
          onClick={onBackToSignIn}
          variant="outline"
          className="w-full font-armenian"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('auth.back-to-signin')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="space-y-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onBackToSignIn}
          className="p-0 h-auto text-muted-foreground hover:text-foreground font-armenian"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t('auth.back-to-signin')}
        </Button>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold font-armenian">{t('auth.reset-password')}</h3>
        <p className="text-sm text-muted-foreground font-armenian">
          {t('auth.enter-email-reset')}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email" className="font-armenian">{t('auth.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full font-armenian" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('auth.reset-password-button')}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;