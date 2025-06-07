
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialtiesList from '@/components/SpecialtiesList';
import { Star } from 'lucide-react';

const Specialties = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium font-armenian">Մասնագիտական ուղղություններ</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-armenian text-gradient">
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
