import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAccessSession, useAccessCodeValidation } from '@/hooks/useAccessSession';
import { useToast } from '@/hooks/use-toast';

interface CompanyCodeInputProps {
  onCodeVerified: (isValid: boolean) => void;
  moduleId?: string;
}

const CompanyCodeInput = ({
  onCodeVerified,
  moduleId
}: CompanyCodeInputProps) => {
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  
  const { 
    session, 
    timeRemaining, 
    startSession, 
    endSession, 
    hasModuleAccess, 
    formatTimeRemaining,
    isActive 
  } = useAccessSession();
  
  const { validateCode, isLoading, error } = useAccessCodeValidation();

  // Check if we already have access to this module
  const hasCurrentAccess = hasModuleAccess(moduleId);

  const handleVerifyCode = async () => {
    if (!code.trim()) return;

    try {
      const result = await validateCode(code.trim(), moduleId);
      
      // Start new session
      startSession({
        code: code.toUpperCase(),
        partnerId: result.partner_id,
        moduleId: result.module_id,
        activityDurationMinutes: result.activity_duration_minutes,
      });

      setVerificationStatus('valid');
      onCodeVerified(true);
      
      toast({
        title: 'Կոդը հաջողությամբ ակտիվացվել է',
        description: `Ձեզ մոտ կա ${result.activity_duration_minutes} րոպե անվճար հասանելիություն։`,
      });

    } catch (err: any) {
      setVerificationStatus('invalid');
      onCodeVerified(false);
      
      toast({
        title: 'Անվավեր կոդ',
        description: err.message || 'Խնդրում ենք ստուգել և կրկին փորձել։',
        variant: 'destructive',
      });
    }
  };

  const handleEndSession = () => {
    endSession();
    setVerificationStatus('none');
    setCode('');
    onCodeVerified(false);
    
    toast({
      title: 'Սեսիան ավարտվեց',
      description: 'Հասանելիության ժամանակը ավարտվել է։',
    });
  };

  // If we have an active session, show session info
  if (isActive && hasCurrentAccess) {
    return (
      <Card className="border-dashed border-2 border-green-500/30 bg-green-50/50">
        <CardContent className="p-4 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold font-armenian mb-2 text-green-800">
              Ակտիվ սեսիա
            </h2>
            <p className="text-sm text-green-600 font-armenian">
              Կոդ: {session?.code}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-green-100 rounded-md border border-green-200">
            <Clock className="w-5 h-5 text-green-600" />
            <div className="text-center">
              <p className="text-lg font-bold text-green-800 font-mono">
                {formatTimeRemaining()}
              </p>
              <p className="text-xs text-green-600 font-armenian">
                Մնացած ժամանակ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 font-armenian">
                Անվճար հասանելիություն ակտիվ է
              </p>
              <p className="text-xs text-green-600 font-armenian">
                Կարող եք դիտել բոլոր դասերը
              </p>
            </div>
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              Ակտիվ
            </Badge>
          </div>

          <Button 
            onClick={handleEndSession} 
            variant="outline"
            className="w-full font-armenian text-red-600 border-red-200 hover:bg-red-50"
          >
            Ավարտել սեսիան
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardContent className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold font-armenian mb-4">Գործընկերային կոդ</h2>
          <p className="text-sm text-muted-foreground font-armenian">
            Մուտքագրեք գործընկերային կոդը՝ անվճար հասանելիություն ստանալու համար
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Input 
              id="company-code" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              placeholder="Մուտքագրեք կոդը (օր.՝ USUM25)..." 
              className="uppercase" 
              disabled={isLoading || verificationStatus === 'valid'} 
            />
          </div>

          <Button 
            onClick={handleVerifyCode} 
            disabled={!code.trim() || isLoading || verificationStatus === 'valid'} 
            className="w-full font-armenian" 
            variant={verificationStatus === 'valid' ? 'default' : 'outline'}
          >
            {isLoading ? 'Ստուգվում է...' : verificationStatus === 'valid' ? 'Ակտիվացված' : 'Ստուգել կոդը'}
          </Button>
        </div>

        {verificationStatus === 'valid' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 font-armenian">Կոդը վավեր է</p>
              <p className="text-xs text-green-600 font-armenian">Սեսիան սկսվել է</p>
            </div>
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              Ակտիվ
            </Badge>
          </div>
        )}

        {(verificationStatus === 'invalid' || error) && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-md border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800 font-armenian">Սխալ կոդ</p>
              <p className="text-xs text-red-600 font-armenian">
                {error || 'Խնդրում ենք ստուգել և կրկին փորձել'}
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center font-armenian">
          Գործընկերային կոդ չունե՞ք: Կապվեք մեր թիմի հետ
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCodeInput;