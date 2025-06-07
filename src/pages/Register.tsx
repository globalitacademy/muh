
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/forms/RegisterForm';

const Register = () => {
  const { language } = useLanguage();

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
                <RegisterForm />
                
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
