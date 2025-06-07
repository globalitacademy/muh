
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Courses = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Ծրագրավորման հիմունքներ',
      titleEn: 'Programming Fundamentals',
      titleRu: 'Основы программирования',
      description: 'Սովորեք ծրագրավորման հիմքերը JavaScript-ի միջոցով և ստեղծեք ձեր առաջին վեբ ծրագիրը',
      descriptionEn: 'Learn programming fundamentals through JavaScript and create your first web application',
      descriptionRu: 'Изучите основы программирования через JavaScript и создайте свое первое веб-приложение',
      instructor: 'Արամ Գևորգյան',
      instructorEn: 'Aram Gevorgyan',
      instructorRu: 'Арам Геворгян',
      students: 1250,
      lessons: 24,
      duration: '8 շաբաթ',
      durationEn: '8 weeks',
      durationRu: '8 недель',
      level: 'beginner',
      price: '₽15,000',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'React զարգացում',
      titleEn: 'React Development',
      titleRu: 'Разработка на React',
      description: 'Ժամանակակից վեբ ծրագրեր React-ի միջոցով՝ hooks, context և state management-ով',
      descriptionEn: 'Build modern web applications with React using hooks, context and state management',
      descriptionRu: 'Создавайте современные веб-приложения с React используя hooks, context и state management',
      instructor: 'Աննա Հակոբյան',
      instructorEn: 'Anna Hakobyan',
      instructorRu: 'Анна Акопян',
      students: 890,
      lessons: 32,
      duration: '12 շաբաթ',
      durationEn: '12 weeks',
      durationRu: '12 недель',
      level: 'intermediate',
      price: '₽25,000',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Տվյալների գիտություն',
      titleEn: 'Data Science',
      titleRu: 'Наука о данных',
      description: 'Python և machine learning տվյալների վերլուծության և կանխատեսման համար',
      descriptionEn: 'Python and machine learning for data analysis and predictive modeling',
      descriptionRu: 'Python и машинное обучение для анализа данных и предиктивного моделирования',
      instructor: 'Դավիթ Մարտիրոսյան',
      instructorEn: 'David Martirosyan',
      instructorRu: 'Давид Мартиросян',
      students: 654,
      lessons: 40,
      duration: '16 շաբաթ',
      durationEn: '16 weeks',
      durationRu: '16 недель',
      level: 'advanced',
      price: '₽35,000',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: 'UX/UI Դիզայն',
      titleEn: 'UX/UI Design',
      titleRu: 'UX/UI Дизайн',
      description: 'Սովորեք օգտատերերի փորձի և ինտերֆեյսի դիզայնի հիմունքները',
      descriptionEn: 'Learn the fundamentals of user experience and interface design',
      descriptionRu: 'Изучите основы пользовательского опыта и дизайна интерфейсов',
      instructor: 'Լուսինե Ավագյան',
      instructorEn: 'Lusine Avagyan',
      instructorRu: 'Лусине Авагян',
      students: 432,
      lessons: 28,
      duration: '10 շաբաթ',
      durationEn: '10 weeks',
      durationRu: '10 недель',
      level: 'beginner',
      price: '₽20,000',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      title: 'Դարման մեքենայական ուսուցում',
      titleEn: 'Advanced Machine Learning',
      titleRu: 'Продвинутое машинное обучение',
      description: 'Խորացված machine learning ալգորիթմներ և deep learning',
      descriptionEn: 'Advanced machine learning algorithms and deep learning techniques',
      descriptionRu: 'Продвинутые алгоритмы машинного обучения и техники глубокого обучения',
      instructor: 'Վահան Պողոսյան',
      instructorEn: 'Vahan Poghosyan',
      instructorRu: 'Ваган Погосян',
      students: 298,
      lessons: 36,
      duration: '14 շաբաթ',
      durationEn: '14 weeks',
      durationRu: '14 недель',
      level: 'advanced',
      price: '₽40,000',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      title: 'Մոբայլ ծրագրավորում',
      titleEn: 'Mobile Development',
      titleRu: 'Мобильная разработка',
      description: 'React Native-ով iOS և Android հավելվածների ստեղծում',
      descriptionEn: 'Create iOS and Android applications with React Native',
      descriptionRu: 'Создание iOS и Android приложений с React Native',
      instructor: 'Նարեկ Ղուկասյան',
      instructorEn: 'Narek Ghukasyan',
      instructorRu: 'Нарек Гукасян',
      students: 567,
      lessons: 30,
      duration: '11 շաբաթ',
      durationEn: '11 weeks',
      durationRu: '11 недель',
      level: 'intermediate',
      price: '₽28,000',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-success-green';
      case 'intermediate':
        return 'bg-warning-yellow';
      case 'advanced':
        return 'bg-destructive';
      default:
        return 'bg-primary';
    }
  };

  const getCourseTitle = (course: any) => {
    if (language === 'en') return course.titleEn;
    if (language === 'ru') return course.titleRu;
    return course.title;
  };

  const getCourseDescription = (course: any) => {
    if (language === 'en') return course.descriptionEn;
    if (language === 'ru') return course.descriptionRu;
    return course.description;
  };

  const getCourseInstructor = (course: any) => {
    if (language === 'en') return course.instructorEn;
    if (language === 'ru') return course.instructorRu;
    return course.instructor;
  };

  const getCourseDuration = (course: any) => {
    if (language === 'en') return course.durationEn;
    if (language === 'ru') return course.durationRu;
    return course.duration;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = getCourseTitle(course).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getCourseDescription(course).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-armenian">
              {t('courses.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-armenian">
              Ընտրեք ձեր հետաքրքրությունների և աշխատանքային նպատակների համապատասխան դասընթացը
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder={language === 'hy' ? 'Փնտրել դասընթացներ...' : language === 'ru' ? 'Искать курсы...' : 'Search courses...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md"
                >
                  <option value="all">{language === 'hy' ? 'Բոլոր մակարդակները' : language === 'ru' ? 'Все уровни' : 'All Levels'}</option>
                  <option value="beginner">{t('courses.level.beginner')}</option>
                  <option value="intermediate">{t('courses.level.intermediate')}</option>
                  <option value="advanced">{t('courses.level.advanced')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="course-card-hover overflow-hidden border-0 shadow-lg">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={getCourseTitle(course)}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getLevelColor(course.level)} text-white`}>
                      {t(`courses.level.${course.level}`)}
                    </Badge>
                    <span className="text-lg font-bold text-edu-blue">{course.price}</span>
                  </div>
                  <h3 className="text-xl font-semibold font-armenian line-clamp-2">
                    {getCourseTitle(course)}
                  </h3>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 font-armenian line-clamp-3">
                    {getCourseDescription(course)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 font-armenian">
                    {language === 'hy' ? 'Դասախոս՝' : language === 'ru' ? 'Преподаватель:' : 'Instructor:'} {getCourseInstructor(course)}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students} {t('courses.students')}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.lessons} {t('courses.lessons')}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {language === 'hy' ? 'Տևողություն՝' : language === 'ru' ? 'Продолжительность:' : 'Duration:'} {getCourseDuration(course)}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link to={`/course/${course.id}`} className="w-full">
                    <Button className="w-full bg-edu-blue hover:bg-edu-dark-blue">
                      {t('hero.learn-more')}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground font-armenian">
                {language === 'hy' ? 'Դասընթացներ չեն գտնվել' : language === 'ru' ? 'Курсы не найдены' : 'No courses found'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
