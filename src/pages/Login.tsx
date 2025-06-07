
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      console.log('Login attempt:', formData);
      alert(language === 'hy' ? 'Մուտքը հաջող է!' : language === 'ru' ? 'Вход успешен!' : 'Login successful!');
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-armenian">
                  {language === 'hy' ? 'Մուտք' : language === 'ru' ? 'Вход' : 'Login'}
                </CardTitle>
                <p className="text-muted-foreground font-armenian">
                  {language === 'hy' 
                    ? 'Մուտք գործեք ձեր հաշիվ' 
                    : language === 'ru' 
                    ? 'Войдите в свой аккаунт' 
                    : 'Sign in to your account'
                  }
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder={language === 'hy' ? 'Ձեր գաղտնաբառը' : language === 'ru' ? 'Ваш пароль' : 'Your password'}
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
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-edu-blue focus:ring-edu-blue"
                      />
                      <span className="ml-2 text-sm text-muted-foreground font-armenian">
                        {language === 'hy' ? 'Հիշել ինձ' : language === 'ru' ? 'Запомнить меня' : 'Remember me'}
                      </span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-edu-blue hover:text-edu-dark-blue font-armenian"
                    >
                      {language === 'hy' ? 'Մոռացել եք գաղտնաբառը?' : language === 'ru' ? 'Забыли пароль?' : 'Forgot password?'}
                    </Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-edu-blue hover:bg-edu-dark-blue font-armenian"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (language === 'hy' ? 'Բեռնվում է...' : language === 'ru' ? 'Загрузка...' : 'Loading...')
                      : (language === 'hy' ? 'Մուտք' : language === 'ru' ? 'Войти' : 'Sign In')
                    }
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground font-armenian">
                    {language === 'hy' ? 'Չունե՞ք հաշիվ' : language === 'ru' ? 'Нет аккаунта?' : "Don't have an account?"}
                    {' '}
                    <Link 
                      to="/register" 
                      className="text-edu-blue hover:text-edu-dark-blue font-medium"
                    >
                      {language === 'hy' ? 'Գրանցվել' : language === 'ru' ? 'Зарегистрироваться' : 'Sign up'}
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

export default Login;
