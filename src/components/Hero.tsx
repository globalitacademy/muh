
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, BookOpen, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useContactStats } from '@/hooks/useContactStats';
import ScrollReveal from '@/components/ui/scroll-reveal';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useContactStats();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pt-20 pb-16">
      {/* Simple background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-12">
          {/* Left Content */}
          <div className="space-y-8">
            <ScrollReveal delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue border border-edu-blue/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 animate-pulse-slow" />
                <span className="font-medium font-armenian text-sm">Հայաստանի առաջին մոդուլային ուսումնական հարթակ</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-gradient font-armenian block mb-2">Կրթություն Առանց Սահմանների</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-armenian max-w-2xl">
                Սովորեք նոր հմտություններ մոդուլային մոտեցմամբ։ Յուրաքանչյուր մոդուլ ունի իր թեմաները, որոնք կօգնեն ձեզ աստիճանաբար տիրապետել նյութին։
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="btn-modern text-white px-8 py-4 text-lg font-armenian hover:shadow-glow min-h-[56px]" 
                  onClick={() => navigate('/courses')}
                >
                  <span>Սկսել ուսումը</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="btn-outline-modern px-8 py-4 text-lg font-armenian backdrop-blur-sm min-h-[56px]" 
                  onClick={() => navigate('/about')}
                >
                  <Play className="mr-2 w-5 h-5" />
                  <span>Մեր մասին</span>
                </Button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <ScrollReveal delay={500}>
              <div className="relative">
                {/* Hero Visual Card */}
                <div className="glass-card rounded-3xl p-8 bg-card/40 backdrop-blur-xl border border-border/20 shadow-2xl">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-edu-blue to-purple-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold font-armenian text-foreground">Ինտերակտիվ ուսուցում</h3>
                        <p className="text-sm text-muted-foreground font-armenian">Գործնական հմտություններ</p>
                      </div>
                    </div>

                    {/* Progress bars */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-armenian text-foreground">Ծրագրավորում</span>
                          <span className="text-edu-blue font-medium">85%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-gradient-to-r from-edu-blue to-purple-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-armenian text-foreground">Դիզայն</span>
                          <span className="text-green-500 font-medium">92%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-armenian text-foreground">Ցանցեր</span>
                          <span className="text-orange-500 font-medium">78%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Achievement badges */}
                    <div className="flex gap-2 pt-4">
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                        <Award className="w-3 h-3" />
                        <span className="font-armenian">Վկայագիր</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium">
                        <Users className="w-3 h-3" />
                        <span className="font-armenian">Խումբ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-bounce opacity-80"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-60"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Stats Section */}
        <ScrollReveal delay={600}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 border-t border-border/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-edu-blue mb-2 font-armenian">
                <span className="animate-scale-in">{stats?.studentsCount || 0}+</span>
              </div>
              <div className="text-muted-foreground font-armenian">Ուսանողներ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-edu-blue mb-2 font-armenian">
                <span className="animate-scale-in" style={{ animationDelay: '0.1s' }}>{stats?.modulesCount || 0}</span>
              </div>
              <div className="text-muted-foreground font-armenian">Մոդուլներ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-edu-blue mb-2 font-armenian">
                <span className="animate-scale-in" style={{ animationDelay: '0.2s' }}>{stats?.instructorsCount || 0}+</span>
              </div>
              <div className="text-muted-foreground font-armenian">Մանկավարժներ</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Hero;
