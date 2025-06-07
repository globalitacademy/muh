
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to your backend
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
      icon: <MapPin className="w-6 h-6" />,
      title: language === 'hy' ? 'Հասցե' : language === 'ru' ? 'Адрес' : 'Address',
      info: language === 'hy' ? 'Երևան, Կասկադ, Թամանյան 1' : language === 'ru' ? 'Ереван, Каскад, Таманян 1' : 'Yerevan, Cascade, Tamanyan 1'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: language === 'hy' ? 'Հեռախոս' : language === 'ru' ? 'Телефон' : 'Phone',
      info: '+374 10 123 456'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: language === 'hy' ? 'Էլ․ փոստ' : language === 'ru' ? 'Эл. почта' : 'Email',
      info: 'info@limitlesslearning.am'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: language === 'hy' ? 'Աշխատանքային ժամեր' : language === 'ru' ? 'Рабочие часы' : 'Working Hours',
      info: language === 'hy' ? 'Երկուշաբթի - Ուրբաթ: 9:00 - 18:00' : language === 'ru' ? 'Понедельник - Пятница: 9:00 - 18:00' : 'Monday - Friday: 9:00 - 18:00'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-armenian">
              {language === 'hy' ? 'Կապ մեր հետ' : language === 'ru' ? 'Свяжитесь с нами' : 'Contact Us'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-armenian">
              {language === 'hy' 
                ? 'Մենք այստեղ ենք օգնելու ձեզ: Ուղարկեք ձեր հարցերը, և մենք շուտով կպատասխանենք'
                : language === 'ru'
                ? 'Мы здесь, чтобы помочь вам. Отправьте нам свои вопросы, и мы ответим в ближайшее время'
                : 'We are here to help you. Send us your questions and we will respond soon'
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-8 font-armenian">
                {language === 'hy' ? 'Կապի տվյալներ' : language === 'ru' ? 'Контактная информация' : 'Contact Information'}
              </h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-edu-blue text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg font-armenian">{item.title}</h3>
                      <p className="text-muted-foreground font-armenian">{item.info}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground font-armenian">
                        {language === 'hy' ? 'Քարտեզ' : language === 'ru' ? 'Карта' : 'Map'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-armenian">
                  {language === 'hy' ? 'Ուղարկել հաղորդագրություն' : language === 'ru' ? 'Отправить сообщение' : 'Send Message'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="font-armenian">
                        {language === 'hy' ? 'Անուն' : language === 'ru' ? 'Имя' : 'Name'}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                        placeholder={language === 'hy' ? 'Ձեր անունը' : language === 'ru' ? 'Ваше имя' : 'Your name'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-armenian">
                        {language === 'hy' ? 'Էլ․ փոստ' : language === 'ru' ? 'Эл. почта' : 'Email'}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                        placeholder={language === 'hy' ? 'your@email.com' : language === 'ru' ? 'your@email.com' : 'your@email.com'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="font-armenian">
                      {language === 'hy' ? 'Թեմա' : language === 'ru' ? 'Тема' : 'Subject'}
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder={language === 'hy' ? 'Հաղորդագրության թեմա' : language === 'ru' ? 'Тема сообщения' : 'Message subject'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="font-armenian">
                      {language === 'hy' ? 'Հաղորդագրություն' : language === 'ru' ? 'Сообщение' : 'Message'}
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder={language === 'hy' ? 'Ձեր հաղորդագրությունը...' : language === 'ru' ? 'Ваше сообщение...' : 'Your message...'}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-edu-blue hover:bg-edu-dark-blue font-armenian"
                  >
                    {language === 'hy' ? 'Ուղարկել' : language === 'ru' ? 'Отправить' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
