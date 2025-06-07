import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface CompanyCodeInputProps {
  onCodeVerified: (isValid: boolean) => void;
}
const CompanyCodeInput = ({
  onCodeVerified
}: CompanyCodeInputProps) => {
  const [code, setCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'valid' | 'invalid'>('none');

  // Hardcoded company codes for demo - in real app these would come from database
  const validCodes = ['COMPANY2024', 'STUDENT123', 'PARTNER2024', 'SPECIAL2024', 'USUM25'];
  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    setIsChecking(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isValid = validCodes.includes(code.toUpperCase());
    setVerificationStatus(isValid ? 'valid' : 'invalid');
    onCodeVerified(isValid);
    setIsChecking(false);
  };
  return <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          
          
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="company-code" className="font-armenian">Գործընկերոջ կոդ

          </Label>
            <Input id="company-code" value={code} onChange={e => setCode(e.target.value)} placeholder="Մուտքագրեք կոդը..." className="uppercase" disabled={isChecking || verificationStatus === 'valid'} />
          </div>

          <Button onClick={handleVerifyCode} disabled={!code.trim() || isChecking || verificationStatus === 'valid'} className="w-full font-armenian" variant={verificationStatus === 'valid' ? 'default' : 'outline'}>
            {isChecking ? 'Ստուգվում է...' : verificationStatus === 'valid' ? 'Ակտիվացված' : 'Ստուգել կոդը'}
          </Button>
        </div>

        {verificationStatus === 'valid' && <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 font-armenian">Կոդը վավեր է</p>
              <p className="text-xs text-green-600 font-armenian">Այժմ կարող եք անվճար դիտել ամբողջ մոդուլը</p>
            </div>
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              Ակտիվ
            </Badge>
          </div>}

        {verificationStatus === 'invalid' && <div className="flex items-center gap-2 p-3 bg-red-50 rounded-md border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800 font-armenian">Սխալ կոդ</p>
              <p className="text-xs text-red-600 font-armenian">Խնդրում ենք ստուգել և կրկին փորձել</p>
            </div>
          </div>}

        <div className="text-xs text-muted-foreground text-center font-armenian">
          Ընկերային կոդ չունե՞ք: Կապվեք մեր թիմի հետ
        </div>
      </CardContent>
    </Card>;
};
export default CompanyCodeInput;