
import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-16 bg-background w-full">
      <div className="content-container text-center">
        <h3 className="text-2xl font-bold mb-4 font-armenian text-foreground">
          Բաժանորդագրվեք մեր նորություններին
        </h3>
        <p className="text-muted-foreground mb-6 font-armenian">
          Ստացեք նոր դասընթացների և հատուկ առաջարկությունների մասին տեղեկություններ
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Ձեր էլ. փոստը" 
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-edu-blue transition-colors" 
          />
          <button className="btn-modern text-white px-6 py-3 rounded-lg font-armenian font-semibold hover:scale-105 transition-transform">
            Բաժանորդագրվել
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
