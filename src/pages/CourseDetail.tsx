
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Clock, 
  Users, 
  BookOpen, 
  Star, 
  Play, 
  CheckCircle, 
  Award,
  ArrowLeft,
  Calendar
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock course data - in real app this would come from an API
  const course = {
    id: 1,
    title: 'Ծրագրավորման հիմունքներ',
    titleEn: 'Programming Fundamentals',
    titleRu: 'Основы программирования',
    description: 'Սովորեք ծրագրավորման հիմքերը JavaScript-ի միջոցով և ստեղծեք ձեր առաջին վեբ ծրագիրը',
    descriptionEn: 'Learn programming fundamentals through JavaScript and create your first web application',
    descriptionRu: 'Изучите основы программирования через JavaScript и создайте свое первое веб-приложение',
    fullDescription: 'Այս դասընթացը նախատեսված է սկսնակների համար, ովքեր ցանկանում են սովորել ծրագրավորում։ Դուք կսովորեք JavaScript-ի հիմունքները, տվյալների տիպերը, ֆունկցիաները, օբյեկտները և շատ ավելին։',
    fullDescriptionEn: 'This course is designed for beginners who want to learn programming. You will learn JavaScript fundamentals, data types, functions, objects and much more.',
    fullDescriptionRu: 'Этот курс предназначен для начинающих, которые хотят изучить программирование. Вы изучите основы JavaScript, типы данных, функции, объекты и многое другое.',
    instructor: 'Արամ Գևորգյան',
    instructorEn: 'Aram Gevorgyan',
    instructorRu: 'Арам Геворгян',
    instructorBio: '15 տարվա փորձ ունեցող ծրագրավորող և դասախոս',
    instructorBioEn: 'Programmer and instructor with 15 years of experience',
    instructorBioRu: 'Программист и преподаватель с 15-летним опытом',
    students: 1250,
    lessons: 24,
    duration: '8 շաբաթ',
    durationEn: '8 weeks',
    durationRu: '8 недель',
    level: 'beginner',
    price: '₽15,000',
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
  };

  const curriculum = [
    {
      title: 'Ծանոթություն ծրագրավորման հետ',
      titleEn: 'Introduction to Programming',
      titleRu: 'Введение в программирование',
      lessons: 3,
      duration: '45 րոպե'
    },
    {
      title: 'JavaScript հիմունքներ',
      titleEn: 'JavaScript Fundamentals',
      titleRu: 'Основы JavaScript',
      lessons: 5,
      duration: '2.5 ժամ'
    },
    {
      title: 'Տվյալների տիպեր և փոփոխականներ',
      titleEn: 'Data Types and Variables',
      titleRu: 'Типы данных и переменные',
      lessons: 4,
      duration: '2 ժամ'
    },
    {
      title: 'Ֆունկցիաներ և մեթոդներ',
      titleEn: 'Functions and Methods',
      titleRu: 'Функции и методы',
      lessons: 6,
      duration: '3 ժամ'
    },
    {
      title: 'Օբյեկտներ և մասիվներ',
      titleEn: 'Objects and Arrays',
      titleRu: 'Объекты и массивы',
      lessons: 4,
      duration: '2 ժամ'
    },
    {
      title: 'Վերջնական նախագիծ',
      titleEn: 'Final Project',
      titleRu: 'Финальный проект',
      lessons: 2,
      duration: '1.5 ժամ'
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

  const getCourseTitle = () => {
    if (language === 'en') return course.titleEn;
    if (language === 'ru') return course.titleRu;
    return course.title;
  };

  const getCourseDescription = () => {
    if (language === 'en') return course.descriptionEn;
    if (language === 'ru') return course.descriptionRu;
    return course.description;
  };

  const getFullDescription = () => {
    if (language === 'en') return course.fullDescriptionEn;
    if (language === 'ru') return course.fullDescriptionRu;
    return course.fullDescription;
  };

  const getInstructorName = () => {
    if (language === 'en') return course.instructorEn;
    if (language === 'ru') return course.instructorRu;
    return course.instructor;
  };

  const getInstructorBio = () => {
    if (language === 'en') return course.instructorBioEn;
    if (language === 'ru') return course.instructorBioRu;
    return course.instructorBio;
  };

  const getDuration = () => {
    if (language === 'en') return course.durationEn;
    if (language === 'ru') return course.durationRu;
    return course.duration;
  };

  const tabs = [
    { id: 'overview', label: language === 'hy' ? 'Ակնարկ' : language === 'ru' ? 'Обзор' : 'Overview' },
    { id: 'curriculum', label: language === 'hy' ? 'Ծրագիր' : language === 'ru' ? 'Программа' : 'Curriculum' },
    { id: 'instructor', label: language === 'hy' ? 'Դասախոս' : language === 'ru' ? 'Преподаватель' : 'Instructor' },
    { id: 'reviews', label: language === 'hy' ? 'Գնահատականներ' : language === 'ru' ? 'Отзывы' : 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              to="/courses" 
              className="inline-flex items-center text-edu-blue hover:text-edu-dark-blue font-armenian"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {language === 'hy' ? 'Վերադառնալ դասընթացներին' : language === 'ru' ? 'Вернуться к курсам' : 'Back to Courses'}
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="mb-8">
                <div className="aspect-video rounded-lg overflow-hidden mb-6">
                  <img 
                    src={course.image} 
                    alt={getCourseTitle()}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${getLevelColor(course.level)} text-white`}>
                    {language === 'hy' ? 
                      (course.level === 'beginner' ? 'Սկսնակ' : course.level === 'intermediate' ? 'Միջին' : 'Բարձր') :
                      language === 'ru' ?
                      (course.level === 'beginner' ? 'Начальный' : course.level === 'intermediate' ? 'Средний' : 'Продвинутый') :
                      (course.level === 'beginner' ? 'Beginner' : course.level === 'intermediate' ? 'Intermediate' : 'Advanced')
                    }
                  </Badge>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-muted-foreground ml-1">({course.reviewCount})</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 font-armenian">
                  {getCourseTitle()}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6 font-armenian">
                  {getCourseDescription()}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students} {language === 'hy' ? 'ուսանողներ' : language === 'ru' ? 'студентов' : 'students'}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {course.lessons} {language === 'hy' ? 'դասեր' : language === 'ru' ? 'уроков' : 'lessons'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {getDuration()}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b mb-8">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 border-b-2 font-medium text-sm font-armenian ${
                        activeTab === tab.id
                          ? 'border-edu-blue text-edu-blue'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 font-armenian">
                      {language === 'hy' ? 'Դասընթացի մասին' : language === 'ru' ? 'О курсе' : 'About This Course'}
                    </h3>
                    <p className="text-muted-foreground font-armenian leading-relaxed">
                      {getFullDescription()}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 font-armenian">
                      {language === 'hy' ? 'Ինչ կսովորեք' : language === 'ru' ? 'Что вы изучите' : 'What You Will Learn'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        language === 'hy' ? 'JavaScript հիմունքներ' : language === 'ru' ? 'Основы JavaScript' : 'JavaScript fundamentals',
                        language === 'hy' ? 'Տվյալների տիպեր և փոփոխականներ' : language === 'ru' ? 'Типы данных и переменные' : 'Data types and variables',
                        language === 'hy' ? 'Ֆունկցիաներ և մեթոդներ' : language === 'ru' ? 'Функции и методы' : 'Functions and methods',
                        language === 'hy' ? 'Օբյեկտներ և մասիվներ' : language === 'ru' ? 'Объекты и массивы' : 'Objects and arrays',
                        language === 'hy' ? 'DOM manipulation' : language === 'ru' ? 'Работа с DOM' : 'DOM manipulation',
                        language === 'hy' ? 'Վերջնական նախագիծ' : language === 'ru' ? 'Финальный проект' : 'Final project'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-success-green mr-2 flex-shrink-0" />
                          <span className="font-armenian">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="space-y-4">
                  {curriculum.map((module, index) => (
                    <Card key={index} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-armenian">
                            {language === 'hy' ? module.title : language === 'ru' ? module.titleRu : module.titleEn}
                          </CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {module.lessons} {language === 'hy' ? 'դասեր' : language === 'ru' ? 'уроков' : 'lessons'}
                            <Clock className="w-4 h-4 ml-3 mr-1" />
                            {module.duration}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'instructor' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-full bg-edu-blue text-white flex items-center justify-center text-2xl font-bold">
                        {getInstructorName().charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold font-armenian">{getInstructorName()}</h3>
                        <p className="text-muted-foreground mb-4 font-armenian">{getInstructorBio()}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-lg">15+</div>
                            <div className="text-muted-foreground font-armenian">
                              {language === 'hy' ? 'տարի փորձ' : language === 'ru' ? 'лет опыта' : 'years experience'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-lg">5000+</div>
                            <div className="text-muted-foreground font-armenian">
                              {language === 'hy' ? 'ուսանողներ' : language === 'ru' ? 'студентов' : 'students'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-lg">4.9</div>
                            <div className="text-muted-foreground font-armenian">
                              {language === 'hy' ? 'գնահատական' : language === 'ru' ? 'рейтинг' : 'rating'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-lg">12</div>
                            <div className="text-muted-foreground font-armenian">
                              {language === 'hy' ? 'դասընթացներ' : language === 'ru' ? 'курсов' : 'courses'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{course.rating}</div>
                    <div className="flex justify-center items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= Math.floor(course.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-muted-foreground font-armenian">
                      {course.reviewCount} {language === 'hy' ? 'գնահատականներ' : language === 'ru' ? 'отзывов' : 'reviews'}
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-muted-foreground font-armenian">
                      {language === 'hy' ? 'Գնահատականները բեռնվում են...' : language === 'ru' ? 'Отзывы загружаются...' : 'Reviews are loading...'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-edu-blue mb-2">{course.price}</div>
                    <p className="text-muted-foreground font-armenian">
                      {language === 'hy' ? 'Միանգամյա վճարում' : language === 'ru' ? 'Единоразовая оплата' : 'One-time payment'}
                    </p>
                  </div>

                  <Button className="w-full bg-edu-blue hover:bg-edu-dark-blue text-lg py-3 mb-4 font-armenian">
                    <Play className="w-5 h-5 mr-2" />
                    {language === 'hy' ? 'Սկսել դասընթացը' : language === 'ru' ? 'Начать курс' : 'Start Course'}
                  </Button>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-armenian">
                        {language === 'hy' ? 'Ուսանողներ' : language === 'ru' ? 'Студенты' : 'Students'}
                      </span>
                      <span className="font-semibold">{course.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-armenian">
                        {language === 'hy' ? 'Դասեր' : language === 'ru' ? 'Уроки' : 'Lessons'}
                      </span>
                      <span className="font-semibold">{course.lessons}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-armenian">
                        {language === 'hy' ? 'Տևողություն' : language === 'ru' ? 'Продолжительность' : 'Duration'}
                      </span>
                      <span className="font-semibold">{getDuration()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-armenian">
                        {language === 'hy' ? 'Մակարդակ' : language === 'ru' ? 'Уровень' : 'Level'}
                      </span>
                      <span className="font-semibold font-armenian">
                        {language === 'hy' ? 
                          (course.level === 'beginner' ? 'Սկսնակ' : course.level === 'intermediate' ? 'Միջին' : 'Բարձր') :
                          language === 'ru' ?
                          (course.level === 'beginner' ? 'Начальный' : course.level === 'intermediate' ? 'Средний' : 'Продвинутый') :
                          (course.level === 'beginner' ? 'Beginner' : course.level === 'intermediate' ? 'Intermediate' : 'Advanced')
                        }
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t">
                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        <span className="font-armenian">
                          {language === 'hy' ? 'Վկայական' : language === 'ru' ? 'Сертификат' : 'Certificate'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="font-armenian">
                          {language === 'hy' ? 'Անսահման մուտք' : language === 'ru' ? 'Неограниченный доступ' : 'Lifetime access'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
