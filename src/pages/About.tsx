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
      title: t('about.mission'),
      description: t('about.mission-desc'),
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('about.team'),
      description: t('about.team-desc'),
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('about.quality'),
      description: t('about.quality-desc'),
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('about.global'),
      description: t('about.global-desc'),
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const achievements = [
    { 
      number: isLoading ? '...' : `${stats?.studentsCount || 0}`, 
      label: t('hero.stats.students')
    },
    { 
      number: isLoading ? '...' : `${stats?.instructorsCount || 0}`, 
      label: t('hero.stats.instructors')
    },
    { 
      number: isLoading ? '...' : `${stats?.modulesCount || 0}`, 
      label: t('hero.stats.modules')
    },
    { 
      number: isLoading ? '...' : (stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'), 
      label: t('hero.stats.satisfaction')
    }
  ];

  return (
    <div className="min-h-screen bg-background w-full">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/5 via-background to-purple-500/5"></div>
          <div className="content-container relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium font-armenian">{t('about.our-story')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-armenian">
                <span className="text-gradient">{t('nav.about')}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-armenian leading-relaxed">
                {t('about.description')}
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
        <section className="py-20 bg-muted/20 w-full">
          <div className="content-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-armenian text-gradient">
                {t('about.values')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian">
                {t('about.values-desc')}
              </p>
            </div>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="group relative">
                  <div className="glass-card rounded-3xl p-8 h-full border-0 shadow-xl backdrop-blur-lg bg-gradient-to-br from-card/80 to-card/40 hover:from-card/90 hover:to-card/60 transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-r ${value.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        {value.icon}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold mb-4 font-armenian group-hover:text-edu-blue transition-colors duration-300">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground font-armenian leading-relaxed text-lg">
                          {value.description}
                        </p>
                      </div>
                    </div>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.color} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 w-full">
          <div className="content-container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-armenian text-gradient">
                {t('about.our-story')}
              </h2>
              <div className="glass-card rounded-2xl p-8 md:p-12">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed font-armenian">
                    {t('about.platform-created')}
                  </p>
                  <p className="text-lg leading-relaxed font-armenian">
                    {t('about.goal')}
                  </p>
                  <div className="flex items-center gap-3 text-edu-blue">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-armenian font-medium">
                      {t('about.excellent-courses')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/20 w-full">
          <div className="content-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-armenian text-gradient">
                {t('about.our-instructors')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian">
                {t('about.instructors-desc')}
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
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300 bg-edu-blue flex items-center justify-center">
                        {instructor.avatar_url ? (
                          <img 
                            src={instructor.avatar_url} 
                            alt={instructor.name || t('about.instructor')}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 font-armenian group-hover:text-edu-blue transition-colors">
                        {instructor.name || t('about.instructor')}
                      </h3>
                      <p className="text-edu-blue font-medium mb-3 font-armenian">
                        {t('about.instructor')}
                      </p>
                      <p className="text-muted-foreground text-sm font-armenian leading-relaxed flex-grow">
                        {instructor.department || instructor.field_of_study || t('about.experienced-professional')}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground font-armenian">
                    {t('about.no-instructors')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 w-full">
          <div className="content-container text-center">
            <div className="glass-card rounded-2xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 font-armenian text-gradient">
                {t('about.ready-start')}
              </h3>
              <p className="text-xl text-muted-foreground mb-8 font-armenian">
                {t('about.join-community')}
              </p>
              <button className="btn-modern text-white px-8 py-4 rounded-xl font-armenian font-semibold text-lg hover:scale-105 transition-transform">
                {t('features.start-now')}
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
