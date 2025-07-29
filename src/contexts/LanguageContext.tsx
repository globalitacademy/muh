
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
    
    // Enhanced Features
    'features.expert-evaluation.title': 'Փորձագիտական գնահատում',
    'features.expert-evaluation.desc': 'Ստացիր հետադարձ կապ մասնագետներից և բարելավի՛ր քո հմտությունները',
    'features.interactive-learning.title': 'Ինտերակտիվ ուսուցում',
    'features.interactive-learning.desc': 'Գործնական առաջադրանքներ և իրական նախագծեր ուսումնառության համար',
    'features.certificates.title': 'Վկայագրեր',
    'features.certificates.desc': 'Ստացիր ճանաչված վկայագրեր դասընթացների ավարտին',
    
    // Courses page
    'courses.learning-modules': 'Ուսումնական մոդուլներ',
    'courses.all-courses': 'Բոլոր դասընթացները',
    'courses.modules-description': 'Յուրաքանչյուր մոդուլ պարունակում է թեմատիկ դասեր, որոնք կօգնեն ձեզ կառուցել ամուր գիտելիքների հիմք',
    'courses.error-loading': 'Սխալ է տեղի ունեցել տվյալները բեռնելիս',
    'courses.no-courses': 'Դասընթացներ չեն գտնվել',
    'courses.create-first': 'Ստեղծեք ձեր առաջին դասընթացը',
    'courses.start-learning': 'Սկսել ուսուցումը',
    
    // Module Detail page
    'module.not-found': 'Դասընթացը չի գտնվել',
    'module.back-home': 'Վերադառնալ գլխավոր էջ',
    'module.price': 'Արժեք',
    'module.for-entire-course': 'Ամբողջ դասընթացի համար',
    'module.your-progress': 'Ձեր առաջընթացը',
    'module.completed': 'ավարտված',
    'module.start-learning': 'Սկսել ուսուցումը',
    'module.enrolling': 'Գրանցվում է...',
    'module.enroll-now': 'Գրանցվել հիմա',
    'module.register-for-course': 'Գրանցվել դասընթացի համար',
    'module.certificate': 'Վկայագիր',
    'module.yes': 'Այո',
    'module.access': 'Մուտք',
    'module.lifetime': 'Մշտապես',
    'module.language': 'Լեզու',
    'module.armenian': 'Հայերեն',
    'module.temp-access': 'Ժամանակավոր մուտք',
    'module.temp-access-desc': 'Օգտագործեք գործընկերոջ կոդը՝ բոլոր դասերը 60 րոպեով անվճար դիտելու համար',
    'module.code-valid': 'Կոդը վավեր է միայն 60 րոպե',
    'module.remaining-time': 'մնացած ժամանակ',
    
    // Module tabs
    'module.tabs.overview': 'Նկարագիր',
    'module.tabs.curriculum': 'Դասընթացի ծրագիր',
    'module.tabs.instructors': 'Մասնագետներ',
    'module.tabs.management': 'Կառավարում',
    
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
    
    // Enhanced Features
    'features.badge': 'Ինչու՞ ընտրել մեզ',
    'features.advantages': 'Մեր առավելությունները',
    'features.description': 'Մենք առաջարկում ենք ամենաարդիական և արդյունավետ ուսումնական հարթակը՝ հնարավորություններով, որոնք կփոխեն ձեր ուսումնառության փորձը',
    
    // Features Component
    'features.why-choose': 'Ինչու՞ ընտրել մեզ',
    'features.main-desc': 'Մենք առաջարկում ենք ամենաարդիական և արդյունավետ ուսումնական հարթակը',
    'features.expert-evaluation': 'Փորձագիտական գնահատում',
    'features.expert-desc': 'Ստացիր հետադարձ կապ մասնագետներից և բարելավի՛ր քո հմտությունները',
    'features.interactive-learning': 'Ինտերակտիվ ուսուցում',
    'features.interactive-desc': 'Գործնական առաջադրանքներ և իրական նախագծեր ուսումնառության համար',
    'features.certificates': 'Վկայագրեր',
    'features.certificates-desc': 'Ստացիր ճանաչված վկայագրեր դասընթացների ավարտին',
    'features.ready-to-start': 'Պատրա՞ստ եք սկսել',
    'features.ready-desc': 'Միացիր մեր համայնքին և սկսիր քո ուսումնական ճանապարհորդությունը',
    'features.start-now': 'Սկսել հիմա',
    
    // Courses Component
    'courses.professional-directions': 'Մասնագիտական ուղղություններ',
    'courses.choose-specialty': 'Ընտրեք ձեր մասնագիտությունը',
    'courses.modular-desc': 'Յուրաքանչյուր մասնագիտություն պարունակում է մոդուլային դասեր ըստ պետական հաստատված մասնագիտական չափորոշիչների, որոնք կօգնեն ձեզ կառուցել ամուր գիտելիքների հիմք',
    
    // SpecialtiesList Component
    'specialties.no-specialties': 'Մասնագիտություններ չեն գտնվել',
    'specialties.modules': 'մոդուլ',
    'specialties.start-learning': 'Սկսել ուսումը',
    'specialties.coming-soon': 'Շուտով',
    
    // TopicContent Component
    'topic.loading-content': 'Բեռնվում է բովանդակությունը...',
    'topic.error-loading': 'Սխալ է տեղի ունեցել բովանդակությունը բեռնելիս',
    'topic.content-coming-soon': 'Տեսական նյութը շուտով կլինի հասանելի',
    'topic.theoretical-material': 'Տեսական նյութ',
    'topic.progress': 'Տեսական նյութի առաջընթաց',
    'topic.sections-completed': 'բաժին ավարտված',
    'topic.completed': 'ավարտված',
    'topic.mark-completed': 'Նշել որպես ավարտված',
    'topic.congratulations': 'Շնորհավորություններ!',
    'topic.all-sections-done': 'Դուք հաջողությամբ ավարտեցիք բոլոր տեսական բաժինները:',
    'topic.next-step': 'Անցնել հաջորդ քայլին',
    'topic.additional-resources': 'Լրացուցիչ ռեսուրսներ',
    'topic.section-coming-soon': 'Այս բաժնի բովանդակությունը շուտով կլինի հասանելի',
    
    // TopicNavigation Component
    'topic.previous': 'Նախորդ',
    'topic.next': 'Հաջորդ',
    'topic.all-lessons': 'Բոլոր դասերը',
    'topic.previous-lesson': 'Նախորդ դաս',
    'topic.next-lesson': 'Հաջորդ դաս',
    
    // About Page
    'about.our-story': 'Մեր պատմությունը',
    'about.mission': 'Մեր առաքելությունը',
    'about.mission-desc': 'Ապահովել բարձրորակ կրթություն բոլորի համար՝ անկախ տեղակայման և ֆինանսական հնարավորություններից',
    'about.team': 'Մեր թիմը',
    'about.team-desc': 'Փորձառու մասնագետներ և դասախոսներ, որոնք նվիրված են ուսանողների հաջողությանը',
    'about.quality': 'Որակի ստանդարտներ',
    'about.quality-desc': 'Ժամանակակից մեթոդներ և միջազգային ստանդարտներ կրթական գործընթացում',
    'about.global': 'Գլոբալ հասանելիություն',
    'about.global-desc': 'Բազմալեզու համակարգ և հասանելի հարթակ ցանկացած երկրից',
    'about.values': 'Մեր արժեքները',
    'about.values-desc': 'Այն սկզբունքները, որոնք ղեկավարում են մեր աշխատանքը',
    'about.our-instructors': 'Մեր դասախոսներ',
    'about.instructors-desc': 'Փորձառու մասնագետներ, որոնք նվիրված են ձեր հաջողությանը',
    'about.instructor': 'Դասախոս',
    'about.experienced-professional': 'Փորձառու մասնագետ',
    'about.no-instructors': 'Դասախոսներ չեն գտնվել',
    'about.ready-start': 'Պատրա՞ստ եք սկսելու',
    'about.join-community': 'Միացիր մեր համայնքին և սկսիր քո ուսումնական ճանապարհորդությունը',
    'about.description': 'Մենք նվիրված ենք ապագայի կրթության ստեղծմանը՝ միավորելով ժամանակակից տեխնոլոգիաները և մարդկային փորձառությունը',
    'about.platform-created': '"Կրթություն առանց սահմանների" հարթակը ծնվել է 2023 թվականին՝ մի խումբ փորձառու մասնագետների կողմից, ովքեր հավատում էին, որ որակյալ կրթությունը պետք է լինի հասանելի բոլորի համար։',
    'about.goal': 'Մեր նպատակն է ստեղծել այնպիսի կրթական միջավայր, որտեղ ուսանողները կարող են զարգանալ և հասնել իրենց նպատակներին՝ անկախ իրենց գտնվելու վայրից կամ ֆինանսական հնարավորություններից։',
    'about.excellent-courses': 'Գերազանց դասընթացներ ու մասնագիտական աջակցություն',
    
    // Contact Page
    'contact.title': 'Կապ մեր հետ',
    'contact.description': 'Մենք այստեղ ենք օգնելու ձեզ: Ուղարկեք ձեր հարցերը, և մենք շուտով կպատասխանենք',
    'contact.students': 'Ուսանողներ',
    'contact.courses': 'Դասընթացներ',
    'contact.instructors': 'Մանկավարժներ',
    'contact.info-title': 'Կապի տվյալներ',
    'contact.info-desc': 'Մենք միշտ պատրաստ ենք օգնել ձեզ: Ընտրեք ձեզ համար հարմար կապի միջոցը:',
    'contact.address': 'Հասցե',
    'contact.address-value': 'Երևան, Մամիկոնյանց 52',
    'contact.phone': 'Հեռախոս',
    'contact.email': 'Էլ․ փոստ',
    'contact.hours': 'Աշխատանքային ժամեր',
    'contact.hours-value': 'Երկուշաբթի - Ուրբաթ: 9:00 - 18:00',
    'contact.send-message': 'Ուղարկել հաղորդագրություն',
    'contact.name': 'Անուն',
    'contact.name-placeholder': 'Ձեր անունը',
    'contact.email-placeholder': 'your@email.com',
    'contact.subject': 'Թեմա',
    'contact.subject-placeholder': 'Հաղորդագրության թեմա',
    'contact.message': 'Հաղորդագրություն',
    'contact.message-placeholder': 'Ձեր հաղորդագրությունը...',
    'contact.send': 'Ուղարկել',
    'contact.message-sent': 'Հաղորդագրությունը ուղարկվեց!',
    'contact.faq': 'Հաճախ տրվող հարցեր',
    'contact.faq-desc': 'Գտեք պատասխանները ամենահաճախակի հարցերի վրա',
    'contact.how-register': 'Ինչպես գրանցվել?',
    'contact.how-register-answer': 'Սեղմեք "Գրանցում" կոճակը և լրացրեք անհրաժեշտ դաշտերը',
    'contact.how-choose-course': 'Ինչպես ընտրել դասընթաց?',
    'contact.how-choose-course-answer': 'Անցեք "Դասընթացներ" բաժին և ընտրեք ձեզ հետաքրքրող ուղղությունը',
    'contact.free-courses': 'Կա՞ արդյոք անվճար դասընթացներ:',
    'contact.free-courses-answer': 'Այո, մենք առաջարկում ենք մի շարք անվճար ներածական դասընթացներ',
    'contact.get-certificate': 'Ինչպես ստանալ վկայական?',
    'contact.get-certificate-answer': 'Հաջողությամբ ավարտելուց հետո դուք կստանաք ցիֆրային վկայական',
    
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
    
    // Enhanced Features
    'features.expert-evaluation.title': 'Экспертная оценка',
    'features.expert-evaluation.desc': 'Получайте обратную связь от специалистов и улучшайте свои навыки',
    'features.interactive-learning.title': 'Интерактивное обучение',
    'features.interactive-learning.desc': 'Практические задания и реальные проекты для обучения',
    'features.certificates.title': 'Сертификаты',
    'features.certificates.desc': 'Получайте признанные сертификаты по завершении курсов',
    
    // Courses page
    'courses.learning-modules': 'Учебные модули',
    'courses.all-courses': 'Все курсы',
    'courses.modules-description': 'Каждый модуль содержит тематические уроки, которые помогут вам построить прочную основу знаний',
    'courses.error-loading': 'Произошла ошибка при загрузке данных',
    'courses.no-courses': 'Курсы не найдены',
    'courses.create-first': 'Создайте свой первый курс',
    'courses.start-learning': 'Начать обучение',
    
    // Module Detail page
    'module.not-found': 'Курс не найден',
    'module.back-home': 'Вернуться на главную',
    'module.price': 'Цена',
    'module.for-entire-course': 'За весь курс',
    'module.your-progress': 'Ваш прогресс',
    'module.completed': 'завершено',
    'module.start-learning': 'Начать обучение',
    'module.enrolling': 'Регистрируется...',
    'module.enroll-now': 'Записаться сейчас',
    'module.register-for-course': 'Записаться на курс',
    'module.certificate': 'Сертификат',
    'module.yes': 'Да',
    'module.access': 'Доступ',
    'module.lifetime': 'Навсегда',
    'module.language': 'Язык',
    'module.armenian': 'Армянский',
    'module.temp-access': 'Временный доступ',
    'module.temp-access-desc': 'Используйте код партнера для бесплатного просмотра всех уроков в течение 60 минут',
    'module.code-valid': 'Код действителен только 60 минут',
    'module.remaining-time': 'оставшееся время',
    
    // Module tabs
    'module.tabs.overview': 'Обзор',
    'module.tabs.curriculum': 'Программа курса',
    'module.tabs.instructors': 'Специалисты',
    'module.tabs.management': 'Управление',
    
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
    
    // Enhanced Features
    'features.badge': 'Почему выбирают нас',
    'features.advantages': 'Наши преимущества',
    'features.description': 'Мы предлагаем самую современную и эффективную образовательную платформу с возможностями, которые изменят ваш опыт обучения',
    'features.why-choose': 'Почему выбирают нас',
    'features.main-desc': 'Мы предлагаем самую современную и эффективную образовательную платформу',
    'features.expert-evaluation': 'Экспертная оценка',
    'features.expert-desc': 'Получите обратную связь от специалистов и улучшите свои навыки',
    'features.interactive-learning': 'Интерактивное обучение',
    'features.interactive-desc': 'Практические задания и реальные проекты для обучения',
    'features.certificates': 'Сертификаты',
    'features.certificates-desc': 'Получите признанные сертификаты по завершении курсов',
    'features.ready-to-start': 'Готовы начать?',
    'features.ready-desc': 'Присоединяйтесь к нашему сообществу и начните свое образовательное путешествие',
    'features.start-now': 'Начать сейчас',
    
    // Courses Component
    'courses.professional-directions': 'Профессиональные направления',
    'courses.choose-specialty': 'Выберите свою специальность',
    'courses.modular-desc': 'Каждая специальность содержит модульные уроки согласно государственным профессиональным стандартам, которые помогут вам построить прочный фундамент знаний',
    
    // SpecialtiesList Component
    'specialties.no-specialties': 'Специальности не найдены',
    'specialties.modules': 'модулей',
    'specialties.start-learning': 'Начать обучение',
    'specialties.coming-soon': 'Скоро',
    
    // TopicContent Component
    'topic.loading-content': 'Загружается содержимое...',
    'topic.error-loading': 'Произошла ошибка при загрузке содержимого',
    'topic.content-coming-soon': 'Теоретический материал скоро будет доступен',
    'topic.theoretical-material': 'Теоретический материал',
    'topic.progress': 'Прогресс теоретического материала',
    'topic.sections-completed': 'разделов завершено',
    'topic.completed': 'завершено',
    'topic.mark-completed': 'Отметить как завершенное',
    'topic.congratulations': 'Поздравляем!',
    'topic.all-sections-done': 'Вы успешно завершили все теоретические разделы.',
    'topic.next-step': 'Перейти к следующему шагу',
    'topic.additional-resources': 'Дополнительные ресурсы',
    'topic.section-coming-soon': 'Содержимое этого раздела скоро будет доступно',
    
    // TopicNavigation Component
    'topic.previous': 'Предыдущий',
    'topic.next': 'Следующий',
    'topic.all-lessons': 'Все уроки',
    'topic.previous-lesson': 'Предыдущий урок',
    'topic.next-lesson': 'Следующий урок',
    
    // About Page
    'about.our-story': 'Наша история',
    'about.mission': 'Наша миссия',
    'about.mission-desc': 'Обеспечить качественное образование для всех, независимо от местоположения и финансовых возможностей',
    'about.team': 'Наша команда',
    'about.team-desc': 'Опытные специалисты и преподаватели, посвятившие себя успеху студентов',
    'about.quality': 'Стандарты качества',
    'about.quality-desc': 'Современные методы и международные стандарты в образовательном процессе',
    'about.global': 'Глобальная доступность',
    'about.global-desc': 'Многоязычная система и доступная платформа из любой страны',
    'about.values': 'Наши ценности',
    'about.values-desc': 'Принципы, которые направляют нашу работу',
    'about.our-instructors': 'Наши преподаватели',
    'about.instructors-desc': 'Опытные специалисты, посвятившие себя вашему успеху',
    'about.instructor': 'Преподаватель',
    'about.experienced-professional': 'Опытный специалист',
    'about.no-instructors': 'Преподаватели не найдены',
    'about.ready-start': 'Готовы начать?',
    'about.join-community': 'Присоединяйтесь к нашему сообществу и начните свое образовательное путешествие',
    'about.description': 'Мы посвящены созданию образования будущего, объединяя современные технологии и человеческий опыт',
    'about.platform-created': 'Платформа "Образование без границ" была создана в 2023 году группой опытных специалистов, которые верили, что качественное образование должно быть доступно каждому.',
    'about.goal': 'Наша цель - создать образовательную среду, где студенты могут развиваться и достигать своих целей, независимо от местоположения или финансовых возможностей.',
    'about.excellent-courses': 'Отличные курсы и профессиональная поддержка',
    
    // Contact Page
    'contact.title': 'Свяжитесь с нами',
    'contact.description': 'Мы здесь, чтобы помочь вам. Отправьте нам свои вопросы, и мы ответим в ближайшее время',
    'contact.students': 'Студенты',
    'contact.courses': 'Курсы',
    'contact.instructors': 'Преподаватели',
    'contact.info-title': 'Контактная информация',
    'contact.info-desc': 'Мы всегда готовы помочь вам. Выберите удобный способ связи:',
    'contact.address': 'Адрес',
    'contact.address-value': 'Ереван, Мамиконянц 52',
    'contact.phone': 'Телефон',
    'contact.email': 'Эл. почта',
    'contact.hours': 'Рабочие часы',
    'contact.hours-value': 'Понедельник - Пятница: 9:00 - 18:00',
    'contact.send-message': 'Отправить сообщение',
    'contact.name': 'Имя',
    'contact.name-placeholder': 'Ваше имя',
    'contact.email-placeholder': 'your@email.com',
    'contact.subject': 'Тема',
    'contact.subject-placeholder': 'Тема сообщения',
    'contact.message': 'Сообщение',
    'contact.message-placeholder': 'Ваше сообщение...',
    'contact.send': 'Отправить',
    'contact.message-sent': 'Сообщение отправлено!',
    'contact.faq': 'Часто задаваемые вопросы',
    'contact.faq-desc': 'Найдите ответы на самые популярные вопросы',
    'contact.how-register': 'Как зарегистрироваться?',
    'contact.how-register-answer': 'Нажмите кнопку "Регистрация" и заполните необходимые поля',
    'contact.how-choose-course': 'Как выбрать курс?',
    'contact.how-choose-course-answer': 'Перейдите в раздел "Курсы" и выберите интересующее направление',
    'contact.free-courses': 'Есть ли бесплатные курсы?',
    'contact.free-courses-answer': 'Да, мы предлагаем ряд бесплатных вводных курсов',
    'contact.get-certificate': 'Как получить сертификат?',
    'contact.get-certificate-answer': 'После успешного завершения вы получите цифровой сертификат',
    
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
    
    // Enhanced Features
    'features.expert-evaluation.title': 'Expert Evaluation',
    'features.expert-evaluation.desc': 'Get feedback from specialists and improve your skills',
    'features.interactive-learning.title': 'Interactive Learning',
    'features.interactive-learning.desc': 'Practical assignments and real projects for learning',
    'features.certificates.title': 'Certificates',
    'features.certificates.desc': 'Get recognized certificates upon course completion',
    
    // Courses page
    'courses.learning-modules': 'Learning Modules',
    'courses.all-courses': 'All Courses',
    'courses.modules-description': 'Each module contains thematic lessons that will help you build a solid foundation of knowledge',
    'courses.error-loading': 'An error occurred while loading data',
    'courses.no-courses': 'No courses found',
    'courses.create-first': 'Create your first course',
    'courses.start-learning': 'Start Learning',
    
    // Module Detail page
    'module.not-found': 'Course not found',
    'module.back-home': 'Back to Home',
    'module.price': 'Price',
    'module.for-entire-course': 'For the entire course',
    'module.your-progress': 'Your Progress',
    'module.completed': 'completed',
    'module.start-learning': 'Start Learning',
    'module.enrolling': 'Enrolling...',
    'module.enroll-now': 'Enroll Now',
    'module.register-for-course': 'Register for Course',
    'module.certificate': 'Certificate',
    'module.yes': 'Yes',
    'module.access': 'Access',
    'module.lifetime': 'Lifetime',
    'module.language': 'Language',
    'module.armenian': 'Armenian',
    'module.temp-access': 'Temporary Access',
    'module.temp-access-desc': 'Use partner code to view all lessons for free for 60 minutes',
    'module.code-valid': 'Code is valid for only 60 minutes',
    'module.remaining-time': 'remaining time',
    
    // Module tabs
    'module.tabs.overview': 'Overview',
    'module.tabs.curriculum': 'Curriculum',
    'module.tabs.instructors': 'Instructors',
    'module.tabs.management': 'Management',
    
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
    
    // Enhanced Features
    'features.badge': 'Why Choose Us',
    'features.advantages': 'Our Advantages',
    'features.description': 'We offer the most modern and effective educational platform with features that will transform your learning experience',
    'features.why-choose': 'Why Choose Us',
    'features.main-desc': 'We offer the most modern and effective educational platform',
    'features.expert-evaluation': 'Expert Evaluation',
    'features.expert-desc': 'Get feedback from specialists and improve your skills',
    'features.interactive-learning': 'Interactive Learning',
    'features.interactive-desc': 'Practical assignments and real projects for learning',
    'features.certificates': 'Certificates',
    'features.certificates-desc': 'Receive recognized certificates upon course completion',
    'features.ready-to-start': 'Ready to Start?',
    'features.ready-desc': 'Join our community and begin your educational journey',
    'features.start-now': 'Start Now',
    
    // Courses Component
    'courses.professional-directions': 'Professional Directions',
    'courses.choose-specialty': 'Choose Your Specialty',
    'courses.modular-desc': 'Each specialty contains modular lessons according to state-approved professional standards that will help you build a solid foundation of knowledge',
    
    // SpecialtiesList Component
    'specialties.no-specialties': 'No specialties found',
    'specialties.modules': 'modules',
    'specialties.start-learning': 'Start Learning',
    'specialties.coming-soon': 'Coming Soon',
    
    // TopicContent Component
    'topic.loading-content': 'Loading content...',
    'topic.error-loading': 'Error occurred while loading content',
    'topic.content-coming-soon': 'Theoretical material will be available soon',
    'topic.theoretical-material': 'Theoretical Material',
    'topic.progress': 'Theoretical Material Progress',
    'topic.sections-completed': 'sections completed',
    'topic.completed': 'completed',
    'topic.mark-completed': 'Mark as Completed',
    'topic.congratulations': 'Congratulations!',
    'topic.all-sections-done': 'You have successfully completed all theoretical sections.',
    'topic.next-step': 'Proceed to Next Step',
    'topic.additional-resources': 'Additional Resources',
    'topic.section-coming-soon': 'Content for this section will be available soon',
    
    // TopicNavigation Component
    'topic.previous': 'Previous',
    'topic.next': 'Next',
    'topic.all-lessons': 'All Lessons',
    'topic.previous-lesson': 'Previous Lesson',
    'topic.next-lesson': 'Next Lesson',
    
    // About Page
    'about.our-story': 'Our Story',
    'about.mission': 'Our Mission',
    'about.mission-desc': 'Provide quality education for everyone, regardless of location and financial capabilities',
    'about.team': 'Our Team',
    'about.team-desc': 'Experienced professionals and instructors dedicated to student success',
    'about.quality': 'Quality Standards',
    'about.quality-desc': 'Modern methods and international standards in the educational process',
    'about.global': 'Global Accessibility',
    'about.global-desc': 'Multilingual system and accessible platform from any country',
    'about.values': 'Our Values',
    'about.values-desc': 'The principles that guide our work',
    'about.our-instructors': 'Our Instructors',
    'about.instructors-desc': 'Experienced professionals dedicated to your success',
    'about.instructor': 'Instructor',
    'about.experienced-professional': 'Experienced Professional',
    'about.no-instructors': 'No instructors found',
    'about.ready-start': 'Ready to Start?',
    'about.join-community': 'Join our community and start your educational journey',
    'about.description': 'We are dedicated to creating the education of the future by combining modern technology and human experience',
    'about.platform-created': 'The "Education Without Limits" platform was born in 2023 by a group of experienced professionals who believed that quality education should be accessible to everyone.',
    'about.goal': 'Our goal is to create an educational environment where students can grow and achieve their goals, regardless of their location or financial capabilities.',
    'about.excellent-courses': 'Excellent courses and professional support',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.description': 'We are here to help you. Send us your questions, and we will respond soon',
    'contact.students': 'Students',
    'contact.courses': 'Courses',
    'contact.instructors': 'Instructors',
    'contact.info-title': 'Contact Information',
    'contact.info-desc': 'We are always ready to help you. Choose the most convenient way to contact us:',
    'contact.address': 'Address',
    'contact.address-value': 'Yerevan, Mamikonyanc 52',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Working Hours',
    'contact.hours-value': 'Monday - Friday: 9:00 - 18:00',
    'contact.send-message': 'Send Message',
    'contact.name': 'Name',
    'contact.name-placeholder': 'Your name',
    'contact.email-placeholder': 'your@email.com',
    'contact.subject': 'Subject',
    'contact.subject-placeholder': 'Message subject',
    'contact.message': 'Message',
    'contact.message-placeholder': 'Your message...',
    'contact.send': 'Send',
    'contact.message-sent': 'Message sent!',
    'contact.faq': 'Frequently Asked Questions',
    'contact.faq-desc': 'Find answers to the most common questions',
    'contact.how-register': 'How to register?',
    'contact.how-register-answer': 'Click the "Sign Up" button and fill in the required fields',
    'contact.how-choose-course': 'How to choose a course?',
    'contact.how-choose-course-answer': 'Go to the "Courses" section and choose your area of interest',
    'contact.free-courses': 'Are there free courses?',
    'contact.free-courses-answer': 'Yes, we offer a range of free introductory courses',
    'contact.get-certificate': 'How to get a certificate?',
    'contact.get-certificate-answer': 'After successful completion you will receive a digital certificate',
    
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
