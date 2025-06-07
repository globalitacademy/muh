
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import NameFields from './NameFields';
import EmailField from './EmailField';
import RoleField from './RoleField';
import GroupNumberField from './GroupNumberField';
import PasswordFields from './PasswordFields';

const RegisterForm = () => {
  const { language } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    groupNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(language === 'hy' ? 'Գաղտնաբառերը չեն համընկնում' : language === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const { error } = await signUp(formData.email, formData.password, {
        name: fullName,
        role: formData.role,
        groupNumber: formData.groupNumber
      });

      if (!error) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <NameFields
        firstName={formData.firstName}
        lastName={formData.lastName}
        onChange={handleChange}
        language={language}
      />
      
      <EmailField
        email={formData.email}
        onChange={handleChange}
        language={language}
      />
      
      <RoleField
        role={formData.role}
        onChange={handleChange}
        language={language}
      />
      
      {formData.role === 'student' && (
        <GroupNumberField
          groupNumber={formData.groupNumber}
          onChange={handleChange}
          language={language}
        />
      )}
      
      <PasswordFields
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onChange={handleChange}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        language={language}
      />
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          required
          className="rounded border-gray-300 text-edu-blue focus:ring-edu-blue"
        />
        <label htmlFor="terms" className="ml-2 text-sm text-muted-foreground font-armenian">
          {language === 'hy' ? 'Ես համաձայն եմ ' : language === 'ru' ? 'Я согласен с ' : 'I agree to the '}
          <Link to="/terms" className="text-edu-blue hover:text-edu-dark-blue">
            {language === 'hy' ? 'օգտագործման պայմանների' : language === 'ru' ? 'условиями использования' : 'terms of service'}
          </Link>
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-edu-blue hover:bg-edu-dark-blue font-armenian"
        disabled={isLoading}
      >
        {isLoading 
          ? (language === 'hy' ? 'Բեռնվում է...' : language === 'ru' ? 'Загрузка...' : 'Loading...')
          : (language === 'hy' ? 'Գրանցվել' : language === 'ru' ? 'Зарегистрироваться' : 'Register')
        }
      </Button>
    </form>
  );
};

export default RegisterForm;
