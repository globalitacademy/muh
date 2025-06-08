
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, BookOpen, Loader2 } from 'lucide-react';
import { useContactStats } from '@/hooks/useContactStats';
import GoogleMap from '@/components/ui/google-map';

const Contact = () => {
  const { language } = useLanguage();
  const { data: stats, isLoading: statsLoading } = useContactStats();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(language === 'hy' ? 'Հաղորդագրությունը ուղարկվեց!' : language === 'ru' ? 'Сообщение отправлено!' : 'Message sent!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 sm:w-6 h-5 sm:h-6" />,
      title: language === 'hy' ? 'Հասցե' : language === 'ru' ? 'Адрес' : 'Address',
      info: language === 'hy' ? 'Երևան, Մամիկոնյանց 52' : language === 'ru' ? 'Ереван, Мамиконянц 52' : 'Yerevan, Mamikonyanc 52',
      color: 'from-edu-blue to-purple-500'
    },
    {
      icon: <Phone className="w-5 sm:w-6 h-5 sm:h-6" />,
      title: language === 'hy' ? 'Հեռախոս' : language === 'ru' ? 'Телефон' : 'Phone',
      info: '+374 10 123 456',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Mail className="w-5 sm:w-6 h-5 sm:h-6" />,
      title: language === 'hy' ? 'Էլ․ փոստ' : language === 'ru' ? 'Эл. почта' : 'Email',
      info: 'info@limitlesslearning.am',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Clock className="w-5 sm:w-6 h-5 sm:h-6" />,
      title: language === 'hy' ? 'Աշխատանքային ժամեր' : language === 'ru' ? 'Рабочие часы' : 'Working Hours',
      info: language === 'hy' ? 'Երկուշաբթի - Ուրբաթ: 9:00 - 18:00' : language === 'ru' ? 'Понедельник - Пятница: 9:00 - 18:00' : 'Monday - Friday: 9:00 - 18:00',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const realStats = [
    {
      icon: <Users className="w-6 sm:w-8 h-6 sm:h-8" />,
      number: statsLoading ? '...' : `${stats?.studentsCount || 0}+`,
      label: language === 'hy' ? 'Ուսանողներ' : language === 'ru' ? 'Студенты' : 'Students'
    },
    {
      icon: <BookOpen className="w-6 sm:w-8 h-6 sm:h-8" />,
      number: statsLoading ? '...' : `${stats?.modulesCount || 0}`,
      label: language === 'hy' ? 'Դասընթացներ' : language === 'ru' ? 'Курсы' : 'Courses'
    },
    {
      icon: <MessageCircle className="w-6 sm:w-8 h-6 sm:h-8" />,
      number: statsLoading ? '...' : `${stats?.instructorsCount || 0}+`,
      label: language === 'hy' ? 'Մանկավարժներ' : language === 'ru' ? 'Преподаватели' : 'Instructors'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative overflow-hidden">
        {/* Background decorations - Mobile optimized */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 sm:top-20 -left-10 sm:-left-20 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-edu-blue/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 -right-10 sm:-right-20 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-edu-orange/20 to-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section - Mobile responsive */}
        <section className="relative py-16 sm:py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 font-armenian">
                <span className="text-gradient bg-gradient-to-r from-edu-blue via-purple-500 to-edu-orange bg-clip-text text-transparent">
                  {language === 'hy' ? 'Կապ մեր հետ' : language === 'ru' ? 'Свяжитесь с нами' : 'Contact Us'}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 font-armenian leading-relaxed px-2">
                {language === 'hy' 
                  ? 'Մենք այստեղ ենք օգնելու ձեզ: Ուղարկեք ձեր հարցերը, և մենք շուտով կպատասխանենք'
                  : language === 'ru'
                  ? 'Мы здесь, чтобы помочь вам. Отправьте нам свои вопросы, и мы ответим в ближайшее время'
                  : 'We are here to help you. Send us your questions and we will respond soon'
                }
              </p>
              
              {/* Stats - Mobile grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
                {realStats.map((stat, index) => (
                  <div key={index} className="glass-card p-4 sm:p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-edu-blue to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
                      {statsLoading ? <Loader2 className="w-6 sm:w-8 h-6 sm:h-8 animate-spin" /> : stat.icon}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-muted-foreground font-armenian text-sm sm:text-base">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Mobile layout */}
        <section className="relative py-12 sm:py-16 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-armenian text-foreground">
                    {language === 'hy' ? 'Կապի տվյալներ' : language === 'ru' ? 'Контактная информация' : 'Contact Information'}
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground font-armenian leading-relaxed">
                    {language === 'hy' 
                      ? 'Մենք միշտ պատրաստ ենք օգնել ձեզ: Ընտրեք ձեզ համար հարմար կապի միջոցը:'
                      : language === 'ru'
                      ? 'Мы всегда готовы помочь вам. Выберите удобный для вас способ связи:'
                      : 'We are always ready to help you. Choose the most convenient way to contact us:'
                    }
                  </p>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="group">
                      <div className="glass-card p-4 sm:p-6 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className={`w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 text-white group-hover:scale-110 transition-transform duration-300`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg font-armenian text-foreground mb-1 sm:mb-2">{item.title}</h3>
                            <p className="text-muted-foreground font-armenian text-sm sm:text-base break-words">{item.info}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Real Interactive Map - Mobile responsive */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <GoogleMap className="aspect-video" />
                </div>
              </div>

              {/* Contact Form - Mobile optimized */}
              <div>
                <Card className="glass-card border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-edu-blue/5 to-purple-500/5 border-b border-border/50 p-4 sm:p-6">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-armenian text-foreground flex items-center gap-3">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-edu-blue to-purple-500 rounded-xl flex items-center justify-center text-white">
                        <Send className="w-4 sm:w-5 h-4 sm:h-5" />
                      </div>
                      {language === 'hy' ? 'Ուղարկել հաղորդագրություն' : language === 'ru' ? 'Отправить сообщение' : 'Send Message'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="font-armenian text-foreground font-medium text-sm sm:text-base">
                            {language === 'hy' ? 'Անուն' : language === 'ru' ? 'Имя' : 'Name'}
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="h-11 sm:h-12 rounded-xl border-border/50 focus:border-edu-blue transition-colors text-sm sm:text-base"
                            placeholder={language === 'hy' ? 'Ձեր անունը' : language === 'ru' ? 'Ваше имя' : 'Your name'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-armenian text-foreground font-medium text-sm sm:text-base">
                            {language === 'hy' ? 'Էլ․ փոստ' : language === 'ru' ? 'Эл. почта' : 'Email'}
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="h-11 sm:h-12 rounded-xl border-border/50 focus:border-edu-blue transition-colors text-sm sm:text-base"
                            placeholder={language === 'hy' ? 'your@email.com' : language === 'ru' ? 'your@email.com' : 'your@email.com'}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="font-armenian text-foreground font-medium text-sm sm:text-base">
                          {language === 'hy' ? 'Թեմա' : language === 'ru' ? 'Тема' : 'Subject'}
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="h-11 sm:h-12 rounded-xl border-border/50 focus:border-edu-blue transition-colors text-sm sm:text-base"
                          placeholder={language === 'hy' ? 'Հաղորդագրության թեմա' : language === 'ru' ? 'Тема сообщения' : 'Message subject'}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="font-armenian text-foreground font-medium text-sm sm:text-base">
                          {language === 'hy' ? 'Հաղորդագրություն' : language === 'ru' ? 'Сообщение' : 'Message'}
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="rounded-xl border-border/50 focus:border-edu-blue transition-colors resize-none text-sm sm:text-base"
                          placeholder={language === 'hy' ? 'Ձեր հաղորդագրությունը...' : language === 'ru' ? 'Ваше сообщение...' : 'Your message...'}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 sm:h-12 bg-gradient-to-r from-edu-blue to-purple-500 hover:from-edu-dark-blue hover:to-purple-600 font-armenian font-semibold text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <Send className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                        {language === 'hy' ? 'Ուղարկել' : language === 'ru' ? 'Отправить' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Mobile responsive */}
        <section className="relative py-12 sm:py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-armenian text-foreground">
                {language === 'hy' ? 'Հաճախ տրվող հարցեր' : language === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-armenian">
                {language === 'hy' 
                  ? 'Գտեք պատասխանները ամենահաճախակի հարցերի վրա'
                  : language === 'ru'
                  ? 'Найдите ответы на самые популярные вопросы'
                  : 'Find answers to the most common questions'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  q: language === 'hy' ? 'Ինչպես գրանցվել?' : language === 'ru' ? 'Как зарегистрироваться?' : 'How to register?',
                  a: language === 'hy' ? 'Սեղմեք "Գրանցում" կոճակը և լրացրեք անհրաժեշտ դաշտերը' : language === 'ru' ? 'Нажмите кнопку "Регистрация" и заполните необходимые поля' : 'Click the "Sign Up" button and fill in the required fields'
                },
                {
                  q: language === 'hy' ? 'Ինչպես ընտրել դասընթաց?' : language === 'ru' ? 'Как выбрать курс?' : 'How to choose a course?',
                  a: language === 'hy' ? 'Անցեք "Դասընթացներ" բաժին և ընտրեք ձեզ հետաքրքրող ուղղությունը' : language === 'ru' ? 'Перейдите в раздел "Курсы" и выберите интересующее направление' : 'Go to the "Courses" section and choose your area of interest'
                },
                {
                  q: language === 'hy' ? 'Կա՞ արդյոք անվճար դասընթացներ:' : language === 'ru' ? 'Есть ли бесплатные курсы?' : 'Are there free courses?',
                  a: language === 'hy' ? 'Այո, մենք առաջարկում ենք մի շարք անվճար ներածական դասընթացներ' : language === 'ru' ? 'Да, мы предлагаем ряд бесплатных вводных курсов' : 'Yes, we offer a range of free introductory courses'
                },
                {
                  q: language === 'hy' ? 'Ինչպես ստանալ վկայական?' : language === 'ru' ? 'Как получить сертификат?' : 'How to get a certificate?',
                  a: language === 'hy' ? 'Ավարտելուց հետո դասընթացը և անցնելուց բոլոր առաջադրանքները, դուք կկարողանաք ներբեռնել վկայականը' : language === 'ru' ? 'После завершения курса и прохождения всех заданий, вы сможете скачать сертификат' : 'After completing the course and passing all assignments, you will be able to download the certificate'
                }
              ].map((faq, index) => (
                <div key={index} className="glass-card p-4 sm:p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <h3 className="font-semibold text-base sm:text-lg font-armenian text-foreground mb-2 sm:mb-3">{faq.q}</h3>
                  <p className="text-muted-foreground font-armenian text-sm sm:text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
