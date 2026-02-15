import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Calendar, 
  DollarSign, 
  Building2, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface PartnerCourse {
  id: string;
  title: string;
  description?: string;
  duration_weeks: number;
  price: number;
  max_students?: number;
  current_students: number;
  start_date?: string;
  image_url?: string;
  partner_institutions: {
    institution_name: string;
    logo_url?: string;
  } | null;
}

export default function PrivateCourses() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [institutionFilter, setInstitutionFilter] = useState('all');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['private-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_courses')
        .select(`
          *,
          partner_institutions(institution_name, logo_url)
        `)
        .eq('status', 'published')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PartnerCourse[];
    },
  });

  const { data: institutions } = useQuery({
    queryKey: ['partner-institutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_institutions')
        .select('institution_name')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  // Filter courses based on search and filters
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.partner_institutions?.institution_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && course.price === 0) ||
                        (priceFilter === 'paid' && course.price > 0);

    const matchesDuration = durationFilter === 'all' ||
                           (durationFilter === 'short' && course.duration_weeks <= 4) ||
                           (durationFilter === 'medium' && course.duration_weeks > 4 && course.duration_weeks <= 12) ||
                           (durationFilter === 'long' && course.duration_weeks > 12);

    const matchesInstitution = institutionFilter === 'all' ||
                              course.partner_institutions?.institution_name === institutionFilter;

    return matchesSearch && matchesPrice && matchesDuration && matchesInstitution;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-armenian">Մասնավոր դասընթացներ</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-armenian">
              Մեր գործընկեր ուսումնական հաստատությունների առաջարկած բոլոր մասնավոր դասընթացները
            </p>
          </div>

          {/* Filters Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-armenian">
                <Filter className="h-5 w-5" />
                Ֆիլտրեր և որոնում
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium font-armenian">Որոնել</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Դասընթացի անուն, նկարագրություն..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 font-armenian"
                    />
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium font-armenian">Գին</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Բոլորը</SelectItem>
                      <SelectItem value="free">Անվճար</SelectItem>
                      <SelectItem value="paid">Վճարովի</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium font-armenian">Տևողություն</label>
                  <Select value={durationFilter} onValueChange={setDurationFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Բոլորը</SelectItem>
                      <SelectItem value="short">Կարճ (1-4 շաբաթ)</SelectItem>
                      <SelectItem value="medium">Միջին (5-12 շաբաթ)</SelectItem>
                      <SelectItem value="long">Երկար (12+ շաբաթ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Institution Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium font-armenian">Հաստատություն</label>
                  <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Բոլորը</SelectItem>
                      {institutions?.map((institution) => (
                        <SelectItem key={institution.institution_name} value={institution.institution_name}>
                          {institution.institution_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="mb-6">
            <p className="text-muted-foreground font-armenian">
              Ցուցադրվում են {filteredCourses?.length || 0} դասընթաց {courses?.length || 0}-ից
            </p>
          </div>

          {/* Courses Grid */}
          {!filteredCourses || filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 font-armenian">Դասընթացներ չեն գտնվել</h3>
                <p className="text-muted-foreground font-armenian">
                  Փոխեք ֆիլտրերը կամ որոնման բառերը
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {course.partner_institutions?.logo_url ? (
                          <img 
                            src={course.partner_institutions.logo_url} 
                            alt={course.partner_institutions.institution_name}
                            className="h-8 w-8 object-contain rounded"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-primary" />
                        )}
                        <div className="text-xs text-muted-foreground">
                          {course.partner_institutions?.institution_name}
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        Մասնավոր
                      </Badge>
                    </div>
                    
                    {course.image_url && (
                      <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={course.image_url} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors font-armenian">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 font-armenian">
                        {course.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration_weeks} շաբաթ</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-primary">
                          {course.price === 0 ? 'անվճար' : `${course.price} դրամ`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {course.current_students}/{course.max_students || '∞'}
                        </span>
                      </div>

                      {course.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">
                            {format(new Date(course.start_date), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-armenian"
                      onClick={() => navigate(`/partner-course/${course.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Դիտել մանրամասները
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}