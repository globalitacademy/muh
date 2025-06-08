
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, Award, BookOpen, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useContactStats } from '@/hooks/useContactStats';
import NetworkAnimation from './NetworkAnimation';
import ScrollReveal from '@/components/ui/scroll-reveal';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useContactStats();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 pt-16 sm:pt-20">
      {/* Network Animation Background */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <NetworkAnimation />
      </div>

      {/* Enhanced Background decorations - Optimized for mobile */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-edu-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:mix-blend-screen dark:opacity-30"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:mix-blend-screen dark:opacity-30"></div>
        <div className="absolute -bottom-4 sm:-bottom-8 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:mix-blend-screen dark:opacity-30"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-24" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Enhanced Badge - Mobile optimized */}
          <ScrollReveal delay={100}>
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-edu-blue/10 text-edu-blue mb-6 sm:mb-8 backdrop-blur-sm border border-edu-blue/20 hover-interactive">
              <Star className="w-4 sm:w-5 h-4 sm:h-5 animate-pulse-slow" />
              <span className="font-medium font-armenian text-sm sm:text-base">Հայաստանի առաջին մոդուլային ուսումնական հարթակ</span>
            </div>
          </ScrollReveal>

          {/* Enhanced Main heading - Mobile responsive typography */}
          <ScrollReveal delay={200}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              <span className="text-gradient font-armenian animate-fade-in-up">Կրթություն</span>
              <br />
              <span className="text-foreground font-armenian animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Առանց Սահմանների</span>
            </h1>
          </ScrollReveal>

          {/* Enhanced Description - Mobile typography */}
          <ScrollReveal delay={400}>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-armenian px-2">
              Սովորեք նոր հմտություններ մոդուլային մոտեցմամբ։ Յուրաքանչյուր մոդուլ ունի իր թեմաները, որոնք կօգնեն ձեզ աստիճանաբար տիրապետել նյութին։
            </p>
          </ScrollReveal>

          {/* Enhanced CTA Buttons - Mobile optimized */}
          <ScrollReveal delay={600}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
              <Button 
                size="lg" 
                className="btn-modern text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-armenian hover:shadow-glow w-full sm:w-auto min-h-[48px]" 
                onClick={() => navigate('/courses')}
              >
                Սկսել ուսումը
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline-modern px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-armenian backdrop-blur-sm w-full sm:w-auto min-h-[48px]" 
                onClick={() => navigate('/about')}
              >
                <Play className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                Մեր մասին
              </Button>
            </div>
          </ScrollReveal>

          {/* Enhanced Stats - Mobile grid optimization */}
          <ScrollReveal delay={800}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto px-2">
              <div className="glass-card rounded-2xl p-4 sm:p-6 text-center bg-card/50 backdrop-blur-md border border-border hover-interactive">
                <div className="text-2xl sm:text-3xl font-bold text-edu-blue mb-2 font-armenian">
                  {statsLoading ? (
                    <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 animate-spin mx-auto" />
                  ) : (
                    <span className="animate-scale-in">{stats?.studentsCount || 0}+</span>
                  )}
                </div>
                <div className="text-muted-foreground font-armenian text-sm sm:text-base">Ուսանողներ</div>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-6 text-center bg-card/50 backdrop-blur-md border border-border hover-interactive">
                <div className="text-2xl sm:text-3xl font-bold text-edu-blue mb-2 font-armenian">
                  {statsLoading ? (
                    <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 animate-spin mx-auto" />
                  ) : (
                    <span className="animate-scale-in" style={{ animationDelay: '0.1s' }}>{stats?.modulesCount || 0}</span>
                  )}
                </div>
                <div className="text-muted-foreground font-armenian text-sm sm:text-base">Մոդուլներ</div>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-6 text-center bg-card/50 backdrop-blur-md border border-border hover-interactive sm:col-span-1 col-span-1">
                <div className="text-2xl sm:text-3xl font-bold text-edu-blue mb-2 font-armenian">
                  {statsLoading ? (
                    <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 animate-spin mx-auto" />
                  ) : (
                    <span className="animate-scale-in" style={{ animationDelay: '0.2s' }}>{stats?.instructorsCount || 0}+</span>
                  )}
                </div>
                <div className="text-muted-foreground font-armenian text-sm sm:text-base">Մանկավարժներ</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Enhanced Floating elements - Hidden on mobile for better performance */}
      <div className="absolute top-1/4 left-4 lg:left-10 hidden lg:block animate-float" style={{ zIndex: 11 }}>
        <div className="glass-card rounded-xl p-4 shadow-modern-lg backdrop-blur-sm bg-card/80 border border-border hover-interactive">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold font-armenian text-card-foreground">Իրական մասնագետներ</div>
              <div className="text-sm text-muted-foreground font-armenian">Փորձագետ ուսուցիչներ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/3 right-4 lg:right-10 hidden lg:block animate-float" style={{ zIndex: 11, animationDelay: '1s' }}>
        <div className="glass-card rounded-xl p-4 shadow-modern-lg backdrop-blur-sm bg-card/80 border border-border hover-interactive">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold font-armenian text-card-foreground">Վկայագիր</div>
              <div className="text-sm text-muted-foreground font-armenian">Ավարտի հավաստագիր</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
