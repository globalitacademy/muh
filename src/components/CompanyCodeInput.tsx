import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAccessSession } from '@/hooks/useAccessSession';
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
  const [isActivating, setIsActivating] = useState(false);
  
  const { 
    session, 
    timeRemaining, 
    activateCode,
    endSession, 
    hasModuleAccess, 
    formatTimeRemaining,
    isActive 
  } = useAccessSession();

  // Check if we already have access to this module
  const hasCurrentAccess = hasModuleAccess(moduleId);

  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    setIsActivating(true);

    try {
      const result = await activateCode(code.trim(), moduleId);

      setVerificationStatus('valid');
      onCodeVerified(true);
      
      toast({
        title: 'Code activated successfully',
        description: `You have ${result.activity_duration_minutes} minutes of free access.`,
      });

    } catch (err: any) {
      setVerificationStatus('invalid');
      onCodeVerified(false);
      
      toast({
        title: 'Invalid code',
        description: err.message || 'Please check and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleEndSession = () => {
    endSession();
    setVerificationStatus('none');
    setCode('');
    onCodeVerified(false);
    
    toast({
      title: 'Session ended',
      description: 'Access time has expired.',
    });
  };

  // If we have an active session, show session info
  if (isActive && hasCurrentAccess) {
    return (
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent className="p-4 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold font-armenian mb-2 text-foreground">
              Active Session
            </h2>
            <p className="text-sm text-muted-foreground font-armenian">
              Code: {session?.code}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-md border border-primary/20">
            <Clock className="w-5 h-5 text-primary" />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground font-mono">
                {formatTimeRemaining()}
              </p>
              <p className="text-xs text-muted-foreground font-armenian">
                Remaining time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/20">
            <CheckCircle className="w-4 h-4 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground font-armenian">
                Free access is active
              </p>
              <p className="text-xs text-muted-foreground font-armenian">
                You can view all lessons
              </p>
            </div>
            <Badge variant="secondary" className="text-primary bg-primary/10">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardContent className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold font-armenian mb-4">Partner Code</h2>
          <p className="text-sm text-muted-foreground font-armenian">
            Enter the partner code to get free access
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Input 
              id="company-code" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              placeholder="Enter code (e.g. USUM25)..." 
              className="uppercase" 
              disabled={isActivating || verificationStatus === 'valid'} 
            />
          </div>

          <Button 
            onClick={handleVerifyCode} 
            disabled={!code.trim() || isActivating || verificationStatus === 'valid'} 
            className="w-full font-armenian" 
            variant={verificationStatus === 'valid' ? 'default' : 'outline'}
          >
            {isActivating ? 'Checking...' : verificationStatus === 'valid' ? 'Activated' : 'Check Code'}
          </Button>
        </div>

        {verificationStatus === 'valid' && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/20">
            <CheckCircle className="w-4 h-4 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground font-armenian">Code is valid</p>
              <p className="text-xs text-muted-foreground font-armenian">Session started</p>
            </div>
            <Badge variant="secondary" className="text-primary bg-primary/10">
              Active
            </Badge>
          </div>
        )}

        {(verificationStatus === 'invalid') && (
          <div className="flex items-center gap-2 p-3 bg-destructive/5 rounded-md border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground font-armenian">Invalid code</p>
              <p className="text-xs text-muted-foreground font-armenian">
                Please check and try again
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center font-armenian">
          Don't have a partner code? Contact our team
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCodeInput;
