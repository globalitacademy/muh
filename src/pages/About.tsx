
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Target, Users, Award, Globe, Star, CheckCircle } from 'lucide-react';

const About = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: language === 'hy' ? 'Մեր առաքելությունը' : language === 'ru' ? 'Наша миссия' : 'Our Mission',
      description: language === 'hy' ? 'Ապահովել բարձրորակ կրթություն բոլորի համար՝ անկախ տեղակայման և ֆինանսական հնարավորություններից' : language === 'ru' ? 'Обеспечить качественное образование для всех, независимо от местоположения и финансовых возможностей' : 'Provide quality education for everyone, regardless of location and financial capabilities',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: language === 'hy' ? 'Մեր թիմը' : language === 'ru' ? 'Наша команда' : 'Our Team',
      description: language === 'hy' ? 'Փորձառու մասնագետներ և դասախոսներ, որոնք նվիրված են ուսանողների հաջողությանը' : language === 'ru' ? 'Опытные специалисты и преподаватели, посвятившие себя успеху студентов' : 'Experienced professionals and instructors dedicated to student success',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: language === 'hy' ? 'Որակի ստանդարտներ' : language === 'ru' ? 'Стандарты качества' : 'Quality Standards',
      description: language === 'hy' ? 'Ժամանակակից մեթոդներ և միջազգային ստանդարտներ կրթական գործընթացում' : language === 'ru' ? 'Современные методы и международные стандарты в образовательном процессе' : 'Modern methods and international standards in the educational process',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: language === 'hy' ? 'Գլոբալ հասանելիություն' : language === 'ru' ? 'Глобальная доступность' : 'Global Accessibility',
      description: language === 'hy' ? 'Բազմալեզու համակարգ և հասանելի հարթակ ցանկացած երկրից' : language === 'ru' ? 'Многоязычная система и доступная платформа из любой страны' : 'Multilingual system and accessible platform from any country',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const team = [
    {
      name: language === 'hy' ? 'Արամ Գևորգյան' : language === 'ru' ? 'Арам Геворгян' : 'Aram Gevorgyan',
      role: language === 'hy' ? 'Հիմնադիր և Գլխավոր տնօրեն' : language === 'ru' ? 'Основатель и Генеральный директор' : 'Founder & CEO',
      experience: language === 'hy' ? '15+ տարի ծրագրավորման և կրթության ոլորտում' : language === 'ru' ? '15+ лет в области программирования и образования' : '15+ years in programming and education',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: language === 'hy' ? 'Աննա Հակոբյան' : language === 'ru' ? 'Анна Акопян' : 'Anna Hakobyan',
      role: language === 'hy' ? 'Կրթական ղեկավար' : language === 'ru' ? 'Руководитель образования' : 'Head of Education',
      experience: language === 'hy' ? '12+ տարի կրթական ծրագրերի մշակման մեջ' : language === 'ru' ? '12+ лет в разработке образовательных программ' : '12+ years in educational program development',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: language === 'hy' ? 'Դավիթ Մարտիրոսյան' : language === 'ru' ? 'Давид Мартиросян' : 'David Martirosyan',
      role: language === 'hy' ? 'Տեխնիկական ղեկավար' : language === 'ru' ? 'Технический директор' : 'Technical Director',
      experience: language === 'hy' ? '10+ տարի տվյալների գիտության և AI ոլորտում' : language === 'ru' ? '10+ лет в области науки о данных и ИИ' : '10+ years in data science and AI',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
    }
  ];

  const achievements = [
    { number: '5000+', label: language === 'hy' ? 'Ուսանողներ' : 'Students' },
    { number: '50+', label: language === 'hy' ? 'Դասախոսներ' : 'Instructors' },
    { number: '150+', label: language === 'hy' ? 'Դասընթացներ' : 'Courses' },
    { number: '4.8', label: language === 'hy' ? 'Միջին գնահատական' : 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/5 via-background to-purple-500/5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium font-armenian">Մեր պատմությունը</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-armenian">
                <span className="text-gradient">{t('nav.about')}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-armenian leading-relaxed">
                {language === 'hy' 
                  ? 'Մենք նվիրված ենք ապագայի կրթության ստեղծմանը՝ միավորելով ժամանակակից տեխնոլոգիաները և մարդկային փորձառությունը'
                  : language === 'ru'
                  ? 'Мы посвящены созданию образования будущего, объединяя современные технологии и человеческий опыт'
                  : 'We are dedicated to creating the education of the future by combining modern technology and human experience'
                }
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {achievements.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-edu-blue mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-armenian">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-armenian text-gradient">
                {language === 'hy' ? 'Մեր արժեքները' : language === 'ru' ? 'Наши ценности' : 'Our Values'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian">
                {language === 'hy' 
                  ? 'Այն սկզբունքները, որոնք ղեկավարում են մեր աշխատանքը'
                  : 'The principles that guide our work'
                }
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="modern-card course-card-hover border-0 shadow-lg group overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${value.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-4 font-armenian group-hover:text-edu-blue transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground font-armenian leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-armenian text-gradient">
                {language === 'hy' ? 'Մեր պատմությունը' : language === 'ru' ? 'Наша история' : 'Our Story'}
              </h2>
              <div className="glass-card rounded-2xl p-8 md:p-12">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed font-armenian">
                    {language === 'hy' 
                      ? '"Կրթություն առանց սահմանների" հարթակը ծնվել է 2023 թվականին՝ մի խումբ փորձառու մասնագետների կողմից, ովքեր հավատում էին, որ որակյալ կրթությունը պետք է լինի հասանելի բոլորի համար։'
                      : language === 'ru'
                      ? 'Платформа "Образование без границ" была создана в 2023 году группой опытных специалистов, которые верили, что качественное образование должно быть доступно каждому.'
                      : 'The "Education Without Limits" platform was born in 2023 by a group of experienced professionals who believed that quality education should be accessible to everyone.'
                    }
                  </p>
                  <p className="text-lg leading-relaxed font-armenian">
                    {language === 'hy' 
                      ? 'Մեր նպատակն է ստեղծել այնպիսի կրթական միջավայր, որտեղ ուսանողները կարող են զարգանալ և հասնել իրենց նպատակներին՝ անկախ իրենց գտնվելու վայրից կամ ֆինանսական հնարավորություններից։'
                      : language === 'ru'
                      ? 'Наша цель - создать образовательную среду, где студенты могут развиваться и достигать своих целей, независимо от местоположения или финансовых возможностей.'
                      : 'Our goal is to create an educational environment where students can grow and achieve their goals, regardless of their location or financial capabilities.'
                    }
                  </p>
                  <div className="flex items-center gap-3 text-edu-blue">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-armenian font-medium">
                      {language === 'hy' 
                        ? 'Գերազանց դասընթացներ ու մասնագիտական աջակցություն'
                        : 'Excellent courses and professional support'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-armenian text-gradient">
                {language === 'hy' ? 'Մեր ղեկավարական թիմը' : language === 'ru' ? 'Наша команда руководителей' : 'Our Leadership Team'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian">
                {language === 'hy' 
                  ? 'Մասնագետներ, որոնք նվիրված են ձեր հաջողությանը'
                  : 'Professionals dedicated to your success'
                }
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="modern-card course-card-hover border-0 shadow-lg group overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 font-armenian group-hover:text-edu-blue transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-edu-blue font-medium mb-3 font-armenian">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm font-armenian leading-relaxed">
                      {member.experience}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="glass-card rounded-2xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 font-armenian text-gradient">
                {language === 'hy' ? 'Պատրա՞ստ եք սկսելու' : 'Ready to start?'}
              </h3>
              <p className="text-xl text-muted-foreground mb-8 font-armenian">
                {language === 'hy' 
                  ? 'Միացիր մեր համայնքին և սկսիր քո ուսումնական ճանապարհորդությունը'
                  : 'Join our community and start your learning journey'
                }
              </p>
              <button className="btn-modern text-white px-8 py-4 rounded-xl font-armenian font-semibold text-lg hover:scale-105 transition-transform">
                {language === 'hy' ? 'Սկսել հիմա' : 'Start Now'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
