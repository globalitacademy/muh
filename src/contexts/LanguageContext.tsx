
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'hy' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  hy: {
    // Navigation
    'nav.home': 'Գլխավոր',
    'nav.courses': 'Դասընթացներ',
    'nav.about': 'Մեր մասին',
    'nav.contact': 'Կապ',
    'nav.login': 'Մուտք',
    'nav.register': 'Գրանցում',
    
    // Hero section
    'hero.title': 'Կրթություն առանց սահմանների',
    'hero.subtitle': 'Բացահայտեք ձեր ներուժը մեր ժամանակակից կրթական հարթակի միջոցով',
    'hero.cta': 'Սկսել ուսումը',
    'hero.learn-more': 'Իմանալ ավելին',
    
    // Features
    'features.title': 'Ինչու՞ ընտրել մեզ',
    'features.quality.title': 'Բարձրորակ կրթություն',
    'features.quality.desc': 'Մասնագիտական դասախոսներ և ժամանակակից մեթոդներ',
    'features.flexible.title': 'Ճկուն ուսուցում',
    'features.flexible.desc': 'Ուսումնասիրեք ձեր հարմար ժամանակին և տեմպով',
    'features.support.title': 'Մշտական աջակցություն',
    'features.support.desc': '24/7 տեխնիկական և ակադեմիական աջակցություն',
    
    // Courses
    'courses.title': 'Հանրաճանաչ դասընթացներ',
    'courses.view-all': 'Դիտել բոլորը',
    'courses.students': 'ուսանողներ',
    'courses.lessons': 'դասեր',
    'courses.level.beginner': 'Սկսնակ',
    'courses.level.intermediate': 'Միջին',
    'courses.level.advanced': 'Բարձր',
    
    // Stats
    'stats.students': 'Ակտիվ ուսանողներ',
    'stats.courses': 'Դասընթացներ',
    'stats.instructors': 'Դասախոսներ',
    'stats.completion': 'Ավարտման դրույքաչափ',
    
    // Footer
    'footer.description': 'Ապագայի կրթական հարթակ՝ նորարարական մոտեցումներով և անսահման հնարավորություններով:',
    'footer.quick-links': 'Արագ հղումներ',
    'footer.contact-info': 'Կապի տվյալներ',
    'footer.follow-us': 'Հետևեք մեզ',
    'footer.rights': 'Բոլոր իրավունքները պաշտպանված են:'
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.courses': 'Курсы',
    'nav.about': 'О нас',
    'nav.contact': 'Контакты',
    'nav.login': 'Вход',
    'nav.register': 'Регистрация',
    
    // Hero section
    'hero.title': 'Образование без границ',
    'hero.subtitle': 'Раскройте свой потенциал с помощью нашей современной образовательной платформы',
    'hero.cta': 'Начать обучение',
    'hero.learn-more': 'Узнать больше',
    
    // Features
    'features.title': 'Почему выбирают нас',
    'features.quality.title': 'Качественное образование',
    'features.quality.desc': 'Профессиональные преподаватели и современные методы',
    'features.flexible.title': 'Гибкое обучение',
    'features.flexible.desc': 'Изучайте в удобное время и в своем темпе',
    'features.support.title': 'Постоянная поддержка',
    'features.support.desc': 'Техническая и академическая поддержка 24/7',
    
    // Courses
    'courses.title': 'Популярные курсы',
    'courses.view-all': 'Смотреть все',
    'courses.students': 'студентов',
    'courses.lessons': 'уроков',
    'courses.level.beginner': 'Начальный',
    'courses.level.intermediate': 'Средний',
    'courses.level.advanced': 'Продвинутый',
    
    // Stats
    'stats.students': 'Активных студентов',
    'stats.courses': 'Курсов',
    'stats.instructors': 'Преподавателей',
    'stats.completion': 'Процент завершения',
    
    // Footer
    'footer.description': 'Образовательная платформа будущего с инновационными подходами и безграничными возможностями.',
    'footer.quick-links': 'Быстрые ссылки',
    'footer.contact-info': 'Контактная информация',
    'footer.follow-us': 'Следите за нами',
    'footer.rights': 'Все права защищены.'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Hero section
    'hero.title': 'Education Without Limits',
    'hero.subtitle': 'Unlock your potential with our modern educational platform',
    'hero.cta': 'Start Learning',
    'hero.learn-more': 'Learn More',
    
    // Features
    'features.title': 'Why Choose Us',
    'features.quality.title': 'Quality Education',
    'features.quality.desc': 'Professional instructors and modern methods',
    'features.flexible.title': 'Flexible Learning',
    'features.flexible.desc': 'Study at your own pace and schedule',
    'features.support.title': 'Continuous Support',
    'features.support.desc': '24/7 technical and academic support',
    
    // Courses
    'courses.title': 'Popular Courses',
    'courses.view-all': 'View All',
    'courses.students': 'students',
    'courses.lessons': 'lessons',
    'courses.level.beginner': 'Beginner',
    'courses.level.intermediate': 'Intermediate',
    'courses.level.advanced': 'Advanced',
    
    // Stats
    'stats.students': 'Active Students',
    'stats.courses': 'Courses',
    'stats.instructors': 'Instructors',
    'stats.completion': 'Completion Rate',
    
    // Footer
    'footer.description': 'The educational platform of the future with innovative approaches and limitless possibilities.',
    'footer.quick-links': 'Quick Links',
    'footer.contact-info': 'Contact Information',
    'footer.follow-us': 'Follow Us',
    'footer.rights': 'All rights reserved.'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hy');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      currentLanguage: language, 
      setLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
