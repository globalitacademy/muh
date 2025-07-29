
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
    'nav.specialties': 'Մասնագիտություններ',
    'nav.about': 'Մեր մասին',
    'nav.contact': 'Կապ',
    'nav.login': 'Մուտք',
    'nav.register': 'Գրանցում',
    
    // Hero section
    'hero.title': 'Կրթություն առանց սահմանների',
    'hero.subtitle': 'Բացահայտեք ձեր ներուժը մեր ժամանակակից կրթական հարթակի միջոցով',
    'hero.cta': 'Սկսել ուսումը',
    'hero.learn-more': 'Իմանալ ավելին',
    'hero.badge': 'Հայաստանի առաջին մոդուլային ուսումնական հարթակ',
    'hero.description': 'Սովորեք նոր հմտություններ մոդուլային մոտեցմամբ։ Յուրաքանչյուր մոդուլ ունի իր թեմաները, որոնք կօգնեն ձեզ աստիճանաբար տիրապետել նյութին։',
    
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
    
    // Newsletter
    'newsletter.title': 'Բաժանորդագրվեք մեր նորություններին',
    'newsletter.description': 'Ստացեք նոր դասընթացների և հատուկ առաջարկությունների մասին տեղեկություններ',
    'newsletter.placeholder': 'Ձեր էլ. փոստը',
    'newsletter.subscribe': 'Բաժանորդագրվել',
    
    // User Menu
    'user.login': 'Մուտք',
    'user.profile': 'Իմ պրոֆիլը',
    'user.courses': 'Իմ դասընթացները',
    'user.admin': 'Ադմին վահանակ',
    'user.logout': 'Դուրս գալ',
    'user.guest': 'Օգտատեր',
    
    // Common
    'common.loading': 'Բեռնում...',
    'common.error': 'Սխալ',
    'common.success': 'Հաջողություն',
    'common.save': 'Պահպանել',
    'common.cancel': 'Չեղարկել',
    'common.edit': 'Խմբագրել',
    'common.delete': 'Ջնջել',
    'common.view': 'Դիտել',
    'common.add': 'Ավելացնել',
    'common.search': 'Փնտրել',
    'common.filter': 'Զտարկ',
    'common.sort': 'Դասակարգել',
    'common.clear': 'Մաքրել',
    'common.submit': 'Ուղարկել',
    'common.close': 'Փակել',
    
    // Hero stats
    'hero.stats.students': 'Ուսանողներ',
    'hero.stats.modules': 'Մոդուլներ',
    'hero.stats.instructors': 'Մանկավարժներ',
    'hero.stats.satisfaction': 'Բավարարվածություն',
    'hero.stats.certificate': 'Վկայագիր',
    'hero.stats.group': 'Խումբ',
    'hero.stats.interactive': 'Ինտերակտիվ ուսուցում',
    'hero.stats.practical': 'Գործնական հմտություններ',
    'hero.stats.programming': 'Ծրագրավորում',
    'hero.stats.design': 'Դիզայն',
    'hero.stats.networking': 'Ցանցեր',
    'hero.stats.experts': 'Փորձագետներ',
    'hero.stats.high-rating': 'Բարձր գնահատական',
    'hero.stats.monthly-growth': 'այս ամիս',
    'hero.stats.new-modules': 'նոր մոդուլ',
    
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
    'nav.specialties': 'Специальности',
    'nav.about': 'О нас',
    'nav.contact': 'Контакты',
    'nav.login': 'Вход',
    'nav.register': 'Регистрация',
    
    // Hero section
    'hero.title': 'Образование без границ',
    'hero.subtitle': 'Раскройте свой потенциал с помощью нашей современной образовательной платформы',
    'hero.cta': 'Начать обучение',
    'hero.learn-more': 'Узнать больше',
    'hero.badge': 'Первая модульная образовательная платформа Армении',
    'hero.description': 'Изучайте новые навыки с модульным подходом. Каждый модуль имеет свои темы, которые помогут вам постепенно освоить материал.',
    
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
    
    // Newsletter
    'newsletter.title': 'Подпишитесь на наши новости',
    'newsletter.description': 'Получайте информацию о новых курсах и специальных предложениях',
    'newsletter.placeholder': 'Ваш email',
    'newsletter.subscribe': 'Подписаться',
    
    // User Menu
    'user.login': 'Вход',
    'user.profile': 'Мой профиль',
    'user.courses': 'Мои курсы',
    'user.admin': 'Админ панель',
    'user.logout': 'Выход',
    'user.guest': 'Пользователь',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.edit': 'Изменить',
    'common.delete': 'Удалить',
    'common.view': 'Просмотр',
    'common.add': 'Добавить',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.sort': 'Сортировка',
    'common.clear': 'Очистить',
    'common.submit': 'Отправить',
    'common.close': 'Закрыть',
    
    // Hero stats
    'hero.stats.students': 'Студенты',
    'hero.stats.modules': 'Модули',
    'hero.stats.instructors': 'Преподаватели',
    'hero.stats.satisfaction': 'Удовлетворенность',
    'hero.stats.certificate': 'Сертификат',
    'hero.stats.group': 'Группа',
    'hero.stats.interactive': 'Интерактивное обучение',
    'hero.stats.practical': 'Практические навыки',
    'hero.stats.programming': 'Программирование',
    'hero.stats.design': 'Дизайн',
    'hero.stats.networking': 'Сети',
    'hero.stats.experts': 'Эксперты',
    'hero.stats.high-rating': 'Высокий рейтинг',
    'hero.stats.monthly-growth': 'в этом месяце',
    'hero.stats.new-modules': 'новых модуля',
    
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
    'nav.specialties': 'Specialties',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Hero section
    'hero.title': 'Education Without Limits',
    'hero.subtitle': 'Unlock your potential with our modern educational platform',
    'hero.cta': 'Start Learning',
    'hero.learn-more': 'Learn More',
    'hero.badge': "Armenia's first modular learning platform",
    'hero.description': 'Learn new skills with a modular approach. Each module has its topics that will help you gradually master the material.',
    
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
    
    // Newsletter
    'newsletter.title': 'Subscribe to our newsletter',
    'newsletter.description': 'Get information about new courses and special offers',
    'newsletter.placeholder': 'Your email',
    'newsletter.subscribe': 'Subscribe',
    
    // User Menu
    'user.login': 'Login',
    'user.profile': 'My Profile',
    'user.courses': 'My Courses',
    'user.admin': 'Admin Panel',
    'user.logout': 'Logout',
    'user.guest': 'User',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.clear': 'Clear',
    'common.submit': 'Submit',
    'common.close': 'Close',
    
    // Hero stats
    'hero.stats.students': 'Students',
    'hero.stats.modules': 'Modules',
    'hero.stats.instructors': 'Instructors',
    'hero.stats.satisfaction': 'Satisfaction',
    'hero.stats.certificate': 'Certificate',
    'hero.stats.group': 'Group',
    'hero.stats.interactive': 'Interactive Learning',
    'hero.stats.practical': 'Practical Skills',
    'hero.stats.programming': 'Programming',
    'hero.stats.design': 'Design',
    'hero.stats.networking': 'Networking',
    'hero.stats.experts': 'Experts',
    'hero.stats.high-rating': 'High Rating',
    'hero.stats.monthly-growth': 'this month',
    'hero.stats.new-modules': 'new modules',
    
    // Footer
    'footer.description': 'The educational platform of the future with innovative approaches and limitless possibilities.',
    'footer.quick-links': 'Quick Links',
    'footer.contact-info': 'Contact Information',
    'footer.follow-us': 'Follow Us',
    'footer.rights': 'All rights reserved.'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to Armenian
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language');
      if (savedLanguage && ['hy', 'ru', 'en'].includes(savedLanguage)) {
        return savedLanguage as Language;
      }
      // Try to detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ru')) return 'ru';
      if (browserLang.startsWith('en')) return 'en';
    }
    return 'hy'; // Default to Armenian
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
    }
  };

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
