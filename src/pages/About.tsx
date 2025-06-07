
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Target, Users, Award, Globe, Star, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const About = () => {
  const { t, language } = useLanguage();

  // Fetch real statistics from database
  const { data: stats, isLoading } = useQuery({
    queryKey: ['about-stats'],
    queryFn: async () => {
      // Get total students count
      const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Get total instructors count
      const { count: instructorsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'instructor');

      // Get total active modules count
      const { count: modulesCount } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get average rating from modules
      const { data: ratingData } = await supabase
        .from('modules')
        .select('rating')
        .not('rating', 'is', null)
        .eq('is_active', true);

      const averageRating = ratingData?.length > 0 
        ? ratingData.reduce((sum, module) => sum + (module.rating || 0), 0) / ratingData.length
        : 0;

      return {
        studentsCount: studentsCount || 0,
        instructorsCount: instructorsCount || 0,
        modulesCount: modulesCount || 0,
        averageRating: averageRating
      };
    }
  });

  // Fetch real instructor data from database
  const { data: instructors, isLoading: instructorsLoading } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'instructor')
        .limit(6);

      return data || [];
    }
  });

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

  const achievements = [
    { 
      number: isLoading ? '...' : `${stats?.studentsCount || 0}`, 
      label: language === 'hy' ? 'Ուսանողներ' : 'Students' 
    },
    { 
      number: isLoading ? '...' : `${stats?.instructorsCount || 0}`, 
      label: language === 'hy' ? 'Դասախոսներ' : 'Instructors' 
    },
    { 
      number: isLoading ? '...' : `${stats?.modulesCount || 0}`, 
      label: language === 'hy' ? 'Դասընթացներ' : 'Courses' 
    },
    { 
      number: isLoading ? '...' : (stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'), 
      label: language === 'hy' ? 'Միջին գնահատական' : 'Average Rating' 
    }
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
              {achievements.map((stat, index) => (
                <div key={index} className="modern-card glass-card rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-armenian text-sm md:text-base">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {values.map((value, index) => (
                <Card key={index} className="modern-card course-card-hover border-0 shadow-lg group overflow-hidden h-full">
                  <CardContent className="p-6 lg:p-8 text-center h-full flex flex-col">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${value.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-4 font-armenian group-hover:text-edu-blue transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground font-armenian leading-relaxed text-sm flex-grow">
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
                {language === 'hy' ? 'Մեր դասախոսներ' : language === 'ru' ? 'Наши преподаватели' : 'Our Instructors'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian">
                {language === 'hy' 
                  ? 'Փորձառու մասնագետներ, որոնք նվիրված են ձեր հաջողությանը'
                  : 'Experienced professionals dedicated to your success'
                }
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {instructorsLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="modern-card border-0 shadow-lg h-full">
                    <CardContent className="p-6 lg:p-8 text-center h-full flex flex-col">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted animate-pulse" />
                      <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                      <div className="h-4 bg-muted rounded mb-3 animate-pulse" />
                      <div className="h-12 bg-muted rounded animate-pulse flex-grow" />
                    </CardContent>
                  </Card>
                ))
              ) : instructors && instructors.length > 0 ? (
                instructors.map((instructor, index) => (
                  <Card key={instructor.id} className="modern-card course-card-hover border-0 shadow-lg group overflow-hidden h-full">
                    <CardContent className="p-6 lg:p-8 text-center h-full flex flex-col">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-edu-blue to-purple-600 flex items-center justify-center">
                        {instructor.avatar_url ? (
                          <img 
                            src={instructor.avatar_url} 
                            alt={instructor.name || 'Դասախոս'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 font-armenian group-hover:text-edu-blue transition-colors">
                        {instructor.name || 'Դասախոս'}
                      </h3>
                      <p className="text-edu-blue font-medium mb-3 font-armenian">
                        {language === 'hy' ? 'Դասախոս' : language === 'ru' ? 'Преподаватель' : 'Instructor'}
                      </p>
                      <p className="text-muted-foreground text-sm font-armenian leading-relaxed flex-grow">
                        {instructor.department || instructor.field_of_study || 
                          (language === 'hy' ? 'Փորձառու մասնագետ' : 'Experienced professional')
                        }
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground font-armenian">
                    {language === 'hy' ? 'Դասախոսներ չեն գտնվել' : 'No instructors found'}
                  </p>
                </div>
              )}
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
