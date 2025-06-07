
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Target, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: language === 'hy' ? 'Մեր առաքելությունը' : language === 'ru' ? 'Наша миссия' : 'Our Mission',
      description: language === 'hy' ? 'Ապահովել բարձրորակ կրթություն բոլորի համար՝ անկախ տեղակայման և ֆինանսական հնարավորություններից' : language === 'ru' ? 'Обеспечить качественное образование для всех, независимо от местоположения и финансовых возможностей' : 'Provide quality education for everyone, regardless of location and financial capabilities'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: language === 'hy' ? 'Մեր թիմը' : language === 'ru' ? 'Наша команда' : 'Our Team',
      description: language === 'hy' ? 'Փորձառու մասնագետներ և դասախոսներ, որոնք նվիրված են ուսանողների հաջողությանը' : language === 'ru' ? 'Опытные специалисты и преподаватели, посвятившие себя успеху студентов' : 'Experienced professionals and instructors dedicated to student success'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: language === 'hy' ? 'Որակի ստանդարտներ' : language === 'ru' ? 'Стандарты качества' : 'Quality Standards',
      description: language === 'hy' ? 'Ժամանակակից մեթոդներ և միջազգային ստանդարտներ կրթական գործընթացում' : language === 'ru' ? 'Современные методы и международные стандарты в образовательном процессе' : 'Modern methods and international standards in the educational process'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: language === 'hy' ? 'Գլոբալ հասանելիություն' : language === 'ru' ? 'Глобальная доступность' : 'Global Accessibility',
      description: language === 'hy' ? 'Բազմալեզու համակարգ և հասանելի հարթակ ցանկացած երկրից' : language === 'ru' ? 'Многоязычная система и доступная платформа из любой страны' : 'Multilingual system and accessible platform from any country'
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-armenian">
              {t('nav.about')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian">
              {language === 'hy' 
                ? 'Մենք նվիրված ենք ապագայի կրթության ստեղծմանը՝ միավորելով ժամանակակից տեխնոլոգիաները և մարդկային փորձառությունը'
                : language === 'ru'
                ? 'Мы посвящены созданию образования будущего, объединяя современные технологии и человеческий опыт'
                : 'We are dedicated to creating the education of the future by combining modern technology and human experience'
              }
            </p>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 font-armenian">
              {language === 'hy' ? 'Մեր արժեքները' : language === 'ru' ? 'Наши ценности' : 'Our Values'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 border-0 shadow-lg course-card-hover">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-edu-blue text-white rounded-full flex items-center justify-center">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3 font-armenian">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground font-armenian">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 font-armenian">
              {language === 'hy' ? 'Մեր պատմությունը' : language === 'ru' ? 'Наша история' : 'Our Story'}
            </h2>
            <div className="bg-muted/50 rounded-lg p-8">
              <p className="text-lg leading-relaxed font-armenian mb-6">
                {language === 'hy' 
                  ? '"Կրթություն առանց սահմանների" հարթակը ծնվել է 2023 թվականին՝ մի խումբ փորձառու մասնագետների կողմից, ովքեր հավատում էին, որ որակյալ կրթությունը պետք է լինի հասանելի բոլորի համար։'
                  : language === 'ru'
                  ? 'Платформа "Образование без границ" была создана в 2023 году группой опытных специалистов, которые верили, что качественное образование должно быть доступно каждому.'
                  : 'The "Education Without Limits" platform was born in 2023 by a group of experienced professionals who believed that quality education should be accessible to everyone.'
                }
              </p>
              <p className="text-lg leading-relaxed font-armenian mb-6">
                {language === 'hy' 
                  ? 'Մեր նպատակն է ստեղծել այնպիսի կրթական միջավայր, որտեղ ուսանողները կարող են զարգանալ և հասնել իրենց նպատակներին՝ անկախ իրենց գտնվելու վայրից կամ ֆինանսական հնարավորություններից։'
                  : language === 'ru'
                  ? 'Наша цель - создать образовательную среду, где студенты могут развиваться и достигать своих целей, независимо от местоположения или финансовых возможностей.'
                  : 'Our goal is to create an educational environment where students can grow and achieve their goals, regardless of their location or financial capabilities.'
                }
              </p>
              <p className="text-lg leading-relaxed font-armenian">
                {language === 'hy' 
                  ? 'Այսօր մենք գорд ենք ունենալ 5000+ ուսանողներ, 50+ դասախոսներ և 150+ դասընթացներ, որոնք ծածկում են տեխնոլոգիական ոլորտի ամենակարևոր ուղղությունները։'
                  : language === 'ru'
                  ? 'Сегодня мы гордимся тем, что у нас более 5000 студентов, 50+ преподавателей и 150+ курсов, охватывающих наиболее важные направления технологической сферы.'
                  : 'Today we are proud to have 5000+ students, 50+ instructors and 150+ courses covering the most important areas of the technology field.'
                }
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12 font-armenian">
              {language === 'hy' ? 'Մեր ղեկավարական թիմը' : language === 'ru' ? 'Наша команда руководителей' : 'Our Leadership Team'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="text-center border-0 shadow-lg course-card-hover">
                  <CardContent className="pt-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 font-armenian">
                      {member.name}
                    </h3>
                    <p className="text-edu-blue font-medium mb-3 font-armenian">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm font-armenian">
                      {member.experience}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
