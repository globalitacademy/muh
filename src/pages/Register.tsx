
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
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
    
    // Simulate registration process
    setTimeout(() => {
      console.log('Registration attempt:', formData);
      alert(language === 'hy' ? 'Գրանցումը հաջող է!' : language === 'ru' ? 'Регистрация успешна!' : 'Registration successful!');
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const roles = [
    { value: 'student', label: language === 'hy' ? 'Ուսանող' : language === 'ru' ? 'Студент' : 'Student' },
    { value: 'instructor', label: language === 'hy' ? 'Դասախոս' : language === 'ru' ? 'Преподаватель' : 'Instructor' },
    { value: 'employer', label: language === 'hy' ? 'Գործատու' : language === 'ru' ? 'Работодатель' : 'Employer' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-armenian">
                  {language === 'hy' ? 'Գրանցում' : language === 'ru' ? 'Регистрация' : 'Register'}
                </CardTitle>
                <p className="text-muted-foreground font-armenian">
                  {language === 'hy' 
                    ? 'Ստեղծեք ձեր հաշիվը' 
                    : language === 'ru' 
                    ? 'Создайте свой аккаунт' 
                    : 'Create your account'
                  }
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="font-armenian">
                        {language === 'hy' ? 'Անուն' : language === 'ru' ? 'Имя' : 'First Name'}
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="pl-10"
                          placeholder={language === 'hy' ? 'Անուն' : language === 'ru' ? 'Имя' : 'First Name'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName" className="font-armenian">
                        {language === 'hy' ? 'Ազգանուն' : language === 'ru' ? 'Фамилия' : 'Last Name'}
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="pl-10"
                          placeholder={language === 'hy' ? 'Ազգանուն' : language === 'ru' ? 'Фамилия' : 'Last Name'}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="font-armenian">
                      {language === 'hy' ? 'Էլ․ փոստ' : language === 'ru' ? 'Эл. почта' : 'Email'}
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        placeholder={language === 'hy' ? 'your@email.com' : language === 'ru' ? 'your@email.com' : 'your@email.com'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="font-armenian">
                      {language === 'hy' ? 'Դեր' : language === 'ru' ? 'Роль' : 'Role'}
                    </Label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="font-armenian">
                      {language === 'hy' ? 'Գաղտնաբառ' : language === 'ru' ? 'Пароль' : 'Password'}
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-10"
                        placeholder={language === 'hy' ? 'Գաղտնաբառ' : language === 'ru' ? 'Пароль' : 'Password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="font-armenian">
                      {language === 'hy' ? 'Հաստատել գաղտնաբառը' : language === 'ru' ? 'Подтвердить пароль' : 'Confirm Password'}
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-10"
                        placeholder={language === 'hy' ? 'Հաստատել գաղտնաբառը' : language === 'ru' ? 'Подтвердить пароль' : 'Confirm Password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
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
                
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground font-armenian">
                    {language === 'hy' ? 'Արդեն ունե՞ք հաշիվ' : language === 'ru' ? 'Уже есть аккаунт?' : 'Already have an account?'}
                    {' '}
                    <Link 
                      to="/login" 
                      className="text-edu-blue hover:text-edu-dark-blue font-medium"
                    >
                      {language === 'hy' ? 'Մուտք' : language === 'ru' ? 'Войти' : 'Sign in'}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
