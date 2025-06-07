import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  return <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-edu-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:mix-blend-screen dark:opacity-30"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:mix-blend-screen dark:opacity-30"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:mix-blend-screen dark:opacity-30"></div>
      </div>

      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-edu-blue/10 text-edu-blue mb-8 backdrop-blur-sm border border-edu-blue/20">
            <Star className="w-5 h-5" />
            <span className="font-medium font-armenian">Հայաստանի առաջին մոդուլային ուսումնական հարթակ</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-gradient font-armenian">Կրթություն</span>
            <br />
            <span className="text-foreground font-armenian">Առանց Սահմանների</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-armenian">
            Սովորեք նոր հմտություններ մոդուլային մոտեցմամբ։ Յուրաքանչյուր մոդուլ ունի իր թեմաները, որոնք կօգնեն ձեզ աստիճանաբար տիրապետել նյութին։
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="btn-modern text-white px-8 py-4 text-lg font-armenian" onClick={() => navigate('/courses')}>
              Սկսել ուսումը
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-armenian backdrop-blur-sm border-border bg-background/80 text-foreground hover:bg-accent" onClick={() => navigate('/about')}>
              <Play className="mr-2 w-5 h-5" />
              Դիտել ցուցադրությունը
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-6 text-center bg-card/50 backdrop-blur-md border border-border">
              <div className="text-3xl font-bold text-edu-blue mb-2">500+</div>
              <div className="text-muted-foreground font-armenian">Ուսանողներ</div>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center bg-card/50 backdrop-blur-md border border-border">
              <div className="text-3xl font-bold text-edu-blue mb-2">50+</div>
              <div className="text-muted-foreground font-armenian">Մոդուլներ</div>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center bg-card/50 backdrop-blur-md border border-border">
              <div className="text-3xl font-bold text-edu-blue mb-2">95%</div>
              <div className="text-muted-foreground font-armenian">Բավարարվածություն</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 hidden lg:block">
        <div className="glass-card rounded-xl p-4 shadow-lg backdrop-blur-sm bg-card/80 border border-border">
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

      <div className="absolute top-1/3 right-10 hidden lg:block">
        <div className="glass-card rounded-xl p-4 shadow-lg backdrop-blur-sm bg-card/80 border border-border">
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
    </section>;
};
export default Hero;