
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, Lock, CheckCircle } from 'lucide-react';

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [groupNumber, setGroupNumber] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [institutionAddress, setInstitutionAddress] = useState('');
  const [institutionPhone, setInstitutionPhone] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData: any = { 
        name, 
        role 
      };
      
      if (role === 'student' && groupNumber) {
        userData.groupNumber = groupNumber;
      }

      if (role === 'partner') {
        userData.institutionName = institutionName;
        userData.directorName = directorName;
        userData.institutionAddress = institutionAddress;
        userData.institutionPhone = institutionPhone;
      }

      const result = await signUp(email, password, userData);
      
      if (!result.error) {
        setShowSuccessDialog(true);
        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name" className="font-armenian">Անուն</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            placeholder="Ձեր անունը"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="font-armenian">Էլ. փոստ</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-role" className="font-armenian">Դեր</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Ընտրեք դեր" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Ուսանող</SelectItem>
            <SelectItem value="instructor">Դասախոս</SelectItem>
            <SelectItem value="employer">Գործատու</SelectItem>
            <SelectItem value="partner">Գործընկեր</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {role === 'student' && (
        <div className="space-y-2">
          <Label htmlFor="group-number" className="font-armenian">Խմբի համար</Label>
          <Input
            id="group-number"
            type="text"
            value={groupNumber}
            onChange={(e) => setGroupNumber(e.target.value)}
            placeholder="Ձեր խմբի համարը"
          />
        </div>
      )}
      {role === 'partner' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution-name" className="font-armenian">Ուսումնական հաստատության անունը *</Label>
            <Input
              id="institution-name"
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="Մուտքագրեք հաստատության անունը"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="director-name" className="font-armenian">Տնօրենի անունը *</Label>
            <Input
              id="director-name"
              type="text"
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
              placeholder="Մուտքագրեք տնօրենի անունը"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution-address" className="font-armenian">Հասցե *</Label>
            <Input
              id="institution-address"
              type="text"
              value={institutionAddress}
              onChange={(e) => setInstitutionAddress(e.target.value)}
              placeholder="Մուտքագրեք հաստատության հասցեն"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution-phone" className="font-armenian">Հեռախոսահամար *</Label>
            <Input
              id="institution-phone"
              type="tel"
              value={institutionPhone}
              onChange={(e) => setInstitutionPhone(e.target.value)}
              placeholder="Մուտքագրեք հեռախոսահամարը"
              required
            />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="font-armenian">Գաղտնաբառ</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            placeholder="••••••••"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full font-armenian" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Ստեղծել հաշիվ
      </Button>
    </form>

    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="font-armenian text-lg">Գրանցումը հաջողված է!</DialogTitle>
          <DialogDescription className="font-armenian text-center">
            Հաստատման հղումը ուղարկվել է ձեր էլ.փոստի հասցեին: 
            <br />
            3 վայրկյանից ավտոմատ վերադառնում ենք գլխավոր էջ:
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SignUpForm;
