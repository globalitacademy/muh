
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [organizationName, setOrganizationName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [organizationPhone, setOrganizationPhone] = useState('');
  const [organizationAddress, setOrganizationAddress] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();
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

      if (role === 'employer') {
        userData.organizationName = organizationName;
        userData.managerName = managerName;
        userData.organizationPhone = organizationPhone;
        userData.organizationAddress = organizationAddress;
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
        <Label htmlFor="signup-name" className="font-armenian">{t('auth.name')}</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            placeholder={t('auth.name-placeholder')}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="font-armenian">{t('auth.email')}</Label>
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
        <Label htmlFor="signup-role" className="font-armenian">{t('auth.role')}</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder={t('auth.role-placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">{t('auth.role-student')}</SelectItem>
            <SelectItem value="instructor">{t('auth.role-instructor')}</SelectItem>
            <SelectItem value="employer">{t('auth.role-employer')}</SelectItem>
            <SelectItem value="partner">{t('auth.role-partner')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {role === 'student' && (
        <div className="space-y-2">
          <Label htmlFor="group-number" className="font-armenian">{t('auth.group-number')}</Label>
          <Input
            id="group-number"
            type="text"
            value={groupNumber}
            onChange={(e) => setGroupNumber(e.target.value)}
            placeholder={t('auth.group-number-placeholder')}
          />
        </div>
      )}
      {role === 'partner' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution-name" className="font-armenian">{t('auth.institution-name')} *</Label>
            <Input
              id="institution-name"
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder={t('auth.institution-name-placeholder')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="director-name" className="font-armenian">{t('auth.director-name')} *</Label>
            <Input
              id="director-name"
              type="text"
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
              placeholder={t('auth.director-name-placeholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution-address" className="font-armenian">{t('auth.address')} *</Label>
            <Input
              id="institution-address"
              type="text"
              value={institutionAddress}
              onChange={(e) => setInstitutionAddress(e.target.value)}
              placeholder={t('auth.address-placeholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution-phone" className="font-armenian">{t('auth.phone')} *</Label>
            <Input
              id="institution-phone"
              type="tel"
              value={institutionPhone}
              onChange={(e) => setInstitutionPhone(e.target.value)}
              placeholder={t('auth.phone-placeholder')}
              required
            />
          </div>
        </div>
      )}
      {role === 'employer' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization-name" className="font-armenian">{t('auth.organization-name')} *</Label>
            <Input
              id="organization-name"
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder={t('auth.organization-name-placeholder')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manager-name" className="font-armenian">{t('auth.manager-name')} *</Label>
            <Input
              id="manager-name"
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder={t('auth.manager-name-placeholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization-phone" className="font-armenian">{t('auth.phone')} *</Label>
            <Input
              id="organization-phone"
              type="tel"
              value={organizationPhone}
              onChange={(e) => setOrganizationPhone(e.target.value)}
              placeholder={t('auth.phone-placeholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization-address" className="font-armenian">{t('auth.address')} *</Label>
            <Input
              id="organization-address"
              type="text"
              value={organizationAddress}
              onChange={(e) => setOrganizationAddress(e.target.value)}
              placeholder={t('auth.address-placeholder')}
              required
            />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="font-armenian">{t('auth.password')}</Label>
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
        {t('auth.create-account')}
      </Button>
    </form>

    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="font-armenian text-lg">{t('auth.success-title')}</DialogTitle>
          <DialogDescription className="font-armenian text-center">
            {t('auth.success-message')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => {
            setShowSuccessDialog(false);
            navigate('/');
          }} className="font-armenian">
            {t('auth.ok')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SignUpForm;
