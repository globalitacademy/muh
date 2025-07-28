
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialtiesList from '@/components/SpecialtiesList';
import { Star } from 'lucide-react';

const Specialties = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <Header />
      <main className="py-24 w-full">
        <div className="content-container">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium font-armenian">Մասնագիտական ուղղություններ</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-armenian bg-gradient-to-r from-foreground via-edu-blue to-edu-purple bg-clip-text text-transparent leading-[1.2] py-2">
              Բոլոր մասնագիտությունները
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian leading-relaxed">
              Ընտրեք ձեր ապագա մասնագիտությունը և սկսեք ուսումը մոդուլային մոտեցմամբ
            </p>
          </div>
          
          <SpecialtiesList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Specialties;
