
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Users, Star, BookOpen, User } from 'lucide-react';
import { useModule } from '@/hooks/useModules';
import { useTopics } from '@/hooks/useTopics';
import { useEnrollments, useEnrollModule } from '@/hooks/useEnrollments';
import { useAuth } from '@/hooks/useAuth';
import TopicCard from '@/components/TopicCard';
import { Loader2 } from 'lucide-react';

const ModuleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: module, isLoading: moduleLoading } = useModule(id!);
  const { data: topics, isLoading: topicsLoading } = useTopics(id!);
  const { data: enrollments } = useEnrollments();
  const enrollModule = useEnrollModule();

  const isEnrolled = enrollments?.some(e => e.module_id === id);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Սկսնակ';
      case 'intermediate':
        return 'Միջին';
      case 'advanced':
        return 'Բարձր';
      default:
        return level;
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    await enrollModule.mutateAsync(id!);
  };

  if (moduleLoading || topicsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-edu-blue" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-armenian">Դասընթացը չի գտնվել</h2>
          <Button onClick={() => navigate('/')} className="mt-4 font-armenian">
            Վերադառնալ գլխավոր էջ
          </Button>
        </div>
      </div>
    );
  }

  const freeTopics = topics?.filter(t => t.is_free) || [];
  const paidTopics = topics?.filter(t => !t.is_free) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Վերադառնալ գլխավոր էջ
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Module Header */}
            <div className="mb-8">
              {module.image_url && (
                <img
                  src={module.image_url}
                  alt={module.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}
              
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold font-armenian">{module.title}</h1>
                <Badge className={getDifficultyColor(module.difficulty_level)}>
                  {getDifficultyText(module.difficulty_level)}
                </Badge>
              </div>

              <p className="text-lg text-muted-foreground font-armenian mb-6">
                {module.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{module.duration_weeks}</div>
                    <div className="text-sm text-muted-foreground font-armenian">շաբաթ</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{module.total_lessons}</div>
                    <div className="text-sm text-muted-foreground font-armenian">դաս</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{module.students_count}</div>
                    <div className="text-sm text-muted-foreground font-armenian">ուսանող</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <div>
                    <div className="font-semibold">{module.rating?.toFixed(1) || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground font-armenian">գնահատական</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-armenian">Մասնագետ: {module.instructor}</span>
              </div>
            </div>

            {/* Topics */}
            <div className="space-y-6">
              {freeTopics.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold font-armenian mb-4">Անվճար դասեր</h2>
                  <div className="space-y-4">
                    {freeTopics.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        isEnrolled={true}
                        onStart={() => console.log('Start topic:', topic.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {paidTopics.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold font-armenian mb-4">Վճարովի դասեր</h2>
                  <div className="space-y-4">
                    {paidTopics.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        isEnrolled={!!isEnrolled}
                        onStart={() => console.log('Start topic:', topic.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center font-armenian">
                  {isEnrolled ? 'Գրանցված եք' : 'Գրանցվել դասընթացին'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-edu-blue">
                    {module.price.toLocaleString()} ֏
                  </div>
                  <div className="text-sm text-muted-foreground font-armenian">
                    Ամբողջ դասընթացի համար
                  </div>
                </div>

                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-sm font-armenian mb-2">Ձեր առաջընթացը</div>
                      <Progress value={0} className="mb-2" />
                      <div className="text-xs text-muted-foreground">0% ավարտված</div>
                    </div>
                    <Button className="w-full btn-modern font-armenian">
                      Շարունակել ուսումը
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleEnroll}
                    disabled={enrollModule.isPending}
                    className="w-full btn-modern font-armenian"
                  >
                    {enrollModule.isPending ? 'Գրանցվում է...' : 'Գրանցվել հիմա'}
                  </Button>
                )}

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between font-armenian">
                    <span>Վկայագիր:</span>
                    <span>Այո</span>
                  </div>
                  <div className="flex justify-between font-armenian">
                    <span>Մուտք:</span>
                    <span>Մշտապես</span>
                  </div>
                  <div className="flex justify-between font-armenian">
                    <span>Լեզու:</span>
                    <span>Հայերեն</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
