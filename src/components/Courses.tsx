
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const Courses = () => {
  const { t } = useLanguage();

  const courses = [
    {
      id: 1,
      title: 'Ծրագրավորման հիմունքներ',
      titleEn: 'Programming Fundamentals',
      titleRu: 'Основы программирования',
      description: 'Սովորեք ծրագրավորման հիմքերը JavaScript-ի միջոցով',
      descriptionEn: 'Learn programming fundamentals through JavaScript',
      descriptionRu: 'Изучите основы программирования через JavaScript',
      instructor: 'Արամ Գևորգյան',
      instructorEn: 'Aram Gevorgyan',
      instructorRu: 'Арам Геворгян',
      students: 1250,
      lessons: 24,
      level: 'beginner',
      price: '₽15,000',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'React զարգացում',
      titleEn: 'React Development',
      titleRu: 'Разработка на React',
      description: 'Ժամանակակից վեբ ծրագրեր React-ի միջոցով',
      descriptionEn: 'Build modern web applications with React',
      descriptionRu: 'Создавайте современные веб-приложения с React',
      instructor: 'Աննա Հակոբյան',
      instructorEn: 'Anna Hakobyan',
      instructorRu: 'Анна Акопян',
      students: 890,
      lessons: 32,
      level: 'intermediate',
      price: '₽25,000',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Տվյալների գիտություն',
      titleEn: 'Data Science',
      titleRu: 'Наука о данных',
      description: 'Python և machine learning տվյալների վերլուծության համար',
      descriptionEn: 'Python and machine learning for data analysis',
      descriptionRu: 'Python и машинное обучение для анализа данных',
      instructor: 'Դավիթ Մարտիրոսյան',
      instructorEn: 'David Martirosyan',
      instructorRu: 'Давид Мартиросян',
      students: 654,
      lessons: 40,
      level: 'advanced',
      price: '₽35,000',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
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
    const { language } = useLanguage();
    if (language === 'en') return course.titleEn;
    if (language === 'ru') return course.titleRu;
    return course.title;
  };

  const getCourseDescription = (course: any) => {
    const { language } = useLanguage();
    if (language === 'en') return course.descriptionEn;
    if (language === 'ru') return course.descriptionRu;
    return course.description;
  };

  const getCourseInstructor = (course: any) => {
    const { language } = useLanguage();
    if (language === 'en') return course.instructorEn;
    if (language === 'ru') return course.instructorRu;
    return course.instructor;
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-armenian">
            {t('courses.title')}
          </h2>
          <Button variant="outline" className="mt-4">
            {t('courses.view-all')}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {courses.map((course) => (
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
                <p className="text-muted-foreground mb-4 font-armenian line-clamp-2">
                  {getCourseDescription(course)}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {getCourseInstructor(course)}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {course.students} {t('courses.students')}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {course.lessons} {t('courses.lessons')}
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full bg-edu-blue hover:bg-edu-dark-blue">
                  {t('hero.learn-more')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
