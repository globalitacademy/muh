import React from 'react';
import { Star } from 'lucide-react';
import SpecialtiesList from './SpecialtiesList';
const Courses = () => {
  return <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium font-armenian">Մասնագիտական ուղղություններ</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 font-armenian text-gradient md:text-4xl">
            Ընտրեք ձեր մասնագիտությունը
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian leading-relaxed">Յուրաքանչյուր մասնագիտություն պարունակում է մոդուլային դասեր ըստ պետական հաստատված մասնագիտական չափորոշիչների, որոնք կօգնեն ձեզ կառուցել ամուր գիտելիքների հիմք</p>
        </div>
        
        <SpecialtiesList />
      </div>
    </section>;
};
export default Courses;