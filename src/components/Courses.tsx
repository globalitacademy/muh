
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, Users, Clock, Star, Play, BookOpen } from 'lucide-react';

const Courses = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      duration: '8 շաբաթ',
      level: 'beginner',
      rating: 4.8,
      price: '₽15,000',
      category: 'programming',
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
      duration: '12 շաբաթ',
      level: 'intermediate',
      rating: 4.9,
      price: '₽25,000',
      category: 'programming',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Տվյալների գիտություն',
      titleEn: 'Data Science',
      titleRu: 'Наука о данных',
      description: 'Python և machine learning տվյալների վերլուծության համար',
      descriptionEn: 'Python and machine learning for data analysis',
      descriptionRu: 'Python և машинное обучение для анализа данных',
      instructor: 'Դավիթ Մարտիրոսյան',
      instructorEn: 'David Martirosyan',
      instructorRu: 'Давид Мартиросян',
      students: 654,
      lessons: 40,
      duration: '16 շաբաթ',
      level: 'advanced',
      rating: 4.7,
      price: '₽35,000',
      category: 'data-science',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: 'Ցանցային անվտանգություն',
      titleEn: 'Cybersecurity',
      titleRu: 'Кибербезопасность',
      description: 'Տեղեկատվական անվտանգության հիմունքներ և գործնական հմտություններ',
      descriptionEn: 'Information security fundamentals and practical skills',
      descriptionRu: 'Основы информационной безопасности և практические навыки',
      instructor: 'Նարեկ Ավագյան',
      instructorEn: 'Narek Avagyan',
      instructorRu: 'Нарек Авагян',
      students: 432,
      lessons: 28,
      duration: '10 շաբաթ',
      level: 'intermediate',
      rating: 4.6,
      price: '₽30,000',
      category: 'security',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop'
    }
  ];

  const categories = [
    { key: 'all', label: 'Բոլորը' },
    { key: 'programming', label: 'Ծրագրավորում' },
    { key: 'data-science', label: 'Տվյալների գիտություն' },
    { key: 'security', label: 'Անվտանգություն' }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'from-green-500 to-emerald-600';
      case 'intermediate':
        return 'from-yellow-500 to-orange-600';
      case 'advanced':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-blue-500 to-purple-600';
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = getCourseTitle(course).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getCourseDescription(course).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium font-armenian">Դասընթացներ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-armenian text-gradient">
            {t('courses.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian">
            Բարձրորակ դասընթացներ տարբեր բնագավառներում
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Փնտրել դասընթացներ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 rounded-xl border-0 shadow-lg bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.key)}
                className={`rounded-xl font-armenian ${
                  selectedCategory === category.key 
                    ? 'btn-modern text-white' 
                    : 'bg-white shadow-md hover:shadow-lg'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="modern-card course-card-hover overflow-hidden border-0 shadow-lg group">
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={course.image} 
                  alt={getCourseTitle(course)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`bg-gradient-to-r ${getLevelColor(course.level)} text-white border-0 shadow-lg`}>
                    {t(`courses.level.${course.level}`)}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-sm font-bold">
                    {course.price}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button className="btn-modern text-white rounded-full p-3">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{course.duration}</span>
                </div>
                <h3 className="text-xl font-semibold font-armenian line-clamp-2 group-hover:text-edu-blue transition-colors">
                  {getCourseTitle(course)}
                </h3>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 font-armenian line-clamp-2 leading-relaxed">
                  {getCourseDescription(course)}
                </p>
                <p className="text-sm font-medium text-edu-blue mb-4">
                  {getCourseInstructor(course)}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.lessons} դաս
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button className="w-full btn-modern text-white rounded-xl group">
                  <span className="flex items-center gap-2">
                    {t('hero.learn-more')}
                    <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-armenian">Դասընթացներ չեն գտնվել</h3>
            <p className="text-muted-foreground font-armenian">
              Փորձեք փոխել որոնման կամ ֆիլտրի պարամետրերը
            </p>
          </div>
        )}

        <div className="text-center mt-16">
          <Button variant="outline" className="px-8 py-3 rounded-xl font-armenian border-2 border-edu-blue text-edu-blue hover:bg-edu-blue hover:text-white transition-all duration-300">
            {t('courses.view-all')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
