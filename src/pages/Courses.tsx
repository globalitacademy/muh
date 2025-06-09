
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ModulesList from '@/components/ModulesList';
import { Star } from 'lucide-react';

const Courses = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <Header />
      <main className="py-24 w-full">
        <div className="content-container">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium font-armenian">Ուսումնական մոդուլներ</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-armenian text-gradient">
              Բոլոր դասընթացները
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian leading-relaxed">
              Յուրաքանչյուր մոդուլ պարունակում է թեմատիկ դասեր, որոնք կօգնեն ձեզ կառուցել ամուր գիտելիքների հիմք
            </p>
          </div>
          
          <ModulesList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
