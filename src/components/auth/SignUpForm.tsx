
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, User, Mail, Lock } from 'lucide-react';

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [groupNumber, setGroupNumber] = useState('');
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password, { 
        name, 
        role, 
        groupNumber: role === 'student' ? groupNumber : undefined 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default SignUpForm;
